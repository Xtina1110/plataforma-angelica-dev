/**
 * Servicio de YouTube para integrar la playlist de Juan Carlos Ávila
 * 
 * Para configurar:
 * 1. Obtén tu API Key de YouTube en: https://console.cloud.google.com/
 * 2. Crea un archivo .env.local en la raíz del proyecto
 * 3. Agrega: VITE_YOUTUBE_API_KEY=tu_api_key_aqui
 */

const API_KEY = import.meta.env.VITE_YOUTUBE_API_KEY || 'TU_API_KEY_AQUI';
const PLAYLIST_ID = 'PLCmMvj-r62Yg1Fan4iG_U8va5XdsJEPW6';
const CHANNEL_ID = 'UCxxx'; // ID del canal de Juan Carlos Ávila

/**
 * Obtiene todos los videos de la playlist
 * @returns {Promise<Array>} Lista de videos con información completa
 */
export const getPlaylistVideos = async () => {
  try {
    if (API_KEY === 'TU_API_KEY_AQUI') {
      console.warn('⚠️ API Key de YouTube no configurada. Usando datos de ejemplo.');
      return getDatosEjemplo();
    }

    const url = `https://www.googleapis.com/youtube/v3/playlistItems?part=snippet,contentDetails&maxResults=50&playlistId=${PLAYLIST_ID}&key=${API_KEY}`;
    
    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error(`Error ${response.status}: ${response.statusText}`);
    }
    
    const data = await response.json();
    
    // Transformar datos de YouTube a formato más amigable
    return data.items.map(item => ({
      id: item.contentDetails.videoId,
      titulo: item.snippet.title,
      descripcion: item.snippet.description,
      thumbnail: item.snippet.thumbnails.high?.url || item.snippet.thumbnails.medium?.url,
      thumbnailMedium: item.snippet.thumbnails.medium?.url,
      thumbnailHigh: item.snippet.thumbnails.high?.url,
      thumbnailMaxres: item.snippet.thumbnails.maxres?.url,
      fechaPublicacion: item.snippet.publishedAt,
      videoUrl: `https://www.youtube.com/watch?v=${item.contentDetails.videoId}`,
      embedUrl: `https://www.youtube.com/embed/${item.contentDetails.videoId}`,
      posicion: item.snippet.position
    }));
  } catch (error) {
    console.error('Error al obtener videos de YouTube:', error);
    return getDatosEjemplo();
  }
};

/**
 * Obtiene estadísticas de un video específico
 * @param {string} videoId - ID del video
 * @returns {Promise<Object>} Estadísticas del video
 */
export const getVideoStats = async (videoId) => {
  try {
    if (API_KEY === 'TU_API_KEY_AQUI') {
      return null;
    }

    const url = `https://www.googleapis.com/youtube/v3/videos?part=statistics,contentDetails&id=${videoId}&key=${API_KEY}`;
    
    const response = await fetch(url);
    const data = await response.json();
    
    if (data.items && data.items.length > 0) {
      const item = data.items[0];
      return {
        vistas: parseInt(item.statistics.viewCount),
        likes: parseInt(item.statistics.likeCount),
        comentarios: parseInt(item.statistics.commentCount),
        duracion: parseDuration(item.contentDetails.duration)
      };
    }
    
    return null;
  } catch (error) {
    console.error('Error al obtener estadísticas del video:', error);
    return null;
  }
};

/**
 * Convierte duración ISO 8601 a formato legible
 * @param {string} duration - Duración en formato ISO 8601 (ej: PT20M36S)
 * @returns {string} Duración formateada (ej: "20:36")
 */
const parseDuration = (duration) => {
  const match = duration.match(/PT(\d+H)?(\d+M)?(\d+S)?/);
  
  const hours = (match[1] || '').replace('H', '');
  const minutes = (match[2] || '').replace('M', '');
  const seconds = (match[3] || '').replace('S', '');
  
  if (hours) {
    return `${hours}:${minutes.padStart(2, '0')}:${seconds.padStart(2, '0')}`;
  }
  
  return `${minutes || '0'}:${seconds.padStart(2, '0')}`;
};

/**
 * Datos de ejemplo para cuando no hay API Key configurada
 * Basados en la playlist real de Juan Carlos Ávila
 */
