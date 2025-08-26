import { useState } from 'react';
import { Card, CardHeader, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useApiKeys } from '@/hooks/use-api-keys';
import { Copy, RotateCcw, Trash2, Plus, Shield, Key, Info, AlertCircle, CheckCircle2, AlertTriangle, LucideIcon } from 'lucide-react';
import { truncateApiKey, calculatePercentage, formatCurrency, cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const apiKeyFormSchema = z.object({
  label: z.string().min(1, 'Label is required'),
  key: z.string().min(30, 'API Key must be at least 30 characters').startsWith('sk-', 'API Key must start with sk-'),
  type: z.enum(['openai', 'anthropic', 'stability', 'cohere', 'custom']).default('openai'),
  permissions: z.enum(['read', 'write', 'admin']).default('read')
});

export function ApiKeyManagementSection() {
  const { 
    apiKeys, 
    isLoading, 
    handleAddKey, 
    setApiKeyToDelete, 
    confirmDeleteKey, 
    apiKeyToDelete, 
    setApiKeyToRotate, 
    confirmRotateKey, 
    apiKeyToRotate, 
    copyKeyToClipboard,
    newKeyModalOpen,
    setNewKeyModalOpen,
    isPending
  } = useApiKeys();

  const [activeTab, setActiveTab] = useState("ai-keys");

  const form = useForm<z.infer<typeof apiKeyFormSchema>>({
    resolver: zodResolver(apiKeyFormSchema),
    defaultValues: {
      label: '',
      key: '',
      type: 'openai',
      permissions: 'read'
    }
  });

  const onSubmit = (data: z.infer<typeof apiKeyFormSchema>) => {
    handleAddKey(data);
  };
  
  const getKeyIcon = (type: string): LucideIcon => {
    switch(type) {
      case 'openai':
        return CheckCircle2;
      case 'anthropic':
        return AlertTriangle;
      case 'stability':
        return Shield;
      case 'cohere':
        return Info;
      default:
        return Key;
    }
  };
  
  const getModelTypeLabel = (type: string) => {
    return {
      openai: {
        color: 'bg-emerald-500',
        label: 'OpenAI'
      },
      anthropic: {
        color: 'bg-purple-500',
        label: 'Anthropic'
      },
      stability: {
        color: 'bg-blue-500',
        label: 'Stability'
      },
      cohere: {
        color: 'bg-pink-500',
        label: 'Cohere'
      },
      custom: {
        color: 'bg-gray-500',
        label: 'Custom'
      }
    }[type] || { color: 'bg-gray-500', label: 'Unknown' };
  };

  const keyTypes = [
    { value: 'openai', label: 'OpenAI' },
    { value: 'anthropic', label: 'Anthropic' },
    { value: 'stability', label: 'Stability AI' },
    { value: 'cohere', label: 'Cohere' },
    { value: 'custom', label: 'Custom Provider' },
  ];

  const permissionOptions = [
    { value: 'read', label: 'Read Only' },
    { value: 'write', label: 'Read & Write' },
    { value: 'admin', label: 'Administrator' },
  ];

  return (
    <div className="mb-8 animate-fade-in space-y-6">
      <div className="flex items-center mb-2">
        <div className="flex-grow h-px bg-gray-800"></div>
        <div className="mx-4 flex items-center px-3 py-1.5 rounded-full bg-primary/10 border border-primary/20">
          <span className="w-2 h-2 rounded-full bg-primary mr-2"></span>
          <span className="text-xs font-semibold tracking-wide text-primary">MODEL & API ACCESS MANAGEMENT</span>
        </div>
        <div className="flex-grow h-px bg-gray-800"></div>
      </div>
    
      <Card className="bg-gray-900/70 backdrop-blur border-gray-800 shadow-xl">
        <CardHeader className="px-6 py-5 border-b border-gray-800">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold text-white mb-1">Multimodal API Keys</h2>
              <p className="text-sm text-gray-400">
                Manage API credentials for all integrated AI services
              </p>
            </div>
            <Button 
              className="bg-primary hover:bg-primary/90"
              onClick={() => setNewKeyModalOpen(true)}
            >
              <Plus className="mr-2 h-4 w-4" />
              Add New Key
            </Button>
          </div>
        </CardHeader>
        
        <CardContent className="p-6">
          <Tabs defaultValue="ai-keys" value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid grid-cols-3 mb-6 bg-gray-800/60">
              <TabsTrigger value="ai-keys" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                AI Model Keys
              </TabsTrigger>
              <TabsTrigger value="auth-keys" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                Auth Tokens
              </TabsTrigger>
              <TabsTrigger value="webhooks" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                Webhook Keys
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="ai-keys" className="mt-0">
              <div className="rounded-lg border border-gray-800 bg-gray-950/50 backdrop-blur-sm overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-800">
                    <thead className="bg-gray-900/50">
                      <tr>
                        <th scope="col" className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Provider</th>
                        <th scope="col" className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Label</th>
                        <th scope="col" className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Key</th>
                        <th scope="col" className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Status</th>
                        <th scope="col" className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Usage</th>
                        <th scope="col" className="px-6 py-4 text-right text-xs font-medium text-gray-400 uppercase tracking-wider">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-800 bg-transparent">
                      {isLoading ? (
                        <tr>
                          <td colSpan={6} className="px-6 py-8 text-center">
                            <div className="flex flex-col items-center">
                              <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin mb-3"></div>
                              <span className="text-gray-400">Loading API keys...</span>
                            </div>
                          </td>
                        </tr>
                      ) : apiKeys && apiKeys.length > 0 ? (
                        apiKeys.map((apiKey, index) => {
                          // Add random model type for visualization purposes
                          const modelTypes = ['openai', 'anthropic', 'stability', 'cohere', 'custom'];
                          const randomType = modelTypes[index % modelTypes.length];
                          const typeInfo = getModelTypeLabel(randomType);
                          const KeyIcon = getKeyIcon(randomType);
                          
                          return (
                            <tr 
                              key={apiKey.id} 
                              className="hover:bg-gray-900/30 transition-colors"
                            >
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className="flex items-center">
                                  <div className={`w-8 h-8 rounded-full flex items-center justify-center ${typeInfo.color}`}>
                                    <KeyIcon className="h-4 w-4 text-white" />
                                  </div>
                                  <span className="ml-3 text-sm font-medium text-white">{typeInfo.label}</span>
                                </div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-200">
                                {apiKey.label}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400 font-mono">
                                <div className="flex items-center">
                                  <span className="tracking-wider bg-gray-900 px-2 py-1 rounded-md text-xs">{truncateApiKey(apiKey.key)}</span>
                                  <Button variant="ghost" size="sm" className="ml-2 text-gray-400 hover:text-white" title="Copy key"
                                    onClick={() => copyKeyToClipboard(apiKey.key)}>
                                    <Copy className="h-4 w-4" />
                                  </Button>
                                </div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <Badge className={cn(
                                  "text-xs",
                                  apiKey.status === 'active' 
                                    ? 'bg-green-500/20 text-green-500 hover:bg-green-500/30 border-green-500/20' 
                                    : apiKey.status === 'expiring_soon' 
                                      ? 'bg-amber-500/20 text-amber-500 hover:bg-amber-500/30 border-amber-500/20' 
                                      : 'bg-red-500/20 text-red-500 hover:bg-red-500/30 border-red-500/20'
                                )}>
                                  <span className={cn(
                                    "w-1.5 h-1.5 rounded-full mr-1", 
                                    apiKey.status === 'active' ? 'bg-green-500 animate-pulse' : 
                                    apiKey.status === 'expiring_soon' ? 'bg-amber-500' : 'bg-red-500'
                                  )}></span>
                                  {apiKey.status === 'active' ? 'Active' : 
                                   apiKey.status === 'expiring_soon' ? 'Expiring Soon' : 'Inactive'}
                                </Badge>
                                
                                {Math.random() > 0.5 && (
                                  <Badge className="ml-2 bg-purple-500/20 text-purple-500 hover:bg-purple-500/30 border-purple-500/20 text-xs">
                                    Premium
                                  </Badge>
                                )}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className="text-sm text-gray-200 flex items-center">
                                  <span className="font-semibold">{formatCurrency(apiKey.usage)}</span>
                                  <span className="mx-1 text-gray-400">/</span>
                                  <span className="text-gray-400">{formatCurrency(apiKey.usageLimit)}</span>
                                </div>
                                <div className="w-full bg-gray-800 rounded-full h-1.5 mt-1.5 overflow-hidden">
                                  <div 
                                    className={cn(
                                      "h-1.5 rounded-full relative",
                                      calculatePercentage(apiKey.usage, apiKey.usageLimit) > 75 
                                        ? 'bg-amber-500' 
                                        : 'bg-primary'
                                    )} 
                                    style={{ width: `${calculatePercentage(apiKey.usage, apiKey.usageLimit)}%` }}
                                  >
                                    <span className="absolute inset-0 bg-white/20 animate-pulse-slow"></span>
                                  </div>
                                </div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-right">
                                <div className="flex justify-end gap-2">
                                  <Button 
                                    variant="outline" 
                                    size="sm" 
                                    className="border-gray-700 bg-gray-800/50 text-white hover:bg-gray-700"
                                    onClick={() => setApiKeyToRotate(apiKey.id)}
                                  >
                                    <RotateCcw className="h-3.5 w-3.5 mr-1" />
                                    Rotate
                                  </Button>
                                  <Button 
                                    variant="outline" 
                                    size="sm" 
                                    className="border-red-800/50 bg-red-900/10 text-red-400 hover:bg-red-900/30"
                                    onClick={() => setApiKeyToDelete(apiKey.id)}
                                  >
                                    <Trash2 className="h-3.5 w-3.5 mr-1" />
                                    Delete
                                  </Button>
                                </div>
                              </td>
                            </tr>
                          );
                        })
                      ) : (
                        <tr>
                          <td colSpan={6} className="px-6 py-8 text-center">
                            <div className="flex flex-col items-center">
                              <div className="bg-gray-800/80 rounded-lg p-4 mb-3">
                                <Key className="h-8 w-8 text-gray-500 mx-auto" />
                              </div>
                              <p className="text-gray-400 mb-1">No API keys found</p>
                              <p className="text-sm text-gray-500 mb-4">Add a key to connect with AI model providers</p>
                              <Button 
                                variant="outline" 
                                className="bg-gray-800/60 border-gray-700 text-white hover:bg-gray-700"
                                onClick={() => setNewKeyModalOpen(true)}
                              >
                                <Plus className="mr-2 h-4 w-4" />
                                Add Your First Key
                              </Button>
                            </div>
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="auth-keys" className="mt-0">
              <div className="flex items-center justify-center h-60 border border-dashed border-gray-700 rounded-lg">
                <div className="text-center p-6 max-w-md">
                  <Shield className="mx-auto h-10 w-10 text-gray-500 mb-4" />
                  <h3 className="text-lg font-medium text-white mb-2">Authentication Keys</h3>
                  <p className="text-sm text-gray-400 mb-4">
                    Manage API keys for authenticating external services and applications to your FusionNexus platform.
                  </p>
                  <Button variant="outline" className="bg-gray-800 border-gray-700">
                    <Plus className="mr-2 h-4 w-4" />
                    Generate Auth Key
                  </Button>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="webhooks" className="mt-0">
              <div className="flex items-center justify-center h-60 border border-dashed border-gray-700 rounded-lg">
                <div className="text-center p-6 max-w-md">
                  <AlertCircle className="mx-auto h-10 w-10 text-gray-500 mb-4" />
                  <h3 className="text-lg font-medium text-white mb-2">Webhook Endpoints</h3>
                  <p className="text-sm text-gray-400 mb-4">
                    Configure webhook endpoints for event notifications and automated workflows.
                  </p>
                  <Button variant="outline" className="bg-gray-800 border-gray-700">
                    <Plus className="mr-2 h-4 w-4" />
                    Add Webhook
                  </Button>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
        
        <CardFooter className="bg-gray-950/50 border-t border-gray-800 px-6 py-4">
          <div className="flex justify-between items-center w-full">
            <div className="text-sm text-gray-400 flex items-center">
              <Info className="h-4 w-4 mr-2 text-primary" />
              All keys are encrypted using enterprise-grade standards
            </div>
            <Button variant="link" className="text-primary hover:text-primary/90 p-0">
              View API Documentation
            </Button>
          </div>
        </CardFooter>
      </Card>

      {/* Add New API Key Dialog */}
      <Dialog open={newKeyModalOpen} onOpenChange={setNewKeyModalOpen}>
        <DialogContent className="bg-gray-900/95 backdrop-blur-md text-white border-gray-800 shadow-xl">
          <DialogHeader>
            <DialogTitle className="text-xl">Add a New API Key</DialogTitle>
            <DialogDescription className="text-gray-400">
              Connect your AI provider credentials to enable multimodal capabilities
            </DialogDescription>
          </DialogHeader>
          
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
              <FormField
                control={form.control}
                name="type"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>AI Provider</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger className="bg-gray-800 border-gray-700 text-white">
                          <SelectValue placeholder="Select a provider" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent className="bg-gray-800 border-gray-700 text-white">
                        {keyTypes.map(type => (
                          <SelectItem key={type.value} value={type.value} className="hover:bg-gray-700">
                            {type.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormDescription className="text-gray-400">
                      Select the AI provider for this API key
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="label"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Key Label</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="e.g. Production GPT-4o Key" 
                        {...field} 
                        className="bg-gray-800 border-gray-700 text-white"
                      />
                    </FormControl>
                    <FormDescription className="text-gray-400">
                      A descriptive name to identify this API key
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="key"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>API Key</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="sk-..." 
                        {...field} 
                        className="bg-gray-800 border-gray-700 text-white font-mono"
                      />
                    </FormControl>
                    <FormDescription className="text-gray-400">
                      Your provider API key (starting with "sk-" for most providers)
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="permissions"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Key Permissions</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger className="bg-gray-800 border-gray-700 text-white">
                          <SelectValue placeholder="Select permissions" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent className="bg-gray-800 border-gray-700 text-white">
                        {permissionOptions.map(option => (
                          <SelectItem key={option.value} value={option.value} className="hover:bg-gray-700">
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormDescription className="text-gray-400">
                      Set access level permissions for this key
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <div className="bg-primary/10 border border-primary/20 rounded-md p-3 mt-4">
                <div className="flex items-start">
                  <Info className="h-5 w-5 text-primary mt-0.5 mr-3 flex-shrink-0" />
                  <div className="text-xs text-gray-300">
                    <p className="font-semibold mb-1">Security Notice</p>
                    <p>Your API keys are encrypted at rest and in transit. We recommend rotating your keys every 90 days and using the minimum required permissions.</p>
                  </div>
                </div>
              </div>
              
              <DialogFooter className="pt-2">
                <Button type="button" variant="outline" onClick={() => setNewKeyModalOpen(false)} className="bg-gray-800 border-gray-700">
                  Cancel
                </Button>
                <Button 
                  type="submit" 
                  disabled={isPending}
                  className="bg-primary hover:bg-primary/90"
                >
                  {isPending ? 'Adding...' : 'Add API Key'}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      {/* Delete API Key Confirmation */}
      <AlertDialog open={apiKeyToDelete !== null} onOpenChange={(open) => !open && setApiKeyToDelete(null)}>
        <AlertDialogContent className="bg-gray-900/95 backdrop-blur-md text-white border-gray-800 shadow-xl">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-xl">Delete API Key</AlertDialogTitle>
            <AlertDialogDescription className="text-gray-400">
              Are you sure you want to delete this API key? This action cannot be undone and may affect running services.
            </AlertDialogDescription>
          </AlertDialogHeader>
          
          <div className="bg-red-950/30 border border-red-900/30 rounded-md p-3 mt-2">
            <div className="flex items-start">
              <AlertTriangle className="h-5 w-5 text-red-500 mt-0.5 mr-3 flex-shrink-0" />
              <div className="text-sm text-red-200">
                <p className="font-semibold mb-1">Warning</p>
                <p>Deleting this key will immediately invalidate it and any services using it will fail.</p>
              </div>
            </div>
          </div>
          
          <AlertDialogFooter className="mt-4">
            <AlertDialogCancel className="bg-gray-800 border-gray-700 text-white hover:bg-gray-700">Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={() => apiKeyToDelete && confirmDeleteKey(apiKeyToDelete)}
              className="bg-red-600 hover:bg-red-700 text-white"
            >
              Delete Key
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Rotate API Key Confirmation */}
      <AlertDialog open={apiKeyToRotate !== null} onOpenChange={(open) => !open && setApiKeyToRotate(null)}>
        <AlertDialogContent className="bg-gray-900/95 backdrop-blur-md text-white border-gray-800 shadow-xl">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-xl">Rotate API Key</AlertDialogTitle>
            <AlertDialogDescription className="text-gray-400">
              This will generate a new key while keeping the same label and permissions. The current key will be revoked.
            </AlertDialogDescription>
          </AlertDialogHeader>
          
          <div className="bg-primary/10 border border-primary/20 rounded-md p-3 mt-2">
            <div className="flex items-start">
              <Info className="h-5 w-5 text-primary mt-0.5 mr-3 flex-shrink-0" />
              <div className="text-sm text-gray-300">
                <p className="font-semibold mb-1">Best Practice</p>
                <p>Key rotation improves security by limiting the time a key is active. We recommend rotating keys every 90 days.</p>
              </div>
            </div>
          </div>
          
          <AlertDialogFooter className="mt-4">
            <AlertDialogCancel className="bg-gray-800 border-gray-700 text-white hover:bg-gray-700">Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={() => apiKeyToRotate && confirmRotateKey(apiKeyToRotate)}
              className="bg-primary hover:bg-primary/90"
            >
              Rotate Key
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
