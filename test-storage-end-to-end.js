/**
 * End-to-end test for the storage system
 * 
 * This script tests the storage implementation with MemStorage,
 * performing a full task creation, retrieval, update, and deletion cycle.
 */

// Use ES module imports
import { fileURLToPath } from 'url';
import path from 'path';
import { MemStorage } from './server/storage.js';

// Get the directory name using ESM-compatible approach
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Create a new MemStorage instance for testing
const storage = new MemStorage();

console.log('Using new MemStorage instance for testing');

async function runEndToEndTest() {
  console.log('\n--- STORAGE END-TO-END TEST ---\n');
  
  try {
    // Get current storage type
    const storageType = process.env.NODE_ENV === 'production' ? 'FileSystemStorage' : 'MemStorage';
    console.log(`Using ${storageType} for this test`);
    
    // Create a unique task ID for testing
    const taskId = `e2e-test-task-${Date.now()}`;
    
    // 1. Create a task
    console.log('\nStep 1: Creating a test task...');
    const taskToCreate = {
      id: taskId,
      name: 'E2E Test Task',
      description: 'This is a test task created for end-to-end verification',
      status: 'pending',
      priority: 2,
      createdAt: new Date(),
      updatedAt: new Date(),
      metadata: {
        testRun: true,
        environment: process.env.NODE_ENV || 'development'
      }
    };
    
    await storage.saveTask(taskToCreate);
    console.log(`✓ Task created successfully with ID: ${taskId}`);
    
    // 2. Retrieve the task
    console.log('\nStep 2: Retrieving the task...');
    const retrievedTask = await storage.loadTask(taskId);
    
    if (retrievedTask) {
      console.log('✓ Task retrieved successfully:');
      console.log(JSON.stringify(retrievedTask, null, 2));
    } else {
      throw new Error('Failed to retrieve task');
    }
    
    // 3. Create subtasks
    console.log('\nStep 3: Creating subtasks...');
    const subtasks = [
      {
        id: `${taskId}-subtask-1`,
        name: 'E2E Subtask 1',
        description: 'First subtask for end-to-end testing',
        status: 'pending',
        priority: 1,
        taskId: taskId,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: `${taskId}-subtask-2`,
        name: 'E2E Subtask 2',
        description: 'Second subtask for end-to-end testing',
        status: 'pending',
        priority: 2,
        taskId: taskId,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ];
    
    await storage.saveSubTasks(taskId, subtasks);
    console.log(`✓ ${subtasks.length} subtasks created successfully`);
    
    // 4. Retrieve subtasks
    console.log('\nStep 4: Retrieving subtasks...');
    const retrievedSubtasks = await storage.loadSubTasks(taskId);
    
    if (retrievedSubtasks && retrievedSubtasks.length > 0) {
      console.log(`✓ ${retrievedSubtasks.length} subtasks retrieved successfully:`);
      console.log(JSON.stringify(retrievedSubtasks, null, 2));
    } else {
      throw new Error('Failed to retrieve subtasks');
    }
    
    // 5. Delete the task (which should also delete subtasks)
    console.log('\nStep 5: Deleting the task...');
    const deleteResult = await storage.deleteTask(taskId);
    
    if (deleteResult) {
      console.log('✓ Task deleted successfully');
    } else {
      throw new Error('Failed to delete task');
    }
    
    // 6. Verify task deletion
    console.log('\nStep 6: Verifying task deletion...');
    const deletedTask = await storage.loadTask(taskId);
    
    if (!deletedTask) {
      console.log('✓ Task deletion confirmed');
    } else {
      throw new Error('Task was not properly deleted');
    }
    
    // 7. Verify subtask deletion
    console.log('\nStep 7: Verifying subtask deletion...');
    const deletedSubtasks = await storage.loadSubTasks(taskId);
    
    if (!deletedSubtasks || deletedSubtasks.length === 0) {
      console.log('✓ Subtask deletion confirmed');
    } else {
      throw new Error('Subtasks were not properly deleted');
    }
    
    // Test completed successfully
    console.log('\n✅ END-TO-END TEST PASSED');
    console.log(`Storage type used: ${storageType}`);
    
  } catch (error) {
    console.error('\n❌ END-TO-END TEST FAILED');
    console.error(`Error: ${error.message}`);
    if (error.stack) {
      console.error(error.stack);
    }
  }
}

// Run the end-to-end test
runEndToEndTest();