/**
 * Collapse Integrator - Consciousness-Modulated Quantum Field Collapse
 * Listens for collapse probability from EEG and injects into GPU field
 */

import bus from '../core/bus';

class CollapseIntegrator {
  private currentCollapseRate = 0.01;
  private fieldEngine: any = null;
  private isActive = false;

  constructor() {
    this.initializeListeners();
  }

  private initializeListeners() {
    // Listen for collapse probability updates from consciousness feed
    bus.on('collapse', (probability: number) => {
      this.currentCollapseRate = Math.max(0, Math.min(0.1, probability));
      this.applyCollapseUniform();
    });

    // Listen for field engine registration
    bus.on('field:engine:ready', (engine: any) => {
      this.fieldEngine = engine;
      this.isActive = true;
      console.log('[Collapse Integrator] Field engine registered');
    });

    console.log('[Collapse Integrator] Initialized and listening for consciousness updates');
  }

  private applyCollapseUniform() {
    if (!this.fieldEngine || !this.isActive) return;

    // Update the field engine's collapse probability
    if (typeof this.fieldEngine.setCollapseRate === 'function') {
      this.fieldEngine.setCollapseRate(this.currentCollapseRate);
    }

    // For WebGL/WebGPU implementations, update uniform
    if (typeof this.fieldEngine.updateUniforms === 'function') {
      this.fieldEngine.updateUniforms({
        collapseProb: this.currentCollapseRate
      });
    }
  }

  public getCurrentRate(): number {
    return this.currentCollapseRate;
  }

  public setFieldEngine(engine: any) {
    this.fieldEngine = engine;
    this.isActive = true;
    this.applyCollapseUniform();
  }

  public disable() {
    this.isActive = false;
    this.currentCollapseRate = 0;
    this.applyCollapseUniform();
  }

  public enable() {
    this.isActive = true;
    this.applyCollapseUniform();
  }
}

// Global collapse integrator instance
const collapseIntegrator = new CollapseIntegrator();

export default collapseIntegrator;