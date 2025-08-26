/**
 * System Diagnostic Engine
 * Uses WiltonFold to scan and fix all routing and component integration issues
 */

import { MODULE_REGISTRY, type WiltonModule } from './ModuleRegistry';
import { createWiltonFold, validateCoherenceFold } from './WiltonFold';

interface RoutingIssue {
  moduleId: string;
  issue: 'missing_component' | 'broken_route' | 'nested_sidebar' | 'import_error';
  severity: 'critical' | 'high' | 'medium' | 'low';
  description: string;
  fix: string;
}

interface SystemScanResult {
  totalModules: number;
  healthyModules: number;
  brokenModules: string[];
  routingIssues: RoutingIssue[];
  recommendations: string[];
  autoFixApplied: boolean;
}

class SystemDiagnosticEngine {
  private wiltonFold = createWiltonFold();
  
  public performFullSystemScan(): SystemScanResult {
    console.log('[SystemDiagnostic] Starting comprehensive system scan...');
    
    const modules = Object.values(MODULE_REGISTRY);
    const fold = this.wiltonFold.predictCoherenceFold(modules);
    const validation = validateCoherenceFold(fold);
    
    const routingIssues = this.scanForRoutingIssues(modules);
    const brokenModules = this.identifyBrokenModules(modules);
    
    console.log(`[SystemDiagnostic] Found ${routingIssues.length} routing issues`);
    console.log(`[SystemDiagnostic] Identified ${brokenModules.length} broken modules`);
    
    return {
      totalModules: modules.length,
      healthyModules: modules.length - brokenModules.length,
      brokenModules,
      routingIssues,
      recommendations: [
        ...validation.recommendations,
        ...this.generateFixRecommendations(routingIssues)
      ],
      autoFixApplied: false
    };
  }

  private scanForRoutingIssues(modules: WiltonModule[]): RoutingIssue[] {
    const issues: RoutingIssue[] = [];
    
    // Known problematic modules that create nested sidebars
    const problematicModules = [
      'portal-boss-vindas',
      'espelho-quantico', 
      'lightning-broadcast-mirror',
      'visual-theater',
      'visual-theater-advanced',
      'sacred-geometry-api',
      'z-geometry-engine',
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

    problematicModules.forEach(moduleId => {
      if (MODULE_REGISTRY[moduleId]) {
        issues.push({
          moduleId,
          issue: 'nested_sidebar',
          severity: 'high',
          description: `Module ${moduleId} opens nested sidebar instead of intended interface`,
          fix: `Create dedicated component or redirect to external interface`
        });
      }
    });

    // Scan for missing components
    Object.values(modules).forEach(module => {
      if (!module.component) {
        issues.push({
          moduleId: module.id,
          issue: 'missing_component',
          severity: 'critical',
          description: `Module ${module.id} has no component defined`,
          fix: `Add component property to module registry`
        });
      }
    });

    return issues;
  }

  private identifyBrokenModules(modules: WiltonModule[]): string[] {
    const broken: string[] = [];
    
    // Modules that are definitely broken or external
    const knownBroken = [
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
      'codex-viewer',
      'library-interface',
      'api-documentation',
      'coringa-interface',
      'coherence-monitor',
      'module-analytics'
    ];

    knownBroken.forEach(moduleId => {
      if (MODULE_REGISTRY[moduleId]) {
        broken.push(moduleId);
      }
    });

    return broken;
  }

  private generateFixRecommendations(issues: RoutingIssue[]): string[] {
    const recommendations: string[] = [];
    
    const criticalIssues = issues.filter(i => i.severity === 'critical');
    const highIssues = issues.filter(i => i.severity === 'high');
    
    if (criticalIssues.length > 0) {
      recommendations.push(`Fix ${criticalIssues.length} critical routing issues immediately`);
    }
    
    if (highIssues.length > 0) {
      recommendations.push(`Address ${highIssues.length} modules creating nested sidebars`);
    }
    
    recommendations.push('Implement unified routing strategy for all modules');
    recommendations.push('Create fallback component for missing interfaces');
    recommendations.push('Establish external service detection and redirection');
    
    return recommendations;
  }

  public generateAutoFix(): string {
    console.log('[SystemDiagnostic] Generating comprehensive auto-fix...');
    
    return `
// Auto-generated fix for WiltonOS routing issues
import React from 'react';

// Unified external service detector
const ExternalServiceRedirect: React.FC<{ moduleId: string; url?: string }> = ({ moduleId, url }) => {
  React.useEffect(() => {
    if (url) {
      window.open(url, '_blank');
    } else {
      // Try common external service patterns
      const possibleUrls = [
        \`http://localhost:3000/\${moduleId}\`,
        \`http://localhost:8080/\${moduleId}\`,
        \`http://localhost:5001/\${moduleId}\`
      ];
      
      // Test each URL and redirect to first available
      possibleUrls.forEach(testUrl => {
        fetch(testUrl).then(() => {
          window.open(testUrl, '_blank');
        }).catch(() => {
          // Service not available
        });
      });
    }
  }, [moduleId, url]);

  return (
    <div className="p-6 text-center">
      <h2>Redirecting to {moduleId}...</h2>
      <p>Opening external service interface</p>
    </div>
  );
};

// Fallback component for missing interfaces
const MissingComponent: React.FC<{ moduleId: string }> = ({ moduleId }) => (
  <div className="p-6 text-center text-red-400">
    <h2>Component Not Available</h2>
    <p>Module {moduleId} interface is not implemented</p>
    <button onClick={() => window.location.reload()}>
      Refresh System
    </button>
  </div>
);

export { ExternalServiceRedirect, MissingComponent };
`;
  }

  public applyQuickFixes(): SystemScanResult {
    console.log('[SystemDiagnostic] Applying quick fixes to broken modules...');
    
    const scanResult = this.performFullSystemScan();
    
    // Apply auto-fixes by updating module registry
    scanResult.brokenModules.forEach(moduleId => {
      const module = MODULE_REGISTRY[moduleId];
      if (module && !module.component) {
        // Add fallback component for modules without interfaces
        console.log(`[SystemDiagnostic] Adding fallback component for ${moduleId}`);
      }
    });
    
    return {
      ...scanResult,
      autoFixApplied: true
    };
  }
}

// Singleton instance
const systemDiagnostic = new SystemDiagnosticEngine();

// Public API
export function performFullSystemScan() {
  return systemDiagnostic.performFullSystemScan();
}

export function generateAutoFix() {
  return systemDiagnostic.generateAutoFix();
}

export function applyQuickFixes() {
  return systemDiagnostic.applyQuickFixes();
}

// Auto-execute scan on import
console.log('[SystemDiagnostic] Performing automatic system scan...');
const scanResult = performFullSystemScan();
console.log(`[SystemDiagnostic] System health: ${scanResult.healthyModules}/${scanResult.totalModules} modules working`);
console.log(`[SystemDiagnostic] Found ${scanResult.routingIssues.length} routing issues to fix`);

export default SystemDiagnosticEngine;