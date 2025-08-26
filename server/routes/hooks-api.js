/**
 * API de Hooks - Fornece endpoints para acessar dados de hooks e correlações com valores Phi
 */

import express from 'express';
import path from 'path';
import fs from 'fs';

const router = express.Router();

// Caminho para os arquivos JSON de dados
const STATE_DIR = path.join(process.cwd(), 'state');
const HOOKS_FILE = path.join(STATE_DIR, 'hooks.json');
const COHERENCE_HISTORY_FILE = path.join(STATE_DIR, 'coherence_history.json');
const STIMULUS_EFFECTS_FILE = path.join(STATE_DIR, 'stimulus_effects.json');

// Garantir que o diretório state exista
if (!fs.existsSync(STATE_DIR)) {
    fs.mkdirSync(STATE_DIR, { recursive: true });
}

// Função para ler dados de arquivo JSON
const readJsonFile = (filePath, defaultValue = []) => {
    if (!fs.existsSync(filePath)) {
        fs.writeFileSync(filePath, JSON.stringify(defaultValue), 'utf8');
        return defaultValue;
    }

    try {
        const data = fs.readFileSync(filePath, 'utf8');
        return JSON.parse(data);
    } catch (err) {
        console.error(`Erro ao ler arquivo ${filePath}:`, err);
        return defaultValue;
    }
};

// Função para escrever dados em arquivo JSON
const writeJsonFile = (filePath, data) => {
    try {
        fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');
        return true;
    } catch (err) {
        console.error(`Erro ao escrever no arquivo ${filePath}:`, err);
        return false;
    }
};

