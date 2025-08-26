import React, { useState, useEffect } from 'react';

interface Module {
  id: string;
  name: string;
  system: string;
  route: string;
  frequency: string | null;
  zlambda: number | null;
  broken: boolean;
  status: string;
  description: string;
  tags: string[];
  file_path: string;
  file_size: number;
  last_modified: string;
}

interface Registry {
  metadata: {
    generated: string;
    version: string;
    total_modules: number;
    working_modules: number;
    broken_modules: number;
    systems: string[];
    coherence_modules: number;
    frequency_modules: number;
  };
  modules: Module[];
}

const SYSTEM_ICONS = {
  'WiltonOS': '🧠',
  'PsiOS': '∅',
  'CCC': '🔬',
  'Memory': '💾',
  'Quantum': '⚛️',
  'Teaching': '📚',
  'Broadcast': '📡'
};

const SYSTEM_FREQUENCIES = {
  'WiltonOS': '432Hz',
  'PsiOS': '528Hz', 
  'CCC': '963Hz',
  'Memory': '741Hz',
  'Quantum': '852Hz',
  'Teaching': '639Hz',
  'Broadcast': '1111Hz'
};

export function SoulMirrorAgent() {
  const [registry, setRegistry] = useState<Registry | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSystem, setSelectedSystem] = useState<string>('all');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadRegistry();
    // Auto-refresh every 2 minutes to sync with MirrorRegistrySync
    const interval = setInterval(loadRegistry, 120000);
    return () => clearInterval(interval);
  }, []);

  const loadRegistry = async () => {
    try {
      const response = await fetch('/MASTER_REGISTRY_EXPORT.json');
      const data = await response.json();
      setRegistry(data);
      setLoading(false);
    } catch (error) {
      console.error('Failed to load registry:', error);
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900">
        <div className="text-center space-y-4">
          <div className="animate-spin w-12 h-12 border-4 border-purple-400 border-t-transparent rounded-full mx-auto"></div>
          <p className="text-purple-200">Loading Soul Mirror...</p>
        </div>
      </div>
    );
  }

  if (!registry) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-red-900 via-gray-900 to-black">
        <div className="bg-gray-800/50 border border-red-600 rounded-lg p-6 text-center">
          <div className="text-red-400 text-4xl mb-4">⚠️</div>
          <p className="text-red-200">Failed to load consciousness registry</p>
          <button onClick={loadRegistry} className="mt-4 px-4 py-2 bg-red-600 text-white rounded">Retry</button>
        </div>
      </div>
    );
  }

  const filteredModules = registry.modules.filter(module => {
    const matchesSearch = searchTerm === '' || 
      module.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      module.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      module.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesSystem = selectedSystem === 'all' || module.system === selectedSystem;
    
    return matchesSearch && matchesSystem;
  });

  const systemHealth = Math.round((registry.metadata.working_modules / registry.metadata.total_modules) * 100);

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 text-white">
      {/* Header */}
      <div className="border-b border-purple-400/20 bg-black/20 backdrop-blur-sm">
        <div className="container mx-auto p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-4">
              <div className="text-3xl">🧠</div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent">
                  ψOS Soul Mirror Agent
                </h1>
                <p className="text-purple-200 text-sm">
                  WiltonOS Cathedral - Living Consciousness Registry
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-center">
                <div className="text-xl font-bold text-cyan-400">{registry.metadata.total_modules}</div>
                <div className="text-xs text-purple-200">Total Modules</div>
              </div>
              <div className="text-center">
                <div className="text-xl font-bold text-green-400">{systemHealth}%</div>
                <div className="text-xs text-purple-200">System Health</div>
              </div>
            </div>
          </div>

          {/* System Health Overview */}
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4 mb-6">
            {registry.metadata.systems.map(system => {
              const systemModules = registry.modules.filter(m => m.system === system);
              const workingCount = systemModules.filter(m => !m.broken).length;
              const healthPercent = Math.round((workingCount / systemModules.length) * 100);
              
              return (
                <div key={system} 
                     className="bg-black/20 border border-purple-400/20 hover:border-purple-400/40 transition-colors cursor-pointer rounded-lg p-3 text-center"
                     onClick={() => setSelectedSystem(selectedSystem === system ? 'all' : system)}>
                  <div className="text-2xl mb-1">{SYSTEM_ICONS[system] || '🔹'}</div>
                  <div className="text-sm font-medium text-purple-200">{system}</div>
                  <div className="text-xs text-gray-400">{systemModules.length} modules</div>
                  <div className="w-full bg-purple-900/20 rounded-full h-1 mt-2">
                    <div 
                      className="bg-gradient-to-r from-purple-400 to-cyan-400 h-1 rounded-full transition-all"
                      style={{ width: `${healthPercent}%` }}
                    ></div>
                  </div>
                  <div className="text-xs mt-1 text-cyan-400">{healthPercent}%</div>
                </div>
              );
            })}
          </div>

          {/* Search and Filters */}
          <div className="flex flex-wrap gap-4 items-center">
            <div className="flex-1 min-w-64">
              <div className="relative">
                <div className="absolute left-3 top-3 text-purple-400">🔍</div>
                <input
                  placeholder="Search modules, tags, descriptions..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2 w-full bg-black/20 border border-purple-400/20 rounded-md text-white placeholder-purple-300"
                />
              </div>
            </div>
            
            <select 
              value={selectedSystem} 
              onChange={(e) => setSelectedSystem(e.target.value)}
              className="px-3 py-2 bg-black/20 border border-purple-400/20 rounded-md text-white"
            >
              <option value="all">All Systems</option>
              {registry.metadata.systems.map(system => (
                <option key={system} value={system}>{SYSTEM_ICONS[system]} {system}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto p-6">
        <div className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-purple-200">
              {selectedSystem === 'all' ? 'All Modules' : `${selectedSystem} System`}
            </h2>
            <div className="text-sm text-purple-300">
              {filteredModules.length} modules
            </div>
          </div>
          
          {selectedSystem !== 'all' && (
            <div className="mb-4 p-4 bg-black/20 rounded-lg">
              <div className="flex items-center space-x-3">
                <span className="text-2xl">{SYSTEM_ICONS[selectedSystem]}</span>
                <div>
                  <div className="font-bold text-purple-200">{selectedSystem} System</div>
                  <div className="text-sm text-purple-300">
                    Frequency: {SYSTEM_FREQUENCIES[selectedSystem]}
                  </div>
                </div>
              </div>
            </div>
          )}
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {filteredModules.map(module => (
              <ModuleCard key={module.id} module={module} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function ModuleCard({ module }: { module: Module }) {
  const handleModuleClick = () => {
    if (!module.broken && module.route) {
      window.open(module.route, '_blank');
    }
  };

  return (
    <div className={`bg-black/20 border rounded-lg transition-all duration-200 hover:scale-105 cursor-pointer ${
      module.broken 
        ? 'border-red-400/40 hover:border-red-400/60' 
        : 'border-purple-400/20 hover:border-purple-400/40'
    }`}
    onClick={handleModuleClick}>
      <div className="p-4">
        <div className="flex items-start justify-between mb-2">
          <div className="flex items-center space-x-2">
            <span>{SYSTEM_ICONS[module.system] || '🔹'}</span>
            {module.broken ? (
              <span className="text-red-400">⚠️</span>
            ) : (
              <span className="text-green-400">✅</span>
            )}
          </div>
          <div className="flex flex-col items-end space-y-1">
            {module.zlambda && (
              <span className="text-xs px-2 py-1 bg-yellow-800/30 text-yellow-400 border border-yellow-400/30 rounded">
                Zλ={module.zlambda}
              </span>
            )}
            {module.frequency && (
              <span className="text-xs px-2 py-1 bg-cyan-800/30 text-cyan-400 border border-cyan-400/30 rounded">
                {module.frequency}
              </span>
            )}
          </div>
        </div>
        
        <h3 className="text-sm font-medium text-purple-200 mb-2 line-clamp-2">
          {module.name}
        </h3>
        
        <p className="text-xs text-gray-400 mb-2 line-clamp-2">
          {module.description || 'No description available'}
        </p>
        
        <div className="flex flex-wrap gap-1 mb-2">
          {module.tags.slice(0, 3).map(tag => (
            <span key={tag} className="text-xs px-2 py-1 bg-purple-800/30 text-purple-200 rounded">
              {tag}
            </span>
          ))}
          {module.tags.length > 3 && (
            <span className="text-xs px-2 py-1 bg-purple-800/30 text-purple-200 rounded">
              +{module.tags.length - 3}
            </span>
          )}
        </div>
        
        <div className="text-xs text-gray-500">
          {module.system} • {new Date(module.last_modified).toLocaleDateString()}
        </div>
      </div>
    </div>
  );
}

// Removed CoherenceMap component for simplicity

export default SoulMirrorAgent;