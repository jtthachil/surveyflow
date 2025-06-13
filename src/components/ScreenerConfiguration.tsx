import React, { useState, useCallback } from 'react';
import { useSurveyFlow } from '../context/SurveyFlowContext';
import { Screener, ScreenerQuestion } from '../types/survey';

export function ScreenerConfiguration() {
  const { state, setScreeners, nextStep, previousStep } = useSurveyFlow();
  const [screeners, setScreenersState] = useState<Screener[]>([]);

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

  return (
    <div className="screener-configuration">
      <div className="container">
        <h1>Configure Screeners</h1>
        <p className="subtitle">
          Set up screening questions to qualify survey respondents.
          {isMultipleScreeners 
            ? ' You need separate screener sets for each selected category.'
            : ' You need one screener set for all respondents.'
          }
        </p>

        <div className="configuration-info">
          <div className="requirement-badge">
            {state.selectedRequirement?.name} - {isMultipleScreeners ? 'Multiple' : 'Single'} Screener Set
          </div>
          
          <div className="screener-summary">
            <div className="summary-item">
              <span className="label">Total Screener Sets:</span>
              <span className="value">{screeners.length}</span>
            </div>
            <div className="summary-item">
              <span className="label">Pattern:</span>
              <span className="value">{state.selectedRequirement?.screenerPattern}</span>
            </div>
          </div>
        </div>

        <div className="screeners-list">
          {screeners.map((screener) => (
            <div key={screener.id} className="screener-card">
              <div className="screener-header">
                <h3>
                  Screener for {getCategoryName(screener.categoryId)}
                  {screener.categoryId && (
                    <span className="category-badge">
                      📋 {getCategoryName(screener.categoryId)}
                    </span>
                  )}
                </h3>
              </div>

              <div className="questions-list">
                {screener.questions.map((question, qIndex) => (
                  <div key={question.id} className="question-item">
                    <div className="question-header">
                      <span className="question-number">Q{qIndex + 1}</span>
                      <button
                        onClick={() => removeQuestion(screener.id, question.id)}
                        className="remove-question-btn"
                        title="Remove question"
                      >
                        ✕
                      </button>
                    </div>

                    <div className="question-form">
                      <input
                        type="text"
                        value={question.question}
                        onChange={(e) => updateQuestion(screener.id, question.id, 'question', e.target.value)}
                        placeholder="Enter your question..."
                        className="question-input"
                      />

                      <div className="question-options">
                        <select
                          value={question.type}
                          onChange={(e) => updateQuestion(screener.id, question.id, 'type', e.target.value)}
                          className="question-type-select"
                        >
                          <option value="single">Single Choice</option>
                          <option value="multiple">Multiple Choice</option>
                          <option value="text">Text Input</option>
                        </select>

                        <label className="required-checkbox">
                          <input
                            type="checkbox"
                            checked={question.required}
                            onChange={(e) => updateQuestion(screener.id, question.id, 'required', e.target.checked)}
                          />
                          Required
                        </label>
                      </div>

                      {(question.type === 'single' || question.type === 'multiple') && (
                        <div className="answer-options">
                          {question.options?.map((option, optIndex) => (
                            <input
                              key={optIndex}
                              type="text"
                              value={option}
                              onChange={(e) => {
                                const newOptions = [...(question.options || [])];
                                newOptions[optIndex] = e.target.value;
                                updateQuestion(screener.id, question.id, 'options', newOptions);
                              }}
                              placeholder={`Option ${optIndex + 1}`}
                              className="option-input"
                            />
                          ))}
                          <button
                            onClick={() => {
                              const newOptions = [...(question.options || []), `Option ${(question.options?.length || 0) + 1}`];
                              updateQuestion(screener.id, question.id, 'options', newOptions);
                            }}
                            className="add-option-btn"
                          >
                            + Add Option
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                ))}

                <button
                  onClick={() => addQuestion(screener.id)}
                  className="add-question-btn"
                >
                  + Add Question
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="navigation-buttons">
          <button onClick={previousStep} className="btn btn-secondary">
            Previous
          </button>
          <button 
            onClick={handleContinue} 
            className="btn btn-primary"
          >
            Review Configuration
          </button>
        </div>
        <div className="activation-checklist" style={{marginTop: '2rem', padding: '1rem', border: '1px solid #f5c518', borderRadius: '8px', background: '#fffbe6'}}>
          <h3 style={{color: '#b8860b', marginBottom: '0.5rem'}}>⚠️ Before Activation</h3>
          <ul style={{marginLeft: '1.5rem'}}>
            <li>Ensure all redirect links are valid and accessible</li>
            <li>Verify live links are properly configured in your survey platform</li>
            <li>Test screener logic and question flow</li>
            <li>Confirm geography and category targeting is correct</li>
          </ul>
        </div>
      </div>
    </div>
  );
} 