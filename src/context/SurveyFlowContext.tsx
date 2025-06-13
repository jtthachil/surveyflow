import React, { createContext, useContext, useReducer, ReactNode } from 'react';
import { FlowState, FlowStep, FlowRequirement, Geography, Category, RedirectLink, LiveLink, Screener, PaymentConfig, ParticipantSelection } from '../types/survey';

interface SurveyFlowContextType {
  state: FlowState;
  dispatch: React.Dispatch<SurveyFlowAction>;
  // Helper functions
  setRequirement: (requirement: FlowRequirement) => void;
  setGeographies: (geographies: Geography[]) => void;
  setCategories: (categories: Category[]) => void;
  setRedirectLinks: (links: RedirectLink[]) => void;
  generateLiveLinks: () => void;
  setScreeners: (screeners: Screener[]) => void;
  setPaymentConfigs: (configs: PaymentConfig[]) => void;
  setParticipantSelections: (selections: ParticipantSelection[]) => void;
  nextStep: () => void;
  previousStep: () => void;
  goToStep: (step: FlowStep) => void;
}

type SurveyFlowAction = 
  | { type: 'SET_REQUIREMENT'; payload: FlowRequirement }
  | { type: 'SET_GEOGRAPHIES'; payload: Geography[] }
  | { type: 'SET_CATEGORIES'; payload: Category[] }
  | { type: 'SET_REDIRECT_LINKS'; payload: RedirectLink[] }
  | { type: 'SET_LIVE_LINKS'; payload: LiveLink[] }
  | { type: 'SET_SCREENERS'; payload: Screener[] }
  | { type: 'SET_PAYMENT_CONFIGS'; payload: PaymentConfig[] }
  | { type: 'SET_PARTICIPANT_SELECTIONS'; payload: ParticipantSelection[] }
  | { type: 'SET_STEP'; payload: FlowStep }
  | { type: 'NEXT_STEP' }
  | { type: 'PREVIOUS_STEP' }
  | { type: 'RESET_FLOW' };

const initialState: FlowState = {
  currentStep: 'requirement-selection',
  selectedGeographies: [],
  selectedCategories: [],
  redirectLinks: [],
  generatedLiveLinks: [],
  configuredScreeners: [],
  paymentConfigs: [],
  participantSelections: []
};

const flowSteps: FlowStep[] = [
  'requirement-selection',
  'geography-selection', 
  'category-selection',
  'redirect-links-received',
  'live-links-generation',
  'screener-configuration',
  'payment-configuration',
  'participant-selection',
  'flow-review',
  'flow-active'
];

function surveyFlowReducer(state: FlowState, action: SurveyFlowAction): FlowState {
  switch (action.type) {
    case 'SET_REQUIREMENT':
      return { ...state, selectedRequirement: action.payload };
    case 'SET_GEOGRAPHIES':
      return { ...state, selectedGeographies: action.payload };
    case 'SET_CATEGORIES':
      return { ...state, selectedCategories: action.payload };
    case 'SET_REDIRECT_LINKS':
      return { ...state, redirectLinks: action.payload };
    case 'SET_LIVE_LINKS':
      return { ...state, generatedLiveLinks: action.payload };
    case 'SET_SCREENERS':
      return { ...state, configuredScreeners: action.payload };
    case 'SET_PAYMENT_CONFIGS':
      return { ...state, paymentConfigs: action.payload };
    case 'SET_PARTICIPANT_SELECTIONS':
      return { ...state, participantSelections: action.payload };
    case 'SET_STEP':
      return { ...state, currentStep: action.payload };
    case 'NEXT_STEP': {
      const currentIndex = flowSteps.indexOf(state.currentStep);
      const nextIndex = Math.min(currentIndex + 1, flowSteps.length - 1);
      return { ...state, currentStep: flowSteps[nextIndex] };
    }
    case 'PREVIOUS_STEP': {
      const currentIndex = flowSteps.indexOf(state.currentStep);
      const prevIndex = Math.max(currentIndex - 1, 0);
      return { ...state, currentStep: flowSteps[prevIndex] };
    }
    case 'RESET_FLOW':
      return initialState;
    default:
      return state;
  }
}

