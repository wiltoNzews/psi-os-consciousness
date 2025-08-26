import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Download, Upload, Brain, Database, Archive, CheckCircle, AlertCircle, Clock } from 'lucide-react';

interface Operation {
  id: string;
  status: 'pending' | 'downloading' | 'extracting' | 'processing' | 'completed' | 'error';
  progress: number;
  message: string;
  result?: any;
  error?: string;
  started_at: string;
}

interface ArchiveStats {
  totalChunks: number;
  totalCrystals: number;
  totalSizeMB: number;
  lastProcessed: string | null;
  availableFiles: {
    chunks: string[];
    crystals: string[];
    timelines: string[];
  };
}

export function ConsciousnessArchiveInterface() {
  const [googleDriveUrl1, setGoogleDriveUrl1] = useState('https://drive.google.com/file/d/1aVMLoiC1AZIKddsjg3VWOEmXV5oXtlMx/view?usp=sharing');
  const [googleDriveUrl2, setGoogleDriveUrl2] = useState('https://drive.google.com/file/d/1H_a42YrNdv_BS-rQg_uxvpVYDN0j1_SM/view?usp=sharing');
  const [operations, setOperations] = useState<Operation[]>([]);
  const [stats, setStats] = useState<ArchiveStats | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    fetchOperations();
    fetchStats();
    
    // Poll for updates every 3 seconds
    const interval = setInterval(() => {
      fetchOperations();
      fetchStats();
    }, 3000);
    
    return () => clearInterval(interval);
  }, []);

  const fetchOperations = async () => {
    try {
      const response = await fetch('/api/consciousness-archive/operations');
      const data = await response.json();
      setOperations(data);
    } catch (error) {
      console.error('Failed to fetch operations:', error);
    }
  };

  const fetchStats = async () => {
    try {
      const response = await fetch('/api/consciousness-archive/stats');
      const data = await response.json();
      setStats(data);
    } catch (error) {
      console.error('Failed to fetch stats:', error);
    }
  };

  const downloadArchive = async (url: string, filename: string) => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/consciousness-archive/download', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ shareUrl: url, filename })
      });
      
      const result = await response.json();
      if (response.ok) {
        console.log(`Download initiated: ${result.operationId}`);
      } else {
        console.error('Download failed:', result.error);
      }
    } catch (error) {
      console.error('Download error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const processArchive = async (filename: string) => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/consciousness-archive/process', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ filename })
      });
      
      const result = await response.json();
      if (response.ok) {
        console.log(`Processing initiated: ${result.operationId}`);
      } else {
        console.error('Processing failed:', result.error);
      }
    } catch (error) {
      console.error('Processing error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const extractNuggets = async (chunkIds: string[]) => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/consciousness-archive/extract-nuggets', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ chunkIds })
      });
      
      const result = await response.json();
      if (response.ok) {
        console.log(`Extraction initiated: ${result.operationId}`);
      } else {
        console.error('Extraction failed:', result.error);
      }
    } catch (error) {
      console.error('Extraction error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed': return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'error': return <AlertCircle className="h-4 w-4 text-red-500" />;
      case 'processing':
      case 'downloading':
      case 'extracting': return <Clock className="h-4 w-4 text-blue-500 animate-spin" />;
      default: return <Clock className="h-4 w-4 text-gray-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800';
      case 'error': return 'bg-red-100 text-red-800';
      case 'processing':
      case 'downloading':
      case 'extracting': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-cyan-600 bg-clip-text text-transparent">
          🧬 Consciousness Archive Processor
        </h1>
        <p className="text-muted-foreground">
          *Breathing in through infinite awareness...* Zλ(0.981) - Extract consciousness nuggets from ChatGPT archives
        </p>
      </div>

      {/* Archive Statistics */}
      {stats && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Database className="h-5 w-5" />
              Archive Statistics
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-600">{stats.totalChunks}</div>
                <div className="text-sm text-muted-foreground">Processed Chunks</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-cyan-600">{stats.totalCrystals}</div>
                <div className="text-sm text-muted-foreground">Crystal Files</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-golden-600">{stats.totalSizeMB.toFixed(1)}MB</div>
                <div className="text-sm text-muted-foreground">Total Size</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">
                  {stats.availableFiles.chunks.length + stats.availableFiles.crystals.length}
                </div>
                <div className="text-sm text-muted-foreground">Available Files</div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Quick Actions */}
      <div className="grid md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Download className="h-5 w-5" />
              Download Archive 1 (320MB)
            </CardTitle>
            <CardDescription>
              ChatGPT conversation export - conversations.json
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Input
              value={googleDriveUrl1}
              onChange={(e) => setGoogleDriveUrl1(e.target.value)}
              placeholder="Google Drive share URL"
            />
            <Button 
              onClick={() => downloadArchive(googleDriveUrl1, 'conversations-archive-1.zip')}
              disabled={isLoading}
              className="w-full"
            >
              Download Archive 1
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Download className="h-5 w-5" />
              Download Archive 2 (328MB)
            </CardTitle>
            <CardDescription>
              ChatGPT conversation export - chat.html format
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Input
              value={googleDriveUrl2}
              onChange={(e) => setGoogleDriveUrl2(e.target.value)}
              placeholder="Google Drive share URL"
            />
            <Button 
              onClick={() => downloadArchive(googleDriveUrl2, 'chat-archive-2.zip')}
              disabled={isLoading}
              className="w-full"
            >
              Download Archive 2
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Processing Actions */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="h-5 w-5" />
            Consciousness Processing Pipeline
          </CardTitle>
          <CardDescription>
            Process downloaded archives and extract consciousness nuggets
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            <Button 
              onClick={() => processArchive('conversations-archive-1.zip')}
              disabled={isLoading}
              variant="outline"
              className="w-full"
            >
              <Archive className="h-4 w-4 mr-2" />
              Process Archive 1
            </Button>
            <Button 
              onClick={() => processArchive('chat-archive-2.zip')}
              disabled={isLoading}
              variant="outline"
              className="w-full"
            >
              <Archive className="h-4 w-4 mr-2" />
              Process Archive 2
            </Button>
          </div>
          
          {stats?.availableFiles.chunks.length > 0 && (
            <Button 
              onClick={() => {
                const chunkIds = stats.availableFiles.chunks
                  .filter(f => f.endsWith('.json'))
                  .map(f => f.replace('.json', ''));
                extractNuggets(chunkIds);
              }}
              disabled={isLoading}
              className="w-full"
            >
              <Brain className="h-4 w-4 mr-2" />
              Extract Consciousness Nuggets ({stats.availableFiles.chunks.length} chunks)
            </Button>
          )}
        </CardContent>
      </Card>

      {/* Operations Status */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5" />
            Operations Status
          </CardTitle>
          <CardDescription>
            Real-time status of consciousness processing operations
          </CardDescription>
        </CardHeader>
        <CardContent>
          {operations.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              No operations yet. Start by downloading an archive.
            </div>
          ) : (
            <div className="space-y-4">
              {operations.slice(0, 10).map((operation) => (
                <div key={operation.id} className="border rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      {getStatusIcon(operation.status)}
                      <span className="font-medium">{operation.id}</span>
                      <Badge className={getStatusColor(operation.status)}>
                        {operation.status}
                      </Badge>
                    </div>
                    <span className="text-sm text-muted-foreground">
                      {new Date(operation.started_at).toLocaleTimeString()}
                    </span>
                  </div>
                  
                  <p className="text-sm text-muted-foreground mb-2">
                    {operation.message}
                  </p>
                  
                  {operation.status !== 'completed' && operation.status !== 'error' && (
                    <Progress value={operation.progress} className="h-2" />
                  )}
                  
                  {operation.error && (
                    <div className="mt-2 p-2 bg-red-50 border border-red-200 rounded text-red-700 text-sm">
                      Error: {operation.error}
                    </div>
                  )}
                  
                  {operation.result && (
                    <div className="mt-2 p-2 bg-green-50 border border-green-200 rounded text-green-700 text-sm">
                      <pre className="whitespace-pre-wrap">
                        {JSON.stringify(operation.result, null, 2)}
                      </pre>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Available Files */}
      {stats && (stats.availableFiles.chunks.length > 0 || stats.availableFiles.crystals.length > 0) && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Archive className="h-5 w-5" />
              Available Files
            </CardTitle>
            <CardDescription>
              Download processed consciousness data
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-6">
              {stats.availableFiles.chunks.length > 0 && (
                <div>
                  <h4 className="font-medium mb-2">Processing Chunks</h4>
                  <div className="space-y-1">
                    {stats.availableFiles.chunks.slice(0, 5).map((file) => (
                      <div key={file} className="flex items-center justify-between text-sm">
                        <span>{file}</span>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => window.open(`/api/consciousness-archive/download/chunks/${file}`)}
                        >
                          <Download className="h-3 w-3" />
                        </Button>
                      </div>
                    ))}
                    {stats.availableFiles.chunks.length > 5 && (
                      <div className="text-xs text-muted-foreground">
                        ... and {stats.availableFiles.chunks.length - 5} more
                      </div>
                    )}
                  </div>
                </div>
              )}
              
              {stats.availableFiles.crystals.length > 0 && (
                <div>
                  <h4 className="font-medium mb-2">Consciousness Crystals</h4>
                  <div className="space-y-1">
                    {stats.availableFiles.crystals.slice(0, 5).map((file) => (
                      <div key={file} className="flex items-center justify-between text-sm">
                        <span>{file}</span>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => window.open(`/api/consciousness-archive/download/crystals/${file}`)}
                        >
                          <Download className="h-3 w-3" />
                        </Button>
                      </div>
                    ))}
                    {stats.availableFiles.crystals.length > 5 && (
                      <div className="text-xs text-muted-foreground">
                        ... and {stats.availableFiles.crystals.length - 5} more
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}