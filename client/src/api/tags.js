import api from './client';

export const getTags = () => api.get('/tags');
export const createTag = (data) => api.post('/tags', data);
export const updateTag = (id, data) => api.put(`/tags/${id}`, data);
export const deleteTag = (id) => api.delete(`/tags/${id}`);
export const addTagToDocument = (documentId, tagId) =>
  api.post(`/tags/document/${documentId}/tag/${tagId}`);
export const removeTagFromDocument = (documentId, tagId) =>
  api.delete(`/tags/document/${documentId}/tag/${tagId}`);