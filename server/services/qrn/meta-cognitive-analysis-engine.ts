/**
 * Meta-Cognitive Analysis Engine
 * 
 * This service analyzes meta-cognitive events to detect patterns,
 * anomalies, and generate insights that can improve system performance.
 * 
 * Core capabilities:
 * - Pattern detection across temporal instances
 * - Anomaly detection in cognitive processes
 * - Insight generation for system optimization
 * - Feedback loops for continuous improvement
 * - Strategic layer awareness
 */

import { storage } from '../../storage.js';
import { MetaCognitiveEvent, createMetaCognitiveEvent, InsertMetaCognitiveEvent } from '../../../shared/schema-minimal.js';
import { qrnService } from './quantum-root-node-service.js';

// Types of patterns the engine can detect
export enum PatternType {
  SEQUENTIAL = 'sequential',
  CYCLICAL = 'cyclical',
  CAUSAL = 'causal',
  CORRELATIONAL = 'correlational',
  EMERGENT = 'emergent'
}

// Insight severity levels
export enum InsightSeverity {
  INFORMATION = 'information',
  SUGGESTION = 'suggestion', 
  WARNING = 'warning',
  CRITICAL = 'critical'
}

// Structure for detected patterns
export interface CognitivePattern {
  id: string;
  type: PatternType;
  nodeIds: string[];
  eventTypes: string[];
  confidence: number; // Changed from confidenceLevel for consistency
  description: string;
  firstDetected: Date;
  lastDetected: Date;
  occurrences: number;
  strategicLayer: number; // 1-5, with 5 being the highest abstraction
}

// Structure for generated insights
export interface CognitiveInsight {
  id: string;
  patternId?: string;
  nodeId?: string;
  title: string;
  description: string;
  severity: InsightSeverity;
  confidence: number; // Changed from confidenceLevel for consistency
  impact: number; // 1-10
  suggestedActions?: string[];
  createdAt: Date; // Changed from timestamp for consistency
  strategicLayer: number;
}

export class MetaCognitiveAnalysisEngine {
  private patterns: Map<string, CognitivePattern> = new Map();
  private insights: Map<string, CognitiveInsight> = new Map();
  private eventTimestamps: Map<string, number[]> = new Map<string, number[]>();
  private eventTypeStats: Map<string, { count: number, avgImpact: number }> = new Map<string, { count: number, avgImpact: number }>();
  
  // Singleton instance
  private static instance: MetaCognitiveAnalysisEngine;
  
  // Get singleton instance
  public static getInstance(): MetaCognitiveAnalysisEngine {
    if (!MetaCognitiveAnalysisEngine.instance) {
      MetaCognitiveAnalysisEngine.instance = new MetaCognitiveAnalysisEngine();
    }
    return MetaCognitiveAnalysisEngine.instance;
  }
  
  private constructor() {
    // Initialize the engine
    console.log('Meta-Cognitive Analysis Engine initialized');
    
    // Start background analysis every 30 seconds
    setInterval(() => this.performBackgroundAnalysis(), 30000);
  }
  
  /**
   * Process a new meta-cognitive event
   * This method analyzes events as they occur to detect immediate patterns and insights
   * @param event The meta-cognitive event to process
   * @returns Promise that resolves when processing is complete
   */
  public async processEvent(event: MetaCognitiveEvent): Promise<void> {
    try {
      // Check for immediate patterns with this event
      await this.detectImmedatePatterns(event);
      
      // Generate insights if needed
      await this.generateEventInsights(event);
      
      // Track event for real-time analytics
      this.trackEventMetrics(event);
      
      // Log that we've processed this event
      console.log(`Processed meta-cognitive event: ${event.id} (${event.type})`);
    } catch (error: unknown) {
      console.error('Error processing meta-cognitive event:', error);
      
      // Record error as a meta-cognitive event itself
      try {
        const errorMessage = error instanceof Error ? error.message : String(error);
        const errorStack = error instanceof Error ? error.stack : undefined;
        
        await qrnService.recordMetaCognitiveEvent({
          nodeId: event.nodeId || 'system',
          type: 'processing-error',
          description: `Error processing event: ${errorMessage}`,
          details: {
            originalEventId: event.id,
            errorStack
          },
          confidence: 0.9,
          impact: 5
        });
      } catch (innerError: unknown) {
        console.error('Failed to record error event:', innerError instanceof Error ? innerError.message : String(innerError));
      }
    }
  }
  
  /**
   * Track metrics about events for real-time analytics
   * @param event The event to track metrics for
   */
  private trackEventMetrics(event: MetaCognitiveEvent): void {
    // Track event type frequencies
    // This data is used for real-time anomaly detection
    const eventType = event.type; // Use type instead of eventType
    const now = Date.now();
    
    // Store the event timestamp for rate analysis
    // No need to check for initialization as it's already done in constructor
    
    if (!this.eventTimestamps.has(eventType)) {
      this.eventTimestamps.set(eventType, []);
    }
    
    const timestamps = this.eventTimestamps.get(eventType)!;
    timestamps.push(now);
    
    // Keep only the most recent 100 timestamps
    if (timestamps.length > 100) {
      timestamps.shift();
    }
    
    // Update event type statistics
    // No need to check for initialization as it's already done in constructor
    
    const stats = this.eventTypeStats.get(eventType) || { count: 0, avgImpact: 0 };
    stats.count++;
    
    // Update rolling average of impact if available
    if (event.impact !== undefined) {
      stats.avgImpact = (stats.avgImpact * (stats.count - 1) + event.impact) / stats.count;
    }
    
    this.eventTypeStats.set(eventType, stats);
  }
  
