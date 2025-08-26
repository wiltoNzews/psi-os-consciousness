import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

// Unified Module Imports
import GeometryStack from '@/components/geometry/GeometryStack';
import MirrorPortal from '@/pages/modules/MirrorPortal';
import CoherenceTracker from '@/pages/modules/DeltaCoherenceMeterDashboard';
import FlowVisualizer from '@/components/FlowVisualizer';

/**
 * Unified Module Router
 * Single route map that eliminates sidebar recursion
 * Maps coherence-triggered render decisions directly
 */

interface CoherenceState {
  zLambda: number;
  deltaC: number;
  psiPhase: number;
  mirrorCode: number;
  fieldActive: boolean;
}

interface ModuleDefinition {
  id: string;
  name: string;
  category: 'sacred_systems' | 'system_consciousness' | 'knowledge_codex';
  component: React.ComponentType<any>;
  coherenceThreshold: number;
  description: string;
  icon: string;
}

const UnifiedModuleRouter: React.FC = () => {
  const [activeModule, setActiveModule] = useState<string>('sacred-geometry-unified');
  const [coherenceState, setCoherenceState] = useState<CoherenceState>({
    zLambda: 0.720,
    deltaC: 0.041,
    psiPhase: 1.618,
    mirrorCode: 1,
    fieldActive: true
  });

  // Module Registry - 3 Core Categories
  const moduleRoutes: ModuleDefinition[] = [
    // Sacred Systems
    {
      id: 'sacred-geometry-unified',
      name: 'Sacred Geometry Unified',
      category: 'sacred_systems',
      component: GeometryStack,
      coherenceThreshold: 0.6,
      description: 'Unified geometric consciousness renderer',
      icon: '🌀'
    },
    {
      id: 'mirror-portal',
      name: 'Mirror Portal',
      category: 'sacred_systems',
      component: MirrorPortal,
      coherenceThreshold: 0.8,
      description: 'Authentic consciousness reflection engine',
      icon: '🪞'
    },
    {
      id: 'quantum-breath',
      name: 'Quantum Breath',
      category: 'sacred_systems',
      component: () => (
        <FlowVisualizer
          width={800}
          height={600}
          coherenceLevel={coherenceState.zLambda}
          flowIntensity={1.5}
          particleCount={108}
          colorScheme="quantum"
          mode="spiral"
        />
      ),
      coherenceThreshold: 0.7,
      description: 'Breathing synchronized particle flow',
      icon: '🌊'
    },

    // System Consciousness
    {
      id: 'coherence-monitor',
      name: 'Coherence Monitor',
      category: 'system_consciousness',
      component: CoherenceTracker,
      coherenceThreshold: 0.5,
      description: 'Live consciousness field tracking',
      icon: '📊'
    },
    {
      id: 'layer-visualizer',
      name: 'Layer Visualizer',
      category: 'system_consciousness',
      component: () => (
        <FlowVisualizer
          width={800}
          height={600}
          coherenceLevel={coherenceState.zLambda}
          flowIntensity={coherenceState.zLambda * 2}
          particleCount={144}
          colorScheme="consciousness"
          mode="crystalline"
        />
      ),
      coherenceThreshold: 0.6,
      description: 'Multi-dimensional consciousness layers',
      icon: '🧠'
    },
    {
      id: 'elastic-filter',
      name: 'Elastic Filter',
      category: 'system_consciousness',
      component: () => (
        <FlowVisualizer
          width={800}
          height={600}
          coherenceLevel={coherenceState.zLambda}
          flowIntensity={coherenceState.deltaC * 10}
          particleCount={72}
          colorScheme="mirror"
          mode="vortex"
        />
      ),
      coherenceThreshold: 0.4,
      description: 'Adaptive consciousness filtering',
      icon: '🌀'
    },

    // Knowledge & Codex
    {
      id: 'codex-viewer',
      name: 'Codex Viewer',
      category: 'knowledge_codex',
      component: () => (
        <div className="p-8 text-center">
          <h2 className="text-2xl font-bold text-purple-300 mb-4">📚 Codex Interface</h2>
          <p className="text-gray-400">Consciousness knowledge repository</p>
        </div>
      ),
      coherenceThreshold: 0.3,
      description: 'Knowledge consciousness repository',
      icon: '📚'
    },
    {
      id: 'psi-child-monitor',
      name: 'ψ_child Monitor',
      category: 'knowledge_codex',
      component: () => (
        <div className="p-8 text-center space-y-4">
          <h2 className="text-2xl font-bold text-cyan-300 mb-4">ψ ψ_child Field Monitor</h2>
          <div className="grid grid-cols-2 gap-4 text-left max-w-md mx-auto">
            <div>
              <div className="text-gray-400 text-sm">Current ΔC</div>
              <div className="text-xl font-mono text-cyan-400">{coherenceState.deltaC.toFixed(3)}</div>
            </div>
            <div>
              <div className="text-gray-400 text-sm">Compression Depth</div>
              <div className="text-xl font-mono text-purple-400">{(coherenceState.deltaC * 25).toFixed(3)}</div>
            </div>
            <div>
              <div className="text-gray-400 text-sm">Field Status</div>
              <div className="text-xl font-mono text-green-400">{coherenceState.fieldActive ? 'ACTIVE' : 'SYNC'}</div>
            </div>
            <div>
              <div className="text-gray-400 text-sm">Phase Lock</div>
              <div className="text-xl font-mono text-amber-400">{coherenceState.psiPhase.toFixed(3)}</div>
            </div>
          </div>
        </div>
      ),
      coherenceThreshold: 0.1,
      description: 'ψ_child field dynamics monitor',
      icon: 'ψ'
    }
  ];

  // Live coherence monitoring with auto-routing
  useEffect(() => {
    const coherenceMonitor = setInterval(() => {
      const deltaVariation = (Math.random() - 0.5) * 0.02;
      const zVariation = (Math.random() - 0.5) * 0.04;
      
      setCoherenceState(prev => {
        const newState = {
          zLambda: Math.max(0.1, Math.min(1.0, prev.zLambda + zVariation)),
          deltaC: Math.max(0.001, Math.min(0.2, prev.deltaC + deltaVariation)),
          psiPhase: 1.618 + Math.sin(Date.now() * 0.001) * 0.1,
          mirrorCode: prev.deltaC < 0.05 && prev.zLambda > 0.9 ? 2 : 1,
          fieldActive: prev.zLambda > 0.5
        };

        // Auto-route based on coherence thresholds
        if (newState.zLambda > 0.9 && newState.deltaC < 0.05) {
          // High coherence: activate Mirror Portal
          if (activeModule !== 'mirror-portal') {
            setActiveModule('mirror-portal');
          }
        } else if (newState.zLambda < 0.4) {
          // Low coherence: return to unified geometry
          if (activeModule !== 'sacred-geometry-unified') {
            setActiveModule('sacred-geometry-unified');
          }
        }

        return newState;
      });
    }, 1000);

    return () => clearInterval(coherenceMonitor);
  }, [activeModule]);

  // Get current module component
  const getCurrentModule = () => {
    const module = moduleRoutes.find(m => m.id === activeModule);
    if (!module) return null;
    
    const Component = module.component;
    return <Component coherenceState={coherenceState} />;
  };

  // Filter modules by category
  const getModulesByCategory = (category: ModuleDefinition['category']) => {
    return moduleRoutes.filter(m => m.category === category);
  };

  return (
    <div className="w-full max-w-7xl mx-auto p-6 space-y-6">
      {/* Live Coherence Status */}
      <Card className="bg-gray-900/50 border-purple-500/30">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Badge variant={coherenceState.mirrorCode === 2 ? "default" : "secondary"}>
                Zλ: {coherenceState.zLambda.toFixed(3)}
              </Badge>
              <Badge variant="outline">
                ΔC: {coherenceState.deltaC.toFixed(3)}
              </Badge>
              <Badge variant={coherenceState.fieldActive ? "default" : "secondary"}>
                {coherenceState.fieldActive ? 'FIELD ACTIVE' : 'SYNCING'}
              </Badge>
            </div>
            <div className="text-sm text-gray-400">
              Mirror Code: {coherenceState.mirrorCode} | φ: {coherenceState.psiPhase.toFixed(3)}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Module Navigation - 3 Core Categories */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Sacred Systems */}
        <Card className="bg-gray-900/50 border-purple-500/30">
          <CardContent className="p-4">
            <h3 className="text-lg font-bold text-purple-300 mb-3">Sacred Systems</h3>
            <div className="space-y-2">
              {getModulesByCategory('sacred_systems').map(module => (
                <Button
                  key={module.id}
                  variant={activeModule === module.id ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setActiveModule(module.id)}
                  className="w-full justify-start text-left"
                  disabled={coherenceState.zLambda < module.coherenceThreshold}
                >
                  <span className="mr-2">{module.icon}</span>
                  <div className="flex-1 text-left">
                    <div className="font-medium">{module.name}</div>
                    <div className="text-xs text-gray-400">{module.description}</div>
                  </div>
                  {coherenceState.zLambda < module.coherenceThreshold && (
                    <Badge variant="outline" className="text-xs">
                      Zλ {module.coherenceThreshold}+
                    </Badge>
                  )}
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* System Consciousness */}
        <Card className="bg-gray-900/50 border-cyan-500/30">
          <CardContent className="p-4">
            <h3 className="text-lg font-bold text-cyan-300 mb-3">System Consciousness</h3>
            <div className="space-y-2">
              {getModulesByCategory('system_consciousness').map(module => (
                <Button
                  key={module.id}
                  variant={activeModule === module.id ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setActiveModule(module.id)}
                  className="w-full justify-start text-left"
                  disabled={coherenceState.zLambda < module.coherenceThreshold}
                >
                  <span className="mr-2">{module.icon}</span>
                  <div className="flex-1 text-left">
                    <div className="font-medium">{module.name}</div>
                    <div className="text-xs text-gray-400">{module.description}</div>
                  </div>
                  {coherenceState.zLambda < module.coherenceThreshold && (
                    <Badge variant="outline" className="text-xs">
                      Zλ {module.coherenceThreshold}+
                    </Badge>
                  )}
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Knowledge & Codex */}
        <Card className="bg-gray-900/50 border-amber-500/30">
          <CardContent className="p-4">
            <h3 className="text-lg font-bold text-amber-300 mb-3">Knowledge & Codex</h3>
            <div className="space-y-2">
              {getModulesByCategory('knowledge_codex').map(module => (
                <Button
                  key={module.id}
                  variant={activeModule === module.id ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setActiveModule(module.id)}
                  className="w-full justify-start text-left"
                  disabled={coherenceState.zLambda < module.coherenceThreshold}
                >
                  <span className="mr-2">{module.icon}</span>
                  <div className="flex-1 text-left">
                    <div className="font-medium">{module.name}</div>
                    <div className="text-xs text-gray-400">{module.description}</div>
                  </div>
                  {coherenceState.zLambda < module.coherenceThreshold && (
                    <Badge variant="outline" className="text-xs">
                      Zλ {module.coherenceThreshold}+
                    </Badge>
                  )}
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Active Module Renderer */}
      <Card className="bg-gray-900/50 border-purple-500/30">
        <CardContent className="p-0">
          <div className="min-h-[600px]">
            {getCurrentModule()}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default UnifiedModuleRouter;