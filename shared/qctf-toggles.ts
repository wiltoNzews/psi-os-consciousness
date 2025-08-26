/**
 * Quantum Coherence Threshold Formula (QCTF) Toggle System
 * [QUANTUM_STATE: FOUNDATIONAL_FLOW]
 * 
 * This file implements the 𝓣_toggles quantum-control protocols: 
 * STOP, FAILSAFE, REROUTE, and WORMHOLE with variant-aware enhancements
 */

import { Toggles, ToggleEvent, TOGGLE_AUTH_MATRIX } from './qctf';
import { QCTFParams } from './qctf-plugins';

// Toggle types
export type ToggleType = 'stop' | 'failsafe' | 'reroute' | 'wormhole';

/**
 * Toggle state with variant awareness for the Quantum Bifurcation Engine
 */
export interface QuantumToggleState {
  active: boolean;          // Whether toggle is currently active
  value: number;            // Effect on QCTF calculation (default 1.0)
  lastActivated: string | null; // ISO timestamp of last activation
  sourceModule: string | null;  // Module that activated the toggle
  targetModule?: string;    // Target module (for REROUTE)
  reason: string;           // Reason for activation
  variantId?: string;       // ID of variant that activated this toggle
  thetaAtActivation?: number; // θ value at activation time (critical for θ=0.5)
}

/**
 * Complete Toggles state with variant awareness
 */
export interface QuantumToggles {
  stop: QuantumToggleState;
  failsafe: QuantumToggleState;
  reroute: QuantumToggleState;
  wormhole: QuantumToggleState;
}

/**
 * Initialize default quantum toggles state
 */
export function createDefaultQuantumToggles(): QuantumToggles {
  const defaultState = {
    active: false,
    value: 1.0,
    lastActivated: null,
    sourceModule: null,
    reason: ''
  };
  
  return {
    stop: { ...defaultState },
    failsafe: { ...defaultState },
    reroute: { ...defaultState },
    wormhole: { ...defaultState }
  };
}

/**
 * Check if a module is authorized to activate a specific toggle
 */
export function isAuthorized(module: string, toggleType: ToggleType): boolean {
  // Normalize module name for case-insensitive comparison
  const normalizedModule = module.charAt(0).toUpperCase() + module.slice(1).toLowerCase();
  
  // Check authorization matrix
  return TOGGLE_AUTH_MATRIX[toggleType]?.includes(normalizedModule) || false;
}

/**
 * Check if a module can trigger a specific toggle type
 * (Alias of isAuthorized for backward compatibility)
 */
export function canModuleTriggerToggle(module: string, toggleType: ToggleType): boolean {
  return isAuthorized(module, toggleType);
}

/**
 * Create a toggle event with variant awareness
 */
export function createToggleEvent(
  toggleType: ToggleType,
  action: 'activate' | 'deactivate',
  sourceModule: string,
  reason: string,
  thetaValue: number,
  variantId?: string,
  targetModule?: string
): ToggleEvent {
  // Calculate impact level based on proximity to θ=0.5
  const impactLevel = Math.abs(thetaValue - 0.5) < 0.1 
    ? 'HIGH' as const 
    : Math.abs(thetaValue - 0.5) < 0.25 
      ? 'MEDIUM' as const 
      : 'LOW' as const;
      
  return {
    id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    toggleType,
    action,
    sourceModule,
    targetModule: targetModule || null,
    reason,
    timestamp: new Date().toISOString(),
    impact: impactLevel
  };
}

/**
 * Activate the STOP toggle (emergency halt)
 */
