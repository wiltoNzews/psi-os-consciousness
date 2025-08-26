import { useMutation, useQuery } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useState } from "react";
import { DomainType } from "@/contexts/DomainContext";

// Types for API responses
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

export function useTextAnalysis() {
  return useMutation({
    mutationFn: async (text: string) => {
      try {
        const response = await apiRequest({
          method: "POST",
          path: "/api/symbiosis/analyze-text",
          body: { text }
        });
        
        // Use type assertion with unknown intermediate step for safety
        return response as unknown as AnalysisResult;
      } catch (error) {
        console.error("Text analysis error:", error);
        throw error;
      }
    }
  });
}

export function useImageAnalysis() {
  return useMutation({
    mutationFn: async (image: string) => {
      try {
        const response = await apiRequest({
          method: "POST",
          path: "/api/symbiosis/analyze-image",
          body: { image }
        });
        
        // Use type assertion with unknown intermediate step for safety
        return response as unknown as AnalysisResult;
      } catch (error) {
        console.error("Image analysis error:", error);
        throw error;
      }
    }
  });
}

export function useAugmentationRecommendations() {
  return useMutation({
    mutationFn: async ({ domain, humanContext }: { domain: DomainType, humanContext: string }) => {
      try {
        const response = await apiRequest({
          method: "POST",
          path: "/api/symbiosis/augmentation-recommendations",
          body: { domain, humanContext }
        });
        
        // Use type assertion with unknown intermediate step for safety
        return response as unknown as AugmentationResponse;
      } catch (error) {
        console.error("Augmentation recommendations error:", error);
        throw error;
      }
    }
  });
}

export function useSymbioticResponse() {
  return useMutation({
    mutationFn: async ({ humanInput, domain }: { humanInput: string, domain: DomainType }) => {
      try {
        const response = await apiRequest({
          method: "POST",
          path: "/api/symbiosis/symbiotic-response",
          body: { humanInput, domain }
        });
        
        // Use type assertion with unknown intermediate step for safety
        return response as unknown as SymbioticResponse;
      } catch (error) {
        console.error("Symbiotic response error:", error);
        throw error;
      }
    }
  });
}

export function useConceptualConnections() {
  return useMutation({
    mutationFn: async ({ domain, concepts }: { domain: DomainType, concepts: string[] }) => {
      try {
        const response = await apiRequest({
          method: "POST",
          path: "/api/symbiosis/conceptual-connections",
          body: { domain, concepts }
        });
        
        // If no data is returned from the API, create sample data
        // This helps during development and as a fallback
        if (!response || !response.nodes || !response.connections) {
          console.warn("Creating fallback conceptual connections data");
          return createFallbackConceptualConnections(domain, concepts);
        }
        
        // Use type assertion with unknown intermediate step for safety
        return response as unknown as ConceptualConnectionsResponse;
      } catch (error) {
        console.error("Conceptual connections error:", error);
        // Return fallback data on error to prevent UI breakage
        return createFallbackConceptualConnections(domain, concepts);
      }
    }
  });
}

