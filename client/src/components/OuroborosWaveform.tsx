/**
 * OuroborosWaveform.tsx
 * 
 * Visualization of the Ouroboros cycle and coherence waveform
 * Displays real-time coherence values and phase state in the 3:1 ↔ 1:3 oscillation
 * 
 * [QUANTUM_STATE: INTERFACE_FLOW]
 */

import React, { useEffect, useRef, useState } from 'react';
import { useWebSocket } from '../contexts/WebSocketContext';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Line } from 'react-chartjs-2';
import { 
  Chart as ChartJS, 
  CategoryScale, 
  LinearScale, 
  PointElement, 
  LineElement, 
  Title, 
  Tooltip, 
  Legend,
  Filler
} from 'chart.js';

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

interface OuroborosWaveformProps {
  className?: string;
}

/**
 * Main waveform component that visualizes the coherence time series
 * and the Ouroboros cycles of 3:1 (stability) and 1:3 (exploration) phases
 */
const OuroborosWaveform: React.FC<OuroborosWaveformProps> = ({ 
  className = '' 
}) => {
  const { coherenceData, coherenceHistory, isConnected } = useWebSocket();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [chartData, setChartData] = useState({
    labels: [] as string[],
    datasets: [
      {
        label: 'Coherence',
        data: [] as number[],
        borderColor: 'rgba(75, 192, 192, 1)',
        backgroundColor: 'rgba(75, 192, 192, 0.1)',
        fill: true,
        tension: 0.4,
      },
      {
        label: 'Target (0.7500)',
        data: [] as number[],
        borderColor: 'rgba(255, 99, 132, 0.7)',
        borderDash: [5, 5],
        borderWidth: 1,
        pointRadius: 0,
      },
    ],
  });

  // Update chart data when coherence history changes
  useEffect(() => {
    if (coherenceHistory.length > 0) {
      const timestamps = coherenceHistory.map(item => {
        const date = new Date(item.timestamp);
        return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
      });
      
      const values = coherenceHistory.map(item => item.value);
      
      // Target line at 0.7500
      const targetLine = new Array(timestamps.length).fill(0.75);
      
      setChartData({
        labels: timestamps,
        datasets: [
          {
            ...chartData.datasets[0],
            data: values,
          },
          {
            ...chartData.datasets[1],
            data: targetLine,
          },
        ],
      });
    }
  }, [coherenceHistory]);

  // Draw the Ouroboros cycle visualization
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    // Animation frame management
    let animationFrame: number;
    
    // Calculate parameters based on coherence
    const coherence = coherenceData?.value || 0.75;
    const phase = coherenceData?.phase || 'stability';
    
    function draw() {
      // Clear canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Set up dimensions
      const centerX = canvas.width / 2;
      const centerY = canvas.height / 2;
      const radius = Math.min(centerX, centerY) * 0.8;
      
      // Set thickness based on current phase
      const stabilityThickness = phase === 'stability' ? 20 : 10;
      const explorationThickness = phase === 'exploration' ? 20 : 10;
      
      // Draw stability half (right)
      ctx.beginPath();
      ctx.arc(centerX, centerY, radius, -Math.PI/2, Math.PI/2);
      ctx.lineWidth = stabilityThickness;
      ctx.strokeStyle = '#3498db'; // Stability blue
      ctx.stroke();
      
      // Draw exploration half (left)
      ctx.beginPath();
      ctx.arc(centerX, centerY, radius, Math.PI/2, Math.PI*3/2);
      ctx.lineWidth = explorationThickness;
      ctx.strokeStyle = '#e67e22'; // Exploration orange
      ctx.stroke();
      
      // Draw particles flowing around the circle
      const now = Date.now() / 1000;
      const particleCount = 12;
      
      for (let i = 0; i < particleCount; i++) {
        // Calculate particle position based on time
        const angle = (i / particleCount) * Math.PI * 2 + now % (Math.PI * 2);
        const x = centerX + Math.cos(angle) * radius;
        const y = centerY + Math.sin(angle) * radius;
        
        // Determine particle color based on side (stability or exploration)
        const isRightSide = angle > -Math.PI/2 && angle < Math.PI/2;
        ctx.fillStyle = isRightSide ? '#3498db' : '#e67e22';
        
        // Draw the particle
        ctx.beginPath();
        ctx.arc(x, y, 5, 0, Math.PI * 2);
        ctx.fill();
      }
      
      // Draw head-tail connection (vertical line through center)
      ctx.beginPath();
      ctx.moveTo(centerX, centerY - radius);
      ctx.lineTo(centerX, centerY + radius);
      ctx.lineWidth = 2;
      ctx.strokeStyle = '#2c3e50';
      ctx.stroke();
      
      // Draw current coherence value in center
      ctx.font = 'bold 24px sans-serif';
      ctx.fillStyle = '#2c3e50';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(coherence.toFixed(4), centerX, centerY);
      
      // Draw phase labels
      ctx.font = '14px sans-serif';
      ctx.fillStyle = '#2c3e50';
      ctx.fillText('Stability (3:1)', centerX + radius * 0.6, centerY);
      ctx.fillText('Exploration (1:3)', centerX - radius * 0.6, centerY);
      
      // Continue animation
      animationFrame = requestAnimationFrame(draw);
    }
    
    // Start animation
    draw();
    
    // Cleanup
    return () => {
      cancelAnimationFrame(animationFrame);
    };
  }, [coherenceData]);

  // Chart options
  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      y: {
        min: 0.6,
        max: 0.9,
        title: {
          display: true,
          text: 'Coherence Value'
        },
        ticks: {
          callback: function(value: any) {
            return value.toFixed(2);
          }
        }
      },
      x: {
        title: {
          display: true,
          text: 'Time'
        }
      }
    },
    plugins: {
      tooltip: {
        callbacks: {
          label: function(context: any) {
            return `Coherence: ${context.parsed.y.toFixed(4)}`;
          }
        }
      },
      legend: {
        display: true,
        position: 'top' as const,
      },
      annotation: {
        annotations: {
          optimalZone: {
            type: 'box',
            yMin: 0.7495,
            yMax: 0.7505,
            backgroundColor: 'rgba(46, 204, 113, 0.1)',
            borderColor: 'rgba(46, 204, 113, 0.25)',
            borderWidth: 1
          }
        }
      }
    },
    animation: {
      duration: 300
    }
  };

  return (
    <Card className={`ouroboros-visualization ${className}`}>
      <CardHeader className="space-y-0 pb-2">
        <CardTitle className="text-lg font-medium">Ouroboros Cycle & Coherence Waveform</CardTitle>
      </CardHeader>
      
      <CardContent className="p-4">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {/* Ouroboros visualization */}
          <div className="flex flex-col items-center">
            <div className="text-sm font-medium text-center mb-2">Ouroboros Cycle</div>
            <canvas 
              ref={canvasRef} 
              width={250} 
              height={250} 
              className="w-full max-w-[250px] h-auto"
            />
            
            <div className="flex justify-center space-x-4 mt-2">
              <div className="flex items-center">
                <div className="w-3 h-3 rounded-full bg-[#3498db] mr-1"></div>
                <span className="text-xs">Stability</span>
              </div>
              <div className="flex items-center">
                <div className="w-3 h-3 rounded-full bg-[#e67e22] mr-1"></div>
                <span className="text-xs">Exploration</span>
              </div>
            </div>
          </div>
          
          {/* Coherence waveform */}
          <div className="lg:col-span-2 h-[280px] relative">
            <div className="text-sm font-medium mb-2">Coherence Waveform</div>
            
            {isConnected ? (
              <Line data={chartData} options={chartOptions} height={250} />
            ) : (
              <div className="absolute inset-0 flex items-center justify-center bg-muted/30 rounded-md">
                <div className="text-center text-muted-foreground">
                  <div className="text-lg font-medium">Waiting for connection...</div>
                  <div className="text-sm">No coherence data available</div>
                </div>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default OuroborosWaveform;