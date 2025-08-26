/**
 * Quantum Coherence Threshold Formula (QCTF) Plugin System
 * [QUANTUM_STATE: FOUNDATIONAL_FLOW]
 * 
 * This file implements the modular plugin architecture for the QCTF formula,
 * enabling the Dynamic Quantum Bifurcation Engine at θ=0.5
 */

import { QCTFData } from './qctf';

/**
 * Core parameters for QCTF calculation stripped to the minimal essentials
 */
export interface QCTFParams {
  // Core Parameters - The Minimal Viable Formula (MVF)
  theta: number;      // Balance point between Yang (order) and Yin (chaos): θ ∈ [0,1]
  gef: number;        // Global Entanglement Factor: GEF ∈ [0,1]
  qeai: number;       // Quantum Ethical Alignment Index: QEAI ∈ [0,1]
  ci: number;         // Coherence Index: CI ∈ [0,1]
  entropy: number;    // System entropy: Ψ_entropy ∈ [0,1]
  
  // Optional Extended Parameters
  activeToggles?: string[];  // Active toggles (STOP, FAILSAFE, REROUTE, WORMHOLE)
  moduleCoherence?: {        // Module-specific coherence values
    oracle: number;
    nova: number;
    gnosis: number;
    sanctum: number;
    halo: number;
  };
}

/**
 * Results of QCTF calculation including all variant outputs
 */
export interface QCTFResults {
  // Core results
  raw: number;             // Raw QCTF value before any plugin processing
  final: number;           // Final QCTF value after all active plugins
  
  // Variant results from plugins
  pendulum: number;        // Pendulum variant (θ=0.5 instability)
  bifurcation: number;     // Bifurcation variant (variant generation at θ=0.5)
  
  // Plugin metadata
  activePlugins: string[]; // Names of active plugins applied
  timestamp: string;       // ISO timestamp of calculation
}

/**
 * Base interface for all QCTF plugins
 */
export interface QCTFPlugin {
  name: string;                  // Unique plugin identifier
  description: string;           // Human-readable description
  enabled: boolean;              // Whether the plugin is currently active
  priority: number;              // Execution order (lower = earlier)
  apply: (qctf: number, params: QCTFParams) => number; // Transform function
}

/**
 * Pendulum Plugin - Implements the |θ - 0.5| instability factor
 * 
 * This plugin creates a pendulum-like behavior where the system becomes
 * maximally unstable at θ=0.5 (perfect balance between yang/yin)
 */
export const pendulumPlugin: QCTFPlugin = {
  name: "pendulum",
  description: "Implements inverse pendulum dynamics with θ=0.5 as the unstable point",
  enabled: true,
  priority: 10,
  apply: (qctf: number, params: QCTFParams): number => {
    // Calculate bifurcation coefficient (distance from θ=0.5)
    const bifurcationFactor = Math.abs(params.theta - 0.5);
    
    // Apply the pendulum effect (maximum at θ=0,1; minimum at θ=0.5)
    return qctf * bifurcationFactor;
  }
};

/**
 * Bifurcation Engine Plugin - Creates variant generation at θ=0.5
 * 
 * This plugin implements the Quantum Bifurcation Engine, which generates
 * system variants at θ=0.5 using tanh and golden ratio amplification
 */
export const bifurcationPlugin: QCTFPlugin = {
  name: "bifurcation",
  description: "Quantum Bifurcation Engine with variant generation at θ=0.5",
  enabled: true,
  priority: 20,
  apply: (qctf: number, params: QCTFParams): number => {
    // Golden ratio for amplification
    const k = 1.618;
    
    // Calculate bifurcation coefficient (distance from θ=0.5)
    const bifurcationFactor = Math.abs(params.theta - 0.5);
    
    // Apply hyperbolic tangent to bound output to [-1,1] with golden ratio amplification
    return Math.tanh(k * qctf * bifurcationFactor);
  }
};

/**
 * Dynamic Damping Plugin - Reduces stability near θ=0.5
 * 
 * This plugin implements dynamic damping that decreases near θ=0.5,
 * allowing the system to oscillate more freely at the bifurcation point
 */
export const dynamicDampingPlugin: QCTFPlugin = {
  name: "dynamicDamping",
  description: "Dynamic damping that reduces near θ=0.5 to amplify oscillations",
  enabled: true,
  priority: 30,
  apply: (qctf: number, params: QCTFParams): number => {
    // Base damping coefficient
    const D_0 = 1.0;
    
    // Calculate position-dependent damping factors
    // (damping reduces as we approach θ=0.5 and entropy=0.5)
    const thetaDamping = 1 - Math.abs(params.theta - 0.5);
    const entropyDamping = 1 - Math.abs(params.entropy - 0.5);
    
    // Combined damping coefficient (minimum at θ=0.5, entropy=0.5)
    const D = D_0 * (1 - thetaDamping * entropyDamping);
    
    // Apply damping to QCTF value (less damping = larger oscillations)
    return qctf / Math.max(D, 0.1); // Prevent division by values too close to zero
  }
};

