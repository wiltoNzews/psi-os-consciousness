// Import types from the shared folder
import { 
  QuantumMessageType,
  WebSocketMessage,
  ConnectedPayload,
  ConnectionAcknowledgedPayload,
  ClientInfo,
  RegisterParticipantPayload,
  ParticipantRegisteredPayload,
  ParticipantData,
  SubmitIntentPayload,
  IntentUpdatedPayload,
  RunExperimentPayload,
  ExperimentStartedPayload,
  ExperimentResultPayload,
  ExperimentStats,
  CoherenceUpdatePayload,
  ErrorPayload
} from '../../../shared/message-types';

// Re-export all types
export {
  QuantumMessageType,
  WebSocketMessage,
  ConnectedPayload,
  ConnectionAcknowledgedPayload,
  ClientInfo,
  RegisterParticipantPayload,
  ParticipantRegisteredPayload,
  ParticipantData,
  SubmitIntentPayload,
  IntentUpdatedPayload,
  RunExperimentPayload,
  ExperimentStartedPayload,
  ExperimentResultPayload,
  ExperimentStats,
  CoherenceUpdatePayload,
  ErrorPayload
};