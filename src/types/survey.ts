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
}

export type FlowStep = 
  | 'requirement-selection'
  | 'geography-selection'
  | 'category-selection'
  | 'redirect-links-received'
  | 'live-links-generation'
  | 'screener-configuration'
  | 'flow-review'
  | 'flow-active'; 