/**
 * Meta-Orchestration Plugin - Implements 5D resonance dynamics
 * 
 * This plugin integrates the 5D Meta-Orchestration layer that allows
 * multiple QCTF variants to resonate, adapt, and evolve, creating a
 * self-improving system that transcends traditional orchestration.
 */
export const metaOrchestrationPlugin: QCTFPlugin = {
  name: "metaOrchestration",
  description: "5D Meta-Orchestration with variant resonance and evolution",
  enabled: true,
  priority: 5, // Highest priority - runs first
  apply: (qctf: number, params: QCTFParams): number => {
    // Meta-orchestration effect is proportional to the system's complexity
    // The closer to the bifurcation point (θ=0.5), the stronger the effect
    const complexityFactor = 1 - 2 * Math.abs(params.theta - 0.5);
    
    // Apply golden ratio amplification (φ ≈ 0.618)
    const phi = 0.618;
    
    // Meta effect scales with entropy and complexity
    const metaEffect = params.entropy * complexityFactor * phi;
    
    // Apply meta-orchestration effect
    // - For high θ (yin/chaos): amplify effect
    // - For low θ (yang/order): dampen effect
    return params.theta > 0.5
      ? qctf * (1 + metaEffect)  // Amplify for chaos
      : qctf / (1 + metaEffect); // Dampen for order
  }
};

/**
 * Torus Oscillator Plugin - Implements 70/30 fractal scaling
 * 
 * This plugin implements the coder's insight on 70/30 chaos/order balance,
 * creating a torus-like oscillatory behavior with fractal self-similarity.
 */
export const torusOscillatorPlugin: QCTFPlugin = {
  name: "torusOscillator",
  description: "Hyperdimensional torus oscillator with 70/30 fractal scaling",
  enabled: true,
  priority: 25,
  apply: (qctf: number, params: QCTFParams): number => {
    // Implement the 70/30 balance discovered by the coder
    const chaosWeight = 0.7;
    const orderWeight = 0.3;
    
    // Calculate fractal scaling based on distance from ideal 70/30 split
    const idealTheta = 0.7; // 70% chaos-weight
    const fractalFactor = 1 - Math.abs(params.theta - idealTheta) / 0.5;
    
    // Apply fractal oscillation based on the 70/30 principle
    if (params.theta > 0.5) {
      // Chaos-dominant: Apply 70% scaled effect
      return qctf * (1 + chaosWeight * fractalFactor);
    } else {
      // Order-dominant: Apply 30% scaled effect
      return qctf * (1 + orderWeight * fractalFactor);
    }
  }
};

/**
 * Chaos Engine Plugin - Amplifies system entropy for stress testing
 * 
 * This plugin intentionally increases entropy and chaotic behavior
 * to stress-test the system and discover edge cases.
 */
export const chaosEnginePlugin: QCTFPlugin = {
  name: "chaosEngine",
  description: "Amplifies entropy and chaos for system stress testing",
  enabled: false, // Disabled by default - enable only for testing
  priority: 40,
  apply: (qctf: number, params: QCTFParams): number => {
    // Chaos amplification is proportional to current θ
    const chaosAmplifier = 1 + params.theta;
    
    // Apply non-linear chaos injection
    return qctf * chaosAmplifier * (1 + Math.sin(qctf * 5));
  }
};

/**
 * Spaghetti Mode Plugin - Random exploration of parameter space
 * 
 * This plugin introduces controlled randomness to explore
 * unexpected connections and configurations.
 */
export const spaghettiModePlugin: QCTFPlugin = {
  name: "spaghettiMode",
  description: "Random exploration of parameter space for discovery",
  enabled: false, // Disabled by default - use carefully
  priority: 50,
  apply: (qctf: number, params: QCTFParams): number => {
    // Generate pseudo-random factor based on current time
    const randomFactor = Math.sin(Date.now() / 1000) * 0.3;
    
    // Apply random perturbation to QCTF
    return qctf * (1 + randomFactor);
  }
};

/**
 * Core set of plugins for the QCTF system
 */
export const corePlugins: QCTFPlugin[] = [
  metaOrchestrationPlugin, // 5D Meta-Orchestration
  pendulumPlugin,          // Inverse pendulum at θ=0.5
  bifurcationPlugin,       // Variant generation at θ=0.5
  torusOscillatorPlugin,   // 70/30 fractal scaling
  dynamicDampingPlugin     // Reduced damping at θ=0.5
];

