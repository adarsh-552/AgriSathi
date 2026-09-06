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
  getMarketPrices: async (marketOrDistrict) => {
    const response = await api.get('/external/market-prices', {
      params: {
        district: marketOrDistrict,
        market: marketOrDistrict,
      },
    });
    return response.data;
  },
};
