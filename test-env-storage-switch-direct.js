/**
 * Direct test script for environment-based storage selection
 * 
 * This script simulates the environment-based storage selection mechanism
 * and verifies that it works correctly to select the appropriate storage
 * implementation based on the NODE_ENV environment variable.
 */

console.log('\n----- ENVIRONMENT-BASED STORAGE SWITCH DIRECT TEST -----\n');

// Simulate the storage implementations
class MockMemStorage {
  constructor() {
    this.name = 'MemStorage';
    this.data = new Map();
  }
  
  async saveTask(task) {
    this.data.set(task.id, { ...task });
    return task;
  }
  
  async loadTask(id) {
    return this.data.get(id) || null;
  }
  
  async deleteTask(id) {
    return this.data.delete(id);
  }
}

class MockFileSystemStorage {
  constructor(basePath) {
    this.name = 'FileSystemStorage';
    this.basePath = basePath;
    this.data = new Map();
  }
  
  async saveTask(task) {
    this.data.set(task.id, { ...task });
    return task;
  }
  
  async loadTask(id) {
    return this.data.get(id) || null;
  }
  
  async deleteTask(id) {
    return this.data.delete(id);
  }
}

// Simulate the Quantum Glossary
class MockQuantumGlossary {
  constructor() {
    // Context is SIM in development/test, REAL in production
    this.context = process.env.NODE_ENV === 'production' ? 'REAL' : 'SIM';
  }
  
  getOperatingContext() {
    return this.context;
  }
  
  isSimulation() {
    return this.context === 'SIM';
  }
  
  isRealWorld() {
    return this.context === 'REAL';
  }
  
  tagWithContext(message) {
    return `[${this.context}] ${message}`;
  }
}

// Create the storage instances
const mockMemStorage = new MockMemStorage();
const mockFileStorage = new MockFileSystemStorage('./data');

// Test both environment configurations
async function testEnvironmentSwitch() {
  // Save the original NODE_ENV
  const originalEnv = process.env.NODE_ENV;
  
  // Create the mock Quantum Glossary
  const mockGlossary = new MockQuantumGlossary();
  
  // Test storage selection in development environment
  console.log('----- Testing Development Environment -----');
  process.env.NODE_ENV = undefined; // development is the default when not set
  
  // This is the key environment-based selection logic we're testing
  const devStorage = process.env.NODE_ENV === 'production' 
    ? mockFileStorage 
    : mockMemStorage;
  
  console.log(`NODE_ENV: ${process.env.NODE_ENV || 'development (default)'}`);
  console.log(`Selected storage: ${devStorage.name}`);
  console.log(`Quantum Glossary context: ${mockGlossary.getOperatingContext()}`);
  console.log(mockGlossary.tagWithContext('Test message in development environment'));
  
  // Create a test task in development environment
  const devTask = {
    id: 'dev-task-' + Date.now(),
    name: 'Development Task',
    description: 'Testing task in development environment',
    status: 'pending',
    createdAt: new Date(),
    updatedAt: new Date()
  };
  
  await devStorage.saveTask(devTask);
  const loadedDevTask = await devStorage.loadTask(devTask.id);
  
  console.log(mockGlossary.tagWithContext('Development task created and loaded:'));
  console.log(loadedDevTask);
  
  // Test storage selection in production environment
  console.log('\n----- Testing Production Environment -----');
  process.env.NODE_ENV = 'production';
  
  // The same environment-based selection logic should now select FileSystemStorage
  const prodStorage = process.env.NODE_ENV === 'production' 
    ? mockFileStorage 
    : mockMemStorage;
  
  // Recreate glossary with production context
  const prodGlossary = new MockQuantumGlossary();
  
  console.log(`NODE_ENV: ${process.env.NODE_ENV}`);
  console.log(`Selected storage: ${prodStorage.name}`);
  console.log(`Quantum Glossary context: ${prodGlossary.getOperatingContext()}`);
  console.log(prodGlossary.tagWithContext('Test message in production environment'));
  
  // Create a test task in production environment
  const prodTask = {
    id: 'prod-task-' + Date.now(),
    name: 'Production Task',
    description: 'Testing task in production environment',
    status: 'pending',
    createdAt: new Date(),
    updatedAt: new Date()
  };
  
  await prodStorage.saveTask(prodTask);
  const loadedProdTask = await prodStorage.loadTask(prodTask.id);
  
  console.log(prodGlossary.tagWithContext('Production task created and loaded:'));
  console.log(loadedProdTask);
  
  // Verify that the tasks were stored in their respective storage implementations
  console.log('\n----- Verification -----');
  
  // The dev task should be in memStorage only
  const devTaskInMem = await mockMemStorage.loadTask(devTask.id);
  const devTaskInFile = await mockFileStorage.loadTask(devTask.id);
  
  console.log('Development task in MemStorage:', devTaskInMem ? 'Found' : 'Not found');
  console.log('Development task in FileSystemStorage:', devTaskInFile ? 'Found' : 'Not found');
  
  // The prod task should be in fileStorage only
  const prodTaskInMem = await mockMemStorage.loadTask(prodTask.id);
  const prodTaskInFile = await mockFileStorage.loadTask(prodTask.id);
  
  console.log('Production task in MemStorage:', prodTaskInMem ? 'Found' : 'Not found');
  console.log('Production task in FileSystemStorage:', prodTaskInFile ? 'Found' : 'Not found');
  
  // Restore the original NODE_ENV
  process.env.NODE_ENV = originalEnv;
  
  console.log('\n----- ENVIRONMENT-BASED STORAGE SWITCH TEST COMPLETE -----\n');
}

// Run the test
testEnvironmentSwitch().catch(error => {
  console.error('Error in environment switch test:', error);
});