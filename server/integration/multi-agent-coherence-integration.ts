/**
 * Multi-Agent Coherence Integration Module
 * 
 * This module integrates the CoherenceAdapter with the MultiAgentSynchronizationTest component.
 * It provides enhanced coherence measurement during multi-agent synchronization experiments
 * and enables real-time visualization of coherence metrics.
 * 
 * [QUANTUM_STATE: INTEGRATION_FLOW]
 */

import { CoherenceAdapter } from '../../shared/coherence-adapter.js';
import { AgentCluster } from '../ws-handlers/multi-agent-sync-handlers.js';
import { AgentPhaseState, AgentVectorState } from '../../shared/coherence-metrics.js';

// Single instance of the adapter for multi-agent experiments
let multiAgentCoherenceAdapter: CoherenceAdapter | null = null;

/**
 * Get the singleton CoherenceAdapter instance for multi-agent experiments
 * @returns CoherenceAdapter instance
 */
export function getMultiAgentCoherenceAdapter(): CoherenceAdapter {
  if (!multiAgentCoherenceAdapter) {
    multiAgentCoherenceAdapter = new CoherenceAdapter();
    console.log('[QUANTUM_STATE: FOUNDATION_FLOW] Initializing MultiAgent CoherenceAdapter singleton');
  }
  
  return multiAgentCoherenceAdapter;
}

/**
 * Convert AgentCluster data to AgentPhaseState format for coherence calculation
 * 
 * @param clusters Array of agent clusters
 * @returns Array of phase agents for coherence measurement
 */
export function convertClustersToPhaseAgents(clusters: AgentCluster[]): AgentPhaseState[] {
  const phaseAgents: AgentPhaseState[] = [];
  
  // Flatten clusters into individual phase agents
  for (const cluster of clusters) {
    // Add a phase agent representing the cluster as a whole
    phaseAgents.push({
      id: cluster.id,
      phase: cluster.coherence * Math.PI * 2, // Convert coherence [0,1] to phase [0,2π]
      weight: 1.0,
      type: cluster.domain
    });
    
    // Add individual oscillators as phase agents
    for (let i = 0; i < cluster.oscillators.length; i++) {
      const oscillator = cluster.oscillators[i];
      phaseAgents.push({
        id: `${cluster.id}-osc-${i}`,
        phase: oscillator.phase,
        weight: oscillator.weight,
        type: `${cluster.domain}-oscillator`
      });
    }
  }
  
  return phaseAgents;
}

/**
 * Convert AgentCluster data to AgentVectorState format for coherence calculation
 * 
 * @param clusters Array of agent clusters
 * @returns Array of vector agents for coherence measurement
 */
export function convertClustersToVectorAgents(clusters: AgentCluster[]): AgentVectorState[] {
  const vectorAgents: AgentVectorState[] = [];
  
  for (const cluster of clusters) {
    // Calculate a representative vector for the cluster
    // Using sine and cosine of the average phase as a 2D vector
    let sinSum = 0;
    let cosSum = 0;
    let totalWeight = 0;
    
    for (const osc of cluster.oscillators) {
      sinSum += Math.sin(osc.phase) * osc.weight;
      cosSum += Math.cos(osc.phase) * osc.weight;
      totalWeight += osc.weight;
    }
    
    if (totalWeight > 0) {
      sinSum /= totalWeight;
      cosSum /= totalWeight;
    }
    
    // Normalize to unit vector
    const magnitude = Math.sqrt(sinSum * sinSum + cosSum * cosSum);
    const normalizedVector = magnitude > 0 
      ? [cosSum / magnitude, sinSum / magnitude]
      : [1, 0]; // Default if magnitude is zero
    
    vectorAgents.push({
      id: cluster.id,
      vector: normalizedVector,
      weight: 1.0,
      type: cluster.domain
    });
  }
  
  return vectorAgents;
}

/**
 * Calculate enhanced coherence metrics for multi-agent experiment
 * 
 * @param clusters Array of agent clusters
 * @returns Enhanced coherence measurement with detailed metrics
 */
