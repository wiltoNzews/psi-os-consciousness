import React, { useRef, useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { DomainType, domainConfigs } from '@/contexts/DomainContext';
import { ChevronRight, ChevronLeft, Brain, Cpu, Database } from 'lucide-react';

interface HolographicInterfaceProps {
  domain: DomainType;
  className?: string;
  activeTab?: string;
}

/**
 * HolographicInterface - A premium, floating augmented reality interface overlay
 * that creates the visual impression of a high-end holographic system
 * projected in the space between the user and the 3D visualization
 */
export function HolographicInterface({ 
  domain,
  className = '',
  activeTab = 'metrics'
}: HolographicInterfaceProps) {
  const [selectedMetric, setSelectedMetric] = useState(0);
  const [hoverElement, setHoverElement] = useState<string | null>(null);
  
  const metrics = [
    { 
      id: 'neural-depth',
      label: 'Neural Depth', 
      value: '96.4%', 
      change: '+12.2%',
      description: 'Cognitive integration efficiency between human and AI neural patterns.'
    },
    { 
      id: 'symbiotic-flow',
      label: 'Symbiotic Flow', 
      value: '84.3%', 
      change: '+8.7%',
      description: 'Real-time synchronization between human intent and computational execution.'
    },
    { 
      id: 'temporal-coherence',
      label: 'Temporal Coherence', 
      value: '91.8%', 
      change: '+5.3%',
      description: 'Stability of temporal pathways in augmented consciousness states.'
    },
    { 
      id: 'semantic-depth',
      label: 'Semantic Depth', 
      value: '78.2%', 
      change: '+15.9%',
      description: 'Layered meaning extraction from complex conceptual structures.'
    },
  ];
  
  const cognitivePatterns = [
    { id: 'divergent', label: 'Divergent Thinking', value: 87 },
    { id: 'convergent', label: 'Convergent Analysis', value: 93 },
    { id: 'lateral', label: 'Lateral Connection', value: 76 },
    { id: 'abstract', label: 'Abstract Reasoning', value: 89 },
  ];
  
  // Holographic element colors based on domain
  const getPrimaryColor = () => domainConfigs[domain].color;
  
  const getSecondaryColor = () => {
    switch(domain) {
      case 'finance': return '#00e4ff';
      case 'crypto': return '#b794f6';
      case 'sports': return '#fee2e2';
      default: return '#a7f3d0';
    }
  };
  
  const getTextShadow = (color: string) => {
    return `0 0 5px ${color}, 0 0 10px ${color}70, 0 0 15px ${color}40`;
  };
  
  const getBoxShadow = (color: string) => {
    return `0 0 10px ${color}50, 0 0 20px ${color}30, inset 0 0 15px ${color}20`;
  };
  
  // Cycle through metrics with animation
  useEffect(() => {
    const interval = setInterval(() => {
      setSelectedMetric((prev) => (prev + 1) % metrics.length);
    }, 5000);
    
    return () => clearInterval(interval);
  }, [metrics.length]);
  
  return (
    <div className={`relative w-full h-full ${className}`}>
      {/* Top holographic interface element */}
      <div className="absolute top-16 left-1/2 transform -translate-x-1/2 w-full max-w-4xl">
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="relative"
        >
          {/* Top center arc element */}
          <svg width="500" height="70" viewBox="0 0 500 70" className="absolute left-1/2 transform -translate-x-1/2 -top-14 opacity-50">
            <defs>
              <linearGradient id="arcGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor={`${getPrimaryColor()}00`} />
                <stop offset="50%" stopColor={getPrimaryColor()} />
                <stop offset="100%" stopColor={`${getPrimaryColor()}00`} />
              </linearGradient>
            </defs>
            <path 
              d="M10,60 C150,0 350,0 490,60" 
              stroke="url(#arcGradient)" 
              strokeWidth="2" 
              fill="none" 
            />
            <circle cx="250" cy="10" r="4" fill={getPrimaryColor()} opacity="0.8">
              <animate attributeName="opacity" values="0.3;0.8;0.3" dur="3s" repeatCount="indefinite" />
            </circle>
          </svg>
          
          {/* Floating metric cards */}
          <div className="flex justify-center space-x-4">
            {metrics.map((metric, index) => (
              <motion.div
                key={metric.id}
                animate={{
                  y: selectedMetric === index ? -15 : 0,
                  scale: selectedMetric === index ? 1.05 : 0.95,
                  opacity: selectedMetric === index ? 1 : 0.6,
                }}
                transition={{ duration: 0.5 }}
                onMouseEnter={() => setSelectedMetric(index)}
                className="relative w-56 h-32 rounded-lg bg-black/40 backdrop-blur-md overflow-hidden cursor-pointer group"
                style={{ 
                  border: `1px solid ${getPrimaryColor()}30`,
                  boxShadow: selectedMetric === index ? getBoxShadow(getPrimaryColor()) : 'none',
                }}
              >
                {/* Animated border */}
                <div 
                  className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                  style={{
                    background: `
                      linear-gradient(90deg, transparent, ${getPrimaryColor()}40, transparent) 0 0/300% 100%,
                      linear-gradient(90deg, transparent, ${getPrimaryColor()}40, transparent) 0 100%/300% 100%,
                      linear-gradient(0deg, transparent, ${getPrimaryColor()}40, transparent) 100% 0/100% 300%,
                      linear-gradient(0deg, transparent, ${getPrimaryColor()}40, transparent) 0 0/100% 300%
                    `,
                    backgroundRepeat: 'no-repeat',
                    animation: 'border-flow 3s infinite linear'
                  }}
                />
                
                {/* Card content */}
                <div className="p-4 h-full flex flex-col justify-between">
                  <div className="flex justify-between items-start">
                    <h3 
                      className="text-xs font-light tracking-wider"
                      style={{ 
                        color: getSecondaryColor(),
                        textShadow: selectedMetric === index ? getTextShadow(getSecondaryColor()) : 'none'
                      }}
                    >
                      {metric.label.toUpperCase()}
                    </h3>
                    <div className="flex items-center text-xs text-green-400">
                      {metric.change}
                    </div>
                  </div>
                  
                  <div 
                    className="text-3xl font-light mt-2"
                    style={{ 
                      color: '#fff',
                      textShadow: selectedMetric === index ? getTextShadow('#fff') : 'none'
                    }}
                  >
                    {metric.value}
                  </div>
                  
                  <p className="text-xs text-white/70 mt-2 line-clamp-2">{metric.description}</p>
                </div>
                
                {/* Bottom accent line */}
                <div 
                  className="absolute bottom-0 left-0 h-1 transition-all duration-500 ease-out"
                  style={{ 
                    width: selectedMetric === index ? '100%' : '30%',
                    background: `linear-gradient(90deg, ${getPrimaryColor()}00, ${getPrimaryColor()}, ${getPrimaryColor()}00)`,
                  }}
                />
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
      
      {/* Floating side interface */}
      <motion.div 
        className="absolute top-1/2 transform -translate-y-1/2 left-6"
        initial={{ opacity: 0, x: -50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8, delay: 0.8 }}
      >
        <div 
          className="w-80 rounded-lg overflow-hidden bg-black/30 backdrop-blur-sm"
          style={{ 
            border: `1px solid ${getPrimaryColor()}20`,
            boxShadow: getBoxShadow(getPrimaryColor()),
          }}
        >
          {/* Interface header */}
          <div 
            className="px-4 py-3 flex justify-between items-center"
            style={{ 
              background: `linear-gradient(90deg, ${getPrimaryColor()}30, transparent)`,
              borderBottom: `1px solid ${getPrimaryColor()}20`,
            }}
          >
            <h3 
              className="text-sm tracking-wider font-light"
              style={{ 
                color: '#fff', 
                textShadow: getTextShadow('#fff'),
              }}
            >
              COGNITIVE PATTERNS
            </h3>
            
            <div className="flex space-x-2">
              <button className="text-white/70 hover:text-white">
                <ChevronLeft size={16} />
              </button>
              <button className="text-white/70 hover:text-white">
                <ChevronRight size={16} />
              </button>
            </div>
          </div>
          
          {/* Interface content */}
          <div className="p-4 space-y-3">
            {cognitivePatterns.map((pattern) => (
              <div 
                key={pattern.id}
                className="group"
                onMouseEnter={() => setHoverElement(pattern.id)}
                onMouseLeave={() => setHoverElement(null)}
              >
                <div className="flex justify-between items-center mb-1">
                  <div className="text-xs text-white/90 flex items-center">
                    {pattern.id === 'divergent' && <Brain size={12} className="mr-1" />}
                    {pattern.id === 'convergent' && <Cpu size={12} className="mr-1" />}
                    {pattern.id === 'lateral' && <Database size={12} className="mr-1" />}
                    {pattern.label}
                  </div>
                  <div 
                    className="text-xs"
                    style={{ 
                      color: getSecondaryColor(),
                      textShadow: hoverElement === pattern.id ? getTextShadow(getSecondaryColor()) : 'none',
                    }}
                  >
                    {pattern.value}%
                  </div>
                </div>
                
                <div 
                  className="w-full h-1.5 bg-black/50 rounded-full overflow-hidden"
                  style={{ boxShadow: 'inset 0 0 5px rgba(0,0,0,0.5)' }}
                >
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${pattern.value}%` }}
                    transition={{ duration: 1, delay: 1 }}
                    className="h-full rounded-full"
                    style={{ 
                      background: `linear-gradient(90deg, ${getPrimaryColor()}, ${getSecondaryColor()})`,
                      boxShadow: hoverElement === pattern.id ? `0 0 10px ${getPrimaryColor()}90` : 'none',
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
          
          {/* Bottom decorative grid */}
          <div className="px-4 py-3 border-t border-white/10">
            <div className="grid grid-cols-5 gap-2 h-20">
              {Array.from({ length: 20 }).map((_, i) => (
                <div 
                  key={i} 
                  className="rounded-sm bg-black/50"
                  style={{ 
                    border: `1px solid ${getPrimaryColor()}20`,
                    boxShadow: Math.random() > 0.7 ? `0 0 5px ${getPrimaryColor()}70` : 'none',
                  }}
                >
                  {/* Random dots with animation */}
                  {Math.random() > 0.7 && (
                    <div 
                      className="w-1 h-1 rounded-full bg-white mx-auto mt-1"
                      style={{ 
                        animation: `pulse ${2 + Math.random() * 3}s infinite`,
                      }}
                    />
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </motion.div>
      
      {/* Bottom floating element */}
      <motion.div 
        className="absolute bottom-6 left-1/2 transform -translate-x-1/2"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 1 }}
      >
        <div 
          className="flex items-center justify-center bg-black/30 backdrop-blur-sm rounded-full py-2 px-8 space-x-6"
          style={{ 
            border: `1px solid ${getPrimaryColor()}30`,
            boxShadow: getBoxShadow(getPrimaryColor()),
          }}
        >
          {['integration', 'extension', 'symbiosis', 'mindflow'].map((item) => (
            <div 
              key={item}
              className="flex flex-col items-center justify-center cursor-pointer group"
              onMouseEnter={() => setHoverElement(item)}
              onMouseLeave={() => setHoverElement(null)}
            >
              {/* Indicator dot */}
              <div 
                className="w-1.5 h-1.5 rounded-full mb-2 transition-all duration-300"
                style={{ 
                  background: hoverElement === item ? getPrimaryColor() : 'rgba(255,255,255,0.3)',
                  boxShadow: hoverElement === item ? `0 0 10px ${getPrimaryColor()}` : 'none',
                }}
              />
              
              {/* Label */}
              <span 
                className="text-xs uppercase tracking-wider transition-all duration-300"
                style={{ 
                  color: hoverElement === item ? '#fff' : 'rgba(255,255,255,0.5)',
                  textShadow: hoverElement === item ? getTextShadow('#fff') : 'none',
                }}
              >
                {item}
              </span>
            </div>
          ))}
        </div>
      </motion.div>
      
      {/* Floating corner elements */}
      <div className="absolute top-3 left-3">
        <div 
          className="w-24 h-24"
          style={{ opacity: 0.4 }}
        >
          <svg width="100%" height="100%" viewBox="0 0 100 100">
            <path 
              d="M0,0 L40,0 L40,5 L5,5 L5,40 L0,40 Z" 
              fill={getPrimaryColor()} 
              opacity="0.8"
            />
            <path 
              d="M5,0 L5,35 L0,35 L0,0 Z" 
              fill={getPrimaryColor()} 
              opacity="0.4"
            >
              <animate attributeName="opacity" values="0.4;0.8;0.4" dur="3s" repeatCount="indefinite" />
            </path>
            <path 
              d="M35,5 L5,5 L5,0 L35,0 Z" 
              fill={getPrimaryColor()} 
              opacity="0.4"
            >
              <animate attributeName="opacity" values="0.4;0.8;0.4" dur="2.5s" repeatCount="indefinite" />
            </path>
          </svg>
        </div>
      </div>
      
      <div className="absolute bottom-3 right-3">
        <div 
          className="w-24 h-24"
          style={{ opacity: 0.4 }}
        >
          <svg width="100%" height="100%" viewBox="0 0 100 100">
            <path 
              d="M100,100 L60,100 L60,95 L95,95 L95,60 L100,60 Z" 
              fill={getPrimaryColor()} 
              opacity="0.8"
            />
            <path 
              d="M95,100 L95,65 L100,65 L100,100 Z" 
              fill={getPrimaryColor()} 
              opacity="0.4"
            >
              <animate attributeName="opacity" values="0.4;0.8;0.4" dur="3s" repeatCount="indefinite" />
            </path>
            <path 
              d="M65,95 L95,95 L95,100 L65,100 Z" 
              fill={getPrimaryColor()} 
              opacity="0.4"
            >
              <animate attributeName="opacity" values="0.4;0.8;0.4" dur="2.5s" repeatCount="indefinite" />
            </path>
          </svg>
        </div>
      </div>
      
      {/* Global CSS for holographic animations */}
      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes border-flow {
          0% {
            background-position: 100% 0, 0 100%, 100% 100%, 0 0;
          }
          100% {
            background-position: 0 0, 100% 100%, 100% 0, 0 100%;
          }
        }
        
        @keyframes pulse {
          0%, 100% { opacity: 0.2; }
          50% { opacity: 1; }
        }
      `}} />
    </div>
  );
}