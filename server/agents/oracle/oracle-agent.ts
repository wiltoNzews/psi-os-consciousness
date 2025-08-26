/**
 * Oracle Agent Implementation
 * 
 * The Oracle Agent is the core intelligence orchestration module that
 * provides oversight, coherence monitoring, and communication state tracking.
 * It integrates the Color Wheel Protocol and the 0-8 Flow System.
 * 
 * [QUANTUM_STATE: CONVERGENT_FLOW]
 */

import { v4 as uuidv4 } from 'uuid';
import { 
  AgentInterface, 
  AgentContext, 
  AgentRequest, 
  AgentResponse 
} from '../../../shared/interfaces/agent-interface.js';
// Communication states are string literals (convergent, divergent, clarity, confusion, overflow)
import { 
  analyzeContentState, 
  analyzeContentFlowLevel,
  states as communicationStates
} from '../../../client/src/lib/color-wheel-protocol.js';
// Import the coherence integration utilities
import { 
  getCoherenceAdapter,
  mapCoherenceStatusToOracleStatus,
  generateCoherenceRecommendations
} from '../../integration/coherence-integration.js';

export class OracleAgent implements AgentInterface {
  readonly agentId: string;
  readonly agentType: string = 'Oracle';
  readonly version: string = '1.0.0';
  
  private _coherenceLevel: number = 0.75; // Default initial coherence
  private _flowLevel: number = 4; // Default flow level (adaptation)
  private _initialized: boolean = false;
  private _status: 'idle' | 'processing' | 'error' | 'offline' = 'offline';
  private _lastActivity: Date = new Date();
  private _metrics: Record<string, any> = {};
  private _supportedRequestTypes: string[] = [
    'analyze_communication_state',
    'measure_coherence',
    'flow_level_assessment',
    'quantum_state_report',
    'system_coherence_check'
  ];
  
  constructor(agentId?: string) {
    this.agentId = agentId || `oracle-${uuidv4()}`;
  }
  
  get coherenceLevel(): number {
    return this._coherenceLevel;
  }
  
  get flowLevel(): number {
    return this._flowLevel;
  }
  
  /**
   * Initialize the Oracle Agent with configuration
   */
  async initialize(config: Record<string, any>): Promise<boolean> {
    try {
      // Set initial coherence if provided
      if (config.initialCoherence && typeof config.initialCoherence === 'number') {
        this._coherenceLevel = Math.max(0, Math.min(1, config.initialCoherence));
      }
      
      // Set initial flow level if provided
      if (config.initialFlowLevel && typeof config.initialFlowLevel === 'number') {
        this._flowLevel = Math.max(0, Math.min(8, Math.floor(config.initialFlowLevel)));
      }
      
      // Set additional supported request types if provided
      if (config.supportedRequestTypes && Array.isArray(config.supportedRequestTypes)) {
        this._supportedRequestTypes = [
          ...this._supportedRequestTypes,
          ...config.supportedRequestTypes
        ];
      }
      
      this._initialized = true;
      this._status = 'idle';
      this._lastActivity = new Date();
      
      console.log(`[QUANTUM_STATE: FOUNDATION_FLOW] Oracle Agent ${this.agentId} initialized successfully`);
      return true;
    } catch (error) {
      console.error(`[QUANTUM_STATE: ERROR_FLOW] Oracle Agent initialization error:`, error);
      this._status = 'error';
      return false;
    }
  }
  
