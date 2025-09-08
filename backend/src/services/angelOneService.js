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

export const connectToBroker = async () => {
  if (smartApiInstance && sessionData) {
    return { success: true, message: 'Already connected', data: sessionData };
  }
  const apiKey = process.env.ANGEL_API_KEY;
  const clientCode = process.env.ANGEL_CLIENT_CODE;
  const password = process.env.ANGEL_PASSWORD;
  const totp = process.env.ANGEL_TOTP;
  if (!apiKey || !clientCode || !password || !totp) {
    throw new Error('Missing Angel One credentials in .env file');
  }
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

export const getBrokerStatus = async () => {
  return { isConnected: !!smartApiInstance };
};

export const getPositions = async () => {
  if (!smartApiInstance) throw new Error('Not connected to broker');
  try {
    return await smartApiInstance.getPosition();
  } catch (error) {
    console.error('Error fetching positions:', error);
    throw new Error('Failed to fetch positions');
  }
};

export const getMargins = async () => {
  if (!smartApiInstance) throw new Error('Not connected to broker');
  try {
    return await smartApiInstance.getRMS();
  } catch (error) {
    console.error('Error fetching margins:', error);
    throw new Error('Failed to fetch margins');
  }
};

export const getSessionData = () => {
  return sessionData;
};

export const placeOrder = async (orderDetails) => {
    if (!smartApiInstance) throw new Error('Not connected to broker');

    // 1. Create a placeholder trade and order in our DB first.
    let newOrder;
    try {
      const newTrade = await prisma.trade.create({
        data: {
          symbol: orderDetails.tradingsymbol,
          entry: orderDetails.price,
          sl: orderDetails.stoploss || 0,
          target: orderDetails.target || 0,
          status: 'Open',
          orders: {
            create: {
              symbol: orderDetails.tradingsymbol,
              action: orderDetails.transactiontype,
              status: 'PENDING', // Initially pending
            },
          },
        },
        include: { orders: true },
      });
      newOrder = newTrade.orders[0];
    } catch (dbError) {
      console.error('Error creating order in DB:', dbError);
      throw new Error('Failed to create order in local database');
    }

    // 2. Place the real order with the broker.
    console.log('--- PLACING LIVE ORDER ---', orderDetails);
    try {
      const orderResponse = await smartApiInstance.placeOrder(orderDetails);
      console.log('Order placed successfully with broker:', orderResponse);

      // 3. Update our local order with the ID from the broker.
      if (orderResponse.status && orderResponse.data && orderResponse.data.orderid) {
          await prisma.order.update({
              where: { id: newOrder.id },
              data: { brokerOrderId: orderResponse.data.orderid }
          });
      }

      return orderResponse;
    } catch (brokerError) {
      // If the broker order fails, update our local order status to 'FAILED'.
      await prisma.order.update({
          where: { id: newOrder.id },
          data: { status: 'FAILED' }
      });
      console.error('Error placing order with broker:', brokerError);
      throw new Error('Failed to place order with broker');
    }
  };
