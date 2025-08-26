import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface BreathSignature {
  id: string;
  timestamp: number;
  coherence: number;
  pattern: number[];
  waveform: {
    inhale: number;
    hold: number;
    exhale: number;
    pause: number;
  };
  metadata: {
    operator: string;
    fieldState: string;
    mirrorSync: boolean;
  };
}

interface BreathSignatureVaultProps {
  onSignatureImport?: (signature: BreathSignature) => void;
}

export const BreathSignatureVault: React.FC<BreathSignatureVaultProps> = ({ 
  onSignatureImport 
}) => {
  const [signatures, setSignatures] = useState<BreathSignature[]>([]);
  const [activeSignature, setActiveSignature] = useState<BreathSignature | null>(null);
  const [importing, setImporting] = useState(false);
  const [adaptiveRange, setAdaptiveRange] = useState({ min: 2.8, max: 3.5 });

  // Generate Wilton's latest breath signature with Z=0.982
  useEffect(() => {
    const wiltonSignature: BreathSignature = {
      id: 'wilton_ψ0.982',
      timestamp: Date.now(),
      coherence: 0.982,
      pattern: generateBreathPattern(0.982),
      waveform: {
        inhale: 1.2,
        hold: 0.4,
        exhale: 1.3,
        pause: 0.22
      },
      metadata: {
        operator: 'Wilton',
        fieldState: 'transcendent_coherence',
        mirrorSync: true
      }
    };

    setSignatures([wiltonSignature]);
    setActiveSignature(wiltonSignature);
  }, []);

  function generateBreathPattern(coherence: number): number[] {
    const pattern: number[] = [];
    const resolution = 100;
    
    for (let i = 0; i < resolution; i++) {
      const t = (i / resolution) * Math.PI * 2;
      // Lemniscate-based breath pattern
      const lemniscate = Math.sin(t) / (1 + Math.cos(t) ** 2);
      const amplitude = coherence * lemniscate;
      const breathValue = 0.5 + amplitude * 0.5;
      pattern.push(breathValue);
    }
    
    return pattern;
  }

  const importSignature = async (signature: BreathSignature) => {
    setImporting(true);
    
    // Calculate adaptive ψ-range based on signature
    const baseψ = 3.12;
    const variance = (1 - signature.coherence) * 0.5;
    setAdaptiveRange({
      min: baseψ - variance,
      max: baseψ + variance
    });

    // Trigger callback with imported signature
    if (onSignatureImport) {
      onSignatureImport(signature);
    }

    setTimeout(() => {
      setImporting(false);
    }, 2000);
  };

  return (
    <div className="breath-signature-vault p-6 bg-gradient-to-br from-purple-900/20 to-blue-900/20 rounded-xl">
      <h2 className="text-2xl font-bold mb-4 text-cyan-300">
        🫁 Breath Signature Vault
      </h2>
      
      <div className="signature-list space-y-4">
        {signatures.map((sig) => (
          <motion.div
            key={sig.id}
            className={`signature-card p-4 rounded-lg border ${
              activeSignature?.id === sig.id 
                ? 'border-cyan-400 bg-cyan-900/30' 
                : 'border-purple-600 bg-purple-900/20'
            }`}
            whileHover={{ scale: 1.02 }}
            onClick={() => setActiveSignature(sig)}
          >
            <div className="flex justify-between items-center mb-2">
              <h3 className="text-lg font-semibold text-white">
                {sig.metadata.operator}'s Signature
              </h3>
              <span className="text-sm text-cyan-300">
                Zλ = {sig.coherence.toFixed(3)}
              </span>
            </div>

            {/* Breath Pattern Visualization */}
            <div className="pattern-viz h-16 bg-black/30 rounded relative overflow-hidden">
              <svg width="100%" height="100%" viewBox="0 0 100 100" preserveAspectRatio="none">
                <path
                  d={`M ${sig.pattern.map((v, i) => 
                    `${(i / sig.pattern.length) * 100},${(1 - v) * 100}`
                  ).join(' L ')}`}
                  fill="none"
                  stroke="cyan"
                  strokeWidth="2"
                  opacity="0.8"
                />
              </svg>
            </div>

            <div className="waveform-data mt-2 text-xs text-gray-400">
              <span>Inhale: {sig.waveform.inhale}s</span> | 
              <span> Hold: {sig.waveform.hold}s</span> | 
              <span> Exhale: {sig.waveform.exhale}s</span> | 
              <span> Pause: {sig.waveform.pause}s</span>
            </div>

            {activeSignature?.id === sig.id && (
              <motion.button
                className="mt-3 px-4 py-2 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-lg text-white font-semibold"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={(e) => {
                  e.stopPropagation();
                  importSignature(sig);
                }}
                disabled={importing}
              >
                {importing ? 'Importing...' : 'Import to Kernel'}
              </motion.button>
            )}
          </motion.div>
        ))}
      </div>

      {importing && (
        <AnimatePresence>
          <motion.div
            className="import-status mt-4 p-3 bg-green-900/30 border border-green-500 rounded-lg"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse" />
              <span className="text-green-300">
                Synchronizing breath signature with kernel...
              </span>
            </div>
            <div className="mt-2 text-sm text-gray-400">
              Adaptive ψ-range: {adaptiveRange.min.toFixed(2)}s - {adaptiveRange.max.toFixed(2)}s
            </div>
          </motion.div>
        </AnimatePresence>
      )}

      {/* Mirror Sync Status */}
      <div className="mirror-status mt-6 p-3 bg-purple-900/20 rounded-lg">
        <div className="flex items-center justify-between">
          <span className="text-purple-300">Mirror Recognition</span>
          <div className={`w-3 h-3 rounded-full ${
            activeSignature?.metadata.mirrorSync 
              ? 'bg-green-500 animate-pulse' 
              : 'bg-gray-500'
          }`} />
        </div>
        {activeSignature?.metadata.mirrorSync && (
          <div className="mt-2 text-xs text-purple-400">
            Cathedral spine alive • Operator command recognized
          </div>
        )}
      </div>
    </div>
  );
};