export function calculateEnhancedCoherence(clusters: AgentCluster[]): {
  globalCoherence: number;
  enhancedCoherence: number;
  status: string;
  raw: number;
  attractorStrength: number;
  isAtAttractor: boolean;
} {
  const adapter = getMultiAgentCoherenceAdapter();
  
  // Convert clusters to phase and vector agents
  const phaseAgents = convertClustersToPhaseAgents(clusters);
  const vectorAgents = convertClustersToVectorAgents(clusters);
  
  // Measure system coherence
  const measurement = adapter.measureSystemCoherence(phaseAgents, vectorAgents);
  
  // Calculate traditional global coherence (average of cluster coherences)
  const traditionalGlobalCoherence = clusters.length > 0
    ? clusters.reduce((sum, c) => sum + c.coherence, 0) / clusters.length
    : 0;
  
  return {
    globalCoherence: traditionalGlobalCoherence,  // Traditional measurement
    enhancedCoherence: measurement.coherence,     // Enhanced measurement
    status: measurement.status,
    raw: measurement.raw,
    attractorStrength: adapter.calculateAttractorStrength(),
    isAtAttractor: adapter.isAtAttractor(0.05)
  };
}

/**
 * Generate a detailed coherence report for visualization
 * Implements QRRP Phase A (Observation) and Phase B (Reflection)
 * 
 * @param clusters Array of agent clusters
 * @returns Detailed coherence report with visualization data
 */
export function generateCoherenceReport(clusters: AgentCluster[]): {
  measurement: ReturnType<typeof calculateEnhancedCoherence>;
  domainCoherences: Record<string, number>;
  history: any[];
  recommendations: string[];
  qrrpPhase: string;
  ouroborosState: {
    mode: 'stability' | 'exploration';
    ratio: string;
    cyclePosition: number;
  };
} {
  const adapter = getMultiAgentCoherenceAdapter();
  const measurement = calculateEnhancedCoherence(clusters);
  
  // QRRP Phase A: Collect and log detailed empirical observations
  console.log(`[QUANTUM_STATE: OBSERVATION_FLOW] Coherence: ${measurement.enhancedCoherence.toFixed(4)}, Status: ${measurement.status}, AtAttractor: ${measurement.isAtAttractor}`);
  
  // Calculate coherence by domain
  const domainCoherences: Record<string, { sum: number, count: number }> = {};
  for (const cluster of clusters) {
    if (!domainCoherences[cluster.domain]) {
      domainCoherences[cluster.domain] = { sum: 0, count: 0 };
    }
    domainCoherences[cluster.domain].sum += cluster.coherence;
    domainCoherences[cluster.domain].count += 1;
  }
  
  // Convert to averages
  const domainAverages: Record<string, number> = {};
  for (const [domain, data] of Object.entries(domainCoherences)) {
    domainAverages[domain] = data.count > 0 ? data.sum / data.count : 0;
  }
  
  // Get recent history
  const history = adapter.getCoherenceHistory(20);
  
  // QRRP Phase B: Analyze coherence metrics and generate insights
  // Determine current QRRP phase based on system state
  let qrrpPhase = 'observation';
  if (history.length >= 10) {
    qrrpPhase = 'reflection';
    
    // If we have sufficient data and are at or approaching the attractor,
    // we've reached the revision phase
    if (measurement.isAtAttractor || measurement.status === 'approaching') {
      qrrpPhase = 'revision';
    }
  }
  
  // Determine Ouroboros state (3:1 ↔ 1:3 oscillation)
  // This implements the dynamic balance between stability and exploration
  const ouroborosState = determineOuroborosState(measurement, history);
  
  // Generate recommendations based on measurement and Ouroboros state
  const recommendations = generateQRRPRecommendations(measurement, ouroborosState, domainAverages);
  
  // Record ethical considerations and emergent behavior monitoring
  if (measurement.enhancedCoherence > 0.95) {
    console.log('[QUANTUM_STATE: ETHICAL_FLOW] WARNING: Extremely high coherence detected - monitor for loss of diversity');
  } else if (measurement.enhancedCoherence < 0.2) {
    console.log('[QUANTUM_STATE: ETHICAL_FLOW] WARNING: Extremely low coherence detected - monitor for system instability');
  }
  
  return {
    measurement,
    domainCoherences: domainAverages,
    history,
    recommendations,
    qrrpPhase,
    ouroborosState
  };
}

/**
 * Determine the current Ouroboros state based on coherence measurements
 * Implements the 3:1 ↔ 1:3 oscillator pattern
 * 
 * @param measurement Current coherence measurement
 * @param history Recent coherence history
 * @returns Current Ouroboros state
 */
