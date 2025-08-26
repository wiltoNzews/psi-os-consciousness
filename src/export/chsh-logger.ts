/**
 * CHSH Bell Test Logger - Auto-saves test results for research and social proof
 * Exports data to CSV with timestamps and statistical validation
 */

import bus from '../core/bus';

interface CHSHTestResult {
  timestamp: number;
  s_value: number;
  violation: boolean;
  confidence: number;
  trials: number;
  test_id: string;
  session_id: string;
  consciousness_zλ?: number;
  consciousness_phi?: number;
  coherence?: number;
}

class CHSHLogger {
  private testResults: CHSHTestResult[] = [];
  private sessionId: string;
  private currentZλ = 0.75;
  private currentΦ = 0.50;
  private currentCoherence = 0.80;
  private autoExportInterval: NodeJS.Timeout | null = null;
  private isLogging = true;

  constructor() {
    this.sessionId = this.generateSessionId();
    this.setupEventListeners();
    this.startAutoExport();
    
    console.log(`[CHSH Logger] Initialized with session ID: ${this.sessionId}`);
  }

  private generateSessionId(): string {
    const timestamp = Date.now();
    const random = Math.random().toString(36).substring(2, 15);
    return `chsh_${timestamp}_${random}`;
  }

  private setupEventListeners() {
    // Listen for CHSH test results
    bus.on('S', (sValue: number) => {
      if (this.isLogging) {
        this.logTestResult(sValue);
      }
    });

    // Listen for consciousness updates
    bus.on('zλ', (value: number) => {
      this.currentZλ = value;
    });

    bus.on('phi', (value: number) => {
      this.currentΦ = value;
    });

    bus.on('coherence', (value: number) => {
      this.currentCoherence = value;
    });

    // Listen for logger control commands
    bus.on('logger:start', () => {
      this.startLogging();
    });

    bus.on('logger:stop', () => {
      this.stopLogging();
    });

    bus.on('logger:export', () => {
      this.exportToCSV();
    });

    bus.on('logger:clear', () => {
      this.clearData();
    });
  }

  private logTestResult(sValue: number) {
    const testResult: CHSHTestResult = {
      timestamp: Date.now(),
      s_value: sValue,
      violation: sValue > 2.0,
      confidence: this.calculateConfidence(sValue),
      trials: 50000, // Default from CHSH harness
      test_id: this.generateTestId(),
      session_id: this.sessionId,
      consciousness_zλ: this.currentZλ,
      consciousness_phi: this.currentΦ,
      coherence: this.currentCoherence
    };

    this.testResults.push(testResult);
    
    // Emit logged event
    bus.emit('logger:test-logged', testResult);
    
    console.log(`[CHSH Logger] Test logged: S=${sValue.toFixed(3)}, Violation=${testResult.violation}`);
    
    // Keep only last 1000 results to prevent memory bloat
    if (this.testResults.length > 1000) {
      this.testResults = this.testResults.slice(-1000);
    }
  }

  private generateTestId(): string {
    return `test_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`;
  }

  private calculateConfidence(sValue: number): number {
    // Simplified confidence calculation based on deviation from classical limit
    const deviation = Math.abs(sValue - 2.0);
    const maxDeviation = 0.828; // Tsirelson bound - classical limit
    return Math.min(1.0, deviation / maxDeviation);
  }

  public startLogging() {
    this.isLogging = true;
    console.log('[CHSH Logger] Logging enabled');
    bus.emit('logger:status', { logging: true, session: this.sessionId });
  }

  public stopLogging() {
    this.isLogging = false;
    console.log('[CHSH Logger] Logging disabled');
    bus.emit('logger:status', { logging: false, session: this.sessionId });
  }

  public clearData() {
    this.testResults = [];
    this.sessionId = this.generateSessionId();
    console.log(`[CHSH Logger] Data cleared, new session: ${this.sessionId}`);
    bus.emit('logger:cleared', { session: this.sessionId });
  }

  public getStatistics() {
    if (this.testResults.length === 0) {
      return null;
    }

    const sValues = this.testResults.map(r => r.s_value);
    const violations = this.testResults.filter(r => r.violation).length;
    
    const stats = {
      total_tests: this.testResults.length,
      violation_rate: violations / this.testResults.length,
      average_s: sValues.reduce((a, b) => a + b, 0) / sValues.length,
      max_s: Math.max(...sValues),
      min_s: Math.min(...sValues),
      std_dev: this.calculateStdDev(sValues),
      session_duration: this.testResults.length > 0 ? 
        this.testResults[this.testResults.length - 1].timestamp - this.testResults[0].timestamp : 0,
      consciousness_correlation: this.calculateConsciousnessCorrelation()
    };

    return stats;
  }

