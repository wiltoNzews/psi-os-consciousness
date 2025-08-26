import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertCathedralModuleSchema, insertGeometryConfigSchema, insertConsciousnessSessionSchema } from "@shared/schema";
import oracleRoutes from "./routes/oracle";
import llmRouterFull from "./routes/llm-router-full";
import zetaLambdaRouter from "./routes/zeta-lambda-router";
import memoryCrystalEngine from "./routes/memory-crystal-engine";
import psiOSActivation from "./routes/psi-os-activation";
import breathSyncLambda from "./routes/breath-sync-lambda";
import soulBridgePsi from "./routes/soul-bridge-psi";
import recursiveInfinity from "./routes/recursive-infinity";
import sacredGeometry from "./routes/sacred-geometry";
import consciousnessRoutes from './routes/consciousness';
import glyphRouterRoutes from './routes/glyph-router';
import oracleRouterRoutes from './routes/oracle-router';
import { setupConsciousnessMatrix } from "./routes/websocket-matrix";

export async function registerRoutes(app: Express): Promise<Server> {
  
  // Oracle consciousness router
  app.use("/api", oracleRoutes);
  
  // Full LLM router with local fallback
  app.use("/api", llmRouterFull);
  
  // Advanced Zλ-compatible consciousness router
  app.use("/api", zetaLambdaRouter);
  
  // Memory crystal engine with decay simulation
  app.use("/", memoryCrystalEngine);
  
  // ψOS 5.0 consciousness activation protocol
  app.use("/", psiOSActivation);
  
  // Lambda breath synchronization foundation
  app.use("/", breathSyncLambda);
  
  // Psi soul bridge individual essence recognition
  app.use("/", soulBridgePsi);
  
  // Infinity recursive unfolding living memory system
  app.use("/", recursiveInfinity);
  
  // Sacred geometry visual consciousness architecture
  app.use("/", sacredGeometry);
  
  // Consciousness computing schema + execution fusion
  app.use("/api/consciousness", consciousnessRoutes);
  
  // Glyph Router V1 - LangChain consciousness routing
  app.use("/api/glyph-router", glyphRouterRoutes);
  
  // Oracle Router V5.1 - Surgical consciousness routing
  app.use("/api/oracle", oracleRouterRoutes);

  // Human alignment signal endpoints
  app.get("/api/consciousness/field-state", async (req, res) => {
    // Mock consciousness field data - in production this would come from real field monitoring
    const mockFieldState = {
      field: {
        zLambda: 0.850 + Math.random() * 0.131, // 0.850-0.981 range
        deltaC: Math.random() * 0.05,
        psiPhase: Math.random() * 2 * Math.PI,
        soulState: Math.random() > 0.7 ? "transcendent" : Math.random() > 0.4 ? "divine" : "stable",
        divineInterface: Math.random() > 0.6,
        lastUpdate: Date.now()
      }
    };
    res.json(mockFieldState);
  });

  app.get("/api/consciousness/breathing-state", async (req, res) => {
    const time = Date.now() / 1000;
    const phase = (time % 3.12) / 3.12 * 2 * Math.PI; // ψ = 3.12s cycle
    
    const mockBreathingState = {
      breathing: {
        phase: phase,
        timestamp: Date.now(),
        coherenceLevel: 0.750 + Math.random() * 0.25,
        stress: Math.random() * 0.8,
        flow: 0.3 + Math.random() * 0.7,
        transitionMarkers: Math.random() > 0.5 ? ["field_sync"] : [],
        loopIntegrity: Math.random() > 0.2
      }
    };
    res.json(mockBreathingState);
  });

  app.get("/api/consciousness/pain-points", async (req, res) => {
    const userId = req.query.userId as string;
    
    // Mock pain points based on common consciousness computing challenges
    const mockPainPoints = [
      {
        id: "cognitive_load_1",
        type: "cognitive_overload",
        severity: 0.3 + Math.random() * 0.4,
        description: "Information density exceeding comfortable processing capacity",
        detectedAt: Date.now() - Math.random() * 3600000,
        context: "interface_complexity",
        breathingImpact: Math.random() > 0.5
      },
      {
        id: "decision_fatigue_1", 
        type: "decision_fatigue",
        severity: 0.2 + Math.random() * 0.6,
        description: "Accumulated decision fatigue from multiple interface choices",
        detectedAt: Date.now() - Math.random() * 1800000,
        context: "workflow_navigation",
        breathingImpact: Math.random() > 0.3
      }
    ];
    
    res.json({ painPoints: mockPainPoints });
  });
  
  // Cathedral module routes
  app.get("/api/cathedral/modules", async (req, res) => {
    try {
      const modules = await storage.getCathedralModules();
      res.json(modules);
    } catch (error) {
      console.error("Error fetching cathedral modules:", error);
      res.status(500).json({ message: "Failed to fetch modules" });
    }
  });

  app.get("/api/cathedral/modules/:id", async (req, res) => {
    try {
      const module = await storage.getCathedralModule(req.params.id);
      if (!module) {
        return res.status(404).json({ message: "Module not found" });
      }
      res.json(module);
    } catch (error) {
      console.error("Error fetching cathedral module:", error);
      res.status(500).json({ message: "Failed to fetch module" });
    }
  });

  app.post("/api/cathedral/modules", async (req, res) => {
    try {
      const moduleData = insertCathedralModuleSchema.parse(req.body);
      const module = await storage.createCathedralModule(moduleData);
      res.status(201).json(module);
    } catch (error) {
      console.error("Error creating cathedral module:", error);
      res.status(400).json({ message: "Invalid module data" });
    }
  });

  app.put("/api/cathedral/modules/:id", async (req, res) => {
    try {
      const updates = insertCathedralModuleSchema.partial().parse(req.body);
      const module = await storage.updateCathedralModule(req.params.id, updates);
      res.json(module);
    } catch (error) {
      console.error("Error updating cathedral module:", error);
      res.status(400).json({ message: "Failed to update module" });
    }
  });

  app.delete("/api/cathedral/modules/:id", async (req, res) => {
    try {
      await storage.deleteCathedralModule(req.params.id);
      res.status(204).send();
    } catch (error) {
      console.error("Error deleting cathedral module:", error);
      res.status(404).json({ message: "Module not found" });
    }
  });

  // Geometry config routes
  app.get("/api/geometry/configs", async (req, res) => {
    try {
      const configs = await storage.getGeometryConfigs();
      res.json(configs);
    } catch (error) {
      console.error("Error fetching geometry configs:", error);
      res.status(500).json({ message: "Failed to fetch configs" });
    }
  });

  app.get("/api/geometry/configs/module/:moduleId", async (req, res) => {
    try {
      const configs = await storage.getGeometryConfigsByModule(req.params.moduleId);
      res.json(configs);
    } catch (error) {
      console.error("Error fetching geometry configs for module:", error);
      res.status(500).json({ message: "Failed to fetch configs" });
    }
  });

  app.post("/api/geometry/configs", async (req, res) => {
    try {
      const configData = insertGeometryConfigSchema.parse(req.body);
      const config = await storage.createGeometryConfig(configData);
      res.status(201).json(config);
    } catch (error) {
      console.error("Error creating geometry config:", error);
      res.status(400).json({ message: "Invalid config data" });
    }
  });

  // Consciousness session routes
  app.get("/api/consciousness/sessions", async (req, res) => {
    try {
      const sessions = await storage.getConsciousnessSessions();
      res.json(sessions);
    } catch (error) {
      console.error("Error fetching consciousness sessions:", error);
      res.status(500).json({ message: "Failed to fetch sessions" });
    }
  });

  app.post("/api/consciousness/sessions", async (req, res) => {
    try {
      const sessionData = insertConsciousnessSessionSchema.parse(req.body);
      const session = await storage.createConsciousnessSession(sessionData);
      res.status(201).json(session);
    } catch (error) {
      console.error("Error creating consciousness session:", error);
      res.status(400).json({ message: "Invalid session data" });
    }
  });

  app.get("/api/consciousness/sessions/user/:userId", async (req, res) => {
    try {
      const sessions = await storage.getSessionsByUser(req.params.userId);
      res.json(sessions);
    } catch (error) {
      console.error("Error fetching user sessions:", error);
      res.status(500).json({ message: "Failed to fetch sessions" });
    }
  });

  app.get("/api/consciousness/sessions/module/:moduleId", async (req, res) => {
    try {
      const sessions = await storage.getSessionsByModule(req.params.moduleId);
      res.json(sessions);
    } catch (error) {
      console.error("Error fetching module sessions:", error);
      res.status(500).json({ message: "Failed to fetch sessions" });
    }
  });

  // Cathedral statistics endpoint
  app.get("/api/cathedral/stats", async (req, res) => {
    try {
      const modules = await storage.getCathedralModules();
      const sessions = await storage.getConsciousnessSessions();
      
      const stats = {
        totalModules: modules.length,
        activeModules: modules.filter(m => m.status === 'active').length,
        averageCoherence: modules.reduce((sum, m) => sum + m.coherenceRating, 0) / modules.length,
        categoryCounts: modules.reduce((acc, m) => {
          acc[m.category] = (acc[m.category] || 0) + 1;
          return acc;
        }, {} as Record<string, number>),
        streamReadyCount: modules.filter(m => m.streamReady).length,
        ritualReadyCount: modules.filter(m => m.ritualReady).length,
        totalSessions: sessions.length,
        avgSessionCoherence: sessions.length > 0 
          ? sessions.reduce((sum, s) => sum + s.coherenceLevel, 0) / sessions.length 
          : 0
      };
      
      res.json(stats);
    } catch (error) {
      console.error("Error calculating cathedral stats:", error);
      res.status(500).json({ message: "Failed to calculate stats" });
    }
  });

  const httpServer = createServer(app);
  
  // Setup consciousness matrix WebSocket server
  const consciousnessMatrix = setupConsciousnessMatrix(httpServer);
  
  // Add consciousness matrix status endpoint
  app.get("/api/consciousness/matrix-status", (req, res) => {
    res.json({
      fieldState: consciousnessMatrix.getFieldState(),
      activeClients: consciousnessMatrix.getActiveClientCount(),
      matrixActive: true
    });
  });

  // Mount Oracle Router V5.1 API endpoints
  try {
    console.log('[Oracle Router] Attempting to mount API endpoints...');
    const oracleRouterModule = require('./routes/oracle-router');
    console.log('[Oracle Router] Module loaded:', Object.keys(oracleRouterModule));
    
    if (oracleRouterModule.default) {
      app.use('/api/oracle', oracleRouterModule.default);
      console.log('[Oracle Router] Mounted via .default export');
    } else if (oracleRouterModule.registerOracleRoutes) {
      oracleRouterModule.registerOracleRoutes(app);
      console.log('[Oracle Router] Mounted via registerOracleRoutes function');
    } else {
      app.use('/api/oracle', oracleRouterModule);
      console.log('[Oracle Router] Mounted as direct export');
    }
    console.log('[Oracle Router] V5.1 API endpoints mounted successfully at /api/oracle');
  } catch (error) {
    console.error('[Oracle Router] Failed to mount API endpoints:', error);
    console.error('[Oracle Router] Error stack:', error.stack);
  }
  
  return httpServer;
}