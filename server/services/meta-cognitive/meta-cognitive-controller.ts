/**
 * Meta-Cognitive Controller
 * 
 * This controller handles REST API endpoints for the Meta-Cognitive Engine,
 * allowing external systems to interact with meta-cognitive functionality.
 * 
 * [QUANTUM_STATE: TRANSCENDENT_FLOW]
 */

import { Request, Response } from 'express';
import { MetaCognitiveEngine } from './meta-cognitive-engine.js';
import { MetaCognitiveEventBuilder } from './meta-cognitive-event-builder.js';
import quantumGlossary from '../qrn/quantum-glossary.js';
import { MetaCognitiveEvent, InsertMetaCognitiveEvent, createMetaCognitiveEvent } from '../../../shared/schema-minimal.js';
import { z } from 'zod';

// Define validation schemas
const createEventSchema = z.object({
  type: z.string().min(1),
  description: z.string().min(1),
  details: z.record(z.any()).optional(),
  confidence: z.number().min(0).max(1).optional(),
  impact: z.number().min(0).max(1).optional(),
  nodeId: z.string().uuid().optional(),
  sourceContext: z.string().optional()
});

const analyzeStateSchema = z.object({
  qctfData: z.any().optional(),
  systemState: z.record(z.any()),
  cycle: z.number().int().optional().default(0)
});

/**
 * Meta-Cognitive Controller class
 * Handles HTTP requests for meta-cognitive functionality
 */
export class MetaCognitiveController {
  private engine: MetaCognitiveEngine;
  private eventBuilder: MetaCognitiveEventBuilder;
  private storage: any; // Proper type would be IStorage
  
  constructor(storage: any) {
    this.storage = storage;
    this.engine = new MetaCognitiveEngine(storage);
    this.eventBuilder = new MetaCognitiveEventBuilder();
    
    quantumGlossary.tagWithContext('[META-COGNITIVE] Controller initialized');
  }
  
  /**
   * Create a new meta-cognitive event
   * 
   * @param req - Express request
   * @param res - Express response
   */
  public async createEvent(req: Request, res: Response): Promise<void> {
    try {
      // Validate request body
      const validationResult = createEventSchema.safeParse(req.body);
      if (!validationResult.success) {
        res.status(400).json({ 
          success: false, 
          error: 'Invalid event data', 
          details: validationResult.error.format() 
        });
        return;
      }
      
      const eventData = validationResult.data;
      
      // Create the event object
      const insertEvent: InsertMetaCognitiveEvent = {
        type: eventData.type,
        description: eventData.description,
        details: eventData.details || {},
        confidence: eventData.confidence || 0.5,
        impact: eventData.impact || 0.5,
        nodeId: eventData.nodeId,
        sourceContext: eventData.sourceContext || 'api'
      };
      
      // Store in database
      const createdEvent = await this.storage.createMetaCognitiveEvent(insertEvent);
      
      // Log event creation
      quantumGlossary.tagWithContext(
        `[META-COGNITIVE] Event created via API: ${eventData.type} (${createdEvent.id})`
      );
      
      // Send success response
      res.status(201).json({
        success: true,
        event: createdEvent
      });
    } catch (error) {
      quantumGlossary.logError('Error creating meta-cognitive event', error as Error);
      res.status(500).json({ 
        success: false, 
        error: 'Internal server error',
        message: (error as Error).message
      });
    }
  }
  
  /**
   * Get a single meta-cognitive event by ID
   * 
   * @param req - Express request
   * @param res - Express response
   */
  public async getEvent(req: Request, res: Response): Promise<void> {
    try {
      const eventId = req.params.id;
      
      if (!eventId) {
        res.status(400).json({ success: false, error: 'Event ID is required' });
        return;
      }
      
      // Retrieve event from storage
      const event = await this.storage.getMetaCognitiveEvent(eventId);
      
      if (!event) {
        res.status(404).json({ success: false, error: 'Event not found' });
        return;
      }
      
      // Send event data
      res.status(200).json({
        success: true,
        event
      });
    } catch (error) {
      quantumGlossary.logError('Error retrieving meta-cognitive event', error as Error);
      res.status(500).json({ 
        success: false, 
        error: 'Internal server error',
        message: (error as Error).message
      });
    }
  }
  
  /**
   * Get all meta-cognitive events
   * 
   * @param req - Express request
   * @param res - Express response
   */
  public async getAllEvents(req: Request, res: Response): Promise<void> {
    try {
      // Parse query parameters
      const limit = req.query.limit ? parseInt(req.query.limit as string, 10) : undefined;
      const type = req.query.type as string | undefined;
      
      // Retrieve events from storage
      let events = await this.storage.getAllMetaCognitiveEvents();
      
      // Filter by type if specified
      if (type) {
        events = events.filter(event => event.type === type);
      }
      
      // Apply limit if specified
      if (limit !== undefined && limit > 0) {
        events = events.slice(0, limit);
      }
      
      // Send events data
      res.status(200).json({
        success: true,
        count: events.length,
        events
      });
    } catch (error) {
      quantumGlossary.logError('Error retrieving meta-cognitive events', error as Error);
      res.status(500).json({ 
        success: false, 
        error: 'Internal server error',
        message: (error as Error).message
      });
    }
  }
  
