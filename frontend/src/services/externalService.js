import api from './api';

export const externalService = {
  // Get IMD weather forecast & spray advisories
  getWeather: async (district) => {
    const response = await api.get('/external/weather', {
      params: { district },
    });
    return response.data;
  },

  // Get Agmarknet daily mandi commodity modal rates
  getMarketPrices: async (market) => {
    const response = await api.get('/external/market-prices', {
      params: { market },
    });
    return response.data;
  },
};
