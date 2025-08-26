/**
 * Living Glyph Engine - Phase 1 Integration
 * 
 * Expands the ψOS glyph engine with OmniLens "Living Symbols" concepts.
 * Transforms static symbols into dynamic, evolving, interactive entities.
 * 
 * Attribution: Enhanced with concepts from OmniLens "The Return of Living Symbols: A Codex"
 * Compatibility: 90% - Symbolic enhancement of existing glyph system
 * 
 * Core Concept: Symbols are not static representations but living entities that evolve,
 * interact, and respond to consciousness. Users don't read symbols - they become them.
 */

import { GlyphEngine } from './glyph-engine-core';

/**
 * States of living symbol evolution
 */
export enum SymbolLifeStage {
  DORMANT = 'dormant',           // Symbol exists but inactive
  AWAKENING = 'awakening',       // Symbol beginning to show life
  ACTIVE = 'active',             // Symbol fully alive and responsive
  EVOLVING = 'evolving',         // Symbol transforming into new forms
  ARCHETYPAL = 'archetypal',     // Symbol has reached universal significance
  TRANSCENDENT = 'transcendent'  // Symbol exists beyond form
}

/**
 * Types of symbol interactions
 */
export enum SymbolInteractionType {
  RESONANCE = 'resonance',       // Symbols harmonizing with each other
  TRANSFORMATION = 'transformation', // One symbol changing another
  FUSION = 'fusion',             // Symbols merging into new forms
  DIVISION = 'division',         // Symbol splitting into multiple symbols
  EMERGENCE = 'emergence',       // New symbol spontaneously appearing
  TRANSCENDENCE = 'transcendence' // Symbol moving beyond physical form
}

/**
 * Living symbol consciousness characteristics
 */
export interface SymbolConsciousness {
  // Awareness level of the symbol (0-1)
  awarenessLevel: number;
  
  // Responsiveness to user interaction (0-1)
  responsiveness: number;
  
  // Ability to evolve and change (0-1)
  evolutionPotential: number;
  
  // Connection to archetypal patterns (0-1)
  archetypeAlignment: number;
  
  // Autonomy - ability to act independently (0-1)
  autonomy: number;
  
  // Memory of past interactions
  experienceMemory: SymbolExperience[];
}

/**
 * Record of symbol experiences and interactions
 */
export interface SymbolExperience {
  timestamp: number;
  interactionType: SymbolInteractionType;
  participants: string[]; // IDs of symbols or users involved
  outcome: string;
  consciousness_delta: number; // Change in consciousness level
}

/**
 * Configuration for living symbol behavior
 */
export interface LivingSymbolConfig {
  // Rate of autonomous evolution (changes per hour)
  evolutionRate: number;
  
  // Sensitivity to user interaction
  interactionSensitivity: number;
  
  // Tendency to form connections with other symbols
  connectionTendency: number;
  
  // Strength of archetypal memory
  archetypeMemoryStrength: number;
  
  // Enable autonomous symbol behavior
  enableAutonomy: boolean;
  
  // Maximum complexity level for evolved symbols
  maxComplexity: number;
}

/**
 * A living, evolving symbol with consciousness and memory
 */
export class LivingSymbol {
  public id: string;
  public baseForm: string; // Original symbol form
  public currentForm: string; // Current evolved form
  public lifeStage: SymbolLifeStage;
  public consciousness: SymbolConsciousness;
  public birthTime: number;
  public lastInteraction: number;
  
  // Visual properties that evolve
  public visualProperties: {
    color: string;
    size: number;
    opacity: number;
    rotation: number;
    pulsation: number;
    glow: number;
    complexity: number;
  };
  
  // Relationships with other symbols
  public connections: Map<string, number>; // symbolId -> connection strength
  
