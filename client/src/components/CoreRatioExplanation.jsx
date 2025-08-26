/**
 * Core Ratio Explanation Component
 * 
 * Provides a detailed explanation of the 3:1 ↔ 1:3 ratio
 * and the Quantum Coherence Threshold Formula.
 */

import React from 'react';

// Constants for thresholds and calculations
const STABILITY_COHERENCE = 0.7500;
const EXPLORATION_COHERENCE = 0.2494;
const COHERENCE_PRODUCT = STABILITY_COHERENCE * (1 / EXPLORATION_COHERENCE);

// Helper function to format numbers
const formatNumber = (value) => {
  return parseFloat(value.toFixed(4));
};

// Import UI components
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Separator } from './ui/separator';

const CoreRatioExplanation = () => {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>The 3:1 ↔ 1:3 Coherence Ratio</CardTitle>
          <CardDescription>
            Fundamental mathematical principle underlying quantum coherence thresholds
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <p>
            The Quantum Coherence Threshold Formula (QCTF) is based on a fundamental mathematical ratio that governs 
            the balance between stability and exploration in complex systems. This ratio is expressed as 3:1 ↔ 1:3,
            which creates a perfect feedback loop between order and chaos.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
            <div className="rounded-lg border p-4">
              <h3 className="text-lg font-semibold mb-2 text-blue-600">Stability Threshold (3:1)</h3>
              <p className="mb-2">
                When the coherence value reaches <span className="font-mono bg-blue-100 dark:bg-blue-900 px-1 rounded">{STABILITY_COHERENCE}</span>, 
                the ratio between coherence and its inverse is exactly 3:1
              </p>
              
              <div className="font-mono bg-gray-100 dark:bg-gray-800 p-3 rounded">
                <p>Coherence: {STABILITY_COHERENCE}</p>
                <p>Inverse: {formatNumber(1 - STABILITY_COHERENCE)}</p>
                <p className="mt-2">Ratio: {formatNumber(STABILITY_COHERENCE / (1 - STABILITY_COHERENCE))} (3:1)</p>
              </div>
            </div>
            
            <div className="rounded-lg border p-4">
              <h3 className="text-lg font-semibold mb-2 text-red-600">Exploration Threshold (1:3)</h3>
              <p className="mb-2">
                When the coherence value reaches <span className="font-mono bg-red-100 dark:bg-red-900 px-1 rounded">{EXPLORATION_COHERENCE}</span>, 
                the ratio between coherence and its inverse is exactly 1:3
              </p>
              
              <div className="font-mono bg-gray-100 dark:bg-gray-800 p-3 rounded">
                <p>Coherence: {EXPLORATION_COHERENCE}</p>
                <p>Inverse: {formatNumber(1 - EXPLORATION_COHERENCE)}</p>
                <p className="mt-2">Ratio: {formatNumber(EXPLORATION_COHERENCE / (1 - EXPLORATION_COHERENCE))} (1:3)</p>
              </div>
            </div>
          </div>
          
          <Separator className="my-4" />
          
          <h3 className="text-xl font-semibold">The Perfect Cycle</h3>
          
          <p className="mb-4">
            The remarkable property of this ratio system is that both thresholds (3:1 and 1:3) produce the same 
            product when multiplying coherence by the inverse ratio. This constant value of approximately {formatNumber(COHERENCE_PRODUCT)} 
            creates a perfect oscillation cycle.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="font-mono bg-gray-100 dark:bg-gray-800 p-3 rounded">
              <p className="font-semibold">At Stability Threshold:</p>
              <p>Coherence: {STABILITY_COHERENCE}</p>
              <p>Inverse Ratio: {formatNumber(1 / (1 - STABILITY_COHERENCE))}</p>
              <p className="mt-2">Product: {formatNumber(STABILITY_COHERENCE * (1 / (1 - STABILITY_COHERENCE)))}</p>
            </div>
            
            <div className="font-mono bg-gray-100 dark:bg-gray-800 p-3 rounded">
              <p className="font-semibold">At Exploration Threshold:</p>
              <p>Coherence: {EXPLORATION_COHERENCE}</p>
              <p>Inverse Ratio: {formatNumber(1 / (1 - EXPLORATION_COHERENCE))}</p>
              <p className="mt-2">Product: {formatNumber(EXPLORATION_COHERENCE * (1 / (1 - EXPLORATION_COHERENCE)))}</p>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>Brazilian Wave Protocol</CardTitle>
          <CardDescription>
            Implementation of the 3:1 ↔ 1:3 ratio across multiple temporal scales
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <p>
            The Brazilian Wave Protocol implements the QCTF across three temporal scales: micro, meso, and macro. 
            This creates nested oscillation patterns that maintain the 3:1 ↔ 1:3 ratio at each level.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="rounded-lg border p-4">
              <h3 className="text-lg font-semibold mb-2 text-red-600">Micro Scale</h3>
              <p>
                Fast oscillations (moments, seconds) that process immediate data and reactions. 
                Maintains a base frequency 4× faster than the meso scale.
              </p>
            </div>
            
            <div className="rounded-lg border p-4">
              <h3 className="text-lg font-semibold mb-2 text-green-600">Meso Scale</h3>
              <p>
                Medium oscillations (minutes, hours) that handle the primary coherence calibration.
                Serves as the reference scale for the system.
              </p>
            </div>
            
            <div className="rounded-lg border p-4">
              <h3 className="text-lg font-semibold mb-2 text-blue-600">Macro Scale</h3>
              <p>
                Slow oscillations (days, weeks) that provide long-term stability and drift correction.
                Operates at 0.25× the frequency of the meso scale.
              </p>
            </div>
          </div>
          
          <Separator className="my-4" />
          
          <h3 className="text-xl font-semibold">Wave Modes</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
            <div className="rounded-lg border p-4">
              <h4 className="font-semibold">Harmonic Mode</h4>
              <p>Regular, balanced oscillations with moderate variability</p>
            </div>
            
            <div className="rounded-lg border p-4">
              <h4 className="font-semibold">Chaotic Mode</h4>
              <p>Higher variability, exploratory oscillations with multiple competing frequencies</p>
            </div>
            
            <div className="rounded-lg border p-4">
              <h4 className="font-semibold">Resonant Mode</h4>
              <p>Golden ratio (φ) based oscillations that amplify specific temporal patterns</p>
            </div>
            
            <div className="rounded-lg border p-4">
              <h4 className="font-semibold">Quantum Mode</h4>
              <p>Direct implementation of quantum coherence principles with precise threshold targeting</p>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>Mathematical Formula</CardTitle>
          <CardDescription>
            Technical details of the QCTF calculation
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <p>
            The Quantum Coherence Threshold Formula performs three stages of calculation:
          </p>
          
          <div className="grid grid-cols-1 gap-4">
            <div className="rounded-lg border p-4">
              <h3 className="text-lg font-semibold mb-2">1. Raw Score Calculation</h3>
              <p className="mb-2">The raw coherence score is calculated using multiple input parameters:</p>
              <div className="font-mono bg-gray-100 dark:bg-gray-800 p-3 rounded">
                <p>RawCoherence = (globalEfficiencyFactor * quantumEnergyImpulse)</p>
                <p>+ (coherenceIndex * functionalIntegration)</p>
                <p>- (togglesPerSecond * 0.05)</p>
                <p>+ (determinism * 0.2)</p>
                <p>- (entropyLevel * 0.1)</p>
              </div>
            </div>
            
            <div className="rounded-lg border p-4">
              <h3 className="text-lg font-semibold mb-2">2. Smoothing</h3>
              <p className="mb-2">The raw score is temporally smoothed using an exponential weighted moving average:</p>
              <div className="font-mono bg-gray-100 dark:bg-gray-800 p-3 rounded">
                <p>SmoothedCoherence = (alpha * RawCoherence) + ((1 - alpha) * PreviousCoherence)</p>
                <p>where alpha = 0.1 for macro, 0.3 for meso, 0.6 for micro</p>
              </div>
            </div>
            
            <div className="rounded-lg border p-4">
              <h3 className="text-lg font-semibold mb-2">3. Normalization</h3>
              <p className="mb-2">The smoothed value is normalized to ensure it stays within the 0-1 range:</p>
              <div className="font-mono bg-gray-100 dark:bg-gray-800 p-3 rounded">
                <p>NormalizedCoherence = (SmoothedCoherence - minPossible) / (maxPossible - minPossible)</p>
                <p>FinalCoherence = max(0, min(1, NormalizedCoherence))</p>
              </div>
            </div>
            
            <div className="rounded-lg border p-4">
              <h3 className="text-lg font-semibold mb-2">Notable Properties</h3>
              <ul className="list-disc pl-5 space-y-1">
                <li>The system naturally oscillates between the two thresholds ({STABILITY_COHERENCE} and {EXPLORATION_COHERENCE})</li>
                <li>Stability corresponds to 75% coherence, 25% non-coherence</li>
                <li>Exploration corresponds to 25% coherence, 75% non-coherence</li>
                <li>The product of coherence × inverse ratio = {formatNumber(COHERENCE_PRODUCT)} at both thresholds</li>
                <li>The Brazilian Wave Protocol maintains phase separation across temporal scales</li>
              </ul>
            </div>
          </div>
        </CardContent>
        <CardFooter>
          <p className="text-sm text-muted-foreground">
            Implementation note: The Coherence Calculator engine uses all three temporal scales simultaneously, 
            with each scale providing different weights to the final combined coherence value.
          </p>
        </CardFooter>
      </Card>
    </div>
  );
};

export default CoreRatioExplanation;