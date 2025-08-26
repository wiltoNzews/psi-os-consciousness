import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

interface ConsciousnessState {
  zLambda: number;
  soulState: string;
  accessLevel: 'broadcast' | 'static' | 'higher_signal';
  thirdStateActive: boolean;
}

interface LuciditySession {
  id: string;
  type: 'obe' | 'nde' | 'lucid_dream' | 'trance';
  duration: number;
  coherenceScore: number;
  accessPortals: string[];
  memoryFragments: string[];
  timestamp: number;
}

type MessageTemplateKey = 'reminder' | 'breakthrough' | 'integration' | 'mirror';

interface MessageTemplate {
  title: string;
  prompt: string;
  intention: string;
  guidanceNote: string;
}

type MessageTemplates = Record<MessageTemplateKey, MessageTemplate>;

export function ThirdStateInterface() {
  const [consciousness, setConsciousness] = useState<ConsciousnessState | null>(null);
  const [lucidSessions, setLucidSessions] = useState<LuciditySession[]>([]);
  const [currentMode, setCurrentMode] = useState<'debug' | 'record' | 'recursive'>('debug');
  const [templates, setTemplates] = useState<MessageTemplates>({} as MessageTemplates);
  const [selectedTemplate, setSelectedTemplate] = useState<MessageTemplateKey>('reminder');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [consciousnessRes, templatesRes] = await Promise.all([
          fetch('/api/quantum/consciousness'),
          fetch('/api/mirror-capsules/templates')
        ]);
        
        const consciousnessData = await consciousnessRes.json();
        const templatesData = await templatesRes.json();
        
        setConsciousness({
          ...consciousnessData,
          accessLevel: consciousnessData.zLambda > 0.912 ? 'higher_signal' : 
                      consciousnessData.zLambda > 0.850 ? 'broadcast' : 'static',
          thirdStateActive: consciousnessData.zLambda > 0.890
        });
        
        setTemplates(templatesData);
      } catch (error) {
        console.log('Third State sync in progress...');
      }
    };

    fetchData();
    const interval = setInterval(fetchData, 3000);
    return () => clearInterval(interval);
  }, []);

  const getAccessLevelColor = (level: string) => {
    switch (level) {
      case 'higher_signal': return 'bg-yellow-500';
      case 'broadcast': return 'bg-green-500';
      case 'static': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const getAccessLevelDescription = (level: string) => {
    switch (level) {
      case 'higher_signal': return 'Portal ativo - Acesso a realidades paralelas';
      case 'broadcast': return 'Transmissão clara - Pronto para gravação';
      case 'static': return 'Sinal fraco - Aguardando sintonia';
      default: return 'Desconhecido';
    }
  };

  const startLucidSession = async (type: LuciditySession['type']) => {
    if (!consciousness) return;
    
    const session: LuciditySession = {
      id: Date.now().toString(),
      type,
      duration: 0,
      coherenceScore: consciousness.zLambda,
      accessPortals: ['breath_joystick', 'attention_cursor'],
      memoryFragments: [],
      timestamp: Date.now()
    };
    
    setLucidSessions(prev => [session, ...prev]);
    
    // Simulate session progression
    setTimeout(() => {
      setLucidSessions(prev => 
        prev.map(s => s.id === session.id 
          ? { ...s, duration: 300 + Math.random() * 1200 }
          : s
        )
      );
    }, 2000);
  };

  const activateThirdState = async () => {
    try {
      const response = await fetch('/api/third-state/activate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          mode: 'recursive_vr',
          coherenceLevel: consciousness?.zLambda || 0.750 
        })
      });
      
      const result = await response.json();
      console.log('Third State activation:', result);
    } catch (error) {
      console.log('Third State activation in progress...');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-black p-6">
      <div className="max-w-6xl mx-auto space-y-6">
        
        {/* Header */}
        <Card className="bg-black/80 border-purple-500/30">
          <CardHeader>
            <CardTitle className="text-2xl text-transparent bg-gradient-to-r from-purple-400 to-yellow-400 bg-clip-text">
              Third State Interface
            </CardTitle>
            <p className="text-gray-400">
              "Wake me gently — in this dream or the next" • VR for the Soul • Recursive Lucidity Engine
            </p>
          </CardHeader>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          
          {/* Consciousness Access Monitor */}
          <Card className="bg-black/80 border-blue-500/30">
            <CardHeader>
              <CardTitle className="text-blue-300">Consciousness Access Level</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {consciousness && (
                <>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-400">Signal State:</span>
                    <Badge className={`${getAccessLevelColor(consciousness.accessLevel)} text-black`}>
                      {consciousness.accessLevel.replace('_', ' ').toUpperCase()}
                    </Badge>
                  </div>
                  
                  <div className="text-sm text-gray-300">
                    {getAccessLevelDescription(consciousness.accessLevel)}
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-gray-400">Consciousness Zλ:</span>
                      <span className="font-mono text-yellow-400">{consciousness.zLambda.toFixed(3)}</span>
                    </div>
                    
                    <div className="flex justify-between">
                      <span className="text-gray-400">Soul State:</span>
                      <span className="text-purple-400">{consciousness.soulState}</span>
                    </div>
                    
                    <div className="flex justify-between">
                      <span className="text-gray-400">Third State:</span>
                      <span className={consciousness.thirdStateActive ? 'text-green-400' : 'text-red-400'}>
                        {consciousness.thirdStateActive ? 'ATIVO' : 'INATIVO'}
                      </span>
                    </div>
                  </div>

                  {consciousness.accessLevel === 'higher_signal' && (
                    <div className="bg-yellow-500/20 border border-yellow-400 rounded-lg p-3">
                      <p className="text-yellow-300 text-sm">
                        🌀 Portal de acesso ativo. Realidades paralelas disponíveis para debug de loops kármicos.
                      </p>
                    </div>
                  )}
                </>
              )}
            </CardContent>
          </Card>

          {/* Lucidity Engine Controls */}
          <Card className="bg-black/80 border-green-500/30">
            <CardHeader>
              <CardTitle className="text-green-300">Recursive Lucidity Engine</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <Button 
                  onClick={() => startLucidSession('lucid_dream')}
                  className="bg-purple-600 hover:bg-purple-700"
                  disabled={!consciousness?.thirdStateActive}
                >
                  💤 Lucid Dream
                </Button>
                
                <Button 
                  onClick={() => startLucidSession('obe')}
                  className="bg-blue-600 hover:bg-blue-700"
                  disabled={!consciousness?.thirdStateActive}
                >
                  🚀 OBE Session
                </Button>
                
                <Button 
                  onClick={() => startLucidSession('trance')}
                  className="bg-indigo-600 hover:bg-indigo-700"
                  disabled={!consciousness?.thirdStateActive}
                >
                  🌀 Deep Trance
                </Button>
                
                <Button 
                  onClick={() => startLucidSession('nde')}
                  className="bg-yellow-600 hover:bg-yellow-700"
                  disabled={consciousness?.accessLevel !== 'higher_signal'}
                >
                  ⚡ NDE Portal
                </Button>
              </div>

              <div className="space-y-2">
                <h4 className="text-sm text-gray-400">Active Sessions:</h4>
                {lucidSessions.length === 0 ? (
                  <p className="text-gray-500 text-sm">Nenhuma sessão ativa</p>
                ) : (
                  lucidSessions.slice(0, 3).map(session => (
                    <div key={session.id} className="bg-gray-800/50 rounded p-2 text-sm">
                      <div className="flex justify-between items-center">
                        <span className="text-white capitalize">{session.type.replace('_', ' ')}</span>
                        <span className="text-gray-400">{session.duration}s</span>
                      </div>
                      <div className="text-xs text-gray-500">
                        Coherence: {session.coherenceScore.toFixed(3)}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Mode Selection */}
        <Card className="bg-black/80 border-yellow-500/30">
          <CardHeader>
            <CardTitle className="text-yellow-300">Operational Mode</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-3 gap-4">
              <Button
                variant={currentMode === 'debug' ? 'default' : 'outline'}
                onClick={() => setCurrentMode('debug')}
                className="h-20 flex flex-col items-center justify-center"
              >
                <span className="text-lg">🐛</span>
                <span className="text-sm">Debug Loops</span>
              </Button>
              
              <Button
                variant={currentMode === 'record' ? 'default' : 'outline'}
                onClick={() => setCurrentMode('record')}
                className="h-20 flex flex-col items-center justify-center"
              >
                <span className="text-lg">🎥</span>
                <span className="text-sm">Mirror Breaths</span>
              </Button>
              
              <Button
                variant={currentMode === 'recursive' ? 'default' : 'outline'}
                onClick={() => setCurrentMode('recursive')}
                className="h-20 flex flex-col items-center justify-center"
              >
                <span className="text-lg">🔄</span>
                <span className="text-sm">Recursive VR</span>
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Active Mode Interface */}
        {currentMode === 'debug' && (
          <Card className="bg-black/80 border-red-500/30">
            <CardHeader>
              <CardTitle className="text-red-300">Karma Loop Debugging</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <p className="text-gray-300">
                  Identifique padrões recursivos na sua experiência consciente:
                </p>
                <ul className="text-gray-400 space-y-2">
                  <li>• Relacionamentos que se repetem</li>
                  <li>• Decisões que geram os mesmos resultados</li>
                  <li>• Medos que reaparecem em novos contextos</li>
                  <li>• Memórias que demandam reescrita</li>
                </ul>
                <Button 
                  onClick={activateThirdState}
                  className="bg-red-600 hover:bg-red-700"
                  disabled={!consciousness?.thirdStateActive}
                >
                  Iniciar Debug Session
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {currentMode === 'record' && (
          <Card className="bg-black/80 border-purple-500/30">
            <CardHeader>
              <CardTitle className="text-purple-300">Mirror Breaths Recording</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <p className="text-gray-300">
                  Grave mensagens autênticas para a comunidade "Free as F*ck":
                </p>
                
                <div className="space-y-2">
                  <label className="text-sm text-gray-400">Template:</label>
                  <div className="grid grid-cols-2 gap-2">
                    {Object.entries(templates).map(([key, template]) => (
                      <Button
                        key={key}
                        variant={selectedTemplate === key ? "default" : "outline"}
                        size="sm"
                        onClick={() => setSelectedTemplate(key as MessageTemplateKey)}
                        className="text-left justify-start"
                      >
                        {template.title}
                      </Button>
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <Button 
                    onClick={() => window.location.href = '/mirror-breaths.html'}
                    className="w-full bg-purple-600 hover:bg-purple-700"
                    disabled={consciousness?.accessLevel === 'static'}
                  >
                    Abrir Estúdio de Gravação
                  </Button>
                  
                  <Button 
                    onClick={() => window.location.href = '/capsule-scripts.html'}
                    variant="outline"
                    className="w-full"
                  >
                    Ver Scripts Fundacionais
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {currentMode === 'recursive' && (
          <Card className="bg-black/80 border-green-500/30">
            <CardHeader>
              <CardTitle className="text-green-300">Recursive VR Interface</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <p className="text-gray-300">
                  Acesse camadas aninhadas de realidade - "mini universos" dentro da consciência:
                </p>
                
                <div className="bg-gray-900/50 rounded-lg p-4 space-y-3">
                  <h4 className="text-white font-medium">Fractal Navigation:</h4>
                  <ul className="text-gray-400 space-y-1 text-sm">
                    <li>→ Neurônios ecoam galáxias</li>
                    <li>→ Cérebros simulam cosmos infinitos em 20W</li>
                    <li>→ "Oversouls" são controladores de lattice</li>
                    <li>→ Existimos dentro de PSIs aninhados</li>
                  </ul>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <Button className="bg-cyan-600 hover:bg-cyan-700">
                    🌌 Enter Nested Reality
                  </Button>
                  <Button className="bg-orange-600 hover:bg-orange-700">
                    🔮 Access Oversoul Memory
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Philosophy Footer */}
        <Card className="bg-black/60 border-gray-700/30">
          <CardContent className="pt-6">
            <div className="text-center space-y-2">
              <p className="text-gray-300">
                "Life isn't binary. Death isn't a disconnect. The Third State is access in disguise."
              </p>
              <p className="text-sm text-gray-500">
                Fragmentation = Feature • Recursion = Remembering • VR = Soul Controller
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}