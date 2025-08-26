/**
 * Test script for FileSystemStorage task methods
 * 
 * This script tests the basic CRUD operations for tasks and subtasks in the FileSystemStorage class.
 * It applies the TSAR BOMBA verification approach with explicit testing after each operation.
 */

import { fileStorage } from './server/db.js';
import { InsertTask, InsertSubTask } from './shared/schema-minimal.js';

// Use the exported fileStorage instance
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
    const taskToSave: InsertTask = {
      id: taskId,
      name: 'Test Task',
      description: 'This is a test task created for verification',
      status: 'pending',
      priority: 1,
      metadata: { testRun: true, createdAt: new Date() }
    };
    console.log(`Saving task with ID: ${taskId}, name: ${taskToSave.name}`);
    await storage.saveTask(taskToSave);
    console.log('✓ Task created successfully');
    
    // Let's check what files are in the tasks directory
    const fs = await import('node:fs/promises');
    const path = await import('node:path');
    const tasksDir = './data/tasks';
    
    // List files in the tasks directory
    try {
      const files = await fs.readdir(tasksDir);
      console.log(`Files in tasks directory: ${files.join(', ')}`);
    } catch (err) {
      console.error(`Error reading tasks directory: ${err}`);
    }
    
    // Step 2: Verify the task was saved by retrieving it
    console.log('\nStep 2: Retrieving the task...');
    console.log(`Attempting to load task with ID: ${taskId}`);
    const task = await storage.loadTask(taskId);
    console.log(`Task load result: ${task ? 'Found' : 'Not found'}`);
    if (!task) {
      throw new Error('Task was not found after saving');
    }
    console.log('✓ Task retrieved successfully:');
    console.log(JSON.stringify(task, null, 2));
    
    // Step 3: Create subtasks for the task
    console.log('\nStep 3: Creating subtasks...');
    const subTasks: InsertSubTask[] = [
      {
        id: `subtask-1-${timestamp}`,
        parentId: taskId,
        name: 'Subtask 1',
        description: 'This is the first subtask',
        status: 'pending',
        priority: 1
      },
      {
        id: `subtask-2-${timestamp}`,
        parentId: taskId,
        name: 'Subtask 2',
        description: 'This is the second subtask',
        status: 'pending',
        priority: 2
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
    
    // Step 5: List all tasks - commenting out since it's not in the interface
    console.log('\nStep 5: Skipping listing all tasks (not implemented in current interface)...');
    // const allTasks = await storage.getAllTasks();
    // console.log(`✓ Found ${allTasks.length} tasks in total`);
    console.log('✓ Skipped listing all tasks');
    
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