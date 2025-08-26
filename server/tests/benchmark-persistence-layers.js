/**
 * Persistence Layer Benchmarking Script
 * 
 * This script performs direct comparison benchmarks between the FileSystemPersistenceLayer
 * and InMemoryPersistenceLayer implementations to quantify performance improvements.
 * 
 * [α/S+/📊] Performance Benchmarking Module
 */

import fs from 'fs';
import path from 'path';
import { performance } from 'perf_hooks';

// Import utilities for symbolic logging
import { systemLogger, DomainEmoji } from '../utils/symbolic-logger.js';

// Create a directory for benchmark results
const BENCHMARK_DIR = path.join(process.cwd(), 'benchmark-results');
if (!fs.existsSync(BENCHMARK_DIR)) {
  fs.mkdirSync(BENCHMARK_DIR, { recursive: true });
}

// Create a simple in-memory persistence layer for benchmarking
class InMemoryPersistenceLayer {
  constructor() {
    this.storage = new Map();
    console.log('[α/S+/💾] InMemoryPersistenceLayer initialized for benchmarking');
  }
  
  async save(key, data) {
    // Deep clone to simulate serialization
    this.storage.set(key, JSON.parse(JSON.stringify(data)));
    return Promise.resolve();
  }
  
  async load(key) {
    const data = this.storage.get(key);
    return Promise.resolve(data ? JSON.parse(JSON.stringify(data)) : null);
  }
  
  async delete(key) {
    const existed = this.storage.has(key);
    this.storage.delete(key);
    return Promise.resolve(existed);
  }
  
  async getKeys(prefix) {
    const keys = [];
    for (const key of this.storage.keys()) {
      if (!prefix || key.startsWith(prefix)) {
        keys.push(key);
      }
    }
    return Promise.resolve(keys);
  }
  
  getSize() {
    return this.storage.size;
  }
  
  clear() {
    this.storage.clear();
    return Promise.resolve();
  }
}

// Simple file-based persistence layer for benchmarking
class FileSystemPersistenceLayer {
  constructor(baseDir) {
    this.baseDir = baseDir || path.join(process.cwd(), 'benchmark-data');
    if (!fs.existsSync(this.baseDir)) {
      fs.mkdirSync(this.baseDir, { recursive: true });
    }
    console.log(`[α/S+/💾] FileSystemPersistenceLayer initialized in ${this.baseDir}`);
  }
  
  async save(key, data) {
    const filePath = path.join(this.baseDir, `${key}.json`);
    const serializedData = JSON.stringify(data, null, 2);
    await fs.promises.writeFile(filePath, serializedData, 'utf8');
    return Promise.resolve();
  }
  
  async load(key) {
    const filePath = path.join(this.baseDir, `${key}.json`);
    try {
      const data = await fs.promises.readFile(filePath, 'utf8');
      return Promise.resolve(JSON.parse(data));
    } catch (error) {
      if (error.code === 'ENOENT') {
        return Promise.resolve(null);
      }
      throw error;
    }
  }
  
  async delete(key) {
    const filePath = path.join(this.baseDir, `${key}.json`);
    try {
      await fs.promises.unlink(filePath);
      return Promise.resolve(true);
    } catch (error) {
      if (error.code === 'ENOENT') {
        return Promise.resolve(false);
      }
      throw error;
    }
  }
  
  async getKeys(prefix) {
    const files = await fs.promises.readdir(this.baseDir);
    const keys = files
      .filter(file => file.endsWith('.json'))
      .map(file => file.replace(/\.json$/, ''));
    
    if (prefix) {
      return keys.filter(key => key.startsWith(prefix));
    }
    return keys;
  }
  
  async clear() {
    const files = await fs.promises.readdir(this.baseDir);
    for (const file of files) {
      if (file.endsWith('.json')) {
        await fs.promises.unlink(path.join(this.baseDir, file));
      }
    }
    return Promise.resolve();
  }
}

// Benchmark configuration - reduced for quicker execution
const benchmarkConfig = {
  smallPayload: { 
    itemCount: 50, 
    dataSize: 'small',
    description: 'Small objects (100 bytes) in moderate quantity'
  },
  mediumPayload: { 
    itemCount: 20, 
    dataSize: 'medium',
    description: 'Medium objects (5KB) in moderate quantity'
  },
  largePayload: { 
    itemCount: 5, 
    dataSize: 'large',
    description: 'Large objects (50KB) with complex nesting'
  },
  manySmallPayloads: { 
    itemCount: 100, 
    dataSize: 'small',
    description: 'Many small objects to test scaling'
  },
  saveLoadCycle: { 
    itemCount: 20, 
    dataSize: 'medium',
    cycles: 3,
    description: 'Repeated save/load cycles to test caching effects'
  }
};

