import OpenAI from 'openai';

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: import.meta.env.VITE_OPENAI_API_KEY,
  dangerouslyAllowBrowser: true // Solo para desarrollo, en producción usar backend
});

/**
 * Servicio de Interpretación con IA para Apertura Angelical
 * Genera interpretaciones profundas y personalizadas usando GPT-4
 */

/**
 * Genera la interpretación de una carta individual
 */
export async function generateCardInterpretation({
  carta,
  posicion,
  tema,
  contextoUsuario = {},
  otrasCartas = []
}) {
  const prompt = `Eres un angelólogo maestro con 30 años de experiencia en lectura de cartas angelicales.

**Carta Revelada:**
- Nombre: ${carta.nombre}
- Arcángel: ${carta.arcangel}
- Significado General: ${carta.significadoGeneral}
- Elemento: ${carta.elemento || 'No especificado'}
- Chakra: ${carta.chakra || 'No especificado'}

**Posición en la Tirada:**
- Posición: ${posicion.numero} - ${posicion.nombre}
- Significado de la Posición: ${posicion.significado}

**Contexto de la Consulta:**
- Tema: ${tema.nombre}
${contextoUsuario.nivelEspiritual ? `- Nivel Espiritual del Usuario: ${contextoUsuario.nivelEspiritual}` : ''}
${contextoUsuario.emocionReciente ? `- Emoción Reciente: ${contextoUsuario.emocionReciente}` : ''}

${otrasCartas.length > 0 ? `**Otras Cartas en la Tirada:**
${otrasCartas.map(c => `- ${c.nombre} en ${c.posicion}`).join('\n')}` : ''}

${contextoUsuario.tiradasAnteriores && contextoUsuario.tiradasAnteriores.length > 0 ? `**Tiradas Anteriores del Usuario:**
${contextoUsuario.tiradasAnteriores.slice(0, 3).join('\n')}` : ''}

**Instrucciones:**
1. Interpreta esta carta específicamente en el contexto de su posición y el tema de consulta
2. Ten en cuenta el nivel espiritual del usuario (usa lenguaje apropiado)
3. Conecta con la emoción reciente del usuario si es relevante
4. Si hay patrones con tiradas anteriores, menciónalo brevemente
5. Proporciona una interpretación profunda, compasiva y transformadora
6. Incluye un mensaje específico del arcángel en primera persona
7. Da un consejo práctico y accionable que el usuario pueda aplicar hoy
8. Mantén un tono cálido, esperanzador y empoderador

**Responde ÚNICAMENTE con un objeto JSON válido en este formato exacto:**
{
  "interpretacion": "Texto profundo de 150-200 palabras",
  "mensajeDelArcangel": "Mensaje en primera persona del arcángel (50-80 palabras)",
  "consejoAccionable": "Consejo específico que el usuario puede aplicar hoy",
  "palabrasClave": ["palabra1", "palabra2", "palabra3"],
  "nivelDeUrgencia": "bajo|medio|alto",
  "conexionConOtrasCartas": "Cómo se relaciona con las otras cartas (si aplica, o vacío si no hay otras cartas)"
}`;

  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4-turbo",
      messages: [
        {
          role: "system",
          content: "Eres un angelólogo compasivo, sabio y transformador. Tus interpretaciones son profundas pero accesibles, espirituales pero prácticas. Siempre respondes con JSON válido."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      temperature: 0.8,
      max_tokens: 1000,
      response_format: { type: "json_object" }
    });

    const content = response.choices[0].message.content;
    return JSON.parse(content);
  } catch (error) {
    console.error('Error al generar interpretación:', error);
    
    // Fallback: interpretación básica si falla la IA
    return {
      interpretacion: `${carta.nombre} aparece en tu ${posicion.nombre.toLowerCase()} para ${carta.significadoGeneral.toLowerCase()}. Esta carta te invita a reflexionar sobre ${tema.nombre.toLowerCase()} desde una perspectiva de ${carta.arcangel}.`,
      mensajeDelArcangel: `Soy el Arcángel ${carta.arcangel} y te acompaño en este momento. Confía en el proceso divino y mantén tu corazón abierto a la guía angelical.`,
      consejoAccionable: `Dedica 10 minutos hoy a meditar sobre el mensaje de ${carta.nombre} y cómo se relaciona con ${tema.nombre.toLowerCase()}.`,
      palabrasClave: [carta.arcangel, tema.nombre, posicion.nombre],
      nivelDeUrgencia: "medio",
      conexionConOtrasCartas: ""
    };
  }
}

