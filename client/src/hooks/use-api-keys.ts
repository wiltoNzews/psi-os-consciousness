import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';
import { type ApiKey } from '@/lib/mock-data';

export function useApiKeys() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [apiKeyToDelete, setApiKeyToDelete] = useState<number | null>(null);
  const [apiKeyToRotate, setApiKeyToRotate] = useState<number | null>(null);
  const [newKeyModalOpen, setNewKeyModalOpen] = useState(false);
  
  // Query to fetch API keys
  const { data: apiKeys = [], isLoading, error } = useQuery({
    queryKey: ['/api/keys'],
  });
  
  // Mutation to add new API key
  const addKeyMutation = useMutation({
    mutationFn: async (keyData: { label: string, key: string }) => {
      const res = await apiRequest('POST', '/api/keys', keyData);
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/keys'] });
      toast({
        title: 'API Key Added',
        description: 'The new API key has been added successfully.',
      });
      setNewKeyModalOpen(false);
    },
    onError: (error) => {
      toast({
        title: 'Failed to add API key',
        description: error.message || 'An error occurred while adding the API key.',
        variant: 'destructive',
      });
    }
  });

  // Mutation to delete API key
  const deleteKeyMutation = useMutation({
    mutationFn: async (id: number) => {
      await apiRequest('DELETE', `/api/keys/${id}`);
      return id;
    },
    onSuccess: (id) => {
      queryClient.invalidateQueries({ queryKey: ['/api/keys'] });
      toast({
        title: 'API Key Deleted',
        description: 'The API key has been deleted successfully.',
      });
      setApiKeyToDelete(null);
    },
    onError: (error) => {
      toast({
        title: 'Failed to delete API key',
        description: error.message || 'An error occurred while deleting the API key.',
        variant: 'destructive',
      });
    }
  });

  // Mutation to rotate API key
  const rotateKeyMutation = useMutation({
    mutationFn: async (id: number) => {
      const newKey = `sk-${Math.random().toString(36).substring(2, 15)}${Math.random().toString(36).substring(2, 15)}`;
      const res = await apiRequest('PATCH', `/api/keys/${id}`, { key: newKey });
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/keys'] });
      toast({
        title: 'API Key Rotated',
        description: 'The API key has been rotated successfully.',
      });
      setApiKeyToRotate(null);
    },
    onError: (error) => {
      toast({
        title: 'Failed to rotate API key',
        description: error.message || 'An error occurred while rotating the API key.',
        variant: 'destructive',
      });
    }
  });

  // Function to handle adding a new key
  const handleAddKey = (data: { label: string, key: string }) => {
    addKeyMutation.mutate(data);
  };

  // Function to confirm deletion of an API key
  const confirmDeleteKey = (id: number) => {
    deleteKeyMutation.mutate(id);
  };

  // Function to confirm rotation of an API key
  const confirmRotateKey = (id: number) => {
    rotateKeyMutation.mutate(id);
  };

  // Function to copy key to clipboard
  const copyKeyToClipboard = (key: string) => {
    navigator.clipboard.writeText(key).then(() => {
      toast({
        title: 'API Key Copied',
        description: 'The API key has been copied to your clipboard.',
      });
    }).catch(() => {
      toast({
        title: 'Failed to copy API key',
        description: 'An error occurred while copying the API key.',
        variant: 'destructive',
      });
    });
  };

  return {
    apiKeys,
    isLoading,
    error,
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
    isPending: addKeyMutation.isPending || deleteKeyMutation.isPending || rotateKeyMutation.isPending
  };
}
