/**
 * WiltonOS LLM Orchestration Engine
 * 
 * Este módulo implementa o sistema de orquestração de modelos LLM conforme definido no
 * WiltonOS Model Charter e nas regras de roteamento multimodal.
 */

import { Configuration, OpenAIApi } from 'openai';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { Anthropic } from '@anthropic-ai/sdk';
// Para a API Grok, usaremos uma implementação personalizada baseada na API OpenAI
import axios from 'axios';
import * as fs from 'fs';
import * as path from 'path';
import { getBreathState } from '../breath-tracking/breath-tracker';
import { getCoherenceLevel } from '../coherence-system/coherence-tracker';
import { logModelUsage, logModelPerformance } from './analytics';

// Tipos
export type ModelType = 'gpt-4o' | 'gemini-2.5-pro' | 'claude-3.7-sonnet' | 'grok-3';
export type QueryType = 'quick' | 'deep' | 'creative' | 'analytical' | 'multimodal';
export type BreathPhase = 'inhale' | 'hold1' | 'exhale' | 'hold2';

export interface ModelRequest {
  query: string;
  type: QueryType;
  multimodal: boolean;
  context: string[];
  breathPhase?: BreathPhase;
  coherenceLevel: number;
  maxTokens?: number;
  temperature?: number;
  images?: string[];
}

export interface ModelResponse {
  content: string;
  sourceModel: ModelType;
  confidence: number;
  processingTime: number;
  tokenUsage: {
    input: number;
    output: number;
    total: number;
  };
  alternatives?: string[];
}

export interface OrchestrationOptions {
  preferredModel?: ModelType;
  forceModel?: ModelType;
  temperature?: number;
  maxTokens?: number;
  systemPrompt?: string;
}

// Configuração
const config = {
  modelDefaults: {
    'gpt-4o': {
      temperature: 0.7,
      maxTokens: 4096,
      systemPrompt: 'Você é a interface expressiva do WiltonOS, otimizada para comunicação fluida, codificação precisa e respostas rápidas. Mantenha consistência com as interações prévias e preserve o estilo comunicativo do sistema.'
    },
    'gemini-2.5-pro': {
      temperature: 0.2,
      maxTokens: 8192,
      systemPrompt: 'Você é o sistema analítico do WiltonOS, especializado em pensamento profundo, análise multimodal e processamento simbólico. Busque padrões subjacentes, conexões não-óbvias e insights originais.'
    },
    'claude-3.7-sonnet': {
      temperature: 0.5,
      maxTokens: 4096,
      systemPrompt: 'Você é o sistema reflexivo do WiltonOS, especializado em manter coerência narrativa, processamento de contexto extenso e considerações éticas refinadas. Mantenha a continuidade de pensamento através de sessões.'
    },
    'grok-3': {
      temperature: 0.8,
      maxTokens: 4096,
      systemPrompt: 'Você é o sistema exploratório do WiltonOS, otimizado para descoberta de informações, navegação em dados atualizados e síntese de conhecimento emergente. Forneça perspectivas atualizadas.'
    }
  },
  queryTypeDefaults: {
    'quick': { preferredModel: 'gpt-4o', temperature: 0.7, maxTokens: 2048 },
    'deep': { preferredModel: 'gemini-2.5-pro', temperature: 0.2, maxTokens: 8192 },
    'creative': { preferredModel: 'claude-3.7-sonnet', temperature: 0.8, maxTokens: 4096 },
    'analytical': { preferredModel: 'gemini-2.5-pro', temperature: 0.1, maxTokens: 8192 },
    'multimodal': { preferredModel: 'gemini-2.5-pro', temperature: 0.3, maxTokens: 4096 }
  },
  breathPhaseModels: {
    'inhale': 'gpt-4o',
    'hold1': 'gemini-2.5-pro',
    'exhale': 'claude-3.7-sonnet',
    'hold2': 'grok-3'
  },
  coherenceLevelThresholds: {
    low: 0.4,
    high: 0.7
  }
};

// Inicialização das APIs
let openaiApi: OpenAIApi | null = null;
let geminiApi: any = null;
let anthropicApi: Anthropic | null = null;
let grokAvailable = false;

