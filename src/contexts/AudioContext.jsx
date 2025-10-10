import React, { createContext, useContext, useState, useRef, useEffect } from 'react';
import angelicMusicService from '../services/angelicMusicService';
import { getSectionMusic } from '../config/angelicMusic';

const AudioContext = createContext();

export const useAudio = () => {
  const context = useContext(AudioContext);
  if (!context) {
    throw new Error('useAudio must be used within an AudioProvider');
  }
  return context;
};

export const AudioProvider = ({ children }) => {
  const [volume, setVolume] = useState(0.3);
  const [currentSection, setCurrentSection] = useState('home');
  const [isMusicEnabled, setIsMusicEnabled] = useState(false);

  useEffect(() => {
    angelicMusicService.setMasterVolume(volume);
  }, [volume]);

  useEffect(() => {
    if (isMusicEnabled) {
      const musicConfig = getSectionMusic(currentSection);
      angelicMusicService.play(musicConfig).catch(err => {
        console.error('Error al reproducir música:', err);
      });
    }
  }, [currentSection, isMusicEnabled]);


  const toggleBackgroundMusic = () => {
    console.log(`🎵 Toggle música: ${isMusicEnabled ? 'OFF' : 'ON'}`);
    if (isMusicEnabled) {
      angelicMusicService.stop().catch(err => console.error('Error al detener:', err));
      setIsMusicEnabled(false);
    } else {
      setIsMusicEnabled(true);
    }
  };

  const changeSectionMusic = async (sectionId) => {
    setCurrentSection(sectionId);
    console.log(`🎵 Cambiando sección de música a: ${sectionId}`);
  };

  const setAudioVolume = (newVolume) => {
    const clampedVolume = Math.max(0, Math.min(1, newVolume));
    setVolume(clampedVolume);
    angelicMusicService.setMasterVolume(clampedVolume);
  };

  const value = {
    isPlaying: isMusicEnabled,
    volume,
    toggleAudio: toggleBackgroundMusic,
    setVolume: setAudioVolume,
    isMusicEnabled,
    toggleBackgroundMusic,
    changeSectionMusic,
    currentSection
  };

  return (
    <AudioContext.Provider value={value}>
      {children}
    </AudioContext.Provider>
  );
};
