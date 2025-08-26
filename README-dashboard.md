# WiltonOS Dashboard

Este documento descreve como configurar e utilizar o dashboard de monitoramento do WiltonOS.

## Visão Geral

O dashboard WiltonOS fornece monitoramento em tempo real do sistema, incluindo:
- Valor atual e histórico de phi (coerência quântica)
- Número de tarefas em execução e na fila
- Eventos de rebalanceamento
- Atividade das bridges (clipboard e email)
- Utilização de recursos (CPU, GPU, memória)

O sistema utiliza Prometheus para coletar métricas e Grafana para visualização.

## Pré-requisitos

- Docker e docker-compose instalados
- Python 3.6+ para execução local do exportador de métricas

## Instalação

1. Instale as dependências necessárias:

```bash
chmod +x scripts/install_dashboard_dependencies.sh
./scripts/install_dashboard_dependencies.sh
```

2. Inicie o stack Prometheus/Grafana:

```bash
docker-compose up -d
```

3. Acesse o Grafana em: http://localhost:3000
   - Usuário: admin
   - Senha: wilton

## Configuração Manual (opcional)

Se precisar configurar manualmente:

1. O Prometheus está configurado para coletar métricas em `http://wiltonos-metrics:8000/metrics`
2. O Grafana está configurado com o Prometheus como fonte de dados
3. O dashboard `WiltonOS Dashboard` já está importado e disponível

## Exportador de Métricas

O exportador de métricas é responsável por coletar dados do WiltonOS e expô-los para o Prometheus.

Para executar manualmente o exportador:

```bash
python -m wilton_core.observability.hpc_metrics_exporter
```

## Métricas Disponíveis

- **wilton_phi_ratio**: Valor atual de phi (coerência quântica)
- **wilton_target_phi_ratio**: Valor alvo de phi (normalmente 0.75 para ratio 3:1)
- **wilton_phi_delta**: Taxa de mudança de phi (dphi/dt)
- **wilton_tasks_scheduled_total**: Número total de tarefas agendadas
- **wilton_tasks_completed_total**: Número total de tarefas concluídas
- **wilton_tasks_failed_total**: Número total de tarefas com falha
- **wilton_tasks_queued**: Número de tarefas na fila
- **wilton_tasks_running**: Número de tarefas em execução
- **wilton_rebalance_total**: Número total de eventos de rebalanceamento
- **wilton_clipboard_events_total**: Número total de eventos de clipboard
- **wilton_email_events_total**: Número total de eventos de email

## Painel do Grafana

O dashboard inclui os seguintes painéis:

1. **Phi Ratio**: Medidor mostrando o valor atual de phi
2. **Phi History**: Gráfico do histórico de phi comparado com o valor alvo
3. **Tasks Queue**: Gráfico de tarefas na fila e em execução
4. **Rebalance Events**: Taxa de eventos de rebalanceamento por minuto
5. **Tasks in Queue**: Contador de tarefas pendentes
6. **Bridge Events**: Taxa de eventos de clipboard e email por minuto

## Resolução de Problemas

Se encontrar problemas:

1. Verifique se o exportador de métricas está em execução:
   ```bash
   curl http://localhost:8000/metrics
   ```

2. Verifique se o Prometheus está coletando os dados:
   ```bash
   curl http://localhost:9090/api/v1/query?query=up
   ```

3. Reinicie o serviço se necessário:
   ```bash
   docker-compose restart prometheus
   ```

## Monitoramento do Quantum Balance Ratio (3:1)

O sistema é configurado para manter um ratio de 3:1 entre coerência e exploração (75% coerência, 25% exploração). 
O dashboard mostra claramente quando o sistema está dentro desse target através do medidor Phi Ratio e do gráfico 
de histórico, onde a linha alvo está em 0.75.