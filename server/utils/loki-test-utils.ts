/**
 * Loki Test Utils - Controlled Chaos Testing Framework
 * 
 * This module implements the Loki Variant testing approach for introducing
 * controlled chaos into tests, ensuring system robustness through unpredictable
 * but valid test scenarios.
 * 
 * BOUNDARY AWARENESS: This module explicitly defines the boundary between
 * predictable testing and controlled chaos testing.
 */

import { v4 as uuidv4 } from 'uuid';
import { quantumGlossary, StrategicContext } from '../services/qrn/quantum-glossary.js';
import { QuantumState } from '../../shared/schema-minimal.js';

/**
 * Generate unpredictable but valid test data
 * 
 * @param chaosLevel Level of chaos from 0.0 (minimal) to 1.0 (maximum)
 * @param typeConstraint Optional type constraint to ensure type safety
 * @returns Random data of varying complexity
 */
export function generateLokiTestData(chaosLevel = 0.5, typeConstraint?: string): any {
  // Define strategic context for data generation
  const generationContext: StrategicContext = {
    contextDescription: "Generating Loki test data with controlled chaos",
    possibleNextActions: [
      "Generate simple primitive data",
      "Generate complex nested object",
      "Generate array of mixed types",
      "Generate edge case data"
    ],
    metadata: {
      chaosLevel,
      typeConstraint,
      purpose: "testing"
    }
  };
  
  // Use decohere to explicitly choose the generation approach
  const generationApproach = quantumGlossary.decohere(generationContext);
  console.log(`[LokiTestUtils] Using generation approach: ${generationApproach}`);
  
  // Execute chosen generation approach
  if (generationApproach === "Generate simple primitive data") {
    return generatePrimitiveData(chaosLevel, typeConstraint);
  } else if (generationApproach === "Generate complex nested object") {
    return generateNestedObject(Math.floor(chaosLevel * 3) + 1, chaosLevel);
  } else if (generationApproach === "Generate array of mixed types") {
    return generateMixedArray(Math.floor(chaosLevel * 10) + 1, chaosLevel);
  } else {
    return generateEdgeCaseData(chaosLevel, typeConstraint);
  }
}

/**
 * Generate a primitive data value (string, number, boolean)
 * 
 * @param chaosLevel Chaos level (0.0 to 1.0)
 * @param typeConstraint Optional type constraint
 * @returns Primitive data value
 */
function generatePrimitiveData(chaosLevel: number, typeConstraint?: string): any {
  if (typeConstraint === 'string') {
    return generateChaosString(chaosLevel);
  } else if (typeConstraint === 'number') {
    return generateChaosNumber(chaosLevel);
  } else if (typeConstraint === 'boolean') {
    return Math.random() > 0.5;
  } else if (typeConstraint === 'date') {
    return generateChaosDate(chaosLevel);
  } else {
    // Choose a random primitive type
    const types = ['string', 'number', 'boolean'];
    const selectedType = types[Math.floor(Math.random() * types.length)];
    return generatePrimitiveData(chaosLevel, selectedType);
  }
}

/**
 * Generate a string with varying characteristics based on chaos level
 * 
 * @param chaosLevel Chaos level (0.0 to 1.0)
 * @returns String with varying complexity
 */
