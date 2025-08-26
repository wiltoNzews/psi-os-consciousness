/**
 * Test for the formatWithContextTag method in RealityModeManager
 * 
 * This test verifies that the formatWithContextTag method correctly
 * adds the appropriate context tag ([CONTEXT: SIMULATION] or [CONTEXT: REALITY])
 * to messages, and does not duplicate tags if they are already present.
 */

import { RealityModeManager } from '../../services/simulation/reality-mode-manager.js';
import { beforeEach, describe, expect, it, jest } from '@jest/globals';

// Mock the quantum glossary dependency
jest.mock('../../services/qrn/quantum-glossary.js', () => ({
  recordFlowMetric: jest.fn(),
}));

describe('RealityModeManager.formatWithContextTag', () => {
  let realityModeManager: RealityModeManager;

  beforeEach(() => {
    // Reset mocks
    jest.clearAllMocks();
    
    // Get the singleton instance
    realityModeManager = RealityModeManager.getInstance();
  });

  it('should add SIMULATION context tag to messages by default', () => {
    const message = 'Test message without any context tag';
    const formattedMessage = realityModeManager.formatWithContextTag(message);
    expect(formattedMessage).toBe('[CONTEXT: SIMULATION] Test message without any context tag');
  });

  it('should not add context tag if message already has SIMULATION tag', () => {
    const message = '[CONTEXT: SIMULATION] Already tagged message';
    const formattedMessage = realityModeManager.formatWithContextTag(message);
    expect(formattedMessage).toBe(message);
  });

  it('should not add context tag if message already has REALITY tag', () => {
    const message = '[CONTEXT: REALITY] Already tagged message';
    const formattedMessage = realityModeManager.formatWithContextTag(message);
    expect(formattedMessage).toBe(message);
  });

  it('should add REALITY context tag when in REALITY mode', async () => {
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
    
    // Now test the formatting in REALITY mode
    const message = 'Test message in REALITY mode';
    const formattedMessage = realityModeManager.formatWithContextTag(message);
    expect(formattedMessage).toBe('[CONTEXT: REALITY] Test message in REALITY mode');

    // Clean up - return to SIMULATION mode for other tests
    realityModeManager.emergencyRevertToSimulation('test', 'Test cleanup');
  });
});