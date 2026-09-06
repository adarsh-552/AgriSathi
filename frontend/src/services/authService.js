import api from './api';

export const authService = {
  // Mobile or Email OTP request
  requestOtp: async (identifier) => {
    const payload = identifier.includes('@')
      ? { email: identifier, identifier }
      : { mobileNumber: identifier, identifier };
    const response = await api.post('/auth/otp/request', payload);
    return response.data;
  },

  // Verify OTP and obtain JWT
  verifyOtp: async (identifier, otp) => {
    const response = await api.post('/auth/otp/verify', { identifier, otp });
    return response.data;
  },

  // Admin login using email and password
  adminLogin: async (email, password) => {
    const response = await api.post('/auth/admin/login', { email, password });
    return response.data;
  },
};
