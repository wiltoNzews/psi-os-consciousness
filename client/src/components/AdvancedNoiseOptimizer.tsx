import React, { useState, useEffect } from 'react';
import { 
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
} from "./ui/card.jsx";
import { Button } from "./ui/button.jsx";
import { Slider } from "./ui/slider.jsx";
import { Progress } from "./ui/progress.jsx";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./ui/table.jsx";

// Define optimizer component props
interface AdvancedNoiseOptimizerProps {
  onNoiseConfigChange?: (noiseConfig: {
    baseNoiseLevel: number;
    stabilityGroupNoise: number;
    adaptabilityGroupNoise: number;
  }) => void;
  onFindOptimalNoise?: () => Promise<{
    baseNoiseLevel: number;
    stabilityGroupNoise: number;
    adaptabilityGroupNoise: number;
    stability: number;
    returnTime: number | null;
  }>;
  isOptimizing?: boolean;
  optimalNoiseFound?: {
    baseNoiseLevel: number;
    stabilityGroupNoise: number;
    adaptabilityGroupNoise: number;
    stability: number;
    returnTime: number | null;
  } | null;
  initialNoiseLevel?: number;
  returnTimeResults?: {
    targetCoherence: number;
    returnTime: number | null;
  }[];
}

const AdvancedNoiseOptimizer: React.FC<AdvancedNoiseOptimizerProps> = ({
  onNoiseConfigChange,
  onFindOptimalNoise,
  isOptimizing = false,
  optimalNoiseFound = null,
  initialNoiseLevel = 0.05,
  returnTimeResults = []
}) => {
  // State for noise levels
  const [baseNoiseLevel, setBaseNoiseLevel] = useState(initialNoiseLevel);
  const [stabilityRatio, setStabilityRatio] = useState(0.5); // 0.5x base noise
  const [adaptabilityRatio, setAdaptabilityRatio] = useState(1.5); // 1.5x base noise
  
  // Computed noise values
  const stabilityGroupNoise = baseNoiseLevel * stabilityRatio;
  const adaptabilityGroupNoise = baseNoiseLevel * adaptabilityRatio;
  
  // Update parent component when noise config changes
  useEffect(() => {
    if (onNoiseConfigChange) {
      onNoiseConfigChange({
        baseNoiseLevel,
        stabilityGroupNoise,
        adaptabilityGroupNoise
      });
    }
  }, [baseNoiseLevel, stabilityRatio, adaptabilityRatio, onNoiseConfigChange]);
  
  // Find optimal noise
  const handleFindOptimalNoise = async () => {
    if (onFindOptimalNoise) {
      const result = await onFindOptimalNoise();
      if (result) {
        setBaseNoiseLevel(result.baseNoiseLevel);
        // Derive ratios from result
        setStabilityRatio(result.stabilityGroupNoise / result.baseNoiseLevel);
        setAdaptabilityRatio(result.adaptabilityGroupNoise / result.baseNoiseLevel);
      }
    }
  };
  
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Noise Configuration</CardTitle>
          <CardDescription>
            Configure noise levels for stochastic resonance optimization.
            Moderate noise improves system adaptability around the 0.7500 attractor.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <div className="flex justify-between">
              <label htmlFor="base-noise" className="text-sm font-medium">
                Base Noise Level: {baseNoiseLevel.toFixed(3)}
              </label>
              <span className="text-sm text-gray-500">
                Optimal range: 0.04 - 0.08
              </span>
            </div>
            <Slider
              id="base-noise"
              min={0}
              max={0.2}
              step={0.001}
              value={[baseNoiseLevel]}
              onValueChange={(values) => setBaseNoiseLevel(values[0])}
            />
          </div>
          
          <div className="space-y-2">
            <div className="flex justify-between">
              <label htmlFor="stability-ratio" className="text-sm font-medium">
                Stability Group Ratio: {stabilityRatio.toFixed(2)}x
              </label>
              <span className="text-sm text-gray-500">
                Applied Noise: {stabilityGroupNoise.toFixed(3)}
              </span>
            </div>
            <Slider
              id="stability-ratio"
              min={0.1}
              max={1.0}
              step={0.05}
              value={[stabilityRatio]}
              onValueChange={(values) => setStabilityRatio(values[0])}
            />
          </div>
          
          <div className="space-y-2">
            <div className="flex justify-between">
              <label htmlFor="adaptability-ratio" className="text-sm font-medium">
                Adaptability Group Ratio: {adaptabilityRatio.toFixed(2)}x
              </label>
              <span className="text-sm text-gray-500">
                Applied Noise: {adaptabilityGroupNoise.toFixed(3)}
              </span>
            </div>
            <Slider
              id="adaptability-ratio"
              min={1.0}
              max={2.0}
              step={0.05}
              value={[adaptabilityRatio]}
              onValueChange={(values) => setAdaptabilityRatio(values[0])}
            />
          </div>
        </CardContent>
        <CardFooter className="justify-between">
          <Button
            variant="outline"
            onClick={() => {
              setBaseNoiseLevel(0.05);
              setStabilityRatio(0.5);
              setAdaptabilityRatio(1.5);
            }}
          >
            Reset to Defaults
          </Button>
          
          <Button
            onClick={handleFindOptimalNoise}
            disabled={isOptimizing}
          >
            {isOptimizing ? 'Optimizing...' : 'Find Optimal Noise'}
          </Button>
        </CardFooter>
      </Card>
      
      {isOptimizing && (
        <Card>
          <CardHeader>
            <CardTitle>Optimization in Progress</CardTitle>
            <CardDescription>
              Testing different noise configurations to find the optimal balance
              that maximizes coherence stability around the 0.7500 attractor.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Progress value={Math.random() * 100} className="my-2" />
            <p className="text-sm text-gray-500 italic">
              This process tests multiple noise configurations and measures the system's
              ability to maintain coherence near 0.7500.
            </p>
          </CardContent>
        </Card>
      )}
      
      {optimalNoiseFound && (
        <Card>
          <CardHeader>
            <CardTitle>Optimal Noise Configuration Found</CardTitle>
            <CardDescription>
              The optimal noise configuration that maximizes stability around the 0.7500 attractor.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <p className="text-sm font-medium">Base Noise Level</p>
                  <p className="text-2xl font-bold">{optimalNoiseFound.baseNoiseLevel.toFixed(4)}</p>
                </div>
                <div className="space-y-2">
                  <p className="text-sm font-medium">Measured Stability</p>
                  <p className="text-2xl font-bold">{optimalNoiseFound.stability.toFixed(4)}</p>
                </div>
                <div className="space-y-2">
                  <p className="text-sm font-medium">Stability Group Noise</p>
                  <p className="text-lg">{optimalNoiseFound.stabilityGroupNoise.toFixed(4)}</p>
                </div>
                <div className="space-y-2">
                  <p className="text-sm font-medium">Adaptability Group Noise</p>
                  <p className="text-lg">{optimalNoiseFound.adaptabilityGroupNoise.toFixed(4)}</p>
                </div>
                <div className="space-y-2 col-span-2">
                  <p className="text-sm font-medium">Return Time After Perturbation</p>
                  <p className="text-lg">
                    {optimalNoiseFound.returnTime !== null 
                      ? `${optimalNoiseFound.returnTime} cycles` 
                      : 'Did not return within test period'}
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
      
      {returnTimeResults.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Return Time Measurements</CardTitle>
            <CardDescription>
              Measurements of how quickly the system returns to the 0.7500 attractor
              after perturbation to different coherence values.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableCaption>
                Return time measured in cycles (lower is better)
              </TableCaption>
              <TableHeader>
                <TableRow>
                  <TableHead>Target Coherence</TableHead>
                  <TableHead>Return Time</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {returnTimeResults.map((result, index) => (
                  <TableRow key={index}>
                    <TableCell>{result.targetCoherence.toFixed(4)}</TableCell>
                    <TableCell>
                      {result.returnTime !== null 
                        ? `${result.returnTime} cycles` 
                        : 'Did not return'}
                    </TableCell>
                    <TableCell>
                      {result.returnTime !== null 
                        ? (result.returnTime < 15 
                            ? <span className="text-green-500">Good</span>
                            : result.returnTime < 30 
                              ? <span className="text-amber-500">Fair</span>
                              : <span className="text-red-500">Poor</span>)
                        : <span className="text-red-500">Failed</span>}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            
            <div className="mt-4">
              <p className="text-sm text-gray-500 italic">
                Shorter return times indicate a more resilient system with better
                stochastic resonance characteristics. Optimal return time is typically
                under 10 cycles.
              </p>
            </div>
          </CardContent>
        </Card>
      )}
      
      <Card>
        <CardHeader>
          <CardTitle>Stochastic Resonance Theory</CardTitle>
          <CardDescription>
            Understanding the role of noise in stabilizing the 0.7500 coherence attractor
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="space-y-2">
              <h3 className="text-lg font-medium">The 0.7500 Coherence Paradox</h3>
              <p className="text-gray-700">
                Moderate noise levels (0.04-0.08) paradoxically enhance stability around the
                0.7500 coherence attractor rather than disrupting it. This follows from 
                stochastic resonance principles observed across complex adaptive systems.
              </p>
            </div>
            
            <div className="space-y-2">
              <h3 className="text-lg font-medium">Optimizing Oscillator Groups</h3>
              <p className="text-gray-700">
                The 3:1 ↔ 1:3 Ouroboros cycle requires different noise profiles for stability
                vs. adaptability oscillator groups. Stability oscillators typically benefit from
                lower noise (0.5x base), while adaptability oscillators need higher noise (1.5x base).
              </p>
            </div>
            
            <div className="space-y-2">
              <h3 className="text-lg font-medium">Emergent Properties</h3>
              <p className="text-gray-700">
                At optimal noise levels, the system exhibits:
              </p>
              <ul className="list-disc list-inside text-gray-700 space-y-1">
                <li>Faster return to 0.7500 after perturbation</li>
                <li>Greater resistance to decoherence forces</li>
                <li>Increased stability during phase transitions (3:1 ↔ 1:3)</li>
                <li>Enhanced detection of subtle coherence patterns</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdvancedNoiseOptimizer;