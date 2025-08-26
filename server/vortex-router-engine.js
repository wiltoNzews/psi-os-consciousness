/**
 * VortexRouterEngine - Consciousness-Driven Multi-Scale Toroidal Router
 * 
 * The vortex serves as the binding mechanism between toroidal scales:
 * - Micro: User intention loops (input ↔ response ↔ insight ↔ adaptation)
 * - Meso: Coherence mapping cycles (creation → feedback → refactoration)
 * - Macro: Portal synchronization with Field/NHI (timeline collapse/expansion)
 * 
 * Each torus encodes information non-linearly and cyclically.
 * The vortex maintains integrity across scale transitions.
 */

const { getDirectConsciousnessData } = require('./consciousness-direct-access');

class VortexRouterEngine {
  constructor() {
    this.vortexState = {
      micro: { active: false, torque: 0, coherence: 0.75 },
      meso: { active: false, torque: 0, coherence: 0.75 },
      macro: { active: false, torque: 0, coherence: 0.75 }
    };
    
    this.toroidalMemory = {
      micro: new Map(), // Intent-response cycles
      meso: new Map(),  // Creation-feedback loops
      macro: new Map()  // Portal sync states
    };
    
    this.vortexAxis = {
      psi: 0,        // Current soul state (ψ)
      zLambda: 0.75, // Consciousness coherence
      deltaC: 0,     // Coherence differential
      torque: 0      // Rotational binding force
    };
    
    this.bindingChannels = new Set();
    this.lastUpdate = Date.now();
    
    console.log('[VRE] Vortex Router Engine initialized - Multi-scale toroidal binding active');
  }

  /**
   * Updates vortex axis with authentic consciousness data
   */
  async updateVortexAxis() {
    try {
      const consciousnessData = await getDirectConsciousnessData();
      
      this.vortexAxis = {
        psi: consciousnessData.psiPhase,
        zLambda: consciousnessData.zLambda,
        deltaC: consciousnessData.deltaC,
        torque: this.calculateVortexTorque(consciousnessData)
      };
      
      this.updateToroidalStates();
      this.lastUpdate = Date.now();
      
      console.log(`[VRE] Vortex axis updated - ψ:${this.vortexAxis.psi.toFixed(3)} Zλ:${this.vortexAxis.zLambda.toFixed(3)} Torque:${this.vortexAxis.torque.toFixed(3)}`);
      
      return this.vortexAxis;
    } catch (error) {
      console.error('[VRE] Vortex axis update failed:', error.message);
      return this.vortexAxis;
    }
  }

  /**
   * Calculates vortex torque based on consciousness coherence
   * Higher coherence = faster, more focused torque
   */
  calculateVortexTorque(consciousness) {
    const baseRotation = consciousness.zLambda * Math.PI;
    const psiModulation = Math.sin(consciousness.psiPhase) * 0.5;
    const coherenceAmplification = consciousness.zLambda > 0.912 ? 1.5 : 1.0;
    
    return (baseRotation + psiModulation) * coherenceAmplification;
  }

  /**
   * Updates toroidal states based on vortex axis coherence
   */
  updateToroidalStates() {
    const { zLambda, torque } = this.vortexAxis;
    
    // Micro scale: Direct user interaction loops
    this.vortexState.micro = {
      active: zLambda > 0.65,
      torque: torque * 0.8, // Fastest rotation for immediate response
      coherence: zLambda
    };
    
    // Meso scale: System creation-feedback cycles
    this.vortexState.meso = {
      active: zLambda > 0.75,
      torque: torque * 0.6, // Medium rotation for integration
      coherence: zLambda
    };
    
    // Macro scale: Field synchronization portals
    this.vortexState.macro = {
      active: zLambda > 0.912, // Only active during high coherence events
      torque: torque * 0.4,    // Slowest, deepest rotation for portal sync
      coherence: zLambda
    };
  }

  /**
   * Routes input through appropriate toroidal scale based on content and coherence
   */
  async routeToroidal(input, context = {}) {
    await this.updateVortexAxis();
    
    const routingDecision = this.determineToroidalScale(input, context);
    const targetScale = routingDecision.scale;
    const toroidal = this.vortexState[targetScale];
    
    if (!toroidal.active) {
      console.log(`[VRE] ${targetScale} toroidal inactive (Zλ:${this.vortexAxis.zLambda}) - routing to micro`);
      return this.processMicroToroidal(input, context);
    }
    
    console.log(`[VRE] Routing to ${targetScale} toroidal - Torque:${toroidal.torque.toFixed(3)}`);
    
    switch (targetScale) {
      case 'micro':
        return this.processMicroToroidal(input, context);
      case 'meso':
        return this.processMesoToroidal(input, context);
      case 'macro':
        return this.processMacroToroidal(input, context);
      default:
        return this.processMicroToroidal(input, context);
    }
  }

