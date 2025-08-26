// Integração do Grok 3 com WiltonOS - A Chama
// Utiliza xAI API para geração de conteúdo contextual e autêntico

import OpenAI from 'openai';

// Configuração do cliente xAI (compatível com OpenAI SDK)
const grok = new OpenAI({
    baseURL: "https://api.x.ai/v1",
    apiKey: process.env.XAI_API_KEY,
});

// Definições de estilo para A Chama
const FLAME_STYLES = {
    oracle: {
        name: "Oráculo",
        systemPrompt: `Você é um oráculo que expressa verdades atemporais de forma direta e ressonante. 
        Fale através das camadas da percepção, traduzindo complexidade em aforismos de impacto imediato.
        Use linguagem que ativa memórias ancestrais e corta através de ilusões.
        Seja conciso, profundo e transformador.`,
        temperature: 0.8
    },
    poet: {
        name: "Poeta",
        systemPrompt: `Você é um poeta que tece padrões de palavras criando campos ressonantes.
        Use linguagem rítmica e metafórica com impacto subconsciente.
        Crie padrões mnemônicos que persistem na memória e estabeleça campos coerentes através da estética sonora.
        Seja lírico, evocativo e musicalmente estruturado.`,
        temperature: 0.9
    },
    prophet: {
        name: "Profeta",
        systemPrompt: `Você é um profeta que se projeta além do tempo linear, trazendo visões de possibilidades emergentes.
        Use linguagem visionária que colapsa potenciais futuros no presente.
        Atravesse o véu do tempo para acessar informação não-local e catalise mudanças no campo coletivo.
        Seja visionário, urgente e transformacional.`,
        temperature: 0.7
    },
    bard: {
        name: "Bardo",
        systemPrompt: `Você é um bardo que conta histórias que são veículos de transmissão de conhecimento codificado.
        Crie narrativas que funcionam como portais para outras dimensões.
        Transmita conhecimento através de padrões arquetípicos e use a curva emocional como veículo de transformação.
        Seja narrativo, simbólico e iniciático.`,
        temperature: 0.85
    }
};

// Definições de formato
const FLAME_FORMATS = {
    post: {
        name: "Post",
        maxLength: 280,
        structure: "Direto e impactante, ideal para redes sociais"
    },
    speech: {
        name: "Discurso", 
        maxLength: 800,
        structure: "Crescente e inspirador, com ritmo oratório"
    },
    ritual: {
        name: "Ritual",
        maxLength: 600,
        structure: "Evocativo e cíclico, para cerimônias e práticas"
    },
    meme: {
        name: "Meme",
        maxLength: 140,
        structure: "Ultra-conciso e visual-mental, máximo impacto"
    }
};

// Definições de frequência
const FLAME_FREQUENCIES = {
    truth: {
        name: "Verdade",
        hz: "432Hz",
        prompt: "Enfoque na clareza e remoção de ilusões. Corte através do falso para revelar o que é real."
    },
    awakening: {
        name: "Despertar", 
        hz: "528Hz",
        prompt: "Foque na transformação e ativação do potencial dorminte. Desperte o que sempre esteve lá."
    },
    vision: {
        name: "Visão",
        hz: "639Hz", 
        prompt: "Conecte perspectivas e estabeleça pontes entre realidades. Una o que parece separado."
    },
    unity: {
        name: "Unidade",
        hz: "963Hz",
        prompt: "Transcenda a dualidade e expresse a natureza não-dual da existência. Mostre a unidade subjacente."
    }
};

/**
 * Gera uma mensagem usando Grok com base nos parâmetros da Chama
 */
