/**
 * Persistent Context Service Interface
 * 
 * Defines the contract for context persistence following Void-Centered Design
 * principles by explicitly acknowledging the boundary between in-memory
 * operations and persisted data.
 */

export interface PersistentContext {
  sessionId: string;
  history: any[];
  metaInsights: any[];
  strategicPlans: any[];
  relationships: any[];
  version: number;
  lastUpdated: Date;
}

export interface IPersistentContextService {
  initializeSession(sessionId: string): Promise<PersistentContext>;
  saveContext(context: PersistentContext): Promise<void>;
  loadContext(sessionId: string): Promise<PersistentContext | null>;
  addHistoryChunk(sessionId: string, chunk: any): Promise<void>;
  addMetaInsight(sessionId: string, insight: any): Promise<void>;
  addStrategicPlan(sessionId: string, plan: any): Promise<void>;
  updateStrategicPlan(sessionId: string, updatedPlan: any): Promise<void>;
  addRelationship(sessionId: string, relationship: any): Promise<void>;
  getRecentHistory(sessionId: string, layer: string, limit: number): Promise<any[]>;
  getActiveStrategicPlans(sessionId: string): Promise<any[]>;
  getInsightsByType(sessionId: string, eventType: string, minImportance: number): Promise<any[]>;
  searchContext(sessionId: string, query: string): Promise<any[]>;
}