import React from 'react';
import { Helmet } from 'react-helmet';
import QuantumAIAgent from '../components/ai/QuantumAIAgent.jsx';

export default function QuantumAIAgentPage() {
  return (
    <div className="container mx-auto py-8 px-4">
      <Helmet>
        <title>Quantum AI Agent - WiltonOS</title>
        <meta name="description" content="Interact with the WiltonOS Quantum AI Agent that maintains the 3:1 quantum balance ratio (75% coherence, 25% exploration)." />
      </Helmet>
      
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8 text-center">Quantum AI Agent Dashboard</h1>
        
        <p className="text-muted-foreground mb-8 text-center max-w-2xl mx-auto">
          The Quantum AI Agent maintains a strict 3:1 quantum balance ratio (75% coherence, 25% exploration)
          for optimal performance in the WiltonOS system. Interact with the agent below to experience
          quantum-balanced AI responses.
        </p>
        
        <QuantumAIAgent />
      </div>
    </div>
  );
}