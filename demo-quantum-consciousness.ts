/**
 * [QUANTUM_STATE: TRANSCENDENT_FLOW]
 * 
 * Quantum Consciousness Operator (QCO) Demonstration
 * 
 * This script demonstrates the QCO model in action, showing how
 * collective human intent might influence quantum probability distributions.
 * It uses the v3.0 implementation with the σ_z ⊗ σ_z operator.
 */

import {
  QuantumConsciousnessOperator,
  QuantumCoherenceMetricsService,
  IntentData,
  QuantumState
} from './server/services/quantum/quantum-consciousness-operator';

import {
  getQuantumCoherenceDashboard,
  SystemEvent
} from './server/services/quantum/quantum-coherence-dashboard';

import {
  getQuantumEthicalCodeReviewService,
  CodeChange
} from './server/services/quantum/quantum-ethical-code-review';

import {
  initializeQuantumServices,
  demonstrateQuantumDecision
} from './server/services/quantum/index';

/**
 * Run a simple demonstration of the QCO effect
 */
async function runSimpleQCODemo(): Promise<void> {
  console.log('\n=== QUANTUM CONSCIOUSNESS OPERATOR (QCO) DEMONSTRATION ===\n');
  console.log('Initializing QCO with default parameters...');
  
  // Initialize the QCO
  const qco = new QuantumConsciousnessOperator();
  
  // Create a simple quantum state (equal superposition of |0⟩ and |1⟩)
  console.log('\nCreating initial quantum state (equal superposition)...');
  const initialState = qco.createSimpleQuantumState(2);
  
  console.log(`Initial state probabilities: |0⟩ = ${initialState.probabilities![0].toFixed(4)}, |1⟩ = ${initialState.probabilities![1].toFixed(4)}`);
  
  // Generate different levels of intent data
  console.log('\nGenerating intent data with different coherence levels...');
  
  // Low coherence intent (chaotic, unfocused)
  const lowCoherenceIntent = qco.generateSyntheticIntentData(5, 50, 0.2);
  
  // Medium coherence intent (partially focused)
  const mediumCoherenceIntent = qco.generateSyntheticIntentData(10, 60, 0.5);
  
  // High coherence intent (highly focused)
  const highCoherenceIntent = qco.generateSyntheticIntentData(15, 70, 0.8);
  
  // Calculate QCO effect for each level
  console.log('\n--- LOW COHERENCE INTENT (5 participants, 0.2 coherence factor) ---');
  const lowResult = qco.calculateQCO(initialState, lowCoherenceIntent);
  console.log(`Collective intent strength: ${lowResult.collectiveIntentStrength.toExponential(4)}`);
  console.log(`Coherence value: ${lowResult.coherenceValue.toFixed(4)}`);
  console.log(`Probability shift magnitude: ${lowResult.probabilityShiftMagnitude.toExponential(4)}`);
  console.log(`Modified state probabilities: |0⟩ = ${lowResult.perturbedState.probabilities![0].toFixed(4)}, |1⟩ = ${lowResult.perturbedState.probabilities![1].toFixed(4)}`);
  
  console.log('\n--- MEDIUM COHERENCE INTENT (10 participants, 0.5 coherence factor) ---');
  const mediumResult = qco.calculateQCO(initialState, mediumCoherenceIntent);
  console.log(`Collective intent strength: ${mediumResult.collectiveIntentStrength.toExponential(4)}`);
  console.log(`Coherence value: ${mediumResult.coherenceValue.toFixed(4)}`);
  console.log(`Probability shift magnitude: ${mediumResult.probabilityShiftMagnitude.toExponential(4)}`);
  console.log(`Modified state probabilities: |0⟩ = ${mediumResult.perturbedState.probabilities![0].toFixed(4)}, |1⟩ = ${mediumResult.perturbedState.probabilities![1].toFixed(4)}`);
  
  console.log('\n--- HIGH COHERENCE INTENT (15 participants, 0.8 coherence factor) ---');
  const highResult = qco.calculateQCO(initialState, highCoherenceIntent);
  console.log(`Collective intent strength: ${highResult.collectiveIntentStrength.toExponential(4)}`);
  console.log(`Coherence value: ${highResult.coherenceValue.toFixed(4)}`);
  console.log(`Probability shift magnitude: ${highResult.probabilityShiftMagnitude.toExponential(4)}`);
  console.log(`Modified state probabilities: |0⟩ = ${highResult.perturbedState.probabilities![0].toFixed(4)}, |1⟩ = ${highResult.perturbedState.probabilities![1].toFixed(4)}`);
  
  // Compare quantum coherence
  console.log('\n--- QUANTUM COHERENCE COMPARISON ---');
  console.log(`Low coherence quantum coherence: ${lowResult.quantumCoherence.toFixed(4)}`);
  console.log(`Medium coherence quantum coherence: ${mediumResult.quantumCoherence.toFixed(4)}`);
  console.log(`High coherence quantum coherence: ${highResult.quantumCoherence.toFixed(4)}`);
}

