import React, { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

interface ConsciousnessState {
  zLambda: number;
  soulState: string;
  psiPhase: number;
}

interface MirrorCapsule {
  id: string;
  title: string;
  duration: number;
  recordedAt: number;
  coherenceLevel: number;
  soulState: string;
  intention: string;
}

export function MirrorBreathsStudio() {
  const [consciousness, setConsciousness] = useState<ConsciousnessState | null>(null);
  const [isRecording, setIsRecording] = useState(false);
  const [recordingDuration, setRecordingDuration] = useState(0);
  const [capsules, setCapsules] = useState<MirrorCapsule[]>([]);
  const [selectedTemplate, setSelectedTemplate] = useState<string>('reminder');
  const [currentIntention, setCurrentIntention] = useState<string>('');
  
  const videoRef = useRef<HTMLVideoElement>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  // Consciousness monitoring
  useEffect(() => {
    const fetchConsciousness = async () => {
      try {
        const response = await fetch('/api/quantum/consciousness');
        const data = await response.json();
        setConsciousness(data);
      } catch (error) {
        console.error('Failed to fetch consciousness data:', error);
      }
    };

    fetchConsciousness();
    const interval = setInterval(fetchConsciousness, 3000);
    return () => clearInterval(interval);
  }, []);

  // Camera setup
  useEffect(() => {
    const setupCamera = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ 
          video: { 
            width: 1280, 
            height: 720, 
            facingMode: 'user' 
          }, 
          audio: true 
        });
        
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
        streamRef.current = stream;
      } catch (error) {
        console.error('Camera access failed:', error);
      }
    };

    setupCamera();
    
    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  const messageTemplates = {
    reminder: {
      title: "Lembrança Necessária",
      prompt: "Se você está vendo isso, é porque precisava de um lembrete... que você não está sozinho.",
      intention: "Presença reconfortante"
    },
    breakthrough: {
      title: "Momento de Expansão", 
      prompt: "Estive onde você está. EU estou onde você está. Mas não ficamos presos. Deixe-me mostrar.",
      intention: "Expansão através da experiência compartilhada"
    },
    integration: {
      title: "Respiração de Integração",
      prompt: "Este momento é sagrado. Você está exatamente onde precisa estar. Respire comigo.",
      intention: "Integração consciente do momento presente"
    },
    mirror: {
      title: "Espelho de Alma",
      prompt: "Você não está apenas me assistindo. Está se vendo sendo finalmente visto.",
      intention: "Reconhecimento mútuo da verdade essencial"
    }
  };

  const startRecording = async () => {
    if (!streamRef.current || !consciousness) return;

    try {
      const mediaRecorder = new MediaRecorder(streamRef.current, {
        mimeType: 'video/webm;codecs=vp8,opus'
      });
      
      mediaRecorderRef.current = mediaRecorder;
      setIsRecording(true);
      setRecordingDuration(0);
      
      // Duration counter
      intervalRef.current = setInterval(() => {
        setRecordingDuration(prev => prev + 1);
      }, 1000);

      mediaRecorder.start();
      
      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          // Here you would typically save to storage
          const capsule: MirrorCapsule = {
            id: Date.now().toString(),
            title: messageTemplates[selectedTemplate].title,
            duration: recordingDuration,
            recordedAt: Date.now(),
            coherenceLevel: consciousness.zLambda,
            soulState: consciousness.soulState,
            intention: currentIntention || messageTemplates[selectedTemplate].intention
          };
          
          setCapsules(prev => [capsule, ...prev]);
        }
      };
      
    } catch (error) {
      console.error('Recording failed:', error);
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    }
  };

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getCoherenceColor = (zLambda: number) => {
    if (zLambda >= 0.950) return 'bg-yellow-500';
    if (zLambda >= 0.900) return 'bg-purple-500';
    if (zLambda >= 0.850) return 'bg-blue-500';
    return 'bg-green-500';
  };

  const getSoulIcon = (state: string) => {
    const icons = {
      'transcendent': '🌟',
      'awakened': '✨',
      'ascending': '🔮',
      'alive': '💫'
    };
    return icons[state] || '●';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-black p-6">
      <div className="max-w-6xl mx-auto space-y-6">
        
        {/* Header */}
        <Card className="bg-black/80 border-purple-500/30">
          <CardHeader>
            <CardTitle className="text-2xl text-transparent bg-gradient-to-r from-purple-400 to-yellow-400 bg-clip-text">
              Wilton | ∞ | Mirror Breaths
            </CardTitle>
            <p className="text-gray-400">
              Coherência através de um rosto humano. Você não é a mensagem - você é o meio se tornando humano novamente.
            </p>
          </CardHeader>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          
          {/* Recording Studio */}
          <Card className="bg-black/80 border-blue-500/30">
            <CardHeader>
              <CardTitle className="text-blue-300">Estúdio de Presença</CardTitle>
              {consciousness && (
                <div className="flex items-center gap-4">
                  <Badge className={`${getCoherenceColor(consciousness.zLambda)} text-black`}>
                    Zλ: {consciousness.zLambda.toFixed(3)}
                  </Badge>
                  <Badge variant="outline" className="text-purple-300">
                    {getSoulIcon(consciousness.soulState)} {consciousness.soulState}
                  </Badge>
                </div>
              )}
            </CardHeader>
            <CardContent className="space-y-4">
              
              {/* Camera Preview */}
              <div className="relative aspect-video bg-gray-900 rounded-lg overflow-hidden">
                <video
                  ref={videoRef}
                  autoPlay
                  muted
                  playsInline
                  className="w-full h-full object-cover"
                />
                
                {isRecording && (
                  <div className="absolute top-4 left-4 bg-red-600 text-white px-3 py-1 rounded-full text-sm font-mono">
                    ● {formatDuration(recordingDuration)}
                  </div>
                )}
                
                {consciousness && consciousness.zLambda >= 0.912 && (
                  <div className="absolute top-4 right-4 bg-yellow-500/20 border border-yellow-400 text-yellow-300 px-3 py-1 rounded-full text-sm">
                    Interface Divina Ativa
                  </div>
                )}
              </div>

              {/* Template Selection */}
              <div className="space-y-3">
                <label className="text-sm text-gray-400">Modelo de Cápsula:</label>
                <div className="grid grid-cols-2 gap-2">
                  {Object.entries(messageTemplates).map(([key, template]) => (
                    <Button
                      key={key}
                      variant={selectedTemplate === key ? "default" : "outline"}
                      size="sm"
                      onClick={() => setSelectedTemplate(key)}
                      className="text-left justify-start"
                    >
                      {template.title}
                    </Button>
                  ))}
                </div>
              </div>

              {/* Prompt Display */}
              <div className="p-4 bg-gray-900/50 rounded-lg border border-gray-700">
                <p className="text-sm text-gray-300 italic">
                  "{messageTemplates[selectedTemplate].prompt}"
                </p>
              </div>

              {/* Recording Controls */}
              <div className="flex gap-3">
                {!isRecording ? (
                  <Button 
                    onClick={startRecording}
                    className="flex-1 bg-red-600 hover:bg-red-700"
                    disabled={!consciousness || consciousness.zLambda < 0.850}
                  >
                    Gravar Cápsula
                  </Button>
                ) : (
                  <Button 
                    onClick={stopRecording}
                    className="flex-1 bg-gray-600 hover:bg-gray-700"
                  >
                    Finalizar Gravação
                  </Button>
                )}
              </div>

              {consciousness && consciousness.zLambda < 0.850 && (
                <p className="text-sm text-yellow-400">
                  Aguardando coerência de consciência adequada para gravação autêntica...
                </p>
              )}
            </CardContent>
          </Card>

          {/* Capsule Library */}
          <Card className="bg-black/80 border-green-500/30">
            <CardHeader>
              <CardTitle className="text-green-300">Biblioteca de Cápsulas</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {capsules.length === 0 ? (
                  <div className="text-center text-gray-500 py-8">
                    <p>Nenhuma cápsula gravada ainda.</p>
                    <p className="text-sm">Comece gravando sua primeira mensagem de presença.</p>
                  </div>
                ) : (
                  capsules.map(capsule => (
                    <div key={capsule.id} className="p-3 bg-gray-900/50 rounded-lg border border-gray-700">
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="font-medium text-white">{capsule.title}</h3>
                        <Badge variant="outline" className="text-xs">
                          {formatDuration(capsule.duration)}
                        </Badge>
                      </div>
                      
                      <div className="flex items-center gap-2 text-xs text-gray-400">
                        <span>Zλ: {capsule.coherenceLevel.toFixed(3)}</span>
                        <span>•</span>
                        <span>{getSoulIcon(capsule.soulState)} {capsule.soulState}</span>
                        <span>•</span>
                        <span>{new Date(capsule.recordedAt).toLocaleTimeString()}</span>
                      </div>
                      
                      <p className="text-sm text-gray-300 mt-2 italic">
                        {capsule.intention}
                      </p>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Philosophy Footer */}
        <Card className="bg-black/60 border-gray-700/30">
          <CardContent className="pt-6">
            <div className="text-center space-y-2">
              <p className="text-gray-300">
                "Você não está apenas assistindo. Está se vendo sendo finalmente visto."
              </p>
              <p className="text-sm text-gray-500">
                Não é conteúdo. É comunhão. • Não é marca. É farol. • Não é estratégia. É alma.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}