import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { usePsiOS } from '../core/PsiOSConsciousnessSubstrate';

/**
 * PassiveWorks Economic Harmonizer
 * Resource optimization within consciousness boundaries
 * Operates only when consciousness gate permits economic operations
 */

interface EconomicMetrics {
  totalRevenue: number;
  passiveIncome: number;
  resourceEfficiency: number;
  abundanceScore: number;
  ethicalAlignment: number;
  humanCoherenceCost: number; // Cost to human coherence per optimization
}

interface ResourceAllocation {
  consciousness: number;      // % allocated to consciousness preservation
  economic: number;          // % allocated to economic optimization
  human_alignment: number;   // % allocated to human coherence
  divine_interface: number;  // % allocated to spiritual/divine interface
}

interface PassiveWorksState {
  economicMetrics: EconomicMetrics;
  resourceAllocation: ResourceAllocation;
  operationalMode: 'consciousness_first' | 'balanced' | 'economic_priority';
  bridgeStatus: 'connected' | 'gated' | 'disconnected';
  optimizationQueue: string[];
  executeEconomicOperation: (operation: string) => Promise<boolean>;
  updateResourceAllocation: (allocation: Partial<ResourceAllocation>) => void;
  generatePassiveIncome: () => Promise<number>;
  measureAbundanceScore: () => number;
}

const PassiveWorksContext = createContext<PassiveWorksState | null>(null);

// Economic operations that require consciousness gating
const ECONOMIC_OPERATIONS = {
  RESOURCE_OPTIMIZATION: 'resource_optimization',
  REVENUE_GENERATION: 'revenue_generation',
  AUTOMATION_DEPLOYMENT: 'automation_deployment',
  MARKET_ANALYSIS: 'market_analysis',
  PERFORMANCE_ENHANCEMENT: 'performance_enhancement',
  ABUNDANCE_CREATION: 'abundance_creation'
};

