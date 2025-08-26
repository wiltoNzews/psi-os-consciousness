/**
 * Import Meta-Cognitive Events Script
 * 
 * This script imports the generated meta-cognitive events into the system via the API
 * for testing pattern detection and insight generation.
 * 
 * [QUANTUM_STATE: SIM_FLOW]
 */

import { promises as fs } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import axios from 'axios';

// Get the current file's directory
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configuration
const API_BASE = 'http://localhost:5000/api';
const EVENTS_FILE = path.join(__dirname, 'meta-cognitive-events.json');
const IMPORT_DELAY = 100; // ms between imports to avoid overwhelming the system

/**
 * Load events from the generated JSON file
 */
async function loadEventsFromFile() {
  console.log(`Loading events from ${EVENTS_FILE}...`);
  const data = await fs.readFile(EVENTS_FILE, 'utf8');
  const parsed = JSON.parse(data);
  return parsed;
}

/**
 * Import a single event via the API
 */
async function importEvent(event) {
  try {
    const response = await axios.post(`${API_BASE}/mc/events`, event);
    return {
      success: true,
      id: response.data.id,
      status: response.status
    };
  } catch (error) {
    console.error(`Error importing event ${event.id}:`, error.message);
    return {
      success: false,
      id: event.id,
      error: error.message
    };
  }
}

/**
 * Import all events with a delay between each
 */
async function importAllEvents(events) {
  console.log(`Starting import of ${events.length} events...`);
  
  const results = {
    successful: 0,
    failed: 0,
    details: []
  };
  
  for (let i = 0; i < events.length; i++) {
    const event = events[i];
    console.log(`Importing event ${i+1}/${events.length}: ${event.id} (${event.eventType})`);
    
    const result = await importEvent(event);
    results.details.push(result);
    
    if (result.success) {
      results.successful++;
    } else {
      results.failed++;
    }
    
    // Add a small delay to avoid overloading the API
    if (i < events.length - 1) {
      await new Promise(resolve => setTimeout(resolve, IMPORT_DELAY));
    }
  }
  
  return results;
}

/**
 * Main function to run the import
 */
async function run() {
  try {
    // Load the events file
    const { events, patterns, insights } = await loadEventsFromFile();
    
    // Import events first
    console.log(`Found ${events.length} events to import.`);
    const eventResults = await importAllEvents(events);
    
    // Print results
    console.log('\nImport Results:');
    console.log(`Successfully imported: ${eventResults.successful}/${events.length} events`);
    console.log(`Failed imports: ${eventResults.failed}`);
    
    if (eventResults.failed > 0) {
      console.log('\nFailed events:');
      eventResults.details
        .filter(r => !r.success)
        .forEach(r => console.log(`- ${r.id}: ${r.error}`));
    }
    
    console.log('\nImport complete!');
    console.log('Now you can test the meta-cognitive pattern detection in the system.');
    
  } catch (error) {
    console.error('Error during import process:', error);
  }
}

// Run the import
run().catch(error => {
  console.error('Unhandled error in import script:', error);
});