const getDatosEjemplo = () => {
  return [
    {
      id: 'video1',
      titulo: 'SIEMPRE BENDECIR',
      descripcion: 'Episodio sobre la importancia de bendecir en todo momento',
      thumbnail: 'https://i.ytimg.com/vi/placeholder/hqdefault.jpg',
      fechaPublicacion: '2024-07-15T00:00:00Z',
      videoUrl: 'https://www.youtube.com/watch?v=placeholder',
      embedUrl: 'https://www.youtube.com/embed/placeholder',
      duracion: '20:36',
      vistas: 1400,
      posicion: 0
    },
    {
      id: 'video2',
      titulo: 'LA FUERZA DEL ALMA',
      descripcion: 'Descubre el poder interior de tu alma',
      thumbnail: 'https://i.ytimg.com/vi/placeholder/hqdefault.jpg',
      fechaPublicacion: '2024-07-10T00:00:00Z',
      videoUrl: 'https://www.youtube.com/watch?v=placeholder',
      embedUrl: 'https://www.youtube.com/embed/placeholder',
      duracion: '12:55',
      vistas: 1200,
      posicion: 1
    },
    {
      id: 'video3',
      titulo: 'LA ESPERANZA ES LA ULTIMA QUE SE PIERDE',
      descripcion: 'Mantén viva la esperanza en tu camino espiritual',
      thumbnail: 'https://i.ytimg.com/vi/placeholder/hqdefault.jpg',
      fechaPublicacion: '2024-07-05T00:00:00Z',
      videoUrl: 'https://www.youtube.com/watch?v=placeholder',
      embedUrl: 'https://www.youtube.com/embed/placeholder',
      duracion: '18:51',
      vistas: 6500,
      posicion: 2
    },
    {
      id: 'video4',
      titulo: 'Arcángel MIGUEL',
      descripcion: 'Conecta con la energía protectora del Arcángel Miguel',
      thumbnail: 'https://i.ytimg.com/vi/placeholder/hqdefault.jpg',
      fechaPublicacion: '2024-06-20T00:00:00Z',
      videoUrl: 'https://www.youtube.com/watch?v=placeholder',
      embedUrl: 'https://www.youtube.com/embed/placeholder',
      duracion: '16:10',
      vistas: 1200,
      posicion: 3
    },
    {
      id: 'video5',
      titulo: 'Ángeles & Arcángeles',
      descripcion: 'Conoce la jerarquía angelical y sus funciones',
      thumbnail: 'https://i.ytimg.com/vi/placeholder/hqdefault.jpg',
      fechaPublicacion: '2024-05-15T00:00:00Z',
      videoUrl: 'https://www.youtube.com/watch?v=placeholder',
      embedUrl: 'https://www.youtube.com/embed/placeholder',
      duracion: '16:24',
      vistas: 389,
      posicion: 4
    }
  ];
};

/**
 * Busca videos por término
 * @param {Array} videos - Lista de videos
 * @param {string} termino - Término de búsqueda
 * @returns {Array} Videos filtrados
 */
export const buscarVideos = (videos, termino) => {
  if (!termino) return videos;
  
  const terminoLower = termino.toLowerCase();
  return videos.filter(video => 
    video.titulo.toLowerCase().includes(terminoLower) ||
    video.descripcion.toLowerCase().includes(terminoLower)
  );
};

/**
 * Filtra videos por categoría (detectada en el título)
 * @param {Array} videos - Lista de videos
 * @param {string} categoria - Categoría a filtrar
 * @returns {Array} Videos filtrados
 */
export const filtrarPorCategoria = (videos, categoria) => {
  if (categoria === 'todos') return videos;
  
  const categorias = {
    'arcangeles': ['arcángel', 'miguel', 'rafael', 'uriel', 'gabriel', 'metatron'],
    'espiritualidad': ['espiritualidad', 'alma', 'espiritual'],
    'angeles': ['ángeles', 'angel', 'guarda'],
    'venezuela': ['venezuela', 'predicciones']
  };
  
  const keywords = categorias[categoria] || [];
  
  return videos.filter(video => {
    const texto = `${video.titulo} ${video.descripcion}`.toLowerCase();
    return keywords.some(keyword => texto.includes(keyword));
  });
};

export default {
  getPlaylistVideos,
  getVideoStats,
  buscarVideos,
  filtrarPorCategoria
};