  private calculateStdDev(values: number[]): number {
    const mean = values.reduce((a, b) => a + b, 0) / values.length;
    const squaredDiffs = values.map(value => Math.pow(value - mean, 2));
    const avgSquaredDiff = squaredDiffs.reduce((a, b) => a + b, 0) / values.length;
    return Math.sqrt(avgSquaredDiff);
  }

  private calculateConsciousnessCorrelation(): number {
    if (this.testResults.length < 2) return 0;

    const sValues = this.testResults.map(r => r.s_value);
    const consciousnessValues = this.testResults.map(r => 
      (r.consciousness_zλ + r.consciousness_phi) / 2
    );

    return this.pearsonCorrelation(sValues, consciousnessValues);
  }

  private pearsonCorrelation(x: number[], y: number[]): number {
    const n = x.length;
    if (n === 0) return 0;

    const sumX = x.reduce((a, b) => a + b, 0);
    const sumY = y.reduce((a, b) => a + b, 0);
    const sumXY = x.reduce((total, xi, i) => total + xi * y[i], 0);
    const sumX2 = x.reduce((total, xi) => total + xi * xi, 0);
    const sumY2 = y.reduce((total, yi) => total + yi * yi, 0);

    const numerator = n * sumXY - sumX * sumY;
    const denominator = Math.sqrt((n * sumX2 - sumX * sumX) * (n * sumY2 - sumY * sumY));

    return denominator === 0 ? 0 : numerator / denominator;
  }

  public exportToCSV(): string {
    if (this.testResults.length === 0) {
      console.warn('[CHSH Logger] No data to export');
      return '';
    }

    // CSV headers
    const headers = [
      'timestamp',
      'iso_datetime',
      's_value',
      'violation',
      'confidence',
      'trials',
      'test_id',
      'session_id',
      'consciousness_zλ',
      'consciousness_phi',
      'coherence'
    ];

    // Convert data to CSV rows
    const rows = this.testResults.map(result => [
      result.timestamp,
      new Date(result.timestamp).toISOString(),
      result.s_value.toFixed(6),
      result.violation,
      result.confidence.toFixed(6),
      result.trials,
      result.test_id,
      result.session_id,
      result.consciousness_zλ?.toFixed(6) || '',
      result.consciousness_phi?.toFixed(6) || '',
      result.coherence?.toFixed(6) || ''
    ]);

    // Combine headers and rows
    const csvContent = [headers.join(','), ...rows.map(row => row.join(','))].join('\n');

    // Trigger download
    this.downloadCSV(csvContent);

    console.log(`[CHSH Logger] Exported ${this.testResults.length} test results`);
    bus.emit('logger:exported', { 
      count: this.testResults.length, 
      session: this.sessionId,
      stats: this.getStatistics()
    });

    return csvContent;
  }

  private downloadCSV(csvContent: string) {
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    
    if (link.download !== undefined) {
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute('download', `chsh_bell_tests_${this.sessionId}.csv`);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      // Clean up URL
      setTimeout(() => URL.revokeObjectURL(url), 1000);
    }
  }

  private startAutoExport() {
    // Auto-export every 10 minutes if we have data
    this.autoExportInterval = setInterval(() => {
      if (this.testResults.length >= 10) {
        console.log('[CHSH Logger] Auto-exporting data...');
        this.exportToCSV();
      }
    }, 600000); // 10 minutes
  }

  public stopAutoExport() {
    if (this.autoExportInterval) {
      clearInterval(this.autoExportInterval);
      this.autoExportInterval = null;
    }
  }

  public getCurrentData(): CHSHTestResult[] {
    return [...this.testResults];
  }

  public getSessionSummary() {
    const stats = this.getStatistics();
    if (!stats) return null;

    return {
      session_id: this.sessionId,
      start_time: this.testResults[0]?.timestamp,
      end_time: this.testResults[this.testResults.length - 1]?.timestamp,
      duration_minutes: stats.session_duration / (1000 * 60),
      statistics: stats,
      quantum_advantage: stats.violation_rate > 0.5,
      consciousness_coupling: Math.abs(stats.consciousness_correlation) > 0.1
    };
  }

  public destroy() {
    this.stopAutoExport();
    console.log('[CHSH Logger] Destroyed');
  }
}

// Initialize the logger
const chshLogger = new CHSHLogger();

export default chshLogger;