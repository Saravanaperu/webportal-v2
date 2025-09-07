import apiClient from './api';

export const startStrategy = async (strategy) => {
  try {
    const response = await apiClient.post('/strategy/start', { strategy });
    return response.data;
  } catch (error) {
    console.error('Error starting strategy:', error);
    throw error;
  }
};

export const stopStrategy = async () => {
  try {
    const response = await apiClient.post('/strategy/stop');
    return response.data;
  } catch (error) {
    console.error('Error stopping strategy:', error);
    throw error;
  }
};
