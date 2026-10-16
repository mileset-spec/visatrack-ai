import { VisaApplication, DocumentItem, UserProfile, ChecklistItem } from '../types';

export const DESTINATION_OPTIONS = [
  {
    id: 'United Kingdom',
    name: 'United Kingdom',
    flag: '🇬🇧',
    badge: 'UKVI Standard Visitor',
    avgProcessingWeeks: '3 - 6 weeks',
    visaFeeUSD: 'approx. £115',
    embassyLiaison: 'British High Commission (Abuja & Lagos TLScontact)',
    popularCities: ['London', 'Manchester', 'Birmingham', 'Edinburgh'],
  },
  {
    id: 'Canada',
    name: 'Canada',
    flag: '🇨🇦',
    badge: 'IRCC Temporary Resident Visa',
    avgProcessingWeeks: '4 - 8 weeks',
    visaFeeUSD: 'CAD $100 + Biometrics $85',
    embassyLiaison: 'Canadian High Commission (VFS Global Lagos & Abuja)',
    popularCities: ['Toronto', 'Vancouver', 'Calgary', 'Montreal'],
  },
  {
    id: 'Schengen Area',
    name: 'Schengen Area (France, Germany, etc.)',
    flag: '🇪🇺',
    badge: 'Uniform Schengen Short-Stay Type C',
    avgProcessingWeeks: '15 - 45 calendar days',
    visaFeeUSD: '€90 (Adults)',
    embassyLiaison: 'VFS Global / TLScontact (Country consulate specific)',
    popularCities: ['Paris', 'Berlin', 'Rome', 'Amsterdam'],
  },
];

export const VISA_CATEGORIES = [
  { id: 'Visitor or tourism', title: 'Visitor or Tourism', desc: 'Holiday, leisure, visiting family or friends' },
  { id: 'Business visit', title: 'Business Visit', desc: 'Conferences, client meetings, short negotiations' },
  { id: 'Study', title: 'Study', desc: 'Undergraduate, Master’s, exchange or short course' },
  { id: 'Work', title: 'Work', desc: 'Skilled worker, intra-company transfer, temporary permit' },
  { id: 'Other', title: 'Other Applicable Category', desc: 'Medical treatment, transit, or sports/cultural events' },
] as const;

