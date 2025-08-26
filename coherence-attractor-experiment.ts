/**
 * Coherence Attractor Experiment
 * 
 * This script implements the experimental protocol outlined in COHERENCE_ATTRACTOR_EXPERIMENT.md
 * to test whether the 0.7500 coherence value is a true attractor state in WILTON's phase space.
 * 
 * The experiment perturbs the system away from 0.7500 coherence and measures its return trajectory.
 * 
 * [QUANTUM_STATE: EXPERIMENTAL_FLOW]
 */

import WebSocket from 'ws';
import fs from 'fs';
import path from 'path';

// Types for experiment data
interface Measurement {
  timestamp: number;
  cycle: number;
  naturalCoherence: number;
  forcedCoherence: number | null;
  perturbationActive: boolean;
  qctf: number;
  variantCount: number;
  returnTime?: number;
  systemState: any;
}

interface ExperimentConfig {
  server: string;
  phases: {
    name: string;
    perturbationTargets: number[];
    sustainCycles: number;
    recoveryObservationCycles: number;
    repetitions: number;
  }[];
}

interface ExperimentReport {
  experimentName: string;
  startTime: string;
  endTime: string;
  config: ExperimentConfig;
  phases: {
    name: string;
    results: {
      target: number;
      repetition: number;
      measurements: Measurement[];
      returnTime: number | null;
      stableAtTarget: boolean;
      summary: {
        averageCoherence: number;
        coherenceStdDev: number;
        finalCoherence: number;
        averageQctf: number;
        variantCountRange: [number, number];
      };
    }[];
    summary: {
      averageReturnTime: number | null;
      allReturnedToBaseline: boolean;
      alternativeAttractorsFound: boolean;
    };
  }[];
  summary: {
    isAttractor: boolean;
    attractorStrength: 'very weak' | 'weak' | 'moderate' | 'strong' | 'very strong';
    alternativeAttractorsFound: boolean;
    averageReturnTime: number | null;
    notes: string[];
  };
}

// Coherence Attractor Experiment class
class CoherenceAttractorExperiment {
  private ws: WebSocket | null = null;
  private connected = false;
  private targetCoherence: number | null = null;
  private perturbationActive = false;
  private cyclesRemaining = 0;
  private recoveryObservationCycles = 0;
  private measurements: Measurement[] = [];
  private currentPhase: string = 'idle';
  private currentTarget: number = 0;
  private currentRepetition: number = 0;
  private phasePlan: any[] = [];
  private phaseIndex = 0;
  private experimentStartTime: Date | null = null;
  private experimentName: string = '';
  private phaseResults: any[] = [];
  private baselineCoherence: number = 0.7500; // Expected baseline
  private baselineAttractorTolerance: number = 0.0001; // How close to consider "returned to baseline"
  private reportFile: string = '';
  private config: ExperimentConfig;
  
  constructor(config: ExperimentConfig) {
    this.config = config;
  }
  
  // Connect to the server
  public async connect(): Promise<boolean> {
    return new Promise((resolve) => {
      console.log(`[EXPERIMENT] Connecting to ${this.config.server}...`);
      this.ws = new WebSocket(this.config.server);
      
      this.ws.on('open', () => {
        console.log('[EXPERIMENT] WebSocket connected');
        this.connected = true;
        this.sendMessage({ type: 'connected', payload: { client: 'coherence-experiment' } });
        resolve(true);
      });
      
      this.ws.on('message', (data: WebSocket.Data) => {
        const message = JSON.parse(data.toString());
        this.handleMessage(message);
      });
      
      this.ws.on('close', () => {
        console.log('[EXPERIMENT] WebSocket disconnected');
        this.connected = false;
      });
      
      this.ws.on('error', (error) => {
        console.error('[EXPERIMENT] WebSocket error:', error);
        resolve(false);
      });
    });
  }
  
