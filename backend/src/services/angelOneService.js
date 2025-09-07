import { SmartAPI } from 'smartapi-javascript';
import dotenv from 'dotenv';

dotenv.config();

let smartApiInstance = null;
let sessionData = null;

export const connectToBroker = async () => {
  if (smartApiInstance && sessionData) {
    console.log('Already connected to Angel One.');
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
    sessionData = data.data; // The actual session data is in the 'data' property
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
    const positions = await smartApiInstance.getPosition();
    return positions;
  } catch (error) {
    console.error('Error fetching positions:', error);
    throw new Error('Failed to fetch positions');
  }
};

export const getMargins = async () => {
  if (!smartApiInstance) throw new Error('Not connected to broker');
  try {
    const margins = await smartApiInstance.getRMS();
    return margins;
  } catch (error) {
    console.error('Error fetching margins:', error);
    throw new Error('Failed to fetch margins');
  }
};

export const getSessionData = () => {
  return sessionData;
};
