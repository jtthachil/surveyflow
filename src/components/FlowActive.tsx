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
                <div className="overview-section config-summary-card">
                  <div className="section-header">
                    <span className="section-icon">⚙️</span>
                    <h3>Configuration Summary</h3>
                  </div>
                  <div className="config-summary">
                    <div className="config-item">
                      <div className="config-icon">🎯</div>
                      <div className="config-content">
                        <span className="label">Pattern</span>
                        <span className="value">{state.selectedRequirement?.name}</span>
                      </div>
                    </div>
                    <div className="config-item">
                      <div className="config-icon">🌍</div>
                      <div className="config-content">
                        <span className="label">Geographies</span>
                        <span className="value">{state.selectedGeographies.length} markets</span>
                      </div>
                    </div>
                    <div className="config-item">
                      <div className="config-icon">📋</div>
                      <div className="config-content">
                        <span className="label">Categories</span>
                        <span className="value">{state.selectedCategories.length} segments</span>
                      </div>
                    </div>
                    <div className="config-item">
                      <div className="config-icon">🔗</div>
                      <div className="config-content">
                        <span className="label">Live Links</span>
                        <span className="value">{state.generatedLiveLinks.length} active</span>
                      </div>
                    </div>
                    <div className="config-item">
                      <div className="config-icon">📝</div>
                      <div className="config-content">
                        <span className="label">Screener Sets</span>
                        <span className="value">{state.configuredScreeners.length} configured</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="overview-section quick-stats-card">
                  <div className="section-header">
                    <span className="section-icon">📊</span>
                    <h3>Real-time Performance</h3>
                  </div>
                  <div className="stats-grid">
                    <div className="stat-card primary">
                      <div className="stat-icon">👥</div>
                      <div className="stat-content">
                        <div className="stat-value">{performanceData.totalResponses}</div>
                        <div className="stat-label">Total Responses</div>
                      </div>
                    </div>
                    <div className="stat-card success">
                      <div className="stat-icon">✅</div>
                      <div className="stat-content">
                        <div className="stat-value">{performanceData.completedResponses}</div>
                        <div className="stat-label">Completed</div>
                      </div>
                    </div>
                    <div className="stat-card info">
                      <div className="stat-icon">📈</div>
                      <div className="stat-content">
                        <div className="stat-value">{performanceData.conversionRate}</div>
                        <div className="stat-label">Conversion Rate</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flow-components">
                <div className="section-header">
                  <span className="section-icon">🔧</span>
                  <h3>Active Components</h3>
                </div>
                
                <div className="component-list">
                  <div className="component-item">
                    <div className="component-header">
                      <div className="component-info">
                        <span className="component-icon">🌍</span>
                        <div className="component-text">
                          <span className="component-title">Geography Targeting</span>
                          <span className="component-subtitle">{state.selectedGeographies.length} markets active</span>
                        </div>
                      </div>
                      <span className="component-status active">
                        <span className="status-dot"></span>
                        Active
                      </span>
                    </div>
                    <div className="component-details">
                      {state.selectedGeographies.map(geo => (
                        <span key={geo.id} className="detail-tag geography">{geo.name}</span>
                      ))}
                    </div>
                  </div>

                  <div className="component-item">
                    <div className="component-header">
                      <div className="component-info">
                        <span className="component-icon">📋</span>
                        <div className="component-text">
                          <span className="component-title">Category Targeting</span>
                          <span className="component-subtitle">{state.selectedCategories.length} segments active</span>
                        </div>
                      </div>
                      <span className="component-status active">
                        <span className="status-dot"></span>
                        Active
                      </span>
                    </div>
                    <div className="component-details">
                      {state.selectedCategories.map(cat => (
                        <span key={cat.id} className="detail-tag category">{cat.name}</span>
                      ))}
                    </div>
                  </div>

                  <div className="component-item">
                    <div className="component-header">
                      <div className="component-info">
                        <span className="component-icon">🔗</span>
                        <div className="component-text">
                          <span className="component-title">Live Links</span>
                          <span className="component-subtitle">{state.selectedRequirement?.liveLinkPattern} pattern</span>
                        </div>
                      </div>
                      <span className="component-status active">
                        <span className="status-dot"></span>
                        Active
                      </span>
                    </div>
                    <div className="component-details">
                      <span className="detail-tag links">{state.generatedLiveLinks.length} links generated</span>
                      <span className="detail-tag pattern">{state.selectedRequirement?.liveLinkPattern} routing</span>
                    </div>
                  </div>

                  <div className="component-item">
                    <div className="component-header">
                      <div className="component-info">
                        <span className="component-icon">📝</span>
                        <div className="component-text">
                          <span className="component-title">Screeners</span>
                          <span className="component-subtitle">{state.selectedRequirement?.screenerPattern} configuration</span>
                        </div>
                      </div>
                      <span className="component-status active">
                        <span className="status-dot"></span>
                        Active
                      </span>
                    </div>
                    <div className="component-details">
                      <span className="detail-tag screeners">{state.configuredScreeners.length} screener sets</span>
                      <span className="detail-tag pattern">{state.selectedRequirement?.screenerPattern} pattern</span>
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

                        <div className="link-actions">
                          <button className="btn btn-small btn-secondary" title="Pause this link">
                            ⏸️ Pause
                          </button>
                          <button className="btn btn-small btn-secondary" title="Edit configuration for this link">
                            ✏️ Edit
                          </button>
                          <button className="btn btn-small btn-danger" title="Stop this link">
                            🛑 Stop
                          </button>
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
                <div className="section-header">
                  <span className="section-icon">📈</span>
                  <h3>Performance Analytics</h3>
                </div>
                <div className="metrics-grid enhanced">
                  <div className="metric-card total">
                    <div className="metric-header">
                      <span className="metric-icon">👥</span>
                      <span className="metric-trend up">+12%</span>
                    </div>
                    <div className="metric-content">
                      <div className="metric-value">{performanceData.totalResponses}</div>
                      <div className="metric-label">Total Responses</div>
                      <div className="metric-change positive">+12% vs yesterday</div>
                    </div>
                    <div className="metric-chart">
                      <div className="chart-bar" style={{ height: '60%' }}></div>
                      <div className="chart-bar" style={{ height: '75%' }}></div>
                      <div className="chart-bar" style={{ height: '45%' }}></div>
                      <div className="chart-bar" style={{ height: '85%' }}></div>
                      <div className="chart-bar" style={{ height: '70%' }}></div>
                    </div>
                  </div>
                  
                  <div className="metric-card completed">
                    <div className="metric-header">
                      <span className="metric-icon">✅</span>
                      <span className="metric-trend up">+8%</span>
                    </div>
                    <div className="metric-content">
                      <div className="metric-value">{performanceData.completedResponses}</div>
                      <div className="metric-label">Completed</div>
                      <div className="metric-change positive">+8% vs yesterday</div>
                    </div>
                    <div className="metric-chart">
                      <div className="chart-bar" style={{ height: '55%' }}></div>
                      <div className="chart-bar" style={{ height: '70%' }}></div>
                      <div className="chart-bar" style={{ height: '40%' }}></div>
                      <div className="chart-bar" style={{ height: '80%' }}></div>
                      <div className="chart-bar" style={{ height: '65%' }}></div>
                    </div>
                  </div>
                  
                  <div className="metric-card terminated">
                    <div className="metric-header">
                      <span className="metric-icon">❌</span>
                      <span className="metric-trend down">-2%</span>
                    </div>
                    <div className="metric-content">
                      <div className="metric-value">{performanceData.terminatedResponses}</div>
                      <div className="metric-label">Terminated</div>
                      <div className="metric-change neutral">-2% vs yesterday</div>
                    </div>
                    <div className="metric-chart">
                      <div className="chart-bar" style={{ height: '30%' }}></div>
                      <div className="chart-bar" style={{ height: '25%' }}></div>
                      <div className="chart-bar" style={{ height: '35%' }}></div>
                      <div className="chart-bar" style={{ height: '20%' }}></div>
                      <div className="chart-bar" style={{ height: '28%' }}></div>
                    </div>
                  </div>
                  
                  <div className="metric-card quota">
                    <div className="metric-header">
                      <span className="metric-icon">🚫</span>
                      <span className="metric-trend up">+15%</span>
                    </div>
                    <div className="metric-content">
                      <div className="metric-value">{performanceData.overQuotaResponses}</div>
                      <div className="metric-label">Over Quota</div>
                      <div className="metric-change negative">+15% vs yesterday</div>
                    </div>
                    <div className="metric-chart">
                      <div className="chart-bar" style={{ height: '20%' }}></div>
                      <div className="chart-bar" style={{ height: '25%' }}></div>
                      <div className="chart-bar" style={{ height: '18%' }}></div>
                      <div className="chart-bar" style={{ height: '30%' }}></div>
                      <div className="chart-bar" style={{ height: '22%' }}></div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="performance-breakdown">
                <div className="section-header">
                  <span className="section-icon">🎯</span>
                  <h3>Performance Breakdown</h3>
                </div>
                
                <div className="breakdown-grid">
                  {state.selectedGeographies.length > 1 && (
                    <div className="breakdown-section geography-breakdown">
                      <div className="breakdown-header">
                        <span className="breakdown-icon">🌍</span>
                        <h4>By Geography</h4>
                      </div>
                      <div className="breakdown-items">
                        {state.selectedGeographies.map((geo, index) => {
                          const responses = Math.floor(Math.random() * 200) + 50;
                          const percentage = Math.floor((responses / performanceData.totalResponses) * 100);
                          return (
                            <div key={geo.id} className="breakdown-item">
                              <div className="breakdown-info">
                                <span className="breakdown-label">{geo.name}</span>
                                <span className="breakdown-value">{responses} responses</span>
                              </div>
                              <div className="breakdown-progress">
                                <div className="progress-bar">
                                  <div 
                                    className="progress-fill geography" 
                                    style={{ width: `${percentage}%` }}
                                  ></div>
                                </div>
                                <span className="progress-percentage">{percentage}%</span>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {state.selectedCategories.length > 1 && (
                    <div className="breakdown-section category-breakdown">
                      <div className="breakdown-header">
                        <span className="breakdown-icon">📋</span>
                        <h4>By Category</h4>
                      </div>
                      <div className="breakdown-items">
                        {state.selectedCategories.map((cat, index) => {
                          const responses = Math.floor(Math.random() * 150) + 30;
                          const percentage = Math.floor((responses / performanceData.totalResponses) * 100);
                          return (
                            <div key={cat.id} className="breakdown-item">
                              <div className="breakdown-info">
                                <span className="breakdown-label">{cat.name}</span>
                                <span className="breakdown-value">{responses} responses</span>
                              </div>
                              <div className="breakdown-progress">
                                <div className="progress-bar">
                                  <div 
                                    className="progress-fill category" 
                                    style={{ width: `${percentage}%` }}
                                  ></div>
                                </div>
                                <span className="progress-percentage">{percentage}%</span>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>

                {/* Time-based Performance */}
                <div className="time-performance">
                  <div className="breakdown-header">
                    <span className="breakdown-icon">⏰</span>
                    <h4>Response Timeline</h4>
                  </div>
                  <div className="timeline-chart">
                    <div className="timeline-item">
                      <span className="time-label">Last 24h</span>
                      <div className="time-bar">
                        <div className="time-fill" style={{ width: '85%' }}></div>
                      </div>
                      <span className="time-value">247 responses</span>
                    </div>
                    <div className="timeline-item">
                      <span className="time-label">Last 7 days</span>
                      <div className="time-bar">
                        <div className="time-fill" style={{ width: '70%' }}></div>
                      </div>
                      <span className="time-value">1,247 responses</span>
                    </div>
                    <div className="timeline-item">
                      <span className="time-label">Last 30 days</span>
                      <div className="time-bar">
                        <div className="time-fill" style={{ width: '45%' }}></div>
                      </div>
                      <span className="time-value">3,891 responses</span>
                    </div>
                  </div>
                </div>
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