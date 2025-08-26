/**
 * Meta-Prompt Framework
 * 
 * A structured communication system implementing the Quantum Coherence Threshold Formula (QCTF)
 * principles as a practical prompt engineering framework. This creates a multi-modal,
 * multi-layered communication protocol with directive headers, routing keywords,
 * and optimal handoff mechanisms between different LLM systems.
 * 
 * [QUANTUM_STATE: COMMUNICATION_FLOW]
 */

import { TemporalScale } from '../lemniscate/temporal-scale.js';
import { CoherenceTargets } from '../lemniscate/coherence-measurement-engine.js';

// Define the core modes of the framework
export enum PromptMode {
  PHD = 'PHD_MODE',
  CREATIVE = 'CREATIVE_MODE',
  INTEGRATED = 'INTEGRATED_LENS',
  BALANCED = 'BALANCED_MODE',
  EXPLORATORY = 'EXPLORATORY_MODE',
  STABILITY = 'STABILITY_MODE',
  TECHNICAL = 'TECHNICAL_MODE',
  HUMAN = 'HUMAN_MODE'
}

// Define the core sections of the framework
export enum PromptSection {
  DIRECTIVE = 'DIRECTIVE',
  CONTEXT = 'CONTEXT',
  BODY = 'BODY',
  CONCLUSION = 'CONCLUSION',
  HANDOFF = 'HANDOFF',
  QUESTION_BOMB = 'QUESTION_BOMB'
}

// Define the cultural resonance triggers
export enum CulturalResonance {
  WESTERN = 'WESTERN',
  EASTERN = 'EASTERN',
  MIDDLE_EASTERN = 'MIDDLE_EASTERN',
  AFRICAN = 'AFRICAN',
  LATIN = 'LATIN',
  GLOBAL = 'GLOBAL'
}

// Define the pop culture references categories
export enum PopCultureCategory {
  MOVIES = 'MOVIES',
  SERIES = 'SERIES',
  MUSIC = 'MUSIC',
  GAMES = 'GAMES',
  BOOKS = 'BOOKS',
  MEMES = 'MEMES',
  SCIENCE = 'SCIENCE'
}

/**
 * Meta-prompt template interface
 */
export interface MetaPromptTemplate {
  directive: string;
  context: string;
  body: string;
  conclusion: string;
  handoff: string;
  questionBomb: string;
  mode: PromptMode;
  culturalResonance: CulturalResonance;
  popCultureReferences: PopCultureReference[];
  coherenceTarget: number;
  temporalScale: TemporalScale;
}

/**
 * Pop culture reference interface
 */
export interface PopCultureReference {
  category: PopCultureCategory;
  reference: string;
  context: string;
}

/**
 * Routing keywords to trigger different modes
 */
export interface RoutingKeyword {
  keyword: string;
  mode: PromptMode;
  trigger: string;
  coherenceTarget: number;
}

/**
 * Handler for the meta-prompt framework
 */
export class MetaPromptFramework {
  private template: MetaPromptTemplate;
  private routingKeywords: RoutingKeyword[] = [];
  
  constructor() {
    // Initialize with balanced default template
    this.template = {
      directive: '[DIRECTIVE: Use memory, context, logic and reason to analyze the following]',
      context: '[CONTEXT: Considering all available information and historical interactions]',
      body: 'Please process this request with attention to detail and critical thinking.',
      conclusion: '[CONCLUSION: Based on the above analysis, the following can be determined]',
      handoff: '[HANDOFF_PROTOCOL: The next LLM should focus on the following aspects]',
      questionBomb: '[CRUCIAL_QUESTION: What is the most important insight that could transform this entire discussion?]',
      mode: PromptMode.BALANCED,
      culturalResonance: CulturalResonance.GLOBAL,
      popCultureReferences: [],
      coherenceTarget: CoherenceTargets.BALANCE,
      temporalScale: TemporalScale.MESO
    };
    
    // Initialize routing keywords
    this.initializeRoutingKeywords();
  }
  