  /**
   * Process a request and return a response
   */
  async process(request: AgentRequest): Promise<AgentResponse> {
    if (!this._initialized) {
      return {
        success: false,
        context: request.context,
        payload: null,
        errors: [{
          code: 'ORACLE_NOT_INITIALIZED',
          message: 'Oracle Agent has not been initialized'
        }]
      };
    }
    
    this._status = 'processing';
    this._lastActivity = new Date();
    const startTime = Date.now();
    
    try {
      let responsePayload: any;
      
      // Process different request types
      switch (request.type) {
        case 'analyze_communication_state':
          responsePayload = this.analyzeCommunicationState(request.payload);
          break;
          
        case 'measure_coherence':
          responsePayload = this.measureCoherence(request.payload);
          break;
          
        case 'flow_level_assessment':
          responsePayload = this.assessFlowLevel(request.payload);
          break;
          
        case 'quantum_state_report':
          responsePayload = this.generateQuantumStateReport(request.payload);
          break;
          
        case 'system_coherence_check':
          responsePayload = this.checkSystemCoherence(request.payload);
          break;
          
        default:
          return {
            success: false,
            context: request.context,
            payload: null,
            errors: [{
              code: 'UNSUPPORTED_REQUEST_TYPE',
              message: `Oracle Agent does not support request type: ${request.type}`
            }]
          };
      }
      
      // Update agent state based on request processing
      this.updateInternalState(request, responsePayload);
      
      // Calculate processing time
      const processingTime = Date.now() - startTime;
      
      this._status = 'idle';
      
      // Return successful response
      return {
        success: true,
        context: {
          ...request.context,
          coherenceLevel: this._coherenceLevel,
          flowLevel: this._flowLevel
        },
        payload: responsePayload,
        metadata: {
          processingTime,
          agentVersion: this.version,
          coherenceContribution: this.calculateCoherenceContribution(request, responsePayload)
        }
      };
    } catch (error) {
      console.error(`[QUANTUM_STATE: ERROR_FLOW] Oracle Agent processing error:`, error);
      this._status = 'error';
      
      return {
        success: false,
        context: request.context,
        payload: null,
        errors: [{
          code: 'PROCESSING_ERROR',
          message: error instanceof Error ? error.message : 'Unknown error during processing',
          details: error
        }]
      };
    }
  }
  
  /**
   * Check if this agent can handle the given request type
   */
  canHandle(requestType: string): boolean {
    return this._supportedRequestTypes.includes(requestType);
  }
  
  /**
   * Get the current status and metrics of the agent
   */
  async getStatus(): Promise<{
    status: 'idle' | 'processing' | 'error' | 'offline';
    metrics: Record<string, any>;
    lastActivity: Date;
  }> {
    return {
      status: this._status,
      metrics: {
        ...this._metrics,
        coherenceLevel: this._coherenceLevel,
        flowLevel: this._flowLevel
      },
      lastActivity: this._lastActivity
    };
  }
  
  /**
   * Gracefully shutdown the agent
   */
  async shutdown(): Promise<void> {
    console.log(`[QUANTUM_STATE: CONVERGENT_FLOW] Oracle Agent ${this.agentId} shutting down`);
    this._status = 'offline';
  }
  
  // --- Oracle-specific implementation methods ---
  
  /**
   * Analyze the communication state of content
   */
  private analyzeCommunicationState(payload: { content: string }): {
    state: string;
    description: string;
    recommendation?: string;
  } {
    const { content } = payload;
    
    if (!content) {
      throw new Error('Content is required for communication state analysis');
    }
    
    const stateAnalysis = analyzeContentState(content);
    const flowLevelAnalysis = analyzeContentFlowLevel(content);
    
    // Update agent's internal state
    this._flowLevel = flowLevelAnalysis.flowLevel;
    
    // Determine recommendations based on the state
    let recommendation: string;
    // Use the state analysis instead of directly referencing the enum
    const state = stateAnalysis.state;
    
    switch (state) {
      case 'convergent':
        recommendation = 'Focus on synthesis and concrete conclusions';
        break;
      case 'divergent':
        recommendation = 'Continue exploring alternatives and creative solutions';
        break;
      case 'clarity':
        recommendation = 'Maintain clear communication and build upon established understanding';
        break;
      case 'confusion':
        recommendation = 'Seek clarification, simplify explanations, and validate understanding';
        break;
      case 'overflow':
        recommendation = 'Slow down, prioritize information, and focus on key points only';
        break;
      default:
        recommendation = 'Maintain balanced communication';
    }
    
    return {
      state,
      description: stateAnalysis.description,
      recommendation
    };
  }
  
