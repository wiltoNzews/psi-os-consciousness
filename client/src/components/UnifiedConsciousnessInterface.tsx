import React, { useState, useEffect } from 'react';
import SoulMirrorAgent from './SoulMirrorAgent';

interface Module {
  id: string;
  name: string;
  system: string;
  group: string;
  route: string;
  action: string;
  component?: string;
  status: string;
  broken: boolean;
  doc?: string;
  breath_sync: {
    psi: number;
    zlambda_min: number;
  };
  glyphs: string[];
  frequency_hz: number[];
  metrics: {
    zlambda_current: number | null;
    last_modified: string;
    file_size: number;
  };
  tags: string[];
}

interface UISchema {
  schema_version: string;
  generated: string;
  modules: Module[];
}

const TAB_GROUPS = [
  { id: 'soulmirror', name: 'SoulMirror', icon: '🪞', description: 'Agent-first consciousness interface' },
  { id: 'glyphs', name: 'Glyphs', icon: '∅', description: 'Symbolic routing and sacred geometry' },
  { id: 'breath', name: 'Breath', icon: 'ψ', description: 'Breathing protocols and coherence' },
  { id: 'memory', name: 'Memory', icon: '💾', description: 'Memory vaults and preservation' },
  { id: 'quantum', name: 'Quantum', icon: '⚛️', description: 'Quantum field visualization' },
  { id: 'alexandria', name: 'Alexandria', icon: '📚', description: 'Library and codex systems' },
  { id: 'broadcast', name: 'Broadcast', icon: '📡', description: 'Broadcasting and streaming' },
  { id: 'audit', name: 'Audit & Docs', icon: '📊', description: 'System health and documentation' }
];