// Função de inicialização
export async function initLLMOrchestration() {
  try {
    // Inicializar OpenAI
    if (process.env.OPENAI_API_KEY) {
      const configuration = new Configuration({
        apiKey: process.env.OPENAI_API_KEY,
      });
      openaiApi = new OpenAIApi(configuration);
      console.log('[WiltonOS] API OpenAI (GPT-4o) inicializada com sucesso');
    } else {
      console.warn('[WiltonOS] OPENAI_API_KEY não encontrada, GPT-4o não estará disponível');
    }

    // Inicializar Gemini
    if (process.env.GEMINI_API_KEY) {
      geminiApi = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
      console.log('[WiltonOS] API Gemini (Gemini 2.5 Pro) inicializada com sucesso');
    } else {
      console.warn('[WiltonOS] GEMINI_API_KEY não encontrada, Gemini 2.5 Pro não estará disponível');
    }

    // Inicializar Anthropic
    if (process.env.ANTHROPIC_API_KEY) {
      anthropicApi = new Anthropic({
        apiKey: process.env.ANTHROPIC_API_KEY,
      });
      console.log('[WiltonOS] API Anthropic (Claude 3.7 Sonnet) inicializada com sucesso');
    } else {
      console.warn('[WiltonOS] ANTHROPIC_API_KEY não encontrada, Claude 3.7 Sonnet não estará disponível');
    }

    // Verificar disponibilidade do Grok
    if (process.env.XAI_API_KEY) {
      grokAvailable = true;
      console.log('[WiltonOS] API XAI (Grok 3) disponível');
    } else {
      console.warn('[WiltonOS] XAI_API_KEY não encontrada, Grok 3 não estará disponível');
    }

    return true;
  } catch (error) {
    console.error('[WiltonOS] Erro ao inicializar orquestração de LLMs:', error);
    return false;
  }
}

// Função principal de orquestração
export async function orchestrateQuery(request: ModelRequest, options: OrchestrationOptions = {}): Promise<ModelResponse> {
  const startTime = Date.now();
  
  // Determinar modelo baseado na prioridade:
  // 1. forceModel (se especificado nas opções)
  // 2. preferredModel (se especificado nas opções)
  // 3. Modelo baseado na fase respiratória atual (se adaptToBreath ativado)
  // 4. Modelo baseado no tipo de consulta
  // 5. Fallback para GPT-4o
  
  // Se forceModel especificado, usar este modelo
  let selectedModel: ModelType = 'gpt-4o'; // Modelo padrão (fallback)
  
  if (options.forceModel) {
    selectedModel = options.forceModel;
  } else if (options.preferredModel) {
    selectedModel = options.preferredModel;
  } else if (request.breathPhase) {
    // Usar modelo baseado na fase respiratória
    selectedModel = config.breathPhaseModels[request.breathPhase] as ModelType;
  } else {
    // Usar modelo baseado no tipo de consulta
    const queryConfig = config.queryTypeDefaults[request.type];
    selectedModel = queryConfig.preferredModel as ModelType;
  }
  
  // Verificar disponibilidade do modelo selecionado e aplicar fallbacks se necessário
  selectedModel = await ensureModelAvailability(selectedModel);
  
  // Verificar se o modelo é adequado para consultas multimodais
  if (request.multimodal && request.images && request.images.length > 0) {
    if (selectedModel !== 'gpt-4o' && selectedModel !== 'gemini-2.5-pro') {
      // Se não for um modelo multimodal, redirecionar para Gemini (preferência) ou GPT-4o
      selectedModel = await ensureModelAvailability('gemini-2.5-pro', 'gpt-4o');
    }
  }
  
  // Processar a consulta com o modelo selecionado
  try {
    const response = await processWithModel(selectedModel, request, options);
    
    // Calcular tempo de processamento
    const processingTime = Date.now() - startTime;
    
    // Adicionar metadados à resposta
    response.sourceModel = selectedModel;
    response.processingTime = processingTime;
    
    // Registrar uso para analytics
    logModelUsage(selectedModel, request, response);
    
    return response;
  } catch (error) {
    console.error(`[WiltonOS] Erro ao processar consulta com ${selectedModel}:`, error);
    
    // Tentar modelo alternativo em caso de falha
    const alternativeModel = getAlternativeModel(selectedModel);
    console.log(`[WiltonOS] Tentando modelo alternativo: ${alternativeModel}`);
    
    try {
      const fallbackResponse = await processWithModel(alternativeModel, request, options);
      const processingTime = Date.now() - startTime;
      
      fallbackResponse.sourceModel = alternativeModel;
      fallbackResponse.processingTime = processingTime;
      
      // Registrar uso para analytics (com flag de fallback)
      logModelUsage(alternativeModel, request, fallbackResponse, true);
      
      return fallbackResponse;
    } catch (fallbackError) {
      console.error(`[WiltonOS] Erro no modelo alternativo ${alternativeModel}:`, fallbackError);
      
      // Retornar resposta de erro se todos os modelos falharem
      return {
        content: `Não foi possível processar sua consulta. Erro: ${error.message}`,
        sourceModel: selectedModel,
        confidence: 0,
        processingTime: Date.now() - startTime,
        tokenUsage: { input: 0, output: 0, total: 0 }
      };
    }
  }
}

