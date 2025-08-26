/**
 * WiltonOS Financial Core
 * 
 * Enterprise Ledger Flow para o WiltonOS Financial Core.
 * Sistema de pipeline de dados financeiros para gerenciamento soberano 
 * de capital com micro-estratégias de alta frequência.
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import { WebSocket } from 'ws';
import { activeConnections, wsHandlers } from './routes.js';

// Obter diretório atual (equivalente a __dirname em CommonJS)
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Interface para transações financeiras
interface Transaction {
  id: string;
  timestamp: number;
  strategy: string;
  pair: string;
  type: 'buy' | 'sell';
  amount: number;
  price: number;
  fee: number;
  status: 'pending' | 'completed' | 'failed';
  notes?: string;
}

// Interface para o Financial Core
interface FinancialCore {
  last_updated: string;
  ledger_initialized: string;
  financial_core: {
    status: string;
    version: string;
    notes: string;
  };
  capital_allocation: {
    total_capital: number;
    currency: string;
    active_flow: number;
    sacred_surplus: number;
  };
  risk_parameters: {
    max_deployment_per_action: number;
    stop_loss_percentage: number;
    daily_limit_percentage: number;
    rebalance_threshold: number;
  };
  micro_strategies: Array<{
    name: string;
    status: string;
    allocation_percentage: number;
    timeframe: string;
    pairs: string[];
  }>;
  exchange_connections: Array<{
    name: string;
    status: string;
    type: string;
    priority: number;
  }>;
  ledger_guardian: {
    status: string;
    log_frequency: string;
    anomaly_detection: boolean;
    rebalance_suggestions: boolean;
  };
  transaction_history: Transaction[];
  field_anchor: string;
}

// Caminhos dos arquivos
const financialCorePath = path.join(__dirname, '..', 'WiltonOS_FinancialCore.json');

// Carregar dados do Financial Core
export function loadFinancialCore(): FinancialCore {
  try {
    const data = fs.readFileSync(financialCorePath, 'utf-8');
    return JSON.parse(data) as FinancialCore;
  } catch (error) {
    console.error('Erro ao carregar Financial Core:', error);
    throw new Error('Falha ao carregar dados do Financial Core');
  }
}

// Salvar dados do Financial Core
export function saveFinancialCore(data: FinancialCore): void {
  try {
    fs.writeFileSync(
      financialCorePath,
      JSON.stringify(data, null, 2),
      'utf-8'
    );
  } catch (error) {
    console.error('Erro ao salvar Financial Core:', error);
    throw new Error('Falha ao salvar dados do Financial Core');
  }
}

// Registrar transação no histórico
export function registerTransaction(transaction: Omit<Transaction, 'id' | 'timestamp'>): Transaction {
  const core = loadFinancialCore();
  
  const newTransaction: Transaction = {
    ...transaction,
    id: Date.now().toString(),
    timestamp: Date.now(),
  };
  
  core.transaction_history.push(newTransaction);
  core.last_updated = new Date().toISOString();
  
  saveFinancialCore(core);
  
  // Notificar via WebSocket
  broadcastFinancialUpdate({
    type: 'transaction',
    data: newTransaction
  });
  
  return newTransaction;
}

// Verificar limites de risco
export function checkRiskLimits(amount: number, pair: string): boolean {
  const core = loadFinancialCore();
  
  // Verificar limite máximo por ação
  const maxAmount = core.capital_allocation.active_flow * core.risk_parameters.max_deployment_per_action;
  if (amount > maxAmount) {
    return false;
  }
  
  // Verificar limite diário
  const today = new Date().setHours(0, 0, 0, 0);
  const dailyTransactions = core.transaction_history.filter(
    t => t.timestamp >= today
  );
  
  const dailyVolume = dailyTransactions.reduce((sum, t) => sum + t.amount, 0);
  const maxDailyVolume = core.capital_allocation.active_flow * core.risk_parameters.daily_limit_percentage;
  
  if (dailyVolume + amount > maxDailyVolume) {
    return false;
  }
  
  return true;
}

// Atualizar alocação de capital
export function updateCapitalAllocation(activeFlow: number, sacredSurplus: number): void {
  const core = loadFinancialCore();
  
  if (activeFlow + sacredSurplus !== core.capital_allocation.total_capital) {
    throw new Error('A alocação total deve ser igual ao capital total');
  }
  
  core.capital_allocation.active_flow = activeFlow;
  core.capital_allocation.sacred_surplus = sacredSurplus;
  core.last_updated = new Date().toISOString();
  
  saveFinancialCore(core);
  
  // Notificar via WebSocket
  broadcastFinancialUpdate({
    type: 'allocation_update',
    data: core.capital_allocation
  });
}

// Atualizar parâmetros de risco
export function updateRiskParameters(parameters: Partial<FinancialCore['risk_parameters']>): void {
  const core = loadFinancialCore();
  
  core.risk_parameters = {
    ...core.risk_parameters,
    ...parameters
  };
  
  core.last_updated = new Date().toISOString();
  
  saveFinancialCore(core);
  
  // Notificar via WebSocket
  broadcastFinancialUpdate({
    type: 'risk_update',
    data: core.risk_parameters
  });
}

// Broadcast de atualizações via WebSocket
export function broadcastFinancialUpdate(message: any): void {
  const messageString = JSON.stringify(message);
  
  activeConnections.forEach((ws: any) => {
    if (ws.readyState === WebSocket.OPEN) {
      ws.send(messageString);
    }
  });
}

// Handler para mensagens WebSocket relacionadas ao Financial Core
export function handleFinancialMessage(ws: any, data: any): void {
  const { action } = data;
  
  switch (action) {
    case 'get_financial_core':
      const core = loadFinancialCore();
      ws.send(JSON.stringify({
        type: 'financial_core',
        data: core
      }));
      break;
      
    case 'register_transaction':
      try {
        const transaction = registerTransaction(data.transaction);
        ws.send(JSON.stringify({
          type: 'transaction_registered',
          data: transaction,
          success: true
        }));
      } catch (error: any) {
        ws.send(JSON.stringify({
          type: 'transaction_registered',
          error: error.message || 'Erro desconhecido',
          success: false
        }));
      }
      break;
      
    case 'update_allocation':
      try {
        updateCapitalAllocation(data.active_flow, data.sacred_surplus);
        ws.send(JSON.stringify({
          type: 'allocation_updated',
          success: true
        }));
      } catch (error: any) {
        ws.send(JSON.stringify({
          type: 'allocation_updated',
          error: error.message || 'Erro desconhecido',
          success: false
        }));
      }
      break;
      
    case 'update_risk':
      try {
        updateRiskParameters(data.parameters);
        ws.send(JSON.stringify({
          type: 'risk_updated',
          success: true
        }));
      } catch (error: any) {
        ws.send(JSON.stringify({
          type: 'risk_updated',
          error: error.message || 'Erro desconhecido',
          success: false
        }));
      }
      break;
      
    default:
      ws.send(JSON.stringify({
        type: 'error',
        message: 'Ação desconhecida',
        success: false
      }));
  }
}

// Inicializar WebSocket handlers para o Financial Core
export function initializeFinancialCoreWebSocket(): void {
  wsHandlers.set('financial_core', handleFinancialMessage);
  console.log('🚀 Financial Core WebSocket Handlers inicializados');
}

// Exportar funções principais
export const FinancialCore = {
  load: loadFinancialCore,
  save: saveFinancialCore,
  registerTransaction,
  checkRiskLimits,
  updateCapitalAllocation,
  updateRiskParameters,
  initialize: initializeFinancialCoreWebSocket
};

export default FinancialCore;