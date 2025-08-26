import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { DomainType, domainConfigs } from '@/contexts/DomainContext';
import { 
  CircleDashed, 
  DollarSign, 
  Bitcoin, 
  Trophy,
  ChevronUp
} from 'lucide-react';

interface DomainSelectorProps {
  activeDomain: DomainType;
  onDomainChange: (domain: DomainType) => void;
  className?: string;
}

/**
 * DomainSelector - An elegant component for switching between different domains
 * with smooth animations and visual feedback
 */
export function DomainSelector({
  activeDomain,
  onDomainChange,
  className = ''
}: DomainSelectorProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  
  const getDomainIcon = (domain: DomainType) => {
    switch (domain) {
      case 'finance': return <DollarSign size={18} />;
      case 'crypto': return <Bitcoin size={18} />;
      case 'sports': return <Trophy size={18} />;
      default: return <CircleDashed size={18} />;
    }
  };
  
  const domains: DomainType[] = ['general', 'finance', 'crypto', 'sports'];
  
  // Current domain config
  const currentDomain = domainConfigs[activeDomain];
  
  return (
    <div className={`relative ${className}`}>
      {/* Active domain button */}
      <motion.button
        className="flex items-center space-x-2 px-4 py-2 rounded-full bg-black/30 backdrop-blur-md border border-white/10 text-white hover:bg-black/40 transition-colors"
        onClick={() => setIsExpanded(!isExpanded)}
        whileTap={{ scale: 0.97 }}
      >
        <span className="text-sm font-medium">{currentDomain.name}</span>
        <span 
          className="flex items-center justify-center w-6 h-6 rounded-full" 
          style={{ backgroundColor: `${currentDomain.color}20` }}
        >
          {getDomainIcon(activeDomain)}
        </span>
        <motion.span
          animate={{ rotate: isExpanded ? 180 : 0 }}
          transition={{ duration: 0.2 }}
        >
          <ChevronUp size={16} className="text-white/60" />
        </motion.span>
      </motion.button>
      
      {/* Domain selection dropdown */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            className="absolute bottom-full left-0 mb-2 bg-black/50 backdrop-blur-md rounded-lg border border-white/10 p-2 min-w-full"
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            style={{ transformOrigin: 'bottom left' }}
          >
            <div className="space-y-1">
              {domains.map((domain) => {
                const domainConfig = domainConfigs[domain];
                const isActive = domain === activeDomain;
                
                return (
                  <motion.button
                    key={domain}
                    className={`flex items-center justify-between w-full px-3 py-2 rounded-md text-sm ${
                      isActive ? 'text-white' : 'text-white/70 hover:text-white'
                    }`}
                    style={{ 
                      backgroundColor: isActive ? `${domainConfig.color}20` : 'transparent',
                    }}
                    onClick={() => {
                      onDomainChange(domain);
                      setIsExpanded(false);
                    }}
                    whileHover={{ 
                      backgroundColor: isActive ? `${domainConfig.color}30` : 'rgba(255, 255, 255, 0.05)'
                    }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <span className="font-medium">{domainConfig.name}</span>
                    <span 
                      className="flex items-center justify-center w-6 h-6 rounded-full" 
                      style={{ backgroundColor: `${domainConfig.color}30` }}
                    >
                      {getDomainIcon(domain)}
                    </span>
                  </motion.button>
                );
              })}
            </div>
            
            <div className="pt-2 mt-2 border-t border-white/10">
              <div className="text-[10px] text-white/40 px-3">
                Domain selection affects neural field visualization and data interpretation
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}