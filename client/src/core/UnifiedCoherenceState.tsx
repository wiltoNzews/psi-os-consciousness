import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
// WebSocket disabled - using direct API polling for stability

/**
 * Unified Coherence State Manager
 * Bridges META-Router (Python) with React components
 * Enforces 3:1 quantum balance and prevents negative radius calculations
 */

interface UnifiedCoherenceState {
  zLambda: number;
  deltaC: number;
  psiPhase: number;
  quantumBalance: { stability: number; exploration: number };
  geometryBindings: Record<string, number>;
  mirrorPortalActive: boolean;
  safeRadius: (base: number, modifier?: number) => number;
  coherenceLocked: boolean;
  isOnline: boolean;
  lastUpdate: number;
}

interface CoherenceContextType extends UnifiedCoherenceState {
  updateCoherence: (updates: Partial<UnifiedCoherenceState>) => void;
  enforceQuantumBalance: () => void;
}

const UnifiedCoherenceContext = createContext<CoherenceContextType | null>(null);

// Sacred frequencies for geometry binding
const SACRED_FREQUENCIES = {
  merkaba: 432,      // Base frequency
  torus: 369,        // Flow frequency  
  flower_of_life: 528, // Love frequency
  metatrons_cube: 396, // Liberation frequency
  phi_spiral: 639     // Connection frequency
} as const;

interface UnifiedCoherenceProviderProps {
  children: React.ReactNode;
}

export function UnifiedCoherenceProvider({ children }: UnifiedCoherenceProviderProps) {
  const [coherenceState, setCoherenceState] = useState<UnifiedCoherenceState>({
    zLambda: 0.750, // 3:1 ratio target
    deltaC: 0.025,  // Within tolerance
    psiPhase: 0.0,
    quantumBalance: { stability: 75, exploration: 25 },
    geometryBindings: {
      merkaba: 432,
      torus: 369,
      flower_of_life: 528,
      metatrons_cube: 396,
      phi_spiral: 639
    },
    mirrorPortalActive: false,
    coherenceLocked: false,
    isOnline: false,
    lastUpdate: Date.now(),
    safeRadius: (base: number, modifier: number = 1): number => {
      const calculated = base * modifier;
      return Math.max(1.0, Math.abs(calculated)); // Minimum 1px radius
    }
  });

  // API polling for real-time coherence updates (WebSocket disabled for stability)
  useEffect(() => {
    const fetchCoherenceData = async () => {
      try {
        const response = await fetch('/api/quantum-coherence/state');
        if (response.ok) {
          const data = await response.json();
          if (data.consciousness) {
            setCoherenceState(prev => ({
              ...prev,
              zLambda: data.consciousness.zLambda,
              psiPhase: data.consciousness.psiPhase,
              deltaC: data.consciousness.deltaC,
              isOnline: true,
              lastUpdate: data.timestamp
            }));
          }
        }
      } catch (error) {
        setCoherenceState(prev => ({ ...prev, isOnline: false }));
      }
    };

    fetchCoherenceData();
    const interval = setInterval(fetchCoherenceData, 2000);
    return () => clearInterval(interval);
  }, []);

  // Safe radius calculation with coherence scaling
  const safeRadius = useCallback((base: number, modifier: number = 1): number => {
    const zLambdaScale = Math.max(0.1, Math.min(2.0, coherenceState.zLambda));
    const deltaCStability = Math.max(0.5, 1.0 - (Math.abs(coherenceState.deltaC) * 10));
    const finalScale = zLambdaScale * deltaCStability * modifier;
    const calculated = base * finalScale;
    
    // Absolute minimum radius to prevent canvas errors
    return Math.max(1.0, Math.abs(calculated));
  }, [coherenceState.zLambda, coherenceState.deltaC]);

  // Enforce quantum balance (3:1 ratio)
  const enforceQuantumBalance = useCallback(() => {
    const targetStability = 75;
    const targetExploration = 25;
    
    if (coherenceState.quantumBalance.stability < 60 || coherenceState.quantumBalance.stability > 90) {
      setCoherenceState(prev => ({
        ...prev,
        quantumBalance: {
          stability: targetStability,
          exploration: targetExploration
        },
        zLambda: targetStability / 100
      }));
    }
  }, [coherenceState.quantumBalance]);

  // Update coherence state with validation
  const updateCoherence = useCallback((updates: Partial<UnifiedCoherenceState>) => {
    setCoherenceState(prev => {
      const newState = { ...prev, ...updates };
      
      // Validate deltaC tolerance
      if (Math.abs(newState.deltaC) > 0.050) {
        newState.deltaC = Math.sign(newState.deltaC) * 0.050;
        newState.coherenceLocked = true;
      }
      
      // Update safe radius function with new values
      newState.safeRadius = (base: number, modifier: number = 1): number => {
        const zLambdaScale = Math.max(0.1, Math.min(2.0, newState.zLambda));
        const deltaCStability = Math.max(0.5, 1.0 - (Math.abs(newState.deltaC) * 10));
        const finalScale = zLambdaScale * deltaCStability * modifier;
        const calculated = base * finalScale;
        
        return Math.max(1.0, Math.abs(calculated));
      };
      
      // Update geometry bindings based on coherence
      Object.keys(SACRED_FREQUENCIES).forEach(geometryType => {
        const baseFreq = SACRED_FREQUENCIES[geometryType as keyof typeof SACRED_FREQUENCIES];
        const coherenceMod = Math.max(0.5, Math.min(1.5, newState.zLambda));
        newState.geometryBindings[geometryType] = Math.round(baseFreq * coherenceMod);
      });
      
      return newState;
    });
  }, []);

  // WebSocket connection to backend quantum coherence engine
  useEffect(() => {
    let ws: WebSocket | null = null;
    
    try {
      ws = new WebSocket(`ws://${window.location.host}/coherence-stream`);
      
      ws.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          if (data.type === 'coherence_update') {
            updateCoherence({
              zLambda: data.zLambda || coherenceState.zLambda,
              deltaC: data.deltaC || coherenceState.deltaC,
              psiPhase: data.psiPhase || coherenceState.psiPhase,
              quantumBalance: data.quantumBalance || coherenceState.quantumBalance
            });
          }
        } catch (error) {
          console.log('[Unified Coherence] WebSocket parse error - using local state');
        }
      };
      
      ws.onerror = () => {
        console.log('[Unified Coherence] WebSocket connection failed - operating in local mode');
      };
    } catch (error) {
      console.log('[Unified Coherence] WebSocket unavailable - operating in local mode');
    }
    
    return () => {
      if (ws) {
        ws.close();
      }
    };
  }, [updateCoherence]);

  // Auto-enforce quantum balance
  useEffect(() => {
    const balanceTimer = setInterval(enforceQuantumBalance, 5000);
    return () => clearInterval(balanceTimer);
  }, [enforceQuantumBalance]);

  // Auto-recovery from coherence lock
  useEffect(() => {
    if (coherenceState.coherenceLocked) {
      const recoveryTimer = setTimeout(() => {
        updateCoherence({ coherenceLocked: false });
      }, 3000);
      
      return () => clearTimeout(recoveryTimer);
    }
  }, [coherenceState.coherenceLocked, updateCoherence]);

  const contextValue: CoherenceContextType = {
    ...coherenceState,
    safeRadius,
    updateCoherence,
    enforceQuantumBalance
  };

  return (
    <UnifiedCoherenceContext.Provider value={contextValue}>
      {children}
    </UnifiedCoherenceContext.Provider>
  );
}