  // Start the experiment
  public async startExperiment(name: string): Promise<void> {
    if (!this.connected) {
      throw new Error('Not connected to server');
    }
    
    this.experimentName = name;
    this.experimentStartTime = new Date();
    this.phaseIndex = 0;
    this.phasePlan = [];
    this.phaseResults = [];
    this.measurements = [];
    
    console.log(`[EXPERIMENT] Starting experiment: ${name}`);
    
    // Establish baseline
    await this.runBaselinePhase();
    
    // Run each phase from the config
    for (const phase of this.config.phases) {
      await this.runPhase(phase);
    }
    
    // Generate final report
    this.generateReport();
  }
  
  // Run the baseline phase to confirm stable coherence at 0.7500
  private async runBaselinePhase(): Promise<void> {
    console.log('[EXPERIMENT] Establishing baseline coherence...');
    this.currentPhase = 'baseline';
    this.measurements = [];
    
    // Run 50 cycles to establish baseline
    for (let cycle = 1; cycle <= 50; cycle++) {
      await this.triggerCycle(cycle);
      await this.sleep(200); // Small delay between cycles
    }
    
    // Calculate baseline stats
    const coherenceValues = this.measurements.map(m => m.naturalCoherence);
    const avgCoherence = coherenceValues.reduce((sum, val) => sum + val, 0) / coherenceValues.length;
    const variance = coherenceValues.reduce((sum, val) => sum + Math.pow(val - avgCoherence, 2), 0) / coherenceValues.length;
    const stdDev = Math.sqrt(variance);
    
    console.log(`[EXPERIMENT] Baseline established:`);
    console.log(`[EXPERIMENT] - Average coherence: ${avgCoherence.toFixed(6)}`);
    console.log(`[EXPERIMENT] - Coherence std dev: ${stdDev.toFixed(6)}`);
    
    this.baselineCoherence = avgCoherence;
    
    // Save baseline results
    this.phaseResults.push({
      name: 'baseline',
      results: [{
        target: null,
        repetition: 0,
        measurements: [...this.measurements],
        returnTime: null,
        stableAtTarget: true,
        summary: {
          averageCoherence: avgCoherence,
          coherenceStdDev: stdDev,
          finalCoherence: this.measurements[this.measurements.length - 1].naturalCoherence,
          averageQctf: this.measurements.reduce((sum, m) => sum + m.qctf, 0) / this.measurements.length,
          variantCountRange: [
            Math.min(...this.measurements.map(m => m.variantCount)),
            Math.max(...this.measurements.map(m => m.variantCount))
          ]
        }
      }],
      summary: {
        averageReturnTime: null,
        allReturnedToBaseline: true,
        alternativeAttractorsFound: false
      }
    });
  }
  
