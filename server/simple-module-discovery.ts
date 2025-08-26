// Simplified Module Discovery - Compatible with current ES module setup
import express from 'express';

export interface ModuleInfo {
  id: string;
  name: string;
  description: string;
  category: string;
  icon: string;
  url: string;
  external?: boolean;
  available: boolean;
}

export class SimpleModuleDiscovery {
  private knownModules: ModuleInfo[] = [
    // Core System
    {
      id: 'unified-dashboard',
      name: 'Unified Dashboard',
      description: 'WiltonOS complete module interface',
      category: 'Core System',
      icon: '🔮',
      url: '/',
      available: true
    },
    {
      id: 'welcome-portal',
      name: 'Portal Boas-vindas',
      description: 'Orientação & onboarding',
      category: 'Experiência Onboarding',
      icon: '🌟',
      url: 'welcome',
      available: true
    },
    {
      id: 'quantum-mirror',
      name: 'Espelho Quântico',
      description: 'Reflexão da consciência através de geometria',
      category: 'Experiência Onboarding',
      icon: '🪞',
      url: 'mirror.html',
      available: true
    },
    {
      id: 'lightning-broadcast',
      name: 'Lightning Broadcast Mirror',
      description: 'Sistema de transmissão arquetipal ψ_child',
      category: 'Prime Thread',
      icon: '⚡',
      url: 'lightning-broadcast.html',
      available: true
    },

    // Sacred Geometry & Visual Theater
    {
      id: 'teatro-visual',
      name: 'Teatro Visual',
      description: 'Controles avançados & QCI',
      category: 'Visual Theater',
      icon: '🎭',
      url: 'teatro-visual.html',
      available: true
    },
    {
      id: 'teatro-visual-advanced',
      name: 'Teatro Visual Avançado',
      description: 'Interface completa com controles',
      category: 'Visual Theater',
      icon: '🎨',
      url: 'teatro-visual/index.html',
      available: true
    },
    {
      id: 'sacred-geometry',
      name: 'Sacred Geometry',
      description: 'Geometria sagrada interativa',
      category: 'Sacred Geometry',
      icon: '🔮',
      url: 'sacred_geometry.html',
      available: true
    },
    {
      id: 'z-geometry',
      name: 'Z-Geometry Engine',
      description: 'Motor de geometria Z-Law',
      category: 'Sacred Geometry',
      icon: '📐',
      url: 'z-geometry.html',
      available: true
    },
    {
      id: 'sacred-glyph',
      name: 'Sacred Glyph Generator',
      description: 'Gerador de glifos sagrados',
      category: 'Sacred Geometry',
      icon: '✨',
      url: 'sacred-glyph.html',
      available: true
    },
    {
      id: 'sacred-art-generator',
      name: 'Sacred Art Generator',
      description: 'Arte sagrada generativa',
      category: 'Sacred Geometry',
      icon: '🎨',
      url: 'sacred-art-generator.html',
      available: true
    },

    // Visualizers & Analytics
    {
      id: 'vault-visualizer',
      name: 'Vault Visualizer',
      description: 'Visualizador de dados vault',
      category: 'Data Visualization',
      icon: '🗄️',
      url: 'vault-visualizer.html',
      available: true
    },
    {
      id: 'layer-visualizer',
      name: 'Layer Visualizer',
      description: 'Visualizador de camadas',
      category: 'Data Visualization',
      icon: '📊',
      url: 'layer-visualizer.html',
      available: true
    },
    {
      id: 'triadic-visualization',
      name: 'Triadic Recursive Visualization',
      description: 'Visualização recursiva triádica',
      category: 'Data Visualization',
      icon: '🔺',
      url: 'visualizations/triadic-recursive-visualization.html',
      available: true
    },
    {
      id: 'elastic-filter',
      name: 'Elastic Filter',
      description: 'Filtro elástico de dados',
      category: 'Data Processing',
      icon: '🔍',
      url: 'elastic-filter.html',
      available: true
    },

    // Dashboards & Interfaces
    {
      id: 'dashboard-main',
      name: 'Main Dashboard',
      description: 'Dashboard principal do sistema',
      category: 'Dashboards',
      icon: '🏠',
      url: 'dashboard/index.html',
      available: true
    },
    {
      id: 'codex-viewer',
      name: 'Codex Viewer',
      description: 'Visualizador de codex',
      category: 'Knowledge Base',
      icon: '📚',
      url: 'codex-viewer.html',
      available: true
    },
    {
      id: 'library-interface',
      name: 'Library Interface',
      description: 'Interface da biblioteca',
      category: 'Knowledge Base',
      icon: '📖',
      url: 'library/index.html',
      available: true
    },
    {
      id: 'api-docs',
      name: 'API Documentation',
      description: 'Documentação da API',
      category: 'Development',
      icon: '📋',
      url: 'api-docs.html',
      available: true
    },

    // Special Modules
    {
      id: 'coringa',
      name: 'Coringa Interface',
      description: 'Interface especial Coringa',
      category: 'Special',
      icon: '🃏',
      url: 'coringa.html',
      available: true
    },
    {
      id: 'wiltonos-sacred',
      name: 'WiltonOS Sacred',
      description: 'Interface sagrada do WiltonOS',
      category: 'Sacred Geometry',
      icon: '🕉️',
      url: 'wiltonos-sacred.html',
      available: true
    },

    // System Analytics
    {
      id: 'coherence-monitor',
      name: 'Coherence Monitor',
      description: 'Real-time Zλ field tracking',
      category: 'System Analytics',
      icon: '📊',
      url: '/api/coherence/status',
      available: true
    },
    {
      id: 'module-analytics',
      name: 'Module Analytics',
      description: 'System dependency analysis',
      category: 'System Analytics',
      icon: '📈',
      url: '/api/dependency-graph',
      available: true
    }
  ];

  getModules(): ModuleInfo[] {
    return this.knownModules;
  }

  getModulesByCategory(): Record<string, ModuleInfo[]> {
    const categories: Record<string, ModuleInfo[]> = {};
    
    this.knownModules.forEach(module => {
      if (!categories[module.category]) {
        categories[module.category] = [];
      }
      categories[module.category].push(module);
    });
    
    return categories;
  }

  getAvailableModules(): ModuleInfo[] {
    return this.knownModules.filter(m => m.available);
  }
}

// Export singleton instance
export const simpleModuleDiscovery = new SimpleModuleDiscovery();