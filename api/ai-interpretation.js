// AI Interpretation API Endpoint
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const { cards, question, style = 'traditional', language = 'es' } = req.body;

    const systemPrompt = getSystemPrompt(style, language);
    const userPrompt = buildUserPrompt(cards, question);

    const completion = await openai.chat.completions.create({
      model: 'gpt-4-turbo-preview',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt }
      ],
      temperature: 0.7,
      max_tokens: 1000
    });

    const interpretation = completion.choices[0].message.content;

    res.status(200).json({
      success: true,
      interpretation,
      confidence: calculateConfidence(interpretation),
      suggestions: generateSuggestions(cards, style)
    });
  } catch (error) {
    console.error('AI interpretation error:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
}

function getSystemPrompt(style, language) {
  const stylePrompts = {
    traditional: 'Eres un intérprete de cartas angélicas tradicional con décadas de experiencia.',
    modern: 'Eres un guía espiritual moderno que combina la sabiduría angélica con el pensamiento contemporáneo.',
    mystical: 'Eres un místico angélico que accede a dimensiones superiores de consciencia.',
    practical: 'Eres un consejero espiritual práctico que traduce los mensajes angélicos en acciones concretas.'
  };

  return `${stylePrompts[style]}

INSTRUCCIONES:
- Responde en ${language === 'es' ? 'español' : 'inglés'}
- Sé compasivo, sabio y esperanzador
- Conecta cada carta con la pregunta del consultante
- Ofrece guidance constructivo y empoderador
- Mantén un tono cálido y espiritual`;
}

function buildUserPrompt(cards, question) {
  const cardsDescription = cards.map((card, index) => 
    `Carta ${index + 1}: ${card.name} - ${card.description}`
  ).join('\n');

  return `CONSULTA ANGÉLICA:

Pregunta: "${question || 'Guidance general'}"

Cartas seleccionadas:
${cardsDescription}

Proporciona una interpretación completa y guidance angélico.`;
}

function calculateConfidence(interpretation) {
  const length = interpretation.length;
  const hasStructure = interpretation.includes('\n') || interpretation.includes('.');
  const hasPositiveWords = /amor|luz|bendición|guía|protección|esperanza/i.test(interpretation);
  
  let confidence = 0.5;
  if (length > 200) confidence += 0.2;
  if (hasStructure) confidence += 0.15;
  if (hasPositiveWords) confidence += 0.15;
  
  return Math.min(confidence, 1.0);
}

function generateSuggestions(cards, style) {
  return [
    'Medita con estas cartas durante 10 minutos',
    'Lleva un diario de los mensajes recibidos',
    'Pide guidance a tus ángeles antes de dormir'
  ];
}