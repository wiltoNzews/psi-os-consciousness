/**
 * Biblioteca para gerenciar conexões WebSocket no ambiente Docker
 */

interface WebSocketOptions {
  onOpen?: (event: Event) => void;
  onClose?: (event: CloseEvent) => void;
  onError?: (event: Event) => void;
  onMessage?: (data: any) => void;
  reconnectInterval?: number;
  maxReconnectAttempts?: number;
}

export class WebSocketManager {
  private socket: WebSocket | null = null;
  private reconnectAttempts = 0;
  private reconnectInterval: number;
  private maxReconnectAttempts: number;
  private url: string;
  private callbacks: {
    onOpen?: (event: Event) => void;
    onClose?: (event: CloseEvent) => void;
    onError?: (event: Event) => void;
    onMessage?: (data: any) => void;
  };

  constructor(options: WebSocketOptions = {}) {
    // Usar variáveis de ambiente do Vite se disponíveis
    const wsUrl = import.meta.env.VITE_WS_URL || this.getDefaultWsUrl();
    this.url = wsUrl;
    
    this.reconnectInterval = options.reconnectInterval || 3000;
    this.maxReconnectAttempts = options.maxReconnectAttempts || 5;
    
    this.callbacks = {
      onOpen: options.onOpen,
      onClose: options.onClose,
      onError: options.onError,
      onMessage: options.onMessage
    };
    
    // Inicialmente não conectado
    this.socket = null;
  }

  /**
   * Obtém a URL padrão do WebSocket baseada na URL atual
   */
  private getDefaultWsUrl(): string {
    const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
    const host = window.location.host;
    return `${protocol}//${host}/ws`;
  }

  /**
   * Conecta ao servidor WebSocket
   */
  public connect(): void {
    if (this.socket && 
        (this.socket.readyState === WebSocket.OPEN || 
         this.socket.readyState === WebSocket.CONNECTING)) {
      console.log('WebSocket já está conectado ou conectando');
      return;
    }

    console.log(`Conectando ao WebSocket: ${this.url}`);
    
    try {
      this.socket = new WebSocket(this.url);
      
      this.socket.onopen = (event) => {
        console.log('WebSocket conectado com sucesso');
        this.reconnectAttempts = 0;
        if (this.callbacks.onOpen) this.callbacks.onOpen(event);
      };
      
      this.socket.onclose = (event) => {
        console.log(`WebSocket desconectado. Código: ${event.code}, Razão: ${event.reason}`);
        
        if (this.callbacks.onClose) this.callbacks.onClose(event);
        
        // Tentar reconectar se não foi um fechamento limpo
        if (!event.wasClean) {
          this.attemptReconnect();
        }
      };
      
      this.socket.onerror = (event) => {
        console.error('Erro no WebSocket:', event);
        if (this.callbacks.onError) this.callbacks.onError(event);
      };
      
      this.socket.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          if (this.callbacks.onMessage) this.callbacks.onMessage(data);
        } catch (error) {
          console.error('Erro ao processar mensagem do WebSocket:', error);
          if (this.callbacks.onMessage) this.callbacks.onMessage(event.data);
        }
      };
    } catch (error) {
      console.error('Erro ao criar conexão WebSocket:', error);
      this.attemptReconnect();
    }
  }

  /**
   * Tenta reconectar ao servidor WebSocket
   */
  private attemptReconnect(): void {
    this.reconnectAttempts++;
    
    if (this.reconnectAttempts <= this.maxReconnectAttempts) {
      console.log(`Tentativa de reconexão ${this.reconnectAttempts}/${this.maxReconnectAttempts} em ${this.reconnectInterval}ms`);
      
      setTimeout(() => {
        this.connect();
      }, this.reconnectInterval);
    } else {
      console.error(`Falha após ${this.maxReconnectAttempts} tentativas de reconexão.`);
    }
  }

  /**
   * Envia uma mensagem pelo WebSocket
   */
  public send<T>(type: string, payload: T): boolean {
    if (!this.socket || this.socket.readyState !== WebSocket.OPEN) {
      console.warn('Não é possível enviar mensagem: WebSocket não está conectado');
      return false;
    }
    
    try {
      const message = JSON.stringify({
        type,
        payload,
        timestamp: new Date().toISOString()
      });
      
      this.socket.send(message);
      return true;
    } catch (error) {
      console.error('Erro ao enviar mensagem:', error);
      return false;
    }
  }

  /**
   * Fecha a conexão WebSocket
   */
  public disconnect(): void {
    if (this.socket) {
      this.socket.close();
      this.socket = null;
    }
  }

  /**
   * Obtém o status atual da conexão
   */
  public getStatus(): 'connecting' | 'open' | 'closing' | 'closed' | 'not_initialized' {
    if (!this.socket) return 'not_initialized';
    
    switch (this.socket.readyState) {
      case WebSocket.CONNECTING:
        return 'connecting';
      case WebSocket.OPEN:
        return 'open';
      case WebSocket.CLOSING:
        return 'closing';
      case WebSocket.CLOSED:
        return 'closed';
      default:
        return 'not_initialized';
    }
  }
}

// Instância singleton
let wsInstance: WebSocketManager | null = null;

/**
 * Obtém uma instância do gerenciador de WebSocket
 */
export function getWebSocketManager(options?: WebSocketOptions): WebSocketManager {
  if (!wsInstance) {
    wsInstance = new WebSocketManager(options);
  }
  return wsInstance;
}

/**
 * Hook de exemplo para React
 */
/* 
import { useState, useEffect } from 'react';
import { getWebSocketManager } from './websocket';

export function useWebSocket() {
  const [isConnected, setIsConnected] = useState(false);
  const [lastMessage, setLastMessage] = useState<any>(null);
  
  useEffect(() => {
    const ws = getWebSocketManager({
      onOpen: () => setIsConnected(true),
      onClose: () => setIsConnected(false),
      onMessage: (data) => setLastMessage(data)
    });
    
    ws.connect();
    
    return () => {
      ws.disconnect();
    };
  }, []);
  
  return {
    isConnected,
    lastMessage,
    sendMessage: (type: string, payload: any) => 
      getWebSocketManager().send(type, payload)
  };
}
*/