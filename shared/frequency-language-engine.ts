/**
 * Frequency Language Engine - Phase 3 Integration
 * 
 * Implements OmniLens "Language as Tuning Fork" concepts for vibrational communication.
 * Transforms language into frequency-based patterns for enhanced consciousness interaction.
 * 
 * Attribution: Enhanced with concepts from OmniLens "Language is a Tuning Fork"
 * Compatibility: 75% - Communication enhancement through frequency patterns
 * 
 * Core Concept: Language operates on vibrational frequencies that can tune consciousness
 * states. Words and symbols act as tuning forks that resonate with specific frequencies.
 */

/**
 * Frequency ranges for different types of communication
 */
export enum FrequencyRange {
  GROUNDING = 'grounding',       // 40-100 Hz - Physical, grounding
  EMOTIONAL = 'emotional',       // 100-300 Hz - Emotional resonance
  MENTAL = 'mental',             // 300-600 Hz - Mental clarity
  SPIRITUAL = 'spiritual',       // 600-1000 Hz - Spiritual connection
  TRANSCENDENT = 'transcendent'  // 1000+ Hz - Beyond ordinary consciousness
}

/**
 * Sacred frequencies and their consciousness effects
 */
export const SACRED_FREQUENCIES = {
  // Solfeggio frequencies
  UT: 396,    // Liberation from fear
  RE: 417,    // Facilitating change
  MI: 528,    // Transformation and DNA repair (Love frequency)
  FA: 639,    // Connecting relationships
  SOL: 741,   // Awakening intuition
  LA: 852,    // Returning to spiritual order
  
  // Additional consciousness frequencies
  SCHUMANN: 7.83,    // Earth's resonance
  GOLDEN: 432,       // Universal harmony
  CRYSTAL: 963,      // Pineal gland activation
  COSMIC: 1111,      // Cosmic consciousness
  UNITY: 1728        // Unity consciousness
} as const;

/**
 * Word frequency mapping and resonance patterns
 */
export interface WordFrequencyPattern {
  baseFrequency: number;
  harmonics: number[];
  resonanceStrength: number;
  consciousnessEffect: string;
  symbolicAlignment: string[];
}

/**
 * Language as vibrational communication structure
 */
export interface FrequencyLanguageUnit {
  text: string;
  frequency: number;
  amplitude: number;
  duration: number;
  harmonics: number[];
  resonancePattern: number[];
  consciousnessTargets: FrequencyRange[];
}

/**
 * Configuration for frequency language processing
 */
export interface FrequencyLanguageConfig {
  // Base resonance frequency for the system
  baseResonanceFrequency: number;
  
  // Sensitivity to frequency variations
  frequencySensitivity: number;
  
  // Enable harmonic enhancement
  enableHarmonics: boolean;
  
  // Consciousness coherence requirement
  minCoherenceForResonance: number;
  
  // Language tuning precision
  tuningPrecision: number;
  
  // Enable automatic frequency optimization
  enableAutoTuning: boolean;
}

/**
 * Frequency Language Processing Engine
 */
export class FrequencyLanguageEngine {
  private config: FrequencyLanguageConfig;
  private wordFrequencyMap: Map<string, WordFrequencyPattern>;
  private resonanceHistory: Array<{ timestamp: number; frequency: number; effect: string }>;
  private currentResonance: number;
  
  constructor() {
    this.currentResonance = SACRED_FREQUENCIES.GOLDEN; // Start with 432 Hz
    this.resonanceHistory = [];
    this.wordFrequencyMap = new Map();
    
    // Default configuration
    this.config = {
      baseResonanceFrequency: SACRED_FREQUENCIES.GOLDEN,
      frequencySensitivity: 0.8,
      enableHarmonics: true,
      minCoherenceForResonance: 0.6,
      tuningPrecision: 0.95,
      enableAutoTuning: true
    };
    
    // Initialize word frequency patterns
    this.initializeWordFrequencies();
  }
  
