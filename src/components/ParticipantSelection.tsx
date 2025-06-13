import React, { useState, useEffect } from 'react';
import { useSurveyFlow } from '../context/SurveyFlowContext';
import type { ParticipantSelection } from '../types/survey';

// Mock participant data
const MOCK_PARTICIPANTS = [
  { id: 'p1', name: 'John Smith', geography: 'us', category: 'marketing', experience: 'Advanced', availability: 'High' },
  { id: 'p2', name: 'Sarah Johnson', geography: 'uk', category: 'hr', experience: 'Expert', availability: 'Medium' },
  { id: 'p3', name: 'Mike Chen', geography: 'ca', category: 'marketing', experience: 'Intermediate', availability: 'High' },
  { id: 'p4', name: 'Emma Wilson', geography: 'us', category: 'hr', experience: 'Advanced', availability: 'High' },
  { id: 'p5', name: 'David Brown', geography: 'au', category: 'marketing', experience: 'Expert', availability: 'Low' },
  { id: 'p6', name: 'Lisa Garcia', geography: 'us', category: 'marketing', experience: 'Beginner', availability: 'High' },
  { id: 'p7', name: 'Tom Anderson', geography: 'uk', category: 'hr', experience: 'Intermediate', availability: 'Medium' },
  { id: 'p8', name: 'Anna Lee', geography: 'ca', category: 'marketing', experience: 'Advanced', availability: 'High' },
];

