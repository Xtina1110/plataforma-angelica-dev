import React, { useState, useRef, useEffect } from 'react';
import './AudioPlayerSonoterapia.css';
import angelicAudio from '../assets/angelic-meditation.mp3';

const AudioPlayerSonoterapia = ({ sonoterapia, onClose }) => {
  const audioRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);

  // Usar audio de placeholder si no existe el archivo real
  const audioUrl = sonoterapia.audioUrl || angelicAudio;

  useEffect(() => {
    const audio = audioRef.current;
    
    // Event listeners
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

    audio.addEventListener('loadedmetadata', handleLoadedMetadata);
    audio.addEventListener('timeupdate', handleTimeUpdate);
    audio.addEventListener('ended', handleEnded);

    return () => {
      audio.removeEventListener('loadedmetadata', handleLoadedMetadata);
      audio.removeEventListener('timeupdate', handleTimeUpdate);
      audio.removeEventListener('ended', handleEnded);
    };
  }, []);

  const togglePlayPause = () => {
    const audio = audioRef.current;
    if (isPlaying) {
      audio.pause();
    } else {
      audio.play();
    }
    setIsPlaying(!isPlaying);
  };

  const handleSeek = (e) => {
    const audio = audioRef.current;
    const seekTime = (e.target.value / 100) * duration;
    audio.currentTime = seekTime;
    setCurrentTime(seekTime);
  };

  const handleVolumeChange = (e) => {
    const audio = audioRef.current;
    const newVolume = e.target.value / 100;
    audio.volume = newVolume;
    setVolume(newVolume);
    setIsMuted(newVolume === 0);
  };

  const toggleMute = () => {
    const audio = audioRef.current;
    if (isMuted) {
      audio.volume = volume || 0.5;
      setIsMuted(false);
    } else {
      audio.volume = 0;
      setIsMuted(true);
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
            </div>
          </div>
          <button className="audio-player-close" onClick={onClose}>
            <i className="fas fa-times"></i>
          </button>
        </div>

        {/* Visualizer placeholder */}
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
          <button className="audio-control-btn" onClick={() => audioRef.current.currentTime -= 10}>
            <i className="fas fa-backward"></i>
          </button>
          
          <button className="audio-play-btn" onClick={togglePlayPause}>
            <i className={`fas fa-${isPlaying ? 'pause' : 'play'}`}></i>
          </button>
          
          <button className="audio-control-btn" onClick={() => audioRef.current.currentTime += 10}>
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

        {/* Hidden audio element */}
        <audio ref={audioRef} src={audioUrl} preload="metadata" />
      </div>
    </div>
  );
};

export default AudioPlayerSonoterapia;