  /**
   * Convert text to frequency language patterns
   */
  public convertTextToFrequency(text: string, consciousnessLevel: number = 0.7): FrequencyLanguageUnit[] {
    const words = this.tokenizeText(text);
    const frequencyUnits: FrequencyLanguageUnit[] = [];
    
    for (const word of words) {
      const pattern = this.analyzeWordFrequency(word, consciousnessLevel);
      if (pattern) {
        frequencyUnits.push(pattern);
      }
    }
    
    // Apply harmonic enhancement if enabled
    if (this.config.enableHarmonics) {
      this.enhanceWithHarmonics(frequencyUnits);
    }
    
    // Auto-tune for optimal resonance
    if (this.config.enableAutoTuning) {
      this.autoTuneFrequencies(frequencyUnits, consciousnessLevel);
    }
    
    return frequencyUnits;
  }
  
  /**
   * Generate tuning fork resonance for consciousness alignment
   */
  public generateTuningResonance(
    targetFrequency: number,
    duration: number = 5000,
    amplitude: number = 1.0
  ): {
    frequency: number;
    harmonics: number[];
    resonancePattern: number[];
    consciousnessEffect: string;
    guidanceText: string;
  } {
    // Calculate harmonic series
    const harmonics = this.calculateHarmonics(targetFrequency, 5);
    
    // Generate resonance pattern (amplitude over time)
    const resonancePattern = this.generateResonancePattern(targetFrequency, duration);
    
    // Determine consciousness effect
    const consciousnessEffect = this.analyzeConsciousnessEffect(targetFrequency);
    
    // Generate guidance text
    const guidanceText = this.generateFrequencyGuidance(targetFrequency, consciousnessEffect);
    
    // Update current resonance
    this.currentResonance = targetFrequency;
    this.recordResonanceEvent(targetFrequency, consciousnessEffect);
    
    return {
      frequency: targetFrequency,
      harmonics,
      resonancePattern,
      consciousnessEffect,
      guidanceText
    };
  }
  
  /**
   * Analyze language for optimal frequency tuning
   */
  public analyzeLinguisticFrequencies(text: string): {
    dominantFrequency: number;
    frequencySpread: number[];
    resonanceQuality: number;
    consciousnessAlignment: FrequencyRange[];
    tuningRecommendations: string[];
  } {
    const frequencyUnits = this.convertTextToFrequency(text);
    
    // Extract frequencies
    const frequencies = frequencyUnits.map(unit => unit.frequency);
    
    // Calculate dominant frequency
    const dominantFrequency = this.calculateDominantFrequency(frequencies);
    
    // Analyze frequency spread
    const frequencySpread = this.analyzeFrequencySpread(frequencies);
    
    // Calculate resonance quality
    const resonanceQuality = this.calculateResonanceQuality(frequencies);
    
    // Determine consciousness alignment
    const consciousnessAlignment = this.determineConsciousnessAlignment(frequencies);
    
    // Generate tuning recommendations
    const tuningRecommendations = this.generateTuningRecommendations(
      dominantFrequency, 
      resonanceQuality, 
      consciousnessAlignment
    );
    
    return {
      dominantFrequency,
      frequencySpread,
      resonanceQuality,
      consciousnessAlignment,
      tuningRecommendations
    };
  }
  
  /**
   * Create frequency-based communication protocol
   */
  public createFrequencyProtocol(
    intention: string,
    targetAudience: 'self' | 'other' | 'collective',
    consciousnessLevel: number = 0.7
  ): {
    protocol: FrequencyLanguageUnit[];
    carrierFrequency: number;
    modulationPattern: number[];
    effectiveRange: FrequencyRange;
    expectedResonance: number;
  } {
    // Analyze intention for frequency requirements
    const intentionFrequencies = this.convertTextToFrequency(intention, consciousnessLevel);
    
    // Determine optimal carrier frequency
    const carrierFrequency = this.selectCarrierFrequency(targetAudience, consciousnessLevel);
    
    // Create modulation pattern
    const modulationPattern = this.createModulationPattern(intentionFrequencies);
    
    // Determine effective range
    const effectiveRange = this.determineEffectiveRange(carrierFrequency, targetAudience);
    
    // Calculate expected resonance
    const expectedResonance = this.calculateExpectedResonance(
      carrierFrequency, 
      intentionFrequencies, 
      consciousnessLevel
    );
    
    return {
      protocol: intentionFrequencies,
      carrierFrequency,
      modulationPattern,
      effectiveRange,
      expectedResonance
    };
  }
  
