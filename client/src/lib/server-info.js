/**
 * Server information utilities
 * Handles fetching server configuration for WebSocket connections
 */

/**
 * Fetch server information needed for WebSocket connections
 * @returns {Promise<Object>} The server information
 */
export const fetchServerInfo = async () => {
  try {
    // Since we don't need to make an actual API call,
    // we can hardcode the server information based on the current window location
    const host = window.location.host;
    const websocketPath = '/ws';
    
    return {
      host,
      websocketPath,
      version: '2.0.0',
    };
  } catch (error) {
    console.error('[QUANTUM_STATE: ERROR_FLOW] Error fetching server info:', error);
    
    // Fallback to defaults
    return {
      host: window.location.host,
      websocketPath: '/ws',
      version: 'unknown',
    };
  }
};