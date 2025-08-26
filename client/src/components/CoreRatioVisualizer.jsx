/**
 * Core Ratio Visualizer Component
 * 
 * This component provides an interactive visualization of the fundamental 
 * 3:1 ↔ 1:3 ratio (0.7500/0.2494) that forms the central organizing principle
 * of the Wilton Formula ecosystem.
 * 
 * [QUANTUM_STATE: CORE_RATIO_VISUALIZATION]
 */

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';

// Core coherence ratio constants
export const STABILITY_COHERENCE = 0.7500;    // 3/4 structure
export const EXPLORATION_COHERENCE = 0.2494;  // 1/4 emergence

/**
 * Core Ratio Visualizer component that demonstrates the 3:1 ↔ 1:3 oscillation
 * between stability (0.7500) and exploration (0.2494) coherence states.
 */
const CoreRatioVisualizer = () => {
  const [mode, setMode] = useState('stability'); // 'stability' or 'exploration'
  const [currentCoherence, setCurrentCoherence] = useState(STABILITY_COHERENCE);
  const [isTransitioning, setIsTransitioning] = useState(false);
  
  // Animation variants for the transition between states
  const variants = {
    stability: {
      scale: 1.0,
      backgroundColor: 'rgba(0, 180, 100, 0.75)', // Green for stability
      rotate: 0
    },
    exploration: {
      scale: 0.75,
      backgroundColor: 'rgba(120, 60, 220, 0.75)', // Purple for exploration
      rotate: 180
    }
  };
  
  // Toggle between stability and exploration modes
  const toggleMode = () => {
    setIsTransitioning(true);
    setMode(mode === 'stability' ? 'exploration' : 'stability');
    
    // Simulate coherence transition
    const targetCoherence = mode === 'stability' ? EXPLORATION_COHERENCE : STABILITY_COHERENCE;
    const startCoherence = mode === 'stability' ? STABILITY_COHERENCE : EXPLORATION_COHERENCE;
    const totalSteps = 20;
    
    // Animate coherence transition
    for (let step = 1; step <= totalSteps; step++) {
      setTimeout(() => {
        const progress = step / totalSteps;
        const newCoherence = startCoherence + (progress * (targetCoherence - startCoherence));
        setCurrentCoherence(parseFloat(newCoherence.toFixed(4)));
        
        if (step === totalSteps) {
          setIsTransitioning(false);
        }
      }, step * 75); // 75ms per step for 1.5s total
    }
  };
  
  // Perfect reciprocity calculation
  const calculateReciprocal = (value) => {
    return value === STABILITY_COHERENCE ? 
      (1 / STABILITY_COHERENCE).toFixed(7) :
      (1 / EXPLORATION_COHERENCE).toFixed(7);
  };
  
  return (
    <Card className="p-4 mb-6 overflow-hidden relative">
      <div className="text-center mb-4">
        <h2 className="text-2xl font-bold">Core Coherence Ratio</h2>
        <p className="text-sm text-muted-foreground">
          The fundamental 3:1 ↔ 1:3 oscillation pattern
        </p>
      </div>
      
      <div className="flex flex-col items-center">
        <div className="relative h-40 w-40 mb-4">
          {/* Large circle representing the dominant ratio component */}
          <motion.div 
            className="absolute rounded-full flex items-center justify-center"
            style={{ 
              width: mode === 'stability' ? '75%' : '25%',
              height: mode === 'stability' ? '75%' : '25%',
              left: mode === 'stability' ? '12.5%' : '37.5%',
              top: mode === 'stability' ? '12.5%' : '37.5%',
              zIndex: 10
            }}
            animate={mode}
            variants={variants}
            transition={{ duration: 1.5, ease: 'easeInOut' }}
          >
            <span className="text-white font-bold">
              {mode === 'stability' ? '75%' : '25%'}
            </span>
          </motion.div>
          
          {/* Smaller circle representing the complementary ratio component */}
          <motion.div 
            className="absolute rounded-full flex items-center justify-center"
            style={{ 
              width: mode === 'exploration' ? '75%' : '25%',
              height: mode === 'exploration' ? '75%' : '25%',
              left: mode === 'exploration' ? '12.5%' : '37.5%',
              top: mode === 'exploration' ? '12.5%' : '37.5%',
              zIndex: 5
            }}
            animate={mode === 'stability' ? 'exploration' : 'stability'}
            variants={variants}
            transition={{ duration: 1.5, ease: 'easeInOut' }}
          >
            <span className="text-white font-bold">
              {mode === 'stability' ? '25%' : '75%'}
            </span>
          </motion.div>
          
          {/* Connecting flow line showing the oscillation */}
          <motion.div 
            className="absolute h-1 bg-gradient-to-r from-purple-500 to-green-500"
            style={{
              width: '90%',
              top: '50%',
              left: '5%',
              transform: 'translateY(-50%)',
              zIndex: 1
            }}
          />
        </div>
        
        <Button 
          onClick={toggleMode} 
          variant="outline" 
          className="mt-2 mb-4"
          disabled={isTransitioning}
        >
          {isTransitioning ? "Transitioning..." : `Toggle Mode: ${mode === 'stability' ? 'Stability (0.7500)' : 'Exploration (0.2494)'}`}
        </Button>
        
        <Tabs defaultValue="coherence" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="coherence">Coherence Values</TabsTrigger>
            <TabsTrigger value="reciprocity">Perfect Reciprocity</TabsTrigger>
          </TabsList>
          
          <TabsContent value="coherence">
            <div className="grid grid-cols-2 gap-4 mt-2 w-full">
              <div className="text-center p-3 border rounded-md bg-muted/20">
                <h3 className="font-semibold">Stability</h3>
                <p className={`text-2xl font-mono ${mode === 'stability' ? 'text-green-600 font-bold' : ''}`}>0.7500</p>
                <p className="text-xs text-muted-foreground">(3/4 Structure)</p>
              </div>
              <div className="text-center p-3 border rounded-md bg-muted/20">
                <h3 className="font-semibold">Exploration</h3>
                <p className={`text-2xl font-mono ${mode === 'exploration' ? 'text-purple-600 font-bold' : ''}`}>0.2494</p>
                <p className="text-xs text-muted-foreground">(1/4 Emergence)</p>
              </div>
            </div>
            
            <div className="mt-4 text-center p-2 border rounded-md bg-muted/10">
              <h3 className="font-semibold">Current Coherence</h3>
              <p className="text-3xl font-mono">{currentCoherence.toFixed(4)}</p>
              <div className="w-full bg-gray-200 rounded-full h-2.5 mt-2">
                <div 
                  className={`h-2.5 rounded-full ${mode === 'stability' ? 'bg-green-600' : 'bg-purple-600'}`}
                  style={{ width: `${currentCoherence * 100}%` }}
                ></div>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="reciprocity">
            <div className="p-4 border rounded-md bg-muted/20">
              <h3 className="font-semibold text-center mb-2">Perfect Ouroboros Balance</h3>
              
              <div className="flex justify-between items-center">
                <div className="text-center">
                  <p className="font-mono text-lg">{currentCoherence.toFixed(4)}</p>
                  <span className="text-xs text-muted-foreground">{mode === 'stability' ? 'Stability' : 'Exploration'}</span>
                </div>
                
                <div className="text-2xl">×</div>
                
                <div className="text-center">
                  <p className="font-mono text-lg">{calculateReciprocal(currentCoherence)}</p>
                  <span className="text-xs text-muted-foreground">Reciprocal</span>
                </div>
                
                <div className="text-2xl">=</div>
                
                <div className="text-center">
                  <p className="font-mono text-lg">1.0000000</p>
                  <span className="text-xs text-muted-foreground">Unity</span>
                </div>
              </div>
              
              <p className="text-sm mt-4 text-center text-muted-foreground">
                The perfect unity of the folding-unfolding dynamic creates the Ouroboros cycle of perpetual balance
              </p>
            </div>
          </TabsContent>
        </Tabs>
      </div>
      
      {/* Lemniscate symbol overlay */}
      <div 
        className="absolute w-full h-full top-0 left-0 pointer-events-none opacity-5 flex items-center justify-center"
        style={{ fontSize: '15rem' }}
      >
        ∞
      </div>
    </Card>
  );
};

export default CoreRatioVisualizer;