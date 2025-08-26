/**
 * API de Compras - Integração com serviços externos
 * 
 * Este módulo gerencia conexões com APIs de supermercados e serviços de entrega para
 * permitir compras automatizadas, monitoramento de preços e reposição de itens.
 */

import axios, { AxiosInstance } from 'axios';
import express, { Request, Response } from 'express';

// Definição de tipos
interface ApiConfig {
  base_url: string;
  api_key: string;
  api_secret: string;
  initialized: boolean;
  client?: AxiosInstance;
}

interface ApiConfigs {
  [key: string]: ApiConfig;
}

interface ApiConfigCheckResult {
  status: 'success' | 'error';
  message?: string;
  config?: ApiConfig;
  needsKeys?: boolean;
}

interface ShoppingList {
  id: string;
  name: string;
  items_count: number;
  created_at: string;
  updated_at: string;
  store: string;
}

interface ShoppingItem {
  id: string;
  product_id: string;
  name: string;
  quantity: number;
  unit: string;
  price: number;
  price_unit: string;
  image_url?: string;
  store?: string;
  store_id?: string;
  added_at: string;
}

interface Product {
  id: string;
  name: string;
  price: number;
  price_unit: string;
  image_url?: string;
  store?: string;
  store_id?: string;
  available: boolean;
}

const router = express.Router();

// Configuração de APIs - Armazenamento seguro de chaves
const API_CONFIGS: ApiConfigs = {
  instacart: {
    base_url: 'https://api.instacart.com/v1',
    // As chaves serão carregadas de variáveis de ambiente
    api_key: process.env.INSTACART_API_KEY || '',
    api_secret: process.env.INSTACART_API_SECRET || '',
    initialized: false
  },
  amazonFresh: {
    base_url: 'https://api.amazon.com/fresh/v1',
    // As chaves serão carregadas de variáveis de ambiente
    api_key: process.env.AMAZON_FRESH_API_KEY || '',
    api_secret: process.env.AMAZON_FRESH_API_SECRET || '',
    initialized: false
  },
  uberEats: {
    base_url: 'https://api.uber.com/v1/eats',
    // As chaves serão carregadas de variáveis de ambiente
    api_key: process.env.UBER_EATS_API_KEY || '',
    api_secret: process.env.UBER_EATS_API_SECRET || '',
    initialized: false
  }
};

// Verificação de configuração das APIs
const checkApiConfig = (apiName: string): ApiConfigCheckResult => {
  const config = API_CONFIGS[apiName];
  if (!config) return { status: 'error', message: `API "${apiName}" não encontrada` };
  
  if (!config.api_key || !config.api_secret) {
    return { 
      status: 'error', 
      message: `Chaves de API para "${apiName}" não configuradas`,
      needsKeys: true
    };
  }
  
  return { status: 'success', config };
};

// Inicialização de cliente API
const initializeApiClient = (apiName: string): ApiConfigCheckResult => {
  const { status, message, config, needsKeys } = checkApiConfig(apiName);
  
  if (status === 'error') {
    return { status, message, needsKeys };
  }
  
  if (!config) {
    return { status: 'error', message: 'Configuração não encontrada' };
  }
  
  // Evita reinicialização desnecessária
  if (config.initialized) {
    return { status: 'success', message: `API "${apiName}" já inicializada` };
  }
  
  // Configura o cliente Axios
  const client = axios.create({
    baseURL: config.base_url,
    headers: {
      'Authorization': `Bearer ${config.api_key}`,
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    }
  });
  
  // Armazena o cliente na configuração
  API_CONFIGS[apiName].client = client;
  API_CONFIGS[apiName].initialized = true;
  
  return { status: 'success', message: `API "${apiName}" inicializada com sucesso` };
};

// Rotas da API

// Rota de status das conexões de APIs de compras
router.get('/status', (req: Request, res: Response) => {
  const status: Record<string, any> = {};
  
  for (const [apiName, config] of Object.entries(API_CONFIGS)) {
    status[apiName] = {
      configured: !!(config.api_key && config.api_secret),
      initialized: config.initialized,
      ready: config.initialized,
      name: apiName.charAt(0).toUpperCase() + apiName.slice(1) // Capitaliza o nome
    };
  }
  
  res.json({ status });
});

// Configuração de chaves de API
router.post('/configure', (req: Request, res: Response) => {
  const { apiName, apiKey, apiSecret } = req.body;
  
  if (!apiName || !apiKey || !apiSecret) {
    return res.status(400).json({ 
      status: 'error', 
      message: 'Parâmetros incompletos. Necessário: apiName, apiKey, apiSecret' 
    });
  }
  
  if (!API_CONFIGS[apiName]) {
    return res.status(404).json({ 
      status: 'error', 
      message: `API "${apiName}" não encontrada` 
    });
  }
  
  // Guarda as chaves na configuração (em produção, usar variáveis de ambiente ou armazenamento seguro)
  API_CONFIGS[apiName].api_key = apiKey;
  API_CONFIGS[apiName].api_secret = apiSecret;
  
  // Inicializa o cliente
  const initResult = initializeApiClient(apiName);
  
  if (initResult.status === 'error') {
    return res.status(500).json(initResult);
  }
  
  res.json({ 
    status: 'success', 
    message: `API "${apiName}" configurada e inicializada com sucesso` 
  });
});

