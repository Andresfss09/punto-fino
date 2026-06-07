import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const useAuthStore = create(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: false,

      setAuth: (user, token) => {
        localStorage.setItem('pf_token', token);
        set({ user, token, isAuthenticated: true });
      },

      updateUser: (userData) => {
        set((state) => ({ user: { ...state.user, ...userData } }));
      },

      logout: () => {
        localStorage.removeItem('pf_token');
        localStorage.removeItem('pf_user');
        set({ user: null, token: null, isAuthenticated: false });
      },

      setLoading: (loading) => set({ isLoading: loading }),

      isAdmin: () => get().user?.role === 'admin',
      isBarber: () => get().user?.role === 'barbero',
      isClient: () => get().user?.role === 'cliente',
    }),
    {
      name: 'pf_user',
      partialize: (state) => ({ user: state.user, token: state.token, isAuthenticated: state.isAuthenticated }),
    }
  )
);

export default useAuthStore;