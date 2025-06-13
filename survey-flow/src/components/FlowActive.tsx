import React, { useState } from 'react';
import { useSurveyFlow } from '../context/SurveyFlowContext';

export function FlowActive() {
  const { state } = useSurveyFlow();
  const [activeTab, setActiveTab] = useState<'overview' | 'links' | 'performance'>('overview');

  // Mock performance data
  const [performanceData] = useState({
    totalResponses: 1247,
    completedResponses: 892,
    terminatedResponses: 201,
    overQuotaResponses: 154,
    conversionRate: '71.5%',
    averageCompletionTime: '8m 32s'
  });

  const copyAllLinks = () => {
    const allLinks = state.generatedLiveLinks.map(link => `${link.label}: ${link.url}`).join('\n');
    navigator.clipboard.writeText(allLinks);
  };

  return (
    <div className="flow-active">
      <div className="container">
        <div className="active-header">
          <div className="status-indicator">
            <div className="status-dot active"></div>
            <h1>Survey Flow Active</h1>
          </div>
          <div className="flow-info">
            <span className="requirement-name">{state.selectedRequirement?.name}</span>
            <span className="activation-time">Activated: {new Date().toLocaleString()}</span>
          </div>
        </div>

        <div className="flow-tabs">
          <button 
            className={`tab-button ${activeTab === 'overview' ? 'active' : ''}`}
            onClick={() => setActiveTab('overview')}
          >
            Overview
          </button>
          <button 
            className={`tab-button ${activeTab === 'links' ? 'active' : ''}`}
            onClick={() => setActiveTab('links')}
          >
            Live Links
          </button>
          <button 
            className={`tab-button ${activeTab === 'performance' ? 'active' : ''}`}
            onClick={() => setActiveTab('performance')}
          >
            Performance
          </button>
        </div>

        <div className="tab-content">
          {activeTab === 'overview' && (
            <div className="overview-tab">
              <div className="overview-grid">
                <div className="overview-section">
                  <h3>Configuration Summary</h3>
                  <div className="config-summary">
                    <div className="config-item">
                      <span className="label">Pattern:</span>
                      <span className="value">{state.selectedRequirement?.name}</span>
                    </div>
                    <div className="config-item">
                      <span className="label">Geographies:</span>
                      <span className="value">{state.selectedGeographies.length}</span>
                    </div>
                    <div className="config-item">
                      <span className="label">Categories:</span>
                      <span className="value">{state.selectedCategories.length}</span>
                    </div>
                    <div className="config-item">
                      <span className="label">Live Links:</span>
                      <span className="value">{state.generatedLiveLinks.length}</span>
                    </div>
                    <div className="config-item">
                      <span className="label">Screener Sets:</span>
                      <span className="value">{state.configuredScreeners.length}</span>
                    </div>
                  </div>
                </div>

                <div className="overview-section">
                  <h3>Quick Stats</h3>
                  <div className="stats-grid">
                    <div className="stat-card">
                      <div className="stat-value">{performanceData.totalResponses}</div>
                      <div className="stat-label">Total Responses</div>
                    </div>
                    <div className="stat-card">
                      <div className="stat-value">{performanceData.completedResponses}</div>
                      <div className="stat-label">Completed</div>
                    </div>
                    <div className="stat-card">
                      <div className="stat-value">{performanceData.conversionRate}</div>
                      <div className="stat-label">Conversion Rate</div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flow-components">
                <h3>Active Components</h3>
                
                <div className="component-list">
                  <div className="component-item">
                    <div className="component-header">
                      <span className="component-icon">🌍</span>
                      <span className="component-title">Geography Targeting</span>
                      <span className="component-status active">Active</span>
                    </div>
                    <div className="component-details">
                      {state.selectedGeographies.map(geo => (
                        <span key={geo.id} className="detail-tag">{geo.name}</span>
                      ))}
                    </div>
                  </div>

                  <div className="component-item">
                    <div className="component-header">
                      <span className="component-icon">📋</span>
                      <span className="component-title">Category Targeting</span>
                      <span className="component-status active">Active</span>
                    </div>
                    <div className="component-details">
                      {state.selectedCategories.map(cat => (
                        <span key={cat.id} className="detail-tag">{cat.name}</span>
                      ))}
                    </div>
                  </div>

                  <div className="component-item">
                    <div className="component-header">
                      <span className="component-icon">🔗</span>
                      <span className="component-title">Live Links</span>
                      <span className="component-status active">Active</span>
                    </div>
                    <div className="component-details">
                      <span className="detail-tag">{state.generatedLiveLinks.length} links generated</span>
                      <span className="detail-tag">{state.selectedRequirement?.liveLinkPattern} pattern</span>
                    </div>
                  </div>

                  <div className="component-item">
                    <div className="component-header">
                      <span className="component-icon">📝</span>
                      <span className="component-title">Screeners</span>
                      <span className="component-status active">Active</span>
                    </div>
                    <div className="component-details">
                      <span className="detail-tag">{state.configuredScreeners.length} screener sets</span>
                      <span className="detail-tag">{state.selectedRequirement?.screenerPattern} pattern</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'links' && (
            <div className="links-tab">
              <div className="links-header">
                <h3>Active Live Links</h3>
                <button onClick={copyAllLinks} className="copy-all-btn">
                  📋 Copy All Links
                </button>
              </div>

              <div className="active-links-list">
                {state.generatedLiveLinks.map(link => {
                  const geography = link.geographyId ? 
                    state.selectedGeographies.find(g => g.id === link.geographyId) : null;
                  const category = link.categoryId ? 
                    state.selectedCategories.find(c => c.id === link.categoryId) : null;

                  return (
                    <div key={link.id} className="active-link-item">
                      <div className="link-status">
                        <div className="status-dot active"></div>
                        <span className="status-text">Live</span>
                      </div>
                      
                      <div className="link-content">
                        <div className="link-header">
                          <h4>{link.label}</h4>
                          <div className="link-tags">
                            {geography && (
                              <span className="tag geography-tag">📍 {geography.name}</span>
                            )}
                            {category && (
                              <span className="tag category-tag">📋 {category.name}</span>
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
                            onClick={() => navigator.clipboard.writeText(link.url)}
                            className="copy-btn"
                            title="Copy link"
                          >
                            📋
                          </button>
                        </div>

                        <div className="link-stats">
                          <span className="stat">Clicks: {Math.floor(Math.random() * 500)}</span>
                          <span className="stat">Completions: {Math.floor(Math.random() * 300)}</span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {activeTab === 'performance' && (
            <div className="performance-tab">
              <div className="performance-overview">
                <h3>Performance Metrics</h3>
                <div className="metrics-grid">
                  <div className="metric-card">
                    <div className="metric-value">{performanceData.totalResponses}</div>
                    <div className="metric-label">Total Responses</div>
                    <div className="metric-change positive">+12% vs yesterday</div>
                  </div>
                  <div className="metric-card">
                    <div className="metric-value">{performanceData.completedResponses}</div>
                    <div className="metric-label">Completed</div>
                    <div className="metric-change positive">+8% vs yesterday</div>
                  </div>
                  <div className="metric-card">
                    <div className="metric-value">{performanceData.terminatedResponses}</div>
                    <div className="metric-label">Terminated</div>
                    <div className="metric-change neutral">-2% vs yesterday</div>
                  </div>
                  <div className="metric-card">
                    <div className="metric-value">{performanceData.overQuotaResponses}</div>
                    <div className="metric-label">Over Quota</div>
                    <div className="metric-change negative">+15% vs yesterday</div>
                  </div>
                </div>
              </div>

              <div className="performance-breakdown">
                <h3>Performance by Configuration</h3>
                
                {state.selectedGeographies.length > 1 && (
                  <div className="breakdown-section">
                    <h4>By Geography</h4>
                    <div className="breakdown-items">
                      {state.selectedGeographies.map(geo => (
                        <div key={geo.id} className="breakdown-item">
                          <span className="breakdown-label">{geo.name}</span>
                          <span className="breakdown-value">{Math.floor(Math.random() * 200)} responses</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {state.selectedCategories.length > 1 && (
                  <div className="breakdown-section">
                    <h4>By Category</h4>
                    <div className="breakdown-items">
                      {state.selectedCategories.map(cat => (
                        <div key={cat.id} className="breakdown-item">
                          <span className="breakdown-label">{cat.name}</span>
                          <span className="breakdown-value">{Math.floor(Math.random() * 150)} responses</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        <div className="flow-actions">
          <button className="btn btn-secondary">
            Pause Survey
          </button>
          <button className="btn btn-secondary">
            Edit Configuration
          </button>
          <button className="btn btn-danger">
            Stop Survey
          </button>
        </div>
      </div>
    </div>
  );
} 