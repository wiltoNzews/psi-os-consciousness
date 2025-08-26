/**
 * WebSocket Types
 * 
 * Type definitions for WebSocket message handlers and related functionality
 */

/**
 * WebSocket message handler function type
 * Takes a payload and client ID, returns a response
 */
export type WebSocketMessageHandler = (
  payload: any,
  clientId: string
) => Promise<any>;

/**
 * WebSocket message structure type
 */
export interface WebSocketMessage {
  type: string;
  payload: any;
}

/**
 * Murphy Protocol system state types
 */
export enum MurphySystemState {
  OPTIMAL = 'optimal',
  WARNING = 'warning',
  CRITICAL = 'critical',
  RECOVERY = 'recovery',
  NUCLEAR = 'nuclear'
}

/**
 * Murphy Protocol recovery strategy types
 */
export enum MurphyRecoveryStrategy {
  SELF_CALIBRATION = 'self_calibration',
  MEMORY_SNAPSHOT_RESTORE = 'memory_snapshot_restore',
  PARAMETER_REBALANCING = 'parameter_rebalancing',
  AGGRESSIVE_NORMALIZATION = 'aggressive_normalization',
  NUCLEAR_HARD_RESET = 'nuclear_hard_reset'
}

/**
 * Murphy Protocol system metrics type
 */
export interface MurphySystemMetrics {
  stabilityRatio: number;
  explorationRatio: number;
  coherenceIndex: number;
  lastUpdated: Date | string;
}

/**
 * Murphy Protocol state change event type
 */
export interface MurphyStateChangeEvent {
  previousState: MurphySystemState;
  newState: MurphySystemState;
  metrics: MurphySystemMetrics;
  reason?: string;
  timestamp?: Date | string;
}

/**
 * Murphy Protocol recovery event type
 */
export interface MurphyRecoveryEvent {
  timestamp: Date | string;
  previousState: MurphySystemState;
  strategyApplied: MurphyRecoveryStrategy;
  successful: boolean;
  recoveryTimeMs: number;
  newMetrics?: MurphySystemMetrics;
}

/**
 * Murphy Protocol system status type
 */
export interface MurphySystemStatus {
  state: MurphySystemState;
  metrics: MurphySystemMetrics;
  recoveryHistory: MurphyRecoveryEvent[];
}