import api from './api';

export const escalationService = {
  createEscalation: async (escalationData) => {
    const response = await api.post('/escalations', escalationData);
    return response.data;
  },

  getMyEscalations: async () => {
    const response = await api.get('/escalations/my');
    return response.data;
  },

  getAllEscalations: async () => {
    const response = await api.get('/escalations');
    return response.data;
  },

  updateStatus: async (id, status, officerNotes) => {
    const response = await api.patch(`/escalations/${id}`, { status, officerNotes });
    return response.data;
  },
};
