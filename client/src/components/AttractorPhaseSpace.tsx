/**
 * Attractor Phase Space Visualization
 * 
 * This component provides a specialized visualization showing how coherence values
 * are attracted to the 0.7500 state, similar to a phase space diagram in physics.
 * 
 * [QUANTUM_STATE: VISUALIZATION_FLOW]
 */

import React, { useEffect, useRef, useState } from 'react';
import { Scatter } from 'react-chartjs-2';
import { Chart as ChartJS, LinearScale, PointElement, LineElement, Tooltip, Legend } from 'chart.js';

ChartJS.register(LinearScale, PointElement, LineElement, Tooltip, Legend);

interface AttractorPhaseSpaceProps {
  coherenceHistory: number[];
  perturbationEvents?: {
    index: number;
    value: number;
    type: string;
  }[];
  maxPoints?: number;
}

const AttractorPhaseSpace: React.FC<AttractorPhaseSpaceProps> = ({
  coherenceHistory,
  perturbationEvents = [],
  maxPoints = 100
}) => {
  const optimalCoherence = 0.7500;
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [trajectoryPoints, setTrajectoryPoints] = useState<{x: number, y: number}[]>([]);
  
  // Calculate trajectory points for phase space visualization
  useEffect(() => {
    if (coherenceHistory.length < 2) return;
    
    // Create trajectory points: current value vs rate of change
    const newPoints = [];
    for (let i = 1; i < coherenceHistory.length; i++) {
      const currentValue = coherenceHistory[i];
      const rateOfChange = coherenceHistory[i] - coherenceHistory[i-1];
      
      newPoints.push({
        x: currentValue,
        y: rateOfChange
      });
    }
    
    // Limit the number of points to prevent overcrowding
    const limitedPoints = newPoints.slice(-maxPoints);
    setTrajectoryPoints(limitedPoints);
  }, [coherenceHistory, maxPoints]);
  
  // Create attractor field lines to show the pull toward 0.7500
  const generateAttractorField = () => {
    const fieldPoints = [];
    
    // Generate field lines showing how points would be attracted to 0.7500
    for (let c = 0.65; c <= 0.85; c += 0.005) {
      // Calculate the "force" pulling toward 0.7500 (stronger when further away)
      const force = -(c - optimalCoherence) * 0.1;
      
      fieldPoints.push({
        x: c,
        y: force
      });
    }
    
    return fieldPoints;
  };
  
  // Generate the current attractor field
  const attractorField = generateAttractorField();
  
  // Prepare data for the scatter plot
  const scatterData = {
    datasets: [
      {
        label: 'System Trajectory',
        data: trajectoryPoints,
        backgroundColor: 'rgba(75, 192, 192, 0.8)',
        pointRadius: 5,
        pointHoverRadius: 7,
      },
      {
        label: 'Attractor Field',
        data: attractorField,
        backgroundColor: 'rgba(200, 200, 200, 0.3)',
        pointRadius: 2,
        pointHoverRadius: 2,
      },
      {
        label: 'Optimal Attractor (0.7500)',
        data: [{ x: optimalCoherence, y: 0 }],
        backgroundColor: 'rgba(255, 99, 132, 1)',
        pointRadius: 8,
        pointHoverRadius: 10,
      }
    ]
  };
  
  // Options for the scatter plot
  const scatterOptions = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      x: {
        title: {
          display: true,
          text: 'Coherence Value'
        },
        min: 0.65,
        max: 0.85
      },
      y: {
        title: {
          display: true,
          text: 'Rate of Change'
        },
        min: -0.05,
        max: 0.05
      }
    },
    plugins: {
      tooltip: {
        callbacks: {
          label: function(context: any) {
            const label = context.dataset.label || '';
            const value = `(${context.parsed.x.toFixed(4)}, ${context.parsed.y.toFixed(4)})`;
            return `${label}: ${value}`;
          }
        }
      },
      legend: {
        position: 'top' as const,
      }
    }
  };
  
  return (
    <div className="attractor-phase-space p-4 bg-gray-50 rounded-lg shadow">
      <h3 className="text-lg font-semibold mb-4">0.7500 Attractor Phase Space</h3>
      
      <div className="mb-2">
        <p className="text-sm text-gray-600">
          This visualization shows how the system is attracted to the optimal 0.7500 coherence value.
          Points represent the current coherence value (x-axis) and its rate of change (y-axis).
        </p>
      </div>
      
      <div style={{ height: '300px' }}>
        <Scatter ref={canvasRef} data={scatterData} options={scatterOptions} />
      </div>
      
      <div className="mt-4">
        <h4 className="text-md font-semibold mb-2">Universal Attractor Interpretation</h4>
        <p className="text-sm text-gray-700">
          Just as the 3/4 power law appears across biology and urban systems as an optimal balance,
          WILTON's coherence consistently returns to 0.7500, demonstrating a universal attractor state
          that balances 75% stability with 25% adaptability.
        </p>
      </div>
    </div>
  );
};

export default AttractorPhaseSpace;