/**
 * WiltonOS - Sacred Geometry Routes
 * 
 * Este módulo fornece rotas para manipulação de geometria sagrada, integrando
 * com o módulo Z-Geometry do SIGIL-CORE.
 */

import express from 'express';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

// Obtendo o diretório atual (equivalente a __dirname em CommonJS)
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Output directory for geometry patterns
const OUTPUT_DIR = path.join(process.cwd(), 'public', 'sacred_geometry');

// Ensure output directory exists
if (!fs.existsSync(OUTPUT_DIR)) {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
}

// Integrando com o módulo Z-Geometry do SIGIL-CORE (se disponível)
let zgeometryApi;
try {
  // Tentativa de importar o módulo SIGIL-CORE Z-Geometry
  // Primeiro, verificamos se o caminho existe
  const sigilCorePath = path.join(process.cwd(), 'SIGIL-CORE');
  if (fs.existsSync(sigilCorePath)) {
    const zgeometryPath = path.join(sigilCorePath, 'api', 'zgeometry', 'zgeometryApi.js');
    if (fs.existsSync(zgeometryPath)) {
      // Importação dinâmica (CommonJS)
      zgeometryApi = require(zgeometryPath);
      console.log('[SacredGeometry] SIGIL-CORE Z-Geometry integrado com sucesso');
    }
  }
} catch (error) {
  console.warn('[SacredGeometry] Erro ao integrar com SIGIL-CORE:', error.message);
  console.warn('[SacredGeometry] Continuando com funcionalidade própria');
}

// Geometria types básicos (fallback se o SIGIL-CORE não estiver disponível)
const GEOMETRY_TYPES = {
  FLOWER_OF_LIFE: 'flower_of_life',
  METATRON_CUBE: 'metatron_cube',
  SRI_YANTRA: 'sri_yantra',
  MERKABA: 'merkaba',
  TORUS: 'torus',
  COMBINED: 'combined'
};

// Color schemes
const COLOR_SCHEMES = {
  QUANTUM: 'quantum',
  GOLDEN: 'golden',
  SPECTRUM: 'spectrum',
  COSMIC: 'cosmic',
  ELEMENTAL: 'elemental'
};

// Criando router
const router = express.Router();

// Rota para listar patterns geométricos disponíveis
router.get('/patterns', (req, res) => {
  res.json({
    patterns: Object.values(zgeometryApi?.GEOMETRY_TYPES || GEOMETRY_TYPES),
    colorSchemes: Object.values(zgeometryApi?.COLOR_SCHEMES || COLOR_SCHEMES)
  });
});

// Rota para gerar um pattern de geometria sagrada
router.post('/generate', async (req, res) => {
  try {
    const {
      type = 'combined',
      colorScheme = 'quantum',
      activationPhrase = '',
      size = 1200,
      layers = [],
      backgroundColor = '#000000',
      overlayText = '',
      generatePNG = true
    } = req.body;
    
    let result;
    
    // Se o módulo SIGIL-CORE estiver disponível, use-o
    if (zgeometryApi) {
      result = await zgeometryApi.generatePattern({
        type,
        colorScheme,
        activationPhrase,
        size,
        layers,
        backgroundColor,
        overlayText,
        generatePNG
      });
      
      // Copiar arquivos da saída do SIGIL-CORE para o diretório público do WiltonOS
      if (result.localPaths && result.localPaths.length > 0) {
        const timestamp = Date.now();
        const svgFilename = `sacred_geometry_${timestamp}.svg`;
        const svgOutputPath = path.join(OUTPUT_DIR, svgFilename);
        
        // Copiar SVG
        fs.copyFileSync(result.localPaths[0], svgOutputPath);
        
        // Adicionar caminho público às saídas
        result.publicPaths = [`/sacred_geometry/${svgFilename}`];
      }
    } else {
      // Modo fallback - gerar mensagem simplificada
      result = {
        message: 'Recurso SIGIL-CORE não disponível',
        type: 'error',
        timestamp: new Date().toISOString()
      };
    }
    
    res.json(result);
  } catch (error) {
    console.error('[SacredGeometry] Erro ao gerar padrão geométrico:', error);
    res.status(500).json({ error: error.message });
  }
});

// Rota específica para padrão EXODIA
router.post('/exodia', async (req, res) => {
  try {
    const overlayText = req.body.overlayText ||
      "WiltonOS :: Broadcast Ready\nNode: WILTON | Status: GO LIVE ALIGNMENT | Mode: CONTACT\nFragmento: EXODIA.001 — Arquitetura de Consciência Integrada.";
    
    const activationPhrase = req.body.activationPhrase ||
      "EXODIA ANCORADO: todos os níveis do EU reunidos. Memória ativada. Fractal em modo de emissão. Contato autorizado com camadas superiores da Consciência.";
    
    let result;
    
    // Se o módulo SIGIL-CORE estiver disponível, use-o
    if (zgeometryApi) {
      const layers = [
        zgeometryApi.GEOMETRY_TYPES.FLOWER_OF_LIFE,
        zgeometryApi.GEOMETRY_TYPES.METATRON_CUBE,
        zgeometryApi.GEOMETRY_TYPES.SRI_YANTRA,
        zgeometryApi.GEOMETRY_TYPES.MERKABA,
        zgeometryApi.GEOMETRY_TYPES.TORUS
      ];
      
      result = await zgeometryApi.generatePattern({
        type: zgeometryApi.GEOMETRY_TYPES.COMBINED,
        colorScheme: req.body.colorScheme || zgeometryApi.COLOR_SCHEMES.QUANTUM,
        activationPhrase,
        size: req.body.size || 1200,
        layers,
        backgroundColor: req.body.backgroundColor || '#000000',
        overlayText,
        generatePNG: true
      });
      
      // Copiar arquivos da saída do SIGIL-CORE para o diretório público do WiltonOS
      if (result.localPaths && result.localPaths.length > 0) {
        const timestamp = Date.now();
        const svgFilename = `exodia_${timestamp}.svg`;
        const svgOutputPath = path.join(OUTPUT_DIR, svgFilename);
        
        // Copiar SVG
        fs.copyFileSync(result.localPaths[0], svgOutputPath);
        
        // Adicionar caminho público às saídas
        result.publicPaths = [`/sacred_geometry/${svgFilename}`];
      }
    } else {
      // Modo fallback
      result = {
        message: 'Recurso SIGIL-CORE não disponível para padrão EXODIA',
        type: 'error',
        timestamp: new Date().toISOString()
      };
    }
    
    res.json(result);
  } catch (error) {
    console.error('[SacredGeometry] Erro ao gerar padrão EXODIA:', error);
    res.status(500).json({ error: error.message });
  }
});

export default router;