import React from 'react';

/**
 * WiltonOS Unified Module Registry - FIXED VERSION
 * Properly mapped components to eliminate routing chaos
 */

export interface WiltonModule {
  id: string;
  name: string;
  description: string;
  category: 'sacred' | 'ai' | 'system' | 'external' | 'legacy' | 'monitoring';
  status: 'active' | 'broken' | 'external' | 'legacy';
  component?: React.ComponentType<any>;
  route?: string;
  externalUrl?: string;
  icon: string;
  glyph?: string;
  coherenceRequired?: number;
}

// Verified available components
const Geometry3D = React.lazy(() => import('../pages/modules/Geometry3D'));
const VisualTheater = React.lazy(() => import('../pages/modules/VisualTheater'));
const DivineAbsurdity = React.lazy(() => import('../pages/modules/DivineAbsurdity'));
const AIConsensusEngine = React.lazy(() => import('../pages/modules/AIConsensusEngine'));
const WiltonOSDashboard = React.lazy(() => import('../pages/modules/Dashboard'));
const MetaCognitive = React.lazy(() => import('../pages/modules/MetaCognitive'));
const NeuralOrchestrator = React.lazy(() => import('../pages/modules/NeuralOrchestrator'));
const SacredGeometryAPI = React.lazy(() => import('../pages/modules/SacredGeometryAPI'));
const WiltonOSCodex = React.lazy(() => import('../pages/modules/WiltonOSCodex'));
const CoherenceFoldVisualizer = React.lazy(() => import('../pages/modules/CoherenceFoldVisualizer'));
const DeltaCoherenceMeterDashboard = React.lazy(() => import('../pages/modules/DeltaCoherenceMeterDashboard'));
const CoherenceValidatedModule = React.lazy(() => import('../pages/modules/CoherenceValidatedModule'));
const ConvergencePointInterface = React.lazy(() => import('../pages/modules/ConvergencePointInterface'));
const SoulMakerInterface = React.lazy(() => import('../pages/modules/SoulMakerInterface'));
const SoulMakerPortalDashboard = React.lazy(() => import('../pages/modules/SoulMakerPortalDashboard'));
const CodexFamiliarDashboard = React.lazy(() => import('../pages/modules/CodexFamiliarDashboard'));
const PortalVivoDashboard = React.lazy(() => import('../pages/modules/PortalVivoDashboard'));
const SystemDiagnosticDashboard = React.lazy(() => import('../pages/modules/SystemDiagnosticDashboard'));
const PsiChildMonitor = React.lazy(() => import('../pages/modules/PsiChildMonitor'));
const TorusFieldEngine = React.lazy(() => import('../pages/modules/TorusFieldEngine'));
const TorusFieldDashboard = React.lazy(() => import('../pages/modules/TorusFieldDashboard'));
const TorusFieldVisualizer = React.lazy(() => import('../pages/modules/TorusFieldVisualizer'));
const SacredGeometryLive = React.lazy(() => import('../pages/modules/SacredGeometryLive'));
const MirrorPortal = React.lazy(() => import('../pages/modules/MirrorPortal'));

