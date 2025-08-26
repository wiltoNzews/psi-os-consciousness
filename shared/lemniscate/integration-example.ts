/**
 * Integration Example for Coherence Measurement Engine
 * 
 * This example demonstrates how to use the Coherence Measurement Engine
 * within a larger system to monitor and optimize AI coherence levels.
 * 
 * [QUANTUM_STATE: INTEGRATION_FLOW]
 */

import { 
  CoherenceMeasurementEngine, 
  StateVector, 
  PhaseState, 
  AIOutput,
  TemporalScale,
  CoherenceTargets,
  CoherenceMeasurement
} from './coherence-measurement-engine.js';

/**
 * Agent state integration example
 * 
 * This class demonstrates how an agent's state could be integrated with
 * the coherence measurement engine.
 */
class AgentStateManager {
  private engine: CoherenceMeasurementEngine;
  private agentId: string;
  private lastVector: number[] | null = null;
  private lastPhase: number | null = null;
  private currentMode: 'stability' | 'exploration' = 'stability';
  private currentOutput: string = '';
  
  constructor(agentId: string) {
    this.engine = new CoherenceMeasurementEngine();
    this.agentId = agentId;
  }
  
  /**
   * Update the agent's state vector
   */
  public updateStateVector(vector: number[], scale: TemporalScale = TemporalScale.MICRO): void {
    this.lastVector = vector;
    
    const stateVector: StateVector = {
      id: this.agentId,
      vector,
      timestamp: new Date(),
      scale
    };
    
    this.engine.recordStateVector(stateVector);
    this.checkCoherence(scale);
  }
  
  /**
   * Update the agent's phase state
   */
  public updatePhaseState(phase: number, naturalFrequency: number = 0.1, scale: TemporalScale = TemporalScale.MICRO): void {
    this.lastPhase = phase;
    
    const phaseState: PhaseState = {
      id: this.agentId,
      phase,
      naturalFrequency,
      timestamp: new Date(),
      scale
    };
    
    this.engine.recordPhaseState(phaseState);
    this.checkCoherence(scale);
  }
  
  /**
   * Update the agent's output
   */
  public updateOutput(content: string, scale: TemporalScale = TemporalScale.MICRO): void {
    this.currentOutput = content;
    
    const output: AIOutput = {
      id: this.agentId,
      content,
      timestamp: new Date(),
      scale
    };
    
    this.engine.recordOutput(output);
    this.checkCoherence(scale);
  }
  
  /**
   * Check coherence and adjust mode if necessary
   */
  private checkCoherence(scale: TemporalScale): void {
    const measurement = this.engine.getMostRecentMeasurement(scale);
    
    if (!measurement) {
      return;
    }
    
    // Check attractor status
    const attractorStatus = this.engine.isApproachingAttractor(scale);
    
    // If we're approaching an attractor different from our current mode, switch modes
    if (attractorStatus.approaching) {
      const newMode = Math.abs(attractorStatus.target - CoherenceTargets.STABILITY) < 0.1
        ? 'stability'
        : 'exploration';
        
      if (newMode !== this.currentMode) {
        this.currentMode = newMode;
        this.notifyModeChange();
      }
    }
  }
  
  /**
   * Notify that the mode has changed
   */
  private notifyModeChange(): void {
    console.log(`[Agent ${this.agentId}] Mode changed to: ${this.currentMode}`);
    console.log(`[Agent ${this.agentId}] Adjusting behavior for ${this.currentMode}...`);
    
    // In a real system, this would trigger behavioral changes in the agent
    // For example:
    // - In stability mode: more focused, consistent responses
    // - In exploration mode: more creative, varied responses
  }
  
  /**
   * Get the current mode
   */
  public getCurrentMode(): 'stability' | 'exploration' {
    return this.currentMode;
  }
  
  /**
   * Get the current coherence measurement
   */
  public getCurrentCoherence(scale: TemporalScale = TemporalScale.MICRO): CoherenceMeasurement | null {
    return this.engine.getMostRecentMeasurement(scale);
  }
  
  /**
   * Get the cross-scale coherence measurements
   */
  public getCrossScaleCoherence(): Record<TemporalScale, CoherenceMeasurement | null> {
    return this.engine.getCrossScaleCoherence();
  }
  
  /**
   * Reset the coherence state
   */
  public reset(): void {
    this.engine.reset();
    this.lastVector = null;
    this.lastPhase = null;
    this.currentOutput = '';
  }
}

/**
 * Multi-agent coherence orchestrator example
 * 
 * This class demonstrates how multiple agents' coherence could be
 * orchestrated together.
 */
class MultiAgentCoherenceOrchestrator {
  private agents: Map<string, AgentStateManager> = new Map();
  private globalEngine: CoherenceMeasurementEngine = new CoherenceMeasurementEngine();
  private currentCycle: number = 0;
  private targetCoherence: number = CoherenceTargets.STABILITY;
  private activeScale: TemporalScale = TemporalScale.MICRO;
  
