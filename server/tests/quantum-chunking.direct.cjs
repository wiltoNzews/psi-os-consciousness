/**
 * Direct execution test for Quantum-Level Chunking (IDDR)
 * 
 * This file uses CommonJS module format to avoid any ES module issues.
 * It can be executed directly with Node without using Jest or any testing framework.
 * 
 * The test validates the core Identify-Decompose-Distribute-Recompose paradigm
 * that forms the foundation of our neural-symbiotic architecture.
 */

// Simple implementation of the Quantum Chunking Engine
class QuantumChunkingEngine {
  constructor() {
    this.tasks = new Map();
    this.chunks = new Map();
    this.dependencies = new Map();
    this.nextChunkId = 1;
    this.processingQueue = [];
  }

  /**
   * Identify a task and prepare it for processing
   */
  identifyTask(taskId, taskData) {
    console.log(`[QCEngine] Identifying task: ${taskId}`);
    
    // Store task
    this.tasks.set(taskId, {
      id: taskId,
      data: taskData,
      status: 'identified',
      complexity: this._calculateComplexity(taskData),
      timestamp: new Date(),
      chunks: []
    });
    
    return this.tasks.get(taskId);
  }

  /**
   * Decompose a task into quantum chunks
   */
  decomposeTask(taskId) {
    console.log(`[QCEngine] Decomposing task: ${taskId}`);
    
    const task = this.tasks.get(taskId);
    if (!task) {
      throw new Error(`Task ${taskId} not found`);
    }
    
    // Mark task as decomposing
    task.status = 'decomposing';
    
    // Determine how many chunks to create based on complexity
    const chunkCount = this._estimateChunkCount(task.data);
    
    // Create chunks
    for (let i = 0; i < chunkCount; i++) {
      const chunkId = `chunk-${this.nextChunkId++}`;
      
      // Create chunk content based on slice of task data
      const content = typeof task.data === 'string' 
        ? this._sliceStringContent(task.data, i, chunkCount)
        : this._sliceObjectContent(task.data, i, chunkCount);
      
      // Store chunk
      this.chunks.set(chunkId, {
        id: chunkId,
        taskId: taskId,
        index: i,
        totalChunks: chunkCount,
        content: content,
        status: 'created',
        timestamp: new Date(),
        processedContent: null
      });
      
      // Add to task's chunks
      task.chunks.push(chunkId);
    }
    
    // Add dependencies between chunks if needed
    for (let i = 1; i < chunkCount; i++) {
      const dependentChunkId = task.chunks[i];
      const dependencyChunkId = task.chunks[i - 1];
      this._addDependency(dependentChunkId, dependencyChunkId);
    }
    
    // Mark task as decomposed
    task.status = 'decomposed';
    
    return task.chunks;
  }

  /**
   * Distribute chunks for processing
   */
  distributeChunks(taskId) {
    console.log(`[QCEngine] Distributing chunks for task: ${taskId}`);
    
    const task = this.tasks.get(taskId);
    if (!task) {
      throw new Error(`Task ${taskId} not found`);
    }
    
    // Mark task as distributing
    task.status = 'distributing';
    
    // Process all chunks without dependencies first
    for (const chunkId of task.chunks) {
      const chunk = this.chunks.get(chunkId);
      const dependencies = this.dependencies.get(chunkId) || [];
      
      // If no dependencies, can process immediately
      if (dependencies.length === 0) {
        this.processingQueue.push(chunkId);
        chunk.status = 'queued';
      }
    }
    
    // Mark task as distributed
    task.status = 'distributed';
    
    return {
      taskId: taskId,
      queuedChunks: this.processingQueue.length,
      totalChunks: task.chunks.length
    };
  }

  /**
   * Process a single chunk (simulated)
   */
  processChunk(chunkId) {
    console.log(`[QCEngine] Processing chunk: ${chunkId}`);
    
    const chunk = this.chunks.get(chunkId);
    if (!chunk) {
      throw new Error(`Chunk ${chunkId} not found`);
    }
    
    // Mark chunk as processing
    chunk.status = 'processing';
    
    // Simple processing - reverse the content (for demonstration)
    if (typeof chunk.content === 'string') {
      chunk.processedContent = chunk.content.split('').reverse().join('');
    } else {
      // For object content, just echo it back with a processed flag
      chunk.processedContent = {
        ...chunk.content,
        processed: true
      };
    }
    
    // Mark chunk as processed
    chunk.status = 'processed';
    
    // Remove from processing queue
    const queueIndex = this.processingQueue.indexOf(chunkId);
    if (queueIndex !== -1) {
      this.processingQueue.splice(queueIndex, 1);
    }
    
    // Check for chunks that were waiting on this one
    for (const [dependentId, dependencies] of this.dependencies.entries()) {
      if (dependencies.includes(chunkId)) {
        // Check if all dependencies are now satisfied
        const allDependenciesMet = dependencies.every(depId => {
          const depChunk = this.chunks.get(depId);
          return depChunk && depChunk.status === 'processed';
        });
        
        if (allDependenciesMet) {
          // Add to processing queue
          this.processingQueue.push(dependentId);
          const dependentChunk = this.chunks.get(dependentId);
          if (dependentChunk) {
            dependentChunk.status = 'queued';
          }
        }
      }
    }
    
    return chunk;
  }