// Dados iniciais com hooks do Quantum-Fever field-kit e protocolos de respiração
const initialHooks = [
    // Youtube/Music
    {
        id: 'yt:9LDCUvy0-Y8',
        type: 'youtube',
        title: 'Ambient Study Music',
        source: 'youtube',
        tags: ['loop:wilton_core', 'music', 'ambient'],
        weight: 1.5,
        effect: -0.12,
        last_played: new Date().toISOString()
    },
    {
        id: 'yt:kA5AkaVeMZc',
        type: 'youtube',
        title: 'Space Ambient Music',
        source: 'youtube',
        tags: ['loop:wilton_core', 'music', 'ambient'],
        weight: 1.2,
        effect: -0.08,
        last_played: new Date().toISOString()
    },
    {
        id: 'yt:VFGkBRjRVM4',
        type: 'youtube',
        title: 'Epic Orchestral Music',
        source: 'youtube',
        tags: ['loop:wilton_core', 'music', 'epic'],
        weight: 1.8,
        effect: 0.18,
        last_played: new Date().toISOString()
    },
    {
        id: 'yt:BlissNEso-AcousticEyeStorm',
        type: 'youtube',
        title: 'Bliss N Eso - Eye of the Storm (Acoustic)',
        source: 'music',
        tags: ['loop:wilton_core', 'music', 'acoustic', 'calm'],
        weight: 1.4,
        effect: -0.15,
        last_played: new Date().toISOString()
    },
    
    // Textos/Mantras
    {
        id: 'txt:quantum-manifesto',
        type: 'text',
        title: 'Quantum Computing Manifesto',
        source: 'manual',
        tags: ['loop:wilton_core', 'quantum', 'manifesto'],
        weight: 0.8,
        effect: 0.15,
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
    },
    
    // Incensos e Óleos
    {
        id: 'incense:palo-santo',
        type: 'incense',
        title: 'Palo Santo (foco)',
        source: 'incense',
        tags: ['loop:wilton_core', 'incense', 'focus'],
        weight: 1.6,
        effect: 0.12,
        last_played: new Date().toISOString()
    },
    {
        id: 'incense:lavender',
        type: 'incense',
        title: 'Lavanda (relaxamento)',
        source: 'incense',
        tags: ['loop:wilton_core', 'incense', 'relax'],
        weight: 1.4,
        effect: -0.18,
        last_played: new Date().toISOString()
    },
    {
        id: 'oil:rosemary',
        type: 'oil',
        title: 'Óleo essencial de Alecrim',
        source: 'oil',
        tags: ['loop:wilton_core', 'oil', 'alert'],
        weight: 1.3,
        effect: 0.17,
        last_played: new Date().toISOString()
    },
    
    // Suplementos
    {
        id: 'supplement:creatine',
        type: 'supplement',
        title: 'Creatina monohidratada',
        source: 'supplement',
        tags: ['loop:wilton_core', 'supplement', 'energy'],
        weight: 1.2,
        effect: 0.09,
        last_played: new Date().toISOString()
    },
    {
        id: 'supplement:omega3',
        type: 'supplement',
        title: 'Ômega-3 (EPA + DHA)',
        source: 'supplement',
        tags: ['loop:wilton_core', 'supplement', 'brain'],
        weight: 1.1,
        effect: 0.05,
        last_played: new Date().toISOString()
    },
    {
        id: 'supplement:caffeine_theanine',
        type: 'supplement',
        title: 'Cafeína + L-Teanina',
        source: 'supplement',
        tags: ['loop:wilton_core', 'supplement', 'focus'],
        weight: 1.6,
        effect: 0.11,
        last_played: new Date().toISOString()
    },
    {
        id: 'supplement:rhodiola',
        type: 'supplement',
        title: 'Rhodiola rosea 3% rosavin',
        source: 'supplement',
        tags: ['loop:wilton_core', 'supplement', 'adaptogen'],
        weight: 1.3,
        effect: 0.07,
        last_played: new Date().toISOString()
    },
    {
        id: 'supplement:bacopa',
        type: 'supplement',
        title: 'Bacopa monnieri 55% bacosídeos',
        source: 'supplement',
        tags: ['loop:wilton_core', 'supplement', 'memory'],
        weight: 1.2,
        effect: 0.08,
        last_played: new Date().toISOString()
    },
    {
        id: 'supplement:mg_restore',
        type: 'supplement',
        title: 'Cloreto de Magnésio P.A.',
        source: 'supplement',
        tags: ['loop:wilton_core', 'supplement', 'recovery'],
        weight: 1.1,
        effect: -0.07,
        last_played: new Date().toISOString()
    },
    {
        id: 'supplement:vitals_electrolyte',
        type: 'supplement',
        title: 'IsoDrinks (eletrólitos)',
        source: 'supplement',
        tags: ['loop:wilton_core', 'supplement', 'hydration'],
        weight: 1.4,
        effect: -0.14,
        last_played: new Date().toISOString()
    },
    
    // Práticas
    {
        id: 'breath:box',
        type: 'breath',
        title: '4-6 Box Breath',
        source: 'breath',
        tags: ['loop:wilton_core', 'breath', 'balance'],
        weight: 1.7,
        effect: -0.16,
        last_played: new Date().toISOString()
    },
    {
        id: 'practice:micro_ground',
        type: 'practice',
        title: 'Micro-Ground (pés descalços)',
        source: 'practice',
        tags: ['loop:wilton_core', 'ground', 'centering'],
        weight: 1.5,
        effect: -0.13,
        last_played: new Date().toISOString()
    },
    {
        id: 'practice:lesson_drop',
        type: 'dictaphone',
        title: 'Lesson Drop (gravação de insight)',
        source: 'dictaphone',
        tags: ['loop:narrative_capture', 'insight', 'record'],
        weight: 1.3,
        effect: 0.08,
        last_played: new Date().toISOString()
    }
];

// Gerar histórico de coerência
const generateCoherenceHistory = () => {
    const data = [];
    const now = Math.floor(Date.now() / 1000);
    const target = 0.75;
    let phi = 0.68;
    
    // Gerar 20 pontos de dados para as últimas 2 horas
    for (let i = 0; i < 20; i++) {
        // Simular uma oscilação suave em torno do alvo (0.75)
        const oscillation = Math.sin(i / 3) * 0.1;
        phi = target + oscillation;
        if (phi > 0.95) phi = 0.95;
        if (phi < 0.55) phi = 0.55;
        
        // Calcular a derivada (taxa de mudança)
        const dphi_dt = i > 0 ? phi - data[i-1].phi : 0;
        
        data.push({
            timestamp: now - (20 - i) * 360, // Cada ponto a cada 6 minutos
            phi,
            dphi_dt,
            target_phi: target
        });
    }
    
    return data;
};

// Inicializar arquivos se não existirem
const hooks = readJsonFile(HOOKS_FILE, initialHooks);
const coherenceHistory = readJsonFile(COHERENCE_HISTORY_FILE, generateCoherenceHistory());
const stimulusEffects = readJsonFile(STIMULUS_EFFECTS_FILE, []);

/**
 * GET /api/hooks/top
 * Retorna os hooks mais eficazes com base no efeito desejado (calming, energizing, etc.)
 * 
 * Parâmetros de query:
 * - effect: Efeito desejado (calming, energizing, balancing, etc.)
 * - limit: Número máximo de resultados (default: 5)
 * - source: (opcional) Filtrar por fonte específica
 */
