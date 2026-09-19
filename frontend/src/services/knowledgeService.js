import api from './api';

export const knowledgeService = {
  getKnowledge: async (search = null) => {
    const params = {};
    if (search) params.search = search;
    const response = await api.get('/knowledge', { params });
    return response.data;
  },

  getKnowledgeById: async (id) => {
    const response = await api.get(`/knowledge/${id}`);
    return response.data;
  },
};
