/**
 * NeuralInterface - Main Component
 * 
 * This is the primary integration component that brings together all the core components
 * of the PassiveWorks neural platform. It provides a cohesive interface to the rest of
 * the application while abstracting the complexity of the neural processing system.
 */

import { useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { 
  CognitiveAdapter, 
  NeuralField, 
  InsightPanel, 
  ModalityBridge,
  ModalityType
} from '@/components/core';
import { DomainType, useDomain } from '@/contexts/DomainContext';
import { Eye, EyeOff, Maximize, Minimize, RotateCcw, Volume2, VolumeX } from 'lucide-react';

interface NeuralInterfaceProps {
  className?: string;
}

export function NeuralInterface({
  className = ''
}: NeuralInterfaceProps) {
  const { domainConfig } = useDomain();
  
  // UI Control states
  const [showLabels, setShowLabels] = useState(false);
  const [showDetails, setShowDetails] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [audioEnabled, setAudioEnabled] = useState(false);
  
  // Selected node for details
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);
  
  // Handle node selection
  const handleNodeSelect = useCallback((nodeId: string) => {
    setSelectedNodeId(prevId => prevId === nodeId ? null : nodeId);
  }, []);
  
  // Toggle fullscreen
  const toggleFullscreen = useCallback(() => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(err => {
        console.error(`Error attempting to enable fullscreen: ${err.message}`);
      });
      setIsFullscreen(true);
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
        setIsFullscreen(false);
      }
    }
  }, []);
  
  // Reset interface
  const handleReset = useCallback(() => {
    setSelectedNodeId(null);
    setShowDetails(true);
    // Neural processing reset happens in CognitiveAdapter
  }, []);
  
  return (
    <div className={`neural-interface w-full h-full relative ${className}`}>
      <CognitiveAdapter>
        {({ patterns, activePatterns, metrics, learningPhase, recommendations, isProcessing }) => (
          <ModalityBridge
            metrics={metrics}
            recommendations={recommendations}
            learningPhase={learningPhase}
          >
            {({ activeModality, transitionProgress, densityFactor, temporalFactor }) => (
              <>
                {/* Main visualization */}
                <div className="w-full h-full absolute inset-0 z-10">
                  <NeuralField 
                    patterns={patterns}
                    activePatterns={activePatterns}
                    metrics={metrics}
                    showLabels={showLabels}
                    showNodeDetails={showDetails}
                    onNodeSelect={handleNodeSelect}
                  />
                </div>
                
                {/* UI Controls */}
                <div className="absolute bottom-4 right-4 z-50 flex space-x-2">
                  <motion.button
                    className={`w-10 h-10 rounded-full flex items-center justify-center 
                             transition-colors duration-200 ${showLabels ? 'bg-white/20' : 'bg-black/30'}`}
                    whileHover={{ scale: 1.05, backgroundColor: 'rgba(255, 255, 255, 0.3)' }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setShowLabels(prev => !prev)}
                    aria-label={showLabels ? "Hide labels" : "Show labels"}
                  >
                    {showLabels ? (
                      <EyeOff className="h-5 w-5 text-white" />
                    ) : (
                      <Eye className="h-5 w-5 text-white" />
                    )}
                  </motion.button>
                  
                  <motion.button
                    className="w-10 h-10 rounded-full flex items-center justify-center bg-black/30"
                    whileHover={{ scale: 1.05, backgroundColor: 'rgba(255, 255, 255, 0.3)' }}
                    whileTap={{ scale: 0.95 }}
                    onClick={toggleFullscreen}
                    aria-label={isFullscreen ? "Exit fullscreen" : "Enter fullscreen"}
                  >
                    {isFullscreen ? (
                      <Minimize className="h-5 w-5 text-white" />
                    ) : (
                      <Maximize className="h-5 w-5 text-white" />
                    )}
                  </motion.button>
                  
                  <motion.button
                    className={`w-10 h-10 rounded-full flex items-center justify-center 
                             transition-colors duration-200 ${audioEnabled ? 'bg-white/20' : 'bg-black/30'}`}
                    whileHover={{ scale: 1.05, backgroundColor: 'rgba(255, 255, 255, 0.3)' }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setAudioEnabled(prev => !prev)}
                    aria-label={audioEnabled ? "Disable audio" : "Enable audio"}
                  >
                    {audioEnabled ? (
                      <Volume2 className="h-5 w-5 text-white" />
                    ) : (
                      <VolumeX className="h-5 w-5 text-white" />
                    )}
                  </motion.button>
                  
                  <motion.button
                    className="w-10 h-10 rounded-full flex items-center justify-center bg-black/30"
                    whileHover={{ scale: 1.05, backgroundColor: 'rgba(255, 255, 255, 0.3)' }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleReset}
                    aria-label="Reset interface"
                  >
                    <RotateCcw className="h-5 w-5 text-white" />
                  </motion.button>
                </div>
                
                {/* Insights panel - conditionally shown based on showDetails */}
                {showDetails && learningPhase > 0.2 && (
                  <div className="absolute top-4 right-4 z-40 max-w-xs w-full">
                    <InsightPanel 
                      metrics={metrics}
                      learningPhase={learningPhase}
                      recommendations={recommendations}
                    />
                  </div>
                )}
                
                {/* Processing indicator */}
                {isProcessing && (
                  <motion.div 
                    className="absolute bottom-4 left-4 z-50 bg-black/40 backdrop-blur-sm 
                              rounded-lg px-3 py-1.5 text-sm text-white/80 border border-white/10"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <div className="flex items-center space-x-2">
                      <div 
                        className="w-1.5 h-1.5 rounded-full animate-pulse"
                        style={{ backgroundColor: domainConfig.accentColor }}
                      />
                      <span>Processing neural patterns...</span>
                    </div>
                  </motion.div>
                )}
                
                {/* Learning phase indicator - only shown at early stages */}
                {learningPhase < 0.3 && (
                  <motion.div 
                    className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2
                              bg-black/60 backdrop-blur-md rounded-lg p-4 text-white z-50
                              border border-white/10 max-w-md w-full text-center"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5 }}
                  >
                    <h3 className="text-xl font-medium mb-2">Neural Calibration</h3>
                    <p className="mb-4 text-white/80">
                      The system is learning from your interaction patterns.
                      Move your mouse and explore the interface to accelerate learning.
                    </p>
                    <div className="h-1.5 bg-white/10 rounded-full w-full">
                      <motion.div 
                        className="h-1.5 rounded-full"
                        style={{ 
                          width: `${learningPhase * 100}%`,
                          background: `linear-gradient(to right, ${domainConfig.gradientFrom}, ${domainConfig.gradientTo})`
                        }}
                        initial={{ width: 0 }}
                        animate={{ width: `${learningPhase * 100}%` }}
                        transition={{ duration: 0.5 }}
                      />
                    </div>
                    <p className="mt-2 text-sm text-white/60">
                      {Math.round(learningPhase * 100)}% complete
                    </p>
                  </motion.div>
                )}
                
                {/* Modality-specific UI elements */}
                {activeModality === 'textual' && learningPhase > 0.5 && (
                  <motion.div 
                    className="absolute bottom-20 left-1/2 transform -translate-x-1/2 
                              bg-black/30 backdrop-blur-sm rounded-lg p-3 text-white z-30
                              border border-white/10 max-w-lg w-full"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                  >
                    <p className="text-sm">
                      Textual interface activated due to detected cognitive state.
                      {metrics.cognitiveLoad > 0.6 ? 
                        " High cognitive load detected - simplifying presentation." : 
                        " Moderate cognitive load - balanced presentation."
                      }
                    </p>
                  </motion.div>
                )}
                
                {/* Domain context indicator */}
                <motion.div 
                  className="absolute top-4 left-4 z-40 bg-black/30 backdrop-blur-sm 
                            rounded-lg px-3 py-1.5 border border-white/10"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                >
                  <div className="flex items-center space-x-2">
                    <div 
                      className="w-2 h-2 rounded-full"
                      style={{ backgroundColor: domainConfig.color }}
                    />
                    <span className="text-white/90 text-sm font-medium">
                      {domainConfig.name}
                    </span>
                  </div>
                </motion.div>
              </>
            )}
          </ModalityBridge>
        )}
      </CognitiveAdapter>
    </div>
  );
}