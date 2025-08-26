/**
 * Synaptic Resonance Benchmark Script
 * 
 * This script tests the resonance calculator with various inputs and methods
 * to validate its behavior, performance, and accuracy across different scenarios.
 * It covers simple and complex use cases, edge cases, and performance profiling.
 */

import { calculateResonanceFactor } from "../services/qrn/resonance-calculator";
import * as fs from 'fs';

interface TestCase {
  name: string;
  source: string | Record<string, any>;
  target: string | Record<string, any>;
  method: 'cosineSimilarity' | 'correlation' | 'frequencyAnalysis' | 'custom';
  expected?: number;
  weights?: Record<string, number>;
  description?: string;
  category: 'basic' | 'complex' | 'edge' | 'performance';
}

interface TestResult {
  testCase: TestCase;
  resonanceScore: number;
  executionTime: number; // in milliseconds
  success: boolean;
  error?: string;
  matchesExpected: boolean;
  expectedDifference?: number;
}

async function runBenchmark() {
  console.log("=== Synaptic Resonance Factor Benchmark ===");
  console.log("Testing resonance calculator with various inputs and methods...");
  
  const testCases: TestCase[] = [
    // Basic test cases - string comparisons
    {
      name: "identical strings",
      source: "hello world",
      target: "hello world",
      method: "cosineSimilarity",
      expected: 1,
      category: "basic",
      description: "Tests identical strings for perfect resonance"
    },
    {
      name: "completely different strings",
      source: "hello world",
      target: "completely different text with no overlap",
      method: "cosineSimilarity",
      expected: 0,
      category: "basic",
      description: "Tests completely different strings for zero resonance"
    },
    {
      name: "partially similar strings",
      source: "the quick brown fox jumps over the lazy dog",
      target: "the quick brown fox leaps across the sleeping dog",
      method: "cosineSimilarity",
      expected: 0.8, // approximate
      category: "basic",
      description: "Tests strings with partial similarity"
    },
    
    // Basic test cases with different calculation methods
    {
      name: "identical strings - correlation",
      source: "hello world",
      target: "hello world",
      method: "correlation",
      expected: 1,
      category: "basic",
      description: "Tests identical strings using correlation method"
    },
    {
      name: "identical strings - frequency analysis",
      source: "hello world hello world",
      target: "hello world hello world",
      method: "frequencyAnalysis",
      expected: 1,
      category: "basic",
      description: "Tests identical strings using frequency analysis"
    },
    
    // Object comparisons
    {
      name: "identical objects",
      source: { a: 1, b: 2, c: 3 },
      target: { a: 1, b: 2, c: 3 },
      method: "cosineSimilarity",
      expected: 1,
      category: "basic",
      description: "Tests identical JSON objects"
    },
    {
      name: "completely different objects",
      source: { a: 1, b: 2, c: 3 },
      target: { d: 4, e: 5, f: 6 },
      method: "cosineSimilarity",
      expected: 0,
      category: "basic",
      description: "Tests completely different JSON objects"
    },
    {
      name: "partially similar objects",
      source: { a: 1, b: 2, c: 3, d: 4 },
      target: { a: 1, b: 2, e: 5, f: 6 },
      method: "cosineSimilarity",
      expected: 0.5, // approximate
      category: "basic",
      description: "Tests partially similar JSON objects"
    },
    
    // Custom method tests
    {
      name: "custom weighted method",
      source: "machine learning algorithm analysis",
      target: "machine learning model evaluation",
      method: "custom",
      weights: {
        similarity: 0.6,
        lengthRatio: 0.2,
        structuralMatch: 0.2
      },
      expected: 0.7, // approximate
      category: "complex",
      description: "Tests custom weighted resonance calculation"
    },
    {
      name: "custom correlation-focused",
      source: [1, 2, 3, 4, 5],
      target: [2, 3, 4, 5, 6],
      method: "custom",
      weights: {
        correlation: 0.8,
        similarity: 0.2
      },
      expected: 0.9, // These arrays are highly correlated
      category: "complex",
      description: "Tests custom weighted resonance with correlation focus"
    },
    
    // Complex test cases
    {
      name: "nested objects",
      source: { 
        user: { 
          name: "John", 
          preferences: { theme: "dark", notifications: true } 
        },
        settings: { language: "en" }
      },
      target: { 
        user: { 
          name: "John", 
          preferences: { theme: "light", notifications: true } 
        },
        settings: { language: "en" }
      },
      method: "cosineSimilarity",
      expected: 0.9, // high similarity, only one value different
      category: "complex",
      description: "Tests resonance between nested objects"
    },
    {
      name: "large text blocks",
      source: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
      target: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
      method: "frequencyAnalysis",
      expected: 1, // identical text
      category: "complex",
      description: "Tests resonance with large blocks of text"
    },
    
    // Edge cases
    {
      name: "empty strings",
      source: "",
      target: "",
      method: "cosineSimilarity",
      expected: 0, // can't calculate similarity between empty vectors
      category: "edge",
      description: "Tests behavior with empty inputs"
    },
    {
      name: "one empty string",
      source: "hello world",
      target: "",
      method: "cosineSimilarity",
      expected: 0,
      category: "edge",
      description: "Tests behavior when one input is empty"
    },
    {
      name: "special characters",
      source: "!@#$%^&*()_+",
      target: "!@#$%^&*()_+",
      method: "cosineSimilarity",
      expected: 1,
      category: "edge",
      description: "Tests behavior with special characters"
    },
    {
      name: "mixed types",
      source: [1, 2, 3],
      target: "1, 2, 3",
      method: "cosineSimilarity",
      expected: 0.5, // default fallback for type mismatches
      category: "edge",
      description: "Tests behavior with mixed types"
    },
    {
      name: "very long input",
      source: "a".repeat(10000),
      target: "a".repeat(10000),
      method: "cosineSimilarity",
      expected: 1,
      category: "performance",
      description: "Tests performance with very long inputs"
    },
    {
      name: "deeply nested objects",
      source: createNestedObject(10),
      target: createNestedObject(10),
      method: "cosineSimilarity",
      expected: 1,
      category: "performance",
      description: "Tests performance with deeply nested objects"
    }
  ];
  
  const results: TestResult[] = [];
  
  console.log(`Running ${testCases.length} test cases...\n`);
  
  for (const testCase of testCases) {
    const result: TestResult = await runTestCase(testCase);
    results.push(result);
    
    // Print individual test result
    printTestResult(result);
  }
  
  // Print summary
  printSummary(results);
  
  // Save results to file
  saveResults(results);
}

