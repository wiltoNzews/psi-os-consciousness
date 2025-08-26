import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { useDomain } from '@/contexts/DomainContext';
import { 
  Brain, 
  Zap, 
  Search, 
  BarChart2, 
  TrendingUp, 
  Eye, 
  Layers, 
  Lightbulb,
  Gauge
} from 'lucide-react';

// Augmentation data structure
interface AugmentationData {
  id: string;
  name: string;
  description: string;
  activeLevel: number;
  maxLevel: number;
  domain: string;
  icon: React.ReactNode;
  color: string;
}

interface HumanAugmentationProps {
  domain: 'finance' | 'crypto' | 'sports' | 'general';
}

/**
 * HumanAugmentation - A component that showcases how human cognitive abilities
 * can be augmented and enhanced by AI systems
 */
export function HumanAugmentation({ domain }: HumanAugmentationProps) {
  const { domainConfig } = useDomain();
  const [selectedAugmentation, setSelectedAugmentation] = useState<string | null>(null);
  
  // Define augmentations based on domain
  const augmentations: AugmentationData[] = [
    {
      id: 'pattern-recognition',
      name: 'Pattern Recognition',
      description: domain === 'finance' 
        ? 'Enhanced ability to identify complex market patterns and correlations in financial data that would be impossible for a human alone.'
        : domain === 'crypto'
        ? 'Advanced detection of on-chain patterns and market sentiment correlations across blockchain networks.'
        : domain === 'sports'
        ? 'Real-time identification of opposing team strategies and player movement patterns.'
        : 'Augmented ability to recognize complex patterns across multimodal data streams.',
      activeLevel: 3,
      maxLevel: 5,
      domain,
      icon: <Brain className="w-6 h-6" />,
      color: domainConfig.accentColor
    },
    {
      id: 'decision-intelligence',
      name: 'Decision Intelligence',
      description: domain === 'finance' 
        ? 'Computational trade analysis that considers thousands of variables to augment human decision making in complex market conditions.'
        : domain === 'crypto'
        ? 'Risk-optimized trading decisions across multiple blockchain ecosystems with behavioral intelligence.'
        : domain === 'sports'
        ? 'Strategic play calling and tactical decisions enhanced by real-time probability modeling.'
        : 'AI-augmented decision making that combines human intuition with computational intelligence.',
      activeLevel: 4,
      maxLevel: 5,
      domain,
      icon: <Zap className="w-6 h-6" />,
      color: domainConfig.accentColor
    },
    {
      id: 'information-scanning',
      name: 'Information Scanning',
      description: domain === 'finance' 
        ? 'Ability to continuously monitor global financial news and events, filtering for relevant market signals.'
        : domain === 'crypto'
        ? 'Real-time monitoring of social sentiment, GitHub repositories, and protocol changes across crypto ecosystems.'
        : domain === 'sports'
        ? 'Comprehensive scanning of player statistics, injury reports, and historical performance data.'
        : 'Enhanced capacity to process vast amounts of information and highlight what matters most.',
      activeLevel: 5,
      maxLevel: 5,
      domain,
      icon: <Search className="w-6 h-6" />,
      color: domainConfig.accentColor
    },
    {
      id: 'predictive-modeling',
      name: 'Predictive Modeling',
      description: domain === 'finance' 
        ? 'Human-AI hybrid forecasting of market movements with continuous model refinement based on new data.'
        : domain === 'crypto'
        ? 'Token valuation projections that combine on-chain metrics with human intuition about project potential.'
        : domain === 'sports'
        ? 'Game outcome and player performance predictions enhanced by neural networks.'
        : 'Advanced predictive capabilities that combine computational modeling with human experience.',
      activeLevel: 3,
      maxLevel: 5,
      domain,
      icon: <BarChart2 className="w-6 h-6" />,
      color: domainConfig.accentColor
    },
    {
      id: 'trend-analysis',
      name: 'Trend Analysis',
      description: domain === 'finance' 
        ? 'Enhanced ability to identify emerging market trends before they become obvious to the broader market.'
        : domain === 'crypto'
        ? 'Early identification of emerging narratives and technological shifts in the blockchain ecosystem.'
        : domain === 'sports'
        ? 'Detection of evolving gameplay strategies and performance trends across seasons.'
        : 'Augmented capacity to identify and analyze emerging trends across multiple domains.',
      activeLevel: 4,
      maxLevel: 5,
      domain,
      icon: <TrendingUp className="w-6 h-6" />,
      color: domainConfig.accentColor
    },
    {
      id: 'perceptual-enhancement',
      name: 'Perceptual Enhancement',
      description: domain === 'finance' 
        ? 'Visualization of complex market data in intuitive formats that extend human perceptual abilities.'
        : domain === 'crypto'
        ? 'Visualization of blockchain transactions and token flows that reveal hidden network relationships.'
        : domain === 'sports'
        ? 'Enhanced visual processing of game dynamics and spatial relationships on the field.'
        : 'Extended perceptual capabilities across visual, auditory, and other sensory domains.',
      activeLevel: 2,
      maxLevel: 5,
      domain,
      icon: <Eye className="w-6 h-6" />,
      color: domainConfig.accentColor
    },
    {
      id: 'knowledge-integration',
      name: 'Knowledge Integration',
      description: domain === 'finance' 
        ? 'Seamless integration of historical market data, economic theory, and real-time analytics into decision processes.'
        : domain === 'crypto'
        ? 'Cross-chain knowledge synthesis combining technical, economic, and social insights.'
        : domain === 'sports'
        ? 'Integration of biomechanics, statistics, and strategic theory into coaching decisions.'
        : 'Enhanced ability to synthesize knowledge across domains and information sources.',
      activeLevel: 3,
      maxLevel: 5,
      domain,
      icon: <Layers className="w-6 h-6" />,
      color: domainConfig.accentColor
    },
    {
      id: 'creative-intelligence',
      name: 'Creative Intelligence',
      description: domain === 'finance' 
        ? 'Novel investment strategy generation that combines computational exploration with human judgment.'
        : domain === 'crypto'
        ? 'Innovative token economic models and trading strategies that push beyond conventional approaches.'
        : domain === 'sports'
        ? 'Development of novel plays and training regimens that leverage computational simulation.'
        : 'Augmented creative capabilities that expand the boundaries of human innovation.',
      activeLevel: 2,
      maxLevel: 5,
      domain,
      icon: <Lightbulb className="w-6 h-6" />,
      color: domainConfig.accentColor
    }
  ];
  
  return (
    <div className="w-full">
      <div 
        className="relative w-full bg-black bg-opacity-20 rounded-lg overflow-hidden backdrop-blur-sm border border-white/10 p-5"
        style={{ 
          backgroundImage: `linear-gradient(to bottom right, ${domainConfig.gradientFrom}, ${domainConfig.gradientTo})`,
        }}
      >
        <h3 className="text-lg font-medium text-white mb-4">Human-AI Cognitive Augmentation</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
          {augmentations.map((aug) => (
            <motion.div
              key={aug.id}
              className={cn(
                "relative rounded-lg p-4 cursor-pointer transition-all duration-200 backdrop-blur-sm border",
                selectedAugmentation === aug.id
                  ? "bg-black/40 border-white/30 shadow-lg"
                  : "bg-black/20 border-white/10 hover:bg-black/30"
              )}
              onClick={() => setSelectedAugmentation(
                selectedAugmentation === aug.id ? null : aug.id
              )}
              whileHover={{ y: -2 }}
              whileTap={{ scale: 0.98 }}
            >
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center gap-2">
                  <div 
                    className="p-2 rounded-md" 
                    style={{ backgroundColor: `${aug.color}30` }}
                  >
                    {aug.icon}
                  </div>
                  <div>
                    <h4 className="font-medium text-white text-sm">{aug.name}</h4>
                  </div>
                </div>
                <div className="flex items-center">
                  <Gauge className="w-4 h-4 text-white/60 mr-1" />
                  <span className="text-xs text-white/80">Level {aug.activeLevel}</span>
                </div>
              </div>
              
              {/* Progress bar */}
              <div className="w-full h-1.5 bg-white/10 rounded-full mb-3 overflow-hidden">
                <motion.div 
                  className="h-full"
                  style={{ backgroundColor: aug.color }}
                  initial={{ width: 0 }}
                  animate={{ width: `${(aug.activeLevel / aug.maxLevel) * 100}%` }}
                  transition={{ duration: 0.5 }}
                />
              </div>
              
              {/* Description - only shown when selected */}
              <AnimatedHeight isVisible={selectedAugmentation === aug.id}>
                <p className="text-xs text-white/80 mt-2">
                  {aug.description}
                </p>
                
                {/* Level indicators */}
                <div className="flex justify-between mt-4">
                  {Array.from({ length: aug.maxLevel }).map((_, i) => (
                    <div 
                      key={`level-${i}`}
                      className={cn(
                        "w-8 h-8 rounded-full flex items-center justify-center text-xs font-medium",
                        i < aug.activeLevel
                          ? "bg-white text-black"
                          : "bg-white/20 text-white/60"
                      )}
                    >
                      {i + 1}
                    </div>
                  ))}
                </div>
              </AnimatedHeight>
            </motion.div>
          ))}
        </div>
        
        {/* Activation status */}
        <div className="mt-6 flex items-center gap-2 text-white/70 text-sm">
          <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
          <span>Human augmentation system active - all cognitive modules online</span>
        </div>
      </div>
    </div>
  );
}

// Helper component for animating height
interface AnimatedHeightProps {
  children: React.ReactNode;
  isVisible: boolean;
}

function AnimatedHeight({ children, isVisible }: AnimatedHeightProps) {
  return (
    <motion.div
      initial="collapsed"
      animate={isVisible ? "open" : "collapsed"}
      variants={{
        open: { opacity: 1, height: "auto", marginTop: 8 },
        collapsed: { opacity: 0, height: 0, marginTop: 0 }
      }}
      transition={{ duration: 0.3 }}
      className="overflow-hidden"
    >
      {children}
    </motion.div>
  );
}