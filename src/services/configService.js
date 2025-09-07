import apiClient from './api';

export const getConfig = async () => {
  try {
    const response = await apiClient.get('/config');
    return response.data;
  } catch (error) {
    console.error('Error fetching config:', error);
    throw error;
  }
};

export const updateConfig = async (config) => {
  try {
    const response = await apiClient.put('/config', config);
    return response.data;
  } catch (error) {
    console.error('Error updating config:', error);
    throw error;
  }
};
