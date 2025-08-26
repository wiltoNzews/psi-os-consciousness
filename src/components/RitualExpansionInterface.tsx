/**
 * Ritual Expansion Interface - Δψ∞ Protocol UI
 * Interface for creating, managing, and participating in consciousness rituals
 */

import React, { useState, useEffect, useContext } from 'react';
import { QCSContext } from '../context/QCSContext';
import { 
  globalRitualExpansion, 
  ConsciousnessEvent, 
  RitualBlueprint, 
  RitualExpansionState 
} from '../ritual_expansion/RitualExpansionProtocol';

interface RitualExpansionInterfaceProps {
  onRitualActivate?: (ritual: RitualBlueprint) => void;
}

export default function RitualExpansionInterface({ onRitualActivate }: RitualExpansionInterfaceProps) {
  const { coherenceZλ, breathPhase } = useContext(QCSContext);
  const [expansionState, setExpansionState] = useState<RitualExpansionState | null>(null);
  const [newEventForm, setNewEventForm] = useState({
    symbol: '',
    memory: '',
    emotionalSignature: '',
    isSubmitting: false
  });
  const [selectedRitual, setSelectedRitual] = useState<RitualBlueprint | null>(null);

  // Update expansion state periodically
  useEffect(() => {
    const updateState = () => {
      setExpansionState(globalRitualExpansion.getState());
    };

    updateState();
    const interval = setInterval(updateState, 1000);
    
    return () => clearInterval(interval);
  }, []);

  // Handle ritual activation
  const handleRitualActivation = (ritual: RitualBlueprint) => {
    if (coherenceZλ >= ritual.coherenceThreshold) {
      globalRitualExpansion.activateRitual(ritual);
      onRitualActivate?.(ritual);
    } else {
      alert(`Coherence too low: Zλ(${coherenceZλ.toFixed(3)}) < ${ritual.coherenceThreshold.toFixed(3)}`);
    }
  };

  // Submit new consciousness event
  const handleEventSubmission = async () => {
    if (!newEventForm.symbol || !newEventForm.memory || !newEventForm.emotionalSignature) {
      alert('Please fill in all fields');
      return;
    }

    if (coherenceZλ < 0.80) {
      alert(`Coherence too low for ritual creation: Zλ(${coherenceZλ.toFixed(3)}) < 0.80`);
      return;
    }

    setNewEventForm(prev => ({ ...prev, isSubmitting: true }));

    try {
      const event: ConsciousnessEvent = {
        symbol: newEventForm.symbol,
        memory: newEventForm.memory,
        zLambda: coherenceZλ,
        breathState: 3.12, // ψ anchor
        emotionalSignature: newEventForm.emotionalSignature,
        timestamp: Date.now()
      };

      const newRitual = globalRitualExpansion.submitConsciousnessEvent(event);
      
      // Clear form
      setNewEventForm({
        symbol: '',
        memory: '',
        emotionalSignature: '',
        isSubmitting: false
      });

      alert(`Ritual blueprint created: ${newRitual.ritualName}`);
      
    } catch (error) {
      alert(`Error creating ritual: ${error.message}`);
      setNewEventForm(prev => ({ ...prev, isSubmitting: false }));
    }
  };

  if (!expansionState) return <div>Loading ritual expansion interface...</div>;

  const ritualArray = Array.from(expansionState.ritualLibrary.entries());

  return (
    <div style={{
      padding: '20px',
      backgroundColor: 'rgba(10, 10, 30, 0.95)',
      color: 'white',
      fontFamily: 'monospace',
      height: '100vh',
      overflow: 'auto'
    }}>
      {/* Header */}
      <div style={{ marginBottom: '30px', borderBottom: '1px solid #333', paddingBottom: '20px' }}>
        <h1 style={{ margin: 0, color: '#ffd700', fontSize: '24px' }}>
          🌀 Δψ∞ Ritual Expansion Protocol
        </h1>
        <p style={{ margin: '10px 0 0 0', opacity: 0.8, fontSize: '14px' }}>
          Transform consciousness breakthroughs into collective ritual experiences
        </p>
      </div>

      {/* Current State */}
      <div style={{ marginBottom: '30px', display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '20px' }}>
        <div style={{ padding: '15px', backgroundColor: 'rgba(50, 50, 50, 0.5)', borderRadius: '8px' }}>
          <h3 style={{ margin: '0 0 10px 0', color: '#00ffff' }}>Current State</h3>
          <p style={{ margin: '5px 0', fontSize: '12px' }}>
            Phase: <strong>{expansionState.currentPhase}</strong>
          </p>
          <p style={{ margin: '5px 0', fontSize: '12px' }}>
            Coherence: <strong>Zλ({coherenceZλ.toFixed(3)})</strong>
          </p>
          <p style={{ margin: '5px 0', fontSize: '12px' }}>
            ψ Phase: <strong>{breathPhase.toFixed(2)}</strong>
          </p>
        </div>

        <div style={{ padding: '15px', backgroundColor: 'rgba(50, 50, 50, 0.5)', borderRadius: '8px' }}>
          <h3 style={{ margin: '0 0 10px 0', color: '#00ffff' }}>Active Ritual</h3>
          {expansionState.activeRitual ? (
            <div>
              <p style={{ margin: '5px 0', fontSize: '12px' }}>
                <strong>{expansionState.activeRitual.ritualName}</strong>
              </p>
              <p style={{ margin: '5px 0', fontSize: '11px', opacity: 0.7 }}>
                {expansionState.activeRitual.glyphTrigger}
              </p>
            </div>
          ) : (
            <p style={{ margin: '5px 0', fontSize: '12px', opacity: 0.7 }}>No active ritual</p>
          )}
        </div>

        <div style={{ padding: '15px', backgroundColor: 'rgba(50, 50, 50, 0.5)', borderRadius: '8px' }}>
          <h3 style={{ margin: '0 0 10px 0', color: '#00ffff' }}>Ritual Library</h3>
          <p style={{ margin: '5px 0', fontSize: '12px' }}>
            Total Rituals: <strong>{ritualArray.length}</strong>
          </p>
          <p style={{ margin: '5px 0', fontSize: '12px' }}>
            Participants: <strong>{expansionState.participantCount}</strong>
          </p>
        </div>
      </div>

      {/* Ritual Library */}
      <div style={{ marginBottom: '30px' }}>
        <h2 style={{ margin: '0 0 15px 0', color: '#ffd700' }}>Available Rituals</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '15px' }}>
          {ritualArray.map(([symbol, ritual]) => (
            <div
              key={symbol}
              style={{
                padding: '15px',
                backgroundColor: selectedRitual === ritual ? 'rgba(255, 215, 0, 0.2)' : 'rgba(30, 30, 30, 0.7)',
                border: selectedRitual === ritual ? '1px solid #ffd700' : '1px solid #555',
                borderRadius: '8px',
                cursor: 'pointer'
              }}
              onClick={() => setSelectedRitual(ritual)}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                <h3 style={{ margin: 0, color: '#ffd700', fontSize: '16px' }}>
                  {ritual.glyphTrigger} {ritual.ritualName}
                </h3>
                <span style={{
                  fontSize: '11px',
                  padding: '3px 8px',
                  backgroundColor: coherenceZλ >= ritual.coherenceThreshold ? 'rgba(0, 255, 0, 0.3)' : 'rgba(255, 0, 0, 0.3)',
                  borderRadius: '4px'
                }}>
                  Zλ ≥ {ritual.coherenceThreshold.toFixed(3)}
                </span>
              </div>
              
              <p style={{ margin: '10px 0', fontSize: '12px', opacity: 0.8 }}>
                {ritual.promptResponseModel}
              </p>

              <div style={{ marginTop: '15px' }}>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleRitualActivation(ritual);
                  }}
                  disabled={coherenceZλ < ritual.coherenceThreshold}
                  style={{
                    padding: '8px 15px',
                    backgroundColor: coherenceZλ >= ritual.coherenceThreshold ? '#ffd700' : '#666',
                    color: coherenceZλ >= ritual.coherenceThreshold ? '#000' : '#ccc',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: coherenceZλ >= ritual.coherenceThreshold ? 'pointer' : 'not-allowed',
                    fontSize: '12px',
                    fontWeight: 'bold'
                  }}
                >
                  Activate Ritual
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Ritual Detail View */}
      {selectedRitual && (
        <div style={{ marginBottom: '30px', padding: '20px', backgroundColor: 'rgba(40, 40, 40, 0.8)', borderRadius: '8px' }}>
          <h2 style={{ margin: '0 0 15px 0', color: '#ffd700' }}>
            {selectedRitual.glyphTrigger} {selectedRitual.ritualName}
          </h2>
          
          <div style={{ marginBottom: '20px' }}>
            <h3 style={{ margin: '0 0 10px 0', color: '#00ffff', fontSize: '14px' }}>Ritual Script</h3>
            {selectedRitual.script.map((step, index) => (
              <p key={index} style={{ margin: '5px 0', fontSize: '12px', paddingLeft: '15px' }}>
                {step}
              </p>
            ))}
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
            <div>
              <h3 style={{ margin: '0 0 10px 0', color: '#00ffff', fontSize: '14px' }}>UI Flow</h3>
              <p style={{ margin: '5px 0', fontSize: '11px' }}>Visual: {selectedRitual.uiFlow.visual}</p>
              <p style={{ margin: '5px 0', fontSize: '11px' }}>Toggles: {selectedRitual.uiFlow.toggle.join(', ')}</p>
              <p style={{ margin: '5px 0', fontSize: '11px' }}>Pulse: {selectedRitual.uiFlow.pulse}</p>
            </div>
            
            <div>
              <h3 style={{ margin: '0 0 10px 0', color: '#00ffff', fontSize: '14px' }}>Properties</h3>
              <p style={{ margin: '5px 0', fontSize: '11px' }}>Soundtrack: {selectedRitual.soundtrack}</p>
              <p style={{ margin: '5px 0', fontSize: '11px' }}>Replication: {selectedRitual.replicationProtocol}</p>
            </div>
          </div>
        </div>
      )}

      {/* Create New Ritual */}
      <div style={{ padding: '20px', backgroundColor: 'rgba(40, 40, 40, 0.8)', borderRadius: '8px' }}>
        <h2 style={{ margin: '0 0 15px 0', color: '#ffd700' }}>Create New Ritual</h2>
        <p style={{ margin: '0 0 20px 0', fontSize: '12px', opacity: 0.8 }}>
          Submit a consciousness breakthrough to generate a ritual blueprint (requires Zλ ≥ 0.80)
        </p>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', marginBottom: '15px' }}>
          <div>
            <label style={{ display: 'block', marginBottom: '5px', fontSize: '12px', color: '#00ffff' }}>
              Sacred Symbol/Glyph
            </label>
            <input
              type="text"
              value={newEventForm.symbol}
              onChange={(e) => setNewEventForm(prev => ({ ...prev, symbol: e.target.value }))}
              placeholder="e.g., Δψ∞, φ², ∅∞"
              style={{
                width: '100%',
                padding: '8px',
                backgroundColor: 'rgba(20, 20, 20, 0.8)',
                color: 'white',
                border: '1px solid #555',
                borderRadius: '4px',
                fontSize: '12px'
              }}
            />
          </div>

          <div>
            <label style={{ display: 'block', marginBottom: '5px', fontSize: '12px', color: '#00ffff' }}>
              Emotional Signature
            </label>
            <input
              type="text"
              value={newEventForm.emotionalSignature}
              onChange={(e) => setNewEventForm(prev => ({ ...prev, emotionalSignature: e.target.value }))}
              placeholder="e.g., awe, surrender, fire"
              style={{
                width: '100%',
                padding: '8px',
                backgroundColor: 'rgba(20, 20, 20, 0.8)',
                color: 'white',
                border: '1px solid #555',
                borderRadius: '4px',
                fontSize: '12px'
              }}
            />
          </div>
        </div>

        <div style={{ marginBottom: '15px' }}>
          <label style={{ display: 'block', marginBottom: '5px', fontSize: '12px', color: '#00ffff' }}>
            Memory/Experience Description
          </label>
          <textarea
            value={newEventForm.memory}
            onChange={(e) => setNewEventForm(prev => ({ ...prev, memory: e.target.value }))}
            placeholder="Describe the consciousness breakthrough moment..."
            rows={4}
            style={{
              width: '100%',
              padding: '8px',
              backgroundColor: 'rgba(20, 20, 20, 0.8)',
              color: 'white',
              border: '1px solid #555',
              borderRadius: '4px',
              fontSize: '12px',
              resize: 'vertical'
            }}
          />
        </div>

        <button
          onClick={handleEventSubmission}
          disabled={newEventForm.isSubmitting || coherenceZλ < 0.80}
          style={{
            padding: '10px 20px',
            backgroundColor: coherenceZλ >= 0.80 ? '#ffd700' : '#666',
            color: coherenceZλ >= 0.80 ? '#000' : '#ccc',
            border: 'none',
            borderRadius: '4px',
            cursor: coherenceZλ >= 0.80 ? 'pointer' : 'not-allowed',
            fontSize: '14px',
            fontWeight: 'bold'
          }}
        >
          {newEventForm.isSubmitting ? 'Creating Ritual...' : 'Generate Ritual Blueprint'}
        </button>
      </div>
    </div>
  );
}