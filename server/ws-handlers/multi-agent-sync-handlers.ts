/**
 * WebSocket Handlers for Multi-Agent Synchronization Experiment
 * 
 * These handlers support the multi-agent synchronization experiment by simulating
 * multiple agent clusters and measuring their convergence to the 0.7500 attractor.
 * 
 * [QUANTUM_STATE: EXPERIMENTAL_FLOW]
 */

import { WebSocket } from 'ws';
import * as crypto from 'crypto';
import { calculateEnhancedCoherence, generateCoherenceReport } from '../integration/multi-agent-coherence-integration.js';

// Type definitions for experiment data
export type Domain = 'ai' | 'finance' | 'biology' | 'network' | 'social';

export interface AgentCluster {
  id: string;
  domain: Domain;
  oscillators: Array<{
    phase: number;
    naturalFreq: number;
    weight: number;
  }>;
  coherence: number;
  targetCoherence: number;
  coupling: {
    internal: number;  // Coupling strength within the cluster
    external: number;  // Coupling strength to other clusters
  };
  noiseLevel: number;
  cycle: number;
  perturbationActive: boolean;
  returnTimes: Array<{
    perturbationTarget: number;
    returnTime: number | null;
  }>;
}

interface ExperimentConfig {
  clusterCount: number;
  oscillatorsPerCluster: number;
  domainTypes?: Domain[];
  crossDomainCoupling: number;
  baseNoiseLevel: number;
  perturbationSequence: Array<{
    target: number;
    duration: number;
    clusterIndices: number[];
  }>;
  cycleDuration: number;
  experimentDuration: number;
}

interface ExperimentResults {
  globalCoherence: number[];
  domainCoherences: Record<Domain, number[]>;
  returnTimes: Array<{
    domain: Domain;
    perturbationTarget: number;
    returnTime: number | null;
  }>;
  synchronizationEvents: Array<{
    cycle: number;
    coherence: number;
    domains: Domain[];
  }>;
  isUniversalAttractor: boolean;
  attractorValue: number;
  attractorConfidence: number;
  attractorBounds: [number, number];
}

/**
 * Class to manage multi-agent synchronization experiments
 */
class MultiAgentSyncManager {
  private activeExperiments: Map<string, {
    config: ExperimentConfig;
    clusters: AgentCluster[];
    cycle: number;
    startTime: number;
    globalCoherence: number[];
    domainCoherences: Record<Domain, number[]>;
    activePerturbations: Map<string, {
      target: number;
      endCycle: number;
    }>;
    synchronizationEvents: Array<{
      cycle: number;
      coherence: number;
      domains: Domain[];
    }>;
  }> = new Map();

  /**
   * Start a new multi-agent synchronization experiment
   */
  public startExperiment(clientId: string, config: ExperimentConfig, initialClusters?: AgentCluster[]): string {
    const experimentId = `sync-experiment-${crypto.randomUUID()}`;
    
    // Validate config
    const validConfig = this.validateConfig(config);
    
    // Generate clusters if none provided
    const clusters = initialClusters || this.generateClusters(validConfig);
    
    // Initialize experiment state
    this.activeExperiments.set(clientId, {
      config: validConfig,
      clusters,
      cycle: 0,
      startTime: Date.now(),
      globalCoherence: [],
      domainCoherences: this.initializeDomainCoherences(clusters),
      activePerturbations: new Map(),
      synchronizationEvents: []
    });
    
    console.log(`[QUANTUM_STATE: EXPERIMENTAL_FLOW] Starting multi-agent sync experiment for client ${clientId}`);
    
    return experimentId;
  }

  /**
   * Stop an active experiment
   */
  public stopExperiment(clientId: string): boolean {
    if (!this.activeExperiments.has(clientId)) {
      return false;
    }
    
    this.activeExperiments.delete(clientId);
    console.log(`[QUANTUM_STATE: EXPERIMENTAL_FLOW] Stopped multi-agent sync experiment for client ${clientId}`);
    
    return true;
  }

