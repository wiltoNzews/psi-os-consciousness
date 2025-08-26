/**
 * Test script for FileSystemStorage task methods
 * 
 * This script tests the basic CRUD operations for tasks and subtasks in the FileSystemStorage class.
 * It applies the TSAR BOMBA verification approach with explicit testing after each operation.
 */

import { fileStorage } from './server/db.ts';
// Note: This script should be run with tsx, e.g.: npx tsx test-file-system-storage.js

// Use the already created fileStorage instance
const storage = fileStorage;

// Test function to run all verifications
async function runVerification() {
  console.log('Starting FileSystemStorage task methods verification...');
  
  // Create a unique task ID for this test run
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  const taskId = `test-task-${timestamp}`;
  
  try {
    // Step 1: Create a new task
    console.log('\nStep 1: Creating a test task...');
    await storage.saveTask({
      id: taskId,
      name: 'Test Task',
      description: 'This is a test task created for verification',
      status: 'pending',
      metadata: { testRun: true, createdAt: new Date() }
    });
    console.log('✓ Task created successfully');
    
    // Step 2: Verify the task was saved by retrieving it
    console.log('\nStep 2: Retrieving the task...');
    const task = await storage.loadTask(taskId);
    if (!task) {
      throw new Error('Task was not found after saving');
    }
    console.log('✓ Task retrieved successfully:');
    console.log(JSON.stringify(task, null, 2));
    
    // Step 3: Create subtasks for the task
    console.log('\nStep 3: Creating subtasks...');
    const subTasks = [
      {
        name: 'Subtask 1',
        taskId: taskId,
        status: 'pending',
        metadata: { order: 1 }
      },
      {
        name: 'Subtask 2',
        taskId: taskId,
        status: 'pending',
        metadata: { order: 2 }
      }
    ];
    await storage.saveSubTasks(taskId, subTasks);
    console.log('✓ Subtasks created successfully');
    
    // Step 4: Verify the subtasks were saved by retrieving them
    console.log('\nStep 4: Retrieving subtasks...');
    const retrievedSubTasks = await storage.loadSubTasks(taskId);
    if (!retrievedSubTasks || retrievedSubTasks.length !== 2) {
      throw new Error('Subtasks were not found or count mismatch after saving');
    }
    console.log('✓ Subtasks retrieved successfully:');
    console.log(JSON.stringify(retrievedSubTasks, null, 2));
    
    // Step 5: List all tasks
    console.log('\nStep 5: Listing all tasks...');
    const allTasks = await storage.getAllTasks();
    console.log(`✓ Found ${allTasks.length} tasks in total`);
    
    // Step 6: Delete the task and its subtasks
    console.log('\nStep 6: Deleting the task...');
    const deleteResult = await storage.deleteTask(taskId);
    if (!deleteResult) {
      throw new Error('Task deletion failed');
    }
    console.log('✓ Task deleted successfully');
    
    // Step 7: Verify the task was deleted
    console.log('\nStep 7: Verifying task deletion...');
    const deletedTask = await storage.loadTask(taskId);
    if (deletedTask) {
      throw new Error('Task still exists after deletion');
    }
    console.log('✓ Task confirmed deleted');
    
    // Step 8: Verify subtasks were deleted
    console.log('\nStep 8: Verifying subtasks deletion...');
    const deletedSubTasks = await storage.loadSubTasks(taskId);
    if (deletedSubTasks && deletedSubTasks.length > 0) {
      throw new Error('Subtasks still exist after deletion');
    }
    console.log('✓ Subtasks confirmed deleted');
    
    console.log('\nAll verifications completed successfully ✓');
  } catch (error) {
    console.error('Verification failed:', error);
  }
}

// Run the verification
runVerification().catch(error => {
  console.error('Unhandled error during verification:', error);
});