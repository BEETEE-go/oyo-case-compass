
import { Agency, Case, CaseCategory, CaseStatus, ChronologicalUpdate, ComplaintType, Document } from '@/types/case';
import { format } from 'date-fns';

// Helper function to create a unique ID
const createId = (): string => Math.random().toString(36).substr(2, 9);

// Mock documents
const createMockDocuments = (): Document[] => {
  return [
    {
      id: createId(),
      name: 'Initial Complaint Form.pdf',
      uploadDate: new Date(2023, 5, 15),
      fileUrl: '/documents/complaint-form.pdf',
      fileType: 'application/pdf'
    },
    {
      id: createId(),
      name: 'Medical Records.pdf',
      uploadDate: new Date(2023, 5, 18),
      fileUrl: '/documents/medical-records.pdf',
      fileType: 'application/pdf'
    },
    {
      id: createId(),
      name: 'Witness Statement.docx',
      uploadDate: new Date(2023, 5, 20),
      fileUrl: '/documents/witness-statement.docx',
      fileType: 'application/docx'
    }
  ];
};

// Mock chronological updates
const createMockUpdates = (): ChronologicalUpdate[] => {
  return [
    {
      id: createId(),
      date: new Date(2023, 5, 15),
      agencyActionItems: 'DHS to provide documentation on supervision protocols.',
      oyoActionItems: 'Schedule interview with complainant.',
      nextSteps: 'Follow up with facility director by end of week.',
      caseStatus: 'Open'
    },
    {
      id: createId(),
      date: new Date(2023, 5, 22),
      agencyActionItems: 'DHS submitted supervision protocols. CBH to provide medical care records.',
      oyoActionItems: 'Review protocols for compliance with standards.',
      nextSteps: 'Interview facility staff members.',
      caseStatus: 'In Progress'
    },
    {
      id: createId(),
      date: new Date(2023, 6, 5),
      agencyActionItems: 'All agencies submitted required documentation.',
      oyoActionItems: 'Complete analysis of collected evidence.',
      nextSteps: 'Prepare preliminary findings report.',
      caseStatus: 'In Progress'
    }
  ];
};

// Create mock cases
export const mockCases: Case[] = [
  {
    id: createId(),
    title: 'Inadequate Supervision at Pinecrest Youth Center',
    description: 'Multiple reports of youth left unsupervised during evening hours, resulting in peer conflict.',
    complainantName: 'Jane Smith',
    complainantContact: 'jsmith@email.com | 215-555-0123',
    relatedParties: 'Pinecrest Youth Center Staff, Residential Youth',
    investigator: 'Alex Johnson',
    openDate: new Date(2023, 5, 15),
    complaintType: 'Individual',
    categories: ['Lack of Supervision', 'Abuse by Peer'],
    facility: 'Pinecrest Youth Center',
    agenciesInvolved: ['DHS', 'CBH'],
    documents: createMockDocuments(),
    updates: createMockUpdates(),
    status: 'In Progress'
  },
  {
    id: createId(),
    title: 'Unsanitary Conditions at Riverdale Group Home',
    description: 'Reports of mold, pest infestation, and general unsanitary conditions in youth living areas.',
    complainantName: 'Michael Rodriguez',
    complainantContact: 'mrodriguez@email.com | 215-555-0187',
    relatedParties: 'Riverdale Group Home Administration',
    investigator: 'Taylor Williams',
    openDate: new Date(2023, 3, 10),
    closeDate: new Date(2023, 4, 25),
    timeDuration: 45,
    complaintType: 'Systemic',
    categories: ['Unsanitary Living Conditions', 'Neglect'],
    facility: 'Riverdale Group Home',
    agenciesInvolved: ['DHS', 'DBHIDS'],
    documents: createMockDocuments(),
    updates: createMockUpdates(),
    status: 'Closed'
  },
  {
    id: createId(),
    title: 'Educational Services Denial at Westside Shelter',
    description: 'Youth residents not receiving legally mandated educational services during extended stays.',
    complainantName: 'Sarah Johnson',
    complainantContact: 'sjohnson@email.com | 215-555-0133',
    relatedParties: 'Westside Shelter Staff, School District Liaison',
    investigator: 'Marcus Lee',
    openDate: new Date(2023, 6, 5),
    complaintType: 'Systemic',
    categories: ['Poor Educational Services and Support'],
    facility: 'Westside Emergency Youth Shelter',
    agenciesInvolved: ['DHS', 'DBHIDS'],
    documents: createMockDocuments(),
    updates: createMockUpdates(),
    status: 'Open'
  },
  {
    id: createId(),
    title: 'Medical Care Issues at Eastwood Residential',
    description: 'Allegations that prescribed medications are not being administered properly or consistently.',
    complainantName: 'David Thompson',
    complainantContact: 'dthompson@email.com | 215-555-0144',
    relatedParties: 'Eastwood Medical Staff, Youth Resident',
    investigator: 'Jasmine Chen',
    openDate: new Date(2023, 4, 20),
    complaintType: 'Individual',
    categories: ['Inadequate Health and/or Medical Care'],
    facility: 'Eastwood Residential Treatment Center',
    agenciesInvolved: ['CBH', 'DBHIDS'],
    documents: createMockDocuments(),
    updates: createMockUpdates(),
    status: 'In Progress'
  }
];

// Helper functions

export const getCaseById = (id: string): Case | undefined => {
  return mockCases.find(c => c.id === id);
};

export const getStatusColor = (status: CaseStatus): string => {
  switch (status) {
    case 'Open':
      return 'bg-green-100 text-green-800 border-green-200';
    case 'In Progress':
      return 'bg-amber-100 text-amber-800 border-amber-200';
    case 'Closed':
      return 'bg-slate-100 text-slate-800 border-slate-200';
    default:
      return 'bg-gray-100 text-gray-800 border-gray-200';
  }
};

export const formatDate = (date: Date | undefined): string => {
  if (!date) return 'N/A';
  return format(date, 'MM/dd/yyyy');
};

export const calculateDuration = (openDate: Date, closeDate?: Date): number => {
  const end = closeDate || new Date();
  const diffTime = Math.abs(end.getTime() - openDate.getTime());
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
};

export const getAllCaseCategories = (): CaseCategory[] => [
  'Poor Educational Services and Support',
  'Lack of Supervision',
  'Improper Restraint',
  'Inadequate Health and/or Medical Care',
  'Unsanitary Living Conditions',
  'Abuse by Staff',
  'Threats of Abuse by Staff',
  'Abuse by Peer',
  'Neglect',
  'Isolation',
  'Other'
];

export const getAllAgencies = (): Agency[] => ['DHS', 'CBH', 'DBHIDS'];

export const getAllComplaintTypes = (): ComplaintType[] => ['Individual', 'Systemic'];

export const getAllCaseStatuses = (): CaseStatus[] => ['Open', 'In Progress', 'Closed'];
