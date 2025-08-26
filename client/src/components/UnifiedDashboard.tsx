import React, { Suspense, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { MODULE_REGISTRY, MODULE_CATEGORIES, getModulesByCategory, type WiltonModule } from '@/core/ModuleRegistryFixed';

const UnifiedDashboard: React.FC = () => {
  const [selectedModule, setSelectedModule] = useState<WiltonModule | null>(null);
  const [filter, setFilter] = useState<string>('all');

  const getFilteredModules = () => {
    if (filter === 'all') return Object.values(MODULE_REGISTRY);
    return getModulesByCategory(filter as any);
  };

  const renderModuleCard = (module: WiltonModule) => {
    const categoryInfo = MODULE_CATEGORIES[module.category];
    const isExternal = module.status === 'external';
    const isBroken = module.status === 'broken';
    
    return (
      <Card 
        key={module.id} 
        className={`cursor-pointer transition-all hover:scale-105 ${
          isBroken ? 'bg-red-900/20 border-red-500/30' :
          isExternal ? 'bg-orange-900/20 border-orange-500/30' :
          'bg-gray-900/20 border-gray-500/30 hover:border-blue-500/50'
        }`}
        onClick={() => {
          if (isExternal && module.externalUrl) {
            window.open(module.externalUrl, '_blank');
          } else if (module.component) {
            setSelectedModule(module);
          }
        }}
      >
        <CardHeader className="pb-3">
          <CardTitle className="text-sm flex items-center gap-2">
            <span className="text-lg">{module.icon}</span>
            <div className="flex-1">
              <div className="text-white">{module.name}</div>
              <div className="text-xs text-gray-400">{module.description}</div>
            </div>
            <div className="flex flex-col items-end gap-1">
              <span 
                className={`text-xs px-2 py-1 rounded text-${categoryInfo.color}-300 bg-${categoryInfo.color}-900/30`}
              >
                {categoryInfo.name}
              </span>
              {module.coherenceRequired && (
                <span className="text-xs text-purple-300">
                  Zλ≥{module.coherenceRequired}
                </span>
              )}
            </div>
          </CardTitle>
        </CardHeader>
        
        {isBroken && (
          <CardContent className="pt-0">
            <div className="text-red-300 text-xs bg-red-900/20 p-2 rounded">
              Module requires repair
            </div>
          </CardContent>
        )}
        
        {isExternal && (
          <CardContent className="pt-0">
            <div className="text-orange-300 text-xs bg-orange-900/20 p-2 rounded">
              External interface - opens in new window
            </div>
          </CardContent>
        )}
      </Card>
    );
  };

  if (selectedModule) {
    const ModuleComponent = selectedModule.component;
    
    return (
      <div className="min-h-screen">
        <div className="fixed top-4 left-4 z-50">
          <Button
            onClick={() => setSelectedModule(null)}
            className="bg-blue-600 hover:bg-blue-700"
          >
            ← Back to Dashboard
          </Button>
        </div>
        
        <Suspense fallback={
          <div className="min-h-screen flex items-center justify-center bg-gray-900">
            <div className="text-white text-xl">Loading {selectedModule.name}...</div>
          </div>
        }>
          {ModuleComponent && <ModuleComponent />}
        </Suspense>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        
        {/* Header */}
        <Card className="bg-gray-800/80 backdrop-blur-lg border-gray-700">
          <CardHeader>
            <CardTitle className="text-center text-4xl text-white">
              <span className="text-5xl mr-4">🏠</span>
              WiltonOS Unified Dashboard
            </CardTitle>
            <div className="text-center text-gray-300 mt-2">
              Quantum Coherence Interface • Sacred Architecture Command Center
            </div>
          </CardHeader>
        </Card>

        {/* Filter Tabs */}
        <Card className="bg-gray-800/80 border-gray-700">
          <CardContent className="p-4">
            <div className="flex flex-wrap gap-2 justify-center">
              <Button
                onClick={() => setFilter('all')}
                variant={filter === 'all' ? 'default' : 'outline'}
                className="text-sm"
              >
                All Modules
              </Button>
              {Object.entries(MODULE_CATEGORIES).map(([key, category]) => (
                <Button
                  key={key}
                  onClick={() => setFilter(key)}
                  variant={filter === key ? 'default' : 'outline'}
                  className={`text-sm border-${category.color}-500 text-${category.color}-300`}
                >
                  {category.name}
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Module Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {getFilteredModules().map(renderModuleCard)}
        </div>

        {/* Status Summary */}
        <Card className="bg-gray-800/80 border-gray-700">
          <CardHeader>
            <CardTitle className="text-gray-300">System Status</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
              <div className="space-y-1">
                <div className="text-2xl font-bold text-green-400">
                  {Object.values(MODULE_REGISTRY).filter(m => m.status === 'active').length}
                </div>
                <div className="text-green-300 text-sm">Active</div>
              </div>
              
              <div className="space-y-1">
                <div className="text-2xl font-bold text-orange-400">
                  {Object.values(MODULE_REGISTRY).filter(m => m.status === 'external').length}
                </div>
                <div className="text-orange-300 text-sm">External</div>
              </div>
              
              <div className="space-y-1">
                <div className="text-2xl font-bold text-gray-400">
                  {Object.values(MODULE_REGISTRY).filter(m => m.status === 'legacy').length}
                </div>
                <div className="text-gray-300 text-sm">Legacy</div>
              </div>
              
              <div className="space-y-1">
                <div className="text-2xl font-bold text-red-400">
                  {Object.values(MODULE_REGISTRY).filter(m => m.status === 'broken').length}
                </div>
                <div className="text-red-300 text-sm">Broken</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card className="bg-gray-800/80 border-gray-700">
          <CardHeader>
            <CardTitle className="text-gray-300">Quick Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Button
                onClick={() => {
                  const geometry = MODULE_REGISTRY['geometry3d'];
                  if (geometry) setSelectedModule(geometry);
                }}
                className="bg-purple-600 hover:bg-purple-700 justify-start"
              >
                <span className="mr-2">🔮</span>
                Launch Sacred Geometry
              </Button>
              
              <Button
                onClick={() => {
                  const theater = MODULE_REGISTRY['visual-theater'];
                  if (theater) setSelectedModule(theater);
                }}
                className="bg-blue-600 hover:bg-blue-700 justify-start"
              >
                <span className="mr-2">🎭</span>
                Open Visual Theater
              </Button>
              
              <Button
                onClick={() => {
                  const consensus = MODULE_REGISTRY['ai-consensus'];
                  if (consensus) setSelectedModule(consensus);
                }}
                className="bg-green-600 hover:bg-green-700 justify-start"
              >
                <span className="mr-2">🧠</span>
                AI Consensus Engine
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default UnifiedDashboard;