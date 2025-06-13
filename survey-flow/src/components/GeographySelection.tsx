import React, { useState } from 'react';
import { useSurveyFlow } from '../context/SurveyFlowContext';
import { Geography } from '../types/survey';

// Mock geography data
const MOCK_GEOGRAPHIES: Geography[] = [
  { id: 'us', name: 'United States', code: 'US' },
  { id: 'uk', name: 'United Kingdom', code: 'UK' },
  { id: 'ca', name: 'Canada', code: 'CA' },
  { id: 'au', name: 'Australia', code: 'AU' },
  { id: 'de', name: 'Germany', code: 'DE' },
  { id: 'fr', name: 'France', code: 'FR' },
  { id: 'jp', name: 'Japan', code: 'JP' },
  { id: 'br', name: 'Brazil', code: 'BR' }
];

export function GeographySelection() {
  const { state, setGeographies, nextStep, previousStep } = useSurveyFlow();
  const [selectedGeographies, setSelectedGeographies] = useState<Geography[]>(state.selectedGeographies);

  const isMultipleAllowed = state.selectedRequirement?.geographyCount === 'multiple';

  const handleGeographyToggle = (geography: Geography) => {
    if (isMultipleAllowed) {
      const isSelected = selectedGeographies.some(g => g.id === geography.id);
      if (isSelected) {
        setSelectedGeographies(selectedGeographies.filter(g => g.id !== geography.id));
      } else {
        setSelectedGeographies([...selectedGeographies, geography]);
      }
    } else {
      setSelectedGeographies([geography]);
    }
  };

  const handleContinue = () => {
    setGeographies(selectedGeographies);
    nextStep();
  };

  const canContinue = selectedGeographies.length > 0;

  return (
    <div className="geography-selection">
      <div className="container">
        <h1>Select Geography</h1>
        <p className="subtitle">
          {isMultipleAllowed 
            ? 'Select one or more geographies for your survey'
            : 'Select a single geography for your survey'
          }
        </p>

        <div className="selection-info">
          <div className="requirement-badge">
            {state.selectedRequirement?.name} - {isMultipleAllowed ? 'Multiple' : 'Single'} Geography
          </div>
        </div>

        <div className="geography-grid">
          {MOCK_GEOGRAPHIES.map((geography) => {
            const isSelected = selectedGeographies.some(g => g.id === geography.id);
            return (
              <div
                key={geography.id}
                className={`geography-card ${isSelected ? 'selected' : ''}`}
                onClick={() => handleGeographyToggle(geography)}
              >
                <div className="geography-flag">
                  {geography.code}
                </div>
                <div className="geography-name">
                  {geography.name}
                </div>
              </div>
            );
          })}
        </div>

        {selectedGeographies.length > 0 && (
          <div className="selected-summary">
            <h3>Selected Geographies:</h3>
            <div className="selected-items">
              {selectedGeographies.map(geo => (
                <span key={geo.id} className="selected-item">
                  {geo.name} ({geo.code})
                </span>
              ))}
            </div>
          </div>
        )}

        <div className="navigation-buttons">
          <button onClick={previousStep} className="btn btn-secondary">
            Previous
          </button>
          <button 
            onClick={handleContinue} 
            className="btn btn-primary"
            disabled={!canContinue}
          >
            Continue
          </button>
        </div>
      </div>
    </div>
  );
} 