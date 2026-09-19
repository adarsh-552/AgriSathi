import api from './api';

export const schemesService = {
  getSchemes: async (state = null) => {
    const params = {};
    if (state) params.state = state;
    const response = await api.get('/schemes', { params });
    return response.data;
  },

  getSchemeById: async (id) => {
    const response = await api.get(`/schemes/${id}`);
    return response.data;
  },
};
