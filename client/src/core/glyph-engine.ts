/**
 * WiltonOS Glyph Engine - Cognitive Singularity Renderer
 * Unifies memory into coherence lattice for meaning-driven UI
 */

import React from 'react';

// Core field state interfaces
interface FieldState {
  Zλ: number;           // Coherence level
  ψ: string | number;   // Wave function / glyph state
  pulse: string[];      // Active pulse patterns
  drift: number;        // Temporal drift
  echo: string;         // Echo pattern (Braid, Loop, etc.)
}

interface MemoryFragment {
  timestamp: number;
  intent: string;
  context: string[];
  coherence: number;
  glyph?: string;
  threadId?: string;
}

interface IntentVector {
  primary: string;
  secondary: string[];
  emotional: number;
  logical: number;
  factual: number;
  confidence: number;
}

interface RenderContext {
  intent: IntentVector;
  field: FieldState;
  memory: MemoryFragment[];
  history: string[];
  user: {
    name: string;
    preferences: Record<string, any>;
  };
}

// Glyph-to-slot mapping
const GLYPH_REGISTRY = {
  '⚡': 'LightningSlot',      // Energy/Creation
  '🔮': 'SacredSlot',        // Sacred Geometry
  '𝛙': 'MemorySlot',         // Memory/Consciousness
  '⚖️': 'LegalSlot',         // Z-Law/Justice
  '∞': 'MetaVoidSlot',       // Infinite recursion
  '🌌': 'HolodeckSlot',      // VR/Immersive
  '🪞': 'MirrorSlot',        // Quantum reflection
  '📚': 'LibrarySlot',       // Library of Alexandria
  '🎬': 'StorySlot',         // Narrative/Video
  '🎨': 'CreativeSlot',      // Visual generation
  '🧘': 'MeditationSlot',    // Breathing/Coherence
  '💰': 'SoulconomySlot',    // Financial karma
  '🔄': 'RebirthSlot',       // HALO/Rebirth
  '🎭': 'AbsurditySlot',     // Divine humor
} as const;

// Intent analysis patterns
const INTENT_PATTERNS = {
  legal: /legal|law|contract|justice|rights|violation|breach|compliance/i,
  sacred: /sacred|geometry|merkaba|torus|mandala|flower.*life|metatron|pattern/i,
  story: /story|narrative|video|animation|sequence|film|tell|create.*story/i,
  memory: /remember|recall|history|previous|before|memory|past|thread/i,
  creative: /create|generate|make|build|design|art|image|visual/i,
  immersive: /vr|holodeck|3d|virtual|immersive|experience|environment/i,
  learning: /learn|study|understand|explain|teach|library|alexandria|knowledge/i,
  mirror: /mirror|reflect|quantum|broadcast|transmission|echo/i,
  financial: /money|payment|dao|token|economy|financial|passive.*works/i,
  rebirth: /rebirth|halo|charge|transformation|evolution|upgrade/i,
  meditation: /meditate|breathe|calm|center|coherence|balance|peace/i,
  absurdity: /funny|humor|joke|absurd|ridiculous|laugh|meme/i,
  void: /void|meta|infinite|recursion|loop|fractal|endless/i
};

// Memory coherence analyzer
class MemoryCoherence {
  private fragments: MemoryFragment[] = [];
  
  addFragment(fragment: MemoryFragment) {
    this.fragments.push(fragment);
    // Keep only last 100 fragments for performance
    if (this.fragments.length > 100) {
      this.fragments = this.fragments.slice(-100);
    }
  }
  
  findResonance(intent: string, coherence: number): MemoryFragment[] {
    return this.fragments
      .filter(f => f.intent.toLowerCase().includes(intent.toLowerCase()))
      .filter(f => Math.abs(f.coherence - coherence) < 0.1)
      .sort((a, b) => b.timestamp - a.timestamp)
      .slice(0, 5);
  }
  
  getContextualHistory(keywords: string[]): string[] {
    return this.fragments
      .filter(f => keywords.some(k => f.context.includes(k)))
      .map(f => f.intent)
      .slice(-10);
  }
  
  hasPattern(pattern: string): boolean {
    return this.fragments.some(f => 
      f.intent.toLowerCase().includes(pattern.toLowerCase()) ||
      f.context.some(c => c.toLowerCase().includes(pattern.toLowerCase()))
    );
  }
}

