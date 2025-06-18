import React from 'react';
import { useSurveyFlow } from '../context/SurveyFlowContext';

export function LandingPage() {
  const { nextStep } = useSurveyFlow();

  const handleStartConfig = () => {
    nextStep();
  };

  return (
    <div className="landing-page">
      <div className="landing-container">
        <div className="welcome-section">
          <div className="logo-section">
            <h1 className="logo">AkquaintX</h1>
            <p className="tagline">Professional Survey Flow Management</p>
          </div>
          
          <div className="welcome-content">
            <h2>Welcome to AkquaintX</h2>
            <p className="welcome-description">
              Configure your survey flow with our advanced RLMV (Relative Labour Market Value) pricing model. 
              Set up targeted campaigns across multiple geographies and demographics with precision pricing.
            </p>
            
            <div className="features-preview">
              <div className="feature-item">
                <span className="feature-icon">🌍</span>
                <span className="feature-text">Global Geography Support</span>
              </div>
              <div className="feature-item">
                <span className="feature-icon">💼</span>
                <span className="feature-text">Professional Demographics</span>
              </div>
              <div className="feature-item">
                <span className="feature-icon">💰</span>
                <span className="feature-text">Dynamic RLMV Pricing</span>
              </div>
              <div className="feature-item">
                <span className="feature-icon">📊</span>
                <span className="feature-text">Real-time Analytics</span>
              </div>
            </div>
          </div>
          
          <div className="cta-section">
            <button 
              onClick={handleStartConfig}
              className="btn btn-primary btn-large start-config-btn"
            >
              Start Survey Configuration
            </button>
            <p className="cta-subtitle">
              Get started in minutes with our intuitive configuration wizard
            </p>
          </div>
        </div>
        
        <div className="hero-visual">
          <div className="stats-preview">
            <div className="stat-card">
              <div className="stat-number">8</div>
              <div className="stat-label">Global Markets</div>
            </div>
            <div className="stat-card">
              <div className="stat-number">5</div>
              <div className="stat-label">Seniority Levels</div>
            </div>
            <div className="stat-card">
              <div className="stat-number">4</div>
              <div className="stat-label">Company Sizes</div>
            </div>
            <div className="stat-card">
              <div className="stat-number">∞</div>
              <div className="stat-label">Configurations</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 