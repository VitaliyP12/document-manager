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

  updateProfile: async (data) => {
  try {
    const { data: response } = await (await import('../api/auth')).updateProfile(data);
    set({ user: response.user });
    return true;
  } catch (err) {
    return { error: err.response?.data?.message || 'Помилка оновлення' };
  }
},

changePassword: async (data) => {
  try {
    await (await import('../api/auth')).changePassword(data);
    return true;
  } catch (err) {
    return { error: err.response?.data?.message || 'Помилка зміни пароля' };
  }
},

  clearError: () => set({ error: null }),
}));