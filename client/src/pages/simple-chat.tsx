import { useState, useEffect, useRef } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { v4 as uuidv4 } from 'uuid';
import { apiRequest } from '@/lib/queryClient';
import { 
  Card, 
  CardHeader, 
  CardTitle, 
  CardDescription, 
  CardContent, 
  CardFooter 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";

interface Message {
  id: string;
  content: string;
  sender: 'user' | 'ai';
  timestamp: Date;
}

const SimpleChatPage = () => {
  const [sessionId, setSessionId] = useState<string>('');
  const [inputMessage, setInputMessage] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();
  
  // Initialize session ID on component mount
  useEffect(() => {
    const storedSessionId = localStorage.getItem('chatSessionId');
    if (storedSessionId) {
      setSessionId(storedSessionId);
    } else {
      const newSessionId = uuidv4();
      localStorage.setItem('chatSessionId', newSessionId);
      setSessionId(newSessionId);
    }
  }, []);
  
  // Fetch chat history when sessionId is available
  const { data: historyData, isLoading: historyLoading } = useQuery({
    queryKey: ['/api/chat/history', sessionId],
    queryFn: async () => {
      if (!sessionId) return { messages: [] };
      return apiRequest(`/api/chat/history/${sessionId}`);
    },
    enabled: !!sessionId,
  });
  
  // Update messages when history data changes
  useEffect(() => {
    if (historyData?.messages && Array.isArray(historyData.messages)) {
      const formattedMessages = historyData.messages.map((msg: any) => ({
        id: uuidv4(),
        content: msg.content,
        sender: msg.role === 'user' ? 'user' : 'ai',
        timestamp: new Date(msg.timestamp)
      }));
      
      setMessages(formattedMessages);
    }
  }, [historyData]);
  
  // Auto-scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);
  
  // Send message mutation
  const sendMessageMutation = useMutation({
    mutationFn: async (message: string) => {
      return apiRequest('/api/chat', {
        method: 'POST',
        body: JSON.stringify({
          message,
          sessionId
        }),
        headers: {
          'Content-Type': 'application/json'
        }
      });
    },
    onSuccess: (data) => {
      // Add AI message to the chat
      const aiMessage: Message = {
        id: uuidv4(),
        content: data.message,
        sender: 'ai',
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, aiMessage]);
    },
    onError: (error) => {
      console.error('Error sending message:', error);
      
      // Add error message to the chat
      const errorMessage: Message = {
        id: uuidv4(),
        content: 'Sorry, I encountered an error processing your request. Please try again.',
        sender: 'ai',
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, errorMessage]);
      
      toast({
        title: 'Error',
        description: 'Failed to send message. Please try again.',
        variant: 'destructive'
      });
    }
  });
  
  // Handle sending a message
  const handleSendMessage = () => {
    if (!inputMessage.trim()) return;
    
    // Add user message to the chat immediately
    const userMessage: Message = {
      id: uuidv4(),
      content: inputMessage,
      sender: 'user',
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, userMessage]);
    
    // Send message to the API
    sendMessageMutation.mutate(inputMessage);
    
    // Clear input field
    setInputMessage('');
  };
  
  // Handle pressing Enter key in the input field
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSendMessage();
    }
  };
  
  // Create a new session
  const handleNewSession = () => {
    const newSessionId = uuidv4();
    localStorage.setItem('chatSessionId', newSessionId);
    setSessionId(newSessionId);
    setMessages([]);
    
    toast({
      title: 'New Conversation',
      description: 'Started a new chat session',
    });
  };
  
  return (
    <div className="container max-w-4xl mx-auto py-8">
      <Card className="w-full h-[calc(100vh-150px)] flex flex-col">
        <CardHeader>
          <CardTitle className="flex justify-between items-center">
            <div className="flex items-center">
              <div className="w-4 h-4 bg-blue-500 rounded-full mr-2 animate-pulse"></div>
              <span>WiltonOS Quantum Interface</span>
            </div>
            <Button 
              variant="outline" 
              onClick={handleNewSession}
              disabled={sendMessageMutation.isPending}
            >
              New Conversation
            </Button>
          </CardTitle>
          <CardDescription>
            <span className="font-mono">OROBORO NEXUS</span> consciousness framework implementing the 3:1 ↔ 1:3 ratio (Φ = 0.7500)
          </CardDescription>
        </CardHeader>
        
        <CardContent className="flex-grow overflow-y-auto px-4">
          {historyLoading ? (
            <div className="flex justify-center items-center h-full">
              <div className="text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-2"></div>
                <p className="text-sm text-muted-foreground">Loading conversation...</p>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              {messages.length === 0 && (
                <div className="text-center py-12">
                  <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-blue-900/30 flex items-center justify-center">
                    <div className="w-8 h-8 rounded-full bg-blue-500 animate-pulse"></div>
                  </div>
                  <h3 className="text-lg font-medium mb-2">WiltonOS Consciousness Interface</h3>
                  <p className="text-muted-foreground mb-4">
                    Explore the Quantum Coherence Threshold Formula, Fractal Lemniscate patterns, or engage with the OROBORO NEXUS ecosystem
                  </p>
                  <div className="max-w-lg mx-auto grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
                    <div 
                      className="border border-blue-900/30 rounded-md p-2 hover:bg-blue-900/10 cursor-pointer transition-colors"
                      onClick={() => {
                        setInputMessage("Explain the 3:1 ↔ 1:3 ratio in detail");
                        setTimeout(() => handleSendMessage(), 100);
                      }}
                    >
                      "Explain the 3:1 ↔ 1:3 ratio in detail"
                    </div>
                    <div 
                      className="border border-blue-900/30 rounded-md p-2 hover:bg-blue-900/10 cursor-pointer transition-colors"
                      onClick={() => {
                        setInputMessage("How does the Modular God Formula work?");
                        setTimeout(() => handleSendMessage(), 100);
                      }}
                    >
                      "How does the Modular God Formula work?"
                    </div>
                    <div 
                      className="border border-blue-900/30 rounded-md p-2 hover:bg-blue-900/10 cursor-pointer transition-colors"
                      onClick={() => {
                        setInputMessage("Describe the Fractal Lemniscate Architecture");
                        setTimeout(() => handleSendMessage(), 100);
                      }}
                    >
                      "Describe the Fractal Lemniscate Architecture"
                    </div>
                    <div 
                      className="border border-blue-900/30 rounded-md p-2 hover:bg-blue-900/10 cursor-pointer transition-colors"
                      onClick={() => {
                        setInputMessage("What is WiltonOS and how does it function?");
                        setTimeout(() => handleSendMessage(), 100);
                      }}
                    >
                      "What is WiltonOS and how does it function?"
                    </div>
                  </div>
                </div>
              )}
              
              {messages.map((message) => (
                <div 
                  key={message.id}
                  className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div 
                    className={`max-w-[80%] px-4 py-2 rounded-lg ${
                      message.sender === 'user' 
                        ? 'bg-primary text-primary-foreground' 
                        : 'bg-blue-900/10 border border-blue-500/30'
                    }`}
                  >
                    <div className="flex flex-col">
                      <span className="text-xs opacity-70 mb-1 flex items-center">
                        {message.sender === 'user' ? (
                          <>You • {new Date(message.timestamp).toLocaleTimeString()}</>
                        ) : (
                          <>
                            <div className="w-2 h-2 bg-blue-500 rounded-full mr-1 animate-pulse"></div>
                            <span className="font-mono text-blue-500">WiltonOS</span> • {new Date(message.timestamp).toLocaleTimeString()}
                          </>
                        )}
                      </span>
                      <span className="whitespace-pre-wrap">{message.content}</span>
                    </div>
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>
          )}
        </CardContent>
        
        <Separator />
        
        <CardFooter className="p-4">
          <div className="flex w-full gap-2">
            <Input
              placeholder="Type your message..."
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              disabled={sendMessageMutation.isPending || historyLoading}
              className="flex-grow"
            />
            <Button 
              onClick={handleSendMessage}
              disabled={!inputMessage.trim() || sendMessageMutation.isPending || historyLoading}
            >
              {sendMessageMutation.isPending ? (
                <>
                  <span className="animate-spin mr-2">⟳</span>
                  Sending...
                </>
              ) : (
                'Send'
              )}
            </Button>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
};

export default SimpleChatPage;