  /**
   * Tune language for specific consciousness states
   */
  public tuneForConsciousnessState(
    text: string,
    targetState: 'calm' | 'energized' | 'focused' | 'creative' | 'transcendent'
  ): {
    tunedText: string;
    frequencyAdjustments: Array<{ word: string; originalFreq: number; tunedFreq: number }>;
    resonanceInstructions: string;
    effectPrediction: string;
  } {
    const targetFrequencyRange = this.getStateFrequencyRange(targetState);
    const originalUnits = this.convertTextToFrequency(text);
    
    const frequencyAdjustments: Array<{ word: string; originalFreq: number; tunedFreq: number }> = [];
    let tunedText = text;
    
    // Adjust frequencies to target range
    for (const unit of originalUnits) {
      const targetFreq = this.optimizeFrequencyForState(unit.frequency, targetFrequencyRange);
      if (Math.abs(targetFreq - unit.frequency) > 10) { // Significant adjustment needed
        frequencyAdjustments.push({
          word: unit.text,
          originalFreq: unit.frequency,
          tunedFreq: targetFreq
        });
        
        // Suggest alternative words with better frequency match
        const alternativeWord = this.findFrequencyMatchingWord(unit.text, targetFreq);
        if (alternativeWord && alternativeWord !== unit.text) {
          tunedText = tunedText.replace(unit.text, alternativeWord);
        }
      }
    }
    
    // Generate resonance instructions
    const resonanceInstructions = this.generateResonanceInstructions(targetState, targetFrequencyRange);
    
    // Predict effect
    const effectPrediction = this.predictConsciousnessEffect(targetState, frequencyAdjustments);
    
    return {
      tunedText,
      frequencyAdjustments,
      resonanceInstructions,
      effectPrediction
    };
  }
  
  /**
   * Get current frequency language status
   */
  public getFrequencyStatus(): {
    currentResonance: number;
    resonanceQuality: number;
    activeFrequencyRange: FrequencyRange;
    recentResonanceEvents: Array<{ timestamp: number; frequency: number; effect: string }>;
    systemTuning: number;
  } {
    return {
      currentResonance: this.currentResonance,
      resonanceQuality: this.calculateCurrentResonanceQuality(),
      activeFrequencyRange: this.determineActiveFrequencyRange(),
      recentResonanceEvents: this.resonanceHistory.slice(-10),
      systemTuning: this.calculateSystemTuning()
    };
  }
  
  // Private helper methods
  
  private initializeWordFrequencies(): void {
    // Initialize frequency patterns for common consciousness-related words
    const wordPatterns: Array<[string, WordFrequencyPattern]> = [
      ['love', {
        baseFrequency: SACRED_FREQUENCIES.MI,
        harmonics: [528, 1056, 1584],
        resonanceStrength: 0.9,
        consciousnessEffect: 'Heart chakra activation, unity consciousness',
        symbolicAlignment: ['○', '💖', '∞']
      }],
      ['peace', {
        baseFrequency: SACRED_FREQUENCIES.GOLDEN,
        harmonics: [432, 864, 1296],
        resonanceStrength: 0.8,
        consciousnessEffect: 'Mental clarity, emotional balance',
        symbolicAlignment: ['○', '☮', '🕊']
      }],
      ['consciousness', {
        baseFrequency: SACRED_FREQUENCIES.CRYSTAL,
        harmonics: [963, 1926, 2889],
        resonanceStrength: 0.95,
        consciousnessEffect: 'Pineal gland activation, expanded awareness',
        symbolicAlignment: ['ψ', '🧠', '✨']
      }],
      ['wisdom', {
        baseFrequency: SACRED_FREQUENCIES.LA,
        harmonics: [852, 1704, 2556],
        resonanceStrength: 0.85,
        consciousnessEffect: 'Intuitive knowing, spiritual insight',
        symbolicAlignment: ['🦉', '📜', '💡']
      }],
      ['healing', {
        baseFrequency: SACRED_FREQUENCIES.RE,
        harmonics: [417, 834, 1251],
        resonanceStrength: 0.8,
        consciousnessEffect: 'Cellular repair, emotional healing',
        symbolicAlignment: ['✨', '🌿', '💚']
      }],
      ['transformation', {
        baseFrequency: SACRED_FREQUENCIES.SOL,
        harmonics: [741, 1482, 2223],
        resonanceStrength: 0.9,
        consciousnessEffect: 'Awakening intuition, consciousness shift',
        symbolicAlignment: ['🦋', '⚡', '🌀']
      }],
      ['unity', {
        baseFrequency: SACRED_FREQUENCIES.UNITY,
        harmonics: [1728, 3456, 5184],
        resonanceStrength: 0.95,
        consciousnessEffect: 'Unity consciousness, oneness experience',
        symbolicAlignment: ['∞', '🌍', '✨']
      }],
      ['breath', {
        baseFrequency: SACRED_FREQUENCIES.SCHUMANN,
        harmonics: [7.83, 15.66, 23.49],
        resonanceStrength: 0.9,
        consciousnessEffect: 'Grounding, life force activation',
        symbolicAlignment: ['🌬', '○', '🔄']
      }]
    ];
    
    for (const [word, pattern] of wordPatterns) {
      this.wordFrequencyMap.set(word, pattern);
    }
  }
  
