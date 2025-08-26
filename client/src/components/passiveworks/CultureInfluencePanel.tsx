import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { DomainType } from '@/contexts/DomainContext';
import { 
  useCulture, 
  CultureInfluenceType, 
  CultureInsight,
  BrandReference
} from '@/contexts/CultureContext';
import { 
  TrendingUp, 
  Target, 
  Zap, 
  Globe, 
  Award,
  ChevronRight,
  ArrowUpRight,
  BarChart3,
  Users,
  BadgePercent,
  Lightbulb
} from 'lucide-react';

interface CultureInfluencePanelProps {
  domain: DomainType;
  className?: string;
}

/**
 * CultureInfluencePanel - A component that showcases how AI can be used to
 * not just analyze but actively shape and influence cultural trends
 */
export function CultureInfluencePanel({
  domain,
  className = ''
}: CultureInfluencePanelProps) {
  const { 
    activeInfluenceMode, 
    setActiveInfluenceMode,
    cultureInsights,
    brandReferences,
    getInsightsForDomain,
    getReferenceBrandsForDomain
  } = useCulture();
  
  const [expandedInsight, setExpandedInsight] = useState<string | null>(null);
  const [expandedBrand, setExpandedBrand] = useState<string | null>(null);
  
  // Get domain-specific insights and references
  const insights = getInsightsForDomain(domain);
  const brands = getReferenceBrandsForDomain(domain);
  
  // Top insights and brands to display
  const topInsights = insights.filter(insight => insight.recommended).slice(0, 3);
  const topBrands = brands.slice(0, 3);
  
  // Helper to get mode icon
  const getModeIcon = (mode: CultureInfluenceType) => {
    switch (mode) {
      case 'trend': return <TrendingUp size={18} />;
      case 'position': return <Target size={18} />;
      case 'viral': return <Zap size={18} />;
      case 'dictate': return <Globe size={18} />;
      default: return <TrendingUp size={18} />;
    }
  };
  
  // Helper to get mode description
  const getModeDescription = (mode: CultureInfluenceType) => {
    switch (mode) {
      case 'trend':
        return 'Forecast emerging cultural trends before they happen using neural analysis of early signals';
      case 'position':
        return 'Algorithmically optimize brand positioning to maximize cultural relevance and resonance';
      case 'viral':
        return 'Engineer content specifically designed to exploit recommendation algorithms for maximum reach';
      case 'dictate':
        return 'Proactively shape cultural narratives instead of simply responding to existing trends';
      default:
        return '';
    }
  };
  
  return (
    <div className={`bg-black/30 backdrop-blur-lg border border-white/10 rounded-lg ${className}`}>
      <div className="p-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-white text-lg font-medium">AI-Driven Culture Engine</h3>
          <Award size={18} className="text-white/60" />
        </div>
        
        {/* Mode selector */}
        <div className="grid grid-cols-2 gap-2 mb-6">
          {(['trend', 'position', 'viral', 'dictate'] as CultureInfluenceType[]).map((mode) => (
            <motion.button
              key={mode}
              className={`flex items-center p-2 rounded-md text-sm ${
                activeInfluenceMode === mode 
                  ? 'bg-white/10 text-white'
                  : 'text-white/60 hover:text-white hover:bg-white/5'
              }`}
              onClick={() => setActiveInfluenceMode(mode)}
              whileTap={{ scale: 0.98 }}
            >
              <span className="mr-2">{getModeIcon(mode)}</span>
              <span className="capitalize">{mode}</span>
            </motion.button>
          ))}
        </div>
        
        {/* Mode description */}
        <div className="bg-white/5 rounded-md p-3 mb-6">
          <p className="text-white/80 text-sm">{getModeDescription(activeInfluenceMode)}</p>
        </div>
        
        {/* Brand references section */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-3">
            <h4 className="text-white/90 text-sm font-medium">Reference Brands</h4>
            <Users size={16} className="text-white/60" />
          </div>
          <div className="space-y-2">
            {topBrands.map((brand) => (
              <BrandReferenceCard 
                key={brand.id}
                brand={brand}
                isExpanded={expandedBrand === brand.id}
                onToggle={() => setExpandedBrand(expandedBrand === brand.id ? null : brand.id)}
              />
            ))}
          </div>
        </div>
        
        {/* Cultural insights section */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <h4 className="text-white/90 text-sm font-medium">
              {activeInfluenceMode === 'dictate' ? 'Culture Creation Opportunities' : 'Cultural Insights'}
            </h4>
            <Lightbulb size={16} className="text-white/60" />
          </div>
          <div className="space-y-2">
            {topInsights.map((insight) => (
              <InsightCard 
                key={insight.id}
                insight={insight}
                isExpanded={expandedInsight === insight.id}
                onToggle={() => setExpandedInsight(expandedInsight === insight.id ? null : insight.id)}
              />
            ))}
          </div>
        </div>
      </div>
      
      {/* Footer with brand message */}
      <div className="border-t border-white/10 p-3">
        <p className="text-white/40 text-xs">
          PassiveWorks doesn't just analyze culture—it creates it.
        </p>
      </div>
    </div>
  );
}

interface BrandReferenceCardProps {
  brand: BrandReference;
  isExpanded: boolean;
  onToggle: () => void;
}

function BrandReferenceCard({ brand, isExpanded, onToggle }: BrandReferenceCardProps) {
  return (
    <div className="bg-white/5 rounded-md overflow-hidden">
      <button 
        className="w-full p-3 flex items-center justify-between text-left"
        onClick={onToggle}
      >
        <div className="flex items-center">
          <span className="text-white font-medium text-sm">{brand.name}</span>
          <span className="ml-2 text-white/40 text-xs">{brand.category}</span>
        </div>
        <motion.div
          animate={{ rotate: isExpanded ? 90 : 0 }}
          transition={{ duration: 0.2 }}
        >
          <ChevronRight size={16} className="text-white/60" />
        </motion.div>
      </button>
      
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="p-3 pt-0 space-y-3">
              <div className="grid grid-cols-3 gap-2">
                <div className="bg-white/5 rounded p-2 text-center">
                  <div className="text-white/40 text-xs mb-1">Cultural Relevance</div>
                  <div className="text-white font-medium">{brand.culturalRelevance}%</div>
                </div>
                <div className="bg-white/5 rounded p-2 text-center">
                  <div className="text-white/40 text-xs mb-1">AI Utilization</div>
                  <div className="text-white font-medium">{brand.aiUtilization}%</div>
                </div>
                <div className="bg-white/5 rounded p-2 text-center">
                  <div className="text-white/40 text-xs mb-1">Innovation</div>
                  <div className="text-white font-medium">{brand.innovationScore}%</div>
                </div>
              </div>
              
              <div>
                <div className="text-white/60 text-xs mb-1">Key Insight</div>
                <div className="text-white/90 text-sm">{brand.keyInsight}</div>
              </div>
              
              <div>
                <div className="text-white/60 text-xs mb-1">Key Tactic</div>
                <div className="text-white/90 text-sm">{brand.keyTactic}</div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

interface InsightCardProps {
  insight: CultureInsight;
  isExpanded: boolean;
  onToggle: () => void;
}

function InsightCard({ insight, isExpanded, onToggle }: InsightCardProps) {
  return (
    <div className="bg-white/5 rounded-md overflow-hidden">
      <button 
        className="w-full p-3 flex items-center justify-between text-left"
        onClick={onToggle}
      >
        <div>
          <div className="text-white font-medium text-sm">{insight.title}</div>
          <div className="text-white/40 text-xs">Impact: {insight.impact}% • Horizon: {insight.timeHorizon}</div>
        </div>
        <motion.div
          animate={{ rotate: isExpanded ? 90 : 0 }}
          transition={{ duration: 0.2 }}
        >
          <ChevronRight size={16} className="text-white/60" />
        </motion.div>
      </button>
      
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="p-3 pt-0 space-y-3">
              <div className="text-white/80 text-sm">{insight.description}</div>
              
              <div className="grid grid-cols-2 gap-2">
                <div className="bg-white/5 rounded p-2">
                  <div className="text-white/40 text-xs mb-1">Confidence</div>
                  <div className="flex items-center">
                    <BarChart3 size={14} className="text-white/60 mr-1" />
                    <div className="text-white font-medium text-sm">{insight.confidence}%</div>
                  </div>
                </div>
                <div className="bg-white/5 rounded p-2">
                  <div className="text-white/40 text-xs mb-1">Actionability</div>
                  <div className="flex items-center">
                    <ArrowUpRight size={14} className="text-white/60 mr-1" />
                    <div className="text-white font-medium text-sm">{insight.actionability}%</div>
                  </div>
                </div>
              </div>
              
              <div>
                <div className="text-white/60 text-xs mb-1">Related Brands</div>
                <div className="flex flex-wrap gap-1">
                  {insight.relatedBrands.map((brand, index) => (
                    <span 
                      key={index} 
                      className="bg-white/10 text-white/80 text-xs px-2 py-1 rounded"
                    >
                      {brand}
                    </span>
                  ))}
                </div>
              </div>
              
              <div>
                <div className="text-white/60 text-xs mb-1">Related Trends</div>
                <div className="flex flex-wrap gap-1">
                  {insight.relatedTrends.map((trend, index) => (
                    <span 
                      key={index} 
                      className="bg-white/10 text-white/80 text-xs px-2 py-1 rounded"
                    >
                      {trend}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}