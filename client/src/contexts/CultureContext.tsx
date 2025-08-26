import React, { createContext, ReactNode, useContext, useState } from 'react';
import { DomainType } from './DomainContext';

// Culture influence types
export type CultureInfluenceType = 'trend' | 'position' | 'viral' | 'dictate';

export interface CultureNodeData {
  id: string;
  label: string;
  type: 'trend' | 'brand' | 'audience' | 'influence';
  strength: number; // 0-1 influence strength
  growth: number; // growth rate -1 to 1
  audience: number; // audience size (millions)
  phase: 'emerging' | 'growing' | 'peaking' | 'declining';
  virality: number; // 0-100
  resonance: number; // 0-100
  sentiment: number; // -100 to 100
}

export interface CultureEdgeData {
  source: string;
  target: string;
  strength: number;
  bidirectional: boolean;
  type: 'shapes' | 'influences' | 'amplifies' | 'counters' | 'dictates';
}

export interface CultureInsight {
  id: string;
  title: string;
  description: string;
  confidence: number;
  impact: number;
  timeHorizon: string;
  actionability: number;
  relatedBrands: string[];
  relatedTrends: string[];
  recommended: boolean;
}

export interface BrandReference {
  id: string;
  name: string;
  category: string;
  culturalRelevance: number;
  aiUtilization: number;
  innovationScore: number;
  keyInsight: string;
  keyTactic: string;
}

export interface CultureContextType {
  activeInfluenceMode: CultureInfluenceType;
  setActiveInfluenceMode: (mode: CultureInfluenceType) => void;
  selectedNode: string | null;
  setSelectedNode: (nodeId: string | null) => void;
  cultureInsights: CultureInsight[];
  brandReferences: BrandReference[];
  getCultureNodesForDomain: (domain: DomainType) => CultureNodeData[];
  getCultureEdgesForDomain: (domain: DomainType) => CultureEdgeData[];
  getReferenceBrandsForDomain: (domain: DomainType) => BrandReference[];
  getInsightsForDomain: (domain: DomainType) => CultureInsight[];
}

export const CultureContext = createContext<CultureContextType | null>(null);

