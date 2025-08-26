import express from 'express';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
// Adicionando CORS para permitir requisições de origem cruzada
import cors from 'cors';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
// Alteramos a porta padrão para 3001 para evitar conflitos
const PORT = process.env.PORT || 8080;

// Configurar CORS para permitir acesso de qualquer origem
app.use(cors());

// Servir arquivos estáticos da pasta public
app.use(express.static('public'));
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Redirecionar para a página inicial
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Rota para a landing page da Library of Alexandria
app.get('/library', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'library', 'index.html'));
});

// Importação da OpenAI - utilizar API key do ambiente
import OpenAI from 'openai';

// Inicializar cliente OpenAI com a chave do ambiente
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Rota de API para analisar contratos com OpenAI
app.post('/api/analyze-contract', async (req, res) => {
  try {
    console.log("Recebida solicitação de análise de contrato");
    const { 
      contractText, 
      concerns = [], 
      situationType = 'review',
      entityType = 'player',
      organizationName = '',
      situationDetails = ''
    } = req.body;
    
    if (!contractText || contractText.length < 10) {
      return res.status(400).json({ 
        error: 'É necessário fornecer o texto do contrato para análise' 
      });
    }

    // Durante a fase de testes, usamos uma resposta simulada
    console.log("Retornando análise simulada para testes");
    
    // Resposta simulada para testes - baseada em mock_analysis.json
    const analysisResult = {
      "riskLevel": "high",
      "overview": "Este contrato apresenta vários pontos de atenção que podem ser prejudiciais aos seus interesses. As cláusulas de exclusividade, multa rescisória e direitos de imagem são especialmente preocupantes por seu caráter desproporcional.",
      "clauses": [
        {
          "title": "Cláusula de Exclusividade (Item 4)",
          "explanation": "A exclusividade exigida é excessivamente ampla, abrangendo até mesmo criação de conteúdo não relacionado à modalidade. Isto limita significativamente suas oportunidades de renda alternativa e desenvolvimento profissional."
        },
        {
          "title": "Multa Rescisória (Item 6)",
          "explanation": "A multa de 6 meses de remuneração para o atleta versus apenas 2 meses para a organização representa um desequilíbrio contratual significativo. A jurisprudência recente tem limitado multas a no máximo 3 meses em casos semelhantes."
        },
        {
          "title": "Direitos de Imagem (Item 5)",
          "explanation": "A cessão irrevogável e por tempo indeterminado dos direitos de imagem, mesmo após o término do contrato, é potencialmente abusiva. A prática mais equilibrada é vincular os direitos de imagem ao período contratual ou prever remuneração adicional após seu término."
        }
      ],
      "actions": [
        {
          "title": "Renegociar a cláusula de exclusividade",
          "description": "Proponha limitar a exclusividade apenas à modalidade esportiva específica, permitindo atividades como criação de conteúdo pessoal não relacionado ao esport."
        },
        {
          "title": "Equilibrar a multa rescisória",
          "description": "Solicite que as multas rescisórias sejam igualadas para ambas as partes ou limitadas a 3 meses de remuneração para você."
        },
        {
          "title": "Definir limites temporais para direitos de imagem",
          "description": "Negocie para que os direitos de imagem sejam limitados ao período de vigência do contrato, ou preveja remuneração adicional para uso após o término."
        },
        {
          "title": "Buscar assessoria jurídica especializada",
          "description": "Antes de assinar, consulte um advogado com experiência em direito esportivo e entretenimento para revisar os termos finais."
        }
      ]
    };
    
    // Enviar resultado de teste
    res.json(analysisResult);
    
  } catch (error) {
    console.error("Erro ao processar análise de contrato:", error);
    res.status(500).json({ 
      error: 'Erro ao processar a análise do contrato',
      message: error.message 
    });
  }
});

