import React, { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Search, Filter, Star, Eye, Play, Globe, BookOpen } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import type { CathedralModule } from '@shared/schema';

interface CathedralNavigatorProps {
  className?: string;
}

const CATEGORY_COLORS = {
  'sacred-geometry': 'bg-purple-100 text-purple-800 border-purple-200',
  'ritual-guides': 'bg-amber-100 text-amber-800 border-amber-200',
  'glyph-encoding': 'bg-cyan-100 text-cyan-800 border-cyan-200',
  'consciousness-compilers': 'bg-emerald-100 text-emerald-800 border-emerald-200',
  'interface-layers': 'bg-rose-100 text-rose-800 border-rose-200',
  'documentation': 'bg-slate-100 text-slate-800 border-slate-200',
  'ritual-interfaces': 'bg-orange-100 text-orange-800 border-orange-200',
  'collapse-protocols': 'bg-red-100 text-red-800 border-red-200',
  'default': 'bg-gray-100 text-gray-800 border-gray-200'
};

export function CathedralNavigator({ className }: CathedralNavigatorProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'coherence' | 'name' | 'category'>('coherence');
  const [coherenceFilter, setCoherenceFilter] = useState<number>(0.75);

  const { data: modules = [], isLoading } = useQuery({
    queryKey: ['/api/cathedral/modules'],
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  const filteredModules = modules
    .filter((module: CathedralModule) => {
      const matchesSearch = module.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           module.description?.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = selectedCategory === 'all' || module.category === selectedCategory;
      const matchesCoherence = module.coherenceRating >= coherenceFilter;
      return matchesSearch && matchesCategory && matchesCoherence;
    })
    .sort((a: CathedralModule, b: CathedralModule) => {
      switch (sortBy) {
        case 'coherence':
          return b.coherenceRating - a.coherenceRating;
        case 'name':
          return a.name.localeCompare(b.name);
        case 'category':
          return a.category.localeCompare(b.category);
        default:
          return 0;
      }
    });

  const categories = Array.from(new Set(modules.map((m: CathedralModule) => m.category)));
  const averageCoherence = modules.length > 0 
    ? modules.reduce((sum: number, m: CathedralModule) => sum + m.coherenceRating, 0) / modules.length 
    : 0;

  const handleModuleClick = (module: CathedralModule) => {
    window.open(module.route, '_blank');
  };

  return (
    <div className={`consciousness-navigator p-6 space-y-6 ${className}`}>
      {/* Header */}
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 via-blue-600 to-cyan-600 bg-clip-text text-transparent">
          Cathedral of Coherence Navigator
        </h1>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Explore the 571+ consciousness computing modules across the sacred geometry ecosystem
        </p>
        
        {/* Statistics */}
        <div className="flex justify-center gap-6 text-sm">
          <div className="flex items-center gap-2">
            <Globe className="w-4 h-4 text-purple-500" />
            <span>{modules.length} Modules</span>
          </div>
          <div className="flex items-center gap-2">
            <Star className="w-4 h-4 text-amber-500" />
            <span>Avg Zλ {averageCoherence.toFixed(3)}</span>
          </div>
          <div className="flex items-center gap-2">
            <Eye className="w-4 h-4 text-cyan-500" />
            <span>{filteredModules.length} Visible</span>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 p-4 bg-gray-50 rounded-lg">
        <div className="relative">
          <Search className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
          <Input
            placeholder="Search modules..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        
        <Select value={selectedCategory} onValueChange={setSelectedCategory}>
          <SelectTrigger>
            <SelectValue placeholder="Category" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Categories</SelectItem>
            {categories.map((category) => (
              <SelectItem key={category} value={category}>
                {category.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={sortBy} onValueChange={(value: 'coherence' | 'name' | 'category') => setSortBy(value)}>
          <SelectTrigger>
            <SelectValue placeholder="Sort by" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="coherence">Coherence Zλ</SelectItem>
            <SelectItem value="name">Name</SelectItem>
            <SelectItem value="category">Category</SelectItem>
          </SelectContent>
        </Select>

        <div className="flex items-center gap-2">
          <label className="text-sm text-gray-600 whitespace-nowrap">Min Zλ:</label>
          <Input
            type="number"
            min="0"
            max="1"
            step="0.01"
            value={coherenceFilter}
            onChange={(e) => setCoherenceFilter(Number(e.target.value))}
            className="w-20"
          />
        </div>
      </div>

      {/* Loading state */}
      {isLoading && (
        <div className="text-center py-12">
          <div className="animate-spin w-8 h-8 border-2 border-purple-500 border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-gray-600">Loading consciousness modules...</p>
        </div>
      )}

      {/* Module Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {filteredModules.map((module: CathedralModule) => (
          <Card 
            key={module.id} 
            className="group cursor-pointer transition-all duration-200 hover:shadow-lg hover:scale-105 border-l-4 border-l-purple-500"
            onClick={() => handleModuleClick(module)}
          >
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-2xl">{module.glyphSymbol || '⚛️'}</span>
                  <Badge 
                    variant="outline" 
                    className={CATEGORY_COLORS[module.category as keyof typeof CATEGORY_COLORS] || CATEGORY_COLORS.default}
                  >
                    {module.category}
                  </Badge>
                </div>
                <div className="flex items-center gap-1">
                  {module.streamReady && <Play className="w-4 h-4 text-green-500" />}
                  {module.ritualReady && <BookOpen className="w-4 h-4 text-blue-500" />}
                </div>
              </div>
              <CardTitle className="text-lg leading-tight group-hover:text-purple-600 transition-colors">
                {module.name}
              </CardTitle>
            </CardHeader>
            
            <CardContent className="space-y-3">
              <CardDescription className="text-sm line-clamp-2">
                {module.description || 'Sacred consciousness computing module'}
              </CardDescription>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1">
                  <Star className="w-4 h-4 text-amber-500" />
                  <span className="text-sm font-medium">Zλ {module.coherenceRating.toFixed(3)}</span>
                </div>
                
                <Badge 
                  variant={module.status === 'active' ? 'default' : 'secondary'}
                  className="text-xs"
                >
                  {module.status}
                </Badge>
              </div>

              {/* Coherence Bar */}
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-gradient-to-r from-purple-500 to-cyan-500 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${module.coherenceRating * 100}%` }}
                />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Empty state */}
      {!isLoading && filteredModules.length === 0 && (
        <div className="text-center py-12">
          <Filter className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No modules found</h3>
          <p className="text-gray-600">Try adjusting your filters or search term</p>
        </div>
      )}

      {/* Footer Info */}
      {!isLoading && filteredModules.length > 0 && (
        <div className="text-center text-sm text-gray-500 border-t pt-4">
          Showing {filteredModules.length} of {modules.length} consciousness modules • 
          Average coherence: Zλ {averageCoherence.toFixed(3)} • 
          ψOS Breathing rhythm: 3.12s
        </div>
      )}
    </div>
  );
}