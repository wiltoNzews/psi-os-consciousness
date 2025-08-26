/**
 * Type definitions for the Quantum Coherence Logger
 */

export type DomainStatus = {
  level: number;
  percentage: number;
  isOptimal: boolean;
  ratio: string;
  description: string;
};

export type DomainCoherenceStatus = Record<string, DomainStatus>;

export type CoherenceEvent = {
  timestamp: number;
  timeDelta: number;
  eventType: string;
  metadata: any;
  message: string;
  severity: string;
};

export interface QuantumCoherenceLogger {
  coherenceLevel: number;
  domainCoherenceLevels: Record<string, number>;
  eventHistory: CoherenceEvent[];
  
  logCoherenceEvent(
    eventType: string,
    metadata: any,
    message: string,
    severity?: string,
    broadcast?: boolean
  ): CoherenceEvent;
  
  updateCoherenceLevel(newCoherenceLevel: number): void;
  getCoherenceRatio(): [number, number];
  calculateSystemCoherence(): number;
  updateDomainCoherence(domain: string, newLevel: number, reason: string): void;
  getDomainCoherenceStatus(): DomainCoherenceStatus;
  getDomainDescription(domain: string): string;
  realignAllDomains(): void;
  getEventHistory(): CoherenceEvent[];
}

declare const quantumCoherenceLogger: QuantumCoherenceLogger;
export default quantumCoherenceLogger;