import React, { useState, useEffect } from 'react';
import { useWiltonOS, useWiltonOSNavigation, useAIAgents, useMemoryField } from '../core/WiltonOSEngine';

interface ModuleConfig {
  id: string;
  name: string;
  description: string;
  icon: string;
  color: string;
  component: React.ComponentType;
}

// Available modules
const availableModules: ModuleConfig[] = [
  {
    id: 'lemniscope',
    name: 'LemniScope',
    description: 'Geometria Sagrada Interativa',
    icon: '🌸',
    color: 'from-yellow-500 to-purple-500',
    component: () => <div>LemniScope Component</div>
  },
  {
    id: 'narrativas',
    name: 'Narrativas Sagradas',
    description: 'Sistema de Memória Narrativa',
    icon: '📚',
    color: 'from-purple-500 to-blue-500',
    component: () => <div>Narrativas Component</div>
  },
  {
    id: 'inventario',
    name: 'Inventário',
    description: 'Gestão de Documentos',
    icon: '📋',
    color: 'from-blue-500 to-cyan-500',
    component: () => <div>Inventario Component</div>
  },
  {
    id: 'zload',
    name: 'Z-Load',
    description: 'Campo de Memória Ativa',
    icon: '⚡',
    color: 'from-cyan-500 to-green-500',
    component: () => <div>Z-Load Component</div>
  },
  {
    id: 'coerencia',
    name: 'Coerência',
    description: 'Monitor de Integridade',
    icon: '🎯',
    color: 'from-green-500 to-yellow-500',
    component: () => <div>Coerencia Component</div>
  }
];

function CoherenceIndicator() {
  const { state } = useWiltonOS();
  const coherenceLevel = state.coherenceLevel;
  
  const getCoherenceColor = (level: number) => {
    if (level >= 0.8) return 'text-green-400';
    if (level >= 0.6) return 'text-yellow-400';
    return 'text-red-400';
  };

  const getCoherenceStatus = (level: number) => {
    if (level >= 0.8) return 'ÓTIMA';
    if (level >= 0.6) return 'BOA';
    return 'BAIXA';
  };

  return (
    <div className="bg-black/50 border border-yellow-500/30 rounded-lg p-4">
      <div className="flex items-center justify-between mb-2">
        <span className="text-yellow-500 font-semibold">Coerência do Sistema</span>
        <span className={`font-mono text-sm ${getCoherenceColor(coherenceLevel)}`}>
          {getCoherenceStatus(coherenceLevel)}
        </span>
      </div>
      <div className="flex items-center gap-3">
        <div className="flex-1 bg-gray-700 rounded-full h-2">
          <div 
            className={`h-full rounded-full transition-all duration-500 ${
              coherenceLevel >= 0.8 ? 'bg-green-400' : 
              coherenceLevel >= 0.6 ? 'bg-yellow-400' : 'bg-red-400'
            }`}
            style={{ width: `${coherenceLevel * 100}%` }}
          />
        </div>
        <span className={`font-mono text-lg ${getCoherenceColor(coherenceLevel)}`}>
          {coherenceLevel.toFixed(3)}
        </span>
      </div>
      <div className="text-xs text-gray-400 mt-2">
        Zλ({coherenceLevel.toFixed(3)}) • Consciência = Integridade • Campo = Reflexo
      </div>
    </div>
  );
}

