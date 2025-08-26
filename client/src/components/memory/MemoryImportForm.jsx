import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import { useToast } from '@/hooks/use-toast';
import { 
  Card, 
  CardHeader, 
  CardTitle, 
  CardDescription, 
  CardContent, 
  CardFooter 
} from '@/components/ui/card';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { ShieldCheck, RotateCcw, Check, X, Upload, UploadCloud, BarChart3, FileSearch, AlertCircle } from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { useWebSocket } from '../../contexts/WebSocketContext.jsx';

// Validation schema for the form
const formSchema = z.object({
  title: z.string().min(3, {
    message: 'Memory title must be at least 3 characters.',
  }).max(100, {
    message: 'Memory title must not exceed 100 characters.'
  }),
  file: z.any()
    .refine((file) => file, {
      message: 'Please upload a file.',
    })
});

const MemoryImportForm = () => {
  const { toast } = useToast();
  const { connected } = useWebSocket();
  const fileInputRef = useRef(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadResult, setUploadResult] = useState(null);
  const [uploadError, setUploadError] = useState(null);
  const [chunkedUpload, setChunkedUpload] = useState({
    inProgress: false,
    totalChunks: 0,
    currentChunk: 0,
    offset: 0,
    chunkSize: 1024 * 1024, // 1MB chunks
    resumeAvailable: false
  });
  const [previewData, setPreviewData] = useState(null);
  const [previewMode, setPreviewMode] = useState(false);
  
  // Initialize form with react-hook-form
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: '',
      file: null
    }
  });
  
  // Add state for coherence metrics and upload stage
  const [coherenceMetrics, setCoherenceMetrics] = useState({
    stability_score: 0.75,
    exploration_score: 0.25,
    coherence_score: 0.75,
    coherence_ratio: '3:1 (75%)'
  });
  const [currentStage, setCurrentStage] = useState('idle');
  
  // Listen for WebSocket messages using custom window events
  useEffect(() => {
    // Memory import event handler
    const handleMemoryImportUpdate = (event) => {
      const data = event.detail;
      console.log(`[QUANTUM_STATE: INFO_FLOW] Received memory import update type: ${data.type}`);
      
      switch (data.type) {
        case 'IMPORT_PROGRESS':
          // Handle standard upload progress
          setUploadProgress(data.progress);
          setCurrentStage(data.stage || 'processing');
          break;
          
        case 'COHERENCE_SNAPSHOT':
          // Update coherence metrics if available
          if (data.coherenceMetrics) {
            setCoherenceMetrics({
              stability_score: data.coherenceMetrics.stability_score,
              exploration_score: data.coherenceMetrics.exploration_score,
              coherence_score: data.coherenceMetrics.coherence_score,
              coherence_ratio: data.coherenceMetrics.coherence_ratio || '3:1 (75%)'
            });
          }
          break;
          
        case 'IMPORT_PREVIEW':
          // Handle preview data
          setPreviewData(data.data);
          setPreviewMode(true);
          setUploading(false);
          toast({
            title: 'Import Preview Ready',
            description: `${data.data.newCount} new items, ${data.data.duplicateCount} duplicates, ${data.data.skippedCount} skipped`,
            variant: 'default'
          });
          break;
          
        case 'CHUNK_RECEIVED':
          // Handle individual chunk upload confirmation
          setChunkedUpload(prev => ({
            ...prev,
            currentChunk: data.currentChunk,
            offset: data.nextOffset,
            resumeAvailable: true,
            fileId: data.fileId || prev.fileId,
            progress: data.progress || Math.round((data.currentChunk / prev.totalChunks) * 100)
          }));
          
          // Send next chunk if not complete
          if (data.isComplete !== true && data.currentChunk < chunkedUpload.totalChunks - 1) {
            sendNextChunk(data.nextOffset);
          } else {
            // Chunked upload is complete
            setChunkedUpload(prev => ({
              ...prev,
              inProgress: false
            }));
            
            // Process the completed chunks
            if (data.isComplete === true && data.fileId) {
              processCompletedChunks(data.fileId);
            }
          }
          break;
          
        case 'IMPORT_COMPLETE':
          // Handle completed import
          setUploading(false);
          setUploadResult({
            success: true,
            memory: data.memory,
            message: data.message || 'Memory import completed successfully'
          });
          
          // Update coherence metrics if available
          if (data.coherenceMetrics) {
            setCoherenceMetrics(data.coherenceMetrics);
            console.log(`[QUANTUM_STATE: COHERENCE_FLOW] Memory import coherence metrics: ${JSON.stringify(data.coherenceMetrics)}`);
          }
          
          toast({
            title: 'Memory Import Successful',
            description: `Imported with coherence ratio: ${data.coherenceMetrics?.coherence_ratio || '3:1 (75%)'}`,
            variant: 'default'
          });
          break;
          
        case 'IMPORT_ERROR':
          // Handle import errors
          setUploading(false);
          setUploadError({
            message: data.message || 'Error during import',
            details: data.details || data.error || 'Unknown error'
          });
          
          toast({
            title: 'Import Failed',
            description: data.message || 'Error processing your import',
            variant: 'destructive'
          });
          break;
          
        default:
          console.log('[QUANTUM_STATE: INFO_FLOW] Unhandled memory import update type:', data.type);
      }
    };
    
    // Register event listeners
    window.addEventListener('memory-import-update', handleMemoryImportUpdate);
    
    // Clean up event listeners on unmount
    return () => {
      window.removeEventListener('memory-import-update', handleMemoryImportUpdate);
    };
  }, [toast, chunkedUpload.totalChunks]);
  
  // Process completed chunks after all are received
  const processCompletedChunks = async (fileId) => {
    if (!fileId) return;
    
    setUploading(true);
    
    try {
      const response = await axios.post('/api/memories/import/process-chunks', {
        fileId,
        title: form.getValues('title')
      });
      
      setChunkedUpload(prev => ({
        ...prev,
        inProgress: false,
        resumeAvailable: false
      }));
      
      setUploadResult({
        success: true,
        memory: response.data,
        message: 'Chunked memory import completed successfully'
      });
      
      toast({
        title: 'Chunked Upload Successful',
        description: `Imported with coherence score: ${response.data.coherence_score || 75}%`,
        variant: 'default'
      });
    } catch (error) {
      setUploadError({
        message: error.response?.data?.message || 'Error processing chunks',
        details: error.response?.data?.error || error.message
      });
      
      toast({
        title: 'Chunk Processing Failed',
        description: error.response?.data?.message || 'Error processing chunks',
        variant: 'destructive'
      });
    } finally {
      setUploading(false);
    }
  };
  
  // Function to read and process file in chunks
  const readFileChunks = (file, offset = 0) => {
    const chunkSize = chunkedUpload.chunkSize;
    const fileSize = file.size;
    const totalChunks = Math.ceil(fileSize / chunkSize);
    
    setChunkedUpload(prev => ({
      ...prev,
      inProgress: true,
      totalChunks,
      currentChunk: offset > 0 ? Math.floor(offset / chunkSize) : 0,
      offset
    }));
    
    // Send first chunk or requested chunk
    sendChunk(file, offset);
  };
  
  // Function to send a chunk of the file
  const sendChunk = async (file, offset) => {
    const chunkSize = chunkedUpload.chunkSize;
    const chunk = file.slice(offset, offset + chunkSize);
    
    const formData = new FormData();
    formData.append('chunk', chunk);
    formData.append('offset', offset.toString());
    formData.append('total_size', file.size.toString());
    formData.append('filename', file.name);
    
    try {
      await axios.post('/api/memories/import/chunk', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'X-Chunk-Offset': offset.toString(),
          'X-Total-Size': file.size.toString()
        }
      });
      
      // Update chunked upload state - this will be triggered by WebSocket message
    } catch (error) {
      setUploading(false);
      setUploadError({ 
        message: 'Error uploading file chunk',
        details: error.response?.data?.message || error.message 
      });
      
      toast({
        title: 'Chunk upload failed',
        description: 'Failed to upload file chunk. Please try again or use a smaller file.',
        variant: 'destructive'
      });
    }
  };
  
  // Function to send the next chunk
  const sendNextChunk = () => {
    if (!selectedFile) return;
    
    const nextOffset = chunkedUpload.offset + chunkedUpload.chunkSize;
    if (nextOffset < selectedFile.size) {
      sendChunk(selectedFile, nextOffset);
    } else {
      setChunkedUpload(prev => ({
        ...prev,
        inProgress: false
      }));
    }
  };
  
  // Function to request a preview of the import file
  const requestPreview = async () => {
    if (!selectedFile) {
      toast({
        title: 'No file selected',
        description: 'Please select a ChatGPT export file to upload',
        variant: 'destructive'
      });
      return;
    }
    
    setUploading(true);
    setUploadProgress(0);
    setUploadResult(null);
    setUploadError(null);
    setPreviewMode(false);
    setPreviewData(null);
    
    const formData = new FormData();
    formData.append('file', selectedFile);
    formData.append('title', form.getValues('title'));
    formData.append('preview_only', 'true');
    
    try {
      const response = await axios.post('/api/memories/import/preview', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        },
        onUploadProgress: (progressEvent) => {
          const progress = Math.round((progressEvent.loaded / progressEvent.total) * 100);
          setUploadProgress(progress);
        }
      });
      
      setUploading(false);
      setPreviewMode(true);
      setPreviewData(response.data);
      
      toast({
        title: 'Preview ready',
        description: `${response.data.newCount} new, ${response.data.duplicateCount} duplicates, ${response.data.skippedCount} skipped`,
        variant: 'default'
      });
    } catch (error) {
      setUploading(false);
      setUploadError({ 
        message: error.response?.data?.message || 'Error generating preview',
        details: error.response?.data?.error || error.message 
      });
      
      toast({
        title: 'Preview failed',
        description: error.response?.data?.message || 'Error processing your file',
        variant: 'destructive'
      });
    }
  };
  
  // Function to confirm import after preview
  const confirmImport = async () => {
    if (!previewData || !previewData.previewId) {
      toast({
        title: 'No preview available',
        description: 'Please generate a preview first',
        variant: 'destructive'
      });
      return;
    }
    
    setUploading(true);
    setUploadProgress(0);
    
    try {
      const response = await axios.post('/api/memories/import/confirm', {
        previewId: previewData.previewId,
        title: form.getValues('title')
      });
      
      setUploading(false);
      setPreviewMode(false);
      setPreviewData(null);
      setUploadResult({ 
        success: true,
        memory: response.data 
      });
      
      toast({
        title: 'Memory import successful',
        description: `Imported with coherence score: ${response.data.coherence_score}`,
        variant: 'default'
      });
    } catch (error) {
      setUploading(false);
      setUploadError({ 
        message: error.response?.data?.message || 'Error confirming import',
        details: error.response?.data?.error || error.message 
      });
      
      toast({
        title: 'Import failed',
        description: error.response?.data?.message || 'Error processing your import',
        variant: 'destructive'
      });
    }
  };
  
  // The main form submission handler
  const onSubmit = async (data) => {
    if (!selectedFile) {
      toast({
        title: 'No file selected',
        description: 'Please select a ChatGPT export file to upload',
        variant: 'destructive'
      });
      return;
    }
    
    // If the file is large, use chunked upload
    if (selectedFile.size > 5 * 1024 * 1024) { // 5MB threshold
      readFileChunks(selectedFile);
      return;
    }
    
    setUploading(true);
    setUploadProgress(0);
    setUploadResult(null);
    setUploadError(null);
    
    const formData = new FormData();
    formData.append('file', selectedFile);
    formData.append('title', data.title);
    
    try {
      const response = await axios.post('/api/memories/import/chatgpt', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        },
        onUploadProgress: (progressEvent) => {
          const progress = Math.round((progressEvent.loaded / progressEvent.total) * 100);
          setUploadProgress(progress);
        }
      });
      
      setUploading(false);
      setUploadResult({ 
        success: true,
        memory: response.data 
      });
      
      toast({
        title: 'Memory import successful',
        description: `Imported with coherence score: ${response.data.coherence_score}`,
        variant: 'default'
      });
    } catch (error) {
      setUploading(false);
      setUploadError({ 
        message: error.response?.data?.message || 'Error uploading file',
        details: error.response?.data?.error || error.message 
      });
      
      toast({
        title: 'Memory import failed',
        description: error.response?.data?.message || 'Error processing your file',
        variant: 'destructive'
      });
    }
  };
  
  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setSelectedFile(file);
      form.setValue('file', file);
    }
  };
  
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Import ChatGPT Conversations</CardTitle>
        <CardDescription>
          Upload your ChatGPT export file to import conversations with quantum coherence scoring
        </CardDescription>
      </CardHeader>
      
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Memory Title</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter a title for this memory" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="file"
              render={({ field: { onChange, value, ...rest } }) => (
                <FormItem>
                  <FormLabel>ChatGPT Export File</FormLabel>
                  <FormControl>
                    <div className="grid w-full max-w-sm items-center gap-1.5">
                      <Input 
                        type="file" 
                        accept=".json"
                        ref={fileInputRef}
                        onChange={(e) => {
                          handleFileChange(e);
                          onChange(e.target.files[0]);
                        }}
                      />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            {selectedFile && (
              <div className="rounded-md bg-slate-50 dark:bg-slate-900 p-3">
                <div className="flex items-center gap-2">
                  <UploadCloud className="h-5 w-5 text-slate-500" />
                  <span className="text-sm font-medium">{selectedFile.name}</span>
                  <span className="ml-auto text-xs text-slate-500">{Math.round(selectedFile.size / 1024)} KB</span>
                </div>
              </div>
            )}
            
            {/* Quantum Balance Ratio Visualization */}
            <div className="mt-4 p-3 bg-slate-50 border border-slate-200 rounded-md dark:bg-slate-900/50 dark:border-slate-800">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium">Quantum Balance Ratio</span>
                <span className="text-xs bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-400 px-2 py-0.5 rounded-full">
                  {coherenceMetrics.coherence_ratio}
                </span>
              </div>
              
              <div className="relative h-2 w-full bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                <div 
                  className="absolute top-0 left-0 h-full bg-blue-600 dark:bg-blue-500 rounded-full"
                  style={{ width: `${coherenceMetrics.stability_score * 100}%` }}
                ></div>
                <div 
                  className="absolute top-0 right-0 h-full bg-purple-500 dark:bg-purple-400 rounded-full"
                  style={{ width: `${coherenceMetrics.exploration_score * 100}%`, right: 0 }}
                ></div>
              </div>
              
              <div className="flex justify-between mt-1 text-xs text-slate-600 dark:text-slate-400">
                <div className="flex items-center">
                  <div className="w-2 h-2 bg-blue-600 dark:bg-blue-500 rounded-full mr-1"></div>
                  <span>Stability ({Math.round(coherenceMetrics.stability_score * 100)}%)</span>
                </div>
                <div className="flex items-center">
                  <div className="w-2 h-2 bg-purple-500 dark:bg-purple-400 rounded-full mr-1"></div>
                  <span>Exploration ({Math.round(coherenceMetrics.exploration_score * 100)}%)</span>
                </div>
              </div>
            </div>
            
            {uploading && (
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-slate-500">Uploading and processing...</span>
                  <span className="text-sm font-medium">{uploadProgress}%</span>
                </div>
                <Progress value={uploadProgress} className="h-2" />
              </div>
            )}
            
            {/* Coherence Ratio Display */}
            <Alert variant="default" className="bg-indigo-50 dark:bg-indigo-900/20 border-indigo-200 dark:border-indigo-900">
              <ShieldCheck className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
              <AlertTitle className="text-indigo-800 dark:text-indigo-400">Quantum Coherence Metrics</AlertTitle>
              <AlertDescription className="text-indigo-700 dark:text-indigo-300">
                <div className="mt-2 space-y-2">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-sm">Coherence Ratio:</span>
                    <span className="font-medium">{coherenceMetrics.coherence_ratio}</span>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
                      <div className="bg-indigo-600 h-2.5 rounded-full" style={{ width: `${coherenceMetrics.stability_score * 100}%` }}></div>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between text-xs">
                    <span>Stability: {Math.round(coherenceMetrics.stability_score * 100)}%</span>
                    <span>Exploration: {Math.round(coherenceMetrics.exploration_score * 100)}%</span>
                  </div>
                </div>
              </AlertDescription>
            </Alert>
            
            {previewData && previewMode && (
              <Alert variant="default" className="bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-900">
                <FileSearch className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                <AlertTitle className="text-blue-800 dark:text-blue-400">Memory Import Preview</AlertTitle>
                <AlertDescription className="text-blue-700 dark:text-blue-300">
                  <div className="mt-2 space-y-2">
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-sm">New memories:</span>
                      <span className="font-medium">{previewData.newCount}</span>
                    </div>
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-sm">Duplicate memories:</span>
                      <span className="font-medium">{previewData.duplicateCount}</span>
                    </div>
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-sm">Skipped items:</span>
                      <span className="font-medium">{previewData.skippedCount}</span>
                    </div>
                    <div className="mt-4 flex items-center justify-between gap-2">
                      <span className="text-sm">Estimated coherence ratio:</span>
                      <span className="font-medium">{previewData.coherenceRatio || '3:1 (75%)'}</span>
                    </div>
                    
                    <div className="flex items-center gap-2 mt-4">
                      <Button 
                        type="button" 
                        onClick={confirmImport}
                        disabled={uploading}
                        className="flex items-center gap-2"
                      >
                        <Check className="h-4 w-4" />
                        Confirm Import
                      </Button>
                      <Button 
                        type="button" 
                        variant="outline" 
                        onClick={() => {
                          setPreviewMode(false);
                          setPreviewData(null);
                        }}
                        disabled={uploading}
                        className="flex items-center gap-2"
                      >
                        <X className="h-4 w-4" />
                        Cancel
                      </Button>
                    </div>
                  </div>
                </AlertDescription>
              </Alert>
            )}

            {chunkedUpload.inProgress && (
              <Alert variant="default" className="bg-orange-50 dark:bg-orange-900/20 border-orange-200 dark:border-orange-900">
                <AlertCircle className="h-4 w-4 text-orange-600 dark:text-orange-400" />
                <AlertTitle className="text-orange-800 dark:text-orange-400">Large File Upload</AlertTitle>
                <AlertDescription className="text-orange-700 dark:text-orange-300">
                  <div className="mt-2 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Uploading chunk {chunkedUpload.currentChunk + 1} of {chunkedUpload.totalChunks}</span>
                      <span className="text-sm font-medium">{Math.round((chunkedUpload.currentChunk / chunkedUpload.totalChunks) * 100)}%</span>
                    </div>
                    <Progress 
                      value={Math.round((chunkedUpload.currentChunk / chunkedUpload.totalChunks) * 100)} 
                      className="h-2"
                    />
                    <div className="text-xs mt-1">
                      Large files are processed in chunks to maintain performance and ensure resilience.
                    </div>
                  </div>
                </AlertDescription>
              </Alert>
            )}
            
            {uploadResult && (
              <Alert variant="default" className="bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-900">
                <Check className="h-4 w-4 text-green-600 dark:text-green-400" />
                <AlertTitle className="text-green-800 dark:text-green-400">Memory Import Successful</AlertTitle>
                <AlertDescription className="text-green-700 dark:text-green-300">
                  {uploadResult.message}
                  {uploadResult.memory && (
                    <div className="mt-2">
                      <div className="flex items-center gap-2 text-sm">
                        <BarChart3 className="h-4 w-4" />
                        <span>Coherence Score: <strong>{uploadResult.memory.coherence_score}%</strong></span>
                      </div>
                      <div className="mt-2 w-full bg-green-200 dark:bg-green-800 rounded-full h-2.5">
                        <div 
                          className="bg-green-600 dark:bg-green-500 h-2.5 rounded-full" 
                          style={{ width: `${uploadResult.memory.coherence_score}%` }}
                        ></div>
                      </div>
                    </div>
                  )}
                </AlertDescription>
              </Alert>
            )}
            
            {uploadError && (
              <Alert variant="destructive">
                <X className="h-4 w-4" />
                <AlertTitle>Import Failed</AlertTitle>
                <AlertDescription>
                  {uploadError.message}
                  {uploadError.details && (
                    <div className="mt-2 text-xs opacity-80">
                      {uploadError.details}
                    </div>
                  )}
                </AlertDescription>
              </Alert>
            )}
            
            {chunkedUpload.resumeAvailable && !chunkedUpload.inProgress && (
              <Alert variant="default" className="bg-purple-50 dark:bg-purple-900/20 border-purple-200 dark:border-purple-900">
                <AlertCircle className="h-4 w-4 text-purple-600 dark:text-purple-400" />
                <AlertTitle className="text-purple-800 dark:text-purple-400">Upload Paused</AlertTitle>
                <AlertDescription className="text-purple-700 dark:text-purple-300">
                  <div className="mt-2">
                    <p className="text-sm">Previous upload progress detected. You can resume from where you left off.</p>
                    <div className="flex items-center gap-2 mt-3">
                      <Button 
                        type="button" 
                        onClick={() => readFileChunks(selectedFile, chunkedUpload.offset)}
                        className="flex items-center gap-2"
                      >
                        <UploadCloud className="h-4 w-4" />
                        Resume Upload
                      </Button>
                    </div>
                  </div>
                </AlertDescription>
              </Alert>
            )}
            
            <div className="flex flex-wrap items-center gap-2">
              <Button 
                type="submit" 
                disabled={uploading || previewMode}
                className="flex items-center gap-2"
              >
                <Upload className="h-4 w-4" />
                {uploading ? 'Processing...' : 'Upload and Process'}
              </Button>
              
              <Button 
                type="button"
                onClick={requestPreview}
                disabled={uploading || !selectedFile || previewMode}
                className="flex items-center gap-2"
                variant="secondary"
              >
                <FileSearch className="h-4 w-4" />
                Preview Import
              </Button>
              
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => {
                  form.reset();
                  setSelectedFile(null);
                  setUploadResult(null);
                  setUploadError(null);
                  setPreviewMode(false);
                  setPreviewData(null);
                  setChunkedUpload({
                    inProgress: false,
                    totalChunks: 0,
                    currentChunk: 0,
                    offset: 0,
                    chunkSize: 1024 * 1024,
                    resumeAvailable: false
                  });
                  if (fileInputRef.current) {
                    fileInputRef.current.value = '';
                  }
                }}
                className="flex items-center gap-2"
                disabled={uploading || chunkedUpload.inProgress}
              >
                <RotateCcw className="h-4 w-4" />
                Reset
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
      
      <CardFooter className="flex-col items-start border-t p-4">
        <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
          <ShieldCheck className="h-4 w-4 text-green-500" />
          <span>All data is processed with the 3:1 quantum balance ratio (75% coherence : 25% exploration)</span>
        </div>
      </CardFooter>
    </Card>
  );
};

export default MemoryImportForm;