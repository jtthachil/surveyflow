import React, { useState, useEffect } from 'react';
import { useSurveyFlow } from '../context/SurveyFlowContext';
import { RedirectLink } from '../types/survey';

export function RedirectLinksReceived() {
  const { state, setRedirectLinks, nextStep, previousStep } = useSurveyFlow();
  const [links, setLinks] = useState<RedirectLink[]>([
    { id: '1', url: '', label: 'Redirect Link 1' },
    { id: '2', url: '', label: 'Redirect Link 2' },
    { id: '3', url: '', label: 'Redirect Link 3' },
    { id: '4', url: '', label: 'Redirect Link 4' }
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

  return (
    <div className="redirect-links-received">
      <div className="container">
        <h1>Redirect Links Configuration</h1>
        <p className="subtitle">
          Configure the redirect links that will be used across all survey flows.
          These are the 4 standard redirect links mentioned in your requirements.
        </p>

        <div className="selection-info">
          <div className="requirement-badge">
            All Requirements - 1 Set of Redirect Links
          </div>
        </div>

        <div className="links-form">
          <div className="form-note">
            <strong>Note:</strong> These redirect links will be used universally across all geographies and categories in your selected flow pattern.
          </div>

          {links.map((link) => (
            <div key={link.id} className="link-input-group">
              <label htmlFor={`link-${link.id}`} className="link-label">
                {link.label}
              </label>
              <input
                id={`link-${link.id}`}
                type="url"
                value={link.url}
                onChange={(e) => handleLinkChange(link.id, e.target.value)}
                className="link-input"
                placeholder="https://redirect.example.com/..."
              />
            </div>
          ))}
        </div>

        <div className="flow-context">
          <h3>Current Flow Context:</h3>
          <div className="context-details">
            <div className="context-item">
              <span className="label">Selected Pattern:</span>
              <span className="value">{state.selectedRequirement?.name}</span>
            </div>
            <div className="context-item">
              <span className="label">Geographies:</span>
              <span className="value">
                {state.selectedGeographies.map(g => g.name).join(', ') || 'None selected'}
              </span>
            </div>
            <div className="context-item">
              <span className="label">Categories:</span>
              <span className="value">
                {state.selectedCategories.map(c => c.name).join(', ') || 'None selected'}
              </span>
            </div>
          </div>
        </div>

        <div className="next-step-preview">
          <h3>Next: Live Links Generation</h3>
          <p>After providing these redirect links, the system will generate the appropriate live links based on your selected pattern:</p>
          <ul>
            <li><strong>{state.selectedRequirement?.liveLinkPattern}</strong> live link pattern</li>
            <li>Links will be configured for your selected geographies and categories</li>
          </ul>
        </div>

        <div className="navigation-buttons">
          <button onClick={previousStep} className="btn btn-secondary">
            Previous
          </button>
          <button 
            onClick={handleContinue} 
            className="btn btn-primary"
            disabled={!allLinksProvided}
          >
            Generate Live Links
          </button>
        </div>
      </div>
    </div>
  );
} 