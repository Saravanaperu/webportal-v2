// MOCK IMPLEMENTATION of Angel One Service
// In a real application, this service would use the 'smartapi-javascript' library
// to interact with the Angel One SmartAPI.

let isConnected = false;

export const connectToBroker = async (apiKey, clientCode, password, totp) => {
  // Mock connecting to the broker
  console.log('Attempting to connect to Angel One broker...');
  if (apiKey && clientCode && password && totp) {
    isConnected = true;
    console.log('Successfully connected to Angel One.');
    return { success: true, message: 'Connected successfully' };
  } else {
    isConnected = false;
    console.log('Failed to connect to Angel One: Missing credentials.');
    throw new Error('Missing credentials');
  }
};

export const getBrokerStatus = async () => {
  return { isConnected };
};

export const getPositions = async () => {
  if (!isConnected) throw new Error('Not connected to broker');
  // Mock positions data
  return [
    { symbol: 'SBIN-EQ', qty: 10, avgPrice: 500.50 },
    { symbol: 'RELIANCE-EQ', qty: 5, avgPrice: 2500.00 },
  ];
};

export const getMargins = async () => {
  if (!isConnected) throw new Error('Not connected to broker');
  // Mock margin data
  return {
    available_margin: 100000,
    used_margin: 50000,
  };
};