  /**
   * Measure the coherence of provided content or system state
   */
  private measureCoherence(payload: { 
    content?: string; 
    systemComponents?: Array<{ id: string; state: string; coherence: number }> 
  }): {
    overallCoherence: number;
    factors: Record<string, number | undefined>;
    assessment: string;
  } {
    let contentCoherence = 0.75; // Default
    let systemCoherence = 0.75; // Default
    
    // Analyze content if provided
    if (payload.content) {
      const flowLevelAnalysis = analyzeContentFlowLevel(payload.content);
      contentCoherence = this.calculateContentCoherence(payload.content, flowLevelAnalysis.flowLevel);
    }
    
    // Analyze system components if provided
    if (payload.systemComponents && payload.systemComponents.length > 0) {
      systemCoherence = payload.systemComponents.reduce(
        (sum, component) => sum + component.coherence, 
        0
      ) / payload.systemComponents.length;
    }
    
    // Calculate overall coherence (weighted average)
    const hasContent = !!payload.content;
    const hasComponents = !!(payload.systemComponents && payload.systemComponents.length > 0);
    
    let overallCoherence;
    if (hasContent && hasComponents) {
      overallCoherence = (contentCoherence * 0.4) + (systemCoherence * 0.6);
    } else if (hasContent) {
      overallCoherence = contentCoherence;
    } else if (hasComponents) {
      overallCoherence = systemCoherence;
    } else {
      overallCoherence = this._coherenceLevel; // Use current if no inputs
    }
    
    // Update agent's internal coherence
    this._coherenceLevel = overallCoherence;
    
    // Create assessment text based on coherence level
    let assessment;
    if (overallCoherence >= 0.9) {
      assessment = 'Exceptional coherence; system is operating at optimal quantum alignment';
    } else if (overallCoherence >= 0.75) {
      assessment = 'Strong coherence; system is well-aligned and functioning efficiently';
    } else if (overallCoherence >= 0.6) {
      assessment = 'Moderate coherence; system is functioning adequately but could be optimized';
    } else if (overallCoherence >= 0.4) {
      assessment = 'Low coherence; system may experience instability or unpredictable behavior';
    } else {
      assessment = 'Critical coherence issue; immediate intervention recommended';
    }
    
    return {
      overallCoherence,
      factors: {
        contentCoherence: hasContent ? contentCoherence : 0,
        systemCoherence: hasComponents ? systemCoherence : 0
      },
      assessment
    };
  }
  
  /**
   * Assess the flow level (0-8) of the provided content or context
   */
  private assessFlowLevel(payload: { content?: string; context?: AgentContext }): {
    flowLevel: number;
    category: string;
    description: string;
    recommendation?: string;
  } {
    let flowLevel = 4; // Default to mid-range (adaptation)
    
    if (payload.content) {
      const flowLevelAnalysis = analyzeContentFlowLevel(payload.content);
      flowLevel = flowLevelAnalysis.flowLevel;
    } else if (payload.context) {
      flowLevel = payload.context.flowLevel;
    }
    
    // Update the agent's flow level
    this._flowLevel = flowLevel;
    
    // Determine flow category
    let category: string;
    let description: string;
    let recommendation: string;
    
    if (flowLevel <= 2) {
      category = 'Stability';
      description = 'Operating in structured, analytical mode with high stability';
      recommendation = 'Ideal for verification, validation, and structured reasoning tasks';
    } else if (flowLevel <= 5) {
      category = 'Adaptation';
      description = 'Operating in balanced mode with good flexibility and structure';
      recommendation = 'Well-suited for problem-solving, implementation, and refinement';
    } else {
      category = 'Breakthrough';
      description = 'Operating in highly creative, exploratory mode with emergent insights';
      recommendation = 'Optimal for innovation, ideation, and paradigm-shifting activities';
    }
    
    return {
      flowLevel,
      category,
      description,
      recommendation
    };
  }
  
