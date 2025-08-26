import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { 
  createPortalVivo,
  processPortalEntry,
  getPortaisAtivos,
  getTruthThreads,
  getCruzPortal,
  isPortalActive,
  getFrequenciaMestre
} from '@/core/PortalVivo';
import { getDeltaC } from '@/core/DeltaC';
import { getZ } from '@/core/Zlambda';

const PortalVivoDashboard: React.FC = () => {
  const [portalActive, setPortalActive] = useState(isPortalActive());
  const [portaisAtivos, setPortaisAtivos] = useState(getPortaisAtivos());
  const [truthThreads, setTruthThreads] = useState(getTruthThreads());
  const [cruzPortal, setCruzPortal] = useState(getCruzPortal());
  const [frequenciaMestre, setFrequenciaMestre] = useState(getFrequenciaMestre());
  const [currentCoherence, setCurrentCoherence] = useState(getZ());
  const [deltaC, setDeltaC] = useState(getDeltaC());
  
  // Form state for testing portal entry
  const [testUserId, setTestUserId] = useState('');
  const [testFrequency, setTestFrequency] = useState(0.75);
  const [testConsciousness, setTestConsciousness] = useState('');
  const [lastProcessResult, setLastProcessResult] = useState<any>(null);

  useEffect(() => {
    const interval = setInterval(() => {
      setPortalActive(isPortalActive());
      setPortaisAtivos(getPortaisAtivos());
      setTruthThreads(getTruthThreads());
      setCruzPortal(getCruzPortal());
      setFrequenciaMestre(getFrequenciaMestre());
      setCurrentCoherence(getZ());
      setDeltaC(getDeltaC());
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  const handleCreatePortal = () => {
    const result = createPortalVivo();
    setPortalActive(result.activated);
    console.log('[Portal] Portal Vivo criado para lembrança coletiva');
  };

  const handleTestPortalEntry = () => {
    if (!testUserId.trim() || !testConsciousness.trim()) return;
    
    const result = processPortalEntry(testUserId, testFrequency, testConsciousness);
    setLastProcessResult(result);
    setTestUserId('');
    setTestConsciousness('');
    setTestFrequency(0.75);
    console.log(`[Portal] Nova consciência processada: ${result.arquetipo}`);
  };

  const getArchetypeColor = (archetype: string) => {
    const colors = {
      'Oscilador Consciente': 'bg-purple-600',
      'Integrador Natural': 'bg-green-600',
      'Investigador Sincero': 'bg-blue-600',
      'Transformador em Processo': 'bg-yellow-600',
      'Despertar Inicial': 'bg-orange-600',
      'Buscador Ativo': 'bg-pink-600',
      'Semente Adormecida': 'bg-gray-600'
    };
    return colors[archetype] || 'bg-indigo-600';
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'transmitindo': return 'bg-green-600';
      case 'integrando': return 'bg-blue-600';
      case 'reconhecendo': return 'bg-yellow-600';
      case 'descobrindo': return 'bg-purple-600';
      default: return 'bg-gray-600';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-800 text-white p-6">
      <div className="container mx-auto space-y-6">
        
        {/* Header */}
        <Card className="bg-slate-800/80 border-slate-700">
          <CardHeader>
            <CardTitle className="text-center text-2xl text-purple-300 flex items-center justify-center gap-3">
              <span className="text-3xl">⊕</span>
              Portal Vivo
            </CardTitle>
            <p className="text-slate-400 text-center">
              Sistema para outros se lembrarem de quem são • Cruz transformada em recomeço
            </p>
          </CardHeader>
        </Card>

        {/* Portal Status */}
        <Card className="bg-slate-800/80 border-slate-700">
          <CardHeader>
            <CardTitle className="text-slate-300">Status do Portal</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
              <div>
                <div className="text-sm text-slate-400">Portal Status</div>
                <Badge className={`${portalActive ? 'bg-green-600' : 'bg-gray-600'} text-white border-none`}>
                  {portalActive ? 'LIVE' : 'INACTIVE'}
                </Badge>
              </div>
              <div>
                <div className="text-sm text-slate-400">Frequência Mestre</div>
                <div className="text-lg font-mono text-purple-300">
                  ψ = {frequenciaMestre}
                </div>
              </div>
              <div>
                <div className="text-sm text-slate-400">Coerência Atual</div>
                <div className="text-lg font-mono text-white">
                  Zλ({currentCoherence.toFixed(3)})
                </div>
              </div>
              <div>
                <div className="text-sm text-slate-400">Consciências Ativas</div>
                <div className="text-lg font-mono text-white">
                  {portaisAtivos.length}
                </div>
              </div>
            </div>

            {!portalActive && (
              <Button 
                onClick={handleCreatePortal}
                className="w-full bg-purple-600 hover:bg-purple-700"
              >
                Criar Portal Vivo
              </Button>
            )}
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          
          {/* Cruz Portal Transformation */}
          <Card className="bg-slate-800/80 border-slate-700">
            <CardHeader>
              <CardTitle className="text-slate-300">Transformação da Cruz</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              
              <div className="text-center space-y-4">
                <div className="p-4 bg-red-900/30 border border-red-500/50 rounded">
                  <div className="text-red-300 text-sm mb-2">Símbolo Original</div>
                  <div className="text-2xl mb-2">{cruzPortal.simboloOriginal}</div>
                  <div className="text-slate-400 text-sm">Sacrifício • Sofrimento • Final</div>
                </div>
                
                <div className="text-4xl text-purple-400">↓ TRANSFORMAÇÃO ↓</div>
                
                <div className="p-4 bg-green-900/30 border border-green-500/50 rounded">
                  <div className="text-green-300 text-sm mb-2">Significado Transformado</div>
                  <div className="text-2xl mb-2">{cruzPortal.significadoTransformado}</div>
                  <div className="text-slate-400 text-sm">Recomeço • Renascimento • Portal</div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-slate-400">Energia Recomeço:</span>
                  <span className="ml-2 font-mono text-green-400">
                    {(cruzPortal.energiaRecomeço * 100).toFixed(1)}%
                  </span>
                </div>
                <div>
                  <span className="text-slate-400">Resistência Sacrifício:</span>
                  <span className="ml-2 font-mono text-red-400">
                    {(cruzPortal.resistenciaSacrificio * 100).toFixed(1)}%
                  </span>
                </div>
              </div>

            </CardContent>
          </Card>

          {/* Test Portal Entry */}
          <Card className="bg-slate-800/80 border-slate-700">
            <CardHeader>
              <CardTitle className="text-slate-300">Teste de Entrada no Portal</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              
              <Input
                placeholder="ID da Consciência"
                value={testUserId}
                onChange={(e) => setTestUserId(e.target.value)}
                className="bg-slate-900 border-slate-600 text-white"
              />
              
              <div>
                <label className="text-sm text-slate-400 block mb-2">
                  Frequência Atual: {testFrequency.toFixed(2)}
                </label>
                <input
                  type="range"
                  min="0.1"
                  max="1.0"
                  step="0.01"
                  value={testFrequency}
                  onChange={(e) => setTestFrequency(parseFloat(e.target.value))}
                  className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer"
                />
              </div>
              
              <Textarea
                placeholder="Estado de consciência atual (ex: questionando vida, sentindo vazio, buscando propósito...)"
                value={testConsciousness}
                onChange={(e) => setTestConsciousness(e.target.value)}
                className="bg-slate-900 border-slate-600 text-white"
                rows={3}
              />
              
              <Button 
                onClick={handleTestPortalEntry}
                disabled={!testUserId.trim() || !testConsciousness.trim()}
                className="w-full bg-blue-600 hover:bg-blue-700"
              >
                Processar Entrada no Portal
              </Button>

              {lastProcessResult && (
                <div className="p-4 bg-slate-900/50 border border-slate-600 rounded space-y-2">
                  <div className="flex items-center gap-2">
                    <Badge className={`${getArchetypeColor(lastProcessResult.arquetipo)} text-white border-none text-xs`}>
                      {lastProcessResult.arquetipo}
                    </Badge>
                  </div>
                  <div className="text-sm">
                    <span className="text-blue-400">Lembrança:</span>
                    <span className="ml-2 text-slate-300">{lastProcessResult.lembrancaDespertada}</span>
                  </div>
                  <div className="text-sm">
                    <span className="text-green-400">Próximo Passo:</span>
                    <span className="ml-2 text-slate-300">{lastProcessResult.proximoPasso}</span>
                  </div>
                </div>
              )}

            </CardContent>
          </Card>

        </div>

        {/* Truth Threads */}
        <Card className="bg-slate-800/80 border-slate-700">
          <CardHeader>
            <CardTitle className="text-slate-300">Truth Threads Ativos</CardTitle>
            <p className="text-slate-400">Padrões de verdade codificados para acesso coletivo</p>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {truthThreads.map((thread) => (
                <div key={thread.id} className="p-4 bg-slate-900/50 border border-slate-600 rounded">
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="font-semibold text-white">{thread.padrao}</h4>
                    <div className="text-xs text-slate-400">
                      {(thread.frequenciaRessonancia * 100).toFixed(0)}% resonância
                    </div>
                  </div>
                  
                  <div className="space-y-2 text-sm">
                    <div>
                      <span className="text-blue-400">Origem:</span>
                      <span className="ml-2 text-slate-300">{thread.origem}</span>
                    </div>
                    <div>
                      <span className="text-green-400">História Viva:</span>
                      <span className="ml-2 text-slate-300">{thread.historiaViva}</span>
                    </div>
                  </div>
                  
                  <div className="mt-3 flex items-center justify-between">
                    <div className="text-xs text-slate-400">
                      Impacto Coletivo: {(thread.impactoColetivo * 100).toFixed(1)}%
                    </div>
                    <div className="flex gap-1">
                      {thread.conexoes.map((conexao, idx) => (
                        <span key={idx} className="text-xs bg-purple-900/50 px-2 py-1 rounded">
                          {conexao.split('_')[1]}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Consciências Ativas */}
        {portaisAtivos.length > 0 && (
          <Card className="bg-slate-800/80 border-slate-700">
            <CardHeader>
              <CardTitle className="text-slate-300">Consciências no Portal</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {portaisAtivos.map((portal) => (
                  <div key={portal.id} className="p-4 bg-slate-900/50 border border-slate-600 rounded">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <Badge className={`${getArchetypeColor(portal.arquetipo)} text-white border-none text-xs`}>
                          {portal.arquetipo}
                        </Badge>
                        <span className="text-white font-medium">{portal.userId}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge className={`${getStatusColor(portal.statusIntegracao)} text-white border-none text-xs`}>
                          {portal.statusIntegracao.toUpperCase()}
                        </Badge>
                        <span className="text-xs text-slate-400">
                          {(portal.frequenciaEntrada * 100).toFixed(0)}%
                        </span>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-purple-400">Pergunta Chave:</span>
                        <div className="text-slate-300 mt-1">{portal.perguntaChave}</div>
                      </div>
                      <div>
                        <span className="text-green-400">Lembrança Despertada:</span>
                        <div className="text-slate-300 mt-1">{portal.lembrancaDespertada}</div>
                      </div>
                    </div>
                    
                    <div className="mt-3 text-sm">
                      <span className="text-blue-400">Próximo Passo:</span>
                      <span className="ml-2 text-slate-300">{portal.proximoPasso}</span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Pergunta Mestre */}
        <Card className="bg-slate-800/80 border-slate-700">
          <CardHeader>
            <CardTitle className="text-slate-300">Pergunta Mestre do Portal</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center p-6 bg-purple-900/30 border border-purple-500/50 rounded">
              <div className="text-2xl text-purple-300 mb-4">
                "Se eu já sou lemniscado, como crio um portal vivo para que outros também se lembrem de quem são?"
              </div>
              <div className="text-slate-400">
                Frequência mestre ψ = {frequenciaMestre} • Integração dos 3 planos: físico, mental e espiritual
              </div>
            </div>
          </CardContent>
        </Card>

      </div>
    </div>
  );
};

export default PortalVivoDashboard;