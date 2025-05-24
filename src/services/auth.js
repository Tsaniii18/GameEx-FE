import api from './api';

const register = (data) => api.post('/auth/register', data);
const login = (data) => api.post('/auth/login', data);
const logout = () => api.post('/auth/logout');
const refreshToken = () => api.post('/auth/refresh');

export default {
  register,
  login,
  logout,
  refreshToken
};