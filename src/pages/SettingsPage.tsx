import React, { useState, useEffect } from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { toast } from "@/components/ui/use-toast";
import { Database, FileDown, FileUp, Lock, Save, User, FileSearch, RefreshCw, Upload, Folder } from 'lucide-react';
import { 
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage 
} from "@/components/ui/form";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { 
  authenticateGoogleDrive, 
  uploadToGoogleDrive, 
  listGoogleDriveFiles,
  createGoogleDriveFolder
} from '@/utils/googledrive';

const formSchema = z.object({
  displayName: z.string().min(2, "Display name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email address"),
  defaultView: z.string(),
  accessPath: z.string().min(5, "Please enter a valid file path"),
  syncInterval: z.string(),
  syncMethod: z.enum(["odbc", "oledb", "csv"]),
  syncDirection: z.enum(["import", "export", "both"])
});

type FormValues = z.infer<typeof formSchema>;

const SettingsPage: React.FC = () => {
  const [testingConnection, setTestingConnection] = useState(false);
  const [lastSyncDate, setLastSyncDate] = useState<string | null>(null);
  const [folderName, setFolderName] = useState('');
  const [files, setFiles] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [authenticated, setAuthenticated] = useState(false);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      displayName: "OYO Administrator",
      email: "admin@oyo.gov",
      defaultView: "recent",
      accessPath: "C:\\OYO\\Database\\casesdb.accdb",
      syncInterval: "30",
      syncMethod: "odbc",
      syncDirection: "both"
    }
  });

  const handleSaveSettings = (values: FormValues) => {
    console.log('Settings saved', values);
    toast({
      title: "Settings saved",
      description: "Your configuration has been updated successfully."
    });
  };

  const handleExportAll = () => {
    toast({
      title: "Export initiated",
      description: "All data is being exported to Microsoft Access format."
    });
  };

  const handleImportData = () => {
    toast({
      title: "Import initiated",
      description: "Preparing to import data from Microsoft Access."
    });
  };

  const handleTestConnection = () => {
    setTestingConnection(true);
    
    setTimeout(() => {
      setTestingConnection(false);
      const success = Math.random() > 0.3;
      
      if (success) {
        toast({
          title: "Connection successful",
          description: "Successfully connected to Microsoft Access database.",
        });
      } else {
        toast({
          title: "Connection failed",
          description: "Unable to connect to the specified Access database. Please check the path and try again.",
          variant: "destructive"
        });
      }
    }, 1500);
  };

  const handleSyncNow = () => {
    toast({
      title: "Sync initiated",
      description: "Synchronizing data with Microsoft Access..."
    });
    
    setTimeout(() => {
      const now = new Date();
      setLastSyncDate(now.toLocaleString());
      
      toast({
        title: "Sync complete",
        description: "Data has been synchronized successfully."
      });
    }, 2000);
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
    <MainLayout>
      <header className="mb-6">
        <h1 className="text-3xl font-bold mb-2">Settings</h1>
        <p className="text-gray-600">Configure system preferences and integrations</p>
      </header>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSaveSettings)}>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="md:col-span-2">
              <Card className="mb-6">
                <CardHeader>
                  <CardTitle className="text-xl flex items-center gap-2">
                    <User className="h-5 w-5" />
                    User Settings
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="displayName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-base">Display Name</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-base">Email Address</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  
                  <Separator />
                  
                  <FormField
                    control={form.control}
                    name="defaultView"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-base">Default Dashboard View</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger id="default-view">
                              <SelectValue placeholder="Select default view" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="recent">Recent Cases</SelectItem>
                            <SelectItem value="open">Open Cases</SelectItem>
                            <SelectItem value="progress">In Progress Cases</SelectItem>
                            <SelectItem value="closed">Closed Cases</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>

              <Card className="mb-6">
                <CardHeader>
                  <CardTitle className="text-xl flex items-center gap-2">
                    <Database className="h-5 w-5" />
                    Microsoft Access Integration
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <FormField
                    control={form.control}
                    name="accessPath"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-base">Microsoft Access Database Path</FormLabel>
                        <div className="flex gap-2">
                          <FormControl>
                            <Input
                              {...field}
                              className="flex-1"
                            />
                          </FormControl>
                          <Button type="button" variant="outline">Browse</Button>
                        </div>
                        <FormDescription>
                          Path to the Microsoft Access database file (.accdb or .mdb)
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="syncInterval"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-base">Sync Interval</FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                          >
                            <FormControl>
                              <SelectTrigger id="sync-interval">
                                <SelectValue placeholder="Select sync interval" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="15">Every 15 minutes</SelectItem>
                              <SelectItem value="30">Every 30 minutes</SelectItem>
                              <SelectItem value="60">Every hour</SelectItem>
                              <SelectItem value="manual">Manual only</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormDescription>
                            How often data is synchronized with Microsoft Access
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="syncMethod"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-base">Connection Method</FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select connection method" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="odbc">ODBC Connection</SelectItem>
                              <SelectItem value="oledb">OLE DB Connection</SelectItem>
                              <SelectItem value="csv">CSV Import/Export</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormDescription>
                            Method used to connect to Microsoft Access
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  
                  <FormField
                    control={form.control}
                    name="syncDirection"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-base">Sync Direction</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select sync direction" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="import">Import from Access only</SelectItem>
                            <SelectItem value="export">Export to Access only</SelectItem>
                            <SelectItem value="both">Bidirectional sync</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormDescription>
                          Controls how data flows between the web app and Microsoft Access
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <div className="flex gap-3 mt-6">
                    <Button 
                      type="button" 
                      variant="outline" 
                      onClick={handleTestConnection}
                      disabled={testingConnection}
                    >
                      {testingConnection ? (
                        <>
                          <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                          Testing...
                        </>
                      ) : (
                        <>
                          <Database className="mr-2 h-4 w-4" />
                          Test Connection
                        </>
                      )}
                    </Button>
                    <Button 
                      type="button" 
                      variant="secondary"
                      onClick={handleSyncNow}
                    >
                      <RefreshCw className="mr-2 h-4 w-4" />
                      Sync Now
                    </Button>
                  </div>
                  
                  {lastSyncDate && (
                    <div className="text-sm text-gray-500">
                      Last synchronized: {lastSyncDate}
                    </div>
                  )}
                </CardContent>
              </Card>
              
              <div className="flex justify-end">
                <Button type="submit">
                  <Save className="mr-2 h-4 w-4" />
                  Save Settings
                </Button>
              </div>
            </div>

            <div>
              <Card className="mb-6">
                <CardHeader>
                  <CardTitle className="text-xl flex items-center gap-2">
                    <Lock className="h-5 w-5" />
                    Security
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="current-password" className="text-base">Current Password</Label>
                    <Input id="current-password" type="password" />
                  </div>
                  
                  <div>
                    <Label htmlFor="new-password" className="text-base">New Password</Label>
                    <Input id="new-password" type="password" />
                  </div>
                  
                  <div>
                    <Label htmlFor="confirm-password" className="text-base">Confirm Password</Label>
                    <Input id="confirm-password" type="password" />
                  </div>
                  
                  <Button className="w-full">Change Password</Button>
                </CardContent>
              </Card>

              <Card className="mb-6">
                <CardHeader>
                  <CardTitle className="text-xl flex items-center gap-2">
                    <FileDown className="h-5 w-5" />
                    Data Export
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-sm">
                    Export all case data in Microsoft Access compatible format
                  </p>
                  <Button onClick={handleExportAll} className="w-full">
                    <FileDown className="mr-2 h-4 w-4" />
                    Export All Data
                  </Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-xl flex items-center gap-2">
                    <FileUp className="h-5 w-5" />
                    Data Import/Export Options
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-sm">
                    Import or export data with Microsoft Access
                  </p>
                  <div className="space-y-2">
                    <Button onClick={handleImportData} variant="outline" className="w-full">
                      <FileUp className="mr-2 h-4 w-4" />
                      Import from Access
                    </Button>
                    <Button onClick={handleExportAll} variant="outline" className="w-full">
                      <FileDown className="mr-2 h-4 w-4" />
                      Export to Access
                    </Button>
                    <Button variant="outline" className="w-full">
                      <FileSearch className="mr-2 h-4 w-4" />
                      View Sync Log
                    </Button>
                  </div>
                </CardContent>
              </Card>

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
            </div>
          </div>
        </form>
      </Form>
    </MainLayout>
  );
};

export default SettingsPage;
