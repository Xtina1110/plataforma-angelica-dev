/**
 * Servicio de Música Adaptativa
 * 
 * Genera música ambiental que se adapta al arcángel de cada carta
 * usando Tone.js para síntesis de audio
 */

import * as Tone from 'tone';

/**
 * Configuración musical por arcángel
 */
const ARCHANGEL_MUSIC_CONFIG = {
  'Miguel': {
    baseNote: 'C3',
    scale: ['C', 'D', 'E', 'G', 'A'], // Pentatónica mayor
    tempo: 80,
    timbre: 'brass', // Trompetas celestiales
    color: 'blue',
    mood: 'powerful'
  },
  'Rafael': {
    baseNote: 'F3',
    scale: ['F', 'G', 'A', 'C', 'D'],
    tempo: 70,
    timbre: 'strings', // Cuerdas suaves
    color: 'green',
    mood: 'healing'
  },
  'Gabriel': {
    baseNote: 'G3',
    scale: ['G', 'A', 'B', 'D', 'E'],
    tempo: 90,
    timbre: 'bells', // Campanas cristalinas
    color: 'white',
    mood: 'clear'
  },
  'Uriel': {
    baseNote: 'D3',
    scale: ['D', 'E', 'F#', 'A', 'B'],
    tempo: 75,
    timbre: 'choir', // Coro angelical
    color: 'gold',
    mood: 'wise'
  },
  'Chamuel': {
    baseNote: 'A3',
    scale: ['A', 'B', 'C#', 'E', 'F#'],
    tempo: 65,
    timbre: 'harp', // Arpa celestial
    color: 'pink',
    mood: 'loving'
  },
  'Jophiel': {
    baseNote: 'E3',
    scale: ['E', 'F#', 'G#', 'B', 'C#'],
    tempo: 95,
    timbre: 'flute', // Flauta luminosa
    color: 'yellow',
    mood: 'joyful'
  },
  'Zadkiel': {
    baseNote: 'B2',
    scale: ['B', 'C#', 'D#', 'F#', 'G#'],
    tempo: 60,
    timbre: 'pad', // Pad etéreo
    color: 'purple',
    mood: 'transformative'
  }
};

/**
 * Clase para gestionar la música adaptativa
 */
export class AdaptiveMusicPlayer {
  constructor() {
    this.synth = null;
    this.currentArcangel = null;
    this.isPlaying = false;
    this.loop = null;
    this.volume = -10; // dB
  }

  /**
   * Inicializa el sistema de audio
   */
  async init() {
    await Tone.start();
    console.log('Adaptive music system initialized');
  }

  /**
   * Crea un sintetizador según el timbre del arcángel
   */
  createSynth(timbre) {
    switch (timbre) {
      case 'brass':
        return new Tone.FMSynth({
          harmonicity: 3,
          modulationIndex: 10,
          oscillator: { type: 'triangle' },
          envelope: { attack: 0.01, decay: 0.2, sustain: 0.3, release: 1 },
          modulation: { type: 'square' },
          modulationEnvelope: { attack: 0.5, decay: 0, sustain: 1, release: 0.5 }
        }).toDestination();

      case 'strings':
        return new Tone.PolySynth(Tone.Synth, {
          oscillator: { type: 'sawtooth' },
          envelope: { attack: 0.5, decay: 0.2, sustain: 0.8, release: 2 }
        }).toDestination();

      case 'bells':
        return new Tone.MetalSynth({
          frequency: 200,
          envelope: { attack: 0.001, decay: 1.4, release: 0.2 },
          harmonicity: 5.1,
          modulationIndex: 32,
          resonance: 4000,
          octaves: 1.5
        }).toDestination();

      case 'choir':
        return new Tone.PolySynth(Tone.Synth, {
          oscillator: { type: 'sine' },
          envelope: { attack: 1, decay: 0.5, sustain: 0.9, release: 3 }
        }).toDestination();

      case 'harp':
        return new Tone.PluckSynth({
          attackNoise: 1,
          dampening: 4000,
          resonance: 0.9
        }).toDestination();

      case 'flute':
        return new Tone.Synth({
          oscillator: { type: 'sine' },
          envelope: { attack: 0.02, decay: 0.1, sustain: 0.3, release: 1 }
        }).toDestination();

      case 'pad':
        return new Tone.PolySynth(Tone.Synth, {
          oscillator: { type: 'triangle' },
          envelope: { attack: 2, decay: 1, sustain: 0.9, release: 4 }
        }).toDestination();

      default:
        return new Tone.Synth().toDestination();
    }
  }

