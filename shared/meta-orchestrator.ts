/**
 * Meta Orchestrator
 * 
 * Coordinates the intelligent orchestration of quantum coherence,
 * variants, and other meta-cognitive components.
 * 
 * [QUANTUM_STATE: FOUNDATION_FLOW]
 */

import { EventEmitter } from 'events';
import { ouroborosService } from './OuroborosService.js';

/**
 * Structure of a variant in the system
 */
export interface Variant {
  /** Unique ID of the variant */
  id: string;
  
  /** Name of the variant */
  name: string;
  
  /** Type of variant (stability, chaos, etc.) */
  type: string;
  
  /** Parameters specific to this variant */
  parameters: Record<string, any>;
  
  /** Current activation level (0-1) */
  activation: number;
  
  /** Whether the variant is active */
  isActive: boolean;
  
  /** When the variant was created */
  createdAt: Date;
  
  /** Last time the variant was updated */
  updatedAt: Date;
  
  /** Optional metadata */
  metadata?: Record<string, any>;
}

/**
 * Structure of system state
 */
export interface SystemState {
  /** Current coherence value */
  coherence: number;
  
  /** Current coherence phase */
  coherencePhase: 'stability' | 'adaptability';
  
  /** Current QCTF value */
  qctf: number;
  
  /** Active variants */
  activeVariants: Variant[];
  
  /** System stability factor */
  stabilityFactor: number;
  
  /** Current timestamp */
  timestamp: number;
}

/**
 * Central orchestrator to coordinate all quantum-inspired components
 */
export class MetaOrchestrator extends EventEmitter {
  private variants: Map<string, Variant> = new Map();
  private lastSystemState: SystemState | null = null;
  private isInitialized: boolean = false;
  private resonanceTracker: any = null;
  
  /**
   * Creates a new MetaOrchestrator
   */
  constructor() {
    super();
    this.initialize();
  }
  
  /**
   * Initializes the Meta Orchestrator
   */
  private initialize(): void {
    if (this.isInitialized) return;
    
    // Subscribe to Ouroboros service events
    ouroborosService.on('state', (state) => {
      this.updateSystemState();
    });
    
    // Initialize system state
    this.updateSystemState();
    
    this.isInitialized = true;
    console.log('[QUANTUM_STATE: FOUNDATION_FLOW] Meta Orchestrator initialized');
  }
  
  /**
   * Updates the overall system state
   */
  private updateSystemState(): void {
    const ouroborosState = ouroborosService.getCurrentState();
    const activeVariants = this.getActiveVariants();
    
    // Calculate QCTF based on current state
    const qctf = ouroborosService.calculateQCTF();
    
    // Calculate stability factor
    const stabilityFactor = ouroborosService.getCoherenceStability(20);
    
    const newState: SystemState = {
      coherence: ouroborosState.coherence,
      coherencePhase: ouroborosState.phase,
      qctf,
      activeVariants,
      stabilityFactor,
      timestamp: Date.now()
    };
    
    this.lastSystemState = newState;
    this.emit('stateUpdated', newState);
  }
  
  /**
   * Gets the current system state
   */
  public getSystemState(): SystemState {
    if (!this.lastSystemState) {
      this.updateSystemState();
    }
    return this.lastSystemState as SystemState;
  }
  
  /**
   * Registers a new variant
   */
  public registerVariant(variant: Omit<Variant, 'createdAt' | 'updatedAt'>): Variant {
    if (this.variants.has(variant.id)) {
      throw new Error(`Variant with ID ${variant.id} already exists`);
    }
    
    const now = new Date();
    const fullVariant: Variant = {
      ...variant,
      createdAt: now,
      updatedAt: now
    };
    
    this.variants.set(variant.id, fullVariant);
    
    console.log(`[QUANTUM_STATE: CREATION_FLOW] Created variant ${variant.name} (${variant.id.substring(0, 10)}...)`);
    this.emit('variantRegistered', fullVariant);
    
    return fullVariant;
  }
  
  /**
   * Gets all registered variants
   */
  public getAllVariants(): Variant[] {
    return Array.from(this.variants.values());
  }
  
  /**
   * Alias for getAllVariants - provided for API compatibility with previous versions
   */
  public getVariants(): Variant[] {
    return this.getAllVariants();
  }
  
  /**
   * Gets active variants
   */
  public getActiveVariants(): Variant[] {
    return Array.from(this.variants.values()).filter(v => v.isActive);
  }
  
