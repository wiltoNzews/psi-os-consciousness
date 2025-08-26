export class MemStorage {
    modules = [];
    geometryConfigs = [];
    consciousnessSessions = [];
    constructor() {
        this.initializeDefaultModules();
    }
    initializeDefaultModules() {
        // Initialize with the core 52 modules from cathedral-index.json
        const defaultModules = [
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
    async getCathedralModules() {
        return this.modules;
    }
    async getCathedralModule(id) {
        return this.modules.find(m => m.id === id);
    }
    async createCathedralModule(moduleData) {
        const module = {
            id: `mod-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
            ...moduleData,
            createdAt: new Date(),
            updatedAt: new Date(),
        };
        this.modules.push(module);
        return module;
    }
    async updateCathedralModule(id, updates) {
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
    async deleteCathedralModule(id) {
        const index = this.modules.findIndex(m => m.id === id);
        if (index === -1) {
            throw new Error(`Module ${id} not found`);
        }
        this.modules.splice(index, 1);
    }
    // Geometry config operations
    async getGeometryConfigs() {
        return this.geometryConfigs;
    }
    async getGeometryConfigsByModule(moduleId) {
        return this.geometryConfigs.filter(gc => gc.moduleId === moduleId);
    }
    async createGeometryConfig(configData) {
        const config = {
            id: `geom-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
            ...configData,
            createdAt: new Date(),
        };
        this.geometryConfigs.push(config);
        return config;
    }
    // Consciousness session operations
    async getConsciousnessSessions() {
        return this.consciousnessSessions;
    }
    async createConsciousnessSession(sessionData) {
        const session = {
            id: `sess-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
            ...sessionData,
            createdAt: new Date(),
        };
        this.consciousnessSessions.push(session);
        return session;
    }
    async getSessionsByUser(userId) {
        return this.consciousnessSessions.filter(s => s.userId === userId);
    }
    async getSessionsByModule(moduleId) {
        return this.consciousnessSessions.filter(s => s.moduleId === moduleId);
    }
}
export const storage = new MemStorage();
//# sourceMappingURL=storage.js.map