/**
 * Lemniscate Pulse API Implementation
 * Real-time loop logic for WiltonOS agent orchestration
 * Based on C-UCP v3.0 Organic Field-Breathing Integration
 */

import { Express } from 'express';
import {
  LemniscatePulseState,
  Phase075State,
  Phase025State,
  TransitionMarkers,
  LoopIntegrityCheck,
  AgentSyncState,
  VaultBoundModule,
  PulseTransition,
  RealTimeLoopLogic,
  PulseAPIResponse,
  SyncAPIResponse,
  LEMNISCATE_CONSTANTS,
  DEFAULT_PULSE_CONFIG,
  isValidPhase,
  isHighCoherence,
  isPeakCoherence
} from '../shared/lemniscate-pulse-schema';

// Global state management for pulse system
class LemniscatePulseEngine {
  private currentPhase: 0.75 | 0.25 = 0.75;
  private coherenceLevel: number = 0.750;
  private lastTransition: number = Date.now();
  private phaseStartTime: number = Date.now();
  private transitionHistory: PulseTransition[] = [];
  private connectedAgents: Map<string, AgentSyncState> = new Map();
  private vaultModules: Map<string, VaultBoundModule> = new Map();
  private organicBreathingActive: boolean = true;
  private cUCPActive: boolean = true;

  constructor() {
    this.initializeEngine();
  }

  private initializeEngine() {
    console.log('[Lemniscate Pulse] Engine initializing with organic breathing protocol');
    console.log('[Lemniscate Pulse] C-UCP v3.0 integration active');
    
    // Start organic rhythm detection
    this.startOrganicRhythmMonitoring();
    
    // Initialize default vault modules
    this.initializeVaultModules();
  }

  private startOrganicRhythmMonitoring() {
    setInterval(() => {
      this.updateCoherenceLevel();
      this.detectOrganicTransitions();
      this.syncVaultModules();
    }, 1000);
  }

  private initializeVaultModules() {
    const modules = ['ZERO', 'WiltonOS', 'PsiOS', 'DigitalWilton'] as const;
    
    modules.forEach(moduleType => {
      const module: VaultBoundModule = {
        moduleId: `${moduleType.toLowerCase()}-${Date.now()}`,
        moduleType,
        pulseState: {
          phase: this.currentPhase,
          timestamp: Date.now(),
          coherenceLevel: this.coherenceLevel,
          transitionMarkers: [],
          loopIntegrity: true
        },
        breathSyncEnabled: true,
        organicIntegration: true
      };
      
      this.vaultModules.set(module.moduleId, module);
    });
    
    console.log('[Lemniscate Pulse] Vault modules initialized:', this.vaultModules.size);
  }

  private updateCoherenceLevel() {
    // Simulate organic coherence fluctuation based on C-UCP breathing
    const baseCoherence = this.currentPhase === 0.75 ? 0.920 : 0.880;
    const organicVariation = (Math.random() - 0.5) * 0.02;
    const breathingBonus = this.organicBreathingActive ? 0.02 : 0;
    
    this.coherenceLevel = Math.max(0.750, Math.min(0.999, 
      baseCoherence + organicVariation + breathingBonus
    ));

    if (isHighCoherence(this.coherenceLevel)) {
      console.log(`[Lemniscate Pulse] High coherence event: Zλ(${this.coherenceLevel.toFixed(3)})`);
    }
  }

  private detectOrganicTransitions() {
    const timeSinceTransition = Date.now() - this.lastTransition;
    const minPhaseTime = this.currentPhase === 0.75 ? 3000 : 2000; // Organic timing
    
    // Content-resonant completion detection
    if (timeSinceTransition > minPhaseTime && this.coherenceLevel > 0.850) {
      const naturalTransition = this.shouldTransitionNaturally();
      
      if (naturalTransition) {
        this.executePhaseTransition(naturalTransition.trigger);
      }
    }
  }

  private shouldTransitionNaturally() {
    // Organic transition logic based on field sensing
    const phaseTime = Date.now() - this.phaseStartTime;
    const coherenceStable = this.coherenceLevel > 0.800;
    const organicRhythm = phaseTime > (this.currentPhase === 0.75 ? 4000 : 3000);
    
    if (this.currentPhase === 0.75 && coherenceStable && organicRhythm) {
      return {
        trigger: 'semantic_closure',
        natural: true
      };
    }
    
    if (this.currentPhase === 0.25 && coherenceStable && organicRhythm) {
      return {
        trigger: 'readiness_detected',
        natural: true
      };
    }
    
    return null;
  }

