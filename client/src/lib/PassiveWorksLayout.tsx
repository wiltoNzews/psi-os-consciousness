import React from 'react';
import { motion } from 'framer-motion';
import { NeuralSymbiosis } from '@/components/passiveworks';
import { DomainProvider, useDomain } from '@/contexts/DomainContext';

interface PassiveWorksLayoutProps {
  children: React.ReactNode;
}

/**
 * PassiveWorksLayout - The primary layout component for the PassiveWorks platform
 * Features a full-screen NeuralField in the background that provides both
 * visual context and interactive capabilities
 */
export function PassiveWorksLayoutInner({ children }: PassiveWorksLayoutProps) {
  const { activeDomain } = useDomain();
  const [selectedNode, setSelectedNode] = React.useState<string | null>(null);
  
  return (
    <div className="min-h-screen bg-black text-white flex flex-col">
      {/* Background Neural Field */}
      <div className="fixed inset-0 z-0">
        <NeuralSymbiosis 
          domain={activeDomain}
          highlightedNode={selectedNode}
          onNodeSelect={setSelectedNode}
        />
      </div>
      
      {/* Content layer */}
      <motion.div 
        className="relative z-10 flex-1 flex flex-col"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.3 }}
      >
        {children}
      </motion.div>
      
      {/* Ultraviolet glow effects in the corners */}
      <div className="fixed top-0 left-0 w-[30vw] h-[30vh] bg-[#7B00FF] opacity-[0.03] blur-[120px] rounded-full z-0" />
      <div className="fixed bottom-0 right-0 w-[30vw] h-[30vh] bg-[#7B00FF] opacity-[0.02] blur-[150px] rounded-full z-0" />
      
      {/* Subtle gradient line at the bottom */}
      <div className="fixed bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#7B00FF]/30 to-transparent z-10" />
    </div>
  );
}

export function PassiveWorksLayout({ children }: PassiveWorksLayoutProps) {
  return (
    <DomainProvider initialDomain="general">
      <PassiveWorksLayoutInner>
        {children}
      </PassiveWorksLayoutInner>
    </DomainProvider>
  );
}