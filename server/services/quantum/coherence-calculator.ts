/**
 * Coherence Calculator Service
 * 
 * This service calculates collective coherence between users/participants
 * using the standardized Fractal Emotional Resonance (C) formula.
 * 
 * [QUANTUM_STATE: TRANSCENDENT_FLOW]
 */

import { QuantumGlossary } from '../qrn/quantum-glossary.js';

// Initialize quantum glossary for context tagging
const quantumGlossary = new QuantumGlossary();

// Type definitions
export interface ParticipantState {
  id: string;
  emotionalState: EmotionalState;
  createdAt: Date;
  updatedAt: Date;
  isActive: boolean;
  lastActiveAt: Date;
  intentStrength: number; // 0-1 normalized
  sessionDuration: number; // in seconds
}

export interface EmotionalState {
  valence: number; // -1 to 1 (negative to positive)
  arousal: number; // 0 to 1 (calm to excited)
  dominance: number; // 0 to 1 (submissive to dominant)
  focus: number; // 0 to 1 (distracted to focused)
  coherence: number; // 0 to 1 (internal heart coherence)
  primaryEmotion?: string; // Optional categorical emotion
}

export interface CoherenceResult {
  collectiveCoherence: number; // 0-1 scale
  correlationMatrix: number[][]; // Pairwise correlations
  participantCount: number;
  calculatedAt: Date;
  coherenceBreakdown: {
    valenceCoherence: number;
    arousalCoherence: number;
    dominanceCoherence: number;
    focusCoherence: number;
    internalCoherenceAvg: number;
  };
}

/**
 * Calculate emotional correlation between two participants
 * 
 * @param state1 - Emotional state of first participant
 * @param state2 - Emotional state of second participant
 * @returns Correlation coefficient (0-1)
 */
function calculateEmotionalCorrelation(state1: EmotionalState, state2: EmotionalState): number {
  try {
    // Convert emotional states to vectors
    const vec1 = [state1.valence, state1.arousal, state1.dominance, state1.focus];
    const vec2 = [state2.valence, state2.arousal, state2.dominance, state2.focus];
    
    // Calculate dot product
    let dotProduct = 0;
    for (let i = 0; i < vec1.length; i++) {
      dotProduct += vec1[i] * vec2[i];
    }
    
    // Calculate magnitudes
    const mag1 = Math.sqrt(vec1.reduce((sum, val) => sum + val * val, 0));
    const mag2 = Math.sqrt(vec2.reduce((sum, val) => sum + val * val, 0));
    
    // Calculate correlation (cosine similarity)
    const correlation = dotProduct / (mag1 * mag2 || 1); // Avoid division by zero
    
    // Normalize to 0-1 range (cosine similarity is -1 to 1)
    return (correlation + 1) / 2;
  } catch (error) {
    quantumGlossary.logError('Error calculating emotional correlation', error as Error);
    return 0;
  }
}

/**
 * Calculate collective coherence using the Fractal Emotional Resonance formula
 * C = (2/(N(N-1))) · ∑ᵢ<ⱼ Rᵢⱼ
 * 
 * @param participants - Array of participant states
 * @returns Coherence result
 */
export function calculateCollectiveCoherence(participants: ParticipantState[]): CoherenceResult {
  try {
    const activeParticipants = participants.filter(p => p.isActive);
    const n = activeParticipants.length;
    
    // Need at least 2 participants for meaningful coherence
    if (n < 2) {
      return createDefaultCoherenceResult(n);
    }
    
    // Initialize correlation matrix
    const correlationMatrix: number[][] = Array(n).fill(0).map(() => Array(n).fill(0));
    
    // Calculate all pairwise correlations
    let totalCorrelation = 0;
    let pairCount = 0;
    
    for (let i = 0; i < n; i++) {
      correlationMatrix[i][i] = 1; // Self-correlation is 1
      
      for (let j = i + 1; j < n; j++) {
        const correlation = calculateEmotionalCorrelation(
          activeParticipants[i].emotionalState,
          activeParticipants[j].emotionalState
        );
        
        correlationMatrix[i][j] = correlation;
        correlationMatrix[j][i] = correlation; // Symmetric matrix
        
        totalCorrelation += correlation;
        pairCount++;
      }
    }
    
    // Calculate coherence using the standardized formula
    // C = (2/(N(N-1))) · ∑ᵢ<ⱼ Rᵢⱼ
    const collectiveCoherence = pairCount > 0 ? 
      (2 / (n * (n - 1))) * totalCorrelation : 0;
    
    // Calculate coherence breakdown
    const coherenceBreakdown = calculateCoherenceBreakdown(activeParticipants);
    
    // Record flow metric
    quantumGlossary.recordFlowMetric(
      'COLLECTIVE_COHERENCE',
      'coherence-calculator',
      collectiveCoherence,
      {
        participantCount: n,
        timestamp: new Date().toISOString(),
        ...coherenceBreakdown
      }
    );
    
    // Return the result
    return {
      collectiveCoherence,
      correlationMatrix,
      participantCount: n,
      calculatedAt: new Date(),
      coherenceBreakdown
    };
  } catch (error) {
    quantumGlossary.logError('Error calculating collective coherence', error as Error);
    return createDefaultCoherenceResult(participants.length);
  }
}

