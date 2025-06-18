import React from 'react';
import { useSurveyFlow } from '../context/SurveyFlowContext';
import { LandingPage } from './LandingPage';
import { PaymentConfiguration } from './PaymentConfiguration';
import { RedirectLinksReceived } from './RedirectLinksReceived';
import { LiveLinksGeneration } from './LiveLinksGeneration';
import { ScreenerConfiguration } from './ScreenerConfiguration';
import { ParticipantSelectionComponent } from './ParticipantSelection';
import { FlowReview } from './FlowReview';
import { FlowActive } from './FlowActive';

export function SurveyFlowWizard() {
  const { state } = useSurveyFlow();

  const renderCurrentStep = () => {
    switch (state.currentStep) {
      case 'landing':
        return <LandingPage />;
      case 'payment-configuration':
        return <PaymentConfiguration />;
      case 'redirect-links-received':
        return <RedirectLinksReceived />;
      case 'live-links-generation':
        return <LiveLinksGeneration />;
      case 'screener-configuration':
        return <ScreenerConfiguration />;
      case 'participant-selection':
        return <ParticipantSelectionComponent />;
      case 'flow-review':
        return <FlowReview />;
      case 'flow-active':
        return <FlowActive />;
      default:
        return <LandingPage />;
    }
  };

  const getStepNumber = () => {
    const steps = [
      'landing',
      'payment-configuration',
      'redirect-links-received',
      'live-links-generation',
      'screener-configuration',
      'participant-selection',
      'flow-review',
      'flow-active'
    ];
    const currentIndex = steps.indexOf(state.currentStep);
    return currentIndex === 0 ? null : currentIndex; // Don't show step for landing page
  };

  const getTotalSteps = () => 7; // Excluding landing page

  return (
    <div className="survey-flow-wizard">
      {state.currentStep !== 'landing' && (
        <div className="wizard-header">
          <div className="step-indicator">
            Step {getStepNumber()} of {getTotalSteps()}
          </div>
          <div className="progress-bar">
            <div 
              className="progress-fill" 
              style={{ width: `${((getStepNumber() || 0) / getTotalSteps()) * 100}%` }}
            />
          </div>
        </div>
      )}
      
      <div className="wizard-content">
        {renderCurrentStep()}
      </div>
    </div>
  );
} 