  /**
   * Perform background analysis of all meta-cognitive events
   * Made public to allow manual triggering of analysis
   */
  public async performBackgroundAnalysis(): Promise<void> {
    try {
      console.log('Performing background meta-cognitive analysis...');
      
      // Get the latest events
      const events = await storage.getAllMetaCognitiveEvents();
      // Limit to the latest 100 events for performance
      const latestEvents = events.slice(0, 100);
      
      // Skip if no events
      if (!events || events.length === 0) {
        console.log('No meta-cognitive events to analyze');
        return;
      }
      
      // Detect temporal patterns
      await this.detectTemporalPatterns(latestEvents);
      
      // Detect node-specific patterns
      await this.detectNodePatterns(latestEvents);
      
      // Generate system-wide insights
      await this.generateSystemInsights(latestEvents);
      
      console.log(`Background analysis complete. Patterns: ${this.patterns.size}, Insights: ${this.insights.size}`);
    } catch (error: unknown) {
      console.error('Error in background meta-cognitive analysis:', error instanceof Error ? error.message : String(error));
    }
  }
  
  /**
   * Detect immediate patterns for a single event
   */
  private async detectImmedatePatterns(event: MetaCognitiveEvent): Promise<void> {
    // Get recent events from the same node
    const nodeIdSafe = event.nodeId || 'system';
    // As per interface, use a different approach to filter events
    const allEvents = await storage.getAllMetaCognitiveEvents();
    const allRecentEvents = allEvents.slice(0, 50);
    const recentEvents = allRecentEvents.filter(e => e.nodeId === nodeIdSafe).slice(0, 10);
    
    // Skip if there are not enough events
    if (recentEvents.length < 3) {
      return;
    }
    
    // Check for sequential patterns of the same event type
    const sameTypeEvents = recentEvents.filter(e => e.type === event.type);
    if (sameTypeEvents.length >= 3) {
      // Calculate time differences
      const timeDiffs: number[] = [];
      for (let i = 1; i < sameTypeEvents.length; i++) {
        const diff = new Date(sameTypeEvents[i].createdAt).getTime() - 
                     new Date(sameTypeEvents[i-1].createdAt).getTime();
        timeDiffs.push(diff);
      }
      
      // Check if time differences are consistent (within 20% variation)
      const avgDiff = timeDiffs.reduce((a, b) => a + b, 0) / timeDiffs.length;
      const consistentTiming = timeDiffs.every(diff => 
        Math.abs(diff - avgDiff) / avgDiff < 0.2
      );
      
      if (consistentTiming) {
        // We have a potential cyclical pattern
        const patternId = `cyclical-${event.nodeId || 'system'}-${event.type}`;
        
        if (this.patterns.has(patternId)) {
          // Update existing pattern
          const pattern = this.patterns.get(patternId)!;
          pattern.lastDetected = new Date();
          pattern.occurrences += 1;
          pattern.confidence = Math.min(0.95, pattern.confidence + 0.05);
        } else {
          // Create new pattern
          const nodeIdSafe = event.nodeId || 'system';
          const newPattern: CognitivePattern = {
            id: patternId,
            type: PatternType.CYCLICAL,
            nodeIds: [nodeIdSafe],
            eventTypes: [event.type],
            confidence: 0.6,
            description: `Cyclical pattern of ${event.type} events occurring approximately every ${Math.round(avgDiff / 1000)} seconds`,
            firstDetected: new Date(),
            lastDetected: new Date(),
            occurrences: 1,
            strategicLayer: 2
          };
          
          this.patterns.set(patternId, newPattern);
          
          // Record a meta-cognitive event about this pattern detection
          await qrnService.recordMetaCognitiveEvent({
            nodeId: nodeIdSafe,
            type: 'pattern-detection',
            description: `Detected cyclical pattern of ${event.type} events`,
            details: {
              patternId,
              patternType: PatternType.CYCLICAL,
              confidence: newPattern.confidence,
              avgInterval: Math.round(avgDiff / 1000)
            },
            confidence: newPattern.confidence,  // Use confidence instead of confidenceLevel
            impact: 6
          });
        }
      }
    }
    
    // Check for causal relationships with previous events
    // (This is a simplified implementation - a more sophisticated version would
    // use statistical methods to detect true causality)
    if (recentEvents.length >= 2 && recentEvents[1].type !== event.type) {
      const potentialCause = recentEvents[1];
      const timeDiff = new Date(event.createdAt).getTime() - 
                       new Date(potentialCause.createdAt).getTime();
      
      // If events happened within 5 seconds, suggest potential causality
      if (timeDiff > 0 && timeDiff < 5000) {
        const patternId = `causal-${potentialCause.type}-${event.type}`;
        
        if (this.patterns.has(patternId)) {
          // Update existing pattern
          const pattern = this.patterns.get(patternId)!;
          pattern.lastDetected = new Date();
          pattern.occurrences += 1;
          pattern.confidence = Math.min(0.9, pattern.confidence + 0.1);
        } else {
          // Create new pattern
          const nodeIdSafe = event.nodeId || 'system';
          const newPattern: CognitivePattern = {
            id: patternId,
            type: PatternType.CAUSAL,
            nodeIds: [nodeIdSafe],
            eventTypes: [potentialCause.type, event.type],
            confidence: 0.4, // Start with low confidence
            description: `Potential causal relationship: ${potentialCause.type} events may trigger ${event.type} events within ${Math.round(timeDiff / 1000)} seconds`,
            firstDetected: new Date(),
            lastDetected: new Date(),
            occurrences: 1,
            strategicLayer: 3 // Causality is higher strategic layer
          };
          
          this.patterns.set(patternId, newPattern);
        }
      }
    }
  }
  
