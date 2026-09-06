import api from './api';

export const memoryService = {
  // Get chronological timeline events for a plot
  getTimeline: async (cropId) => {
    const response = await api.get(`/memory/${cropId}/timeline`);
    return response.data;
  },

  // Log an agricultural event to the immutable memory ledger
  logEvent: async (cropId, eventData) => {
    const response = await api.post(`/memory/${cropId}/log`, eventData);
    return response.data;
  },
};
