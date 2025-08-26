/**
 * Mock API - Provides mock responses for API calls to prevent actual HTTP requests
 */

import { DomainType } from "@/contexts/DomainContext";

export interface AnalysisResult {
  insight: string;
  confidence: number;
  source: 'ai';
  timestamp: Date;
}

export interface AugmentationRecommendation {
  name: string;
  description: string;
  recommendedLevel: number;
  maxLevel: number;
}

export interface AugmentationResponse {
  augmentations: AugmentationRecommendation[];
}

export interface SymbioticResponse {
  response: string;
  humanContribution: number;
  aiContribution: number;
  confidenceScore: number;
}

export interface ConceptNode {
  id: string;
  label: string;
  type: 'human' | 'ai' | 'data';
  strength: number;
}

export interface ConceptConnection {
  source: string;
  target: string;
  strength: number;
}

export interface ConceptualConnectionsResponse {
  nodes: ConceptNode[];
  connections: ConceptConnection[];
}

// Static mock data for text analysis
export function mockTextAnalysis(text: string): AnalysisResult {
  return {
    insight: `Analysis of "${text.substring(0, 30)}...": This content demonstrates patterns of creative thinking with analytical undertones.`,
    confidence: 0.87,
    source: 'ai',
    timestamp: new Date()
  };
}

// Static mock data for image analysis
export function mockImageAnalysis(): AnalysisResult {
  return {
    insight: "The image displays a sophisticated pattern characteristic of advanced neural activity and creative processing.",
    confidence: 0.82,
    source: 'ai',
    timestamp: new Date()
  };
}

// Static mock data for augmentation recommendations
export function mockAugmentationRecommendations(domain: DomainType): AugmentationResponse {
  const domainText = domain.charAt(0).toUpperCase() + domain.slice(1);
  
  return {
    augmentations: [
      {
        name: `${domainText} Pattern Recognition`,
        description: "Enhances ability to recognize complex patterns in large datasets",
        recommendedLevel: 3,
        maxLevel: 5
      },
      {
        name: "Cognitive Load Balancing",
        description: "Optimizes cognitive resources during analysis tasks",
        recommendedLevel: 4,
        maxLevel: 5
      },
      {
        name: `${domainText} Insight Generation`,
        description: "Augments creative insight for problem-solving",
        recommendedLevel: 3,
        maxLevel: 5
      }
    ]
  };
}

// Static mock data for symbiotic responses
export function mockSymbioticResponse(humanInput: string, domain: DomainType): SymbioticResponse {
  return {
    response: `Enhanced perspective: ${humanInput} - This approach shows promising application in ${domain} contexts, with potential for cross-domain synthesis.`,
    humanContribution: 0.65,
    aiContribution: 0.35,
    confidenceScore: 0.89
  };
}

// Static mock data for conceptual connections
export function mockConceptualConnections(domain: DomainType): ConceptualConnectionsResponse {
  // Base nodes that are consistent across domains
  const nodes: ConceptNode[] = [
    { id: "human-intuition", label: "Human Intuition", type: "human", strength: 0.95 },
    { id: "ai-processing", label: "AI Processing", type: "ai", strength: 0.92 },
    { id: "data-analysis", label: "Data Analysis", type: "data", strength: 0.88 },
    { id: "pattern-recognition", label: "Pattern Recognition", type: "ai", strength: 0.85 },
    { id: "creative-thinking", label: "Creative Thinking", type: "human", strength: 0.90 },
    { id: "neural-mapping", label: "Neural Mapping", type: "data", strength: 0.82 }
  ];
  
  // Add domain-specific nodes
  if (domain === 'finance') {
    nodes.push(
      { id: "risk-assessment", label: "Risk Assessment", type: "ai", strength: 0.87 },
      { id: "market-trends", label: "Market Trends", type: "data", strength: 0.89 }
    );
  } else if (domain === 'crypto') {
    nodes.push(
      { id: "blockchain-analysis", label: "Blockchain Analysis", type: "ai", strength: 0.91 },
      { id: "token-valuation", label: "Token Valuation", type: "data", strength: 0.85 }
    );
  } else if (domain === 'sports') {
    nodes.push(
      { id: "performance-metrics", label: "Performance Metrics", type: "data", strength: 0.88 },
      { id: "strategy-optimization", label: "Strategy Optimization", type: "ai", strength: 0.86 }
    );
  }
  
  // Base connections that are consistent across domains
  const connections: ConceptConnection[] = [
    { source: "human-intuition", target: "ai-processing", strength: 0.85 },
    { source: "ai-processing", target: "data-analysis", strength: 0.92 },
    { source: "data-analysis", target: "pattern-recognition", strength: 0.88 },
    { source: "pattern-recognition", target: "creative-thinking", strength: 0.75 },
    { source: "creative-thinking", target: "human-intuition", strength: 0.90 },
    { source: "neural-mapping", target: "pattern-recognition", strength: 0.82 },
    { source: "neural-mapping", target: "data-analysis", strength: 0.85 }
  ];
  
  // Add domain-specific connections
  if (domain === 'finance') {
    connections.push(
      { source: "data-analysis", target: "risk-assessment", strength: 0.90 },
      { source: "risk-assessment", target: "human-intuition", strength: 0.75 },
      { source: "market-trends", target: "data-analysis", strength: 0.92 },
      { source: "ai-processing", target: "market-trends", strength: 0.85 }
    );
  } else if (domain === 'crypto') {
    connections.push(
      { source: "data-analysis", target: "blockchain-analysis", strength: 0.88 },
      { source: "blockchain-analysis", target: "token-valuation", strength: 0.82 },
      { source: "token-valuation", target: "pattern-recognition", strength: 0.80 },
      { source: "human-intuition", target: "token-valuation", strength: 0.70 }
    );
  } else if (domain === 'sports') {
    connections.push(
      { source: "data-analysis", target: "performance-metrics", strength: 0.95 },
      { source: "performance-metrics", target: "strategy-optimization", strength: 0.88 },
      { source: "strategy-optimization", target: "human-intuition", strength: 0.75 },
      { source: "pattern-recognition", target: "performance-metrics", strength: 0.85 }
    );
  }
  
  return { nodes, connections };
}