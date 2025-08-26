import express from 'express';
const router = express.Router();

// In-memory state for the Coringa mode
interface CoringaState {
  active: boolean;
  originalPhiTarget: number;
  currentPhiTarget: number;
  activationTimestamp: number | null;
  duration: number;
  remainingMinutes: number;
}

let coringaState: CoringaState = {
  active: false,
  originalPhiTarget: 0.75, // Default 3:1 quantum balance target
  currentPhiTarget: 0.75,
  activationTimestamp: null,
  duration: 0, // Duration in minutes
  remainingMinutes: 0
};

// Timer reference
let coringaTimer: NodeJS.Timeout | null = null;

// Update state when interval ends
function endCoringaMode() {
  coringaState.active = false;
  coringaState.currentPhiTarget = coringaState.originalPhiTarget;
  coringaState.activationTimestamp = null;
  coringaState.remainingMinutes = 0;
  
  if (coringaTimer) {
    clearInterval(coringaTimer);
    coringaTimer = null;
  }
  
  console.log('[CORINGA] Mode deactivated - Φ target restored to', coringaState.originalPhiTarget);
}

// Update remaining time
function updateRemainingTime() {
  if (!coringaState.active || !coringaState.activationTimestamp) return;
  
  const elapsedMs = Date.now() - coringaState.activationTimestamp;
  const elapsedMinutes = Math.floor(elapsedMs / (1000 * 60));
  const remainingMinutes = Math.max(0, coringaState.duration - elapsedMinutes);
  
  coringaState.remainingMinutes = remainingMinutes;
  
  if (remainingMinutes <= 0) {
    endCoringaMode();
  }
}

// GET current Coringa state
router.get('/state', (req, res) => {
  updateRemainingTime();
  res.json(coringaState);
});

// GET current Phi value for Coringa UI
router.get('/phi', (req, res) => {
  // Calculate current phi value based on coherence to exploration ratio
  // Em um sistema real, isso seria calculado a partir de métricas reais do sistema
  // Por enquanto, simulamos um valor phi que mantém a proporção alvo 3:1 com pequenas flutuações naturais
  
  // A proporção padrão 3:1 corresponde ao valor phi de 0.75 (3/(3+1))
  const target = coringaState.currentPhiTarget;
  
  // Aumentamos a variação quando o modo Coringa está ativo para simular maior exploração
  const baseVariation = 0.03; // Variação base para simular flutuações naturais
  const modeAmplifier = coringaState.active ? 3 : 1; // Amplificador para o modo Coringa
  const variation = baseVariation * modeAmplifier;
  
  // Calculamos o deslocamento aleatório, mas com uma tendência para voltar à proporção alvo
  // quando o valor está muito fora do alvo
  const currentDiff = Math.abs(target - 0.75);
  const stabilizingFactor = currentDiff > 0.1 ? 0.8 : 1.0; // Tentativa de estabilizar quando muito longe
  const randomFactor = Math.random() * 2 - 1; // Valor entre -1 e 1
  const weightedOffset = (randomFactor * variation * stabilizingFactor);
  
  // Calculamos o valor phi resultante, garantindo que fique dentro dos limites
  const rawPhi = target + weightedOffset;
  const currentPhi = Math.max(0.5, Math.min(0.95, rawPhi));
  
  // Registramos o valor para depuração
  console.log(`[CORINGA] Calculated phi: ${currentPhi.toFixed(3)}, target: ${target}, mode: ${coringaState.active ? 'active' : 'normal'}`);
  
  
  res.json({ 
    phi: currentPhi,
    target: target,
    isCoringaActive: coringaState.active
  });
});

// POST activate Coringa mode
router.post('/activate', (req, res) => {
  const { newPhiTarget, duration } = req.body;
  
  if (typeof newPhiTarget !== 'number' || newPhiTarget < 0 || newPhiTarget > 1) {
    return res.status(400).json({ error: 'Invalid Φ target. Must be a number between 0 and 1.' });
  }
  
  if (typeof duration !== 'number' || duration < 1 || duration > 60) {
    return res.status(400).json({ error: 'Invalid duration. Must be between 1 and 60 minutes.' });
  }
  
  // Activate Coringa mode
  coringaState.active = true;
  coringaState.currentPhiTarget = newPhiTarget;
  coringaState.activationTimestamp = Date.now();
  coringaState.duration = duration;
  coringaState.remainingMinutes = duration;
  
  // Clear any existing timer
  if (coringaTimer) {
    clearInterval(coringaTimer);
  }
  
  // Start timer to update remaining time
  coringaTimer = setInterval(() => {
    updateRemainingTime();
  }, 1000 * 30); // Update every 30 seconds
  
  console.log(`[CORINGA] Mode activated - Φ target changed from ${coringaState.originalPhiTarget} to ${newPhiTarget} for ${duration} minutes`);
  
  res.json(coringaState);
});

// POST deactivate Coringa mode
router.post('/deactivate', (req, res) => {
  if (!coringaState.active) {
    return res.status(400).json({ error: 'Coringa mode is not active.' });
  }
  
  endCoringaMode();
  res.json(coringaState);
});

// GET historical Phi data for the past 2 hours
router.get('/history', (req, res) => {
  // In a real system, this would fetch from a database
  // Here we'll generate synthetic historical data based on the current phi target
  
  const now = Date.now();
  const twoHoursAgo = now - (2 * 60 * 60 * 1000); // 2 hours in milliseconds
  const dataPoints = 120; // 1 data point per minute for 2 hours
  const historyData = [];
  
  // Generate data points
  for (let i = 0; i < dataPoints; i++) {
    const timestamp = twoHoursAgo + (i * 60 * 1000); // one point per minute
    
    // Determine if this point was in Coringa mode based on timestamp
    // For demonstration, we'll say any points from 30-90 minutes ago were in Coringa mode
    const wasInCoringaMode = timestamp > (now - 90 * 60 * 1000) && timestamp < (now - 30 * 60 * 1000);
    
    // Base target based on whether in Coringa mode
    const pointTarget = wasInCoringaMode ? 0.65 : coringaState.originalPhiTarget;
    
    // Calculate phi with appropriate variation
    const baseVariation = 0.03;
    const modeAmplifier = wasInCoringaMode ? 3 : 1;
    const variation = baseVariation * modeAmplifier;
    
    // Add some randomness but ensure values generally follow the expected pattern
    const randomFactor = Math.random() * 2 - 1;
    const phi = Math.max(0.5, Math.min(0.95, pointTarget + (randomFactor * variation)));
    
    historyData.push({
      timestamp,
      phi,
      target: pointTarget,
      isCoringaActive: wasInCoringaMode
    });
  }
  
  // Add the current state as the final point
  historyData.push({
    timestamp: now,
    phi: coringaState.currentPhiTarget + ((Math.random() * 0.06) - 0.03),
    target: coringaState.currentPhiTarget,
    isCoringaActive: coringaState.active
  });
  
  res.json(historyData);
});

export default router;