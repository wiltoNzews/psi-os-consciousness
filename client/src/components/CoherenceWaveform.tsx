import React, { useEffect, useRef, useState } from 'react';
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
  ChartOptions,
} from 'chart.js';

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

interface CoherenceWaveformProps {
  currentCoherence?: number;
  historyLength?: number;
  title?: string;
  height?: number;
}

/**
 * CoherenceWaveform - A visualization component that displays the system's 
 * coherence value over time as a waveform graph, highlighting the optimal 0.7500 value.
 * 
 * This component demonstrates the fluctuations in system coherence and its
 * natural tendency to return to the 0.7500 attractor state.
 */
const CoherenceWaveform: React.FC<CoherenceWaveformProps> = ({
  currentCoherence = 0.75,
  historyLength = 20,
  title = 'Coherence Waveform',
  height = 300,
}) => {
  // Store historical coherence values
  const [coherenceHistory, setCoherenceHistory] = useState<number[]>(
    Array(historyLength).fill(0.75)
  );
  
  // Update history when current coherence changes
  useEffect(() => {
    setCoherenceHistory(prev => {
      const newHistory = [...prev, currentCoherence];
      // Keep only the most recent 'historyLength' values
      if (newHistory.length > historyLength) {
        return newHistory.slice(newHistory.length - historyLength);
      }
      return newHistory;
    });
  }, [currentCoherence, historyLength]);

  // Create labels for the x-axis (time points)
  const labels = Array.from({ length: coherenceHistory.length }, (_, i) => `t-${coherenceHistory.length - i - 1}`);

  // Generate chart data
  const data = {
    labels,
    datasets: [
      {
        label: 'System Coherence',
        data: coherenceHistory,
        borderColor: 'rgba(75, 192, 192, 1)',
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
        tension: 0.4, // Makes the line curved for a smoother waveform appearance
        fill: true,
      },
      {
        label: 'Optimal Coherence (0.7500)',
        data: Array(coherenceHistory.length).fill(0.75),
        borderColor: 'rgba(255, 99, 132, 0.8)',
        borderWidth: 2,
        borderDash: [5, 5], // Creates a dashed line
        pointRadius: 0, // Hides the points
        fill: false,
      },
    ],
  };

  // Chart options
  const options: ChartOptions<'line'> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top' as const,
        labels: {
          color: '#e0e0e0', // Light text for dark background
          font: {
            size: 12
          }
        }
      },
      title: {
        display: !!title,
        text: title,
        color: '#e0e0e0', // Light text for dark background
        font: {
          size: 16
        }
      },
      tooltip: {
        callbacks: {
          label: (context) => {
            const value = context.parsed.y;
            // Display the exact value and the deviation from optimal
            const deviation = Math.abs(typeof value === 'number' ? value - 0.75 : 0).toFixed(4);
            return [
              `Coherence: ${typeof value === 'number' ? value.toFixed(4) : value}`,
              `Deviation: ${deviation}`
            ];
          }
        }
      }
    },
    scales: {
      x: {
        title: {
          display: true,
          text: 'Time',
          color: '#e0e0e0', // Light text for dark background
        },
        ticks: {
          color: '#e0e0e0', // Light text for dark background
        },
        grid: {
          color: 'rgba(255, 255, 255, 0.1)', // Subtle grid lines
        }
      },
      y: {
        title: {
          display: true,
          text: 'Coherence Value',
          color: '#e0e0e0', // Light text for dark background
        },
        min: 0,
        max: 1,
        ticks: {
          color: '#e0e0e0', // Light text for dark background
          callback: (value: number | string) => typeof value === 'number' ? value.toFixed(2) : value.toString() // Format tick labels
        },
        grid: {
          color: 'rgba(255, 255, 255, 0.1)', // Subtle grid lines
        }
      }
    },
    animation: {
      duration: 800, // Animation duration in milliseconds
      easing: 'easeOutQuart', // Easing function
    }
  };

  return (
    <div 
      className="bg-slate-800 p-4 rounded-lg shadow-lg" 
      style={{ height: height }}
      aria-label="Coherence waveform chart displaying system stability over time"
      role="img"
    >
      <Line data={data} options={options} />
    </div>
  );
};

export default CoherenceWaveform;