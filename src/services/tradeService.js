import apiClient from './api';

export const getTrades = async () => {
  try {
    const response = await apiClient.get('/trades');
    return response.data;
  } catch (error) {
    console.error('Error fetching trades:', error);
    throw error;
  }
};

export const getOrderLogs = async () => {
  try {
    const response = await apiClient.get('/orders/logs');
    return response.data;
  } catch (error) {
    console.error('Error fetching order logs:', error);
    throw error;
  }
};

export const cancelOrder = async (orderId) => {
    try {
      const response = await apiClient.post(`/orders/cancel/${orderId}`);
      return response.data;
    } catch (error) {
      console.error('Error cancelling order:', error);
      throw error;
    }
};