// Generate test data of different sizes
function generateTestData(size, index) {
  const baseData = {
    id: `test-${index}`,
    timestamp: new Date(),
    tags: ['benchmark', 'test', size]
  };
  
  if (size === 'small') {
    return {
      ...baseData,
      value: Math.random(),
      name: `Small Test Object ${index}`
    };
  }
  
  if (size === 'medium') {
    // Generate medium-sized object (~5KB)
    const items = [];
    for (let i = 0; i < 50; i++) {
      items.push({
        id: `item-${i}`,
        value: Math.random(),
        name: `Item ${i}`,
        active: i % 2 === 0,
        metadata: {
          created: new Date(),
          category: i % 3,
          priority: (i % 5) + 1
        }
      });
    }
    
    return {
      ...baseData,
      name: `Medium Test Object ${index}`,
      description: 'A medium-sized test object for benchmarking persistence layers',
      items,
      stats: {
        totalItems: items.length,
        activeItems: items.filter(item => item.active).length,
        averagePriority: items.reduce((sum, item) => sum + item.priority, 0) / items.length
      }
    };
  }
  
  if (size === 'large') {
    // Generate large object (~50KB) with deeper nesting
    const sections = [];
    for (let s = 0; s < 10; s++) {
      const items = [];
      for (let i = 0; i < 50; i++) {
        const subItems = [];
        for (let j = 0; j < 10; j++) {
          subItems.push({
            id: `subitem-${s}-${i}-${j}`,
            value: Math.random(),
            name: `Subitem ${j}`,
            status: ['pending', 'active', 'completed', 'archived'][j % 4],
            metadata: {
              created: new Date(),
              tags: ['tag1', 'tag2', 'tag3', 'tag4', 'tag5'].slice(0, (j % 5) + 1),
              attributes: {
                color: ['red', 'green', 'blue', 'yellow', 'purple'][j % 5],
                shape: ['circle', 'square', 'triangle', 'hexagon'][j % 4],
                size: ['small', 'medium', 'large', 'xlarge'][j % 4]
              }
            }
          });
        }
        
        items.push({
          id: `item-${s}-${i}`,
          value: Math.random(),
          name: `Item ${i}`,
          active: i % 2 === 0,
          subitems: subItems,
          metadata: {
            created: new Date(),
            category: i % 5,
            priority: (i % 5) + 1,
            tags: ['benchmark', 'test', 'complex', 'nested', 'large'].slice(0, (i % 5) + 1)
          }
        });
      }
      
      sections.push({
        id: `section-${s}`,
        name: `Section ${s}`,
        description: `A test section ${s} with multiple items and subitems`,
        items,
        stats: {
          totalItems: items.length,
          totalSubitems: items.reduce((sum, item) => sum + item.subitems.length, 0),
          averagePriority: items.reduce((sum, item) => sum + item.metadata.priority, 0) / items.length
        }
      });
    }
    
    return {
      ...baseData,
      name: `Large Test Object ${index}`,
      description: 'A large, complex test object with deep nesting for benchmarking persistence layers',
      sections,
      stats: {
        totalSections: sections.length,
        totalItems: sections.reduce((sum, section) => sum + section.items.length, 0),
        totalSubitems: sections.reduce((sum, section) => {
          return sum + section.items.reduce((itemSum, item) => itemSum + item.subitems.length, 0);
        }, 0)
      },
      metadata: {
        created: new Date(),
        lastModified: new Date(),
        version: '1.0.0',
        author: 'Benchmark System',
        environment: process.env.NODE_ENV || 'development',
        system: {
          platform: process.platform,
          nodeVersion: process.version
        }
      }
    };
  }
  
  // Default fallback
  return baseData;
}

