import { Request, Response, Router } from 'express';
import { storage } from '../storage';
import { z } from 'zod';
import { InsertInsight } from '../../shared/schema-minimal';
import { summarizeInsights } from '../services/openai-analyzer';

// Create router
const router = Router();

// Get all insights with optional filtering
router.get('/', async (req: Request, res: Response) => {
  try {
    const limit = req.query.limit ? parseInt(req.query.limit as string) : undefined;
    const filter: { datasetId?: number; analysisId?: number } = {};
    
    if (req.query.datasetId) {
      filter.datasetId = parseInt(req.query.datasetId as string);
    }
    
    if (req.query.analysisId) {
      filter.analysisId = parseInt(req.query.analysisId as string);
    }
    
    const insights = await storage.getAllInsights(limit, filter);
    res.json(insights);
  } catch (error) {
    console.error('Error fetching insights:', error);
    res.status(500).json({ error: 'Failed to fetch insights' });
  }
});

// Get a specific insight by ID
router.get('/:id', async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id);
    const insight = await storage.getInsight(id);
    
    if (!insight) {
      return res.status(404).json({ error: 'Insight not found' });
    }
    
    res.json(insight);
  } catch (error) {
    console.error('Error fetching insight:', error);
    res.status(500).json({ error: 'Failed to fetch insight' });
  }
});

// Create a new insight (manual creation)
router.post('/', async (req: Request, res: Response) => {
  try {
    // Create validation schema
    const insertInsightSchema = z.object({
      title: z.string(),
      // Add other required fields for insights
      content: z.string().optional(),
      datasetId: z.number().optional(),
      analysisId: z.number().optional(),
      confidence: z.number().min(0).max(1).optional(),
      importance: z.number().min(0).max(10).optional(),
      type: z.string().optional(),
      tags: z.array(z.string()).optional(),
      isPublished: z.boolean().optional().default(false),
      createdBy: z.number().optional(),
      metadata: z.record(z.any()).optional()
    });
    
    // Validate the request body
    const validationResult = insertInsightSchema.safeParse(req.body);
    
    if (!validationResult.success) {
      return res.status(400).json({ 
        error: 'Invalid insight data', 
        details: validationResult.error.errors 
      });
    }
    
    const insight = await storage.createInsight(validationResult.data);
    res.status(201).json(insight);
  } catch (error) {
    console.error('Error creating insight:', error);
    res.status(500).json({ error: 'Failed to create insight' });
  }
});

// Update an insight
router.patch('/:id', async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id);
    
    // Check if insight exists
    const existingInsight = await storage.getInsight(id);
    if (!existingInsight) {
      return res.status(404).json({ error: 'Insight not found' });
    }
    
    // Create validation schema
    const insertInsightSchema = z.object({
      title: z.string(),
      // Add other required fields for insights
      content: z.string().optional(),
      datasetId: z.number().optional(),
      analysisId: z.number().optional(),
      confidence: z.number().min(0).max(1).optional(),
      importance: z.number().min(0).max(10).optional(),
      type: z.string().optional(),
      tags: z.array(z.string()).optional(),
      isPublished: z.boolean().optional().default(false),
      createdBy: z.number().optional(),
      metadata: z.record(z.any()).optional()
    });
    
    // Validate the request body against a subset of the schema
    const updateSchema = insertInsightSchema.partial();
    const validationResult = updateSchema.safeParse(req.body);
    
    if (!validationResult.success) {
      return res.status(400).json({ 
        error: 'Invalid insight data', 
        details: validationResult.error.errors 
      });
    }
    
    const updatedInsight = await storage.updateInsight(id, validationResult.data);
    res.json(updatedInsight);
  } catch (error) {
    console.error('Error updating insight:', error);
    res.status(500).json({ error: 'Failed to update insight' });
  }
});

// Delete an insight
router.delete('/:id', async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id);
    
    // Check if insight exists
    const existingInsight = await storage.getInsight(id);
    if (!existingInsight) {
      return res.status(404).json({ error: 'Insight not found' });
    }
    
    // Delete the insight
    const deleted = await storage.deleteInsight(id);
    
    if (deleted) {
      res.status(204).send();
    } else {
      res.status(500).json({ error: 'Failed to delete insight' });
    }
  } catch (error) {
    console.error('Error deleting insight:', error);
    res.status(500).json({ error: 'Failed to delete insight' });
  }
});

// Toggle publish status of an insight
router.post('/:id/publish', async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id);
    
    // Check if insight exists
    const existingInsight = await storage.getInsight(id);
    if (!existingInsight) {
      return res.status(404).json({ error: 'Insight not found' });
    }
    
    // Toggle the published status
    const isPublished = !existingInsight.isPublished;
    const updatedInsight = await storage.updateInsight(id, { isPublished });
    
    res.json(updatedInsight);
  } catch (error) {
    console.error('Error updating insight publish status:', error);
    res.status(500).json({ error: 'Failed to update insight publish status' });
  }
});

// Summarize multiple insights
router.post('/summarize', async (req: Request, res: Response) => {
  try {
    // Validate request body
    const summaryOptionsSchema = z.object({
      insightIds: z.array(z.number()).min(1),
      audience: z.enum(['executive', 'technical', 'marketing']).optional(),
      format: z.enum(['bullet', 'narrative', 'presentation']).optional(),
      maxLength: z.number().positive().optional(),
    });
    
    const validationResult = summaryOptionsSchema.safeParse(req.body);
    
    if (!validationResult.success) {
      return res.status(400).json({ 
        error: 'Invalid summary options', 
        details: validationResult.error.errors 
      });
    }
    
    const options = validationResult.data;
    
    // Generate summary
    const summary = await summarizeInsights(options.insightIds, {
      audience: options.audience,
      format: options.format,
      maxLength: options.maxLength,
    });
    
    res.status(200).json({ summary });
  } catch (error) {
    console.error('Error summarizing insights:', error);
    res.status(500).json({ error: 'Failed to summarize insights', details: error instanceof Error ? error.message : String(error) });
  }
});

export default router;