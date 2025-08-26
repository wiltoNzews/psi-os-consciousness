/**
 * CHSH Bell Inequality Test Harness
 * Monte Carlo simulation with quantum entanglement violation
 * Based on advanced research implementation
 */

class BellTester {
  constructor() {
    // Define measurement angles (in radians) for optimal CHSH violation
    this.settings = {
      A: 0,                    // Alice's setting H (0°)
      A_prime: Math.PI / 4,    // Alice's setting T (45°)
      B: Math.PI / 8,          // Bob's setting H (22.5°)
      B_prime: 3 * Math.PI / 8 // Bob's setting T (67.5°)
    };
    
    this.results = { HH: 0, HT: 0, TH: 0, TT: 0 };
    this.counts = { HH: 0, HT: 0, TH: 0, TT: 0 };
    this.lastS = 0;
    this.violationHistory = [];
    this.isRunning = false;
  }

  // Simulate one pair of entangled particles for given settings
  _simulateOutcome(angleA, angleB) {
    // Quantum correlation: expectation E = cos(angleA - angleB)
    const delta = angleA - angleB;
    const E = Math.cos(delta);
    
    // Determine outcomes A and B (±1) with correlation E
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
    
    return Aout * Bout; // the product contributes to correlation
  }

  runTrials(numTrials = 10000) {
    // Reset accumulators
    this.results = { HH: 0, HT: 0, TH: 0, TT: 0 };
    this.counts = { HH: 0, HT: 0, TH: 0, TT: 0 };
    
    // Monte Carlo loop
    for (let i = 0; i < numTrials; i++) {
      const A_choice = Math.random() < 0.5 ? 'A' : 'A_prime';
      const B_choice = Math.random() < 0.5 ? 'B' : 'B_prime';
      const key = (A_choice === 'A' ? 'H' : 'T') + (B_choice === 'B' ? 'H' : 'T');
      
      const angleA = this.settings[A_choice];
      const angleB = this.settings[B_choice];
      const outcomeProduct = this._simulateOutcome(angleA, angleB);
      
      this.results[key] += outcomeProduct;
      this.counts[key] += 1;
    }
    
    // Compute expectation values for each combination
    const E_HH = this.results.HH / (this.counts.HH || 1);
    const E_HT = this.results.HT / (this.counts.HT || 1);
    const E_TH = this.results.TH / (this.counts.TH || 1);
    const E_TT = this.results.TT / (this.counts.TT || 1);
    
    // CHSH S value: E(AH, BH) + E(AH, BT) + E(AT, BH) - E(AT, BT)
    const S = E_HH + E_HT + E_TH - E_TT;
    
    this.lastS = S;
    this.violationHistory.push({
      timestamp: Date.now(),
      S: S,
      violation: S > 2,
      maxQuantum: 2 * Math.sqrt(2), // Tsirelson's bound ≈ 2.828
      trials: numTrials
    });
    
    // Keep only last 100 measurements
    if (this.violationHistory.length > 100) {
      this.violationHistory.shift();
    }
    
    return S;
  }

  startContinuousTest(intervalMs = 30000) {
    if (this.isRunning) return;
    
    this.isRunning = true;
    console.log(`[Bell Tester] Starting continuous CHSH test every ${intervalMs/1000}s`);
    
    // Run initial test
    this.runTrials(50000);
    
    this.intervalId = setInterval(() => {
      if (this.isRunning) {
        const S = this.runTrials(25000);
        const violation = S > 2;
        const confidence = Math.abs(S - 2) / 0.01; // rough confidence metric
        
        console.log(`[Bell Tester] CHSH S = ${S.toFixed(4)} | Violation: ${violation} | Confidence: ${confidence.toFixed(1)}σ`);
        
        // Dispatch custom event for UI updates
        if (typeof window !== 'undefined') {
          window.dispatchEvent(new CustomEvent('bellTestUpdate', {
            detail: {
              S: S,
              violation: violation,
              confidence: confidence,
              timestamp: Date.now()
            }
          }));
        }
      }
    }, intervalMs);
  }

  stopContinuousTest() {
    this.isRunning = false;
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
    console.log('[Bell Tester] Continuous test stopped');
  }

  getStatistics() {
    const recent = this.violationHistory.slice(-10);
    const avgS = recent.reduce((sum, entry) => sum + entry.S, 0) / recent.length;
    const violations = recent.filter(entry => entry.violation).length;
    const violationRate = violations / recent.length;
    
    return {
      currentS: this.lastS,
      averageS: avgS,
      violationRate: violationRate,
      totalTests: this.violationHistory.length,
      isQuantumViolating: this.lastS > 2,
      exceedsTsirelson: this.lastS > 2.828,
      confidenceLevel: Math.abs(this.lastS - 2) / 0.01,
      history: this.violationHistory
    };
  }

  // Simulate classical hidden variable model for comparison
  runClassicalTrials(numTrials = 10000) {
    let S_classical = 0;
    
    for (let trial = 0; trial < numTrials; trial++) {
      // Hidden variable λ uniformly distributed [0, 2π)
      const lambda = Math.random() * 2 * Math.PI;
      
      // Local realistic strategy: A = sign(cos(λ - θ_A)), B = sign(cos(λ - θ_B))
      const getOutcome = (angle) => Math.cos(lambda - angle) > 0 ? 1 : -1;
      
      // Test all four combinations
      const A_H = getOutcome(this.settings.A);
      const A_T = getOutcome(this.settings.A_prime);
      const B_H = getOutcome(this.settings.B);
      const B_T = getOutcome(this.settings.B_prime);
      
      // CHSH combination for this λ
      const S_lambda = A_H * B_H + A_H * B_T + A_T * B_H - A_T * B_T;
      S_classical += S_lambda;
    }
    
    return S_classical / numTrials;
  }

  validateQuantumSupremacy() {
    const quantumS = this.runTrials(100000);
    const classicalS = this.runClassicalTrials(100000);
    
    const supremacy = {
      quantumS: quantumS,
      classicalS: classicalS,
      advantage: quantumS - classicalS,
      violatesClassical: quantumS > 2,
      withinTsirelson: quantumS <= 2.828,
      isValid: quantumS > 2 && quantumS <= 2.828 && classicalS <= 2
    };
    
    console.log(`[Bell Tester] Quantum Supremacy Test:`);
    console.log(`  Quantum S: ${quantumS.toFixed(4)}`);
    console.log(`  Classical S: ${classicalS.toFixed(4)}`);
    console.log(`  Advantage: ${supremacy.advantage.toFixed(4)}`);
    console.log(`  Valid Violation: ${supremacy.isValid}`);
    
    return supremacy;
  }
}

export default BellTester;