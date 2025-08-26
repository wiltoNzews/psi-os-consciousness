/**
 * Server Information Utility
 * 
 * This utility fetches server information (port, paths, etc.) from the server
 * and makes it available for client-side use, particularly for WebSocket connections.
 * 
 * [QUANTUM_STATE: SIM_FLOW]
 */

interface ServerInfo {
  port: number;
  host: string;
  websocketPath: string;
  env: string;
}

/**
 * Fetches server information from the API
 */
export const fetchServerInfo = async (): Promise<ServerInfo> => {
  try {
    // Make sure fetch is called only on client side
    if (typeof window === 'undefined') {
      return {
        port: 5000, // Default port for Replit
        host: 'localhost:5000',
        websocketPath: '/ws',
        env: 'development'
      };
    }

    // Create a more reliable fetch with timeout
    const fetchWithTimeout = async (url: string, timeoutMs = 3000) => {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), timeoutMs);
      
      try {
        const response = await fetch(url, { signal: controller.signal });
        clearTimeout(timeoutId);
        return response;
      } catch (error) {
        clearTimeout(timeoutId);
        throw error;
      }
    };

    const response = await fetchWithTimeout('/api/server-info');
    
    // Additional response type check to handle HTML responses
    const contentType = response.headers.get('content-type');
    if (!response.ok || !contentType || !contentType.includes('application/json')) {
      console.warn(`Server info response is not JSON: ${contentType}`);
      throw new Error(`Failed to fetch server info: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    
    // Validate the data contains what we need
    if (data && data.host) {
      // Store server info in window for easy access from WebSocketContext
      (window as any).SERVER_PORT = data.port;
      (window as any).SERVER_HOST = data.host;
      (window as any).WEBSOCKET_PATH = data.websocketPath || '/ws';
      
      console.log('Server info fetched successfully:', data);
      return data;
    } else {
      console.warn("Invalid server info data:", data);
      throw new Error("Invalid server info response format");
    }
  } catch (error) {
    console.error('Error fetching server info:', error);
    
    // Return defaults that should work with Replit - IMPORTANT: DO NOT USE PORT HERE
    // For Replit, we should use window.location.host instead of a port number
    const defaultInfo = {
      port: 0, // We won't use this port; we'll use window.location.host
      host: window.location.host,
      websocketPath: '/ws',
      env: 'development'
    };
    
    // In Replit, we explicitly set these to ensure consistency
    (window as any).SERVER_PORT = 0; // We'll use the host directly instead of a specific port
    (window as any).WEBSOCKET_PATH = defaultInfo.websocketPath;
    (window as any).USE_HOST_DIRECTLY = true; // Signal to WebSocketContext to use host directly
    
    // Store useful debugging information
    (window as any).SERVER_INFO_DEBUG = {
      defaultsUsed: true,
      location: window.location,
      timeStamp: new Date().toISOString(),
      error: error?.toString() || "Unknown error"
    };
    
    console.log('Using default server info for Replit environment (using host directly)');
    return defaultInfo;
  }
};