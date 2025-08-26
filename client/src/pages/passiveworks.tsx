import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { NeuralSymbiosis } from '@/components/passiveworks';
import { useDomain, DomainType } from '@/contexts/DomainContext';
import { getSystemStatuses } from '@/lib/mock-data';
import { useMediaQuery } from '@/hooks/use-mobile';
import { Brain, Cpu, Globe, Zap, File, PlusCircle, Search, X, Eye, Info, Wand2, FastForward, Rewind, Clock } from 'lucide-react';

/**
 * PassiveWorks Platform
 * 
 * This interface transcends traditional UI paradigms, designed to function
 * as an extension of human consciousness. It features:
 * 
 * - Negative space as primary design medium
 * - Information that emerges from the void only when needed
 * - Temporal manipulation of information flow
 * - Direct neural-like connections between concepts
 */
export default function PassiveWorks() {
  const { domainConfig, activeDomain, setActiveDomain } = useDomain();
  const isMobile = useMediaQuery('(max-width: 768px)');
  const [showInterface, setShowInterface] = useState(false); // Start with interface hidden
  const [selectedNode, setSelectedNode] = useState<string | null>(null);
  const [interfaceOpacity, setInterfaceOpacity] = useState(0.9);
  const [cognitiveMode, setCognitiveMode] = useState<'explore' | 'focus' | 'create' | 'search'>('explore');
  const [systemStatuses, setSystemStatuses] = useState<any[]>([]);
  const [temporalFocus, setTemporalFocus] = useState(0); // Controls which temporal slice is in focus
  const [temporalDilation, setTemporalDilation] = useState(1); // Controls speed of neural field animations
  const [showWelcomePulse, setShowWelcomePulse] = useState(true); // Show welcome pulse on first load
  const [userActiveTimeoutId, setUserActiveTimeoutId] = useState<NodeJS.Timeout | null>(null);
  const mousePositionRef = useRef({ x: 0, y: 0 }); // Track mouse position
  const lastInteractionRef = useRef(Date.now());

  // Initialize with mock data
  useEffect(() => {
    setSystemStatuses(getSystemStatuses());
    
    // Set timeout to show interface after welcome pulse
    const timeout = setTimeout(() => {
      setShowWelcomePulse(false);
      setShowInterface(true);
    }, 3500);
    
    return () => clearTimeout(timeout);
  }, []);
  
  // Track mouse movement for ephemeral UI responses
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      mousePositionRef.current = { x: e.clientX, y: e.clientY };
      lastInteractionRef.current = Date.now();
      
      // Show interface when mouse moves
      if (!showInterface) {
        setShowInterface(true);
      }
      
      // Reset timeout for hiding interface
      if (userActiveTimeoutId) {
        clearTimeout(userActiveTimeoutId);
      }
      
      // Set new timeout to hide interface after inactivity (10 seconds)
      const timeoutId = setTimeout(() => {
        setShowInterface(false);
      }, 10000);
      
      setUserActiveTimeoutId(timeoutId as unknown as NodeJS.Timeout);
    };
    
    window.addEventListener('mousemove', handleMouseMove);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      if (userActiveTimeoutId) {
        clearTimeout(userActiveTimeoutId);
      }
    };
  }, [showInterface, userActiveTimeoutId]);

  // Handle canvas click events
  const handleCanvasClick = () => {
    // Randomly toggle interface visibility to create the sensation of thought-based interaction
    if (Math.random() > 0.7) {
      setShowInterface(!showInterface);
    }
  };

  // Handle domain selection
  const handleDomainSelect = (domain: DomainType) => {
    setActiveDomain(domain);
    
    // Reset cognitive state when domain changes
    setSelectedNode(null);
    setCognitiveMode('explore');
    setTemporalFocus(0);
  };
  
  // Control temporal dilation (time flow speed)
  const handleIncreaseTemporal = () => {
    setTemporalDilation(prev => Math.min(prev + 0.5, 5));
  };
  
  const handleDecreaseTemporal = () => {
    setTemporalDilation(prev => Math.max(prev - 0.5, 0.2));
  };
  
  const handleResetTemporal = () => {
    setTemporalDilation(1);
  };

  return (
    <div 
      className="min-h-screen w-full bg-black overflow-hidden relative"
      onClick={handleCanvasClick}
    >
      {/* Main Neural Field Visualization (always present) */}
      <div className="absolute inset-0 z-0">
        {/* Using our completely new implementation */}
        <NeuralSymbiosis 
          domain={activeDomain}
          highlightedNode={selectedNode}
          onNodeSelect={setSelectedNode}
          showNodeDetails={cognitiveMode === 'focus'}
          temporalDilation={temporalDilation}
          showLabels={true}
          showDataFlow={true}
        />
      </div>
      
      {/* Temporal Dilation Controls - Only visible in focus mode */}
      {cognitiveMode === 'focus' && (
        <motion.div 
          className="absolute right-6 top-1/2 transform -translate-y-1/2 pointer-events-auto z-20"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: 20 }}
          transition={{ duration: 0.3 }}
        >
          <div className="flex flex-col items-center space-y-4 bg-black/40 backdrop-blur-sm border border-white/10 rounded-lg p-3">
            <button 
              className="p-2 hover:bg-white/10 rounded-md transition-colors text-white/70"
              onClick={handleIncreaseTemporal}
              title="Increase temporal flow rate"
            >
              <FastForward className="h-4 w-4" />
            </button>
            
            <div className="text-white/70 text-xs font-mono">
              {temporalDilation.toFixed(1)}x
            </div>
            
            <button 
              className="p-2 hover:bg-white/10 rounded-md transition-colors text-white/70"
              onClick={handleDecreaseTemporal}
              title="Decrease temporal flow rate"
            >
              <Rewind className="h-4 w-4" />
            </button>
            
            <button 
              className="p-2 hover:bg-white/10 rounded-md transition-colors text-white/70"
              onClick={handleResetTemporal}
              title="Reset temporal flow"
            >
              <Clock className="h-4 w-4" />
            </button>
          </div>
        </motion.div>
      )}

      {/* Consciousness Interface - only visible when showInterface is true */}
      <AnimatePresence>
        {showInterface && (
          <motion.div 
            className="absolute inset-0 z-10 pointer-events-none"
            initial={{ opacity: 0 }}
            animate={{ opacity: interfaceOpacity }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
          >
            {/* Minimal Header - Appears to float in space */}
            <motion.div 
              className="absolute top-6 left-1/2 transform -translate-x-1/2 pointer-events-auto"
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.5 }}
            >
              <div className="flex items-center justify-center">
                <motion.h1 
                  className="text-white/90 text-lg md:text-2xl font-light tracking-[0.5em] uppercase"
                  initial={{ letterSpacing: "0.2em" }}
                  animate={{ letterSpacing: "0.5em" }}
                  transition={{ duration: 1.5, ease: "easeOut" }}
                >
                  PassiveWorks
                </motion.h1>
              </div>
            </motion.div>

            {/* Cognitive Mode Selector - Minimal, ethereal interface */}
            <div className="absolute top-24 left-1/2 transform -translate-x-1/2 pointer-events-auto">
              <div className="flex items-center justify-center space-x-6 md:space-x-12">
                {[
                  { id: 'explore', icon: <Globe className="h-4 w-4" />, label: 'Explore' },
                  { id: 'focus', icon: <Brain className="h-4 w-4" />, label: 'Focus' },
                  { id: 'create', icon: <PlusCircle className="h-4 w-4" />, label: 'Create' },
                  { id: 'search', icon: <Search className="h-4 w-4" />, label: 'Search' }
                ].map((mode) => (
                  <motion.button
                    key={mode.id}
                    className={`flex flex-col items-center justify-center space-y-2 ${
                      cognitiveMode === mode.id 
                        ? 'text-white' 
                        : 'text-white/40 hover:text-white/70'
                    } transition-colors duration-300`}
                    onClick={() => setCognitiveMode(mode.id as any)}
                    whileHover={{ y: -3 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <div className={`p-3 rounded-full ${
                      cognitiveMode === mode.id 
                        ? 'bg-[#7B00FF]/20 ring-1 ring-[#7B00FF]/50' 
                        : 'bg-white/5'
                    }`}>
                      {mode.icon}
                    </div>
                    <span className="text-xs uppercase tracking-wider">{mode.label}</span>
                    
                    {/* Active indicator */}
                    {cognitiveMode === mode.id && (
                      <motion.div 
                        className="h-0.5 w-5 bg-[#7B00FF]"
                        layoutId="activeIndicator"
                        transition={{ type: "spring", duration: 0.5 }}
                      />
                    )}
                  </motion.button>
                ))}
              </div>
            </div>

            {/* Domain Selector - Appears as a cognitive field selector */}
            <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 pointer-events-auto">
              <div className="flex items-center space-x-4 md:space-x-8">
                {[
                  { id: 'finance', icon: <File className="h-4 w-4" />, label: 'Finance' },
                  { id: 'crypto', icon: <Cpu className="h-4 w-4" />, label: 'Crypto' },
                  { id: 'sports', icon: <Zap className="h-4 w-4" />, label: 'Sports' },
                  { id: 'general', icon: <Brain className="h-4 w-4" />, label: 'General' }
                ].map((domain) => (
                  <motion.button
                    key={domain.id}
                    className={`flex items-center justify-center space-x-2 px-3 py-2 rounded-full ${
                      activeDomain === domain.id 
                        ? 'bg-black ring-1 ring-white/20 text-white' 
                        : 'bg-transparent text-white/50 hover:text-white/80'
                    } transition-all duration-300`}
                    onClick={() => handleDomainSelect(domain.id as DomainType)}
                    whileHover={{ 
                      backgroundColor: 'rgba(0, 0, 0, 0.3)',
                      transition: { duration: 0.2 }
                    }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <div className={`${
                      activeDomain === domain.id 
                        ? 'text-[#7B00FF]' 
                        : 'text-white/50'
                    }`}>
                      {domain.icon}
                    </div>
                    <span className="text-xs uppercase tracking-wider">{domain.label}</span>
                  </motion.button>
                ))}
              </div>
            </div>
            
            {/* System Status Indicators - Appear as ethereal glyphs */}
            <div className="absolute top-6 right-6 pointer-events-auto">
              <div className="flex space-x-3">
                {systemStatuses.slice(0, 3).map((status, index) => (
                  <motion.div
                    key={status.id}
                    className="relative"
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 * index, duration: 0.5 }}
                  >
                    <div className={`h-2 w-2 rounded-full ${
                      status.status === 'operational' ? 'bg-green-400' :
                      status.status === 'high load' ? 'bg-yellow-400' :
                      status.status === 'warning' ? 'bg-orange-400' :
                      'bg-red-400'
                    }`} />
                    
                    <motion.div 
                      className={`absolute inset-0 rounded-full ${
                        status.status === 'operational' ? 'bg-green-400' :
                        status.status === 'high load' ? 'bg-yellow-400' :
                        status.status === 'warning' ? 'bg-orange-400' :
                        'bg-red-400'
                      }`}
                      animate={{ 
                        opacity: [0.6, 0.2, 0.6],
                        scale: [1, 1.8, 1]
                      }}
                      transition={{ 
                        duration: 2 + index * 0.5,
                        repeat: Infinity,
                        ease: "easeInOut"
                      }}
                      style={{ opacity: 0.2 }}
                    />
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Temporal Control - Only visible in focus mode */}
            {cognitiveMode === 'focus' && (
              <motion.div 
                className="absolute left-6 top-1/2 transform -translate-y-1/2 pointer-events-auto"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
              >
                <div className="flex flex-col items-center space-y-6">
                  <div className="bg-black/30 backdrop-blur-sm border border-white/10 rounded-full p-1 w-1 h-20">
                    <div 
                      className="relative w-full h-full"
                      onClick={(e) => {
                        // Prevent propagation to avoid canvas click handler
                        e.stopPropagation();
                        if (e.currentTarget) {
                          const rect = e.currentTarget.getBoundingClientRect();
                          const y = e.clientY - rect.top;
                          const percentage = 1 - (y / rect.height);
                          setTemporalFocus(Math.min(1, Math.max(0, percentage)));
                        }
                      }}
                    >
                      <motion.div 
                        className="absolute w-4 h-4 bg-[#7B00FF] rounded-full -left-1.5"
                        style={{ top: `${(1 - temporalFocus) * 100}%` }}
                        drag="y"
                        dragConstraints={{ top: 0, bottom: 20 }}
                        dragElastic={0.1}
                        dragMomentum={false}
                        onDrag={(e: any, info) => {
                          const element = e.target as HTMLElement;
                          const parent = element.parentElement;
                          if (parent) {
                            const rect = parent.getBoundingClientRect();
                            const percentage = 1 - (info.point.y - rect.top) / rect.height;
                            setTemporalFocus(Math.min(1, Math.max(0, percentage)));
                          }
                        }}
                      />
                    </div>
                  </div>
                  <div className="text-white/50 text-xs rotate-90">Time</div>
                </div>
              </motion.div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Overlay information panel that appears when a node is selected */}
      <AnimatePresence>
        {selectedNode && cognitiveMode === 'focus' && (
          <motion.div
            className="absolute bottom-24 left-1/2 transform -translate-x-1/2 pointer-events-auto z-20"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.3 }}
          >
            <div className="bg-black/70 backdrop-blur-lg border border-white/10 rounded-lg p-6 w-[90vw] max-w-xl">
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-lg font-light text-white">Neural Resonance Point</h3>
                <button 
                  className="text-white/50 hover:text-white"
                  onClick={() => setSelectedNode(null)}
                >
                  <X size={16} />
                </button>
              </div>
              
              <p className="text-white/70 text-sm mb-4">
                This cognitive junction represents a point of synthesis between human and machine intelligence.
                The resonance pattern suggests a high degree of conceptual alignment.
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-white/5 rounded-md p-3">
                  <h4 className="text-white/50 text-xs uppercase mb-1">Human Context</h4>
                  <p className="text-white/90 text-sm">
                    Intuitive pattern recognition based on contextual understanding and emotional intelligence.
                  </p>
                </div>
                
                <div className="bg-[#7B00FF]/10 rounded-md p-3">
                  <h4 className="text-white/50 text-xs uppercase mb-1">Machine Processing</h4>
                  <p className="text-white/90 text-sm">
                    Algorithmic analysis of data streams with statistical pattern identification.
                  </p>
                </div>
              </div>
              
              <div className="mt-4 pt-4 border-t border-white/10">
                <div className="flex justify-between items-center">
                  <div className="text-xs text-white/50">Cognitive Resonance</div>
                  <div className="text-sm font-light text-white">87%</div>
                </div>
                <div className="w-full h-1 bg-white/10 rounded-full mt-1 overflow-hidden">
                  <motion.div 
                    className="h-full bg-gradient-to-r from-white to-[#7B00FF]"
                    initial={{ width: 0 }}
                    animate={{ width: '87%' }}
                    transition={{ duration: 1, ease: "easeOut" }}
                  />
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Passive indicator that appears when interface is hidden */}
      <AnimatePresence>
        {!showInterface && !showWelcomePulse && (
          <motion.div
            className="absolute bottom-6 right-6 pointer-events-auto z-30"
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.5 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            onClick={() => setShowInterface(true)}
          >
            <div className="text-xs text-white/30 tracking-wider">
              TAP TO REVEAL INTERFACE
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Welcome Pulse - initial interaction invitation */}
      <AnimatePresence>
        {showWelcomePulse && (
          <motion.div 
            className="absolute inset-0 flex items-center justify-center z-50 pointer-events-auto"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1 }}
            onClick={() => {
              setShowWelcomePulse(false);
              setShowInterface(true);
            }}
          >
            <motion.div
              className="relative flex flex-col items-center justify-center"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 1.5, ease: "easeOut" }}
            >
              {/* Pulsing circles */}
              <motion.div 
                className="absolute inset-0 rounded-full bg-[#7B00FF]/5"
                animate={{ 
                  scale: [1, 2.2, 1],
                  opacity: [0.1, 0.05, 0.1]
                }}
                transition={{ 
                  duration: 3, 
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              />
              <motion.div 
                className="absolute inset-0 rounded-full bg-[#7B00FF]/10"
                animate={{ 
                  scale: [1, 1.8, 1],
                  opacity: [0.2, 0.05, 0.2]
                }}
                transition={{ 
                  duration: 2.5, 
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              />
              
              {/* Central logo */}
              <motion.div 
                className="relative bg-black h-32 w-32 rounded-full flex items-center justify-center border border-white/10 z-10"
                animate={{ 
                  boxShadow: ["0 0 0px rgba(123, 0, 255, 0.2)", "0 0 30px rgba(123, 0, 255, 0.6)", "0 0 0px rgba(123, 0, 255, 0.2)"]
                }}
                transition={{ 
                  duration: 2, 
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              >
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.5, duration: 1 }}
                >
                  <Brain size={36} className="text-[#7B00FF]" />
                </motion.div>
              </motion.div>
              
              {/* Text appearance */}
              <motion.div 
                className="mt-6 text-center"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1, duration: 1 }}
              >
                <motion.h1 
                  className="text-white text-2xl font-light tracking-[0.5em] uppercase mb-3"
                  initial={{ letterSpacing: "0.2em" }}
                  animate={{ letterSpacing: "0.5em" }}
                  transition={{ duration: 2, ease: "easeOut", delay: 1.2 }}
                >
                  PassiveWorks
                </motion.h1>
                <p className="text-white/50 text-sm">
                  Touch anywhere to begin
                </p>
              </motion.div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Context-aware ephemeral controls that appear based on user intent */}
      <AnimatePresence>
        {showInterface && !showWelcomePulse && cognitiveMode === 'explore' && (
          <motion.div
            className="absolute bottom-24 right-6 pointer-events-auto z-30"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 0.7, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.3 }}
            whileHover={{ opacity: 1 }}
          >
            <div className="bg-black/40 backdrop-blur-md rounded-full p-3 flex flex-col items-center space-y-3 border border-white/5">
              <motion.button
                className="w-10 h-10 rounded-full bg-[#7B00FF]/10 flex items-center justify-center text-white/70 hover:text-white"
                whileHover={{ scale: 1.1, backgroundColor: "rgba(123, 0, 255, 0.2)" }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setTemporalDilation(prev => Math.min(prev + 0.5, 3))}
              >
                <Wand2 size={16} />
              </motion.button>
              <motion.button
                className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-white/70 hover:text-white"
                whileHover={{ scale: 1.1, backgroundColor: "rgba(255, 255, 255, 0.1)" }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setTemporalDilation(1)} // Reset to normal
              >
                <Eye size={16} />
              </motion.button>
              <motion.button
                className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-white/70 hover:text-white"
                whileHover={{ scale: 1.1, backgroundColor: "rgba(255, 255, 255, 0.1)" }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setCognitiveMode('focus')}
              >
                <Info size={16} />
              </motion.button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}