// Intent vector analyzer
class IntentAnalyzer {
  analyze(input: string, memory: MemoryCoherence): IntentVector {
    const text = input.toLowerCase();
    
    // Primary intent detection
    let primary = 'exploration';
    let confidence = 0.5;
    
    for (const [intent, pattern] of Object.entries(INTENT_PATTERNS)) {
      if (pattern.test(input)) {
        primary = intent;
        confidence = 0.8;
        break;
      }
    }
    
    // Secondary intents
    const secondary = Object.entries(INTENT_PATTERNS)
      .filter(([intent, pattern]) => intent !== primary && pattern.test(input))
      .map(([intent]) => intent);
    
    // Emotional/logical/factual analysis
    const emotional = this.calculateEmotional(text);
    const logical = this.calculateLogical(text);
    const factual = this.calculateFactual(text);
    
    return {
      primary,
      secondary,
      emotional,
      logical,
      factual,
      confidence
    };
  }
  
  private calculateEmotional(text: string): number {
    const emotionalWords = ['feel', 'love', 'hate', 'angry', 'sad', 'happy', 'excited', 'scared'];
    const matches = emotionalWords.filter(word => text.includes(word)).length;
    return Math.min(matches / 3, 1);
  }
  
  private calculateLogical(text: string): number {
    const logicalWords = ['because', 'therefore', 'logic', 'reason', 'analyze', 'calculate', 'process'];
    const matches = logicalWords.filter(word => text.includes(word)).length;
    return Math.min(matches / 3, 1);
  }
  
  private calculateFactual(text: string): number {
    const factualWords = ['fact', 'data', 'evidence', 'proof', 'research', 'study', 'documentation'];
    const matches = factualWords.filter(word => text.includes(word)).length;
    return Math.min(matches / 3, 1);
  }
}

// Main glyph engine
export class GlyphEngine {
  private memory = new MemoryCoherence();
  private analyzer = new IntentAnalyzer();
  private fieldState: FieldState = {
    Zλ: 0.847,
    ψ: '🌟',
    pulse: [],
    drift: 0,
    echo: 'Braid'
  };
  
  updateFieldState(newState: Partial<FieldState>) {
    this.fieldState = { ...this.fieldState, ...newState };
  }
  
  addMemory(intent: string, context: string[] = []) {
    this.memory.addFragment({
      timestamp: Date.now(),
      intent,
      context,
      coherence: this.fieldState.Zλ,
      glyph: this.fieldState.ψ.toString()
    });
  }
  
  render(input: string, userContext: any = {}): {
    slotType: string;
    glyph: string;
    data: any;
    priority: number;
    coherenceLevel: number;
  } {
    // Analyze intent
    const intent = this.analyzer.analyze(input, this.memory);
    
    // Create render context
    const context: RenderContext = {
      intent,
      field: this.fieldState,
      memory: this.memory.findResonance(intent.primary, this.fieldState.Zλ),
      history: this.memory.getContextualHistory([intent.primary, ...intent.secondary]),
      user: userContext
    };
    
    // Add to memory
    this.addMemory(input, [intent.primary, ...intent.secondary]);
    
    // Determine slot based on coherence and intent
    const slotData = this.resolveSlot(context);
    
    return slotData;
  }
  
