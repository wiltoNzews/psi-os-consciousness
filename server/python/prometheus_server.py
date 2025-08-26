#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Servidor Prometheus para exibição de métricas do META-ROUTING FRAMEWORK

Este módulo implementa um servidor HTTP que expõe métricas no formato Prometheus,
incluindo o balanço quântico 3:1, a fase atual do META-ROUTING e o status do sistema.
"""

import os
import sys
import time
import threading
import logging
from typing import Dict, Any

# Adicionar diretório raiz ao path para importações relativas
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "../..")))

try:
    from prometheus_client import start_http_server, Gauge, Counter, Info
except ImportError:
    logging.error("Biblioteca prometheus_client não encontrada. Execute: pip install prometheus-client")
    # Criar implementação mínima para evitar falhas
    class DummyMetric:
        def __init__(self, *args, **kwargs):
            pass
        def set(self, value):
            pass
        def labels(self, **kwargs):
            return self
        def inc(self, value=1):
            pass
    
    Gauge = Counter = Info = DummyMetric
    
    def start_http_server(port, addr=''):
        logging.warning(f"Simulando servidor Prometheus na porta {port}")
        return None

# Configuração de logging
logging.basicConfig(
    level=logging.INFO, format="[PROMETHEUS: %(levelname)s] %(message)s"
)
logger = logging.getLogger("prometheus_server")

# Métricas do Prometheus
QUANTUM_STABILITY = Gauge('wiltonos_quantum_stability',
                          'Estabilidade quântica (proporção 3:1)')
QUANTUM_EXPLORATION = Gauge('wiltonos_quantum_exploration',
                            'Exploração quântica (proporção 3:1)')
QUANTUM_RATIO = Gauge('wiltonos_quantum_ratio',
                      'Proporção estabilidade:exploração')
QUANTUM_BALANCE_STATUS = Gauge('wiltonos_quantum_balance_status',
                              'Status do balanço quântico (0=crítico, 1=subótimo, 2=ótimo)',
                              ['status'])

# Contadores
PHASE_TRANSITIONS = Counter('wiltonos_phase_transitions_total',
                           'Total de transições de fase',
                           ['from_phase', 'to_phase'])
WEBSOCKET_MESSAGES = Counter('wiltonos_websocket_messages_total',
                            'Total de mensagens WebSocket',
                            ['type'])
WEBSOCKET_CLIENTS = Gauge('wiltonos_websocket_clients',
                         'Número de clientes WebSocket conectados')

# Informações do sistema
META_ROUTING_INFO = Info('wiltonos_meta_routing',
                        'Informações do framework META-ROUTING')

# Estado global das métricas
metrics_state: Dict[str, Any] = {
    "stability": 0.75,
    "exploration": 0.25,
    "status": "optimal",
    "current_phase": "INIT",
    "clients_count": 0,
}

def update_metrics_from_wilton_core():
    """
    Atualiza as métricas com dados do wilton_core.
    Esta função é chamada periodicamente.
    """
    try:
        # Importação aqui para evitar dependência cíclica
        from wilton_core.qctf.quantum_balance_validator import quantum_validator
        
        # Obter métricas atuais
        balance_metrics = quantum_validator.get_balance_metrics()
        
        if balance_metrics:
            # Atualizar estado global
            metrics_state["stability"] = balance_metrics.get("stability", 0.75)
            metrics_state["exploration"] = balance_metrics.get("exploration", 0.25)
            metrics_state["status"] = balance_metrics.get("status", "optimal")
            
            # Atualizar métricas do Prometheus
            update_prometheus_metrics()
            
            logger.debug("Métricas atualizadas com sucesso")
            
    except ImportError:
        logger.warning("Módulo quantum_validator não encontrado")
    except Exception as e:
        logger.error(f"Erro ao atualizar métricas: {str(e)}")

def update_prometheus_metrics():
    """
    Atualiza as métricas do Prometheus com os valores do estado global
    """
    stability = metrics_state["stability"]
    exploration = metrics_state["exploration"]
    status = metrics_state["status"]
    
    # Calcular proporção
    ratio = stability / exploration if exploration > 0 else 0
    
    # Atualizar métricas
    QUANTUM_STABILITY.set(stability)
    QUANTUM_EXPLORATION.set(exploration)
    QUANTUM_RATIO.set(ratio)
    
    # Mapear status para valor numérico
    status_value = {
        "critical": 0,
        "suboptimal": 1,
        "optimal": 2
    }.get(status, 1)
    
    for s, v in [("critical", 0), ("suboptimal", 1), ("optimal", 2)]:
        QUANTUM_BALANCE_STATUS.labels(status=s).set(1 if s == status else 0)
    
    # Atualizar informações do sistema
    META_ROUTING_INFO.info({
        "current_phase": metrics_state["current_phase"],
        "status": status,
        "version": "0.1.0",
        "quantum_ratio": f"{ratio:.2f}:1",
        "target_ratio": "3:1"
    })
    
    # Atualizar contador de clientes
    WEBSOCKET_CLIENTS.set(metrics_state["clients_count"])

def metrics_update_loop():
    """
    Loop para atualização periódica das métricas
    """
    while True:
        update_metrics_from_wilton_core()
        time.sleep(5)  # Atualizar a cada 5 segundos

def start_prometheus_server(port: int = 9090):
    """
    Inicia o servidor Prometheus para exposição de métricas
    
    Args:
        port: Porta para o servidor HTTP (padrão: 9090)
    """
    try:
        # Inicializar métricas
        update_prometheus_metrics()
        
        # Iniciar servidor HTTP
        start_http_server(port)
        logger.info(f"Servidor Prometheus iniciado na porta {port}")
        
        # Iniciar thread de atualização
        metrics_thread = threading.Thread(
            target=metrics_update_loop,
            daemon=True
        )
        metrics_thread.start()
        
        return True
    except Exception as e:
        logger.error(f"Erro ao iniciar servidor Prometheus: {str(e)}")
        return False

# Função para registrar uma transição de fase
def record_phase_transition(from_phase: str, to_phase: str):
    """
    Registra uma transição de fase no contador do Prometheus
    
    Args:
        from_phase: Fase de origem
        to_phase: Fase de destino
    """
    PHASE_TRANSITIONS.labels(from_phase=from_phase, to_phase=to_phase).inc()
    metrics_state["current_phase"] = to_phase
    update_prometheus_metrics()

# Função para registrar uma mensagem WebSocket
def record_websocket_message(message_type: str):
    """
    Registra um tipo de mensagem WebSocket no contador do Prometheus
    
    Args:
        message_type: Tipo da mensagem
    """
    WEBSOCKET_MESSAGES.labels(type=message_type).inc()

# Função para atualizar o contador de clientes
def update_clients_count(count: int):
    """
    Atualiza o contador de clientes WebSocket
    
    Args:
        count: Número de clientes conectados
    """
    metrics_state["clients_count"] = count
    WEBSOCKET_CLIENTS.set(count)

if __name__ == "__main__":
    # Iniciar servidor ao executar diretamente
    if start_prometheus_server():
        # Manter o script em execução
        try:
            while True:
                time.sleep(1)
        except KeyboardInterrupt:
            logger.info("Servidor interrompido pelo usuário")