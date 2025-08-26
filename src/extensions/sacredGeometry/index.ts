/**
 * Sacred Geometry Extension - Main Entry Point
 * Complete integration of all sacred geometry modules with consciousness engine
 */

import UnifiedSacredGeometryIntegration from './unified-integration';
import VesicaPiscisQuantumModule from './vesica-piscis-module';

// Global instance
let globalIntegration: UnifiedSacredGeometryIntegration | null = null;

export function initSacredGeometryIntegration(eventBus?: any): UnifiedSacredGeometryIntegration {
  // Dispose existing instance
  if (globalIntegration) {
    globalIntegration.dispose();
  }
  
  globalIntegration = new UnifiedSacredGeometryIntegration(eventBus);
  
  // Expose to window for console access and debugging
  window.sacredGeometry = globalIntegration;
  
  // Register debug commands
  window.validateSacredGeometry = () => {
    return globalIntegration?.validateIntegration();
  };
  
  window.generateVesicaPiscis = (dimension = '2D') => {
    return globalIntegration?.generatePattern('vesicaPiscis', dimension);
  };
  
  window.getSacredRecommendation = () => {
    const state = globalIntegration?.getConsciousnessState();
    const recommendation = globalIntegration?.getPatternRecommendation();
    return {
      currentConsciousness: state?.zLambda,
      recommendation,
      allPatterns: globalIntegration?.getAvailablePatterns(),
      implemented: globalIntegration?.getImplementedPatterns(),
      missing: globalIntegration?.getMissingImplementations()
    };
  };
  
  console.log('[Sacred Geometry] Integration active - console commands available:');
  console.log('- validateSacredGeometry() - Check integration status');
  console.log('- generateVesicaPiscis(dimension) - Generate Vesica Piscis pattern');
  console.log('- getSacredRecommendation() - Get consciousness-based pattern recommendation');
  
  return globalIntegration;
}

export function getSacredGeometryIntegration(): UnifiedSacredGeometryIntegration | null {
  return globalIntegration;
}

export function activatePattern(patternName: string, renderCallback?: Function): void {
  if (globalIntegration) {
    globalIntegration.activatePattern(patternName, renderCallback);
  }
}

export function generatePattern(patternName: string, dimension: string = '2D', options: any = {}): any {
  if (!globalIntegration) {
    throw new Error('Sacred Geometry Integration not initialized');
  }
  return globalIntegration.generatePattern(patternName, dimension, options);
}

export function getIntegrationStatus(): any {
  return globalIntegration?.validateIntegration() || { status: 'NOT_INITIALIZED' };
}

// Hot Module Replacement
if (import.meta.hot) {
  import.meta.hot.dispose(() => {
    if (globalIntegration) {
      globalIntegration.dispose();
      globalIntegration = null;
    }
  });
}

export { UnifiedSacredGeometryIntegration, VesicaPiscisQuantumModule };
export default initSacredGeometryIntegration;