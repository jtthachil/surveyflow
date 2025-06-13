import { FlowRequirement } from '../types/survey';

export const FLOW_REQUIREMENTS: FlowRequirement[] = [
  {
    id: 1,
    name: 'Requirement 1',
    description: 'Single geography, single category, single live link, single screener set',
    geographyCount: 'single',
    categoryCount: 'single',
    liveLinkPattern: 'single',
    screenerPattern: 'single'
  },
  {
    id: 2,
    name: 'Requirement 2', 
    description: 'Multiple geographies, single category, multiple geo-based live links, single screener set',
    geographyCount: 'multiple',
    categoryCount: 'single',
    liveLinkPattern: 'geo-based',
    screenerPattern: 'single'
  },
  {
    id: 3,
    name: 'Requirement 3',
    description: 'Single geography, multiple categories, single live link, multiple screener sets',
    geographyCount: 'single',
    categoryCount: 'multiple',
    liveLinkPattern: 'single',
    screenerPattern: 'multiple'
  },
  {
    id: 4,
    name: 'Potential (based on R3)',
    description: 'Single geography, multiple categories, multiple category-based live links, multiple screener sets',
    geographyCount: 'single',
    categoryCount: 'multiple',
    liveLinkPattern: 'category-based',
    screenerPattern: 'multiple'
  },
  {
    id: 5,
    name: 'Requirement 4',
    description: 'Multiple geographies, multiple categories, multiple geo & category-based live links, multiple screener sets',
    geographyCount: 'multiple',
    categoryCount: 'multiple',
    liveLinkPattern: 'geo-category-based',
    screenerPattern: 'multiple'
  }
]; 