  /**
   * Gets a variant by ID
   */
  public getVariant(id: string): Variant | undefined {
    return this.variants.get(id);
  }
  
  /**
   * Updates a variant's properties
   */
  public updateVariant(id: string, updates: Partial<Omit<Variant, 'id' | 'createdAt' | 'updatedAt'>>): Variant {
    const variant = this.getVariant(id);
    
    if (!variant) {
      throw new Error(`Variant with ID ${id} not found`);
    }
    
    const updatedVariant: Variant = {
      ...variant,
      ...updates,
      updatedAt: new Date()
    };
    
    this.variants.set(id, updatedVariant);
    
    console.log(`[QUANTUM_STATE: UPDATE_FLOW] Updated variant ${variant.name} (${variant.id.substring(0, 10)}...)`);
    this.emit('variantUpdated', updatedVariant);
    
    return updatedVariant;
  }
  
  /**
   * Removes a variant
   */
  public removeVariant(id: string): boolean {
    const variant = this.getVariant(id);
    
    if (!variant) {
      return false;
    }
    
    this.variants.delete(id);
    
    console.log(`[QUANTUM_STATE: DELETION_FLOW] Removed variant ${variant.name} (${variant.id.substring(0, 10)}...)`);
    this.emit('variantRemoved', variant);
    
    return true;
  }
  
  /**
   * Activates a variant
   */
  public activateVariant(id: string, activation: number = 1.0): Variant {
    const variant = this.getVariant(id);
    
    if (!variant) {
      throw new Error(`Variant with ID ${id} not found`);
    }
    
    return this.updateVariant(id, {
      isActive: true,
      activation: Math.max(0, Math.min(1, activation))
    });
  }
  
  /**
   * Deactivates a variant
   */
  public deactivateVariant(id: string): Variant {
    const variant = this.getVariant(id);
    
    if (!variant) {
      throw new Error(`Variant with ID ${id} not found`);
    }
    
    return this.updateVariant(id, {
      isActive: false,
      activation: 0
    });
  }
  
  /**
   * Seeds the system with initial variants
   */
  public seedInitialVariants(): void {
    // Create stability-focused variant
    if (!this.getVariantByName('Stability Variant')) {
      this.registerVariant({
        id: `Variant-${Date.now()}-1`,
        name: 'Stability Variant',
        type: 'stability',
        parameters: {
          targetCoherence: 0.85,
          attractorStrength: 0.95,
          stabilityPhaseRatio: 0.8
        },
        activation: 0.7,
        isActive: true,
        metadata: {
          description: 'Prioritizes system stability and consistent behavior'
        }
      });
    }
    
    // Create balance-focused variant
    if (!this.getVariantByName('Balance Variant')) {
      this.registerVariant({
        id: `Variant-${Date.now()}-2`,
        name: 'Balance Variant',
        type: 'balance',
        parameters: {
          targetCoherence: 0.75,
          attractorStrength: 0.9,
          stabilityPhaseRatio: 0.75
        },
        activation: 0.8,
        isActive: true,
        metadata: {
          description: 'Maintains optimal balance between stability and adaptability'
        }
      });
    }
    
    // Create adaptability-focused variant
    if (!this.getVariantByName('Adaptability Variant')) {
      this.registerVariant({
        id: `Variant-3`,
        name: 'Adaptability Variant',
        type: 'adaptability',
        parameters: {
          targetCoherence: 0.65,
          attractorStrength: 0.85,
          stabilityPhaseRatio: 0.6
        },
        activation: 0.6,
        isActive: true,
        metadata: {
          description: 'Emphasizes adaptability and exploration'
        }
      });
    }
    
    // Create chaos variant
    if (!this.getVariantByName('Chaos Variant')) {
      this.registerVariant({
        id: `Variant-4`,
        name: 'Chaos Variant',
        type: 'chaos',
        parameters: {
          targetCoherence: 0.5,
          attractorStrength: 0.7,
          stabilityPhaseRatio: 0.3
        },
        activation: 0.3,
        isActive: false,
        metadata: {
          description: 'Introduces controlled chaos for radical innovation'
        }
      });
    }
    
    console.log('[QUANTUM_STATE: FOUNDATION_FLOW] Seeded Meta-Orchestrator with initial variants');
  }
  