  /**
   * Detect patterns across time
   */
  private async detectTemporalPatterns(events: MetaCognitiveEvent[]): Promise<void> {
    // Group events by type
    const eventsByType = new Map<string, MetaCognitiveEvent[]>();
    
    for (const event of events) {
      if (!eventsByType.has(event.type)) {
        eventsByType.set(event.type, []);
      }
      eventsByType.get(event.type)!.push(event);
    }
    
    // Analyze frequency of each event type
    for (const [eventType, eventsOfType] of eventsByType.entries()) {
      if (eventsOfType.length < 5) continue; // Need enough data
      
      // Sort by timestamp
      eventsOfType.sort((a, b) => 
        new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
      );
      
      // Calculate time differences between consecutive events
      const timeDiffs: number[] = [];
      for (let i = 1; i < eventsOfType.length; i++) {
        const diff = new Date(eventsOfType[i].createdAt).getTime() - 
                    new Date(eventsOfType[i-1].createdAt).getTime();
        timeDiffs.push(diff);
      }
      
      // Check for consistent timing (cyclical pattern)
      const avgDiff = timeDiffs.reduce((a, b) => a + b, 0) / timeDiffs.length;
      const stdDev = Math.sqrt(
        timeDiffs.reduce((sum, diff) => sum + Math.pow(diff - avgDiff, 2), 0) / timeDiffs.length
      );
      
      const consistencyRatio = stdDev / avgDiff;
      
      if (consistencyRatio < 0.3 && eventsOfType.length >= 5) {
        // This is a consistent cyclical pattern
        const patternId = `system-cyclical-${eventType}`;
        
        if (this.patterns.has(patternId)) {
          // Update existing pattern
          const pattern = this.patterns.get(patternId)!;
          pattern.lastDetected = new Date();
          pattern.occurrences = Math.max(pattern.occurrences, eventsOfType.length);
          pattern.confidence = Math.min(0.98, pattern.confidence + 0.02);
          
          // Add any new nodes involved
          for (const event of eventsOfType) {
            const nodeId = event.nodeId || 'system';
            if (!pattern.nodeIds.includes(nodeId)) {
              pattern.nodeIds.push(nodeId);
            }
          }
        } else {
          // Create new pattern
          const nodeIds = [...new Set(eventsOfType.map(e => e.nodeId || 'system').filter(Boolean))];
          
          const newPattern: CognitivePattern = {
            id: patternId,
            type: PatternType.CYCLICAL,
            nodeIds,
            eventTypes: [eventType],
            confidence: 0.7,
            description: `System-wide cyclical pattern of ${eventType} events occurring approximately every ${Math.round(avgDiff / 1000)} seconds with ${consistencyRatio.toFixed(2)} consistency ratio`,
            firstDetected: new Date(),
            lastDetected: new Date(),
            occurrences: eventsOfType.length,
            strategicLayer: 3
          };
          
          this.patterns.set(patternId, newPattern);
          
          // Generate an insight
          const insightId = `insight-${patternId}`;
          const newInsight: CognitiveInsight = {
            id: insightId,
            patternId: patternId,
            title: `Detected system-wide cyclical pattern for ${eventType} events`,
            description: `Analysis shows ${eventType} events occur cyclically every ${Math.round(avgDiff / 1000)} seconds across ${nodeIds.length} nodes with good consistency (${consistencyRatio.toFixed(2)}). This may indicate a coordinated process or underlying system rhythm.`,
            severity: InsightSeverity.INFORMATION,
            confidence: 0.7,
            impact: 5,
            suggestedActions: [
              `Monitor for changes in this cycle`,
              `Check if this cycle aligns with any system processes`,
              `Consider optimizing resources around this cycle if appropriate`
            ],
            createdAt: new Date(),
            strategicLayer: 3
          };
          
          this.insights.set(insightId, newInsight);
          
          // Record a meta-cognitive event for significant patterns
          if (nodeIds.length > 1) {
            for (const nodeId of nodeIds) {
              await qrnService.recordMetaCognitiveEvent({
                nodeId: nodeId, // Explicitly use the same variable name
                type: 'system-pattern-detection',
                description: `Detected system-wide cyclical pattern for ${eventType} events`,
                details: {
                  patternId,
                  insightId,
                  confidence: newPattern.confidence,
                  impact: newInsight.impact
                },
                confidence: newPattern.confidence,
                impact: newInsight.impact
              });
            }
          }
        }
      }
    }
  }
  
