
import React, { useState } from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { toast } from "@/components/ui/use-toast";
import { Database, FileDown, FileUp, Lock, Save, User, FileSearch, RefreshCw } from 'lucide-react';
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

// Define schema for form validation
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
  
  // Initialize form with default values
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
    // In a real application, this would save to localStorage or a backend
    console.log('Settings saved', values);
    toast({
      title: "Settings saved",
      description: "Your configuration has been updated successfully."
    });
  };

  const handleExportAll = () => {
    // In a real application, this would trigger an export
    toast({
      title: "Export initiated",
      description: "All data is being exported to Microsoft Access format."
    });
  };

  const handleImportData = () => {
    // In a real application, this would trigger an import
    toast({
      title: "Import initiated",
      description: "Preparing to import data from Microsoft Access."
    });
  };

  const handleTestConnection = () => {
    setTestingConnection(true);
    
    // Simulate a test connection
    setTimeout(() => {
      setTestingConnection(false);
      const success = Math.random() > 0.3; // 70% chance of success for demo
      
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
    
    // Simulate sync process
    setTimeout(() => {
      const now = new Date();
      setLastSyncDate(now.toLocaleString());
      
      toast({
        title: "Sync complete",
        description: "Data has been synchronized successfully."
      });
    }, 2000);
  };

  return (
    <MainLayout>
      <header className="mb-6">
        <h1 className="text-3xl font-bold mb-2">Settings</h1>
        <p className="text-gray-600">Configure system preferences and Microsoft Access integration</p>
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
            </div>
          </div>
        </form>
      </Form>
    </MainLayout>
  );
};

export default SettingsPage;
