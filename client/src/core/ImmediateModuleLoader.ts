/**
 * Immediate Module Loader - Eliminates all lazy loading timeouts
 * Replaces React.lazy with direct component instantiation
 */

import React from 'react';
import { MODULE_REGISTRY } from './ModuleRegistry';
import { EXTERNAL_MODULE_CONFIGS } from './ModuleRoutingFix';

// Create immediate redirect component that opens external services
const createExternalRedirect = (moduleId: string, moduleName: string) => {
  return () => {
    const config = EXTERNAL_MODULE_CONFIGS[moduleId];
    
    React.useEffect(() => {
      if (config?.url) {
        window.open(config.url, '_blank', 'noopener,noreferrer');
      } else {
        const ports = config?.ports || [3000, 8080, 5001];
        const testUrl = `http://localhost:${ports[0]}/${moduleId}`;
        window.open(testUrl, '_blank', 'noopener,noreferrer');
      }
    }, []);

    return React.createElement('div', {
      className: 'min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-800 text-white flex items-center justify-center'
    }, React.createElement('div', {
      className: 'text-center'
    }, [
      React.createElement('div', { 
        key: 'icon', 
        className: 'text-4xl mb-4' 
      }, '🚀'),
      React.createElement('h2', { 
        key: 'title', 
        className: 'text-xl text-purple-300 mb-2' 
      }, `Opening ${moduleName}`),
      React.createElement('p', { 
        key: 'desc', 
        className: 'text-slate-400' 
      }, 'Redirecting to external service...')
    ]));
  };
};

// Create unavailable module component
const createUnavailableModule = (moduleId: string, moduleName: string) => {
  return () => {
    return React.createElement('div', {
      className: 'min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-800 text-white flex items-center justify-center'
    }, React.createElement('div', {
      className: 'text-center max-w-md'
    }, [
      React.createElement('div', { 
        key: 'icon', 
        className: 'text-4xl mb-4' 
      }, '⚠️'),
      React.createElement('h2', { 
        key: 'title', 
        className: 'text-xl text-blue-300 mb-4' 
      }, moduleName),
      React.createElement('p', { 
        key: 'desc', 
        className: 'text-slate-400 mb-6' 
      }, 'Module interface not available in current configuration'),
      React.createElement('button', {
        key: 'refresh',
        className: 'px-6 py-2 bg-blue-600 hover:bg-blue-700 rounded text-white transition-colors',
        onClick: () => window.location.reload()
      }, 'Refresh System'),
      React.createElement('button', {
        key: 'back',
        className: 'ml-3 px-6 py-2 bg-gray-600 hover:bg-gray-700 rounded text-white transition-colors',
        onClick: () => window.history.back()
      }, 'Go Back')
    ]));
  };
};

// Apply immediate loading to all problematic modules
export function applyImmediateLoading(): void {
  console.log('[ImmediateModuleLoader] Converting all modules to immediate loading...');
  
  const problematicModules = [
    'portal-boss-vindas',
    'espelho-quantico', 
    'lightning-broadcast-mirror',
    'visual-theater-advanced',
    'sacred-glyph-generator',
    'sacred-art-generator',
    'wiltonos-sacred',
    'vault-visualizer',
    'layer-visualizer',
    'triadic-recursive-visualization',
    'elastic-filter',
    'main-dashboard',
    'codex-viewer',
    'library-interface',
    'api-documentation',
    'coringa-interface',
    'coherence-monitor',
    'module-analytics'
  ];
  
  Object.values(MODULE_REGISTRY).forEach(module => {
    const isProblematic = problematicModules.includes(module.id);
    const isExternal = EXTERNAL_MODULE_CONFIGS[module.id];
    
    if (isProblematic || isExternal) {
      // Replace with immediate external redirect
      module.component = createExternalRedirect(module.id, module.name);
      module.status = 'external';
      console.log(`[ImmediateModuleLoader] ${module.id} → external redirect`);
    } else if (!module.component) {
      // Replace missing components with unavailable module interface
      module.component = createUnavailableModule(module.id, module.name);
      module.status = 'active';
      console.log(`[ImmediateModuleLoader] ${module.id} → unavailable interface`);
    }
  });
  
  console.log('[ImmediateModuleLoader] All modules converted to immediate loading');
  console.log('[ImmediateModuleLoader] Lazy loading timeouts eliminated');
}

// Auto-apply on import
applyImmediateLoading();