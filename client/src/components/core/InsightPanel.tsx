/**
 * InsightPanel Component
 * 
 * This component displays the neural metrics and adaptation recommendations
 * in a user-friendly format. It implements progressive disclosure,
 * showing more advanced insights as the learning phase progresses.
 */

import { useMemo } from 'react';
import { motion } from 'framer-motion';
import { 
  NeuralMetrics, 
  SymbiosisRecommendation 
} from '@/lib/SymbiosisEngine';
import { DomainType, useDomain } from '@/contexts/DomainContext';
import { 
  Brain, 
  Activity, 
  Clock, 
  Shield, 
  BarChart4, 
  ZoomIn, 
  ZoomOut, 
  Info 
} from 'lucide-react';

interface InsightPanelProps {
  metrics: NeuralMetrics;
  learningPhase: number;
  recommendations: SymbiosisRecommendation[];
  className?: string;
}

export function InsightPanel({
  metrics,
  learningPhase,
  recommendations,
  className = ''
}: InsightPanelProps) {
  const { domainConfig } = useDomain();
  
  // Determine display level based on learning phase
  const displayLevel = useMemo(() => {
    if (learningPhase < 0.3) return 1; // Basic
    if (learningPhase < 0.6) return 2; // Intermediate
    if (learningPhase < 0.9) return 3; // Advanced
    return 4; // Expert
  }, [learningPhase]);
  
  // Format percentage
  const formatPercent = (value: number) => {
    return `${Math.round(value * 100)}%`;
  };
  
  // Determine info density recommendation
  const infoDensityRec = useMemo(() => {
    const rec = recommendations.find(r => r.type === 'information_density');
    return rec || null;
  }, [recommendations]);
  
  // Determine interaction tempo recommendation
  const tempoRec = useMemo(() => {
    const rec = recommendations.find(r => r.type === 'interaction_tempo');
    return rec || null;
  }, [recommendations]);
  
  // Determine contextual relevance recommendation
  const relevanceRec = useMemo(() => {
    const rec = recommendations.find(r => r.type === 'contextual_relevance');
    return rec || null;
  }, [recommendations]);
  
  return (
    <motion.div
      className={`bg-black/30 backdrop-blur-sm border border-white/10 rounded-lg p-4 text-white ${className}`}
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5 }}
    >
      {/* Header */}
      <div className="mb-4 pb-2 border-b border-white/10 flex items-center justify-between">
        <div className="flex items-center">
          <Brain className="h-5 w-5 mr-2 text-white/80" />
          <h3 className="font-medium">Neural Symbiosis</h3>
        </div>
        <div className="text-sm text-white/60">
          {learningPhase < 0.3 ? 'Learning' : 
           learningPhase < 0.6 ? 'Adapting' :
           learningPhase < 0.9 ? 'Optimizing' : 'Synergizing'}
        </div>
      </div>
      
      {/* Main metrics - always visible */}
      <div className="grid grid-cols-1 gap-3 mb-4">
        {/* Emotional Context */}
        <div className="space-y-1">
          <div className="flex justify-between items-center">
            <div className="flex items-center text-sm">
              <Activity className="h-3.5 w-3.5 mr-1.5 text-white/70" />
              <span className="text-white/70">Emotional State</span>
            </div>
            <span className="text-sm capitalize">{metrics.emotionalContext}</span>
          </div>
          <div className={`h-1 rounded-full bg-gradient-to-r ${
            metrics.emotionalContext === 'excited' ? 'from-purple-300/30 to-pink-300/60' :
            metrics.emotionalContext === 'contemplative' ? 'from-blue-300/30 to-teal-300/60' :
            metrics.emotionalContext === 'urgent' ? 'from-red-300/30 to-orange-300/60' :
            'from-gray-300/30 to-white/40'
          }`}></div>
        </div>
        
        {/* Cognitive Load */}
        <div className="space-y-1">
          <div className="flex justify-between items-center">
            <div className="flex items-center text-sm">
              <Brain className="h-3.5 w-3.5 mr-1.5 text-white/70" />
              <span className="text-white/70">Cognitive Load</span>
            </div>
            <span className="text-sm">{formatPercent(metrics.cognitiveLoad)}</span>
          </div>
          <div className="h-1 bg-white/10 rounded-full">
            <div 
              className="h-1 bg-white/50 rounded-full"
              style={{ width: `${metrics.cognitiveLoad * 100}%` }}
            ></div>
          </div>
          
          {/* Info density recommendation - Show at intermediate level */}
          {displayLevel >= 2 && infoDensityRec && (
            <motion.div 
              className="mt-1 text-xs text-white/50 flex items-start"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              transition={{ duration: 0.3 }}
            >
              <Info className="h-3 w-3 mr-1 mt-0.5 flex-shrink-0" />
              <span>{infoDensityRec.explanation}</span>
            </motion.div>
          )}
        </div>
        
        {/* Interaction Rhythm */}
        <div className="space-y-1">
          <div className="flex justify-between items-center">
            <div className="flex items-center text-sm">
              <Clock className="h-3.5 w-3.5 mr-1.5 text-white/70" />
              <span className="text-white/70">Interaction Rhythm</span>
            </div>
            <span className="text-sm">
              {metrics.temporalRhythm < 0.8 ? 'Deliberate' : 
               metrics.temporalRhythm > 1.3 ? 'Rapid' : 'Balanced'}
            </span>
          </div>
          <div className="h-1 bg-white/10 rounded-full">
            <div 
              className="h-1 bg-white/50 rounded-full transition-all duration-500"
              style={{ width: `${(metrics.temporalRhythm / 2) * 100}%` }}
            ></div>
          </div>
          
          {/* Tempo recommendation - Show at intermediate level */}
          {displayLevel >= 2 && tempoRec && (
            <motion.div 
              className="mt-1 text-xs text-white/50 flex items-start"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              transition={{ duration: 0.3, delay: 0.1 }}
            >
              <Info className="h-3 w-3 mr-1 mt-0.5 flex-shrink-0" />
              <span>{tempoRec.explanation}</span>
            </motion.div>
          )}
        </div>
      </div>
      
      {/* Advanced metrics - shown at higher learning phases */}
      {displayLevel >= 3 && (
        <motion.div 
          className="grid grid-cols-1 gap-3 mt-6 pt-3 border-t border-white/10"
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          transition={{ duration: 0.5 }}
        >
          <h4 className="text-sm text-white/60 mb-1">Advanced Insights</h4>
          
          {/* Pattern Confidence */}
          <div className="space-y-1">
            <div className="flex justify-between items-center">
              <div className="flex items-center text-sm">
                <BarChart4 className="h-3.5 w-3.5 mr-1.5 text-white/70" />
                <span className="text-white/70">Pattern Confidence</span>
              </div>
              <span className="text-sm">{formatPercent(metrics.confidenceScore)}</span>
            </div>
            <div className="h-1 bg-white/10 rounded-full">
              <div 
                className="h-1 bg-white/50 rounded-full transition-all duration-500"
                style={{ width: `${metrics.confidenceScore * 100}%` }}
              ></div>
            </div>
          </div>
          
          {/* Ethical Alignment */}
          <div className="space-y-1">
            <div className="flex justify-between items-center">
              <div className="flex items-center text-sm">
                <Shield className="h-3.5 w-3.5 mr-1.5 text-white/70" />
                <span className="text-white/70">Ethical Alignment</span>
              </div>
              <span className="text-sm">{formatPercent(metrics.alignmentScore)}</span>
            </div>
            <div className="h-1 bg-white/10 rounded-full">
              <div 
                className="h-1 bg-green-300/60 rounded-full transition-all duration-500"
                style={{ width: `${metrics.alignmentScore * 100}%` }}
              ></div>
            </div>
          </div>
          
          {/* Contextual relevance - show at expert level */}
          {displayLevel >= 4 && relevanceRec && (
            <div className="space-y-1 mt-2">
              <div className="flex justify-between items-center">
                <div className="flex items-center text-sm">
                  <ZoomIn className="h-3.5 w-3.5 mr-1.5 text-white/70" />
                  <span className="text-white/70">Content Focus</span>
                </div>
                <span className="text-sm">
                  {relevanceRec.value < 0.4 ? 'Broad' : 
                   relevanceRec.value > 0.7 ? 'Narrow' : 'Balanced'}
                </span>
              </div>
              <div className="h-1 bg-white/10 rounded-full">
                <div 
                  className="h-1 rounded-full transition-all duration-500"
                  style={{ 
                    width: `${relevanceRec.value * 100}%`,
                    background: `linear-gradient(to right, ${domainConfig.gradientFrom}40, ${domainConfig.gradientTo}80)`
                  }}
                ></div>
              </div>
              <motion.div 
                className="mt-1 text-xs text-white/50 flex items-start"
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                transition={{ duration: 0.3, delay: 0.2 }}
              >
                <Info className="h-3 w-3 mr-1 mt-0.5 flex-shrink-0" />
                <span>{relevanceRec.explanation}</span>
              </motion.div>
            </div>
          )}
        </motion.div>
      )}
      
      {/* Learning phase indicator */}
      <div className="mt-6 pt-3 border-t border-white/10">
        <div className="flex justify-between items-center text-sm">
          <span className="text-white/60">Learning Progress</span>
          <span className="text-white/80">{formatPercent(learningPhase)}</span>
        </div>
        <div className="mt-1.5 h-1 bg-white/10 rounded-full">
          <div 
            className="h-1 rounded-full transition-all duration-1000"
            style={{ 
              width: `${learningPhase * 100}%`,
              background: `linear-gradient(to right, ${domainConfig.gradientFrom}50, ${domainConfig.gradientTo}90)`
            }}
          ></div>
        </div>
      </div>
    </motion.div>
  );
}