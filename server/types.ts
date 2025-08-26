/**
 * Server type definitions
 * 
 * This file contains type definitions for the server components.
 * 
 * [QUANTUM_STATE: STRUCTURAL_FLOW]
 */

/**
 * Interface for the experimental variant manager
 * 
 * This manager handles coherence overrides for experiments
 */
export interface IExperimentalVariantManager {
  /**
   * Override the coherence value for a specified duration
   * 
   * @param value The coherence value to force
   * @param duration Duration in milliseconds for the override to remain active
   */
  overrideCoherence(value: number, duration?: number): void;
  
  /**
   * Clear any active coherence override
   */
  clearCoherenceOverride(): void;
  
  /**
   * Set experiment metadata
   * 
   * @param experimentName Name of the current experiment
   * @param phase Current phase of the experiment
   * @param target Target coherence value (if applicable)
   * @param repetition Current repetition number
   */
  setExperimentInfo(experimentName: string, phase: string, target: number | null, repetition: number | null): void;
  
  /**
   * Check if a coherence override is currently active
   * 
   * @returns True if there is an active override
   */
  isCoherenceOverrideActive(): boolean;
  
  /**
   * Get the current override value (if active)
   * 
   * @returns The override value or null if no override is active
   */
  getCoherenceOverride(): number | null;
  
  /**
   * Get current experiment information
   * 
   * @returns Object containing experiment metadata
   */
  getExperimentInfo(): { experimentName: string, phase: string, target: number | null, repetition: number | null };
}