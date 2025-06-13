import React from 'react';
import { useSurveyFlow } from '../context/SurveyFlowContext';

export function FlowReview() {
  const { state, nextStep, previousStep } = useSurveyFlow();

  const handleActivate = () => {
    nextStep();
  };

  return (
    <div className="flow-review">
      <div className="container">
        <h1>Review Survey Flow Configuration</h1>
        <p className="subtitle">
          Please review your complete survey flow configuration before activation.
        </p>

        <div className="review-sections">
          {/* Requirement Summary */}
          <div className="review-section">
            <h3>Selected Requirement</h3>
            <div className="requirement-summary">
              <div className="requirement-card selected">
                <h4>{state.selectedRequirement?.name}</h4>
                <p>{state.selectedRequirement?.description}</p>
                <div className="requirement-details">
                  <div className="detail-row">
                    <span className="label">Geography:</span>
                    <span className="value">{state.selectedRequirement?.geographyCount}</span>
                  </div>
                  <div className="detail-row">
                    <span className="label">Category:</span>
                    <span className="value">{state.selectedRequirement?.categoryCount}</span>
                  </div>
                  <div className="detail-row">
                    <span className="label">Live Links:</span>
                    <span className="value">{state.selectedRequirement?.liveLinkPattern}</span>
                  </div>
                  <div className="detail-row">
                    <span className="label">Screeners:</span>
                    <span className="value">{state.selectedRequirement?.screenerPattern}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Geography Configuration */}
          <div className="review-section">
            <h3>Selected Geographies ({state.selectedGeographies.length})</h3>
            <div className="geography-summary">
              {state.selectedGeographies.map(geo => (
                <div key={geo.id} className="geography-item">
                  <span className="geography-flag">{geo.code}</span>
                  <span className="geography-name">{geo.name}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Category Configuration */}
          <div className="review-section">
            <h3>Selected Categories ({state.selectedCategories.length})</h3>
            <div className="category-summary">
              {state.selectedCategories.map(cat => (
                <div key={cat.id} className="category-item">
                  <span className="category-icon">📋</span>
                  <span className="category-name">{cat.name}</span>
                  <span className="category-department">({cat.department})</span>
                </div>
              ))}
            </div>
          </div>

          {/* Redirect Links */}
          <div className="review-section">
            <h3>Redirect Links ({state.redirectLinks.length})</h3>
            <div className="links-summary">
              {state.redirectLinks.map(link => (
                <div key={link.id} className="link-item">
                  <div className="link-label">{link.label}</div>
                  <div className="link-url">{link.url}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Generated Live Links */}
          <div className="review-section">
            <h3>Generated Live Links ({state.generatedLiveLinks.length})</h3>
            <div className="live-links-summary">
              {state.generatedLiveLinks.map(link => {
                const geography = link.geographyId ? 
                  state.selectedGeographies.find(g => g.id === link.geographyId) : null;
                const category = link.categoryId ? 
                  state.selectedCategories.find(c => c.id === link.categoryId) : null;

                return (
                  <div key={link.id} className="live-link-item">
                    <div className="link-header">
                      <div className="link-label">{link.label}</div>
                      <div className="link-tags">
                        {geography && (
                          <span className="tag geography-tag">📍 {geography.name}</span>
                        )}
                        {category && (
                          <span className="tag category-tag">📋 {category.name}</span>
                        )}
                      </div>
                    </div>
                    <div className="link-url">{link.url}</div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Screener Configuration */}
          <div className="review-section">
            <h3>Screener Configuration ({state.configuredScreeners.length} sets)</h3>
            <div className="screeners-summary">
              {state.configuredScreeners.map(screener => {
                const category = screener.categoryId ? 
                  state.selectedCategories.find(c => c.id === screener.categoryId) : null;

                return (
                  <div key={screener.id} className="screener-summary-item">
                    <div className="screener-header">
                      <h4>
                        Screener for {category ? category.name : 'General'}
                        {category && (
                          <span className="category-badge">📋 {category.name}</span>
                        )}
                      </h4>
                    </div>
                    <div className="questions-count">
                      {screener.questions.length} questions configured
                    </div>
                    <div className="questions-preview">
                      {screener.questions.slice(0, 2).map((question, index) => (
                        <div key={question.id} className="question-preview">
                          <span className="question-number">Q{index + 1}:</span>
                          <span className="question-text">{question.question}</span>
                          <span className="question-type">({question.type})</span>
                        </div>
                      ))}
                      {screener.questions.length > 2 && (
                        <div className="more-questions">
                          +{screener.questions.length - 2} more questions
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Configuration Summary Stats */}
        <div className="configuration-stats">
          <h3>Configuration Summary</h3>
          <div className="stats-grid">
            <div className="stat-item">
              <div className="stat-value">{state.selectedGeographies.length}</div>
              <div className="stat-label">Geographies</div>
            </div>
            <div className="stat-item">
              <div className="stat-value">{state.selectedCategories.length}</div>
              <div className="stat-label">Categories</div>
            </div>
            <div className="stat-item">
              <div className="stat-value">{state.redirectLinks.length}</div>
              <div className="stat-label">Redirect Links</div>
            </div>
            <div className="stat-item">
              <div className="stat-value">{state.generatedLiveLinks.length}</div>
              <div className="stat-label">Live Links</div>
            </div>
            <div className="stat-item">
              <div className="stat-value">{state.configuredScreeners.length}</div>
              <div className="stat-label">Screener Sets</div>
            </div>
          </div>
        </div>

        <div className="activation-warning">
          <div className="warning-box">
            <h4>⚠️ Before Activation</h4>
            <ul>
              <li>Ensure all redirect links are valid and accessible</li>
              <li>Verify live links are properly configured in your survey platform</li>
              <li>Test screener logic and question flow</li>
              <li>Confirm geography and category targeting is correct</li>
            </ul>
          </div>
        </div>

        <div className="navigation-buttons">
          <button onClick={previousStep} className="btn btn-secondary">
            Previous
          </button>
          <button 
            onClick={handleActivate} 
            className="btn btn-primary btn-activate"
          >
            Activate Survey Flow
          </button>
        </div>
      </div>
    </div>
  );
} 