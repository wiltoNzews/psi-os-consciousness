# WiltonOS - Sistema de Balanceamento Quântico 3:1

O sistema de Balanceamento Quântico 3:1 (75% coerência, 25% exploração) é uma implementação que mantém a estabilidade e adaptabilidade do WiltonOS, garantindo um equilíbrio ótimo entre modos de operação.

## Visão Geral

O balanceamento quântico 3:1 implementa uma proporção de 75% coerência (phi) e 25% para fatores de exploração (latência e custo), mantendo o sistema em seu ponto ótimo de operação. Este balanceamento é mantido através de:

1. **Model Selector** - Sistema de seleção de modelos LLM baseado em phi score, latência e custo
2. **Router Inteligente** - Direciona requisições para os modelos apropriados com base em características da tarefa
3. **Sistema de Tiers** - Estratificação dos modelos em camadas com características específicas
4. **Verificador de Coerência** - Daemon que ajusta os pesos automaticamente quando o phi cai abaixo do limiar

## Componentes Principais

### Model Selector (`wilton_core/llm_stack/model_selector.py`)

Implementa a fórmula de balanceamento:

```
score =  φ_weight * phi_score
       + rt_weight * (1 / latency_ms)
       + $  _weight * (1 / cost_usd_per_1k)
```

onde `φ_weight : rt_weight : $_weight = 3 : 1 : 1`

O seletor mantém um histórico de desempenho dos modelos, atualizando regularmente suas métricas, especialmente o phi_score, para garantir que as futuras seleções levem em conta as experiências passadas.

### LLM Router (`wilton_core/llm_stack/router.py`) 

O Router analisa cada solicitação para determinar suas características (tamanho, intenção, necessidade de ferramentas) e aplica regras de estratégia para selecionar o modelo mais adequado.

Estratégias incluem:
- **Replit Agent (burst)**: Seleciona modelos ultra-rápidos para prompts curtos, graduando para modelos maiores conforme a complexidade
- **Web Client (sessões)**: Prioriza contexto e memória para sessões longas, ajustando a seleção de modelo ao longo de múltiplos turns

### Sistema de Tiers (`wilton_core/config/llm_stack.yaml`)

Define camadas de modelos com diferentes características:

| Tier            | Força                        | Ideal para                                  |
|-----------------|------------------------------|---------------------------------------------|
| **o3**          | Leve, rápido                 | bursts locais ultra-rápidos, snippets      |
| **o4-mini**     | Balanceado                   | chat multi-turn, contexto moderado         |
| **o4-mini-high**| Contexto maior + qualidade   | mergulhos profundos, contextos longos      |
| **o4-pro**      | Máxima fidelidade local      | uso "studio-grade" local                   |
| **frontier**    | APIs de fronteira (OpenAI)   | máxima capacidade sob demanda              |

### Verificador de Coerência (`start_coherence_checker.sh`)

Script daemon que:
1. Monitora o phi global do sistema
2. Quando o phi cai abaixo do limiar (0.60), ajusta os pesos no arquivo de configuração
3. A cada intervalo, verifica se o sistema está mantendo o equilíbrio 3:1 (75% coerência)

## Uso do Sistema

### Inicialização do LLM Service

```bash
./start_llm_service.sh
```

Opções:
- `--verbose`: Ativa logs detalhados
- `--config PATH`: Especifica arquivo de configuração alternativo
- `--daemon`: Executa em segundo plano
- `--test`: Executa testes básicos

### Teste do Model Selector

```bash
./test_model_selector.py
```

Executa testes de validação do Model Selector e Router para garantir que:
1. O balanceamento 3:1 está sendo respeitado
2. O roteamento de requisições está funcionando conforme esperado
3. O sistema reage corretamente a níveis baixos de coerência

### Inicialização do Verificador de Coerência

```bash
./start_coherence_checker.sh --interval 30
```

Opções:
- `--interval N`: Define intervalo de verificação em segundos
- `--target VAL`: Define o phi alvo (padrão: 0.75)
- `--min VAL`: Define o limiar mínimo (padrão: 0.60)
- `--verbose`: Ativa logs detalhados

## Integração com Bridges

O sistema de balanceamento está integrado com as bridges do WiltonOS:

- **Voice Bridge**: Utiliza o Model Selector para escolher o melhor modelo para transcrição e análise
- **File Bridge**: Aplica estratégias específicas para diferentes tipos de documentos

## Monitoramento

O sistema expõe métricas Prometheus para monitoramento em tempo real:

- `llm_selector_decisions_total`: Contador de seleções por modelo
- `llm_selector_last_score`: Última pontuação composta
- `llm_selector_phi_score`: Componente phi da pontuação
- `llm_selector_latency_score`: Componente latência da pontuação
- `llm_selector_cost_score`: Componente custo da pontuação
- `llm_router_global_phi`: Phi global do sistema

Estas métricas podem ser visualizadas no dashboard Grafana.

## Troubleshooting

Se a coerência do sistema estiver baixa (phi < 0.60):

1. Verifique os logs em `llm_service.log` e `coherence_checker.log`
2. Execute `./test_model_selector.py` para validar o comportamento do seletor
3. Ajuste manualmente os pesos em `wilton_core/config/llm_stack.yaml` se necessário
4. Reinicie o LLM Service: `./start_llm_service.sh`