import apiClient from './api';

export const getStatsSummary = async (scope) => {
  try {
    const response = await apiClient.get(`/stats/summary?scope=${scope}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching ${scope} stats summary:`, error);
    throw error;
  }
};