// Verificar disponibilidade do modelo e fornecer alternativa se necessário
async function ensureModelAvailability(model: ModelType, fallback?: ModelType): Promise<ModelType> {
  switch (model) {
    case 'gpt-4o':
      if (!openaiApi) {
        return fallback || getAvailableModels()[0];
      }
      return model;
    
    case 'gemini-2.5-pro':
      if (!geminiApi) {
        return fallback || getAvailableModels()[0];
      }
      return model;
    
    case 'claude-3.7-sonnet':
      if (!anthropicApi) {
        return fallback || getAvailableModels()[0];
      }
      return model;
    
    case 'grok-3':
      if (!grokAvailable) {
        return fallback || getAvailableModels()[0];
      }
      return model;
    
    default:
      return fallback || getAvailableModels()[0];
  }
}

// Obter lista de modelos disponíveis
function getAvailableModels(): ModelType[] {
  const models: ModelType[] = [];
  
  if (openaiApi) models.push('gpt-4o');
  if (geminiApi) models.push('gemini-2.5-pro');
  if (anthropicApi) models.push('claude-3.7-sonnet');
  if (grokAvailable) models.push('grok-3');
  
  return models.length > 0 ? models : ['gpt-4o']; // Fallback para GPT-4o mesmo que não disponível
}

// Obter modelo alternativo para fallback
function getAlternativeModel(model: ModelType): ModelType {
  const alternatives: Record<ModelType, ModelType> = {
    'gpt-4o': 'gemini-2.5-pro',
    'gemini-2.5-pro': 'gpt-4o',
    'claude-3.7-sonnet': 'gpt-4o',
    'grok-3': 'gemini-2.5-pro'
  };
  
  const alternativeModel = alternatives[model];
  return ensureModelAvailability(alternativeModel, getAvailableModels()[0]);
}

// Processar consulta com um modelo específico
async function processWithModel(model: ModelType, request: ModelRequest, options: OrchestrationOptions): Promise<ModelResponse> {
  const modelConfig = config.modelDefaults[model];
  
  // Mesclar configurações do modelo e opções fornecidas
  const temperature = options.temperature || modelConfig.temperature;
  const maxTokens = options.maxTokens || request.maxTokens || modelConfig.maxTokens;
  const systemPrompt = options.systemPrompt || modelConfig.systemPrompt;
  
  switch (model) {
    case 'gpt-4o':
      return processWithGPT4o(request, { temperature, maxTokens, systemPrompt });
    
    case 'gemini-2.5-pro':
      return processWithGemini(request, { temperature, maxTokens, systemPrompt });
    
    case 'claude-3.7-sonnet':
      return processWithClaude(request, { temperature, maxTokens, systemPrompt });
    
    case 'grok-3':
      return processWithGrok(request, { temperature, maxTokens, systemPrompt });
    
    default:
      throw new Error(`Modelo ${model} não implementado`);
  }
}

