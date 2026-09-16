import useAuthStore from '../store/useAuthStore';

export const useAuth = () => {
  const { user, token, login, logout, register, isLoading } = useAuthStore();
  
  const isAuthenticated = !!token && !!user;
  const isClient = user?.role === 'cliente';
  const isBarber = user?.role === 'barbero';
  const isAdmin = user?.role === 'admin';

  return {
    user,
    isAuthenticated,
    isClient,
    isBarber,
    isAdmin,
    login,
    logout,
    register,
    isLoading
  };
};
