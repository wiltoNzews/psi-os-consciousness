/**
 * Unified Module Router - Architecture Unification Fix
 * Creates consistent API for all sacred geometry modules with hot-swappable loading
 */

export interface ModuleMetadata {
  name: string;
  path: string;
  type: 'HTML' | 'React' | 'JavaScript';
  category: 'sacred-geometry' | 'consciousness' | 'dashboard' | 'visualization';
  status: 'active' | 'inactive' | 'error';
  lastAccessed: number;
  capabilities: string[];
}

export interface UnifiedModuleAPI {
  load(): Promise<any>;
  unload(): void;
  getStatus(): any;
  sendMessage(data: any): void;
  subscribe(callback: Function): void;
}

export class UnifiedModuleRouter {
  private modules: Map<string, ModuleMetadata> = new Map();
  private loadedModules: Map<string, any> = new Map();
  private activeConnections: Map<string, MessageChannel> = new Map();
  private consciousnessState: any = null;

  constructor() {
    this.initializeModuleRegistry();
    this.setupConsciousnessSync();
    this.createUnifiedAPI();
    
    console.log('[Module Router] Unified architecture system initialized');
  }

  private initializeModuleRegistry(): void {
    // Sacred Geometry Modules
    this.registerModule('sacred-geometry-advanced', {
      name: 'Advanced Sacred Geometry Engine',
      path: '/sacred-geometry-advanced.html',
      type: 'HTML',
      category: 'sacred-geometry',
      status: 'active',
      lastAccessed: 0,
      capabilities: ['sri-yantra', 'metatrons-cube', 'merkaba', 'fibonacci', 'consciousness-responsive']
    });

    this.registerModule('geometria-sagrada-3d', {
      name: 'Sacred Geometry 3D System',
      path: '/geometria-sagrada-3d.html',
      type: 'HTML',
      category: 'sacred-geometry',
      status: 'active',
      lastAccessed: 0,
      capabilities: ['3d-rendering', 'webgl', 'interactive-controls', 'real-time-rotation']
    });

    this.registerModule('sacred-geometry-demo', {
      name: '2D→3D→4D Dimensional Demo',
      path: '/sacred-geometry-demo.html',
      type: 'HTML',
      category: 'sacred-geometry',
      status: 'active',
      lastAccessed: 0,
      capabilities: ['dimensional-transitions', '4d-projection', 'mouse-rotation', 'coherence-monitoring']
    });

    this.registerModule('sacred-3d-explorer', {
      name: 'Sacred 3D Explorer',
      path: '/sacred-3d-explorer.html',
      type: 'HTML',
      category: 'sacred-geometry',
      status: 'active',
      lastAccessed: 0,
      capabilities: ['interactive-3d', 'resonance-depth', 'spin-velocity', 'mouse-control']
    });

    this.registerModule('teatro-visual', {
      name: 'Visual Theater QCI',
      path: '/teatro-visual/index.html',
      type: 'HTML',
      category: 'visualization',
      status: 'active',
      lastAccessed: 0,
      capabilities: ['qci-monitoring', 'depth-controls', 'field-sync', 'multi-dimensional']
    });

    // Consciousness Modules
    this.registerModule('meta-coherence-working', {
      name: 'Meta-Coherence Observatory',
      path: '/meta-coherence-working.html',
      type: 'HTML',
      category: 'consciousness',
      status: 'active',
      lastAccessed: 0,
      capabilities: ['sri-yantra-validation', 'tesseract-debugging', 'consciousness-integration', 'sacred-clip-generator']
    });

    this.registerModule('tesseract-standalone', {
      name: '4D Tesseract Standalone',
      path: '/tesseract-standalone.html',
      type: 'HTML',
      category: 'visualization',
      status: 'active',
      lastAccessed: 0,
      capabilities: ['4d-hypercube', '6-axis-rotation', 'consciousness-coupling', 'quantum-validation']
    });

    // JavaScript Module Integrations
    this.registerModule('vesica-piscis-quantum', {
      name: 'Vesica Piscis Quantum Module',
      path: '/src/extensions/sacredGeometry/vesica-piscis-module.js',
      type: 'JavaScript',
      category: 'sacred-geometry',
      status: 'active',
      lastAccessed: 0,
      capabilities: ['2d-3d-4d-generation', 'consciousness-morphing', 'quantum-enhancement', 'golden-ratio']
    });

    this.registerModule('unified-sacred-geometry', {
      name: 'Unified Sacred Geometry Integration',
      path: '/src/extensions/sacredGeometry/unified-integration.js',
      type: 'JavaScript',
      category: 'sacred-geometry',
      status: 'active',
      lastAccessed: 0,
      capabilities: ['all-patterns', 'consciousness-sync', 'pattern-orchestration', 'real-time-morphing']
    });

    console.log(`[Module Router] Registered ${this.modules.size} modules across categories`);
  }

