import api from './api';

export const alertsService = {
  getAlerts: async () => {
    const response = await api.get('/alerts');
    return response.data;
  },
};
