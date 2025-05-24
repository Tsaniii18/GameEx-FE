import api from '../services/api';
import auth from '../services/auth';
import { jwtDecode } from 'jwt-decode';

export const setupInterceptors = (store) => {
  api.interceptors.request.use(async (config) => {
    const accessToken = document.cookie
      .split('; ')
      .find(row => row.startsWith('accessToken='))
      ?.split('=')[1];

    if (accessToken) {
      const decoded = jwtDecode(accessToken);
      if (decoded.exp * 1000 < Date.now()) {
        await auth.refreshToken();
      }
    }
    return config;
  });

  api.interceptors.response.use(
    response => response,
    async (error) => {
      const originalRequest = error.config;
      
      if (error.response.status === 401 && !originalRequest._retry) {
        originalRequest._retry = true;
        try {
          await auth.refreshToken();
          return api(originalRequest);
        } catch (refreshError) {
          localStorage.removeItem('refreshToken');
          localStorage.removeItem('user');
          window.location.href = '/login';
          return Promise.reject(refreshError);
        }
      }
      return Promise.reject(error);
    }
  );
};