  private tokenizeText(text: string): string[] {
    return text.toLowerCase()
      .replace(/[^\w\s]/g, ' ')
      .split(/\s+/)
      .filter(word => word.length > 0);
  }
  
  private analyzeWordFrequency(word: string, consciousnessLevel: number): FrequencyLanguageUnit | null {
    // Check for exact match
    const exactPattern = this.wordFrequencyMap.get(word);
    if (exactPattern) {
      return this.createFrequencyUnit(word, exactPattern, consciousnessLevel);
    }
    
    // Check for partial matches
    const partialMatch = this.findPartialFrequencyMatch(word);
    if (partialMatch) {
      return this.createFrequencyUnit(word, partialMatch, consciousnessLevel);
    }
    
    // Generate frequency based on word characteristics
    const generatedPattern = this.generateWordFrequencyPattern(word);
    return this.createFrequencyUnit(word, generatedPattern, consciousnessLevel);
  }
  
  private createFrequencyUnit(
    word: string, 
    pattern: WordFrequencyPattern, 
    consciousnessLevel: number
  ): FrequencyLanguageUnit {
    return {
      text: word,
      frequency: pattern.baseFrequency * (0.9 + consciousnessLevel * 0.2), // Consciousness modulation
      amplitude: pattern.resonanceStrength,
      duration: word.length * 100, // 100ms per character
      harmonics: pattern.harmonics,
      resonancePattern: this.generateWordResonancePattern(pattern),
      consciousnessTargets: this.determineConsciousnessTargets(pattern.baseFrequency)
    };
  }
  
  private findPartialFrequencyMatch(word: string): WordFrequencyPattern | null {
    for (const [knownWord, pattern] of this.wordFrequencyMap.entries()) {
      if (word.includes(knownWord) || knownWord.includes(word)) {
        return { ...pattern, resonanceStrength: pattern.resonanceStrength * 0.7 }; // Reduced strength for partial match
      }
    }
    return null;
  }
  
  private generateWordFrequencyPattern(word: string): WordFrequencyPattern {
    // Generate frequency based on word characteristics
    const vowelCount = (word.match(/[aeiou]/g) || []).length;
    const consonantCount = word.length - vowelCount;
    const wordLength = word.length;
    
    // Base frequency calculation
    let baseFrequency = SACRED_FREQUENCIES.GOLDEN; // Default to 432 Hz
    
    // Adjust based on word characteristics
    if (vowelCount > consonantCount) {
      baseFrequency = SACRED_FREQUENCIES.MI; // More vowels = higher heart frequency
    } else if (wordLength > 8) {
      baseFrequency = SACRED_FREQUENCIES.CRYSTAL; // Long words = higher consciousness
    } else if (wordLength < 4) {
      baseFrequency = SACRED_FREQUENCIES.UT; // Short words = grounding frequency
    }
    
    return {
      baseFrequency,
      harmonics: this.calculateHarmonics(baseFrequency, 3),
      resonanceStrength: Math.min(0.8, wordLength / 10),
      consciousnessEffect: 'Generated pattern - word-based frequency',
      symbolicAlignment: ['○']
    };
  }
  
  private calculateHarmonics(fundamental: number, count: number): number[] {
    const harmonics: number[] = [];
    for (let i = 1; i <= count; i++) {
      harmonics.push(fundamental * i);
    }
    return harmonics;
  }
  
