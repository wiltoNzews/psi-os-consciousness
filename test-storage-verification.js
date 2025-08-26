/**
 * Simple verification test for storage implementations
 * 
 * This script directly tests the storage switch mechanism by using the
 * existing storage instances from db.ts and running simple operations.
 */

import { fileURLToPath } from 'url';
import path from 'path';
import fs from 'fs/promises';

// Get the directory name using ESM-compatible approach
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Define test data directory
const TEST_DIR = path.join(__dirname, 'test-data');

// Run the verification
runVerification();

async function runVerification() {
  console.log("=== STORAGE IMPLEMENTATION VERIFICATION ===");
  
  try {
    // Create test directory if it doesn't exist
    await fs.mkdir(TEST_DIR, { recursive: true });
    console.log(`✓ Test directory created: ${TEST_DIR}`);
    
    // Import the db module that contains our storage instances and switch
    console.log("Importing storage instances from db.ts...");
    const dbModule = await import('./server/db.ts');
    const { storage, memStorage, fileStorage } = dbModule;
    
    console.log("✓ Successfully imported storage instances from db.js");
    
    // Test task creation in both implementations
    const testTaskId = `test-task-${Date.now()}`;
    const testTask = {
      id: testTaskId,
      name: "Test Task",
      description: "Task created for storage verification",
      status: "pending",
      priority: 1,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    // Save task in memory storage
    console.log("\nTesting MemStorage implementation...");
    await memStorage.saveTask(testTask);
    const memRetrievedTask = await memStorage.loadTask(testTaskId);
    
    if (memRetrievedTask) {
      console.log("✓ MemStorage: Task created and retrieved successfully");
      console.log(JSON.stringify(memRetrievedTask, null, 2));
    } else {
      throw new Error("MemStorage task creation failed");
    }
    
    // Save task in file storage
    console.log("\nTesting FileSystemStorage implementation...");
    await fileStorage.saveTask({...testTask, id: `${testTaskId}-fs`});
    const fileRetrievedTask = await fileStorage.loadTask(`${testTaskId}-fs`);
    
    if (fileRetrievedTask) {
      console.log("✓ FileSystemStorage: Task created and retrieved successfully");
      console.log(JSON.stringify(fileRetrievedTask, null, 2));
    } else {
      throw new Error("FileSystemStorage task creation failed");
    }
    
    // Verify the environment-based storage switch
    console.log("\nVerifying environment-based storage switch...");
    
    // Determine which storage implementation should be used
    const expectedType = process.env.NODE_ENV === 'production'
      ? 'FileSystemStorage'
      : 'MemStorage';
    
    // Verify we're using the correct storage implementation
    console.log(`Current NODE_ENV: ${process.env.NODE_ENV || 'development'}`);
    console.log(`Expected storage type: ${expectedType}`);
    console.log(`Actual storage constructor: ${storage.constructor.name}`);
    
    if (storage.constructor.name.includes(expectedType)) {
      console.log("✓ Environment-based storage selection working correctly");
    } else {
      throw new Error(`Storage switch incorrect: expected ${expectedType}, got ${storage.constructor.name}`);
    }
    
    // Clean up test data
    console.log("\nCleaning up test data...");
    await memStorage.deleteTask(testTaskId);
    await fileStorage.deleteTask(`${testTaskId}-fs`);
    console.log("✓ Test data cleaned up");
    
    console.log("\n✅ STORAGE VERIFICATION PASSED");
    
  } catch (error) {
    console.error("\n❌ STORAGE VERIFICATION FAILED");
    console.error(`Error: ${error.message}`);
    if (error.stack) {
      console.error(error.stack);
    }
  }
}