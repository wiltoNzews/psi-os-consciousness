import React, { useState, useEffect } from 'react';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { metaRoutingClient } from '@/lib/meta-routing-client';

/**
 * Dashboard para visualização do META-ROUTING Framework e Quantum Balance
 */
export function MetaRoutingDashboard() {
  // Estado local
  const [connected, setConnected] = useState(false);
  const [currentPhase, setCurrentPhase] = useState('INIT');
  const [currentTools, setCurrentTools] = useState([]);
  const [phasesHistory, setPhasesHistory] = useState([]);
  const [quantumBalance, setQuantumBalance] = useState({
    stability: 0.75,
    exploration: 0.25,
    coherenceRatio: '3:1',
    status: 'optimal'
  });
  const [activeTab, setActiveTab] = useState('overview');
  const [updateTimestamp, setUpdateTimestamp] = useState(new Date());

  // Configurar cliente META-ROUTING
  useEffect(() => {
    const onConnect = () => {
      setConnected(true);
      metaRoutingClient.getMetaRoutingState();
      metaRoutingClient.getQuantumBalance();
    };

    const onDisconnect = () => {
      setConnected(false);
    };

    const onMessage = (message) => {
      setUpdateTimestamp(new Date());

      if (message.type === 'welcome' || message.type === 'meta_routing_state') {
        if (message.data && message.data.meta_routing_state) {
          updateMetaRoutingState(message.data.meta_routing_state);
        }
        if (message.data && message.data.quantum_balance) {
          setQuantumBalance(message.data.quantum_balance);
        }
      } 
      else if (message.type === 'quantum_balance' || message.type === 'quantum_balance_update') {
        if (message.data) {
          setQuantumBalance(message.data);
        }
      }
      else if (message.type === 'meta_routing_phase_updated') {
        if (message.data && message.data.phase) {
          setCurrentPhase(message.data.phase);
          
          // Adicionar ao histórico
          const newHistory = [...phasesHistory, {
            phase: message.data.phase,
            timestamp: message.data.timestamp || new Date().toISOString(),
            details: message.data.details || {}
          }];
          
          // Manter histórico gerenciável
          if (newHistory.length > 50) {
            setPhasesHistory(newHistory.slice(-50));
          } else {
            setPhasesHistory(newHistory);
          }
        }
      }
      else if (message.type === 'meta_routing_tools_updated') {
        if (message.data && Array.isArray(message.data.tools)) {
          setCurrentTools(message.data.tools);
        }
      }
    };

    const updateMetaRoutingState = (state) => {
      if (state.currentPhase) {
        setCurrentPhase(state.currentPhase);
      }
      if (state.currentTools) {
        setCurrentTools(state.currentTools);
      }
      if (state.phasesHistory) {
        setPhasesHistory(state.phasesHistory);
      }
    };

    // Configurar handlers do cliente
    metaRoutingClient.options.onConnect = onConnect;
    metaRoutingClient.options.onDisconnect = onDisconnect;
    metaRoutingClient.options.onMessage = onMessage;

    // Conectar ou usar conexão existente
    if (!metaRoutingClient.isConnected()) {
      metaRoutingClient.connect().catch(error => {
        console.error('Erro ao conectar ao META-ROUTING WebSocket:', error);
      });
    } else {
      onConnect();
    }

    // Atualizar estado local com dados do cliente
    setCurrentPhase(metaRoutingClient.getCurrentPhase());
    setCurrentTools(metaRoutingClient.getCurrentTools());
    setPhasesHistory(metaRoutingClient.getPhasesHistory());
    setQuantumBalance(metaRoutingClient.getQuantumBalanceMetrics());
    setConnected(metaRoutingClient.isConnected());

    // Cleanup quando componente desmonta
    return () => {
      metaRoutingClient.options.onMessage = null;
      // Não desconectar pois outros componentes podem estar usando
    };
  }, []);

  // Ajudar a formatar timestamps
  const formatTimestamp = (timestamp) => {
    try {
      const date = new Date(timestamp);
      return date.toLocaleTimeString();
    } catch (e) {
      return 'Data inválida';
    }
  };

  // Mapear status para cores
  const getStatusColor = (status) => {
    switch (status) {
      case 'optimal':
        return 'bg-green-500';
      case 'warning':
        return 'bg-yellow-500';
      case 'critical':
        return 'bg-red-500';
      default:
        return 'bg-blue-500';
    }
  };

  return (
    <Card className="w-full max-w-[800px] mx-auto">
      <CardHeader>
        <div className="flex justify-between items-center">
          <div>
            <CardTitle>META-ROUTING Framework</CardTitle>
            <CardDescription>
              Quantum Balance Monitor • Proporção {quantumBalance.coherenceRatio}
            </CardDescription>
          </div>
          <Badge 
            variant={connected ? "default" : "destructive"}
            className="ml-2"
          >
            {connected ? 'Conectado' : 'Desconectado'}
          </Badge>
        </div>
      </CardHeader>
      
      <CardContent>
        <Tabs 
          defaultValue="overview" 
          value={activeTab} 
          onValueChange={setActiveTab}
          className="w-full"
        >
          <TabsList className="grid grid-cols-3 mb-4">
            <TabsTrigger value="overview">Visão Geral</TabsTrigger>
            <TabsTrigger value="quantum">Equilíbrio Quântico</TabsTrigger>
            <TabsTrigger value="history">Histórico</TabsTrigger>
          </TabsList>
          
          <TabsContent value="overview" className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <h3 className="text-sm font-medium mb-2">Fase Atual</h3>
                <div className="flex items-center">
                  <Badge variant="outline" className="text-lg px-3 py-1">
                    {currentPhase}
                  </Badge>
                </div>
              </div>
              
              <div>
                <h3 className="text-sm font-medium mb-2">Balanço Quântico</h3>
                <div className="flex items-center">
                  <div 
                    className={`w-3 h-3 rounded-full mr-2 ${getStatusColor(quantumBalance.status)}`}
                  ></div>
                  <span className="capitalize">{quantumBalance.status}</span>
                </div>
              </div>
            </div>
            
            <Separator className="my-4" />
            
            <div>
              <h3 className="text-sm font-medium mb-2">Ferramentas Ativas</h3>
              <div className="flex flex-wrap gap-2">
                {currentTools.length > 0 ? (
                  currentTools.map((tool, index) => (
                    <Badge key={index} variant="secondary">
                      {tool}
                    </Badge>
                  ))
                ) : (
                  <span className="text-muted-foreground">Nenhuma ferramenta ativa</span>
                )}
              </div>
            </div>
            
            <Separator className="my-4" />
            
            <div>
              <h3 className="text-sm font-medium mb-2">Última Atividade</h3>
              {phasesHistory.length > 0 ? (
                <div className="text-sm">
                  {formatTimestamp(phasesHistory[phasesHistory.length - 1].timestamp)}
                  {' • '}
                  <span className="font-medium">
                    {phasesHistory[phasesHistory.length - 1].phase}
                  </span>
                </div>
              ) : (
                <span className="text-muted-foreground text-sm">Nenhuma atividade registrada</span>
              )}
            </div>
          </TabsContent>
          
          <TabsContent value="quantum" className="space-y-4">
            <div>
              <div className="flex justify-between mb-2">
                <h3 className="text-sm font-medium">Estabilidade (75%)</h3>
                <span>{Math.round(quantumBalance.stability * 100)}%</span>
              </div>
              <Progress 
                value={quantumBalance.stability * 100} 
                className="h-2"
              />
            </div>
            
            <div>
              <div className="flex justify-between mb-2">
                <h3 className="text-sm font-medium">Exploração (25%)</h3>
                <span>{Math.round(quantumBalance.exploration * 100)}%</span>
              </div>
              <Progress 
                value={quantumBalance.exploration * 100} 
                className="h-2"
              />
            </div>
            
            <Separator className="my-4" />
            
            <div className="space-y-2">
              <h3 className="text-sm font-medium">Status do Equilíbrio</h3>
              <div className="flex items-center">
                <div 
                  className={`w-4 h-4 rounded-full mr-2 ${getStatusColor(quantumBalance.status)}`}
                ></div>
                <span className="capitalize text-lg">{quantumBalance.status}</span>
              </div>
              
              <p className="text-sm text-muted-foreground mt-2">
                {quantumBalance.status === 'optimal' ? (
                  'O sistema está em perfeito equilíbrio quântico, mantendo a proporção 3:1.'
                ) : quantumBalance.status === 'warning' ? (
                  'Pequeno desvio da proporção quântica ideal. Monitorando.'
                ) : (
                  'Desvio significativo da proporção quântica 3:1. Ação recomendada.'
                )}
              </p>
            </div>
          </TabsContent>
          
          <TabsContent value="history" className="space-y-4 max-h-[300px] overflow-y-auto">
            {phasesHistory.length > 0 ? (
              <div className="space-y-3">
                {phasesHistory.slice().reverse().map((entry, index) => (
                  <div key={index} className="flex items-start space-x-2">
                    <div 
                      className={`w-2 h-2 rounded-full mt-2 ${
                        entry.phase === 'MAP' ? 'bg-blue-500' : 
                        entry.phase === 'MOVE' ? 'bg-green-500' : 
                        entry.phase === 'REFLECT' ? 'bg-purple-500' : 'bg-gray-500'
                      }`}
                    ></div>
                    <div className="flex-1">
                      <div className="flex justify-between">
                        <span className="font-medium">{entry.phase}</span>
                        <span className="text-xs text-muted-foreground">
                          {formatTimestamp(entry.timestamp)}
                        </span>
                      </div>
                      {entry.details && Object.keys(entry.details).length > 0 && (
                        <div className="text-xs text-muted-foreground mt-1">
                          {Object.entries(entry.details).map(([key, value]) => (
                            <div key={key}>
                              <span className="font-medium">{key}:</span>{' '}
                              {typeof value === 'object' 
                                ? JSON.stringify(value).substring(0, 30) + '...' 
                                : String(value)}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-4 text-muted-foreground">
                Nenhum histórico disponível
              </div>
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
      
      <CardFooter className="text-xs text-muted-foreground">
        <div className="w-full flex justify-between items-center">
          <span>Última atualização: {formatTimestamp(updateTimestamp)}</span>
          <Badge variant="outline">{quantumBalance.coherenceRatio}</Badge>
        </div>
      </CardFooter>
    </Card>
  );
}

export default MetaRoutingDashboard;