import React, { useEffect, useState } from 'react';
import { useSurveyFlow } from '../context/SurveyFlowContext';

export function LiveLinksGeneration() {
  const { state, generateLiveLinks, setRequirement, nextStep, previousStep } = useSurveyFlow();
  const [copyStatus, setCopyStatus] = useState<{ [key: string]: boolean }>({});

  useEffect(() => {
    // Load detected requirement from localStorage if not already set
    if (!state.selectedRequirement) {
      const detectedRequirement = localStorage.getItem('detectedRequirement');
      if (detectedRequirement) {
        try {
          const requirement = JSON.parse(detectedRequirement);
          console.log('Loading requirement from localStorage:', requirement);
          setRequirement(requirement);
        } catch (error) {
          console.error('Error parsing requirement from localStorage:', error);
          localStorage.removeItem('detectedRequirement');
        }
      }
    }
  }, [state.selectedRequirement, setRequirement]);

  useEffect(() => {
    // Auto-generate live links when component mounts and requirement is available
    // Also regenerate when requirement changes
    if (state.selectedRequirement && (state.generatedLiveLinks.length === 0 || 
        (state.generatedLiveLinks.length === 1 && state.selectedRequirement.liveLinkPattern !== 'single'))) {
      console.log('Auto-generating live links for requirement:', state.selectedRequirement);
      generateLiveLinks();
    }
  }, [generateLiveLinks, state.generatedLiveLinks.length, state.selectedRequirement]);

  const handleContinue = () => {
    nextStep();
  };

  const copyToClipboard = async (url: string, linkId: string) => {
    try {
      await navigator.clipboard.writeText(url);
      setCopyStatus({ ...copyStatus, [linkId]: true });
      setTimeout(() => {
        setCopyStatus({ ...copyStatus, [linkId]: false });
      }, 2000);
    } catch (err) {
      console.error('Failed to copy: ', err);
    }
  };

  const copyAllLinks = async () => {
    const allLinks = state.generatedLiveLinks.map(link => `${link.label}: ${link.url}`).join('\n');
    try {
      await navigator.clipboard.writeText(allLinks);
      setCopyStatus({ all: true });
      setTimeout(() => {
        setCopyStatus({ all: false });
      }, 2000);
    } catch (err) {
      console.error('Failed to copy all links: ', err);
    }
  };

  const getLinkTypeIcon = (link: any) => {
    if (link.geographyId && link.categoryId) return '🌍🎯';
    if (link.geographyId) return '🌍';
    if (link.categoryId) return '🎯';
    return '🔗';
  };

  const getPatternDescription = () => {
    switch (state.selectedRequirement?.liveLinkPattern) {
      case 'single':
        return 'A single live link handles all survey traffic regardless of geography or category.';
      case 'geo-based':
        return 'Separate live links for each selected geography route respondents to the appropriate geographic version.';
      case 'category-based':
        return 'Separate live links for each selected category route respondents to the appropriate category-specific survey version.';
      case 'geo-category-based':
        return 'Live links for each combination of geography and category provide the most granular routing for survey respondents.';
      default:
        return 'Live links have been generated based on your configuration.';
    }
  };

  return (
    <div className="live-links-generation modern">
      <div className="container">
        <div className="modern-header">
          <div className="header-content">
            <h1>🚀 Live Links Generation</h1>
            <p className="subtitle">
              Your live survey links have been automatically generated based on your configuration.
              Use these links to distribute your survey to respondents.
            </p>
          </div>
          
          <div className="progress-indicator">
            <div className="step-badge">Step 3 of 7</div>
          </div>
        </div>

        <div className="generation-summary-card">
          <div className="summary-header">
            <span className="summary-icon">📊</span>
            <h3>Generation Summary</h3>
          </div>
          
          <div className="summary-content">
            <div className="pattern-info">
              <span className="pattern-icon">⚙️</span>
              <div className="pattern-details">
                <span className="pattern-name">{state.selectedRequirement?.liveLinkPattern} Pattern</span>
                <span className="pattern-description">{getPatternDescription()}</span>
              </div>
            </div>
            
            <div className="generation-stats">
              <div className="stat-item">
                <span className="stat-icon">🔗</span>
                <div className="stat-content">
                  <span className="stat-value">{state.generatedLiveLinks.length}</span>
                  <span className="stat-label">Live Links</span>
                </div>
              </div>
              <div className="stat-item">
                <span className="stat-icon">🌍</span>
                <div className="stat-content">
                  <span className="stat-value">{state.selectedGeographies.length}</span>
                  <span className="stat-label">Geographies</span>
                </div>
              </div>
              <div className="stat-item">
                <span className="stat-icon">🎯</span>
                <div className="stat-content">
                  <span className="stat-value">{state.selectedCategories.length}</span>
                  <span className="stat-label">Categories</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="links-section">
          <div className="links-header">
            <h3>🔗 Generated Live Links</h3>
            <div className="header-actions">
              <button 
                onClick={copyAllLinks} 
                className="copy-all-btn"
                disabled={state.generatedLiveLinks.length === 0}
              >
                {copyStatus.all ? '✅ Copied!' : '📋 Copy All Links'}
              </button>
              <button onClick={generateLiveLinks} className="regenerate-btn">
                🔄 Regenerate Links
              </button>
            </div>
          </div>
          
          {state.generatedLiveLinks.length === 0 ? (
            <div className="no-links-card">
              <div className="no-links-content">
                <span className="no-links-icon">🔍</span>
                <h4>No Links Generated</h4>
                <p>No links generated yet. Please check your configuration.</p>
                <button onClick={generateLiveLinks} className="btn btn-secondary modern">
                  🔄 Generate Links
                </button>
              </div>
            </div>
          ) : (
            <div className="links-grid">
              {state.generatedLiveLinks.map((link) => {
                const geography = link.geographyId ? 
                  state.selectedGeographies.find(g => g.id === link.geographyId) : null;
                const category = link.categoryId ? 
                  state.selectedCategories.find(c => c.id === link.categoryId) : null;

                return (
                  <div key={link.id} className="live-link-card">
                    <div className="link-card-header">
                      <div className="link-type-section">
                        <span className="link-type-icon">{getLinkTypeIcon(link)}</span>
                        <div className="link-title">
                          <h4>{link.label}</h4>
                          <div className="link-tags">
                            {geography && (
                              <span className="tag geography-tag">📍 {geography.name}</span>
                            )}
                            {category && (
                              <span className="tag category-tag">🎯 {category.name}</span>
                            )}
                          </div>
                        </div>
                      </div>
                      <div className="link-status">
                        <span className="status-badge active">🟢 Active</span>
                      </div>
                    </div>

                    <div className="link-url-section">
                      <div className="url-container">
                        <input
                          type="text"
                          value={link.url}
                          readOnly
                          className="url-input"
                        />
                        <button
                          onClick={() => copyToClipboard(link.url, link.id)}
                          className="copy-btn"
                        >
                          {copyStatus[link.id] ? '✅' : '📋'}
                        </button>
                      </div>
                      <div className="url-info">
                        <span className="url-type">Survey Entry Point</span>
                        <span className="url-parameter">Contains [id] parameter for tracking</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        <div className="pattern-explanation-section">
          <div className="explanation-header">
            <span className="explanation-icon">💡</span>
            <h3>Link Generation Pattern Explanation</h3>
          </div>
          <div className="explanation-content">
            <div className="explanation-card">
              <div className="explanation-text">
                <strong>{state.selectedRequirement?.liveLinkPattern} Pattern:</strong> {getPatternDescription()}
              </div>
              <div className="explanation-features">
                <div className="feature-item">
                  <span className="feature-icon">🔒</span>
                  <span className="feature-text">Secure parameter handling</span>
                </div>
                <div className="feature-item">
                  <span className="feature-icon">📊</span>
                  <span className="feature-text">Built-in tracking capabilities</span>
                </div>
                <div className="feature-item">
                  <span className="feature-icon">⚡</span>
                  <span className="feature-text">Optimized routing logic</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Enhanced Requirement 3 Footer for complex scenarios */}
        {state.selectedRequirement?.id === 3 && (
          <div className="requirement-scenarios-section">
            <div className="scenarios-header">
              <span className="scenarios-icon">🎯</span>
              <h3>Requirement 3 - Potential Survey Scenarios</h3>
            </div>
            
            <div className="scenarios-content">
              <div className="scenario-description">
                <p>Your current configuration supports multiple categories with a single geography. This enables various survey distribution strategies:</p>
                <div className="scenario-features">
                  <div className="scenario-item">
                    <span className="scenario-icon">📋</span>
                    <span>Category-specific screening and routing</span>
                  </div>
                  <div className="scenario-item">
                    <span className="scenario-icon">🎯</span>
                    <span>Targeted respondent qualification</span>
                  </div>
                  <div className="scenario-item">
                    <span className="scenario-icon">📊</span>
                    <span>Comprehensive cross-category analysis</span>
                  </div>
                </div>
              </div>

              <div className="mock-distribution-section">
                <h4>📊 Mock Response Distribution Preview</h4>
                <div className="distribution-grid">
                  {state.selectedGeographies.slice(0, 2).map(geo => 
                    state.selectedCategories.slice(0, 2).map(cat => (
                      <div key={`${geo.id}-${cat.id}`} className="distribution-cell modern">
                        <div className="cell-header">
                          <span className="geo-label">{geo.code}</span>
                          <span className="cat-label">{cat.name}</span>
                        </div>
                        <div className="progress-section">
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
                      </div>
                    ))
                  )}
                </div>
                <p className="mock-note">
                  * This is a preview showing how response distribution might look during live survey execution
                </p>
              </div>
            </div>
          </div>
        )}

        <div className="navigation-section">
          <button onClick={previousStep} className="btn btn-secondary modern">
            <span className="btn-icon">⬅️</span>
            Previous
          </button>
          <button 
            onClick={handleContinue} 
            className="btn btn-primary modern"
          >
            <span className="btn-icon">🎯</span>
            Configure Screeners
          </button>
        </div>
      </div>
    </div>
  );
} 