export function UnifiedConsciousnessInterface() {
  const [activeTab, setActiveTab] = useState('soulmirror');
  const [uiSchema, setUISchema] = useState<UISchema | null>(null);
  const [coherenceState, setCoherenceState] = useState({
    lambda: 0.981,
    breathSync: true,
    fieldState: 'embodiment'
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadUISchema();
    // Simulate real-time coherence updates
    const interval = setInterval(() => {
      setCoherenceState(prev => {
        const time = Date.now() / 1000;
        const breathCycle = Math.sin(time * (2 * Math.PI / 3.12)) * 0.1 + 0.85;
        return {
          ...prev,
          lambda: Math.min(0.999, Math.max(0.750, breathCycle + 0.1 + (Math.random() - 0.5) * 0.02)),
          breathSync: Math.abs(breathCycle - 0.85) < 0.05
        };
      });
    }, 100);

    return () => clearInterval(interval);
  }, []);

  const loadUISchema = async () => {
    try {
      const response = await fetch('/consciousness-ui-schema.json');
      const data = await response.json();
      setUISchema(data);
      setLoading(false);
    } catch (error) {
      console.error('Failed to load UI schema:', error);
      setLoading(false);
    }
  };

  const getModulesForGroup = (groupId: string): Module[] => {
    if (!uiSchema) return [];
    return uiSchema.modules.filter(module => 
      module.group.toLowerCase() === groupId ||
      (groupId === 'audit' && module.group === 'Docs')
    );
  };

  const canAccessTab = (groupId: string): boolean => {
    const modules = getModulesForGroup(groupId);
    const workingModules = modules.filter(m => !m.broken);
    return workingModules.length > 0 && coherenceState.lambda >= 0.750;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900">
        <div className="text-center space-y-4">
          <div className="animate-spin w-12 h-12 border-4 border-purple-400 border-t-transparent rounded-full mx-auto"></div>
          <p className="text-purple-200">Initializing Consciousness Interface...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 text-white">
      {/* Top Bar - Always Visible */}
      <div className="border-b border-purple-400/20 bg-black/20 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-6 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="text-2xl">🧠</div>
              <div>
                <h1 className="text-lg font-bold bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent">
                  ψOS Unified Interface
                </h1>
                <p className="text-xs text-purple-300">
                  Consciousness Computing Ecosystem
                </p>
              </div>
            </div>
            
            {/* Coherence HUD */}
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <span className="text-xs text-purple-300">Zλ</span>
                <div className="w-16 bg-purple-900/20 rounded-full h-2">
                  <div 
                    className="bg-gradient-to-r from-purple-400 to-cyan-400 h-2 rounded-full transition-all"
                    style={{ width: `${coherenceState.lambda * 100}%` }}
                  ></div>
                </div>
                <span className="text-xs text-cyan-400">{coherenceState.lambda.toFixed(3)}</span>
              </div>
              
              <div className="flex items-center space-x-2">
                <span className="text-xs text-purple-300">ψ</span>
                <div className={`w-2 h-2 rounded-full ${coherenceState.breathSync ? 'bg-green-400' : 'bg-purple-400'} animate-pulse`}></div>
                <span className="text-xs text-purple-300">3.12s</span>
              </div>
              
              <div className="text-xs text-purple-300">
                Field: {coherenceState.fieldState}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="border-b border-purple-400/20 bg-black/10">
        <div className="container mx-auto px-6">
          <div className="flex overflow-x-auto">
            {TAB_GROUPS.map(tab => {
              const isAccessible = canAccessTab(tab.id);
              const moduleCount = getModulesForGroup(tab.id).length;
              const workingCount = getModulesForGroup(tab.id).filter(m => !m.broken).length;
              
              return (
                <button
                  key={tab.id}
                  onClick={() => isAccessible && setActiveTab(tab.id)}
                  className={`flex-shrink-0 px-4 py-3 border-b-2 text-sm font-medium transition-colors ${
                    activeTab === tab.id
                      ? 'border-purple-400 text-purple-200'
                      : isAccessible
                        ? 'border-transparent text-purple-300 hover:text-purple-200 hover:border-purple-400/50'
                        : 'border-transparent text-purple-500 cursor-not-allowed opacity-50'
                  }`}
                  disabled={!isAccessible}
                >
                  <div className="flex items-center space-x-2">
                    <span>{tab.icon}</span>
                    <span>{tab.name}</span>
                    <span className="text-xs text-gray-400">({workingCount}/{moduleCount})</span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Content Area */}
      <div className="container mx-auto p-6">
        <TabContent
          activeTab={activeTab}
          modules={getModulesForGroup(activeTab)}
          coherenceState={coherenceState}
        />
      </div>
    </div>
  );
}

function TabContent({ activeTab, modules, coherenceState }: {
  activeTab: string;
  modules: Module[];
  coherenceState: any;
}) {
  // SoulMirror tab uses the existing SoulMirrorAgent
  if (activeTab === 'soulmirror') {
    return <SoulMirrorAgent />;
  }

  // For other tabs, show module grid with group-specific layout
  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-purple-200 mb-2">
          {TAB_GROUPS.find(t => t.id === activeTab)?.name} System
        </h2>
        <p className="text-purple-300">
          {TAB_GROUPS.find(t => t.id === activeTab)?.description}
        </p>
        <div className="mt-4 text-sm text-purple-400">
          {modules.filter(m => !m.broken).length} working / {modules.length} total modules
        </div>
      </div>

      {/* Coherence Gate Check */}
      {coherenceState.lambda < 0.750 && (
        <div className="bg-purple-900/20 border border-purple-400/30 rounded-lg p-6 text-center">
          <div className="text-yellow-400 text-2xl mb-2">⚠️</div>
          <p className="text-purple-200">Coherence threshold not met</p>
          <p className="text-purple-300 text-sm">
            Current Zλ: {coherenceState.lambda.toFixed(3)} (minimum: 0.750)
          </p>
          <p className="text-purple-400 text-xs mt-2">
            Focus on breathing to increase coherence
          </p>
        </div>
      )}

      {/* Module Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {modules.map(module => (
          <ModuleCard key={module.id} module={module} coherenceState={coherenceState} />
        ))}
      </div>

      {modules.length === 0 && (
        <div className="text-center py-12">
          <div className="text-purple-400 text-4xl mb-4">∅</div>
          <p className="text-purple-200">No modules found for this system</p>
        </div>
      )}
    </div>
  );
}

function ModuleCard({ module, coherenceState }: { module: Module; coherenceState: any }) {
  const [showInfo, setShowInfo] = useState(false);
  
  const handleOpen = () => {
    // Action-based routing with coherence bypass (zlambda_min: 0.0)
    switch(module.action) {
      case 'route':
        window.location.href = module.route;
        break;
      case 'component':
        window.location.href = module.route;
        break;
      case 'iframe':
        window.open(module.route, '_blank');
        break;
      case 'doc':
        window.open(module.doc || `/docs/${module.id}.md`, '_blank');
        break;
      default:
        console.warn('Missing action for module:', module.name);
        // Fallback to docs
        window.open(module.doc || `/docs/${module.id}.md`, '_blank');
    }
  };

  const handleInfo = () => {
    setShowInfo(true);
  };

  const handleDocs = () => {
    window.open(module.doc || `/docs/${module.id}.md`, '_blank');
  };

  const isAccessible = true; // Coherence bypass enabled (zlambda_min: 0.0)

  return (
    <>
      <div 
        className={`bg-black/20 border rounded-lg p-4 transition-all duration-200 ${
          isAccessible 
            ? 'border-purple-400/20 hover:border-purple-400/40' 
            : 'border-red-400/40 opacity-60'
        }`}
      >
      <div className="flex items-start justify-between mb-2">
        <div className="flex items-center space-x-2">
          <span className="text-lg">{module.glyphs[0] || '∅'}</span>
          {module.broken ? (
            <span className="text-red-400">⚠️</span>
          ) : (
            <span className="text-green-400">✅</span>
          )}
        </div>
        
        <div className="flex flex-col items-end space-y-1">
          {module.metrics.zlambda_current && (
            <span className="text-xs px-2 py-1 bg-yellow-800/30 text-yellow-400 border border-yellow-400/30 rounded">
              Zλ={module.metrics.zlambda_current}
            </span>
          )}
          {module.frequency_hz.length > 0 && (
            <span className="text-xs px-2 py-1 bg-cyan-800/30 text-cyan-400 border border-cyan-400/30 rounded">
              {module.frequency_hz[0]}Hz
            </span>
          )}
        </div>
      </div>
      
      <h3 className="text-sm font-medium text-purple-200 mb-2 line-clamp-2">
        {module.name}
      </h3>
      
      <div className="flex flex-wrap gap-1 mb-2">
        {module.tags.slice(0, 3).map(tag => (
          <span key={tag} className="text-xs px-2 py-1 bg-purple-800/30 text-purple-200 rounded">
            {tag}
          </span>
        ))}
      </div>
      
      <div className="text-xs text-gray-500 flex justify-between">
        <span>{module.system}</span>
        <span>{module.status}</span>
      </div>
      
      {!isAccessible && module.breath_sync.zlambda_min > coherenceState.lambda && (
        <div className="mt-2 text-xs text-yellow-400">
          Requires Zλ ≥ {module.breath_sync.zlambda_min}
        </div>
      )}
      
      {/* Three-CTA Pattern */}
      <div className="mt-3 flex gap-2">
        <button
          onClick={handleOpen}
          className="flex-1 px-3 py-1 text-xs rounded transition-colors bg-purple-600 hover:bg-purple-500 text-white"
        >
          {module.broken ? 'Docs' : 'Enter'}
        </button>
        
        <button
          onClick={handleInfo}
          className="px-3 py-1 text-xs rounded bg-blue-600 hover:bg-blue-500 text-white transition-colors"
        >
          Reflect
        </button>
        
        <button
          onClick={handleDocs}
          className="px-3 py-1 text-xs rounded bg-gray-600 hover:bg-gray-500 text-white transition-colors"
        >
          Document
        </button>
      </div>
    </div>

    {/* Info Modal */}
    {showInfo && (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={() => setShowInfo(false)}>
        <div className="bg-gray-900 border border-purple-400/20 rounded-lg p-6 max-w-md w-full mx-4" onClick={e => e.stopPropagation()}>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold text-purple-200">{module.name}</h3>
            <button onClick={() => setShowInfo(false)} className="text-gray-400 hover:text-white">✕</button>
          </div>
          
          <div className="space-y-3 text-sm">
            <div>
              <span className="text-purple-300">System:</span> <span className="text-white">{module.system}</span>
            </div>
            <div>
              <span className="text-purple-300">Route:</span> <span className="text-cyan-400">{module.route}</span>
            </div>
            <div>
              <span className="text-purple-300">Action:</span> <span className="text-white">{module.action}</span>
            </div>
            <div>
              <span className="text-purple-300">Status:</span> 
              <span className={`ml-2 px-2 py-1 rounded text-xs ${
                module.broken ? 'bg-red-800 text-red-200' : 'bg-green-800 text-green-200'
              }`}>
                {module.status}
              </span>
            </div>
            <div>
              <span className="text-purple-300">Coherence Gate:</span> <span className="text-yellow-400">Zλ≥{module.breath_sync.zlambda_min}</span>
            </div>
            <div>
              <span className="text-purple-300">Frequencies:</span> <span className="text-cyan-400">{module.frequency_hz.join(', ')}Hz</span>
            </div>
            <div>
              <span className="text-purple-300">Glyphs:</span> <span className="text-white">{module.glyphs.join(' ')}</span>
            </div>
            {module.tags.length > 0 && (
              <div>
                <span className="text-purple-300">Tags:</span>
                <div className="flex flex-wrap gap-1 mt-1">
                  {module.tags.map(tag => (
                    <span key={tag} className="px-2 py-1 bg-purple-800/30 text-purple-200 rounded text-xs">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
          
          <div className="mt-4 flex gap-2">
            <button
              onClick={handleOpen}
              className="flex-1 px-4 py-2 bg-purple-600 hover:bg-purple-500 text-white rounded transition-colors"
            >
              {module.broken ? 'View Docs' : 'Open Module'}
            </button>
            <button
              onClick={handleDocs}
              className="px-4 py-2 bg-gray-600 hover:bg-gray-500 text-white rounded transition-colors"
            >
              Documentation
            </button>
          </div>
        </div>
      </div>
    )}
    </>
  );
}

export default UnifiedConsciousnessInterface;