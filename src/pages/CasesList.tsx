
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { MainLayout } from '@/components/layout/MainLayout';
import { Button } from '@/components/ui/button';
import { CaseCard } from '@/components/cases/CaseCard';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { CaseStatus, CaseCategory, Agency, ComplaintType } from '@/types/case';
import { mockCases, getAllCaseStatuses, getAllCaseCategories, getAllAgencies, getAllComplaintTypes } from '@/data/mockData';
import { FilePlus, Filter, Search, X } from 'lucide-react';

const CasesList: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState<{
    status: CaseStatus | '';
    category: CaseCategory | '';
    agency: Agency | '';
    complaintType: ComplaintType | '';
  }>({
    status: '',
    category: '',
    agency: '',
    complaintType: '',
  });
  const [showFilters, setShowFilters] = useState(false);

  // Filter cases based on search term and filters
  const filteredCases = mockCases.filter(caseItem => {
    // Search term filtering
    if (searchTerm && !caseItem.title.toLowerCase().includes(searchTerm.toLowerCase()) &&
        !caseItem.description.toLowerCase().includes(searchTerm.toLowerCase()) &&
        !caseItem.complainantName.toLowerCase().includes(searchTerm.toLowerCase()) &&
        !caseItem.facility.toLowerCase().includes(searchTerm.toLowerCase())) {
      return false;
    }

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

    // Complaint type filtering
    if (filters.complaintType && caseItem.complaintType !== filters.complaintType) {
      return false;
    }

    return true;
  });

  const handleFilterChange = (key: keyof typeof filters, value: string) => {
    setFilters(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const clearFilters = () => {
    setFilters({
      status: '',
      category: '',
      agency: '',
      complaintType: '',
    });
    setSearchTerm('');
  };

  const hasActiveFilters = Object.values(filters).some(v => v !== '') || searchTerm !== '';

  return (
    <MainLayout>
      <header className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold mb-2">Cases</h1>
          <p className="text-gray-600">Manage and track all case records</p>
        </div>
        <Link to="/cases/new">
          <Button>
            <FilePlus className="mr-2 h-4 w-4" />
            New Case
          </Button>
        </Link>
      </header>

      <div className="bg-white rounded-lg border shadow-sm p-4 mb-8">
        <div className="flex flex-col md:flex-row gap-4 items-end">
          <div className="flex-1">
            <Label htmlFor="search">Search Cases</Label>
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
              <Input
                id="search"
                placeholder="Search by title, description, complainant or facility..."
                className="pl-9"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
          <Button 
            variant="outline" 
            onClick={() => setShowFilters(!showFilters)}
            className="mb-px md:self-end"
          >
            <Filter className="mr-2 h-4 w-4" />
            {showFilters ? 'Hide Filters' : 'Show Filters'}
          </Button>
          {hasActiveFilters && (
            <Button 
              variant="ghost" 
              onClick={clearFilters}
              className="mb-px md:self-end"
            >
              <X className="mr-2 h-4 w-4" />
              Clear
            </Button>
          )}
        </div>

        {showFilters && (
          <div className="mt-4 grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <Label htmlFor="status-filter">Status</Label>
              <Select 
                value={filters.status} 
                onValueChange={value => handleFilterChange('status', value)}
              >
                <SelectTrigger id="status-filter">
                  <SelectValue placeholder="Select status" />
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
              <Label htmlFor="category-filter">Category</Label>
              <Select 
                value={filters.category} 
                onValueChange={value => handleFilterChange('category', value)}
              >
                <SelectTrigger id="category-filter">
                  <SelectValue placeholder="Select category" />
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
              <Label htmlFor="agency-filter">Agency</Label>
              <Select 
                value={filters.agency} 
                onValueChange={value => handleFilterChange('agency', value)}
              >
                <SelectTrigger id="agency-filter">
                  <SelectValue placeholder="Select agency" />
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
              <Label htmlFor="complaint-type-filter">Complaint Type</Label>
              <Select 
                value={filters.complaintType} 
                onValueChange={value => handleFilterChange('complaintType', value)}
              >
                <SelectTrigger id="complaint-type-filter">
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">All Types</SelectItem>
                  {getAllComplaintTypes().map(type => (
                    <SelectItem key={type} value={type}>{type}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        )}
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
          <p className="text-gray-600 mb-4">Try adjusting your search or filters</p>
          <Button variant="outline" onClick={clearFilters}>Clear Filters</Button>
        </div>
      )}
    </MainLayout>
  );
};

export default CasesList;