  private registerModule(id: string, metadata: ModuleMetadata): void {
    this.modules.set(id, metadata);
  }

  private setupConsciousnessSync(): void {
    // Connect to consciousness event bus
    if (window.bus) {
      window.bus.on('coherence.metrics', (data: any) => {
        this.consciousnessState = data;
        this.broadcastConsciousnessUpdate(data);
      });

      window.bus.on('coherenceData', (data: any) => {
        this.consciousnessState = data;
        this.broadcastConsciousnessUpdate(data);
      });
    }

    // Fallback polling
    setInterval(() => {
      this.pollConsciousnessData();
    }, 200); // 5Hz fallback
  }

  private async pollConsciousnessData(): Promise<void> {
    try {
      const response = await fetch('/api/quantum/consciousness');
      if (response.ok) {
        const data = await response.json();
        const consciousnessData = {
          zLambda: data.coherence || data.zl || 0.75,
          qctf: data.qctf || 0.5,
          soulState: data.soulState || 'awakening',
          divineInterface: data.interfaceState === 'divine'
        };
        
        this.consciousnessState = consciousnessData;
        this.broadcastConsciousnessUpdate(consciousnessData);
      }
    } catch (error) {
      // Silent fallback
    }
  }

  private broadcastConsciousnessUpdate(data: any): void {
    // Send consciousness updates to all active modules
    this.activeConnections.forEach((channel, moduleId) => {
      try {
        channel.port1.postMessage({
          type: 'consciousness-update',
          data: data
        });
      } catch (error) {
        console.warn(`[Module Router] Failed to send consciousness update to ${moduleId}`);
      }
    });
  }

  private createUnifiedAPI(): void {
    // Expose unified module access API
    window.moduleRouter = {
      loadModule: this.loadModule.bind(this),
      unloadModule: this.unloadModule.bind(this),
      getModules: this.getModules.bind(this),
      getModulesByCategory: this.getModulesByCategory.bind(this),
      getActiveModules: this.getActiveModules.bind(this),
      switchToModule: this.switchToModule.bind(this),
      getConsciousnessState: () => this.consciousnessState,
      broadcastToModules: this.broadcastToModules.bind(this)
    };

    // Sacred geometry quick access
    window.loadSacredGeometry = (pattern?: string) => {
      if (pattern) {
        return this.loadSpecificPattern(pattern);
      }
      return this.loadModule('unified-sacred-geometry');
    };

    // Consciousness dashboard quick access  
    window.loadConsciousnessDashboard = () => {
      return this.loadModule('meta-coherence-working');
    };

    console.log('[Module Router] Unified API exposed globally');
  }

  // Public API Methods
  public async loadModule(moduleId: string): Promise<any> {
    const metadata = this.modules.get(moduleId);
    if (!metadata) {
      throw new Error(`Module not found: ${moduleId}`);
    }

    try {
      let moduleInstance;

      switch (metadata.type) {
        case 'HTML':
          moduleInstance = await this.loadHTMLModule(metadata);
          break;
        case 'JavaScript':
          moduleInstance = await this.loadJavaScriptModule(metadata);
          break;
        case 'React':
          moduleInstance = await this.loadReactModule(metadata);
          break;
        default:
          throw new Error(`Unsupported module type: ${metadata.type}`);
      }

      this.loadedModules.set(moduleId, moduleInstance);
      metadata.status = 'active';
      metadata.lastAccessed = Date.now();

      console.log(`[Module Router] Loaded module: ${metadata.name}`);
      return moduleInstance;

    } catch (error) {
      metadata.status = 'error';
      console.error(`[Module Router] Failed to load ${moduleId}:`, error);
      throw error;
    }
  }