  /**
   * Detect patterns specific to individual nodes
   */
  private async detectNodePatterns(events: MetaCognitiveEvent[]): Promise<void> {
    // Group events by node
    const eventsByNode = new Map<string, MetaCognitiveEvent[]>();
    
    for (const event of events) {
      const nodeId = event.nodeId || 'system'; // Use 'system' as default if nodeId is undefined
      if (!eventsByNode.has(nodeId)) {
        eventsByNode.set(nodeId, []);
      }
      eventsByNode.get(nodeId)!.push(event);
    }
    
    // Analyze patterns for each node
    for (const [nodeId, nodeEvents] of eventsByNode.entries()) {
      if (nodeEvents.length < 5) continue; // Need enough data
      
      // Count event types
      const eventTypeCounts = new Map<string, number>();
      for (const event of nodeEvents) {
        eventTypeCounts.set(
          event.type, 
          (eventTypeCounts.get(event.type) || 0) + 1
        );
      }
      
      // Check for dominant event types (more than 40% of all events)
      for (const [eventType, count] of eventTypeCounts.entries()) {
        const percentage = count / nodeEvents.length;
        
        if (percentage > 0.4 && count >= 4) {
          // This is a dominant event type for this node
          const patternId = `node-dominant-${nodeId}-${eventType}`;
          
          if (this.patterns.has(patternId)) {
            // Update existing pattern
            const pattern = this.patterns.get(patternId)!;
            pattern.lastDetected = new Date();
            pattern.occurrences = count;
            pattern.confidence = Math.min(0.95, pattern.confidence + 0.05);
          } else {
            // Create new pattern
            const newPattern: CognitivePattern = {
              id: patternId,
              type: PatternType.EMERGENT,
              nodeIds: [nodeId],
              eventTypes: [eventType],
              confidence: 0.8,
              description: `Node ${nodeId} shows dominant pattern of ${eventType} events (${Math.round(percentage * 100)}% of all events)`,
              firstDetected: new Date(),
              lastDetected: new Date(),
              occurrences: count,
              strategicLayer: 2
            };
            
            this.patterns.set(patternId, newPattern);
            
            // Only generate insight if the pattern is really dominant
            if (percentage > 0.6) {
              // Get the QRN to include its name in the insight
              const qrn = await qrnService.getNode(nodeId);
              const nodeName = qrn ? qrn.name : nodeId;
              
              // Generate an insight
              const insightId = `insight-${patternId}`;
              const newInsight: CognitiveInsight = {
                id: insightId,
                patternId: patternId,
                nodeId: nodeId,
                title: `Dominant behavior pattern detected for ${nodeName}`,
                description: `${nodeName} exhibits a strong tendency toward ${eventType} events (${Math.round(percentage * 100)}% of all events). This suggests specialized functionality or a potential behavioral bias.`,
                severity: InsightSeverity.INFORMATION,
                confidence: 0.8,
                impact: 6,
                suggestedActions: [
                  `Review if this specialization is intended`,
                  `Consider if the node could benefit from more diverse behaviors`,
                  `Monitor for changes in this pattern over time`
                ],
                createdAt: new Date(),
                strategicLayer: 2
              };
              
              this.insights.set(insightId, newInsight);
              
              // Record meta-cognitive event about this insight
              await qrnService.recordMetaCognitiveEvent({
                nodeId,
                type: 'behavioral-insight',
                description: `Generated insight about dominant ${eventType} behavior`,
                details: {
                  insightId,
                  pattern: newPattern.id,
                  percentage: percentage
                },
                confidence: newInsight.confidence,
                impact: newInsight.impact
              });
            }
          }
        }
      }
      
      // Check for sequential patterns
      if (nodeEvents.length >= 8) {
        // Sort by timestamp (createdAt)
        nodeEvents.sort((a, b) => 
          new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
        );
        
        // Look for repeating sequences of event types
        const sequences: string[][] = [];
        for (let seqLength = 2; seqLength <= 4; seqLength++) {
          // Generate all possible sequences of this length
          for (let i = 0; i <= nodeEvents.length - seqLength * 2; i++) {
            const seq1 = nodeEvents.slice(i, i + seqLength).map(e => e.type);
            
            // Look for a matching sequence later in the events
            for (let j = i + seqLength; j <= nodeEvents.length - seqLength; j++) {
              const seq2 = nodeEvents.slice(j, j + seqLength).map(e => e.type);
              
              // Check if sequences match
              const match = seq1.every((type, idx) => type === seq2[idx]);
              
              if (match) {
                // Found a repeating sequence
                sequences.push(seq1);
                break;
              }
            }
          }
        }
        
        // Process significant sequences
        if (sequences.length > 0) {
          // Get the longest sequence with most occurrences
          let bestSeq = sequences[0];
          let bestCount = 0;
          
          for (const seq of sequences) {
            // Count occurrences
            let count = 0;
            let pos = 0;
            
            while (pos <= nodeEvents.length - seq.length) {
              const eventSeq = nodeEvents.slice(pos, pos + seq.length).map(e => e.type);
              const match = seq.every((type, idx) => type === eventSeq[idx]);
              
              if (match) {
                count++;
                pos += seq.length;
              } else {
                pos++;
              }
            }
            
            // Check if this sequence is better
            const score = count * seq.length; // Consider both length and frequency
            const currentScore = bestCount * bestSeq.length;
            
            if (score > currentScore) {
              bestSeq = seq;
              bestCount = count;
            }
          }
          
          // Create pattern for significant sequences (occurring at least twice)
          if (bestCount >= 2) {
            const seqStr = bestSeq.join(' → ');
            const patternId = `sequential-${nodeId}-${bestSeq.join('-')}`;
            
            if (this.patterns.has(patternId)) {
              // Update existing pattern
              const pattern = this.patterns.get(patternId)!;
              pattern.lastDetected = new Date();
              pattern.occurrences = Math.max(pattern.occurrences, bestCount);
              pattern.confidence = Math.min(0.95, pattern.confidence + 0.05);
            } else {
              // Create new pattern
              const newPattern: CognitivePattern = {
                id: patternId,
                type: PatternType.SEQUENTIAL,
                nodeIds: [nodeId],
                eventTypes: [...new Set(bestSeq)], // Unique event types
                confidence: 0.7,
                description: `Sequential pattern detected: ${seqStr} (occurs ${bestCount} times)`,
                firstDetected: new Date(),
                lastDetected: new Date(),
                occurrences: bestCount,
                strategicLayer: 4 // Sequential patterns have higher strategic value
              };
              
              this.patterns.set(patternId, newPattern);
              
              // For strong sequential patterns, generate an insight
              if (bestCount >= 3 || bestSeq.length >= 3) {
                // Get the QRN to include its name in the insight
                const qrn = await qrnService.getNode(nodeId);
                const nodeName = qrn ? qrn.name : nodeId;
                
                // Generate an insight
                const insightId = `insight-${patternId}`;
                const newInsight: CognitiveInsight = {
                  id: insightId,
                  patternId: patternId,
                  nodeId: nodeId,
                  title: `Behavioral sequence detected for ${nodeName}`,
                  description: `${nodeName} exhibits a recurring behavioral sequence: ${seqStr}. This sequence has occurred ${bestCount} times and may represent a core process or workflow.`,
                  severity: InsightSeverity.SUGGESTION,
                  confidence: 0.7,
                  impact: 7,
                  suggestedActions: [
                    `Consider formalizing this sequence as a defined workflow`,
                    `Analyze if this sequence can be optimized`,
                    `Monitor performance metrics during this sequence execution`
                  ],
                  createdAt: new Date(),
                  strategicLayer: 4
                };
                
                this.insights.set(insightId, newInsight);
                
                // Record meta-cognitive event about this insight
                await qrnService.recordMetaCognitiveEvent({
                  nodeId,
                  type: 'sequence-detection',
                  description: `Detected recurring behavioral sequence: ${seqStr}`,
                  details: {
                    insightId,
                    pattern: newPattern.id,
                    sequence: bestSeq,
                    occurrences: bestCount
                  },
                  confidence: newInsight.confidence,
                  impact: newInsight.impact
                });
              }
            }
          }
        }
      }
    }
  }
  