/**
 * Calculate detailed breakdown of coherence across emotional dimensions
 * 
 * @param participants - Array of active participants
 * @returns Coherence breakdown by emotional dimension
 */
function calculateCoherenceBreakdown(participants: ParticipantState[]): CoherenceResult['coherenceBreakdown'] {
  const n = participants.length;
  
  if (n < 2) {
    return {
      valenceCoherence: 0,
      arousalCoherence: 0,
      dominanceCoherence: 0,
      focusCoherence: 0,
      internalCoherenceAvg: participants[0]?.emotionalState.coherence || 0
    };
  }
  
  // Calculate coherence for each dimension
  const dimensions = ['valence', 'arousal', 'dominance', 'focus'] as const;
  const dimensionCoherences: Record<string, number> = {};
  
  for (const dimension of dimensions) {
    let totalCorrelation = 0;
    let pairCount = 0;
    
    for (let i = 0; i < n; i++) {
      for (let j = i + 1; j < n; j++) {
        // Calculate 1D correlation for this dimension
        const val1 = participants[i].emotionalState[dimension];
        const val2 = participants[j].emotionalState[dimension];
        
        // Simple 1D correlation - how close the values are (0-1)
        const correlation = 1 - Math.abs(val1 - val2);
        
        totalCorrelation += correlation;
        pairCount++;
      }
    }
    
    // Calculate coherence for this dimension
    dimensionCoherences[`${dimension}Coherence`] = 
      pairCount > 0 ? (2 / (n * (n - 1))) * totalCorrelation : 0;
  }
  
  // Calculate average internal coherence
  const internalCoherenceAvg = participants.reduce(
    (sum, p) => sum + p.emotionalState.coherence, 0
  ) / n;
  
  return {
    valenceCoherence: dimensionCoherences.valenceCoherence,
    arousalCoherence: dimensionCoherences.arousalCoherence,
    dominanceCoherence: dimensionCoherences.dominanceCoherence,
    focusCoherence: dimensionCoherences.focusCoherence,
    internalCoherenceAvg
  };
}

/**
 * Create a default coherence result when calculation isn't possible
 * 
 * @param participantCount - Number of participants
 * @returns Default coherence result
 */
function createDefaultCoherenceResult(participantCount: number): CoherenceResult {
  return {
    collectiveCoherence: 0,
    correlationMatrix: [],
    participantCount,
    calculatedAt: new Date(),
    coherenceBreakdown: {
      valenceCoherence: 0,
      arousalCoherence: 0,
      dominanceCoherence: 0,
      focusCoherence: 0,
      internalCoherenceAvg: 0
    }
  };
}

/**
 * Calculate coherence power for use in the Collective Intent Field formula
 * Applies the C^1.5 component of the standardized formula
 * 
 * @param coherence - Basic coherence value (0-1)
 * @returns Coherence power (0-1)
 */
export function calculateCoherencePower(coherence: number): number {
  // Apply the power function from the standardized formula: C^1.5
  return Math.pow(coherence, 1.5);
}

/**
 * Update a participant's emotional state
 * 
 * @param participantId - ID of participant to update
 * @param emotionalState - New emotional state
 * @param participants - Current array of participants
 * @returns Updated array of participants
 */
export function updateParticipantEmotionalState(
  participantId: string, 
  emotionalState: Partial<EmotionalState>,
  participants: ParticipantState[]
): ParticipantState[] {
  try {
    const updatedParticipants = [...participants];
    const participantIndex = updatedParticipants.findIndex(p => p.id === participantId);
    
    if (participantIndex === -1) {
      // Participant not found, log error
      quantumGlossary.logError(
        `Participant ${participantId} not found for emotional state update`,
        new Error('Participant not found')
      );
      return participants;
    }
    
    // Update the emotional state
    updatedParticipants[participantIndex] = {
      ...updatedParticipants[participantIndex],
      emotionalState: {
        ...updatedParticipants[participantIndex].emotionalState,
        ...emotionalState
      },
      updatedAt: new Date(),
      lastActiveAt: new Date()
    };
    
    return updatedParticipants;
  } catch (error) {
    quantumGlossary.logError('Error updating participant emotional state', error as Error);
    return participants;
  }
}

// Export the module
export default {
  calculateCollectiveCoherence,
  calculateCoherencePower,
  updateParticipantEmotionalState
};