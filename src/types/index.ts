export type PreparationStage =
  | 'application_created'
  | 'requirements_reviewed'
  | 'documents_collected'
  | 'document_checks_completed'
  | 'application_submitted'
  | 'biometrics_appointment'
  | 'decision_received';

export interface StageInfo {
  id: PreparationStage;
  label: string;
  description: string;
  stepNumber: number;
}

export const PREPARATION_STAGES: StageInfo[] = [
  {
    id: 'application_created',
    label: 'Application Created',
    description: 'Initial application profile established and destination chosen',
    stepNumber: 1,
  },
  {
    id: 'requirements_reviewed',
    label: 'Requirements Reviewed',
    description: 'Destination rules, financial requirements and eligibility confirmed',
    stepNumber: 2,
  },
  {
    id: 'documents_collected',
    label: 'Documents Collected',
    description: 'Mandatory personal, financial, and travel documents gathered',
    stepNumber: 3,
  },
  {
    id: 'document_checks_completed',
    label: 'Document Checks Completed',
    description: 'Checklist verified, bank statements stamped, translations validated',
    stepNumber: 4,
  },
  {
    id: 'application_submitted',
    label: 'Application Submitted',
    description: 'Official application submitted via portal (e.g. UKVI, IRCC Portal)',
    stepNumber: 5,
  },
  {
    id: 'biometrics_appointment',
    label: 'Biometrics / Appointment',
    description: 'Biometrics enrolled at VAC (VFS Global / TLScontact)',
    stepNumber: 6,
  },
  {
    id: 'decision_received',
    label: 'Decision Received',
    description: 'Passport returned or electronic visa notice issued',
    stepNumber: 7,
  },
];

export interface ChecklistItem {
  id: string;
  category: 'Identity' | 'Financial' | 'Employment' | 'Travel' | 'Supporting';
  title: string;
  description: string;
  officialSpec: string;
  isRequired: boolean;
  isCompleted: boolean;
  documentId?: string;
  documentName?: string;
  documentUrl?: string;
  uploadedAt?: string;
  notes?: string;
  status: 'pending' | 'uploaded' | 'verified' | 'action_needed';
}

export interface VisaApplication {
  id: string;
  destination: 'Canada' | 'United Kingdom' | 'Schengen Area' | string;
  destinationFlag: string;
  destinationCity?: string;
  visaCategory: 'Visitor or tourism' | 'Business visit' | 'Study' | 'Work' | 'Other';
  passportNationality: string;
  countryOfResidence: string;
  purposeOfTravel: string;
  intendedDepartureDate: string;
  intendedReturnDate: string;
  lengthOfStay: string;
  currentStage: PreparationStage;
  stageTimestamps: Record<string, string>;
  stageNotes?: Record<string, string>;
  appointmentDate?: string;
  appointmentLocation?: string;
  trackingReference?: string;
  notes: string;
  checklist: ChecklistItem[];
  createdAt: string;
  updatedAt: string;
}

export interface DocumentItem {
  id: string;
  applicationId?: string;
  applicationTitle?: string;
  category: 'Identity' | 'Financial' | 'Employment' | 'Travel' | 'Supporting';
  name: string;
  fileType: string;
  sizeBytes: number;
  uploadDate: string;
  dataUrl?: string;
  notes?: string;
  isSample: boolean;
}

export interface PassportData {
  surname: string;
  givenNames: string;
  passportNumber: string;
  nationality: string;
  dateOfBirth: string;
  expiryDate: string;
  issueDate: string;
  sex: string;
  isConfirmed: boolean;
  scanImageUrl?: string;
  lastScannedAt?: string;
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'ai';
  text: string;
  timestamp: string;
  isDemo?: boolean;
  attachedDocumentName?: string;
}

export interface UserProfile {
  fullName: string;
  email: string;
  phone: string;
  passportNationality: string;
  countryOfResidence: string;
  passportData: PassportData;
  notificationPreferences: {
    deadlineAlerts: boolean;
    appointmentReminders: boolean;
    checklistProgress: boolean;
  };
  privacySettings: {
    localDataOnly: boolean;
    biometricLock: boolean;
  };
}

export type ActiveTab = 'home' | 'applications' | 'documents' | 'assistant' | 'profile';
