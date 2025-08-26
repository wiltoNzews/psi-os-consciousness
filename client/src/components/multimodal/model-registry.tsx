import { useState } from 'react';
import { Card, CardHeader, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Copy, Search, Code, BrainCog, Cpu, FileText, ImageIcon, MusicIcon, MessagesSquare, LucideIcon, ExternalLink, ChevronRight, Sparkles, Music, Layers } from 'lucide-react';
import { cn } from '@/lib/utils';
import { type ModelDefinition } from '@/lib/mock-data';

// Mock data for models
const modelRegistry: ModelDefinition[] = [
  // OpenAI text models
  {
    id: 'gpt-4',
    name: 'GPT-4',
    provider: 'OpenAI',
    type: 'text',
    contextLength: 128000,
    performance: 92.8,
    costPerToken: 0.00003,
    status: 'available',
    version: '4.0'
  },
  {
    id: 'gpt-4-vision',
    name: 'GPT-4 Vision',
    provider: 'OpenAI',
    type: 'vision',
    contextLength: 128000,
    performance: 91.5,
    costPerToken: 0.00004,
    status: 'available',
    version: '4.0'
  },
  {
    id: 'gpt-4-turbo',
    name: 'GPT-4 Turbo',
    provider: 'OpenAI',
    type: 'text',
    contextLength: 128000,
    performance: 94.2,
    costPerToken: 0.00005,
    status: 'available',
    version: '4.1'
  },
  {
    id: 'whisper',
    name: 'Whisper',
    provider: 'OpenAI',
    type: 'audio',
    contextLength: 0,
    performance: 89.5,
    costPerToken: 0.00001,
    status: 'available',
    version: '3.5'
  },
  // Anthropic models
  {
    id: 'claude-3-opus',
    name: 'Claude 3 Opus',
    provider: 'Anthropic',
    type: 'multimodal',
    contextLength: 200000,
    performance: 95.6,
    costPerToken: 0.00005,
    status: 'available',
    version: '3.0'
  },
  {
    id: 'claude-3-sonnet',
    name: 'Claude 3 Sonnet',
    provider: 'Anthropic',
    type: 'multimodal',
    contextLength: 200000,
    performance: 93.1,
    costPerToken: 0.00003,
    status: 'available',
    version: '3.0'
  },
  // Stability models
  {
    id: 'stable-diffusion-xl',
    name: 'Stable Diffusion XL',
    provider: 'Stability AI',
    type: 'vision',
    contextLength: 0,
    performance: 90.8,
    costPerToken: 0.00002,
    status: 'available',
    version: '3.0'
  },
  // Cohere models
  {
    id: 'cohere-command-r',
    name: 'Command R',
    provider: 'Cohere',
    type: 'text',
    contextLength: 128000,
    performance: 89.9,
    costPerToken: 0.00002,
    status: 'available',
    version: '2.0'
  },
  // Example of a deprecated model
  {
    id: 'gpt-3.5-turbo',
    name: 'GPT-3.5 Turbo',
    provider: 'OpenAI',
    type: 'text',
    contextLength: 16000,
    performance: 86.5,
    costPerToken: 0.00001,
    status: 'deprecated',
    version: '3.5'
  },
  // Example of a preview model
  {
    id: 'gemini-pro',
    name: 'Gemini Pro',
    provider: 'Google',
    type: 'multimodal',
    contextLength: 32000,
    performance: 94.8,
    costPerToken: 0.00004,
    status: 'preview',
    version: '1.0'
  },
  {
    id: 'ai21-jurassic-2',
    name: 'Jurassic-2 Ultra',
    provider: 'AI21 Labs',
    type: 'text',
    contextLength: 8192,
    performance: 87.3,
    costPerToken: 0.00002,
    status: 'available',
    version: '2.0'
  }
];

function getModelTypeIcon(type: string): LucideIcon {
  switch(type) {
    case 'text': return MessagesSquare;
    case 'vision': return ImageIcon;
    case 'audio': return MusicIcon;
    case 'multimodal': return BrainCog;
    default: return Code;
  }
}

function getProviderColor(provider: string): string {
  switch(provider) {
    case 'OpenAI': return 'bg-emerald-500';
    case 'Anthropic': return 'bg-violet-500';
    case 'Stability AI': return 'bg-blue-500';
    case 'Cohere': return 'bg-pink-500';
    case 'Google': return 'bg-amber-500';
    case 'AI21 Labs': return 'bg-orange-500';
    default: return 'bg-gray-500';
  }
}