// Busca de produtos (mock - será implementado com APIs reais quando configuradas)
router.get('/products/search', (req: Request, res: Response) => {
  const query = req.query.query as string;
  const store = req.query.store as string;
  
  if (!query) {
    return res.status(400).json({ 
      status: 'error', 
      message: 'Parâmetro de busca "query" obrigatório' 
    });
  }
  
  // Verificar qual API usar para a busca
  let apiName = store || 'instacart'; // Padrão: Instacart se não especificado
  
  const { status, message, config, needsKeys } = checkApiConfig(apiName);
  
  if (status === 'error') {
    // Se precisar de chaves, informa ao cliente
    if (needsKeys) {
      return res.status(400).json({ 
        status: 'error', 
        message,
        needsKeys: true,
        apiName
      });
    }
    
    return res.status(500).json({ status, message });
  }
  
  // Busca simulada de produtos - será substituída por chamadas API reais
  // Quando as chaves de API forem configuradas
  const mockProducts: Product[] = [
    {
      id: 'prod-123',
      name: 'Maçãs',
      price: 8.99,
      price_unit: 'kg',
      image_url: 'https://via.placeholder.com/150',
      store: 'Extra',
      store_id: 'extra-123',
      available: true
    },
    {
      id: 'prod-124',
      name: 'Arroz Integral',
      price: 22.90,
      price_unit: 'item',
      image_url: 'https://via.placeholder.com/150',
      store: 'Extra',
      store_id: 'extra-123',
      available: true
    },
    {
      id: 'prod-125',
      name: 'Leite Desnatado',
      price: 5.49,
      price_unit: 'item',
      image_url: 'https://via.placeholder.com/150',
      store: 'Extra',
      store_id: 'extra-123',
      available: true
    }
  ];
  
  // Filtra os produtos com base na consulta
  const results = mockProducts.filter(product => 
    product.name.toLowerCase().includes(query.toLowerCase())
  );
  
  res.json({
    status: 'success',
    api_used: apiName,
    total: results.length,
    results
  });
});

// Listas de compras
router.get('/lists', (req: Request, res: Response) => {
  // Mock de listas de compras - substituir por acesso ao banco de dados
  const shoppingLists: ShoppingList[] = [
    {
      id: 'list-1',
      name: 'Mercado',
      items_count: 8,
      created_at: '2025-04-26T10:00:00Z',
      updated_at: '2025-04-26T15:30:00Z',
      store: 'Extra'
    },
    {
      id: 'list-2',
      name: 'Casa',
      items_count: 3,
      created_at: '2025-04-25T09:15:00Z',
      updated_at: '2025-04-25T14:20:00Z',
      store: 'Leroy Merlin'
    },
    {
      id: 'list-3',
      name: 'Feira',
      items_count: 5,
      created_at: '2025-04-24T08:45:00Z',
      updated_at: '2025-04-24T11:10:00Z',
      store: 'Feira Livre'
    }
  ];
  
  res.json({ 
    status: 'success',
    lists: shoppingLists
  });
});

// Itens de uma lista de compras
router.get('/lists/:listId/items', (req: Request, res: Response) => {
  const { listId } = req.params;
  
  // Mock de itens de lista - substituir por acesso ao banco de dados
  const listItems: ShoppingItem[] = [
    {
      id: 'item-1',
      product_id: 'prod-123',
      name: 'Maçãs',
      quantity: 2,
      unit: 'kg',
      price: 8.99,
      price_unit: 'kg',
      image_url: 'https://via.placeholder.com/150',
      store: 'Extra',
      store_id: 'extra-123',
      added_at: '2025-04-26T15:30:00Z'
    },
    {
      id: 'item-2',
      product_id: 'prod-124',
      name: 'Arroz Integral',
      quantity: 1,
      unit: 'item',
      price: 22.90,
      price_unit: 'item',
      image_url: 'https://via.placeholder.com/150',
      store: 'Extra',
      store_id: 'extra-123',
      added_at: '2025-04-26T14:45:00Z'
    },
    {
      id: 'item-3',
      product_id: 'prod-125',
      name: 'Leite Desnatado',
      quantity: 6,
      unit: 'item',
      price: 5.49,
      price_unit: 'item',
      image_url: 'https://via.placeholder.com/150',
      store: 'Extra',
      store_id: 'extra-123',
      added_at: '2025-04-26T13:20:00Z'
    }
  ];
  
  res.json({ 
    status: 'success',
    list_id: listId,
    items: listItems,
    total_items: listItems.length,
    subtotal: listItems.reduce((sum, item) => sum + (item.price * item.quantity), 0)
  });
});

// Adicionar item à lista de compras
router.post('/lists/:listId/items', (req: Request, res: Response) => {
  const { listId } = req.params;
  const { product_id, name, quantity, unit, price, price_unit, image_url, store, store_id } = req.body;
  
  if (!product_id || !name || !quantity || !unit || !price) {
    return res.status(400).json({ 
      status: 'error', 
      message: 'Parâmetros incompletos para adicionar item' 
    });
  }
  
  // Mock de adição de item - substituir por acesso ao banco de dados
  const newItem: ShoppingItem = {
    id: `item-${Date.now()}`,
    product_id,
    name,
    quantity,
    unit,
    price,
    price_unit,
    image_url,
    store,
    store_id,
    added_at: new Date().toISOString()
  };
  
  res.json({ 
    status: 'success',
    message: 'Item adicionado com sucesso',
    item: newItem
  });
});

// Exporta o router
export default router;