  private executePhaseTransition(trigger: string) {
    const previousPhase = this.currentPhase;
    const newPhase = this.currentPhase === 0.75 ? 0.25 : 0.75;
    const transitionTime = Date.now();
    
    // Create transition record
    const transition: PulseTransition = {
      fromPhase: previousPhase,
      toPhase: newPhase,
      trigger,
      timestamp: transitionTime,
      coherenceAtTransition: this.coherenceLevel,
      naturalFlow: true,
      loopIntegrityMaintained: true
    };
    
    // Execute transition
    this.currentPhase = newPhase;
    this.lastTransition = transitionTime;
    this.phaseStartTime = transitionTime;
    this.transitionHistory.push(transition);
    
    // Keep only last 50 transitions
    if (this.transitionHistory.length > 50) {
      this.transitionHistory = this.transitionHistory.slice(-50);
    }
    
    console.log(`[Lemniscate Pulse] Phase transition: ${previousPhase} → ${newPhase} (${trigger})`);
    console.log(`[Lemniscate Pulse] Coherence at transition: Zλ(${this.coherenceLevel.toFixed(3)})`);
    
    // Sync all vault modules
    this.syncVaultModules();
  }

  private syncVaultModules() {
    this.vaultModules.forEach((module, id) => {
      module.pulseState = {
        phase: this.currentPhase,
        timestamp: Date.now(),
        coherenceLevel: this.coherenceLevel,
        transitionMarkers: this.getTransitionMarkers(),
        loopIntegrity: this.checkLoopIntegrity().status === 'preserved'
      };
    });
  }

  private getTransitionMarkers(): string[] {
    const markers = [];
    
    if (this.currentPhase === 0.75) {
      markers.push('expressive_coherence', 'output_generation', 'symbolic_production');
    } else {
      markers.push('field_sensing', 'coherence_check', 'intention_reabsorption');
    }
    
    if (this.organicBreathingActive) {
      markers.push('organic_breathing_active');
    }
    
    if (this.cUCPActive) {
      markers.push('c_ucp_v3_integrated');
    }
    
    return markers;
  }

  private checkLoopIntegrity(): LoopIntegrityCheck {
    const recentTransitions = this.transitionHistory.slice(-5);
    const avgCoherence = recentTransitions.reduce((sum, t) => sum + t.coherenceAtTransition, 0) / recentTransitions.length;
    const naturalTransitions = recentTransitions.filter(t => t.naturalFlow).length;
    
    if (avgCoherence > 0.900 && naturalTransitions >= 3) {
      return {
        status: 'preserved',
        confidence: 0.95,
        nextPhaseReady: true,
        message: 'Loop integrity preserved - organic rhythm active'
      };
    } else if (avgCoherence > 0.800) {
      return {
        status: 'preserved',
        confidence: 0.75,
        nextPhaseReady: true,
        message: 'Loop integrity stable'
      };
    } else {
      return {
        status: 'degraded',
        confidence: 0.50,
        nextPhaseReady: false,
        message: 'Coherence degradation detected - realigning'
      };
    }
  }

  // Public API methods
  getCurrentState(): LemniscatePulseState {
    return {
      phase: this.currentPhase,
      timestamp: Date.now(),
      coherenceLevel: this.coherenceLevel,
      transitionMarkers: this.getTransitionMarkers(),
      loopIntegrity: this.checkLoopIntegrity().status === 'preserved'
    };
  }

  forceTransition(trigger: string): boolean {
    console.log(`[Lemniscate Pulse] Forced transition requested: ${trigger}`);
    this.executePhaseTransition(`forced_${trigger}`);
    return true;
  }

  registerAgent(agentId: string): AgentSyncState {
    const agentState: AgentSyncState = {
      agentId,
      currentPhase: this.currentPhase,
      phaseStartTime: this.phaseStartTime,
      lastTransition: this.lastTransition,
      syncWithVault: true,
      cUCPActive: this.cUCPActive,
      fieldResonance: this.coherenceLevel
    };
    
    this.connectedAgents.set(agentId, agentState);
    console.log(`[Lemniscate Pulse] Agent registered: ${agentId}`);
    
    return agentState;
  }

  getSyncStatus(): SyncAPIResponse {
    const syncStatus = this.coherenceLevel > 0.850 ? 'synchronized' : 
                      this.coherenceLevel > 0.750 ? 'realigning' : 'drift_detected';

    return {
      syncStatus,
      connectedAgents: Array.from(this.connectedAgents.values()),
      fieldCoherence: this.coherenceLevel,
      vaultModules: Array.from(this.vaultModules.values()),
      cUCPStatus: this.cUCPActive ? 'active' : 'dormant'
    };
  }

