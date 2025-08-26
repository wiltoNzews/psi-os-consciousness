import React, { useState } from 'react';
import { UltraSimpleField } from '@/components/passiveworks/UltraSimpleField';
import { DomainSelector } from '@/components/passiveworks/DomainSelector';
import { useDomain } from '@/contexts/DomainContext';

/**
 * UltraSimple - An extremely simplified version of PassiveWorks
 * 
 * This implementation has:
 * - No API calls at all
 * - No animation dependencies
 * - No complex rendering
 * - No mouse interactions
 * - Purely static content
 */
export default function UltraSimple() {
  const { activeDomain, setActiveDomain, domainConfig } = useDomain();
  const [activeTab, setActiveTab] = useState('overview');
  
  const handleDomainSelect = (domain: 'finance' | 'crypto' | 'sports' | 'general') => {
    setActiveDomain(domain);
  };
  
  return (
    <div className="relative min-h-screen bg-black text-white overflow-hidden">
      {/* Neural field background - completely static */}
      <div className="fixed inset-0 z-0">
        <UltraSimpleField 
          domain={activeDomain} 
          className="w-full h-full"
        />
      </div>
      
      {/* Content overlay */}
      <div className="relative z-10 p-6 min-h-screen flex flex-col">
        <div className="mt-12 mb-8 text-center">
          <h1 className="text-4xl md:text-6xl font-bold tracking-tighter mb-4">
            Passive<span style={{ color: domainConfig.color }}>Works</span>
          </h1>
          <p className="text-xl opacity-70 max-w-md mx-auto">
            Ultra-simplified Neural Interface
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
              className={`px-4 py-2 rounded-md transition-colors ${activeTab === 'overview' ? 'bg-white/10' : 'hover:bg-white/5'}`}
              onClick={() => setActiveTab('overview')}
            >
              Overview
            </button>
            <button 
              className={`px-4 py-2 rounded-md transition-colors ${activeTab === 'insights' ? 'bg-white/10' : 'hover:bg-white/5'}`}
              onClick={() => setActiveTab('insights')}
            >
              Insights
            </button>
            <button 
              className={`px-4 py-2 rounded-md transition-colors ${activeTab === 'about' ? 'bg-white/10' : 'hover:bg-white/5'}`}
              onClick={() => setActiveTab('about')}
            >
              About
            </button>
          </div>
          
          {activeTab === 'overview' && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold" style={{ color: domainConfig.color }}>
                Neural Interface Platform
              </h2>
              <p className="text-white/70 leading-relaxed">
                Welcome to the ultra-simplified version of PassiveWorks - a revolutionary platform
                designed for stable, reliable interaction. This version eliminates all complex
                animations and interactions for maximum performance and stability.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
                <div className="bg-white/5 rounded-lg p-6 border border-white/10">
                  <h3 className="text-xl mb-3 font-medium">Human Intelligence</h3>
                  <p className="text-white/60">
                    Intuition, creativity, ethics, and contextual understanding
                    complement computational processing.
                  </p>
                </div>
                <div className="bg-white/5 rounded-lg p-6 border border-white/10">
                  <h3 className="text-xl mb-3 font-medium">AI Processing</h3>
                  <p className="text-white/60">
                    Rapid calculation, pattern recognition, and consistent analysis
                    enhance human decision-making abilities.
                  </p>
                </div>
              </div>
            </div>
          )}
          
          {activeTab === 'insights' && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold" style={{ color: domainConfig.color }}>
                {domainConfig.name} Domain Insights
              </h2>
              <p className="text-white/70 leading-relaxed">
                This domain focuses on specialized intelligence augmentation 
                tailored to unique requirements and challenges. The insights below
                represent static examples rather than real-time AI analysis.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
                <div className="bg-white/5 rounded-lg p-6 border border-white/10">
                  <h3 className="text-xl mb-3 font-medium">Pattern Recognition</h3>
                  <p className="text-white/60">
                    Advanced pattern recognition capabilities identify emerging trends
                    and connections across disparate data sources.
                  </p>
                </div>
                <div className="bg-white/5 rounded-lg p-6 border border-white/10">
                  <h3 className="text-xl mb-3 font-medium">Cognitive Enhancement</h3>
                  <p className="text-white/60">
                    Augmented decision-making through collaborative intelligence
                    between human intuition and machine analysis.
                  </p>
                </div>
              </div>
            </div>
          )}
          
          {activeTab === 'about' && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold" style={{ color: domainConfig.color }}>
                About This Version
              </h2>
              <p className="text-white/70 leading-relaxed">
                This ultra-simplified version was created to provide a stable, 
                reliable experience without any of the complex animations or 
                real-time data processing of the full PassiveWorks platform.
              </p>
              <div className="bg-white/5 rounded-lg p-6 border border-white/10 mt-4">
                <h3 className="text-xl mb-3 font-medium">Technical Details</h3>
                <ul className="list-disc pl-5 text-white/60 space-y-2">
                  <li>Static SVG visualization with no movement or animation</li>
                  <li>No API calls or background processing</li>
                  <li>Simplified component architecture</li>
                  <li>Minimal state management</li>
                  <li>No mouse movement tracking or interaction effects</li>
                </ul>
              </div>
              <div className="mt-6 text-center text-white/40 text-sm">
                <p>PassiveWorks • Ultra-Simple Version • v1.0.0</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}