function getModelTypeColor(type: string): string {
  switch(type) {
    case 'text': return 'bg-blue-500/20 text-blue-500 hover:bg-blue-500/30 border-blue-500/20';
    case 'vision': return 'bg-emerald-500/20 text-emerald-500 hover:bg-emerald-500/30 border-emerald-500/20';
    case 'audio': return 'bg-amber-500/20 text-amber-500 hover:bg-amber-500/30 border-amber-500/20';
    case 'multimodal': return 'bg-purple-500/20 text-purple-500 hover:bg-purple-500/30 border-purple-500/20';
    default: return 'bg-gray-500/20 text-gray-500 hover:bg-gray-500/30 border-gray-500/20';
  }
}

function getModelStatusBadge(status: string) {
  switch(status) {
    case 'available':
      return (
        <Badge className="bg-green-500/20 text-green-500 hover:bg-green-500/30 border-green-500/20">
          <span className="w-1.5 h-1.5 rounded-full bg-green-500 mr-1.5"></span>
          Available
        </Badge>
      );
    case 'preview':
      return (
        <Badge className="bg-blue-500/20 text-blue-500 hover:bg-blue-500/30 border-blue-500/20">
          <span className="w-1.5 h-1.5 rounded-full bg-blue-500 mr-1.5"></span>
          Preview
        </Badge>
      );
    case 'deprecated':
      return (
        <Badge className="bg-red-500/20 text-red-500 hover:bg-red-500/30 border-red-500/20">
          <span className="w-1.5 h-1.5 rounded-full bg-red-500 mr-1.5"></span>
          Deprecated
        </Badge>
      );
    default:
      return (
        <Badge className="bg-gray-500/20 text-gray-500 hover:bg-gray-500/30 border-gray-500/20">
          Unknown
        </Badge>
      );
  }
}

function formatCost(cost: number): string {
  return `$${cost.toFixed(5)}`;
}

interface ModelCardProps {
  model: ModelDefinition;
  index: number;
}