  /**
   * Gets a variant by name
   */
  public getVariantByName(name: string): Variant | undefined {
    return Array.from(this.variants.values()).find(v => v.name === name);
  }
  
  /**
   * Perturbs the system coherence
   */
  public perturbSystem(targetCoherence: number, duration: number): void {
    ouroborosService.perturb(targetCoherence, duration);
    console.log(`[QUANTUM_STATE: PERTURBATION_FLOW] System perturbed to ${targetCoherence} for ${duration} cycles`);
    this.emit('systemPerturbed', { targetCoherence, duration });
  }
  
  /**
   * Updates the coherence target
   */
  public updateCoherenceTarget(target: number): void {
    ouroborosService.updateParameters({ targetCoherence: target });
    console.log(`[QUANTUM_STATE: UPDATE_FLOW] Coherence target updated to ${target}`);
    this.emit('coherenceTargetUpdated', target);
  }
  
  /**
   * Gets the current QCTF value
   */
  public getQCTF(): number {
    return ouroborosService.calculateQCTF();
  }
  
  /**
   * Gets the current coherence value
   * This method is used by the perturbation test system to intercept and modify coherence values
   * during validation experiments
   */
  public getCoherence(): number {
    return ouroborosService.getCurrentState().coherence;
  }
  
  /**
   * Calculates QCTF with custom parameters
   */
  public calculateQCTF(params: {
    CI?: number;
    GEF?: number;
    QEAI?: number;
    theta?: number;
  } = {}): number {
    return ouroborosService.calculateQCTF(params);
  }
  
  /**
   * Starts the Ouroboros service
   */
  public start(): void {
    ouroborosService.start();
    console.log('[QUANTUM_STATE: FOUNDATION_FLOW] Meta-Orchestrator started');
    this.emit('started');
  }
  
  /**
   * Stops the Ouroboros service
   */
  public stop(): void {
    ouroborosService.stop();
    console.log('[QUANTUM_STATE: FOUNDATION_FLOW] Meta-Orchestrator stopped');
    this.emit('stopped');
  }
  
  /**
   * Sets the experimental manager for integration with experiment handlers
   * This method allows external experimental systems to integrate with the orchestrator
   * 
   * @param experimentalManager The experimental manager instance to integrate
   */
  public setExperimentalManager(experimentalManager: any): void {
    console.log('[QUANTUM_STATE: FOUNDATION_FLOW] Experimental manager attached to Meta-Orchestrator');
    this.emit('experimentalManagerSet', experimentalManager);
  }
  
  /**
   * Adds a message handler function for WebSocket messages
   * This method allows WebSocket handlers to register their message processing functions
   * 
   * @param handler The message handler function to add
   */
  public addMessageHandler(handler: Function): void {
    console.log('[QUANTUM_STATE: FOUNDATION_FLOW] Message handler added to Meta-Orchestrator');
    this.emit('messageHandlerAdded', handler);
  }
  
  /**
   * Adds a variant to the system (legacy compatibility method)
   * Transforms the legacy variant format to the new Variant interface
   * 
   * @param variantData Legacy variant data
   * @returns The created variant
   */
  public addVariant(variantData: any): Variant {
    // Map legacy variant data to new Variant interface
    const variant: Omit<Variant, 'createdAt' | 'updatedAt'> = {
      id: variantData.id || `variant-${Date.now()}`,
      name: variantData.name || `Variant ${Date.now().toString().slice(-4)}`,
      type: variantData.type || 'generic',
      parameters: {
        qctf: variantData.qctf || 0,
        theta: variantData.theta || 0,
        entropy: variantData.entropy || 0,
        plugins: variantData.plugins || [],
        generation: variantData.generation || 0,
        ...variantData
      },
      activation: variantData.weight || 1.0,
      isActive: true,
      metadata: {
        timestamp: variantData.timestamp || Date.now(),
        legacy: true
      }
    };
    
    return this.registerVariant(variant);
  }
  
  /**
   * Calculate the weighted 5D meta-orchestration QCTF value
   * QCTF_5D(t) = ∑_{i=1}^{n} w_i(t) · QCTF_variant_i(t)
   * 
   * @returns The calculated 5D QCTF value
   */
  public calculate5DQCTF(): number {
    const variants = this.getAllVariants();
    
    if (variants.length === 0) return 0.75; // Default to optimal coherence value
    
    let qctf5D = 0;
    let weightSum = 0;
    
    for (const variant of variants) {
      const qctfValue = variant.parameters?.qctf || 0.75;
      const weight = variant.activation || 1.0;
      
      qctf5D += weight * qctfValue;
      weightSum += weight;
    }
    
    // Normalize if needed
    return weightSum > 0 ? qctf5D / weightSum : 0.75;
  }
  
