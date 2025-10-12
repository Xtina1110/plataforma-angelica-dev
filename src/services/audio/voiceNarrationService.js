/**
 * Servicio de Narración con Voz Angelical (ElevenLabs)
 * 
 * Este servicio genera audio narrado de las interpretaciones de cartas
 * usando voces personalizadas por arcángel
 */

// Mapeo de arcángeles a voces de ElevenLabs
const ARCHANGEL_VOICES = {
  'Miguel': {
    voiceId: 'pNInz6obpgDQGcFmaJgB', // Adam - Voz masculina profunda
    stability: 0.5,
    similarityBoost: 0.75,
    style: 0.3,
    useSpeakerBoost: true
  },
  'Rafael': {
    voiceId: 'EXAVITQu4vr4xnSDxMaL', // Bella - Voz femenina cálida
    stability: 0.6,
    similarityBoost: 0.8,
    style: 0.4,
    useSpeakerBoost: true
  },
  'Gabriel': {
    voiceId: 'ErXwobaYiN019PkySvjV', // Antoni - Voz clara y articulada
    stability: 0.7,
    similarityBoost: 0.75,
    style: 0.2,
    useSpeakerBoost: true
  },
  'Uriel': {
    voiceId: 'VR6AewLTigWG4xSOukaG', // Arnold - Voz sabia y profunda
    stability: 0.6,
    similarityBoost: 0.8,
    style: 0.5,
    useSpeakerBoost: true
  },
  'Chamuel': {
    voiceId: 'jsCqWAovK2LkecY7zXl4', // Freya - Voz femenina suave
    stability: 0.7,
    similarityBoost: 0.85,
    style: 0.6,
    useSpeakerBoost: true
  },
  'Jophiel': {
    voiceId: 'jBpfuIE2acCO8z3wKNLl', // Gigi - Voz alegre y luminosa
    stability: 0.6,
    similarityBoost: 0.75,
    style: 0.7,
    useSpeakerBoost: true
  },
  'Zadkiel': {
    voiceId: 'TX3LPaxmHKxFdv7VOQHJ', // Liam - Voz transformadora
    stability: 0.5,
    similarityBoost: 0.8,
    style: 0.5,
    useSpeakerBoost: true
  }
};

/**
 * Genera audio narrado de un texto usando ElevenLabs
 */
export async function generateVoiceNarration(text, arcangel = 'Uriel') {
  const apiKey = import.meta.env.VITE_ELEVENLABS_API_KEY;
  
  if (!apiKey) {
    console.warn('ElevenLabs API key not configured');
    return null;
  }

  const voiceConfig = ARCHANGEL_VOICES[arcangel] || ARCHANGEL_VOICES['Uriel'];
  
  try {
    const response = await fetch(
      `https://api.elevenlabs.io/v1/text-to-speech/${voiceConfig.voiceId}`,
      {
        method: 'POST',
        headers: {
          'Accept': 'audio/mpeg',
          'Content-Type': 'application/json',
          'xi-api-key': apiKey
        },
        body: JSON.stringify({
          text: text,
          model_id: 'eleven_multilingual_v2',
          voice_settings: {
            stability: voiceConfig.stability,
            similarity_boost: voiceConfig.similarityBoost,
            style: voiceConfig.style,
            use_speaker_boost: voiceConfig.useSpeakerBoost
          }
        })
      }
    );

    if (!response.ok) {
      throw new Error(`ElevenLabs API error: ${response.statusText}`);
    }

    const audioBlob = await response.blob();
    const audioUrl = URL.createObjectURL(audioBlob);
    
    return audioUrl;
  } catch (error) {
    console.error('Error generating voice narration:', error);
    return null;
  }
}

/**
 * Genera narración completa de una tirada
 */