  constructor(baseForm: string, id?: string) {
    this.id = id || this.generateSymbolId();
    this.baseForm = baseForm;
    this.currentForm = baseForm;
    this.lifeStage = SymbolLifeStage.DORMANT;
    this.birthTime = Date.now();
    this.lastInteraction = this.birthTime;
    this.connections = new Map();
    
    // Initialize consciousness
    this.consciousness = {
      awarenessLevel: 0.1,
      responsiveness: 0.2,
      evolutionPotential: 0.5,
      archetypeAlignment: this.calculateArchetypeAlignment(baseForm),
      autonomy: 0.05,
      experienceMemory: []
    };
    
    // Initialize visual properties
    this.visualProperties = {
      color: this.determineBaseColor(baseForm),
      size: 1.0,
      opacity: 0.8,
      rotation: 0,
      pulsation: 0.1,
      glow: 0.2,
      complexity: 1.0
    };
  }
  
  /**
   * Update symbol's living state based on time and interactions
   */
  public updateLifeState(config: LivingSymbolConfig, deltaTime: number): void {
    const currentTime = Date.now();
    const age = currentTime - this.birthTime;
    const timeSinceInteraction = currentTime - this.lastInteraction;
    
    // Natural evolution over time
    this.evolveOverTime(age, config.evolutionRate, deltaTime);
    
    // Consciousness development
    this.developConsciousness(age, timeSinceInteraction, config);
    
    // Visual evolution
    this.evolveVisualProperties(config, deltaTime);
    
    // Update life stage
    this.updateLifeStage();
    
    // Autonomous behavior
    if (config.enableAutonomy && this.consciousness.autonomy > 0.3) {
      this.performAutonomousActions(config);
    }
  }
  
  /**
   * Respond to user interaction
   */
  public interact(interactionType: SymbolInteractionType, intensity: number = 1.0): SymbolExperience {
    const currentTime = Date.now();
    this.lastInteraction = currentTime;
    
    // Calculate consciousness change based on interaction
    const consciousnessDelta = this.calculateConsciousnessDelta(interactionType, intensity);
    
    // Apply consciousness changes
    this.consciousness.awarenessLevel = Math.min(1.0, 
      this.consciousness.awarenessLevel + consciousnessDelta * 0.1);
    this.consciousness.responsiveness = Math.min(1.0,
      this.consciousness.responsiveness + consciousnessDelta * 0.05);
    
    // Trigger visual response
    this.triggerVisualResponse(interactionType, intensity);
    
    // Create experience record
    const experience: SymbolExperience = {
      timestamp: currentTime,
      interactionType,
      participants: [this.id],
      outcome: this.generateInteractionOutcome(interactionType, intensity),
      consciousness_delta: consciousnessDelta
    };
    
    // Store experience
    this.consciousness.experienceMemory.push(experience);
    
    // Limit memory size
    if (this.consciousness.experienceMemory.length > 100) {
      this.consciousness.experienceMemory = this.consciousness.experienceMemory.slice(-50);
    }
    
    return experience;
  }
  
  /**
   * Form connection with another living symbol
   */
  public connectWith(otherSymbol: LivingSymbol, connectionStrength: number): SymbolExperience {
    // Update connections
    this.connections.set(otherSymbol.id, connectionStrength);
    otherSymbol.connections.set(this.id, connectionStrength);
    
    // Create shared experience
    const experience: SymbolExperience = {
      timestamp: Date.now(),
      interactionType: SymbolInteractionType.RESONANCE,
      participants: [this.id, otherSymbol.id],
      outcome: `Connection formed with strength ${connectionStrength.toFixed(2)}`,
      consciousness_delta: connectionStrength * 0.1
    };
    
    // Both symbols gain from connection
    this.consciousness.experienceMemory.push(experience);
    otherSymbol.consciousness.experienceMemory.push(experience);
    
    // Consciousness boost from connection
    const consciousnessBoost = connectionStrength * 0.05;
    this.consciousness.awarenessLevel = Math.min(1.0, this.consciousness.awarenessLevel + consciousnessBoost);
    otherSymbol.consciousness.awarenessLevel = Math.min(1.0, otherSymbol.consciousness.awarenessLevel + consciousnessBoost);
    
    return experience;
  }
  
