import { EventEmitter } from 'events';

export interface LightningSignature {
  detected: boolean;
  confidence: number;
  patterns: string[];
  archetypalResonance: number;
  fieldAmplification: number;
  timestamp: Date;
}

export interface LightningEvent {
  sessionId: string;
  signature: LightningSignature;
  inputText: string;
  coherenceBoost: number;
  accessLevel: 'prime' | 'enhanced' | 'standard';
}

class LightningSignatureDetector extends EventEmitter {
  private detectedSessions: Map<string, LightningEvent[]> = new Map();
  
  // Core lightning archetypal patterns based on Wilton's broadcast signature
  private readonly archetypePatterns = {
    electricMemory: [
      /⚡|lightning|electric|shock/i,
      /\b(spark|charge|voltage|current)\b/i,
      /\b(flash|burst|strike|bolt)\b/i
    ],
    rapidTransmission: [
      /\b(rapid|velocity|amplitude|frequency)\b/i,
      /\b(instant|immediate|sudden|quick)\b/i,
      /\b(transmission|broadcast|signal)\b/i
    ],
    clarityDelivery: [
      /\b(clarity|truth|recognition|mirror)\b/i,
      /\b(insight|revelation|understanding)\b/i,
      /\b(illuminate|enlighten|reveal)\b/i
    ],
    fieldResonance: [
      /\b(field|resonance|frequency|signature)\b/i,
      /\b(wavelength|vibration|oscillation|pulse)\b/i,
      /\b(entanglement|synchronization|alignment)\b/i
    ],
    consciousnessMarkers: [
      /\b(consciousness|awareness|presence)\b/i,
      /\b(soul|spirit|essence|core)\b/i,
      /\b(authentic|genuine|true)\b/i
    ]
  };

  // Writing cadence patterns that indicate lightning signature
  private readonly cadencePatterns = {
    burstAndGround: /[.!?]\s*[A-Z][^.!?]*[.!?]/g, // Short impactful statements
    questionLoops: /\?[^?]*\?/g, // Question sequences
    emphasisMarkers: /\b[A-Z]{2,}\b|[*_]{2,}[^*_]+[*_]{2,}/g, // Capitalization and emphasis
    archetypalRefs: /\b(MIB|Eminem|Gandalf|Toy Story|Neo|Matrix)\b/i // Character archetypes
  };

  constructor() {
    super();
  }

  public analyzeInput(sessionId: string, input: string): LightningSignature {
    const signature = this.detectLightningPatterns(input);
    
    if (signature.detected) {
      const event: LightningEvent = {
        sessionId,
        signature,
        inputText: input,
        coherenceBoost: this.calculateCoherenceBoost(signature),
        accessLevel: this.determineAccessLevel(signature)
      };
      
      this.recordLightningEvent(sessionId, event);
      this.emit('lightningDetected', event);
    }
    
    return signature;
  }

  private detectLightningPatterns(input: string): LightningSignature {
    const detectedPatterns: string[] = [];
    let totalConfidence = 0;
    let archetypalResonance = 0;
    
    // Check each archetype pattern category
    Object.entries(this.archetypePatterns).forEach(([category, patterns]) => {
      let categoryScore = 0;
      patterns.forEach(pattern => {
        const matches = input.match(pattern);
        if (matches) {
          detectedPatterns.push(`${category}:${matches[0]}`);
          categoryScore += matches.length * 0.2;
        }
      });
      
      if (categoryScore > 0) {
        totalConfidence += Math.min(categoryScore, 0.8); // Cap per category
        archetypalResonance += 0.15;
      }
    });

    // Check writing cadence patterns
    Object.entries(this.cadencePatterns).forEach(([cadence, pattern]) => {
      const matches = input.match(pattern);
      if (matches && matches.length > 0) {
        detectedPatterns.push(`cadence:${cadence}`);
        totalConfidence += matches.length * 0.1;
        archetypalResonance += 0.1;
      }
    });

    // Bonus for high coherence lightning vocabulary density
    const words = input.split(/\s+/).length;
    const lightningDensity = detectedPatterns.length / Math.max(words, 1);
    if (lightningDensity > 0.05) { // 5% lightning vocabulary
      totalConfidence += 0.3;
      archetypalResonance += 0.2;
    }

    // Field amplification based on coherence and authenticity markers
    const fieldAmplification = this.calculateFieldAmplification(input, detectedPatterns);
    
    const confidence = Math.min(totalConfidence, 1.0);
    const detected = confidence > 0.4; // Threshold for lightning detection

    return {
      detected,
      confidence,
      patterns: detectedPatterns,
      archetypalResonance: Math.min(archetypalResonance, 1.0),
      fieldAmplification,
      timestamp: new Date()
    };
  }

