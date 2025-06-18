import React, { useState, useCallback } from 'react';
import { useSurveyFlow } from '../context/SurveyFlowContext';
import { Screener, ScreenerQuestion } from '../types/survey';

export function ScreenerConfiguration() {
  const { state, setScreeners, nextStep, previousStep } = useSurveyFlow();
  const [screeners, setScreenersState] = useState<Screener[]>([]);
  const [aiGenerationStatus, setAiGenerationStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

  const isMultipleScreeners = state.selectedRequirement?.screenerPattern === 'multiple';

  // Generate initial screeners based on requirement pattern
  const generateInitialScreeners = useCallback(() => {
    const newScreeners: Screener[] = [];
    
    if (isMultipleScreeners) {
      // Generate screeners based on categories for Requirements 3 & 4
      state.selectedCategories.forEach((category, index) => {
        newScreeners.push({
          id: 'placeholder',
          categoryId: category.id,
          questions: [
            {
              id: 'placeholder',
              question: `What is your experience level with ${category.name}?`,
              type: 'single',
              options: ['Beginner', 'Intermediate', 'Advanced', 'Expert'],
              required: true
            },
            {
              id: 'placeholder',
              question: `How often do you work with ${category.name} related tasks?`,
              type: 'single',
              options: ['Daily', 'Weekly', 'Monthly', 'Rarely', 'Never'],
              required: true
            }
          ]
        });
      });
    } else {
      // Single screener set for Requirements 1 & 2
      newScreeners.push({
        id: 'placeholder',
        questions: [
          {
            id: 'placeholder',
            question: 'What is your current employment status?',
            type: 'single',
            options: ['Employed full-time', 'Employed part-time', 'Self-employed', 'Unemployed', 'Student', 'Retired'],
            required: true
          },
          {
            id: 'placeholder',
            question: 'Which age group do you belong to?',
            type: 'single',
            options: ['18-24', '25-34', '35-44', '45-54', '55-64', '65+'],
            required: true
          },
          {
            id: 'placeholder',
            question: 'What is your annual household income?',
            type: 'single',
            options: ['Under $25,000', '$25,000-$49,999', '$50,000-$74,999', '$75,000-$99,999', '$100,000+'],
            required: false
          }
        ]
      });
    }
    
    setScreenersState(newScreeners);
  }, [isMultipleScreeners, state.selectedCategories]);

  // Initialize screeners when component mounts or when requirements change
  React.useEffect(() => {
    if (screeners.length === 0) {
      generateInitialScreeners();
    }
  }, [generateInitialScreeners, screeners.length]);

  const addQuestion = (screenerId: string) => {
    setScreenersState(screeners.map(screener => {
      if (screener.id === screenerId) {
        const newQuestion: ScreenerQuestion = {
          id: 'placeholder',
          question: '',
          type: 'single',
          options: ['Option 1', 'Option 2'],
          required: true
        };
        return {
          ...screener,
          questions: [...screener.questions, newQuestion]
        };
      }
      return screener;
    }));
  };

  const updateQuestion = (screenerId: string, questionId: string, field: keyof ScreenerQuestion, value: any) => {
    setScreenersState(screeners.map(screener => {
      if (screener.id === screenerId) {
        return {
          ...screener,
          questions: screener.questions.map(q => 
            q.id === questionId ? { ...q, [field]: value } : q
          )
        };
      }
      return screener;
    }));
  };

  const removeQuestion = (screenerId: string, questionId: string) => {
    setScreenersState(screeners.map(screener => {
      if (screener.id === screenerId) {
        return {
          ...screener,
          questions: screener.questions.filter(q => q.id !== questionId)
        };
      }
      return screener;
    }));
  };

  const handleContinue = () => {
    setScreeners(screeners);
    nextStep();
  };

  const getCategoryName = (categoryId?: string) => {
    if (!categoryId) return 'General';
    const category = state.selectedCategories.find(c => c.id === categoryId);
    return category ? category.name : 'Unknown';
  };

  const generateScreenersWithAI = async () => {
    setAiGenerationStatus('loading');
    
    try {
      // Simulate AI generation delay
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Generate AI-powered screeners based on configurations
      const aiGeneratedScreeners: Screener[] = [];
      
      if (isMultipleScreeners) {
        // Generate category-specific screeners
        state.selectedCategories.forEach((category, index) => {
          const categoryScreener: Screener = {
            id: `ai-screener-${category.id}`,
            categoryId: category.id,
            questions: generateAIQuestionsForCategory(category.name, category.department)
          };
          aiGeneratedScreeners.push(categoryScreener);
        });
      } else {
        // Generate single comprehensive screener
        const generalScreener: Screener = {
          id: 'ai-screener-general',
          questions: generateAIGeneralQuestions()
        };
        aiGeneratedScreeners.push(generalScreener);
      }
      
      setScreenersState(aiGeneratedScreeners);
      setAiGenerationStatus('success');
    } catch (error) {
      setAiGenerationStatus('error');
      console.error('AI generation failed:', error);
    }
  };

  const generateAIQuestionsForCategory = (categoryName: string, department: string): ScreenerQuestion[] => {
    return [
      {
        id: `ai-q1-${categoryName}`,
        question: `How many years of experience do you have in ${categoryName}?`,
        type: 'single',
        options: ['Less than 1 year', '1-3 years', '3-5 years', '5-10 years', 'More than 10 years'],
        required: true
      },
      {
        id: `ai-q2-${categoryName}`,
        question: `What is your current role level in ${categoryName}?`,
        type: 'single',
        options: ['Entry Level', 'Mid-level', 'Senior', 'Lead/Manager', 'Director/VP', 'C-Level'],
        required: true
      },
      {
        id: `ai-q3-${categoryName}`,
        question: `Which of the following ${categoryName} tools/technologies are you familiar with?`,
        type: 'multiple',
        options: getToolsForCategory(categoryName),
        required: false
      },
      {
        id: `ai-q4-${categoryName}`,
        question: `How would you rate your expertise in ${categoryName}?`,
        type: 'single',
        options: ['Beginner', 'Intermediate', 'Advanced', 'Expert'],
        required: true
      }
    ];
  };

  const generateAIGeneralQuestions = (): ScreenerQuestion[] => {
    return [
      {
        id: 'ai-general-1',
        question: 'What is your current employment status?',
        type: 'single',
        options: ['Employed full-time', 'Employed part-time', 'Self-employed', 'Unemployed', 'Student', 'Retired'],
        required: true
      },
      {
        id: 'ai-general-2',
        question: 'What is your primary industry of work?',
        type: 'single',
        options: ['Technology', 'Healthcare', 'Finance', 'Education', 'Manufacturing', 'Retail', 'Other'],
        required: true
      },
      {
        id: 'ai-general-3',
        question: 'What is your company size?',
        type: 'single',
        options: ['1-10 employees', '11-50 employees', '51-200 employees', '201-1000 employees', '1000+ employees'],
        required: true
      },
      {
        id: 'ai-general-4',
        question: 'Which age group do you belong to?',
        type: 'single',
        options: ['18-24', '25-34', '35-44', '45-54', '55-64', '65+'],
        required: false
      }
    ];
  };

  const getToolsForCategory = (categoryName: string): string[] => {
    const toolsMap: Record<string, string[]> = {
      'Technology': ['JavaScript', 'Python', 'React', 'Node.js', 'AWS', 'Docker', 'Kubernetes'],
      'Marketing': ['Google Analytics', 'HubSpot', 'Salesforce', 'Adobe Creative Suite', 'Mailchimp', 'SEMrush'],
      'Sales': ['CRM Software', 'Salesforce', 'HubSpot', 'Pipedrive', 'LinkedIn Sales Navigator', 'Zoom'],
      'Human Resources': ['HRIS Systems', 'Workday', 'BambooHR', 'ATS Software', 'Slack', 'Microsoft Teams'],
      'Finance': ['Excel/Spreadsheets', 'QuickBooks', 'SAP', 'Oracle', 'Tableau', 'Power BI'],
      'Operations': ['Project Management Tools', 'Asana', 'Trello', 'Jira', 'Slack', 'Microsoft Project']
    };
    
    return toolsMap[categoryName] || ['Industry-specific tools', 'General business software', 'Communication platforms'];
  };

  return (
    <div className="screener-configuration">
      <div className="container">
        <div className="screener-header-section">
          <h1>🎯 Configure Screeners</h1>
          <p className="subtitle">
            Set up screening questions to qualify survey respondents and ensure data quality.
            {isMultipleScreeners 
              ? ' Create targeted screener sets for each category.'
              : ' Design a comprehensive screener for all respondents.'
            }
          </p>
        </div>

        <div className="screener-overview-card">
          <div className="overview-header">
            <span className="overview-icon">📊</span>
            <h3>Screener Overview</h3>
          </div>
          
          <div className="overview-content">
            <div className="overview-badge">
              <span className="badge-icon">🎯</span>
              <span className="badge-text">{state.selectedRequirement?.name}</span>
              <span className="badge-pattern">{isMultipleScreeners ? 'Multiple Sets' : 'Single Set'}</span>
            </div>
            
            <div className="overview-stats">
              <div className="stat-item">
                <span className="stat-icon">📝</span>
                <div className="stat-content">
                  <span className="stat-value">{screeners.length}</span>
                  <span className="stat-label">Screener Sets</span>
                </div>
              </div>
              <div className="stat-item">
                <span className="stat-icon">❓</span>
                <div className="stat-content">
                  <span className="stat-value">{screeners.reduce((total, s) => total + s.questions.length, 0)}</span>
                  <span className="stat-label">Total Questions</span>
                </div>
              </div>
              <div className="stat-item">
                <span className="stat-icon">🔧</span>
                <div className="stat-content">
                  <span className="stat-value">{state.selectedRequirement?.screenerPattern}</span>
                  <span className="stat-label">Pattern</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* AI Screener Generation Section */}
        <div className="ai-generation-section">
          <div className="ai-generation-header">
            <span className="ai-icon">🤖</span>
            <h3>Generate Screeners with AI</h3>
          </div>
          
          <div className="ai-generation-content">
            <p className="ai-description">
              Let our AI automatically generate intelligent screener questions based on your survey configuration. 
              The AI will analyze your selected geographies, categories, and requirements to create targeted screening questions.
            </p>
            
            <div className="ai-features">
              <div className="ai-feature">
                <span className="ai-feature-icon">🎯</span>
                <span className="ai-feature-text">Category-specific questions</span>
              </div>
              <div className="ai-feature">
                <span className="ai-feature-icon">🌍</span>
                <span className="ai-feature-text">Geography-aware targeting</span>
              </div>
              <div className="ai-feature">
                <span className="ai-feature-icon">⚡</span>
                <span className="ai-feature-text">Instant generation</span>
              </div>
              <div className="ai-feature">
                <span className="ai-feature-icon">✨</span>
                <span className="ai-feature-text">Professional quality</span>
              </div>
            </div>

            {/* Configuration Preview */}
            <div className="ai-config-preview">
              <div className="ai-config-title">Current Configuration</div>
              <div className="ai-config-details">
                <div className="config-detail">
                  <span className="config-detail-icon">🌍</span>
                  <span>{state.selectedGeographies.length} Geographies</span>
                </div>
                <div className="config-detail">
                  <span className="config-detail-icon">🎯</span>
                  <span>{state.selectedCategories.length} Categories</span>
                </div>
                <div className="config-detail">
                  <span className="config-detail-icon">📋</span>
                  <span>{state.selectedRequirement?.name}</span>
                </div>
                <div className="config-detail">
                  <span className="config-detail-icon">🔧</span>
                  <span>{isMultipleScreeners ? 'Multiple' : 'Single'} Screener Set</span>
                </div>
              </div>
            </div>
            
            <div className="ai-generation-actions">
              <button
                onClick={generateScreenersWithAI}
                disabled={aiGenerationStatus === 'loading'}
                className="ai-generate-btn"
              >
                {aiGenerationStatus === 'loading' ? (
                  <>
                    <span className="loading-spinner">⟳</span>
                    <span>Generating...</span>
                  </>
                ) : (
                  <>
                    <span className="ai-icon">🤖</span>
                    <span>Generate AI Screeners</span>
                  </>
                )}
              </button>
              
              {aiGenerationStatus === 'success' && (
                <div className="ai-status">
                  <span>✅</span>
                  <span>Screeners generated successfully!</span>
                </div>
              )}
              
              {aiGenerationStatus === 'loading' && (
                <div className="ai-status loading">
                  <span className="loading-spinner">⟳</span>
                  <span>AI is analyzing your configuration...</span>
                </div>
              )}
              
              {aiGenerationStatus === 'error' && (
                <div className="ai-status error">
                  <span>❌</span>
                  <span>Generation failed. Please try again.</span>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="screeners-workspace">
          {screeners.map((screener, index) => (
            <div key={screener.id} className="screener-card enhanced">
              <div className="screener-card-header">
                <div className="screener-title-section">
                  <span className="screener-icon">📋</span>
                  <div className="screener-title-content">
                    <h3>Screener for {getCategoryName(screener.categoryId)}</h3>
                    <span className="screener-subtitle">{screener.questions.length} questions configured</span>
                  </div>
                </div>
                {screener.categoryId && (
                  <div className="category-badge enhanced">
                    <span className="category-icon">🎯</span>
                    <span className="category-name">{getCategoryName(screener.categoryId)}</span>
                  </div>
                )}
              </div>

              <div className="questions-workspace">
                {screener.questions.map((question, qIndex) => (
                  <div key={question.id} className="question-card">
                    <div className="question-card-header">
                      <div className="question-number-badge">
                        <span className="question-icon">❓</span>
                        <span className="question-number">Q{qIndex + 1}</span>
                      </div>
                      <div className="question-actions">
                        <button
                          onClick={() => removeQuestion(screener.id, question.id)}
                          className="remove-question-btn enhanced"
                          title="Remove question"
                        >
                          <span className="remove-icon">🗑️</span>
                        </button>
                      </div>
                    </div>

                    <div className="question-form enhanced">
                      <div className="question-input-section">
                        <label className="question-label">Question Text</label>
                        <input
                          type="text"
                          value={question.question}
                          onChange={(e) => updateQuestion(screener.id, question.id, 'question', e.target.value)}
                          placeholder="Enter your screening question..."
                          className="question-input enhanced"
                        />
                      </div>

                      <div className="question-settings">
                        <div className="setting-group">
                          <label className="setting-label">Question Type</label>
                          <select
                            value={question.type}
                            onChange={(e) => updateQuestion(screener.id, question.id, 'type', e.target.value)}
                            className="question-type-select enhanced"
                          >
                            <option value="single">📌 Single Choice</option>
                            <option value="multiple">☑️ Multiple Choice</option>
                            <option value="text">✏️ Text Input</option>
                          </select>
                        </div>

                        <div className="setting-group">
                          <label className="required-toggle">
                            <input
                              type="checkbox"
                              checked={question.required}
                              onChange={(e) => updateQuestion(screener.id, question.id, 'required', e.target.checked)}
                              className="required-checkbox"
                            />
                            <span className="toggle-slider"></span>
                            <span className="toggle-label">Required Question</span>
                          </label>
                        </div>
                      </div>

                      {(question.type === 'single' || question.type === 'multiple') && (
                        <div className="answer-options-section">
                          <label className="options-label">Answer Options</label>
                          <div className="answer-options enhanced">
                            {question.options?.map((option, optIndex) => (
                              <div key={optIndex} className="option-item">
                                <span className="option-number">{optIndex + 1}</span>
                                <input
                                  type="text"
                                  value={option}
                                  onChange={(e) => {
                                    const newOptions = [...(question.options || [])];
                                    newOptions[optIndex] = e.target.value;
                                    updateQuestion(screener.id, question.id, 'options', newOptions);
                                  }}
                                  placeholder={`Option ${optIndex + 1}`}
                                  className="option-input enhanced"
                                />
                                <button
                                  onClick={() => {
                                    const newOptions = question.options?.filter((_, i) => i !== optIndex) || [];
                                    updateQuestion(screener.id, question.id, 'options', newOptions);
                                  }}
                                  className="remove-option-btn"
                                  title="Remove option"
                                >
                                  ✕
                                </button>
                              </div>
                            ))}
                            <button
                              onClick={() => {
                                const newOptions = [...(question.options || []), `Option ${(question.options?.length || 0) + 1}`];
                                updateQuestion(screener.id, question.id, 'options', newOptions);
                              }}
                              className="add-option-btn enhanced"
                            >
                              <span className="add-icon">➕</span>
                              <span>Add Option</span>
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                ))}

                <div className="add-question-section">
                  <button
                    onClick={() => addQuestion(screener.id)}
                    className="add-question-btn enhanced"
                  >
                    <span className="add-icon">➕</span>
                    <span>Add New Question</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="activation-checklist enhanced">
          <div className="checklist-header">
            <span className="checklist-icon">⚠️</span>
            <h3>Pre-Activation Checklist</h3>
          </div>
          <div className="checklist-content">
            <div className="checklist-items">
              <div className="checklist-item">
                <span className="check-icon">✅</span>
                <span>Ensure all redirect links are valid and accessible</span>
              </div>
              <div className="checklist-item">
                <span className="check-icon">✅</span>
                <span>Verify live links are properly configured in your survey platform</span>
              </div>
              <div className="checklist-item">
                <span className="check-icon">✅</span>
                <span>Test screener logic and question flow</span>
              </div>
              <div className="checklist-item">
                <span className="check-icon">✅</span>
                <span>Confirm geography and category targeting is correct</span>
              </div>
            </div>
          </div>
        </div>

        <div className="navigation-buttons">
          <button onClick={previousStep} className="btn btn-secondary enhanced">
            <span className="btn-icon">⬅️</span>
            Previous
          </button>
          <button 
            onClick={handleContinue} 
            className="btn btn-primary enhanced"
          >
            <span className="btn-icon">🔍</span>
            Review Configuration
          </button>
        </div>
      </div>
    </div>
  );
} 