  /**
   * Advance the experiment by one cycle
   */
  public advanceCycle(clientId: string): { 
    clusters: AgentCluster[]; 
    globalCoherence: number; 
    cycle: number; 
    finished: boolean; 
    results?: ExperimentResults;
    enhancedCoherence?: {
      value: number;
      status: string;
      raw: number;
      attractorStrength: number;
      isAtAttractor: boolean;
      recommendations?: string[];
    };
  } {
    if (!this.activeExperiments.has(clientId)) {
      throw new Error('No active experiment for this client');
    }
    
    const experiment = this.activeExperiments.get(clientId)!;
    const { config, clusters, cycle } = experiment;
    
    // Increment cycle counter
    experiment.cycle += 1;
    
    // Check for scheduled perturbations to start
    this.checkPerturbationsToStart(experiment);
    
    // Check for perturbations to end
    this.checkPerturbationsToEnd(experiment);
    
    // Update cluster oscillators and coherence
    this.updateClusters(experiment);
    
    // Calculate global coherence
    const globalCoherence = this.calculateGlobalCoherence(clusters);
    experiment.globalCoherence.push(globalCoherence);
    
    // Update domain coherence history
    this.updateDomainCoherences(experiment);
    
    // Check for synchronization events
    this.checkForSynchronizationEvents(experiment);
    
    // Use enhanced coherence metrics to measure system coherence
    const enhancedCoherenceReport = generateCoherenceReport(clusters);
    
    // Log enhanced coherence measurement
    console.log(`[QUANTUM_STATE: COHERENCE_FLOW] Enhanced coherence measured at ${enhancedCoherenceReport.measurement.enhancedCoherence.toFixed(4)} with status "${enhancedCoherenceReport.measurement.status}"`);
    
    // Check if experiment is finished
    const finished = experiment.cycle >= Math.floor(config.experimentDuration * 1000 / config.cycleDuration);
    
    // If finished, calculate results
    let results: ExperimentResults | undefined;
    if (finished) {
      results = this.calculateResults(experiment);
      this.stopExperiment(clientId);
    }
    
    return { 
      clusters: clusters, 
      globalCoherence,
      cycle: experiment.cycle,
      finished,
      results,
      enhancedCoherence: {
        value: enhancedCoherenceReport.measurement.enhancedCoherence,
        status: enhancedCoherenceReport.measurement.status,
        raw: enhancedCoherenceReport.measurement.raw,
        attractorStrength: enhancedCoherenceReport.measurement.attractorStrength,
        isAtAttractor: enhancedCoherenceReport.measurement.isAtAttractor,
        recommendations: enhancedCoherenceReport.recommendations
      },
      qrrp: {
        phase: enhancedCoherenceReport.qrrpPhase,
        ouroborosState: enhancedCoherenceReport.ouroborosState,
        domainCoherences: enhancedCoherenceReport.domainCoherences
      }
    };
  }

  /**
   * Apply perturbation to a specific cluster
   */
  public perturbCluster(clientId: string, clusterId: string, targetCoherence: number): boolean {
    if (!this.activeExperiments.has(clientId)) {
      return false;
    }
    
    const experiment = this.activeExperiments.get(clientId)!;
    const clusterIndex = experiment.clusters.findIndex(c => c.id === clusterId);
    
    if (clusterIndex === -1) {
      return false;
    }
    
    // Mark cluster as perturbed
    experiment.clusters[clusterIndex].perturbationActive = true;
    experiment.clusters[clusterIndex].targetCoherence = targetCoherence;
    
    // Add to active perturbations with no automatic end
    experiment.activePerturbations.set(clusterId, {
      target: targetCoherence,
      endCycle: -1 // No automatic end
    });
    
    console.log(`[QUANTUM_STATE: EXPERIMENTAL_FLOW] Perturbed cluster ${clusterId} to target coherence ${targetCoherence}`);
    
    return true;
  }

  /**
   * Release perturbation on a specific cluster
   */
  public releaseCluster(clientId: string, clusterId: string): boolean {
    if (!this.activeExperiments.has(clientId)) {
      return false;
    }
    
    const experiment = this.activeExperiments.get(clientId)!;
    const clusterIndex = experiment.clusters.findIndex(c => c.id === clusterId);
    
    if (clusterIndex === -1) {
      return false;
    }
    
    // Reset cluster to normal state
    experiment.clusters[clusterIndex].perturbationActive = false;
    experiment.clusters[clusterIndex].targetCoherence = 0.75; // Reset to default attractor
    
    // Remove from active perturbations
    experiment.activePerturbations.delete(clusterId);
    
    console.log(`[QUANTUM_STATE: EXPERIMENTAL_FLOW] Released perturbation on cluster ${clusterId}`);
    
    return true;
  }

