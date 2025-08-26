/**
 * Meta-Cognitive API (Neural-Quantum naming: 'mc-')
 * 
 * This API provides endpoints for accessing the Meta-Cognitive Analysis Engine,
 * which analyzes patterns, generates insights, and provides feedback loops
 * for system improvement.
 * 
 * All endpoints follow the neural-quantum naming convention with 'mc-' prefix
 * to indicate meta-cognitive processes.
 */

import { Router, Request, Response } from 'express';
import { metaCognitiveEngine, PatternType, InsightSeverity } from '../services/qrn/meta-cognitive-analysis-engine.js';
import { z } from 'zod';
import { storage } from '../storage.js';
import { MetaCognitiveEvent } from '../../shared/schema-minimal.js';

export const router = Router();
export { metaCognitiveEngine }; // Export the engine directly for scripts to use

// Schema for pattern filtering
const patternFilterSchema = z.object({
  nodeId: z.string().optional(),
  patternType: z.enum([
    PatternType.SEQUENTIAL,
    PatternType.CYCLICAL,
    PatternType.CAUSAL,
    PatternType.CORRELATIONAL,
    PatternType.EMERGENT
  ]).optional(),
  minConfidence: z.number().min(0).max(1).optional(),
  strategicLayer: z.number().min(1).max(5).optional(),
  limit: z.number().min(1).max(100).optional()
});

// Schema for insight filtering
const insightFilterSchema = z.object({
  nodeId: z.string().optional(),
  severity: z.enum([
    InsightSeverity.INFORMATION,
    InsightSeverity.SUGGESTION,
    InsightSeverity.WARNING,
    InsightSeverity.CRITICAL
  ]).optional(),
  minImpact: z.number().min(1).max(10).optional(),
  strategicLayer: z.number().min(1).max(5).optional(),
  limit: z.number().min(1).max(100).optional()
});

/**
 * Get cognitive state summary
 * Using neural-quantum naming convention: mcGetCognitiveStateSummary
 */
router.get('/summary', async (req: Request, res: Response) => {
  try {
    const summary = metaCognitiveEngine.getCognitiveStateSummary();
    res.json(summary);
  } catch (error) {
    console.error('Error getting cognitive state summary:', error);
    res.status(500).json({ error: 'Failed to get cognitive state summary' });
  }
});

/**
 * Get cognitive patterns
 * Using neural-quantum naming convention: mcGetCognitivePatterns
 */
router.get('/patterns', async (req: Request, res: Response) => {
  try {
    const validationResult = patternFilterSchema.safeParse(req.query);
    
    if (!validationResult.success) {
      return res.status(400).json({ 
        error: 'Invalid query parameters',
        details: validationResult.error.format() 
      });
    }
    
    // Extract validated query params
    const { nodeId, patternType, minConfidence, strategicLayer } = validationResult.data;
    const limit = validationResult.data.limit || 50;
    
    // Get patterns with filters
    let patterns = metaCognitiveEngine.getPatterns({
      nodeId,
      patternType,
      minConfidence,
      strategicLayer
    });
    
    // Apply limit
    patterns = patterns.slice(0, limit);
    
    res.json(patterns);
  } catch (error) {
    console.error('Error getting cognitive patterns:', error);
    res.status(500).json({ error: 'Failed to get cognitive patterns' });
  }
});

/**
 * Get cognitive insights
 * Using neural-quantum naming convention: mcGetCognitiveInsights
 */
router.get('/insights', async (req: Request, res: Response) => {
  try {
    const validationResult = insightFilterSchema.safeParse(req.query);
    
    if (!validationResult.success) {
      return res.status(400).json({ 
        error: 'Invalid query parameters',
        details: validationResult.error.format() 
      });
    }
    
    // Extract validated query params
    const { nodeId, severity, minImpact, strategicLayer } = validationResult.data;
    const limit = validationResult.data.limit || 50;
    
    // Get insights with filters
    let insights = metaCognitiveEngine.getInsights({
      nodeId,
      severity,
      minImpact,
      strategicLayer
    });
    
    // Apply limit
    insights = insights.slice(0, limit);
    
    res.json(insights);
  } catch (error) {
    console.error('Error getting cognitive insights:', error);
    res.status(500).json({ error: 'Failed to get cognitive insights' });
  }
});

