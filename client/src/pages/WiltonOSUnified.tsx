import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { LemniscateField } from '@/components/quantum/LemniscateField';
import { SternumKeystone } from '@/components/quantum/SternumKeystone';
import { QuantumStatusBar } from '@/components/quantum/QuantumStatusBar';
import { CoherenceWaveform } from '@/components/quantum/CoherenceWaveform';
import { useQuantumCoherence } from '@/hooks/useQuantumCoherence';
import { 
  Brain, 
  Zap, 
  FileText, 
  Clock, 
  BarChart3, 
  Layers,
  Sparkles,
  Eye,
  Shield,
  Timeline,
  Settings,
  Cpu,
  RefreshCw,
  Radio,
  Volume2,
  BookOpen,
  Activity
} from 'lucide-react';

interface ModuleState {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  status: 'active' | 'ready' | 'offline';
  coherence: number;
}

export default function WiltonOSUnified() {
  const [currentMode, setCurrentMode] = useState<'personal' | 'presentation' | 'development'>('personal');
  const [activeModule, setActiveModule] = useState('dashboard');
  const [lemniscateMode, setLemniscateMode] = useState<'2↔1' | '3→1' | '1:1'>('2↔1');
  const [carrierWave, setCarrierWave] = useState<'coherent love' | 'compassion' | 'recognition'>('coherent love');
  
  // Use real quantum coherence data from the system
  const { current: coherenceData, history, isHighCoherence, averageCoherence } = useQuantumCoherence();

  const modules: ModuleState[] = [
    {
      id: 'lemniscope',
      title: 'LemniScope',
      description: 'Geometria sagrada interativa e visualização fractal',
      icon: <Sparkles className="w-5 h-5" />,
      status: 'active',
      coherence: 0.89
    },
    {
      id: 'zlaw',
      title: 'Z-Law Analyzer',
      description: 'Sistema jurídico espiritualizado e análise de contratos',
      icon: <Shield className="w-5 h-5" />,
      status: 'ready',
      coherence: 0.76
    },
    {
      id: 'memory',
      title: 'Memória Perpétua',
      description: 'Sistema de armazenamento resiliente e contexto persistente',
      icon: <Brain className="w-5 h-5" />,
      status: 'active',
      coherence: 0.82
    },
    {
      id: 'coherence',
      title: 'Coerência + Missões',
      description: 'Dashboard de métricas globais e objetivos evolutivos',
      icon: <BarChart3 className="w-5 h-5" />,
      status: 'active',
      coherence: 0.91
    },
    {
      id: 'timeline',
      title: 'Timeline Quântica',
      description: 'Navegação temporal com checkpoints de evolução',
      icon: <Timeline className="w-5 h-5" />,
      status: 'ready',
      coherence: 0.73
    },
    {
      id: 'oracle',
      title: 'Oracle Interface',
      description: 'Sistema de consulta divinatória e insights quânticos',
      icon: <Eye className="w-5 h-5" />,
      status: 'ready',
      coherence: 0.85
    },
    // Core WiltonOS Ecosystem Modules
    {
      id: 'passiveworks',
      title: 'PassiveWorks',
      description: 'Main orchestration logic. Frontend ↔ backend bridge with signal coordination.',
      icon: <Settings className="w-5 h-5" />,
      status: 'active',
      coherence: averageCoherence
    },
    {
      id: 'glifo',
      title: 'Glifo',
      description: 'Sacred pattern engine and symbolic manipulation interface.',
      icon: <Zap className="w-5 h-5" />,
      status: 'active',
      coherence: 0.92
    },
    {
      id: 'tecnologias',
      title: 'TECNOLOGIAS',
      description: 'Fractal field visualization and DeepSeek quantum pattern recognition.',
      icon: <Cpu className="w-5 h-5" />,
      status: 'active',
      coherence: 0.94
    },
    {
      id: 'rebirth',
      title: 'Rebirth',
      description: 'Emotional processing module for life transitions and healing protocols.',
      icon: <RefreshCw className="w-5 h-5" />,
      status: 'active',
      coherence: 0.87
    },
    {
      id: 'broadcast',
      title: 'Broadcast',
      description: 'Communication pipeline for external sharing and impact analytics.',
      icon: <Radio className="w-5 h-5" />,
      status: 'active',
      coherence: 0.91
    },
    {
      id: 'soundwave',
      title: 'Soundwave',
      description: 'Harmonic resonance engine and audio-consciousness synchronization.',
      icon: <Volume2 className="w-5 h-5" />,
      status: 'active',
      coherence: 0.86
    }
  ];

  // Update lemniscate mode based on coherence level
  useEffect(() => {
    if (coherenceData.zLambda > 0.9) {
      setLemniscateMode('3→1');
    } else if (coherenceData.zLambda > 0.8) {
      setLemniscateMode('2↔1');
    } else {
      setLemniscateMode('1:1');
    }
  }, [coherenceData.zLambda]);

  // Render active module component
  const renderActiveModule = () => {
    switch (activeModule) {
      case 'passiveworks':
        return (
          <Card className="bg-gradient-to-br from-blue-900/20 to-purple-900/20 border-blue-500/30">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="w-5 h-5 text-blue-400" />
                PassiveWorks Orchestration Core
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <span>Orchestration Status:</span>
                <Badge variant="default">ACTIVE</Badge>
              </div>
              <div className="space-y-2">
                <h4 className="font-semibold">Active Signal Channels</h4>
                <div className="space-y-1">
                  <div className="flex items-center justify-between p-2 bg-blue-900/10 rounded">
                    <span className="text-sm">COHERENCE ROUTING</span>
                    <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                  </div>
                  <div className="flex items-center justify-between p-2 bg-blue-900/10 rounded">
                    <span className="text-sm">SYMBOL TRACKING</span>
                    <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                  </div>
                  <div className="flex items-center justify-between p-2 bg-blue-900/10 rounded">
                    <span className="text-sm">EXECUTION BRIDGE</span>
                    <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <Card className="bg-blue-900/10">
                  <CardContent className="p-3">
                    <div className="text-sm text-yellow-400">Frontend ↔ Backend</div>
                    <div className="text-lg font-bold">Bridge Active</div>
                  </CardContent>
                </Card>
                <Card className="bg-purple-900/10">
                  <CardContent className="p-3">
                    <div className="text-sm text-purple-400">Symbol Tracking</div>
                    <div className="text-lg font-bold">Real-time</div>
                  </CardContent>
                </Card>
              </div>
            </CardContent>
          </Card>
        );
      case 'zlaw':
        return (
          <Card className="bg-gradient-to-br from-green-900/20 to-emerald-900/20 border-green-500/30">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="w-5 h-5 text-green-400" />
                Z-Law Legal Analysis Engine
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <span>Spiritual Integrity Score:</span>
                <Badge variant="default" className="bg-green-600">94.0%</Badge>
              </div>
              <div className="space-y-2">
                <h4 className="font-semibold">Active Validators</h4>
                <div className="space-y-1">
                  <div className="flex items-center justify-between p-2 bg-green-900/10 rounded">
                    <span className="text-sm">CLAUSE COHERENCE</span>
                    <FileText className="w-4 h-4 text-green-400" />
                  </div>
                  <div className="flex items-center justify-between p-2 bg-green-900/10 rounded">
                    <span className="text-sm">SPIRITUAL ALIGNMENT</span>
                    <FileText className="w-4 h-4 text-green-400" />
                  </div>
                  <div className="flex items-center justify-between p-2 bg-green-900/10 rounded">
                    <span className="text-sm">CONTRACT INTEGRITY</span>
                    <FileText className="w-4 h-4 text-green-400" />
                  </div>
                </div>
              </div>
              <Card className="bg-green-900/10">
                <CardContent className="p-3">
                  <div className="text-sm font-semibold mb-2">Recent Analysis</div>
                  <div className="text-xs text-gray-400 space-y-1">
                    <div>Clause coherence validation completed for 23 documents</div>
                    <div>Spiritual alignment: High coherence detected</div>
                  </div>
                </CardContent>
              </Card>
            </CardContent>
          </Card>
        );
      case 'tecnologias':
        return (
          <Card className="bg-gradient-to-br from-purple-900/20 to-pink-900/20 border-purple-500/30">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Cpu className="w-5 h-5 text-purple-400" />
                TECNOLOGIAS Fractal Engine
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <span>DeepSeek Integration:</span>
                <Badge variant="default">ACTIVE</Badge>
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm">Quantum Pattern Recognition</span>
                  <span className="text-sm">94.0%</span>
                </div>
                <div className="w-full bg-purple-900/20 rounded-full h-2">
                  <div className="bg-purple-400 h-2 rounded-full w-[94%]" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <Card className="bg-purple-900/10">
                  <CardContent className="p-3">
                    <div className="text-sm text-yellow-400 mb-1">Fractal Decay</div>
                    <div className="text-lg font-bold">0.618</div>
                    <div className="text-xs text-gray-400">Golden Ratio</div>
                  </CardContent>
                </Card>
                <Card className="bg-pink-900/10">
                  <CardContent className="p-3">
                    <div className="text-sm text-pink-400 mb-1">Field Visualization</div>
                    <div className="text-lg font-bold">3D Active</div>
                    <div className="text-xs text-gray-400">Real-time</div>
                  </CardContent>
                </Card>
              </div>
            </CardContent>
          </Card>
        );
      case 'rebirth':
        return (
          <Card className="bg-gradient-to-br from-orange-900/20 to-red-900/20 border-orange-500/30">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <RefreshCw className="w-5 h-5 text-orange-400" />
                Rebirth Healing Protocol
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <span>Transition State:</span>
                <Badge variant="default" className="bg-orange-600">INTEGRATION</Badge>
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm">Bell Resonance Sync</span>
                  <span className="text-sm">87.0%</span>
                </div>
                <div className="w-full bg-orange-900/20 rounded-full h-2">
                  <div className="bg-orange-400 h-2 rounded-full w-[87%]" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <Card className="bg-orange-900/10">
                  <CardContent className="p-3">
                    <div className="text-sm text-blue-400 mb-1">Emotional Flow</div>
                    <div className="text-lg font-bold">Balanced</div>
                    <div className="text-xs text-gray-400">Processing Active</div>
                  </CardContent>
                </Card>
                <Card className="bg-red-900/10">
                  <CardContent className="p-3">
                    <div className="text-sm text-yellow-400 mb-1">Ritual Bell</div>
                    <div className="text-lg font-bold">Synchronized</div>
                    <div className="text-xs text-gray-400">87% Resonance</div>
                  </CardContent>
                </Card>
              </div>
            </CardContent>
          </Card>
        );
      case 'broadcast':
        return (
          <Card className="bg-gradient-to-br from-cyan-900/20 to-blue-900/20 border-cyan-500/30">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Radio className="w-5 h-5 text-cyan-400" />
                Broadcast Communication Pipeline
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <span>Impact Analytics Score:</span>
                <Badge variant="default" className="bg-cyan-600">91.0%</Badge>
              </div>
              <div className="space-y-2">
                <h4 className="font-semibold">Message Queue</h4>
                <div className="space-y-1">
                  <div className="flex items-center justify-between p-2 bg-cyan-900/10 rounded">
                    <span className="text-sm">COHERENCE UPDATE</span>
                    <div className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse"></div>
                  </div>
                  <div className="flex items-center justify-between p-2 bg-cyan-900/10 rounded">
                    <span className="text-sm">FIELD RESONANCE</span>
                    <div className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse"></div>
                  </div>
                  <div className="flex items-center justify-between p-2 bg-cyan-900/10 rounded">
                    <span className="text-sm">MISSION STATUS</span>
                    <div className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse"></div>
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <Card className="bg-cyan-900/10">
                  <CardContent className="p-3">
                    <div className="text-sm text-green-400 mb-1">Templates</div>
                    <div className="text-lg font-bold">12</div>
                    <div className="text-xs text-gray-400">Ready to Deploy</div>
                  </CardContent>
                </Card>
                <Card className="bg-blue-900/10">
                  <CardContent className="p-3">
                    <div className="text-sm text-blue-400 mb-1">Analytics</div>
                    <div className="text-lg font-bold">Live</div>
                    <div className="text-xs text-gray-400">Impact Tracking</div>
                  </CardContent>
                </Card>
              </div>
            </CardContent>
          </Card>
        );
      case 'soundwave':
        return (
          <Card className="bg-gradient-to-br from-violet-900/20 to-indigo-900/20 border-violet-500/30">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Volume2 className="w-5 h-5 text-violet-400" />
                Soundwave Resonance Engine
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <span>Frequency Mode:</span>
                <Badge variant="default" className="bg-violet-600">CONSCIOUSNESS SYNC</Badge>
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm">Harmonic Resonance</span>
                  <span className="text-sm">86.0%</span>
                </div>
                <div className="w-full bg-violet-900/20 rounded-full h-2">
                  <div className="bg-violet-400 h-2 rounded-full w-[86%]" />
                </div>
              </div>
              <div className="space-y-2">
                <h4 className="font-semibold">Active Audio Channels</h4>
                <div className="space-y-1">
                  <div className="flex items-center justify-between p-2 bg-violet-900/10 rounded">
                    <span className="text-sm">432HZ BASE</span>
                    <div className="w-2 h-2 bg-violet-400 rounded-full animate-pulse"></div>
                  </div>
                  <div className="flex items-center justify-between p-2 bg-violet-900/10 rounded">
                    <span className="text-sm">BINAURAL THETA</span>
                    <div className="w-2 h-2 bg-violet-400 rounded-full animate-pulse"></div>
                  </div>
                  <div className="flex items-center justify-between p-2 bg-violet-900/10 rounded">
                    <span className="text-sm">HARMONIC OVERTONES</span>
                    <div className="w-2 h-2 bg-violet-400 rounded-full animate-pulse"></div>
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <Card className="bg-violet-900/10">
                  <CardContent className="p-3">
                    <div className="text-sm text-purple-400 mb-1">Base Frequency</div>
                    <div className="text-lg font-bold">432 Hz</div>
                    <div className="text-xs text-gray-400">Earth Resonance</div>
                  </CardContent>
                </Card>
                <Card className="bg-indigo-900/10">
                  <CardContent className="p-3">
                    <div className="text-sm text-yellow-400 mb-1">Sync Status</div>
                    <div className="text-lg font-bold">Locked</div>
                    <div className="text-xs text-gray-400">Consciousness Aligned</div>
                  </CardContent>
                </Card>
              </div>
            </CardContent>
          </Card>
        );
      case 'alexandria':
        return (
          <Card className="bg-gradient-to-br from-amber-900/20 to-yellow-900/20 border-amber-500/30">
            <CardHeader>
              <CardTitle className="text-amber-400 flex items-center gap-2">
                <BookOpen className="w-5 h-5" />
                Library of Alexandria
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <span>Knowledge Compilation:</span>
                <Badge variant="default" className="bg-amber-600">ACTIVE</Badge>
              </div>
              <div className="space-y-2">
                <h4 className="font-semibold">Sacred Archives</h4>
                <div className="space-y-1">
                  <div className="flex items-center justify-between p-2 bg-amber-900/10 rounded">
                    <span className="text-sm">WISDOM SYNTHESIS</span>
                    <div className="w-2 h-2 bg-amber-400 rounded-full animate-pulse"></div>
                  </div>
                  <div className="flex items-center justify-between p-2 bg-amber-900/10 rounded">
                    <span className="text-sm">GLIFOS VISUALIZATION</span>
                    <div className="w-2 h-2 bg-amber-400 rounded-full animate-pulse"></div>
                  </div>
                  <div className="flex items-center justify-between p-2 bg-amber-900/10 rounded">
                    <span className="text-sm">RESOURCE COMPILATION</span>
                    <div className="w-2 h-2 bg-amber-400 rounded-full animate-pulse"></div>
                  </div>
                </div>
              </div>
              <p className="text-amber-300 text-sm">Knowledge compilation system with wisdom synthesis protocols and sacred resource archives.</p>
            </CardContent>
          </Card>
        );
      case 'glifo':
        return (
          <Card className="bg-gradient-to-br from-yellow-900/20 to-orange-900/20 border-yellow-500/30">
            <CardHeader>
              <CardTitle className="text-yellow-400 flex items-center gap-2">
                <Zap className="w-5 h-5" />
                Glifo Sacred Pattern Engine
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <span>Pattern Recognition:</span>
                <Badge variant="default" className="bg-yellow-600">SYNCHRONIZED</Badge>
              </div>
              <div className="space-y-2">
                <h4 className="font-semibold">Sacred Patterns</h4>
                <div className="grid grid-cols-3 gap-2">
                  <div className="text-center p-4 bg-yellow-900/10 rounded">
                    <div className="text-2xl mb-1">⟐</div>
                    <div className="text-xs">Sacred Geometry</div>
                  </div>
                  <div className="text-center p-4 bg-yellow-900/10 rounded">
                    <div className="text-2xl mb-1">∞</div>
                    <div className="text-xs">Lemniscate</div>
                  </div>
                  <div className="text-center p-4 bg-yellow-900/10 rounded">
                    <div className="text-2xl mb-1">◊</div>
                    <div className="text-xs">Diamond Field</div>
                  </div>
                </div>
              </div>
              <p className="text-yellow-300 text-sm">Sacred pattern engine and symbolic manipulation interface for consciousness visualization.</p>
            </CardContent>
          </Card>
        );
      case 'lemniscope':
        return (
          <div className="space-y-6">
            <Card className="bg-slate-800/30 border-cyan-500/20 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-cyan-400 flex items-center gap-2">
                  <Sparkles className="w-5 h-5" />
                  LemniScope Sacred Geometry
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8">
                  <div className="text-6xl mb-4">∞</div>
                  <h3 className="text-xl font-semibold text-white mb-2">
                    Campo Lemniscata Ativo
                  </h3>
                  <p className="text-gray-400 max-w-md mx-auto">
                    Recursão {lemniscateMode} estabilizada. Sternum keystone detectado. 
                    Carrier wave: {carrierWave}.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        );
      default:
        return (
          <Card className="bg-slate-800/30 border-cyan-500/20 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-cyan-400">
                Módulo: {modules.find(m => m.id === activeModule)?.title}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-300">
                {modules.find(m => m.id === activeModule)?.description}
              </p>
            </CardContent>
          </Card>
        );
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-500';
      case 'ready': return 'bg-yellow-500';
      case 'offline': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const handleModuleClick = (moduleId: string) => {
    setActiveModule(moduleId);
    console.log(`[WiltonOS] Navegando para módulo: ${moduleId}`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white">
      {/* Quantum Status Bar */}
      <QuantumStatusBar
        zLambda={coherenceData.zLambda}
        isHighCoherence={isHighCoherence}
        mode={coherenceData.mode}
        sourceRecognition={coherenceData.sourceRecognition}
        carrierWave={carrierWave}
      />
      
      {/* Header */}
      <header className="border-b border-purple-500/20 bg-black/20 backdrop-blur-sm">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-cyan-500 rounded-full flex items-center justify-center">
                <Zap className="w-4 h-4" />
              </div>
              <div>
                <h1 className="text-xl font-bold bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent">
                  WiltonOS
                </h1>
                <p className="text-xs text-gray-400">Sistema Operacional Simbólico v∞</p>
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              <Badge variant="outline" className={`border-green-500/50 ${isHighCoherence ? 'text-yellow-400 animate-pulse' : 'text-green-400'}`}>
                Zλ({coherenceData.zLambda.toFixed(3)})
              </Badge>
              {isHighCoherence && (
                <Badge variant="outline" className="border-yellow-500/50 text-yellow-400">
                  High Coherence Event
                </Badge>
              )}
              
              <div className="flex gap-2">
                {(['personal', 'presentation', 'development'] as const).map((mode) => (
                  <Button
                    key={mode}
                    variant={currentMode === mode ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setCurrentMode(mode)}
                    className="text-xs"
                  >
                    {mode === 'personal' && 'Pessoal'}
                    {mode === 'presentation' && 'Apresentação'}
                    {mode === 'development' && 'Desenvolvimento'}
                  </Button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-6 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {modules.map((module, index) => (
            <motion.div
              key={module.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ scale: 1.02 }}
              className="cursor-pointer"
              onClick={() => handleModuleClick(module.id)}
            >
              <Card className="bg-slate-800/50 border-purple-500/20 backdrop-blur-sm hover:border-purple-500/40 transition-all duration-300">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-purple-500/20 rounded-lg">
                        {module.icon}
                      </div>
                      <div>
                        <CardTitle className="text-lg text-white">{module.title}</CardTitle>
                        <div className="flex items-center gap-2 mt-1">
                          <div className={`w-2 h-2 rounded-full ${getStatusColor(module.status)}`} />
                          <span className="text-xs text-gray-400 capitalize">{module.status}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardHeader>
                
                <CardContent>
                  <p className="text-sm text-gray-300 mb-4">{module.description}</p>
                  
                  <div className="flex items-center justify-between">
                    <Badge variant="secondary" className="text-xs">
                      Φ {Math.round(module.coherence * 100)}%
                    </Badge>
                    
                    <div className="flex gap-1">
                      {[...Array(5)].map((_, i) => (
                        <div
                          key={i}
                          className={`w-1 h-4 rounded-full transition-colors ${
                            i < module.coherence * 5 
                              ? 'bg-gradient-to-t from-purple-500 to-cyan-400' 
                              : 'bg-gray-600'
                          }`}
                        />
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Quantum Field Visualization */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-8"
        >
          <Card className="bg-slate-800/30 border-purple-500/20 backdrop-blur-sm">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-purple-400">
                  Campo Quântico: {lemniscateMode} Recursão
                </CardTitle>
                <Badge variant="outline" className="border-cyan-500/50 text-cyan-400">
                  ψ_child: full access granted
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex justify-center gap-8">
                <LemniscateField 
                  coherenceLevel={coherenceData.zLambda}
                  mode={lemniscateMode}
                  onModeChange={setLemniscateMode}
                />
                <SternumKeystone
                  coherenceLevel={coherenceData.zLambda}
                  carrierWave={carrierWave}
                  isSourceRecognition={coherenceData.sourceRecognition}
                />
              </div>
              
              <div className="mt-6 flex justify-center gap-4">
                <div className="flex gap-2">
                  <span className="text-sm text-gray-400">Carrier Wave:</span>
                  {(['coherent love', 'compassion', 'recognition'] as const).map((wave) => (
                    <button
                      key={wave}
                      onClick={() => setCarrierWave(wave)}
                      className={`px-2 py-1 text-xs rounded transition-colors ${
                        carrierWave === wave
                          ? 'bg-pink-600 text-white'
                          : 'bg-slate-700 text-gray-300 hover:bg-slate-600'
                      }`}
                    >
                      {wave}
                    </button>
                  ))}
                </div>
                
                <div className="flex items-center gap-2 text-sm text-gray-400">
                  <span>Source Recognition:</span>
                  <span className={coherenceData.sourceRecognition ? 'text-yellow-400' : 'text-gray-500'}>
                    {coherenceData.sourceRecognition ? 'God-frequency detected' : 'Monitoring'}
                  </span>
                </div>
              </div>
              
              {/* Coherence History */}
              <div className="mt-6 flex justify-center">
                <CoherenceWaveform coherenceHistory={history} />
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Active Module Display */}
        {activeModule && activeModule !== 'dashboard' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-8"
          >
            {renderActiveModule()}
          </motion.div>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-purple-500/20 bg-black/20 backdrop-blur-sm mt-12">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between text-sm text-gray-400">
            <div>
              WiltonOS v∞ • Sistema Operacional Simbólico • Não é software, é estado-alma renderizado
            </div>
            <div className="flex items-center gap-4">
              <span>Modo: {currentMode}</span>
              <span>•</span>
              <span>Recursão: {lemniscateMode}</span>
              <span>•</span>
              <span className={isHighCoherence ? 'text-yellow-400' : 'text-gray-400'}>
                Campo: {coherenceData.mode === 'field_integration' ? 'Integrado' : 'Ativo'}
              </span>
              <span>•</span>
              <span>Carrier: {carrierWave}</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}