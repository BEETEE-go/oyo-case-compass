
import React from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { Database, FileDown, FileUp, Lock, Save, User } from 'lucide-react';

const SettingsPage: React.FC = () => {
  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    alert('Settings saved');
  };

  const handleExportAll = () => {
    alert('All data exported to Access format');
  };

  const handleImportData = () => {
    alert('Import functionality would go here');
  };

  return (
    <MainLayout>
      <header className="mb-6">
        <h1 className="text-3xl font-bold mb-2">Settings</h1>
        <p className="text-gray-600">Configure system preferences and database options</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="md:col-span-2">
          <form onSubmit={handleSaveSettings}>
            <Card className="mb-6">
              <CardHeader>
                <CardTitle className="text-xl flex items-center gap-2">
                  <User className="h-5 w-5" />
                  User Settings
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="display-name" className="text-base">Display Name</Label>
                    <Input id="display-name" defaultValue="OYO Administrator" />
                  </div>
                  <div>
                    <Label htmlFor="email" className="text-base">Email Address</Label>
                    <Input id="email" type="email" defaultValue="admin@oyo.gov" />
                  </div>
                </div>
                
                <Separator />
                
                <div>
                  <Label htmlFor="default-view" className="text-base">Default Dashboard View</Label>
                  <Select defaultValue="recent">
                    <SelectTrigger id="default-view">
                      <SelectValue placeholder="Select default view" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="recent">Recent Cases</SelectItem>
                      <SelectItem value="open">Open Cases</SelectItem>
                      <SelectItem value="progress">In Progress Cases</SelectItem>
                      <SelectItem value="closed">Closed Cases</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            <Card className="mb-6">
              <CardHeader>
                <CardTitle className="text-xl flex items-center gap-2">
                  <Database className="h-5 w-5" />
                  Database Connection
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="access-path" className="text-base">Microsoft Access Database Path</Label>
                  <div className="flex gap-2">
                    <Input 
                      id="access-path" 
                      defaultValue="C:\OYO\Database\casesdb.accdb" 
                      className="flex-1"
                    />
                    <Button type="button" variant="outline">Browse</Button>
                  </div>
                  <p className="text-sm text-gray-500 mt-1">
                    Path to the Microsoft Access database file for integration
                  </p>
                </div>
                
                <div>
                  <Label htmlFor="sync-interval" className="text-base">Sync Interval</Label>
                  <Select defaultValue="30">
                    <SelectTrigger id="sync-interval">
                      <SelectValue placeholder="Select sync interval" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="15">Every 15 minutes</SelectItem>
                      <SelectItem value="30">Every 30 minutes</SelectItem>
                      <SelectItem value="60">Every hour</SelectItem>
                      <SelectItem value="manual">Manual only</SelectItem>
                    </SelectContent>
                  </Select>
                  <p className="text-sm text-gray-500 mt-1">
                    How often data is synchronized with Microsoft Access
                  </p>
                </div>
              </CardContent>
            </Card>

            <div className="flex justify-end">
              <Button type="submit">
                <Save className="mr-2 h-4 w-4" />
                Save Settings
              </Button>
            </div>
          </form>
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
                Data Import
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm">
                Import data from a Microsoft Access file
              </p>
              <Button onClick={handleImportData} variant="outline" className="w-full">
                <FileUp className="mr-2 h-4 w-4" />
                Import Data
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </MainLayout>
  );
};

export default SettingsPage;
