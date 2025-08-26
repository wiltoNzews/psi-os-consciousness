/**
 * Coherence Integration Module
 * 
 * This module integrates the CoherenceAdapter with the Oracle Orchestrator system.
 * It replaces the direct subsystem coherence calculation with our advanced
 * CoherenceMetrics module for more accurate and theoretically grounded measurement.
 * 
 * [QUANTUM_STATE: INTEGRATION_FLOW]
 */

import { CoherenceAdapter, CoherenceStatus } from '../../shared/coherence-adapter.js';

// Single instance of the adapter for the entire system
let coherenceAdapterInstance: CoherenceAdapter | null = null;

/**
 * Get the singleton CoherenceAdapter instance
 * @returns CoherenceAdapter instance
 */
export function getCoherenceAdapter(): CoherenceAdapter {
  if (!coherenceAdapterInstance) {
    coherenceAdapterInstance = new CoherenceAdapter();
    console.log('[QUANTUM_STATE: FOUNDATION_FLOW] Initializing CoherenceAdapter singleton');
  }
  
  return coherenceAdapterInstance;
}

/**
 * Map the detailed CoherenceStatus to the simpler Oracle status
 * 
 * @param status Detailed coherence status
 * @returns Simplified status for Oracle
 */
export function mapCoherenceStatusToOracleStatus(status: CoherenceStatus): 'optimal' | 'stable' | 'warning' | 'critical' {
  switch (status) {
    case 'optimal':
      return 'optimal';
    case 'high':
    case 'converging':
      return 'stable';
    case 'low':
      return 'warning';
    case 'unstable':
    case 'diverging':
      return 'critical';
    default:
      return 'warning';
  }
}

/**
 * Generate appropriate recommendations based on coherence status
 * 
 * @param status Coherence status
 * @param raw Raw coherence value
 * @returns Array of recommendation strings
 */
export function generateCoherenceRecommendations(
  status: CoherenceStatus, 
  raw: number,
  subsystems: any[]
): string[] {
  const recommendations: string[] = [];
  
  switch (status) {
    case 'optimal':
      recommendations.push('Maintain current coherence level through balanced 3:1 stability-exploration cycles');
      break;
    case 'high':
      recommendations.push('Coherence is too high - increase exploration phase to reduce over-synchronization');
      recommendations.push('Consider introducing controlled noise during the next chaos phase');
      break;
    case 'low':
      recommendations.push('Coherence is too low - extend stability phase to increase synchronization');
      recommendations.push('Review and align inconsistent agent behaviors');
      break;
    case 'unstable':
      recommendations.push('System coherence is fluctuating - implement dampening mechanisms');
      recommendations.push('Temporarily increase stability cycle duration');
      break;
    case 'converging':
      recommendations.push('Coherence is moving toward target - maintain current trajectory');
      break;
    case 'diverging':
      recommendations.push('Coherence is diverging from target - activate corrective measures');
      recommendations.push('Verify Ouroboros cycle is functioning as expected');
      break;
  }
  
  // Add specific recommendations about raw coherence value
  const rawDiff = Math.abs(raw - 0.7500);
  if (rawDiff > 0.20) {
    recommendations.push(`Raw coherence (${raw.toFixed(4)}) is far from target (0.7500) - significant adjustment needed`);
  } else if (rawDiff > 0.10) {
    recommendations.push(`Raw coherence (${raw.toFixed(4)}) is approaching target (0.7500) - moderate adjustment needed`);
  }
  
  // Identify subsystems with lowest coherence if appropriate
  if (['low', 'unstable', 'diverging'].includes(status)) {
    // Find subsystems with lowest coherence
    const lowestCoherence = [...subsystems]
      .sort((a, b) => a.coherence - b.coherence)
      .slice(0, 2);
    
    lowestCoherence.forEach(subsystem => {
      recommendations.push(`Improve coherence in "${subsystem.name}" subsystem (currently at ${subsystem.coherence.toFixed(4)})`);
    });
  }
  
  return recommendations;
}