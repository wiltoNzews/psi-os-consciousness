/**
 * Tests for the RealityModeManager
 * 
 * This file contains tests for the RealityModeManager which handles
 * transitions between SIMULATION and REALITY modes.
 */

import { RealityModeManager, RealityModeType } from '../../services/simulation/reality-mode-manager.js';
// We use string literals instead of the actual FlowType enum to avoid reference issues
import { quantumGlossary } from '../../services/qrn/quantum-glossary.js';

// Mock dependencies with proper FlowType enum that matches quantum-glossary.js
jest.mock('../../services/qrn/quantum-glossary.js', () => ({
  quantumGlossary: {
    recordFlowMetric: jest.fn(),
    decohere: jest.fn(),
  },
  FlowType: {
    // Full system alignment
    FLOW: 'FLOW',
    // System misalignment or error
    ANTIFLOW: 'ANTIFLOW',
    // Partial system alignment
    PARTIAL_FLOW: 'PARTIAL_FLOW',
    // Reality/production operations
    REAL: 'REAL',
    // Simulation/test operations
    SIMULATION: 'SIMULATION'
  }
}));

// Note: We no longer need to mock ChronosDateHandler as reality-mode-manager.ts now uses native Date() 
// This aligns with our implementation change where we replaced all instances of ChronosDateHandler.now()
// with native Date() objects for proper reality mode handling