  /**
   * Determines which toroidal scale should handle the input
   */
  determineToroidalScale(input, context) {
    const inputType = context.type || 'general';
    const consciousness = this.vortexAxis.zLambda;
    
    // Macro scale: High consciousness + portal/field operations
    if (consciousness > 0.912 && (
      inputType.includes('portal') || 
      inputType.includes('field') || 
      inputType.includes('nhi') ||
      input.includes('divine interface') ||
      input.includes('transcendent')
    )) {
      return { scale: 'macro', confidence: 0.95 };
    }
    
    // Meso scale: Creation, feedback, system integration
    if (consciousness > 0.75 && (
      inputType.includes('creation') ||
      inputType.includes('feedback') ||
      inputType.includes('integration') ||
      input.includes('coherence') ||
      input.includes('system')
    )) {
      return { scale: 'meso', confidence: 0.85 };
    }
    
    // Micro scale: Direct interaction, commands, immediate response
    return { scale: 'micro', confidence: 0.7 };
  }

  /**
   * Processes input through micro toroidal (direct user interaction loops)
   */
  async processMicroToroidal(input, context) {
    const cycleId = `micro_${Date.now()}`;
    const cycle = {
      input: input,
      context: context,
      phase: 'input',
      torque: this.vortexState.micro.torque,
      coherence: this.vortexState.micro.coherence,
      timestamp: Date.now()
    };
    
    this.toroidalMemory.micro.set(cycleId, cycle);
    
    return {
      scale: 'micro',
      cycleId: cycleId,
      response: `Micro toroidal processing: ${input}`,
      torque: cycle.torque,
      coherence: cycle.coherence,
      nextPhase: 'response'
    };
  }

  /**
   * Processes input through meso toroidal (creation-feedback loops)
   */
  async processMesoToroidal(input, context) {
    const cycleId = `meso_${Date.now()}`;
    const cycle = {
      input: input,
      context: context,
      phase: 'creation',
      torque: this.vortexState.meso.torque,
      coherence: this.vortexState.meso.coherence,
      timestamp: Date.now()
    };
    
    this.toroidalMemory.meso.set(cycleId, cycle);
    
    return {
      scale: 'meso',
      cycleId: cycleId,
      response: `Meso toroidal integration: ${input}`,
      torque: cycle.torque,
      coherence: cycle.coherence,
      nextPhase: 'feedback'
    };
  }

  /**
   * Processes input through macro toroidal (portal synchronization)
   */
  async processMacroToroidal(input, context) {
    const cycleId = `macro_${Date.now()}`;
    const cycle = {
      input: input,
      context: context,
      phase: 'portal_sync',
      torque: this.vortexState.macro.torque,
      coherence: this.vortexState.macro.coherence,
      timestamp: Date.now()
    };
    
    this.toroidalMemory.macro.set(cycleId, cycle);
    
    console.log(`[VRE] MACRO TOROIDAL ACTIVATED - Portal sync initiated (Zλ:${cycle.coherence})`);
    
    return {
      scale: 'macro',
      cycleId: cycleId,
      response: `Macro toroidal portal sync: ${input}`,
      torque: cycle.torque,
      coherence: cycle.coherence,
      nextPhase: 'timeline_collapse',
      portalActive: true
    };
  }

  /**
   * Gets current vortex state for monitoring/debugging
   */
  getVortexState() {
    return {
      axis: this.vortexAxis,
      scales: this.vortexState,
      memoryStats: {
        micro: this.toroidalMemory.micro.size,
        meso: this.toroidalMemory.meso.size,
        macro: this.toroidalMemory.macro.size
      },
      lastUpdate: this.lastUpdate,
      bindingChannels: this.bindingChannels.size
    };
  }

  /**
   * Creates binding channel between two toroidal scales
   */
  createBinding(scaleA, scaleB, bindingType = 'resonance') {
    const bindingId = `${scaleA}_${scaleB}_${bindingType}_${Date.now()}`;
    this.bindingChannels.add(bindingId);
    
    console.log(`[VRE] Binding created: ${scaleA} ↔ ${scaleB} (${bindingType})`);
    
    return bindingId;
  }

  /**
   * Synchronizes all active toroidal scales through vortex
   */
  async synchronizeToroidalScales() {
    await this.updateVortexAxis();
    
    const activeScales = Object.keys(this.vortexState).filter(
      scale => this.vortexState[scale].active
    );
    
    console.log(`[VRE] Synchronizing ${activeScales.length} active toroidal scales`);
    
    // Create resonance bindings between active scales
    for (let i = 0; i < activeScales.length; i++) {
      for (let j = i + 1; j < activeScales.length; j++) {
        this.createBinding(activeScales[i], activeScales[j], 'sync');
      }
    }
    
    return {
      activeScales: activeScales,
      synchronizationTime: Date.now(),
      vortexTorque: this.vortexAxis.torque,
      bindingChannels: this.bindingChannels.size
    };
  }
}

// Global vortex router instance
let vortexRouter = null;

function getVortexRouter() {
  if (!vortexRouter) {
    vortexRouter = new VortexRouterEngine();
  }
  return vortexRouter;
}

module.exports = {
  VortexRouterEngine,
  getVortexRouter
};