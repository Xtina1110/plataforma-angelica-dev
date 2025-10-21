import React, { useState, useRef, useEffect } from 'react';
import './AudioPlayerSonoterapia.css';

const AudioPlayerSonoterapia = ({ sonoterapia, onClose }) => {
  const audioRef = useRef(null);
  const audioContextRef = useRef(null);
  const oscillatorsRef = useRef([]);
  const gainNodesRef = useRef([]);
  const masterGainRef = useRef(null);
  const lfoRef = useRef(null);
  const lfoGainRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [useWebAudio, setUseWebAudio] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const intervalRef = useRef(null);

  // Extraer frecuencia del título si existe
  const extractFrequency = (titulo) => {
    const match = titulo.match(/(\d+)Hz/);
    return match ? parseInt(match[1]) : null;
  };

  const frequency = extractFrequency(sonoterapia.titulo);

  // Inicializar Web Audio API con arquitectura mejorada
  const initWebAudio = () => {
    if (!audioContextRef.current) {
      audioContextRef.current = new (window.AudioContext || window.webkitAudioContext)();
      
      // Master gain node
      masterGainRef.current = audioContextRef.current.createGain();
      masterGainRef.current.connect(audioContextRef.current.destination);
      masterGainRef.current.gain.value = volume;
      
      // LFO (Low Frequency Oscillator) para modulación de amplitud
      lfoRef.current = audioContextRef.current.createOscillator();
      lfoRef.current.frequency.value = 0.2; // Modulación lenta (5 segundos por ciclo)
      lfoRef.current.type = 'sine';
      
      lfoGainRef.current = audioContextRef.current.createGain();
      lfoGainRef.current.gain.value = 0.15; // Profundidad de modulación (15%)
      
      lfoRef.current.connect(lfoGainRef.current);
      lfoRef.current.start();
    }
  };

  // Generar tono rico con armónicos
  const startWebAudioTone = (baseFreq) => {
    if (!baseFreq) return;
    
    initWebAudio();
    
    // Detener osciladores anteriores si existen
    stopWebAudioTone();

    const ctx = audioContextRef.current;
    const now = ctx.currentTime;
    
    // Configuración de armónicos (frecuencia fundamental + armónicos)
    // Esto crea un sonido más rico y musical
    const harmonics = [
      { ratio: 1.0, gain: 0.4 },   // Fundamental
      { ratio: 2.0, gain: 0.15 },  // Primera octava
      { ratio: 3.0, gain: 0.10 },  // Quinta perfecta
      { ratio: 4.0, gain: 0.08 },  // Segunda octava
      { ratio: 5.0, gain: 0.05 },  // Tercera mayor
    ];

    harmonics.forEach((harmonic, index) => {
      // Crear oscilador para cada armónico
      const osc = ctx.createOscillator();
      osc.type = 'sine';
      osc.frequency.value = baseFreq * harmonic.ratio;
      
      // Gain node individual para cada armónico
      const gainNode = ctx.createGain();
      gainNode.gain.value = 0; // Empezar en silencio
      
      // Conectar: Oscilador -> Gain individual -> LFO Gain -> Master Gain -> Destination
      osc.connect(gainNode);
      gainNode.connect(masterGainRef.current);
      
      // Conectar LFO para modulación de amplitud (efecto de "respiración")
      lfoGainRef.current.connect(gainNode.gain);
      
      // Fade in suave (3 segundos)
      gainNode.gain.setValueAtTime(0, now);
      gainNode.gain.linearRampToValueAtTime(harmonic.gain, now + 3);
      
      // Iniciar oscilador
      osc.start(now);
      
      // Guardar referencias
      oscillatorsRef.current.push(osc);
      gainNodesRef.current.push(gainNode);
    });
    
    // Simular duración
    const totalDuration = (sonoterapia.duracionMinutos || 30) * 60;
    setDuration(totalDuration);
    
    // Actualizar tiempo actual
    let startTime = Date.now();
    intervalRef.current = setInterval(() => {
      const elapsed = (Date.now() - startTime) / 1000;
      setCurrentTime(elapsed);
      
      if (elapsed >= totalDuration) {
        stopWebAudioTone();
        setIsPlaying(false);
        setCurrentTime(0);
      }
    }, 100);
  };

  // Detener tono Web Audio
  const stopWebAudioTone = () => {
    const ctx = audioContextRef.current;
    if (!ctx) return;
    
    const now = ctx.currentTime;
    
    // Fade out suave para todos los osciladores (2 segundos)
    gainNodesRef.current.forEach(gainNode => {
      if (gainNode) {
        try {
          gainNode.gain.cancelScheduledValues(now);
          gainNode.gain.setValueAtTime(gainNode.gain.value, now);
          gainNode.gain.linearRampToValueAtTime(0, now + 2);
        } catch (e) {
          // Ignorar errores
        }
      }
    });
    
    // Detener osciladores después del fade out
    setTimeout(() => {
      oscillatorsRef.current.forEach(osc => {
        if (osc) {
          try {
            osc.stop();
          } catch (e) {
            // Ignorar error si ya está detenido
          }
        }
      });
      
      // Limpiar arrays
      oscillatorsRef.current = [];
      gainNodesRef.current = [];
    }, 2100);
    
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  };

  // Verificar si el archivo de audio existe
  useEffect(() => {
    const checkAudioFile = async () => {
      if (!sonoterapia.audioUrl) {
        setUseWebAudio(true);
        return;
      }

      try {
        const response = await fetch(sonoterapia.audioUrl, { method: 'HEAD' });
        if (!response.ok) {
          setUseWebAudio(true);
        }
      } catch (error) {
        setUseWebAudio(true);
      }
    };

    checkAudioFile();
  }, [sonoterapia.audioUrl]);

  // Event listeners para audio tradicional
  useEffect(() => {
    if (useWebAudio || !audioRef.current) return;

    const audio = audioRef.current;
    
    const handleLoadedMetadata = () => {
      setDuration(audio.duration);
    };

    const handleTimeUpdate = () => {
      setCurrentTime(audio.currentTime);
    };

    const handleEnded = () => {
      setIsPlaying(false);
      setCurrentTime(0);
    };

    const handleError = () => {
      console.log('Error cargando audio, cambiando a Web Audio API');
      setUseWebAudio(true);
    };

    audio.addEventListener('loadedmetadata', handleLoadedMetadata);
    audio.addEventListener('timeupdate', handleTimeUpdate);
    audio.addEventListener('ended', handleEnded);
    audio.addEventListener('error', handleError);

    return () => {
      audio.removeEventListener('loadedmetadata', handleLoadedMetadata);
      audio.removeEventListener('timeupdate', handleTimeUpdate);
      audio.removeEventListener('ended', handleEnded);
      audio.removeEventListener('error', handleError);
    };
  }, [useWebAudio]);

  // Cleanup al desmontar
  useEffect(() => {
    return () => {
      stopWebAudioTone();
      if (lfoRef.current) {
        try {
          lfoRef.current.stop();
        } catch (e) {
          // Ignorar
        }
      }
      if (audioContextRef.current) {
        audioContextRef.current.close();
      }
    };
  }, []);

  const togglePlayPause = async () => {
    if (useWebAudio && frequency) {
      // Usar Web Audio API
      if (isPlaying) {
        stopWebAudioTone();
        setIsPlaying(false);
      } else {
        setIsGenerating(true);
        setTimeout(() => {
          startWebAudioTone(frequency);
          setIsPlaying(true);
          setIsGenerating(false);
        }, 500);
      }
    } else {
      // Usar audio tradicional
      const audio = audioRef.current;
      if (!audio) return;

      if (isPlaying) {
        audio.pause();
        setIsPlaying(false);
      } else {
        try {
          await audio.play();
          setIsPlaying(true);
        } catch (error) {
          console.error('Error al reproducir audio:', error);
          // Si falla, intentar con Web Audio
          if (frequency) {
            setUseWebAudio(true);
            setIsGenerating(true);
            setTimeout(() => {
              startWebAudioTone(frequency);
              setIsPlaying(true);
              setIsGenerating(false);
            }, 500);
          } else {
            alert('No se pudo reproducir el audio. Por favor, intenta de nuevo.');
          }
        }
      }
    }
  };

  const handleSeek = (e) => {
    const seekTime = (e.target.value / 100) * duration;
    
    if (useWebAudio) {
      // Para Web Audio, reiniciar desde la nueva posición
      if (isPlaying) {
        stopWebAudioTone();
        setCurrentTime(seekTime);
        // Reiniciar con el tiempo ajustado
        setTimeout(() => {
          startWebAudioTone(frequency);
        }, 100);
      } else {
        setCurrentTime(seekTime);
      }
    } else {
      const audio = audioRef.current;
      if (audio) {
        audio.currentTime = seekTime;
        setCurrentTime(seekTime);
      }
    }
  };

  const handleVolumeChange = (e) => {
    const newVolume = e.target.value / 100;
    setVolume(newVolume);
    setIsMuted(newVolume === 0);
    
    if (useWebAudio && masterGainRef.current) {
      masterGainRef.current.gain.value = newVolume;
    } else if (audioRef.current) {
      audioRef.current.volume = newVolume;
    }
  };

  const toggleMute = () => {
    if (isMuted) {
      const newVolume = volume || 0.5;
      setVolume(newVolume);
      setIsMuted(false);
      
      if (useWebAudio && masterGainRef.current) {
        masterGainRef.current.gain.value = newVolume;
      } else if (audioRef.current) {
        audioRef.current.volume = newVolume;
      }
    } else {
      if (useWebAudio && masterGainRef.current) {
        masterGainRef.current.gain.value = 0;
      } else if (audioRef.current) {
        audioRef.current.volume = 0;
      }
      setIsMuted(true);
    }
  };

  const skipTime = (seconds) => {
    if (useWebAudio) {
      const newTime = Math.max(0, Math.min(duration, currentTime + seconds));
      setCurrentTime(newTime);
      
      if (isPlaying) {
        stopWebAudioTone();
        setTimeout(() => {
          startWebAudioTone(frequency);
        }, 100);
      }
    } else if (audioRef.current) {
      audioRef.current.currentTime = Math.max(0, Math.min(duration, audioRef.current.currentTime + seconds));
    }
  };

  const formatTime = (seconds) => {
    if (isNaN(seconds)) return '0:00';
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  const progress = duration > 0 ? (currentTime / duration) * 100 : 0;

  return (
    <div className="audio-player-overlay" onClick={onClose}>
      <div className="audio-player-container" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="audio-player-header">
          <div className="audio-player-info">
            <img 
              src={sonoterapia.imagen} 
              alt={sonoterapia.titulo}
              className="audio-player-image"
            />
            <div className="audio-player-details">
              <h3>{sonoterapia.titulo}</h3>
              <p className="audio-player-arcangel">
                <i className="fas fa-angel"></i> {sonoterapia.arcangel}
              </p>
              <span className={`audio-player-categoria ${sonoterapia.color}`}>
                {sonoterapia.categoria}
              </span>
              {useWebAudio && frequency && (
                <p className="audio-player-mode">
                  <i className="fas fa-waveform-lines"></i> Frecuencia armónica {frequency}Hz
                </p>
              )}
            </div>
          </div>
          <button className="audio-player-close" onClick={onClose}>
            <i className="fas fa-times"></i>
          </button>
        </div>

        {/* Visualizer */}
        <div className="audio-visualizer">
          <div className={`visualizer-bars ${isPlaying ? 'playing' : ''}`}>
            {[...Array(40)].map((_, i) => (
              <div key={i} className="visualizer-bar" style={{
                animationDelay: `${i * 0.05}s`
              }}></div>
            ))}
          </div>
        </div>

        {/* Progress bar */}
        <div className="audio-progress-container">
          <span className="audio-time">{formatTime(currentTime)}</span>
          <input
            type="range"
            min="0"
            max="100"
            value={progress}
            onChange={handleSeek}
            className="audio-progress-bar"
          />
          <span className="audio-time">{formatTime(duration)}</span>
        </div>

        {/* Controls */}
        <div className="audio-controls">
          <button className="audio-control-btn" onClick={() => skipTime(-10)}>
            <i className="fas fa-backward"></i>
          </button>
          
          <button 
            className="audio-play-btn" 
            onClick={togglePlayPause}
            disabled={isGenerating}
          >
            {isGenerating ? (
              <i className="fas fa-spinner fa-spin"></i>
            ) : (
              <i className={`fas fa-${isPlaying ? 'pause' : 'play'}`}></i>
            )}
          </button>
          
          <button className="audio-control-btn" onClick={() => skipTime(10)}>
            <i className="fas fa-forward"></i>
          </button>
        </div>

        {/* Volume control */}
        <div className="audio-volume-container">
          <button className="audio-volume-btn" onClick={toggleMute}>
            <i className={`fas fa-volume-${isMuted ? 'mute' : volume > 0.5 ? 'up' : 'down'}`}></i>
          </button>
          <input
            type="range"
            min="0"
            max="100"
            value={isMuted ? 0 : volume * 100}
            onChange={handleVolumeChange}
            className="audio-volume-slider"
          />
        </div>

        {/* Hidden audio element (solo para audio tradicional) */}
        {!useWebAudio && sonoterapia.audioUrl && (
          <audio 
            ref={audioRef} 
            src={sonoterapia.audioUrl} 
            preload="auto"
            crossOrigin="anonymous"
          />
        )}
      </div>
    </div>
  );
};

export default AudioPlayerSonoterapia;

