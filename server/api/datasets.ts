import { Request, Response, Router } from 'express';
import { storage } from '../storage.js';
import { importDataFromFile } from '../services/data-importer.js';
import { analyzeDataset } from '../services/openai-analyzer.js';
import { z } from 'zod';
import { insertDatasetSchema } from '../../shared/schema-minimal.js';
import * as fs from 'fs/promises';
import * as path from 'path';
import multer from 'multer';
import { v4 as uuidv4 } from 'uuid';

// Setup multer for file uploads
const upload = multer({
  storage: multer.diskStorage({
    destination: (req, file, cb) => {
      const uploadDir = path.join(process.cwd(), 'uploads');
      // Create directory if it doesn't exist
      fs.mkdir(uploadDir, { recursive: true })
        .then(() => cb(null, uploadDir))
        .catch(err => cb(err, uploadDir));
    },
    filename: (req, file, cb) => {
      const filename = `${uuidv4()}-${file.originalname}`;
      cb(null, filename);
    }
  }),
  limits: {
    fileSize: 50 * 1024 * 1024, // 50MB file size limit
  }
});

// Create router
const router = Router();

// Get all datasets with optional filtering
router.get('/', async (req: Request, res: Response) => {
  try {
    const limit = req.query.limit ? parseInt(req.query.limit as string) : undefined;
    const filter: { createdBy?: number; isPublic?: boolean } = {};
    
    if (req.query.createdBy) {
      filter.createdBy = parseInt(req.query.createdBy as string);
    }
    
    if (req.query.isPublic === 'true') {
      filter.isPublic = true;
    } else if (req.query.isPublic === 'false') {
      filter.isPublic = false;
    }
    
    const datasets = await storage.getAllDatasets(limit, filter);
    res.json(datasets);
  } catch (error) {
    console.error('Error fetching datasets:', error);
    res.status(500).json({ error: 'Failed to fetch datasets' });
  }
});

// Get a specific dataset by ID
router.get('/:id', async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id);
    const dataset = await storage.getDataset(id);
    
    if (!dataset) {
      return res.status(404).json({ error: 'Dataset not found' });
    }
    
    // Get dataset columns
    const columns = await storage.getDatasetColumns(id);
    
    res.json({
      ...dataset,
      columns
    });
  } catch (error) {
    console.error('Error fetching dataset:', error);
    res.status(500).json({ error: 'Failed to fetch dataset' });
  }
});

// Create a new dataset
router.post('/', async (req: Request, res: Response) => {
  try {
    // Validate the request body
    const validationResult = insertDatasetSchema.safeParse(req.body);
    
    if (!validationResult.success) {
      return res.status(400).json({ 
        error: 'Invalid dataset data', 
        details: validationResult.error.errors 
      });
    }
    
    const dataset = await storage.createDataset(validationResult.data);
    res.status(201).json(dataset);
  } catch (error) {
    console.error('Error creating dataset:', error);
    res.status(500).json({ error: 'Failed to create dataset' });
  }
});

// Update a dataset
router.patch('/:id', async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id);
    
    // Check if dataset exists
    const existingDataset = await storage.getDataset(id);
    if (!existingDataset) {
      return res.status(404).json({ error: 'Dataset not found' });
    }
    
    // Validate the request body against a subset of the schema
    const updateSchema = insertDatasetSchema.partial();
    const validationResult = updateSchema.safeParse(req.body);
    
    if (!validationResult.success) {
      return res.status(400).json({ 
        error: 'Invalid dataset data', 
        details: validationResult.error.errors 
      });
    }
    
    const updatedDataset = await storage.updateDataset(id, validationResult.data);
    res.json(updatedDataset);
  } catch (error) {
    console.error('Error updating dataset:', error);
    res.status(500).json({ error: 'Failed to update dataset' });
  }
});

// Delete a dataset
router.delete('/:id', async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id);
    
    // Check if dataset exists
    const existingDataset = await storage.getDataset(id);
    if (!existingDataset) {
      return res.status(404).json({ error: 'Dataset not found' });
    }
    
    // Delete the dataset
    const deleted = await storage.deleteDataset(id);
    
    if (deleted) {
      res.status(204).send();
    } else {
      res.status(500).json({ error: 'Failed to delete dataset' });
    }
  } catch (error) {
    console.error('Error deleting dataset:', error);
    res.status(500).json({ error: 'Failed to delete dataset' });
  }
});

// Import a file as a dataset
router.post('/import', upload.single('file'), async (req: Request, res: Response) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }
    
    // Validate request body
    const importOptionsSchema = z.object({
      datasetName: z.string().optional(),
      datasetDescription: z.string().optional(),
      format: z.string().default('csv'),
      hasHeader: z.boolean().default(true),
      delimiter: z.string().default(','),
      isPublic: z.boolean().default(false),
      tags: z.array(z.string()).optional(),
      userId: z.number().default(1), // Default to user 1 for now
    });
    
    const validationResult = importOptionsSchema.safeParse(req.body);
    
    if (!validationResult.success) {
      return res.status(400).json({ 
        error: 'Invalid import options', 
        details: validationResult.error.errors 
      });
    }
    
    const options = validationResult.data;
    
    // Start the import process
    const result = await importDataFromFile({
      userId: options.userId,
      filename: req.file.originalname,
      filePath: req.file.path,
      format: options.format,
      hasHeader: options.hasHeader,
      delimiter: options.delimiter,
      datasetName: options.datasetName,
      datasetDescription: options.datasetDescription,
      isPublic: options.isPublic,
      tags: options.tags,
    });
    
    res.status(201).json(result);
  } catch (error) {
    console.error('Error importing dataset:', error);
    res.status(500).json({ error: 'Failed to import dataset', details: error instanceof Error ? error.message : String(error) });
  }
});

// Analyze a dataset
router.post('/:id/analyze', async (req: Request, res: Response) => {
  try {
    const datasetId = parseInt(req.params.id);
    
    // Check if dataset exists
    const dataset = await storage.getDataset(datasetId);
    if (!dataset) {
      return res.status(404).json({ error: 'Dataset not found' });
    }
    
    // Validate request body
    const analysisOptionsSchema = z.object({
      analysisType: z.enum(['summary', 'trends', 'anomalies', 'correlations', 'clustering', 'comprehensive']),
      userId: z.number().default(1), // Default to user 1 for now
      options: z.object({
        confidenceThreshold: z.number().min(0).max(1).optional(),
        maxInsights: z.number().positive().optional(),
        includeVisualizations: z.boolean().optional(),
        focusColumns: z.array(z.string()).optional(),
        timeRange: z.object({
          start: z.string(),
          end: z.string()
        }).optional(),
      }).optional(),
    });
    
    const validationResult = analysisOptionsSchema.safeParse(req.body);
    
    if (!validationResult.success) {
      return res.status(400).json({ 
        error: 'Invalid analysis options', 
        details: validationResult.error.errors 
      });
    }
    
    const options = validationResult.data;
    
    // Start the analysis process
    const result = await analyzeDataset({
      datasetId,
      userId: options.userId,
      analysisType: options.analysisType,
      options: options.options,
    });
    
    res.status(200).json(result);
  } catch (error) {
    console.error('Error analyzing dataset:', error);
    res.status(500).json({ error: 'Failed to analyze dataset', details: error instanceof Error ? error.message : String(error) });
  }
});

export default router;