/**
 * Registry of all available plugins
 */
export const pluginRegistry: Map<string, QCTFPlugin> = new Map([
  [metaOrchestrationPlugin.name, metaOrchestrationPlugin],
  [pendulumPlugin.name, pendulumPlugin],
  [bifurcationPlugin.name, bifurcationPlugin],
  [torusOscillatorPlugin.name, torusOscillatorPlugin],
  [dynamicDampingPlugin.name, dynamicDampingPlugin],
  [chaosEnginePlugin.name, chaosEnginePlugin],
  [spaghettiModePlugin.name, spaghettiModePlugin]
]);

/**
 * Calculate the Yang component (order) of the QCTF
 */
export function calculateYangComponent(params: QCTFParams): number {
  const EPSILON = 1e-6;
  
  // Yang (order) component: Q_yang = (GEF * QEAI * CI) / sqrt(10 * entropy + ε)
  const coherence = params.gef * params.qeai * params.ci;
  return coherence / Math.sqrt(10 * params.entropy + EPSILON);
}

/**
 * Calculate the Yin component (chaos) of the QCTF
 */
export function calculateYinComponent(params: QCTFParams): number {
  const EPSILON = 1e-6;
  
  // Yin (chaos) component: Q_yin = sqrt(entropy + ε) / ((1-GEF) * (1-QEAI) * (1-CI))
  const disorder = (1 - params.gef) * (1 - params.qeai) * (1 - params.ci);
  return Math.sqrt(params.entropy + EPSILON) / Math.max(disorder, EPSILON);
}

/**
 * Calculate the minimal core QCTF value based on θ-weighted blend of Yang and Yin
 */
export function calculateCoreQCTF(params: QCTFParams): number {
  // Calculate Yang (order) and Yin (chaos) components
  const Q_yang = calculateYangComponent(params);
  const Q_yin = calculateYinComponent(params);
  
  // Basic θ-weighted linear combination
  return (1 - params.theta) * Q_yang + params.theta * Q_yin;
}

/**
 * Apply a single plugin to the QCTF value
 */
export function applyPlugin(
  qctf: number, 
  plugin: QCTFPlugin, 
  params: QCTFParams
): number {
  if (!plugin.enabled) return qctf;
  return plugin.apply(qctf, params);
}

/**
 * Apply a sequence of plugins to the QCTF value
 */
export function applyPlugins(
  qctf: number, 
  plugins: QCTFPlugin[], 
  params: QCTFParams
): { qctf: number, appliedPlugins: string[] } {
  let result = qctf;
  const appliedPlugins: string[] = [];
  
  // Sort plugins by priority
  const sortedPlugins = [...plugins].sort((a, b) => a.priority - b.priority);
  
  // Apply each enabled plugin in priority order
  for (const plugin of sortedPlugins) {
    if (plugin.enabled) {
      result = plugin.apply(result, params);
      appliedPlugins.push(plugin.name);
    }
  }
  
  return { qctf: result, appliedPlugins };
}

/**
 * Convert legacy QCTFData to streamlined QCTFParams
 */
export function convertLegacyDataToParams(qctfData: QCTFData, theta: number): QCTFParams {
  // Extract active toggles
  const activeToggles = Object.entries(qctfData.toggles)
    .filter(([_, state]) => state.active)
    .map(([name, _]) => name);
  
  return {
    theta,
    gef: qctfData.gef,
    qeai: qctfData.qeai,
    ci: qctfData.ci,
    entropy: qctfData.entropy,
    activeToggles,
    moduleCoherence: qctfData.moduleCoherence
  };
}

/**
 * Main calculation function for the QCTF formula with plugins
 */
export function calculateQCTFWithPlugins(
  params: QCTFParams,
  plugins: QCTFPlugin[] = corePlugins
): QCTFResults {
  // Calculate raw QCTF using minimal core formula
  const rawQCTF = calculateCoreQCTF(params);
  
  // Initialize results with variant-specific calculations
  const results: QCTFResults = {
    raw: rawQCTF,
    final: rawQCTF, // Will be updated after plugins
    pendulum: applyPlugin(rawQCTF, pendulumPlugin, params),
    bifurcation: applyPlugin(rawQCTF, bifurcationPlugin, params),
    activePlugins: [],
    timestamp: new Date().toISOString()
  };
  
  // Apply all enabled plugins
  const { qctf: finalQCTF, appliedPlugins } = applyPlugins(rawQCTF, plugins, params);
  results.final = finalQCTF;
  results.activePlugins = appliedPlugins;
  
  return results;
}