const express = require('express');
const fetch = require('node-fetch');
const sharp = require('sharp');
const fs = require('fs').promises;
const path = require('path');

const router = express.Router();

// Configurações das APIs disponíveis
const APIs = {
    openai: {
        key: process.env.OPENAI_API_KEY,
        endpoint: 'https://api.openai.com/v1/images/generations',
        model: 'dall-e-3'
    },
    google: {
        key: process.env.GOOGLE_AI_ULTRA_API_KEY,
        endpoint: 'https://generativelanguage.googleapis.com/v1beta/models/imagen-3.0-generate-001:generateImage',
        model: 'imagen-3.0-generate-001'
    }
};

// Especificações dos 3 portais
const PORTAL_SPECS = {
    'oroboro': {
        name: 'Wilton_Oroboro_Central_81x121cm',
        size: [81, 121],
        prompt: 'Ultra high resolution sacred geometry mandala with golden infinity symbols, flower of life patterns, DNA double helix, cosmic nebula background. Ancient mystical symbols in brilliant gold and cyan colors. Perfect vertical composition for temple altar. Professional fine art quality with intricate details, spiritual symbolism, cosmic consciousness visualization.',
        style: 'sacred geometry, mystical art, golden ratio, cosmic'
    },
    'neon-br': {
        name: 'Wilton_NeonBR_LadoE_60x90cm',
        size: [60, 90],
        prompt: 'Futuristic neon geometric patterns with glowing BR cube hologram, cyberpunk sacred geometry, quantum field visualization. Electric cyan and gold elements forming circuit-like mystical patterns. High-tech spiritual art with neon glow effects, digital consciousness representation, Brazilian quantum identity symbols.',
        style: 'cyberpunk, neon art, digital mystical, quantum'
    },
    'senoide': {
        name: 'Wilton_SenoideCosmica_LadoD_60x90cm',
        size: [60, 90],
        prompt: 'Cosmic sine wave patterns with golden torus energy field, blue infinity loops, purple triangle mandala, stellar nebula. Mathematical harmony meets spiritual geometry. Harmonic frequency visualization with cosmic background, sacred mathematics in motion, dimensional portal aesthetics.',
        style: 'cosmic art, mathematical beauty, harmonic waves'
    }
};

// Função para gerar com OpenAI
async function generateWithOpenAI(portalKey) {
    const spec = PORTAL_SPECS[portalKey];
    
    try {
        const response = await fetch(APIs.openai.endpoint, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${APIs.openai.key}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                model: 'dall-e-3',
                prompt: spec.prompt,
                n: 1,
                size: '1024x1792', // Vertical HD
                quality: 'hd',
                style: 'vivid'
            })
        });

        if (!response.ok) {
            throw new Error(`OpenAI API error: ${response.status}`);
        }

        const data = await response.json();
        return {
            success: true,
            imageUrl: data.data[0].url,
            provider: 'OpenAI DALL-E 3',
            spec: spec
        };

    } catch (error) {
        console.error(`Erro OpenAI para ${portalKey}:`, error);
        return { success: false, error: error.message };
    }
}

