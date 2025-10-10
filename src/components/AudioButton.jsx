import React from 'react';
import { Volume2, VolumeX } from 'lucide-react';
import { useAudio } from '../contexts/AudioContext';
import { useLanguage } from '../contexts/LanguageContext';

const AudioButton = ({ className = "", showText = true, variant = "header" }) => {
  const { isPlaying, toggleAudio } = useAudio();
  const { selectedLanguage } = useLanguage();

  const labels = {
    Español: { audio: 'Audio', mute: 'Silenciar', ariaOn: 'Activar audio', ariaOff: 'Silenciar audio' },
    English: { audio: 'Audio', mute: 'Mute', ariaOn: 'Enable audio', ariaOff: 'Mute audio' },
    Français: { audio: 'Audio', mute: 'Couper', ariaOn: "Activer l'audio", ariaOff: "Couper l'audio" },
    Italiano: { audio: 'Audio', mute: 'Silenzia', ariaOn: 'Attiva audio', ariaOff: 'Silenzia audio' },
    Deutsch: { audio: 'Audio', mute: 'Stumm', ariaOn: 'Audio aktivieren', ariaOff: 'Audio stummschalten' },
  };
  const L = labels[selectedLanguage] || labels['Español'];

  // Estilo estándar de headers (como Sonoterapia)
  const variants = {
    header: "flex items-center space-x-2 bg-white/15 hover:bg-white/25 border border-white/30 text-white px-4 py-2 rounded-lg transition-all duration-200 backdrop-filter backdrop-blur-sm font-medium shadow-lg",
    loading: "flex items-center space-x-2 bg-white/15 hover:bg-white/25 border border-white/30 text-white px-4 py-2 rounded-lg transition-all duration-200 backdrop-filter backdrop-blur-sm font-medium shadow-lg",
    sidebar: "w-full justify-center gap-2 bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white px-4 py-2 rounded-lg shadow-lg hover:shadow-xl transform hover:scale-105 flex items-center"
  };

  return (
    <button 
      onClick={toggleAudio}
      className={`${variants[variant]} ${className}`}
      aria-label={isPlaying ? L.ariaOff : L.ariaOn}
    >
      {isPlaying ? <VolumeX size={18} /> : <Volume2 size={18} />}
      {showText && (
        <span className="text-sm">{isPlaying ? L.mute : L.audio}</span>
      )}
    </button>
  );
};

export default AudioButton;

