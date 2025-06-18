import React, { useState, useEffect } from 'react';
import { useSurveyFlow } from '../context/SurveyFlowContext';
import { RedirectLink } from '../types/survey';

export function RedirectLinksReceived() {
  const { state, setRedirectLinks, nextStep, previousStep } = useSurveyFlow();
  const [links, setLinks] = useState<RedirectLink[]>([
    { id: '1', url: '', label: 'Complete Survey Link' },
    { id: '2', url: '', label: 'Terminate Link' },
    { id: '3', url: '', label: 'Over Quota Link' },
    { id: '4', url: '', label: 'Error Link' }
  ]);

  // Auto-populate with mock data for demo
  useEffect(() => {
    const mockLinks: RedirectLink[] = [
      { id: '1', url: 'https://redirect.example.com/complete/1', label: 'Complete Survey Link' },
      { id: '2', url: 'https://redirect.example.com/terminate/1', label: 'Terminate Link' },
      { id: '3', url: 'https://redirect.example.com/overquota/1', label: 'Over Quota Link' },
      { id: '4', url: 'https://redirect.example.com/error/1', label: 'Error Link' }
    ];
    setLinks(mockLinks);
  }, []);

  const handleLinkChange = (id: string, value: string) => {
    setLinks(links.map(link => 
      link.id === id ? { ...link, url: value } : link
    ));
  };

  const handleContinue = () => {
    setRedirectLinks(links);
    nextStep();
  };

  const allLinksProvided = links.every(link => link.url.trim() !== '');

  const getLinkIcon = (label: string) => {
    if (label.includes('Complete')) return '✅';
    if (label.includes('Terminate')) return '❌';
    if (label.includes('Quota')) return '⚠️';
    if (label.includes('Error')) return '🚨';
    return '🔗';
  };

  const getLinkColor = (label: string) => {
    if (label.includes('Complete')) return 'success';
    if (label.includes('Terminate')) return 'warning';
    if (label.includes('Quota')) return 'info';
    if (label.includes('Error')) return 'danger';
    return 'primary';
  };

  return (
    <div className="redirect-links-received modern">
      <div className="container">
        <div className="modern-header">
          <div className="header-content">
            <h1>🔗 Redirect Links Configuration</h1>
            <p className="subtitle">
              Configure the redirect links that will be used across all survey flows.
              These are the 4 standard redirect links for different survey outcomes.
            </p>
          </div>
          
          <div className="progress-indicator">
            <div className="step-badge">Step 2 of 7</div>
          </div>
        </div>

        <div className="config-overview-card">
          <div className="overview-header">
            <span className="overview-icon">📋</span>
            <h3>Configuration Overview</h3>
          </div>
          
          <div className="overview-content">
            <div className="requirement-display">
              <span className="requirement-icon">🎯</span>
              <div className="requirement-info">
                <span className="requirement-name">{state.selectedRequirement?.name}</span>
                <span className="requirement-detail">Universal Redirect Links</span>
              </div>
            </div>
            
            <div className="context-stats">
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
              <div className="stat-item">
                <span className="stat-icon">🔗</span>
                <div className="stat-content">
                  <span className="stat-value">4</span>
                  <span className="stat-label">Redirect Links</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="links-configuration-section">
          <div className="section-header">
            <h3>🛠️ Link Configuration</h3>
            <div className="completion-indicator">
              <span className="completion-text">{links.filter(link => link.url.trim()).length}/4 Complete</span>
              <div className="completion-bar">
                <div 
                  className="completion-fill" 
                  style={{ width: `${(links.filter(link => link.url.trim()).length / 4) * 100}%` }}
                />
              </div>
            </div>
          </div>

          <div className="links-grid">
            {links.map((link, index) => (
              <div key={link.id} className={`link-config-card ${getLinkColor(link.label)}`}>
                <div className="link-card-header">
                  <div className="link-icon-section">
                    <span className="link-icon">{getLinkIcon(link.label)}</span>
                    <div className="link-number">#{index + 1}</div>
                  </div>
                  <div className="link-status">
                    {link.url.trim() ? (
                      <span className="status-badge configured">✓ Configured</span>
                    ) : (
                      <span className="status-badge pending">⏳ Pending</span>
                    )}
                  </div>
                </div>

                <div className="link-form-section">
                  <label className="link-label">{link.label}</label>
                  <div className="link-input-container">
                    <input
                      type="url"
                      value={link.url}
                      onChange={(e) => handleLinkChange(link.id, e.target.value)}
                      className="modern-link-input"
                      placeholder="https://redirect.example.com/..."
                    />
                    <div className="input-decoration"></div>
                  </div>
                  <div className="link-description">
                    {link.label.includes('Complete') && 'Redirect URL for successfully completed surveys'}
                    {link.label.includes('Terminate') && 'Redirect URL for terminated/screened out respondents'}
                    {link.label.includes('Quota') && 'Redirect URL when survey quotas are full'}
                    {link.label.includes('Error') && 'Redirect URL for technical errors or issues'}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="flow-context-section">
          <div className="context-header">
            <span className="context-icon">🔍</span>
            <h3>Current Flow Context</h3>
          </div>
          
          <div className="context-grid">
            <div className="context-card">
              <div className="context-item">
                <span className="context-label">Selected Pattern:</span>
                <span className="context-value">{state.selectedRequirement?.name}</span>
              </div>
            </div>
            <div className="context-card">
              <div className="context-item">
                <span className="context-label">Geographies:</span>
                <span className="context-value">
                  {state.selectedGeographies.length > 0 
                    ? state.selectedGeographies.map(g => g.name).join(', ')
                    : 'None selected'
                  }
                </span>
              </div>
            </div>
            <div className="context-card">
              <div className="context-item">
                <span className="context-label">Categories:</span>
                <span className="context-value">
                  {state.selectedCategories.length > 0
                    ? state.selectedCategories.map(c => c.name).join(', ')
                    : 'None selected'
                  }
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="next-step-preview">
          <div className="preview-header">
            <span className="preview-icon">🚀</span>
            <h3>Next: Live Links Generation</h3>
          </div>
          <div className="preview-content">
            <p>After providing these redirect links, the system will generate the appropriate live links based on your selected pattern:</p>
            <div className="preview-features">
              <div className="feature-item">
                <span className="feature-icon">🎯</span>
                <span className="feature-text"><strong>{state.selectedRequirement?.liveLinkPattern}</strong> live link pattern</span>
              </div>
              <div className="feature-item">
                <span className="feature-icon">⚙️</span>
                <span className="feature-text">Links configured for your selected geographies and categories</span>
              </div>
              <div className="feature-item">
                <span className="feature-icon">🔗</span>
                <span className="feature-text">Automatic URL generation with proper parameters</span>
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
            onClick={handleContinue} 
            className={`btn btn-primary modern ${!allLinksProvided ? 'disabled' : ''}`}
            disabled={!allLinksProvided}
          >
            <span className="btn-icon">🚀</span>
            Generate Live Links
          </button>
        </div>
      </div>
    </div>
  );
} 