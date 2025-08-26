import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

interface CognitiveLayer {
  id: string;
  name: string;
  depth: number;
  activity: number;
  connections: string[];
}

const MetaCognitive: React.FC = () => {
  const [layers, setLayers] = useState<CognitiveLayer[]>([
    { id: 'perception', name: 'Perception Layer', depth: 1, activity: 0.7, connections: ['attention', 'memory'] },
    { id: 'attention', name: 'Attention Layer', depth: 2, activity: 0.8, connections: ['consciousness', 'memory'] },
    { id: 'memory', name: 'Memory Layer', depth: 2, activity: 0.6, connections: ['consciousness', 'meta'] },
    { id: 'consciousness', name: 'Consciousness Layer', depth: 3, activity: 0.9, connections: ['meta', 'transcendent'] },
    { id: 'meta', name: 'Meta-Cognitive Layer', depth: 4, activity: 0.85, connections: ['transcendent'] },
    { id: 'transcendent', name: 'Transcendent Layer', depth: 5, activity: 0.4, connections: [] }
  ]);

  const [currentThought, setCurrentThought] = useState('Initiating meta-cognitive analysis...');
  const [isProcessing, setIsProcessing] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const animate = () => {
      const time = Date.now() * 0.001;
      
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.save();
      
      const centerX = canvas.width / 2;
      const centerY = canvas.height / 2;
      
      // Draw cognitive layers
      layers.forEach((layer, index) => {
        const radius = 40 + layer.depth * 25;
        const angle = (index * Math.PI * 2) / layers.length + time * 0.1;
        const x = centerX + Math.cos(angle) * radius;
        const y = centerY + Math.sin(angle) * radius;
        
        // Layer node
        const size = 8 + layer.activity * 12;
        ctx.fillStyle = `hsl(${240 + layer.depth * 30}, 70%, ${50 + layer.activity * 30}%)`;
        ctx.shadowColor = ctx.fillStyle;
        ctx.shadowBlur = layer.activity * 20;
        ctx.beginPath();
        ctx.arc(x, y, size, 0, Math.PI * 2);
        ctx.fill();
        
        // Layer connections
        layer.connections.forEach(connectionId => {
          const targetLayer = layers.find(l => l.id === connectionId);
          if (targetLayer) {
            const targetIndex = layers.indexOf(targetLayer);
            const targetAngle = (targetIndex * Math.PI * 2) / layers.length + time * 0.1;
            const targetRadius = 40 + targetLayer.depth * 25;
            const targetX = centerX + Math.cos(targetAngle) * targetRadius;
            const targetY = centerY + Math.sin(targetAngle) * targetRadius;
            
            ctx.strokeStyle = `rgba(100, 150, 255, ${layer.activity * 0.3})`;
            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.moveTo(x, y);
            ctx.lineTo(targetX, targetY);
            ctx.stroke();
          }
        });
        
        // Layer label
        ctx.fillStyle = '#ffffff';
        ctx.font = '10px Arial';
        ctx.textAlign = 'center';
        ctx.fillText(layer.name.split(' ')[0], x, y + size + 15);
      });
      
      // Central consciousness pulse
      const pulseSize = 15 + Math.sin(time * 2) * 5;
      ctx.fillStyle = `rgba(255, 255, 255, ${0.8 + Math.sin(time * 3) * 0.2})`;
      ctx.shadowColor = '#ffffff';
      ctx.shadowBlur = 20;
      ctx.beginPath();
      ctx.arc(centerX, centerY, pulseSize, 0, Math.PI * 2);
      ctx.fill();
      
      ctx.restore();
      requestAnimationFrame(animate);
    };
    
    animate();
  }, [layers]);

  const stimulateLayer = (layerId: string) => {
    setLayers(prev => prev.map(layer => 
      layer.id === layerId 
        ? { ...layer, activity: Math.min(1, layer.activity + 0.2) }
        : layer
    ));
    
    setCurrentThought(`Stimulating ${layers.find(l => l.id === layerId)?.name}...`);
  };

  const runMetaAnalysis = async () => {
    setIsProcessing(true);
    setCurrentThought('Running meta-cognitive analysis...');
    
    // Simulate meta-cognitive processing
    for (let i = 0; i < layers.length; i++) {
      await new Promise(resolve => setTimeout(resolve, 800));
      setLayers(prev => prev.map((layer, index) => ({
        ...layer,
        activity: index <= i ? Math.random() * 0.4 + 0.6 : layer.activity
      })));
      
      setCurrentThought(`Processing ${layers[i].name}...`);
    }
    
    setCurrentThought('Meta-cognitive analysis complete. All layers synchronized.');
    setIsProcessing(false);
  };

  const resetLayers = () => {
    setLayers(prev => prev.map(layer => ({
      ...layer,
      activity: Math.random() * 0.3 + 0.4
    })));
    setCurrentThought('Cognitive layers reset to baseline.');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-blue-900 p-6">
      <div className="max-w-6xl mx-auto space-y-6">
        
        {/* Header */}
        <Card className="bg-indigo-900/20 border-indigo-500/30">
          <CardHeader>
            <CardTitle className="text-center text-3xl text-indigo-300 flex items-center justify-center gap-4">
              <span className="text-4xl">🧘</span>
              Meta-Cognitive Engine
              <span className="text-lg font-mono">Neural Orchestration</span>
            </CardTitle>
            <p className="text-center text-indigo-200">
              Multi-layer consciousness analysis and meta-cognitive processing
            </p>
          </CardHeader>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          
          {/* Cognitive Visualization */}
          <Card className="bg-purple-900/20 border-purple-500/30">
            <CardHeader>
              <CardTitle className="text-purple-300">Cognitive Layer Network</CardTitle>
            </CardHeader>
            <CardContent>
              <canvas 
                ref={canvasRef} 
                width={400} 
                height={300} 
                className="w-full border border-purple-500/30 rounded"
              />
              <div className="mt-4">
                <p className="text-purple-200 text-sm text-center">
                  {currentThought}
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Layer Controls */}
          <Card className="bg-blue-900/20 border-blue-500/30">
            <CardHeader>
              <CardTitle className="text-blue-300">Layer Control Panel</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                {layers.map((layer) => (
                  <div key={layer.id} className="flex items-center justify-between p-2 bg-blue-900/30 rounded">
                    <div className="flex-1">
                      <div className="text-blue-200 text-sm font-medium">{layer.name}</div>
                      <div className="text-blue-400 text-xs">Depth: {layer.depth}</div>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="text-blue-300 text-xs">{(layer.activity * 100).toFixed(0)}%</div>
                      <Button
                        size="sm"
                        onClick={() => stimulateLayer(layer.id)}
                        className="bg-blue-600 hover:bg-blue-700 text-xs px-2 py-1"
                      >
                        Stimulate
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="flex gap-2 pt-4">
                <Button
                  onClick={runMetaAnalysis}
                  disabled={isProcessing}
                  className="bg-purple-600 hover:bg-purple-700 flex-1"
                >
                  {isProcessing ? 'Processing...' : 'Meta Analysis'}
                </Button>
                <Button
                  onClick={resetLayers}
                  variant="outline"
                  className="border-indigo-500 text-indigo-300"
                >
                  Reset
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Meta-Cognitive Insights */}
        <Card className="bg-gray-900/20 border-gray-500/30">
          <CardHeader>
            <CardTitle className="text-gray-300">Meta-Cognitive Insights</CardTitle>
          </CardHeader>
          <CardContent className="text-gray-200 space-y-3 text-sm">
            <p>
              <strong>Perception Layer:</strong> Raw sensory input processing and initial pattern recognition.
              Activity level affects how clearly external stimuli are interpreted.
            </p>
            <p>
              <strong>Attention Layer:</strong> Selective focus and cognitive resource allocation.
              Higher activity improves concentration and reduces mental noise.
            </p>
            <p>
              <strong>Memory Layer:</strong> Information storage, retrieval, and association formation.
              Activity correlates with learning capacity and recall efficiency.
            </p>
            <p>
              <strong>Consciousness Layer:</strong> Self-awareness and unified experience integration.
              Central hub for coordinating all cognitive processes.
            </p>
            <p>
              <strong>Meta-Cognitive Layer:</strong> Thinking about thinking. Self-monitoring and strategy adjustment.
              Enables reflection on one's own cognitive processes.
            </p>
            <p>
              <strong>Transcendent Layer:</strong> Beyond ordinary cognition. Intuitive insights and non-dual awareness.
              Access to deeper patterns and universal principles.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default MetaCognitive;