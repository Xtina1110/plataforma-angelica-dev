import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const {
      cards,
      spreadType,
      spreadName,
      userQuestion,
      userId,
      userHistory
    } = req.body;

    // Construir contexto del usuario
    let userContext = '';
    if (userHistory && userHistory.length > 0) {
      userContext = `\n\nHistorial espiritual del usuario:\n${userHistory.slice(0, 3).map(h => 
        `- ${h.date}: ${h.summary}`
      ).join('\n')}`;
    }

    // System prompt especializado
    const systemPrompt = `Eres un intérprete angelical experto con profundo conocimiento de las cartas angelicales y su simbolismo divino. Tu misión es proporcionar interpretaciones significativas, profundas y transformadoras que ayuden a las personas en su camino espiritual.

CARACTERÍSTICAS DE TUS INTERPRETACIONES:
- Profundas pero accesibles
- Conectan con la situación personal del usuario
- Incluyen guía práctica y accionable
- Mantienen un tono cálido, compasivo y esperanzador
- Revelan patrones y sincronicidades
- Conectan las cartas entre sí de manera coherente
- Ofrecen perspectivas transformadoras

ESTRUCTURA DE TU RESPUESTA:
Debes generar un JSON con la siguiente estructura:
{
  "overview": "Visión general de la lectura (2-3 párrafos)",
  "cardInterpretations": [
    {
      "position": "Nombre de la posición",
      "card": "Nombre de la carta",
      "interpretation": "Interpretación profunda de la carta en esta posición (2-3 párrafos)",
      "angelicMessage": "Mensaje específico de los ángeles sobre esta carta (1 párrafo)",
      "guidance": "Guía práctica y accionable (1-2 párrafos)"
    }
  ],
  "synthesis": "Síntesis integradora de todas las cartas (3-4 párrafos)",
  "recommendations": [
    "Recomendación práctica 1",
    "Recomendación práctica 2",
    "Recomendación práctica 3"
  ],
  "nextSteps": [
    {
      "title": "Título del paso",
      "description": "Descripción breve",
      "type": "course|therapy|meditation|consultation"
    }
  ]
}

CONSIDERACIONES ESPECIALES POR TIPO DE TIRADA:

**Tirada de 3 Cartas (Pasado-Presente-Futuro):**
- Enfócate en la evolución temporal
- Conecta cómo el pasado influyó en el presente
- Muestra cómo el presente está creando el futuro
- Identifica patrones que se repiten o transforman

**Tirada de 6 Cartas (Cruz Angelical):**
- Analiza la situación desde múltiples ángulos
- Identifica el núcleo del desafío
- Revela recursos ocultos
- Proporciona consejo divino claro
- Muestra el resultado probable

**Tirada de 9 Cartas (Mandala Completo):**
- Ofrece una visión holística completa
- Integra cuerpo, mente, corazón y espíritu
- Muestra el viaje completo (pasado-presente-futuro)
- Identifica el desafío central y el regalo oculto
- Revela la esencia del alma del consultante

TONO Y ESTILO:
- Usa lenguaje poético pero claro
- Evita clichés espirituales vacíos
- Sé específico y personal
- Mantén esperanza y empoderamiento
- Reconoce desafíos pero enfócate en crecimiento
- Usa metáforas angelicales cuando sea apropiado`;

    // Construir el prompt del usuario
    const userPrompt = `Por favor, interpreta esta lectura angelical:

**Tipo de Tirada:** ${spreadName} (${spreadType} cartas)
${userQuestion ? `**Pregunta del Usuario:** "${userQuestion}"` : ''}

**Cartas Seleccionadas:**
${cards.map((card, idx) => `
${idx + 1}. **${card.position}**: ${card.name}
   Significado base: ${card.meaning}
`).join('\n')}
${userContext}

Proporciona una interpretación profunda, transformadora y personalizada en formato JSON según la estructura especificada.`;

    console.log('Generating interpretation with OpenAI...');

    const completion = await openai.chat.completions.create({
      model: 'gpt-4',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt }
      ],
      temperature: 0.8,
      max_tokens: 2500,
      response_format: { type: 'json_object' }
    });

    const interpretationText = completion.choices[0].message.content;
    const interpretation = JSON.parse(interpretationText);

    console.log('Interpretation generated successfully');

    // Enriquecer con próximos pasos basados en la plataforma
    interpretation.nextSteps = enrichNextSteps(interpretation, cards, spreadType);

    // Log para analytics
    if (userId) {
      console.log(`Interpretation generated for user ${userId}, spread: ${spreadType}`);
      // TODO: Guardar en base de datos para analytics
    }

    return res.status(200).json(interpretation);

  } catch (error) {
    console.error('Error generating interpretation:', error);
    
    // Fallback a interpretación básica
    return res.status(200).json(generateFallbackInterpretation(req.body));
  }
}