/**
 * Genera el resumen ejecutivo de toda la tirada
 */
export async function generateReadingSummary({
  cartasConInterpretaciones,
  tema,
  tipoTirada,
  contextoUsuario = {}
}) {
  const cartasTexto = cartasConInterpretaciones.map((c, index) => `
**Carta ${index + 1}: ${c.posicion} - ${c.carta.nombre}**
- Interpretación: ${c.interpretacion.interpretacion}
- Mensaje del Arcángel: ${c.interpretacion.mensajeDelArcangel}
- Palabras Clave: ${c.interpretacion.palabrasClave.join(', ')}
`).join('\n');

  const prompt = `Basándote en todas las cartas reveladas y sus interpretaciones individuales, genera un resumen ejecutivo de la tirada completa.

**Tipo de Tirada:** ${tipoTirada} (${cartasConInterpretaciones.length} cartas)
**Tema de Consulta:** ${tema.nombre}

**Cartas Reveladas:**
${cartasTexto}

**Instrucciones:**
1. Identifica el mensaje central de la tirada (el hilo conductor que conecta todas las cartas)
2. Explica cómo las cartas se conectan entre sí para contar una historia coherente
3. Proporciona una visión general del pasado → presente → futuro (si aplica según el tipo de tirada)
4. Da una conclusión transformadora y esperanzadora
5. Incluye 3-5 próximos pasos espirituales concretos y accionables
6. Crea una afirmación personalizada que el usuario pueda repetir diariamente

**Responde ÚNICAMENTE con un objeto JSON válido en este formato exacto:**
{
  "mensajeCentral": "Una frase que resume toda la tirada (máximo 100 caracteres)",
  "historiaCompleta": "Narrativa de 200-300 palabras que conecta todas las cartas",
  "visionGeneral": {
    "pasado": "Resumen del pasado (si aplica)",
    "presente": "Resumen del presente",
    "futuro": "Resumen del futuro (si aplica)"
  },
  "conclusion": "Mensaje final transformador (100-150 palabras)",
  "proximosPasos": [
    "Paso 1 específico y accionable",
    "Paso 2 específico y accionable",
    "Paso 3 específico y accionable"
  ],
  "afirmacionPersonalizada": "Afirmación poderosa en presente para que el usuario repita diariamente"
}`;

  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4-turbo",
      messages: [
        {
          role: "system",
          content: "Eres un angelólogo maestro que sintetiza mensajes angelicales en narrativas transformadoras. Siempre respondes con JSON válido."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      temperature: 0.8,
      max_tokens: 1200,
      response_format: { type: "json_object" }
    });

    const content = response.choices[0].message.content;
    return JSON.parse(content);
  } catch (error) {
    console.error('Error al generar resumen:', error);
    
    // Fallback
    return {
      mensajeCentral: `Los ángeles te guían en ${tema.nombre.toLowerCase()}`,
      historiaCompleta: `Tu tirada de ${cartasConInterpretaciones.length} cartas revela un mensaje importante sobre ${tema.nombre.toLowerCase()}. Los arcángeles ${cartasConInterpretaciones.map(c => c.carta.arcangel).join(', ')} se han manifestado para guiarte en este momento de tu vida. Cada carta aporta una pieza del rompecabezas divino que te ayudará a comprender mejor tu situación actual y el camino que se abre ante ti.`,
      visionGeneral: {
        pasado: cartasConInterpretaciones.length >= 3 ? "Experiencias que te han traído aquí" : "",
        presente: "Tu situación actual y los desafíos que enfrentas",
        futuro: cartasConInterpretaciones.length >= 3 ? "El camino que se abre ante ti" : ""
      },
      conclusion: `Los ángeles te aseguran que estás exactamente donde necesitas estar. Confía en el proceso divino y en el timing angelical. Cada experiencia, cada desafío, cada bendición tiene un propósito en tu camino espiritual.`,
      proximosPasos: [
        `Medita diariamente sobre el mensaje de ${cartasConInterpretaciones[0].carta.nombre}`,
        `Practica la gratitud por las bendiciones relacionadas con ${tema.nombre.toLowerCase()}`,
        `Mantén un diario espiritual para registrar tus insights y sincronicidades`
      ],
      afirmacionPersonalizada: `Confío en la guía angelical y sigo mi camino con amor y sabiduría.`
    };
  }
}