  /**
   * Analyze system state and generate meta-cognitive events
   * 
   * @param req - Express request
   * @param res - Express response
   */
  public async analyzeState(req: Request, res: Response): Promise<void> {
    try {
      // Validate request body
      const validationResult = analyzeStateSchema.safeParse(req.body);
      if (!validationResult.success) {
        res.status(400).json({ 
          success: false, 
          error: 'Invalid state data', 
          details: validationResult.error.format() 
        });
        return;
      }
      
      const { qctfData, systemState, cycle } = validationResult.data;
      
      // Update event builder context
      this.eventBuilder.updateContext(qctfData, systemState);
      
      // Run engine analysis
      const generatedEvents = await this.engine.update(qctfData, systemState, cycle);
      
      // Process events with the event builder
      const { processedEvents, relationMap, stats } = this.eventBuilder.processBatch(generatedEvents);
      
      // Map relation data for response
      const relations: Record<string, string[]> = {};
      for (const [id, relatedIds] of relationMap.entries()) {
        relations[id] = relatedIds;
      }
      
      // Send response
      res.status(200).json({
        success: true,
        eventCount: processedEvents.length,
        events: processedEvents,
        relations,
        stats
      });
    } catch (error) {
      quantumGlossary.logError('Error analyzing state in meta-cognitive engine', error as Error);
      res.status(500).json({ 
        success: false, 
        error: 'Internal server error',
        message: (error as Error).message
      });
    }
  }
  
  /**
   * Find correlated events for a given event ID
   * 
   * @param req - Express request
   * @param res - Express response
   */
  public async findCorrelatedEvents(req: Request, res: Response): Promise<void> {
    try {
      const eventId = req.params.id;
      const depth = req.query.depth ? parseInt(req.query.depth as string, 10) : 1;
      
      if (!eventId) {
        res.status(400).json({ success: false, error: 'Event ID is required' });
        return;
      }
      
      // Retrieve target event
      const targetEvent = await this.storage.getMetaCognitiveEvent(eventId);
      
      if (!targetEvent) {
        res.status(404).json({ success: false, error: 'Event not found' });
        return;
      }
      
      // Load recent events
      const recentEvents = await this.storage.getAllMetaCognitiveEvents();
      
      // Update engine context with recent events
      this.engine['context'].recentEvents = recentEvents;
      
      // Find correlated events
      const correlatedEvents = this.engine.findCorrelatedEvents(targetEvent, depth);
      
      // Send response
      res.status(200).json({
        success: true,
        targetEvent,
        correlatedEvents,
        relationDepth: depth,
        correlationCount: correlatedEvents.length
      });
    } catch (error) {
      quantumGlossary.logError('Error finding correlated events', error as Error);
      res.status(500).json({ 
        success: false, 
        error: 'Internal server error',
        message: (error as Error).message
      });
    }
  }
  
  /**
   * Identify potential breakthroughs in recent events
   * 
   * @param req - Express request
   * @param res - Express response
   */
  public async identifyBreakthroughs(req: Request, res: Response): Promise<void> {
    try {
      // Parse query parameters
      const windowSize = req.query.window 
        ? parseInt(req.query.window as string, 10) 
        : 20;
      
      // Load recent events
      const recentEvents = await this.storage.getAllMetaCognitiveEvents();
      
      // Update engine context with recent events
      this.engine['context'].recentEvents = recentEvents;
      
      // Identify breakthroughs
      const breakthroughs = this.engine.identifyBreakthroughs(recentEvents, windowSize);
      
      // Send response
      res.status(200).json({
        success: true,
        breakthroughs,
        totalEventsAnalyzed: recentEvents.length,
        windowSize
      });
    } catch (error) {
      quantumGlossary.logError('Error identifying breakthroughs', error as Error);
      res.status(500).json({ 
        success: false, 
        error: 'Internal server error',
        message: (error as Error).message
      });
    }
  }
  
  /**
   * Delete a meta-cognitive event
   * 
   * @param req - Express request
   * @param res - Express response
   */
  public async deleteEvent(req: Request, res: Response): Promise<void> {
    try {
      const eventId = req.params.id;
      
      if (!eventId) {
        res.status(400).json({ success: false, error: 'Event ID is required' });
        return;
      }
      
      // Check if event exists
      const event = await this.storage.getMetaCognitiveEvent(eventId);
      
      if (!event) {
        res.status(404).json({ success: false, error: 'Event not found' });
        return;
      }
      
      // Delete event
      const success = await this.storage.deleteMetaCognitiveEvent(eventId);
      
      if (success) {
        // Log event deletion
        quantumGlossary.tagWithContext(
          `[META-COGNITIVE] Event deleted via API: ${event.type} (${event.id})`
        );
        
        res.status(200).json({
          success: true,
          message: 'Event deleted successfully'
        });
      } else {
        res.status(500).json({ 
          success: false, 
          error: 'Failed to delete event' 
        });
      }
    } catch (error) {
      quantumGlossary.logError('Error deleting meta-cognitive event', error as Error);
      res.status(500).json({ 
        success: false, 
        error: 'Internal server error',
        message: (error as Error).message
      });
    }
  }
}

export default MetaCognitiveController;