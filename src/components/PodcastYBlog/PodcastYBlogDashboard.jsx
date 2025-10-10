import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Play, BookOpen, Users, TrendingUp, Bell, Youtube, 
  Calendar, Clock, Sparkles, ArrowRight, Eye, Heart,
  Headphones, FileText, Star, ChevronRight
} from 'lucide-react';
import { supabase } from '../../integrations/supabase/client';
import BlogHeader from '../headers/BlogHeader';
import FooterLegal from '../FooterLegal';
import './PodcastYBlog.css';

const PodcastYBlogDashboard = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [episodios, setEpisodios] = useState([]);
  const [articulos, setArticulos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalEpisodios: 0,
    totalArticulos: 0,
    ultimoEpisodio: null,
    ultimoArticulo: null
  });

  useEffect(() => {
    const getUser = async () => {
      const { data } = await supabase.auth.getSession();
      setUser(data?.session?.user);
    };
    getUser();
    cargarContenido();
  }, []);

  const cargarContenido = async () => {
    try {
      setLoading(true);
      
      // Cargar últimos 3 episodios
      const { data: episodiosData } = await supabase
        .from('episodios_podcast')
        .select('*')
        .order('numero', { ascending: false })
        .limit(3);

      // Cargar últimos 3 artículos
      const { data: articulosData } = await supabase
        .from('articulos_blog')
        .select('*')
        .order('fecha', { ascending: false })
        .limit(3);

      // Cargar estadísticas
      const { count: totalEpisodios } = await supabase
        .from('episodios_podcast')
        .select('*', { count: 'exact', head: true });

      const { count: totalArticulos } = await supabase
        .from('articulos_blog')
        .select('*', { count: 'exact', head: true });

      setEpisodios(episodiosData || []);
      setArticulos(articulosData || []);
      setStats({
        totalEpisodios: totalEpisodios || 0,
        totalArticulos: totalArticulos || 0,
        ultimoEpisodio: episodiosData?.[0],
        ultimoArticulo: articulosData?.[0]
      });
    } catch (error) {
      console.error('Error al cargar contenido:', error);
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

  const handleNavigateHome = () => navigate('/dashboard');
  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/');
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
          <div className="section-header">
            <h1 className="section-title">
              <Sparkles className="inline-block mr-2" />
              Centro Angelical
            </h1>
            <p className="section-subtitle">
              Cargando contenido espiritual...
            </p>
          </div>
          
          <div className="cards-grid">
            {[...Array(6)].map((_, index) => (
              <div key={index} className="skeleton-card">
                <div className="skeleton-image"></div>
                <div className="skeleton-content">
                  <div className="skeleton-title"></div>
                  <div className="skeleton-text"></div>
                  <div className="skeleton-text short"></div>
                </div>
              </div>
            ))}
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
        {/* Hero Section del Dashboard */}
        <div className="section-header">
          <h1 className="section-title">
            <Sparkles className="inline-block mr-2" />
            Centro Angelical
          </h1>
          <p className="section-subtitle">
            Un espacio sagrado donde convergen la sabiduría angelical y la inspiración espiritual. 
            Prepárate para una experiencia transformadora a través de nuestros podcasts y artículos celestiales.
          </p>
        </div>

        {/* KPIs con diseño moderno */}
        <div className="dashboard-stats">
          <div className="cards-grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem', padding: '0 2rem 3rem', maxWidth: '1200px', margin: '0 auto' }}>
            <div className="stat-card">
              <div className="stat-icon">
                <Headphones size={24} />
              </div>
              <div className="stat-content">
                <span className="stat-number">{stats.totalEpisodios}</span>
                <span className="stat-label">Episodios Angelicales</span>
              </div>
            </div>
            
            <div className="stat-card">
              <div className="stat-icon">
                <FileText size={24} />
              </div>
              <div className="stat-content">
                <span className="stat-number">{stats.totalArticulos}</span>
                <span className="stat-label">Artículos Espirituales</span>
              </div>
            </div>
            
            <div className="stat-card">
              <div className="stat-icon">
                <Users size={24} />
              </div>
              <div className="stat-content">
                <span className="stat-number">15.2K</span>
                <span className="stat-label">Almas Conectadas</span>
              </div>
            </div>
            
            <div className="stat-card">
              <div className="stat-icon">
                <TrendingUp size={24} />
              </div>
              <div className="stat-content">
                <span className="stat-number">98.5%</span>
                <span className="stat-label">Satisfacción Espiritual</span>
              </div>
            </div>
          </div>
        </div>

        {/* New Episode Alert */}
        {stats.ultimoEpisodio && (
          <div className="new-episode-alert">
            <div className="alert-content">
              <div className="alert-icon">
                <Bell className="animate-pulse" size={20} />
              </div>
              <div className="alert-text">
                <span className="alert-title">¡Nuevo Episodio Disponible!</span>
                <span className="alert-subtitle">
                  Episodio {stats.ultimoEpisodio.numero}: {stats.ultimoEpisodio.titulo}
                </span>
              </div>
              <Link to={`/podcast/episodio/${stats.ultimoEpisodio.id}`} className="alert-button">
                <Play size={16} />
                Escuchar Ahora
              </Link>
            </div>
          </div>
        )}

        {/* Sección de Podcasts con diseño moderno */}
        <div className="content-section-header">
          <div className="section-info">
            <h2 className="content-section-title">
              <Headphones className="inline-block mr-2" />
              Últimos Episodios Angelicales
            </h2>
            <p className="content-section-subtitle">
              Conecta con la sabiduría celestial a través de nuestros episodios de canalización
            </p>
          </div>
          <div className="section-actions">
            <a 
              href="https://www.youtube.com/@JuanCarlosAvilaElangeologo" 
              target="_blank" 
              rel="noopener noreferrer"
              className="youtube-btn"
            >
              <Youtube size={18} />
              YouTube
            </a>
            <Link to="/podcast" className="view-all-btn">
              Ver Todos
              <ArrowRight size={16} />
            </Link>
          </div>
        </div>

        <div className="cards-grid">
          {episodios.map((episodio) => (
            <Link 
              key={episodio.id} 
              to={`/podcast/episodio/${episodio.id}`}
              className="episode-card-enhanced"
            >
              <div className="card-image-container">
                {episodio.imagen ? (
                  <img 
                    src={episodio.imagen} 
                    alt={episodio.titulo}
                    className="card-image"
                  />
                ) : (
                  <div className="card-image-placeholder">
                    <Play size={48} />
                  </div>
                )}
                <div className="episode-badge-enhanced">
                  EP {episodio.numero}
                </div>
                <div className="play-overlay-enhanced">
                  <Play size={32} />
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
                  {episodio.descripcion.length > 100 
                    ? `${episodio.descripcion.substring(0, 100)}...`
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

        {/* Sección de Blog con diseño moderno */}
        <div className="content-section-header">
          <div className="section-info">
            <h2 className="content-section-title">
              <BookOpen className="inline-block mr-2" />
              Últimos Artículos Espirituales
            </h2>
            <p className="content-section-subtitle">
              Reflexiones profundas y enseñanzas que nutren el alma y expanden la conciencia
            </p>
          </div>
          <div className="section-actions">
            <Link to="/blog" className="view-all-btn">
              Ver Todos
              <ArrowRight size={16} />
            </Link>
          </div>
        </div>

        <div className="cards-grid">
          {articulos.map((articulo) => (
            <Link 
              key={articulo.id} 
              to={`/blog/articulo/${articulo.id}`}
              className="article-card"
            >
              {articulo.imagen ? (
                <img 
                  src={articulo.imagen} 
                  alt={articulo.titulo}
                  className="card-image"
                />
              ) : (
                <div className="card-image-placeholder">
                  <BookOpen size={48} />
                </div>
              )}

              <div className="card-content">
                <h3 className="card-title">{articulo.titulo}</h3>
                
                <p className="card-excerpt">
                  {articulo.resumen.length > 120 
                    ? `${articulo.resumen.substring(0, 120)}...`
                    : articulo.resumen
                  }
                </p>

                <div className="card-meta">
                  <div className="card-date">
                    <Calendar size={16} />
                    {formatearFecha(articulo.fecha)}
                  </div>
                  <div className="card-author">
                    <BookOpen size={16} />
                    {articulo.autor}
                  </div>
                </div>

                <button className="card-button">
                  <BookOpen size={18} />
                  Leer más
                </button>
              </div>
            </Link>
          ))}
        </div>

        {/* Sección de Inspiración */}
        <div className="inspiration-section">
          <h3 className="inspiration-title">
            <Sparkles size={28} />
            Mensaje Angelical del Día
          </h3>
          <p className="inspiration-text">
            "Los ángeles te susurran verdades que tu alma ya conoce. A través de cada episodio y cada artículo, 
            permites que la luz divina ilumine nuevos aspectos de tu ser. Confía en el proceso, 
            pues cada paso en este camino espiritual te acerca más a tu esencia celestial."
          </p>
          <div className="inspiration-signature">
            — Canalización Angelical
          </div>
        </div>
      </div>
      
      <FooterLegal />
    </div>
  );
};

export default PodcastYBlogDashboard;