// Benchmark a single operation
async function benchmarkOperation(persistenceLayer, operation, config) {
  const { itemCount, dataSize } = config;
  const results = {
    operation,
    dataSize,
    itemCount,
    totalTimeMs: 0,
    averageTimeMs: 0,
    minTimeMs: Infinity,
    maxTimeMs: 0
  };
  
  // Generate test data
  const testData = [];
  for (let i = 0; i < itemCount; i++) {
    testData.push(generateTestData(dataSize, i));
  }
  
  // Warm up - We'll ignore the first few operations
  if (operation === 'save' || operation === 'saveLoad') {
    for (let i = 0; i < Math.min(5, itemCount); i++) {
      await persistenceLayer.save(`warmup-${i}`, testData[i]);
      if (operation === 'saveLoad') {
        await persistenceLayer.load(`warmup-${i}`);
      }
    }
  } else if (operation === 'load') {
    for (let i = 0; i < Math.min(5, itemCount); i++) {
      await persistenceLayer.save(`benchmark-${i}`, testData[i]);
    }
    for (let i = 0; i < Math.min(5, itemCount); i++) {
      await persistenceLayer.load(`benchmark-${i}`);
    }
  } else if (operation === 'getKeys') {
    for (let i = 0; i < Math.min(5, itemCount); i++) {
      await persistenceLayer.save(`benchmark-${i}`, testData[i]);
    }
    await persistenceLayer.getKeys();
  } else if (operation === 'saveLoadCycle') {
    // Special case for save-load cycles
    const cycles = config.cycles || 5;
    for (let i = 0; i < Math.min(3, itemCount); i++) {
      for (let j = 0; j < Math.min(2, cycles); j++) {
        await persistenceLayer.save(`cycle-${i}-${j}`, testData[i]);
        await persistenceLayer.load(`cycle-${i}-${j}`);
      }
    }
  }
  
  // Wait briefly to ensure warmup is complete
  await new Promise(resolve => setTimeout(resolve, 100));
  
  // Run the benchmark
  try {
    const times = [];
    
    // Different operations require different benchmarking approaches
    if (operation === 'save') {
      // Benchmark save operations
      for (let i = 0; i < itemCount; i++) {
        const start = performance.now();
        await persistenceLayer.save(`benchmark-${i}`, testData[i]);
        const end = performance.now();
        times.push(end - start);
      }
    } else if (operation === 'load') {
      // Ensure data is saved first
      for (let i = 0; i < itemCount; i++) {
        await persistenceLayer.save(`benchmark-${i}`, testData[i]);
      }
      
      // Benchmark load operations
      for (let i = 0; i < itemCount; i++) {
        const start = performance.now();
        await persistenceLayer.load(`benchmark-${i}`);
        const end = performance.now();
        times.push(end - start);
      }
    } else if (operation === 'getKeys') {
      // Ensure data is saved first
      for (let i = 0; i < itemCount; i++) {
        await persistenceLayer.save(`benchmark-${i}`, testData[i]);
      }
      
      // Benchmark getKeys operations
      for (let i = 0; i < 20; i++) { // Run getKeys multiple times for better benchmark
        const start = performance.now();
        await persistenceLayer.getKeys();
        const end = performance.now();
        times.push(end - start);
      }
    } else if (operation === 'saveLoad') {
      // Benchmark combined save-load operations
      for (let i = 0; i < itemCount; i++) {
        const startSave = performance.now();
        await persistenceLayer.save(`benchmark-${i}`, testData[i]);
        const endSave = performance.now();
        
        const startLoad = performance.now();
        await persistenceLayer.load(`benchmark-${i}`);
        const endLoad = performance.now();
        
        times.push((endSave - startSave) + (endLoad - startLoad));
      }
    } else if (operation === 'saveLoadCycle') {
      // Benchmark repeated save/load cycles
      const cycles = config.cycles || 5;
      for (let i = 0; i < itemCount; i++) {
        let totalTime = 0;
        for (let j = 0; j < cycles; j++) {
          const startSave = performance.now();
          await persistenceLayer.save(`cycle-${i}-${j}`, testData[i]);
          const endSave = performance.now();
          
          const startLoad = performance.now();
          await persistenceLayer.load(`cycle-${i}-${j}`);
          const endLoad = performance.now();
          
          totalTime += (endSave - startSave) + (endLoad - startLoad);
        }
        times.push(totalTime / cycles); // Average time per cycle
      }
    }
    
    // Calculate benchmark metrics
    results.totalTimeMs = times.reduce((sum, time) => sum + time, 0);
    results.averageTimeMs = results.totalTimeMs / times.length;
    results.minTimeMs = Math.min(...times);
    results.maxTimeMs = Math.max(...times);
    
    // Calculate operations per second
    results.opsPerSecond = 1000 / results.averageTimeMs;
    
    return results;
  } catch (error) {
    console.error(`Error in benchmark operation ${operation}:`, error);
    return {
      ...results,
      error: error.message
    };
  } finally {
    // Clean up
    await persistenceLayer.clear();
  }
}

