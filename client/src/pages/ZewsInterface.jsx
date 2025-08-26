import React, { useState, useEffect, useRef } from 'react';
import { useQuery } from '@tanstack/react-query';
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle, 
  CardDescription, 
  CardFooter 
} from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useToast } from '@/hooks/use-toast';
import { apiRequest } from '@/lib/queryClient';

// Componente ZEWS Interface para interação com o sistema ritual-simbólico
export default function ZewsInterface() {
  // Estados para interação com o sistema
  const [command, setCommand] = useState('');
  const [activeTab, setActiveTab] = useState('command');
  const [selectedRitual, setSelectedRitual] = useState('');
  const [selectedScene, setSelectedScene] = useState('');
  const [commandHistory, setCommandHistory] = useState([]);
  const [maxHistoryItems, setMaxHistoryItems] = useState(100);
  const [wsConnected, setWsConnected] = useState(false);
  const [systemState, setSystemState] = useState(null);
  const [newRitualName, setNewRitualName] = useState('');
  const [newRitualContent, setNewRitualContent] = useState('');
  const webSocketRef = useRef(null);
  const { toast } = useToast();

  // Consultas para obter listas de rituais e cenas
  const { data: ritualsData, isLoading: isLoadingRituals } = useQuery({
    queryKey: ['/api/zews/rituals'],
    staleTime: 60000,
  });

  const { data: scenesData, isLoading: isLoadingScenes } = useQuery({
    queryKey: ['/api/zews/scenes'],
    staleTime: 60000,
  });

  // Inicializar conexão WebSocket
  useEffect(() => {
    const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
    const wsUrl = `${protocol}//${window.location.host}/ws`;
    
    const ws = new WebSocket(wsUrl);
    webSocketRef.current = ws;
    
    ws.onopen = () => {
      console.log('Conexão WebSocket estabelecida');
      setWsConnected(true);
      
      // Solicitar estado inicial
      ws.send(JSON.stringify({ type: 'get_state' }));
      ws.send(JSON.stringify({ type: 'get_rituals' }));
      ws.send(JSON.stringify({ type: 'get_scenes' }));
    };
    
    ws.onclose = () => {
      console.log('Conexão WebSocket fechada');
      setWsConnected(false);
    };
    
    ws.onerror = (error) => {
      console.error('Erro WebSocket:', error);
      setWsConnected(false);
    };
    
    ws.onmessage = (event) => {
      handleWsMessage(event);
    };
    
    return () => {
      if (ws.readyState === WebSocket.OPEN) {
        ws.close();
      }
    };
  }, []);

  // Tratar mensagens WebSocket
  const handleWsMessage = (event) => {
    try {
      const message = JSON.parse(event.data);
      console.log('Mensagem WebSocket recebida:', message.type);
      
      switch (message.type) {
        case 'system_state':
          setSystemState(message);
          break;
          
        case 'command_result':
          addToHistory({
            type: 'command',
            command: message.command,
            result: message.result,
            timestamp: message.timestamp
          });
          break;
          
        case 'ritual_result':
          toast({
            title: `Ritual ${message.success ? 'executado' : 'falhou'}`,
            description: `Ritual "${message.name}" ${message.success ? 'executado com sucesso' : 'falhou na execução'}`,
            variant: message.success ? 'default' : 'destructive',
          });
          break;
          
        case 'scene_result':
          toast({
            title: `Ação de cena ${message.success ? 'executada' : 'falhou'}`,
            description: `Ação "${message.action}" para cena "${message.name}" ${message.success ? 'executada com sucesso' : 'falhou'}`,
            variant: message.success ? 'default' : 'destructive',
          });
          break;
          
        case 'error':
          toast({
            title: 'Erro',
            description: message.message,
            variant: 'destructive',
          });
          
          addToHistory({
            type: 'error',
            message: message.message,
            timestamp: message.timestamp
          });
          break;
          
        case 'ritual_list':
          // Rituais são obtidos via React Query
          break;
          
        case 'scene_list':
          // Cenas são obtidas via React Query
          break;
          
        default:
          console.log('Tipo de mensagem desconhecido:', message.type);
      }
    } catch (error) {
      console.error('Erro ao processar mensagem WebSocket:', error);
    }
  };

  // Adicionar mensagem ao histórico
  const addToHistory = (item) => {
    setCommandHistory(prev => {
      const newHistory = [item, ...prev];
      if (newHistory.length > maxHistoryItems) {
        return newHistory.slice(0, maxHistoryItems);
      }
      return newHistory;
    });
  };

  // Executar comando ZEWS
  const handleCommandSubmit = (e) => {
    e.preventDefault();
    
    if (!command) {
      toast({
        title: 'Comando vazio',
        description: 'Por favor, digite um comando para executar',
        variant: 'destructive',
      });
      return;
    }
    
    if (webSocketRef.current && webSocketRef.current.readyState === WebSocket.OPEN) {
      webSocketRef.current.send(JSON.stringify({
        type: 'command',
        command
      }));
      
      // Adicionar ao histórico imediatamente
      addToHistory({
        type: 'command_sent',
        command,
        timestamp: new Date().toISOString()
      });
      
      // Limpar campo de comando
      setCommand('');
    } else {
      toast({
        title: 'Erro de conexão',
        description: 'Não foi possível enviar comando: WebSocket não conectado',
        variant: 'destructive',
      });
    }
  };

  // Executar ritual
  const handleRitualSubmit = () => {
    if (!selectedRitual) {
      toast({
        title: 'Ritual não selecionado',
        description: 'Por favor, selecione um ritual para executar',
        variant: 'destructive',
      });
      return;
    }
    
    if (webSocketRef.current && webSocketRef.current.readyState === WebSocket.OPEN) {
      webSocketRef.current.send(JSON.stringify({
        type: 'ritual',
        name: selectedRitual
      }));
      
      // Adicionar ao histórico
      addToHistory({
        type: 'ritual_sent',
        ritual: selectedRitual,
        timestamp: new Date().toISOString()
      });
    } else {
      toast({
        title: 'Erro de conexão',
        description: 'Não foi possível executar ritual: WebSocket não conectado',
        variant: 'destructive',
      });
    }
  };

  // Criar novo ritual
  const handleCreateRitual = async () => {
    if (!newRitualName || !newRitualContent) {
      toast({
        title: 'Campos incompletos',
        description: 'Nome e conteúdo do ritual são obrigatórios',
        variant: 'destructive',
      });
      return;
    }
    
    try {
      const response = await apiRequest('POST', '/api/zews/ritual', {
        name: newRitualName,
        content: newRitualContent
      });
      
      if (response.ok) {
        toast({
          title: 'Ritual criado',
          description: `Ritual "${newRitualName}" foi criado com sucesso`,
        });
        
        // Limpar campos
        setNewRitualName('');
        setNewRitualContent('');
        
        // Atualizar lista de rituais
        // TODO: Invalidar consulta React Query
      } else {
        const error = await response.json();
        toast({
          title: 'Erro ao criar ritual',
          description: error.message || 'Não foi possível criar o ritual',
          variant: 'destructive',
        });
      }
    } catch (error) {
      toast({
        title: 'Erro ao criar ritual',
        description: error.message || 'Ocorreu um erro ao criar o ritual',
        variant: 'destructive',
      });
    }
  };

  // Executar ação de cena
  const handleSceneAction = (action) => {
    if (action === 'play' && !selectedScene) {
      toast({
        title: 'Cena não selecionada',
        description: 'Por favor, selecione uma cena para reproduzir',
        variant: 'destructive',
      });
      return;
    }
    
    if (webSocketRef.current && webSocketRef.current.readyState === WebSocket.OPEN) {
      webSocketRef.current.send(JSON.stringify({
        type: 'scene',
        action,
        name: selectedScene
      }));
      
      // Adicionar ao histórico
      addToHistory({
        type: 'scene_action',
        action,
        scene: selectedScene,
        timestamp: new Date().toISOString()
      });
    } else {
      toast({
        title: 'Erro de conexão',
        description: 'Não foi possível executar ação de cena: WebSocket não conectado',
        variant: 'destructive',
      });
    }
  };

  // Formatar a proporção quântica para exibição
  const formatQuantumRatio = (ratio) => {
    if (!ratio) return '3:1 (padrão)';
    return `${ratio.coherence}:${ratio.chaos} (${Math.round(ratio.coherence / (ratio.coherence + ratio.chaos) * 100)}% coerência)`;
  };

  // Renderizar componente
  return (
    <div className="container mx-auto py-6">
      <div className="flex flex-col space-y-6">
        <h1 className="text-3xl font-bold">Interface ZEWS</h1>
        <p className="text-muted-foreground">
          Sistema de Interação Ritual-Simbólico - Proporção Quântica 3:1
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Painel de Status */}
          <Card>
            <CardHeader>
              <CardTitle>Estado do Sistema</CardTitle>
              <CardDescription>Proporção Quântica e Estado Atual</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex flex-col space-y-1">
                  <span className="text-sm font-medium">Conexão:</span>
                  <Badge variant={wsConnected ? "default" : "destructive"}>
                    {wsConnected ? "Conectado" : "Desconectado"}
                  </Badge>
                </div>
                
                <div className="flex flex-col space-y-1">
                  <span className="text-sm font-medium">Proporção Quântica:</span>
                  <Badge variant="outline">
                    {systemState ? formatQuantumRatio(systemState.quantumRatio) : '3:1 (padrão)'}
                  </Badge>
                </div>
                
                <div className="flex flex-col space-y-1">
                  <span className="text-sm font-medium">Modo Ativo:</span>
                  <Badge variant="secondary">
                    {systemState?.activeMode || 'Não definido'}
                  </Badge>
                </div>
                
                <div className="flex flex-col space-y-1">
                  <span className="text-sm font-medium">Cena Ativa:</span>
                  <Badge variant={systemState?.activeScene ? "secondary" : "outline"}>
                    {systemState?.activeScene || 'Nenhuma'}
                  </Badge>
                </div>
                
                <div className="flex flex-col space-y-1">
                  <span className="text-sm font-medium">Rotas Ativas:</span>
                  <div className="flex flex-wrap gap-2">
                    {systemState?.activeRoutes && systemState.activeRoutes.length > 0 ? (
                      systemState.activeRoutes.map((route) => (
                        <Badge key={route} variant="outline">{route}</Badge>
                      ))
                    ) : (
                      <Badge variant="outline">Nenhuma</Badge>
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
          
          {/* Tabs de Interação */}
          <Card className="md:col-span-2">
            <CardHeader>
              <CardTitle>Controle ZEWS</CardTitle>
              <CardDescription>Interface de Comando Ritual-Simbólico</CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs value={activeTab} onValueChange={setActiveTab} defaultValue="command">
                <TabsList className="grid grid-cols-3 mb-4">
                  <TabsTrigger value="command">Comandos</TabsTrigger>
                  <TabsTrigger value="ritual">Rituais</TabsTrigger>
                  <TabsTrigger value="scene">Cenas</TabsTrigger>
                </TabsList>
                
                <TabsContent value="command">
                  <form onSubmit={handleCommandSubmit}>
                    <div className="flex flex-col space-y-4">
                      <div className="space-y-2">
                        <label htmlFor="command" className="text-sm font-medium">
                          Comando ZEWS:
                        </label>
                        <Input
                          id="command"
                          value={command}
                          onChange={(e) => setCommand(e.target.value)}
                          placeholder="Ex: zews.ratio.set 3:1"
                        />
                      </div>
                      <Button type="submit" disabled={!wsConnected}>
                        Executar Comando
                      </Button>
                    </div>
                  </form>
                </TabsContent>
                
                <TabsContent value="ritual">
                  <div className="flex flex-col space-y-4">
                    <div className="space-y-2">
                      <label htmlFor="ritual" className="text-sm font-medium">
                        Selecionar Ritual:
                      </label>
                      <Select
                        value={selectedRitual}
                        onValueChange={setSelectedRitual}
                      >
                        <SelectTrigger id="ritual">
                          <SelectValue placeholder="Selecione um ritual" />
                        </SelectTrigger>
                        <SelectContent>
                          {isLoadingRituals ? (
                            <SelectItem value="loading" disabled>
                              Carregando rituais...
                            </SelectItem>
                          ) : ritualsData?.rituals && ritualsData.rituals.length > 0 ? (
                            ritualsData.rituals.map((ritual) => (
                              <SelectItem key={ritual} value={ritual}>
                                {ritual}
                              </SelectItem>
                            ))
                          ) : (
                            <SelectItem value="none" disabled>
                              Nenhum ritual disponível
                            </SelectItem>
                          )}
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="flex space-x-2">
                      <Button 
                        onClick={handleRitualSubmit} 
                        disabled={!wsConnected || !selectedRitual}
                        className="flex-1"
                      >
                        Executar Ritual
                      </Button>
                      
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button variant="outline">Criar Ritual</Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>Criar Novo Ritual</DialogTitle>
                            <DialogDescription>
                              Defina um nome e o conteúdo do ritual no formato ZEWS.
                            </DialogDescription>
                          </DialogHeader>
                          
                          <div className="space-y-4 py-4">
                            <div className="space-y-2">
                              <label htmlFor="ritualName" className="text-sm font-medium">
                                Nome do Ritual:
                              </label>
                              <Input
                                id="ritualName"
                                value={newRitualName}
                                onChange={(e) => setNewRitualName(e.target.value)}
                                placeholder="novo_ritual"
                              />
                            </div>
                            
                            <div className="space-y-2">
                              <label htmlFor="ritualContent" className="text-sm font-medium">
                                Conteúdo do Ritual:
                              </label>
                              <Textarea
                                id="ritualContent"
                                value={newRitualContent}
                                onChange={(e) => setNewRitualContent(e.target.value)}
                                placeholder="NAME: Meu Ritual\nDESCRIPTION: Descrição\nQUANTUM_RATIO: 3:1\n\nBEGIN COMMANDS\nzews.ratio.set 3:1\nEND COMMANDS"
                                rows={10}
                              />
                            </div>
                          </div>
                          
                          <div className="flex justify-end">
                            <Button onClick={handleCreateRitual}>
                              Criar Ritual
                            </Button>
                          </div>
                        </DialogContent>
                      </Dialog>
                    </div>
                  </div>
                </TabsContent>
                
                <TabsContent value="scene">
                  <div className="flex flex-col space-y-4">
                    <div className="space-y-2">
                      <label htmlFor="scene" className="text-sm font-medium">
                        Selecionar Cena:
                      </label>
                      <Select
                        value={selectedScene}
                        onValueChange={setSelectedScene}
                      >
                        <SelectTrigger id="scene">
                          <SelectValue placeholder="Selecione uma cena" />
                        </SelectTrigger>
                        <SelectContent>
                          {isLoadingScenes ? (
                            <SelectItem value="loading" disabled>
                              Carregando cenas...
                            </SelectItem>
                          ) : scenesData?.scenes && scenesData.scenes.length > 0 ? (
                            scenesData.scenes.map((scene) => (
                              <SelectItem key={scene} value={scene}>
                                {scene}
                              </SelectItem>
                            ))
                          ) : (
                            <SelectItem value="none" disabled>
                              Nenhuma cena disponível
                            </SelectItem>
                          )}
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="flex space-x-2">
                      <Button 
                        onClick={() => handleSceneAction('play')} 
                        disabled={!wsConnected || !selectedScene}
                        className="flex-1"
                      >
                        Reproduzir Cena
                      </Button>
                      <Button 
                        onClick={() => handleSceneAction('stop')} 
                        disabled={!wsConnected || !systemState?.activeScene}
                        variant="outline"
                      >
                        Parar Cena
                      </Button>
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
          
          {/* Histórico de Comandos */}
          <Card className="md:col-span-3">
            <CardHeader>
              <CardTitle>Histórico de Interações</CardTitle>
              <CardDescription>Comandos, Rituais e Cenas executados</CardDescription>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[300px]">
                {commandHistory.length > 0 ? (
                  <div className="space-y-2">
                    {commandHistory.map((item, index) => (
                      <div key={index} className="p-2 border rounded-md">
                        <div className="flex justify-between items-start">
                          <Badge variant={
                            item.type === 'error' ? 'destructive' : 
                            item.type === 'command_result' ? 'default' : 
                            'secondary'
                          }>
                            {item.type}
                          </Badge>
                          <span className="text-xs text-muted-foreground">
                            {new Date(item.timestamp).toLocaleTimeString()}
                          </span>
                        </div>
                        
                        <div className="mt-1">
                          {item.type === 'command_sent' || item.type === 'command_result' ? (
                            <div>
                              <p className="text-sm font-medium">{item.command}</p>
                              {item.result && (
                                <pre className="mt-1 p-2 bg-muted rounded-md text-xs overflow-x-auto">
                                  {JSON.stringify(item.result, null, 2)}
                                </pre>
                              )}
                            </div>
                          ) : item.type === 'ritual_sent' ? (
                            <p className="text-sm">Ritual: {item.ritual}</p>
                          ) : item.type === 'scene_action' ? (
                            <p className="text-sm">
                              Ação: {item.action} {item.scene && `| Cena: ${item.scene}`}
                            </p>
                          ) : item.type === 'error' ? (
                            <p className="text-sm text-destructive">{item.message}</p>
                          ) : (
                            <p className="text-sm">{JSON.stringify(item)}</p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="flex items-center justify-center h-full">
                    <p className="text-muted-foreground">Nenhuma interação registrada</p>
                  </div>
                )}
              </ScrollArea>
            </CardContent>
            <CardFooter className="flex justify-end">
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => setCommandHistory([])}
                disabled={commandHistory.length === 0}
              >
                Limpar Histórico
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
}