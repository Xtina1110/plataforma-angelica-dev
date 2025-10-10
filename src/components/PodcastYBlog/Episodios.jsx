import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Calendar, Play, Clock, Sparkles, Youtube, Bell, 
  Filter, Search, Grid, List, TrendingUp, Users,
  ChevronDown, ArrowRight, Star, Heart, Share2
} from 'lucide-react';
import { supabase } from '../../integrations/supabase/client';
import BlogHeader from '../headers/BlogHeader';
import FooterLegal from '../FooterLegal';
import './PodcastYBlog.css';
import heroBg from '../../assets/angel-music-background.jpg';

const SkeletonCard = () => (
  <div className="skeleton-card">
    <div className="skeleton-image"></div>
    <div className="skeleton-content">
      <div className="skeleton-title"></div>
      <div className="skeleton-text"></div>
      <div className="skeleton-text short"></div>
    </div>
  </div>
);

const Episodios = () => {
  const navigate = useNavigate();
  const [episodios, setEpisodios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [user, setUser] = useState(null);
  
  const [sortBy, setSortBy] = useState('numero');
  const [viewMode, setViewMode] = useState('grid');
  const [showSubscribeModal, setShowSubscribeModal] = useState(false);

  useEffect(() => {
    const getUser = async () => {
      const { data } = await supabase.auth.getSession();
      setUser(data?.session?.user);
    };
    getUser();
    cargarEpisodios();
  }, []);

  const cargarEpisodios = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('episodios_podcast')
        .select('*')
        .order(sortBy, { ascending: false });

      if (error) throw error;
      setEpisodios(data || []);
    } catch (error) {
      console.error('Error al cargar episodios:', error);
      setError('Error al cargar los episodios del podcast');
    } finally {
      setLoading(false);
    }
  };


  const formatearFecha = (fecha) => {
    return new Date(fecha).toLocaleDateString('es-ES', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };

  useEffect(() => {
    document.title = 'Podcast Angélico — Últimos episodios';
  }, []);
  const handleNavigateHome = () => navigate('/dashboard');
  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/');
  };

  const handleSubscribe = () => {
    setShowSubscribeModal(true);
    // Aquí iría la lógica de suscripción real
    setTimeout(() => setShowSubscribeModal(false), 2000);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <BlogHeader 
          user={user}
          onNavigateHome={handleNavigateHome}
          onLogout={handleLogout}
        />
        <div className="podcast-blog-container flex-1">
          <div className="podcast-hero">
            <div className="hero-content">
              <h1 className="hero-title">
                <Sparkles className="inline-block mr-3" size={32} />
                Podcast Angélico
              </h1>
              <p className="hero-subtitle">
                Cargando episodios de sabiduría espiritual...
              </p>
            </div>
          </div>
          
          <div className="cards-grid">
            {[...Array(6)].map((_, index) => (
              <SkeletonCard key={index} />
            ))}
          </div>
        </div>
        <FooterLegal />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex flex-col">
        <BlogHeader 
          user={user}
          onNavigateHome={handleNavigateHome}
          onLogout={handleLogout}
        />
        <div className="podcast-blog-container flex-1">
          <div className="empty-state">
            <div className="empty-state-icon">⚠️</div>
            <h2 className="empty-state-title">Error</h2>
            <p className="empty-state-text">{error}</p>
          </div>
        </div>
        <FooterLegal />
      </div>
    );
  }

  if (episodios.length === 0) {
    return (
      <div className="min-h-screen flex flex-col">
        <BlogHeader 
          user={user}
          onNavigateHome={handleNavigateHome}
          onLogout={handleLogout}
        />
        <div className="podcast-blog-container flex-1">
          <div className="podcast-hero">
            <div className="hero-content">
              <h1 className="hero-title">
                <Sparkles className="inline-block mr-3" size={32} />
                Podcast Angélico
              </h1>
              <p className="hero-subtitle">
                Episodios de sabiduría espiritual y canalización angelical
              </p>
            </div>
          </div>
          
          <div className="empty-state">
            <div className="empty-state-icon">🎙️</div>
            <h2 className="empty-state-title">Próximamente</h2>
            <p className="empty-state-text">
              Los episodios del podcast estarán disponibles muy pronto. 
              Mantente conectado para recibir mensajes angelicales únicos.
            </p>
          </div>
        </div>
        <FooterLegal />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <BlogHeader 
        user={user}
        onNavigateHome={handleNavigateHome}
        onLogout={handleLogout}
      />
      
      <div className="podcast-blog-container flex-1">
        {/* Hero Section Mejorada */}
        <div className="podcast-hero hero-diagonal" style={{ backgroundImage: `url(${heroBg})` }}>
          <div className="hero-content">
            <div className="hero-badge">
              <Star size={16} />
              Contenido Premium
            </div>
            <h1 className="hero-title">
              <Sparkles className="inline-block mr-3" size={32} />
              Podcast Angélico
            </h1>
            <p className="hero-subtitle">
              Episodios de sabiduría espiritual y canalización angelical. 
              Conecta con tu esencia divina a través de mensajes celestiales únicos.
            </p>
            
            <div className="hero-stats">
              <div className="stat-item">
                <span className="stat-number">{episodios.length}</span>
                <span className="stat-label">Episodios</span>
              </div>
              <div className="stat-item">
                <span className="stat-number">15.2K</span>
                <span className="stat-label">Suscriptores</span>
              </div>
              <div className="stat-item">
                <span className="stat-number">4.9</span>
                <span className="stat-label">⭐ Rating</span>
              </div>
            </div>
            
            <div className="hero-actions">
              <a 
                href="https://www.youtube.com/@JuanCarlosAvilaElangeologo" 
                target="_blank" 
                rel="noopener noreferrer"
                className="youtube-button-hero"
              >
                <Youtube size={20} />
                Ver en YouTube
              </a>
              <button onClick={handleSubscribe} className="subscribe-button-hero">
                <Bell size={20} />
                Suscribirse Gratis
              </button>
            </div>
          </div>
        </div>

        {/* New Episode Alert */}
        {episodios[0] && (
          <div className="new-episode-alert">
            <div className="alert-content">
              <div className="alert-icon">
                <Bell className="animate-pulse" size={20} />
              </div>
              <div className="alert-text">
                <span className="alert-title">¡Nuevo Episodio Disponible!</span>
                <span className="alert-subtitle">
                  Episodio {episodios[0].numero}: {episodios[0].titulo}
                </span>
              </div>
              <Link to={`/podcast/episodio/${episodios[0].id}`} className="alert-button">
                <Play size={16} />
                Escuchar Ahora
              </Link>
            </div>
          </div>
        )}

        {/* Controles de Filtrado y Vista */}
        <div className="content-controls">          
          <div className="filter-section">
            <div className="sort-dropdown">
              <Filter size={18} />
              <select 
                value={sortBy} 
                onChange={(e) => setSortBy(e.target.value)}
                className="sort-select"
              >
                <option value="numero">Más recientes</option>
                <option value="fecha_publicacion">Por fecha</option>
                <option value="titulo">Alfabético</option>
              </select>
            </div>
            
            <div className="view-toggle">
              <button 
                onClick={() => setViewMode('grid')}
                className={`view-button ${viewMode === 'grid' ? 'active' : ''}`}
              >
                <Grid size={18} />
              </button>
              <button 
                onClick={() => setViewMode('list')}
                className={`view-button ${viewMode === 'list' ? 'active' : ''}`}
              >
                <List size={18} />
              </button>
            </div>
          </div>
        </div>

        {/* Últimos episodios */}
        <div className="content-section-header">
          <div className="section-info">
            <h2 className="content-section-title">Últimos episodios</h2>
            <p className="content-section-subtitle">Explora las enseñanzas más recientes del Podcast Angélico.</p>
          </div>
        </div>

        <div className={`episodes-container ${viewMode}`}>
          {episodios.map((episodio) => (
            <Link 
              key={episodio.id} 
              to={`/podcast/episodio/${episodio.id}`}
              className="episode-card-enhanced"
            >
              <div className="card-image-container">
                <img 
                  src={heroBg}
                  alt={episodio.titulo}
                  className="card-image"
                />
                
                <div className="episode-badge-enhanced">
                  EP {episodio.numero}
                </div>
                
                <div className="play-overlay-enhanced">
                  <Play size={32} />
                </div>
                
                <div className="card-actions">
                  <button className="action-button" onClick={(e) => { e.preventDefault(); /* Lógica de favorito */ }}>
                    <Heart size={16} />
                  </button>
                  <button className="action-button" onClick={(e) => { e.preventDefault(); /* Lógica de compartir */ }}>
                    <Share2 size={16} />
                  </button>
                </div>
              </div>
              
              <div className="card-content-enhanced">
                <div className="card-header">
                  <h3 className="card-title-enhanced">{episodio.titulo}</h3>
                  <div className="episode-duration">
                    <Clock size={14} />
                    {episodio.duracion || '30'} min
                  </div>
                </div>
                
                <p className="card-excerpt-enhanced">
                  {episodio.descripcion.length > 150 
                    ? `${episodio.descripcion.substring(0, 150)}...`
                    : episodio.descripcion
                  }
                </p>

                <div className="card-meta-enhanced">
                  <div className="meta-left">
                    <div className="meta-item">
                      <Calendar size={14} />
                      {formatearFecha(episodio.fecha_publicacion)}
                    </div>
                  </div>
                  <div className="meta-right">
                    <div className="episode-stats">
                      <span className="stat">
                        <TrendingUp size={12} />
                        2.3K views
                      </span>
                    </div>
                  </div>
                </div>

                <div className="card-footer">
                  <button className="listen-button">
                    <Play size={16} />
                    Escuchar Episodio
                    <ArrowRight size={14} />
                  </button>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* Sección de Inspiración */}
        <div className="inspiration-section-podcast">
          <div className="inspiration-content">
            <h3 className="inspiration-title">
              <Sparkles size={28} />
              Inspiración Angelical
            </h3>
            <p className="inspiration-text">
              "Los ángeles nos hablan a través de la frecuencia del amor. 
              Cada episodio es una oportunidad para conectar con tu esencia divina 
              y recibir la guía celestial que tu alma necesita en este momento perfecto."
            </p>
            <div className="inspiration-signature">
              — Canalización Angelical
            </div>
          </div>
        </div>

        {/* Suscription Call-to-Action */}
        <div className="subscription-cta">
          <div className="cta-content">
            <h3 className="cta-title">¿No te quieres perder ningún episodio?</h3>
            <p className="cta-text">
              Suscríbete a nuestro podcast y recibe notificaciones de nuevos episodios directamente en tu dispositivo.
            </p>
            <div className="cta-buttons">
              <button onClick={handleSubscribe} className="cta-button primary">
                <Bell size={18} />
                Suscribirse al Podcast
              </button>
              <Link to="/podcast-blog" className="cta-button secondary">
                <ArrowRight size={18} />
                Ver Dashboard Principal
              </Link>
            </div>
          </div>
        </div>
      </div>
      
      {/* Modal de Suscripción */}
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

export default Episodios;