// Run all benchmarks for a persistence layer
async function runBenchmarks(persistenceLayer, name) {
  console.log(`\n[α/S+/📊] Running benchmarks for ${name}...`);
  
  const results = {
    name,
    timestamp: new Date(),
    operations: {}
  };
  
  // Standard operations
  const operations = ['save', 'load', 'getKeys', 'saveLoad'];
  
  for (const [configName, config] of Object.entries(benchmarkConfig)) {
    console.log(`\n[α/S+/📊] Benchmark: ${configName} - ${config.description}`);
    
    results[configName] = {};
    
    if (configName === 'saveLoadCycle') {
      // Special case for saveLoadCycle
      const cycleResults = await benchmarkOperation(persistenceLayer, 'saveLoadCycle', config);
      results[configName]['saveLoadCycle'] = cycleResults;
      
      console.log(`  • Operation: saveLoadCycle`);
      console.log(`    - Average time: ${cycleResults.averageTimeMs.toFixed(2)}ms`);
      console.log(`    - Operations/sec: ${cycleResults.opsPerSecond.toFixed(2)}`);
    } else {
      // Standard operations
      for (const operation of operations) {
        const operationResults = await benchmarkOperation(persistenceLayer, operation, config);
        results[configName][operation] = operationResults;
        
        console.log(`  • Operation: ${operation}`);
        console.log(`    - Average time: ${operationResults.averageTimeMs.toFixed(2)}ms`);
        console.log(`    - Operations/sec: ${operationResults.opsPerSecond.toFixed(2)}`);
      }
    }
  }
  
  return results;
}

// Compare benchmark results
function compareResults(memoryResults, fileResults) {
  console.log('\n[α/S+/📊] BENCHMARK COMPARISON RESULTS\n');
  console.log('==================================================');
  console.log('InMemoryPersistenceLayer vs FileSystemPersistenceLayer');
  console.log('==================================================\n');
  
  const comparison = {
    summary: {
      timestamp: new Date(),
      memoryLayerName: memoryResults.name,
      fileLayerName: fileResults.name
    },
    details: {}
  };
  
  for (const configName of Object.keys(benchmarkConfig)) {
    console.log(`\n📊 ${configName.toUpperCase()} - ${benchmarkConfig[configName].description}`);
    console.log('--------------------------------------------------');
    
    comparison.details[configName] = {};
    
    const memoryConfig = memoryResults[configName];
    const fileConfig = fileResults[configName];
    
    if (!memoryConfig || !fileConfig) {
      console.log('  Missing benchmark data for this configuration');
      continue;
    }
    
    const operations = Object.keys(memoryConfig);
    
    for (const operation of operations) {
      const memoryOp = memoryConfig[operation];
      const fileOp = fileConfig[operation];
      
      if (!memoryOp || !fileOp) {
        console.log(`  Missing benchmark data for ${operation} operation`);
        continue;
      }
      
      const speedup = fileOp.averageTimeMs / memoryOp.averageTimeMs;
      const opsRatio = memoryOp.opsPerSecond / fileOp.opsPerSecond;
      
      comparison.details[configName][operation] = {
        memoryAverageTimeMs: memoryOp.averageTimeMs,
        fileAverageTimeMs: fileOp.averageTimeMs,
        memoryOpsPerSecond: memoryOp.opsPerSecond,
        fileOpsPerSecond: fileOp.opsPerSecond,
        speedupFactor: speedup,
        opsRatio: opsRatio
      };
      
      console.log(`  ${operation.padEnd(10)} | Memory: ${memoryOp.averageTimeMs.toFixed(2).padStart(7)}ms | File: ${fileOp.averageTimeMs.toFixed(2).padStart(7)}ms | Speedup: ${speedup.toFixed(2).padStart(5)}x`);
    }
  }
  
  // Calculate overall averages
  const speedups = [];
  const opsRatios = [];
  
  for (const configName in comparison.details) {
    for (const operation in comparison.details[configName]) {
      speedups.push(comparison.details[configName][operation].speedupFactor);
      opsRatios.push(comparison.details[configName][operation].opsRatio);
    }
  }
  
  const avgSpeedup = speedups.reduce((sum, val) => sum + val, 0) / speedups.length;
  const avgOpsRatio = opsRatios.reduce((sum, val) => sum + val, 0) / opsRatios.length;
  
  comparison.summary.averageSpeedup = avgSpeedup;
  comparison.summary.averageOpsRatio = avgOpsRatio;
  
  console.log('\n==================================================');
  console.log(`OVERALL RESULTS:`);
  console.log(`--------------------------------------------------`);
  console.log(`📈 Average Speedup: ${avgSpeedup.toFixed(2)}x faster with InMemoryPersistenceLayer`);
  console.log(`📈 Average Operations/sec Improvement: ${avgOpsRatio.toFixed(2)}x more operations per second`);
  console.log('==================================================\n');
  
  return comparison;
}

