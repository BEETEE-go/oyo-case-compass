
import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { formatDate, getCaseById, getStatusColor } from '@/data/mockData';
import { MainLayout } from '@/components/layout/MainLayout';
import { CaseStatusBadge } from '@/components/cases/CaseStatusBadge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { ChronologicalUpdate } from '@/types/case';
import { AlertCircle, Calendar, Download, FileText, User, Building, Clock, ArrowLeft, PlusCircle, FileUp } from 'lucide-react';

const CaseDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const caseData = getCaseById(id || '');
  
  const [newUpdate, setNewUpdate] = useState<Partial<ChronologicalUpdate>>({
    date: new Date(),
    agencyActionItems: '',
    oyoActionItems: '',
    nextSteps: '',
    caseStatus: caseData?.status || 'Open'
  });

  if (!caseData) {
    return (
      <MainLayout>
        <div className="flex flex-col items-center justify-center py-12">
          <AlertCircle className="h-12 w-12 text-red-500 mb-4" />
          <h1 className="text-2xl font-bold mb-2">Case Not Found</h1>
          <p className="text-gray-600 mb-6">We couldn't find the case you're looking for.</p>
          <Link to="/cases">
            <Button>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Cases
            </Button>
          </Link>
        </div>
      </MainLayout>
    );
  }

  // Calculate duration
  const duration = caseData.closeDate 
    ? Math.ceil((caseData.closeDate.getTime() - caseData.openDate.getTime()) / (1000 * 60 * 60 * 24))
    : Math.ceil((new Date().getTime() - caseData.openDate.getTime()) / (1000 * 60 * 60 * 24));

  // Mock functions - would connect to real data in production
  const handleExportToAccess = () => {
    alert('Exporting to Access...');
    // In a real app, this would generate an Access-compatible export
  };
  
  const handleUpdateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, this would save the update to the database
    alert('Update submitted');
  };

  return (
    <MainLayout>
      <div className="mb-6">
        <Link to="/cases" className="inline-flex items-center text-sm text-blue-600 hover:text-blue-800 mb-4">
          <ArrowLeft className="mr-1 h-4 w-4" />
          Back to all cases
        </Link>
        
        <div className="flex flex-col md:flex-row justify-between items-start gap-4">
          <div>
            <h1 className="text-2xl font-bold mb-2">{caseData.title}</h1>
            <div className="flex items-center gap-2 text-gray-500">
              <span>Case #{id?.substring(0, 8).toUpperCase()}</span>
              <span>•</span>
              <span>{caseData.facility}</span>
            </div>
          </div>
          
          <div className="flex gap-2">
            <Button variant="outline" onClick={handleExportToAccess}>
              <Download className="mr-2 h-4 w-4" />
              Export to Access
            </Button>
            <Link to={`/cases/${id}/edit`}>
              <Button>Edit Case</Button>
            </Link>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle className="text-xl">Case Details</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-medium text-gray-500 mb-1">Description</h3>
                <p>{caseData.description}</p>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h3 className="text-sm font-medium text-gray-500 mb-1">Complainant</h3>
                  <p>{caseData.complainantName}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500 mb-1">Contact Info</h3>
                  <p>{caseData.complainantContact}</p>
                </div>
              </div>
              
              <div>
                <h3 className="text-sm font-medium text-gray-500 mb-1">Related Parties</h3>
                <p>{caseData.relatedParties}</p>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h3 className="text-sm font-medium text-gray-500 mb-1">Complaint Type</h3>
                  <p>{caseData.complaintType}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500 mb-1">Agencies Involved</h3>
                  <div className="flex flex-wrap gap-1">
                    {caseData.agenciesInvolved.map(agency => (
                      <span key={agency} className="inline-flex items-center rounded-full bg-blue-100 px-2.5 py-0.5 text-xs font-medium text-blue-800">
                        {agency}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
              
              <div>
                <h3 className="text-sm font-medium text-gray-500 mb-1">Categories</h3>
                <div className="flex flex-wrap gap-1">
                  {caseData.categories.map(category => (
                    <span key={category} className="inline-flex items-center rounded-full bg-gray-100 px-2.5 py-0.5 text-xs font-medium text-gray-800">
                      {category}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-xl">Status Information</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-500">Status</span>
                <CaseStatusBadge status={caseData.status} />
              </div>
              
              <div className="flex items-center gap-2">
                <User className="h-4 w-4 text-gray-500" />
                <div>
                  <div className="text-sm text-gray-500">Investigator</div>
                  <div>{caseData.investigator}</div>
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                <Building className="h-4 w-4 text-gray-500" />
                <div>
                  <div className="text-sm text-gray-500">Facility</div>
                  <div>{caseData.facility}</div>
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-gray-500" />
                <div>
                  <div className="text-sm text-gray-500">Open Date</div>
                  <div>{formatDate(caseData.openDate)}</div>
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-gray-500" />
                <div>
                  <div className="text-sm text-gray-500">Close Date</div>
                  <div>{caseData.closeDate ? formatDate(caseData.closeDate) : 'Still Open'}</div>
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-gray-500" />
                <div>
                  <div className="text-sm text-gray-500">Duration</div>
                  <div>{duration} days</div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Documents Section */}
      <Card className="mb-8">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-xl">Documents</CardTitle>
          <Button size="sm">
            <FileUp className="mr-2 h-4 w-4" />
            Upload
          </Button>
        </CardHeader>
        <CardContent>
          {caseData.documents.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {caseData.documents.map(doc => (
                <div key={doc.id} className="flex items-center gap-3 p-3 border rounded-lg bg-gray-50 hover:bg-gray-100">
                  <FileText className="h-8 w-8 text-blue-500" />
                  <div>
                    <div className="font-medium">{doc.name}</div>
                    <div className="text-sm text-gray-500">
                      {formatDate(doc.uploadDate)}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              No documents attached to this case.
            </div>
          )}
        </CardContent>
      </Card>

      {/* Chronological Updates Section */}
      <Card className="mb-8">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-xl">Chronological Updates</CardTitle>
          <div>
            <Button size="sm" variant="outline">
              <PlusCircle className="mr-2 h-4 w-4" />
              Add Update
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {caseData.updates.map((update, index) => (
              <div key={update.id} className="relative pl-6 pb-6">
                {/* Timeline connector */}
                {index < caseData.updates.length - 1 && (
                  <div className="absolute top-6 bottom-0 left-3 w-px bg-gray-200" />
                )}
                
                {/* Timeline dot */}
                <div className="absolute top-1 left-0 w-6 h-6 rounded-full bg-blue-100 border-2 border-blue-500 z-10 flex items-center justify-center">
                  <span className="text-xs font-bold text-blue-500">{index + 1}</span>
                </div>
                
                <div className="bg-gray-50 rounded-lg p-4 border">
                  <div className="flex justify-between items-start mb-4">
                    <div className="font-medium">{formatDate(update.date)}</div>
                    <CaseStatusBadge status={update.caseStatus} />
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <h4 className="text-sm font-medium text-gray-500 mb-1">Agency Action Items</h4>
                      <p className="text-sm">{update.agencyActionItems}</p>
                    </div>
                    
                    <div>
                      <h4 className="text-sm font-medium text-gray-500 mb-1">OYO Action Items</h4>
                      <p className="text-sm">{update.oyoActionItems}</p>
                    </div>
                    
                    <div>
                      <h4 className="text-sm font-medium text-gray-500 mb-1">Next Steps</h4>
                      <p className="text-sm">{update.nextSteps}</p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </MainLayout>
  );
};

export default CaseDetail;
