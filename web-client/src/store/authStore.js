import { create } from 'zustand';
import { authService } from '../services';

export const useAuthStore = create((set) => ({
  user: authService.getCurrentUser(),
  isAuthenticated: authService.isAuthenticated(),
  
  login: async (credentials) => {
    const response = await authService.login(credentials);
    set({ user: response.data.user, isAuthenticated: true });
    return response;
  },

  register: async (userData) => {
    const response = await authService.register(userData);
    set({ user: response.data.user, isAuthenticated: true });
    return response;
  },

  logout: () => {
    authService.logout();
    set({ user: null, isAuthenticated: false });
  },
}));
