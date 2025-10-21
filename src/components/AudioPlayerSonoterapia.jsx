import React, { useState, useRef, useEffect } from 'react';
import './AudioPlayerSonoterapia.css';

const AudioPlayerSonoterapia = ({ sonoterapia, onClose }) => {
  const audioRef = useRef(null);
  const audioContextRef = useRef(null);
  const oscillatorRef = useRef(null);
  const gainNodeRef = useRef(null);
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

  // Inicializar Web Audio API
  const initWebAudio = () => {
    if (!audioContextRef.current) {
      audioContextRef.current = new (window.AudioContext || window.webkitAudioContext)();
      gainNodeRef.current = audioContextRef.current.createGain();
      gainNodeRef.current.connect(audioContextRef.current.destination);
      gainNodeRef.current.gain.value = volume;
    }
  };

  // Generar tono con Web Audio API
  const startWebAudioTone = (freq) => {
    if (!freq) return;
    
    initWebAudio();
    
    // Detener oscilador anterior si existe
    if (oscillatorRef.current) {
      try {
        oscillatorRef.current.stop();
      } catch (e) {
        // Ignorar error si ya está detenido
      }
    }

    // Crear nuevo oscilador
    oscillatorRef.current = audioContextRef.current.createOscillator();
    oscillatorRef.current.type = 'sine'; // Onda sinusoidal pura
    oscillatorRef.current.frequency.value = freq;
    
    // Conectar al nodo de ganancia
    oscillatorRef.current.connect(gainNodeRef.current);
    
    // Fade in suave
    gainNodeRef.current.gain.setValueAtTime(0, audioContextRef.current.currentTime);
    gainNodeRef.current.gain.linearRampToValueAtTime(
      volume, 
      audioContextRef.current.currentTime + 0.5
    );
    
    // Iniciar oscilador
    oscillatorRef.current.start();
    
    // Simular duración (usar la duración del sonoterapia o 30 minutos por defecto)
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
    if (oscillatorRef.current) {
      try {
        // Fade out suave
        if (gainNodeRef.current && audioContextRef.current) {
          gainNodeRef.current.gain.linearRampToValueAtTime(
            0, 
            audioContextRef.current.currentTime + 0.3
          );
        }
        
        setTimeout(() => {
          if (oscillatorRef.current) {
            oscillatorRef.current.stop();
            oscillatorRef.current = null;
          }
        }, 300);
      } catch (e) {
        // Ignorar error si ya está detenido
      }
    }
    
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
    
    if (useWebAudio && gainNodeRef.current) {
      gainNodeRef.current.gain.value = newVolume;
    } else if (audioRef.current) {
      audioRef.current.volume = newVolume;
    }
  };

  const toggleMute = () => {
    if (isMuted) {
      const newVolume = volume || 0.5;
      setVolume(newVolume);
      setIsMuted(false);
      
      if (useWebAudio && gainNodeRef.current) {
        gainNodeRef.current.gain.value = newVolume;
      } else if (audioRef.current) {
        audioRef.current.volume = newVolume;
      }
    } else {
      if (useWebAudio && gainNodeRef.current) {
        gainNodeRef.current.gain.value = 0;
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
                  <i className="fas fa-waveform-lines"></i> Generando frecuencia {frequency}Hz
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

