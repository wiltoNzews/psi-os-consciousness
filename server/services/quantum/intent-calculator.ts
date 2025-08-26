/**
 * Intent Calculator Service
 * 
 * This service calculates the collective intent field (Ω) based on
 * participant count, average intent, and coherence using the
 * standardized formula: Ω = N · ⟨I⟩ · C^1.5
 * 
 * [QUANTUM_STATE: TRANSCENDENT_FLOW]
 */

import { QuantumGlossary } from '../qrn/quantum-glossary.js';
import { calculateCoherencePower } from './coherence-calculator.js';
import type { ParticipantState } from './coherence-calculator.js';

// Initialize quantum glossary for context tagging
const quantumGlossary = new QuantumGlossary();

// Type definitions
export interface IntentCalculationResult {
  collectiveIntentField: number;      // Ω value
  participantCount: number;           // N value
  averageIntent: number;              // ⟨I⟩ value
  coherence: number;                  // C value
  coherencePower: number;             // C^1.5 value
  calculatedAt: Date;
  breakdown: {
    participantFactor: number;        // N contribution
    intentFactor: number;             // ⟨I⟩ contribution
    coherenceFactor: number;          // C^1.5 contribution
  };
}

/**
 * Calculate the collective intent field using the standardized formula
 * Ω = N · ⟨I⟩ · C^1.5
 * 
 * @param participants - Array of participant states
 * @param coherence - Collective coherence value (0-1)
 * @returns Intent calculation result
 */
export function calculateCollectiveIntentField(
  participants: ParticipantState[],
  coherence: number
): IntentCalculationResult {
  try {
    // Filter active participants
    const activeParticipants = participants.filter(p => p.isActive);
    const participantCount = activeParticipants.length;
    
    // Calculate average intent
    const averageIntent = participantCount > 0 ?
      activeParticipants.reduce((sum, p) => sum + p.intentStrength, 0) / participantCount : 0;
    
    // Calculate coherence power using standard formula component C^1.5
    const coherencePower = calculateCoherencePower(coherence);
    
    // Calculate collective intent field Ω using the standardized formula
    // Ω = N · ⟨I⟩ · C^1.5
    const collectiveIntentField = participantCount * averageIntent * coherencePower;
    
    // Calculate breakdown for analysis
    const participantFactor = participantCount;
    const intentFactor = averageIntent;
    const coherenceFactor = coherencePower;
    
    // Log the calculation
    quantumGlossary.tagWithContext(
      `[QCO] Collective Intent Field calculated: Ω=${collectiveIntentField.toFixed(4)}, ` +
      `N=${participantCount}, ⟨I⟩=${averageIntent.toFixed(4)}, C^1.5=${coherencePower.toFixed(4)}`
    );
    
    // Record flow metric
    quantumGlossary.recordFlowMetric(
      'COLLECTIVE_INTENT',
      'intent-calculator',
      collectiveIntentField,
      {
        participantCount,
        averageIntent,
        coherence,
        coherencePower,
        timestamp: new Date().toISOString()
      }
    );
    
    // Return the result
    return {
      collectiveIntentField,
      participantCount,
      averageIntent,
      coherence,
      coherencePower,
      calculatedAt: new Date(),
      breakdown: {
        participantFactor,
        intentFactor,
        coherenceFactor
      }
    };
  } catch (error) {
    quantumGlossary.logError('Error calculating collective intent field', error as Error);
    
    // Return default values on error
    return {
      collectiveIntentField: 0,
      participantCount: 0,
      averageIntent: 0,
      coherence: 0,
      coherencePower: 0,
      calculatedAt: new Date(),
      breakdown: {
        participantFactor: 0,
        intentFactor: 0,
        coherenceFactor: 0
      }
    };
  }
}

/**
 * Update a participant's intent strength
 * 
 * @param participantId - ID of participant to update
 * @param intentStrength - New intent strength (0-1)
 * @param participants - Current array of participants
 * @returns Updated array of participants
 */