  /**
   * Recompose chunks into a complete result
   */
  recomposeTask(taskId) {
    console.log(`[QCEngine] Recomposing task: ${taskId}`);
    
    const task = this.tasks.get(taskId);
    if (!task) {
      throw new Error(`Task ${taskId} not found`);
    }
    
    // Check if all chunks are processed
    const allChunksProcessed = task.chunks.every(chunkId => {
      const chunk = this.chunks.get(chunkId);
      return chunk && chunk.status === 'processed';
    });
    
    if (!allChunksProcessed) {
      throw new Error(`Cannot recompose task ${taskId} - not all chunks are processed`);
    }
    
    // Mark task as recomposing
    task.status = 'recomposing';
    
    // Gather all processed chunks in order
    const orderedChunks = task.chunks
      .map(chunkId => this.chunks.get(chunkId))
      .sort((a, b) => a.index - b.index);
    
    // Combine results based on content type
    let result;
    
    if (typeof orderedChunks[0].processedContent === 'string') {
      // String content - concatenate
      result = orderedChunks.map(chunk => chunk.processedContent).join('');
    } else {
      // Object content - combine
      result = {
        originalTaskId: taskId,
        results: orderedChunks.map(chunk => chunk.processedContent)
      };
    }
    
    // Mark task as complete
    task.status = 'completed';
    task.result = result;
    
    return {
      taskId: taskId,
      status: 'completed',
      result: result
    };
  }

  /**
   * Execute the full IDDR pipeline for a task
   */
  executeIDDR(taskId, taskData) {
    console.log(`[QCEngine] Executing IDDR pipeline for task: ${taskId}`);
    
    // Identify
    this.identifyTask(taskId, taskData);
    
    // Decompose
    this.decomposeTask(taskId);
    
    // Distribute
    this.distributeChunks(taskId);
    
    // Process all chunks
    const task = this.tasks.get(taskId);
    for (const chunkId of task.chunks) {
      this.processChunk(chunkId);
    }
    
    // Recompose
    return this.recomposeTask(taskId);
  }

  /**
   * Add a dependency between chunks
   * @private
   */
  _addDependency(dependentId, dependencyId) {
    if (!this.dependencies.has(dependentId)) {
      this.dependencies.set(dependentId, []);
    }
    this.dependencies.get(dependentId).push(dependencyId);
  }

  /**
   * Calculate complexity of a task (simplified)
   * @private
   */
  _calculateComplexity(taskData) {
    if (typeof taskData === 'string') {
      return Math.max(1, Math.min(10, Math.ceil(taskData.length / 100)));
    } else {
      return Math.max(1, Math.min(10, 
        Object.keys(taskData).length + 
        JSON.stringify(taskData).length / 100));
    }
  }

  /**
   * Estimate number of chunks for a task
   * @private
   */
  _estimateChunkCount(taskData) {
    const complexity = this._calculateComplexity(taskData);
    return Math.max(1, Math.min(5, Math.ceil(complexity / 2)));
  }

  /**
   * Slice string content for a chunk
   * @private
   */
  _sliceStringContent(content, index, totalChunks) {
    const chunkSize = Math.ceil(content.length / totalChunks);
    const start = index * chunkSize;
    const end = Math.min(start + chunkSize, content.length);
    return content.slice(start, end);
  }

  /**
   * Slice object content for a chunk
   * @private
   */
  _sliceObjectContent(content, index, totalChunks) {
    // For objects, we'll just add a chunk index property
    return {
      ...content,
      chunkIndex: index,
      totalChunks: totalChunks
    };
  }
}

/**
 * Run a direct test of the IDDR process
 */
function runDirectTest() {
  console.log('STARTING DIRECT TEST OF QUANTUM CHUNKING ENGINE');
  console.log('=============================================');
  
  // Create the engine
  const engine = new QuantumChunkingEngine();
  
  // Test with a simple string task
  const taskId = 'test-task-direct-' + Date.now();
  const taskData = 'This is a neural-symbiotic test task for the Quantum Chunking Engine with the IDDR paradigm.';
  
  console.log(`Test task: "${taskData}"`);
  console.log('Running full IDDR pipeline...');
  
  // Execute full pipeline
  const result = engine.executeIDDR(taskId, taskData);
  
  console.log('\nIDDR EXECUTION COMPLETE');
  console.log('=====================');
  console.log('Task ID:', result.taskId);
  console.log('Status:', result.status);
  console.log('Result:', result.result);
  
  // Verify the result (reversed strings from each chunk joined together)
  console.log('\nVERIFICATION');
  console.log('===========');
  
  // Get the original task
  const task = engine.tasks.get(taskId);
  
  console.log('Created chunks:', task.chunks.length);
  console.log('All processed:', task.chunks.every(id => engine.chunks.get(id).status === 'processed'));
  
  // For this simple case, we can verify by manually reversing the original and comparing
  const manualReverse = task.chunks
    .map(id => engine.chunks.get(id))
    .sort((a, b) => a.index - b.index)
    .map(chunk => chunk.content.split('').reverse().join(''))
    .join('');
  
  const success = manualReverse === result.result;
  
  console.log('Result verification:', success ? 'PASSED' : 'FAILED');
  
  if (!success) {
    console.log('Expected:', manualReverse);
    console.log('Got:', result.result);
  }
  
  console.log('\nTEST COMPLETE:', success ? 'SUCCESS' : 'FAILURE');
  return success;
}

// Execute the test function
const success = runDirectTest();

// For use with Node.js
module.exports = { runDirectTest, QuantumChunkingEngine };