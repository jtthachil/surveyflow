import React, { useState } from 'react';
import { useSurveyFlow } from '../context/SurveyFlowContext';
import { 
  PaymentConfig, 
  Geography, 
  Category, 
  SENIORITY_MULTIPLIERS, 
  COMPANY_SIZE_MULTIPLIERS, 
  GEOGRAPHY_SALARY_RATIOS, 
  PROFESSIONAL_PREMIUM 
} from '../types/survey';

// Mock geography and category data
const MOCK_GEOGRAPHIES: Geography[] = [
  { id: 'us', name: 'United States', code: 'US' },
  { id: 'uk', name: 'United Kingdom', code: 'UK' },
  { id: 'ca', name: 'Canada', code: 'CA' },
  { id: 'au', name: 'Australia', code: 'AU' },
  { id: 'de', name: 'Germany', code: 'DE' },
  { id: 'fr', name: 'France', code: 'FR' },
  { id: 'jp', name: 'Japan', code: 'JP' },
  { id: 'br', name: 'Brazil', code: 'BR' }
];

const MOCK_CATEGORIES: Category[] = [
  { id: 'tech', name: 'Technology', department: 'IT' },
  { id: 'marketing', name: 'Marketing', department: 'Marketing' },
  { id: 'sales', name: 'Sales', department: 'Sales' },
  { id: 'hr', name: 'Human Resources', department: 'HR' },
  { id: 'finance', name: 'Finance', department: 'Finance' },
  { id: 'operations', name: 'Operations', department: 'Operations' },
  { id: 'customer-service', name: 'Customer Service', department: 'Support' },
  { id: 'product', name: 'Product Management', department: 'Product' }
];

