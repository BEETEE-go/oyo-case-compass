
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { FileDown, FileSearch, FileUp } from 'lucide-react';
import { toast } from "@/components/ui/use-toast";

const DataImportExport: React.FC = () => {
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

  return (
    <>
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
    </>
  );
};

export default DataImportExport;