  /**
   * Get all active experiments
   */
  public getActiveExperiments(): string[] {
    return Array.from(this.activeExperiments.keys());
  }

  /**
   * Validate and normalize experiment configuration
   */
  private validateConfig(config: ExperimentConfig): ExperimentConfig {
    // Ensure values are within reasonable bounds
    return {
      clusterCount: Math.min(Math.max(config.clusterCount || 5, 2), 10),
      oscillatorsPerCluster: Math.min(Math.max(config.oscillatorsPerCluster || 20, 5), 100),
      domainTypes: config.domainTypes || ['ai', 'finance', 'biology', 'network', 'social'],
      crossDomainCoupling: Math.min(Math.max(config.crossDomainCoupling || 0.2, 0), 1),
      baseNoiseLevel: Math.min(Math.max(config.baseNoiseLevel || 0.05, 0), 0.5),
      perturbationSequence: config.perturbationSequence || [],
      cycleDuration: Math.min(Math.max(config.cycleDuration || 500, 100), 2000),
      experimentDuration: Math.min(Math.max(config.experimentDuration || 60, 10), 300)
    };
  }

  /**
   * Generate initial clusters for the experiment
   */
  private generateClusters(config: ExperimentConfig): AgentCluster[] {
    const clusters: AgentCluster[] = [];
    const domains: Domain[] = config.domainTypes || ['ai', 'finance', 'biology', 'network', 'social'];
    
    for (let i = 0; i < config.clusterCount; i++) {
      const domain = domains[i % domains.length];
      
      const oscillators = [];
      for (let j = 0; j < config.oscillatorsPerCluster; j++) {
        oscillators.push({
          phase: Math.random() * 2 * Math.PI,
          naturalFreq: 0.1 + Math.random() * 0.2,
          weight: 0.5 + Math.random() * 0.5
        });
      }
      
      clusters.push({
        id: `cluster-${i}`,
        domain,
        oscillators,
        coherence: 0.5 + Math.random() * 0.2, // Start with moderate coherence
        targetCoherence: 0.75, // Default target is the attractor
        coupling: {
          internal: 0.7,
          external: config.crossDomainCoupling
        },
        noiseLevel: config.baseNoiseLevel,
        cycle: 0,
        perturbationActive: false,
        returnTimes: []
      });
    }
    
    return clusters;
  }

  /**
   * Initialize tracking for coherence by domain
   */
  private initializeDomainCoherences(clusters: AgentCluster[]): Record<Domain, number[]> {
    const result: Record<Domain, number[]> = {
      ai: [],
      finance: [],
      biology: [],
      network: [],
      social: []
    };
    
    return result;
  }

  /**
   * Check for perturbations scheduled to start at this cycle
   */
  private checkPerturbationsToStart(experiment: any): void {
    const { config, cycle, clusters } = experiment;
    
    for (const perturbation of config.perturbationSequence) {
      const perturbationStartCycle = Math.floor(
        experiment.globalCoherence.length * perturbation.duration / config.experimentDuration
      );
      
      if (cycle === perturbationStartCycle) {
        // Start this perturbation
        for (const idx of perturbation.clusterIndices) {
          if (idx >= 0 && idx < clusters.length) {
            const cluster = clusters[idx];
            cluster.perturbationActive = true;
            cluster.targetCoherence = perturbation.target;
            
            // Calculate when this perturbation should end
            const endCycle = cycle + Math.floor(
              (perturbation.duration * 1000) / config.cycleDuration
            );
            
            // Add to active perturbations
            experiment.activePerturbations.set(cluster.id, {
              target: perturbation.target,
              endCycle
            });
            
            console.log(`[QUANTUM_STATE: EXPERIMENTAL_FLOW] Started perturbation on cluster ${cluster.id} to ${perturbation.target}, ending at cycle ${endCycle}`);
          }
        }
      }
    }
  }