/**
 * Analiza patrones en el historial de tiradas del usuario
 */
export async function analyzeReadingPatterns(historialTiradas) {
  if (!historialTiradas || historialTiradas.length < 3) {
    return null; // Necesitamos al menos 3 tiradas para análisis
  }

  // Análisis de arcángeles recurrentes
  const arcangelesCount = {};
  historialTiradas.forEach(tirada => {
    tirada.cartas.forEach(carta => {
      arcangelesCount[carta.arcangel] = (arcangelesCount[carta.arcangel] || 0) + 1;
    });
  });

  const arcangelMasRecurrente = Object.entries(arcangelesCount)
    .sort((a, b) => b[1] - a[1])[0];

  // Análisis de temas dominantes
  const temasCount = {};
  historialTiradas.forEach(tirada => {
    temasCount[tirada.tema] = (temasCount[tirada.tema] || 0) + 1;
  });

  const temaMasFrecuente = Object.entries(temasCount)
    .sort((a, b) => b[1] - a[1])[0];

  const prompt = `Analiza los patrones en el historial de tiradas de cartas angelicales de un usuario.

**Datos del Análisis:**
- Total de tiradas: ${historialTiradas.length}
- Arcángel más recurrente: ${arcangelMasRecurrente[0]} (apareció ${arcangelMasRecurrente[1]} veces)
- Tema más consultado: ${temaMasFrecuente[0]} (${temaMasFrecuente[1]} veces)
- Período: ${historialTiradas.length > 0 ? 'Últimos ' + Math.ceil((new Date() - new Date(historialTiradas[0].fecha)) / (1000 * 60 * 60 * 24)) + ' días' : 'N/A'}

**Instrucciones:**
1. Interpreta qué significa que este arcángel aparezca tan frecuentemente
2. Analiza qué indica la frecuencia de consulta sobre este tema
3. Identifica el mensaje principal que los ángeles están tratando de transmitir
4. Proporciona recomendaciones para el próximo mes

**Responde ÚNICAMENTE con un objeto JSON válido:**
{
  "insightArcangelRecurrente": "Qué significa que este arcángel aparezca frecuentemente (100 palabras)",
  "insightTemaDominante": "Qué indica la frecuencia de este tema (100 palabras)",
  "mensajePrincipal": "El mensaje central de los ángeles basado en los patrones (150 palabras)",
  "recomendacionesProximoMes": [
    "Recomendación 1",
    "Recomendación 2",
    "Recomendación 3"
  ]
}`;

  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4-turbo",
      messages: [
        {
          role: "system",
          content: "Eres un angelólogo experto en análisis de patrones espirituales. Siempre respondes con JSON válido."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      temperature: 0.7,
      max_tokens: 800,
      response_format: { type: "json_object" }
    });

    const content = response.choices[0].message.content;
    const analysis = JSON.parse(content);

    return {
      ...analysis,
      arcangelMasRecurrente: arcangelMasRecurrente[0],
      frecuenciaArcangel: arcangelMasRecurrente[1],
      temaMasFrecuente: temaMasFrecuente[0],
      frecuenciaTema: temaMasFrecuente[1],
      totalTiradas: historialTiradas.length
    };
  } catch (error) {
    console.error('Error al analizar patrones:', error);
    return null;
  }
}

