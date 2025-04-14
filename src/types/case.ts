
export type CaseStatus = 'Open' | 'In Progress' | 'Closed';

export type ComplaintType = 'Individual' | 'Systemic';

export type CaseCategory = 
  | 'Poor Educational Services and Support'
  | 'Lack of Supervision'
  | 'Improper Restraint'
  | 'Inadequate Health and/or Medical Care'
  | 'Unsanitary Living Conditions'
  | 'Abuse by Staff'
  | 'Threats of Abuse by Staff'
  | 'Abuse by Peer'
  | 'Neglect'
  | 'Isolation'
  | 'Other';

export type Agency = 'DHS' | 'CBH' | 'DBHIDS';

export interface Case {
  id: string;
  title: string;
  description: string;
  complainantName: string;
  complainantContact: string;
  relatedParties: string;
  investigator: string;
  openDate: Date;
  closeDate?: Date;
  timeDuration?: number; // in days
  complaintType: ComplaintType;
  categories: CaseCategory[];
  facility: string;
  agenciesInvolved: Agency[];
  documents: Document[];
  updates: ChronologicalUpdate[];
  status: CaseStatus;
}

export interface Document {
  id: string;
  name: string;
  uploadDate: Date;
  fileUrl: string;
  fileType: string;
}

export interface ChronologicalUpdate {
  id: string;
  date: Date;
  agencyActionItems: string;
  oyoActionItems: string;
  nextSteps: string;
  caseStatus: CaseStatus;
}
