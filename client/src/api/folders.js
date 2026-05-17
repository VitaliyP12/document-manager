import api from './client';

export const getFolders = () => api.get('/folders');
export const getFolder = (id) => api.get(`/folders/${id}`);
export const createFolder = (data) => api.post('/folders', data);
export const updateFolder = (id, data) => api.put(`/folders/${id}`, data);
export const deleteFolder = (id) => api.delete(`/folders/${id}`);
export const moveDocument = (documentId, folder_id) =>
  api.put(`/folders/document/${documentId}/move`, { folder_id });