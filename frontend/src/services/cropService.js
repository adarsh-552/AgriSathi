import api from './api';

export const cropService = {
  // Get all supported crops catalog
  getCatalog: async () => {
    const response = await api.get('/crops/catalog');
    return response.data;
  },

  // Start a new crop journey for a farmer plot
  createFarmerCrop: async (data) => {
    const response = await api.post('/crops/farmer-crops', data);
    return response.data;
  },

  // Get active dashboard for a farmer crop plot
  getDashboard: async (cropId) => {
    const response = await api.get('/crops/dashboard', {
      params: { cropId },
    });
    return response.data;
  },

  // Confirm a stage milestone
  confirmMilestone: async (cropId, milestoneCode) => {
    const response = await api.post(`/crops/${cropId}/milestone`, { milestoneCode });
    return response.data;
  },
};
