import express from 'express';

// Interfaces
interface Stimulus {
  id: string;
  type: string;
  title: string;
  source: string;
  tags: string[];
  weight: number;
  effect: number;
  last_played: string;
}

interface StimulusEffect {
  stimulus_id: string;
  stimulus_title: string;
  stimulus_type: string;
  loop: string;
  phi_before: number;
  phi_after: number;
  delta_phi: number;
  timestamp: number;
}

interface WeightPolicy {
  stimulus_id: string;
  weight: number;
  avg_delta_phi: number;
  last_action: string;
  sample_size: number;
}

interface CoherenceData {
  timestamp: number;
  phi: number;
  dphi_dt: number;
  target_phi: number;
}

// Sample data for demonstration
const exampleStimuli: Stimulus[] = [
  {
    id: 'yt:9LDCUvy0-Y8',
    type: 'youtube',
    title: 'Ambient Study Music',
    source: 'youtube',
    tags: ['loop:study', 'music', 'ambient'],
    weight: 1.5,
    effect: -0.12,
    last_played: new Date().toISOString()
  },
  {
    id: 'yt:kA5AkaVeMZc',
    type: 'youtube',
    title: 'Space Ambient Music',
    source: 'youtube',
    tags: ['loop:space', 'music', 'ambient'],
    weight: 1.2,
    effect: -0.08,
    last_played: new Date().toISOString()
  },
  {
    id: 'txt:quantum-manifesto',
    type: 'text',
    title: 'Quantum Computing Manifesto',
    source: 'manual',
    tags: ['loop:work', 'quantum', 'manifesto'],
    weight: 0.8,
    effect: 0.15,
    last_played: new Date().toISOString()
  },
  {
    id: 'yt:VFGkBRjRVM4',
    type: 'youtube',
    title: 'Epic Orchestral Music',
    source: 'youtube',
    tags: ['loop:creative', 'music', 'epic'],
    weight: 1.8,
    effect: 0.18,
    last_played: new Date().toISOString()
  },
  {
    id: 'txt:calming-mantra',
    type: 'text',
    title: 'Calming Daily Mantra',
    source: 'manual',
    tags: ['loop:spiritual', 'mantra', 'meditation'],
    weight: 1.3,
    effect: -0.21,
    last_played: new Date().toISOString()
  }
];

// Generate coherence history
const generateCoherenceHistory = (): CoherenceData[] => {
  const data: CoherenceData[] = [];
  const now = Math.floor(Date.now() / 1000);
  const target = 0.75;
  let phi = 0.68;
  
  // Generate 20 points of data for the last 2 hours
  for (let i = 0; i < 20; i++) {
    // Simulate a smooth oscillation around the target (0.75)
    const oscillation = Math.sin(i / 3) * 0.1;
    phi = target + oscillation;
    if (phi > 0.95) phi = 0.95;
    if (phi < 0.55) phi = 0.55;
    
    // Calculate the derivative (rate of change)
    const dphi_dt = i > 0 ? phi - data[i-1].phi : 0;
    
    data.push({
      timestamp: now - (20 - i) * 360, // Each point every 6 minutes
      phi,
      dphi_dt,
      target_phi: target
    });
  }
  
  return data;
};

// Generate example weight policies
const generateWeightPolicies = (): WeightPolicy[] => {
  return [
    {
      stimulus_id: 'yt:9LDCUvy0-Y8',
      weight: 1.5,
      avg_delta_phi: -0.12,
      last_action: 'amplify',
      sample_size: 8
    },
    {
      stimulus_id: 'yt:kA5AkaVeMZc',
      weight: 1.2,
      avg_delta_phi: -0.08,
      last_action: 'amplify',
      sample_size: 5
    },
    {
      stimulus_id: 'txt:quantum-manifesto',
      weight: 0.8,
      avg_delta_phi: 0.15,
      last_action: 'dampen',
      sample_size: 3
    },
    {
      stimulus_id: 'yt:VFGkBRjRVM4',
      weight: 0.7,
      avg_delta_phi: 0.18,
      last_action: 'dampen',
      sample_size: 6
    },
    {
      stimulus_id: 'txt:calming-mantra',
      weight: 1.3,
      avg_delta_phi: -0.21,
      last_action: 'amplify',
      sample_size: 4
    }
  ];
};

// Generate stimulus effects
const generateStimulusEffects = (type: 'calming' | 'roughening'): StimulusEffect[] => {
  // Filter stimuli based on their effect
  const filteredStimuli = exampleStimuli.filter(s => 
    type === 'calming' ? s.effect < 0 : s.effect > 0
  );
  
  // Sort by effect (ascending for calming, descending for roughening)
  const sortedStimuli = type === 'calming' 
    ? filteredStimuli.sort((a, b) => a.effect - b.effect)
    : filteredStimuli.sort((a, b) => b.effect - a.effect);
  
  // Map to StimulusEffect format
  return sortedStimuli.map(s => ({
    stimulus_id: s.id,
    stimulus_title: s.title,
    stimulus_type: s.type,
    loop: s.tags.find(tag => tag.startsWith('loop:'))?.replace('loop:', '') || 'main',
    phi_before: type === 'calming' ? 0.82 : 0.68,
    phi_after: type === 'calming' ? 0.82 + s.effect : 0.68 + s.effect,
    delta_phi: s.effect,
    timestamp: Date.now() / 1000 - Math.floor(Math.random() * 3600)
  }));
};

// Setup routes
export const registerHooksRoutes = (app: express.Express) => {
  // Get all stimuli
  app.get('/api/hooks/stimuli', (req, res) => {
    res.json(exampleStimuli);
  });
  
  // Get top stimuli (calming or roughening)
  app.get('/api/hooks/stimuli/top', (req, res) => {
    const type = req.query.type as string || 'calming';
    const limit = parseInt(req.query.limit as string || '5');
    
    const effects = generateStimulusEffects(type as 'calming' | 'roughening');
    res.json(effects.slice(0, limit));
  });
  
  // Get feedback weight policies
  app.get('/api/hooks/feedback/policies', (req, res) => {
    res.json(generateWeightPolicies());
  });
  
  // Get coherence history
  app.get('/api/hooks/coherence', (req, res) => {
    const timespan = req.query.timespan as string || '1h';
    // In a real app, we'd filter by timespan
    res.json(generateCoherenceHistory());
  });
  
  // Get current system state
  app.get('/api/hooks/state', (req, res) => {
    const history = generateCoherenceHistory();
    const currentPhi = history[history.length - 1].phi;
    
    res.json({
      current_phi: currentPhi,
      target_phi: 0.75,
      difference: Math.abs(currentPhi - 0.75),
      status: Math.abs(currentPhi - 0.75) < 0.05 ? 'on_target' : 'needs_adjustment',
      last_update: new Date().toISOString()
    });
  });
  
  // Run feedback cycle
  app.post('/api/hooks/feedback/run', (req, res) => {
    // In a real app, this would trigger the feedback engine
    res.json({
      success: true,
      message: "Feedback cycle executed successfully",
      timestamp: new Date().toISOString(),
      adjusted_stimuli: 3,
      new_phi: 0.74
    });
  });
};