export function ParticipantSelection() {
  const { state, setParticipantSelections, nextStep, previousStep } = useSurveyFlow();
  const [participantSelections, setParticipantSelectionsState] = useState<ParticipantSelection[]>([]);

  // Initialize participant selections for each live link
  useEffect(() => {
    if (state.generatedLiveLinks.length > 0 && participantSelections.length === 0) {
      const initialSelections = state.generatedLiveLinks.map(link => ({
        liveLinkId: link.id,
        selectedParticipants: [],
        criteria: generateCriteriaForLink(link.id)
      }));
      setParticipantSelectionsState(initialSelections);
    }
  }, [state.generatedLiveLinks, participantSelections.length]);

  const generateCriteriaForLink = (liveLinkId: string) => {
    const link = state.generatedLiveLinks.find(l => l.id === liveLinkId);
    if (!link) return 'General criteria';

    let criteria = [];
    
    if (link.geographyId) {
      const geo = state.selectedGeographies.find(g => g.id === link.geographyId);
      if (geo) criteria.push(`Geography: ${geo.name}`);
    }
    
    if (link.categoryId) {
      const cat = state.selectedCategories.find(c => c.id === link.categoryId);
      if (cat) criteria.push(`Category: ${cat.name}`);
    }

    return criteria.length > 0 ? criteria.join(', ') : 'General criteria';
  };

  const getMatchingParticipants = (liveLinkId: string) => {
    const link = state.generatedLiveLinks.find(l => l.id === liveLinkId);
    if (!link) return MOCK_PARTICIPANTS;

    return MOCK_PARTICIPANTS.filter(participant => {
      let matches = true;
      
      if (link.geographyId) {
        const geo = state.selectedGeographies.find(g => g.id === link.geographyId);
        if (geo && participant.geography !== geo.id) {
          matches = false;
        }
      }
      
      if (link.categoryId) {
        const cat = state.selectedCategories.find(c => c.id === link.categoryId);
        if (cat) {
          const categoryMap: { [key: string]: string } = {
            'marketing': 'marketing',
            'human-resources': 'hr',
            'hr': 'hr'
          };
          const participantCategory = categoryMap[cat.id] || cat.id.toLowerCase();
          if (participant.category !== participantCategory) {
            matches = false;
          }
        }
      }

      return matches;
    });
  };

  const toggleParticipant = (liveLinkId: string, participantId: string) => {
    setParticipantSelectionsState(selections =>
      selections.map(selection => {
        if (selection.liveLinkId === liveLinkId) {
          const isSelected = selection.selectedParticipants.includes(participantId);
          return {
            ...selection,
            selectedParticipants: isSelected
              ? selection.selectedParticipants.filter(id => id !== participantId)
              : [...selection.selectedParticipants, participantId]
          };
        }
        return selection;
      })
    );
  };

  const selectAllMatching = (liveLinkId: string) => {
    const matchingParticipants = getMatchingParticipants(liveLinkId);
    setParticipantSelectionsState(selections =>
      selections.map(selection => {
        if (selection.liveLinkId === liveLinkId) {
          return {
            ...selection,
            selectedParticipants: matchingParticipants.map(p => p.id)
          };
        }
        return selection;
      })
    );
  };

  const clearSelection = (liveLinkId: string) => {
    setParticipantSelectionsState(selections =>
      selections.map(selection => {
        if (selection.liveLinkId === liveLinkId) {
          return {
            ...selection,
            selectedParticipants: []
          };
        }
        return selection;
      })
    );
  };

  const getLinkLabel = (liveLinkId: string) => {
    const link = state.generatedLiveLinks.find(l => l.id === liveLinkId);
    return link ? link.label : 'Unknown Link';
  };

  const getExpectedResponses = (liveLinkId: string) => {
    const paymentConfig = state.paymentConfigs.find(p => p.liveLinkId === liveLinkId);
    return paymentConfig ? paymentConfig.expectedResponses : 0;
  };

  const handleContinue = () => {
    setParticipantSelections(participantSelections);
    nextStep();
  };

  const canContinue = participantSelections.every(selection => 
    selection.selectedParticipants.length > 0
  );

  return (
    <div className="participant-selection">
      <div className="container">
        <h1>Select Participants</h1>
        <p className="subtitle">
          Choose participants for each survey link based on your targeting criteria.
        </p>

        <div className="configuration-info">
          <div className="requirement-badge">
            {state.selectedRequirement?.name} - {state.generatedLiveLinks.length} Live Link{state.generatedLiveLinks.length !== 1 ? 's' : ''}
          </div>
        </div>

        <div className="participant-selections-list">
          {participantSelections.map((selection) => {
            const matchingParticipants = getMatchingParticipants(selection.liveLinkId);
            const expectedResponses = getExpectedResponses(selection.liveLinkId);
            
            return (
              <div key={selection.liveLinkId} className="participant-selection-card">
                <div className="selection-header">
                  <h3>{getLinkLabel(selection.liveLinkId)}</h3>
                  <div className="selection-info">
                    <span className="criteria-badge">
                      🎯 {selection.criteria}
                    </span>
                    <span className="count-badge">
                      {selection.selectedParticipants.length} selected / {expectedResponses} needed
                    </span>
                  </div>
                </div>

                <div className="selection-actions">
                  <button
                    onClick={() => selectAllMatching(selection.liveLinkId)}
                    className="btn btn-small btn-secondary"
                  >
                    Select All Matching ({matchingParticipants.length})
                  </button>
                  <button
                    onClick={() => clearSelection(selection.liveLinkId)}
                    className="btn btn-small btn-outline"
                  >
                    Clear Selection
                  </button>
                </div>

                <div className="participants-grid">
                  {matchingParticipants.map((participant) => {
                    const isSelected = selection.selectedParticipants.includes(participant.id);
                    return (
                      <div
                        key={participant.id}
                        className={`participant-card ${isSelected ? 'selected' : ''}`}
                        onClick={() => toggleParticipant(selection.liveLinkId, participant.id)}
                      >
                        <div className="participant-header">
                          <div className="participant-name">{participant.name}</div>
                          <div className="selection-indicator">
                            {isSelected ? '✓' : '○'}
                          </div>
                        </div>
                        <div className="participant-details">
                          <span className="detail-item">
                            📍 {state.selectedGeographies.find(g => g.id === participant.geography)?.name || participant.geography}
                          </span>
                          <span className="detail-item">
                            📋 {participant.category}
                          </span>
                          <span className="detail-item">
                            🎓 {participant.experience}
                          </span>
                          <span className={`availability ${participant.availability.toLowerCase()}`}>
                            🟢 {participant.availability} Availability
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {matchingParticipants.length === 0 && (
                  <div className="no-participants">
                    <p>No participants match the criteria for this link.</p>
                    <p>Consider adjusting your targeting requirements.</p>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        <div className="selection-summary">
          <h3>📊 Selection Summary</h3>
          <div className="summary-grid">
            {participantSelections.map((selection) => {
              const expectedResponses = getExpectedResponses(selection.liveLinkId);
              const selectedCount = selection.selectedParticipants.length;
              const isAdequate = selectedCount >= expectedResponses;
              
              return (
                <div key={selection.liveLinkId} className="summary-item">
                  <span className="summary-label">{getLinkLabel(selection.liveLinkId)}:</span>
                  <span className={`summary-value ${isAdequate ? 'adequate' : 'insufficient'}`}>
                    {selectedCount} / {expectedResponses}
                    {isAdequate ? ' ✓' : ' ⚠️'}
                  </span>
                </div>
              );
            })}
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
            Review Configuration
          </button>
        </div>
      </div>
    </div>
  );
} 