const SurveyFlowContext = createContext<SurveyFlowContextType | undefined>(undefined);

export const SurveyFlowProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(surveyFlowReducer, initialState);

  const setRequirement = (requirement: FlowRequirement) => {
    dispatch({ type: 'SET_REQUIREMENT', payload: requirement });
  };

  const setGeographies = (geographies: Geography[]) => {
    dispatch({ type: 'SET_GEOGRAPHIES', payload: geographies });
  };

  const setCategories = (categories: Category[]) => {
    dispatch({ type: 'SET_CATEGORIES', payload: categories });
  };

  const setRedirectLinks = (links: RedirectLink[]) => {
    dispatch({ type: 'SET_REDIRECT_LINKS', payload: links });
  };

  const generateLiveLinks = () => {
    if (!state.selectedRequirement) return;

    const liveLinks: LiveLink[] = [];
    const aqxIdPlaceholder = '[id]'; // Use placeholder for participant ID
    
    switch (state.selectedRequirement.liveLinkPattern) {
      case 'single':
        liveLinks.push({
          id: 'live-1',
          url: `https://survey.example.com/live/single?aqx_id=${aqxIdPlaceholder}`,
          label: 'Main Survey Link'
        });
        break;
      case 'geo-based':
        state.selectedGeographies.forEach((geo, index) => {
          liveLinks.push({
            id: `live-geo-${geo.id}`,
            url: `https://survey.example.com/live/geo/${geo.code}?aqx_id=${aqxIdPlaceholder}`,
            label: `Survey Link for ${geo.name}`,
            geographyId: geo.id
          });
        });
        break;
      case 'category-based':
        state.selectedCategories.forEach((cat, index) => {
          liveLinks.push({
            id: `live-cat-${cat.id}`,
            url: `https://survey.example.com/live/category/${cat.id}?aqx_id=${aqxIdPlaceholder}`,
            label: `Survey Link for ${cat.name}`,
            categoryId: cat.id
          });
        });
        break;
      case 'geo-category-based':
        let linkIndex = 1;
        state.selectedGeographies.forEach((geo) => {
          state.selectedCategories.forEach((cat) => {
            liveLinks.push({
              id: `live-geo-cat-${geo.id}-${cat.id}`,
              url: `https://survey.example.com/live/geo/${geo.code}/cat/${cat.id}?aqx_id=${aqxIdPlaceholder}`,
              label: `Survey Link for ${geo.name} - ${cat.name}`,
              geographyId: geo.id,
              categoryId: cat.id
            });
            linkIndex++;
          });
        });
        break;
    }

    dispatch({ type: 'SET_LIVE_LINKS', payload: liveLinks });
  };

  const setScreeners = (screeners: Screener[]) => {
    dispatch({ type: 'SET_SCREENERS', payload: screeners });
  };

  const setPaymentConfigs = (configs: PaymentConfig[]) => {
    dispatch({ type: 'SET_PAYMENT_CONFIGS', payload: configs });
  };

  const setParticipantSelections = (selections: ParticipantSelection[]) => {
    dispatch({ type: 'SET_PARTICIPANT_SELECTIONS', payload: selections });
  };

  const nextStep = () => {
    dispatch({ type: 'NEXT_STEP' });
  };

  const previousStep = () => {
    dispatch({ type: 'PREVIOUS_STEP' });
  };

  const goToStep = (step: FlowStep) => {
    dispatch({ type: 'SET_STEP', payload: step });
  };

  const value = {
    state,
    dispatch,
    setRequirement,
    setGeographies,
    setCategories,
    setRedirectLinks,
    generateLiveLinks,
    setScreeners,
    setPaymentConfigs,
    setParticipantSelections,
    nextStep,
    previousStep,
    goToStep
  };

  return (
    <SurveyFlowContext.Provider value={value}>
      {children}
    </SurveyFlowContext.Provider>
  );
};

export function useSurveyFlow() {
  const context = useContext(SurveyFlowContext);
  if (context === undefined) {
    throw new Error('useSurveyFlow must be used within a SurveyFlowProvider');
  }
  return context;
}