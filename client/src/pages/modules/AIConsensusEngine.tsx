import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';

interface AIAgent {
  id: string;
  name: string;
  specialty: string;
  status: 'thinking' | 'responding' | 'idle';
  response: string;
  confidence: number;
  color: string;
}

const AIConsensusEngine: React.FC = () => {
  const [agents, setAgents] = useState<AIAgent[]>([
    {
      id: 'analyzer',
      name: 'Logic Analyzer',
      specialty: 'Logical reasoning and pattern analysis',
      status: 'idle',
      response: '',
      confidence: 0,
      color: '#3b82f6'
    },
    {
      id: 'creative',
      name: 'Creative Synthesizer',
      specialty: 'Creative solutions and novel approaches',
      status: 'idle',
      response: '',
      confidence: 0,
      color: '#8b5cf6'
    },
    {
      id: 'critic',
      name: 'Critical Evaluator',
      specialty: 'Risk assessment and critique',
      status: 'idle',
      response: '',
      confidence: 0,
      color: '#ef4444'
    },
    {
      id: 'practical',
      name: 'Practical Implementer',
      specialty: 'Implementation and real-world feasibility',
      status: 'idle',
      response: '',
      confidence: 0,
      color: '#10b981'
    }
  ]);

  const [problem, setProblem] = useState('');
  const [consensus, setConsensus] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [processStep, setProcessStep] = useState(0);
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
      
      // Draw agent nodes
      agents.forEach((agent, index) => {
        const angle = (index * Math.PI * 2) / agents.length;
        const radius = 80 + Math.sin(time + index) * 10;
        const x = centerX + Math.cos(angle) * radius;
        const y = centerY + Math.sin(angle) * radius;
        
        // Agent node
        ctx.fillStyle = agent.color;
        ctx.shadowColor = agent.color;
        ctx.shadowBlur = agent.status === 'thinking' ? 20 : 5;
        ctx.beginPath();
        ctx.arc(x, y, agent.status === 'thinking' ? 12 : 8, 0, Math.PI * 2);
        ctx.fill();
        
        // Connection to center
        ctx.strokeStyle = `${agent.color}40`;
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(centerX, centerY);
        ctx.lineTo(x, y);
        ctx.stroke();
        
        // Agent connections
        agents.forEach((otherAgent, otherIndex) => {
          if (otherIndex > index) {
            const otherAngle = (otherIndex * Math.PI * 2) / agents.length;
            const otherX = centerX + Math.cos(otherAngle) * (80 + Math.sin(time + otherIndex) * 10);
            const otherY = centerY + Math.sin(otherAngle) * (80 + Math.sin(time + otherIndex) * 10);
            
            ctx.strokeStyle = `rgba(255, 255, 255, 0.1)`;
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(x, y);
            ctx.lineTo(otherX, otherY);
            ctx.stroke();
          }
        });
      });
      
      // Central consensus node
      ctx.fillStyle = consensus ? '#fbbf24' : '#6b7280';
      ctx.shadowColor = consensus ? '#fbbf24' : '#6b7280';
      ctx.shadowBlur = consensus ? 15 : 5;
      ctx.beginPath();
      ctx.arc(centerX, centerY, 15, 0, Math.PI * 2);
      ctx.fill();
      
      ctx.restore();
      requestAnimationFrame(animate);
    };
    
    animate();
  }, [agents, consensus]);

  const processConsensus = async () => {
    if (!problem.trim()) return;

    setIsProcessing(true);
    setProcessStep(0);
    setConsensus('');

    // Step 1: Activate all agents
    setProcessStep(1);
    setAgents(prev => prev.map(agent => ({ ...agent, status: 'thinking', response: '', confidence: 0 })));

    await new Promise(resolve => setTimeout(resolve, 2000));

    // Step 2: Generate responses from each agent
    setProcessStep(2);
    for (let i = 0; i < agents.length; i++) {
      const agent = agents[i];
      
      try {
        const response = await fetch('/api/generate-content', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contentType: 'analysis',
            prompt: `As a ${agent.specialty} AI agent, analyze this problem and provide your perspective: ${problem}`
          })
        });

        const result = await response.json();
        
        setAgents(prev => prev.map(a => 
          a.id === agent.id 
            ? { 
                ...a, 
                status: 'responding', 
                response: result.success ? result.content : `${agent.name} analysis pending...`,
                confidence: Math.random() * 0.3 + 0.7
              }
            : a
        ));

        await new Promise(resolve => setTimeout(resolve, 1500));
      } catch (error) {
        setAgents(prev => prev.map(a => 
          a.id === agent.id 
            ? { 
                ...a, 
                status: 'responding', 
                response: `${agent.name}: Error in analysis - ${error.message}`,
                confidence: 0.3
              }
            : a
        ));
      }
    }

    // Step 3: Generate consensus
    setProcessStep(3);
    
    try {
      const allResponses = agents.map(a => `${a.name}: ${a.response}`).join('\n\n');
      
      const consensusResponse = await fetch('/api/generate-content', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contentType: 'synthesis',
          prompt: `Synthesize these AI agent responses into a unified consensus solution:\n\n${allResponses}\n\nOriginal problem: ${problem}`
        })
      });

      const consensusResult = await consensusResponse.json();
      
      setConsensus(consensusResult.success ? consensusResult.content : 'Consensus generation failed');
    } catch (error) {
      setConsensus(`Consensus error: ${error.message}`);
    }

    setAgents(prev => prev.map(agent => ({ ...agent, status: 'idle' })));
    setIsProcessing(false);
    setProcessStep(0);
  };

  const resetConsensus = () => {
    setAgents(prev => prev.map(agent => ({ 
      ...agent, 
      status: 'idle', 
      response: '', 
      confidence: 0 
    })));
    setConsensus('');
    setProblem('');
    setProcessStep(0);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        
        {/* Header */}
        <Card className="bg-blue-900/20 border-blue-500/30">
          <CardHeader>
            <CardTitle className="text-center text-3xl text-blue-300 flex items-center justify-center gap-4">
              <span className="text-4xl">🧠</span>
              AI Consensus Engine
              <span className="text-lg font-mono">Multi-Agent Problem Solving</span>
            </CardTitle>
            <p className="text-center text-blue-200">
              Systematic consensus generation through specialized AI agents
            </p>
          </CardHeader>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          
          {/* Consensus Visualization */}
          <Card className="bg-purple-900/20 border-purple-500/30">
            <CardHeader>
              <CardTitle className="text-purple-300">Agent Network</CardTitle>
            </CardHeader>
            <CardContent>
              <canvas 
                ref={canvasRef} 
                width={400} 
                height={300} 
                className="w-full border border-purple-500/30 rounded"
              />
              {processStep > 0 && (
                <div className="mt-4 text-center">
                  <div className="text-purple-200 text-sm mb-2">
                    {processStep === 1 && "Activating agents..."}
                    {processStep === 2 && "Generating agent responses..."}
                    {processStep === 3 && "Synthesizing consensus..."}
                  </div>
                  <div className="w-full bg-purple-900/50 rounded-full h-2">
                    <div 
                      className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${(processStep / 3) * 100}%` }}
                    />
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Problem Input */}
          <Card className="bg-indigo-900/20 border-indigo-500/30">
            <CardHeader>
              <CardTitle className="text-indigo-300">Problem Definition</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Textarea
                value={problem}
                onChange={(e) => setProblem(e.target.value)}
                placeholder="Describe the problem you want the AI consensus engine to solve..."
                className="bg-indigo-900/40 border-indigo-500/30 text-indigo-100 min-h-[120px]"
              />
              
              <div className="flex gap-2">
                <Button
                  onClick={processConsensus}
                  disabled={isProcessing || !problem.trim()}
                  className="bg-blue-600 hover:bg-blue-700 flex-1"
                >
                  {isProcessing ? 'Processing...' : 'Generate Consensus'}
                </Button>
                <Button
                  onClick={resetConsensus}
                  variant="outline"
                  className="border-red-500 text-red-300"
                >
                  Reset
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Agent Responses */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {agents.map((agent) => (
            <Card key={agent.id} className="bg-gray-900/20 border-gray-500/30">
              <CardHeader>
                <CardTitle className="text-sm flex items-center gap-2">
                  <div 
                    className="w-3 h-3 rounded-full" 
                    style={{ backgroundColor: agent.color }}
                  />
                  {agent.name}
                  {agent.confidence > 0 && (
                    <span className="text-xs bg-gray-700 px-2 py-1 rounded">
                      {(agent.confidence * 100).toFixed(0)}%
                    </span>
                  )}
                </CardTitle>
                <p className="text-xs text-gray-400">{agent.specialty}</p>
              </CardHeader>
              {agent.response && (
                <CardContent>
                  <div className="text-sm text-gray-200 bg-gray-900/30 p-3 rounded max-h-32 overflow-y-auto">
                    {agent.response}
                  </div>
                </CardContent>
              )}
            </Card>
          ))}
        </div>

        {/* Final Consensus */}
        {consensus && (
          <Card className="bg-yellow-900/20 border-yellow-500/30">
            <CardHeader>
              <CardTitle className="text-yellow-300 flex items-center gap-2">
                <span className="text-xl">⚡</span>
                Consensus Solution
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-yellow-100 bg-yellow-900/20 p-4 rounded leading-relaxed">
                {consensus}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default AIConsensusEngine;