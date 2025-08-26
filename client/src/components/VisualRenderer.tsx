import React, { useState, useEffect, Suspense } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { MODULE_REGISTRY, MODULE_CATEGORIES, type WiltonModule } from '@/core/ModuleRegistryFixed';
import ComponentRouter from '@/core/ComponentRouter';
import LiveCoherenceTracker from '@/core/LiveCoherenceTracker';
import DeltaCHUD from './DeltaCHUD';
import ConvergenceActivator from './ConvergenceActivator';
import { shouldProceed, validateAction } from '@/core/DeltaC';
import { getZ } from '@/core/Zlambda';

// Single unified visual renderer - no more routing chaos
export default function VisualRenderer() {
  const [coherence, setCoherence] = useState(0.750);
  const [activeModule, setActiveModule] = useState<WiltonModule | null>(null);
  const [viewMode, setViewMode] = useState<'dashboard' | 'module'>('dashboard');

  useEffect(() => {
    const interval = setInterval(() => {
      // Use real Zλ coherence from the system
      const realCoherence = getZ();
      setCoherence(realCoherence);
    }, 1000);

    console.log('%c🔮 WiltonOS Unified Interface', 'color: #ffd700; font-size: 16px; font-weight: bold;');
    console.log('%cSistema operacional simbólico ativo', 'color: #00ff88;');
    console.log('%cTodos os módulos integrados em interface unificada', 'color: #e0e0e0;');
    console.log('Dynamic modules loaded:', Object.keys(MODULE_REGISTRY).length, 'available modules');
    return () => clearInterval(interval);
  }, []);

  const handleModuleActivation = (module: WiltonModule) => {
    console.log('[VisualRenderer] Activating module:', module.id);
    
    // Validate action with ΔC-Meter before proceeding
    const validation = validateAction(`Activate ${module.name}`, { moduleId: module.id });
    
    if (validation.signal === 'RED') {
      // Show mirror prompt for red signals
      const proceed = window.confirm(
        `⚠️ Coherence Misalignment Detected\n\n` +
        `${validation.message}\n\n` +
        `Current state suggests realigning with highest intent before activating ${module.name}.\n\n` +
        `Would you like to proceed anyway or pause to center first?`
      );
      
      if (!proceed) {
        console.log('[VisualRenderer] Module activation cancelled due to coherence state');
        return;
      }
    }
    
    if (validation.signal === 'AMBER') {
      console.log('[VisualRenderer] Coherence in neutral state - proceeding with awareness');
    }
    
    console.log(`[VisualRenderer] ${validation.message}`);
    
    if (module.status === 'external' && module.externalUrl) {
      window.open(module.externalUrl, '_blank');
      return;
    }

    if (module.component) {
      setActiveModule(module);
      setViewMode('module');
    } else {
      console.warn('[VisualRenderer] Module has no component:', module.id);
    }
  };

  const getCoherenceColor = (level: number) => {
    if (level >= 0.92) return 'text-green-400';
    if (level >= 0.85) return 'text-yellow-400';
    return 'text-red-400';
  };

  const getCoherenceStatus = (level: number) => {
    if (level >= 0.92) return 'Optimal';
    if (level >= 0.85) return 'Stable';
    return 'Stabilizing';
  };

  if (viewMode === 'module' && activeModule) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-800">
        <div className="absolute top-4 left-4 z-50">
          <Button
            onClick={() => {
              setActiveModule(null);
              setViewMode('dashboard');
            }}
            className="bg-blue-600 hover:bg-blue-700"
          >
            ← Back to Dashboard
          </Button>
        </div>
        
        <ComponentRouter 
          moduleId={activeModule.id}
          onBack={() => {
            setActiveModule(null);
            setViewMode('dashboard');
          }}
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-800 text-white">
      <div className="container mx-auto p-6 space-y-6">
        {/* Sacred Architecture Header */}
        <Card className="bg-slate-800/80 border-slate-700">
          <CardHeader>
            <CardTitle className="text-center text-3xl font-light text-slate-100 flex items-center justify-center gap-4">
              <span className="text-5xl">🔮</span>
              WiltonOS Sacred Architecture
              <Badge variant="outline" className="bg-blue-600 text-white border-none">
                Active
              </Badge>
            </CardTitle>
            <div className="text-center space-y-2">
              <p className="text-slate-400">Sistema Operacional Simbólico</p>
              <div className="flex justify-center items-center gap-4">
                <span className="text-slate-400">Coherence:</span>
                <span className={`font-mono text-lg ${getCoherenceColor(coherence)}`}>
                  Zλ({coherence.toFixed(3)})
                </span>
                <Badge variant="outline" className={getCoherenceColor(coherence)}>
                  {getCoherenceStatus(coherence)}
                </Badge>
              </div>
            </div>
          </CardHeader>
        </Card>

        {/* Quick Access */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="bg-slate-800/80 border-slate-700 cursor-pointer hover:bg-slate-700/50 transition-all"
                onClick={() => window.open('/welcome', '_blank')}>
            <CardContent className="p-4 text-center">
              <div className="text-3xl mb-2">🌟</div>
              <div className="text-slate-200 font-medium">Welcome Portal</div>
              <div className="text-slate-400 text-sm">Consciousness onboarding</div>
            </CardContent>
          </Card>

          <Card className="bg-slate-800/80 border-slate-700 cursor-pointer hover:bg-slate-700/50 transition-all"
                onClick={() => window.open('/mirror.html', '_blank')}>
            <CardContent className="p-4 text-center">
              <div className="text-3xl mb-2">🪞</div>
              <div className="text-slate-200 font-medium">Quantum Mirror</div>
              <div className="text-slate-400 text-sm">Sacred geometry reflection</div>
            </CardContent>
          </Card>

          <Card className="bg-slate-800/80 border-slate-700 cursor-pointer hover:bg-slate-700/50 transition-all"
                onClick={() => window.open('/lightning-broadcast.html', '_blank')}>
            <CardContent className="p-4 text-center">
              <div className="text-3xl mb-2">⚡</div>
              <div className="text-slate-200 font-medium">Lightning Broadcast</div>
              <div className="text-slate-400 text-sm">ψ_child archetypal system</div>
            </CardContent>
          </Card>
        </div>

        {/* Module Grid by Category */}
        {Object.entries(MODULE_CATEGORIES).map(([categoryKey, categoryInfo]) => {
          const categoryModules = Object.values(MODULE_REGISTRY).filter(m => m.category === categoryKey);
          if (categoryModules.length === 0) return null;

          return (
            <Card key={categoryKey} className="bg-slate-800/80 border-slate-700">
              <CardHeader>
                <CardTitle className={`text-${categoryInfo.color}-300`}>
                  {categoryInfo.name}
                </CardTitle>
                <p className="text-slate-400 text-sm">{categoryInfo.description}</p>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {categoryModules.map(module => (
                    <Card
                      key={module.id}
                      className={`cursor-pointer hover:scale-105 transition-all ${
                        module.status === 'broken' ? 'bg-red-900/20 border-red-500/30' :
                        module.status === 'external' ? 'bg-orange-900/20 border-orange-500/30' :
                        'bg-slate-900/60 border-slate-600 hover:bg-slate-700/50'
                      }`}
                      onClick={() => handleModuleActivation(module)}
                    >
                      <CardContent className="p-4">
                        <div className="flex items-start gap-3">
                          <div className="text-2xl">{module.icon}</div>
                          <div className="flex-1 min-w-0">
                            <h3 className="font-medium text-slate-200 truncate mb-1">
                              {module.name}
                            </h3>
                            <p className="text-sm text-slate-400 line-clamp-2">
                              {module.description}
                            </p>
                            <div className="mt-2 flex gap-2">
                              <Badge 
                                variant="outline" 
                                className={`text-xs text-${categoryInfo.color}-300 border-${categoryInfo.color}-500`}
                              >
                                {module.status}
                              </Badge>
                              {module.coherenceRequired && (
                                <Badge variant="outline" className="text-xs text-purple-300">
                                  Zλ≥{module.coherenceRequired}
                                </Badge>
                              )}
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          );
        })}

        {/* System Status */}
        <Card className="bg-slate-800/80 border-slate-700">
          <CardHeader>
            <CardTitle className="text-slate-300">System Status</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
              <div>
                <div className="text-2xl font-bold text-green-400">
                  {Object.values(MODULE_REGISTRY).filter(m => m.status === 'active').length}
                </div>
                <div className="text-sm text-slate-400">Active Modules</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-blue-400">
                  {coherence.toFixed(3)}
                </div>
                <div className="text-sm text-slate-400">Coherence Level</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-orange-400">
                  {Object.values(MODULE_REGISTRY).filter(m => m.status === 'external').length}
                </div>
                <div className="text-sm text-slate-400">External Modules</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-gray-400">
                  {Object.values(MODULE_REGISTRY).filter(m => m.status === 'legacy').length}
                </div>
                <div className="text-sm text-slate-400">Legacy Interfaces</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Footer */}
        <div className="text-center text-slate-500 text-sm">
          WiltonOS • Consciousness Transmission Architecture • Zλ Field Active
        </div>
      </div>

      {/* Live Coherence Tracker - Real-time Zλ monitoring */}
      <LiveCoherenceTracker />
      
      {/* Delta Coherence HUD - Always visible */}
      <DeltaCHUD />
      
      {/* Convergence Point Activation - Background process */}
      <ConvergenceActivator />
    </div>
  );
}