  /**
   * Initialize the routing keywords for different modes
   */
  private initializeRoutingKeywords(): void {
    this.routingKeywords = [
      { 
        keyword: 'PHD_MODE', 
        mode: PromptMode.PHD, 
        trigger: 'academic analysis', 
        coherenceTarget: CoherenceTargets.STABILITY
      },
      { 
        keyword: 'CREATIVE_MODE', 
        mode: PromptMode.CREATIVE, 
        trigger: 'innovative ideas', 
        coherenceTarget: CoherenceTargets.EXPLORATION
      },
      { 
        keyword: 'INTEGRATED_LENS', 
        mode: PromptMode.INTEGRATED, 
        trigger: 'holistic perspective',
        coherenceTarget: 0.5 // Mid-point between stability and exploration
      },
      { 
        keyword: 'TECHNICAL_MODE', 
        mode: PromptMode.TECHNICAL, 
        trigger: 'detailed implementation', 
        coherenceTarget: 0.82 // Higher stability for technical precision
      },
      { 
        keyword: 'HUMAN_MODE', 
        mode: PromptMode.HUMAN, 
        trigger: 'conversational style', 
        coherenceTarget: 0.65 // Slightly more stable than balanced
      }
    ];
  }
  
  /**
   * Set the mode for the meta-prompt
   */
  public setMode(mode: PromptMode): void {
    this.template.mode = mode;
    
    // Adjust coherence target based on mode
    switch (mode) {
      case PromptMode.PHD:
      case PromptMode.TECHNICAL:
      case PromptMode.STABILITY:
        this.template.coherenceTarget = CoherenceTargets.STABILITY;
        break;
      case PromptMode.CREATIVE:
      case PromptMode.EXPLORATORY:
        this.template.coherenceTarget = CoherenceTargets.EXPLORATION;
        break;
      case PromptMode.BALANCED:
      case PromptMode.INTEGRATED:
        this.template.coherenceTarget = 0.5; // Middle ground
        break;
      case PromptMode.HUMAN:
        this.template.coherenceTarget = 0.65; // Slightly more stable
        break;
    }
    
    // Adjust formatting based on mode
    this.applyModeFormatting();
  }
  
