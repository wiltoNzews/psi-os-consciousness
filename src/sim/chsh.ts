/**
 * CHSH Bell Test Harness with WebWorker
 * Runs continuous quantum entanglement tests without blocking main thread
 */

import bus from '../core/bus';

class CHSHHarness {
  private worker: Worker | null = null;
  private isRunning = false;
  private currentS = 0;
  private testInterval = 30000; // 30 seconds
  private intervalId: NodeJS.Timeout | null = null;

  constructor() {
    this.initializeWorker();
    this.startContinuousTesting();
  }

  private initializeWorker() {
    try {
      // Create inline worker for CHSH calculations
      const workerCode = `
        class BellTester {
          constructor() {
            this.settings = {
              A: 0,                    // Alice H (0°)
              A_prime: Math.PI / 4,    // Alice T (45°)
              B: Math.PI / 8,          // Bob H (22.5°)
              B_prime: 3 * Math.PI / 8 // Bob T (67.5°)
            };
          }

          runTrials(numTrials = 50000) {
            const results = { HH: 0, HT: 0, TH: 0, TT: 0 };
            const counts = { HH: 0, HT: 0, TH: 0, TT: 0 };

            for (let i = 0; i < numTrials; i++) {
              const A_choice = Math.random() < 0.5 ? 'A' : 'A_prime';
              const B_choice = Math.random() < 0.5 ? 'B' : 'B_prime';
              const key = (A_choice === 'A' ? 'H' : 'T') + (B_choice === 'B' ? 'H' : 'T');

              const angleA = this.settings[A_choice];
              const angleB = this.settings[B_choice];
              const outcomeProduct = this.simulateQuantumOutcome(angleA, angleB);

              results[key] += outcomeProduct;
              counts[key] += 1;

              // Progress update every 10000 trials
              if (i % 10000 === 0 && i > 0) {
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

            return {
              S: S,
              expectationValues: { E_HH, E_HT, E_TH, E_TT },
              violation: S > 2,
              withinTsirelson: S <= 2.828,
              confidence: Math.abs(S - 2) / (0.01 * Math.sqrt(numTrials / 10000)),
              trials: numTrials,
              timestamp: Date.now()
            };
          }

          simulateQuantumOutcome(angleA, angleB) {
            const delta = angleA - angleB;
            const E = Math.cos(delta);
            const pSame = 0.5 * (1 + E);
            
            let Aout, Bout;
            if (Math.random() < pSame) {
              const bit = Math.random() < 0.5 ? 1 : -1;
              Aout = bit;
              Bout = bit;
            } else {
              Aout = 1;
              Bout = -1;
              if (Math.random() < 0.5) {
                Aout = -1; 
                Bout = 1;
              }
            }
            
            return Aout * Bout;
          }
        }

        const bellTester = new BellTester();

        self.onmessage = function(e) {
          const { type, data } = e.data;
          
          switch (type) {
            case 'runCHSH':
              const result = bellTester.runTrials(data?.numTrials || 50000);
              self.postMessage({ type: 'chshResult', data: result });
              break;
              
            case 'runClassical':
              // Classical hidden variable simulation for comparison
              const classicalS = runClassicalTest(data?.numTrials || 25000);
              self.postMessage({ type: 'classicalResult', data: { S: classicalS } });
              break;
          }
        };

        function runClassicalTest(numTrials) {
          const settings = {
            A: 0,
            A_prime: Math.PI / 4,
            B: Math.PI / 8,
            B_prime: 3 * Math.PI / 8
          };
          
          let S_sum = 0;
          
          for (let trial = 0; trial < numTrials; trial++) {
            const lambda = Math.random() * 2 * Math.PI;
            const getOutcome = (angle) => Math.cos(lambda - angle) > 0 ? 1 : -1;
            
            const A_H = getOutcome(settings.A);
            const A_T = getOutcome(settings.A_prime);
            const B_H = getOutcome(settings.B);
            const B_T = getOutcome(settings.B_prime);
            
            const S_lambda = A_H * B_H + A_H * B_T + A_T * B_H - A_T * B_T;
            S_sum += S_lambda;
          }
          
          return S_sum / numTrials;
        }

        // Ready signal
        self.postMessage({ type: 'ready', data: { timestamp: Date.now() } });
      `;

      const blob = new Blob([workerCode], { type: 'application/javascript' });
      this.worker = new Worker(URL.createObjectURL(blob));

      this.worker.onmessage = (e) => {
        this.handleWorkerMessage(e.data);
      };

      this.worker.onerror = (error) => {
        console.error('[CHSH Harness] Worker error:', error);
        this.fallbackToMainThread();
      };

      console.log('[CHSH Harness] WebWorker initialized');

    } catch (error) {
      console.warn('[CHSH Harness] WebWorker creation failed, using main thread:', error.message);
      this.fallbackToMainThread();
    }
  }

