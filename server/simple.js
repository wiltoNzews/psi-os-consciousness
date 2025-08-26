const express = require('express');
const path = require('path');
const cors = require('cors');
const agentsRouter = require('./api/agents');

const app = express();
const PORT = process.env.PORT || 3001;

// Middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Servir arquivos estáticos da pasta public
app.use(express.static(path.join(__dirname, '../public')));

// Rota principal - redireciona para o dashboard
app.get('/', (req, res) => {
  res.redirect('/wiltonos-unified-dashboard.html');
});

// API básica para coerência
app.get('/api/coherence', (req, res) => {
  const coherence = {
    global: 87,
    integridade: 92,
    reflexo: 84,
    acao: 89,
    formula: 'Zλ(0.750)',
    timestamp: new Date().toISOString()
  };
  res.json(coherence);
});

// API para status do sistema
app.get('/api/status', (req, res) => {
  const status = {
    system: 'WiltonOS',
    version: '1.5.1',
    status: 'operational',
    modules: {
      lemniscope: 'active',
      zload: 'active',
      narratives: 'active',
      inventory: 'active',
      coherence: 'active'
    },
    memory: {
      used: '2.1GB',
      total: '10GB',
      integrity: 99.8
    }
  };
  res.json(status);
});

// Integração com agentes AI reais
app.use('/api/agents', agentsRouter);

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`🌸 WiltonOS ativo na porta ${PORT}`);
  console.log(`📊 Dashboard: http://localhost:${PORT}/wiltonos-unified-dashboard.html`);
  console.log(`🌸 LemniScope: http://localhost:${PORT}/lemniscope.html`);
  console.log(`📜 Narrativas: http://localhost:${PORT}/narrativas.html`);
  console.log(`📊 Inventário: http://localhost:${PORT}/inventario.html`);
  console.log(`💾 Z-Load: http://localhost:${PORT}/zload.html`);
  console.log(`🔄 Coerência: http://localhost:${PORT}/coerencia.html`);
  console.log('⚡ Zλ(0.750) • Sistema operacional simbólico ativo');
});

process.on('SIGINT', () => {
  console.log('\n🔄 Encerrando WiltonOS...');
  process.exit(0);
});