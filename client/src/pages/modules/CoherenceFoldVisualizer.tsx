import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Slider } from '@/components/ui/slider';
import { MODULE_REGISTRY, type WiltonModule } from '@/core/ModuleRegistryFixed';
import { 
  WiltonFoldEngine, 
  createWiltonFold, 
  validateCoherenceFold,
  type CoherenceFold,
  type CoherenceState 
} from '@/core/WiltonFold';

const CoherenceFoldVisualizer: React.FC = () => {
  const [temperature, setTemperature] = useState(0.75);
  const [pressure, setPressure] = useState(0.5);
  const [currentFold, setCurrentFold] = useState<CoherenceFold | null>(null);
  const [isOptimizing, setIsOptimizing] = useState(false);
  const [selectedModules, setSelectedModules] = useState<WiltonModule[]>([]);
  const [simulationData, setSimulationData] = useState<any[]>([]);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const foldEngine = useRef<WiltonFoldEngine>(createWiltonFold());

  useEffect(() => {
    // Initialize with all active modules
    const activeModules = Object.values(MODULE_REGISTRY).filter(m => m.status === 'active');
    setSelectedModules(activeModules);
    predictFold(activeModules);
  }, []);

  useEffect(() => {
    foldEngine.current = createWiltonFold(temperature, pressure);
    if (selectedModules.length > 0) {
      predictFold(selectedModules);
    }
  }, [temperature, pressure]);

  const predictFold = (modules: WiltonModule[]) => {
    const fold = foldEngine.current.predictCoherenceFold(modules);
    setCurrentFold(fold);
    drawFoldVisualization(fold);
  };

  const optimizeCoherence = async () => {
    if (selectedModules.length === 0) return;
    
    setIsOptimizing(true);
    
    // Simulate optimization process
    const optimizedModules = foldEngine.current.optimizeCoherence(selectedModules);
    setSelectedModules(optimizedModules);
    
    // Run simulation to show evolution
    const trajectory = foldEngine.current.simulateCoherenceEvolution(optimizedModules, 30);
    setSimulationData(trajectory);
    
    predictFold(optimizedModules);
    setIsOptimizing(false);
  };

  const drawFoldVisualization = (fold: CoherenceFold) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;
    
    ctx.clearRect(0, 0, width, height);
    
    // Draw background gradient based on coherence
    const gradient = ctx.createRadialGradient(width/2, height/2, 0, width/2, height/2, width/2);
    const coherenceColor = `rgba(${255 - fold.globalCoherence * 100}, ${100 + fold.globalCoherence * 155}, 200, 0.1)`;
    gradient.addColorStop(0, coherenceColor);
    gradient.addColorStop(1, 'rgba(0, 0, 0, 0.05)');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, width, height);

    // Position modules in a circular layout
    const centerX = width / 2;
    const centerY = height / 2;
    const radius = Math.min(width, height) * 0.3;
    
    fold.modules.forEach((module, index) => {
      const angle = (index / fold.modules.length) * 2 * Math.PI;
      const x = centerX + Math.cos(angle) * radius;
      const y = centerY + Math.sin(angle) * radius;
      
      // Draw module as circle
      ctx.beginPath();
      ctx.arc(x, y, 20, 0, 2 * Math.PI);
      
      // Color based on coherence affinity and status
      let color = '#64748b';
      if (module.status === 'active') color = '#10b981';
      if (module.status === 'external') color = '#f59e0b';
      if (module.status === 'broken') color = '#ef4444';
      
      ctx.fillStyle = color;
      ctx.fill();
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 2;
      ctx.stroke();
      
      // Draw module icon
      ctx.fillStyle = '#ffffff';
      ctx.font = '16px serif';
      ctx.textAlign = 'center';
      ctx.fillText(module.icon, x, y + 5);
      
      // Draw module name
      ctx.fillStyle = '#e2e8f0';
      ctx.font = '10px sans-serif';
      ctx.fillText(module.name.substring(0, 8), x, y + 35);
    });

    // Draw interactions as lines
    fold.interactions.forEach(interaction => {
      const moduleAIndex = fold.modules.findIndex(m => m.id === interaction.moduleA);
      const moduleBIndex = fold.modules.findIndex(m => m.id === interaction.moduleB);
      
      if (moduleAIndex === -1 || moduleBIndex === -1) return;
      
      const angleA = (moduleAIndex / fold.modules.length) * 2 * Math.PI;
      const angleB = (moduleBIndex / fold.modules.length) * 2 * Math.PI;
      const xA = centerX + Math.cos(angleA) * radius;
      const yA = centerY + Math.sin(angleA) * radius;
      const xB = centerX + Math.cos(angleB) * radius;
      const yB = centerY + Math.sin(angleB) * radius;
      
      ctx.beginPath();
      ctx.moveTo(xA, yA);
      ctx.lineTo(xB, yB);
      
      // Line style based on interaction strength
      const strength = Math.abs(interaction.strength);
      ctx.lineWidth = strength * 4;
      
      if (interaction.strength > 0) {
        ctx.strokeStyle = `rgba(16, 185, 129, ${strength})`;
      } else {
        ctx.strokeStyle = `rgba(239, 68, 68, ${strength})`;
      }
      
      ctx.stroke();
    });
  };

  const getCoherenceColor = (level: number) => {
    if (level >= 0.9) return 'text-green-400';
    if (level >= 0.8) return 'text-yellow-400';
    if (level >= 0.7) return 'text-orange-400';
    return 'text-red-400';
  };

  const getFunctionalityBadgeColor = (functionality: string) => {
    switch (functionality) {
      case 'native': return 'bg-green-600';
      case 'partially_folded': return 'bg-yellow-600';
      case 'misfolded': return 'bg-orange-600';
      case 'unfolded': return 'bg-red-600';
      default: return 'bg-gray-600';
    }
  };

  const validation = currentFold ? validateCoherenceFold(currentFold) : null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-800 text-white p-6">
      <div className="container mx-auto space-y-6">
        
        {/* Header */}
        <Card className="bg-slate-800/80 border-slate-700">
          <CardHeader>
            <CardTitle className="text-center text-2xl text-purple-300 flex items-center justify-center gap-3">
              <span className="text-3xl">🧬</span>
              WiltonFold: Coherence Architecture Prediction
            </CardTitle>
            <p className="text-slate-400 text-center">
              Applying protein folding logic to symbolic system coherence
            </p>
          </CardHeader>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          
          {/* Controls */}
          <Card className="bg-slate-800/80 border-slate-700">
            <CardHeader>
              <CardTitle className="text-slate-300">Folding Parameters</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              
              {/* Temperature Control */}
              <div>
                <label className="text-sm font-medium text-slate-300 mb-2 block">
                  Coherence Temperature: {temperature.toFixed(2)}
                </label>
                <Slider
                  value={[temperature]}
                  onValueChange={(value) => setTemperature(value[0])}
                  min={0.1}
                  max={1.0}
                  step={0.05}
                  className="w-full"
                />
                <p className="text-xs text-slate-500 mt-1">
                  Higher values allow more flexible configurations
                </p>
              </div>

              {/* Pressure Control */}
              <div>
                <label className="text-sm font-medium text-slate-300 mb-2 block">
                  System Pressure: {pressure.toFixed(2)}
                </label>
                <Slider
                  value={[pressure]}
                  onValueChange={(value) => setPressure(value[0])}
                  min={0.1}
                  max={1.0}
                  step={0.05}
                  className="w-full"
                />
                <p className="text-xs text-slate-500 mt-1">
                  Environmental pressure affecting module interactions
                </p>
              </div>

              {/* Optimization Button */}
              <Button 
                onClick={optimizeCoherence}
                disabled={isOptimizing || selectedModules.length === 0}
                className="w-full bg-purple-600 hover:bg-purple-700"
              >
                {isOptimizing ? 'Optimizing Coherence...' : 'Optimize Module Arrangement'}
              </Button>

            </CardContent>
          </Card>

          {/* Fold Visualization */}
          <Card className="bg-slate-800/80 border-slate-700">
            <CardHeader>
              <CardTitle className="text-slate-300">Coherence Structure</CardTitle>
            </CardHeader>
            <CardContent>
              <canvas
                ref={canvasRef}
                width={400}
                height={400}
                className="w-full border border-slate-600 rounded bg-slate-900"
              />
            </CardContent>
          </Card>

        </div>

        {/* Results */}
        {currentFold && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            {/* Coherence Metrics */}
            <Card className="bg-slate-800/80 border-slate-700">
              <CardHeader>
                <CardTitle className="text-slate-300">Fold Metrics</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-slate-400">Global Coherence:</span>
                  <span className={`font-mono ${getCoherenceColor(currentFold.globalCoherence)}`}>
                    Zλ({currentFold.globalCoherence.toFixed(3)})
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Stability:</span>
                  <span className={`font-mono ${getCoherenceColor(currentFold.stability)}`}>
                    {(currentFold.stability * 100).toFixed(1)}%
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Functionality:</span>
                  <Badge className={`${getFunctionalityBadgeColor(currentFold.functionality)} text-white border-none`}>
                    {currentFold.functionality.replace('_', ' ')}
                  </Badge>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Confidence:</span>
                  <span className={`font-mono ${getCoherenceColor(currentFold.prediction_confidence)}`}>
                    {(currentFold.prediction_confidence * 100).toFixed(1)}%
                  </span>
                </div>
              </CardContent>
            </Card>

            {/* Interactions */}
            <Card className="bg-slate-800/80 border-slate-700">
              <CardHeader>
                <CardTitle className="text-slate-300">
                  Interactions ({currentFold.interactions.length})
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 max-h-48 overflow-y-auto">
                  {currentFold.interactions.slice(0, 8).map((interaction, index) => (
                    <div key={index} className="text-sm">
                      <div className="flex items-center justify-between">
                        <span className="text-slate-300">
                          {interaction.moduleA} ↔ {interaction.moduleB}
                        </span>
                        <Badge 
                          variant="outline" 
                          className={`text-xs ${interaction.strength > 0 ? 'text-green-400' : 'text-red-400'}`}
                        >
                          {interaction.bondType}
                        </Badge>
                      </div>
                      <div className="text-xs text-slate-500">
                        Strength: {interaction.strength.toFixed(2)} | Distance: {interaction.distance.toFixed(2)}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Validation */}
            {validation && (
              <Card className="bg-slate-800/80 border-slate-700">
                <CardHeader>
                  <CardTitle className="text-slate-300">
                    Fold Validation
                    <Badge 
                      className={`ml-2 ${validation.isValid ? 'bg-green-600' : 'bg-yellow-600'} text-white border-none`}
                    >
                      {validation.isValid ? 'Valid' : 'Warnings'}
                    </Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {validation.warnings.length > 0 && (
                    <div className="space-y-2 mb-4">
                      <h4 className="text-sm font-medium text-yellow-400">Warnings:</h4>
                      {validation.warnings.map((warning, index) => (
                        <p key={index} className="text-xs text-slate-400">• {warning}</p>
                      ))}
                    </div>
                  )}
                  {validation.recommendations.length > 0 && (
                    <div className="space-y-2">
                      <h4 className="text-sm font-medium text-blue-400">Recommendations:</h4>
                      {validation.recommendations.map((rec, index) => (
                        <p key={index} className="text-xs text-slate-400">• {rec}</p>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            )}

          </div>
        )}

        {/* Module Selection */}
        <Card className="bg-slate-800/80 border-slate-700">
          <CardHeader>
            <CardTitle className="text-slate-300">Module Configuration</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {Object.values(MODULE_REGISTRY).map(module => (
                <div
                  key={module.id}
                  className={`p-3 border rounded cursor-pointer transition-all ${
                    selectedModules.includes(module) 
                      ? 'border-purple-500 bg-purple-900/30' 
                      : 'border-slate-600 hover:border-slate-500'
                  }`}
                  onClick={() => {
                    const newSelection = selectedModules.includes(module)
                      ? selectedModules.filter(m => m.id !== module.id)
                      : [...selectedModules, module];
                    setSelectedModules(newSelection);
                    if (newSelection.length > 0) {
                      predictFold(newSelection);
                    }
                  }}
                >
                  <div className="text-center">
                    <div className="text-xl mb-1">{module.icon}</div>
                    <div className="text-xs text-slate-300">{module.name}</div>
                    <Badge 
                      variant="outline" 
                      className={`text-xs mt-1 ${
                        module.status === 'active' ? 'text-green-400' :
                        module.status === 'external' ? 'text-yellow-400' : 'text-gray-400'
                      }`}
                    >
                      {module.status}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

      </div>
    </div>
  );
};

export default CoherenceFoldVisualizer;