function ModelCard({ model, index }: ModelCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const TypeIcon = getModelTypeIcon(model.type);
  const animationDelay = `${index * 0.1}s`;
  
  return (
    <Card 
      className={cn(
        "bg-gray-900/70 backdrop-blur border-gray-800 overflow-hidden transition-all duration-200",
        "hover:ring-2 hover:ring-opacity-50 hover:shadow-xl hover:shadow-black/5",
        model.status === 'available' 
          ? 'hover:ring-primary/30'
          : model.status === 'preview'
            ? 'hover:ring-blue-500/30'
            : 'hover:ring-red-500/30',
        "animate-fade-in"
      )}
      style={{ animationDelay }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <CardContent className="p-5">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center">
            <div className={cn("w-10 h-10 rounded-full flex items-center justify-center", getProviderColor(model.provider))}>
              {model.provider === 'OpenAI' && <Code className="h-5 w-5 text-white" />}
              {model.provider === 'Anthropic' && <BrainCog className="h-5 w-5 text-white" />}
              {model.provider === 'Stability AI' && <ImageIcon className="h-5 w-5 text-white" />}
              {model.provider === 'Cohere' && <MessagesSquare className="h-5 w-5 text-white" />}
              {model.provider === 'Google' && <Cpu className="h-5 w-5 text-white" />}
              {model.provider === 'AI21 Labs' && <FileText className="h-5 w-5 text-white" />}
            </div>
            <div className="ml-3">
              <h3 className="text-lg font-bold text-white leading-tight">{model.name}</h3>
              <div className="text-sm text-gray-400">{model.provider}</div>
            </div>
          </div>
          
          {getModelStatusBadge(model.status)}
        </div>
        
        <div className="grid grid-cols-3 gap-4 mb-4">
          <div className="text-center p-2 bg-gray-800/50 rounded-md">
            <div className="text-xs text-gray-400 mb-1">Type</div>
            <Badge className={getModelTypeColor(model.type)}>
              <TypeIcon className="h-3 w-3 mr-1" />
              {model.type.charAt(0).toUpperCase() + model.type.slice(1)}
            </Badge>
          </div>
          
          <div className="text-center p-2 bg-gray-800/50 rounded-md">
            <div className="text-xs text-gray-400 mb-1">Performance</div>
            <div className="text-sm font-semibold text-white">{model.performance}%</div>
          </div>
          
          <div className="text-center p-2 bg-gray-800/50 rounded-md">
            <div className="text-xs text-gray-400 mb-1">Cost/Token</div>
            <div className="text-sm font-semibold text-white">{formatCost(model.costPerToken)}</div>
          </div>
        </div>
        
        <div className="flex justify-between items-center text-sm">
          <div className="text-gray-400">
            Context: <span className="text-white font-medium">{model.contextLength.toLocaleString()} tokens</span>
          </div>
          <div className="text-gray-400">
            Version: <span className="text-white font-medium">{model.version}</span>
          </div>
        </div>
      </CardContent>
      
      <CardFooter className="border-t border-gray-800 px-5 py-3 bg-gray-950/50 flex justify-between">
        <Button variant="ghost" size="sm" className="text-primary hover:text-primary/90 p-0">
          <Code className="h-4 w-4 mr-1.5" />
          API Docs
        </Button>
        
        <Button variant="outline" size="sm" className="bg-gray-800/50 border-gray-700 text-white hover:bg-gray-700">
          Model Details
          <ChevronRight className="h-3.5 w-3.5 ml-1.5" />
        </Button>
      </CardFooter>
    </Card>
  );
}

interface ModelFilterProps {
  activeFilter: string;
  setActiveFilter: (filter: string) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
}

function ModelFilters({ activeFilter, setActiveFilter, searchQuery, setSearchQuery }: ModelFilterProps) {
  return (
    <div className="flex flex-col md:flex-row justify-between items-start md:items-center space-y-4 md:space-y-0 mb-6">
      <div>
        <h2 className="text-xl font-bold text-white mb-1">AI Model Registry</h2>
        <p className="text-sm text-gray-400">
          Browse and manage available multimodal AI models
        </p>
      </div>
      
      <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-4 w-full md:w-auto">
        <div className="relative w-full sm:w-64">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-500" />
          <Input
            placeholder="Search models..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="bg-gray-800 border-gray-700 pl-10"
          />
        </div>
        
        <div className="flex space-x-2">
          <Button 
            variant="outline"
            size="sm"
            className={cn(
              "border-gray-700",
              activeFilter === "all" 
                ? "bg-primary text-white border-primary"
                : "bg-gray-800/50 text-gray-300 hover:bg-gray-700"
            )}
            onClick={() => setActiveFilter("all")}
          >
            All
          </Button>
          <Button 
            variant="outline"
            size="sm"
            className={cn(
              "border-gray-700",
              activeFilter === "multimodal" 
                ? "bg-primary text-white border-primary"
                : "bg-gray-800/50 text-gray-300 hover:bg-gray-700"
            )}
            onClick={() => setActiveFilter("multimodal")}
          >
            Multimodal
          </Button>
          <Button 
            variant="outline"
            size="sm"
            className={cn(
              "border-gray-700",
              activeFilter === "text" 
                ? "bg-primary text-white border-primary"
                : "bg-gray-800/50 text-gray-300 hover:bg-gray-700"
            )}
            onClick={() => setActiveFilter("text")}
          >
            Text
          </Button>
        </div>
      </div>
    </div>
  );
}

export function ModelRegistrySection() {
  const [activeTab, setActiveTab] = useState('models');
  const [activeFilter, setActiveFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  
  // Filter models based on search query and active filter
  const filteredModels = modelRegistry.filter(model => {
    const matchesSearch = searchQuery === '' || 
      model.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      model.provider.toLowerCase().includes(searchQuery.toLowerCase()) ||
      model.id.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesFilter = activeFilter === 'all' || model.type === activeFilter;
    
    return matchesSearch && matchesFilter;
  });
  
  return (
    <div className="mb-8 animate-fade-in space-y-6">
      <div className="flex items-center mb-2">
        <div className="flex-grow h-px bg-gray-800"></div>
        <div className="mx-4 flex items-center px-3 py-1.5 rounded-full bg-primary/10 border border-primary/20">
          <span className="w-2 h-2 rounded-full bg-primary mr-2"></span>
          <span className="text-xs font-semibold tracking-wide text-primary">MULTIMODAL AI MODEL REGISTRY</span>
        </div>
        <div className="flex-grow h-px bg-gray-800"></div>
      </div>
      
      <Card className="bg-gray-900/70 backdrop-blur border-gray-800 shadow-xl">
        <CardHeader className="px-6 py-5 border-b border-gray-800">
          <div className="w-full">
            <Tabs defaultValue="models" value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid grid-cols-3 mb-0 bg-gray-800/60">
                <TabsTrigger value="models" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                  Models
                </TabsTrigger>
                <TabsTrigger value="integrations" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                  Integrations
                </TabsTrigger>
                <TabsTrigger value="settings" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                  Settings
                </TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
        </CardHeader>
        
        <CardContent className="p-6">
          {activeTab === "models" && (
            <div className="space-y-6">
              <ModelFilters 
                activeFilter={activeFilter}
                setActiveFilter={setActiveFilter}
                searchQuery={searchQuery}
                setSearchQuery={setSearchQuery}
              />
              
              {filteredModels.length === 0 ? (
                <div className="flex flex-col items-center justify-center text-center py-12 border border-dashed border-gray-700 rounded-lg">
                  <BrainCog className="h-12 w-12 text-gray-600 mb-4" />
                  <h3 className="text-lg font-medium text-white mb-2">No models found</h3>
                  <p className="text-gray-400 max-w-md mb-6">
                    No models match your current filter criteria. Try adjusting your search or filters.
                  </p>
                  <Button 
                    variant="outline"
                    className="bg-gray-800 border-gray-700"
                    onClick={() => {
                      setSearchQuery('');
                      setActiveFilter('all');
                    }}
                  >
                    Clear Filters
                  </Button>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                  {filteredModels.map((model, index) => (
                    <ModelCard key={model.id} model={model} index={index} />
                  ))}
                </div>
              )}
            </div>
          )}
          
          {activeTab === "integrations" && (
            <div className="flex items-center justify-center h-60 border border-dashed border-gray-700 rounded-lg">
              <div className="text-center p-6 max-w-md">
                <Cpu className="mx-auto h-10 w-10 text-gray-500 mb-4" />
                <h3 className="text-lg font-medium text-white mb-2">Model Integrations</h3>
                <p className="text-sm text-gray-400 mb-4">
                  Configure LangChain, LlamaIndex and other framework integrations for your AI models.
                </p>
                <Button variant="outline" className="bg-gray-800 border-gray-700">
                  Set Up Integrations
                </Button>
              </div>
            </div>
          )}
          
          {activeTab === "settings" && (
            <div className="flex items-center justify-center h-60 border border-dashed border-gray-700 rounded-lg">
              <div className="text-center p-6 max-w-md">
                <FileText className="mx-auto h-10 w-10 text-gray-500 mb-4" />
                <h3 className="text-lg font-medium text-white mb-2">Model Settings</h3>
                <p className="text-sm text-gray-400 mb-4">
                  Configure default parameters, caching, and system prompts for your AI models.
                </p>
                <Button variant="outline" className="bg-gray-800 border-gray-700">
                  Configure Models
                </Button>
              </div>
            </div>
          )}
        </CardContent>
        
        <CardFooter className="bg-gray-950/50 border-t border-gray-800 px-6 py-4">
          <div className="flex justify-between items-center w-full">
            <div className="text-sm text-gray-400 flex items-center">
              <BrainCog className="h-4 w-4 mr-2 text-primary" />
              {filteredModels.length} model{filteredModels.length !== 1 ? 's' : ''} available in registry
            </div>
            <Button variant="link" className="text-primary hover:text-primary/90 p-0 flex items-center">
              Model Provider Docs
              <ExternalLink className="h-3.5 w-3.5 ml-1.5" />
            </Button>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}

// Sample implementation of the LangChain example
const LangChainExampleCode = () => {
  return (
    <div className="p-4 bg-gray-950 rounded-lg border border-gray-800 font-mono text-sm text-gray-300 whitespace-pre">
      <div className="mb-3 text-gray-400 font-sans text-xs uppercase">LangChain Example Implementation</div>
      {`from langchain.llms import OpenAI
from langchain.agents import initialize_agent, Tool
from langchain.tools import WikipediaQueryRun

# Define separate models for text and image processing
text_model = OpenAI(model="gpt-4")
vision_model = OpenAI(model="gpt-4-vision")

# Define tools (e.g., Wikipedia search, Image processing)
text_tool = Tool(
    name="Text_Processor",
    func=lambda x: text_model(x),
    description="Processes text queries."
)
vision_tool = Tool(
    name="Vision_Processor",
    func=lambda x: vision_model(x),
    description="Processes image-based queries."
)

# Create AI Agent with routing
agent = initialize_agent(
    tools=[text_tool, vision_tool],
    agent="zero-shot-react-description",
    llm=text_model
)

# Example input
query = "What is the Eiffel Tower? [TEXT]"
response = agent.run(query)
print("Response:", response)`}
    </div>
  );
};

export function LangChainIntegrationExample() {
  return (
    <div className="mb-8 animate-fade-in space-y-6">
      <div className="flex items-center mb-2">
        <div className="flex-grow h-px bg-gray-800"></div>
        <div className="mx-4 flex items-center px-3 py-1.5 rounded-full bg-blue-600/10 border border-blue-600/20">
          <span className="w-2 h-2 rounded-full bg-blue-500 mr-2"></span>
          <span className="text-xs font-semibold tracking-wide text-blue-400">MULTIMODAL SYMPHONY INTEGRATION</span>
        </div>
        <div className="flex-grow h-px bg-gray-800"></div>
      </div>
      
      <div className="pw-card rounded-lg shadow-xl overflow-hidden">
        <div className="relative">
          <div className="absolute top-0 right-0 w-40 h-40 -mt-20 -mr-20 opacity-5">
            <div className="animate-rotate-slow">
              <Music className="w-full h-full" />
            </div>
          </div>
          
          <div className="px-6 py-5 border-b border-gray-800 bg-blue-900/10 pw-border-gradient relative z-10">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="h-10 w-10 rounded-full bg-blue-600/20 flex items-center justify-center mr-3">
                  <Layers className="h-5 w-5 text-blue-400" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-white mb-1">Symphony LangChain Integration</h2>
                  <p className="text-sm text-gray-300">
                    Orchestrate multimodal AI functions with harmony and precision
                  </p>
                </div>
              </div>
              <Button 
                className="bg-blue-600 hover:bg-blue-700 text-white"
              >
                <Code className="mr-2 h-4 w-4" />
                Copy Code
              </Button>
            </div>
          </div>
          
          <div className="p-6 bg-gray-900/70 backdrop-blur">
            <div className="animate-shimmer overflow-hidden rounded-lg">
              <LangChainExampleCode />
            </div>
            
            <div className="mt-6 p-5 bg-blue-950/30 rounded-lg border border-blue-900/20">
              <div className="flex items-start">
                <div className="bg-blue-500/20 rounded-full p-2 mt-0.5 mr-4 flex-shrink-0">
                  <BrainCog className="h-5 w-5 text-blue-400" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-white mb-2">Symphony Composition</h3>
                  <p className="text-sm text-gray-300 leading-relaxed">
                    This example showcases our advanced multimodal agent using LangChain that conducts queries across text, vision, and other modalities - routing each part to the appropriate specialized model, much like a symphony conductor directs different instrument sections.
                  </p>
                  
                  <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="pw-maestro-card p-4 rounded-md">
                      <div className="text-sm font-medium text-white mb-2 flex items-center">
                        <div className="h-6 w-6 rounded-full bg-blue-900/50 flex items-center justify-center mr-2">
                          <MessagesSquare className="h-3.5 w-3.5 text-blue-400" />
                        </div>
                        The Maestro
                      </div>
                      <p className="text-xs text-gray-400">
                        Core GPT-4 model orchestrates and coordinates the entire multimodal processing pipeline.
                      </p>
                    </div>
                    
                    <div className="pw-mediator-card p-4 rounded-md">
                      <div className="text-sm font-medium text-white mb-2 flex items-center">
                        <div className="h-6 w-6 rounded-full bg-purple-900/50 flex items-center justify-center mr-2">
                          <ImageIcon className="h-3.5 w-3.5 text-purple-400" />
                        </div>
                        The Mediator
                      </div>
                      <p className="text-xs text-gray-400">
                        Vision module interprets visual data and translates it into rich semantic representations.
                      </p>
                    </div>
                    
                    <div className="pw-architect-card p-4 rounded-md">
                      <div className="text-sm font-medium text-white mb-2 flex items-center">
                        <div className="h-6 w-6 rounded-full bg-amber-900/50 flex items-center justify-center mr-2">
                          <Sparkles className="h-3.5 w-3.5 text-amber-400" />
                        </div>
                        The Architect
                      </div>
                      <p className="text-xs text-gray-400">
                        System design enables effortless extension to additional specialized AI processing modules.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="bg-gray-950/50 border-t border-gray-800 px-6 py-4">
          <div className="flex justify-between items-center w-full">
            <div className="text-sm text-gray-400 flex items-center">
              <Code className="h-4 w-4 mr-2 text-blue-400" />
              <span>Python 3.10+ required for this integration</span>
            </div>
            <Button variant="link" className="text-blue-400 hover:text-blue-300 p-0 flex items-center">
              View Full Symphony Documentation
              <ExternalLink className="h-3.5 w-3.5 ml-1.5" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}