/**
 * WiltonOS LLM Orchestration Analytics
 * 
 * Este módulo implementa funções para rastrear o uso, desempenho e custos
 * dos diferentes modelos de IA no sistema de orquestração WiltonOS.
 */

import * as fs from 'fs';
import * as path from 'path';
import { ModelType, ModelRequest, ModelResponse } from './index';

// Diretório para registros de analytics
const ANALYTICS_DIR = path.join(process.cwd(), 'data', 'analytics');

// Garantir que o diretório existe
try {
  if (!fs.existsSync(ANALYTICS_DIR)) {
    fs.mkdirSync(ANALYTICS_DIR, { recursive: true });
  }
} catch (error) {
  console.error('[WiltonOS] Erro ao criar diretório de analytics:', error);
}

// Interface para registros de uso
interface ModelUsageRecord {
  timestamp: string;
  model: ModelType;
  queryType: string;
  multimodal: boolean;
  breathPhase?: string;
  coherenceLevel: number;
  inputTokens: number;
  outputTokens: number;
  totalTokens: number;
  processingTime: number;
  isFallback: boolean;
}

// Interface para métricas de performance
interface ModelPerformanceMetrics {
  model: ModelType;
  averageProcessingTime: number;
  averageTokensPerRequest: number;
  successRate: number;
  queryTypesDistribution: Record<string, number>;
  multimodalPercentage: number;
  breathPhaseDistribution: Record<string, number>;
  coherenceLevelAverage: number;
}

// Registrar uso de modelo
export function logModelUsage(
  model: ModelType,
  request: ModelRequest,
  response: ModelResponse,
  isFallback: boolean = false
): void {
  try {
    const now = new Date();
    const dateString = now.toISOString().split('T')[0]; // YYYY-MM-DD
    const logFilePath = path.join(ANALYTICS_DIR, `model_usage_${dateString}.jsonl`);
    
    const usageRecord: ModelUsageRecord = {
      timestamp: now.toISOString(),
      model,
      queryType: request.type,
      multimodal: request.multimodal,
      breathPhase: request.breathPhase,
      coherenceLevel: request.coherenceLevel,
      inputTokens: response.tokenUsage.input,
      outputTokens: response.tokenUsage.output,
      totalTokens: response.tokenUsage.total,
      processingTime: response.processingTime,
      isFallback
    };
    
    // Adicionar ao arquivo de log (formato JSONL)
    fs.appendFileSync(logFilePath, JSON.stringify(usageRecord) + '\n');
    
  } catch (error) {
    console.error('[WiltonOS] Erro ao registrar uso do modelo:', error);
  }
}

// Registrar métricas de performance do modelo
export function logModelPerformance(model: ModelType, metrics: Partial<ModelPerformanceMetrics>): void {
  try {
    const now = new Date();
    const dateString = now.toISOString().split('T')[0]; // YYYY-MM-DD
    const logFilePath = path.join(ANALYTICS_DIR, `model_performance_${dateString}.json`);
    
    // Carregar métricas existentes ou iniciar novas
    let performanceData: Record<ModelType, ModelPerformanceMetrics> = {};
    
    if (fs.existsSync(logFilePath)) {
      const fileContent = fs.readFileSync(logFilePath, 'utf-8');
      try {
        performanceData = JSON.parse(fileContent);
      } catch (e) {
        console.error('[WiltonOS] Erro ao analisar arquivo de métricas:', e);
      }
    }
    
    // Atualizar métricas para o modelo
    performanceData[model] = {
      model,
      averageProcessingTime: 0,
      averageTokensPerRequest: 0,
      successRate: 1.0,
      queryTypesDistribution: {},
      multimodalPercentage: 0,
      breathPhaseDistribution: {},
      coherenceLevelAverage: 0.5,
      ...(performanceData[model] || {}),
      ...metrics
    };
    
    // Salvar métricas atualizadas
    fs.writeFileSync(logFilePath, JSON.stringify(performanceData, null, 2));
    
  } catch (error) {
    console.error('[WiltonOS] Erro ao registrar performance do modelo:', error);
  }
}