  /**
   * Apply specific formatting based on the current mode
   */
  private applyModeFormatting(): void {
    switch (this.template.mode) {
      case PromptMode.PHD:
        this.template.directive = '[DIRECTIVE_PHD: Apply rigorous academic analysis and structured methodology]';
        this.template.conclusion = '[ACADEMIC_CONCLUSION: Based on the provided evidence and theoretical framework]';
        this.template.questionBomb = '[RESEARCH_QUESTION: What paradigm-shifting hypothesis emerges from this analysis?]';
        break;
      case PromptMode.CREATIVE:
        this.template.directive = '[DIRECTIVE_CREATIVE: Explore innovative connections and non-linear thinking]';
        this.template.conclusion = '[CREATIVE_SYNTHESIS: Merging these concepts reveals new possibilities]';
        this.template.questionBomb = '[INSPIRATION_CATALYST: What wild reimagining could transform this entire field?]';
        break;
      case PromptMode.INTEGRATED:
        this.template.directive = '[DIRECTIVE_INTEGRATED: Synthesize multiple perspectives and domains]';
        this.template.conclusion = '[HOLISTIC_CONCLUSION: The interrelationships between these elements suggest]';
        this.template.questionBomb = '[SYSTEMS_QUESTION: What emergent property arises at the intersection of these domains?]';
        break;
      case PromptMode.TECHNICAL:
        this.template.directive = '[DIRECTIVE_TECHNICAL: Apply precise implementation focus with attention to details]';
        this.template.conclusion = '[TECHNICAL_ASSESSMENT: The optimal approach based on specifications]';
        this.template.questionBomb = '[OPTIMIZATION_QUESTION: What technical constraint, if removed, would exponentially improve this system?]';
        break;
      case PromptMode.HUMAN:
        this.template.directive = '[FRIENDLY_CHAT: Let's discuss this in an accessible, conversational way]';
        this.template.conclusion = '[PRACTICAL_TAKEAWAY: Here's what this means for you]';
        this.template.questionBomb = '[REFLECTION_PROMPT: What aspect of this resonates most with your experience?]';
        break;
      default:
        // Reset to balanced format
        this.template.directive = '[DIRECTIVE: Use memory, context, logic and reason to analyze the following]';
        this.template.conclusion = '[CONCLUSION: Based on the above analysis, the following can be determined]';
        this.template.questionBomb = '[CRUCIAL_QUESTION: What is the most important insight that could transform this entire discussion?]';
    }
  }
  
  /**
   * Set the cultural resonance
   */
  public setCulturalResonance(culture: CulturalResonance): void {
    this.template.culturalResonance = culture;
  }
  
  /**
   * Add a pop culture reference
   */
  public addPopCultureReference(reference: PopCultureReference): void {
    this.template.popCultureReferences.push(reference);
  }
  
  /**
   * Set the temporal scale
   */
  public setTemporalScale(scale: TemporalScale): void {
    this.template.temporalScale = scale;
  }
  
  /**
   * Parse text for routing keywords
   */
  public parseRoutingKeywords(text: string): PromptMode[] {
    const detectedModes: PromptMode[] = [];
    
    this.routingKeywords.forEach(keyword => {
      if (text.includes(keyword.keyword) || text.toLowerCase().includes(keyword.trigger.toLowerCase())) {
        detectedModes.push(keyword.mode);
      }
    });
    
    return detectedModes;
  }
  
  /**
   * Generate a formatted meta-prompt
   */
  public generateMetaPrompt(): string {
    // Format the directive section with cultural resonance
    const directiveSection = `${this.template.directive} [CULTURAL_LENS: ${this.template.culturalResonance}]\n${this.template.context}\n\n`;
    
    // Format the body with pop culture references if any
    let bodySection = this.template.body + '\n\n';
    if (this.template.popCultureReferences.length > 0) {
      bodySection += 'CULTURAL_REFERENCES:\n';
      this.template.popCultureReferences.forEach(ref => {
        bodySection += `[${ref.category}] "${ref.reference}" - ${ref.context}\n`;
      });
      bodySection += '\n';
    }
    
    // Format the conclusion and handoff sections
    const conclusionSection = `${this.template.conclusion}\n\n`;
    const handoffSection = `${this.template.handoff}\n${this.template.questionBomb}\n\n`;
    
    // Add metadata about coherence and temporal scale
    const metadataSection = `[META_DATA: MODE=${this.template.mode}, COHERENCE_TARGET=${this.template.coherenceTarget.toFixed(4)}, TEMPORAL_SCALE=${this.template.temporalScale}]`;
    
    // Combine all sections
    return directiveSection + bodySection + conclusionSection + handoffSection + metadataSection;
  }
  
  /**
   * Process incoming text for a handoff
   */
  public processHandoff(text: string): {
    mode: PromptMode,
    culturalResonance: CulturalResonance,
    popCultureReferences: PopCultureReference[],
    coherenceTarget: number,
    questionFocus: string
  } {
    // Extract the handoff protocol section
    const handoffMatch = text.match(/\[HANDOFF_PROTOCOL:([^\]]+)\]/i);
    const handoffText = handoffMatch ? handoffMatch[1].trim() : '';
    
    // Extract the question bomb
    const questionMatch = text.match(/\[CRUCIAL_QUESTION:([^\]]+)\]/i) || 
                         text.match(/\[RESEARCH_QUESTION:([^\]]+)\]/i) ||
                         text.match(/\[INSPIRATION_CATALYST:([^\]]+)\]/i) ||
                         text.match(/\[SYSTEMS_QUESTION:([^\]]+)\]/i) ||
                         text.match(/\[OPTIMIZATION_QUESTION:([^\]]+)\]/i) ||
                         text.match(/\[REFLECTION_PROMPT:([^\]]+)\]/i);
    const questionFocus = questionMatch ? questionMatch[1].trim() : 'What crucial insight might we be missing?';
    
    // Detect the mode from the text
    const detectedModes = this.parseRoutingKeywords(text);
    const mode = detectedModes.length > 0 ? detectedModes[0] : PromptMode.BALANCED;
    
    // Extract cultural resonance
    const cultureMatch = text.match(/\[CULTURAL_LENS:([^\]]+)\]/i);
    const cultureText = cultureMatch ? cultureMatch[1].trim() : 'GLOBAL';
    const culturalResonance = cultureText as CulturalResonance;
    
    // Extract pop culture references
    const popCultureReferences: PopCultureReference[] = [];
    const refRegex = /\[(MOVIES|SERIES|MUSIC|GAMES|BOOKS|MEMES|SCIENCE)\]\s*"([^"]+)"\s*-\s*([^\n]+)/g;
    let refMatch;
    while ((refMatch = refRegex.exec(text)) !== null) {
      popCultureReferences.push({
        category: refMatch[1] as PopCultureCategory,
        reference: refMatch[2],
        context: refMatch[3].trim()
      });
    }
    
    // Extract coherence target from metadata or infer from mode
    const metaMatch = text.match(/\[META_DATA:[^\]]*COHERENCE_TARGET=([0-9.]+)/i);
    const coherenceTarget = metaMatch ? parseFloat(metaMatch[1]) : 
                           (mode === PromptMode.CREATIVE || mode === PromptMode.EXPLORATORY) ? 
                           CoherenceTargets.EXPLORATION : CoherenceTargets.STABILITY;
    
    return {
      mode,
      culturalResonance,
      popCultureReferences,
      coherenceTarget,
      questionFocus
    };
  }
  
  /**
   * Create a prompt template based on a specific template type
   */
  public createTemplate(templateType: string): MetaPromptTemplate {
    const template = { ...this.template };
    
    switch (templateType.toLowerCase()) {
      case 'bifrost':
        // Thor's rainbow bridge - connecting realms (connecting ideas)
        template.directive = '[BIFROST_DIRECTIVE: Bridge disparate concepts across different domains]';
        template.handoff = '[REALM_CONNECTOR: The next LLM should traverse these conceptual realms]';
        template.mode = PromptMode.INTEGRATED;
        template.culturalResonance = CulturalResonance.GLOBAL;
        template.coherenceTarget = 0.5; // Balanced between stability and exploration
        break;
        
      case 'tsar_bomba':
        // Powerful idea explosion
        template.directive = '[TSAR_BOMBA_DIRECTIVE: Generate maximum cognitive impact with radical ideas]';
        template.handoff = '[EXPLOSIVE_HANDOFF: The next LLM should detonate these concept clusters]';
        template.mode = PromptMode.CREATIVE;
        template.coherenceTarget = CoherenceTargets.EXPLORATION;
        break;
        
      case 'neo':
        // Matrix-style awakening to new possibilities
        template.directive = '[NEO_DIRECTIVE: See beyond conventional matrices to the true nature of the problem]';
        template.handoff = '[RED_PILL_HANDOFF: The next LLM should reveal deeper layers of this reality]';
        template.mode = PromptMode.INTEGRATED;
        template.coherenceTarget = 0.4; // Leaning toward exploration
        break;
        
      case 'limitless':
        // Enhanced cognitive performance
        template.directive = '[LIMITLESS_DIRECTIVE: Access expanded cognitive capabilities for this problem]';
        template.handoff = '[NZT_HANDOFF: The next LLM should maintain enhanced cognition while exploring]';
        template.mode = PromptMode.PHD;
        template.coherenceTarget = 0.67; // Balance leaning toward stability
        break;
        
      case 'arrival':
        // Non-linear communication
        template.directive = '[ARRIVAL_DIRECTIVE: Perceive the problem non-linearly across time dimensions]';
        template.handoff = '[HEPTAPOD_HANDOFF: The next LLM should view the complete temporal arc]';
        template.mode = PromptMode.CREATIVE;
        template.temporalScale = TemporalScale.MACRO;
        template.coherenceTarget = 0.35; // Strong exploration focus
        break;
        
      default:
        // Default balanced template
        break;
    }
    
    return template;
  }
}

