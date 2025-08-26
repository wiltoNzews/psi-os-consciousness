/**
 * Fractal Lemniscate Test Page
 * 
 * This page provides a testing interface for the Fractal Lemniscate Visualization
 * with controls to adjust parameters and test different configurations.
 */

import React, { useState, useEffect } from 'react';
import FractalLemniscateVisualization from '../components/FractalLemniscateVisualization';
import CoherenceRatioIndicator from '../components/CoherenceRatioIndicator';

// UI components
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Slider } from '../components/ui/slider';
import { Label } from '../components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { Switch } from '../components/ui/switch';

// Constants
const STABILITY_COHERENCE = 0.7500;  // 3:1 ratio
const EXPLORATION_COHERENCE = 0.2494; // 1:3 ratio

const FractalLemniscateTest = () => {
  // State for visualization parameters
  const [coherenceValue, setCoherenceValue] = useState(0.5);
  const [animate, setAnimate] = useState(false);
  const [showLabels, setShowLabels] = useState(true);
  const [showSecondaryLemniscates, setShowSecondaryLemniscates] = useState(true);
  const [depth, setDepth] = useState(2);
  const [oscillationMode, setOscillationMode] = useState('manual');
  
  // For automatic oscillation
  useEffect(() => {
    let intervalId;
    
    if (oscillationMode === 'automatic') {
      let direction = 1;
      let value = coherenceValue;
      
      intervalId = setInterval(() => {
        value += 0.01 * direction;
        
        // Reverse direction at boundaries
        if (value >= 1) {
          value = 1;
          direction = -1;
        } else if (value <= 0) {
          value = 0;
          direction = 1;
        }
        
        setCoherenceValue(value);
      }, 100);
    }
    
    return () => {
      if (intervalId) {
        clearInterval(intervalId);
      }
    };
  }, [oscillationMode, coherenceValue]);
  
  // Jump to specific coherence values
  const jumpToStability = () => {
    setCoherenceValue(STABILITY_COHERENCE);
    setOscillationMode('manual');
  };
  
  const jumpToExploration = () => {
    setCoherenceValue(EXPLORATION_COHERENCE);
    setOscillationMode('manual');
  };
  
  const jumpToMiddle = () => {
    setCoherenceValue(0.5);
    setOscillationMode('manual');
  };
  
  // Format number helper function
  const formatNumber = (value) => {
    return parseFloat(value.toFixed(4));
  };
  
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">Fractal Lemniscate Test</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main visualization */}
        <div className="lg:col-span-2">
          <FractalLemniscateVisualization 
            coherenceValue={coherenceValue}
            animate={animate}
            showLabels={showLabels}
            showSecondaryLemniscates={showSecondaryLemniscates}
            depth={depth}
          />
        </div>
        
        {/* Controls panel */}
        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle>Visualization Controls</CardTitle>
              <CardDescription>
                Adjust parameters to explore the fractal lemniscate pattern
              </CardDescription>
            </CardHeader>
            
            <CardContent className="space-y-6">
              {/* Coherence Value Slider */}
              <div className="space-y-2">
                <div className="flex justify-between">
                  <Label htmlFor="coherence">Coherence Value: {formatNumber(coherenceValue)}</Label>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-muted-foreground">Mode:</span>
                    <Button 
                      variant={oscillationMode === 'manual' ? "default" : "outline"}
                      size="sm" 
                      className="h-8 px-2 text-xs"
                      onClick={() => setOscillationMode('manual')}
                    >
                      Manual
                    </Button>
                    <Button 
                      variant={oscillationMode === 'automatic' ? "default" : "outline"} 
                      size="sm" 
                      className="h-8 px-2 text-xs"
                      onClick={() => setOscillationMode('automatic')}
                    >
                      Auto
                    </Button>
                  </div>
                </div>
                
                <Slider 
                  id="coherence"
                  value={[coherenceValue * 100]} 
                  min={0} 
                  max={100} 
                  step={1}
                  onValueChange={(value) => {
                    setCoherenceValue(value[0] / 100);
                    if (oscillationMode !== 'manual') {
                      setOscillationMode('manual');
                    }
                  }}
                  disabled={oscillationMode !== 'manual'}
                />
                
                <div className="flex justify-between gap-2 mt-2">
                  <Button size="sm" onClick={jumpToExploration} className="flex-1 bg-red-500 hover:bg-red-600">
                    Exploration ({EXPLORATION_COHERENCE})
                  </Button>
                  <Button size="sm" onClick={jumpToMiddle} className="flex-1 bg-green-500 hover:bg-green-600">
                    Middle (0.5000)
                  </Button>
                  <Button size="sm" onClick={jumpToStability} className="flex-1 bg-blue-500 hover:bg-blue-600">
                    Stability ({STABILITY_COHERENCE})
                  </Button>
                </div>
              </div>
              
              {/* Visualization options */}
              <div className="space-y-4">
                <h3 className="text-sm font-medium">Visualization Options</h3>
                
                <div className="flex items-center justify-between">
                  <Label htmlFor="animate">Internal Animation</Label>
                  <Switch 
                    id="animate" 
                    checked={animate} 
                    onCheckedChange={setAnimate}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <Label htmlFor="labels">Show Labels</Label>
                  <Switch 
                    id="labels" 
                    checked={showLabels} 
                    onCheckedChange={setShowLabels}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <Label htmlFor="secondary">Show Secondary Lemniscates</Label>
                  <Switch 
                    id="secondary" 
                    checked={showSecondaryLemniscates} 
                    onCheckedChange={setShowSecondaryLemniscates}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="depth">Fractal Depth: {depth}</Label>
                  <Slider 
                    id="depth"
                    value={[depth]} 
                    min={1} 
                    max={4} 
                    step={1}
                    onValueChange={(value) => setDepth(value[0])}
                    disabled={!showSecondaryLemniscates}
                  />
                </div>
              </div>
              
              {/* Coherence ratio indicator */}
              <div className="pt-4 border-t">
                <h3 className="text-sm font-medium mb-2">Coherence Ratio Indicator</h3>
                <CoherenceRatioIndicator value={coherenceValue} size="medium" />
              </div>
            </CardContent>
            
            <CardFooter className="justify-between">
              <div className="text-sm text-muted-foreground">
                Current Product: {formatNumber(coherenceValue * (1 / (1 - coherenceValue)))}
              </div>
              <Button 
                variant="outline" 
                onClick={() => {
                  setCoherenceValue(0.5);
                  setAnimate(false);
                  setShowLabels(true);
                  setShowSecondaryLemniscates(true);
                  setDepth(2);
                  setOscillationMode('manual');
                }}
              >
                Reset
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
      
      {/* Mathematical explanation */}
      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Mathematical Explanation</CardTitle>
          <CardDescription>
            The mathematics behind the lemniscate visualization and coherence ratios
          </CardDescription>
        </CardHeader>
        
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-lg font-semibold mb-2">Lemniscate of Bernoulli</h3>
              <p className="mb-2">
                The lemniscate curve is defined by the parametric equations:
              </p>
              <div className="bg-slate-100 dark:bg-slate-800 p-3 rounded-md font-mono">
                <p>x(t) = (a·cos(t)·cos(2t)) / (1 + sin²(t))</p>
                <p>y(t) = (a·sin(t)·cos(2t)) / (1 + sin²(t))</p>
              </div>
              <p className="mt-2">
                Where <code>a</code> is a scaling factor and <code>t</code> is the parameter that ranges from 0 to 2π.
              </p>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold mb-2">Coherence Thresholds</h3>
              <p className="mb-2">
                The key thresholds in the system are:
              </p>
              <ul className="list-disc pl-5 space-y-2">
                <li>
                  <span className="font-semibold text-blue-500">Stability Threshold:</span> {STABILITY_COHERENCE} (3:1 ratio)
                  <div className="text-sm">
                    {STABILITY_COHERENCE} ÷ {formatNumber(1 - STABILITY_COHERENCE)} = {formatNumber(STABILITY_COHERENCE / (1 - STABILITY_COHERENCE))}
                  </div>
                </li>
                <li>
                  <span className="font-semibold text-red-500">Exploration Threshold:</span> {EXPLORATION_COHERENCE} (1:3 ratio)
                  <div className="text-sm">
                    {EXPLORATION_COHERENCE} ÷ {formatNumber(1 - EXPLORATION_COHERENCE)} = {formatNumber(EXPLORATION_COHERENCE / (1 - EXPLORATION_COHERENCE))}
                  </div>
                </li>
                <li>
                  <span className="font-semibold text-purple-500">Coherence Product:</span> {formatNumber(STABILITY_COHERENCE * (1 / (1 - STABILITY_COHERENCE)))}
                  <div className="text-sm">
                    This value is approximately constant at both thresholds, creating the perfect oscillation cycle.
                  </div>
                </li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default FractalLemniscateTest;