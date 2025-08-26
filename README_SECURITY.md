# WiltonOS - Guia de Segurança

## Visão Geral

Este documento descreve as práticas de segurança implementadas no WiltonOS, com foco especial no gerenciamento seguro de segredos e na manutenção da proporção quântica 3:1 (75% coerência, 25% exploração).

## Conteúdo

1. [Gerenciamento de Segredos](#gerenciamento-de-segredos)
2. [Rate Limiting](#rate-limiting)
3. [Middleware de Segurança](#middleware-de-segurança)
4. [Melhores Práticas](#melhores-práticas)
5. [Configuração](#configuração)

## Gerenciamento de Segredos

O WiltonOS implementa um sistema de Cofre de Segredos (Secrets Vault) que gerencia o armazenamento seguro, acesso e rotação de chaves API e outros segredos.

### Cofre de Segredos (Secrets Vault)

O Cofre de Segredos é responsável por:

- Armazenar segredos criptografados em um arquivo seguro
- Carregar segredos para variáveis de ambiente quando necessário
- Gerenciar rotações de chaves com histórico de versões
- Validar a presença de segredos obrigatórios
- Monitorar a saúde dos serviços dependentes de segredos

### Uso no Python

```python
# Carregando o módulo de ambiente
from wilton_core.security.env_loader import get_env, require_env, is_service_available

# Obtendo um segredo (retorna None se não existir)
api_key = get_env("OPENAI_API_KEY")

# Obtendo um segredo obrigatório (lança exceção se não existir)
api_key = require_env("OPENAI_API_KEY")

# Verificando se um serviço está disponível
if is_service_available("ai_agent"):
    # Usar serviços de IA
    pass
```

### Uso no Node.js

```javascript
// Carregando o módulo de ambiente
const { getSecret, loadSecrets, getServiceStatus } = require('./server/security/env_loader');

// Carregando todos os segredos
await loadSecrets();

// Obtendo um segredo
const apiKey = await getSecret('OPENAI_API_KEY', 'valor_padrao_opcional');

// Verificando status dos serviços
const serviceStatus = await getServiceStatus();
if (serviceStatus.ai_agent && serviceStatus.ai_agent.status !== 'unavailable') {
    // Usar serviços de IA
}
```

### CLI de Gerenciamento de Segredos

O WiltonOS inclui uma CLI para gerenciar segredos:

```bash
# Listar todos os segredos (sem valores)
python wilton_core/security/manage_secrets.py list

# Definir um segredo
python wilton_core/security/manage_secrets.py set OPENAI_API_KEY

# Obter um segredo
python wilton_core/security/manage_secrets.py get OPENAI_API_KEY

# Remover um segredo
python wilton_core/security/manage_secrets.py delete OPENAI_API_KEY

# Validar segredos obrigatórios
python wilton_core/security/manage_secrets.py validate

# Importar segredos do ambiente
python wilton_core/security/manage_secrets.py import-env

# Verificar status dos serviços
python wilton_core/security/manage_secrets.py status

# Inicializar o cofre
python wilton_core/security/manage_secrets.py init
```

## Rate Limiting

O WiltonOS implementa um sistema de limitação de taxa (rate limiting) para proteger os endpoints da API contra abusos, mantendo a proporção quântica 3:1 (75% coerência, 25% exploração).

### Configuração de Rate Limit

Os limites são configurados com base na proporção quântica:

- **Endpoints de Coerência**: Taxa mais alta (75% da capacidade)
- **Endpoints de Exploração**: Taxa mais baixa (25% da capacidade)

Configurações de exemplo:

```
RATE_LIMIT_DEFAULT=30/minute  # Taxa limite padrão
RATE_LIMIT_CHAT=15/minute     # Taxa limite para chat (maior exploração)
```

## Middleware de Segurança

O WiltonOS implementa diversos middlewares de segurança:

- **Headers de Segurança**: HSTS, X-Frame-Options, Content-Type-Options, etc.
- **CORS**: Configurado para permitir apenas origens confiáveis
- **Rate Limiting**: Proteção contra abusos
- **Validação de Entradas**: Validação e sanitização de todas as entradas

## Melhores Práticas

### Nunca comitar segredos

- **Nunca** comite o arquivo `.env` com valores reais
- Use `.env.example` como modelo, sem valores reais
- Coloque `.env` no `.gitignore`

### Rotação de chaves

- Rotacione chaves API regularmente (90 dias por padrão)
- O sistema marcará chaves que precisam de rotação

### Validação de integridade

- Execute validações regulares: `python wilton_core/security/manage_secrets.py validate`
- Monitore o status dos serviços: `python wilton_core/security/manage_secrets.py status`

## Configuração

### Variáveis de Ambiente

| Variável | Descrição | Obrigatória | Padrão |
|----------|-----------|-------------|--------|
| WILTONOS_MASTER_KEY | Chave mestra para o cofre de segredos | Não | (dev key em desenvolvimento) |
| ENVIRONMENT | Ambiente (development, staging, production) | Não | development |
| OPTIMAL_COHERENCE_RATIO | Proporção de coerência (3:1) | Não | 0.75 |
| OPTIMAL_EXPLORATION_RATIO | Proporção de exploração (3:1) | Não | 0.25 |
| RATE_LIMIT_DEFAULT | Taxa limite padrão | Não | 30/minute |
| RATE_LIMIT_CHAT | Taxa limite para chat | Não | 15/minute |
| PORT | Porta do servidor Node.js | Não | 5000 |
| PYTHON_API_PORT | Porta da API Python | Não | 8765 |
| PROMETHEUS_PORT | Porta do Prometheus | Não | 9090 |

### Segredos Gerenciados

| Segredo | Descrição | Obrigatório | Serviços |
|---------|-----------|-------------|----------|
| OPENAI_API_KEY | Chave da API OpenAI | Sim | ai_agent, fractal_art_generator |
| PINECONE_API_KEY | Chave da API Pinecone | Não | vector_storage, semantic_search |
| PINECONE_ENVIRONMENT | Ambiente Pinecone | Não | vector_storage |
| TWITTER_API_KEY | Chave da API Twitter | Não | social_integration |
| TWITTER_API_SECRET | Segredo da API Twitter | Não | social_integration |
| TWITTER_ACCESS_TOKEN | Token de acesso Twitter | Não | social_integration |
| TWITTER_ACCESS_SECRET | Segredo de acesso Twitter | Não | social_integration |
| YOUTUBE_API_KEY | Chave da API YouTube | Não | video_integration |