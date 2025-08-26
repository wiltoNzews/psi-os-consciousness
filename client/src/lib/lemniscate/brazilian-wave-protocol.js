/**
 * Brazilian Wave Protocol - Client Implementation
 * 
 * This module provides client-side functionality for the Brazilian Wave Protocol,
 * importing constants from the shared module.
 * 
 * [QUANTUM_STATE: CLIENT_BRAZILIAN_WAVE]
 */

import axios from 'axios';
import {
  STABILITY_COHERENCE,
  EXPLORATION_COHERENCE,
  COHERENCE_PRODUCT,
  WaveMode,
  TemporalLayer,
  WAVE_CONSTANTS,
  DefaultWaveConfig
} from '@shared/lemniscate/brazilian-wave-protocol.js';

/**
 * Brazilian Wave Protocol API client
 */
export const brazilianWaveApi = {
  /**
   * Get the current wave configuration
   * 
   * @returns {Promise<Object>} Current configuration
   */
  async getConfig() {
    try {
      const response = await axios.get('/api/lemniscate/wave-config');
      return response.data;
    } catch (error) {
      console.error('Failed to fetch wave config:', error);
      throw error;
    }
  },
  
  /**
   * Update wave configuration
   * 
   * @param {Object} config - Wave configuration
   * @param {string} config.mode - Wave mode
   * @param {number} config.baseCoherence - Base coherence value
   * @param {number} config.variability - Amount of variability
   * @returns {Promise<Object>} Updated configuration
   */
  async updateConfig(config) {
    try {
      const response = await axios.post('/api/lemniscate/wave-config', config);
      return response.data;
    } catch (error) {
      console.error('Failed to update wave config:', error);
      throw error;
    }
  },
  
  /**
   * Get wave visualization data
   * 
   * @param {number} points - Number of data points
   * @param {number} startTime - Starting time value
   * @returns {Promise<Array>} Visualization data points
   */
  async getVisualizationData(points = 100, startTime = 0) {
    try {
      const response = await axios.get(`/api/lemniscate/wave-visualization?points=${points}&startTime=${startTime}`);
      return response.data;
    } catch (error) {
      console.error('Failed to fetch wave visualization:', error);
      throw error;
    }
  },
  
  /**
   * Get historical wave data
   * 
   * @param {number} limit - Maximum number of data points
   * @returns {Promise<Array>} Historical data points
   */
  async getHistory(limit = 100) {
    try {
      const response = await axios.get(`/api/lemniscate/wave-history?limit=${limit}`);
      return response.data;
    } catch (error) {
      console.error('Failed to fetch wave history:', error);
      throw error;
    }
  },
  
  /**
   * Verify the 3:1 ↔ 1:3 ratio for a coherence value
   * 
   * @param {number} coherence - Coherence value to check
   * @returns {Promise<Object>} Verification results
   */
  async verifyCoherenceRatio(coherence) {
    try {
      const response = await axios.post('/api/lemniscate/verify-coherence', { coherence });
      return response.data;
    } catch (error) {
      console.error('Failed to verify coherence ratio:', error);
      throw error;
    }
  }
};

/**
 * Generate wave data points for client-side visualization
 * 
 * @param {number} points - Number of data points
 * @param {number} startTime - Starting time value
 * @param {Object} config - Wave configuration
 * @returns {Array} Wave data points
 */
export function generatePreviewWaveData(points = 30, startTime = 0, config = DefaultWaveConfig) {
  const data = [];
  const timeStep = 0.5;
  
  for (let i = 0; i < points; i++) {
    const t = startTime + (i * timeStep);
    const values = calculateLayerValues(t, config);
    
    // Calculate coherence ratio and product
    const inverseValue = 1 - values.combined;
    const coherenceRatio = values.combined / inverseValue;
    const coherenceProduct = values.combined * (1 / inverseValue);
    
    data.push({
      timestamp: new Date(),
      time: t,
      ...values,
      coherenceRatio,
      coherenceProduct
    });
  }
  
  return data;
}

/**
 * Calculate layer values for visualization
 * 
 * @param {number} t - Time value
 * @param {Object} config - Wave configuration
 * @returns {Object} Layer values
 */
function calculateLayerValues(t, config) {
  const micro = calculateLayerValue(t, TemporalLayer.MICRO, config);
  const meso = calculateLayerValue(t, TemporalLayer.MESO, config);
  const macro = calculateLayerValue(t, TemporalLayer.MACRO, config);
  
  // Combined value using weighted ratio (emphasizing meso scale)
  const combined = (micro * 0.3) + (meso * 0.5) + (macro * 0.2);
  
  return { micro, meso, macro, combined };
}

/**
 * Calculate a single layer value
 * 
 * @param {number} t - Time value
 * @param {string} layer - Temporal layer
 * @param {Object} config - Wave configuration
 * @returns {number} Layer value
 */
function calculateLayerValue(t, layer, config) {
  const multiplier = WAVE_CONSTANTS.LAYER_MULTIPLIERS[layer];
  const baseFrequency = 0.5 * multiplier;
  const phaseShift = WAVE_CONSTANTS.LAYER_PHASE_SHIFTS[layer];
  
  // Start with exact baseCoherence
  let value = config.baseCoherence;
  
  if (config.mode === WaveMode.QUANTUM) {
    // Implement precise oscillation between stability and exploration
    const cyclePeriod = WAVE_CONSTANTS.CYCLE_PERIOD / multiplier;
    const normalizedT = (t + phaseShift) % cyclePeriod;
    const cyclePosition = normalizedT / cyclePeriod;
    
    // Calculate exact coherence values using modified sine wave
    const oscillation = Math.sin(2 * Math.PI * cyclePosition);
    const oscillationRange = (STABILITY_COHERENCE - EXPLORATION_COHERENCE) / 2;
    const midPoint = (STABILITY_COHERENCE + EXPLORATION_COHERENCE) / 2;
    
    return midPoint + oscillation * oscillationRange;
  }
  
  // Apply base oscillation
  value += Math.sin(t * baseFrequency + phaseShift) * (config.variability * 0.5);
  
  // Add mode-specific variations
  if (config.mode === WaveMode.HARMONIC) {
    // Harmonic adds secondary oscillation
    value += Math.sin(t * baseFrequency * 1.5) * (config.variability * 0.3);
  } else if (config.mode === WaveMode.CHAOTIC) {
    // Chaotic adds multiple conflicting oscillations
    value += Math.sin(t * baseFrequency * 2.7) * (config.variability * 0.3);
    value += Math.sin(t * baseFrequency * 0.9) * (config.variability * 0.2);
  } else if (config.mode === WaveMode.RESONANT) {
    // Resonant adds golden ratio-based oscillation
    value += Math.sin(t * baseFrequency * WAVE_CONSTANTS.PHI) * (config.variability * 0.4);
  }
  
  // Ensure value stays within 0-1 range
  return Math.max(0, Math.min(1, value));
}

// Export constants and functions
export {
  STABILITY_COHERENCE,
  EXPLORATION_COHERENCE,
  COHERENCE_PRODUCT,
  WaveMode,
  TemporalLayer,
  WAVE_CONSTANTS,
  DefaultWaveConfig
};