  /**
   * Generate a comprehensive quantum state report
   */
  private generateQuantumStateReport(payload: { 
    fullReport?: boolean;
    includeRecommendations?: boolean;
  }): {
    coherence: number;
    flowLevel: number;
    communicationState?: string;
    quantumMetrics: Record<string, any>;
    recommendations?: string[];
  } {
    const fullReport = payload.fullReport !== false;
    const includeRecommendations = payload.includeRecommendations !== false;
    
    // Build quantum metrics
    const quantumMetrics: Record<string, any> = {
      coherenceLevel: this._coherenceLevel,
      flowLevel: this._flowLevel,
      stabilityIndex: Math.max(0, 1 - (this._flowLevel / 8)),
      adaptabilityIndex: 1 - Math.abs((this._flowLevel - 4) / 4),
      breakthroughPotential: Math.max(0, (this._flowLevel - 4) / 4)
    };
    
    // For full reports, add additional metrics
    if (fullReport) {
      quantumMetrics.coherenceTrend = this._metrics.coherenceTrend || 'stable';
      quantumMetrics.flowVariance = this._metrics.flowVariance || 0.2;
      quantumMetrics.quantumEntanglement = this._coherenceLevel * Math.pow(this._flowLevel / 8, 2);
      quantumMetrics.superpositionIndex = Math.min(1, (this._flowLevel / 4) * this._coherenceLevel);
    }
    
    // Generate recommendations if requested
    let recommendations: string[] | undefined;
    if (includeRecommendations) {
      recommendations = this.generateRecommendations();
    }
    
    return {
      coherence: this._coherenceLevel,
      flowLevel: this._flowLevel,
      ...(fullReport && { communicationState: this.determineCurrentCommunicationState() }),
      quantumMetrics,
      ...(includeRecommendations && { recommendations })
    };
  }
  