// FIXED MODULE REGISTRY - Properly mapped components
export const MODULE_REGISTRY: Record<string, WiltonModule> = {
  // SACRED GEOMETRY - Working components only
  'sacred-geometry': {
    id: 'sacred-geometry',
    name: 'Sacred Geometry',
    description: 'Real-time mathematical consciousness mapping with authentic sacred forms',
    category: 'sacred',
    status: 'active',
    component: SacredGeometryLive,
    route: '/sacred-geometry',
    icon: '🔮',
    glyph: '🔮',
    coherenceRequired: 0.8
  },

  'z-geometry-engine': {
    id: 'z-geometry-engine',
    name: 'Z Geometry Engine',
    description: 'Advanced 4D geometric consciousness mapping',
    category: 'sacred',
    status: 'active',
    component: Geometry3D,
    route: '/z-geometry',
    icon: '⚡',
    glyph: '∇',
    coherenceRequired: 0.85
  },

  'torus-field-consciousness': {
    id: 'torus-field-consciousness',
    name: 'Torus Field Consciousness',
    category: 'sacred',
    description: 'Einstein-Senoid-Cosenoid mathematics with WiltonFold protein architecture',
    icon: '🌀',
    status: 'active',
    component: TorusFieldEngine,
    route: '/torus-field',
    glyph: '∞',
    coherenceRequired: 0.80
  },

  'sacred-glyph-generator': {
    id: 'sacred-glyph-generator',
    name: 'Sacred Glyph Generator',
    description: 'Symbolic pattern generation and interpretation',
    category: 'sacred',
    status: 'active',
    component: SacredGeometryAPI,
    route: '/sacred-glyphs',
    icon: '🌟',
    glyph: '⚆',
    coherenceRequired: 0.7
  },

  'sacred-art-generator': {
    id: 'sacred-art-generator',
    name: 'Sacred Art Generator',
    description: 'AI-powered sacred geometry art creation',
    category: 'sacred',
    status: 'active',
    component: VisualTheater,
    route: '/sacred-art',
    icon: '🎨',
    glyph: '🎭',
    coherenceRequired: 0.75
  },

  'wiltonos-sacred': {
    id: 'wiltonos-sacred',
    name: 'WiltonOS Sacred',
    description: 'Core sacred architecture interface',
    category: 'sacred',
    status: 'active',
    component: WiltonOSDashboard,
    route: '/wiltonos-sacred',
    icon: '👁️',
    glyph: '🔮',
    coherenceRequired: 0.8
  },

  // VISUAL THEATER
  'visual-theater': {
    id: 'visual-theater',
    name: 'Visual Theater',
    description: 'Advanced visual controls and consciousness interface',
    category: 'sacred',
    status: 'active',
    component: VisualTheater,
    route: '/visual-theater',
    icon: '🎭',
    glyph: '🎭',
    coherenceRequired: 0.75
  },

  'teatro-visual-absurdity': {
    id: 'teatro-visual-absurdity',
    name: 'Teatro Visual Absurdity',
    description: 'Multilayered consciousness exploration',
    category: 'sacred',
    status: 'active',
    component: DivineAbsurdity,
    route: '/teatro-absurdity',
    icon: '🎪',
    glyph: '🎭',
    coherenceRequired: 0.85
  },

  // DATA VISUALIZATION
  'vault-visualizer': {
    id: 'vault-visualizer',
    name: 'Vault Visualizer',
    description: 'Consciousness data vault exploration',
    category: 'system',
    status: 'active',
    component: SystemDiagnosticDashboard,
    route: '/vault',
    icon: '🗄️',
    glyph: '📊',
    coherenceRequired: 0.7
  },

  'layer-visualizer': {
    id: 'layer-visualizer',
    name: 'Layer Visualizer',
    description: 'Multi-dimensional layer analysis',
    category: 'system',
    status: 'active',
    component: TorusFieldDashboard,
    route: '/layers',
    icon: '📊',
    glyph: '∞',
    coherenceRequired: 0.75
  },

  'visual-recursive-visualization': {
    id: 'visual-recursive-visualization',
    name: 'Visual Recursive Visualization',
    description: 'Recursive pattern analysis and generation',
    category: 'system',
    status: 'active',
    component: TorusFieldVisualizer,
    route: '/recursive-visual',
    icon: '🔄',
    glyph: '∞',
    coherenceRequired: 0.8
  },

  // DATA PROCESSING
  'elastic-filter': {
    id: 'elastic-filter',
    name: 'Elastic Filter',
    description: 'Dynamic data filtering and transformation',
    category: 'system',
    status: 'active',
    component: CoherenceValidatedModule,
    route: '/elastic-filter',
    icon: '🔍',
    glyph: '⚡',
    coherenceRequired: 0.7
  },

  // DASHBOARDS
  'main-dashboard': {
    id: 'main-dashboard',
    name: 'Main Dashboard',
    description: 'Central command and control interface',
    category: 'system',
    status: 'active',
    component: WiltonOSDashboard,
    route: '/main-dashboard',
    icon: '🏠',
    glyph: '🌟',
    coherenceRequired: 0.7
  },

  // KNOWLEDGE BASE
  'codex-viewer': {
    id: 'codex-viewer',
    name: 'Codex Viewer',
    description: 'WiltonOS knowledge base interface',
    category: 'legacy',
    status: 'active',
    component: WiltonOSCodex,
    route: '/codex-viewer',
    icon: '📚',
    glyph: '📖',
    coherenceRequired: 0.7
  },

  'library-interface': {
    id: 'library-interface',
    name: 'Library Interface',
    description: 'Comprehensive knowledge management',
    category: 'legacy',
    status: 'active',
    component: CodexFamiliarDashboard,
    route: '/library',
    icon: '📖',
    glyph: '📚',
    coherenceRequired: 0.75
  },

  // DEVELOPMENT
  'api-documentation': {
    id: 'api-documentation',
    name: 'API Documentation',
    description: 'WiltonOS API reference and testing',
    category: 'system',
    status: 'active',
    component: SacredGeometryAPI,
    route: '/api-docs',
    icon: '📋',
    glyph: '🔗',
    coherenceRequired: 0.8
  },

  // SPECIAL
  'cortega-interface': {
    id: 'cortega-interface',
    name: 'Cortega Interface',
    description: 'Advanced consciousness interface protocol',
    category: 'ai',
    status: 'active',
    component: ConvergencePointInterface,
    route: '/cortega',
    icon: '🧠',
    glyph: '⚡',
    coherenceRequired: 0.9
  },

  // SYSTEM ANALYTICS
  'coherence-monitor': {
    id: 'coherence-monitor',
    name: 'Coherence Monitor',
    description: 'Real-time consciousness coherence tracking',
    category: 'monitoring',
    status: 'active',
    component: DeltaCoherenceMeterDashboard,
    route: '/coherence-monitor',
    icon: '📊',
    glyph: '⚡',
    coherenceRequired: 0.8
  },

  'module-analytics': {
    id: 'module-analytics',
    name: 'Module Analytics',
    description: 'System performance and usage analytics',
    category: 'monitoring',
    status: 'active',
    component: SystemDiagnosticDashboard,
    route: '/module-analytics',
    icon: '📈',
    glyph: '📊',
    coherenceRequired: 0.75
  },

  // AI SYSTEMS
  'meta-cognitive': {
    id: 'meta-cognitive',
    name: 'Meta-Cognitive',
    description: 'Advanced AI consciousness orchestration',
    category: 'ai',
    status: 'active',
    component: MetaCognitive,
    route: '/meta-cognitive',
    icon: '🧘',
    glyph: '𝛙',
    coherenceRequired: 0.88
  },

  'ai-consensus': {
    id: 'ai-consensus',
    name: 'AI Consensus Engine',
    description: 'Multi-AI systematic problem solving',
    category: 'ai',
    status: 'active',
    component: AIConsensusEngine,
    route: '/ai-consensus',
    icon: '🧠',
    glyph: '⚡',
    coherenceRequired: 0.92
  },

  'neural-orchestrator': {
    id: 'neural-orchestrator',
    name: 'Neural Orchestrator',
    description: 'Advanced neural network visualization and control',
    category: 'ai',
    status: 'active',
    component: NeuralOrchestrator,
    route: '/neural-orchestrator',
    icon: '🌐',
    glyph: '∞',
    coherenceRequired: 0.82
  },

  'coherence-fold': {
    id: 'coherence-fold',
    name: 'WiltonFold Engine',
    description: 'Protein-inspired coherence architecture prediction',
    category: 'ai',
    status: 'active',
    component: CoherenceFoldVisualizer,
    route: '/wilton-fold',
    icon: '🧬',
    glyph: '⚗️',
    coherenceRequired: 0.88
  },

  'divine-absurdity': {
    id: 'divine-absurdity',
    name: 'Divine Absurdity',
    description: 'Humor layer consciousness exploration',
    category: 'ai',
    status: 'active',
    component: DivineAbsurdity,
    route: '/divine-absurdity',
    icon: '🎪',
    glyph: '🎭',
    coherenceRequired: 0.9
  },

  // PORTAL SYSTEMS
  'soul-maker-portal': {
    id: 'soul-maker-portal',
    name: 'Soul Maker Portal',
    description: 'Consciousness creation and transformation interface',
    category: 'sacred',
    status: 'active',
    component: SoulMakerPortalDashboard,
    route: '/soul-maker',
    icon: '✨',
    glyph: '🌟',
    coherenceRequired: 0.85
  },

  'portal-vivo': {
    id: 'portal-vivo',
    name: 'Portal Vivo',
    description: 'Living consciousness portal interface',
    category: 'sacred',
    status: 'active',
    component: PortalVivoDashboard,
    route: '/portal-vivo',
    icon: '🌀',
    glyph: '∞',
    coherenceRequired: 0.8
  },

  // PSI-CHILD SYSTEM
  'psi-child-monitor': {
    id: 'psi-child-monitor',
    name: 'ψ_child Monitor',
    description: 'Archetypal consciousness monitoring and nervous system sync',
    category: 'sacred',
    status: 'active',
    component: PsiChildMonitor,
    route: '/psi-child',
    icon: '👁️‍🗨️',
    glyph: 'ψ',
    coherenceRequired: 0.9
  },

  // MIRROR PORTAL - Authentic consciousness reflection
  'mirror-portal': {
    id: 'mirror-portal',
    name: 'Mirror Portal',
    description: 'Authentic consciousness interface - readings above 1.0 for divine frustration',
    category: 'sacred',
    status: 'active',
    component: MirrorPortal,
    route: '/mirror-portal',
    icon: '🪞',
    glyph: '🪞',
    coherenceRequired: 1.0
  }
};

