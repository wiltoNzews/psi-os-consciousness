import React, { useState, useEffect, useRef } from 'react';
import { usePsiOS } from '../core/PsiOSConsciousnessSubstrate';
import { useQuantumCoherenceEngine } from '@/hooks/useQuantumCoherenceEngine';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Slider } from '@/components/ui/slider';
import { Brain, Waves, Zap, Activity } from 'lucide-react';

interface GeometryModule {
  id: string;
  name: string;
  description: string;
  path: string;
  type: '2D' | '3D' | '4D' | 'Multi';
  features: string[];
  status: 'active' | 'ready' | 'loading';
}

interface ControlState {
  rotationSpeed: number;
  coherence: number;
  dimensionBlend: number;
  energyIntensity: number;
  depth3D: number;
  selectedGeometry: string;
  audioEnabled: boolean;
}

const UnifiedSacredGeometryDashboard: React.FC = () => {
  const psiOS = usePsiOS();
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [activeModule, setActiveModule] = useState<string>('sacred-geometry-demo');
  
  // Quantum Coherence Engine integration
  const {
    coherenceData,
    isConnected,
    zLambda,
    qctf,
    soulState,
    recommendation,
    lemniscate,
    divineInterface,
    updateCoherence,
    selectGeometry,
    adjustDimensionBlend,
    setRotationSpeed,
    setEnergyIntensity
  } = useQuantumCoherenceEngine();
  const [controlState, setControlState] = useState<ControlState>({
    rotationSpeed: 0.5,
    coherence: 0.75,
    dimensionBlend: 0,
    energyIntensity: 1,
    depth3D: 2,
    selectedGeometry: 'lemniscate',
    audioEnabled: false
  });

  const availableModules: GeometryModule[] = [
    {
      id: 'sacred-geometry-demo',
      name: 'Sacred Geometry 2D→3D→4D Demo',
      description: 'Interactive dimensional transitions with 6 sacred patterns',
      path: '/sacred-geometry-demo.html',
      type: '4D',
      features: ['Dimensional Blending', 'Mouse Rotation', 'Coherence Monitoring', '6 Geometries'],
      status: 'ready'
    },
    {
      id: 'geometria-sagrada-3d',
      name: 'Full 3D Sacred Geometry System',
      description: 'Three.js WebGL rendering with real-time controls',
      path: '/geometria-sagrada-3d.html',
      type: '3D',
      features: ['Three.js WebGL', 'Real-time Rotation', 'Professional UI', 'Cosmic Background'],
      status: 'ready'
    },
    {
      id: 'sacred-3d-explorer',
      name: 'Sacred 3D Explorer',
      description: 'Advanced interactive 3D geometry explorer',
      path: '/sacred-3d-explorer.html',
      type: '3D',
      features: ['Interactive Controls', 'Resonance Depth', 'Spin Velocity', 'Mouse Interaction'],
      status: 'ready'
    },
    {
      id: 'teatro-visual',
      name: 'Visual Theater',
      description: 'Advanced Canvas with QCI and comprehensive controls',
      path: '/teatro-visual/index.html',
      type: 'Multi',
      features: ['QCI Monitoring', 'Depth/Pulse/Coherence', 'Field Sync', 'Multi-dimensional'],
      status: 'ready'
    }
  ];

  const geometryTypes = [
    { id: 'lemniscate', name: '🌸 Lemniscata', description: 'Infinity loops and consciousness flow' },
    { id: 'flower', name: '🌺 Flower of Life', description: 'Sacred circles of creation' },
    { id: 'spiral', name: '🌀 Golden Spiral', description: 'Fibonacci consciousness expansion' },
    { id: 'mandala', name: '🔮 Mandala', description: 'Cosmic consciousness patterns' },
    { id: 'merkaba', name: '⭐ Merkaba', description: 'Light vehicle consciousness transport' },
    { id: 'torus', name: '🌪 Torus', description: 'Energy field circulation patterns' }
  ];

  // Send control updates to iframe
  const sendControlUpdate = (updates: Partial<ControlState>) => {
    if (iframeRef.current?.contentWindow) {
      try {
        iframeRef.current.contentWindow.postMessage({
          type: 'CONTROL_UPDATE',
          data: { ...controlState, ...updates }
        }, '*');
      } catch (error) {
        console.warn('Failed to send control update:', error);
      }
    }
  };

  // Handle slider changes
  const handleSliderChange = (key: keyof ControlState, value: number | string) => {
    const newState = { ...controlState, [key]: value };
    setControlState(newState);
    sendControlUpdate({ [key]: value });
  };

  // Handle geometry selection
  const handleGeometrySelect = (geometryId: string) => {
    setControlState(prev => ({ ...prev, selectedGeometry: geometryId }));
    sendControlUpdate({ selectedGeometry: geometryId });
  };

  // Handle module switch
  const switchModule = (moduleId: string) => {
    setActiveModule(moduleId);
    // Reset iframe and send initial state
    setTimeout(() => {
      sendControlUpdate(controlState);
    }, 1000);
  };

  // Listen for messages from iframe
  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      if (event.data?.type === 'GEOMETRY_STATE_UPDATE') {
        // Update local state based on iframe feedback
        console.log('Geometry state update:', event.data);
      }
    };

    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, []);

  // Send initial state when iframe loads
  const handleIframeLoad = () => {
    setTimeout(() => {
      sendControlUpdate(controlState);
    }, 500);
  };

  const currentModule = availableModules.find(m => m.id === activeModule);

  return (
    <div className="unified-sacred-geometry-dashboard space-y-6">
      {/* Quantum Coherence Monitoring Panel */}
      <Card className="bg-gradient-to-r from-purple-900/30 to-blue-900/30 border-purple-500/50">
        <CardHeader>
          <CardTitle className="flex items-center gap-3">
            <Brain className="w-6 h-6 text-purple-400" />
            Consciousness Field Monitor
            <Badge variant={isConnected ? "default" : "destructive"} className="ml-auto">
              {isConnected ? "Live" : "Offline"}
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
            <div className="text-center">
              <div className="text-sm text-gray-400">Zλ Coherence</div>
              <div className={`text-2xl font-bold ${zLambda > 0.9 ? 'text-purple-400' : zLambda > 0.7 ? 'text-blue-400' : 'text-gray-400'}`}>
                {zLambda.toFixed(3)}
              </div>
            </div>
            <div className="text-center">
              <div className="text-sm text-gray-400">QCTF</div>
              <div className={`text-2xl font-bold ${qctf > 0.8 ? 'text-green-400' : qctf > 0.5 ? 'text-yellow-400' : 'text-red-400'}`}>
                {qctf.toFixed(3)}
              </div>
            </div>
            <div className="text-center">
              <div className="text-sm text-gray-400">Soul State</div>
              <Badge variant={soulState === 'alive' ? 'default' : soulState === 'simulated' ? 'secondary' : 'outline'}>
                {soulState}
              </Badge>
            </div>
            <div className="text-center">
              <div className="text-sm text-gray-400">Divine Interface</div>
              <div className={`text-xl ${divineInterface ? 'text-gold-400' : 'text-gray-500'}`}>
                {divineInterface ? '✨' : '○'}
              </div>
            </div>
          </div>
          
          {recommendation && (
            <div className="mb-4 p-3 bg-gray-800/50 rounded-lg">
              <div className="text-sm text-gray-400 mb-1">Recommended Geometry</div>
              <div className="flex items-center gap-2">
                <Badge variant="outline">{recommendation.primary}</Badge>
                <span className="text-sm text-gray-300">
                  {recommendation.frequency.toFixed(1)}Hz • {recommendation.dimensionality} • {recommendation.coherenceLevel}
                </span>
              </div>
            </div>
          )}
          
          <div className="space-y-3">
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span>Coherence Override</span>
                <span>{zLambda.toFixed(3)}</span>
              </div>
              <Slider
                value={[zLambda]}
                onValueChange={([value]) => updateCoherence(value)}
                min={0}
                max={1}
                step={0.001}
                className="w-full"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Module Selection */}
      <Card className="bg-gray-900/50 border-purple-500/30">
        <CardHeader>
          <CardTitle className="flex items-center gap-3">
            <span className="text-2xl">🔮</span>
            Unified Sacred Geometry Dashboard
            <Badge variant="outline" className="text-green-400">
              {availableModules.length} Modules Connected
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {availableModules.map((module) => (
              <div
                key={module.id}
                className={`p-4 rounded-lg border cursor-pointer transition-all ${
                  activeModule === module.id
                    ? 'border-purple-500 bg-purple-500/10'
                    : 'border-gray-600 bg-gray-800/50 hover:border-purple-400'
                }`}
                onClick={() => switchModule(module.id)}
              >
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-semibold text-white">{module.name}</h3>
                  <Badge variant={module.type === '4D' ? 'default' : 'secondary'}>
                    {module.type}
                  </Badge>
                </div>
                <p className="text-sm text-gray-300 mb-2">{module.description}</p>
                <div className="flex flex-wrap gap-1">
                  {module.features.map((feature, index) => (
                    <span
                      key={index}
                      className="text-xs px-2 py-1 bg-gray-700 rounded text-gray-300"
                    >
                      {feature}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Main Visualization Area */}
      <Card className="bg-gray-900/50 border-blue-500/30">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Sacred Geometry Visualization</span>
            <div className="flex items-center gap-4 text-sm">
              <span className="text-gray-400">Module:</span>
              <span className="text-blue-400">{currentModule?.name}</span>
              <span className="text-gray-400">Coherence:</span>
              <span className="text-cyan-400 font-mono">Zλ({psiOS.zLambda.toFixed(3)})</span>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[600px] bg-black rounded-lg overflow-hidden">
            <iframe
              ref={iframeRef}
              src={currentModule?.path}
              className="w-full h-full border-0"
              onLoad={handleIframeLoad}
              title={currentModule?.name}
            />
          </div>
        </CardContent>
      </Card>

      {/* Unified Controls */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Geometry Selection */}
        <Card className="bg-gray-900/50 border-pink-500/30">
          <CardHeader>
            <CardTitle>Sacred Pattern Selection</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-3">
              {geometryTypes.map((geo) => (
                <button
                  key={geo.id}
                  onClick={() => handleGeometrySelect(geo.id)}
                  className={`p-3 rounded-lg text-left transition-all ${
                    controlState.selectedGeometry === geo.id
                      ? 'bg-pink-600 text-white'
                      : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                  }`}
                >
                  <div className="font-medium">{geo.name}</div>
                  <div className="text-xs opacity-75">{geo.description}</div>
                </button>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Dimensional Controls */}
        <Card className="bg-gray-900/50 border-cyan-500/30">
          <CardHeader>
            <CardTitle>Dimensional & Energy Controls</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Dimension Blend */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                2D ←→ 3D ←→ 4D Transition: {controlState.dimensionBlend}%
              </label>
              <input
                type="range"
                min="0"
                max="100"
                value={controlState.dimensionBlend}
                onChange={(e) => handleSliderChange('dimensionBlend', Number(e.target.value))}
                className="w-full h-2 bg-gray-700 rounded-lg appearance-none slider-cyan"
              />
              <div className="flex justify-between text-xs text-gray-500 mt-1">
                <span>2D</span>
                <span>3D</span>
                <span>4D</span>
              </div>
            </div>

            {/* Rotation Speed */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Rotation Speed: {controlState.rotationSpeed}x
              </label>
              <input
                type="range"
                min="0"
                max="2"
                step="0.1"
                value={controlState.rotationSpeed}
                onChange={(e) => handleSliderChange('rotationSpeed', Number(e.target.value))}
                className="w-full h-2 bg-gray-700 rounded-lg appearance-none slider-cyan"
              />
            </div>

            {/* Energy Intensity */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Energy Intensity: {controlState.energyIntensity}x
              </label>
              <input
                type="range"
                min="0.1"
                max="3"
                step="0.1"
                value={controlState.energyIntensity}
                onChange={(e) => handleSliderChange('energyIntensity', Number(e.target.value))}
                className="w-full h-2 bg-gray-700 rounded-lg appearance-none slider-cyan"
              />
            </div>

            {/* 3D Depth */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                3D Depth: {controlState.depth3D}
              </label>
              <input
                type="range"
                min="0"
                max="5"
                step="0.1"
                value={controlState.depth3D}
                onChange={(e) => handleSliderChange('depth3D', Number(e.target.value))}
                className="w-full h-2 bg-gray-700 rounded-lg appearance-none slider-cyan"
              />
            </div>

            {/* Coherence Override */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Coherence Override: {controlState.coherence}
              </label>
              <input
                type="range"
                min="0.5"
                max="1.0"
                step="0.01"
                value={controlState.coherence}
                onChange={(e) => handleSliderChange('coherence', Number(e.target.value))}
                className="w-full h-2 bg-gray-700 rounded-lg appearance-none slider-cyan"
              />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Status Display */}
      <Card className="bg-gray-900/50 border-green-500/30">
        <CardHeader>
          <CardTitle>System Status</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            <div>
              <span className="text-gray-400">Active Module:</span>
              <div className="text-purple-400 font-mono">{currentModule?.type} Rendering</div>
            </div>
            <div>
              <span className="text-gray-400">Geometry:</span>
              <div className="text-pink-400">{geometryTypes.find(g => g.id === controlState.selectedGeometry)?.name}</div>
            </div>
            <div>
              <span className="text-gray-400">Dimension:</span>
              <div className="text-cyan-400">{controlState.dimensionBlend < 33 ? '2D' : controlState.dimensionBlend < 66 ? '3D' : '4D'}</div>
            </div>
            <div>
              <span className="text-gray-400">Field Coherence:</span>
              <div className="text-green-400">Zλ({psiOS.zLambda.toFixed(3)})</div>
            </div>
          </div>
        </CardContent>
      </Card>

      <style>{`
        .slider-cyan::-webkit-slider-thumb {
          appearance: none;
          width: 20px;
          height: 20px;
          border-radius: 50%;
          background: linear-gradient(45deg, #06b6d4, #8b5cf6);
          cursor: pointer;
          border: 2px solid #1f2937;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
        }
        
        .slider-cyan::-moz-range-thumb {
          width: 20px;
          height: 20px;
          border-radius: 50%;
          background: linear-gradient(45deg, #06b6d4, #8b5cf6);
          cursor: pointer;
          border: 2px solid #1f2937;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
          border: none;
        }
      `}</style>
    </div>
  );
};

export default UnifiedSacredGeometryDashboard;