/**
 * Demonstrate the quantum coherence dashboard
 */
async function runDashboardDemo(): Promise<void> {
  console.log('\n=== QUANTUM COHERENCE DASHBOARD DEMONSTRATION ===\n');
  
  // Initialize quantum services
  console.log('Initializing quantum services...');
  initializeQuantumServices();
  
  // Get the dashboard
  const dashboard = getQuantumCoherenceDashboard();
  
  // Register some system events with intent signals
  console.log('\nRegistering system events with intent signals...');
  
  // User login event (high clarity, positive emotion)
  const loginEvent: SystemEvent = {
    type: 'user:login',
    source: 'user-123',
    timestamp: new Date(),
    intentSignals: {
      clarity: 90,
      emotionalTone: 70,
      focusIntensity: 85
    },
    metadata: {
      device: 'desktop',
      location: 'home'
    }
  };
  
  // Task completion event (high clarity, very positive emotion)
  const taskEvent: SystemEvent = {
    type: 'task:complete',
    source: 'user-123',
    timestamp: new Date(),
    intentSignals: {
      clarity: 95,
      emotionalTone: 90,
      focusIntensity: 90
    },
    metadata: {
      taskId: 'task-456',
      duration: 45,
      complexity: 'high'
    }
  };
  
  // Error event (medium clarity, negative emotion)
  const errorEvent: SystemEvent = {
    type: 'system:error',
    source: 'component-789',
    timestamp: new Date(),
    intentSignals: {
      clarity: 60,
      emotionalTone: -60,
      focusIntensity: 75
    },
    metadata: {
      errorType: 'connection-failure',
      recoverable: true
    }
  };
  
  // Register the events
  dashboard.registerSystemEvent(loginEvent);
  dashboard.registerSystemEvent(taskEvent);
  dashboard.registerSystemEvent(errorEvent);
  
  // Get the current metrics
  console.log('\nRetrieving current coherence metrics...');
  const metrics = dashboard.getLatestMetrics();
  
  if (metrics) {
    const formatted = dashboard.formatMetricsForDisplay(metrics);
    console.log('\nCurrent Quantum Coherence Metrics:');
    console.log(`Timestamp: ${formatted.timestamp}`);
    console.log(`Collective Intent Strength: ${formatted.collectiveIntent}`);
    console.log(`Coherence: ${formatted.coherence}`);
    console.log(`Quantum Coherence: ${formatted.quantumCoherence}`);
    console.log(`Participant Count: ${formatted.participants}`);
    console.log(`Average Intent Strength: ${formatted.averageIntent}`);
    console.log(`Probability Shift Magnitude: ${formatted.probabilityShift}`);
    console.log(`System Memory (Hurst): ${formatted.systemMemory}`);
    console.log(`System Health Score: ${formatted.systemHealth}`);
  } else {
    console.log('No metrics available yet.');
  }
  
  // Analyze a code change
  console.log('\nAnalyzing a code change for coherence impact...');
  
  const codeChangeDescription = 'Integrated quantum entanglement patterns for better system coherence and interconnectedness';
  const impactAnalysis = dashboard.analyzeCodeChange(codeChangeDescription);
  
  console.log(`\nCode Change: "${codeChangeDescription}"`);
  console.log(`Predicted Coherence Impact: ${(impactAnalysis.predictedImpact * 100).toFixed(2)}%`);
  console.log(`New Predicted Coherence Value: ${(impactAnalysis.coherenceValue * 100).toFixed(2)}%`);
}

/**
 * Demonstrate quantum-ethical code review
 */