router.get('/top', (req, res) => {
    const { effect, limit = 5, source } = req.query;
    
    if (!effect) {
        return res.status(400).json({ 
            error: 'Parâmetro "effect" é obrigatório (calming, energizing, balancing)' 
        });
    }
    
    // Filtrar os hooks com base no efeito desejado
    let filtered = [...hooks];
    
    // Aplicar filtro de fonte, se especificado
    if (source) {
        filtered = filtered.filter(hook => hook.source === source);
    }
    
    // Filtrar pelo efeito
    if (effect === 'calming') {
        filtered = filtered.filter(hook => hook.effect < 0);
        filtered.sort((a, b) => a.effect - b.effect); // Ordenar do mais negativo (mais calmante) para menos negativo
    } else if (effect === 'energizing') {
        filtered = filtered.filter(hook => hook.effect > 0);
        filtered.sort((a, b) => b.effect - a.effect); // Ordenar do mais positivo (mais energizante) para menos positivo
    } else if (effect === 'balancing') {
        filtered.sort((a, b) => Math.abs(a.effect) - Math.abs(b.effect)); // Ordenar pelo menor efeito absoluto
    }
    
    // Limitar o número de resultados
    const results = filtered.slice(0, parseInt(limit));
    
    // Transformar para o formato de resposta desejado
    const formattedResults = results.map(hook => {
        const loop = hook.tags.find(tag => tag.startsWith('loop:'))?.replace('loop:', '') || 'main';
        
        return {
            stimulus_id: hook.id,
            stimulus_title: hook.title,
            stimulus_type: hook.type,
            loop,
            phi_before: effect === 'calming' ? 0.82 : 0.68,
            phi_after: effect === 'calming' ? 0.82 + hook.effect : 0.68 + hook.effect,
            delta_phi: hook.effect,
            timestamp: Math.floor(Date.now() / 1000) - Math.floor(Math.random() * 3600)
        };
    });
    
    res.json({
        effect,
        count: formattedResults.length,
        hooks: formattedResults
    });
});

/**
 * GET /api/hooks/stats
 * Retorna estatísticas gerais sobre os hooks e seus efeitos
 */
router.get('/stats', (req, res) => {
    // Calcular estatísticas dos hooks
    const stats = {
        total_hooks: hooks.length,
        sources: {},
        effects: {
            calming: 0,
            energizing: 0,
            neutral: 0
        }
    };
    
    // Contagem por fonte
    hooks.forEach(hook => {
        if (!stats.sources[hook.source]) {
            stats.sources[hook.source] = 0;
        }
        stats.sources[hook.source]++;
        
        // Contagem por efeito
        if (hook.effect < -0.05) {
            stats.effects.calming++;
        } else if (hook.effect > 0.05) {
            stats.effects.energizing++;
        } else {
            stats.effects.neutral++;
        }
    });
    
    // Converter o objeto sources para o formato de array para a resposta
    const sourcesArray = Object.entries(stats.sources).map(([source, count]) => ({
        source,
        count
    }));
    
    // Converter o objeto effects para o formato de array para a resposta
    const effectsArray = Object.entries(stats.effects).map(([effect, count]) => ({
        effect,
        count
    }));
    
    res.json({
        total_hooks: stats.total_hooks,
        sources: sourcesArray,
        effects: effectsArray
    });
});

/**
 * POST /api/hooks/add
 * Adiciona um novo hook ao sistema
 */
router.post('/add', express.json(), (req, res) => {
    const { stimulus_id, type, title, source, tags, weight, effect } = req.body;
    
    if (!stimulus_id || !type || !title) {
        return res.status(400).json({ 
            error: 'Parâmetros obrigatórios: stimulus_id, type, title' 
        });
    }
    
    // Verificar se o hook já existe
    const existingIndex = hooks.findIndex(h => h.id === stimulus_id);
    
    const newHook = {
        id: stimulus_id,
        type,
        title,
        source: source || 'manual',
        tags: tags || [],
        weight: weight || 1.0,
        effect: effect || 0.0,
        last_played: new Date().toISOString()
    };
    
    if (existingIndex >= 0) {
        // Atualizar hook existente
        hooks[existingIndex] = {
            ...hooks[existingIndex],
            ...newHook
        };
    } else {
        // Adicionar novo hook
        hooks.push(newHook);
    }
    
    // Salvar as alterações
    if (writeJsonFile(HOOKS_FILE, hooks)) {
        res.json({
            success: true,
            message: existingIndex >= 0 ? 'Hook atualizado com sucesso' : 'Hook adicionado com sucesso',
            hook: newHook
        });
    } else {
        res.status(500).json({
            success: false,
            message: 'Erro ao salvar hook'
        });
    }
});

