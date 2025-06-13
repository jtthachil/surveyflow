import React, { useState, useEffect } from 'react';
import { useSurveyFlow } from '../context/SurveyFlowContext';
import { PaymentConfig } from '../types/survey';

export function PaymentConfiguration() {
  const { state, setPaymentConfigs, nextStep, previousStep } = useSurveyFlow();
  const [paymentConfigs, setPaymentConfigsState] = useState<PaymentConfig[]>([]);

  // Initialize payment configs for each live link
  useEffect(() => {
    if (state.generatedLiveLinks.length > 0 && paymentConfigs.length === 0) {
      const initialConfigs = state.generatedLiveLinks.map(link => ({
        liveLinkId: link.id,
        amount: 40, // minimum amount
        expectedResponses: 100, // default
        totalCost: 4000 // 40 * 100
      }));
      setPaymentConfigsState(initialConfigs);
    }
  }, [state.generatedLiveLinks, paymentConfigs.length]);

  const updatePaymentConfig = (liveLinkId: string, field: keyof PaymentConfig, value: number) => {
    setPaymentConfigsState(configs => 
      configs.map(config => {
        if (config.liveLinkId === liveLinkId) {
          const updatedConfig = { ...config, [field]: value };
          // Recalculate total cost when amount or expectedResponses change
          if (field === 'amount' || field === 'expectedResponses') {
            updatedConfig.totalCost = updatedConfig.amount * updatedConfig.expectedResponses;
          }
          return updatedConfig;
        }
        return config;
      })
    );
  };

  const getLinkLabel = (liveLinkId: string) => {
    const link = state.generatedLiveLinks.find(l => l.id === liveLinkId);
    return link ? link.label : 'Unknown Link';
  };

  const getTotalExpectedCost = () => {
    return paymentConfigs.reduce((total, config) => total + config.totalCost, 0);
  };

  const getTotalExpectedResponses = () => {
    return paymentConfigs.reduce((total, config) => total + config.expectedResponses, 0);
  };

  const handleContinue = () => {
    setPaymentConfigs(paymentConfigs);
    nextStep();
  };

  const canContinue = paymentConfigs.every(config => 
    config.amount >= 40 && config.expectedResponses > 0
  );

  return (
    <div className="payment-configuration">
      <div className="container">
        <h1>Payment Configuration</h1>
        <p className="subtitle">
          Set payment amounts for each survey link. Minimum payment is $40 per response.
        </p>

        <div className="configuration-info">
          <div className="requirement-badge">
            {state.selectedRequirement?.name} - {state.generatedLiveLinks.length} Live Link{state.generatedLiveLinks.length !== 1 ? 's' : ''}
          </div>
        </div>

        <div className="payment-configs-list">
          {paymentConfigs.map((config) => (
            <div key={config.liveLinkId} className="payment-config-card">
              <div className="config-header">
                <h3>{getLinkLabel(config.liveLinkId)}</h3>
                <div className="link-info">
                  {state.generatedLiveLinks.find(l => l.id === config.liveLinkId)?.geographyId && (
                    <span className="geography-tag">
                      📍 {state.selectedGeographies.find(g => g.id === state.generatedLiveLinks.find(l => l.id === config.liveLinkId)?.geographyId)?.name}
                    </span>
                  )}
                  {state.generatedLiveLinks.find(l => l.id === config.liveLinkId)?.categoryId && (
                    <span className="category-tag">
                      📋 {state.selectedCategories.find(c => c.id === state.generatedLiveLinks.find(l => l.id === config.liveLinkId)?.categoryId)?.name}
                    </span>
                  )}
                </div>
              </div>

              <div className="payment-form">
                <div className="form-row">
                  <div className="form-group">
                    <label>Payment per Response ($)</label>
                    <input
                      type="number"
                      min="40"
                      value={config.amount}
                      onChange={(e) => updatePaymentConfig(config.liveLinkId, 'amount', Math.max(40, parseInt(e.target.value) || 40))}
                      className="payment-input"
                    />
                    <span className="input-hint">Minimum: $40</span>
                  </div>
                  
                  <div className="form-group">
                    <label>Expected Responses</label>
                    <input
                      type="number"
                      min="1"
                      value={config.expectedResponses}
                      onChange={(e) => updatePaymentConfig(config.liveLinkId, 'expectedResponses', Math.max(1, parseInt(e.target.value) || 1))}
                      className="payment-input"
                    />
                  </div>
                </div>

                <div className="cost-display">
                  <div className="total-cost">
                    <span className="cost-label">Total Cost:</span>
                    <span className="cost-value">${config.totalCost.toLocaleString()}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="cost-calculator">
          <h3>💰 Cost Calculator Summary</h3>
          <div className="calculator-grid">
            <div className="calc-item">
              <span className="calc-label">Total Live Links:</span>
              <span className="calc-value">{paymentConfigs.length}</span>
            </div>
            <div className="calc-item">
              <span className="calc-label">Total Expected Responses:</span>
              <span className="calc-value">{getTotalExpectedResponses().toLocaleString()}</span>
            </div>
            <div className="calc-item">
              <span className="calc-label">Average Payment per Response:</span>
              <span className="calc-value">
                ${getTotalExpectedResponses() > 0 ? (getTotalExpectedCost() / getTotalExpectedResponses()).toFixed(2) : '0.00'}
              </span>
            </div>
            <div className="calc-item total">
              <span className="calc-label">Total Expected Cost:</span>
              <span className="calc-value">${getTotalExpectedCost().toLocaleString()}</span>
            </div>
          </div>
        </div>

        <div className="navigation-buttons">
          <button onClick={previousStep} className="btn btn-secondary">
            Previous
          </button>
          <button 
            onClick={handleContinue} 
            className="btn btn-primary"
            disabled={!canContinue}
          >
            Continue to Participant Selection
          </button>
        </div>
      </div>
    </div>
  );
} 