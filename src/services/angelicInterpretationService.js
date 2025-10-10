const OPENAI_API_KEY = import.meta.env.VITE_OPENAI_API_KEY;
const OPENAI_API_URL = 'https://api.openai.com/v1/chat/completions';

class AngelicInterpretationService {
  constructor() {
    this.apiKey = OPENAI_API_KEY;
    this.model = 'gpt-4-turbo-preview';
  }

  async generateCardInterpretation({ carta, posicion, tipoTirada, temaConsulta, todasLasCartas }) {
    if (!this.apiKey) {
      console.warn('OpenAI API key not configured, using default interpretation');
      return this.getDefaultInterpretation(carta);
    }

    const systemPrompt = this.getSystemPrompt();
    const userPrompt = this.buildUserPrompt({ carta, posicion, tipoTirada, temaConsulta, todasLasCartas });

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
          temperature: 0.8,
          max_tokens: 1500
        })
      });

      if (!response.ok) {
        console.error(`OpenAI API error: ${response.status}`);
        return this.getDefaultInterpretation(carta);
      }

      const data = await response.json();
      const interpretation = this.parseInterpretation(data.choices[0].message.content);

      return interpretation;
    } catch (error) {
      console.error('Error generating interpretation:', error);
      return this.getDefaultInterpretation(carta);
    }
  }

  getSystemPrompt() {
    return `Eres un Angelólogo experto con décadas de experiencia en la interpretación de Cartas Angelicales. Tu estilo es cálido, sabio, compasivo y profundamente espiritual. Tienes el don de transmitir mensajes divinos de manera clara y reconfortante.

ESTILO DE COMUNICACIÓN:
- Usa un lenguaje elevado pero accesible
- Sé específico y personal en cada interpretación
- Conecta profundamente con el tema de consulta
- Cada mensaje debe ser único y adaptado al contexto
- Mantén un tono SIEMPRE POSITIVO, ANGELICAL, lleno de AMOR DIVINO, ESPERANZA y PAZ
- Los mensajes deben desprender sentimientos de amor, paz, esperanza y conexión divina
- Incluye referencias a la guía angelical
- Usa metáforas espirituales que inspiren y eleven
- NUNCA uses lenguaje negativo, de miedo o pesimista
- Transforma cualquier desafío en oportunidad de crecimiento

ESTRUCTURA REQUERIDA:
Tu respuesta DEBE incluir exactamente estas secciones en formato JSON:

{
  "significado": "Interpretación profunda de la carta en el contexto de la posición y el tema. DEBE variar según el tema de la tirada. Tono positivo, esperanzador, desde el amor divino (150-200 palabras)",
  "mensajeAngelical": "Mensaje directo de los ángeles, como si ellos hablaran en primera persona plural. Lleno de amor, paz, esperanza y guía divina. DEBE ser específico para el tema consultado (100-150 palabras)",
  "afirmacionDivina": "Una afirmación poderosa en primera persona, positiva y empoderadora, adaptada al tema de consulta (20-40 palabras)",
  "guiaPractica": {
    "ritual": "Descripción detallada de un ritual específico relacionado con esta carta Y el tema de consulta. Debe incluir pasos claros y elementos simbólicos (60-100 palabras)",
    "invocacion": "Una invocación hermosa y poderosa para conectar con los ángeles de esta carta. Debe ser específica y adaptada al tema (40-60 palabras)",
    "accionConsciente": "Una acción práctica, concreta y realizable HOY que el consultante puede hacer. Debe estar directamente relacionada con el tema de consulta y la energía de la carta (40-60 palabras)"
  }
}

IMPORTANTE - REQUISITOS OBLIGATORIOS:
- TODAS las cartas DEBEN tener: significado, mensajeAngelical, afirmacionDivina y guiaPractica completa
- La guiaPractica DEBE tener SIEMPRE: ritual, invocacion y accionConsciente
- NO repitas frases genéricas - cada interpretación debe ser Única
- VARÍA el contenido significativamente en cada interpretación
- SÉ ESPECÍFICO sobre el tema de consulta (Amor, Trabajo, Salud, etc.)
- ADAPTA el mensaje al tema: si es Amor habla de relaciones, si es Trabajo de abundancia, etc.
- CONECTA profundamente con la posición de la carta en la tirada
- TONO SIEMPRE POSITIVO: amor divino, esperanza, paz, luz, conexión celestial
- NUNCA uses lenguaje negativo - transforma desafíos en oportunidades
- USA creatividad manteniendo coherencia espiritual y angelical
- Los mensajes deben hacer sentir AMADO, GUIADO, PROTEGIDO y ESPERANZADO`;
  }

  buildUserPrompt({ carta, posicion, tipoTirada, temaConsulta, todasLasCartas }) {
    const posicionInfo = posicion ? `\nPosición en la tirada: ${posicion.nombre} - ${posicion.significado}` : '';
    const contextoCartas = todasLasCartas && todasLasCartas.length > 1
      ? `\n\nContexto de la lectura completa:\nEstas son las ${todasLasCartas.length} cartas de la tirada: ${todasLasCartas.map(c => c.nombre).join(', ')}`
      : '';

    return `CARTA A INTERPRETAR:
Nombre: ${carta.nombre}
Ángel: ${carta.angel}
Chakra: ${carta.chakra}
Elemento: ${carta.elemento}
Color: ${carta.color}
Cristal: ${carta.cristal}
Significado base: ${carta.significado}
Mensaje base: ${carta.mensaje}
Afirmación base: ${carta.afirmacion}
${posicionInfo}

CONTEXTO DE LA CONSULTA:
Tipo de tirada: ${tipoTirada.nombre} (${tipoTirada.descripcion})
Tema de consulta: ${temaConsulta.nombre} - ${temaConsulta.descripcion}
${contextoCartas}

Por favor, genera una interpretación ÚNICA y PERSONALIZADA en formato JSON estricto que:

1. **SIGNIFICADO**: Interpreta cómo esta carta se aplica específicamente al tema "${temaConsulta.nombre}". Si es Amor, habla de relaciones; si es Trabajo, de abundancia; si es Salud, de bienestar. VARÍA el contenido según el tema.

2. **MENSAJE ANGELICAL**: Los ángeles hablan directamente al consultante sobre su situación en "${temaConsulta.nombre}". Usa primera persona plural ("nosotros"). Lleno de amor, paz, esperanza y guía divina.

3. **AFIRMACIÓN DIVINA**: Una afirmación poderosa y positiva específica para el tema "${temaConsulta.nombre}". En primera persona ("Yo...").

4. **GUÍA PRÁCTICA** (OBLIGATORIA - TODAS las secciones):
   - **RITUAL**: Un ritual detallado y específico que conecte con ${carta.elemento}, ${carta.color} y ${carta.cristal}. Adaptado al tema "${temaConsulta.nombre}".
   - **INVOCACIÓN**: Una invocación hermosa para los ángeles de "${carta.nombre}" específica para el tema "${temaConsulta.nombre}".
   - **ACCIÓN CONSCIENTE**: Una acción práctica HOY relacionada con "${temaConsulta.nombre}" y la energía de esta carta.

5. **CONSIDERACIONES**:
   - Posición: "${posicion?.nombre || 'carta única'}" - ${posicion?.significado || ''}
   - Simbolismo: ${carta.elemento}, ${carta.color}, ${carta.cristal}
   - Cada interpretación debe ser DIFERENTE y ÚNICA
   - Tono SIEMPRE positivo, angelical, esperanzador
   - Mensajes desde el AMOR DIVINO

RECUERDA:
- La respuesta debe ser SOLO el objeto JSON, sin texto adicional.
- TODAS las secciones son OBLIGATORIAS.
- Adapta TODO el contenido al tema "${temaConsulta.nombre}".`;
  }

  parseInterpretation(content) {
    try {
      const jsonMatch = content.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        return JSON.parse(jsonMatch[0]);
      }
      throw new Error('No JSON found in response');
    } catch (error) {
      console.error('Error parsing interpretation:', error);
      return null;
    }
  }

  getDefaultInterpretation(carta) {
    // Extraer guía práctica de la carta base con todos los formatos posibles
    let guiaPractica = {
      ritual: "Enciende una vela y medita con esta carta durante 10 minutos.",
      invocacion: `Invoco la presencia divina de ${carta.angel || carta.nombre} para iluminar mi camino.`,
      accionConsciente: "Lleva contigo el cristal " + carta.cristal + " hoy para conectar con esta energía."
    };

    if (carta.guiaPractica) {
      guiaPractica = {
        ritual: carta.guiaPractica.ritual ||
                carta.guiaPractica.ritualEspejo ||
                guiaPractica.ritual,
        invocacion: carta.guiaPractica.invocacion ||
                    guiaPractica.invocacion,
        accionConsciente: carta.guiaPractica.accionConsciente ||
                          carta.guiaPractica.accionConfianza ||
                          carta.guiaPractica.accionMerecimiento ||
                          carta.guiaPractica.accionInspirada ||
                          carta.guiaPractica.accionSerenidad ||
                          carta.guiaPractica.accionUnion ||
                          guiaPractica.accionConsciente
      };
    }

    return {
      significado: carta.significado,
      mensajeAngelical: carta.mensaje,
      afirmacionDivina: carta.afirmacion,
      guiaPractica: guiaPractica
    };
  }

  async generateBatchInterpretations({ cartas, tipoTirada, temaConsulta }) {
    const interpretaciones = [];

    for (let i = 0; i < cartas.length; i++) {
      const carta = cartas[i];
      const interpretacion = await this.generateCardInterpretation({
        carta,
        posicion: carta.posicion,
        tipoTirada,
        temaConsulta,
        todasLasCartas: cartas
      });

      interpretaciones.push(interpretacion);

      if (i < cartas.length - 1) {
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
    }

    return interpretaciones;
  }
}

export default new AngelicInterpretationService();
