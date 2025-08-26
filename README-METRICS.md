# WiltonOS Metrics Stack

O sistema de métricas do WiltonOS fornece monitoramento em tempo real da proporção quântica (Φ) e integra dashboards visuais para manutenção do equilíbrio de 0.75 ± 0.02, seguindo a abordagem "Soft-Steer".

## Visão Geral

O sistema de métricas consiste em:

1. **Quantum Ratio Exporter**: Exportador Prometheus que coleta e expõe métricas de coerência quântica
2. **Prometheus**: Armazenamento de séries temporais para métricas do sistema
3. **Grafana**: Dashboards visuais mostrando a proporção quântica e alertas de desvio
4. **Soft-Steer Alert Rules**: Regras de alerta para monitorar dΦ/dt e prevenir correções bruscas

A abordagem "Soft-Steer" enfatiza a manutenção de derivadas suaves de Φ em vez de apenas valores absolutos, evitando correções prejudiciais ao sistema.

## Uso Rápido

### Iniciar o stack de métricas completo

```bash
./wt-metrics-bootstrap
```

Ou através do wt:

```bash
./wt metrics bootstrap
```

### Acessar os dashboards

- Prometheus: http://localhost:9090
- Grafana: http://localhost:3000 (admin/admin)
- Metrics: http://localhost:9090/metrics

## Arquitetura

### Componentes

1. **quantum_ratio_exporter.py**: Exportador Prometheus que coleta métricas dos arquivos de estado e as expõe via HTTP
2. **Prometheus**: Sistema de monitoramento que raspa e armazena as métricas do exportador
3. **Grafana**: Interface de visualização com dashboards personalizados
4. **Regras de Alerta**: Configuradas para disparar quando a proporção quântica sai do equilíbrio

### Métricas coletadas

- `wiltonos_quantum_coherence_ratio`: Proporção geral de coerência quântica (Φ)
- `wiltonos_quantum_coherence_derivative`: Taxa de mudança (dΦ/dt) em janelas de 30s, 60s e 300s
- `wiltonos_loop_quantum_coherence`: Proporção quântica específica de cada loop
- `wiltonos_loop_pressure`: Pressão nos loops quânticos (|Φ - Φ★|)
- `wiltonos_collapse_operations_total`: Contador de operações de colapso realizadas
- `wiltonos_longevity_doses_total`: Contador de doses de compostos de longevidade
- `wiltonos_longevity_dose_amount`: Histograma de quantidades de doses

### Dashboards

1. **WiltonOS Quantum Coherence Dashboard**
   - Gauge de proporção quântica atual
   - Gráficos de derivadas (dΦ/dt)
   - Histórico de Φ ao longo do tempo
   - Pressão por loop

2. **WiltonOS Longevity Metrics Dashboard**
   - Distribuição de compostos administrados
   - Correlação entre doses e impacto na proporção quântica
   - Histogramas de dosagem

## Soft-Steer: Alertas e Auto-Correção

O sistema implementa a abordagem Soft-Steer para manter o equilíbrio quântico através de:

1. **Monitoramento de derivadas**: Alertas quando dΦ/dt excede 0.04 por mais de 30s
2. **Limites de tolerância**: Alertas quando Φ sai da faixa 0.73-0.77 por mais de 1 minuto
3. **Pressão de loop**: Monitoramento da pressão em loops individuais que podem precisar de colapso

A filosofia Soft-Steer é definida como:

```
Sustained‑Good  :=  max_{t→∞}  ( Φ(t)  subject to  dΦ/dt  being smooth )
```

Esta abordagem prioriza manter as derivadas de Φ pequenas, evitando saltos bruscos que poderiam desestabilizar o sistema.

## Integração com Longevity API

A Longevity API foi integrada ao sistema de métricas para:

1. Expor métricas sobre doses de compostos via endpoint `/longevity/metrics`
2. Registrar como os compostos afetam a proporção quântica
3. Correlacionar os efeitos nos telômeros com mudanças em Φ

## Próximos Passos

- Adicionar alertas via Slack/Discord para notificações proativas
- Integrar com sensores biométricos para correlacionar métricas físicas
- Implementar aprendizado de máquina para prever desvios em Φ antes que ocorram