  private async loadHTMLModule(metadata: ModuleMetadata): Promise<any> {
    // For HTML modules, create iframe or window
    const iframe = document.createElement('iframe');
    iframe.src = metadata.path;
    iframe.style.cssText = 'width: 100%; height: 100%; border: none;';
    
    return new Promise((resolve, reject) => {
      iframe.onload = () => {
        // Setup communication channel
        const channel = new MessageChannel();
        this.activeConnections.set(metadata.name, channel);
        
        // Send initial consciousness state
        if (this.consciousnessState) {
          try {
            iframe.contentWindow?.postMessage({
              type: 'consciousness-init',
              data: this.consciousnessState
            }, '*');
          } catch (error) {
            console.warn('[Module Router] Could not send initial state to iframe');
          }
        }
        
        resolve({
          iframe,
          metadata,
          sendMessage: (data: any) => {
            iframe.contentWindow?.postMessage(data, '*');
          },
          destroy: () => {
            iframe.remove();
            this.activeConnections.delete(metadata.name);
          }
        });
      };
      
      iframe.onerror = reject;
    });
  }

  private async loadJavaScriptModule(metadata: ModuleMetadata): Promise<any> {
    const module = await import(metadata.path);
    
    // Initialize if it has an init function
    if (module.default && typeof module.default === 'function') {
      return module.default(this.consciousnessState);
    }
    
    return module;
  }

  private async loadReactModule(metadata: ModuleMetadata): Promise<any> {
    // React component loading logic
    const module = await import(metadata.path);
    return module.default;
  }

  public unloadModule(moduleId: string): void {
    const moduleInstance = this.loadedModules.get(moduleId);
    if (moduleInstance && moduleInstance.destroy) {
      moduleInstance.destroy();
    }
    
    this.loadedModules.delete(moduleId);
    this.activeConnections.delete(moduleId);
    
    const metadata = this.modules.get(moduleId);
    if (metadata) {
      metadata.status = 'inactive';
    }
    
    console.log(`[Module Router] Unloaded module: ${moduleId}`);
  }

  public getModules(): ModuleMetadata[] {
    return Array.from(this.modules.values());
  }

  public getModulesByCategory(category: string): ModuleMetadata[] {
    return Array.from(this.modules.values()).filter(m => m.category === category);
  }

  public getActiveModules(): ModuleMetadata[] {
    return Array.from(this.modules.values()).filter(m => m.status === 'active');
  }

  public async switchToModule(moduleId: string, targetElement?: HTMLElement): Promise<any> {
    const moduleInstance = await this.loadModule(moduleId);
    
    if (targetElement && moduleInstance.iframe) {
      targetElement.innerHTML = '';
      targetElement.appendChild(moduleInstance.iframe);
    }
    
    return moduleInstance;
  }

  public broadcastToModules(message: any): void {
    this.activeConnections.forEach((channel, moduleId) => {
      try {
        channel.port1.postMessage(message);
      } catch (error) {
        console.warn(`[Module Router] Failed to broadcast to ${moduleId}`);
      }
    });
  }

  private async loadSpecificPattern(pattern: string): Promise<any> {
    // Map pattern names to appropriate modules
    const patternModuleMap: { [key: string]: string } = {
      'vesica-piscis': 'vesica-piscis-quantum',
      'sri-yantra': 'sacred-geometry-advanced',
      'tesseract': 'tesseract-standalone',
      '3d': 'geometria-sagrada-3d',
      '4d': 'sacred-geometry-demo',
      'qci': 'teatro-visual'
    };
    
    const moduleId = patternModuleMap[pattern] || 'unified-sacred-geometry';
    return this.loadModule(moduleId);
  }

  // Performance and health monitoring
  public getSystemHealth(): any {
    const totalModules = this.modules.size;
    const activeModules = this.getActiveModules().length;
    const errorModules = Array.from(this.modules.values()).filter(m => m.status === 'error').length;
    
    return {
      totalModules,
      activeModules,
      errorModules,
      consciousnessConnected: this.consciousnessState !== null,
      lastConsciousnessUpdate: this.consciousnessState?.timestamp,
      activeConnections: this.activeConnections.size,
      health: errorModules === 0 ? 'healthy' : 'degraded'
    };
  }

  public dispose(): void {
    // Clean up all modules and connections
    this.loadedModules.forEach((instance, id) => {
      if (instance.destroy) {
        instance.destroy();
      }
    });
    
    this.loadedModules.clear();
    this.activeConnections.clear();
    
    console.log('[Module Router] Disposed');
  }
}

export default UnifiedModuleRouter;