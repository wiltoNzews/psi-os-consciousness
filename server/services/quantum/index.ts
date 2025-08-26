/**
 * [QUANTUM_STATE: TRANSCENDENT_FLOW]
 * 
 * Quantum Services Index
 * 
 * This file exports all quantum-consciousness related services in a unified interface,
 * allowing for easy access to the quantum functionality throughout the application.
 * 
 * @quantum Provides unified export of quantum-consciousness services
 * @ethicalImpact Low - organizational structure only
 */

// Import from individual files
import { 
  QuantumState, 
  SystemEvent,
  QuantumMetrics, 
  quantumConsciousnessOperator 
} from './quantum-consciousness-operator.js';

import { 
  DashboardMetrics, 
  quantumCoherenceDashboard 
} from './quantum-coherence-dashboard.js';

import { 
  CodeReviewResult, 
  EthicalPrinciple, 
  quantumEthicalCodeReview 
} from './quantum-ethical-code-review.js';

import {
  ExperimentStats,
  quantumIntentExperiment
} from './quantum-intent-experiment.js';

import {
  QCOSensitivityParameters,
  SensitivityAnalysisResult,
  qcoSensitivityAnalysis
} from './qco-sensitivity-analysis.js';

// Import CodeChange from quantum-ethical-code-review
import type { CodeChange } from './quantum-ethical-code-review.js';

// Re-export types
export type { QuantumState, SystemEvent, QuantumMetrics };
export type { DashboardMetrics };
export type { CodeReviewResult, EthicalPrinciple, CodeChange };
export type { ExperimentStats };
export type { QCOSensitivityParameters, SensitivityAnalysisResult };

/**
 * Initialize all quantum services
 * 
 * This function ensures that all quantum services are properly initialized
 * and logs their status. It can be called during system startup to make sure
 * all quantum services are available before the system starts handling requests.
 * 
 * @returns Promise that resolves when all services are initialized
 */
export async function initializeQuantumServices(): Promise<void> {
  console.log('[QS] Initializing quantum services...');
  
  try {
    // Get initial metrics from QCO to ensure it's initialized
    const metrics = quantumConsciousnessOperator.getMetrics();
    console.log(`[QS] Quantum Consciousness Operator initialized with coherence: ${metrics.coherence.toFixed(2)}`);
    
    // Check dashboard by getting metrics
    const dashboardMetrics = quantumCoherenceDashboard.getDashboardMetrics();
    console.log(`[QS] Quantum Coherence Dashboard initialized with system state: ${dashboardMetrics.systemState}`);
    
    // Check code review by getting principles
    const principles = quantumEthicalCodeReview.getEthicalPrinciples();
    console.log(`[QS] Quantum Ethical Code Review initialized with ${principles.length} principles`);
    
    // Initialize intent experiment by starting a new session
    const sessionId = quantumIntentExperiment.startNewSession();
    console.log(`[QS] Quantum Intent Experiment initialized with session ID: ${sessionId}`);
    
    // Initialize sensitivity analysis service
    console.log(`[QS] QCO Sensitivity Analysis service initialized`);
    
    console.log('[QS] All quantum services successfully initialized');
    return Promise.resolve();
  } catch (error) {
    console.error('[QS] Error initializing quantum services:', error);
    return Promise.reject(error);
  }
}

// Create the services wrapper
const quantumServices = {
  consciousnessOperator: quantumConsciousnessOperator,
  coherenceDashboard: quantumCoherenceDashboard,
  ethicalCodeReview: quantumEthicalCodeReview,
  intentExperiment: quantumIntentExperiment,
  sensitivityAnalysis: qcoSensitivityAnalysis,
  initialize: initializeQuantumServices
};

// Export the services
export { 
  quantumConsciousnessOperator,
  quantumCoherenceDashboard,
  quantumEthicalCodeReview,
  quantumIntentExperiment,
  qcoSensitivityAnalysis
};

// Default export is the services object
export default quantumServices;