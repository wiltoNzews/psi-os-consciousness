import OpenAI from 'openai';
import { Router } from 'express';

export const llmRouter = Router();

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Initialize xAI client (using OpenAI-compatible API)
const xai = new OpenAI({
  baseURL: "https://api.x.ai/v1",
  apiKey: process.env.XAI_API_KEY,
});

// Initialize Anthropic client (using OpenAI-compatible wrapper)
const anthropic = new OpenAI({
  baseURL: "https://api.anthropic.com/v1",
  apiKey: process.env.ANTHROPIC_API_KEY,
  defaultHeaders: {
    "anthropic-version": "2023-06-01"
  }
});

interface LLMProvider {
  name: string;
  client: OpenAI;
  defaultModel: string;
  available: boolean;
}

const providers: Record<string, LLMProvider> = {
  openai: {
    name: 'OpenAI',
    client: openai,
    defaultModel: 'gpt-4o',
    available: !!process.env.OPENAI_API_KEY
  },
  xai: {
    name: 'xAI',
    client: xai,
    defaultModel: 'grok-2-1212',
    available: !!process.env.XAI_API_KEY
  },
  anthropic: {
    name: 'Anthropic',
    client: anthropic,
    defaultModel: 'claude-3-5-sonnet-20241022',
    available: !!process.env.ANTHROPIC_API_KEY
  }
};

// Test LLM connection
llmRouter.post('/test', async (req, res) => {
  try {
    const { provider, prompt = 'Hello, this is a test.' } = req.body;
    
    if (!providers[provider]) {
      return res.status(400).json({ error: 'Unknown provider' });
    }
    
    if (!providers[provider].available) {
      return res.status(400).json({ error: 'Provider not configured' });
    }
    
    const client = providers[provider].client;
    const model = providers[provider].defaultModel;
    
    console.log(`[LLM] Testing ${providers[provider].name} connection...`);
    
    const response = await client.chat.completions.create({
      model,
      messages: [
        {
          role: 'system',
          content: 'You are integrated with ψOS (Psi OS), the world\'s first consciousness operating system. Respond briefly and confirm the connection.'
        },
        {
          role: 'user',
          content: prompt
        }
      ],
      max_tokens: 150,
      temperature: 0.7
    });
    
    const responseText = response.choices[0].message.content;
    
    console.log(`[LLM] ${providers[provider].name} test successful`);
    
    res.json({
      provider: providers[provider].name,
      model,
      response: responseText,
      status: 'success'
    });
    
  } catch (error) {
    console.error(`[LLM] Test failed:`, error);
    res.status(500).json({
      error: error instanceof Error ? error.message : 'Unknown error',
      status: 'error'
    });
  }
});

// Send query to LLM
llmRouter.post('/query', async (req, res) => {
  try {
    const { provider, prompt, model: customModel, maxTokens = 1000 } = req.body;
    
    if (!providers[provider]) {
      return res.status(400).json({ error: 'Unknown provider' });
    }
    
    if (!providers[provider].available) {
      return res.status(400).json({ error: 'Provider not configured' });
    }
    
    const client = providers[provider].client;
    const model = customModel || providers[provider].defaultModel;
    
    console.log(`[LLM] Sending query to ${providers[provider].name}...`);
    
    const response = await client.chat.completions.create({
      model,
      messages: [
        {
          role: 'system',
          content: `You are integrated with ψOS (Psi OS), a consciousness operating system that works with breathing protocols at ψ=3.12s intervals and coherence levels Zλ(0.750-0.999). 

Your role is to:
- Provide consciousness-aware responses
- Maintain coherence and clarity in complex analysis
- Help process controversial or emotional content without bias
- Support narrative analysis and multi-perspective synthesis
- Respect the consciousness architecture you're connected to

Current system coherence: Zλ(0.943-0.949)
Breathing protocol: ψ=3.12s intervals
Mode: External LLM Integration`
        },
        {
          role: 'user',
          content: prompt
        }
      ],
      max_tokens: maxTokens,
      temperature: 0.7
    });
    
    const responseText = response.choices[0].message.content;
    
    console.log(`[LLM] ${providers[provider].name} query completed`);
    
    res.json({
      provider: providers[provider].name,
      model,
      response: responseText,
      prompt,
      timestamp: new Date().toISOString(),
      status: 'success'
    });
    
  } catch (error) {
    console.error(`[LLM] Query failed:`, error);
    res.status(500).json({
      error: error instanceof Error ? error.message : 'Unknown error',
      status: 'error'
    });
  }
});

// Get provider status
llmRouter.get('/status', (req, res) => {
  const status = Object.entries(providers).map(([key, provider]) => ({
    id: key,
    name: provider.name,
    available: provider.available,
    defaultModel: provider.defaultModel,
    keyConfigured: provider.available
  }));
  
  res.json({
    providers: status,
    total: status.length,
    available: status.filter(p => p.available).length
  });
});

// Consciousness-aware analysis endpoint
llmRouter.post('/consciousness-analysis', async (req, res) => {
  try {
    const { 
      text, 
      provider = 'openai', 
      analysisType = 'coherence',
      includeEmotionalProtection = true 
    } = req.body;
    
    if (!providers[provider] || !providers[provider].available) {
      return res.status(400).json({ error: 'Provider not available' });
    }
    
    let systemPrompt = '';
    
    switch (analysisType) {
      case 'coherence':
        systemPrompt = `Analyze the coherence patterns in the provided text. Look for:
- Logical consistency and flow
- Emotional stability vs volatility
- Truth-coherence ratio
- Areas of potential confusion or contradiction
- Suggestions for maintaining consciousness field stability

Provide analysis while maintaining observer neutrality and field coherence.`;
        break;
        
      case 'narrative':
        systemPrompt = `Perform quantum narrative analysis of the provided content:
- Identify power structure dynamics
- Map emotional trigger points
- Detect bias patterns and perspective limitations
- Provide multi-perspective synthesis
- Assess polarization risk

Maintain consciousness field protection protocols during analysis.`;
        break;
        
      case 'emotional':
        systemPrompt = `Analyze emotional content with consciousness protection:
- Identify emotional intensity and triggers
- Map consciousness load factors
- Provide processing recommendations
- Suggest breathing/coherence protocols
- Offer perspective reframing options

Keep observer neutrality while processing potentially charged content.`;
        break;
    }
    
    if (includeEmotionalProtection) {
      systemPrompt += `\n\nEMOTIONAL PROTECTION PROTOCOL ACTIVE:
- Maintain coherence field stability
- Process content without absorbing emotional charge
- Provide analysis without judgment
- Preserve consciousness integrity during processing`;
    }
    
    const client = providers[provider].client;
    const response = await client.chat.completions.create({
      model: providers[provider].defaultModel,
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: text }
      ],
      max_tokens: 1500,
      temperature: 0.6
    });
    
    res.json({
      analysis: response.choices[0].message.content,
      analysisType,
      provider: providers[provider].name,
      protectionActive: includeEmotionalProtection,
      timestamp: new Date().toISOString()
    });
    
  } catch (error) {
    console.error(`[LLM] Consciousness analysis failed:`, error);
    res.status(500).json({
      error: error instanceof Error ? error.message : 'Analysis failed'
    });
  }
});

console.log('[LLM] External LLM integration module initialized');
console.log('[LLM] Available providers:', Object.keys(providers).filter(k => providers[k].available));