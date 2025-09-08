import { SmartAPI } from 'smartapi-javascript';
import dotenv from 'dotenv';
import prisma from '../prisma/client.js';

dotenv.config();

let io = null;
let smartApiInstance = null;
let sessionData = null;

export const init = (socketIoInstance) => {
  io = socketIoInstance;
};

// ... (connectToBroker, getBrokerStatus, getPositions, getMargins, getSessionData remain the same)
export const connectToBroker = async () => {
    if (smartApiInstance && sessionData) { return { success: true, message: 'Already connected', data: sessionData }; }
    const apiKey = process.env.ANGEL_API_KEY;
    const clientCode = process.env.ANGEL_CLIENT_CODE;
    const password = process.env.ANGEL_PASSWORD;
    const totp = process.env.ANGEL_TOTP;
    if (!apiKey || !clientCode || !password || !totp) { throw new Error('Missing Angel One credentials in .env file'); }
    const smart_api = new SmartAPI({ api_key: apiKey });
    try {
      const data = await smart_api.generateSession(clientCode, password, totp);
      smartApiInstance = smart_api;
      sessionData = data.data;
      console.log('Successfully connected to Angel One.');
      return { success: true, message: 'Connected successfully', data: sessionData };
    } catch (error) {
      console.error('Error connecting to Angel One:', error);
      throw new Error('Failed to connect to Angel One');
    }
};
export const getBrokerStatus = async () => { return { isConnected: !!smartApiInstance }; };
export const getPositions = async () => { if (!smartApiInstance) throw new Error('Not connected to broker'); try { return await smartApiInstance.getPosition(); } catch (error) { console.error('Error fetching positions:', error); throw new Error('Failed to fetch positions'); } };
export const getMargins = async () => { if (!smartApiInstance) throw new Error('Not connected to broker'); try { return await smartApiInstance.getRMS(); } catch (error) { console.error('Error fetching margins:', error); throw new Error('Failed to fetch margins'); } };
export const getSessionData = () => { return sessionData; };


export const placeOrder = async (orderDetails) => {
  if (!smartApiInstance) throw new Error('Not connected to broker');
  let newOrder;
  try {
    const newTrade = await prisma.trade.create({
      data: {
        symbol: orderDetails.tradingsymbol,
        entry: orderDetails.price,
        sl: orderDetails.stoploss || 0,
        target: orderDetails.target || 0,
        risk: (orderDetails.price - (orderDetails.stoploss || 0)),
        status: 'Open',
        orders: { create: { symbol: orderDetails.tradingsymbol, action: orderDetails.transactiontype, status: 'PENDING' } },
      },
      include: { orders: true },
    });
    newOrder = newTrade.orders[0];
  } catch (dbError) {
    console.error('Error creating order in DB:', dbError);
    throw new Error('Failed to create order in local database');
  }
  try {
    const orderResponse = await smartApiInstance.placeOrder(orderDetails);
    console.log('Order placed successfully with broker:', orderResponse);
    if (orderResponse.status && orderResponse.data && orderResponse.data.orderid) {
        await prisma.order.update({ where: { id: newOrder.id }, data: { brokerOrderId: orderResponse.data.orderid } });
    }
    return newTrade;
  } catch (brokerError) {
    await prisma.trade.update({ where: { id: newOrder.tradeId }, data: { status: 'FAILED' } });
    await prisma.order.update({ where: { id: newOrder.id }, data: { status: 'FAILED' } });
    console.error('Error placing order with broker:', brokerError);
    throw new Error('Failed to place order with broker');
  }
};

export const closeTrade = async (tradeId, exitPrice) => {
    if (!smartApiInstance) throw new Error('Not connected to broker');
    const trade = await prisma.trade.findUnique({ where: { id: tradeId } });
    if (!trade) throw new Error('Trade not found in DB');
    if (trade.status === 'Closed') return trade;
    const pnl = exitPrice - trade.entry;
    console.log(`--- CLOSING TRADE ${tradeId} for PNL: ${pnl} ---`);
    const closedTrade = await prisma.trade.update({ where: { id: tradeId }, data: { status: 'Closed', pnl: pnl } });
    const allTrades = await prisma.trade.findMany({ include: { orders: true } });
    io.to('trades').emit('trades:update', allTrades);
    return closedTrade;
};

export const cancelOrder = async (orderId) => {
    if (!smartApiInstance) throw new Error('Not connected to broker');

    const order = await prisma.order.findUnique({ where: { id: orderId } });
    if (!order) throw new Error('Order not found in DB');
    if (!order.brokerOrderId) throw new Error('Cannot cancel order without broker ID');

    console.log(`--- CANCELLING ORDER ${orderId} (${order.brokerOrderId}) ---`);

    try {
      const cancelResponse = await smartApiInstance.cancelOrder({
          variety: 'NORMAL', // This might need to be configured
          orderid: order.brokerOrderId,
      });
      console.log('Order cancelled successfully with broker:', cancelResponse);

      const cancelledOrder = await prisma.order.update({
          where: { id: orderId },
          data: { status: 'CANCELLED' },
      });

      return cancelledOrder;
    } catch (brokerError) {
      console.error('Error cancelling order with broker:', brokerError);
      throw new Error('Failed to cancel order with broker');
    }
};