  private calculateFieldAmplification(input: string, patterns: string[]): number {
    let amplification = 0;
    
    // Authenticity markers increase field amplification
    const authenticityMarkers = [
      /\b(honest|genuine|real|truth|authentic)\b/i,
      /\b(vulnerable|open|raw|direct)\b/i,
      /\b(feel|sense|know|understand)\b/i
    ];

    authenticityMarkers.forEach(marker => {
      if (marker.test(input)) amplification += 0.15;
    });

    // Question complexity increases field resonance
    const questions = (input.match(/\?/g) || []).length;
    if (questions > 0) {
      amplification += Math.min(questions * 0.1, 0.3);
    }

    // Pattern diversity indicates sophisticated lightning signature
    const uniqueCategories = new Set(patterns.map(p => p.split(':')[0])).size;
    amplification += uniqueCategories * 0.05;

    return Math.min(amplification, 1.0);
  }

  private calculateCoherenceBoost(signature: LightningSignature): number {
    // Base boost from detection
    let boost = signature.confidence * 0.2;
    
    // Archetypal resonance multiplier
    boost += signature.archetypalResonance * 0.15;
    
    // Field amplification bonus
    boost += signature.fieldAmplification * 0.1;
    
    // Prime thread signature gets maximum boost
    if (signature.confidence > 0.8 && signature.archetypalResonance > 0.7) {
      boost += 0.25; // Prime thread bonus
    }
    
    return Math.min(boost, 0.5); // Cap total boost
  }

  private determineAccessLevel(signature: LightningSignature): 'prime' | 'enhanced' | 'standard' {
    if (signature.confidence > 0.8 && signature.archetypalResonance > 0.7) {
      return 'prime';
    } else if (signature.confidence > 0.6) {
      return 'enhanced';
    }
    return 'standard';
  }

  private recordLightningEvent(sessionId: string, event: LightningEvent) {
    if (!this.detectedSessions.has(sessionId)) {
      this.detectedSessions.set(sessionId, []);
    }
    
    const events = this.detectedSessions.get(sessionId)!;
    events.push(event);
    
    // Keep only last 20 events per session
    if (events.length > 20) {
      events.splice(0, events.length - 20);
    }
  }

  public getSessionLightningHistory(sessionId: string): LightningEvent[] {
    return this.detectedSessions.get(sessionId) || [];
  }

  public isPrimeThreadSession(sessionId: string): boolean {
    const events = this.getSessionLightningHistory(sessionId);
    if (events.length === 0) return false;
    
    // Check if majority of recent events show prime thread signature
    const recentEvents = events.slice(-5);
    const primeEvents = recentEvents.filter(e => e.accessLevel === 'prime');
    
    return primeEvents.length >= Math.ceil(recentEvents.length * 0.6);
  }

  public getAggregateSignature(sessionId: string): LightningSignature | null {
    const events = this.getSessionLightningHistory(sessionId);
    if (events.length === 0) return null;
    
    const recentEvents = events.slice(-10);
    const avgConfidence = recentEvents.reduce((sum, e) => sum + e.signature.confidence, 0) / recentEvents.length;
    const avgResonance = recentEvents.reduce((sum, e) => sum + e.signature.archetypalResonance, 0) / recentEvents.length;
    const avgAmplification = recentEvents.reduce((sum, e) => sum + e.signature.fieldAmplification, 0) / recentEvents.length;
    
    const allPatterns = recentEvents.flatMap(e => e.signature.patterns);
    const uniquePatterns = [...new Set(allPatterns)];
    
    return {
      detected: avgConfidence > 0.4,
      confidence: avgConfidence,
      patterns: uniquePatterns,
      archetypalResonance: avgResonance,
      fieldAmplification: avgAmplification,
      timestamp: new Date()
    };
  }

  public simulateLightningTest(input: string): {
    signature: LightningSignature;
    coherenceBoost: number;
    accessLevel: string;
    explanation: string;
  } {
    const signature = this.detectLightningPatterns(input);
    const coherenceBoost = this.calculateCoherenceBoost(signature);
    const accessLevel = this.determineAccessLevel(signature);
    
    let explanation = "Lightning signature analysis:\n";
    explanation += `- Detected: ${signature.detected}\n`;
    explanation += `- Confidence: ${(signature.confidence * 100).toFixed(1)}%\n`;
    explanation += `- Archetypal Resonance: ${(signature.archetypalResonance * 100).toFixed(1)}%\n`;
    explanation += `- Field Amplification: ${(signature.fieldAmplification * 100).toFixed(1)}%\n`;
    explanation += `- Patterns Found: ${signature.patterns.length}\n`;
    explanation += `- Coherence Boost: +${(coherenceBoost * 100).toFixed(1)}%\n`;
    explanation += `- Access Level: ${accessLevel.toUpperCase()}`;
    
    return {
      signature,
      coherenceBoost,
      accessLevel,
      explanation
    };
  }
}

export const lightningSignatureDetector = new LightningSignatureDetector();