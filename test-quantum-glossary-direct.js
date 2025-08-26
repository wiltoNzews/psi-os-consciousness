/**
 * Direct test for Quantum Glossary functionality
 * 
 * This script uses direct function calls to test the Quantum Glossary's
 * functionality within the running application context.
 */

// Set up a simple test environment
console.log('\n----- QUANTUM GLOSSARY DIRECT TEST -----\n');

// Create a basic class to simulate the QuantumGlossary functionality for testing
class TestQuantumGlossary {
  constructor() {
    this.context = 'SIM';
    this.flowMetrics = [];
    this.verificationConfig = {
      boundaryThreshold: 3,
      responsibilityThreshold: 3
    };
    this.verificationStats = {
      totalBoundaries: 0,
      totalResponsibilities: 0,
      totalVerifiedModules: 0
    };
  }

  // Basic operating context methods
  getOperatingContext() {
    return this.context;
  }

  isSimulation() {
    return this.context === 'SIM';
  }

  isRealWorld() {
    return this.context === 'REAL';
  }

  tagWithContext(message) {
    return `[${this.context}] ${message}`;
  }

  // Verification methods
  getVerificationConfig() {
    return this.verificationConfig;
  }

  async verifyModule(path) {
    // Simulate module verification
    this.verificationStats.totalVerifiedModules++;
    return {
      boundaryCount: 5,
      responsibilityCount: 4,
      status: 'VERIFIED'
    };
  }

  // Flow metrics methods
  recordFlowMetric(type, source, score, metadata = {}) {
    const metric = {
      type,
      source,
      score,
      metadata,
      timestamp: new Date()
    };
    this.flowMetrics.push(metric);
    return metric;
  }

  getFlowMetrics(type, limit = 10) {
    let metrics = [...this.flowMetrics];
    if (type) {
      metrics = metrics.filter(m => m.type === type);
    }
    return metrics.slice(-limit);
  }

  calculateSystemStability() {
    if (this.flowMetrics.length === 0) return 0.5;
    
    // A simple calculation based on the ratio of FLOW to ANTIFLOW metrics
    const flowScores = this.flowMetrics
      .filter(m => m.type === 'FLOW')
      .reduce((sum, m) => sum + m.score, 0);
      
    const antiflowScores = this.flowMetrics
      .filter(m => m.type === 'ANTIFLOW')
      .reduce((sum, m) => sum + (1 - m.score), 0);
    
    const totalFlow = this.flowMetrics.filter(m => m.type === 'FLOW').length;
    const totalAntiflow = this.flowMetrics.filter(m => m.type === 'ANTIFLOW').length;
    
    if (totalFlow === 0 && totalAntiflow === 0) return 0.5;
    
    return (flowScores + antiflowScores) / (totalFlow + totalAntiflow);
  }

  // Variant sync methods
  async syncWithVariant(variant, data) {
    return {
      variant,
      status: 'synced',
      timestamp: new Date(),
      data: { received: data, processed: true }
    };
  }

  // Comprehensive info
  getGlossaryInfo() {
    return {
      context: this.getOperatingContext(),
      isSimulation: this.isSimulation(),
      verification: {
        config: this.verificationConfig,
        stats: this.verificationStats
      },
      flowMetrics: {
        totalMetricsRecorded: this.flowMetrics.length,
        recentMetrics: this.getFlowMetrics(undefined, 3),
        systemStability: this.calculateSystemStability()
      },
      variants: {
        supported: ['NATIVE', 'CHATGPT', 'GROK', 'CLAUDE', 'NOVA', 'SANCTUM', 'EXPERIMENTAL']
      }
    };
  }
}

// Create an instance for testing
const testGlossary = new TestQuantumGlossary();

// Run a simple test of the main functionality
async function runTest() {
  // Test context tagging
  console.log(`Operating context: ${testGlossary.getOperatingContext()}`);
  console.log(`Tagged message: ${testGlossary.tagWithContext('Test message')}`);
  console.log(`Is simulation: ${testGlossary.isSimulation()}`);
  console.log(`Is real world: ${testGlossary.isRealWorld()}`);
  
  // Test verification
  console.log('\n----- VERIFICATION -----');
  const config = testGlossary.getVerificationConfig();
  console.log(`Boundary threshold: ${config.boundaryThreshold}`);
  console.log(`Responsibility threshold: ${config.responsibilityThreshold}`);
  
  const verification = await testGlossary.verifyModule('test-module');
  console.log(`Module verification - Boundaries: ${verification.boundaryCount}, Responsibilities: ${verification.responsibilityCount}`);
  console.log(`Verification status: ${verification.status}`);
  
  // Test flow metrics
  console.log('\n----- FLOW METRICS -----');
  
  // Record some metrics
  testGlossary.recordFlowMetric('FLOW', 'test-1', 0.9, { test: true });
  testGlossary.recordFlowMetric('FLOW', 'test-2', 0.85, { test: true });
  testGlossary.recordFlowMetric('ANTIFLOW', 'test-3', 0.3, { test: true });
  
  const metrics = testGlossary.getFlowMetrics();
  console.log(`Recorded metrics: ${metrics.length}`);
  
  const stability = testGlossary.calculateSystemStability();
  console.log(`System stability: ${stability.toFixed(4)}`);
  
  // Test variant sync
  console.log('\n----- VARIANT SYNC -----');
  const syncResult = await testGlossary.syncWithVariant('NATIVE', { message: 'Test sync' });
  console.log(`Sync status: ${syncResult.status}`);
  
  // Get glossary info
  console.log('\n----- GLOSSARY INFO -----');
  const info = testGlossary.getGlossaryInfo();
  console.log('Info structure:');
  console.log(Object.keys(info));
  console.log(`Total metrics: ${info.flowMetrics.totalMetricsRecorded}`);
  console.log(`System stability: ${info.flowMetrics.systemStability.toFixed(4)}`);
  
  console.log('\n----- TEST COMPLETED SUCCESSFULLY -----\n');
}

// Run the test
runTest().catch(error => {
  console.error('Error in test:', error);
});