/**
 * Get patterns for a specific node
 * Using neural-quantum naming convention: mcGetNodePatterns
 */
router.get('/nodes/:nodeId/patterns', async (req: Request, res: Response) => {
  try {
    const { nodeId } = req.params;
    
    // Validate nodeId format (UUID)
    if (!/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(nodeId)) {
      return res.status(400).json({ error: 'Invalid node ID format' });
    }
    
    // Verify node exists
    const node = await storage.getQuantumRootNode(nodeId);
    if (!node) {
      return res.status(404).json({ error: 'Quantum Root Node not found' });
    }
    
    // Get patterns specific to this node
    const patterns = metaCognitiveEngine.getPatterns({ nodeId });
    
    res.json(patterns);
  } catch (error) {
    console.error('Error getting node patterns:', error);
    res.status(500).json({ error: 'Failed to get node patterns' });
  }
});

/**
 * Get insights for a specific node
 * Using neural-quantum naming convention: mcGetNodeInsights
 */
router.get('/nodes/:nodeId/insights', async (req: Request, res: Response) => {
  try {
    const { nodeId } = req.params;
    
    // Validate nodeId format (UUID)
    if (!/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(nodeId)) {
      return res.status(400).json({ error: 'Invalid node ID format' });
    }
    
    // Verify node exists
    const node = await storage.getQuantumRootNode(nodeId);
    if (!node) {
      return res.status(404).json({ error: 'Quantum Root Node not found' });
    }
    
    // Get insights specific to this node
    const insights = metaCognitiveEngine.getInsights({ nodeId });
    
    res.json(insights);
  } catch (error) {
    console.error('Error getting node insights:', error);
    res.status(500).json({ error: 'Failed to get node insights' });
  }
});

/**
 * Analyze system stability trends
 * Using neural-quantum naming convention: mcAnalyzeSystemStabilityTrends
 */
router.get('/stability-trends', async (req: Request, res: Response) => {
  try {
    // Parse days from query parameter
    const daysParam = req.query.days;
    let days = 7; // Default to one week
    
    if (daysParam) {
      const parsedDays = parseInt(daysParam as string, 10);
      if (!isNaN(parsedDays) && parsedDays > 0 && parsedDays <= 90) {
        days = parsedDays;
      } else {
        return res.status(400).json({ 
          error: 'Invalid days parameter. Must be a number between 1 and 90.'
        });
      }
    }
    
    // Analyze stability trends
    const analysis = await metaCognitiveEngine.analyzeSystemStabilityTrends(days);
    
    res.json({
      ...analysis,
      analyzedDays: days,
      generatedAt: new Date()
    });
  } catch (error) {
    console.error('Error analyzing system stability trends:', error);
    res.status(500).json({ error: 'Failed to analyze system stability trends' });
  }
});

/**
 * Get a real-time system health report
 * Using neural-quantum naming convention: mcGetSystemHealthReport
 */
