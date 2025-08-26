# WiltonOS - Autenticação JWT

## Visão Geral

Este módulo implementa autenticação baseada em JSON Web Tokens (JWT) para proteger o acesso às interfaces WebSocket do WiltonOS, garantindo que apenas usuários autorizados possam controlar o sistema e acessar dados sensíveis.

## Componentes Principais

1. **JWTManager**: Gerenciador central para criação, verificação e renovação de tokens JWT
2. **Autenticação em WebSocket**: Integração com a interface WebSocket para proteger rotas e operações
3. **Sistema de Papéis e Permissões**: Controle granular de acesso baseado em papéis de usuário 
4. **Cliente Autenticado**: Cliente de exemplo que demonstra o fluxo de autenticação completo

## Uso Básico

### Autenticação na Interface WebSocket

A interface WebSocket agora exige autenticação para todas as operações, exceto o próprio processo de autenticação. Clientes devem primeiro autenticar usando credenciais de usuário ou um token válido.

```python
# No cliente
await websocket.send(json.dumps({
    "type": "authenticate",
    "username": "admin",
    "password": "wilton"
}))

# Ou usando token existente
await websocket.send(json.dumps({
    "type": "authenticate",
    "token": "eyJhbGciOiJIUzI1N..."
}))
```

Após autenticação bem-sucedida, o servidor responde com um token que pode ser usado em futuras sessões:

```json
{
  "type": "auth_response",
  "success": true,
  "user_id": "admin",
  "token": "eyJhbGciOiJIUzI1N...",
  "user_info": {
    "role": "admin",
    "name": "Administrador",
    "permissions": ["read:status", "read:phi", "write:tasks", "write:rebalance", "write:shutdown"]
  }
}
```

### Papéis e Permissões

O sistema suporta os seguintes papéis:

| Papel | Descrição | Permissões |
|-------|-----------|------------|
| `admin` | Acesso completo ao sistema | Todas as operações |
| `viewer` | Acesso somente leitura | Apenas operações de leitura |

Permissões específicas:
- `read:status`: Ver status do sistema
- `read:phi`: Acessar métricas de phi
- `write:tasks`: Agendar tarefas
- `write:rebalance`: Forçar rebalanceamento
- `write:shutdown`: Desligar o sistema

### Usuários Padrão

Para fins de demonstração, o sistema inclui dois usuários padrão:

1. **admin**
   - Username: `admin`
   - Senha: `wilton`
   - Papel: `admin` (acesso completo)

2. **monitor**
   - Username: `monitor`
   - Senha: `viz123`
   - Papel: `viewer` (somente leitura)

**Nota**: Em ambiente de produção, substitua estes usuários por um sistema de autenticação real.

## Exemplo de Cliente Autenticado

Um cliente de exemplo está disponível em `example_auth_client.py`. Este script demonstra:

1. Conexão com o servidor WebSocket
2. Autenticação com credenciais
3. Uso do token recebido para autenticação em sessões futuras
4. Execução de operações protegidas
5. Exemplo de usuário com permissões limitadas

Para executar:

```bash
python example_auth_client.py
```

## Segurança e Configuração

Os tokens JWT são assinados com uma chave secreta, que pode ser configurada através da variável de ambiente `JWT_SECRET_KEY`. Se não for fornecida, uma chave aleatória será gerada na inicialização.

Para produção, recomenda-se definir manualmente a chave:

```
export JWT_SECRET_KEY="sua-chave-secreta-muito-longa-e-aleatoria"
```

Os tokens expiram após 24 horas por padrão. Este período pode ser alterado em `wilton_core/auth/auth_config.py`.