export function activateStop(
  toggles: QuantumToggles,
  sourceModule: string,
  reason: string,
  theta: number = 0,
  variantId?: string,
  eventCallback?: (event: ToggleEvent) => void
): ToggleEvent | null {
  // Check authorization
  if (!isAuthorized(sourceModule, 'stop')) {
    console.error(`Module ${sourceModule} not authorized to activate STOP toggle`);
    return null;
  }
  
  // Create toggle event
  const event = createToggleEvent('stop', 'activate', sourceModule, reason, theta, variantId);
  
  // Update toggle state
  toggles.stop = {
    active: true,
    value: 0.85, // Slows but doesn't completely stop (more nuanced than previous 0.8)
    lastActivated: event.timestamp,
    sourceModule,
    reason,
    variantId,
    thetaAtActivation: theta
  };
  
  // Notify via callback if provided
  if (eventCallback) {
    eventCallback(event);
  }
  
  return event;
}

/**
 * Activate the FAILSAFE toggle (fallback to safe state)
 */
export function activateFailsafe(
  toggles: QuantumToggles,
  sourceModule: string,
  reason: string,
  theta: number = 0,
  variantId?: string,
  eventCallback?: (event: ToggleEvent) => void
): ToggleEvent | null {
  // Check authorization
  if (!isAuthorized(sourceModule, 'failsafe')) {
    console.error(`Module ${sourceModule} not authorized to activate FAILSAFE toggle`);
    return null;
  }
  
  // The closer to θ=0.5, the more aggressive the failsafe
  const failsafeValue = Math.max(0.8, 1.0 - Math.abs(theta - 0.5));
  
  // Create toggle event
  const event = createToggleEvent('failsafe', 'activate', sourceModule, reason, theta, variantId);
  
  // Update toggle state
  toggles.failsafe = {
    active: true,
    value: failsafeValue,
    lastActivated: event.timestamp,
    sourceModule,
    reason,
    variantId,
    thetaAtActivation: theta
  };
  
  // Notify via callback if provided
  if (eventCallback) {
    eventCallback(event);
  }
  
  return event;
}

/**
 * Activate the REROUTE toggle (redirect flow)
 */
export function activateReroute(
  toggles: QuantumToggles,
  sourceModule: string,
  targetModule: string,
  reason: string,
  theta: number = 0,
  variantId?: string,
  eventCallback?: (event: ToggleEvent) => void
): ToggleEvent | null {
  // Check authorization
  if (!isAuthorized(sourceModule, 'reroute')) {
    console.error(`Module ${sourceModule} not authorized to activate REROUTE toggle`);
    return null;
  }
  
  // Create toggle event
  const event = createToggleEvent(
    'reroute', 
    'activate', 
    sourceModule, 
    reason, 
    theta, 
    variantId, 
    targetModule
  );
  
  // Calculate dynamic reroute value based on theta
  // Near θ=0.5, rerouting is faster to respond to bifurcation conditions
  const rerouteValue = 1.0 + 0.1 * (1 - Math.abs(theta - 0.5) * 2);
  
  // Update toggle state
  toggles.reroute = {
    active: true,
    value: rerouteValue,
    lastActivated: event.timestamp,
    sourceModule,
    targetModule,
    reason,
    variantId,
    thetaAtActivation: theta
  };
  
  // Notify via callback if provided
  if (eventCallback) {
    eventCallback(event);
  }
  
  return event;
}

/**
 * Activate the WORMHOLE toggle (cross-dimension connection for variant communication)
 */
export function activateWormhole(
  toggles: QuantumToggles,
  sourceModule: string,
  reason: string,
  theta: number = 0,
  variantId?: string,
  eventCallback?: (event: ToggleEvent) => void
): ToggleEvent | null {
  // Check authorization
  if (!isAuthorized(sourceModule, 'wormhole')) {
    console.error(`Module ${sourceModule} not authorized to activate WORMHOLE toggle`);
    return null;
  }
  
  // Create toggle event
  const event = createToggleEvent('wormhole', 'activate', sourceModule, reason, theta, variantId);
  
  // Wormhole value is enhanced at θ=0.5 for maximum variant cross-resonance
  const wormholeValue = theta >= 0.45 && theta <= 0.55 
    ? 1.2  // Enhanced connectivity near bifurcation point 
    : 1.1; // Standard connectivity elsewhere
  
  // Update toggle state
  toggles.wormhole = {
    active: true,
    value: wormholeValue,
    lastActivated: event.timestamp,
    sourceModule,
    reason,
    variantId,
    thetaAtActivation: theta
  };
  
  // Notify via callback if provided
  if (eventCallback) {
    eventCallback(event);
  }
  
  return event;
}

