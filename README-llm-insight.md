# WiltonOS - LLM Insight & Quantum Balance Stack

## Visão Geral
Esta é a implementação do stack LLM para o WiltonOS, mantendo o equilíbrio quântico 3:1 entre coerência e exploração através da seleção inteligente de modelos e monitoramento em tempo real de métricas phi.

## Componentes Principais

### 1. LLM Router Inteligente
- Implementado em `wilton_core/llm_router.py`
- Seleciona modelos usando o algoritmo 3:1 (75% local, 25% API)
- Suporta múltiplos tiers: selfhost, edge, frontier
- Integração completa com métricas Prometheus

### 2. Model Selector com Balanceamento Phi
- Implementado em `wilton_core/llm_stack/model_selector.py`
- Pondera phi_score, latência e custo para decisões de roteamento
- Permite ajuste dinâmico de phi para alterar o equilíbrio coerência/exploração

### 3. Métricas Prometheus
- Implementado em `wilton_core/llm_stack/prometheus_metrics.py`
- Exportador na porta 8000 para coleta de métricas
- Rastreia solicitações, latência, tokens e custos por modelo/tier
- Métricas phi em tempo real para dashboard Grafana

### 4. Daemon de Coerência
- Implementado em `wilton_core/daemons/coherence_daemon.py`
- Mantém automaticamente o sistema no valor phi alvo (padrão 0.75)
- Autenticação JWT para operações seguras
- Reequilibra o sistema quando phi se desvia do alvo

### 5. LLM Insight Hook
- Implementado em `wilton_core/llm_stack/insight_hook.py`
- Análises periódicas de métricas phi e padrões de uso
- Utiliza GPT-4/Gemini para otimização inteligente
- Geração de relatórios de insights para melhoria contínua

## Scripts de Inicialização

| Script | Descrição |
|--------|-----------|
| `start_dashboard.sh` | Inicia servidor Prometheus e Grafana para monitoramento |
| `start_metrics_exporter.sh` | Inicia exportador de métricas na porta 8000 |
| `start_coherence_daemon.sh` | Inicia daemon para manter equilíbrio phi |
| `start_llm_insight.sh` | Inicia hook para análises periódicas |

## Ordem de Inicialização
1. `start_dashboard.sh` (Prometheus + Grafana)
2. `ollama serve` (para modelos locais)
3. `start_metrics_exporter.sh` (exportador de métricas)
4. `start_coherence_daemon.sh --interval 5` (auto-balanceamento)
5. `start_llm_insight.sh` (análises periódicas)

## Etapas para Testar o Sistema
```bash
# Etapas de configuração
git pull && ./scripts/install_dashboard_dependencies.sh
export OPENAI_API_KEY=... # configurar chaves API
export GEMINI_KEY=...     # (opcional) para análises alternativas

# Iniciar componentes
./start_dashboard.sh
./start_metrics_exporter.sh &
./start_coherence_daemon.sh --interval 5 &

# Testar o sistema
wiltonctl hpc schedule-task --file examples/llm_demo.json

# Executar análise de insights (opcional)
./start_llm_insight.sh
```

## Parâmetros Importantes

### Daemon de Coerência
```
--interval SEGUNDOS   # Intervalo de verificação (padrão: 10s)
--username USUARIO    # Usuário para autenticação (padrão: admin)
--password SENHA      # Senha para autenticação (padrão: wilton)
--phi-target VALOR    # Valor alvo de phi (padrão: 0.75)
```

### LLM Insight Hook
```
--interval SEGUNDOS   # Intervalo entre análises (padrão: 3600s)
--model openai|gemini # Modelo para análise (padrão: openai)
--max-tasks N         # Número máximo de tarefas analisadas
--history HORAS       # Horas de histórico phi (padrão: 24)
```

## Dashboard Grafana
- URL: http://localhost:3000
- Credenciais: admin / wilton
- Dashboard principal: "WiltonOS Quantum Balance"
- Métricas em destaque:
  - Valor phi atual e histórico
  - Distribuição de tokens por tier (75/25%)
  - Latência média por modelo
  - Custos (API Tokens) para modelos frontier

## Próximas Etapas
1. **JWT auth hardening** - rotação mais rápida de tokens e OAuth
2. **Voice bridge** - Integração com Whisper para transcrições ao vivo
3. **Browser bridge** - Agente Playwright para coleta automática de documentos

Para mais detalhes, consulte a documentação específica de cada componente.