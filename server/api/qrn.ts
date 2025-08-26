/**
 * Quantum Root Node API
 * 
 * This API provides endpoints for interacting with the QRN service,
 * allowing for management of Quantum Root Nodes, Neural Pathways,
 * Temporal Instances, and Meta-Cognitive Events.
 */

import { Router, Request, Response } from 'express';
import { qrnService } from '../services/qrn/quantum-root-node-service.js';
import { z } from 'zod';
import { storage } from '../storage.js';

export const router = Router();

// Schema for node creation
const createNodeSchema = z.object({
  name: z.string().min(1, "Name is required"),
  description: z.string().optional(),
  type: z.string().optional(),
  userId: z.number().optional(),
  initialCapabilities: z.array(z.string()).optional(),
  initialParameters: z.record(z.any()).optional()
});

// Schema for node update
const updateNodeSchema = z.object({
  name: z.string().optional(),
  description: z.string().optional(),
  type: z.string().optional(),
  status: z.string().optional(),
  capabilities: z.array(z.string()).optional(),
  energyLevel: z.number().optional(),
  version: z.string().optional(),
  metaParameters: z.record(z.any()).optional(),
  securityContext: z.record(z.any()).optional(),
  reflectiveState: z.record(z.any()).optional(),
  cognitiveArchitecture: z.record(z.any()).optional()
});

// Schema for neural pathway creation
const createPathwaySchema = z.object({
  sourceName: z.string().optional(),
  sourceId: z.string().uuid("Source ID must be a valid UUID"),
  targetId: z.string().uuid("Target ID must be a valid UUID"),
  targetName: z.string().optional(),
  pathType: z.string().optional(),
  strength: z.number().min(0).max(1).optional(),
  latency: z.number().min(0).optional(),
  bandwidth: z.number().min(0).optional(),
  metadata: z.record(z.any()).optional()
});

// Schema for temporal instance creation
const createTemporalInstanceSchema = z.object({
  nodeId: z.string().uuid("Node ID must be a valid UUID"),
  state: z.record(z.any()),
  dimensionType: z.string().optional(),
  parentId: z.string().uuid("Parent ID must be a valid UUID").optional(),
  stabilityFactor: z.number().min(0).max(1).optional(),
  metadata: z.record(z.any()).optional()
});

// Schema for meta-cognitive event creation
const createMetaCognitiveEventSchema = z.object({
  nodeId: z.string().uuid("Node ID must be a valid UUID"),
  type: z.string(),
  description: z.string(),
  details: z.record(z.any()).optional(),
  confidence: z.number().min(0).max(1).optional(),
  impact: z.number().min(1).max(10).optional(),
  relatedEvents: z.array(z.string()).optional(),
  outcome: z.record(z.any()).optional(),
  sourceContext: z.record(z.any()).optional()
});

// Schema for transmission recording
const recordTransmissionSchema = z.object({
  data: z.any().optional()
});

// Quantum Root Node endpoints
router.get('/', async (req: Request, res: Response) => {
  try {
    const limit = req.query.limit ? parseInt(req.query.limit as string) : undefined;
    const userId = req.query.userId ? parseInt(req.query.userId as string) : undefined;
    const type = req.query.type as string | undefined;
    const status = req.query.status as string | undefined;

    const nodes = await qrnService.getAllNodes({
      limit,
      userId,
      type,
      status
    });
    
    res.json(nodes);
  } catch (error) {
    console.error('Error fetching QRNs:', error);
    res.status(500).json({ error: 'Failed to fetch Quantum Root Nodes' });
  }
});

router.get('/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const node = await qrnService.getNode(id);
    
    if (!node) {
      return res.status(404).json({ error: 'Quantum Root Node not found' });
    }
    
    res.json(node);
  } catch (error) {
    console.error('Error fetching QRN:', error);
    res.status(500).json({ error: 'Failed to fetch Quantum Root Node' });
  }
});

router.post('/', async (req: Request, res: Response) => {
  try {
    const validationResult = createNodeSchema.safeParse(req.body);
    
    if (!validationResult.success) {
      return res.status(400).json({ 
        error: 'Invalid input',
        details: validationResult.error.format() 
      });
    }
    
    const node = await qrnService.createNode(validationResult.data);
    res.status(201).json(node);
  } catch (error) {
    console.error('Error creating QRN:', error);
    res.status(500).json({ error: 'Failed to create Quantum Root Node' });
  }
});

router.patch('/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const validationResult = updateNodeSchema.safeParse(req.body);
    
    if (!validationResult.success) {
      return res.status(400).json({ 
        error: 'Invalid input',
        details: validationResult.error.format() 
      });
    }
    
    const updatedNode = await qrnService.updateNode(id, validationResult.data);
    
    if (!updatedNode) {
      return res.status(404).json({ error: 'Quantum Root Node not found' });
    }
    
    res.json(updatedNode);
  } catch (error) {
    console.error('Error updating QRN:', error);
    res.status(500).json({ error: 'Failed to update Quantum Root Node' });
  }
});