/**
 * Deactivate a toggle
 */
export function deactivateToggle(
  toggles: QuantumToggles,
  toggleType: ToggleType,
  sourceModule: string,
  reason: string,
  theta: number = 0,
  variantId?: string,
  eventCallback?: (event: ToggleEvent) => void
): ToggleEvent | null {
  // Check authorization
  if (!isAuthorized(sourceModule, toggleType)) {
    console.error(`Module ${sourceModule} not authorized to deactivate ${toggleType} toggle`);
    return null;
  }
  
  // Create toggle event
  const event = createToggleEvent(
    toggleType, 
    'deactivate', 
    sourceModule, 
    reason, 
    theta, 
    variantId
  );
  
  // Reset toggle to default state with history preserved
  toggles[toggleType] = {
    active: false,
    value: 1.0,
    lastActivated: toggles[toggleType].lastActivated,
    sourceModule: toggles[toggleType].sourceModule,
    reason: `Deactivated: ${reason}`,
    variantId,
    thetaAtActivation: toggles[toggleType].thetaAtActivation || 0
  };
  
  // If there was a target module (for REROUTE), preserve it
  if (toggleType === 'reroute' && 'targetModule' in toggles[toggleType]) {
    toggles[toggleType].targetModule = (toggles[toggleType] as any).targetModule;
  }
  
  // Notify via callback if provided
  if (eventCallback) {
    eventCallback(event);
  }
  
  return event;
}

/**
 * Calculate the Toggle Function (𝓣_toggles) with variant awareness
 * 
 * In the Quantum Bifurcation Engine, toggles have heightened effect near θ=0.5
 */
export function calculateToggleFunction(
  toggles: QuantumToggles,
  params: QCTFParams
): number {
  // Extract toggle values
  const toggleValues = [
    toggles.stop.active ? toggles.stop.value : 1.0,
    toggles.failsafe.active ? toggles.failsafe.value : 1.0,
    toggles.reroute.active ? toggles.reroute.value : 1.0,
    toggles.wormhole.active ? toggles.wormhole.value : 1.0
  ];
  
  // Count active toggles
  const activeToggles = Object.values(toggles).filter(t => t.active).length;
  
  // If multiple toggles are active, apply conflict resolution
  if (activeToggles > 1) {
    // Calculate bifurcation coefficient (distance from θ=0.5)
    const bifurcationFactor = Math.abs(params.theta - 0.5);
    
    // Calculate gamma for conflict resolution
    // - Near θ=0.5, lower gamma means preference for maximum toggle value (chaotic)
    // - Away from θ=0.5, higher gamma means preference for minimum toggle value (ordered)
    const gamma = 0.5 + 0.3 * bifurcationFactor;
    
    // Sort toggle values from smallest to largest
    toggleValues.sort((a, b) => a - b);
    
    // Apply weighted resolution where:
    // - gamma controls how much the minimum affects the result
    // - (1-gamma) controls how much the maximum affects the result
    const minValue = toggleValues[0];
    const maxValue = toggleValues[toggleValues.length - 1];
    const resolvedValue = gamma * minValue + (1 - gamma) * maxValue;
    
    return resolvedValue;
  } else if (activeToggles === 1) {
    // If only one toggle is active, just return its value
    return toggleValues.find(v => v !== 1.0) || 1.0;
  } else {
    // No active toggles, return neutral value
    return 1.0;
  }
}