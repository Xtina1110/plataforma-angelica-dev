// OpenAI Service for Angelic AI Interpretations
const OPENAI_API_KEY = import.meta.env.VITE_OPENAI_API_KEY;
const OPENAI_API_URL = 'https://api.openai.com/v1/chat/completions';

class OpenAIService {
  constructor() {
    this.apiKey = OPENAI_API_KEY;
    this.model = 'gpt-4-turbo-preview';
  }

  async generateInterpretation({ cards, question, style = 'traditional', language = 'es' }) {
    const systemPrompt = this.getSystemPrompt(style, language);
    const userPrompt = this.buildUserPrompt(cards, question);

    try {
      const response = await fetch(OPENAI_API_URL, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          model: this.model,
          messages: [
            { role: 'system', content: systemPrompt },
            { role: 'user', content: userPrompt }
          ],
          temperature: 0.7,
          max_tokens: 1000
        })
      });

      if (!response.ok) {
        throw new Error(`OpenAI API error: ${response.status}`);
      }

      const data = await response.json();
      return {
        interpretation: data.choices[0].message.content,
        confidence: this.calculateConfidence(data.choices[0].message.content),
        suggestions: this.generateSuggestions(cards, style)
      };
    } catch (error) {
      console.error('OpenAI Service error:', error);
      throw error;
    }
  }

  getSystemPrompt(style, language) {
    const stylePrompts = {
      traditional: 'Eres un intérprete de cartas angélicas tradicional con décadas de experiencia. Proporciona interpretaciones clásicas y profundas basadas en la sabiduría ancestral.',
      modern: 'Eres un guía espiritual moderno que combina la sabiduría angélica con el pensamiento contemporáneo. Ofrece interpretaciones relevantes para la vida actual.',
      mystical: 'Eres un místico angélico que accede a dimensiones superiores de consciencia. Proporciona interpretaciones profundamente espirituales y trascendentes.',
      practical: 'Eres un consejero espiritual práctico que traduce los mensajes angélicos en acciones concretas y consejos aplicables.'
    };

    const basePrompt = stylePrompts[style] || stylePrompts.traditional;
    
    return `${basePrompt}

INSTRUCCIONES:
- Responde en ${language === 'es' ? 'español' : 'inglés'}
- Sé compasivo, sabio y esperanzador
- Conecta cada carta con la pregunta del consultante
- Ofrece guidance constructivo y empoderador
- Mantén un tono cálido y espiritual
- Estructura la respuesta de forma clara y fluida
- Incluye mensajes de los ángeles cuando sea apropiado`;
  }

  buildUserPrompt(cards, question) {
    const cardsDescription = cards.map((card, index) => 
      `Carta ${index + 1}: ${card.name} - ${card.description}`
    ).join('\n');

    return `CONSULTA ANGÉLICA:

Pregunta del consultante: "${question || 'Guidance general'}"

Cartas seleccionadas:
${cardsDescription}

Por favor, proporciona una interpretación completa que conecte estas cartas con la pregunta formulada, ofreciendo guidance angélico claro y constructivo.`;
  }

  calculateConfidence(interpretation) {
    // Simple confidence calculation based on interpretation length and structure
    const length = interpretation.length;
    const hasStructure = interpretation.includes('\n') || interpretation.includes('.');
    const hasPositiveWords = /amor|luz|bendición|guía|protección|esperanza/i.test(interpretation);
    
    let confidence = 0.5;
    if (length > 200) confidence += 0.2;
    if (hasStructure) confidence += 0.15;
    if (hasPositiveWords) confidence += 0.15;
    
    return Math.min(confidence, 1.0);
  }

  generateSuggestions(cards, style) {
    const suggestions = [
      'Medita con estas cartas durante 10 minutos',
      'Lleva un diario de los mensajes recibidos',
      'Pide guidance a tus ángeles antes de dormir'
    ];

    if (style === 'practical') {
      suggestions.push('Crea un plan de acción basado en los mensajes');
    }
    
    if (style === 'mystical') {
      suggestions.push('Visualiza la conexión con los ángeles de las cartas');
    }

    return suggestions.slice(0, 3);
  }

  async generateAffirmation(interpretation) {
    try {
      const response = await fetch(OPENAI_API_URL, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          model: this.model,
          messages: [{
            role: 'user',
            content: `Basándote en esta interpretación angélica, crea una afirmación poderosa y positiva de máximo 50 palabras:\n\n${interpretation}`
          }],
          temperature: 0.6,
          max_tokens: 100
        })
      });

      const data = await response.json();
      return data.choices[0].message.content.trim();
    } catch (error) {
      console.error('Error generating affirmation:', error);
      return 'Soy merecedor(a) del amor y la guía divina de mis ángeles.';
    }
  }
}

export default new OpenAIService();