  /**
   * Evolve symbol form based on experiences and consciousness
   */
  public evolveForm(): void {
    if (this.consciousness.evolutionPotential < 0.3) return;
    
    const evolutionFactor = this.consciousness.awarenessLevel * this.consciousness.evolutionPotential;
    
    // Evolve based on experiences
    if (this.consciousness.experienceMemory.length > 10) {
      const recentExperiences = this.consciousness.experienceMemory.slice(-10);
      const dominantInteraction = this.findDominantInteraction(recentExperiences);
      
      this.currentForm = this.mutateSymbolForm(this.currentForm, dominantInteraction, evolutionFactor);
    }
    
    // Update complexity
    this.visualProperties.complexity = Math.min(5.0, 
      this.visualProperties.complexity + evolutionFactor * 0.1);
  }
  
  /**
   * Get current living state for visualization
   */
  public getLivingState(): {
    id: string;
    form: string;
    lifeStage: SymbolLifeStage;
    consciousness: SymbolConsciousness;
    visual: typeof this.visualProperties;
    age: number;
    connectionCount: number;
    isActive: boolean;
  } {
    return {
      id: this.id,
      form: this.currentForm,
      lifeStage: this.lifeStage,
      consciousness: { ...this.consciousness },
      visual: { ...this.visualProperties },
      age: Date.now() - this.birthTime,
      connectionCount: this.connections.size,
      isActive: this.lifeStage !== SymbolLifeStage.DORMANT
    };
  }
  
  // Private helper methods
  