  // Run a single experimental phase
  private async runPhase(phase: any): Promise<void> {
    console.log(`[EXPERIMENT] Starting phase: ${phase.name}`);
    this.currentPhase = phase.name;
    const phaseResults: any[] = [];
    
    // Run each perturbation target with repetitions
    for (const target of phase.perturbationTargets) {
      for (let rep = 1; rep <= phase.repetitions; rep++) {
        console.log(`[EXPERIMENT] Target coherence: ${target}, repetition ${rep}/${phase.repetitions}`);
        this.currentTarget = target;
        this.currentRepetition = rep;
        this.measurements = [];
        
        // Start perturbation
        await this.startPerturbation(target, phase.sustainCycles);
        
        // Wait for the perturbation to complete
        for (let cycle = 1; cycle <= phase.sustainCycles; cycle++) {
          await this.triggerCycle(cycle);
          await this.sleep(200);
        }
        
        // Release perturbation and observe recovery
        this.releasePerturbation();
        console.log(`[EXPERIMENT] Perturbation released, observing recovery...`);
        
        // Observe recovery
        this.recoveryObservationCycles = phase.recoveryObservationCycles;
        for (let cycle = 1; cycle <= phase.recoveryObservationCycles; cycle++) {
          await this.triggerCycle(cycle);
          await this.sleep(200);
        }
        
        // Calculate return time
        const returnTime = this.calculateReturnTime();
        const stableAtTarget = this.checkIfStableAtTarget();
        
        // Store results
        phaseResults.push({
          target,
          repetition: rep,
          measurements: [...this.measurements],
          returnTime,
          stableAtTarget,
          summary: this.calculateSummary()
        });
        
        // Short break between repetitions
        await this.sleep(1000);
      }
    }
    
    // Calculate phase summary
    const validReturnTimes = phaseResults
      .filter(r => r.returnTime !== null)
      .map(r => r.returnTime);
    
    const phaseSummary = {
      averageReturnTime: validReturnTimes.length > 0 
        ? validReturnTimes.reduce((sum, t) => sum + t, 0) / validReturnTimes.length 
        : null,
      allReturnedToBaseline: phaseResults.every(r => 
        !r.stableAtTarget || 
        Math.abs(r.summary.finalCoherence - this.baselineCoherence) <= this.baselineAttractorTolerance
      ),
      alternativeAttractorsFound: phaseResults.some(r => 
        r.stableAtTarget && 
        Math.abs(r.summary.finalCoherence - this.baselineCoherence) > this.baselineAttractorTolerance
      )
    };
    
    // Store phase results
    this.phaseResults.push({
      name: phase.name,
      results: phaseResults,
      summary: phaseSummary
    });
  }
  
  // Start a perturbation experiment
  private startPerturbation(targetCoherence: number, sustainCycles: number): void {
    this.targetCoherence = targetCoherence;
    this.perturbationActive = true;
    this.cyclesRemaining = sustainCycles;
    
    console.log(`[EXPERIMENT] Starting perturbation to ${targetCoherence} for ${sustainCycles} cycles`);
  }
  
  // Release the perturbation and allow natural recovery
  private releasePerturbation(): void {
    this.perturbationActive = false;
    this.targetCoherence = null;
    
    console.log('[EXPERIMENT] Releasing perturbation, allowing natural recovery');
  }
  
  // Intercept coherence calculation
  private interceptCoherence(calculatedCoherence: number): number {
    // If perturbation is active, return the target value instead
    if (this.perturbationActive && this.targetCoherence !== null) {
      if (this.cyclesRemaining > 0) {
        this.cyclesRemaining--;
      } else {
        this.releasePerturbation();
      }
      
      return this.targetCoherence;
    }
    
    // Otherwise return the natural value
    return calculatedCoherence;
  }
  
  // Calculate how long it took to return to 0.7500±0.0001
  private calculateReturnTime(): number | null {
    // Find all measurements after perturbation released
    const recoveryMeasurements = this.measurements.filter(m => !m.perturbationActive);
    if (recoveryMeasurements.length === 0) return null;
    
    // Find the first measurement where coherence is within tolerance of baseline
    const returnPoint = recoveryMeasurements.findIndex(m => 
      Math.abs(m.naturalCoherence - this.baselineCoherence) <= this.baselineAttractorTolerance
    );
    
    if (returnPoint === -1) return null;
    
    // Return the number of cycles it took
    return returnPoint + 1;
  }
  
  // Check if the system stabilized at the target instead of returning to baseline
  private checkIfStableAtTarget(): boolean {
    // We need at least 10 measurements after perturbation to check stability
    const recoveryMeasurements = this.measurements.filter(m => !m.perturbationActive);
    if (recoveryMeasurements.length < 10) return false;
    
    // Get the last 10 measurements
    const lastMeasurements = recoveryMeasurements.slice(-10);
    
    // Calculate mean and standard deviation
    const coherenceValues = lastMeasurements.map(m => m.naturalCoherence);
    const mean = coherenceValues.reduce((sum, val) => sum + val, 0) / coherenceValues.length;
    const variance = coherenceValues.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) / coherenceValues.length;
    const stdDev = Math.sqrt(variance);
    