export async function generateReadingNarration(interpretaciones, resumen, arcangeles) {
  const narrations = [];

  try {
    // 1. Introducción
    const intro = `Bienvenido a tu lectura angelical. Los ángeles han seleccionado ${interpretaciones.length} cartas para ti. Escucha con el corazón abierto.`;
    const introAudio = await generateVoiceNarration(intro, 'Gabriel');
    if (introAudio) {
      narrations.push({
        type: 'intro',
        audio: introAudio,
        duration: 8000 // Estimado
      });
    }

    // 2. Narración de cada carta
    for (let i = 0; i < interpretaciones.length; i++) {
      const interp = interpretaciones[i];
      const arcangel = arcangeles[i] || 'Uriel';
      
      const cardText = `
        Carta ${i + 1}: ${interp.nombreCarta}.
        ${interp.interpretacion}
        ${interp.mensajeArcangel}
        ${interp.consejoAccionable}
      `;

      const cardAudio = await generateVoiceNarration(cardText, arcangel);
      if (cardAudio) {
        narrations.push({
          type: 'card',
          cardIndex: i,
          arcangel: arcangel,
          audio: cardAudio,
          duration: cardText.length * 50 // Estimado: 50ms por carácter
        });
      }

      // Pausa entre cartas
      narrations.push({
        type: 'pause',
        duration: 2000
      });
    }

    // 3. Resumen final
    if (resumen) {
      const summaryText = `
        ${resumen.mensajeCentral}
        ${resumen.conclusion}
      `;

      const summaryAudio = await generateVoiceNarration(summaryText, 'Uriel');
      if (summaryAudio) {
        narrations.push({
          type: 'summary',
          audio: summaryAudio,
          duration: summaryText.length * 50
        });
      }
    }

    // 4. Cierre
    const outro = `Que la luz angelical te acompañe en tu camino. Así sea.`;
    const outroAudio = await generateVoiceNarration(outro, 'Gabriel');
    if (outroAudio) {
      narrations.push({
        type: 'outro',
        audio: outroAudio,
        duration: 5000
      });
    }

    return narrations;
  } catch (error) {
    console.error('Error generating reading narration:', error);
    return [];
  }
}

/**
 * Reproduce una secuencia de narraciones
 */
export class NarrationPlayer {
  constructor(narrations) {
    this.narrations = narrations;
    this.currentIndex = 0;
    this.currentAudio = null;
    this.isPaused = false;
    this.callbacks = {
      onStart: null,
      onCardStart: null,
      onCardEnd: null,
      onComplete: null
    };
  }

  on(event, callback) {
    this.callbacks[event] = callback;
  }

  async play() {
    if (this.isPaused) {
      this.resume();
      return;
    }

    if (this.callbacks.onStart) {
      this.callbacks.onStart();
    }

    await this.playNext();
  }

  async playNext() {
    if (this.currentIndex >= this.narrations.length) {
      if (this.callbacks.onComplete) {
        this.callbacks.onComplete();
      }
      return;
    }

    const narration = this.narrations[this.currentIndex];

    if (narration.type === 'pause') {
      await new Promise(resolve => setTimeout(resolve, narration.duration));
      this.currentIndex++;
      await this.playNext();
      return;
    }

    if (narration.audio) {
      if (narration.type === 'card' && this.callbacks.onCardStart) {
        this.callbacks.onCardStart(narration.cardIndex, narration.arcangel);
      }

      this.currentAudio = new Audio(narration.audio);
      
      this.currentAudio.addEventListener('ended', async () => {
        if (narration.type === 'card' && this.callbacks.onCardEnd) {
          this.callbacks.onCardEnd(narration.cardIndex);
        }

        this.currentIndex++;
        await this.playNext();
      });

      this.currentAudio.play();
    } else {
      this.currentIndex++;
      await this.playNext();
    }
  }

  pause() {
    if (this.currentAudio) {
      this.currentAudio.pause();
      this.isPaused = true;
    }
  }

  resume() {
    if (this.currentAudio && this.isPaused) {
      this.currentAudio.play();
      this.isPaused = false;
    }
  }

  stop() {
    if (this.currentAudio) {
      this.currentAudio.pause();
      this.currentAudio.currentTime = 0;
    }
    this.currentIndex = 0;
    this.isPaused = false;
  }

  skip() {
    if (this.currentAudio) {
      this.currentAudio.pause();
    }
    this.currentIndex++;
    this.playNext();
  }
}

/**
 * Genera y descarga el audio completo de la tirada
 */
export async function downloadReadingAudio(interpretaciones, resumen, arcangeles) {
  const narrations = await generateReadingNarration(interpretaciones, resumen, arcangeles);
  
  // Aquí podrías combinar todos los audios en uno solo
  // Por ahora, retornamos la lista de narraciones
  return narrations;
}

