# WiltonOS - Controles de Desenvolvimento

Este documento descreve o fluxo de trabalho simplificado para o desenvolvimento e manutenção do WiltonOS, seguindo o princípio de equilíbrio quântico 3:1 (75% coerência, 25% exploração).

## Ferramentas de Controle

### 1. Script de Controle: `wt`

Este é o script principal para controlar o ambiente de desenvolvimento. Use-o com `source` para que as variáveis de ambiente sejam definidas corretamente.

```bash
# Ativar modo CALMA (sem loops automáticos)
source wt calm

# Ativar modo EXPLORAÇÃO (loops automáticos ativos)
source wt play

# Verificar status do sistema
source wt status

# Verificar e gerenciar sincronização RQCC
source wt sync
source wt sync update sample_config.json

# Abrir arquivo de tarefas
source wt bridge

# Abrir notas internas
source wt inner
```

### 2. Saúde do Sistema

Você pode verificar a saúde do sistema a qualquer momento com:

```bash
./scripts/wiltonctl health ping
```

Ou em formato JSON:

```bash
./scripts/wiltonctl health ping --json
```

### 3. Interruptores Principais

| Interruptor | Comando | O que muda |
|-------------|---------|------------|
| **Pausa edições em segundo plano** | `export LOOP_ENABLED=0` | O loop noturno fica inativo até ser reativado. |
| **Um modelo, sem surpresas** | `export MODEL_NAME=o3-local && export ROUTER_STRICT=1` | Sem fallback silencioso, sem picos de latência. |
| **Desativar correções automáticas** | `export AUTOFIX=0` | Interrompe os commits "editados..." infinitos. |
| **Snapshots manuais** | *(UI)* Engrenagem ⚙ → *Autosave* → **Manual** | Elimina spam de "Reiniciado/Tirou screenshot" |

## Fluxo de Trabalho em Três Camadas

O fluxo de trabalho é organizado em três camadas distintas:

1. **Inner Loop** - Pensamentos/Sentimentos/Notas RQCC
   * Local: `docs/rqcc/inner.md`
   * Conteúdo: Reflexões pessoais, anotações sobre equilíbrio quântico, ideias para futuras implementações

2. **Bridge** - Especificações em linguagem natural
   * Local: `bridge/next.todo`
   * Conteúdo: Requisitos escritos em linguagem natural para serem implementados
   
3. **Coder** - Implementação técnica
   * Local: Base de código
   * Conteúdo: Implementação feita pelo desenvolvedor com base no Bridge

## Equilíbrio Quântico

O equilíbrio quântico alvo é de 3:1 (75% coerência, 25% exploração). Este equilíbrio está configurado em:

- `wilton_core/registry/model_registry.yaml`: Configuração dos modelos LLM e fatores de coerência
- `~/.wiltonos/rqcc_sync.json`: Configuração de módulos prioritários e seus fatores de coerência

Para gerenciar o equilíbrio quântico, use os comandos:

```bash
# Verificar status atual da sincronização RQCC
./scripts/wiltonctl sync

# Sincronizar a partir de um arquivo de configuração JSON
./scripts/wiltonctl sync --mode rqcc --file minha_config.json
```

Veja mais detalhes na documentação: [RQCC_SYNC_DOCUMENTATION.md](RQCC_SYNC_DOCUMENTATION.md)

## Loops de Vida

Quatro principais loops de vida foram identificados para serem abordados:

1. **Loop Juliana**: 
   * Meta: Carta final não enviada em `inner/closure_juliana.md`

2. **Loop Mãe**: 
   * Meta: Bloco de calendário "Horas tranquilas - respeitado 7 dias seguidos"

3. **Loop Ricardo**: 
   * Meta: Quadro Trello compartilhado com coluna de roadmap *única* acordada

4. **Loop Legado**: 
   * Meta: Carta de Intenções (LOI) assinada (aceitação **ou** recusa) escaneada em `/docs/contracts/`

## Sanity Beacon: O Health Ping

Execute o comando abaixo para verificar rapidamente o estado do sistema:

```bash
./scripts/wiltonctl health ping --json
```

Se exibir:
```json
{"llms": "ok", "ws": "ok", "q_ratio": 0.75}
```

...então a máquina está bem e qualquer estranheza que você sinta é *humana*, não código.