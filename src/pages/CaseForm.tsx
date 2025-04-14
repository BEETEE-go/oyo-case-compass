
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MainLayout } from '@/components/layout/MainLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { 
  getAllCaseCategories, 
  getAllAgencies, 
  getAllComplaintTypes, 
  getAllCaseStatuses 
} from '@/data/mockData';
import { Calendar, Clock, FileUp, Save, X } from 'lucide-react';

const CaseForm: React.FC = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    complainantName: '',
    complainantContact: '',
    relatedParties: '',
    investigator: '',
    openDate: new Date().toISOString().split('T')[0],
    closeDate: '',
    complaintType: 'Individual',
    categories: [] as string[],
    facility: '',
    agenciesInvolved: [] as string[],
    status: 'Open'
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleCheckboxChange = (name: string, value: string, checked: boolean) => {
    if (checked) {
      setFormData(prev => ({
        ...prev,
        [name]: [...prev[name as keyof typeof prev] as string[], value]
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: (prev[name as keyof typeof prev] as string[]).filter(v => v !== value)
      }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation
    if (!formData.title || !formData.complainantName || !formData.openDate) {
      alert('Please fill in all required fields');
      return;
    }

    if (formData.closeDate && new Date(formData.closeDate) < new Date(formData.openDate)) {
      alert('Close date cannot be before open date');
      return;
    }

    // In a real app, this would save to a database
    console.log('Form submitted:', formData);
    alert('Case created successfully!');
    navigate('/cases');
  };

  const handleCancel = () => {
    if (confirm('Are you sure you want to cancel? All changes will be lost.')) {
      navigate('/cases');
    }
  };

  return (
    <MainLayout>
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2">Create New Case</h1>
        <p className="text-gray-600">Enter details for the new case record</p>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="md:col-span-2">
            <CardHeader>
              <CardTitle className="text-xl">Case Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="title" className="text-base">
                  Case Title <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="title"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  placeholder="Enter a descriptive title for the case"
                  required
                />
              </div>

              <div>
                <Label htmlFor="description" className="text-base">
                  Case Description <span className="text-red-500">*</span>
                </Label>
                <Textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  placeholder="Provide details about the case"
                  className="min-h-[100px]"
                  required
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="complainantName" className="text-base">
                    Complainant Name <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="complainantName"
                    name="complainantName"
                    value={formData.complainantName}
                    onChange={handleChange}
                    placeholder="Full name of complainant"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="complainantContact" className="text-base">
                    Complainant Contact Info
                  </Label>
                  <Input
                    id="complainantContact"
                    name="complainantContact"
                    value={formData.complainantContact}
                    onChange={handleChange}
                    placeholder="Email, phone number, or other contact info"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="relatedParties" className="text-base">
                  Related Parties
                </Label>
                <Input
                  id="relatedParties"
                  name="relatedParties"
                  value={formData.relatedParties}
                  onChange={handleChange}
                  placeholder="Others involved in this case"
                />
              </div>

              <div>
                <Label htmlFor="facility" className="text-base">
                  Facility Name <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="facility"
                  name="facility"
                  value={formData.facility}
                  onChange={handleChange}
                  placeholder="Name of the facility involved"
                  required
                />
              </div>

              <div>
                <Label htmlFor="investigator" className="text-base">
                  OYO Primary Investigator <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="investigator"
                  name="investigator"
                  value={formData.investigator}
                  onChange={handleChange}
                  placeholder="Name of the assigned investigator"
                  required
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-xl">Status & Dates</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="status" className="text-base">
                  Case Status
                </Label>
                <Select
                  value={formData.status}
                  onValueChange={(value) => handleSelectChange('status', value)}
                >
                  <SelectTrigger id="status">
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    {getAllCaseStatuses().map(status => (
                      <SelectItem key={status} value={status}>{status}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="complaintType" className="text-base">
                  Complaint Type
                </Label>
                <Select
                  value={formData.complaintType}
                  onValueChange={(value) => handleSelectChange('complaintType', value)}
                >
                  <SelectTrigger id="complaintType">
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    {getAllComplaintTypes().map(type => (
                      <SelectItem key={type} value={type}>{type}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center gap-2">
                <Calendar className="text-gray-500" />
                <div className="flex-1">
                  <Label htmlFor="openDate" className="text-base">
                    Open Date <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="openDate"
                    name="openDate"
                    type="date"
                    value={formData.openDate}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Calendar className="text-gray-500" />
                <div className="flex-1">
                  <Label htmlFor="closeDate" className="text-base">
                    Close Date
                  </Label>
                  <Input
                    id="closeDate"
                    name="closeDate"
                    type="date"
                    value={formData.closeDate}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Clock className="text-gray-500" />
                <div className="flex-1">
                  <Label className="text-base">Case Duration</Label>
                  <div className="text-gray-700">
                    {formData.closeDate 
                      ? Math.ceil((new Date(formData.closeDate).getTime() - new Date(formData.openDate).getTime()) / (1000 * 60 * 60 * 24)) + ' days'
                      : 'Still open'
                    }
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="text-xl">Case Categories & Agencies</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div>
                <Label className="text-base mb-2 block">
                  Case Categories (Select all that apply) <span className="text-red-500">*</span>
                </Label>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-4 gap-y-2">
                  {getAllCaseCategories().map(category => (
                    <div key={category} className="flex items-center space-x-2">
                      <Checkbox 
                        id={`category-${category}`}
                        checked={formData.categories.includes(category)}
                        onCheckedChange={(checked) => 
                          handleCheckboxChange('categories', category, checked as boolean)
                        }
                      />
                      <Label htmlFor={`category-${category}`} className="text-sm font-normal">
                        {category}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>

              <Separator />

              <div>
                <Label className="text-base mb-2 block">
                  Agencies Involved (Select all that apply)
                </Label>
                <div className="flex flex-wrap gap-4">
                  {getAllAgencies().map(agency => (
                    <div key={agency} className="flex items-center space-x-2">
                      <Checkbox 
                        id={`agency-${agency}`}
                        checked={formData.agenciesInvolved.includes(agency)}
                        onCheckedChange={(checked) => 
                          handleCheckboxChange('agenciesInvolved', agency, checked as boolean)
                        }
                      />
                      <Label htmlFor={`agency-${agency}`} className="text-sm font-normal">
                        {agency}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="text-xl">Documents</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center py-12 border-2 border-dashed rounded-lg">
              <FileUp className="h-12 w-12 mx-auto text-gray-400 mb-2" />
              <h3 className="text-lg font-medium mb-1">Upload Documents</h3>
              <p className="text-gray-500 mb-4">Drag and drop files here or click to browse</p>
              <Button type="button" variant="outline">
                Select Files
              </Button>
              <div className="mt-2 text-xs text-gray-500">
                Supports PDF, Word, Excel, and image files
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-end gap-3 mb-8">
          <Button type="button" variant="outline" onClick={handleCancel}>
            <X className="mr-2 h-4 w-4" />
            Cancel
          </Button>
          <Button type="submit">
            <Save className="mr-2 h-4 w-4" />
            Save Case
          </Button>
        </div>
      </form>
    </MainLayout>
  );
};

export default CaseForm;
