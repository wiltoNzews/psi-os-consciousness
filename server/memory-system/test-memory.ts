/**
 * WiltonOS - Testador de Sistema de Memória Perpétua
 * 
 * Este módulo oferece uma forma simples de testar o armazenamento e recuperação
 * de memórias, incluindo processamento de texto para demonstrar as capacidades
 * avançadas do sistema de memória perpétua.
 */

import * as memoryStore from './memory-store.js';
import OpenAI from 'openai';

// Inicialização do cliente OpenAI para análise
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

/**
 * Armazena um texto diretamente como memória com análise avançada
 * @param text Texto para armazenar
 * @returns Memória armazenada com enhancement
 */
export async function storeTextWithAnalysis(
  text: string,
  tags: string[] = []
): Promise<any> {
  console.log(`[WiltonOS] Analisando e armazenando texto como memória...`);
  
  try {
    // Analisar emoções e sentimentos
    const emotionResponse = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: `Analise o texto a seguir e extraia as informações emocionais e sentimentais.
          Retorne apenas um objeto JSON com os seguintes campos:
          - primaryEmotion: a emoção principal expressa no texto
          - secondaryEmotion: uma emoção secundária presente no texto
          - intensity: um número de 0 a 1 representando a intensidade emocional
          - sentiment: "positive", "neutral" ou "negative"
          - color: uma cor hexadecimal (#RRGGBB) que melhor representa o tom emocional do texto`
        },
        { role: "user", content: text }
      ],
      response_format: { type: "json_object" },
      temperature: 0.4,
    });
    
    // Extrair emoções e sentimentos
    const emotionData = JSON.parse(emotionResponse.choices[0].message.content);
    
    // Analisar conceitos e estrutura
    const conceptResponse = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: `Analise o texto a seguir e extraia a estrutura conceitual.
          Retorne apenas um objeto JSON com os seguintes campos:
          - mainConcepts: array com até 5 conceitos principais no texto
          - connections: array de objetos representando conexões entre conceitos (from, to, strength de 0 a 1)
          - abstractionLevel: um número de 0 a 10 representando o nível de abstração (0=concreto, 10=abstrato)
          - coherenceScore: um número de 0 a 1 representando a coerência conceitual do texto`
        },
        { role: "user", content: text }
      ],
      response_format: { type: "json_object" },
      temperature: 0.3,
    });
    
    // Extrair conceitos e estrutura
    const conceptData = JSON.parse(conceptResponse.choices[0].message.content);
    
    // Analisar MMDC
    const mmdcResponse = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: `Analise o texto a seguir e extraia métricas MMDC (Mapping, Meaning, Direction, Coherence).
          Retorne apenas um objeto JSON com os seguintes campos:
          - mapping: número de 0 a 1 representando a capacidade de mapeamento conceitual
          - meaning: número de 0 a 1 representando a profundidade de significado
          - direction: número de 0 a 1 representando a clareza de direção/intenção
          - coherence: número de 0 a 1 representando a coerência geral
          - intentionPattern: string descrevendo o padrão de intenção identificado (ex: "exploratório", "decisivo", "analítico")`
        },
        { role: "user", content: text }
      ],
      response_format: { type: "json_object" },
      temperature: 0.3,
    });
    
    // Extrair métricas MMDC
    const mmdcData = JSON.parse(mmdcResponse.choices[0].message.content);
    
    // Criar metadados enriquecidos
    const metadata = {
      source: 'direct-input',
      timestamp: Date.now(),
      enhancement: {
        emotionalAnalysis: {
          primaryEmotion: emotionData.primaryEmotion,
          secondaryEmotion: emotionData.secondaryEmotion,
          intensity: emotionData.intensity,
          sentiment: emotionData.sentiment,
          color: emotionData.color
        },
        conceptualStructure: {
          mainConcepts: conceptData.mainConcepts,
          connections: conceptData.connections,
          abstractionLevel: conceptData.abstractionLevel,
          coherenceScore: conceptData.coherenceScore
        },
        mmdc: {
          mapping: mmdcData.mapping,
          meaning: mmdcData.meaning,
          direction: mmdcData.direction,
          coherence: mmdcData.coherence
        },
        intentionPattern: mmdcData.intentionPattern
      }
    };
    
    // Adicionar tags baseadas na análise
    const enhancedTags = [...tags];
    
    if (emotionData.primaryEmotion) {
      enhancedTags.push(`emotion:${emotionData.primaryEmotion.toLowerCase()}`);
    }
    
    if (mmdcData.intentionPattern) {
      enhancedTags.push(`intention:${mmdcData.intentionPattern.toLowerCase()}`);
    }
    
    conceptData.mainConcepts.forEach(concept => {
      enhancedTags.push(`concept:${concept.toLowerCase()}`);
    });
    
    // Armazenar na memória perpétua
    const memory = await memoryStore.storeMemory(text, metadata, enhancedTags);
    
    console.log(`[WiltonOS] Memória armazenada com ID: ${memory.id}`);
    return {
      memory,
      analysis: {
        emotional: emotionData,
        conceptual: conceptData,
        mmdc: mmdcData
      }
    };
  } catch (error) {
    console.error(`[WiltonOS] Erro ao analisar e armazenar texto:`, error);
    throw error;
  }
}

/**
 * Busca memórias semanticamente relacionadas a um texto
 * @param text Texto para pesquisa
 * @param limit Número máximo de resultados
 * @returns Memórias relacionadas
 */
export async function searchMemories(text: string, limit: number = 5): Promise<any[]> {
  console.log(`[WiltonOS] Buscando memórias relacionadas a: "${text.substring(0, 30)}..."`);
  
  try {
    const memories = await memoryStore.retrieveMemories(text, limit, 0.5);
    console.log(`[WiltonOS] Encontradas ${memories.length} memórias relacionadas`);
    return memories;
  } catch (error) {
    console.error(`[WiltonOS] Erro ao buscar memórias:`, error);
    throw error;
  }
}

/**
 * Verifica a saúde do sistema de memória
 * @returns Status do sistema
 */
export async function checkMemorySystemHealth(): Promise<any> {
  try {
    // Verificar conexão com o banco de dados
    await memoryStore.initializeDatabase();
    
    // Armazenar uma memória de teste
    const testMemory = await memoryStore.storeMemory(
      'Memória de teste para verificação de saúde do sistema.',
      { source: 'health-check' },
      ['health-check']
    );
    
    // Tentar recuperar a memória
    const memories = await memoryStore.retrieveMemories('saúde sistema', 1, 0.1);
    
    return {
      status: 'healthy',
      databaseConnected: true,
      storeWorking: !!testMemory,
      retrieveWorking: memories.length > 0,
      timestamp: new Date().toISOString()
    };
  } catch (error) {
    console.error(`[WiltonOS] Erro na verificação de saúde:`, error);
    return {
      status: 'unhealthy',
      error: error.message,
      timestamp: new Date().toISOString()
    };
  }
}

export default {
  storeTextWithAnalysis,
  searchMemories,
  checkMemorySystemHealth
};