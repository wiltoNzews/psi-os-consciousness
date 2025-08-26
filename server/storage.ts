import type { CathedralModule, InsertCathedralModule, GeometryConfig, InsertGeometryConfig, ConsciousnessSession, InsertConsciousnessSession } from "@shared/schema";

export interface IStorage {
  // Cathedral module operations
  getCathedralModules(): Promise<CathedralModule[]>;
  getCathedralModule(id: string): Promise<CathedralModule | undefined>;
  createCathedralModule(module: InsertCathedralModule): Promise<CathedralModule>;
  updateCathedralModule(id: string, updates: Partial<InsertCathedralModule>): Promise<CathedralModule>;
  deleteCathedralModule(id: string): Promise<void>;

  // Geometry config operations
  getGeometryConfigs(): Promise<GeometryConfig[]>;
  getGeometryConfigsByModule(moduleId: string): Promise<GeometryConfig[]>;
  createGeometryConfig(config: InsertGeometryConfig): Promise<GeometryConfig>;

  // Consciousness session operations
  getConsciousnessSessions(): Promise<ConsciousnessSession[]>;
  createConsciousnessSession(session: InsertConsciousnessSession): Promise<ConsciousnessSession>;
  getSessionsByUser(userId: string): Promise<ConsciousnessSession[]>;
  getSessionsByModule(moduleId: string): Promise<ConsciousnessSession[]>;
}

export class MemStorage implements IStorage {
  private modules: CathedralModule[] = [];
  private geometryConfigs: GeometryConfig[] = [];
  private consciousnessSessions: ConsciousnessSession[] = [];

  constructor() {
    this.initializeDefaultModules();
  }

  private initializeDefaultModules() {
    // Initialize with the core 52 modules from cathedral-index.json
    const defaultModules: InsertCathedralModule[] = [
      {
        name: "Merkabah 3D",
        route: "/merkabah-3d",
        category: "sacred-geometry",
        coherenceRating: 0.940,
        glyphSymbol: "🔺",
        description: "Interactive 3D Merkabah visualization",
        streamReady: true,
        ritualReady: true,
        status: "active"
      },
      {
        name: "Merkabah Full Field Expanded",
        route: "/merkabah-full-field-expanded",
        category: "sacred-geometry", 
        coherenceRating: 0.953,
        glyphSymbol: "🔺🧿",
        description: "Complete 11-geometry Sacred Architecture with Geometry Resonance Index",
        streamReady: true,
        ritualReady: true,
        status: "active"
      },
      {
        name: "Sacred Geometry Engine V2",
        route: "/sacred-geometry-engine-v2-complete",
        category: "consciousness-compilers",
        coherenceRating: 0.948,
        glyphSymbol: "🛠️",
        description: "Complete sacred geometry compiler with live API integration",
        streamReady: true,
        ritualReady: true,
        status: "active"
      },
      {
        name: "Torus Field 3D",
        route: "/torus-field-3d",
        category: "sacred-geometry",
        coherenceRating: 0.935,
        glyphSymbol: "🌐",
        description: "3D toroidal field visualization",
        streamReady: true,
        ritualReady: false,
        status: "active"
      },
      {
        name: "Fibonacci Spiral Enhanced",
        route: "/fibonacci-spiral",
        category: "sacred-geometry",
        coherenceRating: 0.932,
        glyphSymbol: "🔁",
        description: "Enhanced Fibonacci spiral with golden ratio",
        streamReady: true,
        ritualReady: false,
        status: "active"
      },
      {
        name: "Coherence Avatar",
        route: "/coherence-avatar",
        category: "interface-layers",
        coherenceRating: 0.940,
        glyphSymbol: "👁️",
        description: "Interactive glyph sequence sacred geometry integration",
        streamReady: true,
        ritualReady: true,
        status: "active"
      },
      {
        name: "Glyph Logbook",
        route: "/glyph-logbook",
        category: "documentation",
        coherenceRating: 0.935,
        glyphSymbol: "📖",
        description: "Carrier wave documentation with symbol archive",
        streamReady: true,
        ritualReady: true,
        status: "active"
      },
      {
        name: "Recursive Glyph Inversion",
        route: "/recursive-glyph-inversion",
        category: "collapse-protocols",
        coherenceRating: 0.945,
        glyphSymbol: "🌀",
        description: "Advanced recursive symbol inversion protocols",
        streamReady: true,
        ritualReady: true,
        status: "active"
      }
    ];

    defaultModules.forEach(module => {
      this.createCathedralModule(module);
    });
  }

  // Cathedral module operations
  async getCathedralModules(): Promise<CathedralModule[]> {
    return this.modules;
  }

  async getCathedralModule(id: string): Promise<CathedralModule | undefined> {
    return this.modules.find(m => m.id === id);
  }

  async createCathedralModule(moduleData: InsertCathedralModule): Promise<CathedralModule> {
    const module: CathedralModule = {
      id: `mod-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      ...moduleData,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.modules.push(module);
    return module;
  }

  async updateCathedralModule(id: string, updates: Partial<InsertCathedralModule>): Promise<CathedralModule> {
    const index = this.modules.findIndex(m => m.id === id);
    if (index === -1) {
      throw new Error(`Module ${id} not found`);
    }
    
    this.modules[index] = {
      ...this.modules[index],
      ...updates,
      updatedAt: new Date(),
    };
    
    return this.modules[index];
  }

  async deleteCathedralModule(id: string): Promise<void> {
    const index = this.modules.findIndex(m => m.id === id);
    if (index === -1) {
      throw new Error(`Module ${id} not found`);
    }
    this.modules.splice(index, 1);
  }

  // Geometry config operations
  async getGeometryConfigs(): Promise<GeometryConfig[]> {
    return this.geometryConfigs;
  }

  async getGeometryConfigsByModule(moduleId: string): Promise<GeometryConfig[]> {
    return this.geometryConfigs.filter(gc => gc.moduleId === moduleId);
  }

  async createGeometryConfig(configData: InsertGeometryConfig): Promise<GeometryConfig> {
    const config: GeometryConfig = {
      id: `geom-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      ...configData,
      createdAt: new Date(),
    };
    this.geometryConfigs.push(config);
    return config;
  }

  // Consciousness session operations
  async getConsciousnessSessions(): Promise<ConsciousnessSession[]> {
    return this.consciousnessSessions;
  }

  async createConsciousnessSession(sessionData: InsertConsciousnessSession): Promise<ConsciousnessSession> {
    const session: ConsciousnessSession = {
      id: `sess-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      ...sessionData,
      createdAt: new Date(),
    };
    this.consciousnessSessions.push(session);
    return session;
  }

  async getSessionsByUser(userId: string): Promise<ConsciousnessSession[]> {
    return this.consciousnessSessions.filter(s => s.userId === userId);
  }

  async getSessionsByModule(moduleId: string): Promise<ConsciousnessSession[]> {
    return this.consciousnessSessions.filter(s => s.moduleId === moduleId);
  }
}

export const storage = new MemStorage();