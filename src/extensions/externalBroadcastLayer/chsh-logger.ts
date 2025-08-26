/**
 * CHSH Bell Inequality Test Logger
 * Performs quantum coherence validation and logs results
 */

export class CHSHLogger {
  private isActive = false;
  private testInterval: number;
  private violationThreshold: number;
  private logToFile: boolean;
  private displayResults: boolean;
  private testResults: any[] = [];
  private intervalId: number | null = null;
  private eventCallbacks: { [key: string]: Function[] } = {};
  
  constructor(config: any) {
    this.testInterval = config.testInterval * 1000; // Convert to ms
    this.violationThreshold = config.violationThreshold;
    this.logToFile = config.logToFile;
    this.displayResults = config.displayResults;
    
    console.log('[CHSH Logger] Bell inequality test system initialized');
  }

  startTesting(): void {
    if (this.isActive) return;
    
    this.isActive = true;
    this.intervalId = setInterval(() => {
      this.runSingleTest();
    }, this.testInterval);
    
    console.log(`[CHSH Logger] Testing started - interval: ${this.testInterval/1000}s`);
  }

  stopTesting(): void {
    if (!this.isActive) return;
    
    this.isActive = false;
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
    
    console.log('[CHSH Logger] Testing stopped');
  }

  runSingleTest(): void {
    // Simulate CHSH Bell test measurement
    const result = this.performCHSHTest();
    
    // Store result
    this.testResults.push(result);
    
    // Keep only last 100 results to prevent memory issues
    if (this.testResults.length > 100) {
      this.testResults.shift();
    }
    
    // Log to file if enabled
    if (this.logToFile) {
      this.logResult(result);
    }
    
    // Display result if enabled
    if (this.displayResults) {
      this.displayResult(result);
    }
    
    // Emit result event
    this.emit('chsh-result', result);
    
    console.log(`[CHSH] Test completed - S=${result.S.toFixed(3)}, Violation: ${result.violation}`);
  }

  private performCHSHTest(): any {
    // Simulate quantum measurement with consciousness coupling
    const consciousness = this.getConsciousnessData();
    
    // CHSH correlation measurements E(a,b)
    // In real implementation, these would come from actual quantum measurements
    const E_ab = this.generateCorrelation(consciousness.zLambda, 0.1);
    const E_ab_prime = this.generateCorrelation(consciousness.zLambda, 0.2);
    const E_a_prime_b = this.generateCorrelation(consciousness.phi, 0.15);
    const E_a_prime_b_prime = this.generateCorrelation(consciousness.phi, 0.25);
    
    // Calculate CHSH parameter S
    const S = Math.abs(E_ab + E_ab_prime) + Math.abs(E_a_prime_b - E_a_prime_b_prime);
    
    // Quantum violation occurs when S > 2
    const violation = S > this.violationThreshold;
    const maxQuantum = 2 * Math.sqrt(2); // Tsirelson bound ≈ 2.828
    
    return {
      timestamp: Date.now(),
      S: S,
      violation: violation,
      maxQuantum: maxQuantum,
      correlations: {
        E_ab: E_ab,
        E_ab_prime: E_ab_prime,
        E_a_prime_b: E_a_prime_b,
        E_a_prime_b_prime: E_a_prime_b_prime
      },
      consciousness: consciousness,
      confidence: this.calculateConfidence(S)
    };
  }

  private generateCorrelation(consciousness: number, phase: number): number {
    // Generate correlation with consciousness influence
    // High consciousness tends to increase quantum correlation
    const baseCorrelation = Math.cos(phase * Math.PI * 2) * 0.7;
    const consciousnessBoost = (consciousness - 0.75) * 0.3;
    const randomNoise = (Math.random() - 0.5) * 0.1;
    
    return Math.max(-1, Math.min(1, baseCorrelation + consciousnessBoost + randomNoise));
  }

