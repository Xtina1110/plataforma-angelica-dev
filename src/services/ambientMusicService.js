/**
 * Servicio de Música Ambiente Contextual
 * 
 * Gestiona la reproducción de música ambiente según el contexto de cada aplicación.
 * Cada app tiene su propia música que refleja su propósito y energía.
 */

// Configuración de música por aplicación
export const AMBIENT_MUSIC_CONFIG = {
  // Pantalla de Carga - Música de preparación y conexión
  loading: {
    name: 'Conexión Angelical',
    url: 'https://cdn.pixabay.com/download/audio/2022/03/10/audio_2d8e0f9e8e.mp3', // Angelic Voices
    volume: 0.3,
    loop: true,
    description: 'Voces angelicales y arpas celestiales para preparar tu espacio sagrado',
    frequency: '528 Hz', // Frecuencia de amor y sanación
    intention: 'Apertura y conexión con el plano angelical'
  },

  // Apertura Angelical - Música de apertura y revelación
  aperturaAngelical: {
    name: 'Revelación Divina',
    url: 'https://cdn.pixabay.com/download/audio/2022/05/27/audio_1808fbf07a.mp3', // Heavenly
    volume: 0.35,
    loop: true,
    description: 'Música etérea para abrir canales de comunicación angelical',
    frequency: '432 Hz', // Frecuencia universal
    intention: 'Apertura del corazón y receptividad divina'
  },

  // Sonoterapia - Música de sanación con cuencos tibetanos
  sonoterapia: {
    name: 'Cuencos Sanadores',
    url: 'https://cdn.pixabay.com/download/audio/2021/08/04/audio_12b0c7443c.mp3', // Tibetan Bowls
    volume: 0.4,
    loop: true,
    description: 'Cuencos tibetanos y frecuencias binaurales para sanación profunda',
    frequency: '396 Hz', // Liberación de miedo y culpa
    intention: 'Sanación celular y equilibrio energético'
  },

  // Terapias y Limpiezas - Música de purificación
  terapias: {
    name: 'Purificación Energética',
    url: 'https://cdn.pixabay.com/download/audio/2022/03/15/audio_c9b6c4e9e3.mp3', // Meditation
    volume: 0.35,
    loop: true,
    description: 'Frecuencias de limpieza y renovación energética',
    frequency: '417 Hz', // Cambio y transformación
    intention: 'Limpieza de energías densas y renovación'
  },

  // Academia Angelica - Música de concentración y aprendizaje
  academia: {
    name: 'Sabiduría Celestial',
    url: 'https://cdn.pixabay.com/download/audio/2022/08/02/audio_2dde668d05.mp3', // Study Music
    volume: 0.25,
    loop: true,
    description: 'Música suave para concentración y absorción de conocimiento',
    frequency: '741 Hz', // Despertar de la intuición
    intention: 'Claridad mental y receptividad al aprendizaje'
  },

  // Mensajes Angelicos - Música de comunicación divina
  mensajes: {
    name: 'Mensajeros Celestiales',
    url: 'https://cdn.pixabay.com/download/audio/2022/03/10/audio_2d8e0f9e8e.mp3', // Angelic
    volume: 0.3,
    loop: true,
    description: 'Música angelical para facilitar la comunicación divina',
    frequency: '639 Hz', // Conexión y relaciones
    intention: 'Comunicación clara con los ángeles'
  },

  // Tienda Angelica - Música de abundancia y gratitud
  tienda: {
    name: 'Abundancia Divina',
    url: 'https://cdn.pixabay.com/download/audio/2022/05/27/audio_1808fbf07a.mp3', // Uplifting
    volume: 0.3,
    loop: true,
    description: 'Música elevadora para atraer abundancia y gratitud',
    frequency: '528 Hz', // Transformación y milagros
    intention: 'Apertura a la abundancia y gratitud'
  },

  // Eventos - Música de celebración y comunidad
  eventos: {
    name: 'Celebración Sagrada',
    url: 'https://cdn.pixabay.com/download/audio/2022/08/02/audio_2dde668d05.mp3', // Upbeat
    volume: 0.35,
    loop: true,
    description: 'Música alegre para celebrar la unión espiritual',
    frequency: '852 Hz', // Retorno al orden espiritual
    intention: 'Celebración y conexión comunitaria'
  },

  // Blog - Música de reflexión y contemplación
  blog: {
    name: 'Reflexión Profunda',
    url: 'https://cdn.pixabay.com/download/audio/2022/03/15/audio_c9b6c4e9e3.mp3', // Ambient
    volume: 0.25,
    loop: true,
    description: 'Música contemplativa para lectura y reflexión',
    frequency: '963 Hz', // Conexión con la divinidad
    intention: 'Contemplación y absorción de sabiduría'
  },

  // Podcast - Música de fondo suave para escucha
  podcast: {
    name: 'Conversación Iluminada',
    url: 'https://cdn.pixabay.com/download/audio/2022/08/02/audio_2dde668d05.mp3', // Soft Background
    volume: 0.2,
    loop: true,
    description: 'Música de fondo muy suave para no interferir con el audio',
    frequency: '432 Hz', // Armonía universal
    intention: 'Escucha atenta y comprensión profunda'
  },

  // Dashboard - Música de bienvenida y motivación
  dashboard: {
    name: 'Bienvenida Celestial',
    url: 'https://cdn.pixabay.com/download/audio/2022/05/27/audio_1808fbf07a.mp3', // Welcome
    volume: 0.3,
    loop: true,
    description: 'Música acogedora para comenzar tu jornada espiritual',
    frequency: '528 Hz', // Amor y sanación
    intention: 'Motivación y apertura al día espiritual'
  },

  // Consultas Online - Música de conexión profunda
  consultasOnline: {
    name: 'Conexión Sagrada',
    url: 'https://cdn.pixabay.com/download/audio/2022/03/10/audio_2d8e0f9e8e.mp3', // Deep Connection
    volume: 0.25,
    loop: true,
    description: 'Música sutil para facilitar la conexión en consultas',
    frequency: '639 Hz', // Conexión y comunicación
    intention: 'Conexión profunda entre almas'
  }
};