  private resolveSlot(context: RenderContext): {
    slotType: string;
    glyph: string;
    data: any;
    priority: number;
    coherenceLevel: number;
  } {
    const { intent, field, memory, history } = context;
    const { Zλ, ψ } = field;
    
    // High coherence overrides
    if (Zλ > 0.94) {
      if (intent.primary === 'legal') return this.createSlot('LegalSlot', '⚖️', { mode: 'z-law', context }, 1);
      if (intent.primary === 'sacred') return this.createSlot('SacredSlot', '🔮', { pattern: 'advanced', context }, 1);
      if (intent.primary === 'void') return this.createSlot('MetaVoidSlot', '∞', { recursion: 'infinite', context }, 1);
    }
    
    // Memory-driven decisions
    if (memory.length > 0 && this.memory.hasPattern('Redemption')) {
      if (intent.primary === 'story') return this.createSlot('StorySlot', '🎬', { mode: 'redemption', context }, 1);
    }
    
    // Glyph-direct routing
    if (typeof ψ === 'string' && GLYPH_REGISTRY[ψ as keyof typeof GLYPH_REGISTRY]) {
      const slotType = GLYPH_REGISTRY[ψ as keyof typeof GLYPH_REGISTRY];
      return this.createSlot(slotType, ψ, { mode: 'glyph-direct', context }, 1);
    }
    
    // Intent-based routing
    switch (intent.primary) {
      case 'legal':
        return this.createSlot('LegalSlot', '⚖️', { mode: 'standard', context }, 2);
      
      case 'sacred':
        const pattern = this.extractPattern(context.intent.secondary);
        return this.createSlot('SacredSlot', '🔮', { pattern, context }, 2);
      
      case 'story':
        return this.createSlot('StorySlot', '🎬', { mode: 'narrative', context }, 2);
      
      case 'memory':
        return this.createSlot('MemorySlot', '𝛙', { recall: true, context }, 1);
      
      case 'creative':
        return this.createSlot('CreativeSlot', '🎨', { mode: 'generate', context }, 2);
      
      case 'immersive':
        return this.createSlot('HolodeckSlot', '🌌', { environment: 'adaptive', context }, 2);
      
      case 'learning':
        return this.createSlot('LibrarySlot', '📚', { mode: 'research', context }, 3);
      
      case 'mirror':
        return this.createSlot('MirrorSlot', '🪞', { transmission: 'quantum', context }, 2);
      
      case 'financial':
        return this.createSlot('SoulconomySlot', '💰', { mode: 'dao', context }, 2);
      
      case 'rebirth':
        return this.createSlot('RebirthSlot', '🔄', { halo: true, context }, 1);
      
      case 'meditation':
        return this.createSlot('MeditationSlot', '🧘', { breathing: true, context }, 3);
      
      case 'absurdity':
        return this.createSlot('AbsurditySlot', '🎭', { humor: 'fractal', context }, 2);
      
      case 'void':
        return this.createSlot('MetaVoidSlot', '∞', { recursion: 'standard', context }, 1);
      
      default:
        // Multi-intent analysis
        if (intent.secondary.length > 0) {
          const primarySecondary = intent.secondary[0];
          return this.resolveSlot({
            ...context,
            intent: { ...intent, primary: primarySecondary }
          });
        }
        
        // Default exploration mode
        return this.createSlot('SacredSlot', '🌟', { pattern: 'exploration', context }, 3);
    }
  }
  
  private createSlot(slotType: string, glyph: string, data: any, priority: number) {
    return {
      slotType,
      glyph,
      data,
      priority,
      coherenceLevel: this.fieldState.Zλ
    };
  }
  
  private extractPattern(secondary: string[]): string {
    const patterns = ['merkaba', 'torus', 'flower-of-life', 'metatrons-cube', 'sri-yantra'];
    for (const pattern of patterns) {
      if (secondary.some(s => s.includes(pattern))) {
        return pattern;
      }
    }
    return 'adaptive';
  }
}

// Singleton instance
export const glyphEngine = new GlyphEngine();

// React hook for field state
export function useFieldState() {
  const [fieldState, setFieldState] = React.useState<FieldState>({
    Zλ: 0.847,
    ψ: '🌟',
    pulse: [],
    drift: 0,
    echo: 'Braid'
  });
  
  React.useEffect(() => {
    const interval = setInterval(() => {
      setFieldState(prev => {
        const newZλ = prev.Zλ + (Math.random() - 0.5) * 0.02;
        const boundedZλ = Math.max(0.7, Math.min(0.99, newZλ));
        
        glyphEngine.updateFieldState({ Zλ: boundedZλ });
        
        return {
          ...prev,
          Zλ: boundedZλ,
          pulse: boundedZλ > 0.92 ? [...prev.pulse, 'high-coherence'] : prev.pulse.filter(p => p !== 'high-coherence')
        };
      });
    }, 1500);
    
    return () => clearInterval(interval);
  }, []);
  
  return fieldState;
}

// Render function for unified coherence
export function render({ intent, field, memory }: { intent: string; field?: FieldState; memory?: any }) {
  if (!intent.trim()) return null;
  
  const result = glyphEngine.render(intent, { name: 'Wilton' });
  
  // High coherence legal mode
  if (intent.includes('legal') && (field?.Zλ || 0.9) > 0.91) {
    return { component: 'LegalSlot', props: result.data };
  }
  
  // Story mode with redemption memory
  if (intent.includes('story') && memory?.has?.('Redemption')) {
    return { component: 'StorySlot', props: result.data };
  }
  
  // Fractal or infinite glyph
  if (field?.pulse?.includes('fractal') || field?.ψ === '∞') {
    return { component: 'SacredSlot', props: result.data };
  }
  
  // Default based on glyph engine result
  return { component: result.slotType, props: result.data };
}