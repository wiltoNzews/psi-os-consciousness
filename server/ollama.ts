/**
 * WiltonOS Ollama Integration
 * 
 * Este módulo oferece integração com o Ollama para executar modelos
 * de linguagem grandes (LLMs) localmente, permitindo processamento de linguagem
 * natural sem dependência de serviços externos.
 */

import fetch from 'node-fetch';
import { EventEmitter } from 'events';

// Configuração padrão para o servidor Ollama
const DEFAULT_OLLAMA_SERVER = 'http://localhost:11434';
const DEFAULT_MODEL = 'llama3';

// Interface para a resposta da API Ollama
interface OllamaResponse {
  model: string;
  created_at: string;
  response: string;
  done: boolean;
  context?: number[];
  total_duration?: number;
  load_duration?: number;
  prompt_eval_duration?: number;
  eval_duration?: number;
  eval_count?: number;
  prompt_token_count?: number;
}

// Interface para opções de solicitação
interface OllamaRequestOptions {
  model?: string;
  prompt: string;
  system?: string;
  template?: string;
  context?: number[];
  stream?: boolean;
  format?: 'json';
  options?: Record<string, any>;
}

// Interface para configurações do Ollama
interface OllamaConfig {
  serverUrl?: string;
  defaultModel?: string;
}

// Classe principal para integração com Ollama
export class OllamaIntegration {
  private serverUrl: string;
  private defaultModel: string;
  
  constructor(config: OllamaConfig = {}) {
    this.serverUrl = config.serverUrl || DEFAULT_OLLAMA_SERVER;
    this.defaultModel = config.defaultModel || DEFAULT_MODEL;
  }
  
  /**
   * Verifica se o servidor Ollama está respondendo
   * 
   * @returns {Promise<boolean>} true se o servidor estiver disponível
   */
  async checkServerStatus(): Promise<boolean> {
    try {
      const response = await fetch(`${this.serverUrl}/api/tags`, {
        method: 'GET',
      });
      
      return response.status === 200;
    } catch (error) {
      console.error('Erro ao verificar status do servidor Ollama:', error);
      return false;
    }
  }
  
  /**
   * Lista os modelos disponíveis no servidor Ollama
   * 
   * @returns {Promise<string[]>} Lista de modelos disponíveis
   */
  async listModels(): Promise<string[]> {
    try {
      const response = await fetch(`${this.serverUrl}/api/tags`);
      const data = await response.json() as { models: Array<{ name: string }> };
      
      return data.models.map(model => model.name);
    } catch (error) {
      console.error('Erro ao listar modelos Ollama:', error);
      return [];
    }
  }
  
