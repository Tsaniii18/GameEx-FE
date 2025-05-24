import api from './api';

const getAll = () => api.get('/games');
const getDetail = (id) => api.get(`/games/${id}`);
const buyGame = (gameId) => api.post('/users/buy', { gameId });
const uploadGame = (data) => api.post('/games', data);
const updateGame = (id, data) => api.put(`/games/${id}`, data);
const applyDiscount = (id, discount) => api.patch(`/games/${id}/discount`, { discount });

export default {
  getAll,
  getDetail,
  buyGame,
  uploadGame,
  updateGame,
  applyDiscount
};