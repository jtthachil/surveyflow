import React, { useState } from 'react';
import { useSurveyFlow } from '../context/SurveyFlowContext';

export function FlowReview() {
  const { state, nextStep, previousStep } = useSurveyFlow();
  const [expandedSections, setExpandedSections] = useState<{ [key: string]: boolean }>({
    requirement: true,
    geographies: true,
    categories: true,
    redirectLinks: false,
    liveLinks: false,
    screeners: false
  });

  const handleActivate = () => {
    nextStep();
  };

  const toggleSection = (section: string) => {
    setExpandedSections({
      ...expandedSections,
      [section]: !expandedSections[section]
    });
  };

  const getCompletionPercentage = () => {
    let completed = 0;
    let total = 6;
    
    if (state.selectedRequirement) completed++;
    if (state.selectedGeographies.length > 0) completed++;
    if (state.selectedCategories.length > 0) completed++;
    if (state.redirectLinks.length > 0) completed++;
    if (state.generatedLiveLinks.length > 0) completed++;
    if (state.configuredScreeners.length > 0) completed++;
    
    return Math.round((completed / total) * 100);
  };

  const getSectionIcon = (section: string) => {
    const icons = {
      requirement: '🎯',
      geographies: '🌍',
      categories: '📋',
      redirectLinks: '🔗',
      liveLinks: '🚀',
      screeners: '🛡️'
    };
    return icons[section as keyof typeof icons] || '📄';
  };

  const getSectionStatus = (section: string) => {
    switch (section) {
      case 'requirement':
        return state.selectedRequirement ? 'complete' : 'incomplete';
      case 'geographies':
        return state.selectedGeographies.length > 0 ? 'complete' : 'incomplete';
      case 'categories':
        return state.selectedCategories.length > 0 ? 'complete' : 'incomplete';
      case 'redirectLinks':
        return state.redirectLinks.length > 0 ? 'complete' : 'incomplete';
      case 'liveLinks':
        return state.generatedLiveLinks.length > 0 ? 'complete' : 'incomplete';
      case 'screeners':
        return state.configuredScreeners.length > 0 ? 'complete' : 'incomplete';
      default:
        return 'incomplete';
    }
  };

  return (
    <div className="flow-review modern">
      <div className="container">
        <div className="modern-header">
          <div className="header-content">
            <h1>📋 Review Survey Flow Configuration</h1>
            <p className="subtitle">
              Please review your complete survey flow configuration before activation.
              All components have been configured and are ready for deployment.
            </p>
          </div>
          
          <div className="progress-indicator">
            <div className="step-badge">Step 6 of 7</div>
          </div>
        </div>

        <div className="completion-overview-card">
          <div className="completion-header">
            <span className="completion-icon">📊</span>
            <h3>Configuration Completion</h3>
          </div>
          
          <div className="completion-content">
            <div className="completion-circle">
              <div className="circle-progress" style={{ '--progress': `${getCompletionPercentage()}%` } as React.CSSProperties}>
                <span className="completion-percentage">{getCompletionPercentage()}%</span>
              </div>
            </div>
            
            <div className="completion-details">
              <div className="completion-text">
                <h4>Ready for Activation</h4>
                <p>All required components have been configured successfully</p>
              </div>
              
              <div className="quick-stats">
                <div className="quick-stat">
                  <span className="stat-value">{state.generatedLiveLinks.length}</span>
                  <span className="stat-label">Live Links</span>
                </div>
                <div className="quick-stat">
                  <span className="stat-value">{state.configuredScreeners.length}</span>
                  <span className="stat-label">Screener Sets</span>
                </div>
                <div className="quick-stat">
                  <span className="stat-value">{state.selectedGeographies.length + state.selectedCategories.length}</span>
                  <span className="stat-label">Total Targets</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="review-sections">
          {/* Requirement Summary */}
          <div className="review-section-card">
            <div 
              className="section-header clickable"
              onClick={() => toggleSection('requirement')}
            >
              <div className="section-title">
                <span className="section-icon">{getSectionIcon('requirement')}</span>
                <h3>Selected Requirement</h3>
                <span className={`status-indicator ${getSectionStatus('requirement')}`}>
                  {getSectionStatus('requirement') === 'complete' ? '✅' : '⚠️'}
                </span>
              </div>
              <span className={`expand-icon ${expandedSections.requirement ? 'expanded' : ''}`}>▼</span>
            </div>
            
            {expandedSections.requirement && (
              <div className="section-content">
                <div className="requirement-summary-card">
                  <div className="requirement-card-content">
                    <h4>{state.selectedRequirement?.name}</h4>
                    <p className="requirement-description">{state.selectedRequirement?.description}</p>
                    <div className="requirement-details-grid">
                      <div className="detail-item">
                        <span className="detail-icon">🌍</span>
                        <div className="detail-content">
                          <span className="detail-label">Geography</span>
                          <span className="detail-value">{state.selectedRequirement?.geographyCount}</span>
                        </div>
                      </div>
                      <div className="detail-item">
                        <span className="detail-icon">🎯</span>
                        <div className="detail-content">
                          <span className="detail-label">Category</span>
                          <span className="detail-value">{state.selectedRequirement?.categoryCount}</span>
                        </div>
                      </div>
                      <div className="detail-item">
                        <span className="detail-icon">🔗</span>
                        <div className="detail-content">
                          <span className="detail-label">Live Links</span>
                          <span className="detail-value">{state.selectedRequirement?.liveLinkPattern}</span>
                        </div>
                      </div>
                      <div className="detail-item">
                        <span className="detail-icon">🛡️</span>
                        <div className="detail-content">
                          <span className="detail-label">Screeners</span>
                          <span className="detail-value">{state.selectedRequirement?.screenerPattern}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Geography Configuration */}
          <div className="review-section-card">
            <div 
              className="section-header clickable"
              onClick={() => toggleSection('geographies')}
            >
              <div className="section-title">
                <span className="section-icon">{getSectionIcon('geographies')}</span>
                <h3>Selected Geographies ({state.selectedGeographies.length})</h3>
                <span className={`status-indicator ${getSectionStatus('geographies')}`}>
                  {getSectionStatus('geographies') === 'complete' ? '✅' : '⚠️'}
                </span>
              </div>
              <span className={`expand-icon ${expandedSections.geographies ? 'expanded' : ''}`}>▼</span>
            </div>
            
            {expandedSections.geographies && (
              <div className="section-content">
                <div className="geography-summary-grid">
                  {state.selectedGeographies.map(geo => (
                    <div key={geo.id} className="geography-item-card">
                      <span className="geography-flag">{geo.code}</span>
                      <span className="geography-name">{geo.name}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Category Configuration */}
          <div className="review-section-card">
            <div 
              className="section-header clickable"
              onClick={() => toggleSection('categories')}
            >
              <div className="section-title">
                <span className="section-icon">{getSectionIcon('categories')}</span>
                <h3>Selected Categories ({state.selectedCategories.length})</h3>
                <span className={`status-indicator ${getSectionStatus('categories')}`}>
                  {getSectionStatus('categories') === 'complete' ? '✅' : '⚠️'}
                </span>
              </div>
              <span className={`expand-icon ${expandedSections.categories ? 'expanded' : ''}`}>▼</span>
            </div>
            
            {expandedSections.categories && (
              <div className="section-content">
                <div className="category-summary-grid">
                  {state.selectedCategories.map(cat => (
                    <div key={cat.id} className="category-item-card">
                      <span className="category-icon">📋</span>
                      <div className="category-info">
                        <span className="category-name">{cat.name}</span>
                        <span className="category-department">({cat.department})</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Redirect Links */}
          <div className="review-section-card">
            <div 
              className="section-header clickable"
              onClick={() => toggleSection('redirectLinks')}
            >
              <div className="section-title">
                <span className="section-icon">{getSectionIcon('redirectLinks')}</span>
                <h3>Redirect Links ({state.redirectLinks.length})</h3>
                <span className={`status-indicator ${getSectionStatus('redirectLinks')}`}>
                  {getSectionStatus('redirectLinks') === 'complete' ? '✅' : '⚠️'}
                </span>
              </div>
              <span className={`expand-icon ${expandedSections.redirectLinks ? 'expanded' : ''}`}>▼</span>
            </div>
            
            {expandedSections.redirectLinks && (
              <div className="section-content">
                <div className="links-summary-grid">
                  {state.redirectLinks.map(link => (
                    <div key={link.id} className="link-item-card">
                      <div className="link-header">
                        <span className="link-icon">🔗</span>
                        <span className="link-label">{link.label}</span>
                      </div>
                      <div className="link-url">{link.url}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Generated Live Links */}
          <div className="review-section-card">
            <div 
              className="section-header clickable"
              onClick={() => toggleSection('liveLinks')}
            >
              <div className="section-title">
                <span className="section-icon">{getSectionIcon('liveLinks')}</span>
                <h3>Generated Live Links ({state.generatedLiveLinks.length})</h3>
                <span className={`status-indicator ${getSectionStatus('liveLinks')}`}>
                  {getSectionStatus('liveLinks') === 'complete' ? '✅' : '⚠️'}
                </span>
              </div>
              <span className={`expand-icon ${expandedSections.liveLinks ? 'expanded' : ''}`}>▼</span>
            </div>
            
            {expandedSections.liveLinks && (
              <div className="section-content">
                <div className="live-links-summary-grid">
                  {state.generatedLiveLinks.map(link => {
                    const geography = link.geographyId ? 
                      state.selectedGeographies.find(g => g.id === link.geographyId) : null;
                    const category = link.categoryId ? 
                      state.selectedCategories.find(c => c.id === link.categoryId) : null;

                    return (
                      <div key={link.id} className="live-link-item-card">
                        <div className="live-link-header">
                          <div className="live-link-title">
                            <span className="live-link-icon">🚀</span>
                            <span className="live-link-label">{link.label}</span>
                          </div>
                          <div className="live-link-tags">
                            {geography && (
                              <span className="tag geography-tag">📍 {geography.name}</span>
                            )}
                            {category && (
                              <span className="tag category-tag">🎯 {category.name}</span>
                            )}
                          </div>
                        </div>
                        <div className="live-link-url">{link.url}</div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          {/* Screener Configuration */}
          <div className="review-section-card">
            <div 
              className="section-header clickable"
              onClick={() => toggleSection('screeners')}
            >
              <div className="section-title">
                <span className="section-icon">{getSectionIcon('screeners')}</span>
                <h3>Screener Configuration ({state.configuredScreeners.length} sets)</h3>
                <span className={`status-indicator ${getSectionStatus('screeners')}`}>
                  {getSectionStatus('screeners') === 'complete' ? '✅' : '⚠️'}
                </span>
              </div>
              <span className={`expand-icon ${expandedSections.screeners ? 'expanded' : ''}`}>▼</span>
            </div>
            
            {expandedSections.screeners && (
              <div className="section-content">
                <div className="screeners-summary-grid">
                  {state.configuredScreeners.map((screener, index) => {
                    const category = screener.categoryId ? 
                      state.selectedCategories.find(c => c.id === screener.categoryId) : null;
                    
                    return (
                      <div key={screener.id} className="screener-item-card">
                        <div className="screener-header">
                          <span className="screener-icon">🛡️</span>
                          <div className="screener-info">
                            <span className="screener-title">
                              Screener for {category ? category.name : 'General'}
                            </span>
                            <span className="screener-questions">{screener.questions.length} questions</span>
                          </div>
                        </div>
                        {category && (
                          <div className="screener-category">
                            <span className="category-badge">🎯 {category.name}</span>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="configuration-summary-section">
          <div className="summary-header">
            <span className="summary-icon">📊</span>
            <h3>Configuration Summary</h3>
          </div>
          <div className="summary-stats-grid">
            <div className="summary-stat-card">
              <span className="stat-icon">🌍</span>
              <div className="stat-content">
                <span className="stat-value">{state.selectedGeographies.length}</span>
                <span className="stat-label">Geographies</span>
              </div>
            </div>
            <div className="summary-stat-card">
              <span className="stat-icon">🎯</span>
              <div className="stat-content">
                <span className="stat-value">{state.selectedCategories.length}</span>
                <span className="stat-label">Categories</span>
              </div>
            </div>
            <div className="summary-stat-card">
              <span className="stat-icon">🔗</span>
              <div className="stat-content">
                <span className="stat-value">{state.redirectLinks.length}</span>
                <span className="stat-label">Redirect Links</span>
              </div>
            </div>
            <div className="summary-stat-card">
              <span className="stat-icon">🚀</span>
              <div className="stat-content">
                <span className="stat-value">{state.generatedLiveLinks.length}</span>
                <span className="stat-label">Live Links</span>
              </div>
            </div>
            <div className="summary-stat-card">
              <span className="stat-icon">🛡️</span>
              <div className="stat-content">
                <span className="stat-value">{state.configuredScreeners.length}</span>
                <span className="stat-label">Screener Sets</span>
              </div>
            </div>
          </div>
        </div>

        <div className="activation-checklist-section">
          <div className="checklist-header">
            <span className="checklist-icon">⚠️</span>
            <h3>Pre-Activation Checklist</h3>
          </div>
          <div className="checklist-content">
            <div className="checklist-items">
              <div className="checklist-item">
                <span className="check-icon">✅</span>
                <span className="check-text">Ensure all redirect links are valid and accessible</span>
              </div>
              <div className="checklist-item">
                <span className="check-icon">✅</span>
                <span className="check-text">Verify live links are properly configured in your survey platform</span>
              </div>
              <div className="checklist-item">
                <span className="check-icon">✅</span>
                <span className="check-text">Test screener logic and question flow</span>
              </div>
              <div className="checklist-item">
                <span className="check-icon">✅</span>
                <span className="check-text">Confirm geography and category targeting is correct</span>
              </div>
            </div>
          </div>
        </div>

        <div className="navigation-section">
          <button onClick={previousStep} className="btn btn-secondary modern">
            <span className="btn-icon">⬅️</span>
            Previous
          </button>
          <button 
            onClick={handleActivate} 
            className="btn btn-primary modern btn-activate"
          >
            <span className="btn-icon">🚀</span>
            Activate Survey Flow
          </button>
        </div>
      </div>
    </div>
  );
} 