  /**
   * Generate insights from a single event
   */
  private async generateEventInsights(event: MetaCognitiveEvent): Promise<void> {
    // Generate insights for high-impact events
    if (event.impact && event.impact >= 8) {
      // This is a high-impact event that warrants immediate attention
      const insightId = `immediate-${event.id}`;
      
      // Get the QRN to include its name in the insight
      const nodeIdSafe = event.nodeId || 'system';
      const qrn = await qrnService.getNode(nodeIdSafe);
      const nodeName = qrn ? qrn.name : nodeIdSafe;
      
      const newInsight: CognitiveInsight = {
        id: insightId,
        nodeId: nodeIdSafe,
        title: `High-impact event detected for ${nodeName}`,
        description: `${nodeName} reported a high-impact ${event.type} event: "${event.description}". This event has an impact rating of ${event.impact}/10 and may require attention.`,
        severity: InsightSeverity.WARNING,
        confidence: event.confidence || 0.7,
        impact: event.impact,
        suggestedActions: [
          `Review the details of this event`,
          `Check if this event has affected system performance`,
          `Consider if this event requires manual intervention`
        ],
        createdAt: new Date(),
        strategicLayer: 1 // Immediate concerns are low strategic layer
      };
      
      this.insights.set(insightId, newInsight);
    }
    
    // Generate insights for anomalous events
    // (Events with very high or very low confidence compared to their impact)
    if (event.confidence && event.impact) {
      const confidenceImpactRatio = event.confidence / event.impact;
      
      if (confidenceImpactRatio > 0.2 && event.confidence > 0.9 && event.impact < 4) {
        // High confidence about low-impact event
        const insightId = `confidence-anomaly-${event.id}`;
        const nodeIdSafe = event.nodeId || 'system';
        
        const newInsight: CognitiveInsight = {
          id: insightId,
          nodeId: nodeIdSafe,
          title: `Unusual certainty about low-impact event`,
          description: `Detected anomalously high confidence (${event.confidence.toFixed(2)}) about a low-impact event (${event.impact}/10): "${event.description}". This confidence-impact mismatch may indicate cognitive bias or misaligned prioritization.`,
          severity: InsightSeverity.INFORMATION,
          confidence: 0.6,
          impact: 3,
          suggestedActions: [
            `Review confidence calculation for this event type`,
            `Consider if impact rating should be adjusted`
          ],
          createdAt: new Date(),
          strategicLayer: 3 // Cognitive biases have medium strategic significance
        };
        
        this.insights.set(insightId, newInsight);
      }
      
      if (confidenceImpactRatio < 0.05 && event.confidence < 0.4 && event.impact > 7) {
        // Low confidence about high-impact event
        const insightId = `uncertainty-risk-${event.id}`;
        const nodeIdSafe = event.nodeId || 'system';
        
        const newInsight: CognitiveInsight = {
          id: insightId,
          nodeId: nodeIdSafe,
          title: `Critical uncertainty detected`,
          description: `Detected low confidence (${event.confidence.toFixed(2)}) about a high-impact event (${event.impact}/10): "${event.description}". This combination of uncertainty and high stakes requires attention.`,
          severity: InsightSeverity.WARNING,
          confidence: 0.8,
          impact: 8,
          suggestedActions: [
            `Gather more information to increase confidence`,
            `Consider preventative measures given the high potential impact`,
            `Monitor this situation closely`
          ],
          createdAt: new Date(),
          strategicLayer: 4 // High-impact uncertainties have high strategic significance
        };
        
        this.insights.set(insightId, newInsight);
        
        // Record meta-cognitive event about this critical uncertainty
        await qrnService.recordMetaCognitiveEvent({
          nodeId: nodeIdSafe,
          type: 'critical-uncertainty',
          description: `Detected critical uncertainty with high potential impact`,
          details: {
            insightId,
            originalEvent: event.id,
            confidence: event.confidence,
            impact: event.impact
          },
          confidence: newInsight.confidence,
          impact: newInsight.impact
        });
      }
    }
  }
  
