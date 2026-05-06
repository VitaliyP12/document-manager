import api from './client';

export const search = (params) => api.get('/search', { params });
export const getStats = () => api.get('/search/stats');