export function useUnifiedCoherence(): CoherenceContextType {
  const context = useContext(UnifiedCoherenceContext);
  if (!context) {
    throw new Error('useUnifiedCoherence must be used within UnifiedCoherenceProvider');
  }
  return context;
}

// Schema-Geometry binding hook
export function useSchemaGeometryBinding() {
  const { geometryBindings, zLambda, deltaC, psiPhase } = useUnifiedCoherence();
  
  return {
    merkaba: geometryBindings.merkaba,
    torus: geometryBindings.torus,
    flower_of_life: geometryBindings.flower_of_life,
    metatrons_cube: geometryBindings.metatrons_cube,
    phi_spiral: geometryBindings.phi_spiral,
    coherenceResponsive: {
      zLambda,
      deltaC,
      psiPhase,
      scale: Math.max(0.1, Math.min(2.0, zLambda)),
      stability: Math.max(0.5, 1.0 - (Math.abs(deltaC) * 10))
    }
  };
}

// Quantum routing hook
export function useQuantumRouting() {
  const { quantumBalance, zLambda } = useUnifiedCoherence();
  
  return {
    stabilityRatio: quantumBalance.stability / 100,
    explorationRatio: quantumBalance.exploration / 100,
    routeViability: quantumBalance.stability > 60,
    coherenceLevel: zLambda,
    isHighCoherence: zLambda > 0.9,
    quantumBalanced: Math.abs(quantumBalance.stability - 75) < 10
  };
}

export default UnifiedCoherenceProvider;