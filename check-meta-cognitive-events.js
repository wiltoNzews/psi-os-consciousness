/**
 * Script to verify meta-cognitive events
 * 
 * This script checks if meta-cognitive events are properly stored
 * in the system and displays details about them.
 * 
 * [QUANTUM_STATE: SIM_FLOW]
 */

import { storage } from './server/storage.js';

async function checkEvents() {
  try {
    console.log('Checking meta-cognitive events in storage...');
    
    // Get all events
    const events = await storage.getAllMetaCognitiveEvents();
    console.log(`Found ${events.length} meta-cognitive events.`);
    
    if (events.length === 0) {
      console.log('No events found. Please import events first.');
      return;
    }
    
    // Count events by type
    const eventTypes = {};
    events.forEach(event => {
      eventTypes[event.type] = (eventTypes[event.type] || 0) + 1;
    });
    
    console.log('\nEvent types:');
    Object.entries(eventTypes).forEach(([type, count]) => {
      console.log(`  ${type}: ${count}`);
    });
    
    // Count events by node
    const nodeIds = {};
    events.forEach(event => {
      const nodeId = event.nodeId || 'unknown';
      nodeIds[nodeId] = (nodeIds[nodeId] || 0) + 1;
    });
    
    console.log('\nNode IDs:');
    Object.entries(nodeIds).forEach(([nodeId, count]) => {
      console.log(`  ${nodeId}: ${count}`);
    });
    
    // Display the first 3 events
    console.log('\nSample events:');
    for (let i = 0; i < Math.min(3, events.length); i++) {
      console.log(`\nEvent ${i+1}:`);
      console.log({
        id: events[i].id,
        nodeId: events[i].nodeId,
        type: events[i].type,
        description: events[i].description,
        createdAt: events[i].createdAt,
        impact: events[i].impact,
        confidence: events[i].confidence
      });
    }
  } catch (error) {
    console.error('Error checking events:', error);
  }
}

// Execute the check
checkEvents().catch(console.error);