  /**
   * Check overall system coherence across multiple subsystems
   * 
   * This updated implementation uses the CoherenceAdapter to calculate coherence
   * using a theoretically grounded approach based on the Kuramoto Order Parameter
   * and cosine similarity metrics optimized for the 0.7500 attractor state.
   */
  private checkSystemCoherence(payload: {
    subsystems: Array<{
      id: string;
      name: string;
      coherence: number;
      flowLevel: number;
      status: string;
    }>
  }): {
    systemCoherence: number;
    subsystemAnalysis: Record<string, any>;
    coherenceThreshold: number;
    status: 'optimal' | 'stable' | 'warning' | 'critical';
    recommendations?: string[];
  } {
    const { subsystems } = payload;
    
    if (!subsystems || !Array.isArray(subsystems) || subsystems.length === 0) {
      throw new Error('At least one subsystem is required for system coherence check');
    }
    
    // Store the original subsystem analysis to return
    const subsystemAnalysis: Record<string, any> = {};
    
    // Process old alignment method for backward compatibility in the analysis
    subsystems.forEach(subsystem => {
      const alignment = this.calculateSubsystemAlignment(subsystem);
      
      subsystemAnalysis[subsystem.id] = {
        name: subsystem.name,
        coherence: subsystem.coherence,
        flowLevel: subsystem.flowLevel,
        status: subsystem.status,
        alignment,
        contribution: alignment * subsystem.coherence
      };
    });
    
    try {
      // Get the CoherenceAdapter instance
      const coherenceAdapter = getCoherenceAdapter();
      
      // Process the data with our advanced coherence metrics
      const coherenceResult = coherenceAdapter.processOrchestratorData(subsystems);
      
      // Map the detailed coherence status to the simpler oracle status
      const oracleStatus = mapCoherenceStatusToOracleStatus(coherenceResult.status);
      
      // Use custom recommendations based on coherence status
      const recommendations = generateCoherenceRecommendations(
        coherenceResult.status,
        coherenceResult.raw,
        subsystems
      );
      
      // Target coherence threshold - the 0.7500 attractor with some tolerance
      const coherenceThreshold = 0.75; 
      
      // Update the agent's coherence level based on system coherence
      this._coherenceLevel = coherenceResult.systemCoherence;
      
      console.log(`[QUANTUM_STATE: COHERENCE_FLOW] System coherence measured at ${coherenceResult.systemCoherence.toFixed(4)} with status "${coherenceResult.status}"`);
      
      return {
        systemCoherence: coherenceResult.systemCoherence,
        subsystemAnalysis,
        coherenceThreshold,
        status: oracleStatus,
        recommendations
      };
    } catch (error) {
      // Fallback to traditional calculation if there's an error
      console.error('[QUANTUM_STATE: ERROR_FLOW] Error using CoherenceAdapter, falling back:', error);
      
      // Calculate weighted coherence based on all subsystems (legacy method)
      let totalCoherence = 0;
      
      subsystems.forEach(subsystem => {
        totalCoherence += subsystemAnalysis[subsystem.id].contribution;
      });
      
      // Normalize the total coherence
      const systemCoherence = totalCoherence / subsystems.length;
      
      // Determine the quantum coherence threshold (QCTF)
      const coherenceThreshold = 0.92; // Legacy target threshold
      
      // Determine system status based on coherence (legacy approach)
      let status: 'optimal' | 'stable' | 'warning' | 'critical';
      if (systemCoherence >= coherenceThreshold) {
        status = 'optimal';
      } else if (systemCoherence >= 0.75) {
        status = 'stable';
      } else if (systemCoherence >= 0.5) {
        status = 'warning';
      } else {
        status = 'critical';
      }
      
      // Update the agent's coherence level based on system coherence
      this._coherenceLevel = systemCoherence;
      
      return {
        systemCoherence,
        subsystemAnalysis,
        coherenceThreshold,
        status,
        recommendations: this.generateSystemRecommendations(subsystemAnalysis, status)
      };
    }
  }
  
  // --- Helper methods ---
  
  /**
   * Update internal state based on request processing
   */
  private updateInternalState(request: AgentRequest, responsePayload: any): void {
    // Update metrics
    this._metrics.requestsProcessed = (this._metrics.requestsProcessed || 0) + 1;
    this._metrics.lastRequestType = request.type;
    this._metrics.lastResponseTimestamp = new Date();
    
    // Update coherence trend
    const previousCoherence = this._metrics.previousCoherence || this._coherenceLevel;
    if (this._coherenceLevel > previousCoherence) {
      this._metrics.coherenceTrend = 'increasing';
    } else if (this._coherenceLevel < previousCoherence) {
      this._metrics.coherenceTrend = 'decreasing';
    } else {
      this._metrics.coherenceTrend = 'stable';
    }
    this._metrics.previousCoherence = this._coherenceLevel;
    
    // Calculate flow variance
    const previousFlowLevel = this._metrics.previousFlowLevel || this._flowLevel;
    this._metrics.flowVariance = Math.abs(this._flowLevel - previousFlowLevel) / 8;
    this._metrics.previousFlowLevel = this._flowLevel;
  }
  
  /**
   * Calculate coherence contribution of the processed request
   */
  private calculateCoherenceContribution(request: AgentRequest, responsePayload: any): number {
    // Simple calculation for now
    return this._coherenceLevel * 0.1;
  }
  
