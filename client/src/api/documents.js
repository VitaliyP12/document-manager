import api from './client';

export const getDocuments = () => api.get('/documents');
export const getDocument = (id) => api.get(`/documents/${id}`);
export const createDocument = (formData) =>
  api.post('/documents', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
export const updateDocument = (id, data) => api.put(`/documents/${id}`, data);
export const deleteDocument = (id) => api.delete(`/documents/${id}`);