function generateChaosString(chaosLevel: number): string {
  // Determine string length based on chaos level
  const baseLength = 10;
  const maxLength = 1000;
  const length = Math.floor(baseLength + chaosLevel * (maxLength - baseLength));
  
  // Determine string complexity
  const useSpecialChars = Math.random() < chaosLevel;
  const useMultiline = Math.random() < chaosLevel * 0.5;
  const useJSON = Math.random() < chaosLevel * 0.3;
  
  // Generate base characters
  let result = '';
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  const specialChars = '!@#$%^&*()_+-=[]{}|;:\'",.<>?/';
  
  for (let i = 0; i < length; i++) {
    if (useSpecialChars && Math.random() < chaosLevel * 0.2) {
      result += specialChars.charAt(Math.floor(Math.random() * specialChars.length));
    } else {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    
    // Add line breaks for multiline strings
    if (useMultiline && Math.random() < chaosLevel * 0.05) {
      result += '\n';
    }
  }
  
  // For very high chaos levels, sometimes return JSON-like strings
  if (useJSON) {
    const obj = generateNestedObject(1, chaosLevel * 0.5);
    try {
      return JSON.stringify(obj);
    } catch (error) {
      // If stringification fails, return the original string
      return result;
    }
  }
  
  return result;
}

/**
 * Generate a number with varying characteristics based on chaos level
 * 
 * @param chaosLevel Chaos level (0.0 to 1.0)
 * @returns Number with varying magnitude
 */
function generateChaosNumber(chaosLevel: number): number {
  // Determine number characteristics
  const useNegative = Math.random() < chaosLevel * 0.3;
  const useDecimal = Math.random() < 0.7;
  const useLarge = Math.random() < chaosLevel * 0.5;
  
  // Generate base magnitude
  let magnitude: number;
  if (useLarge) {
    magnitude = Math.random() * Number.MAX_SAFE_INTEGER * chaosLevel;
  } else {
    magnitude = Math.random() * (10 ** (Math.floor(chaosLevel * 5) + 1));
  }
  
  // Apply transformations
  if (useNegative) magnitude *= -1;
  if (!useDecimal) magnitude = Math.floor(magnitude);
  
  return magnitude;
}

/**
 * Generate a date with varying temporal distance based on chaos level
 * 
 * @param chaosLevel Chaos level (0.0 to 1.0)
 * @returns Date object
 */
function generateChaosDate(chaosLevel: number): Date {
  const now = new Date().getTime();
  
  // Range varies with chaos level (±1 day to ±10 years)
  const maxRange = 10 * 365 * 24 * 60 * 60 * 1000; // 10 years in milliseconds
  const range = Math.floor(chaosLevel * maxRange);
  const offset = Math.floor(Math.random() * range * 2) - range;
  
  return new Date(now + offset);
}

/**
 * Generate a nested object with varying depth and complexity
 * 
 * @param depth Maximum depth of nesting
 * @param chaosLevel Chaos level (0.0 to 1.0)
 * @returns Nested object
 */
function generateNestedObject(depth: number, chaosLevel: number): object {
  const result: Record<string, any> = {};
  
  // Determine number of properties
  const baseProps = 3;
  const maxProps = 20;
  const propCount = Math.floor(baseProps + chaosLevel * (maxProps - baseProps));
  
  for (let i = 0; i < propCount; i++) {
    // Property name
    const key = `key${i}_${Math.random().toString(36).substring(2, 6)}`;
    
    // Property value
    if (depth > 1 && Math.random() < chaosLevel * 0.5) {
      // Recursive nested object
      result[key] = generateNestedObject(depth - 1, chaosLevel * 0.8);
    } else {
      // Leaf value (primitive)
      result[key] = generatePrimitiveData(chaosLevel);
    }
  }
  
  return result;
}

/**
 * Generate an array with mixed types
 * 
 * @param length Length of the array
 * @param chaosLevel Chaos level (0.0 to 1.0)
 * @returns Array with mixed elements
 */
function generateMixedArray(length: number, chaosLevel: number): any[] {
  const result = [];
  
  for (let i = 0; i < length; i++) {
    const itemType = Math.floor(Math.random() * 4); // 0-3
    
    switch (itemType) {
      case 0:
        result.push(generatePrimitiveData(chaosLevel, 'string'));
        break;
      case 1:
        result.push(generatePrimitiveData(chaosLevel, 'number'));
        break;
      case 2:
        if (Math.random() < chaosLevel && length < 5) {
          // Nested array (only for smaller arrays to prevent excessive nesting)
          result.push(generateMixedArray(Math.floor(length / 2), chaosLevel * 0.7));
        } else {
          result.push(generatePrimitiveData(chaosLevel, 'boolean'));
        }
        break;
      case 3:
        if (Math.random() < chaosLevel) {
          // Nested object
          result.push(generateNestedObject(Math.floor(chaosLevel * 2) + 1, chaosLevel * 0.7));
        } else {
          result.push(generatePrimitiveData(chaosLevel, 'date'));
        }
        break;
    }
  }
  
  return result;
}

/**
 * Generate edge case data designed to stress test systems
 * 
 * @param chaosLevel Chaos level (0.0 to 1.0)
 * @param typeConstraint Optional type constraint
 * @returns Edge case data
 */
function generateEdgeCaseData(chaosLevel: number, typeConstraint?: string): any {
  // Define edge case options based on type constraint
  const edgeCases: Record<string, any[]> = {
    string: [
      '', // Empty string
      ' '.repeat(Math.floor(chaosLevel * 1000)), // String with only spaces
      ''.repeat(Math.floor(chaosLevel * 10000)), // Very long string
      '<script>alert("test")</script>', // Script tag
      '🚀🌍🔥💯', // Emojis
      'SELECT * FROM users; DROP TABLE users;', // SQL injection attempt
      Buffer.from('Binary string').toString('base64') // Base64 encoded string
    ],
    number: [
      0,
      -0,
      Number.MAX_SAFE_INTEGER,
      Number.MIN_SAFE_INTEGER,
      Number.MAX_VALUE,
      Number.MIN_VALUE,
      Number.POSITIVE_INFINITY,
      Number.NEGATIVE_INFINITY,
      Number.NaN
    ],
    boolean: [
      true,
      false
    ],
    date: [
      new Date(0), // Unix epoch
      new Date('2100-01-01'), // Future date
      new Date('1900-01-01'), // Past date
      new Date(NaN) // Invalid date
    ],
    object: [
      {},
      { ...generateNestedObject(5, 1.0), id: uuidv4() }, // Very deep object with id
      Object.create(null), // Object with no prototype
      { toString: () => 'Custom toString' } // Object with custom toString
    ],
    array: [
      [],
      new Array(1000).fill(null), // Sparse array
      [null, undefined, NaN, Infinity, -Infinity], // Array with special values
      new Array(10).fill(0).map(() => generateChaosString(1.0)) // Array of long strings
    ]
  };
  
  // Choose the appropriate edge case type
  let type = typeConstraint;
  if (!type || !edgeCases[type]) {
    // If no constraint or invalid constraint, choose random type
    const types = Object.keys(edgeCases);
    type = types[Math.floor(Math.random() * types.length)];
  }
  
  // Choose a random edge case from the selected type
  const cases = edgeCases[type];
  return cases[Math.floor(Math.random() * cases.length)];
}

/**
 * Generate a sequence of operations for chaos testing
 * 
 * @param operationCount Number of operations to generate
 * @param operations Available operations (create, read, update, delete)
 * @returns Array of operation objects with type and parameters
 */
export function generateOperationSequence(
  operationCount = 10, 
  operations = ['create', 'read', 'update', 'delete']
): Array<{type: string, params: any}> {
  // Define strategic context for sequence generation
  const sequenceContext: StrategicContext = {
    contextDescription: "Generating Loki operation sequence",
    possibleNextActions: [
      "Generate balanced operation sequence",
      "Generate create-heavy sequence",
      "Generate read-heavy sequence",
      "Generate chaotic sequence with rare operations"
    ],
    metadata: {
      operationCount,
      availableOperations: operations
    }
  };
  
  // Use decohere to explicitly choose the sequence approach
  const sequenceApproach = quantumGlossary.decohere(sequenceContext);
  console.log(`[LokiTestUtils] Using sequence approach: ${sequenceApproach}`);
  
  // Generate sequence based on chosen approach
  const sequence = [];
  const ids = new Set<string>();
  let weights: Record<string, number>;
  
  // Set operation weights based on chosen approach
  if (sequenceApproach === "Generate balanced operation sequence") {
    weights = operations.reduce((acc, op) => ({ ...acc, [op]: 1 }), {});
  } else if (sequenceApproach === "Generate create-heavy sequence") {
    weights = {
      create: 0.6,
      read: 0.2,
      update: 0.1,
      delete: 0.1
    };
  } else if (sequenceApproach === "Generate read-heavy sequence") {
    weights = {
      create: 0.2,
      read: 0.6,
      update: 0.1,
      delete: 0.1
    };
  } else {
    // Chaotic sequence with rare operations
    weights = {
      create: 0.4,
      read: 0.4,
      update: 0.1,
      delete: 0.1
    };
  }
  
  // Get normalized weights for available operations only
  const availableWeights = operations.map(op => weights[op] || 1);
  const weightSum = availableWeights.reduce((a, b) => a + b, 0);
  const normalizedWeights = availableWeights.map(w => w / weightSum);
  
  // Generate the sequence
  for (let i = 0; i < operationCount; i++) {
    // Choose operation based on weights
    const opTypeIndex = weightedRandomIndex(normalizedWeights);
    const opType = operations[opTypeIndex];
    
    // Generate appropriate parameters for operation
    let params: any = {};
    
    switch (opType) {
      case 'create':
        const newId = `loki-${Math.random().toString(36).substring(2, 11)}`;
        ids.add(newId);
        params = { 
          id: newId, 
          data: generateLokiTestData(0.7) 
        };
        break;
      
      case 'read':
      case 'delete':
        // Choose existing ID if available, or generate a potentially non-existent one
        if (ids.size > 0 && Math.random() > 0.3) {
          params = { 
            id: Array.from(ids)[Math.floor(Math.random() * ids.size)] 
          };
        } else {
          params = { 
            id: `loki-${Math.random().toString(36).substring(2, 11)}` 
          };
        }
        break;
        
      case 'update':
        // Choose existing ID if available, or generate a potentially non-existent one
        if (ids.size > 0 && Math.random() > 0.3) {
          params = { 
            id: Array.from(ids)[Math.floor(Math.random() * ids.size)],
            data: generateLokiTestData(0.7)
          };
        } else {
          params = { 
            id: `loki-${Math.random().toString(36).substring(2, 11)}`,
            data: generateLokiTestData(0.7)
          };
        }
        break;
      
      default:
        params = { id: uuidv4() };
    }
    
    sequence.push({ type: opType, params });
  }
  
  // Record flow metric for sequence generation
  quantumGlossary.recordFlowMetric(
    QuantumState.SIM_FLOW,
    'loki_sequence_generation',
    100,
    { 
      approach: sequenceApproach,
      operationCount,
      operationTypes: operations
    }
  );
  
  return sequence;
}

/**
 * Simulate resource constraints for more chaos
 * 
 * @param constraints Type of constraints to simulate
 * @param level Constraint level (0.0 to 1.0)
 */
export async function simulateResourceConstraints(
  constraints: 'memory' | 'cpu' | 'disk' | 'network' | 'all' = 'all',
  level: number = 0.5
): Promise<void> {
  // Define strategic context for constraint simulation
  const constraintContext: StrategicContext = {
    contextDescription: "Simulating resource constraints for chaos testing",
    possibleNextActions: [
      "Simulate memory pressure",
      "Simulate CPU load",
      "Simulate disk operations",
      "Simulate network latency",
      "Simulate mixed constraints"
    ],
    metadata: {
      constraintType: constraints,
      level
    }
  };
  
  // Use decohere to explicitly choose the constraint approach
  const constraintApproach = quantumGlossary.decohere(constraintContext);
  console.log(`[LokiTestUtils] Using constraint approach: ${constraintApproach}`);
  
  // Apply chosen constraint
  if (constraintApproach === "Simulate memory pressure" || constraints === 'memory' || constraints === 'all') {
    await simulateMemoryPressure(level);
  }
  
  if (constraintApproach === "Simulate CPU load" || constraints === 'cpu' || constraints === 'all') {
    await simulateCPULoad(level);
  }
  
  if (constraintApproach === "Simulate disk operations" || constraints === 'disk' || constraints === 'all') {
    await simulateDiskOperations(level);
  }
  
  if (constraintApproach === "Simulate network latency" || constraints === 'network' || constraints === 'all') {
    await simulateNetworkLatency(level);
  }
  
  if (constraintApproach === "Simulate mixed constraints") {
    // Choose random constraints
    const constraintTypes = ['memory', 'cpu', 'disk', 'network'];
    const selectedTypes = constraintTypes.filter(() => Math.random() < level);
    
    for (const type of selectedTypes) {
      await simulateResourceConstraints(type as any, level * 0.7);
    }
  }
}

/**
 * Simulate memory pressure by allocating large arrays
 * 
 * @param level Pressure level (0.0 to 1.0)
 */
async function simulateMemoryPressure(level: number): Promise<void> {
  const memoryArrays: any[] = [];
  const arrayCount = Math.floor(level * 5) + 1;
  const arraySize = Math.floor(level * 1000) + 100;
  
  // Allocate memory (safely)
  for (let i = 0; i < arrayCount; i++) {
    try {
      memoryArrays.push(new Array(arraySize).fill('X'));
    } catch (error) {
      console.warn('Memory allocation limit reached in simulateMemoryPressure');
      break;
    }
  }
  
  // Hold memory for a short time
  await new Promise(resolve => setTimeout(resolve, 100 * level));
  
  // Clear reference to release memory
  memoryArrays.length = 0;
}

/**
 * Simulate CPU load by running computation
 * 
 * @param level Load level (0.0 to 1.0)
 */
async function simulateCPULoad(level: number): Promise<void> {
  const duration = Math.floor(level * 500); // ms
  const start = Date.now();
  
  // Spin CPU for specified duration
  while (Date.now() - start < duration) {
    // Generate random data and perform operations
    const data = new Array(1000).fill(0).map(() => Math.random());
    data.sort();
    
    // Don't block event loop completely
    if (Date.now() - start > 50) {
      await new Promise(resolve => setTimeout(resolve, 0));
    }
  }
}

/**
 * Simulate disk operations for I/O pressure
 * 
 * @param level Pressure level (0.0 to 1.0)
 */
async function simulateDiskOperations(level: number): Promise<void> {
  // This is a simulation - in a real implementation you would 
  // create/read/write actual files, but we'll just simulate the delay
  const operationCount = Math.floor(level * 10) + 1;
  const delay = Math.floor(level * 50); // ms per operation
  
  for (let i = 0; i < operationCount; i++) {
    await new Promise(resolve => setTimeout(resolve, delay));
  }
}

/**
 * Simulate network latency for testing
 * 
 * @param level Latency level (0.0 to 1.0)
 */
async function simulateNetworkLatency(level: number): Promise<void> {
  const latency = Math.floor(level * 1000); // up to 1 second
  await new Promise(resolve => setTimeout(resolve, latency));
}

/**
 * Get random index based on weights
 * 
 * @param weights Array of weights
 * @returns Selected index
 */
function weightedRandomIndex(weights: number[]): number {
  const random = Math.random();
  let sum = 0;
  
  for (let i = 0; i < weights.length; i++) {
    sum += weights[i];
    if (random < sum) {
      return i;
    }
  }
  
  return weights.length - 1; // fallback
}