import { create } from 'zustand'
import toast from 'react-hot-toast'
import * as docsApi from '../api/documents'
import * as tagsApi from '../api/tags'
import * as searchApi from '../api/search'

export const useDocStore = create((set, get) => ({
  documents: [],
  tags: [],
  loading: false,
  error: null,

  fetchDocuments: async () => {
    set({ loading: true, error: null })
    try {
      const { data } = await docsApi.getDocuments()
      set({ documents: data, loading: false })
    } catch (err) {
      set({ error: err.response?.data?.message, loading: false })
    }
  },

  searchDocuments: async (params) => {
    set({ loading: true, error: null })
    try {
      const { data } = await searchApi.search(params)
      set({ documents: data.results || [], loading: false })
    } catch (err) {
      set({ error: err.response?.data?.message, loading: false, documents: [] })
    }
  },

  fetchStats: async () => {
    try {
      const { data } = await searchApi.getStats()
      return data
    } catch {
      toast.error('Помилка завантаження статистики')
      return null
    }
  },

  fetchTags: async () => {
    try {
      const { data } = await tagsApi.getTags()
      set({ tags: data })
    } catch { /* ігноруємо */ }
  },

  createDocument: async (formData) => {
    try {
      const { data } = await docsApi.createDocument(formData)
      await get().fetchDocuments()
      toast.success('Документ створено')
      return data
    } catch (err) {
      const msg = err.response?.data?.message || 'Помилка створення'
      toast.error(msg)
      throw msg
    }
  },

  updateDocument: async (id, payload) => {
    try {
      await docsApi.updateDocument(id, payload)
      await get().fetchDocuments()
      toast.success('Документ оновлено')
    } catch (err) {
      const msg = err.response?.data?.message || 'Помилка оновлення'
      toast.error(msg)
      throw msg
    }
  },

  deleteDocument: async (id) => {
    try {
      await docsApi.deleteDocument(id)
      set((s) => ({ documents: s.documents.filter((d) => d.id !== id) }))
      toast.success('Документ видалено')
    } catch (err) {
      const msg = err.response?.data?.message || 'Помилка видалення'
      toast.error(msg)
      throw msg
    }
  },

  createTag: async (payload) => {
    try {
      const { data } = await tagsApi.createTag(payload)
      set((s) => ({ tags: [data.tag, ...s.tags] }))
      toast.success('Тег створено')
      return data.tag
    } catch (err) {
      const msg = err.response?.data?.message || 'Помилка створення тегу'
      toast.error(msg)
      throw msg
    }
  },

  deleteTag: async (id) => {
    try {
      await tagsApi.deleteTag(id)
      set((s) => ({ tags: s.tags.filter((t) => t.id !== id) }))
      toast.success('Тег видалено')
    } catch { /* ігноруємо */ }
  },

  addTagToDocument: async (documentId, tagId) => {
    try {
      await tagsApi.addTagToDocument(documentId, tagId)
      await get().fetchDocuments()
    } catch { /* ігноруємо */ }
  },

  removeTagFromDocument: async (documentId, tagId) => {
    try {
      await tagsApi.removeTagFromDocument(documentId, tagId)
      await get().fetchDocuments()
    } catch { /* ігноруємо */ }
  },
}))