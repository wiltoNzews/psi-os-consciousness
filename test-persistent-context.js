/**
 * Test script for MemPersistentContextService
 * 
 * This script directly tests persistence functionality by creating a session,
 * adding data, and verifying it's correctly persisted.
 */

// Import the persistentContextService directly using the full ES module path
import { persistentContextService } from './server/db.ts';

async function testMemPersistentContext() {
  try {
    // Create a test session
    const sessionId = 'test-session-' + Date.now();
    console.log('Creating new session:', sessionId);
    
    // Initialize session
    const ctx = await persistentContextService.initializeSession(sessionId);
    console.log('Session created with initial context:');
    console.log('- sessionId:', ctx.sessionId);
    console.log('- version:', ctx.version);
    console.log('- history count:', ctx.history.length);
    console.log('- lastUpdated:', ctx.lastUpdated);
    
    // Add a history chunk
    await persistentContextService.addHistoryChunk(sessionId, {
      id: 'chunk-1',
      content: 'Test history content',
      timestamp: new Date(),
      layer: 'STRATEGIC',
      importance: 5,
      source: 'test'
    });
    console.log('\nAdded history chunk to session');
    
    // Load the context and verify the history chunk was added
    const updated = await persistentContextService.loadContext(sessionId);
    console.log('\nLoaded updated context:');
    console.log('- sessionId:', updated.sessionId);
    console.log('- version:', updated.version);
    console.log('- history count:', updated.history.length);
    console.log('- lastUpdated:', updated.lastUpdated);
    console.log('- first history item content:', updated.history[0].content);
    
    // Add a meta insight
    await persistentContextService.addMetaInsight(sessionId, {
      id: 'insight-1',
      observation: 'Test meta insight',
      timestamp: new Date(),
      category: 'pattern',
      importance: 8,
      confidence: 0.9
    });
    console.log('\nAdded meta insight to session');
    
    // Load the context again and verify both items exist
    const finalContext = await persistentContextService.loadContext(sessionId);
    console.log('\nLoaded final context:');
    console.log('- sessionId:', finalContext.sessionId);
    console.log('- version:', finalContext.version);
    console.log('- history count:', finalContext.history.length);
    console.log('- metaInsights count:', finalContext.metaInsights.length);
    console.log('- lastUpdated:', finalContext.lastUpdated);
    
    console.log('\nTest completed successfully!');
  } catch (error) {
    console.error('Error during test:', error);
  }
}

// Run the test
testMemPersistentContext();