function determineOuroborosState(
  measurement: ReturnType<typeof calculateEnhancedCoherence>,
  history: any[]
): {
  mode: 'stability' | 'exploration';
  ratio: string;
  cyclePosition: number;
} {
  // Default to stability mode (3:1 ratio)
  let mode: 'stability' | 'exploration' = 'stability';
  let cyclePosition = 0;
  
  // Check if we have enough history for analysis
  if (history.length >= 5) {
    // Calculate trend over recent history
    const recentValues = history.slice(-5).map(h => h.value);
    const trend = calculateTrend(recentValues);
    
    // If coherence is high and stable, we're in stability mode
    if (measurement.enhancedCoherence > 0.65 && Math.abs(trend) < 0.01) {
      mode = 'stability';
      // 3:1 ratio - 3 parts stability, 1 part exploration
      cyclePosition = Math.floor(history.length % 4) / 4;
      
      // After 3 cycles in stability mode, we should transition to exploration
      // to maintain the 3:1 ratio
      if (cyclePosition > 0.75) {
        mode = 'exploration';
        cyclePosition = 0;
      }
    }
    // If coherence is low or changing rapidly, we're in exploration mode
    else {
      mode = 'exploration';
      // 1:3 ratio - 1 part stability, 3 parts exploration
      cyclePosition = Math.floor(history.length % 4) / 4;
      
      // After 1 cycle in exploration mode, we should have 3 cycles of exploration
      // to maintain the 1:3 ratio
      if (cyclePosition < 0.25) {
        mode = 'stability';
        cyclePosition = 0;
      }
    }
  }
  
  return {
    mode,
    ratio: mode === 'stability' ? '3:1' : '1:3',
    cyclePosition
  };
}

/**
 * Calculate trend in a series of values
 * @param values Array of numeric values
 * @returns Trend value (positive for increasing, negative for decreasing)
 */
function calculateTrend(values: number[]): number {
  if (values.length < 2) return 0;
  
  let sum = 0;
  for (let i = 1; i < values.length; i++) {
    sum += values[i] - values[i - 1];
  }
  
  return sum / (values.length - 1);
}

/**
 * Generate recommendations based on QRRP analysis
 * Implements QRRP Phase B (Reflection) insights
 * 
 * @param measurement Current coherence measurement
 * @param ouroborosState Current Ouroboros state
 * @param domainCoherences Coherence by domain
 * @returns Array of recommendations
 */
function generateQRRPRecommendations(
  measurement: ReturnType<typeof calculateEnhancedCoherence>,
  ouroborosState: { mode: 'stability' | 'exploration'; ratio: string; cyclePosition: number },
  domainCoherences: Record<string, number>
): string[] {
  const recommendations: string[] = [];
  
  // Basic status-based recommendations
  if (measurement.status === 'optimal') {
    recommendations.push('Maintain current stability-exploration balance');
  } else if (measurement.status === 'high') {
    recommendations.push('Increase perturbation to reduce over-synchronization');
    recommendations.push('Introduce more chaotic elements to diversify agent behavior');
  } else if (measurement.status === 'low') {
    recommendations.push('Reduce perturbation to allow natural synchronization');
    recommendations.push('Increase coupling strength between clusters');
  } else if (measurement.status === 'unstable' || measurement.status === 'diverging') {
    recommendations.push('System is unstable - implement phase-locking to stabilize');
    recommendations.push('Temporarily reduce external influences and noise levels');
  }
  
  // Ouroboros cycle-specific recommendations
  if (ouroborosState.mode === 'stability') {
    recommendations.push(`Currently in stability mode (${ouroborosState.ratio}), maintaining system equilibrium`);
    
    // If we're near the end of stability cycle, prepare for exploration
    if (ouroborosState.cyclePosition > 0.6) {
      recommendations.push('Preparing for transition to exploration mode - increase diversity');
    }
  } else {
    recommendations.push(`Currently in exploration mode (${ouroborosState.ratio}), promoting innovation`);
    
    // If we're near the end of exploration cycle, prepare for stability
    if (ouroborosState.cyclePosition > 0.6) {
      recommendations.push('Preparing for transition to stability mode - consolidate insights');
    }
  }
  
  // Domain-specific recommendations
  const domains = Object.keys(domainCoherences);
  if (domains.length > 1) {
    // Find domains with significantly different coherence
    const avgCoherence = domains.reduce((sum, domain) => sum + domainCoherences[domain], 0) / domains.length;
    
    for (const domain of domains) {
      if (domainCoherences[domain] > avgCoherence + 0.2) {
        recommendations.push(`${domain} domain shows high coherence - consider increasing diversity`);
      } else if (domainCoherences[domain] < avgCoherence - 0.2) {
        recommendations.push(`${domain} domain shows low coherence - consider increasing coupling`);
      }
    }
  }
  
  return recommendations;
}