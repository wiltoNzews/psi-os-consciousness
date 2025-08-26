import { Request, Response, Router } from 'express';
import { storage } from '../storage.js';
import { z } from 'zod';
import { InsertAnalysisResult } from '../../shared/schema-minimal.js';
import { analyzeResult } from '../services/openai-analyzer.js';

// Create router
const router = Router();

// Get all analysis results with optional filtering
router.get('/', async (req: Request, res: Response) => {
  try {
    const limit = req.query.limit ? parseInt(req.query.limit as string) : undefined;
    const filter: { datasetId?: number; modelId?: number } = {};
    
    if (req.query.datasetId) {
      filter.datasetId = parseInt(req.query.datasetId as string);
    }
    
    if (req.query.modelId) {
      filter.modelId = parseInt(req.query.modelId as string);
    }
    
    const results = await storage.getAllAnalysisResults(limit, filter);
    res.json(results);
  } catch (error) {
    console.error('Error fetching analysis results:', error);
    res.status(500).json({ error: 'Failed to fetch analysis results' });
  }
});

// Get a specific analysis result by ID
router.get('/:id', async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id);
    const result = await storage.getAnalysisResult(id);
    
    if (!result) {
      return res.status(404).json({ error: 'Analysis result not found' });
    }
    
    // Get related insights
    const insights = await storage.getAllInsights(undefined, { analysisId: id });
    
    res.json({
      ...result,
      insights
    });
  } catch (error) {
    console.error('Error fetching analysis result:', error);
    res.status(500).json({ error: 'Failed to fetch analysis result' });
  }
});

// Create a new analysis result (manual creation)
router.post('/', async (req: Request, res: Response) => {
  try {
    // Create validation schema
    const insertAnalysisResultSchema = z.object({
      name: z.string(),
      // Add any other fields needed for analysis results
      datasetId: z.number().optional(),
      modelId: z.number().optional(),
      resultType: z.string().optional(),
      data: z.any().optional(),
      metrics: z.record(z.any()).optional(),
      createdBy: z.number().optional(),
      status: z.string().optional()
    });
    
    // Validate the request body
    const validationResult = insertAnalysisResultSchema.safeParse(req.body);
    
    if (!validationResult.success) {
      return res.status(400).json({ 
        error: 'Invalid analysis result data', 
        details: validationResult.error.errors 
      });
    }
    
    const result = await storage.createAnalysisResult(validationResult.data);
    res.status(201).json(result);
  } catch (error) {
    console.error('Error creating analysis result:', error);
    res.status(500).json({ error: 'Failed to create analysis result' });
  }
});

// Update an analysis result
router.patch('/:id', async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id);
    
    // Check if analysis result exists
    const existingResult = await storage.getAnalysisResult(id);
    if (!existingResult) {
      return res.status(404).json({ error: 'Analysis result not found' });
    }
    
    // Create validation schema for the update
    const insertAnalysisResultSchema = z.object({
      name: z.string(),
      // Add any other fields needed for analysis results
      datasetId: z.number().optional(),
      modelId: z.number().optional(),
      resultType: z.string().optional(),
      data: z.any().optional(),
      metrics: z.record(z.any()).optional(),
      createdBy: z.number().optional(),
      status: z.string().optional()
    });
    
    // Validate the request body against a subset of the schema
    const updateSchema = insertAnalysisResultSchema.partial();
    const validationResult = updateSchema.safeParse(req.body);
    
    if (!validationResult.success) {
      return res.status(400).json({ 
        error: 'Invalid analysis result data', 
        details: validationResult.error.errors 
      });
    }
    
    const updatedResult = await storage.updateAnalysisResult(id, validationResult.data);
    res.json(updatedResult);
  } catch (error) {
    console.error('Error updating analysis result:', error);
    res.status(500).json({ error: 'Failed to update analysis result' });
  }
});

// Delete an analysis result
router.delete('/:id', async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id);
    
    // Check if analysis result exists
    const existingResult = await storage.getAnalysisResult(id);
    if (!existingResult) {
      return res.status(404).json({ error: 'Analysis result not found' });
    }
    
    // Delete the analysis result
    const deleted = await storage.deleteAnalysisResult(id);
    
    if (deleted) {
      res.status(204).send();
    } else {
      res.status(500).json({ error: 'Failed to delete analysis result' });
    }
  } catch (error) {
    console.error('Error deleting analysis result:', error);
    res.status(500).json({ error: 'Failed to delete analysis result' });
  }
});

// Generate additional insights for an analysis
router.post('/:id/insights', async (req: Request, res: Response) => {
  try {
    const analysisId = parseInt(req.params.id);
    
    // Check if analysis result exists
    const existingResult = await storage.getAnalysisResult(analysisId);
    if (!existingResult) {
      return res.status(404).json({ error: 'Analysis result not found' });
    }
    
    // Validate request body
    const insightOptionsSchema = z.object({
      userId: z.number().default(1), // Default to user 1 for now
      focusArea: z.string().optional(),
      deepDive: z.boolean().default(false),
      confidenceThreshold: z.number().min(0).max(1).optional(),
    });
    
    const validationResult = insightOptionsSchema.safeParse(req.body);
    
    if (!validationResult.success) {
      return res.status(400).json({ 
        error: 'Invalid insight generation options', 
        details: validationResult.error.errors 
      });
    }
    
    const options = validationResult.data;
    
    // Generate additional insights
    const insights = await analyzeResult(analysisId, options.userId, {
      focusArea: options.focusArea,
      deepDive: options.deepDive,
      confidenceThreshold: options.confidenceThreshold,
    });
    
    res.status(200).json(insights);
  } catch (error) {
    console.error('Error generating insights:', error);
    res.status(500).json({ error: 'Failed to generate insights', details: error instanceof Error ? error.message : String(error) });
  }
});

export default router;