export function generateDefaultChecklist(destination: string, category: string): ChecklistItem[] {
  const isUK = destination.toLowerCase().includes('united kingdom') || destination.toLowerCase().includes('uk');
  const isCanada = destination.toLowerCase().includes('canada');
  const isSchengen = destination.toLowerCase().includes('schengen');

  return [
    {
      id: 'doc-passport',
      category: 'Identity',
      title: 'Current International Passport',
      description: 'Original biometric Nigerian passport with at least 6 months validity from intended departure date and at least two blank facing visa pages.',
      officialSpec: isUK
        ? 'UKVI Specification: Machine-readable biometric passport.'
        : isCanada
        ? 'IRCC Specification: Scan of biographical page and all previous stamped pages.'
        : 'Schengen: Issued within the last 10 years and valid for at least 3 months past intended departure.',
      isRequired: true,
      isCompleted: true,
      documentName: 'Passport_Bio_Page_AdebayoS.pdf',
      uploadedAt: '2026-10-10',
      status: 'verified',
      notes: 'Nigerian Biometric Passport valid until June 2031.',
    },
    {
      id: 'doc-photo',
      category: 'Identity',
      title: 'Passport Photograph',
      description: 'Recent colored photograph taken within the last 6 months against an off-white or light grey background, neutral facial expression.',
      officialSpec: isCanada
        ? '35mm x 45mm, head height 31mm to 36mm.'
        : isUK
        ? '45mm x 35mm compliant with UKVI photo specifications.'
        : '35mm x 45mm, ICAO compliant European biometric standards.',
      isRequired: true,
      isCompleted: true,
      documentName: 'Passport_Spec_Photo_2026.jpg',
      uploadedAt: '2026-10-11',
      status: 'verified',
      notes: 'Studio captured with clean white background, meets 35x45mm.',
    },
    {
      id: 'doc-bank-statement',
      category: 'Financial',
      title: '6-Month Stamped Commercial Bank Statement',
      description: 'Official bank statement showing continuous regular income or salary credits matching stated occupation. Must bear bank stamp and seal.',
      officialSpec: 'Official bank stamp on every sheet. Crucial: Include written explanations and receipts for any irregular single deposits over ₦500,000.',
      isRequired: true,
      isCompleted: true,
      documentName: 'GTBank_Salary_Account_6M_Stamped.pdf',
      uploadedAt: '2026-10-12',
      status: 'verified',
      notes: 'Stamped by GTBank Victoria Island Branch. Closing balance shows ₦7.4M.',
    },
    {
      id: 'doc-employment',
      category: 'Employment',
      title: 'Employer Introduction Letter & Leave Approval',
      description: 'Signed letter on official company letterhead detailing your job role, start date, gross annual remuneration, and explicit dates of approved annual leave.',
      officialSpec: 'Must include company registration number (CAC), HR signatory contact details, and confirmation of continued employment upon return.',
      isRequired: true,
      isCompleted: true,
      documentName: 'Employer_Introduction_Letter_Signed.pdf',
      uploadedAt: '2026-10-12',
      status: 'verified',
      notes: 'Signed by Chief HR Officer with official seal.',
    },
    {
      id: 'doc-payslips',
      category: 'Financial',
      title: 'Last 3 to 6 Months Payslips',
      description: 'Recent payslips corresponding exactly to the salary deposits reflected in your primary bank statement.',
      officialSpec: 'Salary line item must match the transaction narration in your bank statement.',
      isRequired: category.includes('Visitor') || category.includes('Work'),
      isCompleted: true,
      documentName: 'Payslips_May_to_Sep_2026.pdf',
      uploadedAt: '2026-10-13',
      status: 'verified',
      notes: 'Verified net monthly pay ₦650,000 matching GTBank inflow.',
    },
    {
      id: 'doc-accommodation',
      category: 'Travel',
      title: 'Accommodation Booking or Host Invitation',
      description: 'Confirmed hotel booking for the duration of stay, or an invitation letter from a resident host with their proof of address and status.',
      officialSpec: isSchengen
        ? 'Fully documented accommodation voucher with reservation code for all nights in the Schengen territory.'
        : 'Hotel reservation or tenancy agreement/council tax bill of host.',
      isRequired: true,
      isCompleted: false,
      status: 'action_needed',
      notes: 'Pending final hotel booking reservation in London/Central area.',
    },
    {
      id: 'doc-flight-itinerary',
      category: 'Travel',
      title: 'Provisional Flight Reservation / Travel Itinerary',
      description: 'Round-trip flight reservation showing intended arrival and departure dates. Do NOT purchase actual non-refundable tickets prior to visa decision.',
      officialSpec: 'Provisional booking or travel agent PNR. Embassies strongly advise against non-refundable ticket purchases prior to visa issuance.',
      isRequired: true,
      isCompleted: false,
      status: 'pending',
      notes: 'Travel agent reservation on British Airways pending selection.',
    },
    {
      id: 'doc-ties-home',
      category: 'Supporting',
      title: 'Proof of Strong Ties to Nigeria (Economic & Social)',
      description: 'Documentation demonstrating compelling reasons to return to Nigeria upon trip conclusion (e.g., family ties, marriage certificate, property deeds, long-term tenancy, business holdings).',
      officialSpec: 'Essential for overcoming Section 214(b) / IRCC 179(b) / UKVI V4.2 presumption of non-return.',
      isRequired: true,
      isCompleted: false,
      status: 'pending',
      notes: 'Need to upload marriage certificate and Lagos residential tenancy agreement.',
    },
  ];
}

