import api from './axios';

export const getAllGames = () => api.get('/games');
export const getGameDetail = (id) => api.get(`/games/${id}`);
export const createGame = (gameData) => api.post('/games', gameData);
export const updateGame = (id, gameData) => api.put(`/games/${id}`, gameData);
export const applyDiscount = (id, {discount}) => api.patch(`/games/${id}/discount`, { discount });
export const getSalesHistory = (id) => api.get(`/games/${id}/sales`);
export const deleteGame = (id) => api.delete(`/games/${id}`);