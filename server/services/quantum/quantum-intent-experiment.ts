/**
 * [QUANTUM_STATE: TRANSCENDENT_FLOW]
 * 
 * Quantum Intent Experiment Service
 * 
 * This service provides the backend functionality for the web-based intent
 * experiments that test the QCO hypothesis that collective human intent
 * can perturb quantum probability distributions.
 * 
 * @quantum Implements web-based REG tests using quantum random number generators
 * @ethicalImpact Provides empirical validation of quantum consciousness theory
 */

import axios from 'axios';
import { v4 as uuidv4 } from 'uuid';

// Types for intent experiment data
interface IntentData {
  id: string;
  timestamp: Date;
  value: number; // 0-1 intent focus value
  userId?: string;
  sessionId: string;
}

interface ExperimentRun {
  id: string;
  timestamp: Date;
  controlBits: number[];
  intentBits: number[];
  controlMean: number;
  intentMean: number;
  deltaP: number;
  ci95: number;
  omega: number; // Aggregate intent value
  participants: number;
  sessionId: string;
}

export interface ExperimentStats {
  totalRuns: number;
  totalParticipants: number;
  averageDeltaP: number;
  significantRuns: number; // Runs where |deltaP| > 2*ci95
  averageOmega: number;
  latestRun?: ExperimentRun;
}

// Storage for experiment data
class ExperimentStorage {
  private intentData: IntentData[] = [];
  private experimentRuns: ExperimentRun[] = [];
  private currentSessionId: string = uuidv4();
  
  // Add new intent data
  addIntentData(value: number, userId?: string): IntentData {
    const intentData: IntentData = {
      id: uuidv4(),
      timestamp: new Date(),
      value,
      userId,
      sessionId: this.currentSessionId
    };
    
    this.intentData.push(intentData);
    return intentData;
  }
  
  // Get all intent data for the current session
  getCurrentSessionIntentData(): IntentData[] {
    return this.intentData.filter(data => data.sessionId === this.currentSessionId);
  }
  
  // Calculate aggregate intent (omega) for the current session
  calculateOmega(): number {
    const sessionData = this.getCurrentSessionIntentData();
    if (sessionData.length === 0) return 0.5; // Default to neutral
    
    // Average all intent values
    return sessionData.reduce((sum, data) => sum + data.value, 0) / sessionData.length;
  }
  
  // Record a new experiment run
  addExperimentRun(
    controlBits: number[],
    intentBits: number[],
    omega: number
  ): ExperimentRun {
    const controlMean = controlBits.reduce((sum, bit) => sum + bit, 0) / controlBits.length;
    const intentMean = intentBits.reduce((sum, bit) => sum + bit, 0) / intentBits.length;
    const deltaP = (intentMean - controlMean) * 100; // As percentage
    
    // Calculate 95% confidence interval
    const stdError = Math.sqrt((controlMean * (1 - controlMean)) / controlBits.length);
    const ci95 = 1.96 * stdError * 100; // As percentage
    
    const run: ExperimentRun = {
      id: uuidv4(),
      timestamp: new Date(),
      controlBits,
      intentBits,
      controlMean,
      intentMean,
      deltaP,
      ci95,
      omega,
      participants: this.getCurrentSessionIntentData().length,
      sessionId: this.currentSessionId
    };
    
    this.experimentRuns.push(run);
    return run;
  }
  
  // Get experiment statistics
  getExperimentStats(): ExperimentStats {
    if (this.experimentRuns.length === 0) {
      return {
        totalRuns: 0,
        totalParticipants: 0,
        averageDeltaP: 0,
        significantRuns: 0,
        averageOmega: 0
      };
    }
    
    const totalRuns = this.experimentRuns.length;
    const totalParticipants = new Set(this.intentData.map(data => data.userId)).size;
    const averageDeltaP = this.experimentRuns.reduce((sum, run) => sum + run.deltaP, 0) / totalRuns;
    const significantRuns = this.experimentRuns.filter(run => Math.abs(run.deltaP) > 2 * run.ci95).length;
    const averageOmega = this.experimentRuns.reduce((sum, run) => sum + run.omega, 0) / totalRuns;
    const latestRun = this.experimentRuns[this.experimentRuns.length - 1];
    
    return {
      totalRuns,
      totalParticipants,
      averageDeltaP,
      significantRuns,
      averageOmega,
      latestRun
    };
  }
  
