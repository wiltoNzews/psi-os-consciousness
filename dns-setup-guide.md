# Configuração do DNS para passiveworks.ai

Este guia te ajudará a configurar seu domínio passiveworks.ai para apontar para este Replit, mantendo suas configurações de email funcionando corretamente.

## Passo 1: Remover o apontamento atual do WebsiteBuilder

Na página de gerenciamento de DNS do seu provedor (GoDaddy):

1. Localize a entrada do tipo **A** com nome **@** que aponta para "WebsiteBuilder Site"
2. Clique no ícone de lixeira (🗑️) para remover esta entrada

## Passo 2: Adicionar novo apontamento para o Replit

Adicione as seguintes entradas:

### Opção 1: Usando domínio Replit (mais fácil)

| Tipo  | Nome | Valor                  |
|-------|------|------------------------|
| CNAME | @    | yourrepl.repl.co       |

### Opção 2: Usando endereço IP (atualização mais rápida)

| Tipo | Nome | Valor                  |
|------|------|------------------------|
| A    | @    | (Endereço IP do Replit)|

## Passo 3: Adicionar verificação para Twitter Blue (opcional)

Para verificar seu domínio no Twitter Blue, adicione uma das seguintes entradas:

| Tipo | Nome                | Valor                 |
|------|---------------------|----------------------|
| TXT  | @                   | twitter-verification=XXXXXXXXXX |

Ou você pode usar a meta tag que já adicionamos no código HTML.

## Passo 4: Preservar configurações de email

**NÃO MODIFIQUE** as seguintes entradas relacionadas ao email:

- Todos os registros CNAME que apontam para `email.secureserver.net`
- Entradas DKIM com prefixos `s1.dkim` e `s2.dkim`

Isso garantirá que seu email `wilton@passiveworks.ai` continue funcionando corretamente.

## Informações adicionais

O Replit onde este site está hospedado (URL): https://replit.com/@SEUNOME/passiveworks-ai

Quando o domínio estiver configurado, você poderá acessar:

- Site principal: https://passiveworks.ai
- API do WiltonOS: https://passiveworks.ai/api
- WebSocket para WiltonOS: wss://passiveworks.ai/ws

## Verificação da configuração

Após fazer as modificações no DNS, pode levar de 5 minutos a 48 horas para as alterações se propagarem pela internet. Você pode verificar o status acessando:

- https://dnschecker.org/

E inserindo seu domínio para verificar se os registros estão atualizados.