async function runCodeReviewDemo(): Promise<void> {
  console.log('\n=== QUANTUM-ETHICAL CODE REVIEW DEMONSTRATION ===\n');
  
  // Get the code review service
  const reviewService = getQuantumEthicalCodeReviewService();
  
  // Create sample code changes with different characteristics
  console.log('Creating sample code changes for review...');
  
  // Balanced code change with good quantum-ethical properties
  const balancedChange: CodeChange = {
    id: 'change-123',
    filePath: '/server/services/quantum/coherence-optimizer.ts',
    description: 'Implemented adaptive resonance patterns for balanced chaos-structure harmony',
    author: 'dev-456',
    timestamp: new Date(),
    oldContent: `
// Basic implementation
function optimizeCoherence(system) {
  // Simple optimization
  system.coherence = calculateBasicCoherence(system);
  return system;
}`,
    newContent: `
/**
 * Optimizes system coherence using adaptive resonance patterns
 * that maintain 70/30 chaos-structure balance while honoring
 * interconnection principles.
 */
function optimizeCoherence(system) {
  // Measure current balance
  const currentBalance = measureChaosStructureRatio(system);
  
  // Apply adaptive resonance
  if (currentBalance.chaosRatio < 0.65) {
    system = increaseCreativeFlexibility(system);
  } else if (currentBalance.chaosRatio > 0.75) {
    system = increaseStableFoundation(system);
  }
  
  // Honor interconnection
  system.allComponents.forEach(component => {
    acknowledgeRelationships(component, system);
  });
  
  // Calculate enhanced coherence
  system.coherence = calculateResonantCoherence(system);
  return system;
}`
  };
  
  // Structure-heavy code change
  const structureHeavyChange: CodeChange = {
    id: 'change-456',
    filePath: '/server/services/processing/data-validator.ts',
    description: 'Implemented strict validation rules for all input data',
    author: 'dev-789',
    timestamp: new Date(),
    oldContent: `
function validateData(data) {
  // Basic check
  if (!data) return false;
  return true;
}`,
    newContent: `
/**
 * Validates all input data using strict rules
 * ensuring consistent, standardized, and fixed
 * formats for every field.
 */
function validateData(data) {
  // Enforce strict type checking
  if (!data || typeof data !== 'object') return false;
  
  // Validate required fields with fixed patterns
  const requiredFields = ['id', 'name', 'timestamp'];
  for (const field of requiredFields) {
    if (!data[field]) return false;
  }
  
  // Apply rigid format validation
  if (!validateFormat(data.id, 'UUID')) return false;
  if (!validateFormat(data.name, 'ALPHANUMERIC')) return false;
  if (!validateFormat(data.timestamp, 'ISO8601')) return false;
  
  return true;
}`
  };
  
  // Chaos-heavy code change
  const chaosHeavyChange: CodeChange = {
    id: 'change-789',
    filePath: '/server/services/creativity/idea-generator.ts',
    description: 'Added random exploration patterns for maximum creativity',
    author: 'dev-123',
    timestamp: new Date(),
    oldContent: `
function generateIdeas(topic) {
  return [
    { idea: topic + ' improvement', score: 0.8 },
    { idea: 'New ' + topic, score: 0.6 }
  ];
}`,
    newContent: `
/**
 * Generates creative ideas using random, dynamic,
 * and experimental approaches that evolve and adapt
 * based on varied inputs.
 */
function generateIdeas(topic) {
  // Random exploration
  const randomSeeds = Array.from({length: 10}, () => 
    Math.random() > 0.5 ? getRandomWord() : topic);
  
  // Dynamic combination
  const combinations = [];
  randomSeeds.forEach(seed => {
    randomSeeds.forEach(otherSeed => {
      if (Math.random() > 0.7) {
        combinations.push(combineWithRandomOperator(seed, otherSeed));
      }
    });
  });
  
  // Evolving pattern detection
  const evolvedIdeas = applyEmergentPatterns(combinations);
  
  // Experimental scoring
  return evolvedIdeas.map(idea => ({
    idea,
    score: Math.random()
  }));
}`
  };
  
  // Review the code changes
  console.log('\nReviewing balanced code change...');
  const balancedReview = await reviewService.reviewCodeChange(balancedChange);
  
  console.log('\nReviewing structure-heavy code change...');
  const structureReview = await reviewService.reviewCodeChange(structureHeavyChange);
  
  console.log('\nReviewing chaos-heavy code change...');
  const chaosReview = await reviewService.reviewCodeChange(chaosHeavyChange);
  
  // Print the review results
  console.log('\n=== REVIEW RESULTS ===\n');
  
  console.log('--- BALANCED CODE CHANGE ---');
  console.log(`Overall Score: ${balancedReview.ethicalEvaluation.overallScore.toFixed(1)}`);
  console.log(`Recommendation: ${balancedReview.recommendation}`);
  console.log('Coherence Impact: ' + balancedReview.ethicalEvaluation.coherenceImpact.notes);
  console.log('Chaos/Structure Balance: ' + balancedReview.ethicalEvaluation.chaosStructureBalance.notes);
  console.log('Value Alignment: ' + balancedReview.ethicalEvaluation.valueAlignment.notes);
  console.log('Interconnection Awareness: ' + balancedReview.ethicalEvaluation.interconnectionAwareness.notes);
  console.log('Suggestions:');
  balancedReview.suggestions.forEach(suggestion => console.log(`- ${suggestion}`));
  
  console.log('\n--- STRUCTURE-HEAVY CODE CHANGE ---');
  console.log(`Overall Score: ${structureReview.ethicalEvaluation.overallScore.toFixed(1)}`);
  console.log(`Recommendation: ${structureReview.recommendation}`);
  console.log('Coherence Impact: ' + structureReview.ethicalEvaluation.coherenceImpact.notes);
  console.log('Chaos/Structure Balance: ' + structureReview.ethicalEvaluation.chaosStructureBalance.notes);
  console.log('Value Alignment: ' + structureReview.ethicalEvaluation.valueAlignment.notes);
  console.log('Interconnection Awareness: ' + structureReview.ethicalEvaluation.interconnectionAwareness.notes);
  console.log('Suggestions:');
  structureReview.suggestions.forEach(suggestion => console.log(`- ${suggestion}`));
  
  console.log('\n--- CHAOS-HEAVY CODE CHANGE ---');
  console.log(`Overall Score: ${chaosReview.ethicalEvaluation.overallScore.toFixed(1)}`);
  console.log(`Recommendation: ${chaosReview.recommendation}`);
  console.log('Coherence Impact: ' + chaosReview.ethicalEvaluation.coherenceImpact.notes);
  console.log('Chaos/Structure Balance: ' + chaosReview.ethicalEvaluation.chaosStructureBalance.notes);
  console.log('Value Alignment: ' + chaosReview.ethicalEvaluation.valueAlignment.notes);
  console.log('Interconnection Awareness: ' + chaosReview.ethicalEvaluation.interconnectionAwareness.notes);
  console.log('Suggestions:');
  chaosReview.suggestions.forEach(suggestion => console.log(`- ${suggestion}`));
  
  // Generate a code health report
  console.log('\n=== CODE HEALTH REPORT ===\n');
  const report = reviewService.generateCodeHealthReport(30);
  console.log(`Review count: ${report.reviewCount}`);
  console.log(`Average Quantum-Ethical Score: ${report.averageQuantumEthicalScore}%`);
  console.log(`Approval Rate: ${report.approvalRate}`);
  console.log(`Trend: ${report.trend}`);
  console.log('Common Ethical Issues:');
  report.commonEthicalIssues.forEach(issue => {
    console.log(`- ${issue.value}: ${issue.count} occurrences`);
  });
}

