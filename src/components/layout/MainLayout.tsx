
import React, { useEffect } from 'react';
import { Sidebar } from './Sidebar';
import { useAuth } from '@/context/AuthContext';
import { toast } from '@/components/ui/use-toast';
import { authenticateGoogleDrive, isAuthenticatedWithGoogleDrive } from '@/utils/googledrive';
import { useRoles } from '@/hooks/use-roles';

interface MainLayoutProps {
  children: React.ReactNode;
  requiresGoogleDrive?: boolean;
}

export const MainLayout: React.FC<MainLayoutProps> = ({ 
  children, 
  requiresGoogleDrive = false 
}) => {
  const { isAuthenticated, user } = useAuth();
  const { isAdmin } = useRoles();

  useEffect(() => {
    // If this page requires Google Drive access, ensure we're authenticated
    if (requiresGoogleDrive) {
      const checkGoogleDriveAuth = async () => {
        try {
          if (!isAuthenticatedWithGoogleDrive()) {
            // Only show toast for admin users who need to connect
            if (isAdmin) {
              toast({
                title: "Google Drive Authentication Needed",
                description: "This feature requires Google Drive access. Please connect in Settings.",
                duration: 5000,
              });
            }
          }
        } catch (error) {
          console.error("Error checking Google Drive auth:", error);
        }
      };
      
      checkGoogleDriveAuth();
    }
  }, [requiresGoogleDrive, isAdmin]);

  // If not authenticated with our app, render just the content without the sidebar
  if (!isAuthenticated) {
    return <main>{children}</main>;
  }

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />
      <div className="flex-1 overflow-auto">
        {user && (
          <header className="bg-white py-2 px-6 border-b">
            <div className="flex items-center justify-end">
              <div className="text-sm text-gray-600">
                Logged in as: <span className="font-medium">{user.displayName}</span>
                {isAdmin && <span className="ml-2 text-xs bg-blue-100 text-blue-800 px-2 py-0.5 rounded">Admin</span>}
              </div>
            </div>
          </header>
        )}
        <main className="p-6">{children}</main>
      </div>
    </div>
  );
};
