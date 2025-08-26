import React, { useState } from 'react';

/**
 * EmergencyApp - A completely self-contained application with NO external dependencies
 * 
 * This component is a last resort to fix the issues. It:
 * - Contains all necessary code inside this single file
 * - Has no imports from other files in the project
 * - Uses only built-in React features
 * - Avoids any code that might trigger API calls
 */
export default function EmergencyApp() {
  // Simple state for domain and tab
  const [domain, setDomain] = useState<'general' | 'finance' | 'crypto' | 'sports'>('general');
  const [activeTab, setActiveTab] = useState('overview');
  
  // Hardcoded domain configs to avoid importing from context
  const domainConfigs = {
    general: {
      name: 'General',
      color: '#6366f1',
      accentColor: '#818cf8'
    },
    finance: {
      name: 'Finance',
      color: '#10b981',
      accentColor: '#34d399'
    },
    crypto: {
      name: 'Crypto',
      color: '#f59e0b',
      accentColor: '#fbbf24'
    },
    sports: {
      name: 'Sports',
      color: '#ef4444',
      accentColor: '#f87171'
    }
  };
  
  const currentConfig = domainConfigs[domain];
  
  // Static nodes and connections for visualization
  const nodes = [
    { id: '1', label: 'Human Intelligence', x: 20, y: 30, type: 'human' },
    { id: '2', label: 'AI Processing', x: 80, y: 30, type: 'ai' },
    { id: '3', label: 'Data Analysis', x: 50, y: 70, type: 'data' },
    { id: '4', label: 'Neural Network', x: 20, y: 70, type: 'ai' },
    { id: '5', label: 'Pattern Recognition', x: 80, y: 70, type: 'human' }
  ];
  
  const connections = [
    { source: '1', target: '2' },
    { source: '1', target: '3' },
    { source: '2', target: '3' },
    { source: '2', target: '5' },
    { source: '3', target: '4' },
    { source: '4', target: '5' }
  ];
  
  // Helper function for node colors
  const getNodeColor = (type: string) => {
    switch (type) {
      case 'human': return '#ffffff';
      case 'ai': return currentConfig.accentColor;
      case 'data': return '#4477FF';
      default: return '#ffffff';
    }
  };
  
  return (
    <div className="min-h-screen bg-black text-white overflow-hidden">
      {/* VISUALIZATION */}
      <div className="fixed inset-0 z-0">
        <div 
          className="absolute inset-0 bg-black" 
          style={{
            backgroundImage: 'linear-gradient(rgba(255, 255, 255, 0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(255, 255, 255, 0.05) 1px, transparent 1px)',
            backgroundSize: '50px 50px'
          }}
        ></div>
        
        <svg width="100%" height="100%" className="absolute inset-0">
          {/* Connections */}
          {connections.map((connection, index) => {
            const source = nodes.find(node => node.id === connection.source);
            const target = nodes.find(node => node.id === connection.target);
            
            if (!source || !target) return null;
            
            const x1 = `${source.x}%`;
            const y1 = `${source.y}%`;
            const x2 = `${target.x}%`;
            const y2 = `${target.y}%`;
            
            return (
              <line
                key={`conn-${index}`}
                x1={x1}
                y1={y1}
                x2={x2}
                y2={y2}
                stroke="rgba(255, 255, 255, 0.3)"
                strokeWidth="1"
              />
            );
          })}
          
          {/* Nodes */}
          {nodes.map(node => {
            const nodeSize = node.type === 'data' ? 5 : 7;
            
            return (
              <g key={node.id} transform={`translate(${node.x}%, ${node.y}%)`}>
                <circle
                  r={nodeSize}
                  fill={getNodeColor(node.type)}
                  fillOpacity="0.8"
                />
                
                <text
                  x="0"
                  y={nodeSize + 10}
                  textAnchor="middle"
                  fill="white"
                  fontSize="10px"
                  opacity="0.8"
                >
                  {node.label}
                </text>
              </g>
            );
          })}
        </svg>
      </div>
      
      {/* CONTENT */}
      <div className="relative z-10 p-6 min-h-screen flex flex-col">
        <div className="mt-12 mb-8 text-center">
          <h1 className="text-4xl md:text-6xl font-bold tracking-tighter mb-4">
            Passive<span style={{ color: currentConfig.color }}>Works</span>
          </h1>
          <p className="text-xl opacity-70 max-w-md mx-auto">
            Emergency Mode
          </p>
        </div>
        
        {/* Domain selector */}
        <div className="self-center mb-12 flex space-x-2">
          <button
            onClick={() => setDomain('general')}
            className={`px-4 py-2 rounded-md ${domain === 'general' ? 'bg-white/20' : 'bg-white/5'}`}
          >
            General
          </button>
          <button
            onClick={() => setDomain('finance')}
            className={`px-4 py-2 rounded-md ${domain === 'finance' ? 'bg-white/20' : 'bg-white/5'}`}
          >
            Finance
          </button>
          <button
            onClick={() => setDomain('crypto')}
            className={`px-4 py-2 rounded-md ${domain === 'crypto' ? 'bg-white/20' : 'bg-white/5'}`}
          >
            Crypto
          </button>
          <button
            onClick={() => setDomain('sports')}
            className={`px-4 py-2 rounded-md ${domain === 'sports' ? 'bg-white/20' : 'bg-white/5'}`}
          >
            Sports
          </button>
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
              <h2 className="text-2xl font-bold" style={{ color: currentConfig.color }}>
                Neural Interface Platform
              </h2>
              <p className="text-white/70 leading-relaxed">
                Welcome to PassiveWorks Emergency Mode - an ultra-simplified version
                with absolutely no external dependencies or API calls.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
                <div className="bg-white/5 rounded-lg p-6 border border-white/10">
                  <h3 className="text-xl mb-3 font-medium">Human Intelligence</h3>
                  <p className="text-white/60">
                    Intuition, creativity, ethics, and contextual understanding
                    that complement computational processing.
                  </p>
                </div>
                <div className="bg-white/5 rounded-lg p-6 border border-white/10">
                  <h3 className="text-xl mb-3 font-medium">AI Processing</h3>
                  <p className="text-white/60">
                    Rapid calculation, pattern recognition, and consistent analysis
                    that enhance human decision-making abilities.
                  </p>
                </div>
              </div>
            </div>
          )}
          
          {activeTab === 'insights' && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold" style={{ color: currentConfig.color }}>
                {currentConfig.name} Domain Insights
              </h2>
              <p className="text-white/70 leading-relaxed">
                This domain focuses on specialized intelligence augmentation 
                tailored to unique requirements and challenges.
              </p>
              <div className="bg-white/5 rounded-lg p-6 border border-white/10 mt-4">
                <h3 className="text-xl mb-3 font-medium">Key Applications</h3>
                <ul className="list-disc pl-5 text-white/60 space-y-2">
                  <li>Enhanced decision-making through pattern analysis</li>
                  <li>Cognitive load optimization via real-time adaptation</li>
                  <li>Cross-contextual understanding with multi-dimensional mapping</li>
                  <li>Temporal pattern recognition across distributed datasets</li>
                </ul>
              </div>
            </div>
          )}
          
          {activeTab === 'about' && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold" style={{ color: currentConfig.color }}>
                About Emergency Mode
              </h2>
              <p className="text-white/70 leading-relaxed">
                This emergency mode was created to provide absolute stability by removing
                all external dependencies and API calls that were causing issues.
              </p>
              <div className="bg-white/5 rounded-lg p-6 border border-white/10 mt-4">
                <h3 className="text-xl mb-3 font-medium">Technical Details</h3>
                <ul className="list-disc pl-5 text-white/60 space-y-2">
                  <li>Completely self-contained in a single file</li>
                  <li>No external hooks, contexts, or services</li>
                  <li>Static SVG visualization with no animation</li>
                  <li>Zero API calls - everything is hardcoded</li>
                  <li>Minimal state management with useState only</li>
                </ul>
              </div>
              <div className="mt-8 text-center">
                <div className="inline-flex items-center px-4 py-2 rounded-md bg-green-900/20 border border-green-500/30">
                  <span className="mr-2 h-2 w-2 rounded-full bg-green-500"></span>
                  <span>Emergency Stability Mode Active</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}