// Helper function to create fallback data if the API fails
function createFallbackConceptualConnections(domain: DomainType, concepts: string[]): ConceptualConnectionsResponse {
  const domainColors = {
    finance: 'rgba(16, 185, 129, 0.8)',  // Green
    crypto: 'rgba(245, 158, 11, 0.8)',   // Orange
    sports: 'rgba(59, 130, 246, 0.8)',   // Blue
    general: 'rgba(139, 92, 246, 0.8)',  // Purple
  };
  
  const nodes: ConceptNode[] = [];
  const connections: ConceptConnection[] = [];
  
  // Create human nodes
  ['Intuition', 'Experience', 'Decision Making', 'Judgment'].forEach((label, i) => {
    nodes.push({
      id: `human-${i}`,
      label,
      type: 'human',
      strength: 0.5 + Math.random() * 0.5
    });
  });
  
  // Create AI nodes
  ['Pattern Recognition', 'Data Analysis', 'Prediction', 'Classification'].forEach((label, i) => {
    nodes.push({
      id: `ai-${i}`,
      label,
      type: 'ai',
      strength: 0.5 + Math.random() * 0.5
    });
  });
  
  // Create data nodes from concepts
  concepts.forEach((concept, i) => {
    nodes.push({
      id: `data-${i}`,
      label: concept,
      type: 'data',
      strength: 0.3 + Math.random() * 0.7
    });
  });
  
  // Create connections between nodes
  nodes.forEach(source => {
    // Each node connects to 2-4 random other nodes
    const connectionCount = 2 + Math.floor(Math.random() * 3);
    
    for (let i = 0; i < connectionCount; i++) {
      const targetCandidates = nodes.filter(n => n.id !== source.id);
      if (targetCandidates.length === 0) continue;
      
      const target = targetCandidates[Math.floor(Math.random() * targetCandidates.length)];
      
      connections.push({
        source: source.id,
        target: target.id,
        strength: 0.1 + Math.random() * 0.9
      });
    }
  });
  
  return { nodes, connections };
}

export function useSymbiosisDemo() {
  const [activeDomain, setActiveDomain] = useState<DomainType>('general');
  const [activeView, setActiveView] = useState<'neurosynapse' | 'augmentation' | 'insight' | 'symbiotic'>('neurosynapse');
  
  // Pre-configured concept sets for different domains
  const conceptSets = {
    finance: ['market analysis', 'risk assessment', 'portfolio optimization', 'trend prediction', 'human judgment'],
    crypto: ['blockchain', 'market sentiment', 'pattern recognition', 'technical analysis', 'volatility prediction'],
    sports: ['player statistics', 'performance analysis', 'injury prediction', 'strategic planning', 'team chemistry'],
    general: ['human intelligence', 'artificial intelligence', 'data analysis', 'intuition', 'learning']
  };
  
  // Use conceptual connections mutation for the NeuroSynapse visualization
  const conceptualConnections = useConceptualConnections();
  
  // Generate connections for the current domain
  const generateConnections = () => {
    conceptualConnections.mutate({
      domain: activeDomain,
      concepts: conceptSets[activeDomain]
    });
  };
  
  // Symbiotic response mutation
  const symbioticResponse = useSymbioticResponse();
  
  // Generate a symbiotic response for a given input
  const generateSymbioticResponse = (input: string) => {
    symbioticResponse.mutate({
      humanInput: input,
      domain: activeDomain
    });
  };
  
  // Augmentation recommendations mutation
  const augmentationRecommendations = useAugmentationRecommendations();
  
  // Generate augmentation recommendations for the current domain
  const generateAugmentations = (context: string) => {
    augmentationRecommendations.mutate({
      domain: activeDomain,
      humanContext: context
    });
  };
  
  // Text analysis mutation
  const textAnalysis = useTextAnalysis();
  
  // Analyze text input
  const analyzeText = (text: string) => {
    textAnalysis.mutate(text);
  };
  
  return {
    activeDomain,
    setActiveDomain,
    activeView,
    setActiveView,
    conceptSets,
    conceptualConnections: {
      data: conceptualConnections.data,
      isLoading: conceptualConnections.isPending,
      error: conceptualConnections.error,
      generate: generateConnections
    },
    symbioticResponse: {
      data: symbioticResponse.data,
      isLoading: symbioticResponse.isPending,
      error: symbioticResponse.error,
      generate: generateSymbioticResponse
    },
    augmentationRecommendations: {
      data: augmentationRecommendations.data,
      isLoading: augmentationRecommendations.isPending,
      error: augmentationRecommendations.error,
      generate: generateAugmentations
    },
    textAnalysis: {
      data: textAnalysis.data,
      isLoading: textAnalysis.isPending,
      error: textAnalysis.error,
      analyze: analyzeText
    }
  };
}