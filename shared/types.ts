/**
 * Shared Types for WiltonOS
 * [QUANTUM_STATE: FOUNDATION_FLOW]
 * 
 * This file contains shared type definitions used throughout the application,
 * particularly for the 5D Meta-Orchestration system and QCTF calculations.
 */

/**
 * Base Variant interface - represents core variant properties
 */
export interface Variant {
  id: string;                // Unique identifier
  name: string;              // Human-readable name
  qctf: number;              // Current QCTF value
  entropy: number;           // Current entropy level
  eai?: number;              // Legacy Entanglement & AI Index (for backward compatibility)
  timestamp: number;         // Creation/update timestamp
  state?: any;               // Optional state information
}

/**
 * Enhanced Loki Variant interface - extends Variant with advanced properties
 * Used by the Quantum Bifurcation Engine at θ=0.5
 */
export interface LokiVariant extends Variant {
  theta: number;             // Theta value (yin-yang balance)
  qeai: number;              // Quantum Ethical Alignment Index (replaces eai)
  plugins: string[];         // Active plugins
  weight: number;            // Meta-orchestration weight
  resonance?: number;        // Average resonance with other variants
  parentId?: string;         // ID of parent variant (if spawned)
  generation: number;        // Recursion depth (for fractal scaling)
}

/**
 * Status of a Loki Variant 
 */
export type VariantStatus = 
  | 'nascent'    // Newly generated, not yet stable
  | 'stable'     // Stable and operational
  | 'resonating' // Actively resonating with other variants
  | 'unstable'   // Becoming unstable, may collapse
  | 'collapsed'  // Collapsed, no longer active
  | 'dormant';   // Inactive but still tracked

/**
 * System state for meta-orchestration
 */
export interface SystemState {
  metrics: {
    CI: number;           // Coherence Index
    GEF: number;          // Global Entropy Factor
    EAI: number;          // Entanglement & AI Index (legacy)
    theta: number;        // Phase shift angle
    CTF: number;          // Coherence Threshold Formula result
    timeSinceLastNovelty: number; // Time (seconds) since last innovation
  };
  variants: Variant[];    // Active variants
  resonances: Map<string, number>; // Variant resonance pairs
  timestamp: number;      // Timestamp of last update
}

/**
 * Plugin interface for CTF system
 */
export interface CTFPlugin {
  name: string;
  apply(state: SystemState, orchestrator: any): void;
}

/**
 * Convert a basic Variant to a LokiVariant with reasonable defaults
 */
export function variantToLokiVariant(variant: Variant): LokiVariant {
  return {
    ...variant,
    theta: 0.5,                      // Default to bifurcation point
    qeai: variant.eai !== undefined ? variant.eai : 0.95,  // Use eai if available, otherwise default
    plugins: [],                     // No plugins by default
    weight: 1.0,                     // Default weight
    generation: 0,                   // Base generation
  };
}

/**
 * Convert a LokiVariant to a basic Variant
 */
export function lokiVariantToVariant(lokiVariant: LokiVariant): Variant {
  const { id, name, qctf, entropy, timestamp, state } = lokiVariant;
  
  return {
    id,
    name: name || `Variant-${id.substring(0, 8)}`, // Use name or generate from ID
    qctf,
    entropy,
    eai: lokiVariant.qeai,           // Map qeai to eai for compatibility
    timestamp,
    state,
  };
}