// Save benchmark results to files
function saveBenchmarkResults(memoryResults, fileResults, comparison) {
  const timestamp = new Date().toISOString().replace(/:/g, '-');
  
  // Save individual benchmark results
  fs.writeFileSync(
    path.join(BENCHMARK_DIR, `memory-persistence-${timestamp}.json`), 
    JSON.stringify(memoryResults, null, 2)
  );
  
  fs.writeFileSync(
    path.join(BENCHMARK_DIR, `file-persistence-${timestamp}.json`), 
    JSON.stringify(fileResults, null, 2)
  );
  
  // Save comparison results
  fs.writeFileSync(
    path.join(BENCHMARK_DIR, `persistence-comparison-${timestamp}.json`), 
    JSON.stringify(comparison, null, 2)
  );
  
  // Save summary to a more readable format
  const summaryText = `
BENCHMARK COMPARISON SUMMARY
===========================
Date: ${new Date().toISOString()}

InMemoryPersistenceLayer vs FileSystemPersistenceLayer
---------------------------------------------------

Overall Speedup: ${comparison.summary.averageSpeedup.toFixed(2)}x faster with InMemoryPersistenceLayer
Operations/sec Improvement: ${comparison.summary.averageOpsRatio.toFixed(2)}x more operations per second

DETAILED RESULTS
---------------
${Object.keys(comparison.details).map(configName => {
  return `
${configName.toUpperCase()} - ${benchmarkConfig[configName].description}
${'-'.repeat(50)}
${Object.keys(comparison.details[configName]).map(operation => {
  const detail = comparison.details[configName][operation];
  return `  ${operation.padEnd(10)} | Memory: ${detail.memoryAverageTimeMs.toFixed(2).padStart(7)}ms | File: ${detail.fileAverageTimeMs.toFixed(2).padStart(7)}ms | Speedup: ${detail.speedupFactor.toFixed(2).padStart(5)}x`;
}).join('\n')}
`;
}).join('\n')}
`;

  fs.writeFileSync(
    path.join(BENCHMARK_DIR, `benchmark-summary-${timestamp}.txt`), 
    summaryText
  );
  
  fs.writeFileSync(
    path.join(process.cwd(), 'benchmark-results.json'), 
    JSON.stringify(comparison, null, 2)
  );
  
  fs.writeFileSync(
    path.join(process.cwd(), 'benchmark-summary.txt'), 
    summaryText
  );
  
  console.log(`\n[α/S+/📊] Benchmark results saved to:`);
  console.log(`  • ${path.join(BENCHMARK_DIR, `persistence-comparison-${timestamp}.json`)}`);
  console.log(`  • ${path.join(BENCHMARK_DIR, `benchmark-summary-${timestamp}.txt`)}`);
  console.log(`  • ${path.join(process.cwd(), 'benchmark-results.json')}`);
  console.log(`  • ${path.join(process.cwd(), 'benchmark-summary.txt')}`);
}

// Main benchmark execution
async function runAllBenchmarks() {
  console.log('\n[α/S+/📊] STARTING PERSISTENCE LAYER BENCHMARKS\n');
  
  // Create persistence layers
  const memoryPersistence = new InMemoryPersistenceLayer();
  const filePersistence = new FileSystemPersistenceLayer(path.join(BENCHMARK_DIR, 'file-data'));
  
  try {
    // Run benchmarks for both persistence layers
    const memoryResults = await runBenchmarks(memoryPersistence, 'InMemoryPersistenceLayer');
    const fileResults = await runBenchmarks(filePersistence, 'FileSystemPersistenceLayer');
    
    // Compare results
    const comparison = compareResults(memoryResults, fileResults);
    
    // Save benchmark results
    saveBenchmarkResults(memoryResults, fileResults, comparison);
    
    console.log('\n[α/S+/📊] BENCHMARK COMPLETED SUCCESSFULLY\n');
    
    return {
      memoryResults,
      fileResults,
      comparison
    };
  } catch (error) {
    console.error(`\n[α/S-/🚫] BENCHMARK ERROR: ${error.message}\n`);
    console.error(error);
  } finally {
    // Clean up
    await memoryPersistence.clear();
    await filePersistence.clear();
  }
}

// Run the benchmarks
runAllBenchmarks().catch(err => {
  console.error('Error running benchmarks:', err);
});