router.delete('/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const result = await qrnService.deleteNode(id);
    
    if (!result) {
      return res.status(404).json({ error: 'Quantum Root Node not found' });
    }
    
    res.status(204).end();
  } catch (error) {
    console.error('Error deleting QRN:', error);
    res.status(500).json({ error: 'Failed to delete Quantum Root Node' });
  }
});

router.patch('/:id/state', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const state = req.body;
    
    if (!state || typeof state !== 'object') {
      return res.status(400).json({ error: 'Invalid state object' });
    }
    
    const updatedNode = await qrnService.updateNodeState(id, state);
    
    if (!updatedNode) {
      return res.status(404).json({ error: 'Quantum Root Node not found' });
    }
    
    res.json(updatedNode);
  } catch (error) {
    console.error('Error updating QRN state:', error);
    res.status(500).json({ error: 'Failed to update Quantum Root Node state' });
  }
});

// Neural Pathway endpoints
router.get('/:id/pathways', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const limit = req.query.limit ? parseInt(req.query.limit as string) : undefined;
    const pathType = req.query.pathType as string | undefined;
    
    // Get pathways where the specified node is either source or target
    const pathways = await qrnService.getAllPathways({
      limit,
      sourceId: id,
      pathType
    });
    
    res.json(pathways);
  } catch (error) {
    console.error('Error fetching pathways:', error);
    res.status(500).json({ error: 'Failed to fetch Neural Pathways' });
  }
});

router.post('/pathways', async (req: Request, res: Response) => {
  try {
    const validationResult = createPathwaySchema.safeParse(req.body);
    
    if (!validationResult.success) {
      return res.status(400).json({ 
        error: 'Invalid input',
        details: validationResult.error.format() 
      });
    }
    
    const pathway = await qrnService.createPathway(validationResult.data);
    res.status(201).json(pathway);
  } catch (error) {
    console.error('Error creating pathway:', error);
    res.status(500).json({ error: 'Failed to create Neural Pathway' });
  }
});

router.post('/pathways/:id/transmit', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const validationResult = recordTransmissionSchema.safeParse(req.body);
    
    if (!validationResult.success) {
      return res.status(400).json({ 
        error: 'Invalid input',
        details: validationResult.error.format() 
      });
    }
    
    const updatedPathway = await qrnService.recordTransmission(id, validationResult.data.data);
    
    if (!updatedPathway) {
      return res.status(404).json({ error: 'Neural Pathway not found' });
    }
    
    res.json(updatedPathway);
  } catch (error) {
    console.error('Error recording transmission:', error);
    res.status(500).json({ error: 'Failed to record transmission' });
  }
});

// Temporal Instance endpoints
router.get('/:id/temporal', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const limit = req.query.limit ? parseInt(req.query.limit as string) : undefined;
    
    const instances = await qrnService.getNodeTemporalInstances(id, limit);
    res.json(instances);
  } catch (error) {
    console.error('Error fetching temporal instances:', error);
    res.status(500).json({ error: 'Failed to fetch Temporal Instances' });
  }
});

router.post('/temporal', async (req: Request, res: Response) => {
  try {
    const validationResult = createTemporalInstanceSchema.safeParse(req.body);
    
    if (!validationResult.success) {
      return res.status(400).json({ 
        error: 'Invalid input',
        details: validationResult.error.format() 
      });
    }
    
    const instance = await qrnService.createTemporalInstance(validationResult.data);
    res.status(201).json(instance);
  } catch (error) {
    console.error('Error creating temporal instance:', error);
    res.status(500).json({ error: 'Failed to create Temporal Instance' });
  }
});

router.get('/temporal/:id/access', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const instance = await qrnService.accessTemporalInstance(id);
    
    if (!instance) {
      return res.status(404).json({ error: 'Temporal Instance not found' });
    }
    
    res.json(instance);
  } catch (error) {
    console.error('Error accessing temporal instance:', error);
    res.status(500).json({ error: 'Failed to access Temporal Instance' });
  }
});

// Meta-Cognitive Event endpoints
router.get('/:id/events', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const limit = req.query.limit ? parseInt(req.query.limit as string) : undefined;
    
    const events = await qrnService.getNodeMetaCognitiveEvents(id, limit);
    res.json(events);
  } catch (error) {
    console.error('Error fetching meta-cognitive events:', error);
    res.status(500).json({ error: 'Failed to fetch Meta-Cognitive Events' });
  }
});

router.post('/events', async (req: Request, res: Response) => {
  try {
    const validationResult = createMetaCognitiveEventSchema.safeParse(req.body);
    
    if (!validationResult.success) {
      return res.status(400).json({ 
        error: 'Invalid input',
        details: validationResult.error.format() 
      });
    }
    
    const event = await qrnService.recordMetaCognitiveEvent(validationResult.data);
    res.status(201).json(event);
  } catch (error) {
    console.error('Error creating meta-cognitive event:', error);
    res.status(500).json({ error: 'Failed to create Meta-Cognitive Event' });
  }
});