router.get('/system-health', async (req: Request, res: Response) => {
  try {
    // Get the cognitive state summary
    const summary = metaCognitiveEngine.getCognitiveStateSummary();
    
    // Get the latest system metrics
    const latestMetrics = await storage.getLatestQRNMetrics();
    
    // Get insights with warning or critical severity
    const warnings = metaCognitiveEngine.getInsights({ 
      severity: InsightSeverity.WARNING,
      minImpact: 5
    }).slice(0, 5);
    
    const critical = metaCognitiveEngine.getInsights({ 
      severity: InsightSeverity.CRITICAL 
    });
    
    // Generate health status based on metrics and insights
    let status = 'healthy';
    if (critical.length > 0) {
      status = 'critical';
    } else if (warnings.length > 0) {
      status = 'warning';
    } else if (latestMetrics && latestMetrics.stability && latestMetrics.stability < 0.5) {
      status = 'unstable';
    }
    
    // Generate a high-level status message
    let statusMessage = 'System is operating normally.';
    if (status === 'critical') {
      statusMessage = 'Critical issues detected. Immediate attention required.';
    } else if (status === 'warning') {
      statusMessage = 'Warning conditions detected. Monitoring advised.';
    } else if (status === 'unstable') {
      statusMessage = 'System stability is below optimal levels.';
    }
    
    // Compile the health report
    const healthReport = {
      status,
      statusMessage,
      timestamp: new Date(),
      metrics: latestMetrics || { stability: null, efficiency: null, coherence: null },
      summary: {
        patternCount: summary.patternCount,
        insightCount: summary.insightCount,
        warningCount: summary.warningCount,
        criticalCount: summary.criticalCount,
        entropy: summary.entropy
      },
      alerts: {
        critical,
        warnings
      },
      recommendations: [
        ...critical.flatMap(c => c.suggestedActions || []),
        ...warnings.flatMap(w => w.suggestedActions || [])
      ].filter((v, i, a) => a.indexOf(v) === i).slice(0, 5) // Unique, limited to 5
    };
    
    res.json(healthReport);
  } catch (error) {
    console.error('Error generating system health report:', error);
    res.status(500).json({ error: 'Failed to generate system health report' });
  }
});

/**
 * Create a new meta-cognitive event
 * Using neural-quantum naming convention: mcCreateEvent
 */
router.post('/events', async (req: Request, res: Response) => {
  try {
    // Basic validation for required fields
    const { id, nodeId, type, eventType, description, details } = req.body;
    
    if (!id || !nodeId || !type || !description) {
      return res.status(400).json({ 
        error: 'Missing required fields', 
        requiredFields: ['id', 'nodeId', 'type', 'description']
      });
    }

    // Process the event through meta-cognitive engine
    const event: MetaCognitiveEvent = {
      ...req.body,
      createdAt: req.body.createdAt ? new Date(req.body.createdAt) : new Date(),
      timestamp: req.body.timestamp ? new Date(req.body.timestamp) : new Date()
    };

    // Save to storage first
    await storage.createMetaCognitiveEvent(event);
    
    // Process the event in the engine (may generate patterns/insights)
    const result = await metaCognitiveEngine.processEvent(event);
    
    // Return success response with processing result
    res.status(201).json({
      id: event.id,
      processed: true,
      timestamp: new Date(),
      result
    });
  } catch (error) {
    console.error('Error creating meta-cognitive event:', error);
    res.status(500).json({ 
      error: 'Failed to create meta-cognitive event',
      message: error instanceof Error ? error.message : String(error)
    });
  }
});

/**
 * Get all meta-cognitive events
 * Using neural-quantum naming convention: mcGetAllEvents
 */
router.get('/events', async (req: Request, res: Response) => {
  try {
    // Parse query parameters for filtering
    const limit = req.query.limit ? parseInt(req.query.limit as string) : 100;
    const nodeId = req.query.nodeId as string;
    const eventType = req.query.eventType as string;
    
    // Get events from storage with filters
    const events = await storage.getAllMetaCognitiveEvents(limit, {
      nodeId,
      eventType
    });
    
    res.json(events);
  } catch (error) {
    console.error('Error fetching meta-cognitive events:', error);
    res.status(500).json({ error: 'Failed to fetch meta-cognitive events' });
  }
});

/**
 * Get a specific meta-cognitive event by ID
 * Using neural-quantum naming convention: mcGetEventById
 */
router.get('/events/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    
    // Get the event from storage
    const event = await storage.getMetaCognitiveEvent(id);
    
    if (!event) {
      return res.status(404).json({ error: 'Meta-cognitive event not found' });
    }
    
    res.json(event);
  } catch (error) {
    console.error(`Error fetching meta-cognitive event ${req.params.id}:`, error);
    res.status(500).json({ error: 'Failed to fetch meta-cognitive event' });
  }
});

export default router;