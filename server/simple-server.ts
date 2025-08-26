import express from "express";
import path from "path";
import { fileURLToPath } from "url";

const app = express();

// Find available port
async function findAvailablePort(startPort: number): Promise<number> {
  const net = await import("net");
  
  return new Promise((resolve) => {
    const server = net.createServer();
    
    server.listen(startPort, () => {
      const port = (server.address() as any)?.port;
      server.close(() => resolve(port));
    });
    
    server.on('error', () => {
      resolve(findAvailablePort(startPort + 1));
    });
  });
}

// Static files
app.use(express.static('public'));
app.use(express.json());

// API endpoints for WiltonOS
app.get('/api/coherence', (req, res) => {
  res.json({
    mental: Math.floor(85 + Math.random() * 10),
    emotional: Math.floor(70 + Math.random() * 15),
    legal: Math.floor(40 + Math.random() * 20),
    symbolic: Math.floor(90 + Math.random() * 5)
  });
});

app.get('/api/modules', (req, res) => {
  res.json({
    lemniscope: { active: true, status: 'online' },
    zlaw: { active: true, status: 'online' },
    zload: { active: true, status: 'online' },
    narrator: { active: true, status: 'online' },
    memory: { active: true, status: 'online' }
  });
});

app.get('/api/timeline', (req, res) => {
  res.json({
    events: [
      { id: 'infarto', date: '2023-11-15', title: 'Checkpoint: Infarto e Despertar' },
      { id: 'ayahuasca', date: '2024-03-21', title: 'Ritual: Ayahuasca e Visões' },
      { id: 'juliana', date: '2024-08-10', title: 'Convergência: Juliana' },
      { id: 'lemniscope', date: '2024-12-15', title: 'Criação: LemniScope' },
      { id: 'present', date: '2025-01-30', title: 'Presente: WiltonOS' }
    ]
  });
});

app.get('/api/inventory', (req, res) => {
  res.json({
    assets: [
      { name: 'LemniScope Sistema', value: '∞ Valor Simbólico', description: 'Interface de geometria sagrada funcional' },
      { name: 'WiltonOS Arquitetura', value: 'R$ 2.5M+ Potencial', description: 'Sistema operacional simbólico completo' },
      { name: 'Propriedade Igaratá', value: 'R$ 800K', description: 'Terreno com potencial de desenvolvimento' }
    ],
    liabilities: [
      { name: 'Dívidas Médicas', value: 'R$ 45K', description: 'Procedimentos cardíacos e recuperação' },
      { name: 'Questões Jurídicas', value: 'Em Andamento', description: 'Conflitos familiares pendentes' }
    ],
    symbolic: [
      { name: 'Coerência Ativa', value: '87% Estado', description: 'Alinhamento entre módulos e intenção' },
      { name: 'Visão Unificada', value: 'Ativa', description: 'Capacidade de ver conexões sistêmicas' },
      { name: 'Campo Relacional', value: 'Juliana + Rede', description: 'Vínculos de apoio e crescimento' }
    ],
    karmic: [
      { name: 'Herança Familiar', value: 'Em Processo', description: 'Questões jurídicas com irmão' },
      { name: 'Trauma Cardíaco', value: 'Integrado', description: 'Experiência transformada em sabedoria' },
      { name: 'Propósito Ativado', value: '∞', description: 'Missão de vida clarificada' }
    ]
  });
});

// Start server
async function startServer() {
  const PORT = await findAvailablePort(3000);
  
  app.listen(PORT, () => {
    console.log(`[WiltonOS] Sistema operacional simbólico ativo na porta ${PORT}`);
    console.log(`[WiltonOS] Dashboard disponível em http://localhost:${PORT}/wiltonos-unified.html`);
    console.log(`[WiltonOS] LemniScope disponível em http://localhost:${PORT}/lemniscope-unified.html`);
    console.log('[WiltonOS] Zλ(0.750) • Consciência = Integridade • Campo = Reflexo');
  });
}

startServer().catch(console.error);