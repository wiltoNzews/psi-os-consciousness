/**
 * Módulo de Métricas Prometheus para o WiltonOS
 * 
 * Este módulo configura e expõe o cliente Prometheus para instrumentação do sistema,
 * permitindo a coleta e visualização de métricas no Grafana.
 */

import prom from 'prom-client';

// Configurar registro global
const register = new prom.Registry();

// Adicionar coletores padrão
prom.collectDefaultMetrics({
  register,
  prefix: 'wiltonos_',
  labels: { app: 'wilton_os' }
});

// Definir métricas específicas para o sistema de alimentação
const foodLogCounter = new prom.Counter({
  name: 'wiltonos_food_logs_total',
  help: 'Contador total de registros alimentares',
  labelNames: ['meal_type'],
  registers: [register]
});

const phiLevelGauge = new prom.Gauge({
  name: 'wiltonos_phi_level',
  help: 'Nível phi atual do sistema (ideal = 0.75)',
  registers: [register]
});

const phiDeviationGauge = new prom.Gauge({
  name: 'wiltonos_phi_deviation',
  help: 'Desvio do nível phi em relação ao sweet spot (0.75)',
  registers: [register]
});

const fractalAlignmentGauge = new prom.Gauge({
  name: 'wiltonos_fractal_alignment',
  help: 'Alinhamento fractal com o padrão ideal (0 a 1)',
  registers: [register]
});

const mealRecommendationsCounter = new prom.Counter({
  name: 'wiltonos_meal_recommendations_total',
  help: 'Contador total de recomendações alimentares geradas',
  labelNames: ['quantum_state'],
  registers: [register]
});

const foodCategoryCounter = new prom.Counter({
  name: 'wiltonos_food_category_total',
  help: 'Contador total de consumo por categoria alimentar',
  labelNames: ['category'],
  registers: [register]
});

const phiImpactHistogram = new prom.Histogram({
  name: 'wiltonos_phi_impact',
  help: 'Distribuição do impacto alimentar no phi',
  buckets: [-0.3, -0.2, -0.1, -0.05, 0, 0.05, 0.1, 0.2, 0.3],
  registers: [register]
});

const mealProcessingTime = new prom.Summary({
  name: 'wiltonos_meal_processing_seconds',
  help: 'Tempo para processar e analisar uma refeição',
  percentiles: [0.5, 0.9, 0.99],
  registers: [register]
});

const foodLoggerInfo = new prom.Gauge({
  name: 'wiltonos_food_logger_info',
  help: 'Informações sobre o sistema de registro alimentar',
  labelNames: ['version', 'qdrant_status', 'health_hooks_status'],
  registers: [register]
});

// Funções auxiliares para atualização de métricas
function recordFoodLog(mealType) {
  foodLogCounter.inc({ meal_type: mealType });
}

function updatePhiLevel(phi) {
  phiLevelGauge.set(phi);
  
  // Calcular desvio do phi ideal (0.75)
  const deviation = phi - 0.75;
  phiDeviationGauge.set(deviation);
  
  // Calcular alinhamento fractal (0-1, onde 1 é perfeito alinhamento com phi=0.75)
  const alignment = 1.0 - Math.min(Math.abs(deviation) / 0.75, 1.0);
  fractalAlignmentGauge.set(alignment);
}

function recordMealRecommendation(quantumState) {
  mealRecommendationsCounter.inc({ quantum_state: quantumState });
}

function recordFoodCategory(category) {
  foodCategoryCounter.inc({ category });
}

function recordPhiImpact(impact) {
  phiImpactHistogram.observe(impact);
}

function recordMealProcessingTime(seconds) {
  mealProcessingTime.observe(seconds);
}

function setFoodLoggerInfo(version, qdrantStatus, healthHooksStatus) {
  foodLoggerInfo.set(
    { 
      version, 
      qdrant_status: qdrantStatus, 
      health_hooks_status: healthHooksStatus 
    }, 
    1
  );
}

export {
  prom,
  register,
  foodLogCounter,
  phiLevelGauge,
  phiDeviationGauge,
  fractalAlignmentGauge,
  mealRecommendationsCounter,
  foodCategoryCounter,
  phiImpactHistogram,
  mealProcessingTime,
  foodLoggerInfo,
  recordFoodLog,
  updatePhiLevel,
  recordMealRecommendation,
  recordFoodCategory,
  recordPhiImpact,
  recordMealProcessingTime,
  setFoodLoggerInfo
};