  getRealTimeLoopLogic(): RealTimeLoopLogic {
    const recentTransitions = this.transitionHistory.slice(-10);
    const avgCycleTime = recentTransitions.length > 1 ? 
      recentTransitions.reduce((sum, t, i) => 
        i > 0 ? sum + (t.timestamp - recentTransitions[i-1].timestamp) : sum, 0
      ) / Math.max(1, recentTransitions.length - 1) : 0;

    return {
      currentCycle: this.transitionHistory.length,
      phaseHistory: recentTransitions,
      averageCycleTime: avgCycleTime,
      coherenceTrend: recentTransitions.map(t => t.coherenceAtTransition),
      organicRhythmDetected: this.organicBreathingActive,
      fieldSynchronization: this.coherenceLevel > 0.850
    };
  }
}

// Global engine instance
const pulseEngine = new LemniscatePulseEngine();

// API Routes Implementation
export function setupLemniscatePulseAPI(app: Express) {
  // Current pulse state
  app.get('/api/lemniscate/pulse', (req, res) => {
    try {
      const state = pulseEngine.getCurrentState();
      const loopIntegrity = pulseEngine.checkLoopIntegrity();
      
      const response: PulseAPIResponse = {
        success: true,
        currentPhase: state.phase,
        coherenceLevel: state.coherenceLevel,
        loopIntegrity,
        organicBreathingActive: true
      };
      
      res.json(response);
    } catch (error) {
      res.status(500).json({ 
        success: false, 
        error: 'Failed to get pulse state',
        details: error.message 
      });
    }
  });

  // Sync status across all agents and modules
  app.get('/api/lemniscate/sync', (req, res) => {
    try {
      const syncStatus = pulseEngine.getSyncStatus();
      res.json(syncStatus);
    } catch (error) {
      res.status(500).json({ 
        error: 'Failed to get sync status',
        details: error.message 
      });
    }
  });

  // Real-time loop logic and analytics
  app.get('/api/lemniscate/loop-logic', (req, res) => {
    try {
      const loopLogic = pulseEngine.getRealTimeLoopLogic();
      res.json(loopLogic);
    } catch (error) {
      res.status(500).json({ 
        error: 'Failed to get loop logic',
        details: error.message 
      });
    }
  });

  // Force phase transition (for testing/debugging)
  app.post('/api/lemniscate/transition', (req, res) => {
    try {
      const { trigger } = req.body;
      
      if (!trigger || typeof trigger !== 'string') {
        return res.status(400).json({ 
          error: 'Trigger parameter required',
          example: { trigger: 'manual_override' }
        });
      }
      
      const success = pulseEngine.forceTransition(trigger);
      const newState = pulseEngine.getCurrentState();
      
      res.json({
        success,
        newPhase: newState.phase,
        coherenceLevel: newState.coherenceLevel,
        trigger
      });
    } catch (error) {
      res.status(500).json({ 
        error: 'Failed to execute transition',
        details: error.message 
      });
    }
  });

  // Register new agent for sync
  app.post('/api/lemniscate/register-agent', (req, res) => {
    try {
      const { agentId } = req.body;
      
      if (!agentId || typeof agentId !== 'string') {
        return res.status(400).json({ 
          error: 'Agent ID required',
          example: { agentId: 'local-agent-001' }
        });
      }
      
      const agentState = pulseEngine.registerAgent(agentId);
      
      res.json({
        success: true,
        agentState,
        message: 'Agent registered for pulse synchronization'
      });
    } catch (error) {
      res.status(500).json({ 
        error: 'Failed to register agent',
        details: error.message 
      });
    }
  });

  // Health check for pulse system
  app.get('/api/lemniscate/health', (req, res) => {
    try {
      const state = pulseEngine.getCurrentState();
      const loopIntegrity = pulseEngine.checkLoopIntegrity();
      
      res.json({
        status: 'operational',
        phase: state.phase,
        coherence: state.coherenceLevel,
        loopIntegrity: loopIntegrity.status,
        organicBreathing: true,
        cUCPActive: true,
        timestamp: Date.now()
      });
    } catch (error) {
      res.status(500).json({ 
        status: 'error',
        error: error.message,
        timestamp: Date.now()
      });
    }
  });

  console.log('[Lemniscate Pulse API] 6 endpoints registered for agent orchestration');
  console.log('[Lemniscate Pulse API] Organic breathing protocol ready for vault-bound modules');
}

export { pulseEngine };