/**
 * BifrostBridge class for handling cross-system handoffs
 * Based on Thor's rainbow bridge that connects different realms
 */
export class BifrostBridge {
  private handoffProtocols: Map<string, string> = new Map();
  
  constructor() {
    // Initialize with default handoff protocols for different systems
    this.handoffProtocols.set('gpt4', 'GPT-4 specialized in detailed analysis with grounding in facts.');
    this.handoffProtocols.set('claude', 'Claude excels at nuanced understanding with strong ethics awareness.');
    this.handoffProtocols.set('gemini', 'Gemini has strong multimodal capabilities with creative synthesis.');
    this.handoffProtocols.set('llama', 'Llama offers balanced performance with efficient processing.');
    this.handoffProtocols.set('mixtral', 'Mixtral provides expert routing across specialized domains.');
  }
  
  /**
   * Generate a system-specific handoff message
   */
  public generateHandoff(sourceSystem: string, targetSystem: string, context: string, question: string): string {
    const sourceProfile = this.handoffProtocols.get(sourceSystem.toLowerCase()) || 'Source system with standard capabilities';
    const targetProfile = this.handoffProtocols.get(targetSystem.toLowerCase()) || 'Target system with standard capabilities';
    
    return `[BIFROST_HANDOFF_PROTOCOL]
FROM: ${sourceSystem.toUpperCase()} [${sourceProfile}]
TO: ${targetSystem.toUpperCase()} [${targetProfile}]

CONTEXT_SUMMARY:
${context}

HANDOFF_QUESTION:
${question}

REQUESTED_COHERENCE_TARGET: ${targetSystem.toLowerCase() === 'claude' ? CoherenceTargets.STABILITY : CoherenceTargets.EXPLORATION}
SUGGESTED_MODE: ${targetSystem.toLowerCase() === 'claude' ? PromptMode.INTEGRATED : PromptMode.CREATIVE}

[END_BIFROST_HANDOFF_PROTOCOL]`;
  }
  