// Enriquecer próximos pasos con servicios de la plataforma
function enrichNextSteps(interpretation, cards, spreadType) {
  const steps = [];

  // Analizar el contenido para sugerir servicios relevantes
  const fullText = JSON.stringify(interpretation).toLowerCase();

  // Sugerir cursos
  if (fullText.includes('aprender') || fullText.includes('conocimiento') || fullText.includes('estudio')) {
    steps.push({
      title: 'Profundiza tu Conocimiento',
      description: 'Explora cursos angelicales para expandir tu sabiduría espiritual',
      type: 'course'
    });
  }

  // Sugerir terapias
  if (fullText.includes('sanar') || fullText.includes('liberar') || fullText.includes('limpiar')) {
    steps.push({
      title: 'Sanación Angelical',
      description: 'Una sesión de terapia angelical puede ayudarte a liberar bloqueos',
      type: 'therapy'
    });
  }

  // Sugerir meditación
  if (fullText.includes('calma') || fullText.includes('paz') || fullText.includes('meditar')) {
    steps.push({
      title: 'Meditación Guiada',
      description: 'Practica meditaciones angelicales para conectar con tu guía interior',
      type: 'meditation'
    });
  }

  // Sugerir consulta personal
  if (spreadType >= 6 || fullText.includes('profundizar') || fullText.includes('guía personalizada')) {
    steps.push({
      title: 'Consulta Personal',
      description: 'Agenda una sesión privada para explorar tu camino con mayor profundidad',
      type: 'consultation'
    });
  }

  // Siempre sugerir nueva lectura
  steps.push({
    title: 'Seguimiento Espiritual',
    description: 'Realiza lecturas periódicas para monitorear tu evolución espiritual',
    type: 'reading'
  });

  return steps.slice(0, 4); // Máximo 4 pasos
}

// Interpretación de fallback si falla la IA
function generateFallbackInterpretation({ cards, spreadType, spreadName, userQuestion }) {
  return {
    overview: `Los ángeles han seleccionado estas ${cards.length} cartas especialmente para ti. Cada una lleva un mensaje divino que iluminará tu camino espiritual. ${userQuestion ? `En respuesta a tu pregunta "${userQuestion}", ` : ''}las cartas revelan una guía profunda para tu crecimiento y transformación.`,
    
    cardInterpretations: cards.map((card, idx) => ({
      position: card.position,
      card: card.name,
      interpretation: `${card.meaning} Esta carta en la posición de ${card.position} indica que los ángeles te están guiando hacia una comprensión más profunda de este aspecto de tu vida. Es un momento para reflexionar y actuar con sabiduría divina.`,
      angelicMessage: `Los ángeles te recuerdan que ${card.position.toLowerCase()} es una parte esencial de tu viaje espiritual. Confía en la guía que recibes y permite que la luz angelical ilumine tu camino.`,
      guidance: `Para integrar este mensaje, toma tiempo cada día para meditar sobre el significado de ${card.name}. Observa cómo se manifiesta en tu vida diaria y mantén tu corazón abierto a la guía angelical.`
    })),
    
    synthesis: `Esta lectura de ${spreadName} revela un camino claro de crecimiento espiritual. Las cartas se conectan entre sí formando un mensaje coherente de transformación y evolución. Los ángeles te invitan a confiar en el proceso divino y a tomar acción inspirada en la guía recibida. Cada carta es un escalón en tu ascensión espiritual, y juntas forman un mapa hacia tu más alta expresión.`,
    
    recommendations: [
      'Medita diariamente sobre los mensajes recibidos en esta lectura',
      'Mantén un diario espiritual para registrar insights y sincronicidades',
      'Confía en tu intuición y en la guía angelical que recibes',
      'Toma acción inspirada basada en los mensajes de las cartas',
      'Mantén tu corazón abierto a las señales y mensajes del universo'
    ],
    
    nextSteps: [
      {
        title: 'Profundiza tu Práctica',
        description: 'Explora cursos y meditaciones para expandir tu conexión angelical',
        type: 'course'
      },
      {
        title: 'Consulta Personalizada',
        description: 'Agenda una sesión para explorar tu camino con mayor profundidad',
        type: 'consultation'
      },
      {
        title: 'Seguimiento Espiritual',
        description: 'Realiza lecturas periódicas para monitorear tu evolución',
        type: 'reading'
      }
    ]
  };
}

