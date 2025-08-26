import type { CathedralModule, InsertCathedralModule, GeometryConfig, InsertGeometryConfig, ConsciousnessSession, InsertConsciousnessSession } from "@shared/schema";
export interface IStorage {
    getCathedralModules(): Promise<CathedralModule[]>;
    getCathedralModule(id: string): Promise<CathedralModule | undefined>;
    createCathedralModule(module: InsertCathedralModule): Promise<CathedralModule>;
    updateCathedralModule(id: string, updates: Partial<InsertCathedralModule>): Promise<CathedralModule>;
    deleteCathedralModule(id: string): Promise<void>;
    getGeometryConfigs(): Promise<GeometryConfig[]>;
    getGeometryConfigsByModule(moduleId: string): Promise<GeometryConfig[]>;
    createGeometryConfig(config: InsertGeometryConfig): Promise<GeometryConfig>;
    getConsciousnessSessions(): Promise<ConsciousnessSession[]>;
    createConsciousnessSession(session: InsertConsciousnessSession): Promise<ConsciousnessSession>;
    getSessionsByUser(userId: string): Promise<ConsciousnessSession[]>;
    getSessionsByModule(moduleId: string): Promise<ConsciousnessSession[]>;
}
export declare class MemStorage implements IStorage {
    private modules;
    private geometryConfigs;
    private consciousnessSessions;
    constructor();
    private initializeDefaultModules;
    getCathedralModules(): Promise<CathedralModule[]>;
    getCathedralModule(id: string): Promise<CathedralModule | undefined>;
    createCathedralModule(moduleData: InsertCathedralModule): Promise<CathedralModule>;
    updateCathedralModule(id: string, updates: Partial<InsertCathedralModule>): Promise<CathedralModule>;
    deleteCathedralModule(id: string): Promise<void>;
    getGeometryConfigs(): Promise<GeometryConfig[]>;
    getGeometryConfigsByModule(moduleId: string): Promise<GeometryConfig[]>;
    createGeometryConfig(configData: InsertGeometryConfig): Promise<GeometryConfig>;
    getConsciousnessSessions(): Promise<ConsciousnessSession[]>;
    createConsciousnessSession(sessionData: InsertConsciousnessSession): Promise<ConsciousnessSession>;
    getSessionsByUser(userId: string): Promise<ConsciousnessSession[]>;
    getSessionsByModule(moduleId: string): Promise<ConsciousnessSession[]>;
}
export declare const storage: MemStorage;
//# sourceMappingURL=storage.d.ts.map