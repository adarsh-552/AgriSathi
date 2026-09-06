import api from './api';

export const diagnosticService = {
  // Evaluate crop problem with deterministic IPM safety gate
  evaluateProblem: async (cropId, problemData) => {
    const payload = {
      farmerCropId: cropId,
      ...problemData,
    };
    const response = await api.post('/problems/evaluate', payload, {
      params: { cropId },
    });
    return response.data;
  },
};
