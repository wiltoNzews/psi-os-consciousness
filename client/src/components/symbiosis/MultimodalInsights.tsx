import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { useDomain } from '@/contexts/DomainContext';
import { 
  ImageIcon, 
  AudioLines, 
  Video, 
  FileText, 
  Brain, 
  User, 
  ChevronLeft, 
  ChevronRight
} from 'lucide-react';

// Insight data structure
interface Insight {
  id: string;
  type: 'image' | 'audio' | 'video' | 'text';
  content: string;
  source: 'human' | 'ai';
  confidence: number;
  timestamp: Date;
}

interface MultimodalInsightsProps {
  domain: 'finance' | 'crypto' | 'sports' | 'general';
}

/**
 * MultimodalInsights - A component that showcases the seamless integration
 * of different data modalities (image, text, audio, video) in the symbiotic
 * relationship between human and AI intelligence
 */
export function MultimodalInsights({ domain }: MultimodalInsightsProps) {
  const { domainConfig } = useDomain();
  const [insights, setInsights] = useState<Insight[]>([]);
  const [activeIndex, setActiveIndex] = useState(0);
  const [filter, setFilter] = useState<'all' | 'image' | 'audio' | 'video' | 'text'>('all');
  const [filterSource, setFilterSource] = useState<'all' | 'human' | 'ai'>('all');
  
  // Generate mock insights data
  useEffect(() => {
    const generateMockInsights = (): Insight[] => {
      const mockInsights: Insight[] = [];
      
      // Domain-specific insights
      const insightContents: Record<string, string[]> = {
        finance: [
          "Quarterly earnings pattern detected in tech sector",
          "Algorithmic trading signal: bullish divergence on $TSLA",
          "Market sentiment analysis suggests cautious optimism",
          "Volatility pattern recognition indicates potential correction",
          "Audio from earnings call suggests positive guidance",
          "Visual chart pattern identified: inverse head and shoulders"
        ],
        crypto: [
          "On-chain analytics show increased whale accumulation",
          "Social sentiment analysis suggests fear in the market",
          "Transaction volume analysis indicates institutional buying",
          "Technical indicator: MACD crossover on 4h timeframe",
          "Exchange inflow decreasing, typically bullish signal",
          "Visual pattern identified: bullish pennant on BTC/USD"
        ],
        sports: [
          "Player performance analysis shows improved efficiency",
          "Game footage analysis: defensive coverage pattern",
          "Biometric data suggests optimal recovery period",
          "Audio analysis of coach interview reveals strategic shift",
          "Visual recognition: improved shooting mechanics",
          "Statistical anomaly detected in 3rd quarter performance"
        ],
        general: [
          "Content sentiment analysis: predominantly positive",
          "Audio pattern detection: consistent engagement markers",
          "Visual element recognition: improved user interface",
          "Semantic analysis suggests improved comprehension",
          "Engagement pattern recognized in user interaction",
          "Cross-modal correlation between audio and visual elements"
        ]
      };
      
      const contents = insightContents[domain] || insightContents.general;
      
      // Generate various insights across modalities
      const types = ['image', 'audio', 'video', 'text'] as const;
      const sources = ['human', 'ai'] as const;
      
      for (let i = 0; i < 12; i++) {
        const type = types[Math.floor(Math.random() * types.length)];
        const source = sources[Math.floor(Math.random() * sources.length)];
        const contentIndex = Math.floor(Math.random() * contents.length);
        
        mockInsights.push({
          id: `insight-${i}`,
          type,
          content: contents[contentIndex],
          source,
          confidence: 0.5 + Math.random() * 0.5, // Between 0.5 and 1.0
          timestamp: new Date(Date.now() - Math.random() * 86400000) // Random time in last 24 hours
        });
      }
      
      // Sort by timestamp (newest first)
      return mockInsights.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
    };
    
    setInsights(generateMockInsights());
  }, [domain]);
  
  // Filter insights based on type and source
  const filteredInsights = insights.filter(insight => {
    if (filter !== 'all' && insight.type !== filter) return false;
    if (filterSource !== 'all' && insight.source !== filterSource) return false;
    return true;
  });
  
  // Icon mapping for insight types
  const getInsightTypeIcon = (type: 'image' | 'audio' | 'video' | 'text') => {
    switch (type) {
      case 'image':
        return <ImageIcon className="w-5 h-5" />;
      case 'audio':
        return <AudioLines className="w-5 h-5" />;
      case 'video':
        return <Video className="w-5 h-5" />;
      case 'text':
        return <FileText className="w-5 h-5" />;
      default:
        return <FileText className="w-5 h-5" />;
    }
  };
  
  // Function to format the timestamp
  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };
  
  // Navigate through insights
  const nextInsight = () => {
    if (filteredInsights.length === 0) return;
    setActiveIndex((prev) => (prev + 1) % filteredInsights.length);
  };
  
  const prevInsight = () => {
    if (filteredInsights.length === 0) return;
    setActiveIndex((prev) => (prev - 1 + filteredInsights.length) % filteredInsights.length);
  };
  
  return (
    <div className="w-full">
      <div 
        className="relative w-full bg-black bg-opacity-20 rounded-lg overflow-hidden backdrop-blur-sm border border-white/10 p-4"
        style={{ 
          backgroundImage: `linear-gradient(to bottom right, ${domainConfig.gradientFrom}, ${domainConfig.gradientTo})`,
        }}
      >
        {/* Filters */}
        <div className="flex flex-wrap gap-2 mb-4">
          <button
            onClick={() => setFilter('all')}
            className={cn(
              "px-3 py-1 rounded-full text-xs font-medium transition-colors",
              filter === 'all' 
                ? `bg-white text-black` 
                : `bg-black/20 text-white hover:bg-black/30`
            )}
          >
            All
          </button>
          <button
            onClick={() => setFilter('image')}
            className={cn(
              "px-3 py-1 rounded-full text-xs font-medium transition-colors flex items-center gap-1.5",
              filter === 'image' 
                ? `bg-white text-black` 
                : `bg-black/20 text-white hover:bg-black/30`
            )}
          >
            <ImageIcon className="w-3.5 h-3.5" />
            Image
          </button>
          <button
            onClick={() => setFilter('audio')}
            className={cn(
              "px-3 py-1 rounded-full text-xs font-medium transition-colors flex items-center gap-1.5",
              filter === 'audio' 
                ? `bg-white text-black` 
                : `bg-black/20 text-white hover:bg-black/30`
            )}
          >
            <AudioLines className="w-3.5 h-3.5" />
            Audio
          </button>
          <button
            onClick={() => setFilter('video')}
            className={cn(
              "px-3 py-1 rounded-full text-xs font-medium transition-colors flex items-center gap-1.5",
              filter === 'video' 
                ? `bg-white text-black` 
                : `bg-black/20 text-white hover:bg-black/30`
            )}
          >
            <Video className="w-3.5 h-3.5" />
            Video
          </button>
          <button
            onClick={() => setFilter('text')}
            className={cn(
              "px-3 py-1 rounded-full text-xs font-medium transition-colors flex items-center gap-1.5",
              filter === 'text' 
                ? `bg-white text-black` 
                : `bg-black/20 text-white hover:bg-black/30`
            )}
          >
            <FileText className="w-3.5 h-3.5" />
            Text
          </button>
        </div>
        
        {/* Source filter */}
        <div className="flex gap-2 mb-6">
          <button
            onClick={() => setFilterSource('all')}
            className={cn(
              "px-3 py-1 rounded-full text-xs font-medium transition-colors",
              filterSource === 'all' 
                ? `bg-white text-black` 
                : `bg-black/20 text-white hover:bg-black/30`
            )}
          >
            All Sources
          </button>
          <button
            onClick={() => setFilterSource('human')}
            className={cn(
              "px-3 py-1 rounded-full text-xs font-medium transition-colors flex items-center gap-1.5",
              filterSource === 'human' 
                ? `bg-white text-black` 
                : `bg-black/20 text-white hover:bg-black/30`
            )}
          >
            <User className="w-3.5 h-3.5" />
            Human
          </button>
          <button
            onClick={() => setFilterSource('ai')}
            className={cn(
              "px-3 py-1 rounded-full text-xs font-medium transition-colors flex items-center gap-1.5",
              filterSource === 'ai' 
                ? `bg-white text-black` 
                : `bg-black/20 text-white hover:bg-black/30`
            )}
          >
            <Brain className="w-3.5 h-3.5" />
            AI
          </button>
        </div>
        
        {/* Insights carousel */}
        <div className="relative min-h-[200px] flex items-center justify-center">
          {filteredInsights.length === 0 ? (
            <div className="text-center text-white/70">
              No insights match your current filters
            </div>
          ) : (
            <>
              <button
                onClick={prevInsight}
                className="absolute left-0 z-10 p-1.5 rounded-full bg-black/30 text-white hover:bg-black/50 transition-colors"
                aria-label="Previous insight"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              
              <AnimatePresence mode="wait">
                <motion.div
                  key={filteredInsights[activeIndex]?.id}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                  className="w-full px-10 py-4"
                >
                  {filteredInsights[activeIndex] && (
                    <div className="bg-black bg-opacity-40 rounded-xl p-5 backdrop-blur-sm border border-white/10">
                      <div className="flex justify-between items-start mb-4">
                        <div className="flex items-center gap-2">
                          <div 
                            className={cn(
                              "p-2 rounded-lg",
                              filteredInsights[activeIndex].source === 'human' 
                                ? "bg-white/20" 
                                : `bg-${domainConfig.color}-500/20`
                            )}
                          >
                            {getInsightTypeIcon(filteredInsights[activeIndex].type)}
                          </div>
                          <div>
                            <div className="font-medium text-white">
                              {filteredInsights[activeIndex].type.charAt(0).toUpperCase() + filteredInsights[activeIndex].type.slice(1)} Insight
                            </div>
                            <div className="text-xs text-white/60 flex items-center gap-1.5">
                              {filteredInsights[activeIndex].source === 'human' ? (
                                <>
                                  <User className="w-3.5 h-3.5" />
                                  Human Source
                                </>
                              ) : (
                                <>
                                  <Brain className="w-3.5 h-3.5" />
                                  AI Generated
                                </>
                              )}
                            </div>
                          </div>
                        </div>
                        <div className="text-xs text-white/60">
                          {formatTime(filteredInsights[activeIndex].timestamp)}
                        </div>
                      </div>
                      
                      <p className="text-white mb-4">
                        {filteredInsights[activeIndex].content}
                      </p>
                      
                      <div className="flex items-center gap-2">
                        <div className="text-xs text-white/60">Confidence:</div>
                        <div className="w-full h-1.5 bg-white/20 rounded-full overflow-hidden">
                          <motion.div 
                            className="h-full"
                            style={{ 
                              backgroundColor: filteredInsights[activeIndex].source === 'human' 
                                ? 'white' 
                                : domainConfig.accentColor,
                              width: `${filteredInsights[activeIndex].confidence * 100}%` 
                            }}
                            initial={{ width: 0 }}
                            animate={{ width: `${filteredInsights[activeIndex].confidence * 100}%` }}
                            transition={{ duration: 0.5 }}
                          />
                        </div>
                        <div className="text-xs font-medium text-white">
                          {Math.round(filteredInsights[activeIndex].confidence * 100)}%
                        </div>
                      </div>
                    </div>
                  )}
                </motion.div>
              </AnimatePresence>
              
              <button
                onClick={nextInsight}
                className="absolute right-0 z-10 p-1.5 rounded-full bg-black/30 text-white hover:bg-black/50 transition-colors"
                aria-label="Next insight"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </>
          )}
        </div>
        
        {/* Insight pagination */}
        {filteredInsights.length > 0 && (
          <div className="flex justify-center mt-4 gap-1.5">
            {filteredInsights.map((_, index) => (
              <button
                key={`pagination-${index}`}
                className={cn(
                  "w-2 h-2 rounded-full transition-all",
                  index === activeIndex 
                    ? `bg-white w-6` 
                    : `bg-white/30 hover:bg-white/50`
                )}
                onClick={() => setActiveIndex(index)}
                aria-label={`Go to insight ${index + 1}`}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}