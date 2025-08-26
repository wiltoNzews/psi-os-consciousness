import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { 
  ChevronDown, 
  Layers, 
  Brain, 
  Zap, 
  BarChart2,
  Sparkles 
} from 'lucide-react';
import { NeuroSynapse } from './NeuroSynapse';
import { MultimodalInsights } from './MultimodalInsights';
import { HumanAugmentation } from './HumanAugmentation';
import { HumanAIBridge } from './HumanAIBridge';
import { DomainProvider, useDomain } from '@/contexts/DomainContext';

interface SymbiosisSectionProps {
  className?: string;
  domain?: 'finance' | 'crypto' | 'sports' | 'general';
  onDomainChange?: (domain: string) => void;
}

/**
 * SymbiosisSection - A component that showcases the core value proposition
 * of the platform: the symbiotic relationship between human intelligence and AI
 */
export function SymbiosisSection({ 
  className,
  domain = 'general',
  onDomainChange
}: SymbiosisSectionProps) {
  const { domainConfig, setActiveDomain } = useDomain();
  const [activeTab, setActiveTab] = useState<'visualizer' | 'insights' | 'augmentation' | 'bridge'>('visualizer');
  const [highlightedNode, setHighlightedNode] = useState<string | null>(null);
  
  // Handle domain change
  const handleDomainChange = (newDomain: 'finance' | 'crypto' | 'sports' | 'general') => {
    setActiveDomain(newDomain);
    if (onDomainChange) {
      onDomainChange(newDomain);
    }
  };
  
  // Handle node selection in the neural network visualization
  const handleNodeSelect = (nodeId: string) => {
    setHighlightedNode(nodeId || null);
  };
  
  return (
    <div className={cn("w-full py-8", className)}>
      <div className="container mx-auto">
        <div className="text-center mb-8">
          <motion.h2 
            className="text-3xl font-bold text-white mb-2"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            Human-AI Symbiosis
          </motion.h2>
          <motion.p 
            className="text-lg text-white/70 max-w-2xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            Experience the next evolution of intelligence where human cognition and AI capabilities
            merge into a unified, enhanced system that's greater than the sum of its parts.
          </motion.p>
        </div>
        
        {/* Domain selector */}
        <div className="flex justify-center mb-8">
          <div className="inline-flex rounded-lg p-1 bg-black/20 backdrop-blur-sm">
            {(['finance', 'crypto', 'sports', 'general'] as const).map((domainOption) => (
              <button
                key={domainOption}
                className={cn(
                  "px-4 py-2 rounded-md text-sm font-medium transition-all duration-200",
                  domainOption === domain
                    ? "bg-white text-black shadow-md"
                    : "text-white/80 hover:text-white hover:bg-white/10"
                )}
                onClick={() => handleDomainChange(domainOption)}
              >
                {domainOption.charAt(0).toUpperCase() + domainOption.slice(1)}
              </button>
            ))}
          </div>
        </div>
        
        {/* Tabs for different visualizations */}
        <div className="flex justify-center mb-6">
          <div className="inline-flex rounded-lg p-1 bg-black/20 backdrop-blur-sm">
            <button
              className={cn(
                "px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 flex items-center gap-1.5",
                activeTab === 'visualizer'
                  ? "bg-white text-black shadow-md"
                  : "text-white/80 hover:text-white hover:bg-white/10"
              )}
              onClick={() => setActiveTab('visualizer')}
            >
              <Brain className="w-4 h-4" />
              Neural Network
            </button>
            <button
              className={cn(
                "px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 flex items-center gap-1.5",
                activeTab === 'insights'
                  ? "bg-white text-black shadow-md"
                  : "text-white/80 hover:text-white hover:bg-white/10"
              )}
              onClick={() => setActiveTab('insights')}
            >
              <Sparkles className="w-4 h-4" />
              Insights
            </button>
            <button
              className={cn(
                "px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 flex items-center gap-1.5",
                activeTab === 'augmentation'
                  ? "bg-white text-black shadow-md"
                  : "text-white/80 hover:text-white hover:bg-white/10"
              )}
              onClick={() => setActiveTab('augmentation')}
            >
              <Zap className="w-4 h-4" />
              Augmentation
            </button>
            <button
              className={cn(
                "px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 flex items-center gap-1.5",
                activeTab === 'bridge'
                  ? "bg-white text-black shadow-md"
                  : "text-white/80 hover:text-white hover:bg-white/10"
              )}
              onClick={() => setActiveTab('bridge')}
            >
              <Layers className="w-4 h-4" />
              Data Bridge
            </button>
          </div>
        </div>
        
        {/* Active visualization */}
        <div className="w-full">
          <AnimatedTabContent show={activeTab === 'visualizer'}>
            <NeuroSynapse 
              domain={domain} 
              highlightedNode={highlightedNode}
              onNodeSelect={handleNodeSelect}
            />
            
            {/* Brief explanation */}
            <div className="mt-4 bg-black/20 rounded-lg p-4 backdrop-blur-sm border border-white/10">
              <h3 className="text-lg font-medium text-white mb-2 flex items-center gap-2">
                <Brain className="w-5 h-5" />
                Neural Network Visualization
              </h3>
              <p className="text-white/70 text-sm">
                This visualization demonstrates the complex network of connections between human 
                intelligence nodes (left) and artificial intelligence processors (right), with 
                data exchange points serving as bridges between the two systems. Click on any node 
                to see its connections and influence within the symbiotic network.
              </p>
            </div>
          </AnimatedTabContent>
          
          <AnimatedTabContent show={activeTab === 'insights'}>
            <MultimodalInsights domain={domain} />
            
            {/* Brief explanation */}
            <div className="mt-4 bg-black/20 rounded-lg p-4 backdrop-blur-sm border border-white/10">
              <h3 className="text-lg font-medium text-white mb-2 flex items-center gap-2">
                <Sparkles className="w-5 h-5" />
                Multimodal Insights
              </h3>
              <p className="text-white/70 text-sm">
                The Multimodal Insights panel showcases how the symbiotic system processes and generates 
                understanding across different types of data - images, audio, video, and text. Filter 
                by modality or source to see how human and AI intelligence collaboratively extract 
                meaningful insights from complex data.
              </p>
            </div>
          </AnimatedTabContent>
          
          <AnimatedTabContent show={activeTab === 'augmentation'}>
            <HumanAugmentation domain={domain} />
            
            {/* Brief explanation */}
            <div className="mt-4 bg-black/20 rounded-lg p-4 backdrop-blur-sm border border-white/10">
              <h3 className="text-lg font-medium text-white mb-2 flex items-center gap-2">
                <Zap className="w-5 h-5" />
                Human Cognitive Augmentation
              </h3>
              <p className="text-white/70 text-sm">
                This module illustrates how the symbiotic system enhances human cognitive abilities 
                across eight key dimensions. Each augmentation represents a specific way that AI 
                systems extend and amplify human intelligence, creating capabilities that would 
                be impossible for either humans or AI alone. Click on each ability to learn more.
              </p>
            </div>
          </AnimatedTabContent>
          
          <AnimatedTabContent show={activeTab === 'bridge'}>
            <HumanAIBridge domain={domain} />
            
            {/* Brief explanation */}
            <div className="mt-4 bg-black/20 rounded-lg p-4 backdrop-blur-sm border border-white/10">
              <h3 className="text-lg font-medium text-white mb-2 flex items-center gap-2">
                <Layers className="w-5 h-5" />
                Human-AI Data Bridge
              </h3>
              <p className="text-white/70 text-sm">
                The Data Bridge visualization illustrates the real-time flow of information between 
                human intelligence and AI systems. Each particle represents a data point being 
                transferred and processed, with the central bridge serving as the symbiotic 
                connection point where human intuition and AI processing power merge.
              </p>
            </div>
          </AnimatedTabContent>
        </div>
        
        {/* Domain-specific context */}
        <div className="mt-8 bg-black/30 rounded-lg p-6 backdrop-blur-sm border border-white/10">
          <div className="flex items-start gap-4">
            <div 
              className="p-3 rounded-lg flex-shrink-0"
              style={{ backgroundColor: `${domainConfig.accentColor}20` }}
            >
              <BarChart2 className="w-6 h-6" style={{ color: domainConfig.accentColor }} />
            </div>
            <div>
              <h3 className="text-xl font-medium text-white mb-1">
                {domainConfig.name} Intelligence Network
              </h3>
              <p className="text-white/70">
                {domainConfig.description}
              </p>
              
              <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
                <StatsCard 
                  label="Active Connections" 
                  value={domain === 'finance' ? '2,453' : domain === 'crypto' ? '1,872' : domain === 'sports' ? '1,645' : '3,218'}
                  change={domain === 'finance' ? '+12%' : domain === 'crypto' ? '+8%' : domain === 'sports' ? '+5%' : '+15%'}
                  positive
                />
                <StatsCard 
                  label="Processing Power" 
                  value={domain === 'finance' ? '86.4 TFLOPS' : domain === 'crypto' ? '92.7 TFLOPS' : domain === 'sports' ? '78.3 TFLOPS' : '105.2 TFLOPS'}
                  change={domain === 'finance' ? '+8%' : domain === 'crypto' ? '+12%' : domain === 'sports' ? '+6%' : '+10%'}
                  positive
                />
                <StatsCard 
                  label="Symbiosis Score" 
                  value={domain === 'finance' ? '94.2' : domain === 'crypto' ? '91.7' : domain === 'sports' ? '89.5' : '96.8'}
                  change={domain === 'finance' ? '+2.4' : domain === 'crypto' ? '+1.9' : domain === 'sports' ? '+1.5' : '+3.2'}
                  positive={true}
                />
                <StatsCard 
                  label="Response Latency" 
                  value={domain === 'finance' ? '24ms' : domain === 'crypto' ? '27ms' : domain === 'sports' ? '31ms' : '19ms'}
                  change={domain === 'finance' ? '-18%' : domain === 'crypto' ? '-15%' : domain === 'sports' ? '-12%' : '-22%'}
                  positive={true}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Helper for animated tab transitions
interface AnimatedTabContentProps {
  children: React.ReactNode;
  show: boolean;
}

function AnimatedTabContent({ children, show }: AnimatedTabContentProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ 
        opacity: show ? 1 : 0,
        y: show ? 0 : 10,
        pointerEvents: show ? 'auto' : 'none',
        position: show ? 'relative' : 'absolute'
      }}
      transition={{ duration: 0.3 }}
      className={cn(
        "w-full",
        !show && "hidden"
      )}
    >
      {children}
    </motion.div>
  );
}

// Stats card component
interface StatsCardProps {
  label: string;
  value: string;
  change: string;
  positive: boolean;
}

function StatsCard({ label, value, change, positive }: StatsCardProps) {
  return (
    <div className="bg-black/20 rounded-lg p-3 border border-white/10">
      <p className="text-xs text-white/60 mb-1">{label}</p>
      <p className="text-xl font-medium text-white mb-0.5">{value}</p>
      <div className={cn(
        "text-xs font-medium",
        positive ? "text-green-500" : "text-red-500"
      )}>
        {change}
      </div>
    </div>
  );
}