/**
 * PassiveWorks Next - The redesigned neural interface platform
 * 
 * This implementation follows the comprehensive redesign to create a more
 * stable, performant, and visually cohesive experience while maintaining
 * the innovative aspects of human-AI symbiosis.
 * 
 * Features:
 * - Offloaded neural processing via Web Workers
 * - Hardware-accelerated WebGL visualization
 * - Implementation of the AI-Human Symbiosis Formula
 * - Three-layer visual hierarchy (Ambient, Interaction, Insight)
 */

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { NeuralInterface } from '@/components/NeuralInterface';
import { useDomain, DomainType } from '@/contexts/DomainContext';
import { Brain, Cpu, Globe, Zap, Activity, Info, AlertTriangle, CheckCircle } from 'lucide-react';

export default function PassiveWorksNext() {
  const { domainConfig, activeDomain, setActiveDomain } = useDomain();
  const [isInitializing, setIsInitializing] = useState(true);
  const [systemStatus, setSystemStatus] = useState<'initializing' | 'ready' | 'learning' | 'error'>('initializing');
  const [showIntroduction, setShowIntroduction] = useState(true);
  
  // Initialize the platform
  useEffect(() => {
    // Simulated initialization sequence
    const initSequence = async () => {
      // Step 1: System check (500ms)
      await new Promise(resolve => setTimeout(resolve, 500));
      setSystemStatus('learning');
      
      // Step 2: Neural calibration (2s)
      await new Promise(resolve => setTimeout(resolve, 2000));
      setSystemStatus('ready');
      
      // Step 3: Complete initialization
      await new Promise(resolve => setTimeout(resolve, 500));
      setIsInitializing(false);
    };
    
    initSequence();
    
    // Hide introduction after 7 seconds
    const hideIntroTimeout = setTimeout(() => {
      setShowIntroduction(false);
    }, 7000);
    
    return () => clearTimeout(hideIntroTimeout);
  }, []);
  
  // Handle domain selection
  const handleDomainSelect = (domain: DomainType) => {
    setActiveDomain(domain);
  };

  return (
    <div className="h-screen w-full bg-black overflow-hidden relative">
      {/* Main Neural Interface - always present */}
      <div className="absolute inset-0 z-0">
        <NeuralInterface />
      </div>
      
      {/* Domain Selector - Shown when system is ready */}
      {!isInitializing && (
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-40 pointer-events-auto">
          <motion.div 
            className="flex items-center space-x-4 md:space-x-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            {[
              { id: 'finance', icon: <Activity className="h-4 w-4" />, label: 'Finance' },
              { id: 'crypto', icon: <Cpu className="h-4 w-4" />, label: 'Crypto' },
              { id: 'sports', icon: <Zap className="h-4 w-4" />, label: 'Sports' },
              { id: 'general', icon: <Brain className="h-4 w-4" />, label: 'General' }
            ].map((domain) => (
              <motion.button
                key={domain.id}
                className={`flex items-center justify-center space-x-2 px-4 py-2 rounded-full 
                          backdrop-blur-sm ${
                  activeDomain === domain.id 
                    ? `bg-black/40 border border-${domainConfig.color}/20 text-white` 
                    : 'bg-black/20 border border-white/5 text-white/50 hover:text-white/80'
                } transition-all duration-300`}
                onClick={() => handleDomainSelect(domain.id as DomainType)}
                whileHover={{ 
                  backgroundColor: 'rgba(0, 0, 0, 0.4)',
                  transition: { duration: 0.2 }
                }}
                whileTap={{ scale: 0.95 }}
              >
                <div className={`${
                  activeDomain === domain.id 
                    ? `text-${domainConfig.color}` 
                    : 'text-white/50'
                }`}>
                  {domain.icon}
                </div>
                <span className="text-xs uppercase tracking-wider">{domain.label}</span>
              </motion.button>
            ))}
          </motion.div>
        </div>
      )}
      
      {/* Header - Appears to float in space */}
      {!isInitializing && (
        <motion.div 
          className="absolute top-6 left-1/2 transform -translate-x-1/2 z-40 pointer-events-auto"
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
        >
          <div className="flex items-center justify-center">
            <motion.h1 
              className="text-white text-lg md:text-2xl font-light tracking-[0.3em] uppercase"
              initial={{ letterSpacing: "0.2em" }}
              animate={{ letterSpacing: "0.3em" }}
              transition={{ duration: 1.5, ease: "easeOut" }}
            >
              PassiveWorks
            </motion.h1>
          </div>
        </motion.div>
      )}
      
      {/* System Status Indicator */}
      {!isInitializing && (
        <motion.div 
          className="absolute top-6 right-6 z-40 pointer-events-auto"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3, duration: 0.5 }}
        >
          <div className="flex items-center space-x-2 bg-black/30 backdrop-blur-sm rounded-full px-3 py-1.5 border border-white/10">
            <div 
              className={`h-2 w-2 rounded-full ${
                systemStatus === 'ready' ? 'bg-green-400' :
                systemStatus === 'learning' ? 'bg-blue-400' :
                systemStatus === 'error' ? 'bg-red-400' : 'bg-yellow-400'
              }`} 
            />
            <span className="text-white/80 text-xs capitalize">
              {systemStatus}
            </span>
          </div>
        </motion.div>
      )}
      
      {/* Introduction Overlay - Shown on initial load */}
      <AnimatePresence>
        {showIntroduction && (
          <motion.div
            className="absolute inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1 }}
          >
            <motion.div
              className="max-w-lg w-full mx-4 bg-black/60 border border-white/10 rounded-lg p-6 text-white"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -20, opacity: 0 }}
              transition={{ duration: 0.5 }}
            >
              <div className="flex items-center mb-4">
                <motion.div
                  animate={{ 
                    opacity: [0.5, 1, 0.5],
                    scale: [1, 1.1, 1],
                  }}
                  transition={{ 
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeInOut" 
                  }}
                >
                  <Brain className="h-8 w-8 text-white mr-3" />
                </motion.div>
                <h2 className="text-xl font-medium">Neural Interface Initialization</h2>
              </div>
              
              <div className="mb-6 text-white/80">
                <p>
                  Welcome to PassiveWorks, a revolutionary neural interface platform that adapts
                  to your cognitive patterns and creates a symbiotic relationship between human
                  thought and AI processing.
                </p>
              </div>
              
              <div className="space-y-4 mb-6">
                <div className="flex items-center">
                  {systemStatus === 'initializing' ? (
                    <div className="h-5 w-5 mr-3 rounded-full border-2 border-white/20 border-t-white/80 animate-spin" />
                  ) : (
                    <CheckCircle className="h-5 w-5 mr-3 text-green-400" />
                  )}
                  <div className="text-white/80">System Initialization</div>
                </div>
                
                <div className="flex items-center">
                  {systemStatus === 'initializing' || systemStatus === 'learning' ? (
                    <div className="h-5 w-5 mr-3 rounded-full border-2 border-white/20 border-t-white/80 animate-spin" />
                  ) : (
                    <CheckCircle className="h-5 w-5 mr-3 text-green-400" />
                  )}
                  <div className="text-white/80">Neural Calibration</div>
                </div>
                
                <div className="flex items-center">
                  {systemStatus !== 'ready' ? (
                    <div className="h-5 w-5 mr-3 opacity-30" />
                  ) : (
                    <CheckCircle className="h-5 w-5 mr-3 text-green-400" />
                  )}
                  <div className={systemStatus === 'ready' ? 'text-white/80' : 'text-white/40'}>
                    Interface Activation
                  </div>
                </div>
              </div>
              
              <div className="flex justify-between items-center">
                <div className="text-xs text-white/50">
                  {systemStatus === 'ready' ? (
                    'Interface ready - entering symbiosis mode'
                  ) : (
                    'Please wait while the system initializes...'
                  )}
                </div>
                
                {systemStatus === 'ready' && (
                  <motion.button
                    className="px-4 py-1.5 bg-white/10 hover:bg-white/20 rounded-md text-sm text-white"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setShowIntroduction(false)}
                  >
                    Enter Interface
                  </motion.button>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Loading Overlay - Shown while initializing */}
      <AnimatePresence>
        {isInitializing && !showIntroduction && (
          <motion.div
            className="absolute inset-0 z-40 bg-black/80 flex items-center justify-center"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
          >
            <motion.div
              className="flex flex-col items-center"
              animate={{ 
                opacity: [0.7, 1, 0.7],
              }}
              transition={{ 
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut" 
              }}
            >
              <Brain className="h-12 w-12 text-white mb-4" />
              <div className="text-white/80 text-lg">Initializing Neural Interface</div>
              <div className="mt-4 h-0.5 w-32 bg-white/10 overflow-hidden rounded-full">
                <motion.div 
                  className="h-full bg-white/80"
                  animate={{ x: [-120, 120] }}
                  transition={{ 
                    repeat: Infinity, 
                    duration: 1.5,
                    ease: "easeInOut" 
                  }}
                  style={{ width: 30 }}
                />
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Error Indicator - Only shown if there's a system error */}
      <AnimatePresence>
        {systemStatus === 'error' && (
          <motion.div
            className="absolute bottom-24 left-1/2 transform -translate-x-1/2 z-50"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.3 }}
          >
            <div className="bg-red-500/20 backdrop-blur-sm border border-red-500/30 rounded-lg 
                         px-4 py-3 flex items-center text-white max-w-md">
              <AlertTriangle className="h-5 w-5 mr-3 text-red-400" />
              <div>
                <div className="font-medium">System Error</div>
                <div className="text-sm text-white/80">
                  Neural processing service is currently unavailable. The system will automatically attempt to reconnect.
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Information Button */}
      {!isInitializing && (
        <motion.button
          className="absolute bottom-6 right-6 z-40 p-3 rounded-full bg-black/30 backdrop-blur-sm 
                     border border-white/10 text-white/80 hover:text-white hover:bg-black/40 transition-colors"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.4, duration: 0.3 }}
          onClick={() => setShowIntroduction(true)}
          aria-label="Show information"
        >
          <Info className="h-5 w-5" />
        </motion.button>
      )}
    </div>
  );
}