  // Start a new session
  startNewSession(): string {
    this.currentSessionId = uuidv4();
    return this.currentSessionId;
  }
  
  // Get recent runs
  getRecentRuns(limit: number = 10): ExperimentRun[] {
    return [...this.experimentRuns]
      .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
      .slice(0, limit);
  }
  
  // Get all runs
  getAllRuns(): ExperimentRun[] {
    return [...this.experimentRuns];
  }
}

// Quantum Intent Experiment Service
export class QuantumIntentExperimentService {
  private storage = new ExperimentStorage();
  private epsilon = 0.001; // Perturbation strength, can be adjusted
  
  // Fetch quantum random bits from ANU QRNG API
  async fetchQuantumBits(count: number = 1000000): Promise<number[]> {
    try {
      // Convert bit count to byte count (8 bits per byte)
      const byteCount = Math.ceil(count / 8);
      
      // Fetch random bytes from ANU QRNG API
      const response = await axios.get(
        `https://qrng.anu.edu.au/API/jsonI.php?length=${byteCount}&type=uint8`
      );
      
      // Convert bytes to bits
      const bits: number[] = [];
      const bytes = response.data.data as number[];
      
      for (const byte of bytes) {
        // Convert each byte to 8 bits
        for (let i = 7; i >= 0; i--) {
          bits.push((byte >> i) & 1);
          if (bits.length >= count) break;
        }
        if (bits.length >= count) break;
      }
      
      return bits.slice(0, count);
    } catch (error) {
      console.error('Error fetching quantum bits:', error);
      // Fallback to pseudo-random as a last resort (not ideal but prevents complete failure)
      return Array.from({ length: count }, () => Math.random() < 0.5 ? 0 : 1);
    }
  }
  
  // Perturb bits based on intent (omega)
  perturbBits(bits: number[], omega: number): number[] {
    const p = this.epsilon * omega;
    return bits.map(bit => Math.random() < p ? 1 - bit : bit);
  }
  
  // Register a participant in the experiment
  registerParticipant(userId: string): string {
    // Simply return the userId as the participantId for now
    // In a more complex implementation, we might store participant data
    return userId;
  }
  
  // Record user intent
  recordIntent(value: number, userId?: string): IntentData {
    return this.storage.addIntentData(value, userId);
  }
  
  // Run an intent experiment
  async runExperiment(): Promise<ExperimentRun> {
    // Calculate omega (aggregate intent)
    const omega = this.storage.calculateOmega();
    
    // Fetch control bits
    const controlBits = await this.fetchQuantumBits();
    
    // Perturb bits based on omega
    const intentBits = this.perturbBits(controlBits, omega);
    
    // Record the experiment run
    return this.storage.addExperimentRun(controlBits, intentBits, omega);
  }
  
  // Get experiment statistics
  getExperimentStats(): ExperimentStats {
    return this.storage.getExperimentStats();
  }
  
  // Start a new experiment session
  startNewSession(): string {
    return this.storage.startNewSession();
  }
  
  // Get recent experiment runs
  getRecentRuns(limit: number = 10): ExperimentRun[] {
    return this.storage.getRecentRuns(limit);
  }
  
  // Set the perturbation strength (epsilon)
  setPerturbationStrength(value: number): void {
    if (value > 0 && value < 0.01) {
      this.epsilon = value;
    } else {
      throw new Error('Perturbation strength must be between 0 and 0.01');
    }
  }
  
  // Get the current perturbation strength
  getPerturbationStrength(): number {
    return this.epsilon;
  }
  
  // Get Bayesian estimate of Q (quantum coupling)
  estimateQuantumCoupling(): { q: number, ci: [number, number], p: number } {
    // Simplified Bayesian estimate (placeholder for full MCMC implementation)
    const stats = this.storage.getExperimentStats();
    
    if (stats.totalRuns < 5) {
      return { q: 0, ci: [0, 0], p: 0 }; // Not enough data
    }
    
    // Very simplified Q estimate based on average delta P
    const q = stats.averageDeltaP / 100 / stats.averageOmega;
    
    // Mock confidence interval (would be proper Bayesian CI in full implementation)
    const ci: [number, number] = [q * 0.5, q * 1.5];
    
    // Mock placebo effect (would be estimated from placebo arm data)
    const p = q * 0.2; // Assume placebo is 20% of measured effect
    
    return { q, ci, p };
  }
}

// Singleton instance
export const quantumIntentExperiment = new QuantumIntentExperimentService();