  /**
   * Calculate content coherence based on text analysis
   */
  private calculateContentCoherence(content: string, flowLevel: number): number {
    // Basic implementation
    // In a real system, this would be more sophisticated
    const textLength = content.length;
    const sentenceCount = content.split(/[.!?]+/).length - 1;
    const avgSentenceLength = textLength / (sentenceCount || 1);
    
    // Penalize extremely short or long sentences
    const sentenceLengthFactor = Math.min(1, Math.max(0.5, 
      1 - Math.abs(avgSentenceLength - 20) / 40
    ));
    
    // Coherence increases with flow level up to 6, then can decrease
    const flowFactor = 1 - Math.abs(flowLevel - 4) / 8;
    
    // Combine factors (simplistic approach)
    return Math.min(1, Math.max(0.1, 
      (0.7 * sentenceLengthFactor) + (0.3 * flowFactor)
    ));
  }
  
  /**
   * Calculate subsystem alignment
   */
  private calculateSubsystemAlignment(subsystem: {
    id: string;
    name: string;
    coherence: number;
    flowLevel: number;
    status: string;
  }): number {
    // Calculate how well the subsystem aligns with current oracle state
    const coherenceAlignment = 1 - Math.abs(this._coherenceLevel - subsystem.coherence);
    const flowAlignment = 1 - (Math.abs(this._flowLevel - subsystem.flowLevel) / 8);
    
    // Weight alignments - coherence is more important
    return (0.7 * coherenceAlignment) + (0.3 * flowAlignment);
  }
  
  /**
   * Determine the current communication state based on agent metrics
   */
  private determineCurrentCommunicationState(): string {
    if (this._flowLevel >= 7) {
      return this._coherenceLevel >= 0.8 
        ? 'clarity' 
        : 'divergent';
    } else if (this._flowLevel >= 5) {
      return this._coherenceLevel >= 0.7 
        ? 'convergent' 
        : 'divergent';
    } else if (this._flowLevel >= 3) {
      return 'clarity';
    } else if (this._flowLevel >= 1) {
      return 'convergent';
    } else {
      return 'overflow';
    }
  }
  
  /**
   * Generate recommendations based on current state
   */
  private generateRecommendations(): string[] {
    const recommendations: string[] = [];
    
    // Coherence-based recommendations
    if (this._coherenceLevel < 0.6) {
      recommendations.push('Improve system coherence through clearer communication patterns');
      recommendations.push('Consider implementing additional stabilization mechanisms');
    }
    
    // Flow level recommendations
    if (this._flowLevel < 2) {
      recommendations.push('Current flow is highly stable but may lack adaptability');
    } else if (this._flowLevel > 6) {
      recommendations.push('High flow state is excellent for innovation but may need grounding');
    }
    
    // General recommendations
    recommendations.push('Maintain quantum entanglement through regular coherence checks');
    
    return recommendations;
  }
  
  /**
   * Generate system-specific recommendations
   */
  private generateSystemRecommendations(
    subsystemAnalysis: Record<string, any>,
    status: 'optimal' | 'stable' | 'warning' | 'critical'
  ): string[] {
    const recommendations: string[] = [];
    
    if (status === 'critical' || status === 'warning') {
      // Find subsystems with lowest coherence
      const lowestCoherence = Object.values(subsystemAnalysis)
        .sort((a, b) => a.coherence - b.coherence)
        .slice(0, 2);
      
      lowestCoherence.forEach(subsystem => {
        recommendations.push(`Improve coherence in "${subsystem.name}" subsystem`);
      });
      
      recommendations.push('Implement emergency coherence recovery protocol');
    } else {
      recommendations.push('Maintain current coherence levels through regular system checks');
    }
    
    return recommendations;
  }
}

// Descriptions for communication states
const colorWheelStateDescriptions: Record<string, string> = {
  'convergent': 'Communication is focused and productive',
  'divergent': 'Exploring multiple possibilities',
  'clarity': 'Clear understanding and alignment',
  'confusion': 'Some misunderstandings present',
  'overflow': 'Too much information, clarity lost'
};