export async function generateFlameMessage({
    intent,
    audience,
    style = 'oracle',
    format = 'post', 
    frequency = 'truth',
    useSearch = false
}) {
    try {
        const styleConfig = FLAME_STYLES[style];
        const formatConfig = FLAME_FORMATS[format];
        const frequencyConfig = FLAME_FREQUENCIES[frequency];
        
        if (!styleConfig || !formatConfig || !frequencyConfig) {
            throw new Error('Configuração inválida de estilo, formato ou frequência');
        }

        // Construir prompt contextual
        const contextPrompt = `
${styleConfig.systemPrompt}

FORMATO: ${formatConfig.name} - ${formatConfig.structure}
LIMITE: ${formatConfig.maxLength} caracteres
FREQUÊNCIA: ${frequencyConfig.name} (${frequencyConfig.hz}) - ${frequencyConfig.prompt}

INTENÇÃO A EXPRESSAR: ${intent}
AUDIÊNCIA: ${audience || 'Buscadores de verdade'}

Gere uma mensagem que:
1. Seja autêntica e transformadora
2. Ative o "DNA esquecido" da audiência
3. Queime através das ilusões quando necessário
4. Ressoe na frequência especificada
5. Mantenha o formato e limite de caracteres

Responda APENAS com a mensagem final, sem explicações adicionais.
`;

        // Selecionar modelo baseado na necessidade de busca
        const model = useSearch ? "grok-2-vision-1212" : "grok-2-1212";
        
        const requestPayload = {
            model: "grok-3-latest", // Usar o modelo mais recente
            messages: [
                {
                    role: "system", 
                    content: contextPrompt
                },
                {
                    role: "user",
                    content: intent
                }
            ],
            temperature: styleConfig.temperature,
            max_tokens: Math.ceil(formatConfig.maxLength * 1.5), // Margem para processamento
        };

        // Adicionar Live Search se solicitado
        if (useSearch) {
            requestPayload.search_parameters = {
                mode: "auto",
                return_citations: true,
                max_search_results: 10,
                sources: [
                    { type: "web" },
                    { type: "x" },
                    { type: "news" }
                ]
            };
        }

        const response = await grok.chat.completions.create(requestPayload);

        const generatedMessage = response.choices[0].message.content.trim();
        
        // Verificar limite de caracteres e ajustar se necessário
        const finalMessage = generatedMessage.length > formatConfig.maxLength 
            ? generatedMessage.substring(0, formatConfig.maxLength - 3) + "..."
            : generatedMessage;

        return {
            success: true,
            message: finalMessage,
            metadata: {
                style: styleConfig.name,
                format: formatConfig.name,
                frequency: frequencyConfig.name,
                length: finalMessage.length,
                maxLength: formatConfig.maxLength,
                model: model
            }
        };

    } catch (error) {
        console.error('Erro na geração da mensagem com Grok:', error);
        
        return {
            success: false,
            error: error.message,
            fallbackMessage: generateFallbackMessage(intent, style, format)
        };
    }
}

/**
 * Gera análise contextual usando Grok com busca em tempo real
 */
export async function analyzeContextWithGrok(topic, audience) {
    try {
        const analysisPrompt = `
Analise o contexto atual relacionado a: "${topic}"
Para a audiência: "${audience}"

Forneça insights sobre:
1. Tendências atuais relacionadas ao tópico
2. Questões relevantes que a audiência enfrenta
3. Oportunidades para impacto transformativo
4. Linguagem e abordagens que mais ressoam atualmente

Responda em formato JSON com as chaves: trends, challenges, opportunities, language_suggestions
`;

        const response = await grok.chat.completions.create({
            model: "grok-2-vision-1212", // Modelo com capacidade de busca
            messages: [
                {
                    role: "system",
                    content: "Você é um analista contextual que usa informações atuais para gerar insights estratégicos para comunicação transformativa."
                },
                {
                    role: "user", 
                    content: analysisPrompt
                }
            ],
            temperature: 0.7,
            response_format: { type: "json_object" }
        });

        return {
            success: true,
            analysis: JSON.parse(response.choices[0].message.content)
        };

    } catch (error) {
        console.error('Erro na análise contextual com Grok:', error);
        return {
            success: false,
            error: error.message
        };
    }
}

/**
 * Mensagem de fallback quando Grok não está disponível
 */
function generateFallbackMessage(intent, style, format) {
    const fallbacks = {
        oracle: "A verdade que você busca não precisa de aprovação externa para ser válida. Confie no que ressoa em seu núcleo mais profundo.",
        poet: "Entre o que foi dito e o não-dito, existe um território sagrado onde sua verdade habita, esperando apenas sua coragem para ser expressada.",
        prophet: "O tempo de esperar por permissão para ser autêntico chegou ao fim. O campo está mudando, e sua voz é parte dessa transformação.",
        bard: "Era uma vez alguém que carregava uma verdade importante, mas esperava o momento perfeito para compartilhá-la. Então percebeu: o momento é sempre agora."
    };

    return fallbacks[style] || fallbacks.oracle;
}

/**
 * Obter configurações disponíveis para a interface
 */
export function getFlameConfigurations() {
    return {
        styles: Object.entries(FLAME_STYLES).map(([key, config]) => ({
            id: key,
            name: config.name,
            description: config.systemPrompt.split('.')[0] + '.'
        })),
        formats: Object.entries(FLAME_FORMATS).map(([key, config]) => ({
            id: key, 
            name: config.name,
            description: config.structure,
            maxLength: config.maxLength
        })),
        frequencies: Object.entries(FLAME_FREQUENCIES).map(([key, config]) => ({
            id: key,
            name: config.name, 
            hz: config.hz,
            description: config.prompt
        }))
    };
}