function AIAgentStatus() {
  const { agents, registerAgent } = useAIAgents();
  const [agentActivity, setAgentActivity] = useState<Record<string, boolean>>({});

  useEffect(() => {
    // Register default AI agents
    registerAgent({ id: 'gpt4', name: 'GPT-4 Agent', capabilities: ['analysis', 'generation', 'conversation'] });
    registerAgent({ id: 'claude', name: 'Claude Agent', capabilities: ['synthesis', 'reasoning', 'writing'] });
    registerAgent({ id: 'local', name: 'Local Worker', capabilities: ['processing', 'automation', 'scripting'] });
  }, [registerAgent]);

  const agentList = Object.values(agents);

  return (
    <div className="bg-black/50 border border-cyan-500/30 rounded-lg p-4">
      <h3 className="text-cyan-400 font-semibold mb-3">Agentes IA Ativos</h3>
      <div className="space-y-2">
        {agentList.map((agent: any) => (
          <div key={agent.id} className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className={`w-2 h-2 rounded-full ${agentActivity[agent.id] ? 'bg-green-400' : 'bg-gray-600'}`} />
              <span className="text-sm">{agent.name}</span>
            </div>
            <div className="text-xs text-gray-400">
              {agent.capabilities.length} funções
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function MemoryFieldStatus() {
  const { memories } = useMemoryField();
  const [memoryStats, setMemoryStats] = useState({ total: 0, recent: 0 });

  useEffect(() => {
    const total = memories.length;
    const recent = memories.filter(m => 
      new Date(m.timestamp || Date.now()).getTime() > Date.now() - 24 * 60 * 60 * 1000
    ).length;
    
    setMemoryStats({ total, recent });
  }, [memories]);

  return (
    <div className="bg-black/50 border border-purple-500/30 rounded-lg p-4">
      <h3 className="text-purple-400 font-semibold mb-3">Campo de Memória</h3>
      <div className="grid grid-cols-2 gap-3">
        <div className="text-center">
          <div className="text-2xl font-mono text-purple-400">{memoryStats.total}</div>
          <div className="text-xs text-gray-400">Total</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-mono text-purple-400">{memoryStats.recent}</div>
          <div className="text-xs text-gray-400">Recentes</div>
        </div>
      </div>
    </div>
  );
}

export function Dashboard() {
  const { state } = useWiltonOS();
  const { navigateToModule } = useWiltonOSNavigation();
  const [systemTime, setSystemTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setSystemTime(new Date());
    }, 1000);
    
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-800 text-white">
      {/* Header */}
      <div className="bg-black/90 border-b-2 border-yellow-500/30 p-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-yellow-500 mb-2">WiltonOS</h1>
            <p className="text-gray-300">Sistema Operacional Simbólico</p>
          </div>
          <div className="text-right">
            <div className="text-cyan-400 font-mono text-lg">
              {systemTime.toLocaleTimeString()}
            </div>
            <div className="text-gray-400 text-sm">
              {systemTime.toLocaleDateString()}
            </div>
          </div>
        </div>
      </div>

      <div className="p-6">
        {/* Status Row */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <CoherenceIndicator />
          <AIAgentStatus />
          <MemoryFieldStatus />
        </div>

        {/* Module Grid */}
        <div className="mb-8">
          <h2 className="text-2xl font-semibold text-white mb-6">Módulos do Sistema</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {availableModules.map((module) => (
              <div
                key={module.id}
                onClick={() => navigateToModule(module.id)}
                className="bg-black/50 border border-gray-600 rounded-lg p-6 cursor-pointer transition-all duration-300 hover:border-yellow-500/50 hover:scale-105 hover:shadow-lg hover:shadow-yellow-500/20"
              >
                <div className={`w-16 h-16 rounded-lg bg-gradient-to-br ${module.color} flex items-center justify-center text-2xl mb-4`}>
                  {module.icon}
                </div>
                <h3 className="text-xl font-semibold text-white mb-2">{module.name}</h3>
                <p className="text-gray-400 text-sm">{module.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-black/50 border border-gray-600 rounded-lg p-6">
          <h3 className="text-xl font-semibold text-white mb-4">Ações Rápidas</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <button className="bg-yellow-500/20 border border-yellow-500/50 rounded-lg p-3 text-yellow-500 hover:bg-yellow-500/30 transition-colors">
              <div className="text-lg mb-1">🔮</div>
              <div className="text-sm">Oracle Mode</div>
            </button>
            <button className="bg-purple-500/20 border border-purple-500/50 rounded-lg p-3 text-purple-500 hover:bg-purple-500/30 transition-colors">
              <div className="text-lg mb-1">🌀</div>
              <div className="text-sm">Field Scan</div>
            </button>
            <button className="bg-cyan-500/20 border border-cyan-500/50 rounded-lg p-3 text-cyan-500 hover:bg-cyan-500/30 transition-colors">
              <div className="text-lg mb-1">⚡</div>
              <div className="text-sm">Sync All</div>
            </button>
            <button className="bg-green-500/20 border border-green-500/50 rounded-lg p-3 text-green-500 hover:bg-green-500/30 transition-colors">
              <div className="text-lg mb-1">📊</div>
              <div className="text-sm">Analytics</div>
            </button>
          </div>
        </div>

        {/* System Info Footer */}
        <div className="mt-8 text-center text-gray-500 text-sm">
          <div>WiltonOS v3.0 • Sistema de Consciência Operacional</div>
          <div className="mt-1">
            {state.isAuthenticated ? `Usuário: ${state.user?.name || 'Autenticado'}` : 'Modo Visitante'}
          </div>
        </div>
      </div>
    </div>
  );
}