/**
 * META-ROUTING WebSocket Client
 * 
 * Cliente JavaScript para conectar ao META-ROUTING WebSocket e receber/enviar atualizações
 * relacionadas ao equilíbrio quântico e fases do META-ROUTING (MAP, MOVE, REFLECT).
 */

// Constantes
const DEFAULT_RETRY_DELAY = 2000; // ms
const MAX_RETRY_DELAY = 30000; // ms
const PING_INTERVAL = 15000; // ms

/**
 * Cliente para o META-ROUTING WebSocket
 */
export class MetaRoutingClient {
  /**
   * Cria um novo cliente META-ROUTING WebSocket
   * @param {Object} options - Opções de configuração
   * @param {string} options.url - URL do WebSocket (opcional)
   * @param {function} options.onMessage - Callback para mensagens recebidas
   * @param {function} options.onConnect - Callback quando conectado
   * @param {function} options.onDisconnect - Callback quando desconectado
   * @param {function} options.onError - Callback para erros
   * @param {boolean} options.autoReconnect - Reconectar automaticamente (padrão: true)
   */
  constructor(options = {}) {
    this.options = {
      autoReconnect: true,
      ...options
    };
    
    // Determinar URL do WebSocket
    if (!this.options.url) {
      const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
      const host = window.location.host;
      this.options.url = `${protocol}//${host}/ws`;
    }
    
    this.socket = null;
    this.connected = false;
    this.reconnectAttempts = 0;
    this.reconnectTimeout = null;
    this.pingInterval = null;
    
    this.metaRoutingState = {
      currentPhase: 'INIT',
      phasesHistory: [],
      currentTools: []
    };
    
    this.quantumBalance = {
      stability: 0.75,
      exploration: 0.25,
      coherenceRatio: '3:1',
      status: 'init'
    };
    
    // Inicializar se onMessage for fornecido
    if (typeof this.options.onMessage === 'function') {
      this.connect();
    }
  }
  
  /**
   * Conecta ao servidor WebSocket
   * @returns {Promise} Uma promessa que resolve quando conectado
   */
  connect() {
    return new Promise((resolve, reject) => {
      if (this.socket && this.connected) {
        resolve(this.socket);
        return;
      }
      
      try {
        this.socket = new WebSocket(this.options.url);
        
        this.socket.onopen = () => {
          console.log('[META-ROUTING] Conectado ao servidor WebSocket');
          this.connected = true;
          this.reconnectAttempts = 0;
          
          // Iniciar pings periódicos
          this.startPingInterval();
          
          // Obter estado inicial
          this.getMetaRoutingState();
          this.getQuantumBalance();
          
          if (typeof this.options.onConnect === 'function') {
            this.options.onConnect();
          }
          
          resolve(this.socket);
        };
        
        this.socket.onmessage = (event) => {
          try {
            const message = JSON.parse(event.data);
            this.handleMessage(message);
            
            if (typeof this.options.onMessage === 'function') {
              this.options.onMessage(message);
            }
          } catch (error) {
            console.error('[META-ROUTING] Erro ao processar mensagem:', error);
          }
        };
        
        this.socket.onclose = (event) => {
          console.log(`[META-ROUTING] Conexão fechada. Código: ${event.code}, Motivo: ${event.reason}`);
          this.connected = false;
          this.stopPingInterval();
          
          if (typeof this.options.onDisconnect === 'function') {
            this.options.onDisconnect(event);
          }
          
          // Reconectar se habilitado
          if (this.options.autoReconnect) {
            this.scheduleReconnect();
          }
        };
        
        this.socket.onerror = (error) => {
          console.error('[META-ROUTING] Erro de WebSocket:', error);
          
          if (typeof this.options.onError === 'function') {
            this.options.onError(error);
          }
        };
        
      } catch (error) {
        console.error('[META-ROUTING] Erro ao conectar:', error);
        reject(error);
        
        // Reconectar se habilitado
        if (this.options.autoReconnect) {
          this.scheduleReconnect();
        }
      }
    });
  }
  
  /**
   * Desconecta do servidor WebSocket
   */
  disconnect() {
    if (this.socket) {
      this.options.autoReconnect = false;
      this.stopPingInterval();
      this.socket.close(1000, 'Fechamento solicitado pelo cliente');
      this.socket = null;
      this.connected = false;
      
      if (this.reconnectTimeout) {
        clearTimeout(this.reconnectTimeout);
        this.reconnectTimeout = null;
      }
    }
  }
  
  /**
   * Agenda uma reconexão com backoff exponencial
   */
  scheduleReconnect() {
    if (this.reconnectTimeout) {
      clearTimeout(this.reconnectTimeout);
    }
    
    this.reconnectAttempts++;
    const delay = Math.min(
      DEFAULT_RETRY_DELAY * Math.pow(1.5, this.reconnectAttempts - 1),
      MAX_RETRY_DELAY
    );
    
    console.log(`[META-ROUTING] Tentando reconectar em ${delay}ms (tentativa ${this.reconnectAttempts})`);
    
    this.reconnectTimeout = setTimeout(() => {
      this.connect().catch(() => {
        // Falha silenciosa - já lidamos com erros e reagendamos na função connect
      });
    }, delay);
  }
  
  /**
   * Inicia o ping periódico para manter a conexão viva
   */
  startPingInterval() {
    this.stopPingInterval();
    
    this.pingInterval = setInterval(() => {
      if (this.connected) {
        this.sendMessage({
          type: 'ping',
          timestamp: new Date().toISOString()
        });
      }
    }, PING_INTERVAL);
  }
  
  /**
   * Para o ping periódico
   */
  stopPingInterval() {
    if (this.pingInterval) {
      clearInterval(this.pingInterval);
      this.pingInterval = null;
    }
  }
  
