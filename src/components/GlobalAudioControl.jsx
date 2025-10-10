import React from 'react';
import { Volume2, VolumeX, Music } from 'lucide-react';
import { useAudio } from '../contexts/AudioContext';
import { useLanguage } from '../contexts/LanguageContext';
import { useLocation } from 'react-router-dom';

const GlobalAudioControl = () => {
  const { isPlaying, toggleAudio, isMusicEnabled, toggleBackgroundMusic } = useAudio();
  const { selectedLanguage } = useLanguage();
  const { pathname } = useLocation();

  const labels = {
    Español: {
      ariaOn: 'Activar audio angelical',
      ariaOff: 'Silenciar audio angelical',
      musicOn: 'Activar música de fondo',
      musicOff: 'Desactivar música de fondo'
    },
    English: {
      ariaOn: 'Enable angelic audio',
      ariaOff: 'Mute angelic audio',
      musicOn: 'Enable background music',
      musicOff: 'Disable background music'
    },
    Français: {
      ariaOn: "Activer l'audio angélique",
      ariaOff: "Couper l'audio angélique",
      musicOn: 'Activer la musique de fond',
      musicOff: 'Désactiver la musique de fond'
    },
    Italiano: {
      ariaOn: 'Attiva audio angelico',
      ariaOff: 'Silenzia audio angelico',
      musicOn: 'Attiva musica di sottofondo',
      musicOff: 'Disattiva musica di sottofondo'
    },
    Deutsch: {
      ariaOn: 'Engelsaudio aktivieren',
      ariaOff: 'Engelsaudio stummschalten',
      musicOn: 'Hintergrundmusik aktivieren',
      musicOff: 'Hintergrundmusik deaktivieren'
    },
  };
  const L = labels[selectedLanguage] || labels['Español'];
  if (pathname === '/login' || pathname === '/registro') return null;

  return (
    <div className="fixed bottom-6 right-6 max-w-fit" style={{ zIndex: 9999 }}>
      <button
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          console.log('🎵 Botón clickeado, isMusicEnabled:', isMusicEnabled);
          toggleBackgroundMusic();
        }}
        className={`${
          isMusicEnabled
            ? 'bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 shadow-purple-500/50'
            : 'bg-gradient-to-r from-gray-600 to-gray-700 hover:from-gray-700 hover:to-gray-800 shadow-gray-500/50'
        } text-white p-4 rounded-full shadow-2xl transition-all duration-300 transform hover:scale-110 cursor-pointer`}
        aria-label={isMusicEnabled ? L.musicOff : L.musicOn}
        title={isMusicEnabled ? L.musicOff : L.musicOn}
        style={{ pointerEvents: 'auto' }}
      >
        <Music size={24} className={isMusicEnabled ? 'animate-pulse' : ''} />
      </button>
    </div>
  );
};

export default GlobalAudioControl;