// Função para gerar com Google Imagen
async function generateWithGoogle(portalKey) {
    const spec = PORTAL_SPECS[portalKey];
    
    try {
        const response = await fetch(`${APIs.google.endpoint}?key=${APIs.google.key}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                prompt: spec.prompt,
                model: APIs.google.model,
                generationConfig: {
                    aspectRatio: "3:4", // Vertical para os portais
                    outputOptions: {
                        mimeType: "image/png"
                    }
                }
            })
        });

        if (!response.ok) {
            throw new Error(`Google API error: ${response.status}`);
        }

        const data = await response.json();
        return {
            success: true,
            imageData: data.generatedImages[0].imageBytes,
            provider: 'Google Imagen 3.0',
            spec: spec
        };

    } catch (error) {
        console.error(`Erro Google para ${portalKey}:`, error);
        return { success: false, error: error.message };
    }
}

// Função para converter para 300 DPI
async function convertTo300DPI(imageBuffer, spec) {
    try {
        const widthPx = Math.round(spec.size[0] * 118.11); // 300 DPI
        const heightPx = Math.round(spec.size[1] * 118.11);
        
        const processedImage = await sharp(imageBuffer)
            .resize(widthPx, heightPx, {
                kernel: sharp.kernel.lanczos3,
                fit: 'fill'
            })
            .png({
                quality: 100,
                compressionLevel: 0
            })
            .toBuffer();

        return processedImage;
    } catch (error) {
        console.error('Erro na conversão para 300 DPI:', error);
        throw error;
    }
}

// Route: Gerar portal individual
router.post('/generate-portal/:portalKey', async (req, res) => {
    const { portalKey } = req.params;
    const { provider = 'auto' } = req.body;

    if (!PORTAL_SPECS[portalKey]) {
        return res.status(400).json({ 
            success: false, 
            error: 'Portal inválido. Use: oroboro, neon-br, ou senoide' 
        });
    }

    console.log(`🎨 Gerando portal ${portalKey} com provider ${provider}`);

    let result;
    
    try {
        // Escolher provider
        if (provider === 'openai' || (provider === 'auto' && APIs.openai.key)) {
            result = await generateWithOpenAI(portalKey);
        } else if (provider === 'google' || (provider === 'auto' && APIs.google.key)) {
            result = await generateWithGoogle(portalKey);
        } else {
            return res.status(500).json({
                success: false,
                error: 'Nenhuma API disponível. Verifique as chaves.'
            });
        }

        if (!result.success) {
            return res.status(500).json(result);
        }

        // Se temos URL (OpenAI), baixar a imagem
        let imageBuffer;
        if (result.imageUrl) {
            const imageResponse = await fetch(result.imageUrl);
            imageBuffer = await imageResponse.buffer();
        } else if (result.imageData) {
            imageBuffer = Buffer.from(result.imageData, 'base64');
        }

        // Converter para 300 DPI
        const finalImage = await convertTo300DPI(imageBuffer, result.spec);

        // Salvar temporariamente
        const outputDir = path.join(process.cwd(), 'temp_portal_output');
        await fs.mkdir(outputDir, { recursive: true });
        
        const filename = `${result.spec.name}_300DPI_PRINT.png`;
        const filePath = path.join(outputDir, filename);
        await fs.writeFile(filePath, finalImage);

        res.json({
            success: true,
            portal: portalKey,
            provider: result.provider,
            filename: filename,
            downloadUrl: `/api/temple-art/download/${filename}`,
            specs: {
                name: result.spec.name,
                size: result.spec.size,
                dimensions: `${Math.round(result.spec.size[0] * 118.11)} x ${Math.round(result.spec.size[1] * 118.11)} pixels`,
                dpi: 300
            }
        });

    } catch (error) {
        console.error(`Erro geral ao gerar ${portalKey}:`, error);
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
});

// Route: Gerar todos os 3 portais
router.post('/generate-all-portals', async (req, res) => {
    const { provider = 'auto' } = req.body;
    
    console.log('🏛️ Iniciando geração dos 3 portais sagrados');
    
    const results = {};
    const portals = ['oroboro', 'neon-br', 'senoide'];
    
    try {
        for (const portal of portals) {
            console.log(`🔮 Gerando portal: ${portal}`);
            
            const portalResult = await new Promise((resolve) => {
                // Simular uma requisição interna
                const mockReq = { params: { portalKey: portal }, body: { provider } };
                const mockRes = {
                    json: (data) => resolve(data),
                    status: (code) => ({ json: (data) => resolve({ ...data, statusCode: code }) })
                };
                
                // Chamar a função do endpoint
                router.stack.find(layer => 
                    layer.route && layer.route.path === '/generate-portal/:portalKey'
                ).route.stack[0].handle(mockReq, mockRes);
            });
            
            results[portal] = portalResult;
        }
        
        const successCount = Object.values(results).filter(r => r.success).length;
        
        res.json({
            success: successCount === 3,
            message: `${successCount}/3 portais gerados com sucesso`,
            results: results,
            readyForRagprint: successCount === 3
        });
        
    } catch (error) {
        console.error('Erro na geração completa:', error);
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
});

// Route: Download dos arquivos
router.get('/download/:filename', async (req, res) => {
    const { filename } = req.params;
    const filePath = path.join(process.cwd(), 'temp_portal_output', filename);
    
    try {
        await fs.access(filePath);
        res.download(filePath, filename);
    } catch (error) {
        res.status(404).json({ error: 'Arquivo não encontrado' });
    }
});

// Route: Status das APIs
router.get('/api-status', (req, res) => {
    res.json({
        apis: {
            openai: {
                available: !!APIs.openai.key,
                model: APIs.openai.model
            },
            google: {
                available: !!APIs.google.key,
                model: APIs.google.model
            }
        },
        portals: Object.keys(PORTAL_SPECS),
        ready: !!(APIs.openai.key || APIs.google.key)
    });
});

module.exports = router;