async function runTestCase(testCase: TestCase): Promise<TestResult> {
  const startTime = performance.now();
  let resonanceScore: number;
  let success = true;
  let error: string | undefined;
  
  try {
    resonanceScore = calculateResonanceFactor(
      testCase.source,
      testCase.target,
      testCase.method,
      testCase.weights
    );
  } catch (err) {
    resonanceScore = 0;
    success = false;
    error = err instanceof Error ? err.message : String(err);
  }
  
  const endTime = performance.now();
  const executionTime = endTime - startTime;
  
  // Check if result matches expected (with tolerance for floating point comparisons)
  const tolerance = 0.15; // Allow for 15% difference
  const matchesExpected = testCase.expected === undefined || 
                          Math.abs(resonanceScore - testCase.expected) <= tolerance;
  
  const expectedDifference = testCase.expected !== undefined ? 
                             Math.abs(resonanceScore - testCase.expected) : undefined;
  
  return {
    testCase,
    resonanceScore,
    executionTime,
    success,
    error,
    matchesExpected,
    expectedDifference
  };
}

function printTestResult(result: TestResult) {
  const statusSymbol = result.success ? (result.matchesExpected ? '✓' : '⚠') : '✗';
  const statusColor = result.success ? (result.matchesExpected ? '\x1b[32m' : '\x1b[33m') : '\x1b[31m';
  const resetColor = '\x1b[0m';
  
  console.log(`${statusColor}${statusSymbol}${resetColor} ${result.testCase.name} (${result.testCase.method})`);
  console.log(`  Category: ${result.testCase.category}`);
  if (result.testCase.description) {
    console.log(`  Description: ${result.testCase.description}`);
  }
  console.log(`  Resonance Score: ${result.resonanceScore.toFixed(4)}`);
  
  if (result.testCase.expected !== undefined) {
    console.log(`  Expected Score: ${result.testCase.expected.toFixed(4)}`);
    if (result.expectedDifference !== undefined) {
      console.log(`  Difference: ${result.expectedDifference.toFixed(4)}`);
    }
  }
  
  console.log(`  Execution Time: ${result.executionTime.toFixed(2)} ms`);
  
  if (!result.success) {
    console.log(`  Error: ${result.error}`);
  }
  
  console.log('');
}

