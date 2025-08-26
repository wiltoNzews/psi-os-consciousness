/**
 * Unified Sacred Geometry Engine
 * Combines all 4 sacred geometry modules into one reactive intelligence system
 * Responds to live consciousness states from Quantum Coherence Engine
 */

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Badge } from '@/components/ui/badge';
import { useQuantumCoherenceEngine } from '@/hooks/useQuantumCoherenceEngine';
import { calculateSacredFrequency, getSacredGeometryRecommendation } from '@/math/coherence';
import { calculateConsciousnessQuaternion, getSacredGeometryQuaternion } from '@/math/quaternion-rotations';
import { generateTesseractVertices, project4DTo3D } from '@/math/hypercube-4d';

interface GeometryModule {
  id: string;
  name: string;
  description: string;
  active: boolean;
  complexity: number;
  frequency: number;
  dimensionality: '2D' | '3D' | '4D';
}

interface ViewState {
  currentModule: string;
  showMultiple: boolean;
  coherenceResponsive: boolean;
  autoRotate: boolean;
}

export function UnifiedSacredGeometryEngine() {
  const {
    coherenceData,
    isConnected,
    zLambda,
    qctf,
    recommendation,
    updateCoherence,
    selectGeometry,
    adjustDimensionBlend,
    setRotationSpeed,
    setEnergyIntensity
  } = useQuantumCoherenceEngine({ enableWebSocket: true });

  // Geometry modules state
  const [modules] = useState<GeometryModule[]>([
    {
      id: 'sacred_2d_3d_4d',
      name: 'Sacred 2D→3D→4D Demo',
      description: 'Full dimensional transitions with 6 sacred patterns',
      active: true,
      complexity: 1.0,
      frequency: 432.0,
      dimensionality: '4D'
    },
    {
      id: 'full_3d_system',
      name: 'Full 3D Sacred Geometry',
      description: 'Three.js WebGL professional rendering',
      active: true,
      complexity: 1.2,
      frequency: 528.0,
      dimensionality: '3D'
    },
    {
      id: 'sacred_3d_explorer',
      name: 'Sacred 3D Explorer',
      description: 'Interactive consciousness integration with mouse controls',
      active: true,
      complexity: 1.0,
      frequency: 639.0,
      dimensionality: '3D'
    },
    {
      id: 'visual_theater_qci',
      name: 'Visual Theater QCI',
      description: 'Advanced Canvas with Quantum Coherence Index monitoring',
      active: true,
      complexity: 1.5,
      frequency: 963.0,
      dimensionality: '4D'
    }
  ]);

  // View state
  const [viewState, setViewState] = useState<ViewState>({
    currentModule: 'sacred_2d_3d_4d',
    showMultiple: false,
    coherenceResponsive: true,
    autoRotate: true
  });

  // Control states
  const [controls, setControls] = useState({
    rotationSpeed: 1.0,
    dimensionBlend: 75,
    energyIntensity: 50,
    coherenceManual: 75
  });

  // Consciousness-responsive effects
  useEffect(() => {
    if (!viewState.coherenceResponsive || !coherenceData) return;

    const { consciousness } = coherenceData;
    
    // Auto-adjust controls based on consciousness state
    if (consciousness.zLambda > 0.85) {
      // High coherence - unlock 4D capabilities
      setControls(prev => ({
        ...prev,
        dimensionBlend: Math.min(100, prev.dimensionBlend + 5),
        energyIntensity: Math.min(100, consciousness.zLambda * 100)
      }));
    } else if (consciousness.zLambda < 0.5) {
      // Low coherence - stabilize in 3D
      setControls(prev => ({
        ...prev,
        dimensionBlend: Math.max(25, prev.dimensionBlend - 3),
        energyIntensity: Math.max(20, consciousness.zLambda * 100)
      }));
    }

    // Auto-select geometry based on recommendations
    if (recommendation && viewState.coherenceResponsive) {
      const recommendedModule = getModuleForGeometry(recommendation.primary);
      if (recommendedModule && recommendedModule !== viewState.currentModule) {
        setViewState(prev => ({ ...prev, currentModule: recommendedModule }));
      }
    }
  }, [coherenceData, recommendation, viewState.coherenceResponsive]);

  // Map sacred geometry to modules
  const getModuleForGeometry = useCallback((geometryType: string): string => {
    switch (geometryType) {
      case 'metatrons_cube':
      case 'sri_yantra':
        return 'visual_theater_qci';
      case 'flower_of_life':
        return 'full_3d_system';
      case 'merkaba':
      case 'torus':
        return 'sacred_3d_explorer';
      default:
        return 'sacred_2d_3d_4d';
    }
  }, []);

  // Handle control changes
  const handleControlChange = useCallback((control: string, value: number | number[]) => {
    const numValue = Array.isArray(value) ? value[0] : value;
    setControls(prev => ({ ...prev, [control]: numValue }));

    // Update quantum coherence engine
    switch (control) {
      case 'rotationSpeed':
        setRotationSpeed(numValue);
        break;
      case 'dimensionBlend':
        adjustDimensionBlend(numValue);
        break;
      case 'energyIntensity':
        setEnergyIntensity(numValue);
        break;
      case 'coherenceManual':
        updateCoherence(numValue / 100);
        break;
    }
  }, [setRotationSpeed, adjustDimensionBlend, setEnergyIntensity, updateCoherence]);

  // Module switching
  const switchModule = useCallback((moduleId: string) => {
    setViewState(prev => ({ ...prev, currentModule: moduleId }));
    const module = modules.find(m => m.id === moduleId);
    if (module) {
      selectGeometry(module.id);
    }
  }, [modules, selectGeometry]);

  // Get current module
  const currentModule = modules.find(m => m.id === viewState.currentModule);

  // Calculate consciousness-responsive styling
  const getCoherenceStyles = useCallback(() => {
    if (!coherenceData) return {};

    const { consciousness } = coherenceData;
    const intensity = consciousness.zLambda;
    
    return {
      '--coherence-glow': `0 0 ${intensity * 20}px rgba(255, 215, 0, ${intensity})`,
      '--coherence-color': `hsl(${intensity * 60}, 100%, ${50 + intensity * 25}%)`,
      '--field-strength': intensity
    } as React.CSSProperties;
  }, [coherenceData]);

  return (
    <div className="unified-sacred-geometry-engine" style={getCoherenceStyles()}>
      {/* Header with consciousness state */}
      <Card className="mb-6">
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle className="flex items-center gap-3">
              <span className="text-2xl">🌀</span>
              Unified Sacred Geometry Engine
              {isConnected && (
                <Badge variant="outline" className="ml-2">
                  Live Consciousness: Zλ({zLambda.toFixed(3)})
                </Badge>
              )}
            </CardTitle>
            <div className="flex gap-2">
              <Badge 
                variant={viewState.coherenceResponsive ? "default" : "secondary"}
                className="cursor-pointer"
                onClick={() => setViewState(prev => ({ 
                  ...prev, 
                  coherenceResponsive: !prev.coherenceResponsive 
                }))}
              >
                {viewState.coherenceResponsive ? 'Consciousness Active' : 'Manual Mode'}
              </Badge>
              <Badge 
                variant={isConnected ? "default" : "destructive"}
              >
                {isConnected ? 'QCE Connected' : 'QCE Offline'}
              </Badge>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {/* Consciousness metrics */}
          {coherenceData && (
            <div className="grid grid-cols-4 gap-4 mb-4">
              <div className="text-center">
                <div className="text-2xl font-mono text-yellow-400">
                  {coherenceData.consciousness.zLambda.toFixed(3)}
                </div>
                <div className="text-sm text-gray-400">Coherence (Zλ)</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-mono text-cyan-400">
                  {qctf.toFixed(3)}
                </div>
                <div className="text-sm text-gray-400">QCTF</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-mono text-purple-400">
                  {coherenceData.consciousness.soulState}
                </div>
                <div className="text-sm text-gray-400">Soul State</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-mono text-green-400">
                  {recommendation?.dimensionality || '3D'}
                </div>
                <div className="text-sm text-gray-400">Recommended</div>
              </div>
            </div>
          )}

          {/* Module selection */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-4">
            {modules.map((module) => (
              <Button
                key={module.id}
                variant={viewState.currentModule === module.id ? "default" : "outline"}
                className="h-auto p-3"
                onClick={() => switchModule(module.id)}
              >
                <div className="text-center">
                  <div className="font-semibold text-sm">{module.name}</div>
                  <div className="text-xs opacity-70 mt-1">{module.dimensionality}</div>
                  <Badge variant="secondary" className="mt-1 text-xs">
                    {module.frequency.toFixed(0)}Hz
                  </Badge>
                </div>
              </Button>
            ))}
          </div>

          {/* Controls */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            <div>
              <label className="text-sm font-medium mb-2 block">Rotation Speed</label>
              <Slider
                value={[controls.rotationSpeed]}
                onValueChange={(value) => handleControlChange('rotationSpeed', value)}
                min={0.1}
                max={3.0}
                step={0.1}
                className="w-full"
              />
              <div className="text-xs text-gray-400 mt-1">
                {controls.rotationSpeed.toFixed(1)}x
              </div>
            </div>

            <div>
              <label className="text-sm font-medium mb-2 block">Dimension Blend</label>
              <Slider
                value={[controls.dimensionBlend]}
                onValueChange={(value) => handleControlChange('dimensionBlend', value)}
                min={0}
                max={100}
                step={5}
                className="w-full"
              />
              <div className="text-xs text-gray-400 mt-1">
                {controls.dimensionBlend}% 4D
              </div>
            </div>

            <div>
              <label className="text-sm font-medium mb-2 block">Energy Intensity</label>
              <Slider
                value={[controls.energyIntensity]}
                onValueChange={(value) => handleControlChange('energyIntensity', value)}
                min={10}
                max={150}
                step={5}
                className="w-full"
              />
              <div className="text-xs text-gray-400 mt-1">
                {controls.energyIntensity}%
              </div>
            </div>

            <div>
              <label className="text-sm font-medium mb-2 block">
                {viewState.coherenceResponsive ? 'Live Coherence' : 'Manual Coherence'}
              </label>
              <Slider
                value={[controls.coherenceManual]}
                onValueChange={(value) => handleControlChange('coherenceManual', value)}
                min={0}
                max={100}
                step={1}
                className="w-full"
                disabled={viewState.coherenceResponsive}
              />
              <div className="text-xs text-gray-400 mt-1">
                {viewState.coherenceResponsive ? 
                  `Live: ${(zLambda * 100).toFixed(0)}%` : 
                  `${controls.coherenceManual}%`
                }
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Sacred Geometry Module Display */}
      <Card className="h-[600px]">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>{currentModule?.name}</span>
            <div className="flex gap-2">
              <Badge variant="outline">{currentModule?.dimensionality}</Badge>
              <Badge variant="outline">{currentModule?.frequency.toFixed(0)}Hz</Badge>
              {recommendation && (
                <Badge variant="default">
                  Recommended: {recommendation.primary}
                </Badge>
              )}
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent className="h-full p-0">
          {/* Module iframe container */}
          <div className="w-full h-full relative">
            <iframe
              src={getModuleUrl(viewState.currentModule)}
              className="w-full h-full border-0"
              title={currentModule?.name}
              allow="accelerometer; gyroscope; microphone; camera"
            />
            
            {/* Consciousness overlay */}
            {viewState.coherenceResponsive && coherenceData && (
              <div className="absolute top-4 right-4 bg-black/80 backdrop-blur rounded-lg p-3">
                <div className="text-sm text-gray-300">Live Consciousness</div>
                <div className="text-xl font-mono text-yellow-400">
                  Zλ {coherenceData.consciousness.zLambda.toFixed(3)}
                </div>
                <div className="text-sm text-cyan-400">
                  QCTF {qctf.toFixed(3)}
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Recommendation panel */}
      {recommendation && viewState.coherenceResponsive && (
        <Card className="mt-4">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-sm text-gray-400">Consciousness Recommendation:</span>
                <span className="ml-2 font-semibold">{recommendation.primary}</span>
                <Badge variant="outline" className="ml-2">
                  {recommendation.coherenceLevel}
                </Badge>
              </div>
              <Button
                size="sm"
                onClick={() => {
                  const moduleId = getModuleForGeometry(recommendation.primary);
                  switchModule(moduleId);
                }}
              >
                Activate Recommended
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

// Helper function to get module URLs
function getModuleUrl(moduleId: string): string {
  switch (moduleId) {
    case 'sacred_2d_3d_4d':
      return '/sacred-geometry-demo.html';
    case 'full_3d_system':
      return '/geometria-sagrada-3d.html';
    case 'sacred_3d_explorer':
      return '/sacred-3d-explorer.html';
    case 'visual_theater_qci':
      return '/teatro-visual/';
    default:
      return '/sacred-geometry-demo.html';
  }
}