// Calcular métricas de performance para um período
export function calculatePerformanceMetrics(
  startDate: Date,
  endDate: Date = new Date()
): Record<ModelType, ModelPerformanceMetrics> {
  try {
    const metrics: Record<ModelType, any> = {};
    
    // Coletar dados do período especificado
    const startDateStr = startDate.toISOString().split('T')[0];
    const endDateStr = endDate.toISOString().split('T')[0];
    
    let currentDate = new Date(startDate);
    
    while (currentDate <= endDate) {
      const dateStr = currentDate.toISOString().split('T')[0];
      const logFilePath = path.join(ANALYTICS_DIR, `model_usage_${dateStr}.jsonl`);
      
      if (fs.existsSync(logFilePath)) {
        const fileContent = fs.readFileSync(logFilePath, 'utf-8');
        const lines = fileContent.split('\n').filter(line => line.trim());
        
        for (const line of lines) {
          try {
            const record: ModelUsageRecord = JSON.parse(line);
            const model = record.model;
            
            // Inicializar métricas para o modelo se necessário
            if (!metrics[model]) {
              metrics[model] = {
                model,
                totalRequests: 0,
                totalProcessingTime: 0,
                totalTokens: 0,
                successfulRequests: 0,
                failedRequests: 0,
                queryTypes: {},
                multimodalRequests: 0,
                breathPhases: {},
                coherenceLevelSum: 0,
                fallbackRequests: 0
              };
            }
            
            // Atualizar métricas
            const modelMetrics = metrics[model];
            modelMetrics.totalRequests++;
            modelMetrics.totalProcessingTime += record.processingTime;
            modelMetrics.totalTokens += record.totalTokens;
            
            // Contabilizar tipo de consulta
            const queryType = record.queryType;
            modelMetrics.queryTypes[queryType] = (modelMetrics.queryTypes[queryType] || 0) + 1;
            
            // Contabilizar multimodal
            if (record.multimodal) {
              modelMetrics.multimodalRequests++;
            }
            
            // Contabilizar fase respiratória
            if (record.breathPhase) {
              const phase = record.breathPhase;
              modelMetrics.breathPhases[phase] = (modelMetrics.breathPhases[phase] || 0) + 1;
            }
            
            // Acumular nível de coerência
            modelMetrics.coherenceLevelSum += record.coherenceLevel;
            
            // Contabilizar fallbacks
            if (record.isFallback) {
              modelMetrics.fallbackRequests++;
            }
          } catch (e) {
            console.error('[WiltonOS] Erro ao processar linha de registro:', e);
          }
        }
      }
      
      // Avançar para o próximo dia
      currentDate.setDate(currentDate.getDate() + 1);
    }
    
    // Calcular métricas finais
    const result: Record<ModelType, ModelPerformanceMetrics> = {};
    
    for (const [model, data] of Object.entries(metrics)) {
      const totalRequests = data.totalRequests;
      
      if (totalRequests > 0) {
        // Calcular distribuição de tipos de consulta
        const queryTypesDistribution: Record<string, number> = {};
        for (const [type, count] of Object.entries(data.queryTypes)) {
          queryTypesDistribution[type] = count as number / totalRequests;
        }
        
        // Calcular distribuição de fases respiratórias
        const breathPhaseDistribution: Record<string, number> = {};
        for (const [phase, count] of Object.entries(data.breathPhases)) {
          breathPhaseDistribution[phase] = count as number / totalRequests;
        }
        
        result[model as ModelType] = {
          model: model as ModelType,
          averageProcessingTime: data.totalProcessingTime / totalRequests,
          averageTokensPerRequest: data.totalTokens / totalRequests,
          successRate: 1 - (data.fallbackRequests / totalRequests),
          queryTypesDistribution,
          multimodalPercentage: data.multimodalRequests / totalRequests,
          breathPhaseDistribution,
          coherenceLevelAverage: data.coherenceLevelSum / totalRequests
        };
      }
    }
    
    return result;
    
  } catch (error) {
    console.error('[WiltonOS] Erro ao calcular métricas de performance:', error);
    return {} as Record<ModelType, ModelPerformanceMetrics>;
  }
}

// Estimar custo de uso do modelo
export function estimateModelCosts(
  startDate: Date,
  endDate: Date = new Date()
): Record<ModelType, number> {
  try {
    // Taxas aproximadas por 1000 tokens (em USD)
    const costRates: Record<ModelType, { input: number, output: number }> = {
      'gpt-4o': { input: 0.005, output: 0.015 },
      'gemini-2.5-pro': { input: 0.003, output: 0.006 },
      'claude-3.7-sonnet': { input: 0.008, output: 0.024 },
      'grok-3': { input: 0.001, output: 0.003 }
    };
    
    const costs: Record<ModelType, number> = {
      'gpt-4o': 0,
      'gemini-2.5-pro': 0,
      'claude-3.7-sonnet': 0,
      'grok-3': 0
    };
    
    // Coletar dados do período especificado
    const startDateStr = startDate.toISOString().split('T')[0];
    const endDateStr = endDate.toISOString().split('T')[0];
    
    let currentDate = new Date(startDate);
    
    while (currentDate <= endDate) {
      const dateStr = currentDate.toISOString().split('T')[0];
      const logFilePath = path.join(ANALYTICS_DIR, `model_usage_${dateStr}.jsonl`);
      
      if (fs.existsSync(logFilePath)) {
        const fileContent = fs.readFileSync(logFilePath, 'utf-8');
        const lines = fileContent.split('\n').filter(line => line.trim());
        
        for (const line of lines) {
          try {
            const record: ModelUsageRecord = JSON.parse(line);
            const model = record.model;
            const rates = costRates[model];
            
            // Calcular custo desta consulta
            const inputCost = (record.inputTokens / 1000) * rates.input;
            const outputCost = (record.outputTokens / 1000) * rates.output;
            const totalCost = inputCost + outputCost;
            
            // Adicionar ao custo total
            costs[model] += totalCost;
          } catch (e) {
            console.error('[WiltonOS] Erro ao processar linha de custo:', e);
          }
        }
      }
      
      // Avançar para o próximo dia
      currentDate.setDate(currentDate.getDate() + 1);
    }
    
    return costs;
    
  } catch (error) {
    console.error('[WiltonOS] Erro ao calcular custos de modelo:', error);
    return {
      'gpt-4o': 0,
      'gemini-2.5-pro': 0,
      'claude-3.7-sonnet': 0,
      'grok-3': 0
    };
  }
}

// Exportar funções
export {
  logModelUsage,
  logModelPerformance,
  calculatePerformanceMetrics,
  estimateModelCosts
};