/**
 * Module Routing Fix - Comprehensive solution for nested sidebar issues
 * Automatically detects and redirects problematic modules to correct interfaces
 */

import React from 'react';
import { MODULE_REGISTRY, type WiltonModule } from './ModuleRegistry';

// External service redirection component factory
const createExternalRedirect = (moduleId: string, moduleName: string, ports: number[] = [3000, 8080, 5001]) => {
  const ExternalServiceRedirect = React.lazy(() => import('../components/ExternalServiceRedirect'));
  return () => React.createElement(ExternalServiceRedirect, { 
    moduleId, 
    moduleName,
    ports
  });
};

// Modules that should redirect to external services
export const EXTERNAL_MODULE_CONFIGS = {
  'portal-boss-vindas': {
    name: 'Portal Boss-vindas',
    ports: [3000, 8080],
    url: 'http://localhost:3000/portal-boss-vindas'
  },
  'espelho-quantico': {
    name: 'Espelho Quântico',
    ports: [3001, 8080],
    url: 'http://localhost:3001/espelho-quantico'
  },
  'lightning-broadcast-mirror': {
    name: 'Lightning Broadcast Mirror',
    ports: [3002, 8080],
    url: 'http://localhost:3002/lightning'
  },
  'visual-theater-advanced': {
    name: 'Teatro Visual Avançado',
    ports: [3003, 8080],
    url: 'http://localhost:3003/visual-theater'
  },
  'sacred-glyph-generator': {
    name: 'Sacred Glyph Generator',
    ports: [3004, 8080],
    url: 'http://localhost:3004/glyph-generator'
  },
  'sacred-art-generator': {
    name: 'Sacred Art Generator',
    ports: [3005, 8080],
    url: 'http://localhost:3005/art-generator'
  },
  'wiltonos-sacred': {
    name: 'WiltonOS Sacred',
    ports: [3006, 8080],
    url: 'http://localhost:3006/sacred'
  },
  'vault-visualizer': {
    name: 'Vault Visualizer',
    ports: [3007, 8080],
    url: 'http://localhost:3007/vault'
  },
  'layer-visualizer': {
    name: 'Layer Visualizer',
    ports: [3008, 8080],
    url: 'http://localhost:3008/layers'
  },
  'triadic-recursive-visualization': {
    name: 'Triadic Recursive Visualization',
    ports: [3009, 8080],
    url: 'http://localhost:3009/triadic'
  },
  'elastic-filter': {
    name: 'Elastic Filter',
    ports: [3010, 8080],
    url: 'http://localhost:3010/elastic'
  },
  'main-dashboard': {
    name: 'Main Dashboard',
    ports: [3011, 8080],
    url: 'http://localhost:3011/dashboard'
  },
  'codex-viewer': {
    name: 'Codex Viewer',
    ports: [3012, 8080],
    url: 'http://localhost:3012/codex'
  },
  'library-interface': {
    name: 'Library Interface',
    ports: [3013, 8080],
    url: 'http://localhost:3013/library'
  },
  'api-documentation': {
    name: 'API Documentation',
    ports: [3014, 8080],
    url: 'http://localhost:3014/api-docs'
  },
  'coringa-interface': {
    name: 'Coringa Interface',
    ports: [3015, 8080],
    url: 'http://localhost:3015/coringa'
  },
  'coherence-monitor': {
    name: 'Coherence Monitor',
    ports: [3016, 8080],
    url: 'http://localhost:3016/monitor'
  },
  'module-analytics': {
    name: 'Module Analytics',
    ports: [3017, 8080],
    url: 'http://localhost:3017/analytics'
  }
};

// Apply routing fixes to the module registry
export function applyRoutingFixes(): void {
  console.log('[ModuleRoutingFix] Applying comprehensive routing fixes...');
  
  Object.entries(EXTERNAL_MODULE_CONFIGS).forEach(([moduleId, config]) => {
    if (MODULE_REGISTRY[moduleId]) {
      // Update module to use external redirect component
      MODULE_REGISTRY[moduleId].status = 'external';
      MODULE_REGISTRY[moduleId].component = createExternalRedirect(
        moduleId, 
        config.name, 
        config.ports
      );
      
      console.log(`[ModuleRoutingFix] Fixed routing for ${moduleId} → external service`);
    }
  });
  
  // Fix modules without proper components
  Object.values(MODULE_REGISTRY).forEach(module => {
    if (!module.component) {
      console.log(`[ModuleRoutingFix] Adding fallback component for ${module.id}`);
      module.component = createExternalRedirect(
        module.id,
        module.name,
        [3000, 8080, 5001]
      );
    }
  });
  
  console.log('[ModuleRoutingFix] All routing fixes applied successfully');
}

// Auto-apply fixes on import
applyRoutingFixes();

export default { applyRoutingFixes, EXTERNAL_MODULE_CONFIGS };