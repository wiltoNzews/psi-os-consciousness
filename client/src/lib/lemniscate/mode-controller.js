/**
 * Mode Controller - Client Implementation
 * 
 * This module provides client-side functionality for the Lemniscate Mode Controller,
 * handling API requests and state management.
 * 
 * [QUANTUM_STATE: CLIENT_MODE_CONTROLLER]
 */

import axios from 'axios';
// Import constants from brazilian-wave-protocol.js to ensure consistency
import { STABILITY_COHERENCE, EXPLORATION_COHERENCE } from './brazilian-wave-protocol.js';

import { 
  TemporalScale, 
  LemniscateMode
} from '@shared/lemniscate/mode-controller.js';

/**
 * Lemniscate API client
 */
export const lemniscateApi = {
  /**
   * Get the current controller state
   * 
   * @returns {Promise<Object>} Current state
   */
  async getState() {
    try {
      const response = await axios.get('/api/lemniscate/state');
      return response.data;
    } catch (error) {
      console.error('Failed to fetch state:', error);
      throw error;
    }
  },
  
  /**
   * Get visualization data for the dashboard
   * 
   * @returns {Promise<Object>} Visualization data
   */
  async getVisualizationData() {
    try {
      const response = await axios.get('/api/lemniscate/visualization');
      return response.data;
    } catch (error) {
      console.error('Failed to fetch visualization data:', error);
      throw error;
    }
  },
  
  /**
   * Toggle a specific temporal scale
   * 
   * @param {string} scale - The temporal scale to toggle
   * @returns {Promise<Object>} Updated state
   */
  async toggleScale(scale) {
    try {
      const response = await axios.post('/api/lemniscate/toggle-scale', { scale });
      return response.data;
    } catch (error) {
      console.error('Failed to toggle scale:', error);
      throw error;
    }
  },
  
  /**
   * Submit feedback to adjust coherence
   * 
   * @param {Object} feedback - Feedback data
   * @param {number} feedback.insightValue - Numeric value (1-5)
   * @param {string} feedback.insightType - 'creative' or 'structured'
   * @returns {Promise<Object>} Updated state
   */
  async submitFeedback(feedback) {
    try {
      const response = await axios.post('/api/lemniscate/feedback', feedback);
      return response.data;
    } catch (error) {
      console.error('Failed to submit feedback:', error);
      throw error;
    }
  },
  
  /**
   * Translate natural language goal to system parameters
   * 
   * @param {string} goalText - Natural language goal description
   * @returns {Promise<Object>} Translated goal parameters
   */
  async translateGoal(goalText) {
    try {
      const response = await axios.post('/api/lemniscate/translate-goal', { goalText });
      return response.data;
    } catch (error) {
      console.error('Failed to translate goal:', error);
      throw error;
    }
  },
  
  /**
   * Apply coherence goal
   * 
   * @param {Object} goal - Goal parameters
   * @param {string} goal.preferredState - 'stability', 'exploration', or 'balanced'
   * @param {string} goal.suggestedTimeScale - Temporal scale to adjust
   * @returns {Promise<Object>} Updated state
   */
  async applyGoal(goal) {
    try {
      const response = await axios.post('/api/lemniscate/apply-goal', goal);
      return response.data;
    } catch (error) {
      console.error('Failed to apply goal:', error);
      throw error;
    }
  },
  
  /**
   * Get historical data points for analytics
   * 
   * @param {number} limit - Maximum number of data points
   * @returns {Promise<Array>} Historical data points
   */
  async getHistory(limit = 100) {
    try {
      const response = await axios.get(`/api/lemniscate/history?limit=${limit}`);
      return response.data;
    } catch (error) {
      console.error('Failed to fetch history:', error);
      throw error;
    }
  },
  
  /**
   * Get system metrics
   * 
   * @returns {Promise<Object>} System metrics
   */
  async getMetrics() {
    try {
      const response = await axios.get('/api/lemniscate/metrics');
      return response.data;
    } catch (error) {
      console.error('Failed to fetch metrics:', error);
      throw error;
    }
  },
  
  /**
   * Get available wave modes
   * 
   * @returns {Promise<Object>} Wave modes
   */
  async getWaveModes() {
    try {
      const response = await axios.get('/api/lemniscate/wave-modes');
      return response.data;
    } catch (error) {
      console.error('Failed to fetch wave modes:', error);
      throw error;
    }
  },
  
  /**
   * Update wave protocol configuration
   * 
   * @param {Object} config - Wave configuration
   * @param {string} config.mode - Wave mode
   * @param {number} config.baseCoherence - Base coherence value
   * @param {number} config.variability - Amount of variability
   * @returns {Promise<Object>} Updated configuration
   */
  async updateWaveConfig(config) {
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
  async getWaveVisualization(points = 100, startTime = 0) {
    try {
      const response = await axios.get(`/api/lemniscate/wave-visualization?points=${points}&startTime=${startTime}`);
      return response.data;
    } catch (error) {
      console.error('Failed to fetch wave visualization:', error);
      throw error;
    }
  }
};

// Export shared constants and types 
export { TemporalScale, LemniscateMode };