import React, { useState, useEffect } from 'react';
import QuantumLemniscateVisualizer from '../components/quantum/QuantumLemniscateVisualizer.tsx';
import OctacuriosityPanel from '../components/quantum/OctacuriosityPanel.tsx';
import TransactionLogVisualizer from '../components/quantum/TransactionLogVisualizer.tsx';
import DomainImpactAnalyzer from '../components/quantum/DomainImpactAnalyzer.tsx';
import { createStandardQuantumConcepts } from '../utils/meta-translation-layer.ts';
import quantumCoherenceLogger from '../utils/quantum-coherence-logger.js';

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../components/ui/card.jsx";
import { Button } from "../components/ui/button.jsx";
import { Badge } from "../components/ui/badge.jsx";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs.jsx";
import { Progress } from "../components/ui/progress.jsx";

/**
 * QuantumLemniscatePage - A page for visualizing and interacting with the quantum lemniscate model
 * 
 * This page provides interactive visualizations of the 3:1 quantum balance principle,
 * demonstrating how reality emerges from infinite potential (division by zero) through
 * the quantum balance filter (75% coherence, 25% exploration).
 */
export default function QuantumLemniscatePage() {
  const [stabilityRatio, setStabilityRatio] = useState<number>(0.75);
  const [explorationRatio, setExplorationRatio] = useState<number>(0.25);
  const [systemCoherence, setSystemCoherence] = useState<number>(75);
  const [activeTab, setActiveTab] = useState<string>('visualizer');
  const [conceptList] = useState(createStandardQuantumConcepts());
  
  // Update overall system coherence periodically
  useEffect(() => {
    const coherenceInterval = setInterval(() => {
      const coherenceScore = quantumCoherenceLogger.calculateSystemCoherence();
      setSystemCoherence(coherenceScore);
    }, 5000);
    
    return () => clearInterval(coherenceInterval);
  }, []);
  
  // Handle ratio changes from child components
  const handleRatioChange = (stability: number, exploration: number) => {
    setStabilityRatio(stability);
    setExplorationRatio(exploration);
    
    // Log the page-level ratio change
    quantumCoherenceLogger.logCoherenceEvent(
      'QuantumLemniscatePage',
      stability,
      exploration,
      'parent_component_update',
      `Updated page-level quantum balance to ${(stability / exploration).toFixed(2)}:1 ratio`
    );
  };
  
  // Calculate actual ratio
  const actualRatio = stabilityRatio / explorationRatio;
  const ratioDeviation = Math.abs(actualRatio - 3);
  const isOptimalRatio = ratioDeviation < 0.1;
  
  return (
    <div className="container py-8 max-w-6xl">
      <header className="mb-8 text-center">
        <h1 className="text-3xl font-bold mb-2">Quantum Lemniscate Explorer</h1>
        <p className="text-muted-foreground max-w-3xl mx-auto">
          Exploring how reality emerges from infinite potential (division by zero) through the
          quantum balance filter. The Wilton Universal Law states that a 3:1 ratio (75% coherence, 25% exploration)
          is optimal for structured reality to emerge while maintaining adaptability.
        </p>
        
        <div className="flex items-center justify-center space-x-4 mt-4">
          <Badge variant={isOptimalRatio ? "default" : "outline"} className="text-sm">
            System Coherence: {systemCoherence.toFixed(0)}%
          </Badge>
          <Badge variant={isOptimalRatio ? "default" : "outline"} className="text-sm">
            Current Ratio: {actualRatio.toFixed(2)}:1
          </Badge>
          {isOptimalRatio ? (
            <Badge variant="default" className="bg-green-600 text-sm">
              Optimal Balance
            </Badge>
          ) : (
            <Badge variant="outline" className="text-yellow-400 border-yellow-400 text-sm">
              Ratio Deviation: {ratioDeviation.toFixed(2)}
            </Badge>
          )}
        </div>
      </header>
      
      <Tabs defaultValue="visualizer" value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="grid w-full grid-cols-2 lg:grid-cols-4">
          <TabsTrigger value="visualizer">Lemniscate Visualizer</TabsTrigger>
          <TabsTrigger value="concepts">Quantum Concepts</TabsTrigger>
          <TabsTrigger value="applications">Domain Applications</TabsTrigger>
          <TabsTrigger value="documentation">Theory & Documentation</TabsTrigger>
        </TabsList>
        
        {/* Lemniscate Visualizer Tab */}
        <TabsContent value="visualizer" className="space-y-4">
          <QuantumLemniscateVisualizer
            stabilityRatio={stabilityRatio}
            explorationRatio={explorationRatio}
            onRatioChange={handleRatioChange}
          />
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>Division by Zero Explanation</CardTitle>
                <CardDescription>
                  The mathematical singularity at the core of quantum potential
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Division by zero represents a mathematical singularity - a point where standard
                  rules break down, creating infinite potential. In quantum terms, this is the 
                  "unmanifested potential" from which all reality emerges. The quantum lemniscate
                  shows how this infinite potential is filtered through the 3:1 ratio to create structured reality.
                </p>
                <div className="mt-4 p-3 bg-blue-950/30 rounded-lg border border-blue-900">
                  <h4 className="text-blue-400 text-sm font-medium mb-1">Mathematical Expression</h4>
                  <div className="flex items-center justify-center p-2 bg-black/50 rounded">
                    <div className="font-mono text-lg">
                      lim<sub>x→0</sub> (1/x) = ∞
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>The 3:1 Quantum Balance</CardTitle>
                <CardDescription>
                  Wilton's Universal Law of coherence and exploration
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  The 3:1 ratio (75% coherence, 25% exploration) represents the optimal balance
                  for complex systems. This ratio allows for enough stability to maintain structure while
                  providing enough chaos for adaptation and growth. This universal pattern appears in 
                  cognitive processes, biological systems, technology, finance, and relationships.
                </p>
                
                <div className="mt-4 grid grid-cols-4 gap-2">
                  <div className="col-span-3 bg-blue-900/20 border border-blue-900/30 rounded p-2">
                    <h4 className="text-blue-400 text-xs font-medium">Coherence (75%)</h4>
                  </div>
                  <div className="col-span-1 bg-red-900/20 border border-red-900/30 rounded p-2">
                    <h4 className="text-red-400 text-xs font-medium">Exploration (25%)</h4>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        {/* Quantum Concepts Tab */}
        <TabsContent value="concepts" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Quantum Concepts Library</CardTitle>
              <CardDescription>
                Explore core concepts of the quantum lemniscate model
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {conceptList.map(concept => (
                  <Card key={concept.id} className="border border-slate-800">
                    <CardHeader className="px-4 py-3">
                      <CardTitle className="text-base">{concept.name}</CardTitle>
                      <Badge variant="outline" className="text-xs">
                        {concept.domain} / {concept.level}
                      </Badge>
                    </CardHeader>
                    <CardContent className="px-4 py-2">
                      <p className="text-xs text-muted-foreground">
                        {concept.abstractDescription}
                      </p>
                      <div className="mt-2 grid grid-cols-4 gap-1">
                        <div className="col-span-3 bg-blue-900/20 border border-blue-900/30 rounded p-1">
                          <span className="text-xs">{(concept.coherenceComponent * 100).toFixed(0)}%</span>
                        </div>
                        <div className="col-span-1 bg-red-900/20 border border-red-900/30 rounded p-1">
                          <span className="text-xs">{(concept.explorationComponent * 100).toFixed(0)}%</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Domain Applications Tab */}
        <TabsContent value="applications" className="space-y-4">
          <OctacuriosityPanel />
          
          <Tabs defaultValue="domains" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="domains">Domain Examples</TabsTrigger>
              <TabsTrigger value="transactions">Transaction Analysis</TabsTrigger>
              <TabsTrigger value="impact">Domain Impact</TabsTrigger>
            </TabsList>
            
            {/* Domains Tab */}
            <TabsContent value="domains" className="pt-4">
              <Card>
                <CardHeader>
                  <CardTitle>Domain Applications</CardTitle>
                  <CardDescription>
                    Applying the 3:1 balance principle across different domains
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <Card className="border border-purple-900/30">
                  <CardHeader className="px-4 py-3 bg-purple-950/20">
                    <CardTitle className="text-base">Cognitive Domain</CardTitle>
                  </CardHeader>
                  <CardContent className="px-4 py-2">
                    <p className="text-xs text-muted-foreground">
                      The balance between focused attention (75%) and creative exploration (25%) 
                      in mental processes. This ratio optimizes problem-solving, learning, and
                      creativity while maintaining coherent thought.
                    </p>
                    <Button variant="link" className="p-0 h-auto text-xs mt-2">
                      Explore Cognitive Domain
                    </Button>
                  </CardContent>
                </Card>
                
                <Card className="border border-green-900/30">
                  <CardHeader className="px-4 py-3 bg-green-950/20">
                    <CardTitle className="text-base">Biological Domain</CardTitle>
                  </CardHeader>
                  <CardContent className="px-4 py-2">
                    <p className="text-xs text-muted-foreground">
                      Natural systems maintain homeostasis (75%) while allowing for adaptation (25%).
                      This balance appears in circadian rhythms, metabolic processes, and ecological
                      systems.
                    </p>
                    <Button variant="link" className="p-0 h-auto text-xs mt-2">
                      Explore Biological Domain
                    </Button>
                  </CardContent>
                </Card>
                
                <Card className="border border-blue-900/30">
                  <CardHeader className="px-4 py-3 bg-blue-950/20">
                    <CardTitle className="text-base">Technological Domain</CardTitle>
                  </CardHeader>
                  <CardContent className="px-4 py-2">
                    <p className="text-xs text-muted-foreground">
                      AI systems optimized with 75% exploitation (using proven strategies) and 25%
                      exploration (trying new approaches). This balance prevents both stagnation
                      and chaotic behavior.
                    </p>
                    <Button variant="link" className="p-0 h-auto text-xs mt-2">
                      Explore Technological Domain
                    </Button>
                  </CardContent>
                </Card>
                
                <Card className="border border-yellow-900/30">
                  <CardHeader className="px-4 py-3 bg-yellow-950/20">
                    <CardTitle className="text-base">Financial Domain</CardTitle>
                  </CardHeader>
                  <CardContent className="px-4 py-2">
                    <p className="text-xs text-muted-foreground">
                      Investment portfolios structured with 75% stable assets and 25% growth/speculative
                      investments. This allocation balances risk management with opportunity for
                      higher returns.
                    </p>
                    <Button variant="link" className="p-0 h-auto text-xs mt-2">
                      Explore Financial Domain
                    </Button>
                  </CardContent>
                </Card>
                
                <Card className="border border-red-900/30">
                  <CardHeader className="px-4 py-3 bg-red-950/20">
                    <CardTitle className="text-base">Relational Domain</CardTitle>
                  </CardHeader>
                  <CardContent className="px-4 py-2">
                    <p className="text-xs text-muted-foreground">
                      Relationships balanced between stability/routine (75%) and novelty/growth (25%).
                      This ratio fosters both security and continued development in personal and
                      professional connections.
                    </p>
                    <Button variant="link" className="p-0 h-auto text-xs mt-2">
                      Explore Relational Domain
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </CardContent>
          </Card>
            </TabsContent>
            
            {/* Transaction Analysis Tab */}
            <TabsContent value="transactions" className="pt-4">
              <TransactionLogVisualizer />
            </TabsContent>
            
            {/* Domain Impact Tab */}
            <TabsContent value="impact" className="pt-4">
              <DomainImpactAnalyzer />
            </TabsContent>
          </Tabs>
        </TabsContent>
        
        {/* Documentation Tab */}
        <TabsContent value="documentation" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Theory & Documentation</CardTitle>
              <CardDescription>
                Understanding the quantum lemniscate model and Wilton Universal Law
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="prose prose-invert max-w-none">
                <h3>The Quantum Lemniscate Model</h3>
                <p>
                  The quantum lemniscate model provides a framework for understanding how reality emerges
                  from infinite potential through the balancing mechanism of the 3:1 ratio. This model
                  bridges quantum mechanical principles with practical applications across domains.
                </p>
                
                <h4>Key Principles</h4>
                <ul>
                  <li>
                    <strong>Infinite Potential:</strong> Represented by division by zero, this is the 
                    unmanifested quantum potential from which all possibilities emerge.
                  </li>
                  <li>
                    <strong>3:1 Quantum Balance:</strong> The optimal ratio of coherence (75%) to
                    exploration (25%) that allows structured reality to emerge while maintaining
                    adaptability.
                  </li>
                  <li>
                    <strong>Lemniscate Pattern:</strong> The infinity symbol represents the continuous
                    flow between potential and manifestation, with the 3:1 ratio serving as the
                    filtering mechanism.
                  </li>
                  <li>
                    <strong>Universal Application:</strong> This pattern appears consistently across
                    domains, suggesting a fundamental universal law.
                  </li>
                </ul>
                
                <h4>Mathematical Foundation</h4>
                <p>
                  The mathematical expression of the quantum lemniscate builds on the concept of division
                  by zero as a singularity. While traditional mathematics treats this as undefined,
                  the quantum perspective views it as a point of infinite potential.
                </p>
                
                <pre className="bg-slate-950 p-3 rounded text-sm">
                  {`// The 3:1 ratio expressed as a filter function
function quantumFilter(potential, coherenceRatio = 0.75) {
  const explorationRatio = 1 - coherenceRatio;
  return {
    structure: potential * coherenceRatio,
    adaptation: potential * explorationRatio,
    ratio: coherenceRatio / explorationRatio  // Optimal = 3:1
  };
}`}
                </pre>
                
                <h4>Further Resources</h4>
                <ul>
                  <li>Quantum Coherence Measurement Documentation</li>
                  <li>Implicit Drift Detection & Recalibration (IDDR) System</li>
                  <li>Meta-Translation Layer Documentation</li>
                  <li>T-Branch Recursion System</li>
                  <li>Domain-Specific Application Guides</li>
                </ul>
                
                <div className="bg-slate-900/50 p-4 rounded-lg border border-slate-800 mt-4">
                  <h4 className="text-xl mb-2">About the Wilton Universal Law</h4>
                  <p className="text-sm">
                    The Wilton Universal Law identifies the 3:1 ratio (75% coherence, 25% exploration)
                    as a fundamental pattern that governs optimal functioning across domains. This
                    principle has been observed in cognitive processes, biological systems, technological
                    design, financial strategies, and interpersonal relationships.
                  </p>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button variant="outline" size="sm">Download Documentation</Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}