  /**
   * Resonate variants with each other to update resonance values
   * This function calculates the resonance between all active variants
   * and updates their weights based on the resonance values
   */
  public resonateVariants(): void {
    const variants = this.getActiveVariants();
    
    if (variants.length <= 1) return; // No resonance with less than 2 variants
    
    console.log(`[QUANTUM_STATE: RESONANCE_FLOW] Resonating ${variants.length} active variants`);
    
    // Create a map to store resonance values for each variant
    const resonanceMap = new Map<string, number>();
    
    // Calculate resonance between all variant pairs
    for (let i = 0; i < variants.length; i++) {
      for (let j = i + 1; j < variants.length; j++) {
        const v1 = variants[i];
        const v2 = variants[j];
        
        // Calculate resonance value using a simple coherence formula
        // In a real implementation, this would use the resonance formula from qctf-meta.ts
        const coherenceDiff = Math.abs((v1.parameters?.qctf || 0.75) - (v2.parameters?.qctf || 0.75));
        const resonance = 1 - (coherenceDiff / 0.75);
        
        // Add resonance to both variants' totals
        resonanceMap.set(v1.id, (resonanceMap.get(v1.id) || 0) + resonance);
        resonanceMap.set(v2.id, (resonanceMap.get(v2.id) || 0) + resonance);
      }
    }
    
    // Normalize and update weights for each variant
    for (const variant of variants) {
      // Get total resonance and normalize by number of other variants
      const totalResonance = resonanceMap.get(variant.id) || 0;
      const normalizedResonance = variants.length > 1 ? totalResonance / (variants.length - 1) : 0;
      
      // Update variant with resonance value
      this.updateVariant(variant.id, {
        activation: 0.25 + (0.75 * normalizedResonance) // Scale to range 0.25-1.0
      });
    }
    
    this.emit('variantsResonated');
  }
  
  /**
   * Run a cycle in the orchestrator
   * This method is used by the validation process to trigger a cycle in the system
   * and collect metrics for validation purposes
   * 
   * @returns The current system state after running the cycle
   */
  public async runCycle(): Promise<{ metrics: any }> {
    // Update system state to simulate a cycle
    this.updateSystemState();
    
    // Resonate variants with each other
    this.resonateVariants();
    
    // Calculate current QCTF
    const qctf = this.getQCTF();
    
    // Get the current state of the Ouroboros service
    const ouroborosState = ouroborosService.getCurrentState();
    
    // Collect system metrics for validation
    const systemMetrics = {
      CTF: qctf,
      coherence: ouroborosState.coherence,
      systemCoherence: ouroborosState.coherence, // For compatibility with validation scripts
      phase: ouroborosState.phase,
      stabilityFactor: ouroborosService.getCoherenceStability(20),
      variantCount: this.getActiveVariants().length,
      timestamp: Date.now()
    };
    
    console.log(`[QUANTUM_STATE: CYCLE_FLOW] Completed system cycle - Coherence: ${ouroborosState.coherence.toFixed(4)}, QCTF: ${qctf.toFixed(4)}`);
    
    // Emit cycle completed event
    this.emit('cycleCompleted', {
      metrics: systemMetrics,
      timestamp: Date.now()
    });
    
    // Return the state for validation
    return {
      metrics: systemMetrics
    };
  }
  
  /**
   * Get system metrics for validation
   * 
   * @returns Current system metrics
   */
  public getSystemMetrics(): any {
    // Update system state to ensure we have the latest metrics
    this.updateSystemState();
    
    // Get the current state of the Ouroboros service
    const ouroborosState = ouroborosService.getCurrentState();
    
    // Return system metrics
    return {
      CTF: this.getQCTF(),
      coherence: ouroborosState.coherence,
      systemCoherence: ouroborosState.coherence, // For compatibility with validation scripts
      phase: ouroborosState.phase,
      stabilityFactor: ouroborosService.getCoherenceStability(20),
      variantCount: this.getActiveVariants().length,
      timestamp: Date.now()
    };
  }
}

// Export a singleton instance
export const metaOrchestrator = new MetaOrchestrator();