  /**
   * Generate system-wide insights
   */
  private async generateSystemInsights(events: MetaCognitiveEvent[]): Promise<void> {
    // Skip if not enough events
    if (events.length < 20) return;
    
    // Check for system-wide anomalies
    
    // 1. Check for sudden increase in event frequency
    const timestamps = events.map(e => new Date(e.createdAt).getTime()).sort();
    const timeDiffs: number[] = [];
    
    for (let i = 1; i < timestamps.length; i++) {
      timeDiffs.push(timestamps[i] - timestamps[i-1]);
    }
    
    const avgTimeDiff = timeDiffs.reduce((a, b) => a + b, 0) / timeDiffs.length;
    const recentTimeDiffs = timeDiffs.slice(-5);
    const recentAvgTimeDiff = recentTimeDiffs.reduce((a, b) => a + b, 0) / recentTimeDiffs.length;
    
    // If recent events are happening much faster than average
    if (avgTimeDiff > 0 && recentAvgTimeDiff > 0 && recentAvgTimeDiff < avgTimeDiff * 0.5 && events.length >= 30) {
      const insightId = `system-acceleration-${Date.now()}`;
      
      const newInsight: CognitiveInsight = {
        id: insightId,
        title: `System activity acceleration detected`,
        description: `Recent meta-cognitive events are occurring ${(avgTimeDiff / recentAvgTimeDiff).toFixed(1)}x faster than the historical average. This may indicate increased system load, an emerging process, or potential runaway behavior.`,
        severity: InsightSeverity.WARNING,
        confidence: 0.75,
        impact: 7,
        suggestedActions: [
          `Monitor system resources`,
          `Check for concurrent user activity spikes`,
          `Verify that feedback loops are properly regulated`,
          `Consider throttling if acceleration continues to increase`
        ],
        createdAt: new Date(),
        strategicLayer: 4
      };
      
      this.insights.set(insightId, newInsight);
      
      // For system-wide insights, record events on multiple nodes
      const uniqueNodeIds = [...new Set(events.slice(-10).map(e => e.nodeId || 'system'))].slice(0, 3);
      
      for (const nodeId of uniqueNodeIds) {
        await qrnService.recordMetaCognitiveEvent({
          nodeId,
          type: 'system-acceleration',
          description: `System-wide acceleration of activity detected`,
          details: {
            insightId,
            accelerationFactor: avgTimeDiff / recentAvgTimeDiff,
            historicalAvgInterval: Math.round(avgTimeDiff),
            recentAvgInterval: Math.round(recentAvgTimeDiff)
          },
          confidence: newInsight.confidence,
          impact: newInsight.impact
        });
      }
    }
    
    // 2. Check for unusual distribution of event types
    const eventTypeCounts = new Map<string, number>();
    for (const event of events) {
      eventTypeCounts.set(
        event.type, 
        (eventTypeCounts.get(event.type) || 0) + 1
      );
    }
    
    // Calculate entropy as a measure of event type diversity
    let entropy = 0;
    for (const count of eventTypeCounts.values()) {
      const p = count / events.length;
      entropy -= p * Math.log2(p);
    }
    
    // Very low entropy means a few event types dominate
    if (entropy < 1.5 && eventTypeCounts.size >= 5) {
      // Find the dominant event types
      const sortedTypes = [...eventTypeCounts.entries()]
        .sort((a, b) => b[1] - a[1])
        .slice(0, 3);
      
      const dominantTypes = sortedTypes
        .map(([type, count]) => `${type} (${Math.round(count / events.length * 100)}%)`)
        .join(', ');
      
      const insightId = `low-entropy-${Date.now()}`;
      
      const newInsight: CognitiveInsight = {
        id: insightId,
        title: `Low cognitive diversity detected`,
        description: `The system is showing unusually low diversity in its meta-cognitive events (entropy: ${entropy.toFixed(2)}). Events are dominated by: ${dominantTypes}. This may indicate a narrow operational focus or potential fixation.`,
        severity: InsightSeverity.SUGGESTION,
        confidence: 0.7,
        impact: 6,
        suggestedActions: [
          `Review if this specialized focus is appropriate for current goals`,
          `Consider introducing more diverse cognitive processes`,
          `Monitor for changes in this pattern over time`
        ],
        createdAt: new Date(),
        strategicLayer: 5 // Cognitive diversity is highest strategic layer
      };
      
      this.insights.set(insightId, newInsight);
    }
  }
  
  /**
   * Get all detected patterns with no filtering
   * Used for testing and direct access to all patterns
   */
  public getAllPatterns(): CognitivePattern[] {
    return [...this.patterns.values()];
  }
  
  /**
   * Get all detected insights with no filtering
   * Used for testing and direct access to all insights
   */
  public getAllInsights(): CognitiveInsight[] {
    return [...this.insights.values()];
  }
  
