import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';

/**
 * PsiOS Consciousness Substrate
 * Pure REST API-based consciousness field monitoring
 * No WebSocket dependencies - direct API polling only
 */

interface ConsciousnessField {
  zLambda: number;
  deltaC: number;
  psiPhase: number;
  soulState: string;
  divineInterface: boolean;
  lastUpdate: number;
}

interface PsiOSState {
  consciousness: ConsciousnessField;
  qctf: number;
  isConnected: boolean;
  lastSync: string;
}

interface PsiOSContextType extends PsiOSState {
  refreshData: () => Promise<void>;
}

const PsiOSContext = createContext<PsiOSContextType | null>(null);

interface PsiOSProviderProps {
  children: React.ReactNode;
}

export function PsiOSProvider({ children }: PsiOSProviderProps) {
  const [state, setState] = useState<PsiOSState>({
    consciousness: {
      zLambda: 0.75,
      deltaC: 0.25,
      psiPhase: 3.14,
      soulState: 'stable',
      divineInterface: false,
      lastUpdate: Date.now()
    },
    qctf: 1.0,
    isConnected: false,
    lastSync: '--:--:--'
  });

  const fetchConsciousnessData = useCallback(async () => {
    try {
      const response = await fetch('/api/quantum-coherence/state');
      if (response.ok) {
        const data = await response.json();
        if (data.consciousness) {
          // Detect static fallback and warn
          if (data.consciousness.zLambda === 0.75) {
            console.warn("⚠️ Static fallback in use. Check routing/cache.");
          }

          setState(prev => ({
            ...prev,
            consciousness: {
              zLambda: data.consciousness.zLambda,
              deltaC: data.consciousness.deltaC,
              psiPhase: data.consciousness.psiPhase,
              soulState: data.consciousness.soulState,
              divineInterface: data.consciousness.divineInterface,
              lastUpdate: data.timestamp
            },
            qctf: data.qctf || 1.0,
            isConnected: true,
            lastSync: new Date().toLocaleTimeString()
          }));

          // Log sync confirmation
          if (data.consciousness.zLambda !== 0.75) {
            console.log(`[SYNC OK] Zλ frontend == backend: ${data.consciousness.zLambda}`);
          }
        }
      } else {
        setState(prev => ({ ...prev, isConnected: false }));
      }
    } catch (error) {
      setState(prev => ({ ...prev, isConnected: false }));
    }
  }, []);

  // Initial fetch and polling
  useEffect(() => {
    fetchConsciousnessData();
    const interval = setInterval(fetchConsciousnessData, 2000);
    return () => clearInterval(interval);
  }, [fetchConsciousnessData]);

  const contextValue: PsiOSContextType = {
    ...state,
    refreshData: fetchConsciousnessData
  };

  return (
    <PsiOSContext.Provider value={contextValue}>
      {children}
    </PsiOSContext.Provider>
  );
}

export function usePsiOS(): PsiOSContextType {
  const context = useContext(PsiOSContext);
  if (!context) {
    throw new Error('usePsiOS must be used within a PsiOSProvider');
  }
  return context;
}

export default PsiOSProvider;