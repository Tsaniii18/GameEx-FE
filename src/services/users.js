import api from './api';

const getProfile = () => api.get('/users/profile');
const updateProfile = (data) => api.put('/users/profile', data);
const deleteAccount = () => api.delete('/users/account');
const getLibrary = () => api.get('/users/my-games');
const updateGameStatus = (gameId, data) => 
  api.patch(`/users/library/${gameId}`, data);
const deleteFromLibrary = (gameId) => 
  api.delete(`/users/library/${gameId}`);
const getPurchaseHistory = () => api.get('/users/history');

export default {
  getProfile,
  updateProfile,
  deleteAccount,
  getLibrary,
  updateGameStatus,
  deleteFromLibrary,
  getPurchaseHistory
};