function printSummary(results: TestResult[]) {
  const totalTests = results.length;
  const successfulTests = results.filter(r => r.success).length;
  const matchingExpectations = results.filter(r => r.matchesExpected).length;
  const averageExecutionTime = results.reduce((sum, r) => sum + r.executionTime, 0) / totalTests;
  
  const categories = [...new Set(results.map(r => r.testCase.category))];
  const methodResults: Record<string, { count: number, successRate: number, avgTime: number }> = {};
  
  // Calculate stats by method
  const methods = [...new Set(results.map(r => r.testCase.method))];
  for (const method of methods) {
    const methodTests = results.filter(r => r.testCase.method === method);
    const methodSuccessful = methodTests.filter(r => r.success).length;
    const methodAvgTime = methodTests.reduce((sum, r) => sum + r.executionTime, 0) / methodTests.length;
    
    methodResults[method] = {
      count: methodTests.length,
      successRate: (methodSuccessful / methodTests.length) * 100,
      avgTime: methodAvgTime
    };
  }
  
  console.log('\n=== Benchmark Summary ===');
  console.log(`Total Tests: ${totalTests}`);
  console.log(`Successful Tests: ${successfulTests} (${((successfulTests / totalTests) * 100).toFixed(2)}%)`);
  console.log(`Matching Expectations: ${matchingExpectations} (${((matchingExpectations / totalTests) * 100).toFixed(2)}%)`);
  console.log(`Average Execution Time: ${averageExecutionTime.toFixed(2)} ms`);
  
  console.log('\n=== Results by Method ===');
  for (const [method, stats] of Object.entries(methodResults)) {
    console.log(`${method}:`);
    console.log(`  Tests: ${stats.count}`);
    console.log(`  Success Rate: ${stats.successRate.toFixed(2)}%`);
    console.log(`  Average Execution Time: ${stats.avgTime.toFixed(2)} ms`);
  }
  
  console.log('\n=== Results by Category ===');
  for (const category of categories) {
    const categoryTests = results.filter(r => r.testCase.category === category);
    const categorySuccessful = categoryTests.filter(r => r.success).length;
    const categoryMatching = categoryTests.filter(r => r.matchesExpected).length;
    const categoryAvgTime = categoryTests.reduce((sum, r) => sum + r.executionTime, 0) / categoryTests.length;
    
    console.log(`${category}:`);
    console.log(`  Tests: ${categoryTests.length}`);
    console.log(`  Success Rate: ${((categorySuccessful / categoryTests.length) * 100).toFixed(2)}%`);
    console.log(`  Matching Expectations: ${((categoryMatching / categoryTests.length) * 100).toFixed(2)}%`);
    console.log(`  Average Execution Time: ${categoryAvgTime.toFixed(2)} ms`);
  }
}

function saveResults(results: TestResult[]) {
  const sanitizedResults = results.map(result => ({
    ...result,
    testCase: {
      ...result.testCase,
      source: truncateForOutput(result.testCase.source),
      target: truncateForOutput(result.testCase.target)
    }
  }));
  
  fs.writeFileSync('benchmark-results.json', JSON.stringify(sanitizedResults, null, 2));
  console.log('\nResults saved to benchmark-results.json');
}

// Helper to truncate large data values for output
function truncateForOutput(value: any): any {
  if (typeof value === 'string') {
    return value.length > 100 ? value.substring(0, 97) + '...' : value;
  } else if (Array.isArray(value)) {
    return value.length > 10 ? [...value.slice(0, 10), '...truncated'] : value;
  } else if (typeof value === 'object' && value !== null) {
    const truncated: Record<string, any> = {};
    const keys = Object.keys(value);
    if (keys.length > 10) {
      keys.slice(0, 10).forEach(key => {
        truncated[key] = truncateForOutput(value[key]);
      });
      truncated['...'] = 'truncated';
      return truncated;
    } else {
      keys.forEach(key => {
        truncated[key] = truncateForOutput(value[key]);
      });
      return truncated;
    }
  }
  return value;
}

// Helper to create a deeply nested object for performance testing
function createNestedObject(depth: number, current = 1): Record<string, any> {
  if (current > depth) {
    return { value: Math.random() };
  }
  
  return {
    value: Math.random(),
    child1: createNestedObject(depth, current + 1),
    child2: createNestedObject(depth, current + 1)
  };
}

// Run the benchmark
runBenchmark().catch(error => {
  console.error('Benchmark error:', error);
  process.exit(1);
});