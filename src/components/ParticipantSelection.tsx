import React, { useState, useEffect, useCallback } from 'react';
import { useSurveyFlow } from '../context/SurveyFlowContext';
import type { ParticipantSelection } from '../types/survey';

// Generate comprehensive participant data - 4 participants for each geography/category combination
const generateMockParticipants = () => {
  const geographies = ['us', 'uk', 'ca', 'au', 'de', 'fr', 'jp', 'br'] as const;
  const categories = ['tech', 'marketing', 'sales', 'hr', 'finance', 'operations', 'customer-service', 'product'];
  const experiences = ['Beginner', 'Intermediate', 'Advanced', 'Expert'];
  const availabilities = ['High', 'Medium', 'Low'];
  
  const namesByGeo: Record<string, string[]> = {
    us: ['John Smith', 'Sarah Johnson', 'Michael Brown', 'Emily Davis', 'David Wilson', 'Jessica Garcia', 'James Miller', 'Ashley Martinez'],
    uk: ['James Thompson', 'Sophie Clarke', 'Oliver Harris', 'Emily Taylor', 'Harry Potter', 'Emma Watson', 'Benedict Cumberbatch', 'Keira Knightley'],
    ca: ['Mike Chen', 'Anna Lee', 'Daniel Kim', 'Jessica Wang', 'Ryan Reynolds', 'Rachel McAdams', 'Seth Rogen', 'Ellen Page'],
    au: ['David Brown', 'Rachel Smith', 'Matthew Jones', 'Chloe Williams', 'Chris Hemsworth', 'Margot Robbie', 'Hugh Jackman', 'Nicole Kidman'],
    de: ['Hans Mueller', 'Anna Schmidt', 'Klaus Weber', 'Petra Fischer', 'Stefan Wagner', 'Sabine Becker', 'Thomas Schulz', 'Julia Hoffmann'],
    fr: ['Pierre Dubois', 'Marie Martin', 'Jean Bernard', 'Sophie Moreau', 'Antoine Leroy', 'Camille Roux', 'Nicolas Fournier', 'Isabelle Girard'],
    jp: ['Hiroshi Tanaka', 'Yuki Sato', 'Kenji Suzuki', 'Akiko Watanabe', 'Takeshi Yamamoto', 'Miyuki Nakamura', 'Satoshi Kobayashi', 'Emi Kato'],
    br: ['Carlos Silva', 'Ana Santos', 'Roberto Oliveira', 'Fernanda Costa', 'Paulo Pereira', 'Lucia Rodrigues', 'Marcos Almeida', 'Beatriz Lima']
  };

  const participants: Array<{id: string; name: string; geography: string; category: string; experience: string; availability: string}> = [];
  let participantId = 1;

  geographies.forEach(geo => {
    categories.forEach(category => {
      // Create 4 participants for each geo-category combination
      for (let i = 0; i < 10; i++) {
        const nameIndex = (categories.indexOf(category) * 10 + i) % namesByGeo[geo].length;
        participants.push({
          id: `p${participantId}`,
          name: namesByGeo[geo][nameIndex],
          geography: geo,
          category: category,
          experience: experiences[i % experiences.length],
          availability: availabilities[i % availabilities.length]
        });
        participantId++;
      }
    });
  });

  return participants;
};

const MOCK_PARTICIPANTS = generateMockParticipants();

export function ParticipantSelectionComponent() {
  const { state, setParticipantSelections, nextStep, previousStep } = useSurveyFlow();
  const [participantSelections, setParticipantSelectionsState] = useState<ParticipantSelection[]>([]);

  // Generate criteria for a live link
  const generateCriteriaForLink = useCallback((liveLinkId: string) => {
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
  }, [state.generatedLiveLinks, state.selectedGeographies, state.selectedCategories]);

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
  }, [state.generatedLiveLinks, participantSelections.length, generateCriteriaForLink]);

  const getMatchingParticipants = (liveLinkId: string) => {
    const link = state.generatedLiveLinks.find(l => l.id === liveLinkId);
    if (!link) return MOCK_PARTICIPANTS;

    return MOCK_PARTICIPANTS.filter(participant => {
      let matches = true;
      
      // Check geography match
      if (link.geographyId) {
        const geo = state.selectedGeographies.find(g => g.id === link.geographyId);
        if (geo && participant.geography !== geo.id) {
          matches = false;
        }
      } else {
        // If no specific geography for this link, check if participant's geography is in selected geographies
        const participantGeoSelected = state.selectedGeographies.some(g => g.id === participant.geography);
        if (!participantGeoSelected) {
          matches = false;
        }
      }
      
      // Check category match
      if (link.categoryId) {
        const cat = state.selectedCategories.find(c => c.id === link.categoryId);
        if (cat && participant.category !== cat.id) {
          matches = false;
        }
      } else {
        // If no specific category for this link, check if participant's category is in selected categories
        const participantCatSelected = state.selectedCategories.some(c => c.id === participant.category);
        if (!participantCatSelected) {
          matches = false;
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
    const link = state.generatedLiveLinks.find(l => l.id === liveLinkId);
    if (!link) return 0;
    
    // Find payment config by matching geography and category
    const paymentConfig = state.paymentConfigs.find(p => 
      p.geography === link.geographyId && p.category === link.categoryId
    );
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