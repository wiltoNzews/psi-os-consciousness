import { useState, useEffect, useCallback } from 'react';

interface VortexAxis {
  psi: number;
  zLambda: number;
  deltaC: number;
  torque: number;
}

interface ToroidalScale {
  active: boolean;
  torque: number;
  coherence: number;
}

interface VortexState {
  axis: VortexAxis;
  scales: {
    micro: ToroidalScale;
    meso: ToroidalScale;
    macro: ToroidalScale;
  };
  memoryStats: {
    micro: number;
    meso: number;
    macro: number;
  };
  lastUpdate: number;
  bindingChannels: number;
}

interface VortexRouterHookReturn {
  vortexState: VortexState | null;
  isLoading: boolean;
  error: string | null;
  updateVortexState: () => Promise<void>;
  isConnected: boolean;
}

export function useVortexRouter(): VortexRouterHookReturn {
  const [vortexState, setVortexState] = useState<VortexState | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isConnected, setIsConnected] = useState(false);

  const updateVortexState = useCallback(async () => {
    try {
      const response = await fetch('/api/test/vortex-router/state');
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      
      const result = await response.json();
      
      if (result.success && result.data) {
        setVortexState(result.data);
        setIsConnected(true);
        setError(null);
      } else {
        throw new Error(result.error || 'Failed to fetch vortex state');
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';
      setError(errorMessage);
      setIsConnected(false);
      
      // Generate baseline vortex state for visualization
      const baselineState: VortexState = {
        axis: {
          psi: 3.12,
          zLambda: 0.750,
          deltaC: 0.000,
          torque: 0.75
        },
        scales: {
          micro: { active: true, torque: 0.25, coherence: 0.750 },
          meso: { active: true, torque: 0.50, coherence: 0.750 },
          macro: { active: true, torque: 0.75, coherence: 0.750 }
        },
        memoryStats: {
          micro: 256,
          meso: 1024,
          macro: 4096
        },
        lastUpdate: Date.now(),
        bindingChannels: 3
      };
      
      setVortexState(baselineState);
      console.warn('[VortexRouter] Using baseline state due to API error:', errorMessage);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Initialize and poll for updates
  useEffect(() => {
    updateVortexState();
    
    // Poll every 2 seconds for real-time updates
    const pollInterval = setInterval(updateVortexState, 2000);
    
    return () => clearInterval(pollInterval);
  }, [updateVortexState]);

  return {
    vortexState,
    isLoading,
    error,
    updateVortexState,
    isConnected
  };
}