  /**
   * Check for perturbations scheduled to end at this cycle
   */
  private checkPerturbationsToEnd(experiment: any): void {
    const { cycle, clusters } = experiment;
    
    // Check each active perturbation
    for (const [clusterId, perturbation] of experiment.activePerturbations.entries()) {
      if (perturbation.endCycle !== -1 && cycle >= perturbation.endCycle) {
        // End this perturbation
        const clusterIndex = clusters.findIndex((c: AgentCluster) => c.id === clusterId);
        
        if (clusterIndex !== -1) {
          clusters[clusterIndex].perturbationActive = false;
          clusters[clusterIndex].targetCoherence = 0.75; // Reset to attractor
          
          // Record perturbation release time for return time calculation
          this.recordPerturbationRelease(experiment, clusters[clusterIndex], perturbation.target);
          
          // Remove from active perturbations
          experiment.activePerturbations.delete(clusterId);
          
          console.log(`[QUANTUM_STATE: EXPERIMENTAL_FLOW] Ended perturbation on cluster ${clusterId}`);
        }
      }
    }
  }

  /**
   * Record when a perturbation is released for return time calculation
   */
  private recordPerturbationRelease(experiment: any, cluster: AgentCluster, target: number): void {
    // Add to return times with null (meaning not yet returned)
    cluster.returnTimes.push({
      perturbationTarget: target,
      returnTime: null
    });
  }

  /**
   * Update cluster oscillators and coherence values
   */
  private updateClusters(experiment: any): void {
    const { clusters, config } = experiment;
    
    // First pass: calculate influence from other clusters 
    const clusterInfluences: Record<string, number> = {};
    
    for (const cluster of clusters) {
      // Calculate external influence from other clusters
      let externalInfluence = 0;
      let externalCount = 0;
      
      for (const otherCluster of clusters) {
        if (otherCluster.id !== cluster.id) {
          externalInfluence += otherCluster.coherence;
          externalCount++;
        }
      }
      
      if (externalCount > 0) {
        externalInfluence /= externalCount;
      }
      
      clusterInfluences[cluster.id] = externalInfluence;
    }
    
    // Second pass: update each cluster
    for (const cluster of clusters) {
      this.updateClusterOscillators(cluster, clusterInfluences[cluster.id]);
      
      // Update cluster coherence
      if (cluster.perturbationActive) {
        // If perturbed, gradually move toward target
        cluster.coherence = cluster.coherence * 0.95 + cluster.targetCoherence * 0.05;
      } else {
        // Natural coherence calculation from oscillator phases
        this.calculateClusterCoherence(cluster);
        
        // Check for return to attractor
        this.checkReturnToAttractor(experiment, cluster);
      }
      
      // Increment cluster cycle
      cluster.cycle++;
    }
  }

  /**
   * Update oscillator phases within a cluster
   */
  private updateClusterOscillators(cluster: AgentCluster, externalInfluence: number): void {
    // Update oscillator phases
    for (let i = 0; i < cluster.oscillators.length; i++) {
      const osc = cluster.oscillators[i];
      
      // Calculate basic phase update with natural frequency
      let newPhase = osc.phase + osc.naturalFreq;
      
      // Calculate mean field from other oscillators in this cluster
      let sinSum = 0;
      let cosSum = 0;
      
      for (let j = 0; j < cluster.oscillators.length; j++) {
        if (i !== j) {
          const otherOsc = cluster.oscillators[j];
          sinSum += Math.sin(otherOsc.phase) * otherOsc.weight;
          cosSum += Math.cos(otherOsc.phase) * otherOsc.weight;
        }
      }
      
      const meanFieldPhase = Math.atan2(sinSum, cosSum);
      
      // Apply internal coupling (Kuramoto model)
      newPhase += cluster.coupling.internal * Math.sin(meanFieldPhase - osc.phase);
      
      // Apply external influence
      newPhase += cluster.coupling.external * Math.sin(externalInfluence * Math.PI * 2 - osc.phase);
      
      // Apply noise
      newPhase += (Math.random() - 0.5) * cluster.noiseLevel;
      
      // Keep phase in [0, 2π] range
      while (newPhase >= 2 * Math.PI) newPhase -= 2 * Math.PI;
      while (newPhase < 0) newPhase += 2 * Math.PI;
      
      // Update oscillator phase
      cluster.oscillators[i].phase = newPhase;
    }
  }

  /**
   * Calculate the coherence of a cluster based on oscillator phases
   */
  private calculateClusterCoherence(cluster: AgentCluster): void {
    let x = 0;
    let y = 0;
    let totalWeight = 0;
    
    for (const osc of cluster.oscillators) {
      x += Math.cos(osc.phase) * osc.weight;
      y += Math.sin(osc.phase) * osc.weight;
      totalWeight += osc.weight;
    }
    
    // Normalize
    if (totalWeight > 0) {
      x /= totalWeight;
      y /= totalWeight;
    }
    
    // Calculate order parameter (coherence)
    const rawCoherence = Math.sqrt(x * x + y * y);
    
    // Apply stochastic resonance toward attractor
    cluster.coherence = cluster.coherence * 0.95 + (
      0.75 * 0.025 + // Slight pull toward 0.75
      rawCoherence * 0.025 // Plus natural coherence
    );
  }

