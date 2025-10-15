import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Play, Search, Filter, Heart, Share2, Download, 
  Clock, Eye, Sparkles, Music
} from 'lucide-react';
import { getPlaylistVideos, buscarVideos, filtrarPorCategoria } from '../../services/youtubeService';
import { supabase } from '../../integrations/supabase/client';
import ThematicHeader from '../ThematicHeader';
import FooterLegal from '../FooterLegal';
import fondoAngelico from '../../assets/FondoAngelicoDashboard.png';
import './PodcastPage.css';

const PodcastPage = () => {
  const navigate = useNavigate();
  const [videos, setVideos] = useState([]);
  const [videosFiltrados, setVideosFiltrados] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoria, setCategoria] = useState('todos');
  const [videoSeleccionado, setVideoSeleccionado] = useState(null);
  const [favoritos, setFavoritos] = useState([]);
  const [user, setUser] = useState(null);

  const categorias = [
    { id: 'todos', nombre: 'Todos', icono: '✨' },
    { id: 'arcangeles', nombre: 'Arcángeles', icono: '👼' },
    { id: 'espiritualidad', nombre: 'Espiritualidad', icono: '🙏' },
    { id: 'angeles', nombre: 'Ángeles', icono: '😇' },
    { id: 'venezuela', nombre: 'Venezuela', icono: '🇻🇪' }
  ];

  useEffect(() => {
    cargarUsuario();
    cargarVideos();
    cargarFavoritos();
  }, []);

  useEffect(() => {
    let resultado = videos;
    
    // Filtrar por categoría
    resultado = filtrarPorCategoria(resultado, categoria);
    
    // Buscar por término
    resultado = buscarVideos(resultado, searchTerm);
    
    setVideosFiltrados(resultado);
  }, [videos, categoria, searchTerm]);

  const cargarUsuario = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    setUser(user);
  };

  const cargarVideos = async () => {
    setLoading(true);
    try {
      const videosData = await getPlaylistVideos();
      setVideos(videosData);
      setVideosFiltrados(videosData);
      
      // Seleccionar el primer video por defecto
      if (videosData.length > 0) {
        setVideoSeleccionado(videosData[0]);
      }
    } catch (error) {
      console.error('Error al cargar videos:', error);
    } finally {
      setLoading(false);
    }
  };

  const cargarFavoritos = () => {
    const favoritosGuardados = localStorage.getItem('podcast_favoritos');
    if (favoritosGuardados) {
      setFavoritos(JSON.parse(favoritosGuardados));
    }
  };

  const toggleFavorito = (videoId) => {
    let nuevosFavoritos;
    if (favoritos.includes(videoId)) {
      nuevosFavoritos = favoritos.filter(id => id !== videoId);
    } else {
      nuevosFavoritos = [...favoritos, videoId];
    }
    setFavoritos(nuevosFavoritos);
    localStorage.setItem('podcast_favoritos', JSON.stringify(nuevosFavoritos));
  };

  const compartirVideo = (video) => {
    if (navigator.share) {
      navigator.share({
        title: video.titulo,
        text: video.descripcion,
        url: video.videoUrl
      });
    } else {
      // Fallback: copiar al portapapeles
      navigator.clipboard.writeText(video.videoUrl);
      alert('¡Link copiado al portapapeles!');
    }
  };

  const formatearFecha = (fecha) => {
    return new Date(fecha).toLocaleDateString('es-ES', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };

  const formatearVistas = (vistas) => {
    if (vistas >= 1000) {
      return `${(vistas / 1000).toFixed(1)}K`;
    }
    return vistas;
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/login');
  };

  return (
    <div className="podcast-page-wrapper">
      {/* Fondo */}
      <div
        className="podcast-background"
        style={{
          backgroundImage: `url(${fondoAngelico})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center'
        }}
      />
      <div className="podcast-overlay" />

      {/* Header Temático */}
      <ThematicHeader
        appType="podcast"
        user={user}
        onNavigateHome={() => navigate('/blog-podcast/seleccion')}
        onCartClick={() => navigate('/carrito')}
        onProfileClick={() => navigate('/perfil')}
        onLogout={handleLogout}
      />

      {/* Controles */}
      <div className="podcast-controls">
        {/* Búsqueda */}
        <div className="podcast-search">
          <Search size={20} className="podcast-search-icon" />
          <input
            type="text"
            placeholder="Buscar episodios..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="podcast-search-input"
          />
        </div>

        {/* Filtros de categoría */}
        <div className="podcast-categories">
          {categorias.map((cat) => (
            <button
              key={cat.id}
              className={`podcast-category ${categoria === cat.id ? 'podcast-category-active' : ''}`}
              onClick={() => setCategoria(cat.id)}
            >
              <span>{cat.icono}</span>
              <span>{cat.nombre}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Contenido principal */}
      <div className="podcast-main">
        {/* Player principal */}
        {videoSeleccionado && (
          <div className="podcast-player-section">
            <div className="podcast-player-wrapper">
              <iframe
                src={videoSeleccionado.embedUrl}
                title={videoSeleccionado.titulo}
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="podcast-player"
              />
            </div>

            <div className="podcast-player-info">
              <h2 className="podcast-player-title">{videoSeleccionado.titulo}</h2>
              <p className="podcast-player-description">{videoSeleccionado.descripcion}</p>

              <div className="podcast-player-meta">
                <span className="podcast-player-date">
                  {formatearFecha(videoSeleccionado.fechaPublicacion)}
                </span>
                {videoSeleccionado.vistas && (
                  <span className="podcast-player-views">
                    <Eye size={16} />
                    {formatearVistas(videoSeleccionado.vistas)} vistas
                  </span>
                )}
                {videoSeleccionado.duracion && (
                  <span className="podcast-player-duration">
                    <Clock size={16} />
                    {videoSeleccionado.duracion}
                  </span>
                )}
              </div>

              <div className="podcast-player-actions">
                <button
                  className={`podcast-action-button ${favoritos.includes(videoSeleccionado.id) ? 'podcast-action-button-active' : ''}`}
                  onClick={() => toggleFavorito(videoSeleccionado.id)}
                >
                  <Heart size={20} fill={favoritos.includes(videoSeleccionado.id) ? 'currentColor' : 'none'} />
                  <span>Favorito</span>
                </button>

                <button
                  className="podcast-action-button"
                  onClick={() => compartirVideo(videoSeleccionado)}
                >
                  <Share2 size={20} />
                  <span>Compartir</span>
                </button>

                <a
                  href={videoSeleccionado.videoUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="podcast-action-button"
                >
                  <Download size={20} />
                  <span>Ver en YouTube</span>
                </a>
              </div>
            </div>
          </div>
        )}

        {/* Lista de episodios */}
        <div className="podcast-episodes">
          <div className="podcast-episodes-header">
            <h3 className="podcast-episodes-title">
              <Sparkles size={20} />
              Todos los Episodios ({videosFiltrados.length})
            </h3>
          </div>

          {loading ? (
            <div className="podcast-loading">
              <div className="podcast-loader"></div>
              <p>Cargando episodios angelicales...</p>
            </div>
          ) : videosFiltrados.length === 0 ? (
            <div className="podcast-empty">
              <Music size={48} />
              <p>No se encontraron episodios</p>
            </div>
          ) : (
            <div className="podcast-episodes-grid">
              {videosFiltrados.map((video) => (
                <div
                  key={video.id}
                  className={`podcast-episode-card ${videoSeleccionado?.id === video.id ? 'podcast-episode-card-active' : ''}`}
                  onClick={() => setVideoSeleccionado(video)}
                >
                  <div className="podcast-episode-thumbnail">
                    <img src={video.thumbnail} alt={video.titulo} />
                    <div className="podcast-episode-play">
                      <Play size={24} fill="white" />
                    </div>
                    {video.duracion && (
                      <span className="podcast-episode-duration">{video.duracion}</span>
                    )}
                    {favoritos.includes(video.id) && (
                      <Heart
                        size={20}
                        fill="#a855f7"
                        className="podcast-episode-favorite"
                      />
                    )}
                  </div>

                  <div className="podcast-episode-content">
                    <h4 className="podcast-episode-title">{video.titulo}</h4>
                    <p className="podcast-episode-description">
                      {video.descripcion.substring(0, 80)}...
                    </p>
                    <div className="podcast-episode-meta">
                      <span>{formatearFecha(video.fechaPublicacion)}</span>
                      {video.vistas && (
                        <span>
                          <Eye size={14} />
                          {formatearVistas(video.vistas)}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Footer Legal */}
      <FooterLegal />
    </div>
  );
};

export default PodcastPage;

