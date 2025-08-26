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
  DialogFooter,
} from "@/components/ui/dialog";
import { useToast } from '@/hooks/use-toast';
import { apiRequest } from '@/lib/queryClient';
import { 
  Mic, 
  MicOff, 
  Camera, 
  Video,
  VideoOff,
  Play,
  Pause,
  Upload,
  Download,
  Zap,
  AlertCircle,
  CheckCircle,
  Send,
  Image as ImageIcon,
  X
} from 'lucide-react';

// Componente de Interface Multimodal para WiltonOS
export default function MultimodalInterface() {
  // Estados para interação com o sistema
  const [command, setCommand] = useState('');
  const [activeTab, setActiveTab] = useState('text');
  const [selectedRitual, setSelectedRitual] = useState('');
  const [selectedScene, setSelectedScene] = useState('');
  const [commandHistory, setCommandHistory] = useState([]);
  const [wsConnected, setWsConnected] = useState(false);
  const [systemState, setSystemState] = useState(null);
  
  // Estados para recursos multimodais
  const [isRecording, setIsRecording] = useState(false);
  const [audioStream, setAudioStream] = useState(null);
  const [transcribedText, setTranscribedText] = useState('');
  const [cameraActive, setCameraActive] = useState(false);
  const [videoStream, setVideoStream] = useState(null);
  const [capturedImage, setCapturedImage] = useState(null);
  const [recognizedGesture, setRecognizedGesture] = useState(null);
  const [feedbackMessage, setFeedbackMessage] = useState('');
  
  // Referencias
  const webSocketRef = useRef(null);
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);
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
  
  // Dicionário de gestos
  const gestures = {
    'three-point-beacon': 'activateMemoryRecall',
    'lotus-blossom': 'calmAnxietyProtocol',
    'triangle-ascension': 'elevateConsciousness'
  };

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
          
        case 'gesture_recognized':
          handleRecognizedGesture(message.gesture);
          break;
          
        case 'audio_transcription':
          setTranscribedText(message.text);
          toast({
            title: 'Áudio transcrito',
            description: 'Transcrição de áudio concluída com sucesso',
          });
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
      if (newHistory.length > 100) {
        return newHistory.slice(0, 100);
      }
      return newHistory;
    });
  };

  // Executar comando ZEWS
  const handleCommandSubmit = (e) => {
    e?.preventDefault();
    
    const commandToSend = command || transcribedText;
    
    if (!commandToSend) {
      toast({
        title: 'Comando vazio',
        description: 'Por favor, digite ou fale um comando para executar',
        variant: 'destructive',
      });
      return;
    }
    
    if (webSocketRef.current && webSocketRef.current.readyState === WebSocket.OPEN) {
      webSocketRef.current.send(JSON.stringify({
        type: 'command',
        command: commandToSend
      }));
      
      // Adicionar ao histórico imediatamente
      addToHistory({
        type: 'command_sent',
        command: commandToSend,
        source: command ? 'texto' : 'voz',
        timestamp: new Date().toISOString()
      });
      
      // Limpar campos
      setCommand('');
      setTranscribedText('');
      
      // Mostrar feedback
      setFeedbackMessage(`Comando enviado: ${commandToSend}`);
      setTimeout(() => setFeedbackMessage(''), 3000);
    } else {
      toast({
        title: 'Erro de conexão',
        description: 'Não foi possível enviar comando: WebSocket não conectado',
        variant: 'destructive',
      });
    }
  };

  // Manipular gestos reconhecidos
  const handleRecognizedGesture = (gesture) => {
    setRecognizedGesture(gesture);
    
    if (gestures[gesture]) {
      const action = gestures[gesture];
      
      toast({
        title: 'Gesto reconhecido',
        description: `Gesto "${gesture}" → Ação: ${action}`,
      });
      
      // Executar ação baseada no gesto
      if (webSocketRef.current && webSocketRef.current.readyState === WebSocket.OPEN) {
        webSocketRef.current.send(JSON.stringify({
          type: 'gesture',
          gesture,
          action
        }));
        
        addToHistory({
          type: 'gesture',
          gesture,
          action,
          timestamp: new Date().toISOString()
        });
      }
    }
  };

  // FUNÇÕES DE ÁUDIO
  
  // Iniciar/Parar gravação de áudio
  const toggleAudioRecording = async () => {
    if (isRecording) {
      // Parar gravação
      if (mediaRecorderRef.current) {
        mediaRecorderRef.current.stop();
      }
      
      if (audioStream) {
        audioStream.getTracks().forEach(track => track.stop());
        setAudioStream(null);
      }
      
      setIsRecording(false);
    } else {
      try {
        // Iniciar gravação
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        setAudioStream(stream);
        
        const mediaRecorder = new MediaRecorder(stream);
        mediaRecorderRef.current = mediaRecorder;
        audioChunksRef.current = [];
        
        mediaRecorder.ondataavailable = (e) => {
          if (e.data.size > 0) {
            audioChunksRef.current.push(e.data);
          }
        };
        
        mediaRecorder.onstop = () => {
          // Processar o áudio gravado
          const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/wav' });
          processAudio(audioBlob);
        };
        
        mediaRecorder.start();
        setIsRecording(true);
        
        // Feedback
        toast({
          title: 'Gravação iniciada',
          description: 'Fale seu comando ou mensagem',
        });
      } catch (error) {
        console.error('Erro ao acessar microfone:', error);
        toast({
          title: 'Erro de acesso',
          description: 'Não foi possível acessar o microfone',
          variant: 'destructive',
        });
      }
    }
  };
  
  // Processar áudio gravado
  const processAudio = (audioBlob) => {
    // Criar FormData para envio
    const formData = new FormData();
    formData.append('audio', audioBlob);
    
    // Enviar para o servidor ou processar localmente
    if (webSocketRef.current && webSocketRef.current.readyState === WebSocket.OPEN) {
      // Converter blob para base64 e enviar via WebSocket
      const reader = new FileReader();
      reader.readAsDataURL(audioBlob);
      reader.onloadend = () => {
        const base64Audio = reader.result.split(',')[1];
        webSocketRef.current.send(JSON.stringify({
          type: 'audio_data',
          audio: base64Audio
        }));
        
        // Feedback
        toast({
          title: 'Processando áudio',
          description: 'Seu áudio está sendo transcrito...',
        });
      };
    } else {
      // Simulação para testes
      setTimeout(() => {
        setTranscribedText('Execute ritual startup');
        toast({
          title: 'Áudio transcrito',
          description: 'Transcrição de áudio concluída',
        });
      }, 1500);
    }
  };

  // FUNÇÕES DE VÍDEO/IMAGEM
  
  // Ativar/desativar câmera
  const toggleCamera = async () => {
    if (cameraActive) {
      // Desativar câmera
      if (videoStream) {
        videoStream.getTracks().forEach(track => track.stop());
        setVideoStream(null);
      }
      setCameraActive(false);
    } else {
      try {
        // Ativar câmera
        const stream = await navigator.mediaDevices.getUserMedia({ 
          video: { 
            width: { ideal: 640 },
            height: { ideal: 480 },
            facingMode: 'user'
          } 
        });
        
        setVideoStream(stream);
        
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
        
        setCameraActive(true);
        
        // Começar a analisar o feed para reconhecimento de gestos
        startGestureRecognition();
      } catch (error) {
        console.error('Erro ao acessar câmera:', error);
        toast({
          title: 'Erro de acesso',
          description: 'Não foi possível acessar a câmera',
          variant: 'destructive',
        });
      }
    }
  };
  
  // Capturar imagem da câmera
  const captureImage = () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      
      // Configurar canvas para corresponder à resolução do vídeo
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      
      // Desenhar frame do vídeo no canvas
      const ctx = canvas.getContext('2d');
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
      
      // Obter imagem como URL de dados
      const imageDataUrl = canvas.toDataURL('image/jpeg');
      setCapturedImage(imageDataUrl);
      
      // Processar imagem para reconhecimento
      processImage(imageDataUrl);
    }
  };
  
  // Processar imagem capturada
  const processImage = (imageDataUrl) => {
    // Extrair dados base64
    const base64Image = imageDataUrl.split(',')[1];
    
    if (webSocketRef.current && webSocketRef.current.readyState === WebSocket.OPEN) {
      webSocketRef.current.send(JSON.stringify({
        type: 'image_data',
        image: base64Image
      }));
      
      toast({
        title: 'Processando imagem',
        description: 'Analisando imagem para reconhecimento de gestos...',
      });
    } else {
      // Simulação para testes
      setTimeout(() => {
        const randomGesture = Object.keys(gestures)[Math.floor(Math.random() * Object.keys(gestures).length)];
        handleRecognizedGesture(randomGesture);
      }, 2000);
    }
  };
  
  // Iniciar reconhecimento de gestos
  const startGestureRecognition = () => {
    if (!cameraActive || !videoRef.current) return;
    
    // Em um sistema real, aqui teríamos um modelo de ML para detectar gestos
    // Por ora, simulamos detecções periódicas para demonstração
    
    const gestureDetectionInterval = setInterval(() => {
      if (cameraActive && videoRef.current) {
        captureImage();
      } else {
        clearInterval(gestureDetectionInterval);
      }
    }, 5000); // Capturar a cada 5 segundos
    
    return () => {
      clearInterval(gestureDetectionInterval);
    };
  };
  
  // Limpar imagem capturada
  const clearCapturedImage = () => {
    setCapturedImage(null);
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
      
      // Feedback
      setFeedbackMessage(`Ritual iniciado: ${selectedRitual}`);
      setTimeout(() => setFeedbackMessage(''), 3000);
    } else {
      toast({
        title: 'Erro de conexão',
        description: 'Não foi possível executar ritual: WebSocket não conectado',
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

  // Renderizar botão de gravação de áudio
  const renderAudioRecordButton = () => (
    <Button 
      onClick={toggleAudioRecording} 
      variant={isRecording ? "destructive" : "default"}
      className="flex items-center space-x-2"
    >
      {isRecording ? (
        <>
          <MicOff className="w-4 h-4" />
          <span>Parar Gravação</span>
        </>
      ) : (
        <>
          <Mic className="w-4 h-4" />
          <span>Gravar Comando</span>
        </>
      )}
    </Button>
  );
  
  // Renderizar botão de câmera
  const renderCameraButton = () => (
    <Button 
      onClick={toggleCamera} 
      variant={cameraActive ? "destructive" : "default"}
      className="flex items-center space-x-2"
    >
      {cameraActive ? (
        <>
          <VideoOff className="w-4 h-4" />
          <span>Desativar Câmera</span>
        </>
      ) : (
        <>
          <Camera className="w-4 h-4" />
          <span>Ativar Câmera</span>
        </>
      )}
    </Button>
  );
  
  // Renderizar visualização de câmera
  const renderCameraView = () => (
    <div className="relative w-full">
      <video 
        ref={videoRef} 
        autoPlay 
        playsInline 
        muted 
        className="w-full rounded-lg border border-border"
        style={{ display: cameraActive ? 'block' : 'none' }}
      />
      
      <canvas ref={canvasRef} style={{ display: 'none' }} />
      
      {capturedImage && (
        <div className="mt-4 relative">
          <div className="absolute top-2 right-2 z-10">
            <Button 
              variant="destructive" 
              size="icon" 
              onClick={clearCapturedImage}
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
          <img 
            src={capturedImage} 
            alt="Imagem capturada" 
            className="w-full rounded-lg border border-border"
          />
          
          {recognizedGesture && (
            <div className="mt-2 p-2 bg-muted rounded-md">
              <p className="text-sm font-medium">Gesto reconhecido: <span className="font-bold">{recognizedGesture}</span></p>
              <p className="text-xs text-muted-foreground">Ação: {gestures[recognizedGesture]}</p>
            </div>
          )}
        </div>
      )}
      
      {cameraActive && !capturedImage && (
        <div className="mt-2 flex justify-center">
          <Button onClick={captureImage} className="flex items-center space-x-2">
            <Camera className="w-4 h-4" />
            <span>Capturar</span>
          </Button>
        </div>
      )}
    </div>
  );
  
  // Renderizar componente principal
  return (
    <div className="container mx-auto py-6">
      <div className="flex flex-col space-y-6">
        <h1 className="text-3xl font-bold">Interface Multimodal WiltonOS</h1>
        <p className="text-muted-foreground">
          Sistema de Interação Quântica - Proporção 3:1 (75% coerência, 25% caos)
        </p>
        
        {/* Mensagem de feedback */}
        {feedbackMessage && (
          <div className="bg-primary/10 border border-primary/30 text-primary-foreground p-3 rounded-md">
            {feedbackMessage}
          </div>
        )}
        
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
                    {systemState?.activeMode || 'Fractal::Lemniscate'}
                  </Badge>
                </div>
                
                <div className="flex flex-col space-y-1">
                  <span className="text-sm font-medium">Gestos Disponíveis:</span>
                  <div className="flex flex-wrap gap-2">
                    {Object.keys(gestures).map((gesture) => (
                      <Badge key={gesture} variant="outline">{gesture}</Badge>
                    ))}
                  </div>
                </div>
                
                <div className="mt-4">
                  <h4 className="text-sm font-medium mb-2">Histórico Recente</h4>
                  <ScrollArea className="h-[100px] rounded-md border p-2">
                    {commandHistory.length > 0 ? (
                      <div className="space-y-2">
                        {commandHistory.slice(0, 5).map((item, index) => (
                          <div key={index} className="text-xs">
                            {item.type === 'command_sent' && (
                              <div className="flex items-start gap-2">
                                <Send className="w-3 h-3 mt-0.5 text-blue-500" />
                                <div>
                                  <span className="font-medium">Comando ({item.source}):</span> {item.command}
                                </div>
                              </div>
                            )}
                            
                            {item.type === 'ritual_sent' && (
                              <div className="flex items-start gap-2">
                                <Zap className="w-3 h-3 mt-0.5 text-purple-500" />
                                <div>
                                  <span className="font-medium">Ritual:</span> {item.ritual}
                                </div>
                              </div>
                            )}
                            
                            {item.type === 'gesture' && (
                              <div className="flex items-start gap-2">
                                <CheckCircle className="w-3 h-3 mt-0.5 text-green-500" />
                                <div>
                                  <span className="font-medium">Gesto:</span> {item.gesture} → {item.action}
                                </div>
                              </div>
                            )}
                            
                            {item.type === 'error' && (
                              <div className="flex items-start gap-2">
                                <AlertCircle className="w-3 h-3 mt-0.5 text-red-500" />
                                <div>
                                  <span className="font-medium">Erro:</span> {item.message}
                                </div>
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-xs text-muted-foreground">Nenhuma atividade recente</p>
                    )}
                  </ScrollArea>
                </div>
              </div>
            </CardContent>
          </Card>
          
          {/* Interface Multimodal */}
          <Card className="md:col-span-2">
            <CardHeader>
              <CardTitle>Interface Multimodal</CardTitle>
              <CardDescription>Texto, Áudio, Imagem e Controle Gestual</CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs value={activeTab} onValueChange={setActiveTab} defaultValue="text">
                <TabsList className="grid grid-cols-4 mb-4">
                  <TabsTrigger value="text">Texto</TabsTrigger>
                  <TabsTrigger value="audio">Áudio</TabsTrigger>
                  <TabsTrigger value="visual">Visual</TabsTrigger>
                  <TabsTrigger value="rituals">Rituais</TabsTrigger>
                </TabsList>
                
                {/* TAB: TEXTO */}
                <TabsContent value="text">
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
                      
                      <div className="bg-muted rounded-lg p-3 mt-2">
                        <h4 className="text-sm font-medium mb-2">Comandos Comuns:</h4>
                        <ul className="text-xs space-y-1">
                          <li><code>zews.ratio.get</code> - Exibir proporção quântica</li>
                          <li><code>zews.ratio.set 3:1</code> - Definir proporção quântica</li>
                          <li><code>zews.mode.set Fractal::Lemniscate</code> - Definir modo ativo</li>
                          <li><code>ritual startup</code> - Executar ritual de inicialização</li>
                          <li><code>gesture three-point-beacon</code> - Simular gesto</li>
                        </ul>
                      </div>
                    </div>
                  </form>
                </TabsContent>
                
                {/* TAB: ÁUDIO */}
                <TabsContent value="audio">
                  <div className="flex flex-col space-y-4">
                    <div className="flex justify-center py-4">
                      {renderAudioRecordButton()}
                    </div>
                    
                    <div className="space-y-2">
                      <label className="text-sm font-medium">
                        Transcrição:
                      </label>
                      <Textarea
                        value={transcribedText}
                        onChange={(e) => setTranscribedText(e.target.value)}
                        placeholder="A transcrição do seu comando de voz aparecerá aqui..."
                        rows={4}
                        readOnly={isRecording}
                      />
                    </div>
                    
                    <Button 
                      onClick={() => handleCommandSubmit()} 
                      disabled={!wsConnected || !transcribedText}
                    >
                      Executar Comando de Voz
                    </Button>
                  </div>
                </TabsContent>
                
                {/* TAB: VISUAL */}
                <TabsContent value="visual">
                  <div className="flex flex-col space-y-4">
                    <div className="flex justify-center py-2">
                      {renderCameraButton()}
                    </div>
                    
                    {renderCameraView()}
                    
                    <div className="bg-muted rounded-lg p-3 mt-2">
                      <h4 className="text-sm font-medium mb-2">Gestos Reconhecidos:</h4>
                      <ul className="text-xs space-y-1">
                        {Object.entries(gestures).map(([gesture, action]) => (
                          <li key={gesture}>
                            <span className="font-medium">{gesture}</span> → {action}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </TabsContent>
                
                {/* TAB: RITUAIS */}
                <TabsContent value="rituals">
                  <div className="flex flex-col space-y-6">
                    {/* Seleção de Ritual */}
                    <div className="space-y-4">
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
                      
                      <Button 
                        onClick={handleRitualSubmit} 
                        disabled={!wsConnected || !selectedRitual}
                        className="w-full"
                      >
                        Executar Ritual
                      </Button>
                    </div>
                    
                    {/* Seleção de Cena */}
                    <div className="space-y-4">
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
                          <Play className="w-4 h-4 mr-2" />
                          Reproduzir
                        </Button>
                        
                        <Button 
                          onClick={() => handleSceneAction('pause')} 
                          variant="outline"
                          disabled={!wsConnected}
                          className="flex-1"
                        >
                          <Pause className="w-4 h-4 mr-2" />
                          Pausar
                        </Button>
                      </div>
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
            <CardFooter>
              <p className="text-xs text-muted-foreground">
                WiltonOS - Interface com proporção quântica 3:1 para equilíbrio ótimo entre coerência e caos.
              </p>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
}