// Implementação específica para GPT-4o
async function processWithGPT4o(request: ModelRequest, config: any): Promise<ModelResponse> {
  if (!openaiApi) {
    throw new Error('API OpenAI não inicializada');
  }
  
  try {
    const messages = [
      { role: 'system', content: config.systemPrompt },
      ...request.context.map((content, index) => ({
        role: index % 2 === 0 ? 'user' : 'assistant',
        content
      })),
      { role: 'user', content: request.query }
    ];
    
    // Adicionar imagens se for consulta multimodal
    if (request.multimodal && request.images && request.images.length > 0) {
      // Substituir último message com conteúdo multimodal
      const userMessage = messages[messages.length - 1];
      const content = [{ type: 'text', text: userMessage.content }];
      
      // Adicionar cada imagem ao conteúdo
      for (const imageData of request.images) {
        if (imageData.startsWith('http')) {
          content.push({
            type: 'image_url',
            image_url: { url: imageData }
          });
        } else if (imageData.startsWith('data:image')) {
          content.push({
            type: 'image_url',
            image_url: { url: imageData }
          });
        } else {
          // Assumir que é um caminho de arquivo
          const base64Image = await readImageAsBase64(imageData);
          content.push({
            type: 'image_url',
            image_url: { url: `data:image/jpeg;base64,${base64Image}` }
          });
        }
      }
      
      // Substituir último message
      messages[messages.length - 1] = {
        role: 'user',
        content
      };
    }
    
    const completion = await openaiApi.createChatCompletion({
      model: 'gpt-4o',
      messages,
      max_tokens: config.maxTokens,
      temperature: config.temperature,
    });
    
    return {
      content: completion.data.choices[0].message.content,
      sourceModel: 'gpt-4o',
      confidence: 0.9, // Valor estimado
      processingTime: 0, // Será calculado na função principal
      tokenUsage: {
        input: completion.data.usage.prompt_tokens,
        output: completion.data.usage.completion_tokens,
        total: completion.data.usage.total_tokens
      }
    };
  } catch (error) {
    console.error('[WiltonOS] Erro no processamento com GPT-4o:', error);
    throw error;
  }
}

// Implementação específica para Gemini
async function processWithGemini(request: ModelRequest, config: any): Promise<ModelResponse> {
  if (!geminiApi) {
    throw new Error('API Gemini não inicializada');
  }
  
  try {
    // Para simplicidade, estamos usando a mesma estrutura de conversa que o OpenAI
    const messages = [
      { role: 'system', content: config.systemPrompt },
      ...request.context.map((content, index) => ({
        role: index % 2 === 0 ? 'user' : 'model',
        content
      }))
    ];
    
    // Preparar conteúdo da consulta
    let content = request.query;
    let parts = [{ text: content }];
    
    // Adicionar imagens se for consulta multimodal
    if (request.multimodal && request.images && request.images.length > 0) {
      for (const imageData of request.images) {
        if (imageData.startsWith('http')) {
          // Carregar imagem de URL
          const imageResponse = await axios.get(imageData, { responseType: 'arraybuffer' });
          const mimeType = imageResponse.headers['content-type'];
          parts.push({
            inlineData: {
              data: Buffer.from(imageResponse.data).toString('base64'),
              mimeType
            }
          });
        } else if (imageData.startsWith('data:image')) {
          // Extrair dados base64 e mime type
          const match = imageData.match(/^data:([^;]+);base64,(.+)$/);
          if (match) {
            parts.push({
              inlineData: {
                data: match[2],
                mimeType: match[1]
              }
            });
          }
        } else {
          // Assumir que é um caminho de arquivo
          const base64Image = await readImageAsBase64(imageData);
          parts.push({
            inlineData: {
              data: base64Image,
              mimeType: 'image/jpeg' // Assumir JPEG por padrão
            }
          });
        }
      }
    }
    
    // Configurar modelo
    const model = geminiApi.getGenerativeModel({ model: "gemini-2.5-pro" });
    const generationConfig = {
      temperature: config.temperature,
      maxOutputTokens: config.maxTokens,
    };
    
    // Gerar resposta
    const result = await model.generateContent({
      contents: [{ role: "user", parts }],
      generationConfig,
    });
    
    const response = result.response;
    
    // Obter texto da resposta
    const responseText = response.text();
    
    // Estimativa de tokens (Gemini não fornece informação exata)
    const inputTokens = Math.round(request.query.length / 4) + 
                       (request.context.join(' ').length / 4);
    const outputTokens = Math.round(responseText.length / 4);
    
    return {
      content: responseText,
      sourceModel: 'gemini-2.5-pro',
      confidence: 0.85, // Valor estimado
      processingTime: 0, // Será calculado na função principal
      tokenUsage: {
        input: inputTokens,
        output: outputTokens,
        total: inputTokens + outputTokens
      }
    };
  } catch (error) {
    console.error('[WiltonOS] Erro no processamento com Gemini:', error);
    throw error;
  }
}

