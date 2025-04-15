
import React from 'react';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { LogOut, User } from 'lucide-react';
import { toast } from '@/components/ui/sonner';
import { useNavigate } from 'react-router-dom';

const UserMenu: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    toast.success('You have been logged out successfully');
    navigate('/login');
  };

  if (!user) return null;

  return (
    <div className="p-4 border-t border-gray-200">
      <div className="flex items-center space-x-3 mb-3">
        <div className="bg-primary-50 rounded-full p-2">
          <User className="h-6 w-6 text-primary-600" />
        </div>
        <div>
          <div className="font-medium text-sm">{user.displayName}</div>
          <div className="text-xs text-gray-500">{user.email}</div>
        </div>
      </div>
      <Button 
        variant="outline" 
        onClick={handleLogout} 
        className="w-full justify-start text-gray-700"
        size="sm"
      >
        <LogOut className="mr-2 h-4 w-4" />
        Sign Out
      </Button>
    </div>
  );
};

export default UserMenu;