export function PaymentConfiguration() {
  const { state, setPaymentConfigs, setGeographies, setCategories, nextStep, previousStep } = useSurveyFlow();
  const [paymentConfigs, setPaymentConfigsState] = useState<PaymentConfig[]>([]);
  const [loi, setLoi] = useState<number>(20); // Default LOI of 20 minutes

  // Calculate RLMV price
  const calculateRLMVPrice = (
    geography: string,
    seniority: keyof typeof SENIORITY_MULTIPLIERS,
    companySize: keyof typeof COMPANY_SIZE_MULTIPLIERS,
    currentLoi: number
  ): PaymentConfig['amount'] => {
    const geographyMultiplier = GEOGRAPHY_SALARY_RATIOS[geography as keyof typeof GEOGRAPHY_SALARY_RATIOS] || 1;
    const seniorityMultiplier = SENIORITY_MULTIPLIERS[seniority];
    const companySizeMultiplier = COMPANY_SIZE_MULTIPLIERS[companySize];
    
    // Professional premium: 1x for US, 1.5x for other countries
    const professionalPremium = geography === 'us' ? 1 : PROFESSIONAL_PREMIUM;
    
    // Final calculation: US base * geography ratio * professional premium * seniority * company size * LOI
    const finalPrice = 1 * geographyMultiplier * professionalPremium * seniorityMultiplier * companySizeMultiplier * currentLoi;
    
    return Math.round(finalPrice * 100) / 100; // Round to 2 decimal places
  };

  // Update LOI for all configurations
  const updateLOI = (newLoi: number) => {
    setLoi(newLoi);
    setPaymentConfigsState(configs => 
      configs.map(config => {
        const updatedConfig = { ...config, loi: newLoi };
        updatedConfig.amount = calculateRLMVPrice(
          updatedConfig.geography,
          updatedConfig.seniority,
          updatedConfig.companySize,
          newLoi
        );
        updatedConfig.totalCost = updatedConfig.amount * updatedConfig.expectedResponses;
        return updatedConfig;
      })
    );
  };

  const addGeographySection = (geography: string) => {
    const newConfig: PaymentConfig = {
      liveLinkId: `config-${Date.now()}`,
      geography: geography,
      category: 'tech',
      seniority: 'Entry Level',
      companySize: 'SME',
      loi: loi,
      basePriceUS: 1,
      geographyMultiplier: GEOGRAPHY_SALARY_RATIOS[geography as keyof typeof GEOGRAPHY_SALARY_RATIOS] || 1,
      seniorityMultiplier: SENIORITY_MULTIPLIERS['Entry Level'],
      companySizeMultiplier: COMPANY_SIZE_MULTIPLIERS.SME,
      professionalPremium: geography === 'us' ? 1 : PROFESSIONAL_PREMIUM,
      amount: calculateRLMVPrice(geography, 'Entry Level', 'SME', loi),
      expectedResponses: 100,
      totalCost: 0
    };
    newConfig.totalCost = newConfig.amount * newConfig.expectedResponses;
    
    setPaymentConfigsState([...paymentConfigs, newConfig]);
  };

  const addRowToGeography = (geography: string) => {
    const newConfig: PaymentConfig = {
      liveLinkId: `config-${Date.now()}`,
      geography: geography,
      category: 'tech',
      seniority: 'Entry Level',
      companySize: 'SME',
      loi: loi,
      basePriceUS: 1,
      geographyMultiplier: GEOGRAPHY_SALARY_RATIOS[geography as keyof typeof GEOGRAPHY_SALARY_RATIOS] || 1,
      seniorityMultiplier: SENIORITY_MULTIPLIERS['Entry Level'],
      companySizeMultiplier: COMPANY_SIZE_MULTIPLIERS.SME,
      professionalPremium: geography === 'us' ? 1 : PROFESSIONAL_PREMIUM,
      amount: calculateRLMVPrice(geography, 'Entry Level', 'SME', loi),
      expectedResponses: 100,
      totalCost: 0
    };
    newConfig.totalCost = newConfig.amount * newConfig.expectedResponses;
    
    setPaymentConfigsState([...paymentConfigs, newConfig]);
  };

  const updatePaymentConfig = (configId: string, field: keyof PaymentConfig, value: any) => {
    setPaymentConfigsState(configs => 
      configs.map(config => {
        if (config.liveLinkId === configId) {
          const updatedConfig = { ...config, [field]: value };
          
          // Recalculate price when RLMV factors change
          if (['geography', 'seniority', 'companySize'].includes(field)) {
            updatedConfig.geographyMultiplier = GEOGRAPHY_SALARY_RATIOS[updatedConfig.geography as keyof typeof GEOGRAPHY_SALARY_RATIOS] || 1;
            updatedConfig.seniorityMultiplier = SENIORITY_MULTIPLIERS[updatedConfig.seniority];
            updatedConfig.companySizeMultiplier = COMPANY_SIZE_MULTIPLIERS[updatedConfig.companySize];
            // Update professional premium based on geography
            updatedConfig.professionalPremium = updatedConfig.geography === 'us' ? 1 : PROFESSIONAL_PREMIUM;
            updatedConfig.amount = calculateRLMVPrice(
              updatedConfig.geography,
              updatedConfig.seniority,
              updatedConfig.companySize,
              updatedConfig.loi
            );
          }
          
          // Recalculate total cost
          updatedConfig.totalCost = updatedConfig.amount * updatedConfig.expectedResponses;
          return updatedConfig;
        }
        return config;
      })
    );
  };

  const removePaymentConfig = (configId: string) => {
    setPaymentConfigsState(configs => configs.filter(config => config.liveLinkId !== configId));
  };

  const getTotalCost = () => {
    return paymentConfigs.reduce((total, config) => total + config.totalCost, 0);
  };

  const getTotalResponses = () => {
    return paymentConfigs.reduce((total, config) => total + config.expectedResponses, 0);
  };

  const getAveragePrice = () => {
    const totalResponses = getTotalResponses();
    return totalResponses > 0 ? getTotalCost() / totalResponses : 0;
  };

  const getServiceCharges = () => {
    return getTotalCost() * 0.20; // 20% service charges
  };

  const getGrandTotal = () => {
    return getTotalCost() + getServiceCharges();
  };

  // Group configurations by geography
  const groupedConfigs = paymentConfigs.reduce((groups, config) => {
    const geography = config.geography;
    if (!groups[geography]) {
      groups[geography] = [];
    }
    groups[geography].push(config);
    return groups;
  }, {} as Record<string, PaymentConfig[]>);

  // Get available geographies that haven't been added yet
  const usedGeographies = Object.keys(groupedConfigs);
  const availableGeographies = MOCK_GEOGRAPHIES.filter(geo => !usedGeographies.includes(geo.id));

  const handleContinue = () => {
    // Set payment configs
    setPaymentConfigs(paymentConfigs);
    
    // Extract unique geographies and categories from configs
    const uniqueGeographies = Array.from(new Set(paymentConfigs.map(config => config.geography)))
      .map(geoId => MOCK_GEOGRAPHIES.find(g => g.id === geoId))
      .filter(Boolean) as Geography[];
    
    const uniqueCategories = Array.from(new Set(paymentConfigs.map(config => config.category)))
      .map(catId => MOCK_CATEGORIES.find(c => c.id === catId))
      .filter(Boolean) as Category[];
    
    // Set geographies and categories in context
    setGeographies(uniqueGeographies);
    setCategories(uniqueCategories);
    
    // Automatically determine requirement based on configurations
    const requirement = determineRequirement(uniqueGeographies, uniqueCategories, paymentConfigs);
    if (requirement) {
      // Set the requirement in context (we need to add this to context)
      // For now, we'll store it in state and pass it along
      localStorage.setItem('detectedRequirement', JSON.stringify(requirement));
    }
    
    nextStep();
  };

  // Function to determine requirement type based on configurations
  const determineRequirement = (geographies: Geography[], categories: Category[], configs: PaymentConfig[]) => {
    const hasMultipleGeographies = geographies.length > 1;
    const hasMultipleCategories = categories.length > 1;
    const hasMultipleConfigsPerGeo = Object.values(groupedConfigs).some(configs => configs.length > 1);

    // Debug logging
    console.log('Requirement determination:', {
      geographies: geographies.length,
      categories: categories.length,
      hasMultipleGeographies,
      hasMultipleCategories,
      hasMultipleConfigsPerGeo,
      categoriesFound: categories.map(c => c.name)
    });

    // Mock requirements for determination
    const requirements = [
      {
        id: 1,
        name: "Single Geography, Single Category",
        description: "Simple survey targeting one geography and one category",
        geographyCount: 'single' as const,
        categoryCount: 'single' as const,
        liveLinkPattern: 'single' as const,
        screenerPattern: 'single' as const
      },
      {
        id: 2,
        name: "Multiple Geographies, Single Category",
        description: "Survey targeting multiple geographies with one category",
        geographyCount: 'multiple' as const,
        categoryCount: 'single' as const,
        liveLinkPattern: 'geo-based' as const,
        screenerPattern: 'multiple' as const
      },
      {
        id: 3,
        name: "Multiple Geographies, Multiple Categories",
        description: "Complex survey targeting multiple geographies and categories",
        geographyCount: 'multiple' as const,
        categoryCount: 'multiple' as const,
        liveLinkPattern: 'geo-category-based' as const,
        screenerPattern: 'multiple' as const
      },
      {
        id: 4,
        name: "Single Geography, Multiple Categories",
        description: "Survey targeting one geography with multiple categories",
        geographyCount: 'single' as const,
        categoryCount: 'multiple' as const,
        liveLinkPattern: 'category-based' as const,
        screenerPattern: 'multiple' as const
      }
    ];

    // Determine requirement based on configuration pattern
    let selectedRequirement;
    if (!hasMultipleGeographies && !hasMultipleCategories && !hasMultipleConfigsPerGeo) {
      selectedRequirement = requirements[0]; // Requirement 1
    } else if (hasMultipleGeographies && !hasMultipleCategories) {
      selectedRequirement = requirements[1]; // Requirement 2
    } else if (hasMultipleGeographies && hasMultipleCategories) {
      selectedRequirement = requirements[2]; // Requirement 3
    } else if (!hasMultipleGeographies && hasMultipleCategories) {
      selectedRequirement = requirements[3]; // Requirement 4
    } else {
      selectedRequirement = requirements[2]; // Default to requirement 3 for complex cases
    }
    
    console.log('Selected requirement:', selectedRequirement.id, selectedRequirement.name);
    return selectedRequirement;
  };

  const canContinue = paymentConfigs.length > 0;

  return (
    <div className="payment-configuration">
      <div className="container">
        <h1>Pricing Calculator</h1>
        <p className="subtitle">
          Configure pricing using the RLMV (Relative Labour Market Value) model. Add geographies and configure multiple targeting combinations for each.
        </p>

        <div className="configuration-info">
          <div className="requirement-badge">
            {state.selectedRequirement?.name} - RLMV Pricing Model
          </div>
        </div>

        {/* LOI Configuration */}
        <div className="loi-configuration">
          <h3>📋 Length of Interview (LOI)</h3>
          <div className="loi-input-group">
            <label>LOI (minutes):</label>
            <input
              type="number"
              min="1"
              value={loi}
              onChange={(e) => updateLOI(Math.max(1, parseInt(e.target.value) || 1))}
              className="loi-input"
            />
            <span className="loi-note">This LOI will be applied to all configurations</span>
          </div>
        </div>

        {/* Payment Configurations by Geography */}
        <div className="payment-configs-section">
          <div className="section-header">
            <h3>💰 Geography-based Configurations</h3>
            {availableGeographies.length > 0 && (
              <div className="geography-selector">
                <select 
                  onChange={(e) => {
                    if (e.target.value) {
                      addGeographySection(e.target.value);
                      e.target.value = '';
                    }
                  }}
                  className="geography-select"
                  defaultValue=""
                >
                  <option value="">+ Add Geography</option>
                  {availableGeographies.map(geo => (
                    <option key={geo.id} value={geo.id}>
                      {geo.name} ({geo.code})
                    </option>
                  ))}
                </select>
              </div>
            )}
          </div>

          {Object.entries(groupedConfigs).map(([geography, configs]) => {
            const geoInfo = MOCK_GEOGRAPHIES.find(g => g.id === geography);
            return (
              <div key={geography} className="geography-section">
                <div className="geography-header">
                  <h4>📍 {geoInfo?.name} ({geoInfo?.code})</h4>
                  <button 
                    onClick={() => addRowToGeography(geography)}
                    className="btn btn-secondary btn-small"
                  >
                    + Add Row
                  </button>
                </div>

                <div className="geography-configs">
                  {configs.map((config, index) => (
                    <div key={config.liveLinkId} className="config-row">
                      <div className="row-header">
                        <span className="row-number">Row {index + 1}</span>
                        <button 
                          onClick={() => removePaymentConfig(config.liveLinkId)}
                          className="btn btn-danger btn-small"
                        >
                          Remove
                        </button>
                      </div>

                      <div className="config-form">
                        <div className="form-row">
                          <div className="form-group">
                            <label>Category</label>
                            <select
                              value={config.category}
                              onChange={(e) => updatePaymentConfig(config.liveLinkId, 'category', e.target.value)}
                              className="form-select"
                            >
                              {MOCK_CATEGORIES.map(cat => (
                                <option key={cat.id} value={cat.id}>
                                  {cat.name}
                                </option>
                              ))}
                            </select>
                          </div>

                          <div className="form-group">
                            <label>Seniority Level</label>
                            <select
                              value={config.seniority}
                              onChange={(e) => updatePaymentConfig(config.liveLinkId, 'seniority', e.target.value)}
                              className="form-select"
                            >
                              {Object.keys(SENIORITY_MULTIPLIERS).map(level => (
                                <option key={level} value={level}>
                                  {level} ({SENIORITY_MULTIPLIERS[level as keyof typeof SENIORITY_MULTIPLIERS]}x)
                                </option>
                              ))}
                            </select>
                          </div>

                          <div className="form-group">
                            <label>Company Size</label>
                            <select
                              value={config.companySize}
                              onChange={(e) => updatePaymentConfig(config.liveLinkId, 'companySize', e.target.value)}
                              className="form-select"
                            >
                              <option value="Small">Small (0-50) - {COMPANY_SIZE_MULTIPLIERS.Small}x</option>
                              <option value="SME">SME (50-500) - {COMPANY_SIZE_MULTIPLIERS.SME}x</option>
                              <option value="Mid Market">Mid Market (500-5000) - {COMPANY_SIZE_MULTIPLIERS['Mid Market']}x</option>
                              <option value="Enterprise">Enterprise (&gt;5000) - {COMPANY_SIZE_MULTIPLIERS.Enterprise}x</option>
                            </select>
                          </div>

                          <div className="form-group">
                            <label>Expected Responses</label>
                            <input
                              type="number"
                              min="1"
                              value={config.expectedResponses}
                              onChange={(e) => updatePaymentConfig(config.liveLinkId, 'expectedResponses', Math.max(1, parseInt(e.target.value) || 1))}
                              className="form-input"
                            />
                          </div>
                        </div>

                        {/* Price Display */}
                        <div className="price-display">
                          <div className="price-summary">
                            <span className="price-label">Price per Response:</span>
                            <span className="price-value">${config.amount}</span>
                            <span className="total-label">Total Cost:</span>
                            <span className="total-value">${config.totalCost.toLocaleString()}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}

          {Object.keys(groupedConfigs).length === 0 && (
            <div className="empty-state">
              <p>No configurations added yet. Select a geography to get started.</p>
            </div>
          )}
        </div>

        {/* Total Summary */}
        {paymentConfigs.length > 0 && (
          <div className="total-summary">
            <h3>📊 Total Summary</h3>
            <div className="summary-grid">
              <div className="summary-item">
                <span className="summary-label">Total Configurations:</span>
                <span className="summary-value">{paymentConfigs.length}</span>
              </div>
              <div className="summary-item">
                <span className="summary-label">Total Expected Responses:</span>
                <span className="summary-value">{getTotalResponses().toLocaleString()}</span>
              </div>
              <div className="summary-item">
                <span className="summary-label">Average Price per Response:</span>
                <span className="summary-value">${getAveragePrice().toFixed(2)}</span>
              </div>
              <div className="summary-item">
                <span className="summary-label">Subtotal (Survey Costs):</span>
                <span className="summary-value">${getTotalCost().toLocaleString()}</span>
              </div>
              <div className="summary-item service-charges">
                <span className="summary-label">AkquaintX Service Charges (20%):</span>
                <span className="summary-value">${getServiceCharges().toLocaleString()}</span>
              </div>
              <div className="summary-item total">
                <span className="summary-label">Grand Total:</span>
                <span className="summary-value">${getGrandTotal().toLocaleString()}</span>
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
            disabled={!canContinue}
          >
            Continue to Redirect Links
          </button>
        </div>
      </div>
    </div>
  );
} 