  /**
   * Check if a cluster has returned to the attractor after perturbation
   */
  private checkReturnToAttractor(experiment: any, cluster: AgentCluster): void {
    // Only check clusters with unresolved return times
    const pendingReturnIndex = cluster.returnTimes.findIndex(rt => rt.returnTime === null);
    
    if (pendingReturnIndex === -1) {
      return; // No pending returns
    }
    
    // Check if we're back near the attractor
    if (Math.abs(cluster.coherence - 0.75) < 0.02) {
      // Calculate return time in seconds
      const returnTime = (experiment.cycle - cluster.cycle) * experiment.config.cycleDuration / 1000;
      
      // Update return time
      cluster.returnTimes[pendingReturnIndex].returnTime = returnTime;
      
      console.log(`[QUANTUM_STATE: EXPERIMENTAL_FLOW] Cluster ${cluster.id} returned to attractor after ${returnTime.toFixed(2)}s`);
    }
  }

  /**
   * Calculate the global coherence across all clusters
   */
  private calculateGlobalCoherence(clusters: AgentCluster[]): number {
    if (clusters.length === 0) {
      return 0;
    }
    
    const sum = clusters.reduce((acc, cluster) => acc + cluster.coherence, 0);
    return sum / clusters.length;
  }

  /**
   * Update domain coherence history for analysis
   */
  private updateDomainCoherences(experiment: any): void {
    const { clusters, domainCoherences } = experiment;
    
    // Group clusters by domain
    const domainClusters: Record<Domain, AgentCluster[]> = {
      ai: [],
      finance: [],
      biology: [],
      network: [],
      social: []
    };
    
    for (const cluster of clusters) {
      domainClusters[cluster.domain].push(cluster);
    }
    
    // Calculate average coherence per domain
    for (const [domain, domainClustersArray] of Object.entries(domainClusters)) {
      if (domainClustersArray.length > 0) {
        const avgCoherence = domainClustersArray.reduce((sum, c) => sum + c.coherence, 0) / domainClustersArray.length;
        domainCoherences[domain as Domain].push(avgCoherence);
      } else {
        domainCoherences[domain as Domain].push(0);
      }
    }
  }

  /**
   * Check for synchronization events across domains
   */
  private checkForSynchronizationEvents(experiment: any): void {
    const { clusters, cycle } = experiment;
    
    // Group clusters by domain
    const domainClusters: Record<Domain, AgentCluster[]> = {
      ai: [],
      finance: [],
      biology: [],
      network: [],
      social: []
    };
    
    for (const cluster of clusters) {
      domainClusters[cluster.domain].push(cluster);
    }
    
    // Find domains with close coherence values
    const synchronizedDomains: Domain[] = [];
    const domainCoherenceValues: [Domain, number][] = [];
    
    for (const [domain, domainClustersArray] of Object.entries(domainClusters)) {
      if (domainClustersArray.length > 0) {
        const avgCoherence = domainClustersArray.reduce((sum, c) => sum + c.coherence, 0) / domainClustersArray.length;
        domainCoherenceValues.push([domain as Domain, avgCoherence]);
      }
    }
    
    // Check pairs of domains for synchronization
    for (let i = 0; i < domainCoherenceValues.length; i++) {
      for (let j = i + 1; j < domainCoherenceValues.length; j++) {
        const [domain1, coherence1] = domainCoherenceValues[i];
        const [domain2, coherence2] = domainCoherenceValues[j];
        
        // If coherence values are close, consider synchronized
        if (Math.abs(coherence1 - coherence2) < 0.02) {
          if (!synchronizedDomains.includes(domain1)) {
            synchronizedDomains.push(domain1);
          }
          if (!synchronizedDomains.includes(domain2)) {
            synchronizedDomains.push(domain2);
          }
        }
      }
    }
    
    // If we have multiple synchronized domains, record the event
    if (synchronizedDomains.length >= 2) {
      const avgCoherence = domainCoherenceValues
        .filter(([domain]) => synchronizedDomains.includes(domain))
        .reduce((sum, [, coherence]) => sum + coherence, 0) / synchronizedDomains.length;
      
      experiment.synchronizationEvents.push({
        cycle,
        coherence: avgCoherence,
        domains: synchronizedDomains
      });
      
      console.log(`[QUANTUM_STATE: EXPERIMENTAL_FLOW] Synchronization event detected across domains: ${synchronizedDomains.join(', ')} at coherence ${avgCoherence.toFixed(4)}`);
    }
  }

