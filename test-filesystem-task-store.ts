/**
 * Test script for FileSystemTaskStore
 * 
 * This script tests the CRUD operations for tasks and subtasks in the FileSystemTaskStore class.
 */

import { FileSystemTaskStore, Task, SubTask } from './src/server/services/task/file-system-task-store';
import * as fs from 'fs/promises';
import * as path from 'path';

// Create a test directory path
const TEST_DIR = './test-task-data';

// Clean up the test directory to ensure a clean test environment
async function cleanupTestDirectory() {
  try {
    await fs.rm(TEST_DIR, { recursive: true, force: true });
    console.log(`Test directory ${TEST_DIR} cleaned up`);
  } catch (error) {
    console.error(`Error cleaning up test directory: ${error.message}`);
  }
}

// Run verification of task store methods
async function runVerification() {
  console.log('Starting FileSystemTaskStore verification...');
  
  // Create a unique task ID for this test run
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  const taskId = `test-task-${timestamp}`;
  
  // Create a storage instance for testing
  const taskStore = new FileSystemTaskStore(TEST_DIR);
  
  try {
    // Ensure test directory exists
    await fs.mkdir(TEST_DIR, { recursive: true });
    
    // Step 1: Create a new task
    console.log('\nStep 1: Creating a test task...');
    const taskToSave: Task = {
      id: taskId,
      name: 'Test Task',
      description: 'This is a test task created for verification',
      status: 'pending',
      priority: 1,
      createdAt: new Date(),
      updatedAt: new Date(),
      metadata: { testRun: true }
    };
    
    await taskStore.saveTask(taskToSave);
    console.log('✓ Task created successfully');
    
    // Step 2: Verify the task was saved by retrieving it
    console.log('\nStep 2: Retrieving the task...');
    const task = await taskStore.getTask(taskId);
    if (!task) {
      throw new Error('Task was not found after saving');
    }
    console.log('✓ Task retrieved successfully:');
    console.log(JSON.stringify(task, null, 2));
    
    // Step 3: Create subtasks for the task
    console.log('\nStep 3: Creating subtasks...');
    const subTasks: SubTask[] = [
      {
        id: `${taskId}-subtask-1`,
        parentId: taskId,
        name: 'Subtask 1',
        description: 'This is the first subtask',
        status: 'pending',
        priority: 1,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: `${taskId}-subtask-2`,
        parentId: taskId,
        name: 'Subtask 2',
        description: 'This is the second subtask',
        status: 'pending',
        priority: 2,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ];
    await taskStore.saveSubTasks(taskId, subTasks);
    console.log('✓ Subtasks created successfully');
    
    // Step 4: Verify the subtasks were saved by retrieving them
    console.log('\nStep 4: Retrieving subtasks...');
    const retrievedSubTasks = await taskStore.getSubTasks(taskId);
    if (!retrievedSubTasks || retrievedSubTasks.length !== 2) {
      throw new Error('Subtasks were not found or count mismatch after saving');
    }
    console.log('✓ Subtasks retrieved successfully:');
    console.log(JSON.stringify(retrievedSubTasks, null, 2));
    
    // Step 5: List all tasks
    console.log('\nStep 5: Listing all tasks...');
    const allTasks = await taskStore.getAllTasks();
    console.log(`✓ Found ${allTasks.length} tasks in total`);
    
    // Step 6: Delete the task
    console.log('\nStep 6: Deleting the task...');
    const deleteResult = await taskStore.deleteTask(taskId);
    if (!deleteResult) {
      throw new Error('Task deletion failed');
    }
    console.log('✓ Task deleted successfully');
    
    // Step 7: Verify the task was deleted
    console.log('\nStep 7: Verifying task deletion...');
    const deletedTask = await taskStore.getTask(taskId);
    if (deletedTask) {
      throw new Error('Task still exists after deletion');
    }
    console.log('✓ Task confirmed deleted');
    
    console.log('\nAll verifications completed successfully ✓');
  } catch (error) {
    console.error('Verification failed:', error);
  } finally {
    // Clean up the test directory
    await cleanupTestDirectory();
  }
}

// Run the verification
runVerification().catch(error => {
  console.error('Unhandled error during verification:', error);
  cleanupTestDirectory();
});