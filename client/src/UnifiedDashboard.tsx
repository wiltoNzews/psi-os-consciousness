import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useQuery } from '@tanstack/react-query';

interface ModuleInfo {
  id: string;
  name: string;
  description: string;
  category: string;
  icon: string;
  url: string;
  available: boolean;
  status?: 'active' | 'broken' | 'orphaned' | 'legacy';
  size?: number;
  routes?: number;
}

interface DependencyGraph {
  modules: Array<{
    id: string;
    name: string;
    status: string;
    category: string;
    size: number;
    routes: string[];
    buildable: boolean;
    errors: string[];
  }>;
  orphans: string[];
  brokenRoutes: string[];
  recommendations: string[];
  totalSize: number;
  lastScan: string;
}

const UnifiedDashboard: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [activeModule, setActiveModule] = useState<string | null>(null);

  // Fetch module discovery data
  const { data: modules = [], isLoading: modulesLoading } = useQuery<ModuleInfo[]>({
    queryKey: ['/api/modules/discover'],
  });

  // Fetch dependency graph
  const { data: dependencyData, isLoading: depLoading } = useQuery<DependencyGraph>({
    queryKey: ['/api/dependency-graph'],
  });

  // Merge module discovery with dependency analysis
  const enrichedModules = modules.map(module => {
    const depModule = dependencyData?.modules.find(dep => 
      dep.name.toLowerCase().includes(module.name.toLowerCase()) ||
      dep.id.includes(module.id)
    );
    
    return {
      ...module,
      status: depModule?.status || 'active',
      size: depModule?.size,
      routes: depModule?.routes?.length || 0,
      buildable: depModule?.buildable ?? true,
      errors: depModule?.errors || []
    };
  });

  // Get unique categories
  const categories = ['all', ...new Set(modules.map(m => m.category))];

  // Filter modules
  const filteredModules = enrichedModules.filter(module => {
    const matchesSearch = module.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         module.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || module.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  // Group modules by category
  const groupedModules = filteredModules.reduce((acc, module) => {
    if (!acc[module.category]) acc[module.category] = [];
    acc[module.category].push(module);
    return acc;
  }, {} as Record<string, ModuleInfo[]>);

  const handleModuleClick = (module: ModuleInfo) => {
    if (!module.available) return;
    
    console.log(`[WiltonOS] Opening module: ${module.name} at ${module.url}`);
    
    if (module.url.startsWith('http')) {
      // External URL
      window.open(module.url, '_blank');
    } else if (module.url.startsWith('/api/')) {
      // API endpoint - open in new tab to show JSON
      window.open(module.url, '_blank');
    } else if (module.url === '/') {
      // Root dashboard - reload current page
      window.location.reload();
    } else if (module.url === 'welcome') {
      // Special welcome route
      window.open('/welcome', '_blank');
    } else {
      // HTML file or path - ensure proper URL formatting
      const cleanUrl = module.url.startsWith('/') ? module.url : `/${module.url}`;
      window.open(cleanUrl, '_blank');
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-500';
      case 'broken': return 'bg-red-500';
      case 'orphaned': return 'bg-gray-500';
      case 'legacy': return 'bg-yellow-500';
      default: return 'bg-blue-500';
    }
  };

  const getStatusEmoji = (status: string) => {
    switch (status) {
      case 'active': return '✅';
      case 'broken': return '❌';
      case 'orphaned': return '🏴';
      case 'legacy': return '⚠️';
      default: return '🔵';
    }
  };

  if (modulesLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 flex items-center justify-center">
        <div className="text-center text-slate-300">
          <div className="text-6xl mb-4">⚡</div>
          <div className="text-xl">Initializing WiltonOS...</div>
          <div className="text-sm text-slate-500 mt-2">Loading unified dashboard</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        
        {/* Header */}
        <Card className="bg-slate-800/80 border-slate-700 backdrop-filter blur-20">
          <CardHeader>
            <CardTitle className="text-center text-3xl font-light text-slate-100 flex items-center justify-center gap-4">
              <span className="text-5xl">🔮</span>
              WiltonOS Unified Dashboard
              <Badge variant="outline" className="bg-blue-600 text-white border-none">
                {modules.length} Modules
              </Badge>
            </CardTitle>
            <p className="text-center text-slate-400">
              Sistema Operacional Simbólico • Sacred Geometry • Consciousness Interface
            </p>
          </CardHeader>
        </Card>

        {/* Visual Theater Controls */}
        <Card className="bg-gradient-to-r from-purple-900/80 to-blue-900/80 border-purple-700">
          <CardHeader>
            <CardTitle className="text-purple-300 flex items-center gap-3">
              <span className="text-2xl">🎭</span>
              Visual Theater Controls
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Button
                onClick={() => handleModuleClick({
                  id: 'teatro-visual',
                  name: 'Teatro Visual',
                  description: 'Controles avançados & QCI',
                  category: 'Visual Theater',
                  icon: '🎭',
                  url: 'teatro-visual.html',
                  available: true
                })}
                className="bg-purple-600 hover:bg-purple-700 text-white h-16 text-lg"
              >
                <div className="flex items-center gap-3">
                  <span className="text-2xl">🎭</span>
                  <div className="text-left">
                    <div>Teatro Visual</div>
                    <div className="text-sm opacity-80">Basic Interface</div>
                  </div>
                </div>
              </Button>
              
              <Button
                onClick={() => handleModuleClick({
                  id: 'teatro-visual-advanced',
                  name: 'Teatro Visual Avançado',
                  description: 'Interface completa com controles',
                  category: 'Visual Theater',
                  icon: '🎨',
                  url: 'teatro-visual/index.html',
                  available: true
                })}
                className="bg-blue-600 hover:bg-blue-700 text-white h-16 text-lg"
              >
                <div className="flex items-center gap-3">
                  <span className="text-2xl">🎨</span>
                  <div className="text-left">
                    <div>Teatro Avançado</div>
                    <div className="text-sm opacity-80">Full Controls</div>
                  </div>
                </div>
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Controls */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="bg-slate-800/80 border-slate-700">
            <CardContent className="p-4">
              <Input
                placeholder="Search modules..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="bg-slate-900/60 border-slate-600 text-slate-100"
              />
            </CardContent>
          </Card>
          
          <Card className="bg-slate-800/80 border-slate-700">
            <CardContent className="p-4">
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full bg-slate-900/60 border border-slate-600 rounded-md px-3 py-2 text-slate-100"
              >
                {categories.map(cat => (
                  <option key={cat} value={cat}>
                    {cat === 'all' ? 'All Categories' : cat}
                  </option>
                ))}
              </select>
            </CardContent>
          </Card>

          <Card className="bg-slate-800/80 border-slate-700">
            <CardContent className="p-4 flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => window.location.reload()}
                className="flex-1 border-slate-600"
              >
                Refresh
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => window.open('/welcome', '_blank')}
                className="flex-1 border-slate-600"
              >
                Welcome Portal
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <Tabs defaultValue="modules" className="space-y-4">
          <TabsList className="grid w-full grid-cols-3 bg-slate-800">
            <TabsTrigger value="modules">Modules</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
            <TabsTrigger value="system">System</TabsTrigger>
          </TabsList>

          <TabsContent value="modules" className="space-y-6">
            {Object.entries(groupedModules).map(([category, categoryModules]) => (
              <Card key={category} className="bg-slate-800/80 border-slate-700">
                <CardHeader>
                  <CardTitle className="text-slate-300 flex items-center gap-2">
                    {category}
                    <Badge variant="outline" className="text-xs">
                      {categoryModules.length}
                    </Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {categoryModules.map(module => (
                      <Card
                        key={module.id}
                        className={`cursor-pointer transition-all duration-200 border-slate-600 ${
                          module.available 
                            ? 'hover:bg-slate-700/50 hover:border-blue-500' 
                            : 'opacity-50 cursor-not-allowed'
                        }`}
                        onClick={() => handleModuleClick(module)}
                      >
                        <CardContent className="p-4">
                          <div className="flex items-start gap-3">
                            <div className="text-2xl">{module.icon}</div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2 mb-1">
                                <h3 className="font-medium text-slate-200 truncate">
                                  {module.name}
                                </h3>
                                <Badge
                                  variant="outline"
                                  className={`text-xs ${getStatusColor(module.status || 'active')} text-white border-none`}
                                >
                                  {getStatusEmoji(module.status || 'active')}
                                </Badge>
                              </div>
                              <p className="text-sm text-slate-400 line-clamp-2">
                                {module.description}
                              </p>
                              
                              {module.size && (
                                <div className="flex gap-4 text-xs text-slate-500 mt-2">
                                  <span>{(module.size / 1024).toFixed(1)}KB</span>
                                  {module.routes ? <span>{module.routes} routes</span> : null}
                                </div>
                              )}
                              
                              {module.errors && module.errors.length > 0 && (
                                <div className="mt-2">
                                  <Badge variant="destructive" className="text-xs">
                                    {module.errors.length} error{module.errors.length !== 1 ? 's' : ''}
                                  </Badge>
                                </div>
                              )}
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </TabsContent>

          <TabsContent value="analytics" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <Card className="bg-slate-800/80 border-slate-700">
                <CardContent className="p-4">
                  <div className="text-2xl font-bold text-green-400">
                    {enrichedModules.filter(m => m.status === 'active').length}
                  </div>
                  <div className="text-sm text-slate-400">Active Modules</div>
                </CardContent>
              </Card>
              
              <Card className="bg-slate-800/80 border-slate-700">
                <CardContent className="p-4">
                  <div className="text-2xl font-bold text-red-400">
                    {enrichedModules.filter(m => m.status === 'broken').length}
                  </div>
                  <div className="text-sm text-slate-400">Broken Modules</div>
                </CardContent>
              </Card>
              
              <Card className="bg-slate-800/80 border-slate-700">
                <CardContent className="p-4">
                  <div className="text-2xl font-bold text-yellow-400">
                    {enrichedModules.filter(m => m.status === 'legacy').length}
                  </div>
                  <div className="text-sm text-slate-400">Legacy Modules</div>
                </CardContent>
              </Card>
              
              <Card className="bg-slate-800/80 border-slate-700">
                <CardContent className="p-4">
                  <div className="text-2xl font-bold text-slate-400">
                    {enrichedModules.filter(m => m.status === 'orphaned').length}
                  </div>
                  <div className="text-sm text-slate-400">Orphaned Modules</div>
                </CardContent>
              </Card>
            </div>

            {dependencyData && (
              <Card className="bg-slate-800/80 border-slate-700">
                <CardHeader>
                  <CardTitle className="text-slate-300">System Recommendations</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {dependencyData.recommendations.map((rec, idx) => (
                      <div key={idx} className="flex items-center gap-2 text-sm text-slate-400">
                        <span className="text-amber-400">⚠️</span>
                        {rec}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="system" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="bg-slate-800/80 border-slate-700">
                <CardHeader>
                  <CardTitle className="text-slate-300">Quick Actions</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Button 
                    variant="outline" 
                    className="w-full justify-start border-slate-600"
                    onClick={() => window.open('/lightning-broadcast.html', '_blank')}
                  >
                    ⚡ Lightning Broadcast Mirror
                  </Button>
                  <Button 
                    variant="outline" 
                    className="w-full justify-start border-slate-600"
                    onClick={() => window.open('/mirror.html', '_blank')}
                  >
                    🪞 Quantum Mirror
                  </Button>
                  <Button 
                    variant="outline" 
                    className="w-full justify-start border-slate-600"
                    onClick={() => window.open('/safety-testing-interface.html', '_blank')}
                  >
                    ⚖️ Safety Testing
                  </Button>
                </CardContent>
              </Card>

              <Card className="bg-slate-800/80 border-slate-700">
                <CardHeader>
                  <CardTitle className="text-slate-300">System Status</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Total Modules</span>
                    <span className="text-slate-200">{modules.length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Available</span>
                    <span className="text-green-400">{modules.filter(m => m.available).length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Categories</span>
                    <span className="text-blue-400">{categories.length - 1}</span>
                  </div>
                  {dependencyData && (
                    <div className="flex justify-between">
                      <span className="text-slate-400">Total Size</span>
                      <span className="text-slate-200">
                        {(dependencyData.totalSize / 1024 / 1024).toFixed(2)} MB
                      </span>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default UnifiedDashboard;