/**
 * Quantum Experiments Page
 * 
 * This page serves as a container for quantum-related experiments, including
 * the Quantum Intent Experiment which tests if collective human intent can
 * influence quantum probability distributions.
 * 
 * [QUANTUM_STATE: BRIDGE_FLOW]
 */

import React from 'react';
import IntentExperiment from '@/components/quantum/IntentExperiment';
import WebSocketTester from '@/components/quantum/WebSocketTester';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const QuantumExperimentsPage: React.FC = () => {
  return (
    <div className="container mx-auto">
      <h1 className="text-3xl font-bold mb-8">Quantum Consciousness Lab</h1>
      
      <p className="mb-8 text-lg">
        Welcome to the Quantum Consciousness Laboratory, where we explore the relationship between human
        consciousness and quantum probability distributions through a series of controlled experiments.
      </p>
      
      <Tabs defaultValue="intent-experiment" className="w-full">
        <TabsList className="mb-6">
          <TabsTrigger value="intent-experiment">Intent Experiment</TabsTrigger>
          <TabsTrigger value="websocket-tester">WebSocket Tester</TabsTrigger>
          <TabsTrigger value="about">About Quantum Consciousness</TabsTrigger>
        </TabsList>
        
        <TabsContent value="intent-experiment">
          <IntentExperiment />
        </TabsContent>

        <TabsContent value="websocket-tester">
          <div className="mb-4">
            <h2 className="text-2xl font-semibold mb-2">WebSocket Diagnostic Tool</h2>
            <p className="text-muted-foreground">
              This tool allows you to test the WebSocket connection and message handling. 
              Use it to diagnose connection issues or verify server responses.
            </p>
          </div>
          <WebSocketTester />
        </TabsContent>
        
        <TabsContent value="about">
          <div className="prose max-w-none dark:prose-invert">
            <h2>About Quantum Consciousness Research</h2>
            
            <p>
              Quantum Consciousness Theory proposes that quantum mechanics plays a role in the functioning of 
              the human mind, and that consciousness may interact with quantum systems in ways not fully 
              understood by conventional physics.
            </p>
            
            <h3>The Science Behind Our Experiments</h3>
            
            <p>
              Our experiments test whether collective human intention can measurably influence quantum 
              probability distributions. We use the following formulas to analyze the results:
            </p>
            
            <ol>
              <li>
                <strong>Quantum Consciousness Operator Formula:</strong>
                <br />
                Ω = N * avgIntent * coherence<sup>1.5</sup>
                <br />
                <em>Where N is the number of participants, avgIntent is the average intention strength, 
                and coherence is the group's coherence level.</em>
              </li>
              
              <li>
                <strong>Quantum Hamiltonian Interaction:</strong>
                <br />
                H<sub>int</sub> = Q * Ω * σ<sub>z</sub> * ψ₀
                <br />
                <em>Where Q is a coupling constant, Ω is the consciousness operator value, 
                σ<sub>z</sub> is the Pauli z-operator, and ψ₀ is the initial quantum state.</em>
              </li>
              
              <li>
                <strong>Probability Shift Equation:</strong>
                <br />
                ΔP = (intent_mean - control_mean)
                <br />
                <em>Measuring the difference between the experimental group's results and the control group.</em>
              </li>
            </ol>
            
            <h3>Quantum Decoherence and Measurement</h3>
            
            <p>
              In quantum mechanics, the act of measurement causes a quantum system to "decohere" from a
              superposition of possible states into a single defined state. Our hypothesis suggests that
              consciousness may influence which state the system collapses into during this decoherence
              process.
            </p>
            
            <p>
              The experiments we conduct look for statistical deviations from expected random
              probability distributions in quantum systems that are targeted by focused human intention.
            </p>
            
            <h3>Participation Guidelines</h3>
            
            <ul>
              <li>Focus your intention clearly on the target outcome</li>
              <li>Maintain a consistent mental state throughout the experiment</li>
              <li>Note any unusual mental experiences during the session</li>
              <li>Complete the full duration of each experiment when possible</li>
              <li>Provide honest feedback about your subjective experience</li>
            </ul>
            
            <h3>Research Implications</h3>
            
            <p>
              If consciousness can indeed influence quantum systems, the implications are profound for our
              understanding of reality, free will, and the relationship between mind and matter. These
              experiments contribute to a growing body of research at the intersection of quantum physics
              and consciousness studies.
            </p>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default QuantumExperimentsPage;