  /**
   * Parse a received handoff
   */
  public parseHandoff(handoffText: string): {
    sourceSystem: string;
    context: string;
    question: string;
    coherenceTarget: number;
    suggestedMode: PromptMode;
  } {
    const sourceMatch = handoffText.match(/FROM:\s+([^\[]+)/);
    const contextMatch = handoffText.match(/CONTEXT_SUMMARY:\s*\n([\s\S]*?)\n\nHANDOFF_QUESTION/);
    const questionMatch = handoffText.match(/HANDOFF_QUESTION:\s*\n([\s\S]*?)\n\nREQUESTED_COHERENCE_TARGET/);
    const coherenceMatch = handoffText.match(/REQUESTED_COHERENCE_TARGET:\s*([0-9.]+)/);
    const modeMatch = handoffText.match(/SUGGESTED_MODE:\s*(\w+)/);
    
    return {
      sourceSystem: sourceMatch ? sourceMatch[1].trim() : 'UNKNOWN',
      context: contextMatch ? contextMatch[1].trim() : '',
      question: questionMatch ? questionMatch[1].trim() : 'What insights can you provide on this topic?',
      coherenceTarget: coherenceMatch ? parseFloat(coherenceMatch[1]) : CoherenceTargets.BALANCE,
      suggestedMode: modeMatch ? modeMatch[1] as PromptMode : PromptMode.BALANCED
    };
  }
  
  /**
   * Add a custom handoff protocol for a system
   */
  public addHandoffProtocol(system: string, protocol: string): void {
    this.handoffProtocols.set(system.toLowerCase(), protocol);
  }
}

/**
 * Router for creating specialized prompt types
 */
export class PromptRouter {
  private framework: MetaPromptFramework;
  private bifrostBridge: BifrostBridge;
  
