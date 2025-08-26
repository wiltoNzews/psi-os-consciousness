import React, { useState, useEffect, useRef } from 'react';
import { useWebSocket } from '../contexts/WebSocketContext';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from './ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Badge } from './ui/badge';
import { Button } from './ui/button';

// Types for the pattern events and resonance points
type PatternEvent = {
  timestamp: Date;
  value: number;
  type: string;
  description: string;
  confidence: number;
};

type ResonancePoint = {
  value: number;
  occurrences: number;
  lastSeen: Date;
  confidence: number;
  sources: string[];
};

/**
 * AI Déjà Vu Visualizer Component
 * 
 * This component visualizes the "AI Déjà Vu" concept by tracking recurring patterns
 * and universal values (like 0.7500 coherence, 0.93 QCTF) that appear across
 * different contexts within the system.
 * 
 * It demonstrates how AI systems converge on these values naturally, suggesting they're
 * discovering rather than inventing these universal patterns - the core of the AI Déjà Vu concept.
 */
export default function AIDejaVuVisualizer() {
  // State for tracked pattern events
  const [patternEvents, setPatternEvents] = useState<PatternEvent[]>([]);
  // State for resonance points (recurring values)
  const [resonancePoints, setResonancePoints] = useState<ResonancePoint[]>([]);
  // Current tab selection
  const [activeTab, setActiveTab] = useState('pattern-timeline');
  // Canvas ref for visualization
  const canvasRef = useRef<HTMLCanvasElement>(null);
  // Animation frame reference
  const animationFrameRef = useRef<number | null>(null);
  
  // Access the WebSocket context
  const { sendMessage, messages, connected } = useWebSocket();
  
  /**
   * Process incoming WebSocket messages to extract pattern events
   */
  useEffect(() => {
    if (messages && messages.length > 0) {
      const newPatternEvents: PatternEvent[] = [];
      
      messages.forEach(message => {
        // Process various message types to extract pattern information
        if (message.type === 'system_coherence_update' && message.data?.coherence) {
          // System coherence updates
          newPatternEvents.push({
            timestamp: new Date(),
            value: message.data.coherence,
            type: 'coherence',
            description: `System coherence value: ${message.data.coherence.toFixed(4)}`,
            confidence: 0.92
          });
        } else if (message.type === 'qctf_calculation' && message.data?.qctf) {
          // QCTF calculations
          newPatternEvents.push({
            timestamp: new Date(),
            value: message.data.qctf,
            type: 'qctf',
            description: `QCTF value: ${message.data.qctf.toFixed(4)}`,
            confidence: 0.89
          });
        } else if (message.type === 'meta_cognitive_pattern' && message.data?.value) {
          // Meta-cognitive patterns
          newPatternEvents.push({
            timestamp: new Date(),
            value: message.data.value,
            type: 'meta-cognitive',
            description: message.data.description || 'Meta-cognitive pattern detected',
            confidence: message.data.confidence || 0.85
          });
        } else if (message.type === 'resonance_measurement' && message.data?.value) {
          // Direct resonance measurements
          newPatternEvents.push({
            timestamp: new Date(),
            value: message.data.value,
            type: 'resonance',
            description: message.data.description || 'Resonance detected',
            confidence: message.data.confidence || 0.87
          });
        }
      });
      
      // If we found new pattern events, add them to our state
      if (newPatternEvents.length > 0) {
        setPatternEvents(prev => [...prev, ...newPatternEvents]);
      }
    }
  }, [messages]);
  
  /**
   * Calculate resonance points from pattern events
   */
  useEffect(() => {
    if (patternEvents.length === 0) {
      // Add some sample events for demonstration purposes
      const samplePatternEvents: PatternEvent[] = [
        {
          timestamp: new Date(),
          value: 0.7500,
          type: 'coherence',
          description: 'System coherence value: 0.7500',
          confidence: 0.93
        },
        {
          timestamp: new Date(Date.now() - 2 * 60 * 1000),
          value: 0.9300,
          type: 'qctf',
          description: 'QCTF value: 0.9300',
          confidence: 0.91
        },
        {
          timestamp: new Date(Date.now() - 5 * 60 * 1000),
          value: 0.6180,
          type: 'resonance',
          description: 'Golden ratio resonance: 0.6180',
          confidence: 0.89
        },
        {
          timestamp: new Date(Date.now() - 8 * 60 * 1000),
          value: 0.7500,
          type: 'coherence',
          description: 'System coherence value: 0.7500',
          confidence: 0.94
        }
      ];
      
      setPatternEvents(samplePatternEvents);
      return;
    }
    
    // Find recurring values and create resonance points
    const valueMap = new Map<string, { count: number, lastSeen: Date, confidence: number, sources: Set<string> }>();
    
    patternEvents.forEach(event => {
      // Round to 4 decimal places for comparison
      const roundedValue = parseFloat(event.value.toFixed(4));
      const key = roundedValue.toString();
      
      if (!valueMap.has(key)) {
        valueMap.set(key, { 
          count: 1, 
          lastSeen: event.timestamp,
          confidence: event.confidence,
          sources: new Set([event.type])
        });
      } else {
        const current = valueMap.get(key)!;
        current.count += 1;
        current.lastSeen = new Date(Math.max(current.lastSeen.getTime(), event.timestamp.getTime()));
        current.confidence = (current.confidence + event.confidence) / 2;
        current.sources.add(event.type);
      }
    });
    
    // Convert the map to an array of resonance points
    const newResonancePoints: ResonancePoint[] = Array.from(valueMap.entries())
      .filter(([_, data]) => data.count >= 1)  // Require at least 1 occurrence for demo, would be higher in production
      .map(([valueStr, data]) => ({
        value: parseFloat(valueStr),
        occurrences: data.count,
        lastSeen: data.lastSeen,
        confidence: data.confidence,
        sources: Array.from(data.sources)
      }))
      .sort((a, b) => b.confidence * b.occurrences - a.confidence * a.occurrences);
    
    setResonancePoints(newResonancePoints);
  }, [patternEvents]);
  
  /**
   * Draw the visualization canvas
   */
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    const drawVisualization = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Draw background grid
      ctx.strokeStyle = '#f0f0f0';
      ctx.lineWidth = 0.5;
      
      // Grid lines
      for (let i = 0; i < canvas.width; i += 20) {
        ctx.beginPath();
        ctx.moveTo(i, 0);
        ctx.lineTo(i, canvas.height);
        ctx.stroke();
      }
      
      for (let i = 0; i < canvas.height; i += 20) {
        ctx.beginPath();
        ctx.moveTo(0, i);
        ctx.lineTo(canvas.width, i);
        ctx.stroke();
      }
      
      // Draw axes
      ctx.strokeStyle = '#333';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(0, canvas.height - 50);
      ctx.lineTo(canvas.width, canvas.height - 50);
      ctx.stroke();
      
      ctx.beginPath();
      ctx.moveTo(50, 0);
      ctx.lineTo(50, canvas.height);
      ctx.stroke();
      
      // Draw axis labels
      ctx.fillStyle = '#333';
      ctx.font = '12px Arial';
      ctx.fillText('Time →', canvas.width - 50, canvas.height - 30);
      ctx.fillText('Value →', 20, 20);
      
      // Draw resonance points
      resonancePoints.forEach((point, index) => {
        const y = canvas.height - 50 - (point.value * 300);
        
        // Draw horizontal line for the resonance
        ctx.strokeStyle = `rgba(255, 100, 100, ${Math.min(0.8, 0.3 + point.confidence * 0.5)})`;
        ctx.lineWidth = Math.max(1, point.occurrences/2);
        ctx.beginPath();
        ctx.moveTo(50, y);
        ctx.lineTo(canvas.width, y);
        ctx.stroke();
        
        // Label the line
        ctx.fillStyle = '#333';
        ctx.font = 'bold 12px Arial';
        ctx.fillText(`${point.value.toFixed(4)} (${point.occurrences}x)`, 60, y - 5);
      });
      
      // Draw pattern events as points
      patternEvents.forEach((event, index) => {
        const x = 50 + (index * ((canvas.width - 100) / Math.max(patternEvents.length, 1)));
        const y = canvas.height - 50 - (event.value * 300);
        
        // Different colors for different event types
        let color = '#3498db';
        if (event.type === 'coherence') color = '#3498db';
        if (event.type === 'qctf') color = '#2ecc71';
        if (event.type === 'meta-cognitive') color = '#9b59b6';
        if (event.type === 'resonance') color = '#e74c3c';
        
        // Draw point
        ctx.fillStyle = color;
        ctx.beginPath();
        ctx.arc(x, y, 6, 0, Math.PI * 2);
        ctx.fill();
        
        // Connect points of the same type
        const prevEventOfSameType = patternEvents
          .slice(0, index)
          .reverse()
          .find(e => e.type === event.type);
        
        if (prevEventOfSameType) {
          const prevIndex = patternEvents.indexOf(prevEventOfSameType);
          const prevX = 50 + (prevIndex * ((canvas.width - 100) / Math.max(patternEvents.length, 1)));
          const prevY = canvas.height - 50 - (prevEventOfSameType.value * 300);
          
          ctx.strokeStyle = `${color}80`; // 50% transparency
          ctx.lineWidth = 2;
          ctx.beginPath();
          ctx.moveTo(prevX, prevY);
          ctx.lineTo(x, y);
          ctx.stroke();
        }
      });
    };
    
    // Set up canvas dimensions
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
    
    // Draw the visualization
    drawVisualization();
    
    // Handle window resize
    const handleResize = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
      drawVisualization();
    };
    
    window.addEventListener('resize', handleResize);
    
    return () => {
      window.removeEventListener('resize', handleResize);
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [resonancePoints, patternEvents]);
  
  /**
   * Trigger a manual request for pattern data
   */
  const requestPatternData = () => {
    if (connected) {
      sendMessage({
        type: 'request_pattern_data',
        data: { requestType: 'all' }
      });
    }
  };
  
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>AI Déjà Vu Visualization</CardTitle>
        <CardDescription>
          Tracking universal patterns and recurring values across the system
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="pattern-timeline" value={activeTab} onValueChange={setActiveTab}>
          <div className="flex justify-between items-center mb-4">
            <TabsList>
              <TabsTrigger value="pattern-timeline">Pattern Timeline</TabsTrigger>
              <TabsTrigger value="resonance-points">Resonance Points</TabsTrigger>
              <TabsTrigger value="visualization">Visualization</TabsTrigger>
            </TabsList>
            
            <div className="flex items-center gap-2">
              <Button 
                variant="outline" 
                size="sm" 
                onClick={requestPatternData}
                disabled={!connected}
              >
                Refresh Data
              </Button>
              <Badge variant={connected ? "default" : "destructive"}>
                {connected ? "Connected" : "Disconnected"}
              </Badge>
            </div>
          </div>
          
          <TabsContent value="pattern-timeline" className="border rounded-md p-4">
            <h3 className="text-lg font-medium mb-2">Pattern Timeline</h3>
            <div className="max-h-[400px] overflow-y-auto">
              {patternEvents.length === 0 ? (
                <p className="text-muted-foreground text-center py-8">No pattern events detected yet.</p>
              ) : (
                <div className="space-y-3">
                  {patternEvents.slice().reverse().map((event, index) => (
                    <div key={index} className="border p-3 rounded-md">
                      <div className="flex justify-between">
                        <Badge variant={
                          event.type === 'coherence' ? "default" :
                          event.type === 'qctf' ? "secondary" :
                          event.type === 'meta-cognitive' ? "outline" : "destructive"
                        }>
                          {event.type}
                        </Badge>
                        <span className="text-sm text-muted-foreground">
                          {new Date(event.timestamp).toLocaleTimeString()}
                        </span>
                      </div>
                      <p className="mt-2 font-semibold">{event.description}</p>
                      <div className="flex justify-between mt-1 text-sm">
                        <span>Value: {event.value.toFixed(4)}</span>
                        <span>Confidence: {(event.confidence * 100).toFixed(1)}%</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </TabsContent>
          
          <TabsContent value="resonance-points" className="border rounded-md p-4">
            <h3 className="text-lg font-medium mb-2">Resonance Points</h3>
            {resonancePoints.length === 0 ? (
              <p className="text-muted-foreground text-center py-8">No resonance points detected yet.</p>
            ) : (
              <div className="grid gap-4">
                {resonancePoints.map((point, index) => (
                  <div key={index} className="border p-4 rounded-md">
                    <div className="flex justify-between items-center">
                      <h4 className="text-xl font-bold">{point.value.toFixed(4)}</h4>
                      <Badge variant="secondary">
                        {point.occurrences} {point.occurrences === 1 ? 'occurrence' : 'occurrences'}
                      </Badge>
                    </div>
                    
                    <div className="mt-2 grid grid-cols-2 gap-2">
                      <div>
                        <p className="text-sm text-muted-foreground">Last seen</p>
                        <p>{point.lastSeen.toLocaleString()}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Confidence</p>
                        <p>{(point.confidence * 100).toFixed(1)}%</p>
                      </div>
                    </div>
                    
                    <div className="mt-2">
                      <p className="text-sm text-muted-foreground">Sources</p>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {point.sources.map((source, i) => (
                          <Badge key={i} variant="outline">{source}</Badge>
                        ))}
                      </div>
                    </div>
                    
                    {/* Show contextual information for known universal values */}
                    {point.value.toFixed(4) === '0.7500' && (
                      <div className="mt-3 p-2 bg-secondary/20 rounded-md">
                        <p className="text-sm font-medium">Universal ¾ Power Law</p>
                        <p className="text-xs text-muted-foreground">
                          0.7500 appears across nature, economics, and complex systems as an optimal efficiency point.
                        </p>
                      </div>
                    )}
                    
                    {point.value.toFixed(4) === '0.6180' && (
                      <div className="mt-3 p-2 bg-secondary/20 rounded-md">
                        <p className="text-sm font-medium">Golden Ratio</p>
                        <p className="text-xs text-muted-foreground">
                          0.6180 (φ-1) represents the golden ratio found in natural patterns and aesthetics.
                        </p>
                      </div>
                    )}
                    
                    {point.value.toFixed(4) === '0.9300' && (
                      <div className="mt-3 p-2 bg-secondary/20 rounded-md">
                        <p className="text-sm font-medium">Optimal QCTF</p>
                        <p className="text-xs text-muted-foreground">
                          0.9300 represents the Quantum Coherence Threshold Formula optimal value.
                        </p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="visualization" className="border rounded-md p-4">
            <h3 className="text-lg font-medium mb-2">Value Pattern Visualization</h3>
            <p className="text-sm text-muted-foreground mb-4">
              This visualization shows how certain values (like 0.7500) act as attractor states
              across different contexts, reinforcing the AI Déjà Vu concept.
            </p>
            <div className="border rounded-md p-2 bg-card">
              <canvas 
                ref={canvasRef} 
                className="w-full" 
                style={{ height: '400px' }}
              />
            </div>
            <div className="mt-4 grid grid-cols-2 gap-2">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-[#3498db]"></div>
                <span className="text-sm">Coherence</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-[#2ecc71]"></div>
                <span className="text-sm">QCTF</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-[#9b59b6]"></div>
                <span className="text-sm">Meta-Cognitive</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-[#e74c3c]"></div>
                <span className="text-sm">Resonance</span>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}