# Configuração do WiltonOS com Docker Compose

Este documento fornece instruções detalhadas para configurar o WiltonOS usando Docker Compose em um ambiente local. Esta configuração permite que você execute todos os componentes do sistema em contêineres isolados, facilitando a implantação e a manutenção.

## Requisitos de Sistema

- Docker Engine 20.10+
- Docker Compose v2+
- Mínimo 4GB de RAM
- Para aceleração GPU: NVIDIA GPU + Driver NVIDIA 450+ com CUDA 11+

## Estrutura do Repositório

```
wiltonos/
├── docker-compose.yml     # Configuração principal do Docker
├── nginx/
│   └── nginx.conf         # Configuração do servidor web
├── server/                # Código-fonte da API (FastAPI)
├── wilton_core/           # Núcleo WiltonOS (Python)
├── public/                # Arquivos estáticos e UI Coringa
├── infra/
│   └── metrics/           # Configurações Prometheus/Grafana
└── state/                 # Dados persistentes
```

## Instalação Rápida (3 passos)

### 1. Configuração Inicial

Clone o repositório e prepare o ambiente:

```bash
git clone <seu-repositorio> ~/wiltonos
cd ~/wiltonos
cp .env.example .env  # Copie e edite conforme necessário
```

Execute o script de configuração para instalar dependências:

```bash
chmod +x scripts/setup-node-a.sh
./scripts/setup-node-a.sh
```

### 2. Copiar Dados de Estado (se disponíveis)

Se você já possui dados de estado do Replit, transfira-os para o servidor local:

```bash
# No Replit:
./scripts/export-state.sh

# No servidor local, após transferir o arquivo:
unzip wiltonos_state.zip -d ./
```

### 3. Iniciar os Serviços

Construa e inicie todos os serviços:

```bash
docker compose up --build -d
```

## Acessando os Serviços

Após a inicialização, você pode acessar:

- **Interface Coringa**: http://localhost/coringa
- **Documentação da API**: http://localhost:5000/docs
- **Grafana**: http://localhost:3000 (login: admin/admin)
- **Prometheus**: http://localhost:9090

## Serviços Incluídos

Este Docker Compose inclui os seguintes serviços:

1. **api**: Serviço principal da API (Python FastAPI)
2. **rqcc_listener**: Captura eventos e calcula métricas quânticas
3. **prometheus**: Coleta e armazena métricas
4. **grafana**: Visualização de dashboards para métricas
5. **nginx**: Servidor web para UI e proxy reverso
6. *(Opcional)* **kafka & zookeeper**: Barramento de mensagens

## Solução de Problemas

### Logs dos Contêineres

Para verificar logs de um serviço específico:

```bash
docker compose logs -f api
```

### Problemas Comuns

1. **GPU não detectada**: Verifique se o runtime NVIDIA está instalado corretamente:
   ```bash
   sudo docker run --rm --gpus all nvidia/cuda:11.0-base nvidia-smi
   ```

2. **Problemas de permissão com volumes**: Verifique as permissões dos diretórios:
   ```bash
   sudo chown -R $USER:$USER state/ infra/
   ```

3. **Erro de porta ocupada**: Verifique se as portas 80, 5000, 9090 e 3000 estão livres:
   ```bash
   sudo netstat -tulpn | grep -E '80|5000|9090|3000'
   ```

## Backup Automático

Para configurar backup automático da pasta `/state` para o Node-B:

```bash
# Instalar borgbackup
sudo apt install borgbackup

# Inicializar repositório borg no Node-B
borg init --encryption=repokey /mnt/raid/borg/wiltonos

# Adicionar ao crontab para backup diário às 3h
echo "0 3 * * * cd /caminho/para/wiltonos && borg create --stats /mnt/raid/borg/wiltonos::$(date +\%Y\%m\%d) state/" | crontab -
```

## Monitoramento

O WiltonOS vem com monitoramento integrado via Prometheus e Grafana:

- **Métricas padrão**: Uso de CPU, memória e rede
- **Métricas customizadas**: Φ (PHI), dΦ/dt, estado do RQCC, etc.

Importe o dashboard padrão no Grafana a partir de `infra/metrics/grafana/dash.json`.

---

## Próximos Passos Sugeridos

Após a instalação bem-sucedida:

1. **Configurar modelo LLM local**: Adicione pesos de modelo (Llama 4, o3) em `/models/`
2. **Habilitar HTTPS**: Configure Caddy ou Certbot para TLS
3. **Configurar descoberta LAN**: Use Avahi para mDNS
4. **Adicionar usuários**: Configure autenticação para acesso multi-usuário