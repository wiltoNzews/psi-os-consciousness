import React, { useState } from 'react';
import { SuperStableField } from '@/components/passiveworks/SuperStableField';
import { DomainSelector } from '@/components/passiveworks/DomainSelector';
import { useDomain } from '@/contexts/DomainContext';
import { PassiveWorksLayout } from '@/lib/PassiveWorksLayout';

/**
 * StableExperience - A super-stable version of PassiveWorks
 * 
 * This implementation eliminates all mouse-dependent animations,
 * using only controlled, slow animations that won't cause any
 * erratic behavior or visual disruptions
 */
export default function StableExperience() {
  const { activeDomain, setActiveDomain, domainConfig } = useDomain();
  
  // Define slow-changing interface elements
  const [activeSection, setActiveSection] = useState('overview');
  
  const handleDomainSelect = (domain: 'finance' | 'crypto' | 'sports' | 'general') => {
    setActiveDomain(domain);
  };
  
  return (
    <PassiveWorksLayout>
      <main className="relative min-h-screen bg-black text-white overflow-hidden">
        {/* Neural field background */}
        <div className="fixed inset-0 z-0">
          <SuperStableField 
            domain={activeDomain} 
            className="w-full h-full"
          />
        </div>
        
        {/* Overlay content */}
        <div className="relative z-10 p-8 min-h-screen flex flex-col">
          <div className="mt-12 mb-8 text-center">
            <h1 className="text-4xl md:text-6xl font-bold tracking-tighter mb-4">
              Passive<span style={{ color: domainConfig.color }}>Works</span>
            </h1>
            <p className="text-xl opacity-70 max-w-md mx-auto">
              A stable neural interface platform for enhanced human-AI symbiosis
            </p>
          </div>
          
          {/* Domain selector */}
          <div className="self-center mb-12">
            <DomainSelector 
              activeDomain={activeDomain}
              onDomainChange={handleDomainSelect}
            />
          </div>
          
          {/* Content area */}
          <div className="flex-1 max-w-4xl mx-auto w-full bg-black/30 backdrop-blur-sm border border-white/10 rounded-lg p-6">
            <div className="mb-6 flex space-x-4 border-b border-white/10 pb-4">
              <button 
                className={`px-4 py-2 rounded-md transition-colors ${activeSection === 'overview' ? 'bg-white/10' : 'hover:bg-white/5'}`}
                onClick={() => setActiveSection('overview')}
              >
                Overview
              </button>
              <button 
                className={`px-4 py-2 rounded-md transition-colors ${activeSection === 'insights' ? 'bg-white/10' : 'hover:bg-white/5'}`}
                onClick={() => setActiveSection('insights')}
              >
                Insights
              </button>
              <button 
                className={`px-4 py-2 rounded-md transition-colors ${activeSection === 'about' ? 'bg-white/10' : 'hover:bg-white/5'}`}
                onClick={() => setActiveSection('about')}
              >
                About
              </button>
            </div>
            
            {activeSection === 'overview' && (
              <div className="space-y-6">
                <h2 className="text-2xl font-bold" style={{ color: domainConfig.color }}>
                  Neural Interface Platform
                </h2>
                <p className="text-white/70 leading-relaxed">
                  PassiveWorks is a revolutionary platform that creates a symbiotic relationship 
                  between human intelligence and AI capabilities. Through careful calibration of 
                  neural patterns and cognitive synchronization, the system adapts to your 
                  thinking style and preferences.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
                  <div className="bg-white/5 rounded-lg p-6 border border-white/10">
                    <h3 className="text-xl mb-3 font-medium">Human Intelligence</h3>
                    <p className="text-white/60">
                      Contributes intuition, creativity, ethical judgement, and contextual 
                      understanding that complements computational processing.
                    </p>
                  </div>
                  <div className="bg-white/5 rounded-lg p-6 border border-white/10">
                    <h3 className="text-xl mb-3 font-medium">AI Processing</h3>
                    <p className="text-white/60">
                      Provides rapid calculation, pattern recognition across vast datasets,
                      and consistent analysis that enhances human decision-making.
                    </p>
                  </div>
                </div>
              </div>
            )}
            
            {activeSection === 'insights' && (
              <div className="space-y-6">
                <h2 className="text-2xl font-bold" style={{ color: domainConfig.color }}>
                  Domain Insights
                </h2>
                <p className="text-white/70 leading-relaxed">
                  The {domainConfig.name} domain focuses on specialized intelligence augmentation 
                  tailored to this field's unique requirements and challenges.
                </p>
                <div className="mt-6 space-y-4">
                  <div className="bg-white/5 rounded-lg p-6 border border-white/10">
                    <h3 className="text-xl mb-3 font-medium">Key Applications</h3>
                    <ul className="list-disc pl-5 text-white/60 space-y-2">
                      <li>Enhanced decision-making through neural pattern analysis</li>
                      <li>Cognitive load optimization via real-time adaptation</li>
                      <li>Cross-contextual understanding with multi-dimensional mapping</li>
                      <li>Temporal pattern recognition across distributed datasets</li>
                    </ul>
                  </div>
                  
                  <div className="bg-white/5 rounded-lg p-6 border border-white/10">
                    <h3 className="text-xl mb-3 font-medium">System Performance</h3>
                    <div className="space-y-4">
                      <div>
                        <div className="flex justify-between text-sm mb-1">
                          <span>Neural Synchronization</span>
                          <span>87%</span>
                        </div>
                        <div className="w-full bg-white/10 rounded-full h-2">
                          <div 
                            className="h-2 rounded-full" 
                            style={{ 
                              width: '87%', 
                              backgroundColor: domainConfig.color 
                            }}
                          ></div>
                        </div>
                      </div>
                      
                      <div>
                        <div className="flex justify-between text-sm mb-1">
                          <span>Adaptive Response</span>
                          <span>92%</span>
                        </div>
                        <div className="w-full bg-white/10 rounded-full h-2">
                          <div 
                            className="h-2 rounded-full" 
                            style={{ 
                              width: '92%', 
                              backgroundColor: domainConfig.color 
                            }}
                          ></div>
                        </div>
                      </div>
                      
                      <div>
                        <div className="flex justify-between text-sm mb-1">
                          <span>Conceptual Mapping</span>
                          <span>78%</span>
                        </div>
                        <div className="w-full bg-white/10 rounded-full h-2">
                          <div 
                            className="h-2 rounded-full" 
                            style={{ 
                              width: '78%', 
                              backgroundColor: domainConfig.color 
                            }}
                          ></div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
            
            {activeSection === 'about' && (
              <div className="space-y-6">
                <h2 className="text-2xl font-bold" style={{ color: domainConfig.color }}>
                  About PassiveWorks
                </h2>
                <p className="text-white/70 leading-relaxed">
                  PassiveWorks represents the next evolution in human-AI symbiosis, moving beyond
                  traditional interfaces to create a fluid, bidirectional relationship between
                  human cognition and computational intelligence.
                </p>
                <div className="mt-6">
                  <h3 className="text-xl mb-3 font-medium">The Symbiosis Formula</h3>
                  <div className="bg-white/5 rounded-lg p-6 border border-white/10 font-mono text-center">
                    α₁·A(π) + α₂·C(π) + α₃·M(π) + α₄·V(π) - α₅·R(π)
                  </div>
                  <div className="mt-4 space-y-2 text-sm text-white/60">
                    <p>A(π): Security & Alignment module</p>
                    <p>C(π): Chainlink Prompting system</p>
                    <p>M(π): Multi-Modal processing</p>
                    <p>V(π): Visionary Ethics guidelines</p>
                    <p>R(π): Runaway Growth limiters</p>
                  </div>
                </div>
                <div className="mt-8 pt-4 border-t border-white/10 text-center text-white/40 text-sm">
                  <p>PassiveWorks • Neural Interface Platform • Version 2.5.0</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
    </PassiveWorksLayout>
  );
}