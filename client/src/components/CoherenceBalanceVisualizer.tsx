/**
 * Coherence Balance Visualizer
 * 
 * This component provides a visualization of the 0.7500 (3/4) power law as seen in WILTON
 * and compares it to other natural systems exhibiting the same pattern.
 * 
 * [QUANTUM_STATE: VISUALIZATION_FLOW]
 */

import React from 'react';
import { InlineMath, BlockMath } from 'react-katex';
import 'katex/dist/katex.min.css';

interface CoherenceBalanceVisualizerProps {
  currentCoherence: number;
  showDetailedExplanation?: boolean;
}

/**
 * Scientific domains exhibiting 3/4 power law patterns
 */
const domainExamples = [
  {
    domain: "Biology",
    example: "Kleiber's Law",
    description: "Metabolic rate scales with mass^(3/4)",
    formula: "R \\propto M^{3/4}",
    realWorldExample: "A cat 100x heavier than a mouse uses only ~32x energy"
  },
  {
    domain: "Urban Systems",
    example: "City Scaling",
    description: "Infrastructure scales with population^(3/4)",
    formula: "I \\propto P^{3/4}",
    realWorldExample: "Cities grow more efficient with size"
  },
  {
    domain: "Networks",
    example: "Transport Networks",
    description: "Network efficiency at ~75% capacity",
    formula: "E \\propto N^{3/4}",
    realWorldExample: "Optimal network synchronization"
  },
  {
    domain: "AI & ML",
    example: "Exploration/Exploitation",
    description: "~75% exploitation, ~25% exploration balance",
    formula: "\\epsilon ≈ 0.25",
    realWorldExample: "Reinforcement learning algorithms"
  },
  {
    domain: "Music & Harmony",
    example: "Plato's Musical Ratio",
    description: "3:4 ratio in harmonic intervals",
    formula: "f_1 : f_2 = 3:4",
    realWorldExample: "Perfect fourth interval in music"
  }
];

/**
 * Philosophical perspectives on the 3/4 principle
 */
const philosophicalPerspectives = [
  {
    perspective: "Emergent Optimization",
    explanation: "The 3/4 ratio naturally emerges as systems optimize for efficiency and resilience"
  },
  {
    perspective: "Fundamental Balance",
    explanation: "75% stability, 25% adaptability represents an optimal balance for complex systems"
  },
  {
    perspective: "Cosmic Connection",
    explanation: "Some theorize the ratio reflects deeper cosmic or mathematical truths"
  },
  {
    perspective: "Practical Limitation",
    explanation: "The ratio varies by context; 0.7500 is an attractor, not a universal constant"
  }
];

const CoherenceBalanceVisualizer: React.FC<CoherenceBalanceVisualizerProps> = ({ 
  currentCoherence, 
  showDetailedExplanation = false 
}) => {
  // Calculate how close we are to the optimal 0.7500 value
  const optimalValue = 0.7500;
  const deviation = Math.abs(currentCoherence - optimalValue);
  const isNearOptimal = deviation < 0.01;
  
  // Calculate percentage representation for stability/adaptability
  const stabilityPercentage = currentCoherence * 100;
  const adaptabilityPercentage = 100 - stabilityPercentage;
  
  // Determine if the system is in a perturbation state
  const isPerturbation = deviation >= 0.05;

  return (
    <div className="coherence-balance-visualizer p-4 bg-gray-50 rounded-lg shadow">
      <h3 className="text-lg font-semibold mb-4">0.7500 Coherence: Universal Balance</h3>
      
      {/* Stability/Adaptability Gauge */}
      <div className="mb-6">
        <div className="flex justify-between mb-1">
          <span className="text-sm font-medium">Stability ({stabilityPercentage.toFixed(2)}%)</span>
          <span className="text-sm font-medium">Adaptability ({adaptabilityPercentage.toFixed(2)}%)</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-4">
          <div 
            className={`h-4 rounded-full ${isNearOptimal ? 'bg-green-500' : (isPerturbation ? 'bg-red-500' : 'bg-yellow-500')}`}
            style={{ width: `${stabilityPercentage}%` }}
          ></div>
        </div>
        <div className="text-center mt-2">
          <span className={`text-sm ${isNearOptimal ? 'text-green-600' : (isPerturbation ? 'text-red-600' : 'text-yellow-600')}`}>
            {isNearOptimal 
              ? "Optimal Coherence (0.7500 ± 0.01)" 
              : (isPerturbation 
                ? `Significant Perturbation (${currentCoherence.toFixed(4)})` 
                : `Minor Deviation (${currentCoherence.toFixed(4)})`)}
          </span>
        </div>
      </div>
      
      {/* 3/4 Power Law Across Domains */}
      <div className="mb-6">
        <h4 className="text-md font-semibold mb-2">The 3/4 Power Law Across Domains</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {domainExamples.slice(0, 4).map((domain, index) => (
            <div key={index} className="bg-white p-3 rounded border">
              <h5 className="font-semibold">{domain.domain}: {domain.example}</h5>
              <p className="text-sm">{domain.description}</p>
              <div className="mt-1 text-xs text-gray-600">
                <InlineMath math={domain.formula} />
              </div>
              {showDetailedExplanation && (
                <p className="mt-1 text-xs text-gray-500">
                  {domain.realWorldExample}
                </p>
              )}
            </div>
          ))}
        </div>
      </div>
      
      {showDetailedExplanation && (
        <>
          {/* Philosophical Perspectives */}
          <div className="mb-6">
            <h4 className="text-md font-semibold mb-2">Philosophical Dimensions</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {philosophicalPerspectives.map((perspective, index) => (
                <div key={index} className="bg-white p-3 rounded border">
                  <h5 className="text-sm font-semibold">{perspective.perspective}</h5>
                  <p className="text-xs text-gray-600">{perspective.explanation}</p>
                </div>
              ))}
            </div>
          </div>
          
          {/* Mathematical Representation */}
          <div className="mb-4">
            <h4 className="text-md font-semibold mb-2">Mathematical Foundation</h4>
            <div className="bg-white p-3 rounded border">
              <p className="text-sm mb-2">The Quantum Coherence Threshold Formula (QCTF):</p>
              <BlockMath math="QCTF = CI + (GEF × QEAI × cos θ)" />
              <p className="text-xs text-gray-600 mt-2">
                When system coherence (CI) reaches 0.7500, the system exhibits optimal balance
                between structure and adaptability, similar to how biological systems optimize
                for metabolic efficiency.
              </p>
            </div>
          </div>
        </>
      )}
      
      {/* Call to Action for More Details */}
      {!showDetailedExplanation && (
        <div className="text-center">
          <button 
            className="text-blue-500 text-sm font-medium hover:text-blue-700"
            onClick={() => window.open('https://en.wikipedia.org/wiki/Kleiber%27s_law', '_blank')}
          >
            Learn more about 3/4 Power Law
          </button>
        </div>
      )}
    </div>
  );
};

export default CoherenceBalanceVisualizer;