export interface Geography {
  id: string;
  name: string;
  code: string;
}

export interface Category {
  id: string;
  name: string;
  department: string;
}

export interface RedirectLink {
  id: string;
  url: string;
  label: string;
}

export interface LiveLink {
  id: string;
  url: string;
  label: string;
  geographyId?: string;
  categoryId?: string;
}

export interface PaymentConfig {
  liveLinkId: string;
  amount: number; // minimum 40
  expectedResponses: number;
  totalCost: number; // calculated: amount * expectedResponses
  // RLMV Pricing fields
  geography: string;
  category: string;
  seniority: 'Entry Level' | 'Manager' | 'Senior' | 'VP' | 'CXO';
  companySize: 'Small' | 'SME' | 'Mid Market' | 'Enterprise';
  loi: number; // Length of Interview in minutes
  basePriceUS: number; // Base US price before multipliers
  geographyMultiplier: number; // Country salary adjustment
  seniorityMultiplier: number;
  companySizeMultiplier: number;
  professionalPremium: number; // 1.5x
}

export interface ParticipantSelection {
  liveLinkId: string;
  selectedParticipants: string[]; // participant IDs
  criteria: string; // description of selection criteria
}

export interface Screener {
  id: string;
  questions: ScreenerQuestion[];
  categoryId?: string;
  geographyId?: string;
}

export interface ScreenerQuestion {
  id: string;
  question: string;
  type: 'single' | 'multiple' | 'text';
  options?: string[];
  required: boolean;
}

export interface SurveyFlow {
  id: string;
  requirementType: 1 | 2 | 3 | 4;
  name: string;
  geographies: Geography[];
  categories: Category[];
  redirectLinks: RedirectLink[];
  liveLinks: LiveLink[];
  screeners: Screener[];
  createdAt: Date;
  status: 'draft' | 'active' | 'completed';
}

export interface FlowRequirement {
  id: number;
  name: string;
  description: string;
  geographyCount: 'single' | 'multiple';
  categoryCount: 'single' | 'multiple';
  liveLinkPattern: 'single' | 'geo-based' | 'category-based' | 'geo-category-based';
  screenerPattern: 'single' | 'multiple';
}

// Flow state for managing the current step
export interface FlowState {
  currentStep: FlowStep;
  selectedRequirement?: FlowRequirement;
  selectedGeographies: Geography[];
  selectedCategories: Category[];
  redirectLinks: RedirectLink[];
  generatedLiveLinks: LiveLink[];
  configuredScreeners: Screener[];
  paymentConfigs: PaymentConfig[];
  participantSelections: ParticipantSelection[];
}

export type FlowStep = 
  | 'landing'
  | 'payment-configuration'
  | 'redirect-links-received'
  | 'live-links-generation'
  | 'screener-configuration'
  | 'participant-selection'
  | 'flow-review'
  | 'flow-active';

// RLMV Pricing Constants
export const SENIORITY_MULTIPLIERS = {
  'Entry Level': 1.5,
  'Manager': 2,
  'Senior': 2.7,
  'VP': 3.5,
  'CXO': 4.5
} as const;

export const COMPANY_SIZE_MULTIPLIERS = {
  'Small': 1,        // 0-50
  'SME': 1.2,        // 50-500
  'Mid Market': 1.4, // 500-5000
  'Enterprise': 1.6  // >5000
} as const;

export const GEOGRAPHY_SALARY_RATIOS = {
  'us': 1.0,    // Base (US = 1.0)
  'uk': 0.85,   // UK average salary / US average salary
  'ca': 0.75,   // Canada
  'au': 0.80,   // Australia
  'de': 0.70,   // Germany
  'fr': 0.65,   // France
  'jp': 0.60,   // Japan
  'br': 0.25    // Brazil
} as const;

export const PROFESSIONAL_PREMIUM = 1.5; 