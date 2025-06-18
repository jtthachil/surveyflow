import React, { useEffect } from 'react';
import { useSurveyFlow } from '../context/SurveyFlowContext';

export function LiveLinksGeneration() {
  const { state, generateLiveLinks, setRequirement, nextStep, previousStep } = useSurveyFlow();

  useEffect(() => {
    // Load detected requirement from localStorage if not already set
    if (!state.selectedRequirement) {
      const detectedRequirement = localStorage.getItem('detectedRequirement');
      if (detectedRequirement) {
        const requirement = JSON.parse(detectedRequirement);
        setRequirement(requirement);
      }
    }
  }, [state.selectedRequirement, setRequirement]);

  useEffect(() => {
    // Auto-generate live links when component mounts and requirement is available
    if (state.generatedLiveLinks.length === 0 && state.selectedRequirement) {
      generateLiveLinks();
    }
  }, [generateLiveLinks, state.generatedLiveLinks.length, state.selectedRequirement]);

  const handleContinue = () => {
    nextStep();
  };

  const copyToClipboard = (url: string) => {
    navigator.clipboard.writeText(url);
    // You could add a toast notification here
  };

  return (
    <div className="live-links-generation">
      <div className="container">
        <h1>Generated Live Links</h1>
        <p className="subtitle">
          Live survey links have been generated based on your selected pattern and configuration.
        </p>

        <div className="generation-info">
          <div className="pattern-info">
            <div className="requirement-badge">
              {state.selectedRequirement?.name} - {state.selectedRequirement?.liveLinkPattern} pattern
            </div>
          </div>
          
          <div className="generation-summary">
            <div className="summary-item">
              <span className="label">Total Links Generated:</span>
              <span className="value">{state.generatedLiveLinks.length}</span>
            </div>
            <div className="summary-item">
              <span className="label">Pattern Type:</span>
              <span className="value">{state.selectedRequirement?.liveLinkPattern}</span>
            </div>
          </div>
        </div>

        <div className="generated-links">
          <h3>Generated Live Links:</h3>
          
          {state.generatedLiveLinks.length === 0 ? (
            <div className="no-links">
              <p>No links generated yet. Please check your configuration.</p>
              <button onClick={generateLiveLinks} className="btn btn-secondary">
                Regenerate Links
              </button>
            </div>
          ) : (
            <div className="links-list">
              {state.generatedLiveLinks.map((link) => {
                // Find associated geography and category for display
                const geography = link.geographyId ? 
                  state.selectedGeographies.find(g => g.id === link.geographyId) : null;
                const category = link.categoryId ? 
                  state.selectedCategories.find(c => c.id === link.categoryId) : null;

                return (
                  <div key={link.id} className="link-item">
                    <div className="link-header">
                      <h4>{link.label}</h4>
                      <div className="link-tags">
                        {geography && (
                          <span className="tag geography-tag">
                            📍 {geography.name}
                          </span>
                        )}
                        {category && (
                          <span className="tag category-tag">
                            📋 {category.name}
                          </span>
                        )}
                      </div>
                    </div>
                    
                    <div className="link-url-container">
                      <input
                        type="text"
                        value={link.url}
                        readOnly
                        className="link-url-input"
                      />
                      <button
                        onClick={() => copyToClipboard(link.url)}
                        className="copy-btn"
                        title="Copy to clipboard"
                      >
                        📋
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        <div className="pattern-explanation">
          <h3>Link Generation Pattern Explanation:</h3>
          <div className="explanation-content">
            {state.selectedRequirement?.liveLinkPattern === 'single' && (
              <p>A single live link was generated that will handle all survey traffic regardless of geography or category.</p>
            )}
            {state.selectedRequirement?.liveLinkPattern === 'geo-based' && (
              <p>Separate live links were generated for each selected geography. Each link will route respondents to the appropriate geographic version of the survey.</p>
            )}
            {state.selectedRequirement?.liveLinkPattern === 'category-based' && (
              <p>Separate live links were generated for each selected category. Each link will route respondents to the appropriate category-specific survey version.</p>
            )}
            {state.selectedRequirement?.liveLinkPattern === 'geo-category-based' && (
              <p>Live links were generated for each combination of geography and category. This provides the most granular routing for survey respondents.</p>
            )}
          </div>
        </div>

        {/* Requirement 3 Footer - Potential Scenarios */}
        {state.selectedRequirement?.id === 3 && (
          <div className="requirement-3-footer">
            <div className="potential-scenarios">
              <h3>⚠️ Potential Scenario Alert</h3>
              <div className="scenario-info">
                <p>
                  <strong>Requirement 3 - Complex Multi-Geography, Multi-Category Configuration</strong>
                </p>
                <p>
                  Due to the complexity of your configuration, the following scenarios may occur during survey execution:
                </p>
                <ul>
                  <li>Uneven response distribution across geography-category combinations</li>
                  <li>Some combinations may reach target responses faster than others</li>
                  <li>Budget allocation may need real-time adjustments</li>
                  <li>Screening criteria may need refinement for specific combinations</li>
                </ul>
              </div>
              
              <div className="mock-view-section">
                <h4>📊 Mock Response Distribution View</h4>
                <div className="mock-distribution">
                  <div className="distribution-grid">
                    {state.selectedGeographies.slice(0, 2).map(geo => 
                      state.selectedCategories.slice(0, 2).map(cat => (
                        <div key={`${geo.id}-${cat.id}`} className="distribution-cell">
                          <div className="cell-header">
                            <span className="geo-label">{geo.code}</span>
                            <span className="cat-label">{cat.name}</span>
                          </div>
                          <div className="progress-bar-mock">
                            <div 
                              className="progress-fill-mock" 
                              style={{ width: `${Math.floor(Math.random() * 80) + 20}%` }}
                            />
                          </div>
                          <div className="response-count">
                            {Math.floor(Math.random() * 150) + 50}/200 responses
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                  <p className="mock-note">
                    * This is a mock view showing how response distribution might look during live survey execution
                  </p>
                </div>
              </div>
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
          >
            Configure Screeners
          </button>
        </div>
      </div>
    </div>
  );
} 