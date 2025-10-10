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
    header: "flex items-center space-x-2 bg-purple-700 hover:bg-purple-600 border-2 border-purple-500 hover:border-purple-400 text-white px-5 py-3 rounded-xl transition-all duration-300 font-semibold shadow-xl hover:shadow-2xl hover:scale-105",
    loading: "flex items-center space-x-2 bg-purple-700 hover:bg-purple-600 border-2 border-purple-500 hover:border-purple-400 text-white px-5 py-3 rounded-xl transition-all duration-300 font-semibold shadow-xl hover:shadow-2xl hover:scale-105",
    sidebar: "w-full justify-center gap-2 bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white px-4 py-2 rounded-lg shadow-lg hover:shadow-xl transform hover:scale-105 flex items-center"
  };

  return (
    <button 
      onClick={toggleAudio}
      className={`${variants[variant]} ${className}`}
      aria-label={isPlaying ? L.ariaOff : L.ariaOn}
    >
      {isPlaying ? <VolumeX size={20} /> : <Volume2 size={20} />}
      {showText && (
        <span className="text-base font-semibold">{isPlaying ? L.mute : L.audio}</span>
      )}
    </button>
  );
};

export default AudioButton;

