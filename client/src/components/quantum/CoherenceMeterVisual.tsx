import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface CoherenceMeterVisualProps {
  coherenceMetrics: {
    coherenceIndex: number;
    explorationIndex: number;
    balanceRatio: number;
    goldenRatioDetected?: boolean;
    timestamp?: string;
  } | null;
  loading: boolean;
  height?: number;
}

/**
 * A dynamic fractal-based coherence visualization component
 * that displays real-time quantum metrics
 */
export function CoherenceMeterVisual({ 
  coherenceMetrics, 
  loading,
  height = 140
}: CoherenceMeterVisualProps) {
  const [pulseEffect, setPulseEffect] = useState(false);
  
  useEffect(() => {
    if (coherenceMetrics) {
      setPulseEffect(true);
      const timer = setTimeout(() => setPulseEffect(false), 1000);
      return () => clearTimeout(timer);
    }
  }, [coherenceMetrics]);

  // Default values if no metrics
  const coherenceIndex = coherenceMetrics?.coherenceIndex || 0.7500;
  const explorationIndex = coherenceMetrics?.explorationIndex || 0.2494;
  const balanceRatio = coherenceMetrics?.balanceRatio || 3.0072;
  const goldenRatioDetected = coherenceMetrics?.goldenRatioDetected || false;
  
  // Optimal values based on the 3:1 ratio (0.7500:0.2494)
  const optimalCoherence = 0.7500;
  const optimalExploration = 0.2494;
  const optimalRatio = 3.0072; // Approximately 3:1
  
  // Calculate deviations from optimal
  const coherenceDeviation = (coherenceIndex - optimalCoherence) / optimalCoherence;
  const explorationDeviation = (explorationIndex - optimalExploration) / optimalExploration;
  const ratioDeviation = (balanceRatio - optimalRatio) / optimalRatio;
  
  // Determine color based on how close we are to the golden ratio
  const getBalanceColor = () => {
    const deviation = Math.abs(ratioDeviation);
    if (deviation < 0.05) return 'rgb(255, 215, 0)'; // Gold for very close
    if (deviation < 0.15) return 'rgb(76, 175, 80)'; // Green for close
    if (deviation < 0.30) return 'rgb(255, 152, 0)'; // Orange for medium
    return 'rgb(244, 67, 54)'; // Red for far
  };

  return (
    <div 
      className="relative w-full rounded-lg overflow-hidden backdrop-blur-sm border border-white/10 p-4 bg-black/20"
      style={{ height: `${height}px` }}
    >
      <div className="absolute inset-0 bg-gradient-to-br from-indigo-900/20 to-purple-900/20" />
      
      {/* Central balance meter */}
      <div className="absolute inset-0 flex items-center justify-center">
        <motion.div 
          className={cn(
            "relative flex items-center justify-center rounded-full transition-shadow duration-500",
            goldenRatioDetected ? "shadow-[0_0_30px_5px_rgba(255,215,0,0.5)]" : ""
          )}
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ 
            scale: loading ? [0.95, 1.05, 0.95] : 1, 
            opacity: 1,
            rotate: loading ? [0, 5, -5, 0] : 0
          }}
          transition={{ 
            duration: loading ? 2 : 0.5, 
            repeat: loading ? Infinity : 0,
            type: "spring",
            stiffness: 300,
            damping: 20
          }}
          style={{ 
            width: `${height * 0.6}px`, 
            height: `${height * 0.6}px`,
            backgroundColor: getBalanceColor(),
            opacity: 0.9
          }}
        >
          <motion.div 
            className="absolute inset-0 rounded-full bg-white"
            animate={{ 
              opacity: [0.1, 0.3, 0.1],
              scale: pulseEffect ? [1, 1.15, 1] : 1
            }}
            transition={{ 
              duration: pulseEffect ? 1 : 0,
              repeat: 0
            }}
          />
          
          <div className="z-10 text-center">
            <motion.div 
              className="text-lg font-mono font-bold text-black"
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2 }}
            >
              {balanceRatio.toFixed(2)}
            </motion.div>
            <div className="text-xs font-medium text-black/70">Balance Ratio</div>
          </div>
        </motion.div>
      </div>
      
      {/* Coherence indicator (left) */}
      <motion.div 
        className="absolute top-1/2 left-[15%] transform -translate-y-1/2"
        initial={{ x: -20, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ delay: 0.3 }}
      >
        <div className="text-center">
          <div 
            className="w-12 h-12 mx-auto rounded-full flex items-center justify-center"
            style={{ 
              backgroundColor: `rgba(59, 130, 246, ${0.5 + (coherenceDeviation > 0 ? 0.3 : -0.3) * Math.min(Math.abs(coherenceDeviation), 1)})` 
            }}
          >
            <motion.div 
              className="font-mono font-bold text-white"
              animate={{ scale: pulseEffect ? [1, 1.1, 1] : 1 }}
              transition={{ duration: 0.5 }}
            >
              {(coherenceIndex * 100).toFixed(1)}%
            </motion.div>
          </div>
          <div className="text-xs mt-1 text-white/70">Coherence</div>
        </div>
      </motion.div>
      
      {/* Exploration indicator (right) */}
      <motion.div 
        className="absolute top-1/2 right-[15%] transform -translate-y-1/2"
        initial={{ x: 20, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ delay: 0.3 }}
      >
        <div className="text-center">
          <div 
            className="w-12 h-12 mx-auto rounded-full flex items-center justify-center"
            style={{ 
              backgroundColor: `rgba(245, 158, 11, ${0.5 + (explorationDeviation > 0 ? 0.3 : -0.3) * Math.min(Math.abs(explorationDeviation), 1)})` 
            }}
          >
            <motion.div 
              className="font-mono font-bold text-white"
              animate={{ scale: pulseEffect ? [1, 1.1, 1] : 1 }}
              transition={{ duration: 0.5 }}
            >
              {(explorationIndex * 100).toFixed(1)}%
            </motion.div>
          </div>
          <div className="text-xs mt-1 text-white/70">Exploration</div>
        </div>
      </motion.div>
      
      {/* Golden ratio indicator */}
      {goldenRatioDetected && (
        <motion.div 
          className="absolute bottom-2 left-0 right-0 text-center"
          initial={{ y: 10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          <motion.div 
            className="inline-block px-3 py-1 rounded-full text-xs font-medium bg-yellow-400/90 text-black"
            animate={{ 
              scale: [1, 1.05, 1],
              boxShadow: [
                '0 0 0 0 rgba(255, 215, 0, 0)',
                '0 0 0 6px rgba(255, 215, 0, 0.3)',
                '0 0 0 0 rgba(255, 215, 0, 0)'
              ]
            }}
            transition={{ 
              duration: 2,
              repeat: Infinity,
              repeatType: "loop"
            }}
          >
            ✨ Golden Ratio Detected
          </motion.div>
        </motion.div>
      )}
      
      {/* Loading indicator */}
      {loading && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/30 backdrop-blur-sm">
          <motion.div 
            className="w-16 h-16 border-4 border-indigo-500 border-t-transparent rounded-full"
            animate={{ rotate: 360 }}
            transition={{ 
              duration: 1.5, 
              repeat: Infinity,
              ease: "linear"
            }}
          />
        </div>
      )}
    </div>
  );
}

export default CoherenceMeterVisual;