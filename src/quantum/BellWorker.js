/**
 * WebWorker for Bell Test CHSH calculations
 * Prevents main thread blocking during heavy Monte Carlo computation
 */

// Worker message handler
self.onmessage = function(e) {
  const { type, data } = e.data;
  
  switch (type) {
    case 'runCHSH':
      const result = runCHSHTest(data.numTrials || 25000);
      self.postMessage({ type: 'chshResult', data: result });
      break;
      
    case 'runClassical':
      const classicalResult = runClassicalTest(data.numTrials || 25000);
      self.postMessage({ type: 'classicalResult', data: classicalResult });
      break;
      
    case 'validateSupremacy':
      const supremacyResult = validateQuantumSupremacy(data.trials || 50000);
      self.postMessage({ type: 'supremacyResult', data: supremacyResult });
      break;
      
    default:
      console.warn('[Bell Worker] Unknown message type:', type);
  }
};

// CHSH Bell test implementation
function runCHSHTest(numTrials) {
  const startTime = performance.now();
  
  // Optimal angles for maximum CHSH violation
  const settings = {
    A: 0,                    // Alice H (0°)
    A_prime: Math.PI / 4,    // Alice T (45°)
    B: Math.PI / 8,          // Bob H (22.5°)
    B_prime: 3 * Math.PI / 8 // Bob T (67.5°)
  };
  
  const results = { HH: 0, HT: 0, TH: 0, TT: 0 };
  const counts = { HH: 0, HT: 0, TH: 0, TT: 0 };
  
  for (let i = 0; i < numTrials; i++) {
    const A_choice = Math.random() < 0.5 ? 'A' : 'A_prime';
    const B_choice = Math.random() < 0.5 ? 'B' : 'B_prime';
    const key = (A_choice === 'A' ? 'H' : 'T') + (B_choice === 'B' ? 'H' : 'T');
    
    const angleA = settings[A_choice];
    const angleB = settings[B_choice];
    const outcomeProduct = simulateQuantumOutcome(angleA, angleB);
    
    results[key] += outcomeProduct;
    counts[key] += 1;
    
    // Progress update every 5000 trials
    if (i % 5000 === 0 && i > 0) {
      self.postMessage({ 
        type: 'progress', 
        data: { completed: i, total: numTrials, percentage: (i / numTrials) * 100 }
      });
    }
  }
  
  // Calculate expectation values
  const E_HH = results.HH / (counts.HH || 1);
  const E_HT = results.HT / (counts.HT || 1);
  const E_TH = results.TH / (counts.TH || 1);
  const E_TT = results.TT / (counts.TT || 1);
  
  // CHSH S value
  const S = E_HH + E_HT + E_TH - E_TT;
  
  const executionTime = performance.now() - startTime;
  
  return {
    S: S,
    expectationValues: { E_HH, E_HT, E_TH, E_TT },
    violation: S > 2,
    withinTsirelson: S <= 2.828,
    confidence: Math.abs(S - 2) / (0.01 * Math.sqrt(numTrials / 10000)),
    trials: numTrials,
    executionTime: executionTime,
    timestamp: Date.now()
  };
}

// Simulate quantum entangled particle outcomes
function simulateQuantumOutcome(angleA, angleB) {
  const delta = angleA - angleB;
  const E = Math.cos(delta);
  
  // P(A == B) = (1 + E)/2, P(A != B) = (1 - E)/2
  const pSame = 0.5 * (1 + E);
  let Aout, Bout;
  
  if (Math.random() < pSame) {
    // Same outcomes
    const bit = Math.random() < 0.5 ? 1 : -1;
    Aout = bit;
    Bout = bit;
  } else {
    // Opposite outcomes
    Aout = 1;
    Bout = -1;
    if (Math.random() < 0.5) {
      Aout = -1; 
      Bout = 1;
    }
  }
  
  return Aout * Bout;
}

// Classical hidden variable simulation
function runClassicalTest(numTrials) {
  const startTime = performance.now();
  
  const settings = {
    A: 0,
    A_prime: Math.PI / 4,
    B: Math.PI / 8,
    B_prime: 3 * Math.PI / 8
  };
  
  let S_sum = 0;
  
  for (let trial = 0; trial < numTrials; trial++) {
    // Hidden variable λ uniformly distributed [0, 2π)
    const lambda = Math.random() * 2 * Math.PI;
    
    // Local realistic strategy: outcome = sign(cos(λ - θ))
    const getOutcome = (angle) => Math.cos(lambda - angle) > 0 ? 1 : -1;
    
    // Calculate all outcomes for this λ
    const A_H = getOutcome(settings.A);
    const A_T = getOutcome(settings.A_prime);
    const B_H = getOutcome(settings.B);
    const B_T = getOutcome(settings.B_prime);
    
    // CHSH combination for this λ
    const S_lambda = A_H * B_H + A_H * B_T + A_T * B_H - A_T * B_T;
    S_sum += S_lambda;
  }
  
  const S_classical = S_sum / numTrials;
  const executionTime = performance.now() - startTime;
  
  return {
    S: S_classical,
    violation: S_classical > 2,
    isClassical: true,
    trials: numTrials,
    executionTime: executionTime,
    timestamp: Date.now()
  };
}

// Validate quantum supremacy by comparing quantum vs classical
function validateQuantumSupremacy(trials) {
  const quantumResult = runCHSHTest(trials);
  const classicalResult = runClassicalTest(trials);
  
  const advantage = quantumResult.S - classicalResult.S;
  const isValid = quantumResult.S > 2 && quantumResult.S <= 2.828 && classicalResult.S <= 2;
  
  return {
    quantum: quantumResult,
    classical: classicalResult,
    advantage: advantage,
    isValidViolation: isValid,
    supremacyFactor: advantage / Math.abs(classicalResult.S),
    timestamp: Date.now()
  };
}

// High-quality random number generation for consistency
function getRandomValues(length) {
  if (typeof crypto !== 'undefined' && crypto.getRandomValues) {
    const array = new Uint32Array(length);
    crypto.getRandomValues(array);
    return Array.from(array).map(x => x / 0xFFFFFFFF);
  } else {
    // Fallback to Math.random()
    return Array.from({ length }, () => Math.random());
  }
}

// Initialization message
self.postMessage({ 
  type: 'ready', 
  data: { 
    workerReady: true, 
    timestamp: Date.now(),
    capabilities: ['chsh', 'classical', 'supremacy']
  }
});