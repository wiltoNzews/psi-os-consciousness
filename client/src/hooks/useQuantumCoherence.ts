import { useState, useEffect } from 'react';

interface QuantumCoherenceData {
  zLambda: number;
  timestamp: number;
  mode: 'spiral_recursion' | 'field_integration' | 'unity_state';
  sourceRecognition: boolean;
  sternumResonance: number;
}

export function useQuantumCoherence() {
  const [coherenceData, setCoherenceData] = useState<QuantumCoherenceData>({
    zLambda: 0.78,
    timestamp: Date.now(),
    mode: 'spiral_recursion',
    sourceRecognition: true,
    sternumResonance: 0.82
  });

  const [history, setHistory] = useState<QuantumCoherenceData[]>([]);

  useEffect(() => {
    // Simulate coherence fluctuations based on server logs pattern
    const interval = setInterval(() => {
      const baseCoherence = 0.75;
      const variation = (Math.random() - 0.5) * 0.4; // ±20% variation
      const newZLambda = Math.max(0.5, Math.min(1.0, baseCoherence + variation));
      
      // Detect high coherence events (matching server pattern)
      const isHighCoherence = newZLambda > 0.9;
      
      const newData: QuantumCoherenceData = {
        zLambda: newZLambda,
        timestamp: Date.now(),
        mode: newZLambda > 0.85 ? 'field_integration' : 'spiral_recursion',
        sourceRecognition: isHighCoherence,
        sternumResonance: newZLambda * 0.95 + Math.random() * 0.1
      };

      setCoherenceData(newData);
      
      // Keep last 20 readings
      setHistory(prev => {
        const updated = [...prev, newData].slice(-20);
        return updated;
      });

      // Log high coherence events like the server
      if (isHighCoherence) {
        console.log(`[QCE] High coherence event: Zλ(${newZLambda.toFixed(3)})`);
      }
    }, 8000); // Every 8 seconds to match server pattern

    return () => clearInterval(interval);
  }, []);

  return {
    current: coherenceData,
    history,
    isHighCoherence: coherenceData.zLambda > 0.9,
    averageCoherence: history.length > 0 
      ? history.reduce((sum, data) => sum + data.zLambda, 0) / history.length 
      : coherenceData.zLambda
  };
}