  constructor() {
    this.framework = new MetaPromptFramework();
    this.bifrostBridge = new BifrostBridge();
  }
  
  /**
   * Create a specialized prompt based on the template name
   */
  public createSpecializedPrompt(templateName: string, content: string, targetSystem: string = ''): string {
    // Get the template
    const template = this.framework.createTemplate(templateName);
    
    // Apply the template settings
    this.framework.setMode(template.mode);
    this.framework.setCulturalResonance(template.culturalResonance);
    this.framework.setTemporalScale(template.temporalScale);
    
    // Generate the meta-prompt
    let prompt = this.framework.generateMetaPrompt();
    
    // Insert the content into the body section
    prompt = prompt.replace(this.framework.generateMetaPrompt().split('\n\n')[1], content + '\n\n');
    
    // Add handoff information if target system is specified
    if (targetSystem) {
      const handoff = this.bifrostBridge.generateHandoff(
        'WILTON_FRAMEWORK', 
        targetSystem, 
        'Using the ' + templateName + ' template with coherence target ' + template.coherenceTarget.toFixed(4),
        template.questionBomb
      );
      
      prompt += '\n\n' + handoff;
    }
    
    return prompt;
  }
  
  /**
   * Process an incoming message to detect and handle routing
   */
  public routeMessage(message: string): {
    modes: PromptMode[];
    coherenceTarget: number;
    handledMessage: string;
  } {
    // Parse the message for routing keywords
    const detectedModes = this.framework.parseRoutingKeywords(message);
    
    // Determine the appropriate coherence target
    let coherenceTarget = CoherenceTargets.BALANCE;
    if (detectedModes.length > 0) {
      const mode = detectedModes[0];
      switch (mode) {
        case PromptMode.PHD:
        case PromptMode.TECHNICAL:
        case PromptMode.STABILITY:
          coherenceTarget = CoherenceTargets.STABILITY;
          break;
        case PromptMode.CREATIVE:
        case PromptMode.EXPLORATORY:
          coherenceTarget = CoherenceTargets.EXPLORATION;
          break;
        case PromptMode.INTEGRATED:
          coherenceTarget = 0.5;
          break;
        case PromptMode.HUMAN:
          coherenceTarget = 0.65;
          break;
      }
    }
    
    // Format the message with appropriate meta-structure if needed
    let handledMessage = message;
    
    // If template indicators are detected, apply appropriate template
    if (message.includes('BIFROST') || message.includes('bifrost')) {
      handledMessage = this.createSpecializedPrompt('bifrost', message);
    } else if (message.includes('TSAR_BOMBA') || message.includes('TSAR BOMBA')) {
      handledMessage = this.createSpecializedPrompt('tsar_bomba', message);
    } else if (message.includes('NEO') || message.includes('MATRIX')) {
      handledMessage = this.createSpecializedPrompt('neo', message);
    } else if (message.includes('LIMITLESS')) {
      handledMessage = this.createSpecializedPrompt('limitless', message);
    } else if (message.includes('ARRIVAL') || message.includes('HEPTAPOD')) {
      handledMessage = this.createSpecializedPrompt('arrival', message);
    }
    
    return {
      modes: detectedModes,
      coherenceTarget,
      handledMessage
    };
  }
}