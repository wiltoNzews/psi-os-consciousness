# WiltonOS Longevity API

O módulo Longevity API do WiltonOS fornece uma interface para gerenciar dosagens de compostos de longevidade e protocolos de saúde, com integração ao sistema RQCC para análise de impacto quântico.

## Visão Geral

A Longevity API permite:

1. Registrar dosagens de compostos de longevidade (resveratrol, NMN, etc.)
2. Gerenciar protocolos de longevidade
3. Calcular efeitos projetados em marcadores biológicos
4. Analisar o impacto quântico na saúde através do sistema RQCC

O sistema segue a abordagem "Soft-Steer" para manter um equilíbrio quântico suave, focando em derivadas suaves de Φ em vez de apenas valores absolutos, evitando correções bruscas.

## Uso Rápido

### Iniciar o servidor

```bash
./start-longevity-api.sh
```

Ou através do wiltonctl-dev:

```bash
./wiltonctl-dev.sh longevity server
```

### Registrar uma dosagem

```bash
./wiltonctl-longevity.sh dose resveratrol 500
```

Ou usando curl:

```bash
curl -X POST http://localhost:8765/longevity/dose -H "Content-Type: application/json" -d '{"compound":"resveratrol","mg":500,"notes":"Tomado com o café da manhã"}'
```

### Listar dosagens recentes

```bash
./wiltonctl-longevity.sh list
```

## Integração com RQCC

O sistema Longevity API está integrado ao módulo RQCC para monitorar como as dosagens afetam o equilíbrio quântico (proporção coerência/exploração). Isso permite:

1. Ver como cada composto afeta os loops de saúde
2. Prever efeitos de dosagens na estabilidade do sistema
3. Ajustar protocolos para manter um equilíbrio saudável (Φ ≈ 0.75)

## Arquitetura

- **API FastAPI**: Endpoints REST para gerenciar dosagens e protocolos
- **Banco de dados SQLite**: Armazenamento persistente de dados
- **Calculadora de efeitos**: Modelos preditivos para efeitos em marcadores biológicos
- **Integração RQCC**: Análise de impacto quântico na saúde

## Efeitos Previstos

O sistema calcula os efeitos projetados de cada dosagem em:

- Impacto nos telômeros
- Metilação do DNA
- Marcadores de inflamação
- Níveis de energia
- Função cognitiva

## Abordagem "Soft-Steer"

Seguindo o princípio:

```
Sustained‑Good  :=  max_{t→∞}  ( Φ(t)  subject to  dΦ/dt  being smooth )
```

A abordagem prioriza manter as derivadas de Φ pequenas, evitando saltos bruscos. Isso é implementado através:

1. Monitoramento contínuo do impacto de dosagens em tempo real
2. Ajustes suaves nos parâmetros RQCC
3. Recomendações baseadas em padrões históricos

## Comandos Disponíveis

```
wiltonctl longevity dose <composto> <quantidade> [--unit <unidade>] [--notes <notas>]
wiltonctl longevity list [--limit <número>]
wiltonctl longevity get <id-dosagem>
wiltonctl longevity info
```

## Próximos Passos

- Integração com o sistema Metrics (Prometheus/Grafana)
- Adição de Narrative-Hooks para correlacionar entradas e oscilações de Φ
- Dashboard visual em React/Next.js