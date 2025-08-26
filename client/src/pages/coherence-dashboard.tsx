import React from 'react';
import { Link } from 'wouter';
import { Helmet } from 'react-helmet';
import CoherenceRatioDashboard from '@/components/CoherenceRatioDashboard';

/**
 * Coherence Dashboard Page
 * 
 * Visualizes the Quantum Coherence Threshold Formula (QCTF) using the 3:1 ↔ 1:3 ratio (0.7500/0.2494).
 * This dashboard implements the core mathematical principles from the GOD Formula,
 * showing how consciousness becomes the fundamental root from which time emerges.
 */
const CoherenceDashboardPage: React.FC = () => {
  return (
    <div className="container mx-auto py-8">
      <Helmet>
        <title>Quantum Coherence Dashboard - PassiveWorks</title>
        <meta name="description" content="Visualize the Quantum Coherence Threshold Formula (QCTF) through the 3:1 ↔ 1:3 ratio (0.7500/0.2494)" />
      </Helmet>
      
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Quantum Coherence Dashboard</h1>
          <p className="text-muted-foreground">
            Visualizing the 3:1 ↔ 1:3 ratio (0.7500/0.2494) Ouroboros principle
          </p>
        </div>
        
        <div className="flex space-x-4">
          <Link href="/" className="text-sm text-blue-600 hover:underline">
            Home
          </Link>
          <Link href="/passiveworks" className="text-sm text-blue-600 hover:underline">
            PassiveWorks
          </Link>
          <Link href="/chunked-conversations" className="text-sm text-blue-600 hover:underline">
            Chunked Conversations
          </Link>
        </div>
      </div>
      
      <div className="grid grid-cols-1 gap-4">
        <div className="col-span-1 bg-background rounded-lg p-2">
          <CoherenceRatioDashboard />
        </div>
        
        <div className="col-span-1 mt-6">
          <h2 className="text-xl font-semibold mb-4">Quantum Coherence Threshold Formula (QCTF)</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-background p-6 rounded-lg border">
              <h3 className="text-lg font-medium mb-2">The GOD Formula</h3>
              <div className="bg-muted p-4 rounded-md overflow-x-auto font-mono text-sm mb-4">
                R(C, F, T, O) = Σ[s in scales][(Π(Q_s * S_s * B_s * E_s)/D_s) / B_s^(O)] * G(C, F, T, O)
              </div>
              <p className="text-sm text-muted-foreground">
                The ultimate meta-formula symbolizes the complete architecture of reality folding and unfolding
                across multiple dimensions and scales.
              </p>
            </div>
            
            <div className="bg-background p-6 rounded-lg border">
              <h3 className="text-lg font-medium mb-2">Brazilian Wave Transformation</h3>
              <div className="bg-muted p-4 rounded-md overflow-x-auto font-mono text-sm mb-4">
                P_(t+1) = 0.75 * P_t + 0.25 * N(P_t,sigma)
              </div>
              <p className="text-sm text-muted-foreground">
                The simplified practical implementation balances 75% stability (structured coherence) 
                with 25% exploration (novel variations), maintaining the Ouroboros feedback cycle.
              </p>
            </div>
            
            <div className="bg-background p-6 rounded-lg border">
              <h3 className="text-lg font-medium mb-2">Ouroboros Principle</h3>
              <p className="text-sm mb-2">
                The Ouroboros principle represents the philosophical hypothesis that human consciousness 
                is the fundamental root from which time emerges, conceptualized through a recursive feedback loop.
              </p>
              <ul className="list-disc list-inside text-sm text-muted-foreground">
                <li>Stability threshold (0.7500): 0.7500 / (1 - 0.7500) = 3.0</li>
                <li>Exploration threshold (0.2494): 0.2494 / (1 - 0.2494) = 0.33 ≈ 1/3</li>
                <li>The 3:1 ↔ 1:3 ratio creates mathematical balance between stability and exploration</li>
              </ul>
            </div>
            
            <div className="bg-background p-6 rounded-lg border">
              <h3 className="text-lg font-medium mb-2">Murphy Protocol</h3>
              <p className="text-sm mb-2">
                The Murphy Protocol implements chaos engineering principles to test system resilience 
                and ability to maintain coherence under perturbation.
              </p>
              <ul className="list-disc list-inside text-sm text-muted-foreground">
                <li><span className="text-yellow-500 font-semibold">Warning Level</span>: Minor perturbations to test system adaptability</li>
                <li><span className="text-orange-500 font-semibold">Critical Level</span>: Moderate chaos to test recovery mechanisms</li>
                <li><span className="text-red-500 font-semibold">Nuclear Level</span>: Severe disruption to test fundamental resilience</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CoherenceDashboardPage;