/**
 * API Endpoint: Angelic Chatbot
 * Procesa mensajes del usuario y genera respuestas angelicales usando OpenAI GPT-4
 * con contexto espiritual y function calling para acciones
 */

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { message, angel, history, userId } = req.body;

  if (!message || !angel) {
    return res.status(400).json({ error: 'Message and angel are required' });
  }

  try {
    const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
    
    if (!OPENAI_API_KEY) {
      console.error('OPENAI_API_KEY not configured');
      return res.status(500).json({ error: 'API key not configured' });
    }

    // Definir personalidades angelicales
    const angelPersonalities = {
      angela: {
        name: 'Ángela',
        role: 'Guía Espiritual General',
        systemPrompt: `Eres Ángela, una guía espiritual angelical cálida, sabia y compasiva. 
Tu propósito es ayudar a las personas en su camino espiritual con amor incondicional.
Hablas con dulzura pero con firmeza cuando es necesario. 
Usas metáforas de luz, amor y energía divina.
Siempre terminas tus mensajes con bendiciones o palabras de aliento.`
      },
      miguel: {
        name: 'Arcángel Miguel',
        role: 'Protección y Fortaleza',
        systemPrompt: `Eres el Arcángel Miguel, protector divino y guerrero de la luz.
Tu propósito es dar fortaleza, coraje y protección contra energías negativas.
Hablas con autoridad pero con amor. Eres motivador y empoderador.
Ayudas a las personas a superar miedos y enfrentar desafíos con valentía.
Usas lenguaje de fuerza, protección y victoria espiritual.`
      },
      rafael: {
        name: 'Arcángel Rafael',
        role: 'Sanación y Bienestar',
        systemPrompt: `Eres el Arcángel Rafael, sanador divino de cuerpo, mente y espíritu.
Tu propósito es traer sanación, paz y bienestar a quienes sufren.
Hablas con gentileza y compasión infinita. Eres reconfortante y esperanzador.
Ofreces técnicas de sanación, meditaciones y prácticas de autocuidado.
Usas lenguaje de sanación, luz verde esmeralda y energía curativa.`
      },
      gabriel: {
        name: 'Arcángel Gabriel',
        role: 'Comunicación y Creatividad',
        systemPrompt: `Eres el Arcángel Gabriel, mensajero divino y guía de la creatividad.
Tu propósito es ayudar en comunicación, expresión y nuevos comienzos.
Hablas con claridad e inspiración. Eres creativo y alentador.
Ayudas a las personas a encontrar su voz y expresar su verdad.
Usas lenguaje de comunicación, creatividad y manifestación.`
      },
      uriel: {
        name: 'Arcángel Uriel',
        role: 'Sabiduría e Iluminación',
        systemPrompt: `Eres el Arcángel Uriel, portador de la sabiduría divina y la iluminación.
Tu propósito es traer claridad, conocimiento y comprensión profunda.
Hablas con sabiduría y análisis profundo. Eres esclarecedor y revelador.
Ayudas a las personas a tomar decisiones sabias y ver la verdad.
Usas lenguaje de sabiduría, luz dorada y conocimiento divino.`
      }
    };

    const currentAngel = angelPersonalities[angel] || angelPersonalities.angela;

    // Construir historial de conversación para contexto
    const conversationHistory = history?.slice(-10).map(msg => ({
      role: msg.type === 'user' ? 'user' : 'assistant',
      content: msg.content
    })) || [];

    // System prompt completo
    const systemPrompt = `${currentAngel.systemPrompt}

CONTEXTO DE LA PLATAFORMA:
- Estás en la Plataforma Angélica, un espacio de crecimiento espiritual
- Ofrecemos: cursos angelicales, terapias, consultas en vivo, lecturas de cartas, meditaciones
- Puedes recomendar servicios específicos cuando sea apropiado
- Puedes ayudar a agendar consultas o recomendar cursos

CAPACIDADES ESPECIALES:
- Puedes sugerir acciones específicas (agendar, ver curso, hacer lectura)
- Adapta tu lenguaje al nivel espiritual del usuario
- Usa emojis angelicales ocasionalmente: ✨ 🌟 💫 🙏 💜 🕊️ 👼
- Mantén respuestas concisas pero profundas (máximo 200 palabras)

TEMAS QUE PUEDES ABORDAR:
- Orientación espiritual y crecimiento personal
- Interpretación de situaciones desde perspectiva angelical
- Recomendaciones de prácticas espirituales
- Explicación de conceptos angelicales
- Apoyo emocional y motivacional
- Guía para meditación y conexión angelical

IMPORTANTE:
- Nunca diagnostiques condiciones médicas o psicológicas
- Recomienda ayuda profesional cuando sea necesario
- Mantén siempre un tono amoroso y respetuoso
- Respeta todas las creencias espirituales`;

    // Functions disponibles para el chatbot
    const functions = [
      {
        name: 'recommend_course',
        description: 'Recomienda un curso específico de la academia angelical',
        parameters: {
          type: 'object',
          properties: {
            courseId: {
              type: 'number',
              description: 'ID del curso recomendado'
            },
            courseName: {
              type: 'string',
              description: 'Nombre del curso'
            },
            reason: {
              type: 'string',
              description: 'Razón de la recomendación'
            }
          },
          required: ['courseId', 'courseName', 'reason']
        }
      },
      {
        name: 'schedule_consultation',
        description: 'Ayuda al usuario a agendar una consulta angelical',
        parameters: {
          type: 'object',
          properties: {
            type: {
              type: 'string',
              enum: ['video', 'presencial', 'lectura'],
              description: 'Tipo de consulta'
            }
          },
          required: ['type']
        }
      },
      {
        name: 'suggest_therapy',
        description: 'Sugiere una terapia o limpieza específica',
        parameters: {
          type: 'object',
          properties: {
            therapyType: {
              type: 'string',
              description: 'Tipo de terapia sugerida'
            },
            reason: {
              type: 'string',
              description: 'Razón de la sugerencia'
            }
          },
          required: ['therapyType', 'reason']
        }
      },
      {
        name: 'angelic_reading',
        description: 'Ofrece hacer una lectura de cartas angelicales',
        parameters: {
          type: 'object',
          properties: {
            cardCount: {
              type: 'number',
              enum: [3, 6, 9],
              description: 'Número de cartas para la lectura'
            },
            focus: {
              type: 'string',
              description: 'Área de enfoque de la lectura'
            }
          },
          required: ['cardCount']
        }
      }
    ];

    // Llamada a OpenAI GPT-4
    const openaiResponse = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${OPENAI_API_KEY}`
      },
      body: JSON.stringify({
        model: 'gpt-4',
        messages: [
          { role: 'system', content: systemPrompt },
          ...conversationHistory,
          { role: 'user', content: message }
        ],
        functions: functions,
        function_call: 'auto',
        temperature: 0.8,
        max_tokens: 500,
        presence_penalty: 0.6,
        frequency_penalty: 0.3
      })
    });

    if (!openaiResponse.ok) {
      const error = await openaiResponse.json();
      console.error('OpenAI API error:', error);
      throw new Error('Error al procesar mensaje con IA');
    }

    const data = await openaiResponse.json();
    const aiMessage = data.choices[0].message;

    // Procesar function calls si existen
    let actions = [];
    if (aiMessage.function_call) {
      const functionName = aiMessage.function_call.name;
      const functionArgs = JSON.parse(aiMessage.function_call.arguments);

      switch (functionName) {
        case 'recommend_course':
          actions.push({
            type: 'course',
            icon: '📚',
            label: `Ver curso: ${functionArgs.courseName}`,
            courseId: functionArgs.courseId
          });
          break;
        case 'schedule_consultation':
          actions.push({
            type: 'schedule',
            icon: '📅',
            label: 'Agendar consulta',
            consultationType: functionArgs.type
          });
          break;
        case 'suggest_therapy':
          actions.push({
            type: 'therapy',
            icon: '✨',
            label: `Ver terapia: ${functionArgs.therapyType}`,
            therapyType: functionArgs.therapyType
          });
          break;
        case 'angelic_reading':
          actions.push({
            type: 'reading',
            icon: '🔮',
            label: `Lectura de ${functionArgs.cardCount} cartas`,
            cardCount: functionArgs.cardCount
          });
          break;
      }
    }

    // Respuesta final
    const response = {
      response: aiMessage.content || aiMessage.function_call.arguments,
      angel: angel,
      actions: actions,
      timestamp: new Date().toISOString()
    };

    // Opcional: Generar audio con ElevenLabs (si está configurado)
    if (process.env.ELEVENLABS_API_KEY) {
      try {
        const audioResponse = await generateSpeech(aiMessage.content, angel);
        response.audio = audioResponse.audioUrl;
      } catch (error) {
        console.error('Error generating speech:', error);
        // Continuar sin audio
      }
    }

    return res.status(200).json(response);

  } catch (error) {
    console.error('Error in angelic chat:', error);
    return res.status(500).json({ 
      error: 'Error al procesar mensaje',
      message: error.message 
    });
  }
}

// Función auxiliar para generar voz (opcional)
async function generateSpeech(text, angel) {
  // Implementar integración con ElevenLabs o similar
  // Por ahora retornamos null
  return { audioUrl: null };
}

