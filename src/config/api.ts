export const API_BASE_URL = 'http://localhost:5000/api';

export const API_ENDPOINTS = {
  auth: {
    login: '/auth/login',
    register: '/auth/register'
  },
  operations: {
    list: '/operations',
    create: '/operations',
    updateStatus: (id: string) => `/operations/${id}/status`
  }
};