import jazzLoungeMusic from '../assets/angel-music-background.mp3';

export const angelicMusicConfig = {
  home: {
    name: 'Jazz Lounge Angelical',
    url: jazzLoungeMusic,
    description: 'Jazz instrumental suave y relajante sin voces, perfecto para ambiente angelical',
    frequency: '432Hz',
    volume: 0.25,
    fadeIn: 3,
    fadeOut: 2
  },
  tirada: {
    name: 'Apertura Angelical',
    url: 'https://cdn.pixabay.com/audio/2023/10/30/audio_13e5e348a9.mp3',
    description: 'Melodía celestial con arpas y vibraciones elevadas',
    frequency: '528Hz',
    volume: 0.22,
    fadeIn: 3,
    fadeOut: 2
  },
  canalizaciones: {
    name: 'Sonoterapia Divina',
    url: 'https://cdn.pixabay.com/audio/2022/03/10/audio_4e5419a3b0.mp3',
    description: 'Cuencos tibetanos y arpas suaves para conexión profunda',
    frequency: '528Hz',
    volume: 0.20,
    fadeIn: 4,
    fadeOut: 2
  },
  terapias: {
    name: 'Purificación Energética',
    url: 'https://cdn.pixabay.com/audio/2023/02/28/audio_01ca5034b5.mp3',
    description: 'Tonos purificadores y sonidos cristalinos de limpieza',
    frequency: '528Hz',
    volume: 0.23,
    fadeIn: 3,
    fadeOut: 2
  },
  academia: {
    name: 'Sabiduría Angelical',
    url: 'https://cdn.pixabay.com/audio/2022/03/15/audio_92835e86b8.mp3',
    description: 'Piano etéreo y cuerdas suaves para concentración',
    frequency: '432Hz',
    volume: 0.18,
    fadeIn: 3,
    fadeOut: 2
  },
  mensaje: {
    name: 'Reflexión Dorada',
    url: 'https://cdn.pixabay.com/audio/2022/11/22/audio_bdd5069a23.mp3',
    description: 'Campanas suaves y notas doradas inspiradoras',
    frequency: '528Hz',
    volume: 0.20,
    fadeIn: 2,
    fadeOut: 2
  },
  eventos: {
    name: 'Esperanza Celestial',
    url: 'https://cdn.pixabay.com/audio/2023/07/26/audio_7577725713.mp3',
    description: 'Melodía esperanzadora con acordes ascendentes',
    frequency: '432Hz',
    volume: 0.24,
    fadeIn: 3,
    fadeOut: 2
  },
  blog: {
    name: 'Ambiente Angelical',
    url: 'https://cdn.pixabay.com/audio/2022/08/02/audio_35562616f7.mp3',
    description: 'Música ambiental neutra y elegante',
    frequency: '432Hz',
    volume: 0.15,
    fadeIn: 2,
    fadeOut: 2
  },
  tienda: {
    name: 'Abundancia Divina',
    url: 'https://cdn.pixabay.com/audio/2022/10/26/audio_5f868263c2.mp3',
    description: 'Angelic lounge que inspira abundancia y alegría',
    frequency: '528Hz',
    volume: 0.22,
    fadeIn: 2,
    fadeOut: 2
  }
};

export const getSectionMusic = (sectionId) => {
  return angelicMusicConfig[sectionId] || angelicMusicConfig.home;
};

export const getAllMusicUrls = () => {
  return Object.values(angelicMusicConfig).map(config => config.url);
};