export function CultureProvider({ children }: { children: ReactNode }) {
  const [activeInfluenceMode, setActiveInfluenceMode] = useState<CultureInfluenceType>('trend');
  const [selectedNode, setSelectedNode] = useState<string | null>(null);
  
  // Brand references data
  const brandReferences: BrandReference[] = [
    {
      id: 'duolingo',
      name: 'Duolingo',
      category: 'Education',
      culturalRelevance: 89,
      aiUtilization: 92,
      innovationScore: 87,
      keyInsight: 'Gamification of language learning with AI-personalized difficulty curves',
      keyTactic: 'Weaponized mascot as cultural icon with algorithm-driven social media presence'
    },
    {
      id: 'morningbrew',
      name: 'Morning Brew',
      category: 'Media',
      culturalRelevance: 78,
      aiUtilization: 82,
      innovationScore: 74,
      keyInsight: 'AI-optimized content that creates industry language and frameworks',
      keyTactic: 'Format innovation that shapes how business news is consumed and discussed'
    },
    {
      id: 'oatly',
      name: 'Oatly',
      category: 'Food & Beverage',
      culturalRelevance: 85,
      aiUtilization: 68,
      innovationScore: 81,
      keyInsight: 'Created new consumer language around alternative milk',
      keyTactic: 'Counterculture positioning through AI-optimized messaging'
    },
    {
      id: 'hennessy',
      name: 'Hennessy',
      category: 'Spirits',
      culturalRelevance: 92,
      aiUtilization: 71,
      innovationScore: 76,
      keyInsight: 'Cultural elevation through algorithmically-identified partnerships',
      keyTactic: 'AI-driven cultural insertion points in music, art, and entertainment'
    },
    {
      id: 'liquiddeath',
      name: 'Liquid Death',
      category: 'Beverage',
      culturalRelevance: 88,
      aiUtilization: 79,
      innovationScore: 90,
      keyInsight: 'Brand identity engineered for algorithm-driven social sharing',
      keyTactic: 'Shock value marketing optimized by AI for maximum virality'
    }
  ];
  
  // Cultural insights
  const cultureInsights: CultureInsight[] = [
    {
      id: 'insight_1',
      title: 'AI-Generated Cultural Micro-Communities',
      description: 'AI systems are creating hyper-specific cultural niches by connecting individuals with incredibly specific shared interests, leading to explosive growth in micro-communities that brands can target.',
      confidence: 87,
      impact: 92,
      timeHorizon: '6-12 months',
      actionability: 85,
      relatedBrands: ['Duolingo', 'Liquid Death'],
      relatedTrends: ['algorithmically-driven community building', 'hyper-personalization'],
      recommended: true
    },
    {
      id: 'insight_2',
      title: 'Sentiment-Adaptive Content Ecosystems',
      description: 'Content that automatically adapts to cultural sentiment shifts and polarization levels will create brand resilience during cultural volatility.',
      confidence: 76,
      impact: 89,
      timeHorizon: '12-18 months',
      actionability: 71,
      relatedBrands: ['Morning Brew', 'Oatly'],
      relatedTrends: ['emotional intelligence in AI', 'cultural volatility'],
      recommended: true
    },
    {
      id: 'insight_3',
      title: 'AI-Generated Brand Personalities',
      description: 'Companies are using neural networks to develop entire brand identities and voices that can evolve in real-time based on cultural feedback loops.',
      confidence: 83,
      impact: 87,
      timeHorizon: '3-6 months',
      actionability: 89,
      relatedBrands: ['Liquid Death', 'Duolingo'],
      relatedTrends: ['synthetic brand identities', 'algorithmic creativity'],
      recommended: true
    },
    {
      id: 'insight_4',
      title: 'Neural-Engineered Status Signaling',
      description: 'AI systems are identifying novel status signals before they emerge in culture, allowing brands to position products as status markers before competitors.',
      confidence: 78,
      impact: 93,
      timeHorizon: '6-12 months',
      actionability: 68,
      relatedBrands: ['Hennessy', 'Oatly'],
      relatedTrends: ['predictive status engineering', 'algorithmic trend forecasting'],
      recommended: false
    },
    {
      id: 'insight_5',
      title: 'Countercultural Algorithm Exploitation',
      description: 'Brands are finding success by deliberately engineering content that exploits recommendation algorithm weaknesses to gain disproportionate reach.',
      confidence: 81,
      impact: 85,
      timeHorizon: '0-3 months',
      actionability: 92,
      relatedBrands: ['Liquid Death', 'Morning Brew'],
      relatedTrends: ['algorithm pattern interrupts', 'engineered virality'],
      recommended: true
    }
  ];
  
  const financeNodes: CultureNodeData[] = [
    {
      id: 'trend_1',
      label: 'Algorithmic Wealth Signaling',
      type: 'trend',
      strength: 0.85,
      growth: 0.6,
      audience: 12.7,
      phase: 'growing',
      virality: 78,
      resonance: 82,
      sentiment: 34
    },
    {
      id: 'trend_2',
      label: 'Financial Transparency Aesthetics',
      type: 'trend',
      strength: 0.72,
      growth: 0.4,
      audience: 9.3,
      phase: 'emerging',
      virality: 65,
      resonance: 76,
      sentiment: 68
    },
    {
      id: 'brand_1',
      label: 'Automated Financial Advisor',
      type: 'brand',
      strength: 0.79,
      growth: 0.5,
      audience: 7.8,
      phase: 'growing',
      virality: 42,
      resonance: 84,
      sentiment: 56
    },
    {
      id: 'audience_1',
      label: 'Gen Z Investors',
      type: 'audience',
      strength: 0.91,
      growth: 0.7,
      audience: 18.2,
      phase: 'growing',
      virality: 88,
      resonance: 79,
      sentiment: 43
    },
    {
      id: 'influence_1',
      label: 'AI-Driven Financial Content',
      type: 'influence',
      strength: 0.87,
      growth: 0.8,
      audience: 15.6,
      phase: 'emerging',
      virality: 76,
      resonance: 81,
      sentiment: 62
    }
  ];
  
  const cryptoNodes: CultureNodeData[] = [
    {
      id: 'trend_1',
      label: 'Post-Institutional Finance',
      type: 'trend',
      strength: 0.87,
      growth: 0.5,
      audience: 14.3,
      phase: 'growing',
      virality: 85,
      resonance: 77,
      sentiment: 27
    },
    {
      id: 'trend_2',
      label: 'Decentralized Identity',
      type: 'trend',
      strength: 0.82,
      growth: 0.7,
      audience: 11.8,
      phase: 'emerging',
      virality: 79,
      resonance: 72,
      sentiment: 41
    },
    {
      id: 'brand_1',
      label: 'AI-Optimized Trading Platform',
      type: 'brand',
      strength: 0.78,
      growth: 0.6,
      audience: 8.4,
      phase: 'growing',
      virality: 62,
      resonance: 81,
      sentiment: 34
    },
    {
      id: 'audience_1',
      label: 'Crypto-Native Generation',
      type: 'audience',
      strength: 0.94,
      growth: 0.8,
      audience: 22.7,
      phase: 'growing',
      virality: 91,
      resonance: 85,
      sentiment: 38
    },
    {
      id: 'influence_1',
      label: 'Algorithm-Generated NFT Art',
      type: 'influence',
      strength: 0.81,
      growth: 0.4,
      audience: 9.2,
      phase: 'peaking',
      virality: 82,
      resonance: 68,
      sentiment: 21
    }
  ];
  
  const sportsNodes: CultureNodeData[] = [
    {
      id: 'trend_1',
      label: 'AI-Enhanced Performance',
      type: 'trend',
      strength: 0.83,
      growth: 0.6,
      audience: 19.7,
      phase: 'growing',
      virality: 72,
      resonance: 86,
      sentiment: 65
    },
    {
      id: 'trend_2',
      label: 'Immersive Fan Experiences',
      type: 'trend',
      strength: 0.89,
      growth: 0.7,
      audience: 26.3,
      phase: 'growing',
      virality: 85,
      resonance: 91,
      sentiment: 78
    },
    {
      id: 'brand_1',
      label: 'Smart Equipment Manufacturer',
      type: 'brand',
      strength: 0.76,
      growth: 0.5,
      audience: 12.1,
      phase: 'emerging',
      virality: 68,
      resonance: 82,
      sentiment: 74
    },
    {
      id: 'audience_1',
      label: 'Data-Driven Sports Fans',
      type: 'audience',
      strength: 0.87,
      growth: 0.6,
      audience: 31.4,
      phase: 'growing',
      virality: 79,
      resonance: 84,
      sentiment: 71
    },
    {
      id: 'influence_1',
      label: 'AI-Generated Sports Content',
      type: 'influence',
      strength: 0.81,
      growth: 0.8,
      audience: 17.3,
      phase: 'emerging',
      virality: 74,
      resonance: 76,
      sentiment: 59
    }
  ];
  
  const generalNodes: CultureNodeData[] = [
    {
      id: 'trend_1',
      label: 'AI-Generated Media Consumption',
      type: 'trend',
      strength: 0.92,
      growth: 0.8,
      audience: 47.3,
      phase: 'growing',
      virality: 89,
      resonance: 85,
      sentiment: 42
    },
    {
      id: 'trend_2',
      label: 'Algorithm-Driven Identity Formation',
      type: 'trend',
      strength: 0.87,
      growth: 0.7,
      audience: 38.1,
      phase: 'emerging',
      virality: 84,
      resonance: 79,
      sentiment: 31
    },
    {
      id: 'brand_1',
      label: 'Neural Content Platform',
      type: 'brand',
      strength: 0.85,
      growth: 0.6,
      audience: 26.4,
      phase: 'growing',
      virality: 76,
      resonance: 83,
      sentiment: 68
    },
    {
      id: 'audience_1',
      label: 'Algorithm-Native Generation',
      type: 'audience',
      strength: 0.94,
      growth: 0.9,
      audience: 62.8,
      phase: 'growing',
      virality: 92,
      resonance: 88,
      sentiment: 47
    },
    {
      id: 'influence_1',
      label: 'AI-Curated Cultural Canon',
      type: 'influence',
      strength: 0.88,
      growth: 0.7,
      audience: 41.2,
      phase: 'emerging',
      virality: 81,
      resonance: 76,
      sentiment: 29
    }
  ];
  
  const financeEdges: CultureEdgeData[] = [
    {
      source: 'trend_1',
      target: 'audience_1',
      strength: 0.82,
      bidirectional: true,
      type: 'shapes'
    },
    {
      source: 'brand_1',
      target: 'trend_1',
      strength: 0.75,
      bidirectional: false,
      type: 'amplifies'
    },
    {
      source: 'influence_1',
      target: 'trend_2',
      strength: 0.89,
      bidirectional: true,
      type: 'influences'
    },
    {
      source: 'trend_2',
      target: 'audience_1',
      strength: 0.68,
      bidirectional: false,
      type: 'influences'
    },
    {
      source: 'brand_1',
      target: 'audience_1',
      strength: 0.77,
      bidirectional: true,
      type: 'shapes'
    }
  ];
  
  const cryptoEdges: CultureEdgeData[] = [
    {
      source: 'trend_1',
      target: 'audience_1',
      strength: 0.87,
      bidirectional: true,
      type: 'shapes'
    },
    {
      source: 'brand_1',
      target: 'trend_2',
      strength: 0.72,
      bidirectional: false,
      type: 'amplifies'
    },
    {
      source: 'influence_1',
      target: 'trend_1',
      strength: 0.84,
      bidirectional: false,
      type: 'influences'
    },
    {
      source: 'trend_2',
      target: 'audience_1',
      strength: 0.91,
      bidirectional: true,
      type: 'influences'
    },
    {
      source: 'brand_1',
      target: 'audience_1',
      strength: 0.79,
      bidirectional: true,
      type: 'shapes'
    }
  ];
  
  const sportsEdges: CultureEdgeData[] = [
    {
      source: 'trend_1',
      target: 'audience_1',
      strength: 0.81,
      bidirectional: true,
      type: 'influences'
    },
    {
      source: 'brand_1',
      target: 'trend_1',
      strength: 0.78,
      bidirectional: true,
      type: 'amplifies'
    },
    {
      source: 'influence_1',
      target: 'trend_2',
      strength: 0.86,
      bidirectional: false,
      type: 'shapes'
    },
    {
      source: 'trend_2',
      target: 'audience_1',
      strength: 0.92,
      bidirectional: true,
      type: 'shapes'
    },
    {
      source: 'brand_1',
      target: 'audience_1',
      strength: 0.74,
      bidirectional: false,
      type: 'influences'
    }
  ];
  
  const generalEdges: CultureEdgeData[] = [
    {
      source: 'trend_1',
      target: 'audience_1',
      strength: 0.89,
      bidirectional: true,
      type: 'shapes'
    },
    {
      source: 'brand_1',
      target: 'trend_1',
      strength: 0.82,
      bidirectional: true,
      type: 'amplifies'
    },
    {
      source: 'influence_1',
      target: 'trend_2',
      strength: 0.91,
      bidirectional: true,
      type: 'influences'
    },
    {
      source: 'trend_2',
      target: 'audience_1',
      strength: 0.87,
      bidirectional: true,
      type: 'shapes'
    },
    {
      source: 'brand_1',
      target: 'audience_1',
      strength: 0.78,
      bidirectional: false,
      type: 'influences'
    }
  ];
  
  // Get domain-specific data
  const getCultureNodesForDomain = (domain: DomainType): CultureNodeData[] => {
    switch (domain) {
      case 'finance': return financeNodes;
      case 'crypto': return cryptoNodes;
      case 'sports': return sportsNodes;
      default: return generalNodes;
    }
  };
  
  const getCultureEdgesForDomain = (domain: DomainType): CultureEdgeData[] => {
    switch (domain) {
      case 'finance': return financeEdges;
      case 'crypto': return cryptoEdges;
      case 'sports': return sportsEdges;
      default: return generalEdges;
    }
  };
  
  const getReferenceBrandsForDomain = (domain: DomainType): BrandReference[] => {
    // For simplicity, return all brands for now
    // In a real implementation, this would filter based on domain relevance
    return brandReferences;
  };
  
  const getInsightsForDomain = (domain: DomainType): CultureInsight[] => {
    // For simplicity, return all insights for now
    // In a real implementation, this would filter based on domain relevance
    return cultureInsights;
  };
  
  return (
    <CultureContext.Provider 
      value={{
        activeInfluenceMode,
        setActiveInfluenceMode,
        selectedNode,
        setSelectedNode,
        cultureInsights,
        brandReferences,
        getCultureNodesForDomain,
        getCultureEdgesForDomain,
        getReferenceBrandsForDomain,
        getInsightsForDomain
      }}
    >
      {children}
    </CultureContext.Provider>
  );
}

export function useCulture() {
  const context = useContext(CultureContext);
  if (!context) {
    throw new Error('useCulture must be used within a CultureProvider');
  }
  return context;
}