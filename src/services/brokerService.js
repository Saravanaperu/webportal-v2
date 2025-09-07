import apiClient from './api';

export const getPositions = async () => {
  try {
    const response = await apiClient.get('/broker/positions');
    return response.data;
  } catch (error) {
    console.error('Error fetching positions:', error);
    // In a real app, you'd want to handle this error more gracefully
    // (e.g., show a notification to the user).
    throw error;
  }
};