/**
 * GET /api/hooks/stimuli
 * Retorna todos os estímulos cadastrados
 */
router.get('/stimuli', (req, res) => {
    res.json(hooks);
});

/**
 * GET /api/hooks/coherence
 * Retorna o histórico de coerência
 */
router.get('/coherence', (req, res) => {
    const timespan = req.query.timespan || '1h';
    // Em um app real, filtraríamos por timespan
    res.json(coherenceHistory);
});

/**
 * GET /api/hooks/state
 * Retorna o estado atual do sistema
 */
router.get('/state', (req, res) => {
    const history = coherenceHistory;
    const currentPhi = history[history.length - 1].phi;
    
    res.json({
        current_phi: currentPhi,
        target_phi: 0.75,
        difference: Math.abs(currentPhi - 0.75),
        status: Math.abs(currentPhi - 0.75) < 0.05 ? 'on_target' : 'needs_adjustment',
        last_update: new Date().toISOString()
    });
});

/**
 * GET /api/hooks/loop-check
 * Verifica o estado atual da coerência no loop (usado pelo comando 'wt loop-check')
 */
router.get('/loop-check', (req, res) => {
    const { loop = 'wilton_core' } = req.query;
    const history = coherenceHistory;
    const currentEntry = history[history.length - 1];
    const prevEntry = history[history.length - 2] || { phi: currentEntry.phi };
    
    // Calcular taxa de mudança (volatilidade)
    const volatility = Math.abs(currentEntry.phi - prevEntry.phi);
    
    // Determinar o status com base no valor de phi e sua volatilidade
    let status = 'STABLE';
    let suggestion = '';
    
    if (Math.abs(currentEntry.phi - 0.75) > 0.1) {
        status = 'OUT_OF_RANGE';
        if (currentEntry.phi > 0.85) {
            suggestion = 'Phi muito alto. Considere ativar Coringa para aumentar a exploração.';
        } else if (currentEntry.phi < 0.65) {
            suggestion = 'Phi muito baixo. Considere desativar Coringa para aumentar a coerência.';
        }
    } else if (volatility > 0.05) {
        status = 'VOLATILE';
        suggestion = 'Volatilidade alta. Considere técnica de respiração Box 4-6.';
    } else {
        suggestion = 'Coerência estável em nível ideal. Continue.';
    }
    
    // Encontrar hooks recomendados com base no estado
    const recommendedHooks = hooks
        .filter(hook => {
            const hookLoop = hook.tags.find(t => t.startsWith('loop:'))?.replace('loop:', '') || 'main';
            if (hookLoop !== loop) return false;
            
            if (status === 'VOLATILE' && hook.effect < -0.1) return true; // Calmantes para volatilidade
            if (currentEntry.phi > 0.85 && hook.effect < 0) return true; // Redutores para phi alto
            if (currentEntry.phi < 0.65 && hook.effect > 0) return true; // Elevadores para phi baixo
            
            return false;
        })
        .slice(0, 3)
        .map(h => ({
            id: h.id, 
            title: h.title, 
            effect: h.effect,
            expected_impact: h.effect > 0 ? `+${h.effect.toFixed(2)}` : h.effect.toFixed(2)
        }));
    
    res.json({
        timestamp: new Date().toISOString(),
        loop,
        phi: {
            current: currentEntry.phi.toFixed(2),
            target: 0.75,
            difference: Math.abs(currentEntry.phi - 0.75).toFixed(2),
            in_range: currentEntry.phi >= 0.72 && currentEntry.phi <= 0.78,
        },
        volatility: volatility.toFixed(3),
        status,
        coringa_state: currentEntry.phi > 0.8 ? 'SUGGESTED_ON' : 'SUGGESTED_OFF',
        suggestion,
        recommended_hooks: recommendedHooks,
    });
});

/**
 * POST /api/hooks/feedback/run
 * Executa um ciclo de feedback
 */
router.post('/feedback/run', (req, res) => {
    // Em um app real, isso acionaria o motor de feedback
    res.json({
        success: true,
        message: "Feedback cycle executed successfully",
        timestamp: new Date().toISOString(),
        adjusted_stimuli: 3,
        new_phi: 0.74
    });
});

// Exportação como módulo ES
export { router }; 
export default router;