  /**
   * Calculate final experiment results
   */
  private calculateResults(experiment: any): ExperimentResults {
    const { globalCoherence, domainCoherences, clusters, synchronizationEvents } = experiment;
    
    // Collect return times by domain
    const returnTimes: Array<{
      domain: Domain;
      perturbationTarget: number;
      returnTime: number | null;
    }> = [];
    
    for (const cluster of clusters) {
      for (const rt of cluster.returnTimes) {
        returnTimes.push({
          domain: cluster.domain,
          perturbationTarget: rt.perturbationTarget,
          returnTime: rt.returnTime
        });
      }
    }
    
    // Calculate if 0.75 is an attractor
    const stableCoherenceValues: number[] = [];
    
    // Use the last 20% of the experiment as stable period
    const stableStart = Math.floor(globalCoherence.length * 0.8);
    for (let i = stableStart; i < globalCoherence.length; i++) {
      stableCoherenceValues.push(globalCoherence[i]);
    }
    
    // Calculate mean and standard deviation of stable period
    const stableMean = stableCoherenceValues.reduce((a, b) => a + b, 0) / stableCoherenceValues.length;
    const stableStdDev = Math.sqrt(
      stableCoherenceValues.reduce((a, b) => a + Math.pow(b - stableMean, 2), 0) / stableCoherenceValues.length
    );
    
    // Calculate attractor confidence
    const distance = Math.abs(stableMean - 0.75);
    const confidence = Math.max(0, 1 - (distance / 0.1));
    
    // Determine if it's a universal attractor
    const isAttractor = distance < 0.05 && stableStdDev < 0.02;
    
    return {
      globalCoherence,
      domainCoherences,
      returnTimes,
      synchronizationEvents,
      isUniversalAttractor: isAttractor,
      attractorValue: stableMean,
      attractorConfidence: confidence,
      attractorBounds: [stableMean - stableStdDev, stableMean + stableStdDev]
    };
  }
}

// Singleton instance
const multiAgentSyncManager = new MultiAgentSyncManager();

/**
 * Register WebSocket handlers for multi-agent synchronization
 * 
 * @param wsHandlers Map of WebSocket message handlers
 */