    // Check if it's stable (low std dev) and not at baseline
    return stdDev < 0.001 && Math.abs(mean - this.baselineCoherence) > this.baselineAttractorTolerance;
  }
  
  // Calculate summary statistics for the current set of measurements
  private calculateSummary(): any {
    const coherenceValues = this.measurements.map(m => m.naturalCoherence);
    const qctfValues = this.measurements.map(m => m.qctf);
    const variantCounts = this.measurements.map(m => m.variantCount);
    
    const avgCoherence = coherenceValues.reduce((sum, val) => sum + val, 0) / coherenceValues.length;
    const variance = coherenceValues.reduce((sum, val) => sum + Math.pow(val - avgCoherence, 2), 0) / coherenceValues.length;
    const stdDev = Math.sqrt(variance);
    
    return {
      averageCoherence: avgCoherence,
      coherenceStdDev: stdDev,
      finalCoherence: coherenceValues[coherenceValues.length - 1],
      averageQctf: qctfValues.reduce((sum, val) => sum + val, 0) / qctfValues.length,
      variantCountRange: [Math.min(...variantCounts), Math.max(...variantCounts)]
    };
  }
  
  // Handle incoming WebSocket messages
  private handleMessage(message: any): void {
    if (message.type === 'trigger_cycle_response') {
      // Extract data from the response
      const success = message.success && message.payload.success;
      
      if (success) {
        const metrics = message.payload.metrics;
        const naturalCoherence = metrics.systemMetrics.CI; // The natural coherence calculated by the system
        const qctf = metrics.systemMetrics.CTF;
        const variantCount = metrics.variantCount;
        const cycle = metrics.validationCycle;
        
        // Record the measurement
        this.recordMeasurement({
          timestamp: Date.now(),
          cycle: cycle,
          naturalCoherence: naturalCoherence,
          forcedCoherence: this.perturbationActive ? this.targetCoherence : null,
          perturbationActive: this.perturbationActive,
          qctf: qctf,
          variantCount: variantCount,
          systemState: { ...metrics.systemMetrics }
        });
      } else {
        console.error('[EXPERIMENT] Cycle trigger failed:', message);
      }
    }
  }
  
  // Record a measurement
  private recordMeasurement(measurement: Measurement): void {
    this.measurements.push(measurement);
    
    // Log every 5 measurements for visibility
    if (this.measurements.length % 5 === 0 || this.measurements.length <= 2) {
      console.log(`[EXPERIMENT] Measurement #${this.measurements.length}:`);
      console.log(`  - Natural coherence: ${measurement.naturalCoherence.toFixed(6)}`);
      console.log(`  - Forced coherence: ${measurement.forcedCoherence !== null ? measurement.forcedCoherence.toFixed(6) : 'none'}`);
      console.log(`  - Perturbation active: ${measurement.perturbationActive}`);
      console.log(`  - QCTF: ${measurement.qctf.toFixed(6)}`);
      console.log(`  - Variant count: ${measurement.variantCount}`);
    }
  }
  
  // Trigger a system cycle
  private async triggerCycle(cycle: number): Promise<void> {
    return new Promise((resolve, reject) => {
      if (!this.ws || !this.connected) {
        reject(new Error('Not connected'));
        return;
      }
      
      // If we're in a perturbation phase, we need to intercept the coherence value
      // This is implementation-dependent and would need to be adapted to the actual system API
      if (this.perturbationActive && this.targetCoherence !== null) {
        // In a real implementation, we'd need to find a way to force the coherence value
        // This might involve modifying system parameters or injecting values
        this.sendMessage({
          type: 'override_coherence',
          payload: {
            value: this.targetCoherence,
            cycle: cycle
          }
        });
      }
      
      // Trigger a cycle
      this.sendMessage({
        type: 'trigger_cycle',
        payload: {
          cycle: cycle,
          experiment: this.experimentName,
          phase: this.currentPhase,
          target: this.currentTarget,
          repetition: this.currentRepetition
        }
      });
      
      // In a real implementation, we'd wait for a response with the results
      // For this demo, we'll just resolve after a short delay
      setTimeout(resolve, 100);
    });
  }
  
  // Generate a report of the experiment results
  private generateReport(): void {
    const experimentEndTime = new Date();
    
    // Calculate overall summary
    const hasAlternativeAttractors = this.phaseResults.some(p => p.summary.alternativeAttractorsFound);
    
    // Calculate average return time across all phases
    const allReturnTimes: number[] = [];
    this.phaseResults.forEach(phase => {
      if (phase.name !== 'baseline') {
        phase.results.forEach((result: any) => {
          if (result.returnTime !== null) {
            allReturnTimes.push(result.returnTime);
          }
        });
      }
    });
    
    const avgReturnTime = allReturnTimes.length > 0 
      ? allReturnTimes.reduce((sum, t) => sum + t, 0) / allReturnTimes.length 
      : null;
    
    // Determine attractor strength based on return times and success rate
    let attractorStrength: 'very weak' | 'weak' | 'moderate' | 'strong' | 'very strong' = 'moderate';
    const returnSuccess = allReturnTimes.length / (this.phaseResults.length > 1 ? 
      this.phaseResults.slice(1).reduce((sum, p) => sum + p.results.length, 0) : 1);
    
    if (returnSuccess > 0.95 && avgReturnTime !== null && avgReturnTime < 3) {
      attractorStrength = 'very strong';
    } else if (returnSuccess > 0.85 && avgReturnTime !== null && avgReturnTime < 5) {
      attractorStrength = 'strong';
    } else if (returnSuccess > 0.7 && avgReturnTime !== null && avgReturnTime < 10) {
      attractorStrength = 'moderate';
    } else if (returnSuccess > 0.5) {
      attractorStrength = 'weak';
    } else {
      attractorStrength = 'very weak';
    }
    
    // Generate notes
    const notes: string[] = [];
    
    if (hasAlternativeAttractors) {
      notes.push('Alternative attractors detected. The system stabilized at coherence values other than 0.7500 in some tests.');
    } else {
      notes.push('No alternative attractors detected. The system consistently returned to 0.7500 coherence when perturbed.');
    }
    
    if (avgReturnTime !== null) {
      notes.push(`Average return time to baseline was ${avgReturnTime.toFixed(2)} cycles.`);
    }
    
    // Build the full report
    const report: ExperimentReport = {
      experimentName: this.experimentName,
      startTime: this.experimentStartTime ? this.experimentStartTime.toISOString() : new Date().toISOString(),
      endTime: experimentEndTime.toISOString(),
      config: this.config,
      phases: this.phaseResults,
      summary: {
        isAttractor: returnSuccess > 0.7,
        attractorStrength,
        alternativeAttractorsFound: hasAlternativeAttractors,
        averageReturnTime: avgReturnTime,
        notes
      }
    };
    
    // Save the report
    const reportsDir = path.join(process.cwd(), 'experiment-results');
    if (!fs.existsSync(reportsDir)) {
      fs.mkdirSync(reportsDir, { recursive: true });
    }
    
    const timestamp = Date.now();
    const reportFile = path.join(reportsDir, `attractor-experiment-${timestamp}.json`);
    const summaryFile = path.join(reportsDir, `attractor-experiment-summary-${timestamp}.md`);
    
    fs.writeFileSync(reportFile, JSON.stringify(report, null, 2));
    
    // Generate a human-readable summary
    const summary = this.generateHumanReadableSummary(report);
    fs.writeFileSync(summaryFile, summary);
    
    this.reportFile = reportFile;
    
    console.log(`[EXPERIMENT] Experiment completed.`);
    console.log(`[EXPERIMENT] Full report saved to: ${reportFile}`);
    console.log(`[EXPERIMENT] Summary saved to: ${summaryFile}`);
    console.log(`[EXPERIMENT] Summary:`);
    console.log(summary);
  }
  
  // Generate a human-readable summary
  private generateHumanReadableSummary(report: ExperimentReport): string {
    let summary = `# Coherence Attractor Experiment Summary\n\n`;
    summary += `Experiment: ${report.experimentName}\n`;
    summary += `Start Time: ${new Date(report.startTime).toLocaleString()}\n`;
    summary += `End Time: ${new Date(report.endTime).toLocaleString()}\n\n`;
    
    summary += `## Overall Results\n\n`;
    summary += `- **Is 0.7500 an attractor?** ${report.summary.isAttractor ? 'YES' : 'NO'}\n`;
    summary += `- **Attractor Strength:** ${report.summary.attractorStrength.toUpperCase()}\n`;
    summary += `- **Alternative Attractors Found:** ${report.summary.alternativeAttractorsFound ? 'YES' : 'NO'}\n`;
    
    if (report.summary.averageReturnTime !== null) {
      summary += `- **Average Return Time:** ${report.summary.averageReturnTime.toFixed(2)} cycles\n`;
    }
    
    summary += `\n## Notes\n\n`;
    report.summary.notes.forEach(note => {
      summary += `- ${note}\n`;
    });
    
    summary += `\n## Phase Results\n\n`;
    
    report.phases.forEach(phase => {
      summary += `### ${phase.name.toUpperCase()}\n\n`;
      
      if (phase.name === 'baseline') {
        const baselineResult = phase.results[0];
        summary += `- Average Coherence: ${baselineResult.summary.averageCoherence.toFixed(6)}\n`;
        summary += `- Coherence Std Dev: ${baselineResult.summary.coherenceStdDev.toFixed(6)}\n`;
        summary += `- Average QCTF: ${baselineResult.summary.averageQctf.toFixed(6)}\n`;
        summary += `- Variant Count Range: ${baselineResult.summary.variantCountRange[0]} - ${baselineResult.summary.variantCountRange[1]}\n\n`;
      } else {
        summary += `- All Returned to Baseline: ${phase.summary.allReturnedToBaseline ? 'YES' : 'NO'}\n`;
        summary += `- Alternative Attractors Found: ${phase.summary.alternativeAttractorsFound ? 'YES' : 'NO'}\n`;
        
        if (phase.summary.averageReturnTime !== null) {
          summary += `- Average Return Time: ${phase.summary.averageReturnTime.toFixed(2)} cycles\n`;
        }
        
        summary += `\n**Perturbation Results:**\n\n`;
        
        phase.results.forEach((result: any) => {
          summary += `#### Target: ${result.target.toFixed(4)}, Repetition: ${result.repetition}\n`;
          summary += `- Return Time: ${result.returnTime !== null ? `${result.returnTime} cycles` : 'Did not return'}\n`;
          summary += `- Stable at Target: ${result.stableAtTarget ? 'YES' : 'NO'}\n`;
          summary += `- Final Coherence: ${result.summary.finalCoherence.toFixed(6)}\n`;
          summary += `- Average QCTF: ${result.summary.averageQctf.toFixed(6)}\n`;
          summary += `- Variant Count Range: ${result.summary.variantCountRange[0]} - ${result.summary.variantCountRange[1]}\n\n`;
        });
      }
    });
    
    summary += `\n## Conclusion\n\n`;
    
    if (report.summary.isAttractor) {
      if (report.summary.attractorStrength === 'very strong' || report.summary.attractorStrength === 'strong') {
        summary += `The experiment provides **strong evidence** that 0.7500 coherence is a robust attractor state in WILTON's phase space. The system consistently returns to this value when perturbed, with a relatively quick return time.`;
      } else if (report.summary.attractorStrength === 'moderate') {
        summary += `The experiment provides **moderate evidence** that 0.7500 coherence is an attractor state in WILTON's phase space. The system generally returns to this value when perturbed, though with some variability.`;
      } else {
        summary += `The experiment provides **weak evidence** that 0.7500 coherence is an attractor state in WILTON's phase space. The system sometimes returns to this value when perturbed, but not consistently or quickly.`;
      }
    } else {
      summary += `The experiment **does not support** the hypothesis that 0.7500 coherence is an attractor state in WILTON's phase space. The system frequently failed to return to this value when perturbed.`;
    }
    
    if (report.summary.alternativeAttractorsFound) {
      summary += `\n\nInterestingly, the system exhibited alternative stable states beyond 0.7500, suggesting a more complex phase space with multiple attractors.`;
    } else {
      summary += `\n\nNo alternative stable states were observed, supporting the hypothesis that 0.7500 is a unique attractor in the system's phase space.`;
    }
    
    return summary;
  }
  
  // Send a message via WebSocket
  private sendMessage(message: any): void {
    if (this.ws && this.connected) {
      this.ws.send(JSON.stringify(message));
    }
  }
  
  // Utility function to sleep for a specified time
  private async sleep(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
  
  // Close the WebSocket connection
  public close(): void {
    if (this.ws) {
      this.ws.close();
      this.ws = null;
      this.connected = false;
    }
  }
}

