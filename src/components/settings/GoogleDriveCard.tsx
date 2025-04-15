
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Upload, FileSearch, Folder, FileUp, RefreshCw, LogOut } from 'lucide-react';
import { toast } from "@/components/ui/use-toast";
import { 
  authenticateGoogleDrive,
  isAuthenticatedWithGoogleDrive,
  signOutGoogleDrive,
  uploadToGoogleDrive, 
  listGoogleDriveFiles,
  createGoogleDriveFolder
} from '@/utils/googledrive';
import { useRoles } from '@/hooks/use-roles';

const GoogleDriveCard: React.FC = () => {
  const [folderName, setFolderName] = useState('');
  const [files, setFiles] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [authenticated, setAuthenticated] = useState(false);
  const { isAdmin } = useRoles();

  useEffect(() => {
    // Check authentication status on component mount
    const checkAuth = async () => {
      try {
        const authStatus = isAuthenticatedWithGoogleDrive();
        setAuthenticated(authStatus);
        
        if (authStatus) {
          await refreshFileList();
        }
      } catch (error) {
        console.error("Error checking auth status:", error);
      }
    };
    
    checkAuth();
  }, []);

  const refreshFileList = async () => {
    try {
      setLoading(true);
      const filesList = await listGoogleDriveFiles();
      setFiles(filesList);
      setLoading(false);
    } catch (error) {
      console.error("Error refreshing file list:", error);
      setLoading(false);
    }
  };

  const handleGoogleDriveAuth = async () => {
    try {
      setLoading(true);
      const isAuthenticated = await authenticateGoogleDrive();
      setAuthenticated(isAuthenticated);
      
      if (isAuthenticated) {
        toast({
          title: 'Authentication Successful',
          description: 'Successfully authenticated with Google Drive.'
        });
        
        // Load files after authentication
        await refreshFileList();
      }
    } catch (error) {
      toast({
        title: 'Authentication Failed',
        description: 'Could not authenticate with Google Drive',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSignOut = async () => {
    try {
      setLoading(true);
      await signOutGoogleDrive();
      setAuthenticated(false);
      setFiles([]);
      
      toast({
        title: 'Signed Out',
        description: 'Successfully signed out from Google Drive.'
      });
    } catch (error) {
      toast({
        title: 'Sign Out Failed',
        description: 'Could not sign out from Google Drive',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleDriveUpload = async () => {
    try {
      if (!authenticated) {
        await handleGoogleDriveAuth();
      }
      
      const fileInput = document.createElement('input');
      fileInput.type = 'file';
      fileInput.onchange = async (e: any) => {
        const file = e.target.files[0];
        setLoading(true);
        
        const result = await uploadToGoogleDrive(file);
        
        toast({
          title: 'File Uploaded',
          description: `${file.name} uploaded to Google Drive`
        });
        
        // Refresh file list
        await refreshFileList();
      };
      fileInput.click();
    } catch (error) {
      toast({
        title: 'Upload Failed',
        description: 'Could not upload to Google Drive',
        variant: 'destructive'
      });
      setLoading(false);
    }
  };

  const handleCreateFolder = async () => {
    if (!folderName.trim()) {
      toast({
        title: 'Folder Name Required',
        description: 'Please enter a folder name',
        variant: 'destructive'
      });
      return;
    }
    
    try {
      if (!authenticated) {
        await handleGoogleDriveAuth();
      }
      
      setLoading(true);
      const folder = await createGoogleDriveFolder(folderName);
      
      toast({
        title: 'Folder Created',
        description: `Folder "${folderName}" created successfully`
      });
      
      setFolderName('');
      
      // Refresh file list
      await refreshFileList();
    } catch (error) {
      toast({
        title: 'Failed to Create Folder',
        description: 'Could not create folder in Google Drive',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleListFiles = async () => {
    try {
      if (!authenticated) {
        await handleGoogleDriveAuth();
      } else {
        await refreshFileList();
        
        toast({
          title: 'Files Loaded',
          description: `${files.length} files found in Google Drive`
        });
      }
    } catch (error) {
      toast({
        title: 'List Files Failed',
        description: 'Could not list Google Drive files',
        variant: 'destructive'
      });
    }
  };

  const getFileIcon = (mimeType: string) => {
    if (mimeType.includes('folder')) {
      return <Folder className="h-4 w-4 text-yellow-500" />;
    } else if (mimeType.includes('image')) {
      return <FileUp className="h-4 w-4 text-green-500" />;
    } else if (mimeType.includes('pdf')) {
      return <FileUp className="h-4 w-4 text-red-500" />;
    } else if (mimeType.includes('spreadsheet')) {
      return <FileUp className="h-4 w-4 text-emerald-500" />;
    } else if (mimeType.includes('document')) {
      return <FileUp className="h-4 w-4 text-blue-500" />;
    } else {
      return <FileUp className="h-4 w-4 text-gray-500" />;
    }
  };

  // Only admin users can access this card's functionality
  if (!isAdmin) {
    return (
      <Card className="mt-6">
        <CardHeader>
          <CardTitle className="text-xl flex items-center gap-2">
            <Upload className="h-5 w-5" />
            Google Drive Integration
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-6">
            <p className="text-gray-500">
              You need administrator privileges to access Google Drive integration settings.
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="mt-6">
      <CardHeader>
        <CardTitle className="text-xl flex items-center gap-2">
          <Upload className="h-5 w-5" />
          Google Drive Integration
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex flex-col gap-2">
            {authenticated ? (
              <div className="flex justify-between items-center mb-2">
                <span className="text-green-600 font-medium flex items-center">
                  <span className="inline-block h-2 w-2 rounded-full bg-green-500 mr-2"></span>
                  Connected to Google Drive
                </span>
                <Button 
                  onClick={handleSignOut}
                  variant="outline"
                  size="sm"
                  disabled={loading}
                  className="text-red-500"
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  Sign Out
                </Button>
              </div>
            ) : (
              <Button 
                onClick={handleGoogleDriveAuth}
                variant="outline"
                className="w-full"
                disabled={loading}
              >
                {loading ? 'Connecting...' : 'Connect to Google Drive'}
              </Button>
            )}
            
            <div className="flex gap-2">
              <Button 
                onClick={handleGoogleDriveUpload}
                disabled={loading || !authenticated}
                className="flex-1"
              >
                <Upload className="mr-2 h-4 w-4" />
                Upload File
              </Button>
              
              <Button 
                onClick={handleListFiles}
                variant="outline"
                disabled={loading || !authenticated}
                className="flex-1"
              >
                <RefreshCw className={`mr-2 h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
                Refresh Files
              </Button>
            </div>
            
            <div className="flex gap-2 mt-2">
              <Input
                placeholder="Folder Name"
                value={folderName}
                onChange={(e) => setFolderName(e.target.value)}
                disabled={!authenticated}
              />
              <Button 
                onClick={handleCreateFolder}
                variant="outline"
                disabled={loading || !authenticated || !folderName.trim()}
              >
                <Folder className="mr-2 h-4 w-4" />
                Create
              </Button>
            </div>
          </div>
          
          {authenticated && (
            <div className="mt-4 p-3 bg-gray-50 rounded-md">
              <h3 className="text-sm font-medium mb-1">Integration Status</h3>
              <p className="text-xs text-gray-600 mb-2">
                Google Drive is properly configured and ready to store case data.
                New cases will automatically create folders and store documents in Google Drive.
              </p>
            </div>
          )}
          
          {files.length > 0 && (
            <div className="mt-4">
              <h3 className="font-medium mb-2">Files in Google Drive:</h3>
              <div className="max-h-60 overflow-y-auto border rounded-md p-2">
                <ul className="space-y-1">
                  {files.map((file) => (
                    <li key={file.id} className="text-sm flex items-center gap-2 p-1 hover:bg-gray-50">
                      {getFileIcon(file.mimeType)}
                      <a 
                        href={file.webViewLink} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:underline flex-1 truncate"
                        title={file.name}
                      >
                        {file.name}
                      </a>
                      <span className="text-xs text-gray-500">
                        {new Date(file.modifiedTime).toLocaleDateString()}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default GoogleDriveCard;
