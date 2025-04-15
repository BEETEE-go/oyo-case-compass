
import { useAuth } from '@/context/AuthContext';

export const useRoles = () => {
  const { user } = useAuth();

  const isAdmin = user?.role === 'admin';
  
  const hasRole = (role: 'admin' | 'user') => {
    if (!user) return false;
    if (user.role === 'admin') return true; // Admin has access to everything
    return user.role === role;
  };

  return {
    isAdmin,
    hasRole
  };
};
