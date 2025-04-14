
import React, { useState } from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { Button } from '@/components/ui/button';
import { Save } from 'lucide-react';
import { toast } from "@/components/ui/use-toast";
import { Form } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { formSchema, FormValues } from '@/types/settings';

// Import our new components
import UserSettingsCard from '@/components/settings/UserSettingsCard';
import AccessDatabaseCard from '@/components/settings/AccessDatabaseCard';
import SecurityCard from '@/components/settings/SecurityCard';
import DataImportExport from '@/components/settings/DataImportExport';
import GoogleDriveCard from '@/components/settings/GoogleDriveCard';

const SettingsPage: React.FC = () => {
  const [lastSyncDate, setLastSyncDate] = useState<string | null>(null);

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
              <UserSettingsCard form={form} />
              <AccessDatabaseCard form={form} lastSyncDate={lastSyncDate} setLastSyncDate={setLastSyncDate} />
              
              <div className="flex justify-end">
                <Button type="submit">
                  <Save className="mr-2 h-4 w-4" />
                  Save Settings
                </Button>
              </div>
            </div>

            <div>
              <SecurityCard />
              <DataImportExport />
              <GoogleDriveCard />
            </div>
          </div>
        </form>
      </Form>
    </MainLayout>
  );
};

export default SettingsPage;
