# Configuração Multi-Nó para WiltonOS (Track 2)

Este guia explica como configurar o WiltonOS para funcionar em múltiplos nós, criando um sistema distribuído que aumenta a resiliência e capacidade de processamento.

## Pré-requisitos

- Node-A já configurado e funcionando com o WiltonOS principal
- Node-B com Docker e Docker Compose instalados
- Raspberry Pi (opcional) com Docker instalado
- Acesso root ou sudo em todos os nós
- Conexão de rede entre os nós

## 1. Configuração de Rede Overlay com ZeroTier

O ZeroTier cria uma rede privada virtual que conecta todos os nós de forma segura através da internet.

### 1.1 Configurar ZeroTier

Execute em cada nó (Node-A, Node-B e Raspberry Pi):

```bash
# Dar permissão de execução ao script
chmod +x scripts/setup-zerotier.sh

# Executar o setup
sudo ./scripts/setup-zerotier.sh
```

Siga as instruções do script para:
1. Instalar o ZeroTier
2. Entrar na rede ZeroTier
3. Autorizar os nós no painel admin do ZeroTier (https://my.zerotier.com)
4. Adicionar as entradas no arquivo hosts para cada nó

### 1.2 Verificar a Conectividade

Após configurar o ZeroTier, verifique se todos os nós podem se comunicar:

```bash
# Do Node-A
ping wilton-node-b
ping wilton-pi

# Do Node-B
ping wilton-node-a
ping wilton-pi
```

## 2. Configuração do Node-B (Worker GPU)

O Node-B funcionará como um worker para processamento GPU e backup do Node-A.

### 2.1 Configuração Inicial

```bash
# Clonar o repositório do WiltonOS (se ainda não existir)
git clone https://github.com/seu-usuario/wiltonos.git
cd wiltonos

# Criar diretórios necessários
mkdir -p state models backup sync-logs

# Copiar arquivos de configuração
cp docker-compose.node-b.yml docker-compose.yml
```

### 2.2 Configurar Variáveis de Ambiente

Crie o arquivo `.env` com as configurações necessárias:

```bash
cat > .env << EOF
# Configuração do Node-B para WiltonOS
NODE_A_IP=192.168.1.100      # Substitua pelo IP ZeroTier do Node-A
NODE_A_SSH_USER=wilton       # Usuário SSH para acesso ao Node-A
NODE_ROLE=worker
PHI_TARGET=0.75
GPU_ENABLED=true
INSTANCE_NAME=node-b-main
EOF

# Adicionar as configurações ZeroTier
cat .env.zerotier >> .env
```

### 2.3 Configurar Chaves SSH para Sincronização

```bash
# Gerar chave SSH se não existir
ssh-keygen -t ed25519 -C "wiltonos-node-b"

# Copiar a chave pública para o Node-A
ssh-copy-id wilton@wilton-node-a
```

### 2.4 Iniciar os Serviços no Node-B

```bash
# Tornar os scripts executáveis
chmod +x scripts/*.sh

# Iniciar com Docker Compose
docker-compose up -d
```

### 2.5 Verificar o Status dos Serviços

```bash
# Verificar containers
docker-compose ps

# Verificar logs
docker-compose logs -f
```

## 3. Configuração da Federação Prometheus

A federação Prometheus permite que todos os nós reportem suas métricas para o Prometheus do Node-A.

### 3.1 No Node-A

O Prometheus do Node-A já foi configurado para funcionar como servidor de federação. Para verificar se está funcionando:

```bash
# Verificar status do Prometheus
curl http://localhost:9090/-/healthy

# Verificar se os targets de federação estão ativos
curl http://localhost:9090/api/v1/targets | jq '.data.activeTargets[] | select(.labels.job=="federate-node-b")'
```

### 3.2 No Node-B

Para verificar se o Prometheus do Node-B está enviando métricas ao Node-A:

```bash
# Verificar status do Prometheus local
curl http://localhost:9090/-/healthy

# Verificar configuração de remote_write
curl http://localhost:9090/api/v1/status/config | jq '.data.yaml | fromjson | .remote_write'
```

### 3.3 Testar a Visualização de Métricas Federadas

No Grafana do Node-A (geralmente porta 3000), crie um dashboard que mostre métricas de ambos os nós:

1. Crie um novo painel
2. Use a query PromQL: `phi_value{node=~"node-a|node-b"}`
3. Isso deve mostrar os valores de Phi de ambos os nós

## 4. Configuração de Backup e Sincronização

O backup automático está configurado para ser executado diariamente às 03:00.

### 4.1 Verificar Configuração de Backup

```bash
# Verificar se o cron está rodando
docker-compose exec sync_service crontab -l

# Testar o script de backup manualmente
docker-compose exec sync_service /scripts/backup-node-a.sh
```

### 4.2 Verificar Sincronização de Estado

```bash
# Verificar log de sincronização
docker-compose exec sync_service cat /logs/sync.log

# Verificar arquivos sincronizados
docker-compose exec sync_service ls -la /state
```

## 5. Configuração do Raspberry Pi (Opcional)

O Raspberry Pi pode funcionar como um nó edge leve para automação residencial.

### 5.1 Instalar Docker no Raspberry Pi

```bash
# Instalar Docker
curl -sSL https://get.docker.com | sh

# Adicionar usuário ao grupo docker
sudo usermod -aG docker $USER

# Reiniciar para aplicar alterações
sudo reboot
```

### 5.2 Configurar o Pi para WiltonOS

```bash
# Clonar o repositório
git clone https://github.com/seu-usuario/wiltonos.git
cd wiltonos

# Criar diretórios necessários
mkdir -p state logs config

# Configurar variáveis de ambiente
cat > .env << EOF
NODE_A_IP=192.168.1.100  # Substitua pelo IP ZeroTier do Node-A
PI_LOCATION=living-room
HOME_ASSISTANT_URL=http://homeassistant.local:8123
EOF

# Perguntar pelo token Home Assistant
echo "Insira o token de longo prazo do Home Assistant:"
read HOME_ASSISTANT_TOKEN
echo "HOME_ASSISTANT_TOKEN=$HOME_ASSISTANT_TOKEN" >> .env

# Copiar arquivo Docker Compose
cp docker-compose.pi-lite.yml docker-compose.yml
```

### 5.3 Configurar ZeroTier no Pi

Execute o script de configuração do ZeroTier como nas etapas anteriores.

### 5.4 Iniciar os Serviços no Pi

```bash
docker-compose up -d
```

### 5.5 Verificar Funcionamento do Pi

```bash
# Testar servidor webhook
curl http://localhost:3000/health

# Verificar logs
docker-compose logs -f webhook-server
```

## 6. Verificação Final

Para verificar se todo o sistema distribuído está funcionando:

```bash
# No Node-A
curl -s http://localhost:5000/api/coringa/phi | jq

# No Node-B
curl -s http://localhost:9090/api/v1/query?query=phi_value | jq

# No Raspberry Pi
curl -s http://localhost:3000/health | jq
```

## Solução de Problemas

### Problemas de Conectividade ZeroTier

```bash
# Verificar status do ZeroTier
sudo zerotier-cli status
sudo zerotier-cli listnetworks

# Reiniciar o serviço
sudo systemctl restart zerotier-one
```

### Problemas de Sincronização

```bash
# Verificar permissões SSH
ls -la ~/.ssh/
ssh -v wilton@wilton-node-a

# Executar sincronização manual
./scripts/sync-from-node-a.sh
```

### Problemas com Containers Docker

```bash
# Reiniciar os containers
docker-compose down
docker-compose up -d

# Verificar logs
docker-compose logs -f
```