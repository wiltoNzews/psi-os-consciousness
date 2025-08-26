# Auto-Recalibration Service (ARS)

Este documento descreve o funcionamento do Auto-Recalibration Service (ARS), um sistema que detecta e corrige automaticamente desvios na proporção quântica 3:1 (75% estabilidade, 25% exploração) do META-ROUTING Framework.

## Visão Geral

O ARS monitora continuamente o equilíbrio quântico 3:1 do sistema e, quando detecta desvios significativos, inicia um processo de recalibração automática que pausa temporariamente as operações de exploração para permitir que o sistema retorne ao estado de equilíbrio ideal.

```
┌─────────────────┐     ┌───────────────────┐     ┌─────────────────┐
│  META-Router    │────►│  Quantum Gauge    │────►│ Prometheus      │
│  Processamento  │     │  Monitoramento    │     │ Métricas        │
└────────┬────────┘     └────────┬──────────┘     └─────────────────┘
         │                       │
         │                       │ drift_detected
         │                       ▼
         │              ┌────────────────────┐
         │              │ Auto-Recalibration │
         └◄─────────────┤ Service (ARS)      │
    exploration_budget  └────────────────────┘
      adjustment               │
                               ▼
                        ┌─────────────────┐
                        │ WebSocket & UI  │
                        │ Notificações    │
                        └─────────────────┘
```

## Componentes Principais

### 1. Quantum Gauge

O Quantum Gauge é responsável por monitorar a proporção quântica 3:1 e detectar desvios:

- **Amostragem Contínua**: Coleta amostras periódicas da proporção estabilidade/exploração
- **Detecção de Desvios**: Identifica quando a proporção sai dos limites aceitáveis (0.6 - 0.9 para estabilidade)
- **Notificação de Eventos**: Emite eventos de drift quando detecta desvios persistentes

### 2. Auto-Recalibration Service

O ARS é o núcleo do sistema de auto-correção:

- **Monitoramento do Gauge**: Observa o estado do Quantum Gauge
- **Inicialização de Recalibração**: Quando um drift é detectado, inicia o processo de recalibração
- **Ajuste do Budget de Exploração**: Reduz temporariamente a exploração para permitir estabilização
- **Medição de Eficácia**: Registra métricas de sucesso das recalibrações

### 3. Métricas e Monitoramento

O sistema expõe métricas Prometheus para monitoramento:

- **drift_events_total**: Contador de eventos de drift detectados
- **recalibration_events_total**: Contador de recalibrações iniciadas
- **recalibration_seconds_total**: Tempo total gasto em recalibração
- **recalibration_active**: Indica se há uma recalibração em andamento
- **exploration_budget**: Orçamento atual para exploração (0.0-1.0)

### 4. Componente de UI

Um componente no dashboard exibe o status da recalibração em tempo real:

- Badge de estado (normal, drift, recalibrando)
- Progresso da recalibração em curso
- Detalhes do evento de drift que acionou a recalibração
- Histórico de recalibrações anteriores

## Parâmetros e Configuração

### Quantum Gauge

| Parâmetro | Valor Padrão | Descrição |
|-----------|--------------|-----------|
| `stability_target` | 0.75 | Valor alvo para estabilidade |
| `drift_threshold` | 3 | Número de amostras consecutivas fora do range para alertar |
| `range_min` | 0.6 | Valor mínimo aceitável para estabilidade |
| `range_max` | 0.9 | Valor máximo aceitável para estabilidade |
| `sample_size` | 10 | Número de amostras a manter no histórico |

### Auto-Recalibration Service

| Parâmetro | Valor Padrão | Descrição |
|-----------|--------------|-----------|
| `recalibration_duration` | 30 | Duração da recalibração em segundos |
| `check_interval` | 1 | Intervalo de verificação do gauge em segundos |

## Funcionamento Detalhado

### 1. Detecção de Drift

O Quantum Gauge monitora continuamente a proporção estabilidade/exploração:

