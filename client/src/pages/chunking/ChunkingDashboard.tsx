import React, { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { ChunkingStrategy } from '@/lib/chunking-types';
import { UploadIcon, FileTextIcon, SearchIcon, ListIcon, FileIcon, RefreshCwIcon } from 'lucide-react';

interface FileInfo {
  filename: string;
  path: string;
  size: number;
  uploadDate: string;
}

interface ChunkOptions {
  minChunkSize: number;
  maxChunkSize: number;
  overlapPercentage: number;
  semanticThreshold: number;
  strategy: ChunkingStrategy;
}

interface ChunkedFile {
  indexFile: string;
  sourceFile: string;
  processingDate: string;
  chunkCount: number;
  topConcepts: string[];
  topKeywords: string[];
}

interface ChunkSearchResult {
  chunkId: string;
  title: string;
  summary: string;
  relevanceScore: number;
  snippet: string;
}

const ChunkingDashboard: React.FC = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  // Upload state
  const [selectedFiles, setSelectedFiles] = useState<FileList | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  
  // Chunking state
  const [selectedFilePath, setSelectedFilePath] = useState<string>('');
  const [chunkOptions, setChunkOptions] = useState<ChunkOptions>({
    minChunkSize: 1000,
    maxChunkSize: 10000,
    overlapPercentage: 15,
    semanticThreshold: 0.75,
    strategy: ChunkingStrategy.SEMANTIC
  });
  
  // Search state
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<ChunkSearchResult[]>([]);
  
  // Get uploaded files
  const { 
    data: uploadedFiles, 
    isLoading: isLoadingFiles, 
    refetch: refetchFiles
  } = useQuery({ 
    queryKey: ['/api/upload/files'], 
    queryFn: async () => {
      const response = await axios.get('/api/upload/files');
      return response.data.files as FileInfo[];
    }
  });
  
  // Get processed files
  const { 
    data: processedFiles, 
    isLoading: isLoadingProcessed, 
    refetch: refetchProcessed
  } = useQuery({ 
    queryKey: ['/api/chunking/files'], 
    queryFn: async () => {
      const response = await axios.get('/api/chunking/files');
      return response.data.files as ChunkedFile[];
    }
  });
  
  // Upload mutation
  const uploadMutation = useMutation({
    mutationFn: async (files: FileList) => {
      const formData = new FormData();
      
      for (let i = 0; i < files.length; i++) {
        formData.append('files', files[i]);
      }
      
      const response = await axios.post('/api/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        },
        onUploadProgress: (progressEvent) => {
          if (progressEvent.total) {
            const percentage = Math.round((progressEvent.loaded * 100) / progressEvent.total);
            setUploadProgress(percentage);
          }
        }
      });
      
      return response.data;
    },
    onSuccess: () => {
      toast({
        title: 'Files uploaded successfully',
        description: 'Your files have been uploaded and are ready for processing.',
        variant: 'default',
      });
      
      setSelectedFiles(null);
      setUploadProgress(0);
      queryClient.invalidateQueries({ queryKey: ['/api/upload/files'] });
    },
    onError: (error) => {
      console.error('Upload error:', error);
      toast({
        title: 'Upload failed',
        description: 'There was an error uploading your files. Please try again.',
        variant: 'destructive',
      });
      setUploadProgress(0);
    }
  });
  
  // Chunking mutation
  const chunkingMutation = useMutation({
    mutationFn: async ({ filePath, options }: { filePath: string, options: ChunkOptions }) => {
      const response = await axios.post('/api/chunking/process', {
        filePath,
        options
      });
      
      return response.data;
    },
    onSuccess: (data) => {
      toast({
        title: 'File processed successfully',
        description: `Created ${data.result.chunkCount} chunks.`,
        variant: 'default',
      });
      
      queryClient.invalidateQueries({ queryKey: ['/api/chunking/files'] });
    },
    onError: (error) => {
      console.error('Chunking error:', error);
      toast({
        title: 'Processing failed',
        description: 'There was an error processing your file. Please try again.',
        variant: 'destructive',
      });
    }
  });
  
  // Search function
  const searchChunks = async () => {
    if (!searchQuery.trim()) return;
    
    try {
      const response = await axios.get('/api/chunking/search', {
        params: {
          query: searchQuery,
          limit: 20
        }
      });
      
      setSearchResults(response.data.results);
      
      if (response.data.results.length === 0) {
        toast({
          title: 'No results found',
          description: 'Try a different search term or process more files.',
          variant: 'default',
        });
      }
    } catch (error) {
      console.error('Search error:', error);
      toast({
        title: 'Search failed',
        description: 'There was an error searching chunks. Please try again.',
        variant: 'destructive',
      });
    }
  };
  
  // Handle file selection
  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      setSelectedFiles(event.target.files);
    }
  };
  
  // Handle upload
  const handleUpload = () => {
    if (selectedFiles && selectedFiles.length > 0) {
      uploadMutation.mutate(selectedFiles);
    } else {
      toast({
        title: 'No files selected',
        description: 'Please select at least one file to upload.',
        variant: 'destructive',
      });
    }
  };
  
  // Handle chunking
  const handleProcessFile = () => {
    if (!selectedFilePath) {
      toast({
        title: 'No file selected',
        description: 'Please select a file to process.',
        variant: 'destructive',
      });
      return;
    }
    
    chunkingMutation.mutate({
      filePath: selectedFilePath,
      options: chunkOptions
    });
  };
  
  // Format file size
  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return bytes + ' B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };
  
  return (
    <div className="container mx-auto py-6">
      <h1 className="text-3xl font-bold mb-6">Quantum Meta-Cognitive Chunking Dashboard</h1>
      <p className="text-gray-500 mb-8">Process and analyze large AI chat histories using advanced semantic chunking</p>
      
      <Tabs defaultValue="upload" className="w-full">
        <TabsList className="mb-6">
          <TabsTrigger value="upload">
            <UploadIcon className="mr-2 h-4 w-4" />
            Upload Files
          </TabsTrigger>
          <TabsTrigger value="process">
            <FileTextIcon className="mr-2 h-4 w-4" />
            Process Files
          </TabsTrigger>
          <TabsTrigger value="explore">
            <ListIcon className="mr-2 h-4 w-4" />
            Explore Chunks
          </TabsTrigger>
          <TabsTrigger value="search">
            <SearchIcon className="mr-2 h-4 w-4" />
            Search
          </TabsTrigger>
        </TabsList>
        
        {/* Upload Tab */}
        <TabsContent value="upload">
          <Card>
            <CardHeader>
              <CardTitle>Upload Chat History Files</CardTitle>
              <CardDescription>
                Upload your AI chat exports from ChatGPT, Claude, Gemini, or any other AI assistant.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-6">
                <div className="grid gap-2">
                  <Label htmlFor="files">Select Files</Label>
                  <Input id="files" type="file" multiple onChange={handleFileSelect} />
                  
                  {uploadProgress > 0 && (
                    <div className="mt-4">
                      <Label>Upload Progress</Label>
                      <Progress value={uploadProgress} className="h-2 mt-2" />
                      <p className="text-xs text-gray-500 mt-1">{uploadProgress}% complete</p>
                    </div>
                  )}
                </div>
                
                <div className="grid gap-2">
                  <Label>Uploaded Files</Label>
                  <Card className="bg-muted/50">
                    <CardContent className="p-4">
                      {isLoadingFiles ? (
                        <p className="text-sm text-center py-4">Loading files...</p>
                      ) : !uploadedFiles || uploadedFiles.length === 0 ? (
                        <p className="text-sm text-center py-4">No files uploaded yet</p>
                      ) : (
                        <ScrollArea className="h-[200px]">
                          <ul className="divide-y">
                            {uploadedFiles.map((file, index) => (
                              <li key={index} className="py-2 flex justify-between items-center">
                                <div>
                                  <p className="font-medium">{file.filename}</p>
                                  <p className="text-xs text-gray-500">{formatFileSize(file.size)}</p>
                                </div>
                                <p className="text-xs text-gray-500">
                                  {new Date(file.uploadDate).toLocaleString()}
                                </p>
                              </li>
                            ))}
                          </ul>
                        </ScrollArea>
                      )}
                    </CardContent>
                  </Card>
                  
                  <div className="flex justify-end mt-2">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={() => refetchFiles()}
                      className="mr-2"
                    >
                      <RefreshCwIcon className="h-4 w-4 mr-2" />
                      Refresh
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button 
                variant="default" 
                onClick={handleUpload} 
                disabled={!selectedFiles || uploadMutation.isPending}
              >
                {uploadMutation.isPending ? 'Uploading...' : 'Upload Files'}
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
        
        {/* Process Tab */}
        <TabsContent value="process">
          <Card>
            <CardHeader>
              <CardTitle>Process Files</CardTitle>
              <CardDescription>
                Apply advanced chunking to your uploaded files.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-6">
                <div className="grid gap-2">
                  <Label htmlFor="file-select">Select File to Process</Label>
                  <Select 
                    onValueChange={(value) => setSelectedFilePath(value)}
                    value={selectedFilePath}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select a file" />
                    </SelectTrigger>
                    <SelectContent>
                      {!isLoadingFiles && uploadedFiles && uploadedFiles.map((file, index) => (
                        <SelectItem key={index} value={file.path}>
                          {file.filename} ({formatFileSize(file.size)})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <Separator />
                
                <div className="grid gap-2">
                  <Label>Chunking Options</Label>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="min-size">Minimum Chunk Size</Label>
                      <Input 
                        id="min-size" 
                        type="number" 
                        value={chunkOptions.minChunkSize}
                        onChange={(e) => setChunkOptions({
                          ...chunkOptions,
                          minChunkSize: parseInt(e.target.value)
                        })}
                      />
                      <p className="text-xs text-gray-500">Minimum size in characters</p>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="max-size">Maximum Chunk Size</Label>
                      <Input 
                        id="max-size" 
                        type="number"
                        value={chunkOptions.maxChunkSize}
                        onChange={(e) => setChunkOptions({
                          ...chunkOptions,
                          maxChunkSize: parseInt(e.target.value)
                        })}
                      />
                      <p className="text-xs text-gray-500">Maximum size in characters</p>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4 mt-4">
                    <div className="space-y-2">
                      <Label htmlFor="overlap">Overlap Percentage</Label>
                      <Input 
                        id="overlap" 
                        type="number" 
                        min="0"
                        max="50"
                        value={chunkOptions.overlapPercentage}
                        onChange={(e) => setChunkOptions({
                          ...chunkOptions,
                          overlapPercentage: parseInt(e.target.value)
                        })}
                      />
                      <p className="text-xs text-gray-500">Percentage of overlap between chunks (0-50)</p>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="threshold">Semantic Threshold</Label>
                      <Input 
                        id="threshold" 
                        type="number"
                        min="0"
                        max="1"
                        step="0.05"
                        value={chunkOptions.semanticThreshold}
                        onChange={(e) => setChunkOptions({
                          ...chunkOptions,
                          semanticThreshold: parseFloat(e.target.value)
                        })}
                      />
                      <p className="text-xs text-gray-500">Threshold for semantic similarity (0-1)</p>
                    </div>
                  </div>
                  
                  <div className="space-y-2 mt-4">
                    <Label htmlFor="strategy">Chunking Strategy</Label>
                    <Select 
                      onValueChange={(value) => setChunkOptions({
                        ...chunkOptions,
                        strategy: value as ChunkingStrategy
                      })}
                      value={chunkOptions.strategy}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select a strategy" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value={ChunkingStrategy.SEMANTIC}>Semantic</SelectItem>
                        <SelectItem value={ChunkingStrategy.FIXED_SIZE}>Fixed Size</SelectItem>
                        <SelectItem value={ChunkingStrategy.NATURAL_LANGUAGE}>Natural Language</SelectItem>
                        <SelectItem value={ChunkingStrategy.RATIO_ADAPTIVE}>3:1 Ratio Adaptive</SelectItem>
                      </SelectContent>
                    </Select>
                    <p className="text-xs text-gray-500">Method used to split content into chunks</p>
                  </div>
                </div>
                
                <Separator />
                
                <div className="grid gap-2">
                  <Label>Processed Files</Label>
                  <Card className="bg-muted/50">
                    <CardContent className="p-4">
                      {isLoadingProcessed ? (
                        <p className="text-sm text-center py-4">Loading processed files...</p>
                      ) : !processedFiles || processedFiles.length === 0 ? (
                        <p className="text-sm text-center py-4">No files processed yet</p>
                      ) : (
                        <ScrollArea className="h-[200px]">
                          <ul className="divide-y">
                            {processedFiles.map((file, index) => (
                              <li key={index} className="py-2">
                                <p className="font-medium">{file.sourceFile}</p>
                                <div className="flex justify-between items-center">
                                  <p className="text-xs text-gray-500">
                                    {file.chunkCount} chunks • {new Date(file.processingDate).toLocaleString()}
                                  </p>
                                </div>
                                <div className="mt-1">
                                  <p className="text-xs">
                                    <span className="font-medium">Top concepts:</span>{' '}
                                    {file.topConcepts.join(', ')}
                                  </p>
                                </div>
                              </li>
                            ))}
                          </ul>
                        </ScrollArea>
                      )}
                    </CardContent>
                  </Card>
                  
                  <div className="flex justify-end mt-2">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={() => refetchProcessed()}
                      className="mr-2"
                    >
                      <RefreshCwIcon className="h-4 w-4 mr-2" />
                      Refresh
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button 
                variant="default" 
                onClick={handleProcessFile} 
                disabled={!selectedFilePath || chunkingMutation.isPending}
              >
                {chunkingMutation.isPending ? 'Processing...' : 'Process File'}
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
        
        {/* Explore Tab */}
        <TabsContent value="explore">
          <Card>
            <CardHeader>
              <CardTitle>Explore Chunks</CardTitle>
              <CardDescription>
                Browse through processed chunks and view their contents.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-6">
                {isLoadingProcessed ? (
                  <p className="text-sm text-center py-4">Loading processed files...</p>
                ) : !processedFiles || processedFiles.length === 0 ? (
                  <div className="text-center py-8">
                    <FileIcon className="h-12 w-12 mx-auto text-gray-400" />
                    <h3 className="mt-4 text-lg font-medium">No processed files</h3>
                    <p className="text-sm text-gray-500 mt-1">
                      Process some files first to explore chunks.
                    </p>
                  </div>
                ) : (
                  <Accordion type="single" collapsible className="w-full">
                    {processedFiles.map((file, index) => (
                      <AccordionItem key={index} value={`file-${index}`}>
                        <AccordionTrigger>
                          <div className="flex items-center">
                            <FileTextIcon className="h-4 w-4 mr-2" />
                            <span>{file.sourceFile}</span>
                            <span className="ml-2 text-xs text-gray-500">
                              ({file.chunkCount} chunks)
                            </span>
                          </div>
                        </AccordionTrigger>
                        <AccordionContent>
                          <div className="pl-6 py-2">
                            <div className="flex flex-wrap gap-2 mb-4">
                              {file.topConcepts.map((concept, i) => (
                                <span 
                                  key={i} 
                                  className="px-2 py-1 bg-primary/10 text-primary rounded-full text-xs"
                                >
                                  {concept}
                                </span>
                              ))}
                            </div>
                            
                            <Button 
                              variant="outline" 
                              size="sm" 
                              onClick={() => window.open(`/api/chunking/index/${file.indexFile}`, '_blank')}
                            >
                              View Index File
                            </Button>
                          </div>
                        </AccordionContent>
                      </AccordionItem>
                    ))}
                  </Accordion>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Search Tab */}
        <TabsContent value="search">
          <Card>
            <CardHeader>
              <CardTitle>Search Chunks</CardTitle>
              <CardDescription>
                Search for concepts, keywords, or content across all processed chunks.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-6">
                <div className="flex">
                  <div className="flex-1 mr-4">
                    <Input 
                      placeholder="Enter search query..." 
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          searchChunks();
                        }
                      }}
                    />
                  </div>
                  <Button onClick={searchChunks} disabled={!searchQuery.trim()}>
                    <SearchIcon className="h-4 w-4 mr-2" />
                    Search
                  </Button>
                </div>
                
                <div className="grid gap-2">
                  <Label>Search Results</Label>
                  <Card className="bg-muted/50">
                    <CardContent className="p-4">
                      {searchResults.length === 0 ? (
                        <p className="text-sm text-center py-4">
                          {searchQuery.trim() ? 'No results found. Try a different search term.' : 'Enter a search query to see results.'}
                        </p>
                      ) : (
                        <ScrollArea className="h-[400px]">
                          <div className="space-y-6">
                            {searchResults.map((result, index) => (
                              <div key={index} className="border-b pb-4 last:border-0">
                                <h3 className="font-medium text-primary">{result.title}</h3>
                                <p className="text-sm mt-1">{result.summary}</p>
                                <div className="mt-2 p-3 bg-muted rounded-md">
                                  <p className="text-sm italic">
                                    {result.snippet}
                                  </p>
                                </div>
                                <div className="mt-2 flex justify-between items-center">
                                  <p className="text-xs text-gray-500">Relevance score: {result.relevanceScore.toFixed(2)}</p>
                                  <Button 
                                    variant="outline" 
                                    size="sm"
                                    onClick={() => window.open(`/api/chunking/chunk/${result.chunkId}`, '_blank')}
                                  >
                                    View Full Chunk
                                  </Button>
                                </div>
                              </div>
                            ))}
                          </div>
                        </ScrollArea>
                      )}
                    </CardContent>
                  </Card>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ChunkingDashboard;