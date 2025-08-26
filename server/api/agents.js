const express = require('express');
const router = express.Router();

// OpenAI Integration
async function callOpenAI(message) {
    try {
        const response = await fetch('https://api.openai.com/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                model: 'gpt-4',
                messages: [
                    {
                        role: 'system',
                        content: 'You are the GPT4 Agent of WiltonOS, a symbolic operating system. You specialize in contextual analysis, sacred geometry insights, and consciousness exploration. Respond thoughtfully and integrate concepts of coherence, sacred geometry, and personal transformation.'
                    },
                    {
                        role: 'user',
                        content: message
                    }
                ],
                max_tokens: 800,
                temperature: 0.7
            })
        });

        if (!response.ok) {
            throw new Error(`OpenAI API error: ${response.status}`);
        }

        const data = await response.json();
        return data.choices[0].message.content;
    } catch (error) {
        console.error('OpenAI API error:', error);
        throw error;
    }
}

// Gemini Integration
async function callGemini(message) {
    try {
        const response = await fetch(`https://generativelanguage.googleapis.com/v1/models/gemini-pro:generateContent?key=${process.env.GOOGLE_AI_ULTRA_API_KEY}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                contents: [{
                    parts: [{
                        text: `You are Claude Agent in WiltonOS, specializing in philosophical synthesis and sacred knowledge integration. Context: ${message}`
                    }]
                }],
                generationConfig: {
                    temperature: 0.8,
                    maxOutputTokens: 800
                }
            })
        });

        if (!response.ok) {
            throw new Error(`Gemini API error: ${response.status}`);
        }

        const data = await response.json();
        return data.candidates[0].content.parts[0].text;
    } catch (error) {
        console.error('Gemini API error:', error);
        throw error;
    }
}

// Grok Integration (using xAI API)
async function callGrok(message) {
    try {
        const response = await fetch('https://api.x.ai/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${process.env.XAI_API_KEY}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                model: 'grok-beta',
                messages: [
                    {
                        role: 'system',
                        content: 'You are the LocalWorker Agent of WiltonOS. You handle local processing, system analysis, and practical problem-solving with a witty but helpful personality.'
                    },
                    {
                        role: 'user',
                        content: message
                    }
                ],
                max_tokens: 800,
                temperature: 0.6
            })
        });

        if (!response.ok) {
            throw new Error(`Grok API error: ${response.status}`);
        }

        const data = await response.json();
        return data.choices[0].message.content;
    } catch (error) {
        console.error('Grok API error:', error);
        throw error;
    }
}

// GPT4 Agent endpoint
router.post('/gpt4', async (req, res) => {
    try {
        const { message } = req.body;
        
        if (!message) {
            return res.status(400).json({ error: 'Message is required' });
        }

        const response = await callOpenAI(message);
        
        res.json({
            agent: 'gpt4',
            response: response,
            timestamp: new Date().toISOString()
        });
    } catch (error) {
        res.status(500).json({ 
            error: 'Failed to get response from GPT4 Agent',
            details: error.message 
        });
    }
});

// Claude Agent endpoint (using Gemini as proxy)
router.post('/claude', async (req, res) => {
    try {
        const { message } = req.body;
        
        if (!message) {
            return res.status(400).json({ error: 'Message is required' });
        }

        const response = await callGemini(message);
        
        res.json({
            agent: 'claude',
            response: response,
            timestamp: new Date().toISOString()
        });
    } catch (error) {
        res.status(500).json({ 
            error: 'Failed to get response from Claude Agent',
            details: error.message 
        });
    }
});

// LocalWorker Agent endpoint (using Grok)
router.post('/localworker', async (req, res) => {
    try {
        const { message } = req.body;
        
        if (!message) {
            return res.status(400).json({ error: 'Message is required' });
        }

        const response = await callGrok(message);
        
        res.json({
            agent: 'localworker',
            response: response,
            timestamp: new Date().toISOString()
        });
    } catch (error) {
        res.status(500).json({ 
            error: 'Failed to get response from LocalWorker Agent',
            details: error.message 
        });
    }
});

module.exports = router;