// Funções auxiliares para gerar análises simuladas
function generateOverview(situation) {
  const overviews = {
    'signing': 'Identificamos pontos de atenção neste contrato que você deve revisar antes de assinar. Há cláusulas potencialmente desequilibradas que podem limitar seus direitos no futuro.',
    'leaving': 'Existem algumas barreiras contratuais para sua saída que devem ser negociadas. A multa rescisória e as cláusulas de exclusividade são os principais pontos de atenção.',
    'dispute': 'Sua posição na disputa atual possui pontos fortes e fracos. Recomendamos atenção especial às cláusulas destacadas antes de prosseguir com qualquer medida.',
    'default': 'Encontramos alguns pontos no contrato que requerem sua atenção. Recomendamos revisar as cláusulas destacadas e considerar negociá-las.'
  };
  
  return overviews[situation] || overviews.default;
}

function generateClauses(concerns = [], text = '') {
  const clauseTemplates = {
    'multa': {
      title: 'Cláusula de Multa Rescisória',
      explanation: 'A multa prevista corresponde a aproximadamente 6 meses de remuneração, o que pode ser considerado desproporcional. Há jurisprudência que limita multas a 3 meses de remuneração em contratos semelhantes.'
    },
    'exclusividade': {
      title: 'Cláusula de Exclusividade',
      explanation: 'O contrato prevê exclusividade total, incluindo plataformas e categorias não relacionadas à atividade principal. Isto limita excessivamente suas possibilidades de renda alternativa.'
    },
    'propriedade': {
      title: 'Direitos de Imagem e Propriedade Intelectual',
      explanation: 'A cláusula prevê cessão total e definitiva dos direitos de imagem, sem limitação temporal ou contextual. Recomendamos negociar uma cessão limitada ao período contratual.'
    },
    'prazo': {
      title: 'Prazo e Renovação Automática',
      explanation: 'O contrato prevê renovação automática por igual período, sem possibilidade de renegociação de valores ou termos. Isto pode ser considerado abusivo.'
    },
    'saida': {
      title: 'Condições para Rescisão',
      explanation: 'As condições para rescisão unilateral são desequilibradas. A organização pode rescindir por diversos motivos subjetivos, enquanto suas possibilidades são limitadas.'
    },
    'remuneracao': {
      title: 'Remuneração e Premiações',
      explanation: 'Os critérios para pagamento de bônus e premiações são vagos e excessivamente discricionários, o que pode gerar conflitos futuros.'
    },
    'confidencialidade': {
      title: 'Confidencialidade',
      explanation: 'A cláusula de confidencialidade é demasiadamente ampla e sem prazo definido, podendo limitar sua carreira após o término do contrato.'
    }
  };
  
  let clausesHtml = [];
  
  // Adicionar cláusulas com base nas preocupações selecionadas
  if (concerns && concerns.length) {
    concerns.forEach(concern => {
      if (clauseTemplates[concern]) {
        clausesHtml.push(clauseTemplates[concern]);
      }
    });
  }
  
  // Se não houver preocupações selecionadas ou texto, adicione algumas cláusulas genéricas
  if (clausesHtml.length === 0) {
    clausesHtml.push({
      title: 'Termos Gerais do Contrato',
      explanation: 'O contrato apresenta termos e condições gerais que poderiam ser mais claros e específicos para proteger ambas as partes.'
    });
  }
  
  // Se houver texto do contrato, faça uma "análise" simulada
  if (text && text.length > 50) {
    const keywords = {
      'multa': 'penalidade excessiva de rescisão',
      'exclusividade': 'cláusula de exclusividade ampla',
      'imagem': 'direitos de imagem cedidos sem limitação temporal',
      'confidencial': 'obrigações de confidencialidade vagas',
      'rescisão': 'termos de rescisão desequilibrados',
      'competição': 'restrições de não-competição muito amplas'
    };
    
    // Verificar se o texto contém alguma palavra-chave
    let foundKeywords = [];
    Object.keys(keywords).forEach(key => {
      if (text.toLowerCase().includes(key.toLowerCase())) {
        foundKeywords.push({
          key,
          value: keywords[key]
        });
      }
    });
    
    // Adicionar análise baseada nas palavras-chave encontradas
    if (foundKeywords.length > 0) {
      const keyword = foundKeywords[Math.floor(Math.random() * foundKeywords.length)];
      clausesHtml.push({
        title: `Cláusula com Ponto de Atenção - ${keyword.key.charAt(0).toUpperCase() + keyword.key.slice(1)}`,
        explanation: `Identificamos termos que sugerem ${keyword.value}. Esta cláusula pode gerar desequilíbrio contratual e merece revisão cuidadosa.`
      });
    } else {
      clausesHtml.push({
        title: 'Análise Textual',
        explanation: 'Com base no texto fornecido, identificamos terminologia jurídica que pode ser ambígua ou desfavorável. Recomendamos uma análise mais detalhada por um especialista.'
      });
    }
  }
  
  return clausesHtml;
}

