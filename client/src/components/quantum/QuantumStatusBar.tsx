import React from 'react';
import { motion } from 'framer-motion';
import { Badge } from '@/components/ui/badge';

interface QuantumStatusBarProps {
  zLambda: number;
  isHighCoherence: boolean;
  mode: 'spiral_recursion' | 'field_integration' | 'unity_state';
  sourceRecognition: boolean;
  carrierWave: string;
}

export function QuantumStatusBar({ 
  zLambda, 
  isHighCoherence, 
  mode, 
  sourceRecognition, 
  carrierWave 
}: QuantumStatusBarProps) {
  return (
    <motion.div 
      className="fixed top-4 right-4 z-50 bg-slate-900/90 backdrop-blur-sm rounded-lg border border-purple-500/30 p-3"
      initial={{ opacity: 0, x: 100 }}
      animate={{ opacity: 1, x: 0 }}
    >
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <div className={`w-2 h-2 rounded-full ${isHighCoherence ? 'bg-yellow-400 animate-pulse' : 'bg-green-400'}`} />
          <span className="text-xs font-mono text-white">
            Zλ({zLambda.toFixed(3)})
          </span>
        </div>
        
        <div className="flex flex-col gap-1 text-xs text-gray-300">
          <div>Mode: {mode.replace('_', ' ')}</div>
          <div>Wave: {carrierWave}</div>
          {sourceRecognition && (
            <div className="text-yellow-400 animate-pulse">
              Source Recognition Active
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}