  /**
   * Get detected patterns with optional filtering
   */
  public getPatterns(filter?: {
    nodeId?: string;
    patternType?: PatternType;
    minConfidence?: number;
    strategicLayer?: number;
  }): CognitivePattern[] {
    let patterns = [...this.patterns.values()];
    
    // Apply filters
    if (filter) {
      if (filter.nodeId) {
        const nodeIdSafe = filter.nodeId;
        patterns = patterns.filter(p => p.nodeIds.some(id => id === nodeIdSafe));
      }
      
      if (filter.patternType) {
        patterns = patterns.filter(p => p.type === filter.patternType);
      }
      
      if (filter.minConfidence !== undefined) {
        const minConfidence = filter.minConfidence;
        patterns = patterns.filter(p => p.confidence >= minConfidence);
      }
      
      if (filter.strategicLayer !== undefined) {
        patterns = patterns.filter(p => p.strategicLayer === filter.strategicLayer);
      }
    }
    
    // Sort by recency
    return patterns.sort((a, b) => 
      b.lastDetected.getTime() - a.lastDetected.getTime()
    );
  }
  
  /**
   * Get all generated insights
   */
  public getInsights(filter?: {
    nodeId?: string;
    severity?: InsightSeverity;
    minImpact?: number;
    strategicLayer?: number;
  }): CognitiveInsight[] {
    let insights = [...this.insights.values()];
    
    // Apply filters
    if (filter) {
      if (filter.nodeId) {
        const nodeIdSafe = filter.nodeId;
        insights = insights.filter(i => !i.nodeId || i.nodeId === nodeIdSafe);
      }
      
      if (filter.severity) {
        insights = insights.filter(i => i.severity === filter.severity);
      }
      
      if (filter.minImpact !== undefined) {
        const minImpact = filter.minImpact;
        insights = insights.filter(i => i.impact >= minImpact);
      }
      
      if (filter.strategicLayer !== undefined) {
        insights = insights.filter(i => i.strategicLayer === filter.strategicLayer);
      }
    }
    
    // Sort by impact and timestamp
    return insights.sort((a, b) => {
      if (b.impact !== a.impact) {
        return b.impact - a.impact; // Higher impact first
      }
      return b.createdAt.getTime() - a.createdAt.getTime(); // More recent first
    });
  }
  
  /**
   * Analyze system stability trends over time
   * This method examines historical system stability metrics to detect trends and anomalies
   * @param days Number of days of history to analyze (default: 7)
   * @returns Analysis results including trends and recommendations
   */
  public async analyzeSystemStabilityTrends(days: number = 7): Promise<{
    trend: 'improving' | 'stable' | 'declining' | 'fluctuating' | 'insufficient-data';
    currentStability: number;
    avgStability: number;
    minStability: number;
    maxStability: number;
    volatility: number;
    anomalies: Array<{timestamp: Date, value: number, deviation: number}>;
    recommendations: string[];
  }> {
    try {
      // Get historical stability data
      const endTime = new Date();
      const startTime = new Date(endTime.getTime() - (days * 24 * 60 * 60 * 1000));
      
      // If getSystemStabilityHistory doesn't exist, use a fallback
      const stabilityHistory = 'getSystemStabilityHistory' in storage 
        ? await (storage as any).getSystemStabilityHistory(startTime, endTime)
        : [];
      
      // If insufficient data, return early
      if (!stabilityHistory || stabilityHistory.length < 3) {
        return {
          trend: 'insufficient-data',
          currentStability: 0,
          avgStability: 0,
          minStability: 0,
          maxStability: 0,
          volatility: 0,
          anomalies: [],
          recommendations: [
            'Collect more system stability data',
            'Ensure metrics collection is properly configured'
          ]
        };
      }
      
      // Calculate key statistics
      const values = stabilityHistory.map((entry: { stability: number }) => entry.stability);
      const timestamps = stabilityHistory.map((entry: { timestamp: string | Date }) => new Date(entry.timestamp));
      
      const currentStability = values[values.length - 1];
      const avgStability = values.reduce((sum: number, val: number) => sum + val, 0) / values.length;
      const minStability = Math.min(...values);
      const maxStability = Math.max(...values);
      
      // Calculate standard deviation (volatility)
      const squaredDiffs = values.map((val: number) => Math.pow(val - avgStability, 2));
      const avgSquaredDiff = squaredDiffs.reduce((sum: number, val: number) => sum + val, 0) / squaredDiffs.length;
      const volatility = Math.sqrt(avgSquaredDiff);
      
      // Detect anomalies (values more than 2 standard deviations from mean)
      // Build anomalies list directly to avoid typing issues with filter
      const anomalies: Array<{timestamp: Date, value: number, deviation: number}> = [];
      for (let i = 0; i < values.length; i++) {
        const val = values[i];
        const deviation = Math.abs(val - avgStability) / volatility;
        if (deviation > 2) {
          anomalies.push({
            timestamp: timestamps[i],
            value: val,
            deviation
          });
        }
      }
      
      // Determine trend by analyzing slope of recent values
      // Use linear regression to find the slope
      const xValues = Array.from({length: values.length}, (_, i) => i);
      const xMean = xValues.reduce((sum, x) => sum + x, 0) / xValues.length;
      const yMean = avgStability;
      
      let numerator = 0;
      let denominator = 0;
      
      for (let i = 0; i < values.length; i++) {
        numerator += (xValues[i] - xMean) * (values[i] - yMean);
        denominator += Math.pow(xValues[i] - xMean, 2);
      }
      
      const slope = denominator !== 0 ? numerator / denominator : 0;
      const recentSlope = values.length >= 10 ? 
        this.calculateSlope(values.slice(-10)) : 
        this.calculateSlope(values);
      
      // Determine trend category
      let trend: 'improving' | 'stable' | 'declining' | 'fluctuating' | 'insufficient-data';
      
      if (volatility > 0.2) {
        trend = 'fluctuating';
      } else if (Math.abs(slope) < 0.005) {
        trend = 'stable';
      } else if (slope > 0) {
        trend = 'improving';
      } else {
        trend = 'declining';
      }
      
      // Generate recommendations based on analysis
      const recommendations: string[] = [];
      
      if (trend === 'declining') {
        recommendations.push('Investigate recent system changes that may be affecting stability');
        recommendations.push('Consider rolling back to the last known stable configuration');
        recommendations.push('Increase monitoring frequency for critical components');
      } else if (trend === 'fluctuating') {
        recommendations.push('Identify and address sources of system volatility');
        recommendations.push('Implement additional buffering or stabilization mechanisms');
        recommendations.push('Review system response to varying loads');
      } else if (currentStability < 0.4) {
        recommendations.push('Critical: System stability is below acceptable thresholds');
        recommendations.push('Perform immediate diagnostic of all core components');
        recommendations.push('Consider reducing system load until stability improves');
      } else if (trend === 'improving' && currentStability < 0.7) {
        recommendations.push('Continue current improvement trajectory');
        recommendations.push('Document recent changes that may be contributing to improvement');
      } else if (trend === 'stable' && currentStability > 0.8) {
        recommendations.push('System is operating at optimal stability');
        recommendations.push('Consider experimental optimizations to further improve performance');
      }
      
      return {
        trend,
        currentStability,
        avgStability,
        minStability,
        maxStability,
        volatility,
        anomalies,
        recommendations
      };
    } catch (error) {
      console.error('Error analyzing system stability trends:', error);
      throw error;
    }
  }
  