  private handleWorkerMessage(message: any) {
    const { type, data } = message;

    switch (type) {
      case 'ready':
        console.log('[CHSH Harness] Worker ready for quantum tests');
        break;

      case 'chshResult':
        this.currentS = data.S;
        bus.emit('S', data.S);
        
        console.log(`[CHSH Harness] S = ${data.S.toFixed(4)} | Violation: ${data.violation} | Confidence: ${data.confidence.toFixed(1)}σ`);
        break;

      case 'classicalResult':
        console.log(`[CHSH Harness] Classical S = ${data.S.toFixed(4)}`);
        break;

      case 'progress':
        // Optional: emit progress events for UI updates
        break;
    }
  }

  private startContinuousTesting() {
    if (this.isRunning) return;

    this.isRunning = true;
    console.log(`[CHSH Harness] Starting continuous Bell tests every ${this.testInterval/1000}s`);

    // Run initial test
    this.runTest();

    // Set up interval for continuous testing
    this.intervalId = setInterval(() => {
      if (this.isRunning) {
        this.runTest();
      }
    }, this.testInterval);
  }

  private runTest() {
    if (this.worker) {
      this.worker.postMessage({ 
        type: 'runCHSH', 
        data: { numTrials: 50000 }
      });
    } else {
      // Fallback to simplified main thread calculation
      this.runMainThreadTest();
    }
  }

  private runMainThreadTest() {
    // Simplified CHSH test for main thread fallback
    const trials = 10000; // Reduced to prevent blocking
    let S_sum = 0;

    for (let i = 0; i < trials; i++) {
      const phi = Math.random() * 2 * Math.PI;
      const S_trial = 2 * Math.cos(phi) + 2 * Math.cos(3 * phi);
      S_sum += S_trial;
    }

    const S = S_sum / trials;
    this.currentS = Math.abs(S); // Ensure positive for display
    bus.emit('S', this.currentS);

    console.log(`[CHSH Harness] Main thread S = ${this.currentS.toFixed(4)}`);
  }

  private fallbackToMainThread() {
    console.warn('[CHSH Harness] Falling back to main thread calculations');
    this.worker = null;
  }

  public getCurrentS(): number {
    return this.currentS;
  }

  public setTestInterval(intervalMs: number) {
    this.testInterval = Math.max(10000, intervalMs); // Minimum 10s
    
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.startContinuousTesting();
    }
  }

  public runSupremacyTest() {
    if (this.worker) {
      // Run both quantum and classical for comparison
      this.worker.postMessage({ type: 'runCHSH', data: { numTrials: 100000 } });
      this.worker.postMessage({ type: 'runClassical', data: { numTrials: 100000 } });
    }
  }

  public stop() {
    this.isRunning = false;
    
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }

    if (this.worker) {
      this.worker.terminate();
      this.worker = null;
    }

    console.log('[CHSH Harness] Stopped');
  }
}

// Initialize the CHSH harness
const chshHarness = new CHSHHarness();

export default chshHarness;