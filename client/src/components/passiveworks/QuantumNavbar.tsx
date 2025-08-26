import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { DomainType, domainConfigs } from '@/contexts/DomainContext';
import { 
  Globe,
  Focus,
  PenTool,
  Search,
  Grid3X3,
  Layers,
  Cpu,
  Sparkles,
  Brain,
  Lightbulb
} from 'lucide-react';

interface NavItem {
  id: string;
  name: string;
  icon: React.ReactNode;
  description: string;
}

interface QuantumNavbarProps {
  domain: DomainType;
  activeSection: string;
  onSectionChange: (section: string) => void;
  className?: string;
}

/**
 * QuantumNavbar - An elegant navigation component that showcases the
 * different sections of the PassiveWorks platform
 */
export function QuantumNavbar({
  domain,
  activeSection,
  onSectionChange,
  className = ''
}: QuantumNavbarProps) {
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);
  
  // Navigation items
  const navItems: NavItem[] = [
    {
      id: 'explore',
      name: 'Explore',
      icon: <Globe size={20} />,
      description: 'Discover neural connections and symbiotic insights'
    },
    {
      id: 'focus',
      name: 'Focus',
      icon: <Focus size={20} />,
      description: 'Analyze specific neural pathways and relationships'
    },
    {
      id: 'create',
      name: 'Create',
      icon: <PenTool size={20} />,
      description: 'Generate symbiotic content through human-AI collaboration'
    },
    {
      id: 'mindsets',
      name: 'Mindsets',
      icon: <Lightbulb size={20} />,
      description: 'Explore creative thinking patterns of influential innovators'
    },
    {
      id: 'search',
      name: 'Search',
      icon: <Search size={20} />,
      description: 'Find specific concepts across the neural field'
    }
  ];
  
  // Get domain accent color
  const accentColor = domainConfigs[domain].color;
  
  return (
    <div className={`flex justify-center ${className}`}>
      <div className="bg-black/30 backdrop-blur-lg border border-white/10 rounded-full px-2 py-1 flex items-center">
        {navItems.map((item, index) => {
          const isActive = activeSection === item.id;
          const isHovered = hoveredItem === item.id;
          
          return (
            <React.Fragment key={item.id}>
              {/* Nav Item */}
              <div className="relative">
                <motion.button
                  className={`px-4 py-2 rounded-full flex items-center space-x-2 transition-colors ${
                    isActive ? 'text-white' : 'text-white/60 hover:text-white'
                  }`}
                  style={{
                    backgroundColor: isActive ? `${accentColor}20` : 'transparent',
                  }}
                  onClick={() => onSectionChange(item.id)}
                  onMouseEnter={() => setHoveredItem(item.id)}
                  onMouseLeave={() => setHoveredItem(null)}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <span className="relative">
                    {item.icon}
                    {isActive && (
                      <motion.span
                        className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-1 h-1 rounded-full"
                        style={{ backgroundColor: accentColor }}
                        layoutId="activeIndicator"
                        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                      />
                    )}
                  </span>
                  <span className="text-sm font-medium">{item.name}</span>
                </motion.button>
                
                {/* Item index */}
                <span className="absolute top-0 left-0 text-[10px] text-white/30 font-mono ml-1 mt-1">
                  {(index + 1).toString().padStart(2, '0')}
                </span>
                
                {/* Description Tooltip */}
                {isHovered && (
                  <motion.div
                    className="absolute top-full left-1/2 transform -translate-x-1/2 mt-2 bg-black/80 backdrop-blur-md text-white text-xs py-1 px-2 rounded pointer-events-none z-50"
                    initial={{ opacity: 0, y: -5 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -5 }}
                    transition={{ duration: 0.2 }}
                    style={{ boxShadow: `0 0 10px rgba(0,0,0,0.2)` }}
                  >
                    {item.description}
                  </motion.div>
                )}
              </div>
              
              {/* Separator */}
              {index < navItems.length - 1 && (
                <div className="h-5 w-px bg-white/10 mx-1" />
              )}
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
}