  /**
   * Inicia la música para un arcángel específico
   */
  async start(arcangel = 'Uriel') {
    if (this.isPlaying && this.currentArcangel === arcangel) {
      return; // Ya está sonando la música correcta
    }

    // Detener música anterior
    this.stop();

    const config = ARCHANGEL_MUSIC_CONFIG[arcangel] || ARCHANGEL_MUSIC_CONFIG['Uriel'];
    this.currentArcangel = arcangel;

    // Crear sintetizador
    this.synth = this.createSynth(config.timbre);
    this.synth.volume.value = this.volume;

    // Configurar tempo
    Tone.Transport.bpm.value = config.tempo;

    // Crear secuencia de notas
    const notes = this.generateMelody(config);
    let noteIndex = 0;

    this.loop = new Tone.Loop((time) => {
      const note = notes[noteIndex % notes.length];
      
      if (config.timbre === 'bells' || config.timbre === 'harp') {
        this.synth.triggerAttackRelease(note.pitch, note.duration, time);
      } else {
        this.synth.triggerAttackRelease(note.pitch, note.duration, time);
      }

      noteIndex++;
    }, '4n');

    this.loop.start(0);
    Tone.Transport.start();
    this.isPlaying = true;

    console.log(`Started adaptive music for ${arcangel}`);
  }

  /**
   * Genera una melodía basada en la configuración del arcángel
   */
  generateMelody(config) {
    const notes = [];
    const octaves = [3, 4, 5];
    
    // Generar 16 notas
    for (let i = 0; i < 16; i++) {
      const scaleNote = config.scale[Math.floor(Math.random() * config.scale.length)];
      const octave = octaves[Math.floor(Math.random() * octaves.length)];
      const duration = ['4n', '2n', '8n'][Math.floor(Math.random() * 3)];

      notes.push({
        pitch: `${scaleNote}${octave}`,
        duration: duration
      });
    }

    return notes;
  }

  /**
   * Detiene la música
   */
  stop() {
    if (this.loop) {
      this.loop.stop();
      this.loop.dispose();
      this.loop = null;
    }

    if (this.synth) {
      this.synth.dispose();
      this.synth = null;
    }

    Tone.Transport.stop();
    this.isPlaying = false;
    this.currentArcangel = null;
  }

  /**
   * Ajusta el volumen
   */
  setVolume(volumeDb) {
    this.volume = volumeDb;
    if (this.synth) {
      this.synth.volume.rampTo(volumeDb, 0.5);
    }
  }

  /**
   * Transición suave a otro arcángel
   */
  async transition(newArcangel, duration = 2000) {
    if (!this.isPlaying) {
      await this.start(newArcangel);
      return;
    }

    // Fade out
    if (this.synth) {
      this.synth.volume.rampTo(-60, duration / 1000);
    }

    // Esperar fade out
    await new Promise(resolve => setTimeout(resolve, duration));

    // Cambiar a nueva música
    await this.start(newArcangel);

    // Fade in
    if (this.synth) {
      this.synth.volume.rampTo(this.volume, duration / 1000);
    }
  }

  /**
   * Pausa la música
   */
  pause() {
    if (this.isPlaying) {
      Tone.Transport.pause();
    }
  }

  /**
   * Reanuda la música
   */
  resume() {
    if (this.isPlaying) {
      Tone.Transport.start();
    }
  }
}

// Instancia global del reproductor
let globalMusicPlayer = null;

/**
 * Obtiene la instancia global del reproductor de música
 */
export function getMusicPlayer() {
  if (!globalMusicPlayer) {
    globalMusicPlayer = new AdaptiveMusicPlayer();
  }
  return globalMusicPlayer;
}

/**
 * Inicia la música de fondo para una tirada
 */
export async function startReadingMusic(arcangel = 'Uriel') {
  const player = getMusicPlayer();
  await player.init();
  await player.start(arcangel);
  return player;
}

/**
 * Detiene la música de fondo
 */
export function stopReadingMusic() {
  const player = getMusicPlayer();
  player.stop();
}

/**
 * Transición de música entre arcángeles
 */
export async function transitionMusic(newArcangel) {
  const player = getMusicPlayer();
  await player.transition(newArcangel);
}