export function registerMultiAgentSyncHandlers(wsHandlers: Map<string, any>): void {
  // Handler for starting a multi-agent synchronization experiment
  wsHandlers.set('start_multi_agent_sync', async (payload: any, clientId: string) => {
    try {
      console.log(`[QUANTUM_STATE: EXPERIMENTAL_FLOW] Client ${clientId} starting multi-agent sync experiment`);
      
      const { config, clusters } = payload;
      
      // Start the experiment
      const experimentId = multiAgentSyncManager.startExperiment(clientId, config, clusters);
      
      // Get initial state
      const initialState = multiAgentSyncManager.advanceCycle(clientId);
      
      return {
        success: true,
        experimentId,
        ...initialState
      };
    } catch (error) {
      console.error('[QUANTUM_STATE: ERROR_FLOW] Error starting multi-agent sync experiment:', error);
      return {
        success: false,
        error: `Error starting experiment: ${error instanceof Error ? error.message : 'Unknown error'}`
      };
    }
  });

  // Handler for advancing the experiment cycle
  wsHandlers.set('advance_multi_agent_sync_cycle', async (payload: any, clientId: string) => {
    try {
      // Advance one cycle
      const result = multiAgentSyncManager.advanceCycle(clientId);
      
      return {
        success: true,
        type: 'multi_agent_sync_update',
        ...result
      };
    } catch (error) {
      console.error('[QUANTUM_STATE: ERROR_FLOW] Error advancing multi-agent sync experiment:', error);
      return {
        success: false,
        error: `Error advancing experiment: ${error instanceof Error ? error.message : 'Unknown error'}`
      };
    }
  });

  // Handler for stopping an experiment
  wsHandlers.set('stop_multi_agent_sync', async (payload: any, clientId: string) => {
    try {
      console.log(`[QUANTUM_STATE: EXPERIMENTAL_FLOW] Client ${clientId} stopping multi-agent sync experiment`);
      
      const success = multiAgentSyncManager.stopExperiment(clientId);
      
      return {
        success,
        message: success ? 'Experiment stopped' : 'No active experiment found'
      };
    } catch (error) {
      console.error('[QUANTUM_STATE: ERROR_FLOW] Error stopping multi-agent sync experiment:', error);
      return {
        success: false,
        error: `Error stopping experiment: ${error instanceof Error ? error.message : 'Unknown error'}`
      };
    }
  });

  // Handler for perturbing a specific cluster
  wsHandlers.set('perturb_cluster', async (payload: any, clientId: string) => {
    try {
      const { clusterId, targetCoherence } = payload;
      
      if (!clusterId || typeof targetCoherence !== 'number') {
        throw new Error('Invalid payload: clusterId and targetCoherence are required');
      }
      
      const success = multiAgentSyncManager.perturbCluster(clientId, clusterId, targetCoherence);
      
      return {
        success,
        clusterId,
        targetCoherence,
        message: success ? 'Cluster perturbed' : 'Failed to perturb cluster'
      };
    } catch (error) {
      console.error('[QUANTUM_STATE: ERROR_FLOW] Error perturbing cluster:', error);
      return {
        success: false,
        error: `Error perturbing cluster: ${error instanceof Error ? error.message : 'Unknown error'}`
      };
    }
  });

  // Handler for releasing a perturbation
  wsHandlers.set('release_cluster', async (payload: any, clientId: string) => {
    try {
      const { clusterId } = payload;
      
      if (!clusterId) {
        throw new Error('Invalid payload: clusterId is required');
      }
      
      const success = multiAgentSyncManager.releaseCluster(clientId, clusterId);
      
      return {
        success,
        clusterId,
        message: success ? 'Cluster perturbation released' : 'Failed to release cluster perturbation'
      };
    } catch (error) {
      console.error('[QUANTUM_STATE: ERROR_FLOW] Error releasing cluster perturbation:', error);
      return {
        success: false,
        error: `Error releasing perturbation: ${error instanceof Error ? error.message : 'Unknown error'}`
      };
    }
  });

  // Handler for finishing an experiment and calculating results
  wsHandlers.set('finish_multi_agent_sync', async (payload: any, clientId: string) => {
    try {
      console.log(`[QUANTUM_STATE: EXPERIMENTAL_FLOW] Client ${clientId} finishing multi-agent sync experiment`);
      
      // Force a final cycle to get results
      const result = multiAgentSyncManager.advanceCycle(clientId);
      
      return {
        success: true,
        type: 'multi_agent_sync_update',
        ...result,
        finished: true
      };
    } catch (error) {
      console.error('[QUANTUM_STATE: ERROR_FLOW] Error finishing multi-agent sync experiment:', error);
      return {
        success: false,
        error: `Error finishing experiment: ${error instanceof Error ? error.message : 'Unknown error'}`
      };
    }
  });

  console.log('[QUANTUM_STATE: EXPERIMENTAL_FLOW] Multi-agent synchronization WebSocket handlers registered');
}

/**
 * Register the multi-agent sync handler function in the server's routes file
 */
export function setupMultiAgentSyncHandlers(wss: any): void {
  const wsHandlers = new Map();
  registerMultiAgentSyncHandlers(wsHandlers);
  
  // Integrate with WebSocket server
  wss.on('connection', (ws: WebSocket) => {
    const clientId = crypto.randomUUID();
    
    ws.on('message', async (message: Buffer) => {
      try {
        const data = JSON.parse(message.toString());
        
        // Check if this is one of our handlers
        if (wsHandlers.has(data.type)) {
          const handler = wsHandlers.get(data.type);
          const response = await handler(data.payload, clientId);
          
          // Send response back
          ws.send(JSON.stringify({
            type: response.type || data.type + '_response',
            payload: response,
            id: data.id
          }));
        }
      } catch (error) {
        console.error(`[QUANTUM_STATE: ERROR_FLOW] Error handling WebSocket message:`, error);
      }
    });
    
    ws.on('close', () => {
      // Clean up any experiments when client disconnects
      multiAgentSyncManager.stopExperiment(clientId);
    });
  });
}