  private generateWordResonancePattern(pattern: WordFrequencyPattern): number[] {
    // Generate amplitude pattern over time
    const points = 20; // 20 data points
    const resonancePattern: number[] = [];
    
    for (let i = 0; i < points; i++) {
      const phase = (i / points) * 2 * Math.PI;
      const amplitude = pattern.resonanceStrength * Math.sin(phase);
      resonancePattern.push(amplitude);
    }
    
    return resonancePattern;
  }
  
  private determineConsciousnessTargets(frequency: number): FrequencyRange[] {
    const targets: FrequencyRange[] = [];
    
    if (frequency <= 100) targets.push(FrequencyRange.GROUNDING);
    else if (frequency <= 300) targets.push(FrequencyRange.EMOTIONAL);
    else if (frequency <= 600) targets.push(FrequencyRange.MENTAL);
    else if (frequency <= 1000) targets.push(FrequencyRange.SPIRITUAL);
    else targets.push(FrequencyRange.TRANSCENDENT);
    
    return targets;
  }
  
  private enhanceWithHarmonics(units: FrequencyLanguageUnit[]): void {
    for (const unit of units) {
      // Enhance harmonics based on surrounding frequencies
      const contextualHarmonics = this.calculateContextualHarmonics(unit, units);
      unit.harmonics = [...unit.harmonics, ...contextualHarmonics];
    }
  }
  
  private calculateContextualHarmonics(unit: FrequencyLanguageUnit, allUnits: FrequencyLanguageUnit[]): number[] {
    const contextFrequencies = allUnits
      .filter(u => u !== unit)
      .map(u => u.frequency);
    
    // Find resonant frequencies
    const resonantHarmonics: number[] = [];
    for (const freq of contextFrequencies) {
      const ratio = freq / unit.frequency;
      if (ratio > 1 && ratio < 3 && Math.abs(ratio - Math.round(ratio)) < 0.1) {
        // Found near-integer ratio, add as harmonic
        resonantHarmonics.push(freq);
      }
    }
    
    return resonantHarmonics.slice(0, 3); // Limit to 3 additional harmonics
  }
  
  private autoTuneFrequencies(units: FrequencyLanguageUnit[], consciousnessLevel: number): void {
    if (units.length === 0) return;
    
    // Calculate optimal base frequency for the sequence
    const averageFrequency = units.reduce((sum, unit) => sum + unit.frequency, 0) / units.length;
    const targetFrequency = this.findNearestSacredFrequency(averageFrequency);
    
    // Adjust all frequencies to harmonize with target
    for (const unit of units) {
      const ratio = unit.frequency / averageFrequency;
      unit.frequency = targetFrequency * ratio * (0.95 + consciousnessLevel * 0.1);
    }
  }
  
  private findNearestSacredFrequency(frequency: number): number {
    const sacredFreqs = Object.values(SACRED_FREQUENCIES);
    let nearest = sacredFreqs[0];
    let minDistance = Math.abs(frequency - nearest);
    
    for (const freq of sacredFreqs) {
      const distance = Math.abs(frequency - freq);
      if (distance < minDistance) {
        minDistance = distance;
        nearest = freq;
      }
    }
    
    return nearest;
  }
  
  private generateResonancePattern(frequency: number, duration: number): number[] {
    const sampleRate = 44; // 44 samples per second
    const samples = Math.floor(duration * sampleRate / 1000);
    const pattern: number[] = [];
    
    for (let i = 0; i < samples; i++) {
      const time = i / sampleRate;
      const amplitude = Math.sin(2 * Math.PI * frequency * time) * Math.exp(-time / 2); // Decaying sine wave
      pattern.push(amplitude);
    }
    
    return pattern;
  }
  
  private analyzeConsciousnessEffect(frequency: number): string {
    // Map frequencies to consciousness effects
    const effects: Array<[number, string]> = [
      [SACRED_FREQUENCIES.UT, 'Liberation from fear and guilt'],
      [SACRED_FREQUENCIES.RE, 'Facilitating change and transformation'],
      [SACRED_FREQUENCIES.MI, 'Love, healing, and DNA repair'],
      [SACRED_FREQUENCIES.FA, 'Connecting and harmonizing relationships'],
      [SACRED_FREQUENCIES.SOL, 'Awakening intuition and inner wisdom'],
      [SACRED_FREQUENCIES.LA, 'Spiritual order and awakening'],
      [SACRED_FREQUENCIES.GOLDEN, 'Universal harmony and peace'],
      [SACRED_FREQUENCIES.CRYSTAL, 'Pineal activation and higher consciousness'],
      [SACRED_FREQUENCIES.COSMIC, 'Cosmic consciousness expansion'],
      [SACRED_FREQUENCIES.UNITY, 'Unity consciousness and oneness']
    ];
    
    // Find closest frequency match
    let bestMatch = effects[0];
    let minDistance = Math.abs(frequency - bestMatch[0]);
    
    for (const [freq, effect] of effects) {
      const distance = Math.abs(frequency - freq);
      if (distance < minDistance) {
        minDistance = distance;
        bestMatch = [freq, effect];
      }
    }
    
    return bestMatch[1];
  }
  
