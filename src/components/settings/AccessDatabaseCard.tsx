
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Database, RefreshCw } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { 
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormDescription,
  FormMessage 
} from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from "@/components/ui/use-toast";
import { UseFormReturn } from 'react-hook-form';
import { FormValues } from '@/types/settings';

interface AccessDatabaseCardProps {
  form: UseFormReturn<FormValues>;
  lastSyncDate: string | null;
  setLastSyncDate: React.Dispatch<React.SetStateAction<string | null>>;
}

const AccessDatabaseCard: React.FC<AccessDatabaseCardProps> = ({ form, lastSyncDate, setLastSyncDate }) => {
  const [testingConnection, setTestingConnection] = useState(false);

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

  return (
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
  );
};

export default AccessDatabaseCard;