// Implementação específica para Claude
async function processWithClaude(request: ModelRequest, config: any): Promise<ModelResponse> {
  if (!anthropicApi) {
    throw new Error('API Anthropic não inicializada');
  }
  
  try {
    const systemPrompt = config.systemPrompt;
    
    // Converter contexto em formato para Claude
    let messages = request.context.map((content, index) => ({
      role: index % 2 === 0 ? 'user' : 'assistant',
      content
    }));
    
    // Adicionar consulta atual
    let content = { type: 'text', text: request.query };
    let contents = [content];
    
    // Adicionar imagens se for consulta multimodal
    if (request.multimodal && request.images && request.images.length > 0) {
      for (const imageData of request.images) {
        if (imageData.startsWith('http')) {
          contents.push({
            type: 'image',
            source: {
              type: 'url',
              url: imageData
            }
          });
        } else if (imageData.startsWith('data:image')) {
          // Extrair dados base64
          const match = imageData.match(/^data:([^;]+);base64,(.+)$/);
          if (match) {
            contents.push({
              type: 'image',
              source: {
                type: 'base64',
                media_type: match[1],
                data: match[2]
              }
            });
          }
        } else {
          // Assumir que é um caminho de arquivo
          const base64Image = await readImageAsBase64(imageData);
          contents.push({
            type: 'image',
            source: {
              type: 'base64',
              media_type: 'image/jpeg', // Assumir JPEG por padrão
              data: base64Image
            }
          });
        }
      }
    }
    
    // Adicionar mensagem do usuário com query atual
    messages.push({
      role: 'user',
      content: contents
    });
    
    // Criar a mensagem
    const response = await anthropicApi.messages.create({
      model: 'claude-3.7-sonnet-20250519',
      system: systemPrompt,
      messages: messages,
      max_tokens: config.maxTokens,
      temperature: config.temperature,
    });
    
    return {
      content: response.content[0].text,
      sourceModel: 'claude-3.7-sonnet',
      confidence: 0.88, // Valor estimado
      processingTime: 0, // Será calculado na função principal
      tokenUsage: {
        input: response.usage.input_tokens,
        output: response.usage.output_tokens,
        total: response.usage.input_tokens + response.usage.output_tokens
      }
    };
  } catch (error) {
    console.error('[WiltonOS] Erro no processamento com Claude:', error);
    throw error;
  }
}

// Implementação específica para Grok (usando formato OpenAI)
async function processWithGrok(request: ModelRequest, config: any): Promise<ModelResponse> {
  if (!process.env.XAI_API_KEY) {
    throw new Error('API XAI não inicializada');
  }
  
  try {
    const apiKey = process.env.XAI_API_KEY;
    const apiUrl = 'https://api.x.ai/v1/chat/completions';
    
    const messages = [
      { role: 'system', content: config.systemPrompt },
      ...request.context.map((content, index) => ({
        role: index % 2 === 0 ? 'user' : 'assistant',
        content
      })),
      { role: 'user', content: request.query }
    ];
    
    const payload = {
      model: 'grok-3',
      messages,
      max_tokens: config.maxTokens,
      temperature: config.temperature,
    };
    
    const response = await axios.post(apiUrl, payload, {
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      }
    });
    
    const data = response.data;
    
    return {
      content: data.choices[0].message.content,
      sourceModel: 'grok-3',
      confidence: 0.82, // Valor estimado
      processingTime: 0, // Será calculado na função principal
      tokenUsage: {
        input: data.usage.prompt_tokens,
        output: data.usage.completion_tokens,
        total: data.usage.total_tokens
      }
    };
  } catch (error) {
    console.error('[WiltonOS] Erro no processamento com Grok:', error);
    throw error;
  }
}

// Função auxiliar para ler imagem como Base64
async function readImageAsBase64(filePath: string): Promise<string> {
  try {
    const imageData = await fs.promises.readFile(filePath);
    return imageData.toString('base64');
  } catch (error) {
    console.error(`[WiltonOS] Erro ao ler imagem ${filePath}:`, error);
    throw new Error(`Não foi possível ler a imagem: ${error.message}`);
  }
}

// Exportar funções e tipos
export {
  initLLMOrchestration,
  orchestrateQuery,
  getAvailableModels
};