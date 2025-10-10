class AngelicMusicService {
  constructor() {
    this.currentAudio = null;
    this.currentSection = null;
    this.isPlaying = false;
    this.masterVolume = 0.3;
    this.isTransitioning = false;
  }

  async loadAudio(url) {
    return new Promise((resolve, reject) => {
      const audio = new Audio(url);
      audio.preload = 'auto';
      audio.loop = true;

      audio.addEventListener('canplaythrough', () => resolve(audio), { once: true });
      audio.addEventListener('error', (e) => reject(e), { once: true });

      audio.load();
    });
  }

  async fadeOut(audio, duration = 2000) {
    if (!audio) return;

    const startVolume = audio.volume;
    const steps = 50;
    const stepDuration = duration / steps;
    const volumeStep = startVolume / steps;

    return new Promise((resolve) => {
      let currentStep = 0;

      const fadeInterval = setInterval(() => {
        if (!audio || audio.paused) {
          clearInterval(fadeInterval);
          resolve();
          return;
        }

        currentStep++;
        const newVolume = Math.max(0, startVolume - (volumeStep * currentStep));
        audio.volume = newVolume;

        if (currentStep >= steps || audio.volume === 0) {
          clearInterval(fadeInterval);
          try {
            audio.pause();
            audio.currentTime = 0;
          } catch (e) {
            console.warn('Error al pausar audio:', e);
          }
          resolve();
        }
      }, stepDuration);
    });
  }

  async fadeIn(audio, targetVolume, duration = 2000) {
    if (!audio) return;

    audio.volume = 0;

    try {
      await audio.play();
    } catch (error) {
      console.warn('Error al reproducir audio:', error);
      return;
    }

    const steps = 50;
    const stepDuration = duration / steps;
    const volumeStep = targetVolume / steps;

    return new Promise((resolve) => {
      let currentStep = 0;

      const fadeInterval = setInterval(() => {
        if (!audio || audio.paused) {
          clearInterval(fadeInterval);
          resolve();
          return;
        }

        currentStep++;
        const newVolume = Math.min(targetVolume, volumeStep * currentStep);
        audio.volume = newVolume;

        if (currentStep >= steps || audio.volume >= targetVolume) {
          clearInterval(fadeInterval);
          resolve();
        }
      }, stepDuration);
    });
  }

  async crossFade(fromAudio, toAudio, toVolume, duration = 2000) {
    const fadeOutPromise = fromAudio ? this.fadeOut(fromAudio, duration) : Promise.resolve();
    const fadeInPromise = this.fadeIn(toAudio, toVolume, duration);

    await Promise.all([fadeOutPromise, fadeInPromise]);
  }

  async changeMusic(musicConfig) {
    if (this.isTransitioning) {
      console.log(`🎵 Transición en progreso, ignorando cambio a: ${musicConfig.name}`);
      return;
    }

    if (this.currentSection === musicConfig.name && this.isPlaying) {
      console.log(`🎵 Ya reproduciendo: ${musicConfig.name}`);
      return;
    }

    this.isTransitioning = true;
    console.log(`🎵 Cambiando música a: ${musicConfig.name} (${musicConfig.frequency})`);

    try {
      const newAudio = await this.loadAudio(musicConfig.url);

      const targetVolume = musicConfig.volume * this.masterVolume;
      const fadeDuration = musicConfig.fadeIn * 1000;

      if (this.currentAudio && this.isPlaying) {
        await this.crossFade(this.currentAudio, newAudio, targetVolume, fadeDuration);
        const oldAudio = this.currentAudio;
        setTimeout(() => {
          if (oldAudio && oldAudio !== this.currentAudio) {
            oldAudio.pause();
            oldAudio.currentTime = 0;
            oldAudio.src = '';
          }
        }, fadeDuration + 100);
      } else {
        await this.fadeIn(newAudio, targetVolume, fadeDuration);
      }

      this.currentAudio = newAudio;
      this.currentSection = musicConfig.name;
      this.isPlaying = true;

      console.log(`✅ Música cambiada exitosamente a: ${musicConfig.name}`);
    } catch (error) {
      console.error('Error al cambiar música:', error);
      this.isPlaying = false;
    } finally {
      this.isTransitioning = false;
    }
  }

  async play(musicConfig) {
    if (!musicConfig) return;

    if (this.currentSection === musicConfig.name && this.isPlaying) {
      return;
    }

    await this.changeMusic(musicConfig);
  }

  async pause() {
    if (!this.currentAudio || !this.isPlaying) return;

    console.log('⏸️ Pausando música angelical...');

    await this.fadeOut(this.currentAudio, 1500);
    this.isPlaying = false;
  }

  async resume() {
    if (!this.currentAudio) return;

    console.log('▶️ Reanudando música angelical...');

    const targetVolume = this.masterVolume * 0.25;
    await this.fadeIn(this.currentAudio, targetVolume, 1500);
    this.isPlaying = true;
  }

  async stop() {
    console.log('⏹️ Deteniendo música angelical...');

    this.isTransitioning = true;
    this.isPlaying = false;

    try {
      if (this.currentAudio) {
        await this.fadeOut(this.currentAudio, 1000);

        if (this.currentAudio) {
          this.currentAudio.pause();
          this.currentAudio.currentTime = 0;
          this.currentAudio.src = '';
          this.currentAudio = null;
        }
      }
    } catch (error) {
      console.error('Error al detener música:', error);
    } finally {
      this.currentSection = null;
      this.isTransitioning = false;
      console.log('✅ Música detenida completamente');
    }
  }

  setMasterVolume(volume) {
    this.masterVolume = Math.max(0, Math.min(1, volume));

    if (this.currentAudio && this.isPlaying) {
      const targetVolume = this.masterVolume * 0.25;
      this.currentAudio.volume = targetVolume;
    }
  }

  getMasterVolume() {
    return this.masterVolume;
  }

  getIsPlaying() {
    return this.isPlaying;
  }

  getCurrentSection() {
    return this.currentSection;
  }
}

const angelicMusicService = new AngelicMusicService();

export default angelicMusicService;