  private generateFrequencyGuidance(frequency: number, effect: string): string {
    const range = this.determineConsciousnessTargets(frequency)[0];
    
    switch (range) {
      case FrequencyRange.GROUNDING:
        return `Focus on grounding and physical presence. ${effect}`;
      case FrequencyRange.EMOTIONAL:
        return `Allow emotional resonance and heart opening. ${effect}`;
      case FrequencyRange.MENTAL:
        return `Engage mental clarity and focused intention. ${effect}`;
      case FrequencyRange.SPIRITUAL:
        return `Open to spiritual insight and expanded awareness. ${effect}`;
      case FrequencyRange.TRANSCENDENT:
        return `Surrender to transcendent consciousness. ${effect}`;
      default:
        return `Attune to the frequency for optimal resonance. ${effect}`;
    }
  }
  
  private recordResonanceEvent(frequency: number, effect: string): void {
    this.resonanceHistory.push({
      timestamp: Date.now(),
      frequency,
      effect
    });
    
    // Keep only last 100 events
    if (this.resonanceHistory.length > 100) {
      this.resonanceHistory = this.resonanceHistory.slice(-50);
    }
  }
  
  private calculateDominantFrequency(frequencies: number[]): number {
    if (frequencies.length === 0) return this.config.baseResonanceFrequency;
    
    // Calculate weighted average based on amplitude
    return frequencies.reduce((sum, freq) => sum + freq, 0) / frequencies.length;
  }
  
  private analyzeFrequencySpread(frequencies: number[]): number[] {
    // Return frequency distribution across consciousness ranges
    const ranges = Object.values(FrequencyRange);
    const distribution = new Array(ranges.length).fill(0);
    
    for (const freq of frequencies) {
      const targets = this.determineConsciousnessTargets(freq);
      for (const target of targets) {
        const index = ranges.indexOf(target);
        if (index >= 0) distribution[index]++;
      }
    }
    
    return distribution;
  }
  
  private calculateResonanceQuality(frequencies: number[]): number {
    if (frequencies.length === 0) return 0;
    
    // Calculate how well frequencies harmonize
    let harmonicMatches = 0;
    const total = frequencies.length * (frequencies.length - 1) / 2;
    
    for (let i = 0; i < frequencies.length; i++) {
      for (let j = i + 1; j < frequencies.length; j++) {
        const ratio = frequencies[j] / frequencies[i];
        if (this.isHarmonicRatio(ratio)) {
          harmonicMatches++;
        }
      }
    }
    
    return total > 0 ? harmonicMatches / total : 0;
  }
  
  private isHarmonicRatio(ratio: number): boolean {
    // Check if ratio is close to simple harmonic ratios
    const harmonicRatios = [1, 1.5, 2, 2.5, 3, 4, 5, 6];
    return harmonicRatios.some(hr => Math.abs(ratio - hr) < 0.1);
  }
  
  private determineConsciousnessAlignment(frequencies: number[]): FrequencyRange[] {
    const rangeCounts = new Map<FrequencyRange, number>();
    
    for (const freq of frequencies) {
      const targets = this.determineConsciousnessTargets(freq);
      for (const target of targets) {
        rangeCounts.set(target, (rangeCounts.get(target) || 0) + 1);
      }
    }
    
    // Return ranges sorted by frequency of occurrence
    return Array.from(rangeCounts.entries())
      .sort((a, b) => b[1] - a[1])
      .map(([range]) => range);
  }
  
