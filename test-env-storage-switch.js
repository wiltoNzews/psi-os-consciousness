/**
 * Test Script to verify environment-based storage selection with Quantum Glossary integration
 * 
 * This script validates that the storage switch correctly selects 
 * FileSystemStorage in production and MemStorage in other environments,
 * and that the Quantum Glossary properly tags log messages with the environment context.
 */

import { storage, memStorage, fileStorage } from './server/db.js';
import quantumGlossary from './server/services/qrn/quantum-glossary.js';

async function testStorageEnvironmentSwitch() {
  console.log('=== ENVIRONMENT-BASED STORAGE SWITCH TEST ===');
  
  // Check which storage implementation is being used
  const currentEnv = process.env.NODE_ENV || 'development';
  console.log(`Current NODE_ENV: ${currentEnv}`);
  
  // Use Quantum Glossary to get operating context
  const context = quantumGlossary.getOperatingContext();
  console.log(`Quantum Glossary context: ${context}`);
  
  // Log with environment tagging
  console.log(quantumGlossary.tagWithContext('Testing storage implementation selection'));
  
  if (storage === memStorage) {
    console.log(quantumGlossary.tagWithContext('Using MemStorage for primary storage (development/test environment)'));
  } else if (storage === fileStorage) {
    console.log(quantumGlossary.tagWithContext('Using FileSystemStorage for primary storage (production environment)'));
  } else {
    console.log(quantumGlossary.tagWithContext('Using unknown storage implementation!'));
  }
  
  // Simple task storage test
  try {
    const task = {
      id: 'env-test-task-' + Date.now(),
      name: 'Environment Test Task',
      description: 'Testing task storage in different environments',
      status: 'pending',
      priority: 1,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    console.log(quantumGlossary.tagWithContext(`Creating test task with ID: ${task.id}`));
    await storage.saveTask(task);
    
    console.log(quantumGlossary.tagWithContext('Loading test task...'));
    const loadedTask = await storage.loadTask(task.id);
    
    if (loadedTask) {
      console.log(quantumGlossary.tagWithContext('Successfully loaded task:'));
      console.log(loadedTask);
    } else {
      console.log(quantumGlossary.tagWithContext('Failed to load task!'));
    }
    
    // Cleanup
    console.log(quantumGlossary.tagWithContext('Cleaning up test task...'));
    await storage.deleteTask(task.id);
    console.log(quantumGlossary.tagWithContext('Test task deleted.'));
  } catch (error) {
    console.error(quantumGlossary.tagWithContext('Error in storage test:'), error);
  }
  
  console.log('=== ENVIRONMENT-BASED STORAGE SWITCH TEST COMPLETE ===');
}

// Run the test
testStorageEnvironmentSwitch().catch(error => {
  console.error('Error running storage switch test:', error);
});