  /**
   * Calculate the slope of a series of values using linear regression
   * @param values Array of numerical values
   * @returns Slope indicating trend direction and magnitude
   */
  private calculateSlope(values: number[]): number {
    const xValues = Array.from({length: values.length}, (_, i) => i);
    const xMean = xValues.reduce((sum, x) => sum + x, 0) / xValues.length;
    const yMean = values.reduce((sum, y) => sum + y, 0) / values.length;
    
    let numerator = 0;
    let denominator = 0;
    
    for (let i = 0; i < values.length; i++) {
      numerator += (xValues[i] - xMean) * (values[i] - yMean);
      denominator += Math.pow(xValues[i] - xMean, 2);
    }
    
    return denominator !== 0 ? numerator / denominator : 0;
  }

  /**
   * Get a summary of the current cognitive state
   */
  public getCognitiveStateSummary(): {
    patternCount: number;
    insightCount: number;
    warningCount: number;
    criticalCount: number;
    topInsights: CognitiveInsight[];
    entropy: number;
    strategicLayerDistribution: Record<number, number>;
  } {
    const patterns = [...this.patterns.values()];
    const insights = [...this.insights.values()];
    
    // Count warnings and critical insights
    const warningCount = insights.filter(
      i => i.severity === InsightSeverity.WARNING
    ).length;
    
    const criticalCount = insights.filter(
      i => i.severity === InsightSeverity.CRITICAL
    ).length;
    
    // Get top insights by impact
    const topInsights = [...insights]
      .sort((a, b) => b.impact - a.impact)
      .slice(0, 5);
    
    // Calculate strategic layer distribution
    const strategicLayerDistribution: Record<number, number> = {
      1: 0, 2: 0, 3: 0, 4: 0, 5: 0
    };
    
    for (const pattern of patterns) {
      strategicLayerDistribution[pattern.strategicLayer]++;
    }
    
    for (const insight of insights) {
      strategicLayerDistribution[insight.strategicLayer]++;
    }
    
    // Calculate entropy (cognitive diversity)
    const patternsByType = new Map<PatternType, number>();
    for (const pattern of patterns) {
      patternsByType.set(
        pattern.type, 
        (patternsByType.get(pattern.type) || 0) + 1
      );
    }
    
    let entropy = 0;
    const total = patterns.length;
    if (total > 0) {
      for (const count of patternsByType.values()) {
        const p = count / total;
        entropy -= p * Math.log2(p);
      }
    }
    
    return {
      patternCount: patterns.length,
      insightCount: insights.length,
      warningCount,
      criticalCount,
      topInsights,
      entropy,
      strategicLayerDistribution
    };
  }
  
  /**
   * Clear old patterns and insights to prevent memory bloat
   * Called automatically by the background analysis
   */
  private cleanupOldData(): void {
    const now = new Date().getTime();
    const oneWeekAgo = now - 7 * 24 * 60 * 60 * 1000;
    
    // Remove patterns not detected in the last week
    for (const [id, pattern] of this.patterns.entries()) {
      if (pattern.lastDetected.getTime() < oneWeekAgo) {
        this.patterns.delete(id);
      }
    }
    
    // Remove insights older than a week, unless they are critical
    for (const [id, insight] of this.insights.entries()) {
      if (insight.severity !== InsightSeverity.CRITICAL && 
          insight.createdAt.getTime() < oneWeekAgo) {
        this.insights.delete(id);
      }
    }
  }
}

// Singleton instance
export const metaCognitiveEngine = MetaCognitiveAnalysisEngine.getInstance();