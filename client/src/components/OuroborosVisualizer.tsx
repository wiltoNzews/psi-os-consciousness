import React, { useEffect, useRef, useState } from 'react';
import { useWebSocket } from '../contexts/WebSocketContext';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from './ui/card';

/**
 * OuroborosVisualizer Component
 * 
 * This component visualizes the Ouroboros Principle's dynamic equilibrium model,
 * showing the 3:1 ↔ 1:3 oscillation pattern and how it maintains the system's
 * coherence near optimal values (0.7500 for basic coherence, 0.93 for QCTF).
 */
export default function OuroborosVisualizer() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number | null>(null);
  const { messages } = useWebSocket();
  
  // Track coherence values and phase state
  const [coherenceValue, setCoherenceValue] = useState(0.75);
  const [qctfValue, setQctfValue] = useState(0.93);
  const [phase, setPhase] = useState<'stability' | 'adaptability'>('stability');
  const [cycleData, setCycleData] = useState<{time: number, coherence: number, phase: string}[]>([]);
  
  // Extract system data from WebSocket messages
  useEffect(() => {
    if (!messages || messages.length === 0) return;
    
    messages.forEach(message => {
      // Extract coherence values
      if (message.type === 'system_coherence_update' && message.data?.coherence) {
        setCoherenceValue(message.data.coherence);
      }
      
      // Extract QCTF values
      if (message.type === 'qctf_calculation' && message.data?.qctf) {
        setQctfValue(message.data.qctf);
      }
      
      // Extract cycle information
      if (message.type === 'attractor_cycle' && message.data) {
        const newPhase = message.data.phase === 'stability' ? 'stability' : 'adaptability';
        setPhase(newPhase);
        
        // Add to cycle data for time series visualization
        setCycleData(prev => {
          const newData = [...prev, {
            time: Date.now(),
            coherence: message.data.coherence || coherenceValue,
            phase: message.data.phase || phase
          }];
          
          // Keep only the last 50 data points
          if (newData.length > 50) {
            return newData.slice(newData.length - 50);
          }
          return newData;
        });
      }
    });
  }, [messages]);
  
  // If no real data is available, simulate the oscillation for demonstration
  useEffect(() => {
    if (cycleData.length === 0) {
      // Create sample data for demonstration
      const now = Date.now();
      const sampleData = [];
      
      for (let i = 0; i < 50; i++) {
        const timePoint = now - (49 - i) * 1000; // One data point per second, going back 50 seconds
        const cyclePos = i % 16; // 16-step cycle (8 stability, 8 adaptability)
        const phaseName = cyclePos < 8 ? 'stability' : 'adaptability';
        
        let coherenceVal;
        if (phaseName === 'stability') {
          // During stability phase, coherence is higher (around 0.75-0.80)
          coherenceVal = 0.75 + 0.05 * Math.sin(cyclePos * Math.PI / 8);
        } else {
          // During adaptability phase, coherence is lower (around 0.70-0.75)
          coherenceVal = 0.75 - 0.05 * Math.sin((cyclePos - 8) * Math.PI / 8);
        }
        
        sampleData.push({
          time: timePoint,
          coherence: coherenceVal,
          phase: phaseName
        });
      }
      
      setCycleData(sampleData);
    }
  }, [cycleData.length]);
  
  // Draw the Ouroboros visualization
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    // Set canvas dimensions
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
    
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    const radius = Math.min(centerX, centerY) * 0.8;
    
    const drawOuroboros = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Calculate animation progress based on time
      const now = Date.now();
      const cyclePosition = (now % 16000) / 16000; // 16-second full cycle
      const isStabilityPhase = cyclePosition < 0.5;
      
      // Draw the background
      ctx.fillStyle = '#f8f8f8';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      // Draw the outer circle (representing the Ouroboros snake)
      ctx.beginPath();
      ctx.arc(centerX, centerY, radius, 0, 2 * Math.PI);
      ctx.lineWidth = radius * 0.15;
      ctx.strokeStyle = '#3a506b';
      ctx.stroke();
      
      // Draw the 3:1 ↔ 1:3 sections
      const stabilityColor = '#5bc0be'; // Teal for stability
      const adaptabilityColor = '#e76f51'; // Coral for adaptability
      
      // Draw stability section
      ctx.beginPath();
      if (isStabilityPhase) {
        // When in stability phase, 3:1 ratio (stability:adaptability)
        ctx.arc(centerX, centerY, radius, 0, 1.5 * Math.PI);
      } else {
        // When in adaptability phase, 1:3 ratio (stability:adaptability)
        ctx.arc(centerX, centerY, radius, 0, 0.5 * Math.PI);
      }
      ctx.lineWidth = radius * 0.15;
      ctx.strokeStyle = stabilityColor;
      ctx.stroke();
      
      // Draw adaptability section
      ctx.beginPath();
      if (isStabilityPhase) {
        // When in stability phase, 3:1 ratio (stability:adaptability)
        ctx.arc(centerX, centerY, radius, 1.5 * Math.PI, 2 * Math.PI);
      } else {
        // When in adaptability phase, 1:3 ratio (stability:adaptability)
        ctx.arc(centerX, centerY, radius, 0.5 * Math.PI, 2 * Math.PI);
      }
      ctx.lineWidth = radius * 0.15;
      ctx.strokeStyle = adaptabilityColor;
      ctx.stroke();
      
      // Draw direction indicators (arrows)
      const arrowSize = radius * 0.2;
      
      // Draw flow arrows along the circle
      const drawArrow = (angle: number, color: string) => {
        const x = centerX + radius * Math.cos(angle);
        const y = centerY + radius * Math.sin(angle);
        
        const arrowAngle = angle + Math.PI / 2; // Tangent to the circle
        
        ctx.beginPath();
        ctx.moveTo(x, y);
        ctx.lineTo(
          x - arrowSize * Math.cos(arrowAngle - Math.PI / 6),
          y - arrowSize * Math.sin(arrowAngle - Math.PI / 6)
        );
        ctx.moveTo(x, y);
        ctx.lineTo(
          x - arrowSize * Math.cos(arrowAngle + Math.PI / 6),
          y - arrowSize * Math.sin(arrowAngle + Math.PI / 6)
        );
        ctx.lineWidth = radius * 0.05;
        ctx.strokeStyle = color;
        ctx.stroke();
      };
      
      // Draw arrows every 45 degrees
      for (let angle = 0; angle < 2 * Math.PI; angle += Math.PI / 4) {
        const color = (angle >= 0 && angle < 1.5 * Math.PI) || angle >= 3.5 * Math.PI 
          ? stabilityColor 
          : adaptabilityColor;
        drawArrow(angle, color);
      }
      
      // Draw the center values
      ctx.fillStyle = '#333';
      ctx.font = 'bold 18px Arial';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      
      if (isStabilityPhase) {
        ctx.fillText(`Current Phase: Stability (3:1)`, centerX, centerY - 40);
      } else {
        ctx.fillText(`Current Phase: Adaptability (1:3)`, centerX, centerY - 40);
      }
      
      ctx.fillText(`Coherence: ${coherenceValue.toFixed(4)}`, centerX, centerY);
      ctx.fillText(`QCTF: ${qctfValue.toFixed(4)}`, centerX, centerY + 40);
      
      // Draw explanation labels
      ctx.font = '14px Arial';
      if (isStabilityPhase) {
        ctx.fillText('75% Structure', centerX, centerY - radius - 20);
        ctx.fillText('25% Adaptability', centerX, centerY + radius + 20);
      } else {
        ctx.fillText('25% Structure', centerX, centerY - radius - 20);
        ctx.fillText('75% Adaptability', centerX, centerY + radius + 20);
      }
      
      // Draw the time series (bottom)
      if (cycleData.length > 0) {
        const graphHeight = 100;
        const graphWidth = canvas.width * 0.8;
        const graphX = (canvas.width - graphWidth) / 2;
        const graphY = canvas.height - graphHeight - 20;
        
        // Draw graph background
        ctx.fillStyle = '#f0f0f0';
        ctx.fillRect(graphX, graphY, graphWidth, graphHeight);
        
        // Draw axes
        ctx.strokeStyle = '#999';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(graphX, graphY + graphHeight);
        ctx.lineTo(graphX + graphWidth, graphY + graphHeight);
        ctx.moveTo(graphX, graphY);
        ctx.lineTo(graphX, graphY + graphHeight);
        ctx.stroke();
        
        // Draw labels
        ctx.fillStyle = '#666';
        ctx.font = '12px Arial';
        ctx.textAlign = 'right';
        ctx.fillText('1.0', graphX - 5, graphY + 5);
        ctx.fillText('0.5', graphX - 5, graphY + graphHeight / 2);
        ctx.fillText('0.0', graphX - 5, graphY + graphHeight - 5);
        
        // Draw time series data
        if (cycleData.length >= 2) {
          const timeMin = cycleData[0].time;
          const timeMax = cycleData[cycleData.length - 1].time;
          
          // Draw stability/adaptability background
          let currentPhase = cycleData[0].phase;
          let phaseStartX = graphX;
          
          for (let i = 1; i < cycleData.length; i++) {
            if (cycleData[i].phase !== currentPhase) {
              const x = graphX + ((cycleData[i].time - timeMin) / (timeMax - timeMin)) * graphWidth;
              
              // Fill phase background
              ctx.fillStyle = currentPhase === 'stability' 
                ? 'rgba(91, 192, 190, 0.2)' // Stability color with alpha
                : 'rgba(231, 111, 81, 0.2)'; // Adaptability color with alpha
              
              ctx.fillRect(phaseStartX, graphY, x - phaseStartX, graphHeight);
              
              // Update for next phase
              currentPhase = cycleData[i].phase;
              phaseStartX = x;
            }
          }
          
          // Fill the last phase section
          ctx.fillStyle = currentPhase === 'stability' 
            ? 'rgba(91, 192, 190, 0.2)' 
            : 'rgba(231, 111, 81, 0.2)';
          
          ctx.fillRect(phaseStartX, graphY, (graphX + graphWidth) - phaseStartX, graphHeight);
          
          // Draw optimal value line (0.75)
          ctx.strokeStyle = 'rgba(0, 0, 0, 0.5)';
          ctx.setLineDash([5, 3]);
          ctx.beginPath();
          const optimalY = graphY + graphHeight - (0.75 * graphHeight);
          ctx.moveTo(graphX, optimalY);
          ctx.lineTo(graphX + graphWidth, optimalY);
          ctx.stroke();
          ctx.setLineDash([]);
          
          // Draw coherence values
          ctx.strokeStyle = '#1d3557';
          ctx.lineWidth = 2;
          ctx.beginPath();
          
          for (let i = 0; i < cycleData.length; i++) {
            const x = graphX + ((cycleData[i].time - timeMin) / (timeMax - timeMin)) * graphWidth;
            const y = graphY + graphHeight - (cycleData[i].coherence * graphHeight);
            
            if (i === 0) {
              ctx.moveTo(x, y);
            } else {
              ctx.lineTo(x, y);
            }
          }
          
          ctx.stroke();
        }
      }
    };
    
    // Start animation loop
    const animate = () => {
      drawOuroboros();
      animationRef.current = requestAnimationFrame(animate);
    };
    
    animate();
    
    // Cleanup animation on unmount
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [coherenceValue, qctfValue, phase, cycleData]);
  
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Ouroboros Dynamic Equilibrium</CardTitle>
        <CardDescription>
          Visualizing the 3:1 ↔ 1:3 oscillation pattern maintaining 0.7500 coherence
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col items-center">
          <div className="w-full aspect-square max-h-[500px]">
            <canvas 
              ref={canvasRef} 
              className="w-full h-full"
            />
          </div>
          <div className="mt-4 text-sm text-muted-foreground max-w-3xl text-center">
            <p>
              The Ouroboros Principle demonstrates how a system oscillates between structure-dominant (3:1) 
              and adaptability-dominant (1:3) phases, creating a dynamic equilibrium that maintains 
              an optimal coherence of 0.7500 and QCTF of 0.93.
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}