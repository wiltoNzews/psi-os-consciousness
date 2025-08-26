import React, { createContext, useContext, useState, ReactNode } from 'react';

// Domain type definition
export type DomainType = 'finance' | 'crypto' | 'sports' | 'general';

// Domain configuration interface
export interface DomainConfig {
  id: DomainType;
  name: string;
  color: string;
  accentColor: string;
  gradientFrom: string;
  gradientTo: string;
  icon: string;
  description: string;
}

// Domain configurations
export const domainConfigs: Record<DomainType, DomainConfig> = {
  finance: {
    id: 'finance',
    name: 'Finance',
    color: 'green',
    accentColor: 'rgba(34, 197, 94, 0.9)', // Vibrant green
    gradientFrom: 'rgba(5, 150, 105, 0.2)',
    gradientTo: 'rgba(4, 120, 87, 0.05)',
    icon: 'chart-line',
    description: 'Financial intelligence network for market prediction and strategic investment'
  },
  crypto: {
    id: 'crypto',
    name: 'Crypto',
    color: 'orange',
    accentColor: 'rgba(249, 115, 22, 0.9)', // Vibrant orange
    gradientFrom: 'rgba(234, 88, 12, 0.2)',
    gradientTo: 'rgba(194, 65, 12, 0.05)',
    icon: 'currency-bitcoin',
    description: 'Blockchain intelligence system for crypto pattern detection and trading signals'
  },
  sports: {
    id: 'sports',
    name: 'Sports',
    color: 'blue',
    accentColor: 'rgba(59, 130, 246, 0.9)', // Vibrant blue
    gradientFrom: 'rgba(37, 99, 235, 0.2)',
    gradientTo: 'rgba(29, 78, 216, 0.05)',
    icon: 'activity',
    description: 'Sports analytics network for performance prediction and competitive analysis'
  },
  general: {
    id: 'general',
    name: 'General AI',
    color: 'purple',
    accentColor: 'rgba(139, 92, 246, 0.9)', // Vibrant purple
    gradientFrom: 'rgba(124, 58, 237, 0.2)',
    gradientTo: 'rgba(109, 40, 217, 0.05)',
    icon: 'brain',
    description: 'Multi-domain symbiosis network for cross-functional intelligence augmentation'
  }
};

// Context interface
interface DomainContextProps {
  activeDomain: DomainType;
  setActiveDomain: (domain: DomainType) => void;
  domainConfig: DomainConfig;
}

// Create the context
const DomainContext = createContext<DomainContextProps | undefined>(undefined);

// Provider props interface
interface DomainProviderProps {
  children: ReactNode;
  initialDomain?: DomainType;
}

// Provider component
export function DomainProvider({ 
  children, 
  initialDomain = 'finance' 
}: DomainProviderProps) {
  const [activeDomain, setActiveDomain] = useState<DomainType>(initialDomain);
  
  // Get current domain configuration
  const domainConfig = domainConfigs[activeDomain];
  
  const value = {
    activeDomain,
    setActiveDomain,
    domainConfig
  };
  
  return (
    <DomainContext.Provider value={value}>
      {children}
    </DomainContext.Provider>
  );
}

// Custom hook to use the domain context
export function useDomain(): DomainContextProps {
  const context = useContext(DomainContext);
  
  if (context === undefined) {
    throw new Error('useDomain must be used within a DomainProvider');
  }
  
  return context;
}