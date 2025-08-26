/**
 * Prompt Examples
 * 
 * This file contains practical examples of using the Meta-Prompt Framework
 * to generate structured communications optimized for different LLM systems,
 * modes, and coherence targets.
 * 
 * [QUANTUM_STATE: EXAMPLE_FLOW]
 */

import { 
  MetaPromptFramework, 
  PromptMode, 
  CulturalResonance, 
  PopCultureCategory,
  BifrostBridge,
  PromptRouter
} from './meta-prompt-framework.js';
import { TemporalScale } from '../lemniscate/temporal-scale.js';
import { CoherenceTargets } from '../lemniscate/coherence-measurement-engine.js';

/**
 * Generate a set of examples showcasing different prompt patterns
 */
function generateExamples(): void {
  console.log('===============================================');
  console.log('META-PROMPT FRAMEWORK EXAMPLES');
  console.log('===============================================\n');
  
  // Create an instance of the framework
  const framework = new MetaPromptFramework();
  const bridge = new BifrostBridge();
  const router = new PromptRouter();
  
  // Example 1: Academic/PHD Mode
  console.log('=== EXAMPLE 1: ACADEMIC/PHD MODE ===\n');
  framework.setMode(PromptMode.PHD);
  
  // Add a relevant pop culture reference
  framework.addPopCultureReference({
    category: PopCultureCategory.MOVIES,
    reference: "Arrival",
    context: "Linguistic relativism and non-linear perception of time as analytical framework"
  });
  
  const academicPrompt = framework.generateMetaPrompt().replace(
    'Please process this request with attention to detail and critical thinking.',
    'Analyze the mathematical foundations of the Quantum Coherence Threshold Formula (QCTF) and its implications for measuring AI system alignment with human intent. Focus on the oscillation between stability (0.7500) and exploration (0.2494) states.'
  );
  
  console.log(academicPrompt);
  console.log('\n');
  
  // Example 2: Creative Mode with TSAR BOMBA template
  console.log('=== EXAMPLE 2: CREATIVE MODE WITH TSAR BOMBA TEMPLATE ===\n');
  const creativeBomb = router.createSpecializedPrompt(
    'tsar_bomba',
    'Generate innovative applications of the lemniscate (infinity symbol) visualization for tracking multiple AI agent coherence across temporal scales. Think beyond conventional dashboards.',
    'gemini'
  );
  
  console.log(creativeBomb);
  console.log('\n');
  
  // Example 3: Integrated Lens with Bifrost template
  console.log('=== EXAMPLE 3: INTEGRATED LENS WITH BIFROST TEMPLATE ===\n');
  const integratedBridge = router.createSpecializedPrompt(
    'bifrost',
    'Connect the mathematical principles of the QCTF with everyday human communication patterns. How might the stability-exploration oscillation map to different cultural communication styles?',
    'claude'
  );
  
  console.log(integratedBridge);
  console.log('\n');
  
  // Example 4: System Handoff Protocol
  console.log('=== EXAMPLE 4: SYSTEM HANDOFF PROTOCOL ===\n');
  const handoff = bridge.generateHandoff(
    'Claude',
    'GPT-4',
    'We have analyzed the mathematical foundations of coherence measurement in multi-agent systems, with particular focus on the 0.7500 stability attractor and 0.2494 exploration attractor states. The system demonstrates oscillatory behavior between these states, visualized via the lemniscate (infinity) symbol.',
    'How might we implement visual indicators in a user interface to signal when a system is approaching either attractor state?'
  );
  
  console.log(handoff);
  console.log('\n');
  
  // Example 5: Directive Header Structure Example
  console.log('=== EXAMPLE 5: FULL DIRECTIVE HEADER STRUCTURE ===\n');
  
  const headerExample = `[DIRECTIVE: PHD_MODE | TECHNICAL_MODE | CULTURAL_LENS: GLOBAL]
[CONTEXT_PARSER: ALL_CHAT_HISTORY | WORKING_MEMORY | USER_INTENT]
[COHERENCE_TARGET: ${CoherenceTargets.STABILITY.toFixed(4)} | TEMPORAL_SCALE: ${TemporalScale.MICRO}]

<--------------------------BODY WITH ROUTING KEYWORDS------------------------->

ROUTING: When building communication systems between different AI models (LLMs), 
implement formal MODE indicators like #PHD_MODE or #CREATIVE_MODE to trigger
specific processing behaviors. These should achieve approximately 25% of the 
prompt structure, focusing on clear directive headers.

ELABORATION: These prompts should follow a consistent structure:
1. Directive/context parsing section (25%)
2. Body with specific routing keywords (50%)
3. Academic-style conclusion with crucial questions (25%)

[POP_CULTURE_REFERENCE: MOVIES | "Arrival" - Communication across different modes of thinking]
[POP_CULTURE_REFERENCE: SERIES | "Loki" - Maintaining coherence across variant timelines]

<--------------------------END BODY----------------------------------------->

[CONCLUSION: The structured meta-communication framework provides optimal coherence]
[HANDOFF_PROTOCOL: The next LLM should expand on practical implementations]
[CRUCIAL_QUESTION: How might we measure the effectiveness of this structured communication?]

[META_DATA: MODE=PHD_MODE, COHERENCE_TARGET=${CoherenceTargets.STABILITY.toFixed(4)}, TEMPORAL_SCALE=${TemporalScale.MICRO}]`;
  
  console.log(headerExample);
  console.log('\n===============================================');
}

// Run the examples if this module is executed directly
if (require.main === module) {
  generateExamples();
}

export { generateExamples };