export const INITIAL_APPLICATIONS: VisaApplication[] = [
  {
    id: 'app-uk-2026-001',
    destination: 'United Kingdom',
    destinationFlag: '🇬🇧',
    destinationCity: 'London',
    visaCategory: 'Visitor or tourism',
    passportNationality: 'Nigerian',
    countryOfResidence: 'Nigeria',
    purposeOfTravel: 'Tourism, London Tech Week exhibition, and visiting university alumnus friends',
    intendedDepartureDate: '2026-11-20',
    intendedReturnDate: '2026-12-05',
    lengthOfStay: '15 Days',
    currentStage: 'documents_collected',
    stageTimestamps: {
      application_created: '2026-10-01T09:30:00Z',
      requirements_reviewed: '2026-10-03T14:15:00Z',
      documents_collected: '2026-10-12T16:45:00Z',
    },
    stageNotes: {
      application_created: 'Created UKVI standard visitor tracker.',
      requirements_reviewed: 'Verified 6-month bank statement rules and employer leave policy.',
      documents_collected: 'Passport, photo, bank statement, payslips, and employer letter verified. Accommodation booking pending.',
    },
    appointmentDate: '2026-10-28',
    appointmentLocation: 'TLScontact Visa Application Centre, Victoria Island, Lagos',
    trackingReference: 'GWF-098231452',
    notes: 'Aiming for priority submission at Lagos TLScontact. Hotel booking reservation to be finalized this weekend.',
    checklist: generateDefaultChecklist('United Kingdom', 'Visitor or tourism'),
    createdAt: '2026-10-01T09:30:00.000Z',
    updatedAt: '2026-10-14T11:20:00.000Z',
  },
];

export const INITIAL_DOCUMENTS: DocumentItem[] = [
  {
    id: 'doc-item-01',
    applicationId: 'app-uk-2026-001',
    applicationTitle: 'UK Standard Visitor (London)',
    category: 'Identity',
    name: 'Passport_Bio_Page_AdebayoS.pdf',
    fileType: 'PDF Document',
    sizeBytes: 1450000,
    uploadDate: '2026-10-10',
    notes: 'Verified biometric page with clear MRZ barcode lines.',
    isSample: true,
  },
  {
    id: 'doc-item-02',
    applicationId: 'app-uk-2026-001',
    applicationTitle: 'UK Standard Visitor (London)',
    category: 'Identity',
    name: 'Passport_Spec_Photo_2026.jpg',
    fileType: 'JPEG Image',
    sizeBytes: 820000,
    uploadDate: '2026-10-11',
    notes: '35x45mm compliant photograph.',
    isSample: true,
  },
  {
    id: 'doc-item-03',
    applicationId: 'app-uk-2026-001',
    applicationTitle: 'UK Standard Visitor (London)',
    category: 'Financial',
    name: 'GTBank_Salary_Account_6M_Stamped.pdf',
    fileType: 'PDF Document',
    sizeBytes: 3200000,
    uploadDate: '2026-10-12',
    notes: 'Official bank stamp on each page, April to September 2026.',
    isSample: true,
  },
  {
    id: 'doc-item-04',
    applicationId: 'app-uk-2026-001',
    applicationTitle: 'UK Standard Visitor (London)',
    category: 'Employment',
    name: 'Employer_Introduction_Letter_Signed.pdf',
    fileType: 'PDF Document',
    sizeBytes: 980000,
    uploadDate: '2026-10-12',
    notes: 'Signed by Chief HR Officer with corporate seal.',
    isSample: true,
  },
  {
    id: 'doc-item-05',
    applicationId: 'app-uk-2026-001',
    applicationTitle: 'UK Standard Visitor (London)',
    category: 'Financial',
    name: 'Payslips_May_to_Sep_2026.pdf',
    fileType: 'PDF Document',
    sizeBytes: 1100000,
    uploadDate: '2026-10-13',
    notes: '5 consecutive monthly payslips corresponding to bank salary deposits.',
    isSample: true,
  },
];

export const INITIAL_USER_PROFILE: UserProfile = {
  fullName: 'Amaka S. Adebayo',
  email: 'amaka.adebayo@example.ng',
  phone: '+234 803 555 0192',
  passportNationality: 'Nigerian',
  countryOfResidence: 'Nigeria',
  passportData: {
    surname: 'ADEBAYO',
    givenNames: 'AMAKA SIMISOLA',
    passportNumber: 'A09876543',
    nationality: 'NIGERIAN',
    dateOfBirth: '1992-06-18',
    expiryDate: '2031-06-17',
    issueDate: '2021-06-18',
    sex: 'F',
    isConfirmed: true,
    lastScannedAt: '2026-10-09',
  },
  notificationPreferences: {
    deadlineAlerts: true,
    appointmentReminders: true,
    checklistProgress: true,
  },
  privacySettings: {
    localDataOnly: true,
    biometricLock: false,
  },
};
