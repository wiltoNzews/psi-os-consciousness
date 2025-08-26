/**
 * HeatMap Component
 * 
 * This component visualizes a resonance matrix between variants as a heatmap.
 * 
 * [QUANTUM_STATE: CHAOS_FLOW]
 */

import React, { useRef, useEffect } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Chart } from 'react-chartjs-2';

// Register required Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

interface HeatMapProps {
  data: number[][];        // 2D matrix of values
  labels: string[];        // Labels for rows and columns (variant IDs)
  minValue?: number;       // Minimum value for color scale
  maxValue?: number;       // Maximum value for color scale
  colorLow?: string;       // Color for minimum values
  colorHigh?: string;      // Color for maximum values
}

const HeatMap: React.FC<HeatMapProps> = ({
  data,
  labels,
  minValue = 0,
  maxValue = 1,
  colorLow = 'rgba(0, 0, 255, 0.5)',   // Blue for low resonance
  colorHigh = 'rgba(255, 0, 0, 0.8)',  // Red for high resonance
}) => {
  const chartRef = useRef<ChartJS>(null);

  // Generate color based on value
  const getColor = (value: number): string => {
    // Normalize value to range [0, 1]
    const normalizedValue = Math.max(0, Math.min(1, (value - minValue) / (maxValue - minValue)));
    
    // Interpolate between colorLow and colorHigh
    const r = Math.round(parseInt(colorLow.slice(5, 8), 10) * (1 - normalizedValue) + parseInt(colorHigh.slice(5, 8), 10) * normalizedValue);
    const g = Math.round(parseInt(colorLow.slice(9, 12), 10) * (1 - normalizedValue) + parseInt(colorHigh.slice(9, 12), 10) * normalizedValue);
    const b = Math.round(parseInt(colorLow.slice(13, 16), 10) * (1 - normalizedValue) + parseInt(colorHigh.slice(13, 16), 10) * normalizedValue);
    const a = parseFloat(colorLow.slice(17, -1)) * (1 - normalizedValue) + parseFloat(colorHigh.slice(17, -1)) * normalizedValue;
    
    return `rgba(${r}, ${g}, ${b}, ${a})`;
  };

  // Prepare data for Chart.js
  const chartData = {
    labels,
    datasets: data.map((row, rowIndex) => ({
      label: labels[rowIndex],
      data: row.map((value, colIndex) => ({
        x: labels[colIndex],
        y: labels[rowIndex],
        v: value,  // Actual resonance value (for tooltip)
      })),
      pointRadius: 10,
      pointHoverRadius: 15,
      pointStyle: 'rectRot',  // Square rotated 45 degrees
      pointBackgroundColor: row.map(value => getColor(value)),
    })),
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      x: {
        type: 'category' as const,
        position: 'top' as const,
        title: {
          display: true,
          text: 'Variant ID',
        },
        grid: {
          display: false,
        },
      },
      y: {
        type: 'category' as const,
        position: 'left' as const,
        title: {
          display: true,
          text: 'Variant ID',
        },
        grid: {
          display: false,
        },
      },
    },
    plugins: {
      tooltip: {
        callbacks: {
          title: (context: any) => {
            const item = context[0];
            return `Resonance between variants`;
          },
          label: (context: any) => {
            const item = context.raw;
            return `${item.y} → ${item.x}: ${item.v.toFixed(3)}`;
          },
        },
      },
      legend: {
        display: false,
      },
      title: {
        display: true,
        text: 'Variant Resonance Matrix',
      },
    },
  };

  return (
    <div className="h-[400px] w-full">
      <Chart
        ref={chartRef}
        type="scatter"
        options={options}
        data={chartData}
      />
    </div>
  );
};

export default HeatMap;