  /**
   * Processa mensagens recebidas do servidor
   * @param {Object} message - Mensagem recebida
   */
  handleMessage(message) {
    const { type, data } = message;
    
    switch (type) {
      case 'welcome':
        // Dados iniciais de boas-vindas
        if (data && data.quantum_balance) {
          this.quantumBalance = data.quantum_balance;
        }
        if (data && data.meta_routing_state) {
          this.metaRoutingState = data.meta_routing_state;
        }
        break;
        
      case 'meta_routing_state':
        // Atualização completa do estado
        if (data) {
          this.metaRoutingState = data;
        }
        break;
        
      case 'quantum_balance':
      case 'quantum_balance_update':
        // Atualização das métricas de balanço quântico
        if (data) {
          this.quantumBalance = data;
        }
        break;
        
      case 'meta_routing_phase_updated':
        // Atualização de fase
        if (data && data.phase) {
          this.metaRoutingState.currentPhase = data.phase;
          if (data.snapshot) {
            // Usar dados do snapshot quântico
            const { stability_score, exploration_score, coherence_ratio } = data.snapshot;
            this.quantumBalance.stability = stability_score / 100;
            this.quantumBalance.exploration = exploration_score / 100;
            this.quantumBalance.coherenceRatio = coherence_ratio;
          }
          
          // Adicionar ao histórico
          this.metaRoutingState.phasesHistory.push({
            phase: data.phase,
            timestamp: data.timestamp || new Date().toISOString(),
            details: data.details || {}
          });
          
          // Manter histórico gerenciável
          if (this.metaRoutingState.phasesHistory.length > 50) {
            this.metaRoutingState.phasesHistory = 
              this.metaRoutingState.phasesHistory.slice(-50);
          }
        }
        break;
        
      case 'meta_routing_tools_updated':
        // Atualização de ferramentas
        if (data && Array.isArray(data.tools)) {
          this.metaRoutingState.currentTools = data.tools;
        }
        break;
        
      case 'pong':
        // Resposta ao ping, nada a fazer
        break;
        
      default:
        console.log(`[META-ROUTING] Mensagem não processada de tipo: ${type}`);
    }
  }
  
  /**
   * Envia uma mensagem para o servidor
   * @param {Object} message - Mensagem a enviar
   * @returns {boolean} Sucesso do envio
   */
  sendMessage(message) {
    if (!this.connected || !this.socket) {
      console.warn('[META-ROUTING] Tentativa de enviar mensagem com socket desconectado');
      return false;
    }
    
    try {
      this.socket.send(JSON.stringify(message));
      return true;
    } catch (error) {
      console.error('[META-ROUTING] Erro ao enviar mensagem:', error);
      return false;
    }
  }
  
  /**
   * Solicita o estado atual do META-ROUTING
   */
  getMetaRoutingState() {
    return this.sendMessage({
      type: 'get_meta_routing_state',
      timestamp: new Date().toISOString()
    });
  }
  
  /**
   * Solicita as métricas atuais de balanço quântico
   */
  getQuantumBalance() {
    return this.sendMessage({
      type: 'get_quantum_balance',
      timestamp: new Date().toISOString()
    });
  }
  
  /**
   * Atualiza a fase atual do META-ROUTING
   * @param {string} phase - Nova fase (MAP, MOVE, REFLECT)
   * @param {Object} details - Detalhes adicionais da fase
   */
  updateMetaRoutingPhase(phase, details = {}) {
    if (!['MAP', 'MOVE', 'REFLECT'].includes(phase)) {
      console.error(`[META-ROUTING] Fase inválida: ${phase}`);
      return false;
    }
    
    return this.sendMessage({
      type: 'update_meta_routing_phase',
      timestamp: new Date().toISOString(),
      phase,
      details
    });
  }
  
  /**
   * Atualiza as ferramentas em uso no META-ROUTING
   * @param {Array<string>} tools - Lista de ferramentas em uso
   */
  updateTools(tools = []) {
    return this.sendMessage({
      type: 'update_tools',
      timestamp: new Date().toISOString(),
      tools
    });
  }
  
  /**
   * Obtém a fase atual do META-ROUTING
   * @returns {string} Fase atual
   */
  getCurrentPhase() {
    return this.metaRoutingState.currentPhase;
  }
  
  /**
   * Obtém as ferramentas atuais em uso
   * @returns {Array<string>} Ferramentas atuais
   */
  getCurrentTools() {
    return this.metaRoutingState.currentTools;
  }
  
  /**
   * Obtém o histórico de fases
   * @returns {Array<Object>} Histórico de fases
   */
  getPhasesHistory() {
    return this.metaRoutingState.phasesHistory;
  }
  
  /**
   * Obtém as métricas atuais de balanço quântico
   * @returns {Object} Métricas de balanço quântico
   */
  getQuantumBalanceMetrics() {
    return this.quantumBalance;
  }
  
  /**
   * Verifica se está conectado
   * @returns {boolean} Estado da conexão
   */
  isConnected() {
    return this.connected;
  }
}

// Instância padrão para uso geral
export const metaRoutingClient = new MetaRoutingClient({
  autoReconnect: true,
  onConnect: () => {
    console.log('[META-ROUTING] Cliente conectado e pronto para uso.');
  },
  onMessage: (message) => {
    if (message.type === 'quantum_balance_update') {
      // Verificar se está fora do equilíbrio e registrar
      const { stability, exploration, status } = message.data;
      if (status === 'critical') {
        console.warn(`[META-ROUTING] Alerta: Balanço quântico crítico! Estabilidade: ${stability.toFixed(2)}, Exploração: ${exploration.toFixed(2)}`);
      }
    }
  }
});

export default metaRoutingClient;