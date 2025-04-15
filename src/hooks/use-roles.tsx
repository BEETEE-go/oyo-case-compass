
import { useAuth } from '@/context/AuthContext';

// Define permission types for better type safety
export type Permission = 
  | 'create:case'
  | 'read:case'
  | 'update:case'
  | 'delete:case'
  | 'manage:users'
  | 'manage:settings'
  | 'access:reports'
  | 'use:google-drive';

export const useRoles = () => {
  const { user } = useAuth();

  const isAdmin = user?.role === 'admin';
  const isUser = user?.role === 'user';
  
  // Check if user has a specific role
  const hasRole = (role: 'admin' | 'user') => {
    if (!user) return false;
    if (user.role === 'admin') return true; // Admin has access to everything
    return user.role === role;
  };
  
  // Check if user has a specific permission
  const hasPermission = (permission: Permission): boolean => {
    if (!user) return false;
    
    // Admin role has all permissions
    if (user.role === 'admin') return true;
    
    // Define permissions for user role
    if (user.role === 'user') {
      const userPermissions: Permission[] = [
        'create:case',
        'read:case',
        'update:case',
        'access:reports'
      ];
      
      return userPermissions.includes(permission);
    }
    
    return false;
  };
  
  // Check if the user can perform a specific action on cases
  const canManageCases = (): boolean => {
    return hasPermission('create:case') && 
           hasPermission('read:case') && 
           hasPermission('update:case');
  };
  
  // Check if the user can use Google Drive
  const canUseGoogleDrive = (): boolean => {
    return hasPermission('use:google-drive');
  };

  return {
    isAdmin,
    isUser,
    hasRole,
    hasPermission,
    canManageCases,
    canUseGoogleDrive
  };
};
