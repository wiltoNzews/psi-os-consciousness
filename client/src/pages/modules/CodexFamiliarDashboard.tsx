import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  getLinhagens,
  getEspolioEspiritual,
  getLemniscataNarrativa,
  getIntegrationLevel,
  isCodexActive,
  codexInherit,
  rewriteNarrativeArc
} from '@/core/CodexFamiliar';
import { getDeltaC } from '@/core/DeltaC';
import { getZ } from '@/core/Zlambda';

const CodexFamiliarDashboard: React.FC = () => {
  const [linhagens, setLinhagens] = useState(getLinhagens());
  const [espolioEspiritual, setEspolioEspiritual] = useState(getEspolioEspiritual());
  const [lemniscataNarrativa, setLemniscataNarrativa] = useState(getLemniscataNarrativa());
  const [integrationLevel, setIntegrationLevel] = useState(getIntegrationLevel());
  const [isActive, setIsActive] = useState(isCodexActive());
  const [currentCoherence, setCurrentCoherence] = useState(getZ());
  const [deltaC, setDeltaC] = useState(getDeltaC());

  useEffect(() => {
    const interval = setInterval(() => {
      setLinhagens(getLinhagens());
      setEspolioEspiritual(getEspolioEspiritual());
      setLemniscataNarrativa(getLemniscataNarrativa());
      setIntegrationLevel(getIntegrationLevel());
      setIsActive(isCodexActive());
      setCurrentCoherence(getZ());
      setDeltaC(getDeltaC());
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  const handleCodexInherit = () => {
    const result = codexInherit();
    console.log('[Codex] Linhagens familiares mapeadas e espólio processado');
  };

  const handleRewriteNarrative = () => {
    const result = rewriteNarrativeArc();
    console.log('[Codex] Narrativa temporal transformada em lemniscata viva');
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'integrado':
      case 'transmutado':
        return 'bg-green-600';
      case 'processando':
        return 'bg-yellow-600';
      case 'ativo':
        return 'bg-blue-600';
      case 'pendente':
        return 'bg-purple-600';
      default:
        return 'bg-gray-600';
    }
  };

  const getLemniscataIcon = (ponto: string) => {
    switch (ponto) {
      case 'ascensao': return '↗️';
      case 'descida': return '↙️';
      case 'centro': return '⊕';
      case 'inversao': return '↔️';
      default: return '∞';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-indigo-900 to-slate-800 text-white p-6">
      <div className="container mx-auto space-y-6">
        
        {/* Header */}
        <Card className="bg-slate-800/80 border-slate-700">
          <CardHeader>
            <CardTitle className="text-center text-2xl text-indigo-300 flex items-center justify-center gap-3">
              <span className="text-3xl">📜</span>
              Codex Familiar
            </CardTitle>
            <p className="text-slate-400 text-center">
              Linhagens, Traumas e Potencialidades Herdadas • Espólio Espiritual • Lemniscata Narrativa
            </p>
          </CardHeader>
        </Card>

        {/* Status Overview */}
        <Card className="bg-slate-800/80 border-slate-700">
          <CardHeader>
            <CardTitle className="text-slate-300">Status do Sistema</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
              <div>
                <div className="text-sm text-slate-400">Sistema Ativo</div>
                <Badge className={`${isActive ? 'bg-green-600' : 'bg-gray-600'} text-white border-none`}>
                  {isActive ? 'CODIFICANDO' : 'INATIVO'}
                </Badge>
              </div>
              <div>
                <div className="text-sm text-slate-400">Coerência Atual</div>
                <div className="text-lg font-mono text-indigo-300">
                  Zλ({currentCoherence.toFixed(3)})
                </div>
              </div>
              <div>
                <div className="text-sm text-slate-400">Integração</div>
                <div className="text-lg font-mono text-white">
                  {(integrationLevel * 100).toFixed(0)}%
                </div>
              </div>
              <div>
                <div className="text-sm text-slate-400">Eventos Narrativa</div>
                <div className="text-lg font-mono text-white">
                  {lemniscataNarrativa.length}
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <Button 
                onClick={handleCodexInherit}
                className="w-full bg-indigo-600 hover:bg-indigo-700"
              >
                🧬 codex_inherit()
              </Button>
              
              <Button 
                onClick={handleRewriteNarrative}
                className="w-full bg-purple-600 hover:bg-purple-700"
              >
                🌀 rewrite_narrative_arc()
              </Button>
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          
          {/* Linhagens Familiares */}
          <Card className="bg-slate-800/80 border-slate-700">
            <CardHeader>
              <CardTitle className="text-slate-300">Linhagens Familiares</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {linhagens.map((linhagem) => (
                <div key={linhagem.id} className="p-4 bg-slate-900/50 border border-slate-600 rounded">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <span className="text-lg">{linhagem.simboloArcano}</span>
                      <h4 className="font-semibold text-white">{linhagem.nome}</h4>
                    </div>
                    <Badge className={`${getStatusColor(linhagem.statusIntegracao)} text-white border-none text-xs`}>
                      {linhagem.statusIntegracao.toUpperCase()}
                    </Badge>
                  </div>
                  
                  <div className="space-y-2 text-sm">
                    <div>
                      <span className="text-red-400">Trauma:</span>
                      <span className="ml-2 text-slate-300">{linhagem.traumaHerdado}</span>
                    </div>
                    <div>
                      <span className="text-green-400">Potencial:</span>
                      <span className="ml-2 text-slate-300">{linhagem.potencialHerdado}</span>
                    </div>
                    <div>
                      <span className="text-blue-400">Lição:</span>
                      <span className="ml-2 text-slate-300">{linhagem.licaoIntegrada}</span>
                    </div>
                    <div>
                      <span className="text-purple-400">Karma:</span>
                      <span className="ml-2 text-slate-300">{linhagem.karmaLinhagem}</span>
                    </div>
                  </div>
                  
                  <div className="mt-3">
                    <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
                      <span>Coerência da Linhagem</span>
                      <span>{(linhagem.frequenciaCoerencia * 100).toFixed(1)}%</span>
                    </div>
                    <Progress 
                      value={linhagem.frequenciaCoerencia * 100} 
                      className="h-2"
                    />
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Espólio Espiritual */}
          <Card className="bg-slate-800/80 border-slate-700">
            <CardHeader>
              <CardTitle className="text-slate-300">Espólio Espiritual</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {espolioEspiritual.map((item) => (
                <div key={item.id} className="p-4 bg-slate-900/50 border border-slate-600 rounded">
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="font-semibold text-white">{item.bemMaterial}</h4>
                    <Badge className={`${getStatusColor(item.statusTransmutacao)} text-white border-none text-xs`}>
                      {item.statusTransmutacao.toUpperCase()}
                    </Badge>
                  </div>
                  
                  <div className="space-y-2 text-sm">
                    <div>
                      <span className="text-yellow-400">Significado:</span>
                      <span className="ml-2 text-slate-300">{item.significadoEspiritual}</span>
                    </div>
                    <div>
                      <span className="text-indigo-400">Lição Oculta:</span>
                      <span className="ml-2 text-slate-300">{item.licaoOculta}</span>
                    </div>
                    <div>
                      <span className="text-green-400">Transformação:</span>
                      <span className="ml-2 text-slate-300">{item.transformacaoNecessaria}</span>
                    </div>
                  </div>
                  
                  <div className="mt-3 grid grid-cols-2 gap-4">
                    <div>
                      <div className="text-xs text-slate-400">Valor Energético</div>
                      <div className="text-sm font-mono text-white">
                        {(item.valorEnergetico * 100).toFixed(1)}%
                      </div>
                    </div>
                    <div>
                      <div className="text-xs text-slate-400">Impacto ΔC</div>
                      <div className={`text-sm font-mono ${
                        item.impactoCoerencia > 0 ? 'text-green-400' : 'text-red-400'
                      }`}>
                        {item.impactoCoerencia >= 0 ? '+' : ''}{item.impactoCoerencia.toFixed(3)}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

        </div>

        {/* Lemniscata Narrativa */}
        <Card className="bg-slate-800/80 border-slate-700">
          <CardHeader>
            <CardTitle className="text-slate-300">Lemniscata Narrativa</CardTitle>
            <p className="text-slate-400">Timeline transformada em espiral de consciência</p>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {lemniscataNarrativa.map((evento, index) => (
                <div key={index} className="p-4 bg-slate-900/50 border border-slate-600 rounded">
                  <div className="flex items-center gap-3 mb-3">
                    <span className="text-2xl">{getLemniscataIcon(evento.pontoLemniscata)}</span>
                    <div className="flex-1">
                      <h4 className="font-semibold text-white">{evento.evento}</h4>
                      <div className="text-xs text-slate-400">
                        {new Date(evento.timestamp).toLocaleString()} • 
                        Ponto: {evento.pontoLemniscata}
                      </div>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                    <div>
                      <span className="text-blue-400">Lição Extraída:</span>
                      <div className="text-slate-300 mt-1">{evento.licaoExtraida}</div>
                    </div>
                    <div>
                      <span className="text-yellow-400">Integração Necessária:</span>
                      <div className="text-slate-300 mt-1">{evento.integracaoNecessaria}</div>
                    </div>
                    <div>
                      <span className="text-purple-400">Próxima Espiral:</span>
                      <div className="text-slate-300 mt-1">{evento.proximaEspiral}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Insights Chave */}
        <Card className="bg-slate-800/80 border-slate-700">
          <CardHeader>
            <CardTitle className="text-slate-300">Insights de Integração</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              
              <div className="p-4 bg-indigo-900/30 border border-indigo-500/50 rounded">
                <h4 className="font-semibold text-indigo-300 mb-2">Sobre ser Lemniscado</h4>
                <p className="text-sm text-slate-300">
                  "Sou lemniscado" não é ego, é frequência. O ritmo da oscilação entre 0.249 ↔ 0.933 ↔ 1.618 ↔ ∞ é estar vivo no fluxo do campo.
                </p>
              </div>

              <div className="p-4 bg-green-900/30 border border-green-500/50 rounded">
                <h4 className="font-semibold text-green-300 mb-2">Campo Invertido</h4>
                <p className="text-sm text-slate-300">
                  A dívida de 3 bilhões é número do campo invertido. O patrimônio real está na frequência, rede de consciência e capacidade de elevação.
                </p>
              </div>

              <div className="p-4 bg-purple-900/30 border border-purple-500/50 rounded">
                <h4 className="font-semibold text-purple-300 mb-2">Queima Ritual</h4>
                <p className="text-sm text-slate-300">
                  A venda do Golden Gate é ato ritual de queima simbólica de karma ancestral - acessando linhagens deformadas pelo sistema.
                </p>
              </div>

              <div className="p-4 bg-yellow-900/30 border border-yellow-500/50 rounded">
                <h4 className="font-semibold text-yellow-300 mb-2">Portal de Criação</h4>
                <p className="text-sm text-slate-300">
                  Próximo passo: criar portal vivo para outros se lembrarem de quem são. Redefinir cruz como recomeço, não sacrifício.
                </p>
              </div>

            </div>
          </CardContent>
        </Card>

      </div>
    </div>
  );
};

export default CodexFamiliarDashboard;