import React from 'react';
import { useSurveyFlow } from '../context/SurveyFlowContext';
import { RequirementSelection } from './RequirementSelection';
import { GeographySelection } from './GeographySelection';
import { CategorySelection } from './CategorySelection';
import { RedirectLinksReceived } from './RedirectLinksReceived';
import { LiveLinksGeneration } from './LiveLinksGeneration';
import { ScreenerConfiguration } from './ScreenerConfiguration';
import { PaymentConfiguration } from './PaymentConfiguration';
import { ParticipantSelectionComponent } from './ParticipantSelection';
import { FlowReview } from './FlowReview';
import { FlowActive } from './FlowActive';

export function SurveyFlowWizard() {
  const { state } = useSurveyFlow();

  const renderCurrentStep = () => {
    switch (state.currentStep) {
      case 'requirement-selection':
        return <RequirementSelection />;
      case 'geography-selection':
        return <GeographySelection />;
      case 'category-selection':
        return <CategorySelection />;
      case 'redirect-links-received':
        return <RedirectLinksReceived />;
      case 'live-links-generation':
        return <LiveLinksGeneration />;
      case 'screener-configuration':
        return <ScreenerConfiguration />;
      case 'payment-configuration':
        return <PaymentConfiguration />;
      case 'participant-selection':
        return <ParticipantSelectionComponent />;
      case 'flow-review':
        return <FlowReview />;
      case 'flow-active':
        return <FlowActive />;
      default:
        return <RequirementSelection />;
    }
  };

  const getStepNumber = () => {
    const steps = [
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
    return steps.indexOf(state.currentStep) + 1;
  };

  return (
    <div className="survey-flow-wizard">
      <div className="wizard-header">
        <div className="step-indicator">
          Step {getStepNumber()} of 10
        </div>
        <div className="progress-bar">
          <div 
            className="progress-fill" 
            style={{ width: `${(getStepNumber() / 10) * 100}%` }}
          />
        </div>
      </div>
      
      <div className="wizard-content">
        {renderCurrentStep()}
      </div>
    </div>
  );
} 