  /**
   * Register an agent with the orchestrator
   */
  public registerAgent(agentId: string): AgentStateManager {
    const agent = new AgentStateManager(agentId);
    this.agents.set(agentId, agent);
    return agent;
  }
  
  /**
   * Remove an agent from the orchestrator
   */
  public removeAgent(agentId: string): boolean {
    return this.agents.delete(agentId);
  }
  
  /**
   * Run a coherence cycle to measure and adjust global coherence
   */
  public runCoherenceCycle(): void {
    this.currentCycle++;
    
    console.log(`\n--- Running Coherence Cycle ${this.currentCycle} ---`);
    console.log(`Active Scale: ${this.activeScale}`);
    console.log(`Target Coherence: ${this.targetCoherence.toFixed(4)}`);
    console.log(`Number of Agents: ${this.agents.size}`);
    
    // Collect all agent states and submit to the global engine
    this.agents.forEach((agent, agentId) => {
      // Generate a random phase for this example
      // In a real system, this would come from the agent's internal state
      const phase = Math.random() * 2 * Math.PI;
      
      const phaseState: PhaseState = {
        id: agentId,
        phase,
        naturalFrequency: 0.1,
        timestamp: new Date(),
        scale: this.activeScale
      };
      
      this.globalEngine.recordPhaseState(phaseState);
      
      // Update the agent's own state too
      agent.updatePhaseState(phase, 0.1, this.activeScale);
    });
    
    // Get the global coherence measurement
    const measurement = this.globalEngine.getMostRecentMeasurement(this.activeScale);
    
    if (measurement) {
      console.log(`Global Coherence: ${measurement.value.toFixed(4)}`);
      
      // Check if we need to toggle the target coherence
      const distanceToTarget = Math.abs(measurement.value - this.targetCoherence);
      
      if (distanceToTarget < 0.05) {
        console.log('Target coherence reached, toggling to opposite mode...');
        this.toggleTargetCoherence();
      }
    } else {
      console.log('No coherence measurement available yet');
    }
    
    // Periodically change the active scale
    if (this.currentCycle % 10 === 0) {
      this.cycleActiveScale();
    }
  }
  
  /**
   * Toggle the target coherence between stability and exploration
   */
  private toggleTargetCoherence(): void {
    this.targetCoherence = 
      this.targetCoherence === CoherenceTargets.STABILITY 
        ? CoherenceTargets.EXPLORATION 
        : CoherenceTargets.STABILITY;
        
    console.log(`New Target Coherence: ${this.targetCoherence.toFixed(4)}`);
  }
  
  /**
   * Change the active temporal scale
   */
  public setActiveScale(scale: TemporalScale): void {
    this.activeScale = scale;
    console.log(`Active Scale set to: ${scale}`);
  }
  
  /**
   * Cycle through the available temporal scales
   */
  private cycleActiveScale(): void {
    const scales = [TemporalScale.MICRO, TemporalScale.MESO, TemporalScale.MACRO];
    const currentIndex = scales.indexOf(this.activeScale);
    const nextIndex = (currentIndex + 1) % scales.length;
    this.activeScale = scales[nextIndex];
    
    console.log(`Active Scale cycled to: ${this.activeScale}`);
  }
  
  /**
   * Get the current global coherence measurement
   */
  public getGlobalCoherence(): CoherenceMeasurement | null {
    return this.globalEngine.getMostRecentMeasurement(this.activeScale);
  }
  
  /**
   * Reset the orchestrator
   */
  public reset(): void {
    this.globalEngine.reset();
    this.agents.forEach(agent => agent.reset());
    this.currentCycle = 0;
  }
}

/**
 * Demonstration of a basic usage of the multi-agent coherence orchestrator
 */
async function demonstrateOrchestrator(): Promise<void> {
  console.log('======================================');
  console.log('Multi-Agent Coherence Orchestration Demo');
  console.log('======================================\n');
  
  const orchestrator = new MultiAgentCoherenceOrchestrator();
  
  // Register some agents
  orchestrator.registerAgent('agent1');
  orchestrator.registerAgent('agent2');
  orchestrator.registerAgent('agent3');
  orchestrator.registerAgent('agent4');
  orchestrator.registerAgent('agent5');
  
  // Run several coherence cycles
  for (let i = 0; i < 30; i++) {
    orchestrator.runCoherenceCycle();
    
    // In a real system, we would wait for the next cycle trigger
    // For this demo, we'll just add a small delay
    await new Promise(resolve => setTimeout(resolve, 100));
  }
  
  console.log('\n======================================');
  console.log('Demonstration Complete');
  console.log('======================================');
}

// Run the demo if this module is executed directly
if (require.main === module) {
  demonstrateOrchestrator().catch(console.error);
}

export { AgentStateManager, MultiAgentCoherenceOrchestrator, demonstrateOrchestrator };