export function updateParticipantIntent(
  participantId: string,
  intentStrength: number,
  participants: ParticipantState[]
): ParticipantState[] {
  try {
    // Validate intent strength
    const validIntentStrength = Math.max(0, Math.min(1, intentStrength));
    
    const updatedParticipants = [...participants];
    const participantIndex = updatedParticipants.findIndex(p => p.id === participantId);
    
    if (participantIndex === -1) {
      // Participant not found, log error
      quantumGlossary.logError(
        `Participant ${participantId} not found for intent update`,
        new Error('Participant not found')
      );
      return participants;
    }
    
    // Update the intent strength
    updatedParticipants[participantIndex] = {
      ...updatedParticipants[participantIndex],
      intentStrength: validIntentStrength,
      updatedAt: new Date(),
      lastActiveAt: new Date()
    };
    
    return updatedParticipants;
  } catch (error) {
    quantumGlossary.logError('Error updating participant intent', error as Error);
    return participants;
  }
}

/**
 * Analyze intent patterns across participants
 * 
 * @param participants - Array of participant states
 * @returns Analysis of intent patterns
 */
export function analyzeIntentPatterns(participants: ParticipantState[]): {
  intentDistribution: number[];
  intentVariance: number;
  intentHomogeneity: number;
  outliers: string[];
} {
  try {
    const activeParticipants = participants.filter(p => p.isActive);
    
    if (activeParticipants.length === 0) {
      return {
        intentDistribution: [],
        intentVariance: 0,
        intentHomogeneity: 1,
        outliers: []
      };
    }
    
    // Extract intent strengths
    const intentValues = activeParticipants.map(p => p.intentStrength);
    
    // Calculate mean
    const mean = intentValues.reduce((sum, val) => sum + val, 0) / intentValues.length;
    
    // Calculate variance
    const variance = intentValues.reduce(
      (sum, val) => sum + Math.pow(val - mean, 2), 0
    ) / intentValues.length;
    
    // Calculate homogeneity (inversely related to variance)
    // Higher value = more homogeneous intent
    const homogeneity = Math.max(0, 1 - variance);
    
    // Identify outliers (intent values > 2 standard deviations from mean)
    const stdDev = Math.sqrt(variance);
    const threshold = 2 * stdDev;
    
    const outliers = activeParticipants
      .filter(p => Math.abs(p.intentStrength - mean) > threshold)
      .map(p => p.id);
    
    // Create a distribution (10 buckets from 0 to 1)
    const distribution = Array(10).fill(0);
    intentValues.forEach(value => {
      const bucketIndex = Math.min(9, Math.floor(value * 10));
      distribution[bucketIndex]++;
    });
    
    return {
      intentDistribution: distribution,
      intentVariance: variance,
      intentHomogeneity: homogeneity,
      outliers
    };
  } catch (error) {
    quantumGlossary.logError('Error analyzing intent patterns', error as Error);
    return {
      intentDistribution: [],
      intentVariance: 0,
      intentHomogeneity: 1,
      outliers: []
    };
  }
}

/**
 * Calculate the interaction Hamiltonian using the standardized formula
 * H_int = Q · Ω · σ_z · ψ₀
 * 
 * This is a partial implementation as it returns a coefficient
 * rather than applying the full quantum operator
 * 
 * @param collectiveIntentField - Collective intent field (Ω)
 * @param quantumCouplingConstant - Quantum coupling constant (Q)
 * @returns Interaction Hamiltonian coefficient
 */
export function calculateInteractionHamiltonian(
  collectiveIntentField: number,
  quantumCouplingConstant: number
): number {
  try {
    // Calculate H_int coefficient (without applying σ_z operator to ψ₀)
    // H_int = Q · Ω
    const hIntCoefficient = quantumCouplingConstant * collectiveIntentField;
    
    // Log calculation
    quantumGlossary.tagWithContext(
      `[QCO] Interaction Hamiltonian calculated: H_int_coef=${hIntCoefficient.toExponential(4)}, ` +
      `Q=${quantumCouplingConstant.toExponential(4)}, Ω=${collectiveIntentField.toFixed(4)}`
    );
    
    return hIntCoefficient;
  } catch (error) {
    quantumGlossary.logError('Error calculating interaction Hamiltonian', error as Error);
    return 0;
  }
}

// Export the module
export default {
  calculateCollectiveIntentField,
  updateParticipantIntent,
  analyzeIntentPatterns,
  calculateInteractionHamiltonian
};