// Configuration for the experiment
const experimentConfig: ExperimentConfig = {
  server: 'ws://localhost:5000/ws', // Adjust to match your server
  phases: [
    {
      name: 'small_perturbations',
      perturbationTargets: [0.7000, 0.7250, 0.8000, 0.8250],
      sustainCycles: 10,
      recoveryObservationCycles: 20,
      repetitions: 2
    },
    {
      name: 'medium_perturbations',
      perturbationTargets: [0.6500, 0.6750, 0.8500, 0.8750],
      sustainCycles: 15,
      recoveryObservationCycles: 30,
      repetitions: 2
    },
    {
      name: 'large_perturbations',
      perturbationTargets: [0.5000, 0.5500, 0.9000, 0.9500],
      sustainCycles: 20,
      recoveryObservationCycles: 40,
      repetitions: 2
    },
    {
      name: 'sustained_perturbations',
      perturbationTargets: [0.7000, 0.8000],
      sustainCycles: 30,
      recoveryObservationCycles: 50,
      repetitions: 1
    },
    {
      name: 'alternative_attractors',
      perturbationTargets: [0.6000, 0.6666, 0.8000, 0.9000],
      sustainCycles: 25,
      recoveryObservationCycles: 50,
      repetitions: 1
    },
    {
      name: 'boundary_testing',
      perturbationTargets: [0.3000, 0.9900],
      sustainCycles: 15,
      recoveryObservationCycles: 60,
      repetitions: 1
    }
  ]
};

// Run the experiment
async function runExperiment() {
  console.log('[EXPERIMENT] Starting Coherence Attractor Experiment');
  
  const experiment = new CoherenceAttractorExperiment(experimentConfig);
  const connected = await experiment.connect();
  
  if (!connected) {
    console.error('[EXPERIMENT] Failed to connect to server. Exiting.');
    process.exit(1);
  }
  
  try {
    // Short delay to ensure stable connection
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Run the full experiment
    await experiment.startExperiment('CoherenceAttractorTest-' + Date.now());
  } catch (error) {
    console.error('[EXPERIMENT] Error running experiment:', error);
  } finally {
    experiment.close();
    console.log('[EXPERIMENT] Experiment completed.');
  }
}

// Entry point
if (require.main === module) {
  runExperiment().catch(console.error);
}

export { CoherenceAttractorExperiment, ExperimentConfig, runExperiment };