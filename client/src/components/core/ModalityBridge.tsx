/**
 * ModalityBridge Component
 * 
 * This component handles the smooth transition between different interaction
 * modalities (visual, textual, etc.) based on the neural metrics and symbiosis
 * recommendations.
 * 
 * It acts as a coordination layer between different input/output modalities,
 * creating a cohesive experience that adapts to the user's cognitive state.
 */

import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { DomainType, useDomain } from '@/contexts/DomainContext';
import { NeuralMetrics, SymbiosisRecommendation } from '@/lib/SymbiosisEngine';

export type ModalityType = 'visual' | 'textual' | 'spatial' | 'audio';

interface ModalityBridgeProps {
  metrics: NeuralMetrics;
  recommendations: SymbiosisRecommendation[];
  learningPhase: number;
  children: (props: {
    activeModality: ModalityType;
    transitionProgress: number;
    densityFactor: number;
    temporalFactor: number;
  }) => React.ReactNode;
  className?: string;
}

export function ModalityBridge({
  metrics,
  recommendations,
  learningPhase,
  children,
  className = ''
}: ModalityBridgeProps) {
  const { domainConfig } = useDomain();
  
  // Active modality state
  const [activeModality, setActiveModality] = useState<ModalityType>('visual');
  
  // Transition state
  const [transitionProgress, setTransitionProgress] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  
  // Adaptation factors
  const [densityFactor, setDensityFactor] = useState(0.5); // Information density
  const [temporalFactor, setTemporalFactor] = useState(1.0); // Interaction tempo
  
  // Determine optimal modality based on metrics and recommendations
  useEffect(() => {
    // Only change modality at certain thresholds to prevent constant switching
    // and only after sufficient learning has occurred
    if (learningPhase < 0.4) return;
    
    // Find information density recommendation
    const densityRec = recommendations.find(r => r.type === 'information_density');
    
    // Find tempo recommendation
    const tempoRec = recommendations.find(r => r.type === 'interaction_tempo');
    
    // Update adaptation factors if we have recommendations
    if (densityRec) {
      setDensityFactor(densityRec.value);
    }
    
    if (tempoRec) {
      setTemporalFactor(tempoRec.value * 2); // Scale to useful range
    }
    
    // Determine optimal modality based on cognitive metrics
    let optimalModality: ModalityType = 'visual'; // Default
    
    // Example logic for modality selection:
    // - High cognitive load + urgent emotional context = simpler, more direct textual mode
    // - Low cognitive load + contemplative emotional context = rich visual mode
    // - Excited emotional context + moderate cognitive load = spatial/interactive mode
    
    if (metrics.cognitiveLoad > 0.7 && metrics.emotionalContext === 'urgent') {
      optimalModality = 'textual';
    } else if (metrics.cognitiveLoad < 0.4 && metrics.emotionalContext === 'contemplative') {
      optimalModality = 'visual';
    } else if (metrics.emotionalContext === 'excited' && metrics.cognitiveLoad < 0.6) {
      optimalModality = 'spatial';
    }
    
    // Don't change if already in transition or if modality is the same
    if (isTransitioning || optimalModality === activeModality) return;
    
    // Start transition to new modality
    if (optimalModality !== activeModality) {
      startModalityTransition(optimalModality);
    }
    
  }, [metrics, recommendations, learningPhase, activeModality, isTransitioning]);
  
  // Handle modality transition
  const startModalityTransition = useCallback((newModality: ModalityType) => {
    setIsTransitioning(true);
    
    // Animate out current modality
    const animationDuration = 1000; // ms
    
    // Progress from 0 to 1 over duration
    let startTime = Date.now();
    
    const animateTransition = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(1, elapsed / animationDuration);
      
      setTransitionProgress(progress);
      
      if (progress < 1) {
        requestAnimationFrame(animateTransition);
      } else {
        // Transition complete
        setActiveModality(newModality);
        setTransitionProgress(0);
        setIsTransitioning(false);
      }
    };
    
    requestAnimationFrame(animateTransition);
  }, []);
  
  // Render children with modality context
  return (
    <div className={className}>
      {children({
        activeModality,
        transitionProgress,
        densityFactor,
        temporalFactor
      })}
      
      {/* Modality change indicator - only shown during transitions */}
      <AnimatePresence>
        {isTransitioning && (
          <motion.div 
            className="fixed bottom-4 left-1/2 transform -translate-x-1/2 bg-black/50 backdrop-blur-sm 
                      rounded-full px-4 py-1.5 text-sm text-white/80 pointer-events-none
                      border border-white/10 z-50"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            transition={{ duration: 0.3 }}
          >
            <div className="flex items-center space-x-2">
              <div 
                className="w-1.5 h-1.5 rounded-full animate-pulse"
                style={{ backgroundColor: domainConfig.accentColor }}
              />
              <span>
                Adapting interface to {activeModality} modality...
              </span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}