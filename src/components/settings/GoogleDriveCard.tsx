
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Upload, FileSearch, Folder, FileUp } from 'lucide-react';
import { toast } from "@/components/ui/use-toast";
import { 
  authenticateGoogleDrive, 
  uploadToGoogleDrive, 
  listGoogleDriveFiles,
  createGoogleDriveFolder
} from '@/utils/googledrive';

const GoogleDriveCard: React.FC = () => {
  const [folderName, setFolderName] = useState('');
  const [files, setFiles] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [authenticated, setAuthenticated] = useState(false);

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
        const filesList = await listGoogleDriveFiles();
        setFiles(filesList);
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
        const filesList = await listGoogleDriveFiles();
        setFiles(filesList);
        setLoading(false);
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
      const filesList = await listGoogleDriveFiles();
      setFiles(filesList);
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
        setLoading(true);
        const filesList = await listGoogleDriveFiles();
        setFiles(filesList);
        
        toast({
          title: 'Files Loaded',
          description: `${filesList.length} files found in Google Drive`
        });
      }
    } catch (error) {
      toast({
        title: 'List Files Failed',
        description: 'Could not list Google Drive files',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

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
            <Button 
              onClick={handleGoogleDriveAuth}
              variant="outline"
              className="w-full"
              disabled={loading || authenticated}
            >
              {loading ? 'Connecting...' : authenticated ? 'Connected to Google Drive' : 'Connect to Google Drive'}
            </Button>
            
            <div className="flex gap-2">
              <Button 
                onClick={handleGoogleDriveUpload}
                disabled={loading}
                className="flex-1"
              >
                <Upload className="mr-2 h-4 w-4" />
                Upload File
              </Button>
              
              <Button 
                onClick={handleListFiles}
                variant="outline"
                disabled={loading}
                className="flex-1"
              >
                <FileSearch className="mr-2 h-4 w-4" />
                List Files
              </Button>
            </div>
            
            <div className="flex gap-2 mt-2">
              <Input
                placeholder="Folder Name"
                value={folderName}
                onChange={(e) => setFolderName(e.target.value)}
              />
              <Button 
                onClick={handleCreateFolder}
                variant="outline"
                disabled={loading || !folderName.trim()}
              >
                <Folder className="mr-2 h-4 w-4" />
                Create
              </Button>
            </div>
          </div>
          
          {files.length > 0 && (
            <div className="mt-4">
              <h3 className="font-medium mb-2">Files in Google Drive:</h3>
              <div className="max-h-60 overflow-y-auto">
                <ul className="space-y-1">
                  {files.map((file) => (
                    <li key={file.id} className="text-sm flex items-center gap-2">
                      {file.mimeType.includes('folder') ? (
                        <Folder className="h-4 w-4 text-yellow-500" />
                      ) : (
                        <FileUp className="h-4 w-4 text-blue-500" />
                      )}
                      <a 
                        href={file.webViewLink} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:underline"
                      >
                        {file.name}
                      </a>
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
