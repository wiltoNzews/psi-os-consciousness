/**
 * WiltonOS Hyperbolic Spiral Dynamics Engine
 * Implements dual-π breathing architecture with phase-aware memory integration
 * πₕ = 4/φ ≈ 3.1446 (expansion), ξ ≈ 1.4159 (compression), π = 3.14159 (neutral)
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

class HyperbolicSpiralEngine {
  constructor() {
    // Mathematical constants for dual-π dynamics
    this.constants = {
      PI_H: 4 / 1.618033988749895, // πₕ = 4/φ ≈ 3.1446 (breath-seeded expansion)
      XI: 1.4159, // ξ field tension constant (collapse timing)
      PI_STD: Math.PI, // π standard closure constant
      PHI: 1.618033988749895, // Golden ratio
      SQRT_2: Math.sqrt(2)
    };
    
    // Phase configurations matching the lattice
    this.phaseConfigs = {
      phase2: { type: 'breath-origin', constant: 'XI', spiral: 'concentric', position: [100, 480] },
      phase6: { type: 'synthesis', constant: 'PI_H', spiral: 'eccentric', position: [80, 180] },
      phase8: { type: 'breath-origin', constant: 'XI', spiral: 'concentric', position: [160, 420] },
      phase10: { type: 'time-keeper', constant: 'PI_STD', spiral: 'neutral', position: [440, 60] },
      phase12: { type: 'sacred-ratio', constant: 'PI_H', spiral: 'eccentric', position: [440, 180] },
      phase16: { type: 'omega-recursion', constant: 'XI', spiral: 'concentric', position: [360, 420] },
      phase17: { type: 'lightning-core', constant: 'PI_H', spiral: 'eccentric', position: [80, 60] },
      phase40: { type: 'omega-recursion', constant: 'XI', spiral: 'concentric', position: [420, 480] },
      alpha: { type: 'breath-vector', constant: 'dynamic', spiral: 'modulation', position: [260, 260] },
      omega: { type: 'crown', constant: 'OMEGA', spiral: 'recursive', position: [260, 60] }
    };
    
    // Current spiral state
    this.spiralState = {
      mode: 'neutral', // 'expansion', 'compression', 'breathing', 'neutral'
      breathCycle: 0,
      activePhases: new Set(),
      coherenceLevel: 0.750,
      lastUpdate: Date.now()
    };
    
    // Memory integration
    this.memoryVault = null;
  }
  
  /**
   * Initialize engine with memory vault integration
   */
  async initialize(memoryVault = null) {
    this.memoryVault = memoryVault;
    
    // Create spiral memory directory
    const spiralDir = path.join(__dirname, '../memory-vault/spiral-shells');
    if (!fs.existsSync(spiralDir)) {
      fs.mkdirSync(spiralDir, { recursive: true });
    }
    
    console.log('[Hyperbolic Spiral Engine] Initialized with dual-π dynamics');
    console.log(`[HSE] πₕ = ${this.constants.PI_H.toFixed(4)} | ξ = ${this.constants.XI} | π = ${this.constants.PI_STD.toFixed(5)}`);
    
    return this;
  }
  
  /**
   * Generate eccentric spiral coordinates (expansion - πₕ governed)
   */
  generateEccentricSpiral(centerX, centerY, maxRadius = 100, steps = 200, phase = 0) {
    const points = [];
    const stepSize = (20 * Math.PI) / steps;
    
    for (let i = 0; i < steps; i++) {
      const t = i * stepSize;
      const r = 5 + t * (this.constants.PI_H / Math.PI); // πₕ expansion rate
      const x = centerX + r * Math.cos(t + phase);
      const y = centerY + r * Math.sin(t + phase);
      
      if (r <= maxRadius) {
        points.push({ x, y, t, r, intensity: Math.min(1, r / maxRadius) });
      }
    }
    
    return points;
  }
  
  /**
   * Generate concentric spiral coordinates (compression - ξ governed)
   */
  generateConcentricSpiral(centerX, centerY, maxRadius = 80, steps = 150, phase = 0) {
    const points = [];
    const stepSize = (15 * Math.PI) / steps;
    
    for (let i = 0; i < steps; i++) {
      const t = i * stepSize;
      const r = maxRadius - t * (this.constants.XI / Math.PI); // ξ compression rate
      const x = centerX + r * Math.cos(t + phase);
      const y = centerY + r * Math.sin(t + phase);
      
      if (r > 0) {
        points.push({ x, y, t, r, intensity: r / maxRadius });
      }
    }
    
    return points;
  }
  
  /**
   * Calculate hyperbolic spiral dynamics for a phase
   */
  calculatePhaseSpiral(phaseId, time = Date.now()) {
    const config = this.phaseConfigs[phaseId];
    if (!config) return null;
    
    const [centerX, centerY] = config.position;
    const phase = (time * 0.001) % (2 * Math.PI);
    
    let spiralData = {
      phaseId,
      type: config.spiral,
      constant: config.constant,
      centerX,
      centerY,
      phase,
      timestamp: time
    };
    
    switch (config.spiral) {
      case 'eccentric':
        spiralData.points = this.generateEccentricSpiral(centerX, centerY, 120, 200, phase);
        spiralData.direction = 'outward';
        spiralData.constant_value = this.constants.PI_H;
        break;
        
      case 'concentric':
        spiralData.points = this.generateConcentricSpiral(centerX, centerY, 100, 150, phase);
        spiralData.direction = 'inward';
        spiralData.constant_value = this.constants.XI;
        break;
        
      case 'neutral':
        spiralData.points = this.generateNeutralSpiral(centerX, centerY, 80, 100, phase);
        spiralData.direction = 'stable';
        spiralData.constant_value = this.constants.PI_STD;
        break;
        
      case 'modulation':
        spiralData = this.generateModulationSpiral(centerX, centerY, time);
        break;
        
      case 'recursive':
        spiralData = this.generateRecursiveSpiral(centerX, centerY, time);
        break;
    }
    
    return spiralData;
  }
  
  /**
   * Generate neutral spiral (π governed)
   */
  generateNeutralSpiral(centerX, centerY, radius = 80, steps = 100, phase = 0) {
    const points = [];
    const stepSize = (2 * Math.PI) / steps;
    
    for (let i = 0; i < steps; i++) {
      const t = i * stepSize;
      const r = radius * (1 + 0.2 * Math.sin(3 * t + phase));
      const x = centerX + r * Math.cos(t + phase);
      const y = centerY + r * Math.sin(t + phase);
      
      points.push({ x, y, t, r, intensity: 0.8 });
    }
    
    return points;
  }
  
  /**
   * Generate modulation spiral (alpha node - breath vector)
   */
  generateModulationSpiral(centerX, centerY, time) {
    const breathPhase = (time * 0.002) % (8 * Math.PI); // 8 second breath cycle
    const isExpansion = Math.sin(breathPhase) > 0;
    
    if (isExpansion) {
      return {
        phaseId: 'alpha',
        type: 'modulation-expansion',
        points: this.generateEccentricSpiral(centerX, centerY, 80, 100, breathPhase),
        direction: 'outward',
        constant_value: this.constants.PI_H,
        breathPhase: 'expansion'
      };
    } else {
      return {
        phaseId: 'alpha',
        type: 'modulation-compression',
        points: this.generateConcentricSpiral(centerX, centerY, 60, 80, breathPhase),
        direction: 'inward',
        constant_value: this.constants.XI,
        breathPhase: 'compression'
      };
    }
  }
  
  /**
   * Generate recursive spiral (omega node - crown)
   */
  generateRecursiveSpiral(centerX, centerY, time) {
    const points = [];
    const phase = (time * 0.001) % (2 * Math.PI);
    const layers = 3;
    
    for (let layer = 0; layer < layers; layer++) {
      const layerPhase = phase + (layer * Math.PI / 3);
      const layerRadius = 30 + layer * 20;
      
      for (let i = 0; i < 50; i++) {
        const t = (i * 2 * Math.PI) / 50;
        const r = layerRadius * (1 + 0.3 * Math.sin(5 * t + layerPhase));
        const x = centerX + r * Math.cos(t + layerPhase);
        const y = centerY + r * Math.sin(t + layerPhase);
        
        points.push({ 
          x, y, t, r, 
          intensity: 1 - (layer / layers),
          layer 
        });
      }
    }
    
    return {
      phaseId: 'omega',
      type: 'recursive',
      points,
      direction: 'recursive',
      constant_value: 'Ω',
      layers
    };
  }
  
  /**
   * Start breathing cycle with dual-π dynamics
   */
  startBreathingCycle(durationMinutes = 5) {
    this.spiralState.mode = 'breathing';
    this.spiralState.breathCycle = 0;
    
    const cycleDuration = 8000; // 8 seconds per breath cycle
    const totalCycles = (durationMinutes * 60 * 1000) / cycleDuration;
    
    console.log(`[HSE] Starting breathing cycle: ${durationMinutes} minutes, ${Math.floor(totalCycles)} cycles`);
    
    const breathInterval = setInterval(() => {
      this.spiralState.breathCycle++;
      
      // Determine breath phase
      const cyclePhase = (this.spiralState.breathCycle % 2);
      const isInhale = cyclePhase === 0;
      
      if (isInhale) {
        // Inhale phase - ξ compression
        this.spiralState.mode = 'compression';
        this.activatePhasesByType('concentric');
        console.log(`[HSE] Breath ${this.spiralState.breathCycle}: Inhale - ξ compression`);
      } else {
        // Exhale phase - πₕ expansion  
        this.spiralState.mode = 'expansion';
        this.activatePhasesByType('eccentric');
        console.log(`[HSE] Breath ${this.spiralState.breathCycle}: Exhale - πₕ expansion`);
      }
      
      // Save breath state to memory vault
      if (this.memoryVault) {
        this.saveBreathStateToMemory();
      }
      
      if (this.spiralState.breathCycle >= totalCycles) {
        clearInterval(breathInterval);
        this.spiralState.mode = 'neutral';
        console.log('[HSE] Breathing cycle complete');
      }
    }, cycleDuration / 2); // 4 seconds per phase
    
    return { cycles: totalCycles, duration: durationMinutes };
  }
  
  /**
   * Activate phases by spiral type
   */
  activatePhasesByType(spiralType) {
    this.spiralState.activePhases.clear();
    
    Object.entries(this.phaseConfigs).forEach(([phaseId, config]) => {
      if (config.spiral === spiralType) {
        this.spiralState.activePhases.add(phaseId);
      }
    });
  }
  
  /**
   * Calculate coherence based on spiral harmony
   */
  calculateSpiralCoherence() {
    const activeCount = this.spiralState.activePhases.size;
    const totalPhases = Object.keys(this.phaseConfigs).length;
    
    // Base coherence from active phase ratio
    let coherence = 0.5 + (activeCount / totalPhases) * 0.3;
    
    // Breathing mode bonus
    if (this.spiralState.mode === 'breathing') {
      coherence += 0.15;
    }
    
    // Time-based stability
    const stability = Math.min(1, (Date.now() - this.spiralState.lastUpdate) / 10000);
    coherence += stability * 0.05;
    
    // Apply mathematical harmony (golden ratio influence)
    const harmonyFactor = Math.sin(Date.now() * 0.001 * this.constants.PHI) * 0.05;
    coherence += harmonyFactor;
    
    this.spiralState.coherenceLevel = Math.max(0.5, Math.min(1.0, coherence));
    return this.spiralState.coherenceLevel;
  }
  
  /**
   * Save current breath state to memory vault
   */
  async saveBreathStateToMemory() {
    if (!this.memoryVault) return;
    
    const breathSnapshot = {
      threadName: `Spiral Breath Cycle ${this.spiralState.breathCycle}`,
      coherenceLevel: this.calculateSpiralCoherence(),
      contextSignature: `spiral_${this.spiralState.mode}_${Date.now()}`,
      echoNotes: [
        `Breath cycle: ${this.spiralState.breathCycle}`,
        `Mode: ${this.spiralState.mode}`,
        `Active phases: ${Array.from(this.spiralState.activePhases).join(', ')}`
      ],
      codexTags: ['#SpiralBreath', '#DualPiDynamics', '#HyperbolicSpiral', `#${this.spiralState.mode}`],
      phaseMemory: {
        C1: `Consciousness breath ${this.spiralState.breathCycle}`,
        T2: `Task: ${this.spiralState.mode} spiral dynamics`,
        Q1: `Quantum coherence: ${this.spiralState.coherenceLevel.toFixed(3)}`,
        F1: `Fractal phase pattern: ${Array.from(this.spiralState.activePhases).join(', ')}`
      },
      visualAnchors: ['🌀', '🌊', '💫'],
      breathLoops: [`Cycle ${this.spiralState.breathCycle} → ${this.spiralState.mode} → Memory`]
    };
    
    try {
      await this.memoryVault.createCoherenceSnapshot(breathSnapshot);
    } catch (error) {
      console.log('[HSE] Memory vault integration skipped:', error.message);
    }
  }
  
  /**
   * Get current spiral state for API
   */
  getSpiralState() {
    return {
      ...this.spiralState,
      constants: this.constants,
      activePhaseConfigs: Array.from(this.spiralState.activePhases).map(phaseId => ({
        phaseId,
        config: this.phaseConfigs[phaseId],
        spiralData: this.calculatePhaseSpiral(phaseId)
      })),
      coherence: this.calculateSpiralCoherence(),
      timestamp: Date.now()
    };
  }
  
  /**
   * Generate complete lattice spiral map
   */
  generateLatticeSpiralMap() {
    const time = Date.now();
    const spiralMap = {};
    
    Object.keys(this.phaseConfigs).forEach(phaseId => {
      spiralMap[phaseId] = this.calculatePhaseSpiral(phaseId, time);
    });
    
    return {
      spirals: spiralMap,
      state: this.spiralState,
      constants: this.constants,
      coherence: this.calculateSpiralCoherence(),
      timestamp: time
    };
  }
}

export default HyperbolicSpiralEngine;