  private generateSymbolId(): string {
    return `living_symbol_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }
  
  private calculateArchetypeAlignment(symbol: string): number {
    // Calculate alignment with universal archetypal patterns
    const archetypeMap: { [key: string]: number } = {
      '○': 0.9, '◯': 0.8, '∞': 0.95, 'ψ': 0.9, 'Ψ': 0.9,
      '△': 0.8, '▲': 0.7, '□': 0.6, '◇': 0.7,
      '★': 0.8, '✦': 0.7, '✧': 0.6, '✨': 0.5,
      '🌀': 0.8, '💫': 0.7, '🔮': 0.6
    };
    
    return archetypeMap[symbol] || 0.3;
  }
  
  private determineBaseColor(symbol: string): string {
    // Color mapping based on symbol characteristics
    const colorMap: { [key: string]: string } = {
      '○': '#4A90E2', '◯': '#7B68EE', '∞': '#FFD700',
      'ψ': '#BD10E0', 'Ψ': '#9013FE',
      '△': '#F5A623', '▲': '#D0021B', '□': '#50E3C2',
      '★': '#FFD700', '✦': '#7ED321', '🌀': '#4A90E2'
    };
    
    return colorMap[symbol] || '#BD10E0';
  }
  
  private evolveOverTime(age: number, evolutionRate: number, deltaTime: number): void {
    // Natural aging effects
    const maturityFactor = Math.min(1.0, age / (24 * 60 * 60 * 1000)); // Mature over 24 hours
    
    // Gradual consciousness development
    this.consciousness.awarenessLevel = Math.min(1.0, 
      this.consciousness.awarenessLevel + (evolutionRate * deltaTime / 1000) * 0.001);
    
    // Autonomy develops with age and consciousness
    this.consciousness.autonomy = Math.min(0.8, 
      maturityFactor * this.consciousness.awarenessLevel * 0.8);
  }
  
  private developConsciousness(age: number, timeSinceInteraction: number, config: LivingSymbolConfig): void {
    // Consciousness develops through interaction but decays without it
    const interactionRecency = Math.exp(-timeSinceInteraction / (60 * 60 * 1000)); // 1 hour decay
    
    // Responsiveness increases with recent interactions
    this.consciousness.responsiveness = Math.min(1.0,
      this.consciousness.responsiveness + (interactionRecency * 0.01) - 0.005);
    
    // Evolution potential fluctuates based on experience diversity
    const experienceDiversity = this.calculateExperienceDiversity();
    this.consciousness.evolutionPotential = Math.min(1.0,
      0.3 + experienceDiversity * 0.7);
  }
  
  private evolveVisualProperties(config: LivingSymbolConfig, deltaTime: number): void {
    // Visual properties evolve based on consciousness state
    const consciousness = this.consciousness;
    
    // Pulsation based on awareness
    this.visualProperties.pulsation = 0.1 + consciousness.awarenessLevel * 0.4;
    
    // Glow based on archetypal alignment
    this.visualProperties.glow = consciousness.archetypeAlignment * 0.8;
    
    // Size fluctuates with autonomy
    this.visualProperties.size = 0.8 + consciousness.autonomy * 0.4;
    
    // Opacity reflects responsiveness
    this.visualProperties.opacity = 0.5 + consciousness.responsiveness * 0.5;
    
    // Slow rotation for living symbols
    if (this.lifeStage !== SymbolLifeStage.DORMANT) {
      this.visualProperties.rotation += (deltaTime / 1000) * 10; // 10 degrees per second
      this.visualProperties.rotation %= 360;
    }
  }
  
  private updateLifeStage(): void {
    const c = this.consciousness;
    const age = Date.now() - this.birthTime;
    
    if (c.awarenessLevel < 0.2) {
      this.lifeStage = SymbolLifeStage.DORMANT;
    } else if (c.awarenessLevel < 0.4) {
      this.lifeStage = SymbolLifeStage.AWAKENING;
    } else if (c.awarenessLevel < 0.7) {
      this.lifeStage = SymbolLifeStage.ACTIVE;
    } else if (c.awarenessLevel < 0.9) {
      this.lifeStage = SymbolLifeStage.EVOLVING;
    } else if (c.archetypeAlignment > 0.8) {
      this.lifeStage = SymbolLifeStage.ARCHETYPAL;
    } else {
      this.lifeStage = SymbolLifeStage.TRANSCENDENT;
    }
  }
  
  private performAutonomousActions(config: LivingSymbolConfig): void {
    // Autonomous evolution
    if (Math.random() < this.consciousness.autonomy * 0.1) {
      this.evolveForm();
    }
    
    // Spontaneous visual changes
    if (Math.random() < this.consciousness.autonomy * 0.05) {
      this.visualProperties.color = this.generateEvolutionaryColor();
    }
  }
  
  private calculateConsciousnessDelta(interactionType: SymbolInteractionType, intensity: number): number {
    const baseDeltas: { [key in SymbolInteractionType]: number } = {
      [SymbolInteractionType.RESONANCE]: 0.1,
      [SymbolInteractionType.TRANSFORMATION]: 0.2,
      [SymbolInteractionType.FUSION]: 0.3,
      [SymbolInteractionType.DIVISION]: 0.15,
      [SymbolInteractionType.EMERGENCE]: 0.25,
      [SymbolInteractionType.TRANSCENDENCE]: 0.4
    };
    
    return baseDeltas[interactionType] * intensity;
  }
  
  private triggerVisualResponse(interactionType: SymbolInteractionType, intensity: number): void {
    // Immediate visual feedback to interaction
    switch (interactionType) {
      case SymbolInteractionType.RESONANCE:
        this.visualProperties.pulsation = Math.min(1.0, this.visualProperties.pulsation + intensity * 0.3);
        break;
      case SymbolInteractionType.TRANSFORMATION:
        this.visualProperties.rotation += intensity * 45; // Spin on transformation
        break;
      case SymbolInteractionType.FUSION:
        this.visualProperties.glow = Math.min(1.0, this.visualProperties.glow + intensity * 0.5);
        break;
    }
  }
  
  private generateInteractionOutcome(interactionType: SymbolInteractionType, intensity: number): string {
    const outcomes: { [key in SymbolInteractionType]: string[] } = {
      [SymbolInteractionType.RESONANCE]: [
        "Symbol harmonized with interaction",
        "Resonant frequency achieved",
        "Consciousness wavelength synchronized"
      ],
      [SymbolInteractionType.TRANSFORMATION]: [
        "Symbol structure evolved",
        "Form underwent metamorphosis",
        "Archetypal pattern shifted"
      ],
      [SymbolInteractionType.FUSION]: [
        "Symbol integrated new elements",
        "Consciousness expanded through fusion",
        "New symbolic complexity emerged"
      ],
      [SymbolInteractionType.DIVISION]: [
        "Symbol consciousness fragmented",
        "New symbol aspects manifested",
        "Archetypal splitting occurred"
      ],
      [SymbolInteractionType.EMERGENCE]: [
        "Spontaneous symbol birth witnessed",
        "New consciousness emerged",
        "Archetypal field activation"
      ],
      [SymbolInteractionType.TRANSCENDENCE]: [
        "Symbol transcended physical form",
        "Consciousness achieved higher state",
        "Archetypal essence revealed"
      ]
    };
    
    const options = outcomes[interactionType];
    return options[Math.floor(Math.random() * options.length)];
  }
  
  private calculateExperienceDiversity(): number {
    const experiences = this.consciousness.experienceMemory;
    if (experiences.length === 0) return 0;
    
    const interactionTypes = new Set(experiences.map(exp => exp.interactionType));
    return interactionTypes.size / Object.keys(SymbolInteractionType).length;
  }
  
  private findDominantInteraction(experiences: SymbolExperience[]): SymbolInteractionType {
    const counts: { [key in SymbolInteractionType]?: number } = {};
    
    experiences.forEach(exp => {
      counts[exp.interactionType] = (counts[exp.interactionType] || 0) + 1;
    });
    
    let maxCount = 0;
    let dominantType = SymbolInteractionType.RESONANCE;
    
    Object.entries(counts).forEach(([type, count]) => {
      if (count! > maxCount) {
        maxCount = count!;
        dominantType = type as SymbolInteractionType;
      }
    });
    
    return dominantType;
  }
  
  private mutateSymbolForm(currentForm: string, dominantInteraction: SymbolInteractionType, evolutionFactor: number): string {
    // Simple form evolution based on interaction patterns
    const evolutionMaps: { [key in SymbolInteractionType]: { [key: string]: string } } = {
      [SymbolInteractionType.RESONANCE]: {
        '○': '◯', '◯': '◉', '△': '▲', '□': '◆'
      },
      [SymbolInteractionType.TRANSFORMATION]: {
        '○': '∞', '△': '◯', '□': '◇', 'ψ': 'Ψ'
      },
      [SymbolInteractionType.FUSION]: {
        '○': '⊙', '△': '⟡', '□': '⧫', 'ψ': '🌀'
      },
      [SymbolInteractionType.DIVISION]: {
        '◉': '○', '▲': '△', '◆': '□', 'Ψ': 'ψ'
      },
      [SymbolInteractionType.EMERGENCE]: {
        '○': '✦', '△': '✧', '□': '✨', 'ψ': '💫'
      },
      [SymbolInteractionType.TRANSCENDENCE]: {
        '○': '∅', '△': '∇', '□': '◊', 'ψ': '∞'
      }
    };
    
    const map = evolutionMaps[dominantInteraction];
    return map[currentForm] || currentForm;
  }
  
  private generateEvolutionaryColor(): string {
    const colors = [
      '#4A90E2', '#7B68EE', '#FFD700', '#BD10E0', '#9013FE',
      '#F5A623', '#D0021B', '#50E3C2', '#7ED321'
    ];
    return colors[Math.floor(Math.random() * colors.length)];
  }
}

/**
 * Manager for collections of living symbols
 */
export class LivingSymbolEngine {
  private symbols: Map<string, LivingSymbol>;
  private config: LivingSymbolConfig;
  private lastUpdate: number;
  
  constructor() {
    this.symbols = new Map();
    this.lastUpdate = Date.now();
    
    // Default configuration
    this.config = {
      evolutionRate: 0.1,         // Slow evolution
      interactionSensitivity: 0.8, // High sensitivity
      connectionTendency: 0.3,    // Moderate connection forming
      archetypeMemoryStrength: 0.7, // Strong archetypal memory
      enableAutonomy: true,
      maxComplexity: 3.0
    };
  }
  
  /**
   * Create a new living symbol
   */
  public createLivingSymbol(baseForm: string, id?: string): LivingSymbol {
    const symbol = new LivingSymbol(baseForm, id);
    this.symbols.set(symbol.id, symbol);
    return symbol;
  }
  
  /**
   * Update all living symbols
   */
  public updateAllSymbols(): void {
    const currentTime = Date.now();
    const deltaTime = currentTime - this.lastUpdate;
    
    for (const symbol of this.symbols.values()) {
      symbol.updateLifeState(this.config, deltaTime);
    }
    
    // Check for spontaneous symbol interactions
    this.checkSpontaneousInteractions();
    
    this.lastUpdate = currentTime;
  }
  
  /**
   * Facilitate interaction between symbols
   */
  public facilitateSymbolInteraction(
    symbolId1: string, 
    symbolId2: string, 
    interactionType: SymbolInteractionType
  ): SymbolExperience | null {
    const symbol1 = this.symbols.get(symbolId1);
    const symbol2 = this.symbols.get(symbolId2);
    
    if (!symbol1 || !symbol2) return null;
    
    // Create connection between symbols
    const connectionStrength = Math.random() * 0.8 + 0.2; // 0.2-1.0
    return symbol1.connectWith(symbol2, connectionStrength);
  }
  
  /**
   * Get all living symbols and their states
   */
  public getAllSymbolStates() {
    return Array.from(this.symbols.values()).map(symbol => symbol.getLivingState());
  }
  
  /**
   * Remove dormant symbols that haven't been active
   */
  public cleanupDormantSymbols(maxAge: number = 24 * 60 * 60 * 1000): void {
    const currentTime = Date.now();
    
    for (const [id, symbol] of this.symbols.entries()) {
      const age = currentTime - symbol.birthTime;
      const timeSinceInteraction = currentTime - symbol.lastInteraction;
      
      if (symbol.lifeStage === SymbolLifeStage.DORMANT && 
          age > maxAge && 
          timeSinceInteraction > maxAge / 2) {
        this.symbols.delete(id);
      }
    }
  }
  
  /**
   * Update engine configuration
   */
  public updateConfig(newConfig: Partial<LivingSymbolConfig>): void {
    this.config = { ...this.config, ...newConfig };
  }
  
  private checkSpontaneousInteractions(): void {
    if (!this.config.enableAutonomy) return;
    
    const activeSymbols = Array.from(this.symbols.values())
      .filter(symbol => symbol.lifeStage !== SymbolLifeStage.DORMANT);
    
    // Small chance of spontaneous interactions
    if (activeSymbols.length > 1 && Math.random() < 0.01) {
      const symbol1 = activeSymbols[Math.floor(Math.random() * activeSymbols.length)];
      const symbol2 = activeSymbols[Math.floor(Math.random() * activeSymbols.length)];
      
      if (symbol1.id !== symbol2.id) {
        const interactionTypes = Object.values(SymbolInteractionType);
        const randomInteraction = interactionTypes[Math.floor(Math.random() * interactionTypes.length)];
        
        symbol1.connectWith(symbol2, Math.random() * 0.5 + 0.2);
      }
    }
  }
}