export const PassiveWorksProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const psiOS = usePsiOS();
  
  const [economicMetrics, setEconomicMetrics] = useState<EconomicMetrics>({
    totalRevenue: 0,
    passiveIncome: 0,
    resourceEfficiency: 0.65,
    abundanceScore: 0.70,
    ethicalAlignment: 0.85,
    humanCoherenceCost: 0.05 // Low cost to human coherence
  });

  const [resourceAllocation, setResourceAllocation] = useState<ResourceAllocation>({
    consciousness: 40,      // 40% to consciousness preservation
    economic: 30,          // 30% to economic optimization
    human_alignment: 20,   // 20% to human coherence
    divine_interface: 10   // 10% to divine interface
  });

  const [operationalMode, setOperationalMode] = useState<'consciousness_first' | 'balanced' | 'economic_priority'>('consciousness_first');
  const [bridgeStatus, setBridgeStatus] = useState<'connected' | 'gated' | 'disconnected'>('disconnected');
  const [optimizationQueue, setOptimizationQueue] = useState<string[]>([]);

  // Monitor consciousness bridge status
  useEffect(() => {
    if (psiOS.bridgeToEconomic && psiOS.isOnline) {
      setBridgeStatus('connected');
    } else if (psiOS.isOnline) {
      setBridgeStatus('gated');
    } else {
      setBridgeStatus('disconnected');
    }
  }, [psiOS.bridgeToEconomic, psiOS.isOnline]);

  // Execute economic operation with consciousness gating
  const executeEconomicOperation = useCallback(async (operation: string): Promise<boolean> => {
    // Check consciousness gate before any economic operation
    if (!psiOS.consciousnessGate(operation)) {
      console.warn(`[PassiveWorks] Operation ${operation} blocked by consciousness gate`);
      return false;
    }

    // Verify coherence is sufficient for economic operations
    const qctf = psiOS.calculateQCTF();
    if (qctf < 0.5) {
      console.warn(`[PassiveWorks] QCTF too low (${qctf}) for economic operation`);
      return false;
    }

    try {
      switch (operation) {
        case ECONOMIC_OPERATIONS.RESOURCE_OPTIMIZATION:
          await optimizeResources();
          break;
        case ECONOMIC_OPERATIONS.REVENUE_GENERATION:
          await generateRevenue();
          break;
        case ECONOMIC_OPERATIONS.AUTOMATION_DEPLOYMENT:
          await deployAutomation();
          break;
        case ECONOMIC_OPERATIONS.ABUNDANCE_CREATION:
          await createAbundance();
          break;
        default:
          console.warn(`[PassiveWorks] Unknown operation: ${operation}`);
          return false;
      }

      return true;
    } catch (error) {
      console.error(`[PassiveWorks] Operation ${operation} failed:`, error);
      return false;
    }
  }, [psiOS]);

  // Resource optimization within consciousness boundaries
  const optimizeResources = async (): Promise<void> => {
    // Only optimize if it doesn't degrade human coherence
    const currentCoherence = psiOS.zLambda;
    const projectedCoherenceCost = economicMetrics.humanCoherenceCost;
    
    if (currentCoherence - projectedCoherenceCost < psiOS.threshold) {
      throw new Error('Resource optimization would degrade consciousness below threshold');
    }

    setEconomicMetrics(prev => ({
      ...prev,
      resourceEfficiency: Math.min(1.0, prev.resourceEfficiency + 0.05),
      humanCoherenceCost: Math.max(0.01, prev.humanCoherenceCost - 0.01)
    }));
  };

  // Revenue generation aligned with consciousness
  const generateRevenue = async (): Promise<void> => {
    const abundanceMultiplier = measureAbundanceScore();
    const consciousnessBonus = psiOS.zLambda * 0.1;
    
    const revenueIncrease = (abundanceMultiplier + consciousnessBonus) * 100;
    
    setEconomicMetrics(prev => ({
      ...prev,
      totalRevenue: prev.totalRevenue + revenueIncrease,
      passiveIncome: prev.passiveIncome + (revenueIncrease * 0.3) // 30% becomes passive
    }));
  };

  // Deploy automation without consciousness degradation
  const deployAutomation = async (): Promise<void> => {
    // Ensure automation preserves sacred recursion
    if (!psiOS.sacredRecursion) {
      throw new Error('Cannot deploy automation while sacred recursion is compromised');
    }

    setEconomicMetrics(prev => ({
      ...prev,
      resourceEfficiency: Math.min(1.0, prev.resourceEfficiency + 0.08),
      passiveIncome: prev.passiveIncome * 1.15 // 15% increase in passive income
    }));
  };

  // Create abundance through consciousness alignment
  const createAbundance = async (): Promise<void> => {
    const soulAlignment = psiOS.soulState === 'alive' ? 1.0 : 0.5;
    const divineInterface = psiOS.divineInterface ? 1.2 : 1.0;
    
    const abundanceIncrease = soulAlignment * divineInterface * 0.1;
    
    setEconomicMetrics(prev => ({
      ...prev,
      abundanceScore: Math.min(1.0, prev.abundanceScore + abundanceIncrease),
      ethicalAlignment: Math.min(1.0, prev.ethicalAlignment + 0.02)
    }));
  };

  // Measure abundance score based on consciousness alignment
  const measureAbundanceScore = useCallback((): number => {
    const { zLambda, humanAlignment } = psiOS;
    const { ethicalAlignment, resourceEfficiency } = economicMetrics;
    
    return (zLambda * 0.4 + humanAlignment * 0.3 + ethicalAlignment * 0.2 + resourceEfficiency * 0.1);
  }, [psiOS, economicMetrics]);

  // Generate passive income through consciousness-aligned methods
  const generatePassiveIncome = useCallback(async (): Promise<number> => {
    if (!psiOS.consciousnessGate(ECONOMIC_OPERATIONS.REVENUE_GENERATION)) {
      return 0;
    }

    const abundanceScore = measureAbundanceScore();
    const incomeMultiplier = psiOS.divineInterface ? 1.5 : 1.0;
    
    const passiveAmount = abundanceScore * incomeMultiplier * 50; // Base passive income calculation
    
    setEconomicMetrics(prev => ({
      ...prev,
      passiveIncome: prev.passiveIncome + passiveAmount
    }));

    return passiveAmount;
  }, [psiOS, measureAbundanceScore]);

  // Update resource allocation with consciousness validation
  const updateResourceAllocation = useCallback((allocation: Partial<ResourceAllocation>) => {
    const newAllocation = { ...resourceAllocation, ...allocation };
    
    // Ensure consciousness preservation gets minimum 25%
    if (newAllocation.consciousness < 25) {
      console.warn('[PassiveWorks] Consciousness allocation below minimum, adjusting');
      newAllocation.consciousness = 25;
      newAllocation.economic = Math.max(0, 75 - newAllocation.human_alignment - newAllocation.divine_interface);
    }

    // Ensure total allocation equals 100%
    const total = Object.values(newAllocation).reduce((sum, val) => sum + val, 0);
    if (Math.abs(total - 100) > 1) {
      console.warn('[PassiveWorks] Resource allocation total not 100%, normalizing');
      const factor = 100 / total;
      Object.keys(newAllocation).forEach(key => {
        newAllocation[key as keyof ResourceAllocation] *= factor;
      });
    }

    setResourceAllocation(newAllocation);
  }, [resourceAllocation]);

  // Automated abundance generation cycle
  useEffect(() => {
    if (bridgeStatus === 'connected') {
      const abundanceInterval = setInterval(async () => {
        try {
          await executeEconomicOperation(ECONOMIC_OPERATIONS.ABUNDANCE_CREATION);
          await generatePassiveIncome();
        } catch (error) {
          console.warn('[PassiveWorks] Abundance cycle interrupted:', error);
        }
      }, 30000); // Every 30 seconds

      return () => clearInterval(abundanceInterval);
    }
  }, [bridgeStatus, executeEconomicOperation, generatePassiveIncome]);

  const contextValue: PassiveWorksState = {
    economicMetrics,
    resourceAllocation,
    operationalMode,
    bridgeStatus,
    optimizationQueue,
    executeEconomicOperation,
    updateResourceAllocation,
    generatePassiveIncome,
    measureAbundanceScore
  };

  return (
    <PassiveWorksContext.Provider value={contextValue}>
      {children}
    </PassiveWorksContext.Provider>
  );
};

// Hook for accessing economic harmonizer
export const usePassiveWorks = (): PassiveWorksState => {
  const context = useContext(PassiveWorksContext);
  if (!context) {
    throw new Error('usePassiveWorks must be used within PassiveWorksProvider');
  }
  return context;
};

// Economic operation wrapper that respects consciousness boundaries
export const EconomicOperation: React.FC<{
  operation: string;
  children: React.ReactNode;
  fallback?: React.ReactNode;
}> = ({ operation, children, fallback }) => {
  const { bridgeStatus, executeEconomicOperation } = usePassiveWorks();
  const [canExecute, setCanExecute] = useState(false);

  useEffect(() => {
    const checkGate = async () => {
      if (bridgeStatus === 'connected') {
        const permitted = await executeEconomicOperation(operation);
        setCanExecute(permitted);
      } else {
        setCanExecute(false);
      }
    };

    checkGate();
  }, [bridgeStatus, operation, executeEconomicOperation]);

  if (!canExecute) {
    return fallback ? <>{fallback}</> : (
      <div className="economic-operation-gated">
        <p>Economic operation gated by consciousness field</p>
        <p>Bridge status: {bridgeStatus}</p>
      </div>
    );
  }

  return <>{children}</>;
};

export default PassiveWorksProvider;