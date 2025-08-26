import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

interface NetworkNode {
  id: string;
  x: number;
  y: number;
  type: 'input' | 'hidden' | 'output';
  activation: number;
  connections: string[];
}

const NeuralOrchestrator: React.FC = () => {
  const [nodes, setNodes] = useState<NetworkNode[]>([]);
  const [isTraining, setIsTraining] = useState(false);
  const [epoch, setEpoch] = useState(0);
  const [networkActivity, setNetworkActivity] = useState(0);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    // Initialize network topology
    const initialNodes: NetworkNode[] = [
      // Input layer
      { id: 'i1', x: 50, y: 100, type: 'input', activation: 0, connections: ['h1', 'h2'] },
      { id: 'i2', x: 50, y: 150, type: 'input', activation: 0, connections: ['h1', 'h2', 'h3'] },
      { id: 'i3', x: 50, y: 200, type: 'input', activation: 0, connections: ['h2', 'h3'] },
      
      // Hidden layer
      { id: 'h1', x: 200, y: 80, type: 'hidden', activation: 0, connections: ['h4', 'o1'] },
      { id: 'h2', x: 200, y: 130, type: 'hidden', activation: 0, connections: ['h4', 'h5', 'o1', 'o2'] },
      { id: 'h3', x: 200, y: 180, type: 'hidden', activation: 0, connections: ['h5', 'o2'] },
      { id: 'h4', x: 300, y: 100, type: 'hidden', activation: 0, connections: ['o1', 'o2'] },
      { id: 'h5', x: 300, y: 160, type: 'hidden', activation: 0, connections: ['o2', 'o3'] },
      
      // Output layer
      { id: 'o1', x: 450, y: 100, type: 'output', activation: 0, connections: [] },
      { id: 'o2', x: 450, y: 150, type: 'output', activation: 0, connections: [] },
      { id: 'o3', x: 450, y: 200, type: 'output', activation: 0, connections: [] }
    ];
    
    setNodes(initialNodes);
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.save();
      
      // Draw connections
      nodes.forEach(node => {
        node.connections.forEach(connectionId => {
          const targetNode = nodes.find(n => n.id === connectionId);
          if (targetNode) {
            const activity = (node.activation + targetNode.activation) / 2;
            ctx.strokeStyle = `rgba(100, 200, 255, ${activity})`;
            ctx.lineWidth = 1 + activity * 3;
            ctx.beginPath();
            ctx.moveTo(node.x, node.y);
            ctx.lineTo(targetNode.x, targetNode.y);
            ctx.stroke();
          }
        });
      });
      
      // Draw nodes
      nodes.forEach(node => {
        const colors = {
          input: '#22c55e',
          hidden: '#3b82f6',
          output: '#ef4444'
        };
        
        ctx.fillStyle = colors[node.type];
        ctx.shadowColor = colors[node.type];
        ctx.shadowBlur = node.activation * 15;
        ctx.beginPath();
        ctx.arc(node.x, node.y, 8 + node.activation * 8, 0, Math.PI * 2);
        ctx.fill();
        
        // Node labels
        ctx.fillStyle = '#ffffff';
        ctx.font = '10px Arial';
        ctx.textAlign = 'center';
        ctx.fillText(node.id.toUpperCase(), node.x, node.y - 15);
      });
      
      ctx.restore();
      requestAnimationFrame(animate);
    };
    
    animate();
  }, [nodes]);

  const propagateSignal = () => {
    // Set random input activations
    setNodes(prev => prev.map(node => 
      node.type === 'input' 
        ? { ...node, activation: Math.random() }
        : node
    ));
    
    // Forward propagation simulation
    setTimeout(() => {
      setNodes(prev => prev.map(node => {
        if (node.type === 'hidden') {
          const inputActivation = prev
            .filter(n => n.connections.includes(node.id))
            .reduce((sum, n) => sum + n.activation, 0) / 
            prev.filter(n => n.connections.includes(node.id)).length;
          return { ...node, activation: Math.min(1, inputActivation * 1.2) };
        }
        return node;
      }));
    }, 200);
    
    setTimeout(() => {
      setNodes(prev => prev.map(node => {
        if (node.type === 'output') {
          const inputActivation = prev
            .filter(n => n.connections.includes(node.id))
            .reduce((sum, n) => sum + n.activation, 0) / 
            prev.filter(n => n.connections.includes(node.id)).length;
          return { ...node, activation: Math.min(1, inputActivation * 1.1) };
        }
        return node;
      }));
    }, 400);
    
    // Calculate network activity
    setTimeout(() => {
      const totalActivation = nodes.reduce((sum, node) => sum + node.activation, 0);
      setNetworkActivity(totalActivation / nodes.length);
    }, 500);
  };

  const startTraining = () => {
    setIsTraining(true);
    setEpoch(0);
    
    const trainingInterval = setInterval(() => {
      setEpoch(prev => {
        const newEpoch = prev + 1;
        if (newEpoch >= 100) {
          setIsTraining(false);
          clearInterval(trainingInterval);
          return 100;
        }
        
        // Simulate training updates
        propagateSignal();
        return newEpoch;
      });
    }, 100);
  };

  const resetNetwork = () => {
    setNodes(prev => prev.map(node => ({ ...node, activation: 0 })));
    setEpoch(0);
    setNetworkActivity(0);
    setIsTraining(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 p-6">
      <div className="max-w-6xl mx-auto space-y-6">
        
        {/* Header */}
        <Card className="bg-blue-900/20 border-blue-500/30">
          <CardHeader>
            <CardTitle className="text-center text-3xl text-blue-300 flex items-center justify-center gap-4">
              <span className="text-4xl">🌐</span>
              Neural Orchestrator
              <span className="text-lg font-mono">Network Visualization</span>
            </CardTitle>
            <p className="text-center text-blue-200">
              Real-time neural network visualization and orchestration
            </p>
          </CardHeader>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Network Visualization */}
          <Card className="lg:col-span-2 bg-gray-900/20 border-gray-500/30">
            <CardHeader>
              <CardTitle className="text-gray-300">Network Topology</CardTitle>
            </CardHeader>
            <CardContent>
              <canvas 
                ref={canvasRef} 
                width={500} 
                height={300} 
                className="w-full border border-gray-500/30 rounded bg-black/20"
              />
              <div className="mt-4 grid grid-cols-3 gap-4 text-center text-xs">
                <div className="text-green-300">
                  <div className="w-4 h-4 bg-green-500 rounded-full mx-auto mb-1"></div>
                  Input Layer
                </div>
                <div className="text-blue-300">
                  <div className="w-4 h-4 bg-blue-500 rounded-full mx-auto mb-1"></div>
                  Hidden Layers
                </div>
                <div className="text-red-300">
                  <div className="w-4 h-4 bg-red-500 rounded-full mx-auto mb-1"></div>
                  Output Layer
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Controls */}
          <Card className="bg-purple-900/20 border-purple-500/30">
            <CardHeader>
              <CardTitle className="text-purple-300">Orchestration Controls</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="text-purple-200 text-sm">Network Activity</div>
                <div className="w-full bg-purple-900/50 rounded-full h-3">
                  <div 
                    className="bg-purple-500 h-3 rounded-full transition-all duration-300"
                    style={{ width: `${networkActivity * 100}%` }}
                  />
                </div>
                <div className="text-purple-300 text-xs text-right">
                  {(networkActivity * 100).toFixed(1)}%
                </div>
              </div>
              
              {isTraining && (
                <div className="space-y-2">
                  <div className="text-purple-200 text-sm">Training Epoch</div>
                  <div className="text-purple-300 text-lg font-mono text-center">
                    {epoch}/100
                  </div>
                  <div className="w-full bg-purple-900/50 rounded-full h-2">
                    <div 
                      className="bg-yellow-500 h-2 rounded-full transition-all duration-100"
                      style={{ width: `${epoch}%` }}
                    />
                  </div>
                </div>
              )}
              
              <div className="space-y-2">
                <Button
                  onClick={propagateSignal}
                  disabled={isTraining}
                  className="w-full bg-blue-600 hover:bg-blue-700"
                >
                  Propagate Signal
                </Button>
                <Button
                  onClick={startTraining}
                  disabled={isTraining}
                  className="w-full bg-purple-600 hover:bg-purple-700"
                >
                  {isTraining ? 'Training...' : 'Start Training'}
                </Button>
                <Button
                  onClick={resetNetwork}
                  variant="outline"
                  className="w-full border-red-500 text-red-300"
                >
                  Reset Network
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Network Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="bg-green-900/20 border-green-500/30">
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-green-300">
                {nodes.filter(n => n.type === 'input').length}
              </div>
              <div className="text-green-200 text-sm">Input Nodes</div>
            </CardContent>
          </Card>
          
          <Card className="bg-blue-900/20 border-blue-500/30">
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-blue-300">
                {nodes.filter(n => n.type === 'hidden').length}
              </div>
              <div className="text-blue-200 text-sm">Hidden Nodes</div>
            </CardContent>
          </Card>
          
          <Card className="bg-red-900/20 border-red-500/30">
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-red-300">
                {nodes.filter(n => n.type === 'output').length}
              </div>
              <div className="text-red-200 text-sm">Output Nodes</div>
            </CardContent>
          </Card>
        </div>

        {/* Architecture Info */}
        <Card className="bg-gray-900/20 border-gray-500/30">
          <CardHeader>
            <CardTitle className="text-gray-300">Neural Architecture</CardTitle>
          </CardHeader>
          <CardContent className="text-gray-200 space-y-2 text-sm">
            <p>
              <strong>Input Layer:</strong> Receives external signals and sensory data
            </p>
            <p>
              <strong>Hidden Layers:</strong> Process and transform information through weighted connections
            </p>
            <p>
              <strong>Output Layer:</strong> Produces final decisions and responses
            </p>
            <p>
              <strong>Activation:</strong> Node brightness represents current activation level
            </p>
            <p>
              <strong>Connections:</strong> Line thickness shows signal strength between nodes
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default NeuralOrchestrator;