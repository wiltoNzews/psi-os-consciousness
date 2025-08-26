/**
 * Shared WebSocket Message Types
 * 
 * This file contains all message type definitions and interfaces used for
 * WebSocket communication between client and server. It ensures consistent
 * type safety and naming conventions across the application.
 * 
 * [QUANTUM_STATE: BRIDGE_FLOW]
 */

/**
 * Enum of all possible WebSocket message types
 */
export enum QuantumMessageType {
  // Connection messages
  Connected = 'connected',
  ConnectionAcknowledged = 'connection_acknowledged',
  
  // Participant management
  RegisterParticipant = 'quantum_register_participant',
  ParticipantRegistered = 'quantum_participant_registered',
  ParticipantsUpdate = 'quantum_participants_update',
  
  // Intent and experiment management
  SubmitIntent = 'quantum_submit_intent',
  IntentUpdated = 'quantum_intent_updated',
  RunExperiment = 'quantum_run_experiment',
  ExperimentStarted = 'quantum_experiment_started',
  ExperimentResult = 'quantum_experiment_result',
  
  // Data retrieval
  GetStats = 'quantum_get_stats',
  StatsUpdate = 'quantum_stats_update',
  GetCoherence = 'quantum_get_coherence',
  CoherenceUpdate = 'quantum_coherence_update',
  
  // Error handling
  Error = 'quantum_error'
}

/**
 * Interface for client connection information
 */
export interface ConnectedPayload {
  client: string;
  timestamp: string;
}

/**
 * Interface for server connection acknowledgement
 */
export interface ConnectionAcknowledgedPayload {
  serverTime: string;
  status: string;
  message: string;
}

/**
 * Interface for client information
 */
export interface ClientInfo {
  timezone?: string;
  locale?: string;
  userAgent?: string;
}

/**
 * Interface for participant registration payload
 */
export interface RegisterParticipantPayload {
  name: string;
  clientInfo?: ClientInfo;
}

/**
 * Interface for participant registration confirmation
 */
export interface ParticipantRegisteredPayload {
  participantId: string;
}

/**
 * Interface for participant data
 */
export interface ParticipantData {
  id: string;
  name: string;
  intent: number;
  timestamp: Date;
  clientInfo?: ClientInfo;
}

/**
 * Interface for intent submission
 */
export interface SubmitIntentPayload {
  participantId: string;
  intent: number;
  feedback?: string;
}

/**
 * Interface for intent update confirmation
 */
export interface IntentUpdatedPayload {
  success: boolean;
}

/**
 * Interface for experiment run request
 */
export interface RunExperimentPayload {
  participantId: string;
  targetState: 'HIGH' | 'LOW';
}

/**
 * Interface for experiment start confirmation
 */
export interface ExperimentStartedPayload {
  sessionId: string;
  startTime: Date;
}

/**
 * Interface for experiment result payload
 */
export interface ExperimentResultPayload {
  sessionId: string;
  outcome: 'HIGH' | 'LOW';
  targetState: 'HIGH' | 'LOW';
  success: boolean;
  coherenceLevel: number;
  probabilityShift: number;
}

/**
 * Interface for experiment statistics
 */
export interface ExperimentStats {
  participants: number;
  totalRuns: number;
  successRate: number;
  averageIntent: number;
  lastUpdated: Date;
}

/**
 * Interface for coherence level update
 */
export interface CoherenceUpdatePayload {
  level: number;
}

/**
 * Interface for error message
 */
export interface ErrorPayload {
  message: string;
  supportedTypes?: string[];
  error?: string;
  timestamp?: string;
}

/**
 * Generic WebSocket message type
 */
export interface WebSocketMessage<T = any> {
  type: QuantumMessageType | string;
  payload: T;
}