// Clase para gestionar el reproductor de música ambiente
class AmbientMusicService {
  constructor() {
    this.audio = null;
    this.currentContext = null;
    this.isPlaying = false;
    this.volume = 0.3;
    this.fadeInterval = null;
  }

  /**
   * Inicializa el reproductor con un contexto específico
   * @param {string} context - El contexto de la aplicación (loading, aperturaAngelical, etc.)
   */
  async init(context) {
    if (!AMBIENT_MUSIC_CONFIG[context]) {
      console.warn(`No hay configuración de música para el contexto: ${context}`);
      return;
    }

    // Si ya hay música del mismo contexto, no hacer nada
    if (this.currentContext === context && this.isPlaying) {
      return;
    }

    // Si hay música diferente, hacer crossfade
    if (this.audio && this.currentContext !== context) {
      await this.crossfade(context);
      return;
    }

    // Crear nuevo reproductor
    const config = AMBIENT_MUSIC_CONFIG[context];
    this.audio = new Audio(config.url);
    this.audio.loop = config.loop;
    this.audio.volume = 0; // Empezar en 0 para fade in
    this.currentContext = context;

    try {
      await this.audio.play();
      this.isPlaying = true;
      this.fadeIn(config.volume);
    } catch (error) {
      console.error('Error al reproducir música ambiente:', error);
    }
  }

  /**
   * Fade in suave
   * @param {number} targetVolume - Volumen objetivo
   */
  fadeIn(targetVolume = 0.3) {
    if (!this.audio) return;

    const step = 0.01;
    const interval = 50; // ms

    this.fadeInterval = setInterval(() => {
      if (this.audio.volume < targetVolume - step) {
        this.audio.volume = Math.min(this.audio.volume + step, targetVolume);
      } else {
        this.audio.volume = targetVolume;
        clearInterval(this.fadeInterval);
      }
    }, interval);
  }

  /**
   * Fade out suave
   */
  fadeOut() {
    return new Promise((resolve) => {
      if (!this.audio) {
        resolve();
        return;
      }

      const step = 0.01;
      const interval = 50; // ms

      this.fadeInterval = setInterval(() => {
        if (this.audio.volume > step) {
          this.audio.volume = Math.max(this.audio.volume - step, 0);
        } else {
          this.audio.volume = 0;
          clearInterval(this.fadeInterval);
          resolve();
        }
      }, interval);
    });
  }

  /**
   * Crossfade entre dos pistas
   * @param {string} newContext - Nuevo contexto
   */
  async crossfade(newContext) {
    // Fade out de la música actual
    await this.fadeOut();
    
    // Detener y limpiar
    if (this.audio) {
      this.audio.pause();
      this.audio = null;
    }

    // Iniciar nueva música
    await this.init(newContext);
  }

  /**
   * Pausar la música
   */
  pause() {
    if (this.audio && this.isPlaying) {
      this.fadeOut().then(() => {
        this.audio.pause();
        this.isPlaying = false;
      });
    }
  }

  /**
   * Reanudar la música
   */
  resume() {
    if (this.audio && !this.isPlaying) {
      const config = AMBIENT_MUSIC_CONFIG[this.currentContext];
      this.audio.play();
      this.isPlaying = true;
      this.fadeIn(config.volume);
    }
  }

  /**
   * Detener completamente
   */
  stop() {
    if (this.fadeInterval) {
      clearInterval(this.fadeInterval);
    }

    if (this.audio) {
      this.audio.pause();
      this.audio = null;
    }

    this.isPlaying = false;
    this.currentContext = null;
  }

  /**
   * Cambiar volumen
   * @param {number} volume - Nuevo volumen (0-1)
   */
  setVolume(volume) {
    this.volume = Math.max(0, Math.min(1, volume));
    if (this.audio) {
      this.audio.volume = this.volume;
    }
  }

  /**
   * Obtener información del contexto actual
   */
  getCurrentInfo() {
    if (!this.currentContext) return null;
    return {
      ...AMBIENT_MUSIC_CONFIG[this.currentContext],
      isPlaying: this.isPlaying,
      volume: this.volume
    };
  }
}

// Exportar instancia singleton
const ambientMusicService = new AmbientMusicService();
export default ambientMusicService;