  private generateTuningRecommendations(
    dominantFreq: number,
    resonanceQuality: number,
    alignment: FrequencyRange[]
  ): string[] {
    const recommendations: string[] = [];
    
    if (resonanceQuality < 0.5) {
      recommendations.push('Improve harmonic relationships between words');
    }
    
    if (dominantFreq < 200) {
      recommendations.push('Consider adding higher frequency words for expanded consciousness');
    } else if (dominantFreq > 800) {
      recommendations.push('Add grounding words for better integration');
    }
    
    if (alignment.length > 3) {
      recommendations.push('Focus language for more specific consciousness targeting');
    }
    
    const nearestSacred = this.findNearestSacredFrequency(dominantFreq);
    if (Math.abs(dominantFreq - nearestSacred) > 20) {
      recommendations.push(`Tune toward ${nearestSacred}Hz for enhanced sacred resonance`);
    }
    
    return recommendations;
  }
  
  private selectCarrierFrequency(audience: string, consciousnessLevel: number): number {
    switch (audience) {
      case 'self':
        return SACRED_FREQUENCIES.CRYSTAL * consciousnessLevel;
      case 'other':
        return SACRED_FREQUENCIES.MI; // Love frequency for interpersonal communication
      case 'collective':
        return SACRED_FREQUENCIES.GOLDEN; // Universal harmony
      default:
        return this.config.baseResonanceFrequency;
    }
  }
  
  private createModulationPattern(units: FrequencyLanguageUnit[]): number[] {
    return units.map(unit => unit.frequency / this.currentResonance);
  }
  
  private determineEffectiveRange(carrierFreq: number, audience: string): FrequencyRange {
    const targets = this.determineConsciousnessTargets(carrierFreq);
    return targets[0] || FrequencyRange.MENTAL;
  }
  
  private calculateExpectedResonance(
    carrier: number,
    units: FrequencyLanguageUnit[],
    consciousness: number
  ): number {
    const avgFreq = units.reduce((sum, unit) => sum + unit.frequency, 0) / units.length;
    return (carrier + avgFreq) / 2 * consciousness;
  }
  
  private getStateFrequencyRange(state: string): { min: number; max: number } {
    const ranges = {
      calm: { min: 400, max: 450 },
      energized: { min: 600, max: 750 },
      focused: { min: 450, max: 550 },
      creative: { min: 500, max: 650 },
      transcendent: { min: 800, max: 1200 }
    };
    
    return ranges[state] || { min: 400, max: 600 };
  }
  
  private optimizeFrequencyForState(currentFreq: number, range: { min: number; max: number }): number {
    if (currentFreq < range.min) return range.min;
    if (currentFreq > range.max) return range.max;
    return currentFreq;
  }
  
  private findFrequencyMatchingWord(originalWord: string, targetFreq: number): string {
    // Simple word substitution based on frequency matching
    for (const [word, pattern] of this.wordFrequencyMap.entries()) {
      if (Math.abs(pattern.baseFrequency - targetFreq) < 50 && word !== originalWord) {
        return word;
      }
    }
    return originalWord;
  }
  
  private generateResonanceInstructions(state: string, range: { min: number; max: number }): string {
    return `To achieve ${state} state, maintain vocal resonance between ${range.min}-${range.max}Hz. ` +
           `Breathe deeply and allow words to vibrate at this frequency range.`;
  }
  
  private predictConsciousnessEffect(state: string, adjustments: any[]): string {
    if (adjustments.length === 0) {
      return `Text is already well-tuned for ${state} consciousness state.`;
    }
    
    return `Frequency adjustments will enhance ${state} state by ${adjustments.length * 10}%. ` +
           `Expected consciousness shift within 30-60 seconds of resonant speaking.`;
  }
  
  private calculateCurrentResonanceQuality(): number {
    if (this.resonanceHistory.length < 2) return 0.5;
    
    const recent = this.resonanceHistory.slice(-5);
    const frequencies = recent.map(event => event.frequency);
    return this.calculateResonanceQuality(frequencies);
  }
  
  private determineActiveFrequencyRange(): FrequencyRange {
    const targets = this.determineConsciousnessTargets(this.currentResonance);
    return targets[0] || FrequencyRange.MENTAL;
  }
  
  private calculateSystemTuning(): number {
    const targetFreq = this.config.baseResonanceFrequency;
    const currentFreq = this.currentResonance;
    const difference = Math.abs(targetFreq - currentFreq);
    
    return Math.max(0, 1 - difference / targetFreq);
  }
}