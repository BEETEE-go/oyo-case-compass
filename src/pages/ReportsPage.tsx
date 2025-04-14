
import React, { useState } from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { Input } from '@/components/ui/input';
import { Bar, BarChart, CartesianGrid, Cell, Legend, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { mockCases } from '@/data/mockData';
import { Download, FileText } from 'lucide-react';

const ReportsPage: React.FC = () => {
  const [reportType, setReportType] = useState('casesByStatus');
  const [dateRange, setDateRange] = useState('allTime');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  // Calculate data for cases by status chart
  const casesByStatusData = [
    { name: 'Open', value: mockCases.filter(c => c.status === 'Open').length, color: '#22c55e' },
    { name: 'In Progress', value: mockCases.filter(c => c.status === 'In Progress').length, color: '#f59e0b' },
    { name: 'Closed', value: mockCases.filter(c => c.status === 'Closed').length, color: '#64748b' },
  ];

  // Calculate data for cases by category
  const categoryCount: Record<string, number> = {};
  mockCases.forEach(caseItem => {
    caseItem.categories.forEach(category => {
      categoryCount[category] = (categoryCount[category] || 0) + 1;
    });
  });

  const casesByCategoryData = Object.entries(categoryCount)
    .map(([name, value]) => ({ name, value }))
    .sort((a, b) => b.value - a.value);

  // Calculate data for agencies involved
  const agencyCount: Record<string, number> = {};
  mockCases.forEach(caseItem => {
    caseItem.agenciesInvolved.forEach(agency => {
      agencyCount[agency] = (agencyCount[agency] || 0) + 1;
    });
  });

  const agenciesInvolvedData = Object.entries(agencyCount)
    .map(([name, value]) => ({ name, value }));
    
  // Mock function to export to Access format
  const handleExportToAccess = () => {
    alert('Exporting to Access format...');
    // In a real app, this would generate a proper export
  };

  return (
    <MainLayout>
      <header className="mb-6">
        <h1 className="text-3xl font-bold mb-2">Reports</h1>
        <p className="text-gray-600">Generate insights and analytics from case data</p>
      </header>

      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="text-xl">Report Configuration</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <Label htmlFor="report-type">Report Type</Label>
              <Select value={reportType} onValueChange={setReportType}>
                <SelectTrigger id="report-type">
                  <SelectValue placeholder="Select report type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="casesByStatus">Cases by Status</SelectItem>
                  <SelectItem value="casesByCategory">Cases by Category</SelectItem>
                  <SelectItem value="agenciesInvolved">Agencies Involved</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="date-range">Date Range</Label>
              <Select value={dateRange} onValueChange={setDateRange}>
                <SelectTrigger id="date-range">
                  <SelectValue placeholder="Select date range" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="allTime">All Time</SelectItem>
                  <SelectItem value="last30">Last 30 Days</SelectItem>
                  <SelectItem value="last90">Last 90 Days</SelectItem>
                  <SelectItem value="lastYear">Last Year</SelectItem>
                  <SelectItem value="custom">Custom Range</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {dateRange === 'custom' && (
              <div className="md:col-span-3 grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="start-date">Start Date</Label>
                  <Input
                    id="start-date"
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="end-date">End Date</Label>
                  <Input
                    id="end-date"
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                  />
                </div>
              </div>
            )}
          </div>

          <div className="mt-4 flex justify-end">
            <Button onClick={handleExportToAccess}>
              <Download className="mr-2 h-4 w-4" />
              Export to Access
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-xl">
            {reportType === 'casesByStatus' && 'Cases by Status'}
            {reportType === 'casesByCategory' && 'Cases by Category'}
            {reportType === 'agenciesInvolved' && 'Agencies Involved in Cases'}
          </CardTitle>
          <Button variant="outline" size="sm">
            <FileText className="mr-2 h-4 w-4" />
            Download Report
          </Button>
        </CardHeader>
        <CardContent className="pt-6">
          {reportType === 'casesByStatus' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={casesByStatusData}
                      cx="50%"
                      cy="50%"
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                      label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    >
                      {casesByStatusData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Summary</h3>
                <div className="grid grid-cols-3 gap-4">
                  {casesByStatusData.map((item) => (
                    <div key={item.name} className="bg-gray-50 p-4 rounded-lg text-center">
                      <div className="text-2xl font-bold" style={{ color: item.color }}>
                        {item.value}
                      </div>
                      <div className="text-sm text-gray-500">{item.name}</div>
                    </div>
                  ))}
                </div>
                <Separator />
                <div>
                  <h4 className="font-medium mb-2">Key Insights</h4>
                  <ul className="list-disc list-inside space-y-1 text-sm">
                    <li>Total number of cases: {mockCases.length}</li>
                    <li>
                      {Math.round((casesByStatusData[2].value / mockCases.length) * 100)}% of cases are closed
                    </li>
                    <li>
                      {Math.round((casesByStatusData[0].value / mockCases.length) * 100)}% of cases are currently open
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          )}

          {reportType === 'casesByCategory' && (
            <div className="h-96">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={casesByCategoryData} layout="vertical" margin={{ left: 150 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis type="number" />
                  <YAxis 
                    type="category" 
                    dataKey="name" 
                    width={140}
                    tick={{ fontSize: 12 }}
                  />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="value" fill="#3b82f6" name="Number of Cases" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}

          {reportType === 'agenciesInvolved' && (
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={agenciesInvolvedData} margin={{ bottom: 20 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="value" fill="#8884d8" name="Number of Cases" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}
        </CardContent>
      </Card>
    </MainLayout>
  );
};

export default ReportsPage;
