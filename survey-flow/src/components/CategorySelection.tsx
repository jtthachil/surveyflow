import React, { useState } from 'react';
import { useSurveyFlow } from '../context/SurveyFlowContext';
import { Category } from '../types/survey';

// Mock category data
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

export function CategorySelection() {
  const { state, setCategories, nextStep, previousStep } = useSurveyFlow();
  const [selectedCategories, setSelectedCategories] = useState<Category[]>(state.selectedCategories);

  const isMultipleAllowed = state.selectedRequirement?.categoryCount === 'multiple';

  const handleCategoryToggle = (category: Category) => {
    if (isMultipleAllowed) {
      const isSelected = selectedCategories.some(c => c.id === category.id);
      if (isSelected) {
        setSelectedCategories(selectedCategories.filter(c => c.id !== category.id));
      } else {
        setSelectedCategories([...selectedCategories, category]);
      }
    } else {
      setSelectedCategories([category]);
    }
  };

  const handleContinue = () => {
    setCategories(selectedCategories);
    nextStep();
  };

  const canContinue = selectedCategories.length > 0;

  return (
    <div className="category-selection">
      <div className="container">
        <h1>Select Categories</h1>
        <p className="subtitle">
          {isMultipleAllowed 
            ? 'Select one or more categories (departments) for your survey'
            : 'Select a single category (department) for your survey'
          }
        </p>

        <div className="selection-info">
          <div className="requirement-badge">
            {state.selectedRequirement?.name} - {isMultipleAllowed ? 'Multiple' : 'Single'} Category
          </div>
        </div>

        <div className="category-grid">
          {MOCK_CATEGORIES.map((category) => {
            const isSelected = selectedCategories.some(c => c.id === category.id);
            return (
              <div
                key={category.id}
                className={`category-card ${isSelected ? 'selected' : ''}`}
                onClick={() => handleCategoryToggle(category)}
              >
                <div className="category-icon">
                  📋
                </div>
                <div className="category-info">
                  <div className="category-name">{category.name}</div>
                  <div className="category-department">{category.department}</div>
                </div>
              </div>
            );
          })}
        </div>

        {selectedCategories.length > 0 && (
          <div className="selected-summary">
            <h3>Selected Categories:</h3>
            <div className="selected-items">
              {selectedCategories.map(cat => (
                <span key={cat.id} className="selected-item">
                  {cat.name} ({cat.department})
                </span>
              ))}
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
            Continue
          </button>
        </div>
      </div>
    </div>
  );
} 