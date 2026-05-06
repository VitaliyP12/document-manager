import { create } from 'zustand';
import * as docsApi from '../api/documents';
import * as tagsApi from '../api/tags';

export const useDocStore = create((set, get) => ({
  documents: [],
  tags: [],
  loading: false,
  error: null,

  fetchDocuments: async () => {
    set({ loading: true, error: null });
    try {
      const { data } = await docsApi.getDocuments();
      set({ documents: data, loading: false });
    } catch (err) {
      set({ error: err.response?.data?.message, loading: false });
    }
  },

  fetchTags: async () => {
    try {
      const { data } = await tagsApi.getTags();
      set({ tags: data });
    } catch {}
  },

  createDocument: async (formData) => {
    try {
      const { data } = await docsApi.createDocument(formData);
      await get().fetchDocuments();
      return data;
    } catch (err) {
      throw err.response?.data?.message || 'Помилка створення';
    }
  },

  updateDocument: async (id, payload) => {
    try {
      await docsApi.updateDocument(id, payload);
      await get().fetchDocuments();
    } catch (err) {
      throw err.response?.data?.message || 'Помилка оновлення';
    }
  },

  deleteDocument: async (id) => {
    try {
      await docsApi.deleteDocument(id);
      set((s) => ({ documents: s.documents.filter((d) => d.id !== id) }));
    } catch (err) {
      throw err.response?.data?.message || 'Помилка видалення';
    }
  },

  createTag: async (payload) => {
    try {
      const { data } = await tagsApi.createTag(payload);
      set((s) => ({ tags: [data.tag, ...s.tags] }));
      return data.tag;
    } catch (err) {
      throw err.response?.data?.message || 'Помилка створення тегу';
    }
  },

  deleteTag: async (id) => {
    try {
      await tagsApi.deleteTag(id);
      set((s) => ({ tags: s.tags.filter((t) => t.id !== id) }));
    } catch {}
  },

  addTagToDocument: async (documentId, tagId) => {
    try {
      await tagsApi.addTagToDocument(documentId, tagId);
      await get().fetchDocuments();
    } catch {}
  },

  removeTagFromDocument: async (documentId, tagId) => {
    try {
      await tagsApi.removeTagFromDocument(documentId, tagId);
      await get().fetchDocuments();
    } catch {}
  },
}));