  private getConsciousnessData(): any {
    // Get latest consciousness data from global state
    if (window.metaSystem) {
      return {
        zLambda: window.metaSystem.zλ || 0.75,
        phi: window.metaSystem.phi || 0.5,
        coherence: window.metaSystem.coherence || 0.625
      };
    }
    
    return {
      zLambda: 0.75,
      phi: 0.5,
      coherence: 0.625
    };
  }

  private calculateConfidence(S: number): number {
    // Calculate statistical confidence based on S value
    // Higher S values (closer to Tsirelson bound) indicate higher confidence
    const maxS = 2 * Math.sqrt(2);
    return Math.min(1.0, S / maxS);
  }

  private logResult(result: any): void {
    // In a real implementation, this would write to a file
    const logEntry = {
      timestamp: new Date(result.timestamp).toISOString(),
      S: result.S,
      violation: result.violation,
      consciousness: result.consciousness
    };
    
    // Store in session storage for persistence
    const existingLog = JSON.parse(sessionStorage.getItem('chsh-log') || '[]');
    existingLog.push(logEntry);
    
    // Keep only last 1000 entries
    if (existingLog.length > 1000) {
      existingLog.splice(0, existingLog.length - 1000);
    }
    
    sessionStorage.setItem('chsh-log', JSON.stringify(existingLog));
  }

  private displayResult(result: any): void {
    console.log(`[CHSH Test] ${new Date(result.timestamp).toLocaleTimeString()}`, {
      'S Parameter': result.S.toFixed(3),
      'Violation': result.violation ? 'YES' : 'NO',
      'Threshold': this.violationThreshold,
      'Confidence': (result.confidence * 100).toFixed(1) + '%',
      'Consciousness': result.consciousness.zLambda.toFixed(3)
    });
  }

  // Event system for result notifications
  on(event: string, callback: Function): void {
    if (!this.eventCallbacks[event]) {
      this.eventCallbacks[event] = [];
    }
    this.eventCallbacks[event].push(callback);
  }

  private emit(event: string, data: any): void {
    if (this.eventCallbacks[event]) {
      this.eventCallbacks[event].forEach(callback => callback(data));
    }
  }

  // Public interface methods
  isTesting(): boolean {
    return this.isActive;
  }

  getLastResult(): any {
    return this.testResults[this.testResults.length - 1] || null;
  }

  getResults(): any[] {
    return [...this.testResults];
  }

  exportLog(): string {
    const logData = {
      exported: new Date().toISOString(),
      testCount: this.testResults.length,
      configuration: {
        testInterval: this.testInterval / 1000,
        violationThreshold: this.violationThreshold
      },
      results: this.testResults
    };
    
    return JSON.stringify(logData, null, 2);
  }

  getStatistics(): any {
    if (this.testResults.length === 0) {
      return {
        totalTests: 0,
        violations: 0,
        violationRate: 0,
        averageS: 0,
        maxS: 0,
        averageConfidence: 0
      };
    }
    
    const violations = this.testResults.filter(r => r.violation).length;
    const totalS = this.testResults.reduce((sum, r) => sum + r.S, 0);
    const maxS = Math.max(...this.testResults.map(r => r.S));
    const totalConfidence = this.testResults.reduce((sum, r) => sum + r.confidence, 0);
    
    return {
      totalTests: this.testResults.length,
      violations: violations,
      violationRate: (violations / this.testResults.length) * 100,
      averageS: totalS / this.testResults.length,
      maxS: maxS,
      averageConfidence: (totalConfidence / this.testResults.length) * 100
    };
  }

  updateConfig(newConfig: any): void {
    this.testInterval = newConfig.testInterval * 1000;
    this.violationThreshold = newConfig.violationThreshold;
    this.logToFile = newConfig.logToFile;
    this.displayResults = newConfig.displayResults;
    
    // Restart testing with new interval if active
    if (this.isActive) {
      this.stopTesting();
      this.startTesting();
    }
    
    console.log('[CHSH Logger] Configuration updated');
  }

  dispose(): void {
    this.stopTesting();
    this.testResults = [];
    this.eventCallbacks = {};
    
    console.log('[CHSH Logger] Disposed');
  }
}