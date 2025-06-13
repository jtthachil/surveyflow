import React from 'react';
import { FLOW_REQUIREMENTS } from '../constants/requirements';
import { useSurveyFlow } from '../context/SurveyFlowContext';
import { FlowRequirement } from '../types/survey';

export function RequirementSelection() {
  const { state, setRequirement, nextStep } = useSurveyFlow();

  const handleRequirementSelect = (requirement: FlowRequirement) => {
    setRequirement(requirement);
    nextStep();
  };

  return (
    <div className="requirement-selection">
      <div className="container">
        <h1>Survey Flow Configuration</h1>
        <p className="subtitle">Select your survey flow requirement pattern:</p>
        
        <div className="requirements-grid">
          {FLOW_REQUIREMENTS.map((req) => (
            <div 
              key={req.id}
              className={`requirement-card ${state.selectedRequirement?.id === req.id ? 'selected' : ''}`}
              onClick={() => handleRequirementSelect(req)}
            >
              <div className="requirement-header">
                <h3>{req.name}</h3>
              </div>
              
              <div className="requirement-details">
                <div className="detail-row">
                  <span className="label">Geography:</span>
                  <span className="value">{req.geographyCount}</span>
                </div>
                <div className="detail-row">
                  <span className="label">Category:</span>
                  <span className="value">{req.categoryCount}</span>
                </div>
                <div className="detail-row">
                  <span className="label">Live Links:</span>
                  <span className="value">{req.liveLinkPattern}</span>
                </div>
                <div className="detail-row">
                  <span className="label">Screeners:</span>
                  <span className="value">{req.screenerPattern}</span>
                </div>
              </div>

              <p className="requirement-description">{req.description}</p>
            </div>
          ))}
        </div>

        {state.selectedRequirement && (
          <div className="flow-preview">
            <h3>Selected Flow Preview</h3>
            <div className="flow-steps">
              <div className="step">1. Configure {state.selectedRequirement.geographyCount} geography/geographies</div>
              <div className="step">2. Select {state.selectedRequirement.categoryCount} category/categories</div>
              <div className="step">3. Receive redirect links (1 set)</div>
              <div className="step">4. Generate {state.selectedRequirement.liveLinkPattern} live links</div>
              <div className="step">5. Configure {state.selectedRequirement.screenerPattern} screener set(s)</div>
              <div className="step">6. Review and activate flow</div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
} 