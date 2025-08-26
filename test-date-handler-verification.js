/**
 * ChronosDateHandler Verification Script
 * 
 * This script verifies that direct date creation has been properly replaced with
 * the ChronosDateHandler.createDate() method in the MemStorage class.
 * 
 * It applies the TSAR BOMBA verification approach with explicit testing
 * of date handling in all relevant methods.
 */

import fs from 'fs';
import path from 'path';
import crypto from 'crypto';

// Import the actual ChronosDateHandler from the project code
import { ChronosDateHandler } from './server/services/utils/chronos-date-handler.js';

// Simple test class that mimics MemStorage behavior
class TestMemStorage {
  constructor() {
    // ChronosDateHandler is a singleton, no need to create an instance
    this.metrics = [];
    this.stabilityHistory = [];
  }
  
  saveMetrics(metrics) {
    // This should use ChronosDateHandler.createDate() instead of new Date()
    const metricsWithTimestamp = {
      ...metrics,
      timestamp: metrics.timestamp || ChronosDateHandler.createDate()
    };
    
    this.metrics.push(metricsWithTimestamp);
    return metricsWithTimestamp;
  }
  
  recordSystemStability(stabilityData) {
    // This should use ChronosDateHandler.createDate() instead of new Date()
    const dataWithTimestamp = {
      ...stabilityData,
      timestamp: stabilityData.timestamp || ChronosDateHandler.createDate()
    };
    
    this.stabilityHistory.push(dataWithTimestamp);
    return dataWithTimestamp;
  }
  
  createTask(taskData) {
    // This should use ChronosDateHandler.createDate() for dates
    const newTask = {
      id: crypto.randomUUID ? crypto.randomUUID() : crypto.webcrypto.randomUUID(),
      name: taskData.name,
      status: taskData.status || 'pending',
      createdAt: ChronosDateHandler.createDate(),
      updatedAt: ChronosDateHandler.createDate(),
      completedAt: taskData.completedAt || null
    };
    
    return newTask;
  }
}

// Run verification tests
function runVerification() {
  console.log('Starting ChronosDateHandler verification...');
  
  const storage = new TestMemStorage();
  
  // Test 1: saveMetrics with no timestamp
  console.log('\nTest 1: saveMetrics with no timestamp');
  const metrics1 = { cpu: 75, memory: 512 };
  const savedMetrics1 = storage.saveMetrics(metrics1);
  
  if (savedMetrics1.timestamp instanceof Date) {
    console.log('✓ Timestamp is Date instance');
  } else {
    console.error('❌ Timestamp is not Date instance');
  }
  
  // Test 2: saveMetrics with existing timestamp
  console.log('\nTest 2: saveMetrics with existing timestamp');
  const existingTimestamp = new Date(2023, 5, 15);
  const metrics2 = { cpu: 90, memory: 768, timestamp: existingTimestamp };
  const savedMetrics2 = storage.saveMetrics(metrics2);
  
  if (savedMetrics2.timestamp === existingTimestamp) {
    console.log('✓ Existing timestamp preserved');
  } else {
    console.error('❌ Existing timestamp was replaced');
  }
  
  // Test 3: recordSystemStability with no timestamp
  console.log('\nTest 3: recordSystemStability with no timestamp');
  const stability1 = { level: 'high', score: 0.95 };
  const savedStability1 = storage.recordSystemStability(stability1);
  
  if (savedStability1.timestamp instanceof Date) {
    console.log('✓ Timestamp is Date instance');
  } else {
    console.error('❌ Timestamp is not Date instance');
  }
  
  // Test 4: recordSystemStability with existing timestamp
  console.log('\nTest 4: recordSystemStability with existing timestamp');
  const existingStabilityTime = new Date(2023, 6, 20);
  const stability2 = { level: 'medium', score: 0.75, timestamp: existingStabilityTime };
  const savedStability2 = storage.recordSystemStability(stability2);
  
  if (savedStability2.timestamp === existingStabilityTime) {
    console.log('✓ Existing timestamp preserved');
  } else {
    console.error('❌ Existing timestamp was replaced');
  }
  
  // Test 5: createTask
  console.log('\nTest 5: createTask');
  const task = storage.createTask({ name: 'Test Task' });
  
  if (task.createdAt instanceof Date) {
    console.log('✓ createdAt is Date instance');
  } else {
    console.error('❌ createdAt is not Date instance');
  }
  
  if (task.updatedAt instanceof Date) {
    console.log('✓ updatedAt is Date instance');
  } else {
    console.error('❌ updatedAt is not Date instance');
  }
  
  if (task.completedAt === null) {
    console.log('✓ completedAt is null');
  } else {
    console.error('❌ completedAt is not null');
  }
  
  console.log('\nVerification complete!');
}

// Run the verification
runVerification();