describe('RealityModeManager', () => {
  let realityModeManager: RealityModeManager;
  
  beforeEach(() => {
    // Reset mocks
    jest.clearAllMocks();
    
    // Get the singleton instance
    realityModeManager = RealityModeManager.getInstance();
  });

  describe('Initialization', () => {
    it('should initialize with SIMULATION mode by default', () => {
      const mode = realityModeManager.getCurrentMode();
      expect(mode).toBe('SIMULATION');
    });

    it('should be a singleton', () => {
      const instance1 = RealityModeManager.getInstance();
      const instance2 = RealityModeManager.getInstance();
      expect(instance1).toBe(instance2);
    });
    
    it('should format messages with SIMULATION context tag by default', () => {
      const message = 'Test message without tag';
      const formattedMessage = realityModeManager.formatWithContextTag(message);
      expect(formattedMessage).toBe('[CONTEXT: SIMULATION] Test message without tag');
    });
    
    it('should not add context tag if message already has one', () => {
      const simulationMessage = '[CONTEXT: SIMULATION] Already tagged message';
      const realityMessage = '[CONTEXT: REALITY] Already tagged message';
      
      expect(realityModeManager.formatWithContextTag(simulationMessage)).toBe(simulationMessage);
      expect(realityModeManager.formatWithContextTag(realityMessage)).toBe(realityMessage);
    });
  });

  describe('Transition Protocol', () => {
    it('should initiate a transition request', () => {
      const transitionId = realityModeManager.initiateTransitionRequest({
        requestedMode: 'REALITY',
        requestedBy: 'test-user',
        reason: 'Testing transition to REALITY mode'
      });
      
      expect(transitionId).toBeDefined();
      expect(typeof transitionId).toBe('string');
      
      // Should record flow metric
      expect(quantumGlossary.recordFlowMetric).toHaveBeenCalledWith(
        'SIMULATION', // Use string version to avoid FlowType property issues
        'reality_mode_transition_initiated',
        1,
        expect.objectContaining({
          transitionId,
          from: 'SIMULATION',
          to: 'REALITY',
          requestedBy: 'test-user'
        })
      );
      
      // Should have an ongoing transition
      const ongoingTransition = realityModeManager.getOngoingTransition();
      expect(ongoingTransition).not.toBeNull();
      expect(ongoingTransition?.transitionId).toBe(transitionId);
      expect(ongoingTransition?.request.requestedMode).toBe('REALITY');
      expect(ongoingTransition?.transitionCompleted).toBe(false);
    });
    
    it('should reject a second transition request when one is in progress', () => {
      // Initiate first transition
      realityModeManager.initiateTransitionRequest({
        requestedMode: 'REALITY',
        requestedBy: 'test-user',
        reason: 'Testing transition to REALITY mode'
      });
      
      // Attempt second transition
      expect(() => {
        realityModeManager.initiateTransitionRequest({
          requestedMode: 'REALITY',
          requestedBy: 'test-user',
          reason: 'Another transition'
        });
      }).toThrow(/already in progress/);
    });
    
    it('should record primary confirmation', () => {
      // Initiate transition
      const transitionId = realityModeManager.initiateTransitionRequest({
        requestedMode: 'REALITY',
        requestedBy: 'test-user',
        reason: 'Testing transition to REALITY mode'
      });
      
      // Record primary confirmation
      realityModeManager.recordPrimaryConfirmation(transitionId, {
        confirmedBy: 'test-user',
        confirmationText: 'I UNDERSTAND THE CONSEQUENCES OF ENABLING REALITY MODE'
      });
      
      // Check that confirmation was recorded
      const ongoingTransition = realityModeManager.getOngoingTransition();
      expect(ongoingTransition?.primaryConfirmation).toBeDefined();
      expect(ongoingTransition?.primaryConfirmation?.confirmedBy).toBe('test-user');
      expect(ongoingTransition?.primaryConfirmation?.confirmationText).toBe(
        'I UNDERSTAND THE CONSEQUENCES OF ENABLING REALITY MODE'
      );
    });
    
    it('should reject primary confirmation with incorrect confirmation text', () => {
      // Initiate transition
      const transitionId = realityModeManager.initiateTransitionRequest({
        requestedMode: 'REALITY',
        requestedBy: 'test-user',
        reason: 'Testing transition to REALITY mode'
      });
      
      // Attempt confirmation with wrong text
      expect(() => {
        realityModeManager.recordPrimaryConfirmation(transitionId, {
          confirmedBy: 'test-user',
          confirmationText: 'Yes, I understand'
        });
      }).toThrow(/Invalid confirmation text/);
    });
    
    it('should record authorization after primary confirmation', async () => {
      // Initiate transition
      const transitionId = realityModeManager.initiateTransitionRequest({
        requestedMode: 'REALITY',
        requestedBy: 'test-user',
        reason: 'Testing transition to REALITY mode'
      });
      
      // Record primary confirmation
      realityModeManager.recordPrimaryConfirmation(transitionId, {
        confirmedBy: 'test-user',
        confirmationText: 'I UNDERSTAND THE CONSEQUENCES OF ENABLING REALITY MODE'
      });
      
      // Record authorization
      realityModeManager.recordAuthorization(transitionId, {
        authorizedBy: 'admin-user',
        twoFactorVerified: true
      });
      
      // Check that authorization was recorded
      const ongoingTransition = realityModeManager.getOngoingTransition();
      expect(ongoingTransition?.authorization).toBeDefined();
      expect(ongoingTransition?.authorization?.authorizedBy).toBe('admin-user');
      expect(ongoingTransition?.authorization?.twoFactorVerified).toBe(true);
    });
    
    it('should reject authorization without primary confirmation', () => {
      // Initiate transition
      const transitionId = realityModeManager.initiateTransitionRequest({
        requestedMode: 'REALITY',
        requestedBy: 'test-user',
        reason: 'Testing transition to REALITY mode'
      });
      
      // Attempt authorization without primary confirmation
      expect(() => {
        realityModeManager.recordAuthorization(transitionId, {
          authorizedBy: 'admin-user',
          twoFactorVerified: true
        });
      }).toThrow(/before primary confirmation/);
    });
    
    it('should record secondary confirmation from a different user', () => {
      // Initiate transition
      const transitionId = realityModeManager.initiateTransitionRequest({
        requestedMode: 'REALITY',
        requestedBy: 'test-user',
        reason: 'Testing transition to REALITY mode'
      });
      
      // Record primary confirmation
      realityModeManager.recordPrimaryConfirmation(transitionId, {
        confirmedBy: 'test-user',
        confirmationText: 'I UNDERSTAND THE CONSEQUENCES OF ENABLING REALITY MODE'
      });
      
      // Record authorization
      realityModeManager.recordAuthorization(transitionId, {
        authorizedBy: 'admin-user',
        twoFactorVerified: true
      });
      
      // Record secondary confirmation
      realityModeManager.recordSecondaryConfirmation(transitionId, {
        confirmedBy: 'second-user',
        confirmationText: 'I UNDERSTAND THE CONSEQUENCES OF ENABLING REALITY MODE'
      });
      
      // Check that secondary confirmation was recorded
      const ongoingTransition = realityModeManager.getOngoingTransition();
      expect(ongoingTransition?.secondaryConfirmation).toBeDefined();
      expect(ongoingTransition?.secondaryConfirmation?.confirmedBy).toBe('second-user');
    });
    
    it('should reject secondary confirmation from the same user as primary', () => {
      // Initiate transition
      const transitionId = realityModeManager.initiateTransitionRequest({
        requestedMode: 'REALITY',
        requestedBy: 'test-user',
        reason: 'Testing transition to REALITY mode'
      });
      
      // Record primary confirmation
      realityModeManager.recordPrimaryConfirmation(transitionId, {
        confirmedBy: 'test-user',
        confirmationText: 'I UNDERSTAND THE CONSEQUENCES OF ENABLING REALITY MODE'
      });
      
      // Record authorization
      realityModeManager.recordAuthorization(transitionId, {
        authorizedBy: 'admin-user',
        twoFactorVerified: true
      });
      
      // Attempt secondary confirmation from same user
      expect(() => {
        realityModeManager.recordSecondaryConfirmation(transitionId, {
          confirmedBy: 'test-user',
          confirmationText: 'I UNDERSTAND THE CONSEQUENCES OF ENABLING REALITY MODE'
        });
      }).toThrow(/different user/);
    });
    
    it('should perform system readiness check after secondary confirmation', async () => {
      // Initiate transition
      const transitionId = realityModeManager.initiateTransitionRequest({
        requestedMode: 'REALITY',
        requestedBy: 'test-user',
        reason: 'Testing transition to REALITY mode'
      });
      
      // Record primary confirmation
      realityModeManager.recordPrimaryConfirmation(transitionId, {
        confirmedBy: 'test-user',
        confirmationText: 'I UNDERSTAND THE CONSEQUENCES OF ENABLING REALITY MODE'
      });
      
      // Record authorization
      realityModeManager.recordAuthorization(transitionId, {
        authorizedBy: 'admin-user',
        twoFactorVerified: true
      });
      
      // Record secondary confirmation
      realityModeManager.recordSecondaryConfirmation(transitionId, {
        confirmedBy: 'second-user',
        confirmationText: 'I UNDERSTAND THE CONSEQUENCES OF ENABLING REALITY MODE'
      });
      
      // Perform readiness check
      const readinessResults = await realityModeManager.performReadinessCheck(transitionId);
      
      expect(readinessResults.systemReady).toBe(true);
      expect(readinessResults.criticalComponentsOperational).toBe(true);
      expect(readinessResults.agentsReady).toBe(true);
      
      // Check that readiness check was recorded
      const ongoingTransition = realityModeManager.getOngoingTransition();
      expect(ongoingTransition?.readinessCheck).toBeDefined();
      expect(ongoingTransition?.readinessCheck?.systemReady).toBe(true);
    });
    
    it('should complete transition after successful readiness check', async () => {
      // Initiate transition
      const transitionId = realityModeManager.initiateTransitionRequest({
        requestedMode: 'REALITY',
        requestedBy: 'test-user',
        reason: 'Testing transition to REALITY mode'
      });
      
      // Record primary confirmation
      realityModeManager.recordPrimaryConfirmation(transitionId, {
        confirmedBy: 'test-user',
        confirmationText: 'I UNDERSTAND THE CONSEQUENCES OF ENABLING REALITY MODE'
      });
      
      // Record authorization
      realityModeManager.recordAuthorization(transitionId, {
        authorizedBy: 'admin-user',
        twoFactorVerified: true
      });
      
      // Record secondary confirmation
      realityModeManager.recordSecondaryConfirmation(transitionId, {
        confirmedBy: 'second-user',
        confirmationText: 'I UNDERSTAND THE CONSEQUENCES OF ENABLING REALITY MODE'
      });
      
      // Perform readiness check
      await realityModeManager.performReadinessCheck(transitionId);
      
      // Complete transition
      const finalMode = await realityModeManager.completeTransition(transitionId);
      
      expect(finalMode).toBe('REALITY');
      expect(realityModeManager.getCurrentMode()).toBe('REALITY');
      
      // Should have no ongoing transition
      expect(realityModeManager.getOngoingTransition()).toBeNull();
      
      // Should have a transition log
      const logs = realityModeManager.getTransitionLogs();
      expect(logs.length).toBe(1);
      expect(logs[0].transitionCompleted).toBe(true);
      expect(logs[0].finalMode).toBe('REALITY');
      
      // Should record flow metric
      expect(quantumGlossary.recordFlowMetric).toHaveBeenCalledWith(
        'REAL', // Use string version to avoid FlowType property issues
        'reality_mode_transition_completed',
        1,
        expect.objectContaining({
          transitionId,
          finalMode: 'REALITY',
        })
      );
    });
    
    it('should cancel an in-progress transition', () => {
      // Initiate transition
      const transitionId = realityModeManager.initiateTransitionRequest({
        requestedMode: 'REALITY',
        requestedBy: 'test-user',
        reason: 'Testing transition to REALITY mode'
      });
      
      // Cancel transition
      realityModeManager.cancelTransition(transitionId, 'Testing cancellation');
      
      // Should have no ongoing transition
      expect(realityModeManager.getOngoingTransition()).toBeNull();
      
      // Should have a transition log
      const logs = realityModeManager.getTransitionLogs();
      expect(logs.length).toBe(1);
      expect(logs[0].transitionCompleted).toBe(false);
      expect(logs[0].errors).toContain('Testing cancellation');
      
      // Should record flow metric
      expect(quantumGlossary.recordFlowMetric).toHaveBeenCalledWith(
        'ANTIFLOW', // Use string version to avoid FlowType property issues
        'reality_mode_transition_cancelled',
        0,
        expect.objectContaining({
          transitionId,
          reason: 'Testing cancellation',
          stage: 'request'
        })
      );
      
      // Mode should still be SIMULATION
      expect(realityModeManager.getCurrentMode()).toBe('SIMULATION');
    });
  });
  
  describe('Emergency Reversion', () => {
    it('should revert to SIMULATION mode from REALITY mode', async () => {
      // First transition to REALITY mode
      const transitionId = realityModeManager.initiateTransitionRequest({
        requestedMode: 'REALITY',
        requestedBy: 'test-user',
        reason: 'Testing transition to REALITY mode'
      });
      
      realityModeManager.recordPrimaryConfirmation(transitionId, {
        confirmedBy: 'test-user',
        confirmationText: 'I UNDERSTAND THE CONSEQUENCES OF ENABLING REALITY MODE'
      });
      
      realityModeManager.recordAuthorization(transitionId, {
        authorizedBy: 'admin-user',
        twoFactorVerified: true
      });
      
      realityModeManager.recordSecondaryConfirmation(transitionId, {
        confirmedBy: 'second-user',
        confirmationText: 'I UNDERSTAND THE CONSEQUENCES OF ENABLING REALITY MODE'
      });
      
      await realityModeManager.performReadinessCheck(transitionId);
      await realityModeManager.completeTransition(transitionId);
      
      // Now in REALITY mode
      expect(realityModeManager.getCurrentMode()).toBe('REALITY');
      
      // Perform emergency reversion
      realityModeManager.emergencyRevertToSimulation('security-admin', 'Security incident detected');
      
      // Should be back in SIMULATION mode
      expect(realityModeManager.getCurrentMode()).toBe('SIMULATION');
      
      // Should have two transition logs (original + emergency)
      const logs = realityModeManager.getTransitionLogs();
      expect(logs.length).toBe(2);
      expect(logs[1].request.reason).toContain('EMERGENCY REVERSION');
      expect(logs[1].request.requestedBy).toBe('security-admin');
      
      // Should record flow metric
      expect(quantumGlossary.recordFlowMetric).toHaveBeenCalledWith(
        'SIMULATION', // Use string version to avoid FlowType property issues
        'emergency_reality_mode_reversion',
        1,
        expect.objectContaining({
          triggeredBy: 'security-admin',
          reason: 'Security incident detected'
        })
      );
    });
    
    it('should do nothing if already in SIMULATION mode', () => {
      // Already in SIMULATION mode
      expect(realityModeManager.getCurrentMode()).toBe('SIMULATION');
      
      // Record flow metrics calls before
      const callsBefore = (quantumGlossary.recordFlowMetric as jest.Mock).mock.calls.length;
      
      // Attempt emergency reversion
      realityModeManager.emergencyRevertToSimulation('security-admin', 'Security incident detected');
      
      // Should still be in SIMULATION mode
      expect(realityModeManager.getCurrentMode()).toBe('SIMULATION');
      
      // Should not have recorded any new flow metrics
      const callsAfter = (quantumGlossary.recordFlowMetric as jest.Mock).mock.calls.length;
      expect(callsAfter).toBe(callsBefore);
    });
  });
  
  describe('Callbacks', () => {
    it('should notify callbacks when mode changes', async () => {
      // Create a mock callback
      const callback = jest.fn();
      
      // Register the callback
      realityModeManager.registerModeChangeCallback(callback);
      
      // Perform a transition
      const transitionId = realityModeManager.initiateTransitionRequest({
        requestedMode: 'REALITY',
        requestedBy: 'test-user',
        reason: 'Testing transition to REALITY mode'
      });
      
      realityModeManager.recordPrimaryConfirmation(transitionId, {
        confirmedBy: 'test-user',
        confirmationText: 'I UNDERSTAND THE CONSEQUENCES OF ENABLING REALITY MODE'
      });
      
      realityModeManager.recordAuthorization(transitionId, {
        authorizedBy: 'admin-user',
        twoFactorVerified: true
      });
      
      realityModeManager.recordSecondaryConfirmation(transitionId, {
        confirmedBy: 'second-user',
        confirmationText: 'I UNDERSTAND THE CONSEQUENCES OF ENABLING REALITY MODE'
      });
      
      await realityModeManager.performReadinessCheck(transitionId);
      await realityModeManager.completeTransition(transitionId);
      
      // Callback should have been called
      expect(callback).toHaveBeenCalledWith('REALITY');
      
      // Reset mock
      callback.mockClear();
      
      // Perform emergency reversion
      realityModeManager.emergencyRevertToSimulation('security-admin', 'Security incident detected');
      
      // Callback should have been called again
      expect(callback).toHaveBeenCalledWith('SIMULATION');
    });
    
    it('should handle errors in callbacks gracefully', async () => {
      // Create a callback that throws an error
      const callback = jest.fn().mockImplementation(() => {
        throw new Error('Test error in callback');
      });
      
      // Register the callback
      realityModeManager.registerModeChangeCallback(callback);
      
      // Perform a transition
      const transitionId = realityModeManager.initiateTransitionRequest({
        requestedMode: 'REALITY',
        requestedBy: 'test-user',
        reason: 'Testing transition to REALITY mode'
      });
      
      realityModeManager.recordPrimaryConfirmation(transitionId, {
        confirmedBy: 'test-user',
        confirmationText: 'I UNDERSTAND THE CONSEQUENCES OF ENABLING REALITY MODE'
      });
      
      realityModeManager.recordAuthorization(transitionId, {
        authorizedBy: 'admin-user',
        twoFactorVerified: true
      });
      
      realityModeManager.recordSecondaryConfirmation(transitionId, {
        confirmedBy: 'second-user',
        confirmationText: 'I UNDERSTAND THE CONSEQUENCES OF ENABLING REALITY MODE'
      });
      
      await realityModeManager.performReadinessCheck(transitionId);
      
      // This should not throw, despite the callback throwing
      await expect(realityModeManager.completeTransition(transitionId)).resolves.toBe('REALITY');
      
      // Callback should have been called
      expect(callback).toHaveBeenCalled();
    });
  });
});