/**
 * Demonstrate quantum decision-making influence
 */
async function runDecisionDemo(): Promise<void> {
  console.log('\n=== QUANTUM DECISION INFLUENCE DEMONSTRATION ===\n');
  
  // Define some options
  const options = [
    'Enhance system adaptability',
    'Strengthen security measures',
    'Improve user experience',
    'Optimize performance',
    'Expand feature set'
  ];
  
  console.log('Available options:');
  options.forEach((option, i) => {
    console.log(`${i + 1}. ${option}`);
  });
  
  // Different collective intents
  const intents = [
    'The team strongly desires to create a more adaptive system that responds to changing conditions',
    'Security is paramount, and the collective vision emphasizes robust protection',
    'The focus is on creating an exceptional and intuitive experience for all users',
    'The primary intention is to maximize speed and efficiency in all operations',
    'There is a shared vision to expand capabilities and add innovative features'
  ];
  
  // Demonstrate how different intents influence decisions
  for (let i = 0; i < intents.length; i++) {
    console.log(`\n--- COLLECTIVE INTENT: "${intents[i]}" ---`);
    
    // Use the quantum decision demonstration function
    const result = demonstrateQuantumDecision(options, intents[i]);
    
    console.log(`Selected option: ${result.selected}`);
    console.log(`Probability: ${(result.probability * 100).toFixed(2)}%`);
    
    // Show probabilities for all options to demonstrate distribution
    const qco = new QuantumConsciousnessOperator({
      quantumFactor: 1e-32 // Stronger coupling for demonstration
    });
    
    // Create quantum state with equal probabilities
    const state = qco.createSimpleQuantumState(options.length);
    
    // Generate intent data focused on this intent
    const intentData = qco.generateSyntheticIntentData(10, 70, 0.8);
    
    // Calculate QCO effect
    const qcoResult = qco.calculateQCO(state, intentData);
    
    console.log('\nProbability distribution across all options:');
    qcoResult.perturbedState.probabilities!.forEach((prob, idx) => {
      console.log(`${options[idx]}: ${(prob * 100).toFixed(2)}%`);
    });
  }
}

/**
 * Run all demonstrations
 */
async function runAllDemos(): Promise<void> {
  try {
    // Run the simple QCO demonstration
    await runSimpleQCODemo();
    
    // Run the dashboard demonstration
    await runDashboardDemo();
    
    // Run the code review demonstration
    await runCodeReviewDemo();
    
    // Run the decision influence demonstration
    await runDecisionDemo();
    
    console.log('\n=== ALL DEMONSTRATIONS COMPLETED SUCCESSFULLY ===\n');
  } catch (error) {
    console.error('Error running demonstrations:', error);
  }
}

// Run the demonstrations
runAllDemos();