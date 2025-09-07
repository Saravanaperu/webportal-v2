import { SmartAPI } from 'smartapi-javascript';
import dotenv from 'dotenv';
import prisma from '../prisma/client.js';

dotenv.config();

let io = null; // To hold the socket.io instance
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

const simulateOrderExecution = async (orderId) => {
  setTimeout(async () => {
    try {
      console.log(`Simulating execution for order: ${orderId}`);
      const executedOrder = await prisma.order.update({
        where: { id: orderId },
        data: { status: 'EXECUTED' },
      });
      io.to('orders').emit('orders:execution', executedOrder);

      const allTrades = await prisma.trade.findMany({ include: { orders: true } });
      io.to('trades').emit('trades:update', allTrades);
    } catch (error) {
      console.error("Error in simulated execution:", error);
    }
  }, 2000); // 2-second delay
};

export const placeOrder = async (orderDetails) => {
  if (!smartApiInstance) throw new Error('Not connected to broker');

  console.log('--- PLACING ORDER (DB & SIMULATION) ---', orderDetails);

  try {
    // This is a simplified DB interaction. A real app might handle this differently.
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
            status: 'PENDING',
          },
        },
      },
      include: { orders: true },
    });

    const newOrder = newTrade.orders[0];
    console.log('Order placed in DB, simulating execution...');
    simulateOrderExecution(newOrder.id);

    return { success: true, orderid: newOrder.id };
  } catch (error) {
    console.error('Error placing order in DB:', error);
    throw new Error('Failed to place order');
  }
};
