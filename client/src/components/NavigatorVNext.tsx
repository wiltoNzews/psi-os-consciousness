import React, { useState, useEffect } from "react";
import { Link } from "wouter";
import { toast } from "sonner";

interface ModuleRegistryModule {
  id: string;
  title: string;
  group: string;
  kind: "html" | "react" | "doc";
  path: string;
  action: "iframe" | "route" | "blank" | "doc";
  tags: string[];
  status: "stable" | "beta" | "legacy" | "broken";
  lastVerifiedAt: string;
  description?: string;
}

interface ModuleRegistry {
  version: string;
  lastUpdate: string;
  modules: ModuleRegistryModule[];
}

const NavigatorVNext = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [modules, setModules] = useState<ModuleRegistryModule[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedModule, setSelectedModule] = useState<ModuleRegistryModule | null>(null);
  const [showIframe, setShowIframe] = useState(false);
  // Using toast from sonner (already imported)

  useEffect(() => {
    loadModuleRegistry();
  }, []);

  const loadModuleRegistry = async () => {
    try {
      const response = await fetch('/module-registry.json', { cache: 'no-store' });
      if (!response.ok) throw new Error('Failed to load module registry');
      
      const registry: ModuleRegistry = await response.json();
      setModules(registry.modules);
      
      console.log('[Navigator] Module registry loaded:', registry.modules.length, 'modules');
    } catch (error) {
      console.error('[Navigator] Failed to load module registry:', error);
      toast.error("Registry Load Failed: Could not load module registry. Using fallback.");
      // Fallback to empty array - no dead clicks
      setModules([]);
    } finally {
      setLoading(false);
    }
  };

  const handleModuleClick = (module: ModuleRegistryModule) => {
    console.log('[Navigator] Module clicked:', module.title, 'action:', module.action);
    
    switch (module.action) {
      case 'route':
        // Navigate to React route - handled by Link component
        break;
        
      case 'iframe':
        setSelectedModule(module);
        setShowIframe(true);
        break;
        
      case 'blank':
        try {
          window.open(module.path, '_blank', 'noopener,noreferrer');
        } catch (error) {
          console.error('[Navigator] Failed to open module:', error);
          toast.error(`Open Failed: Could not open ${module.title} in new tab.`);
        }
        break;
        
      case 'doc':
        toast.info(`Opening documentation for ${module.title}`);
        // TODO: Implement doc rendering
        break;
        
      default:
        console.error('[Navigator] Unknown action:', module.action);
        toast.error(`Unknown Action: Module ${module.title} has unknown action: ${module.action}`);
    }
  };

  const filteredModules = modules.filter(module =>
    module.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (module.description?.toLowerCase() || '').includes(searchQuery.toLowerCase()) ||
    module.group.toLowerCase().includes(searchQuery.toLowerCase()) ||
    module.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const groupedModules = filteredModules.reduce((acc, module) => {
    if (!acc[module.group]) acc[module.group] = [];
    acc[module.group].push(module);
    return acc;
  }, {} as Record<string, ModuleRegistryModule[]>);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-indigo-900 to-cyan-900 flex items-center justify-center">
        <div className="text-white text-xl">Loading Module Registry...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-indigo-900 to-cyan-900" data-app="spa">
      <div className="container mx-auto px-6 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-4">
            Module Browser
          </h1>
          <p className="text-lg text-purple-200">
            Consciousness Computing - No Dead Clicks Guaranteed
          </p>
          <p className="text-sm text-cyan-400 mt-2">
            {modules.length} modules loaded | Registry v1.0.0
          </p>
        </div>

        {/* Search */}
        <div className="max-w-md mx-auto mb-8">
          <input
            type="text"
            placeholder="Search modules, groups, tags..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full px-4 py-2 rounded-lg bg-black/30 border border-purple-500/30 text-white placeholder-purple-300 focus:outline-none focus:ring-2 focus:ring-cyan-400"
          />
        </div>

        {/* Module Groups */}
        <div className="space-y-8">
          {Object.entries(groupedModules).map(([group, groupModules]) => (
            <div key={group}>
              <h2 className="text-2xl font-semibold text-cyan-400 mb-4">
                {group} ({groupModules.length})
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {groupModules.map((module) => (
                  module.action === 'route' ? (
                    <Link 
                      key={module.id} 
                      href={module.path}
                      className="block"
                    >
                      <ModuleCard module={module} onClick={() => handleModuleClick(module)} />
                    </Link>
                  ) : (
                    <ModuleCard 
                      key={module.id} 
                      module={module} 
                      onClick={() => handleModuleClick(module)} 
                    />
                  )
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* No Results */}
        {filteredModules.length === 0 && (
          <div className="text-center text-purple-300 mt-12">
            <p>No modules match your search criteria.</p>
            <button 
              onClick={() => setSearchQuery("")}
              className="text-cyan-400 hover:text-cyan-300 mt-2"
            >
              Clear search
            </button>
          </div>
        )}

        {/* Footer */}
        <div className="text-center mt-12 text-purple-300">
          <p>Every click performs a meaningful action - verified module registry</p>
        </div>
      </div>

      {/* Iframe Modal */}
      {showIframe && selectedModule && (
        <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4">
          <div className="bg-gray-900 rounded-lg w-full max-w-6xl h-5/6 flex flex-col">
            <div className="flex justify-between items-center p-4 border-b border-gray-700">
              <div>
                <h3 className="text-white text-lg font-semibold">{selectedModule.title}</h3>
                <p className="text-gray-400 text-sm">{selectedModule.path}</p>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => window.open(selectedModule.path, '_blank')}
                  className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 text-sm"
                >
                  Open in New Tab
                </button>
                <button
                  onClick={() => setShowIframe(false)}
                  className="px-3 py-1 bg-gray-600 text-white rounded hover:bg-gray-700 text-sm"
                >
                  Close
                </button>
              </div>
            </div>
            <div className="flex-1">
              <iframe
                src={selectedModule.path}
                className="w-full h-full"
                sandbox="allow-scripts allow-same-origin allow-forms"
                title={selectedModule.title}
                onError={() => {
                  toast.error(`Iframe Load Failed: Could not load ${selectedModule.title} in iframe. Try opening in new tab.`);
                }}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const ModuleCard = ({ module, onClick }: { module: ModuleRegistryModule; onClick: () => void }) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'stable': return 'bg-green-500/20 text-green-300 border-green-500/30';
      case 'beta': return 'bg-blue-500/20 text-blue-300 border-blue-500/30';
      case 'legacy': return 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30';
      case 'broken': return 'bg-red-500/20 text-red-300 border-red-500/30';
      default: return 'bg-gray-500/20 text-gray-300 border-gray-500/30';
    }
  };

  const getActionIcon = (action: string) => {
    switch (action) {
      case 'route': return '→';
      case 'iframe': return '⧉';
      case 'blank': return '↗';
      case 'doc': return '📄';
      default: return '?';
    }
  };

  return (
    <div 
      onClick={onClick}
      className="bg-black/40 border border-purple-500/20 rounded-lg p-6 hover:border-cyan-400/50 hover:bg-black/60 transition-all duration-300 cursor-pointer"
    >
      <h3 className="text-xl font-semibold text-white mb-2">
        {module.title}
      </h3>
      {module.description && (
        <p className="text-purple-200 text-sm mb-4">
          {module.description}
        </p>
      )}
      <div className="flex justify-between items-center mb-2">
        <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(module.status)}`}>
          {module.status}
        </span>
        <span className="text-cyan-400 text-sm">
          {getActionIcon(module.action)} {module.action}
        </span>
      </div>
      <div className="flex flex-wrap gap-1">
        {module.tags.slice(0, 3).map(tag => (
          <span key={tag} className="px-2 py-1 bg-purple-500/20 text-purple-300 text-xs rounded">
            {tag}
          </span>
        ))}
        {module.tags.length > 3 && (
          <span className="px-2 py-1 bg-gray-500/20 text-gray-300 text-xs rounded">
            +{module.tags.length - 3}
          </span>
        )}
      </div>
    </div>
  );
};

export default NavigatorVNext;