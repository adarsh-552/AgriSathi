import api from './api';

export const diagnosticService = {
  // Evaluate crop problem with deterministic IPM safety gate
  evaluateProblem: async (cropId, problemData) => {
    const response = await api.post('/problems/evaluate', problemData, {
      params: { cropId },
    });
    return response.data;
  },
};
