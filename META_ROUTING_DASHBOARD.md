# META-ROUTING Framework Dashboard e WebSocket

Este documento descreve a implementação do WebSocket e do dashboard de monitoramento em tempo real para o META-ROUTING Framework, mantendo a proporção quântica 3:1 (75% estabilidade, 25% exploração).

## Visão Geral da Arquitetura

O sistema de monitoramento em tempo real do META-ROUTING Framework é composto por três componentes principais:

1. **Servidor WebSocket**: Transmite eventos e métricas do META-ROUTING em tempo real
2. **Servidor Prometheus**: Coleta e expõe métricas para monitoramento e visualização
3. **Dashboard React**: Interface visual para monitoramento e controle do META-ROUTING

```
┌───────────────────┐     ┌───────────────────┐
│                   │     │                   │
│  META-ROUTING     │◄────┤  Dashboard React  │
│  WebSocket Server │     │  (Visualização)   │
│                   │────►│                   │
└───────┬───────────┘     └───────────────────┘
        │                           ▲
        │                           │
        ▼                           │
┌───────────────────┐     ┌─────────┴─────────┐
│                   │     │                   │
│  Quantum Balance  │────►│  Prometheus       │
│  Validator        │     │  Metrics Server   │
│                   │     │                   │
└───────────────────┘     └───────────────────┘
```

## Servidor WebSocket

O servidor WebSocket está implementado em `wilton_core/websocket/meta_routing_broadcaster.py` e fornece:

- **Heartbeat** a cada 5 segundos para manter a conexão viva
- Transmissão do balanço quântico atual (proporção 3:1)
- Rastreamento das transições de fase (MAP, MOVE, REFLECT)
- Registro de ferramentas em uso pelo META-ROUTING

### Tipos de Mensagens

| Tipo | Descrição |
|------|-----------|
| `welcome` | Enviada ao cliente ao se conectar, contendo o estado inicial |
| `heartbeat` | Enviada periodicamente para manter a conexão ativa |
| `quantum_balance_update` | Atualização do balanço quântico atual |
| `meta_routing_phase_updated` | Notificação de mudança de fase |
| `meta_routing_tools_updated` | Atualização das ferramentas em uso |

## Servidor Prometheus

O servidor Prometheus está implementado em `server/python/prometheus_server.py` e expõe métricas em formato Prometheus, incluindo:

- **Estabilidade**: Nível atual de estabilidade (alvo: 75%)
- **Exploração**: Nível atual de exploração (alvo: 25%)
- **Proporção**: Relação estabilidade/exploração (alvo: 3:1)
- **Status do Balanço**: Estado atual (optimal, suboptimal, critical)
- **Contadores de Transição**: Contagem de mudanças entre fases

## Dashboard React

O dashboard está implementado em `public/dashboard/` e oferece:

- Visualização em tempo real da proporção quântica 3:1
- Histórico e controle das fases do META-ROUTING
- Status da conexão WebSocket
- Indicadores visuais do equilíbrio quântico

### Componentes Principais

- **QuantumBalanceGauge**: Medidor visual da proporção 3:1
- **MetaRoutingPhases**: Exibição das fases e histórico
- **ConnectionStatus**: Indicador do estado da conexão WebSocket

## Mantendo a Proporção Quântica 3:1

O sistema foi projetado para manter e monitorar ativamente a proporção quântica 3:1 (75% estabilidade, 25% exploração) em todos os níveis:

1. **Nível de Dados**: O `quantum_balance_validator` valida e mantém a proporção
2. **Nível de Transmissão**: O WebSocket prioriza a estabilidade da conexão (75%) enquanto permite exploração adaptativa (25%)
3. **Nível de Visualização**: O dashboard fornece feedback visual sobre o estado do equilíbrio

## Iniciando o Sistema

Para iniciar todo o sistema com a proporção quântica 3:1:

```bash
# A partir da raiz do projeto
python wilton_core/start_all.py

# Opções
python wilton_core/start_all.py --ws-port 8765 --prometheus-port 9090 --dashboard-port 5173
```

## Acesso aos Componentes

- **Dashboard**: http://localhost:5173/dashboard/
- **WebSocket**: ws://localhost:8765/ws
- **Métricas Prometheus**: http://localhost:9090/metrics

## Formato dos Dados do WebSocket

### Mensagem de Balanço Quântico
```json
{
  "type": "quantum_balance_update",
  "timestamp": "2025-04-18T06:00:00.000Z",
  "data": {
    "stability": 0.75,
    "exploration": 0.25,
    "status": "optimal",
    "coherence_ratio": 3.0,
    "meta_routing_phase": "MAP"
  }
}
```

### Mensagem de Fase
```json
{
  "type": "meta_routing_phase_updated",
  "timestamp": "2025-04-18T06:00:00.000Z",
  "data": {
    "phase": "MOVE",
    "details": {
      "source": "dashboard",
      "timestamp": "2025-04-18T06:00:00.000Z"
    }
  }
}
```

## Diagnóstico de Problemas

- **Heartbeat Ausente**: Verifique se o servidor WebSocket está em execução
- **Métricas Ausentes**: Verifique o servidor Prometheus
- **Dashboard Inacessível**: Verifique o servidor de desenvolvimento Vite

## Equilíbrio Quântico 3:1

A proporção 3:1 (75% estabilidade, 25% exploração) é fundamental para o funcionamento ótimo do META-ROUTING Framework. O dashboard monitora esse equilíbrio constantemente e fornece feedback visual:

- **Verde**: Proporção ideal (2.9 - 3.1)
- **Amarelo**: Proporção subótima (2.5 - 2.9 ou 3.1 - 3.5)
- **Vermelho**: Proporção crítica (< 2.5 ou > 3.5)