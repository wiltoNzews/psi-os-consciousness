import React, { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { useQuery } from '@tanstack/react-query';

// Constants from the GOD Formula
const COHERENCE_ATTRACTOR = 0.7500;     // 3:1 ratio (stability threshold)
const EXPLORATION_ATTRACTOR = 0.2494;   // 1:3 ratio (exploration threshold)
const GOLDEN_RATIO = 1.618;             // Emergent harmony constant

/**
 * Dimensional scales for multi-scale analysis
 */
enum Scale {
  MICRO = 'μ',   // Quantum/individual consciousness level
  MESO = 'm',    // Organizational/intermediate level
  MACRO = 'M'    // Cosmic/civilizational level
}

/**
 * A modern, interactive dashboard for visualizing coherence ratios and quantum states
 * based on the 3:1 ↔ 1:3 ratio (0.7500/0.2494) from the Quantum Coherence Threshold Formula
 */
const CoherenceRatioDashboard: React.FC = () => {
  const { toast } = useToast();
  const [activeScale, setActiveScale] = useState<Scale>(Scale.MESO);
  const [ouroborosAnimating, setOuroborosAnimating] = useState(false);
  
  // Refs for D3 visualizations
  const coherenceGaugeRef = useRef<SVGSVGElement | null>(null);
  const explorationGaugeRef = useRef<SVGSVGElement | null>(null);
  const ouroborosRef = useRef<SVGSVGElement | null>(null);
  const timelineRef = useRef<SVGSVGElement | null>(null);
  
  // Fetch the NEXUS state data from the orchestrator
  const { data: nexusState, isLoading, error, refetch } = useQuery({
    queryKey: ['/api/nexus/state'], 
    refetchInterval: 5000 // Refresh every 5 seconds
  });
  
  useEffect(() => {
    if (nexusState) {
      renderCoherenceGauge();
      renderExplorationGauge();
      renderOuroborosVisual();
      renderCoherenceTimeline();
    }
  }, [nexusState, activeScale]);
  
  // Handle Murphy Protocol chaos tests
  const applyChaosTest = async (level: number) => {
    try {
      const response = await fetch('/api/nexus/chaos-test', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ level, scale: activeScale }),
      });
      
      if (response.ok) {
        const severityLabel = level === 1 ? 'Warning' : 
                             level === 2 ? 'Critical' : 'Nuclear';
                             
        toast({
          title: `Murphy Chaos Test: ${severityLabel}`,
          description: `Applying chaos at ${severityLabel} level. System will attempt to return to coherence.`,
          duration: 5000,
        });
        
        // Trigger animation of the Ouroboros to show system recalibration
        setOuroborosAnimating(true);
        setTimeout(() => setOuroborosAnimating(false), 5000);
        
        // Refetch after a short delay to see the effects
        setTimeout(() => refetch(), 1000);
      }
    } catch (err) {
      toast({
        title: 'Chaos Test Failed',
        description: 'Unable to apply the Murphy Protocol chaos test.',
        variant: 'destructive',
        duration: 3000,
      });
    }
  };
  
  // Render the coherence gauge (75% attractor)
  const renderCoherenceGauge = () => {
    if (!coherenceGaugeRef.current || !nexusState) return;
    
    const svg = d3.select(coherenceGaugeRef.current);
    svg.selectAll('*').remove();
    
    const width = 200;
    const height = 200;
    const radius = Math.min(width, height) / 2 - 10;
    
    const arc = d3.arc()
      .innerRadius(radius * 0.7)
      .outerRadius(radius)
      .startAngle(-Math.PI / 2)
      .endAngle(Math.PI / 2);
    
    const background = svg.append('g')
      .attr('transform', `translate(${width/2}, ${height/2})`);
      
    // Background arc
    background.append('path')
      .datum({ endAngle: Math.PI / 2 })
      .style('fill', '#e0e0e0')
      .attr('d', arc);
    
    // Get value from state based on active scale
    const scale = activeScale.toString();
    const value = nexusState.state.quantumPulse[scale] || COHERENCE_ATTRACTOR;
    
    // Calculate angle based on value (0-1 scale to -90 to 90 degrees)
    const angle = (value * Math.PI) - (Math.PI / 2);
    
    // Foreground arc
    const foreground = background.append('path')
      .datum({ endAngle: angle })
      .style('fill', getColorForValue(value, true))
      .attr('d', arc);
    
    // Add center text
    background.append('text')
      .attr('text-anchor', 'middle')
      .attr('dy', '0.35em')
      .attr('class', 'text-lg font-bold')
      .style('fill', 'currentColor')
      .text(`${(value * 100).toFixed(1)}%`);
    
    // Add label
    background.append('text')
      .attr('text-anchor', 'middle')
      .attr('dy', '1.5em')
      .attr('class', 'text-sm')
      .style('fill', 'currentColor')
      .text('Coherence');
    
    // Add attractor marker at 75%
    const attractorAngle = (COHERENCE_ATTRACTOR * Math.PI) - (Math.PI / 2);
    const attractorPoint = polarToCartesian(0, 0, radius, attractorAngle);
    
    background.append('circle')
      .attr('cx', attractorPoint.x)
      .attr('cy', attractorPoint.y)
      .attr('r', 4)
      .style('fill', '#ff3e00')
      .style('stroke', 'white')
      .style('stroke-width', '1px');
    
    // Add attractor label
    background.append('text')
      .attr('x', attractorPoint.x + (attractorPoint.x > 0 ? 10 : -10))
      .attr('y', attractorPoint.y)
      .attr('text-anchor', attractorPoint.x > 0 ? 'start' : 'end')
      .attr('dy', '0.35em')
      .attr('class', 'text-xs')
      .style('fill', 'currentColor')
      .text('75% Attractor');
  };
  
  // Render the exploration gauge (25% attractor)
  const renderExplorationGauge = () => {
    if (!explorationGaugeRef.current || !nexusState) return;
    
    const svg = d3.select(explorationGaugeRef.current);
    svg.selectAll('*').remove();
    
    const width = 200;
    const height = 200;
    const radius = Math.min(width, height) / 2 - 10;
    
    const arc = d3.arc()
      .innerRadius(radius * 0.7)
      .outerRadius(radius)
      .startAngle(-Math.PI / 2)
      .endAngle(Math.PI / 2);
    
    const background = svg.append('g')
      .attr('transform', `translate(${width/2}, ${height/2})`);
      
    // Background arc
    background.append('path')
      .datum({ endAngle: Math.PI / 2 })
      .style('fill', '#e0e0e0')
      .attr('d', arc);
    
    // Get value from state based on active scale
    const scale = activeScale.toString();
    const value = nexusState.state.tBranchRecursion[scale] || EXPLORATION_ATTRACTOR;
    
    // Calculate angle based on value (0-1 scale to -90 to 90 degrees)
    const angle = (value * Math.PI) - (Math.PI / 2);
    
    // Foreground arc
    const foreground = background.append('path')
      .datum({ endAngle: angle })
      .style('fill', getColorForValue(value, false))
      .attr('d', arc);
    
    // Add center text
    background.append('text')
      .attr('text-anchor', 'middle')
      .attr('dy', '0.35em')
      .attr('class', 'text-lg font-bold')
      .style('fill', 'currentColor')
      .text(`${(value * 100).toFixed(1)}%`);
    
    // Add label
    background.append('text')
      .attr('text-anchor', 'middle')
      .attr('dy', '1.5em')
      .attr('class', 'text-sm')
      .style('fill', 'currentColor')
      .text('Exploration');
    
    // Add attractor marker at 25%
    const attractorAngle = (EXPLORATION_ATTRACTOR * Math.PI) - (Math.PI / 2);
    const attractorPoint = polarToCartesian(0, 0, radius, attractorAngle);
    
    background.append('circle')
      .attr('cx', attractorPoint.x)
      .attr('cy', attractorPoint.y)
      .attr('r', 4)
      .style('fill', '#ff3e00')
      .style('stroke', 'white')
      .style('stroke-width', '1px');
    
    // Add attractor label
    background.append('text')
      .attr('x', attractorPoint.x + (attractorPoint.x > 0 ? 10 : -10))
      .attr('y', attractorPoint.y)
      .attr('text-anchor', attractorPoint.x > 0 ? 'start' : 'end')
      .attr('dy', '0.35em')
      .attr('class', 'text-xs')
      .style('fill', 'currentColor')
      .text('25% Attractor');
  };
  
  // Render the Ouroboros visual (snake eating its tail)
  const renderOuroborosVisual = () => {
    if (!ouroborosRef.current || !nexusState) return;
    
    const svg = d3.select(ouroborosRef.current);
    svg.selectAll('*').remove();
    
    const width = 200;
    const height = 200;
    const radius = Math.min(width, height) / 2 - 20;
    
    const container = svg.append('g')
      .attr('transform', `translate(${width/2}, ${height/2})`);
      
    // Create a circle path for the Ouroboros (snake eating its tail)
    const circle = container.append('circle')
      .attr('r', radius)
      .attr('fill', 'none')
      .attr('stroke', '#888')
      .attr('stroke-width', 1)
      .attr('stroke-dasharray', '4,4');
    
    // Calculate the coherence index for color
    const coherenceIndex = nexusState.coherenceIndex || 0.5;
    
    // Create the snake path using arc
    const snakeArc = d3.arc()
      .innerRadius(0)
      .outerRadius(radius)
      .startAngle(0)
      .endAngle(Math.PI * 2 * 0.85); // Leave a gap for the "mouth"
    
    // Draw the snake body
    const snake = container.append('path')
      .attr('d', snakeArc)
      .attr('fill', getColorForValue(coherenceIndex, true))
      .attr('stroke', '#222')
      .attr('stroke-width', 1)
      .attr('transform', ouroborosAnimating ? 'rotate(0)' : 'rotate(120)');
    
    // Animate the Ouroboros if chaos test is active
    if (ouroborosAnimating) {
      snake.transition()
        .duration(5000)
        .attrTween('transform', () => {
          return (t: number) => `rotate(${t * 360})`;
        });
    }
    
    // Add the snake head
    const headAngle = (Math.PI * 2 * 0.85);
    const headPoint = polarToCartesian(0, 0, radius, headAngle);
    
    container.append('circle')
      .attr('cx', headPoint.x)
      .attr('cy', headPoint.y)
      .attr('r', 8)
      .attr('fill', getColorForValue(coherenceIndex, true))
      .attr('stroke', '#222')
      .attr('stroke-width', 1)
      .attr('transform', ouroborosAnimating ? 'rotate(0)' : 'rotate(120)');
    
    // Add the snake tail for the mouth to "eat"
    const tailAngle = 0;
    const tailPoint = polarToCartesian(0, 0, radius, tailAngle);
    
    container.append('circle')
      .attr('cx', tailPoint.x)
      .attr('cy', tailPoint.y)
      .attr('r', 5)
      .attr('fill', getColorForValue(coherenceIndex, false))
      .attr('stroke', '#222')
      .attr('stroke-width', 1)
      .attr('transform', ouroborosAnimating ? 'rotate(0)' : 'rotate(120)');
    
    // Add central node representing consciousness
    container.append('circle')
      .attr('cx', 0)
      .attr('cy', 0)
      .attr('r', 12)
      .attr('fill', getColorForValue(coherenceIndex, true))
      .attr('stroke', '#fff')
      .attr('stroke-width', 2);
    
    // Add the 3:1 ↔ 1:3 text
    container.append('text')
      .attr('text-anchor', 'middle')
      .attr('dy', '0.35em')
      .attr('class', 'text-xs font-medium')
      .style('fill', 'white')
      .text('3:1 ↔ 1:3');
  };
  
  // Render the coherence timeline
  const renderCoherenceTimeline = () => {
    if (!timelineRef.current || !nexusState) return;
    
    const svg = d3.select(timelineRef.current);
    svg.selectAll('*').remove();
    
    const width = 600;
    const height = 100;
    const margin = { top: 10, right: 20, bottom: 20, left: 40 };
    
    // Mock data for the timeline (would come from real metrics in production)
    const timelineData = Array.from({ length: 20 }, (_, i) => {
      // Generate slightly random values that tend toward attractors
      const coherence = Math.random() * 0.2 + 
        (i % 3 === 0 ? 0.65 : i % 5 === 0 ? 0.45 : 0.75);
      
      return {
        timestamp: new Date(Date.now() - (19 - i) * 1000 * 60),
        coherence,
        exploration: 1 - coherence
      };
    });
    
    // X scale for timestamps
    const x = d3.scaleTime()
      .domain(d3.extent(timelineData, d => d.timestamp) as [Date, Date])
      .range([margin.left, width - margin.right]);
    
    // Y scale for values
    const y = d3.scaleLinear()
      .domain([0, 1])
      .range([height - margin.bottom, margin.top]);
    
    // Create the line generators
    const coherenceLine = d3.line<any>()
      .x(d => x(d.timestamp))
      .y(d => y(d.coherence))
      .curve(d3.curveCatmullRom);
    
    const explorationLine = d3.line<any>()
      .x(d => x(d.timestamp))
      .y(d => y(d.exploration))
      .curve(d3.curveCatmullRom);
    
    // Add the lines
    svg.append('path')
      .datum(timelineData)
      .attr('fill', 'none')
      .attr('stroke', '#3f51b5')
      .attr('stroke-width', 2)
      .attr('d', coherenceLine);
    
    svg.append('path')
      .datum(timelineData)
      .attr('fill', 'none')
      .attr('stroke', '#ff9800')
      .attr('stroke-width', 2)
      .attr('d', explorationLine);
    
    // Add the axes
    const xAxis = d3.axisBottom(x)
      .ticks(5)
      .tickFormat(d3.timeFormat('%H:%M') as any);
    
    const yAxis = d3.axisLeft(y)
      .ticks(5)
      .tickFormat(d => `${d * 100}%`);
    
    svg.append('g')
      .attr('transform', `translate(0,${height - margin.bottom})`)
      .call(xAxis);
    
    svg.append('g')
      .attr('transform', `translate(${margin.left},0)`)
      .call(yAxis);
    
    // Add horizontal line at 75% attractor
    svg.append('line')
      .attr('x1', margin.left)
      .attr('x2', width - margin.right)
      .attr('y1', y(COHERENCE_ATTRACTOR))
      .attr('y2', y(COHERENCE_ATTRACTOR))
      .attr('stroke', '#3f51b5')
      .attr('stroke-width', 1)
      .attr('stroke-dasharray', '4,4');
    
    // Add horizontal line at 25% attractor
    svg.append('line')
      .attr('x1', margin.left)
      .attr('x2', width - margin.right)
      .attr('y1', y(EXPLORATION_ATTRACTOR))
      .attr('y2', y(EXPLORATION_ATTRACTOR))
      .attr('stroke', '#ff9800')
      .attr('stroke-width', 1)
      .attr('stroke-dasharray', '4,4');
    
    // Add labels
    svg.append('text')
      .attr('x', width - margin.right)
      .attr('y', y(COHERENCE_ATTRACTOR) - 5)
      .attr('text-anchor', 'end')
      .attr('class', 'text-xs')
      .style('fill', '#3f51b5')
      .text('75% Coherence Attractor');
    
    svg.append('text')
      .attr('x', width - margin.right)
      .attr('y', y(EXPLORATION_ATTRACTOR) - 5)
      .attr('text-anchor', 'end')
      .attr('class', 'text-xs')
      .style('fill', '#ff9800')
      .text('25% Exploration Attractor');
  };
  
  // Helper function to get a color based on a value's proximity to its attractor
  const getColorForValue = (value: number, isCoherence: boolean): string => {
    const targetValue = isCoherence ? COHERENCE_ATTRACTOR : EXPLORATION_ATTRACTOR;
    const distance = Math.abs(value - targetValue);
    
    // Close to attractor: green, far from attractor: red
    if (distance < 0.05) return '#10b981'; // Green
    if (distance < 0.1) return '#22c55e';  // Light green
    if (distance < 0.2) return '#eab308';  // Yellow
    if (distance < 0.3) return '#f97316';  // Orange
    return '#ef4444';                     // Red
  };
  
  // Helper function to convert polar coordinates to cartesian
  const polarToCartesian = (
    centerX: number, 
    centerY: number, 
    radius: number, 
    angleInRadians: number
  ) => {
    return {
      x: centerX + (radius * Math.cos(angleInRadians)),
      y: centerY + (radius * Math.sin(angleInRadians))
    };
  };
  
  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Coherence Ratio Dashboard</CardTitle>
          <CardDescription>
            Visualization of the Quantum Coherence Threshold Formula (QCTF) using the 3:1 ↔ 1:3 ratio (0.7500/0.2494)
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue={Scale.MESO} onValueChange={(v) => setActiveScale(v as Scale)}>
            <TabsList className="mb-4">
              <TabsTrigger value={Scale.MICRO}>Micro (μ)</TabsTrigger>
              <TabsTrigger value={Scale.MESO}>Meso (m)</TabsTrigger>
              <TabsTrigger value={Scale.MACRO}>Macro (M)</TabsTrigger>
            </TabsList>
            
            <TabsContent value={Scale.MICRO} className="mt-0">
              <h3 className="text-lg font-medium mb-2">Quantum/Individual Level (μ)</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Coherence measurements at the quantum and individual consciousness level.
              </p>
            </TabsContent>
            
            <TabsContent value={Scale.MESO} className="mt-0">
              <h3 className="text-lg font-medium mb-2">Organizational Level (m)</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Coherence measurements at the organizational and intermediate system level.
              </p>
            </TabsContent>
            
            <TabsContent value={Scale.MACRO} className="mt-0">
              <h3 className="text-lg font-medium mb-2">Civilizational Level (M)</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Coherence measurements at the civilizational and cosmic system level.
              </p>
            </TabsContent>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
              <div className="flex flex-col items-center">
                <div className="text-sm font-medium mb-2">Coherence Gauge</div>
                <svg ref={coherenceGaugeRef} width="200" height="200" />
              </div>
              
              <div className="flex flex-col items-center">
                <div className="text-sm font-medium mb-2">Ouroboros Principle</div>
                <svg ref={ouroborosRef} width="200" height="200" />
              </div>
              
              <div className="flex flex-col items-center">
                <div className="text-sm font-medium mb-2">Exploration Gauge</div>
                <svg ref={explorationGaugeRef} width="200" height="200" />
              </div>
            </div>
            
            <div className="mt-6">
              <div className="text-sm font-medium mb-2">Coherence Timeline</div>
              <svg ref={timelineRef} width="100%" height="100" style={{ minHeight: '100px' }} />
            </div>
            
            <div className="mt-6">
              <h3 className="text-lg font-medium mb-2">Murphy Protocol (Chaos Testing)</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Apply controlled chaos to test system resilience and ability to return to coherence.
              </p>
              
              <div className="flex space-x-2">
                <Button 
                  variant="outline" 
                  className="border-yellow-500 hover:bg-yellow-500/10"
                  onClick={() => applyChaosTest(1)}
                >
                  Warning Level
                </Button>
                <Button 
                  variant="outline" 
                  className="border-orange-500 hover:bg-orange-500/10"
                  onClick={() => applyChaosTest(2)}
                >
                  Critical Level
                </Button>
                <Button 
                  variant="outline" 
                  className="border-red-500 hover:bg-red-500/10"
                  onClick={() => applyChaosTest(3)}
                >
                  Nuclear Level
                </Button>
              </div>
            </div>
          </Tabs>
        </CardContent>
      </Card>
      
      {nexusState && nexusState.goldenRatioDetected && (
        <Card className="border-amber-500">
          <CardHeader className="pb-2">
            <CardTitle className="text-amber-500">Golden Ratio Emergence Detected</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm">
              The system has detected emergent golden ratio (φ = 1.618) patterns in its oscillations, 
              indicating harmonious self-organization and natural optimization.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default CoherenceRatioDashboard;