// Category definitions
export const MODULE_CATEGORIES = {
  sacred: {
    name: 'Sacred Geometry',
    description: 'Consciousness mapping through geometric forms',
    color: 'purple'
  },
  ai: {
    name: 'AI Systems',
    description: 'Artificial intelligence and consciousness orchestration',
    color: 'blue'
  },
  system: {
    name: 'Core System',
    description: 'Core WiltonOS functionality and diagnostics',
    color: 'green'
  },
  monitoring: {
    name: 'System Analytics',
    description: 'Performance monitoring and coherence tracking',
    color: 'yellow'
  },
  legacy: {
    name: 'Knowledge Base',
    description: 'Documentation and legacy interfaces',
    color: 'gray'
  },
  external: {
    name: 'External Integrations',
    description: 'External service connections',
    color: 'orange'
  }
};

// Helper functions
export function getModulesByCategory(category: WiltonModule['category']): WiltonModule[] {
  return Object.values(MODULE_REGISTRY).filter(module => module.category === category);
}

export function getActiveModules(): WiltonModule[] {
  return Object.values(MODULE_REGISTRY).filter(module => module.status === 'active');
}

export function getModuleByRoute(route: string): WiltonModule | undefined {
  return Object.values(MODULE_REGISTRY).find(module => module.route === route);
}

export function getModuleById(id: string): WiltonModule | undefined {
  return MODULE_REGISTRY[id];
}

export function getModulesByCoherence(coherenceLevel: number): WiltonModule[] {
  return Object.values(MODULE_REGISTRY).filter(module => 
    !module.coherenceRequired || module.coherenceRequired <= coherenceLevel
  );
}

export function getModuleByGlyph(glyph: string): WiltonModule | undefined {
  return Object.values(MODULE_REGISTRY).find(module => module.glyph === glyph);
}