  /**
   * Envia uma solicitação de completação para o Ollama
   * 
   * @param {OllamaRequestOptions} options Opções da solicitação
   * @returns {Promise<string>} Resposta do modelo
   */
  async complete(options: OllamaRequestOptions): Promise<string> {
    const { model = this.defaultModel, prompt, system, template, context, format, options: modelOptions } = options;
    
    try {
      const response = await fetch(`${this.serverUrl}/api/generate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model,
          prompt,
          system,
          template,
          context,
          format,
          options: modelOptions,
          stream: false,
        }),
      });
      
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Erro na API Ollama: ${response.status} - ${errorText}`);
      }
      
      const data = await response.json() as OllamaResponse;
      return data.response;
    } catch (error) {
      console.error('Erro ao completar texto com Ollama:', error);
      throw error;
    }
  }
  
  /**
   * Envia uma solicitação de completação para o Ollama com streaming
   * 
   * @param {OllamaRequestOptions} options Opções da solicitação
   * @returns {EventEmitter} Emissor de eventos com 'data', 'done' e 'error'
   */
  streamComplete(options: OllamaRequestOptions): EventEmitter {
    const { model = this.defaultModel, prompt, system, template, context, format, options: modelOptions } = options;
    const eventEmitter = new EventEmitter();
    
    (async () => {
      try {
        const response = await fetch(`${this.serverUrl}/api/generate`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            model,
            prompt,
            system,
            template,
            context,
            format,
            options: modelOptions,
            stream: true,
          }),
        });
        
        if (!response.ok) {
          const errorText = await response.text();
          throw new Error(`Erro na API Ollama: ${response.status} - ${errorText}`);
        }
        
        if (!response.body) {
          throw new Error('Resposta sem corpo');
        }
        
        // Processa o stream de resposta
        const reader = response.body.getReader();
        const decoder = new TextDecoder();
        let buffer = '';
        let result = '';
        
        while (true) {
          const { done, value } = await reader.read();
          
          if (done) {
            break;
          }
          
          // Decodifica o chunk e adiciona ao buffer
          buffer += decoder.decode(value, { stream: true });
          
          // Processa linhas completas do buffer
          let lineEnd = buffer.indexOf('\n');
          while (lineEnd !== -1) {
            const line = buffer.substring(0, lineEnd);
            buffer = buffer.substring(lineEnd + 1);
            
            if (line.trim()) {
              try {
                const data = JSON.parse(line) as OllamaResponse;
                result += data.response;
                
                eventEmitter.emit('data', {
                  text: data.response,
                  done: data.done,
                  ...data
                });
                
                if (data.done) {
                  eventEmitter.emit('done', {
                    text: result,
                    ...data
                  });
                  return;
                }
              } catch (e) {
                console.error(`Erro ao analisar linha JSON: ${line}`, e);
              }
            }
            
            lineEnd = buffer.indexOf('\n');
          }
        }
        
        // Processa buffer final
        if (buffer.trim()) {
          try {
            const data = JSON.parse(buffer) as OllamaResponse;
            result += data.response;
            
            eventEmitter.emit('data', {
              text: data.response,
              done: data.done,
              ...data
            });
            
            if (data.done) {
              eventEmitter.emit('done', {
                text: result,
                ...data
              });
            }
          } catch (e) {
            console.error(`Erro ao analisar buffer final: ${buffer}`, e);
          }
        }
        
      } catch (error) {
        console.error('Erro no streaming do Ollama:', error);
        eventEmitter.emit('error', error);
      }
    })();
    
    return eventEmitter;
  }
  
  /**
   * Envia uma solicitação de chat para o Ollama
   * 
   * @param {Array<{role: string, content: string}>} messages Mensagens do chat
   * @param {string} model Modelo opcional a ser usado
   * @returns {Promise<string>} Resposta do modelo
   */
  async chat(messages: Array<{role: string, content: string}>, model: string = this.defaultModel): Promise<string> {
    try {
      const response = await fetch(`${this.serverUrl}/api/chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model,
          messages,
          stream: false,
        }),
      });
      
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Erro na API Ollama: ${response.status} - ${errorText}`);
      }
      
      const data = await response.json();
      return data.message?.content || '';
    } catch (error) {
      console.error('Erro ao iniciar chat com Ollama:', error);
      throw error;
    }
  }
  
  /**
   * Envia uma solicitação de incorporação para o Ollama
   * 
   * @param {string} text Texto para incorporação
   * @param {string} model Modelo opcional a ser usado
   * @returns {Promise<number[]>} Vetor de incorporação
   */
  async embed(text: string, model: string = this.defaultModel): Promise<number[]> {
    try {
      const response = await fetch(`${this.serverUrl}/api/embeddings`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model,
          prompt: text,
        }),
      });
      
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Erro na API Ollama: ${response.status} - ${errorText}`);
      }
      
      const data = await response.json();
      return data.embedding || [];
    } catch (error) {
      console.error('Erro ao obter incorporação com Ollama:', error);
      throw error;
    }
  }
}

// Instância única para uso em toda a aplicação
export const ollama = new OllamaIntegration();

// Funções de utilitário para facilitar o uso
export async function processTextWithOllama(text: string, options: Partial<OllamaRequestOptions> = {}): Promise<string> {
  return ollama.complete({
    prompt: text,
    ...options
  });
}

export async function chatWithOllama(messages: Array<{role: string, content: string}>, model?: string): Promise<string> {
  return ollama.chat(messages, model);
}

export async function getEmbeddingWithOllama(text: string, model?: string): Promise<number[]> {
  return ollama.embed(text, model);
}

// Tipos exportados para uso em outros módulos
export type { OllamaRequestOptions, OllamaResponse, OllamaConfig };