function generateActions(situation, riskLevel) {
  const commonActions = [
    {
      title: 'Buscar orientação jurídica especializada',
      description: 'Recomendamos consultar um advogado especializado em direito esportivo ou entretenimento para analisar o contrato em detalhes.'
    },
    {
      title: 'Documentar todas as interações',
      description: 'Mantenha registros de todas as comunicações relacionadas à negociação ou execução do contrato.'
    }
  ];
  
  const situationActions = {
    'signing': [
      {
        title: 'Solicitar alterações contratuais',
        description: 'Elaboramos um documento com sugestões de alterações para cada cláusula problemática, que você pode apresentar na negociação.'
      },
      {
        title: 'Propor cláusulas de proteção',
        description: 'Sugerimos a inclusão de cláusulas que garantam maior equilíbrio, como critérios objetivos para bônus e condições de saída mais justas.'
      }
    ],
    'leaving': [
      {
        title: 'Enviar notificação formal',
        description: 'Preparamos um modelo de carta formal para comunicar sua intenção de encerramento contratual.'
      },
      {
        title: 'Propor acordo amigável',
        description: 'Sugerimos iniciar uma negociação para rescisão amigável, possivelmente com redução da multa rescisória.'
      }
    ],
    'dispute': [
      {
        title: 'Reunir evidências',
        description: 'Colete todas as provas de comunicações, promessas e acordos verbais que possam fortalecer sua posição.'
      },
      {
        title: 'Considerar mediação',
        description: 'Antes de partir para medidas judiciais, considere propor uma mediação com um terceiro neutro.'
      }
    ],
    'default': [
      {
        title: 'Revisar cláusulas críticas',
        description: 'Identifique os pontos mais sensíveis do contrato e avalie se atendem às suas expectativas.'
      }
    ]
  };
  
  let actions = [...commonActions];
  
  // Adicionar ações específicas para a situação
  if (situation && situationActions[situation]) {
    actions = [...actions, ...situationActions[situation]];
  } else if (situationActions.default) {
    actions = [...actions, ...situationActions.default];
  }
  
  // Adicionar ação com base no nível de risco
  if (riskLevel === 'high') {
    actions.unshift({
      title: 'ATENÇÃO: Risco Jurídico Elevado',
      description: 'Este contrato apresenta múltiplas cláusulas potencialmente abusivas. Recomendamos fortemente não assinar sem revisão jurídica profissional.'
    });
  }
  
  return actions;
}

// Rota para a página principal
app.get('*', (req, res) => {
  const requestedPath = path.join(__dirname, 'public', req.path);
  
  if (fs.existsSync(requestedPath) && fs.statSync(requestedPath).isFile()) {
    return res.sendFile(requestedPath);
  }
  
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Iniciar o servidor
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
  console.log(`Library of Alexandria disponível em http://localhost:${PORT}/library`);
});