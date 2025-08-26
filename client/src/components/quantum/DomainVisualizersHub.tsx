import React, { useState } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import quantumCoherenceLogger from '@/utils/quantum-coherence-logger';
import CognitiveDomainVisualizer from './DomainVisualizers/CognitiveDomainVisualizer';

/**
 * DomainVisualizersHub - A comprehensive hub for domain-specific visualizations
 * 
 * This component provides a central interface for exploring how the Wilton Universal Law
 * (3:1 coherence ratio) manifests across different domains: cognitive, biological,
 * technological, financial, and relational.
 */

interface DomainVisualizersProps {
  stabilityRatio?: number;
  explorationRatio?: number;
  onRatioChange?: (stability: number, exploration: number) => void;
}

const DomainVisualizersHub: React.FC<DomainVisualizersProps> = ({
  stabilityRatio = 0.75,
  explorationRatio = 0.25,
  onRatioChange
}) => {
  const [activeDomain, setActiveDomain] = useState<string>('cognitive');
  const [globalInfluence, setGlobalInfluence] = useState<number>(50);
  
  // Placeholder domains that will be implemented later
  const plannedDomains = [
    { 
      id: 'biological',
      name: 'Biological',
      description: 'Metabolic rhythms, HRV, and biological cycles',
      status: 'planned'
    },
    { 
      id: 'technological',
      name: 'AI & Technology',
      description: 'Exploration vs. exploitation in AI systems',
      status: 'planned'
    },
    { 
      id: 'financial',
      name: 'Financial',
      description: 'Investment allocation balancing safety and innovation',
      status: 'planned'
    },
    { 
      id: 'relational',
      name: 'Relational',
      description: 'Social and emotional coherence patterns',
      status: 'planned'
    }
  ];
  
  // Handle domain-specific ratio changes
  const handleDomainRatioChange = (stability: number, exploration: number) => {
    if (onRatioChange) {
      // Apply global influence factor (0-100%)
      // Higher globalInfluence means changes in one domain affect all domains more strongly
      const globalFactor = globalInfluence / 100;
      
      // Calculate new system-wide ratios with weighted influence
      const newSystemStability = stabilityRatio * (1 - globalFactor) + stability * globalFactor;
      const newSystemExploration = explorationRatio * (1 - globalFactor) + exploration * globalFactor;
      
      // Normalize to ensure they sum to 1
      const total = newSystemStability + newSystemExploration;
      const normalizedStability = newSystemStability / total;
      const normalizedExploration = newSystemExploration / total;
      
      onRatioChange(normalizedStability, normalizedExploration);
      
      // Log the cross-domain influence
      quantumCoherenceLogger.logCoherenceEvent(
        'DomainVisualizersHub',
        normalizedStability,
        normalizedExploration,
        'cross_domain_influence',
        `${activeDomain} domain influenced system-wide coherence (${globalInfluence}% global influence)`
      );
    }
  };
  
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Domain Visualizers Hub</CardTitle>
        <CardDescription>
          Exploring the Wilton Universal Law (3:1 coherence ratio) across multiple domains
        </CardDescription>
        <div className="flex items-center space-x-2">
          <Badge variant="outline">
            System Coherence: {(stabilityRatio * 100).toFixed(0)}%
          </Badge>
          <Badge variant="outline">
            System Exploration: {(explorationRatio * 100).toFixed(0)}%
          </Badge>
          <Badge variant="outline" className="ml-auto">
            Current Ratio: {(stabilityRatio / explorationRatio).toFixed(2)}:1
          </Badge>
        </div>
      </CardHeader>
      
      <CardContent>
        <Tabs value={activeDomain} onValueChange={setActiveDomain}>
          <div className="flex justify-between items-center mb-4">
            <TabsList>
              <TabsTrigger value="cognitive">Cognitive</TabsTrigger>
              {plannedDomains.map(domain => (
                <TabsTrigger 
                  key={domain.id} 
                  value={domain.id}
                  disabled={domain.status === 'planned'}
                  className="relative"
                >
                  {domain.name}
                  {domain.status === 'planned' && (
                    <span className="absolute -top-1 -right-1 flex h-3 w-3">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-3 w-3 bg-blue-500"></span>
                    </span>
                  )}
                </TabsTrigger>
              ))}
            </TabsList>
            
            <div className="flex items-center space-x-2">
              <span className="text-xs text-muted-foreground">Global Influence:</span>
              <div className="w-32 h-2 bg-slate-700 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-blue-500 to-green-500"
                  style={{ width: `${globalInfluence}%` }}
                />
              </div>
              <span className="text-xs font-medium">{globalInfluence}%</span>
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => setGlobalInfluence(prev => Math.max(0, Math.min(100, prev + 10)))}
              >
                +
              </Button>
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => setGlobalInfluence(prev => Math.max(0, Math.min(100, prev - 10)))}
              >
                -
              </Button>
            </div>
          </div>
          
          <TabsContent value="cognitive">
            <CognitiveDomainVisualizer 
              stabilityRatio={stabilityRatio}
              explorationRatio={explorationRatio}
              onRatioChange={handleDomainRatioChange}
            />
          </TabsContent>
          
          {/* Placeholder content for planned domains */}
          {plannedDomains.map(domain => (
            <TabsContent key={domain.id} value={domain.id}>
              <Card>
                <CardHeader>
                  <CardTitle>{domain.name} Domain Visualization</CardTitle>
                  <CardDescription>
                    {domain.description}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-col items-center justify-center space-y-4 py-12">
                    <div className="text-blue-500">
                      <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M10.5 20.5a2.5 2.5 0 1 0 3-4"></path>
                        <path d="M13.5 7.5a2.5 2.5 0 1 0-3-4"></path>
                        <path d="M16 15a2 2 0 1 0 0-4"></path>
                        <path d="M8 11a2 2 0 1 0 0-4"></path>
                        <path d="M15 19l-3-9 3-9"></path>
                        <path d="M9 19l3-9-3-9"></path>
                      </svg>
                    </div>
                    <h3 className="text-xl font-bold">Coming Soon</h3>
                    <p className="text-center text-muted-foreground max-w-md">
                      This domain visualizer is under development and will be available soon. 
                      When completed, it will demonstrate how the 3:1 coherence ratio applies to the {domain.name.toLowerCase()} domain.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          ))}
        </Tabs>
        
        <div className="mt-6 p-4 bg-slate-800/50 rounded-md">
          <h3 className="text-md font-semibold mb-2">Cross-Domain Dynamics</h3>
          <p className="text-sm text-muted-foreground">
            The Wilton Universal Law (3:1 coherence ratio) manifests across all domains,
            with each domain influencing others through fractal resonance. Adjusting the global
            influence factor controls how strongly changes in one domain affect all other domains.
          </p>
          
          <div className="mt-4 grid grid-cols-2 md:grid-cols-5 gap-2">
            <div className={`border p-2 rounded text-center ${activeDomain === 'cognitive' ? 'border-blue-500 bg-blue-900/20' : 'border-slate-700'}`}>
              <div className="text-xs text-muted-foreground">Cognitive</div>
              <div className="text-sm font-medium">{(stabilityRatio / explorationRatio).toFixed(2)}:1</div>
            </div>
            {plannedDomains.map(domain => (
              <div key={domain.id} className={`border p-2 rounded text-center ${activeDomain === domain.id ? 'border-blue-500 bg-blue-900/20' : 'border-slate-700'}`}>
                <div className="text-xs text-muted-foreground">{domain.name}</div>
                <div className="text-sm font-medium">{(stabilityRatio / explorationRatio).toFixed(2)}:1</div>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
      
      <CardFooter className="text-xs text-muted-foreground flex justify-between">
        <span>The 3:1 ratio is a universal law operating across all domains of reality</span>
        <Badge variant="outline">Wilton Universal Law</Badge>
      </CardFooter>
    </Card>
  );
};

export default DomainVisualizersHub;