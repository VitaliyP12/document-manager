import { create } from 'zustand';
import { login as apiLogin, register as apiRegister, getMe } from '../api/auth';

export const useAuthStore = create((set) => ({
  user: null,
  token: localStorage.getItem('token'),
  loading: false,
  error: null,

  login: async (credentials) => {
    set({ loading: true, error: null });
    try {
      const { data } = await apiLogin(credentials);
      localStorage.setItem('token', data.token);
      set({ user: data.user, token: data.token, loading: false });
      return true;
    } catch (err) {
      set({ error: err.response?.data?.message || 'Помилка входу', loading: false });
      return false;
    }
  },

  register: async (userData) => {
    set({ loading: true, error: null });
    try {
      const { data } = await apiRegister(userData);
      localStorage.setItem('token', data.token);
      set({ user: data.user, token: data.token, loading: false });
      return true;
    } catch (err) {
      set({ error: err.response?.data?.message || 'Помилка реєстрації', loading: false });
      return false;
    }
  },

  fetchMe: async () => {
    set({ loading: true });
    try {
      const { data } = await getMe();
      set({ user: data, loading: false });
    } catch {
      localStorage.removeItem('token');
      set({ user: null, token: null, loading: false });
    }
  },

  logout: () => {
    localStorage.removeItem('token');
    set({ user: null, token: null });
  },

  clearError: () => set({ error: null }),
}));