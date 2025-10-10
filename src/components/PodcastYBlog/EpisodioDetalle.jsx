import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, Calendar, Hash, Play, Sparkles, Clock, Youtube, 
  Bell, Share2, Heart, Bookmark, Download, ChevronRight,
  Users, TrendingUp, MessageCircle, Star, Volume2, Pause,
  SkipBack, SkipForward, RotateCcw, Settings
} from 'lucide-react';
import { supabase } from '../../integrations/supabase/client';
import BlogHeader from '../headers/BlogHeader';
import FooterLegal from '../FooterLegal';
import { 
  shareOnFacebook, shareOnTwitter, shareOnWhatsApp, 
  shareOnLinkedIn, shareOnTelegram, copyToClipboard,
  showNotification, getCurrentUrl 
} from '../../utils/shareUtils';
import './PodcastYBlog.css';

const EpisodioDetalle = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [episodio, setEpisodio] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [user, setUser] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);
  const [showTranscript, setShowTranscript] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);
  const [showSubscribeModal, setShowSubscribeModal] = useState(false);

  useEffect(() => {
    const getUser = async () => {
      const { data } = await supabase.auth.getSession();
      setUser(data?.session?.user);
    };
    getUser();
    cargarEpisodio();
  }, [id]);

  const cargarEpisodio = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('episodios_podcast')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;
      setEpisodio(data);
    } catch (error) {
      console.error('Error al cargar episodio:', error);
      setError('Episodio no encontrado');
    } finally {
      setLoading(false);
    }
  };

  const formatearFecha = (fecha) => {
    return new Date(fecha).toLocaleDateString('es-ES', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };

  const extraerVideoId = (url) => {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return match && match[2].length === 11 ? match[2] : null;
  };

  const obtenerUrlEmbed = (url) => {
    const videoId = extraerVideoId(url);
    return videoId ? `https://www.youtube.com/embed/${videoId}?enablejsapi=1&rel=0` : null;
  };

  const handleNavigateHome = () => navigate('/dashboard');
  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/');
  };

  const handleShare = (platform) => {
    const url = getCurrentUrl();
    const title = `🎙️ ${episodio.titulo} - Episodio ${episodio.numero}`;
    const hashtags = 'PlataformaAngelica,PodcastEspiritual,Canalización';

    switch (platform) {
      case 'facebook':
        shareOnFacebook(url, title);
        break;
      case 'twitter':
        shareOnTwitter(url, title, hashtags);
        break;
      case 'whatsapp':
        shareOnWhatsApp(url, title);
        break;
      case 'linkedin':
        shareOnLinkedIn(url, title, episodio.descripcion);
        break;
      case 'telegram':
        shareOnTelegram(url, title);
        break;
      case 'copy':
        copyToClipboard(url, title).then(success => {
          if (success) {
            showNotification('Enlace copiado al portapapeles', 'success');
          } else {
            showNotification('Error al copiar enlace', 'error');
          }
        });
        break;
    }
    setShowShareModal(false);
  };

  const handleFavorite = () => {
    setIsFavorite(!isFavorite);
    showNotification(
      isFavorite ? 'Eliminado de favoritos' : 'Agregado a favoritos',
      'success'
    );
  };

  const handleSubscribe = () => {
    setShowSubscribeModal(true);
    setTimeout(() => setShowSubscribeModal(false), 2000);
    showNotification('¡Te has suscrito al podcast!', 'success');
  };

  // Transcript simulado - en una implementación real vendría de la base de datos
  const transcriptSimulado = `
    [00:00] Bienvenidos queridos seres de luz a este nuevo episodio de nuestro podcast angelical.

    [00:30] En el episodio de hoy exploraremos las profundas enseñanzas que los ángeles nos traen sobre el despertar espiritual y la transformación de la conciencia.

    [01:15] Los ángeles nos recuerdan que cada momento es una oportunidad para elevar nuestra vibración y conectar con nuestra esencia divina.

    [02:00] A través de la meditación y la contemplación angelical, podemos acceder a dimensiones superiores de sabiduría y amor incondicional.

    [03:30] El Arcángel Miguel nos comparte: "No temas al cambio, pues es la puerta hacia tu verdadero ser. Confía en el proceso divino que se despliega en tu vida."

    [05:00] La canalización de hoy nos invita a reflexionar sobre...
  `;

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <BlogHeader 
          user={user}
          onNavigateHome={handleNavigateHome}
          onLogout={handleLogout}
        />
        <div className="detail-container flex-1">
          <div className="loading-container">
            <div className="loading-spinner"></div>
            <p>Cargando episodio angelical...</p>
          </div>
        </div>
        <FooterLegal />
      </div>
    );
  }

  if (error || !episodio) {
    return (
      <div className="min-h-screen flex flex-col">
        <BlogHeader 
          user={user}
          onNavigateHome={handleNavigateHome}
          onLogout={handleLogout}
        />
        <div className="detail-container flex-1">
          <div className="empty-state">
            <div className="empty-state-icon">❌</div>
            <h2 className="empty-state-title">Episodio no encontrado</h2>
            <p className="empty-state-text">
              No pudimos encontrar el episodio que buscas.
            </p>
            <Link to="/podcast" className="back-button" style={{ marginTop: '2rem' }}>
              <ArrowLeft size={20} />
              Volver a episodios
            </Link>
          </div>
        </div>
        <FooterLegal />
      </div>
    );
  }

  const urlEmbed = obtenerUrlEmbed(episodio.link_youtube);

  return (
    <div className="min-h-screen flex flex-col">
      <BlogHeader 
        user={user}
        onNavigateHome={handleNavigateHome}
        onLogout={handleLogout}
      />
      
      <div className="detail-container flex-1">
        <div className="episode-detail-content">
          {/* Header con navegación y acciones */}
          <div className="episode-detail-header">
            <div className="header-nav">
              <Link to="/podcast" className="back-button-enhanced">
                <ArrowLeft size={18} />
                Volver a episodios
              </Link>
              
              <div className="episode-actions">
                <button onClick={handleFavorite} className={`action-btn ${isFavorite ? 'active' : ''}`}>
                  <Heart size={18} fill={isFavorite ? 'currentColor' : 'none'} />
                </button>
                <button onClick={() => setShowShareModal(true)} className="action-btn">
                  <Share2 size={18} />
                </button>
                <button onClick={handleSubscribe} className="action-btn subscribe">
                  <Bell size={18} />
                  Suscribirse
                </button>
              </div>
            </div>

            {/* Información del episodio */}
            <div className="episode-info">
              <div className="episode-badge-detail">
                Episodio {episodio.numero}
              </div>
              <h1 className="episode-title-detail">{episodio.titulo}</h1>
              
              <div className="episode-meta-detail">
                <div className="meta-item">
                  <Calendar size={18} />
                  {formatearFecha(episodio.fecha_publicacion)}
                </div>
                <div className="meta-item">
                  <Clock size={18} />
                  {episodio.duracion || '30'} min
                </div>
                <div className="meta-item">
                  <TrendingUp size={18} />
                  2.3K reproducciones
                </div>
                <div className="meta-item">
                  <Star size={18} />
                  4.9 calificación
                </div>
              </div>
            </div>
          </div>

          {/* Player de video mejorado */}
          <div className="video-player-section">
            {episodio.link_youtube && urlEmbed && (
              <div className="youtube-container-enhanced">
                <iframe
                  className="youtube-iframe-enhanced"
                  src={urlEmbed}
                  title={episodio.titulo}
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                ></iframe>
                
                <div className="video-overlay">
                  <div className="video-info">
                    <span className="video-quality">HD</span>
                    <span className="video-duration">{episodio.duracion || '30'}:00</span>
                  </div>
                </div>
              </div>
            )}

            {/* Controles de audio personalizados */}
            <div className="custom-audio-controls">
              <div className="audio-controls-left">
                <button className="control-btn">
                  <SkipBack size={20} />
                </button>
                <button 
                  className="play-pause-btn"
                  onClick={() => setIsPlaying(!isPlaying)}
                >
                  {isPlaying ? <Pause size={24} /> : <Play size={24} />}
                </button>
                <button className="control-btn">
                  <SkipForward size={20} />
                </button>
              </div>
              
              <div className="audio-progress">
                <span className="time current">00:00</span>
                <div className="progress-bar">
                  <div className="progress-fill" style={{ width: '25%' }}></div>
                </div>
                <span className="time total">{episodio.duracion || '30'}:00</span>
              </div>
              
              <div className="audio-controls-right">
                <button className="control-btn">
                  <Volume2 size={18} />
                </button>
                <button className="control-btn">
                  <Settings size={18} />
                </button>
              </div>
            </div>
          </div>

          {/* Descripción y contenido */}
          <div className="episode-content-section">
            <div className="content-tabs">
              <button 
                className={`tab-btn ${!showTranscript ? 'active' : ''}`}
                onClick={() => setShowTranscript(false)}
              >
                Descripción
              </button>
              <button 
                className={`tab-btn ${showTranscript ? 'active' : ''}`}
                onClick={() => setShowTranscript(true)}
              >
                Transcript
              </button>
            </div>

            <div className="content-body">
              {!showTranscript ? (
                <div className="episode-description-enhanced">
                  <p>{episodio.descripcion}</p>
                  
                  {/* Temas tratados */}
                  <div className="episode-topics">
                    <h4>Temas tratados en este episodio:</h4>
                    <ul>
                      <li>🔮 Conexión angelical y canalización</li>
                      <li>✨ Elevación de la conciencia</li>
                      <li>🙏 Meditación guiada angelical</li>
                      <li>💫 Mensajes del Arcángel Miguel</li>
                      <li>🌟 Transformación espiritual</li>
                    </ul>
                  </div>
                </div>
              ) : (
                <div className="episode-transcript">
                  <div className="transcript-controls">
                    <button className="transcript-btn">
                      <Download size={16} />
                      Descargar Transcript
                    </button>
                  </div>
                  <div className="transcript-content">
                    {transcriptSimulado.split('\n').map((line, index) => (
                      line.trim() && (
                        <div key={index} className="transcript-line">
                          {line.includes('[') ? (
                            <>
                              <span className="timestamp">{line.match(/\[.*?\]/)?.[0]}</span>
                              <span className="text">{line.replace(/\[.*?\]/, '').trim()}</span>
                            </>
                          ) : (
                            <span className="text">{line.trim()}</span>
                          )}
                        </div>
                      )
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Enlaces relacionados */}
          <div className="related-links">
            <h3>Enlaces de Interés</h3>
            <div className="links-grid">
              <a 
                href="https://www.youtube.com/@JuanCarlosAvilaElangeologo" 
                target="_blank" 
                rel="noopener noreferrer"
                className="related-link youtube"
              >
                <Youtube size={20} />
                Canal de YouTube
                <ChevronRight size={16} />
              </a>
              <Link to="/podcast" className="related-link">
                <Play size={20} />
                Más Episodios
                <ChevronRight size={16} />
              </Link>
              <Link to="/blog" className="related-link">
                <Sparkles size={20} />
                Artículos Relacionados
                <ChevronRight size={16} />
              </Link>
            </div>
          </div>

          {/* Sección de inspiración */}
          <div className="inspiration-section-episode">
            <div className="inspiration-content">
              <h3 className="inspiration-title">
                <Sparkles size={28} />
                Mensaje Angelical
              </h3>
              <p className="inspiration-text">
                "Este episodio llega a ti en el momento perfecto. Cada palabra, cada vibración, 
                está alineada con tu proceso de crecimiento espiritual. Permite que esta sabiduría 
                angelical despierte nuevas comprensiones en tu ser y te guíe hacia la luz que ya eres."
              </p>
              <div className="inspiration-signature">
                — Canalización del Arcángel Gabriel
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modal de compartir */}
      {showShareModal && (
        <div className="share-modal-overlay" onClick={() => setShowShareModal(false)}>
          <div className="share-modal" onClick={(e) => e.stopPropagation()}>
            <h3>Compartir Episodio</h3>
            <div className="share-buttons">
              <button onClick={() => handleShare('facebook')} className="share-btn facebook">
                <span>📘</span> Facebook
              </button>
              <button onClick={() => handleShare('twitter')} className="share-btn twitter">
                <span>🐦</span> Twitter
              </button>
              <button onClick={() => handleShare('whatsapp')} className="share-btn whatsapp">
                <span>💬</span> WhatsApp
              </button>
              <button onClick={() => handleShare('linkedin')} className="share-btn linkedin">
                <span>💼</span> LinkedIn
              </button>
              <button onClick={() => handleShare('telegram')} className="share-btn telegram">
                <span>✈️</span> Telegram
              </button>
              <button onClick={() => handleShare('copy')} className="share-btn copy">
                <span>📋</span> Copiar enlace
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal de suscripción */}
      {showSubscribeModal && (
        <div className="subscribe-modal">
          <div className="modal-content">
            <div className="modal-icon">
              <Bell size={32} />
            </div>
            <h3>¡Suscripción Exitosa!</h3>
            <p>Recibirás notificaciones de nuevos episodios.</p>
          </div>
        </div>
      )}
      
      <FooterLegal />
    </div>
  );
};

export default EpisodioDetalle;