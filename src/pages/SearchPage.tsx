
import React, { useState } from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { CaseCard } from '@/components/cases/CaseCard';
import { CaseStatus, CaseCategory, Agency } from '@/types/case';
import { mockCases, getAllCaseStatuses, getAllCaseCategories, getAllAgencies } from '@/data/mockData';
import { Download, FileText, Search as SearchIcon } from 'lucide-react';

const SearchPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [advancedSearch, setAdvancedSearch] = useState(false);
  const [filters, setFilters] = useState<{
    status: CaseStatus | '';
    category: CaseCategory | '';
    agency: Agency | '';
    startDate: string;
    endDate: string;
    investigator: string;
  }>({
    status: '',
    category: '',
    agency: '',
    startDate: '',
    endDate: '',
    investigator: '',
  });

  // Filter cases based on search term and filters
  const filteredCases = mockCases.filter(caseItem => {
    // Basic search
    if (searchTerm && !caseItem.title.toLowerCase().includes(searchTerm.toLowerCase()) &&
        !caseItem.description.toLowerCase().includes(searchTerm.toLowerCase()) &&
        !caseItem.complainantName.toLowerCase().includes(searchTerm.toLowerCase()) &&
        !caseItem.facility.toLowerCase().includes(searchTerm.toLowerCase())) {
      return false;
    }

    // Advanced search filters
    if (advancedSearch) {
      // Status filtering
      if (filters.status && caseItem.status !== filters.status) {
        return false;
      }

      // Category filtering
      if (filters.category && !caseItem.categories.includes(filters.category)) {
        return false;
      }

      // Agency filtering
      if (filters.agency && !caseItem.agenciesInvolved.includes(filters.agency)) {
        return false;
      }

      // Date range filtering
      if (filters.startDate) {
        const startDate = new Date(filters.startDate);
        if (caseItem.openDate < startDate) {
          return false;
        }
      }

      if (filters.endDate) {
        const endDate = new Date(filters.endDate);
        endDate.setHours(23, 59, 59); // End of day
        
        // If case is closed, check close date, otherwise check if it was opened before end date
        if (caseItem.closeDate) {
          if (caseItem.closeDate > endDate) {
            return false;
          }
        } else if (caseItem.openDate > endDate) {
          return false;
        }
      }

      // Investigator filtering
      if (filters.investigator && !caseItem.investigator.toLowerCase().includes(filters.investigator.toLowerCase())) {
        return false;
      }
    }

    return true;
  });

  const handleFilterChange = (key: keyof typeof filters, value: string) => {
    setFilters(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const handleExport = () => {
    alert('Exporting search results...');
    // In a real app, this would export the data to Access
  };

  return (
    <MainLayout>
      <header className="mb-6">
        <h1 className="text-3xl font-bold mb-2">Search Cases</h1>
        <p className="text-gray-600">Find and filter case records</p>
      </header>

      <Card className="mb-8">
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row gap-4 items-end mb-6">
            <div className="flex-1">
              <Label htmlFor="search" className="text-base">Search</Label>
              <div className="relative">
                <SearchIcon className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
                <Input
                  id="search"
                  placeholder="Search by case title, description, complainant, or facility..."
                  className="pl-9"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
            <Button 
              variant="outline" 
              onClick={() => setAdvancedSearch(!advancedSearch)}
              className="mb-px md:self-end whitespace-nowrap"
            >
              {advancedSearch ? 'Simple Search' : 'Advanced Search'}
            </Button>
          </div>

          {advancedSearch && (
            <>
              <Separator className="mb-6" />
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div>
                  <Label htmlFor="status-filter" className="text-base">Status</Label>
                  <Select 
                    value={filters.status} 
                    onValueChange={value => handleFilterChange('status', value)}
                  >
                    <SelectTrigger id="status-filter">
                      <SelectValue placeholder="All statuses" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">All Statuses</SelectItem>
                      {getAllCaseStatuses().map(status => (
                        <SelectItem key={status} value={status}>{status}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="category-filter" className="text-base">Category</Label>
                  <Select 
                    value={filters.category} 
                    onValueChange={value => handleFilterChange('category', value)}
                  >
                    <SelectTrigger id="category-filter">
                      <SelectValue placeholder="All categories" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">All Categories</SelectItem>
                      {getAllCaseCategories().map(category => (
                        <SelectItem key={category} value={category}>{category}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="agency-filter" className="text-base">Agency</Label>
                  <Select 
                    value={filters.agency} 
                    onValueChange={value => handleFilterChange('agency', value)}
                  >
                    <SelectTrigger id="agency-filter">
                      <SelectValue placeholder="All agencies" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">All Agencies</SelectItem>
                      {getAllAgencies().map(agency => (
                        <SelectItem key={agency} value={agency}>{agency}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="investigator" className="text-base">Investigator</Label>
                  <Input
                    id="investigator"
                    placeholder="Filter by investigator"
                    value={filters.investigator}
                    onChange={(e) => handleFilterChange('investigator', e.target.value)}
                  />
                </div>

                <div>
                  <Label htmlFor="start-date" className="text-base">From Date</Label>
                  <Input
                    id="start-date"
                    type="date"
                    value={filters.startDate}
                    onChange={(e) => handleFilterChange('startDate', e.target.value)}
                  />
                </div>

                <div>
                  <Label htmlFor="end-date" className="text-base">To Date</Label>
                  <Input
                    id="end-date"
                    type="date"
                    value={filters.endDate}
                    onChange={(e) => handleFilterChange('endDate', e.target.value)}
                  />
                </div>
              </div>
            </>
          )}

          <div className="flex justify-end">
            <Button onClick={handleExport}>
              <Download className="mr-2 h-4 w-4" />
              Export Results
            </Button>
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Search Results</h2>
        <span className="text-gray-600">{filteredCases.length} cases found</span>
      </div>

      {filteredCases.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCases.map(caseItem => (
            <CaseCard key={caseItem.id} caseData={caseItem} />
          ))}
        </div>
      ) : (
        <div className="bg-gray-50 border rounded-lg p-8 text-center">
          <h3 className="text-lg font-medium mb-2">No cases found</h3>
          <p className="text-gray-600 mb-4">Try adjusting your search criteria</p>
          <Button 
            variant="outline" 
            onClick={() => {
              setSearchTerm('');
              setFilters({
                status: '',
                category: '',
                agency: '',
                startDate: '',
                endDate: '',
                investigator: '',
              });
            }}
          >
            Clear Search
          </Button>
        </div>
      )}
    </MainLayout>
  );
};

export default SearchPage;