```python
stability = 0.75  # Valor nominal
exploration = 0.25  # Valor nominal
ratio = stability / exploration  # 3.0 nominal
```

Quando a estabilidade sai do range `[0.6, 0.9]` por `drift_threshold` amostras consecutivas, um evento de drift é criado com direção "high" ou "low".

### 2. Processo de Recalibração

Quando um drift é detectado, o ARS:

1. Cria um evento de recalibração com timestamp e detalhes do drift
2. Atualiza o estado do Quantum Gauge para `recalibrating`
3. Define o orçamento de exploração para 0.0 (pausa exploração)
4. Notifica o dashboard sobre o início da recalibração
5. Aguarda `recalibration_duration` segundos
6. Restaura o orçamento de exploração para 1.0
7. Avalia o sucesso da recalibração (se a proporção está mais próxima do alvo 3.0)
8. Registra métricas e finaliza o processo

### 3. Métricas de Sucesso

A eficácia da recalibração é medida comparando a proporção antes e depois:

```
success = |post_ratio - 3.0| < |pre_ratio - 3.0|
```

Uma recalibração é considerada bem-sucedida se a nova proporção está mais próxima do alvo 3.0 do que a anterior.

## Integração com o META-ROUTING Framework

O ARS se integra ao META-ROUTING Framework ajustando o "orçamento de exploração" - um parâmetro que controla quanto o sistema pode se dedicar à exploração de novos caminhos vs. seguir rotas estáveis conhecidas.

Durante uma recalibração, o orçamento de exploração é reduzido a zero, fazendo com que o sistema priorize a estabilidade até que o equilíbrio 3:1 seja restaurado.

## Casos de Uso

### Caso 1: Drift de Alta Estabilidade

Quando o sistema fica "preso" em comportamentos estáveis (estabilidade > 90%):
- Ratio > 9.0 (muito acima do alvo 3.0)
- ARS detecta drift "high"
- Recalibração temporária
- Após a recalibração, o sistema permite mais exploração

### Caso 2: Drift de Baixa Estabilidade

Quando o sistema está muito exploratório (estabilidade < 60%):
- Ratio < 1.5 (muito abaixo do alvo 3.0)
- ARS detecta drift "low"
- Recalibração para aumentar estabilidade
- Após a recalibração, o sistema limita temporariamente a exploração

## Testes e Verificação

O ARS inclui testes unitários abrangentes:

- **TestQuantumGauge**: Verifica a detecção correta de desvios e estados
- **TestAutoRecalibrationService**: Testa o ciclo completo de recalibração
- **TestRecalibrationEvent**: Valida métricas de eficácia da recalibração

## Analogia ao Buffer Overflow Cognitivo

O ARS funciona de forma similar ao protocolo de recalibração humano descrito para casos de "buffer overflow cognitivo":

1. **Detecção**: Identificar quando o sistema está fora de seu estado de equilíbrio ótimo
2. **Pausa**: Reduzir temporariamente atividades de exploração intensiva
3. **Respiração**: Período de processamento lento para estabilização
4. **Reorientação**: Verificação dos fundamentos do sistema
5. **Recalibração**: Restauração gradual do equilíbrio 3:1

Esta analogia biológica-computacional demonstra como o ARS mantém o META-ROUTING Framework em estado de equilíbrio dinâmico, evitando tanto a estagnação excessiva quanto a instabilidade exploratória.

## Instalação e Uso

O ARS é iniciado automaticamente com o sistema WiltonOS:

```bash
# Iniciar todo o sistema incluindo ARS
python wilton_core/start_all.py

# Verificar logs do ARS
grep "ARS" logs/system.log

# Verificar métricas Prometheus
curl http://localhost:9090/metrics | grep recalibration
```

## Próximos Aprimoramentos

- Implementação de algoritmos adaptativos para duração de recalibração
- Histórico persistente de eventos de recalibração para análise de longo prazo
- Previsão preditiva de desvios antes que atinjam o threshold crítico