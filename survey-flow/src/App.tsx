import React from 'react';
import { SurveyFlowProvider } from './context/SurveyFlowContext';
import { SurveyFlowWizard } from './components/SurveyFlowWizard';
import './App.css';

function App() {
  return (
    <SurveyFlowProvider>
      <div className="App">
        <SurveyFlowWizard />
      </div>
    </SurveyFlowProvider>
  );
}

export default App; 