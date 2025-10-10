import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, Calendar, User, BookOpen, Sparkles, Share2, 
  Download, Heart, Bookmark, Clock, Eye, MessageCircle,
  Facebook, Twitter, MessageSquare, Linkedin, Copy, Link as LinkIcon
} from 'lucide-react';
import { supabase } from '../../integrations/supabase/client';
import BlogHeader from '../headers/BlogHeader';
import FooterLegal from '../FooterLegal';
import { 
  shareOnFacebook, shareOnTwitter, shareOnWhatsApp, 
  shareOnLinkedIn, shareOnTelegram, copyToClipboard,
  generatePDF, formatFileName, showNotification, getCurrentUrl 
} from '../../utils/shareUtils';
import './PodcastYBlog.css';

const BlogDetalle = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [articulo, setArticulo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [user, setUser] = useState(null);
  const [showShareModal, setShowShareModal] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);
  const [readingTime, setReadingTime] = useState(0);

  useEffect(() => {
    const getUser = async () => {
      const { data } = await supabase.auth.getSession();
      setUser(data?.session?.user);
    };
    getUser();
    cargarArticulo();
  }, [id]);

  useEffect(() => {
    if (articulo?.contenido) {
      // Calcular tiempo de lectura (aprox 200 palabras por minuto)
      const wordCount = articulo.contenido.split(' ').length;
      const minutes = Math.ceil(wordCount / 200);
      setReadingTime(minutes);
    }
  }, [articulo]);

  const cargarArticulo = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('articulos_blog')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;
      setArticulo(data);
    } catch (error) {
      console.error('Error al cargar artículo:', error);
      setError('Artículo no encontrado');
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

  const handleNavigateHome = () => navigate('/dashboard');
  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/');
  };

  const handleShare = (platform) => {
    const url = getCurrentUrl();
    const title = `📖 ${articulo.titulo}`;
    const hashtags = 'PlataformaAngelica,EspiritualidadFull,CrecimientoEspiritual';

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
        shareOnLinkedIn(url, title, articulo.resumen);
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

  const handleDownloadPDF = async () => {
    setIsGeneratingPDF(true);
    try {
      const fileName = formatFileName(articulo.titulo, 'articulo');
      const success = await generatePDF(
        'article-content', 
        fileName, 
        articulo.titulo, 
        articulo.autor, 
        formatearFecha(articulo.fecha)
      );
      
      if (success) {
        showNotification('PDF generado exitosamente', 'success');
      } else {
        showNotification('Error al generar PDF', 'error');
      }
    } catch (error) {
      console.error('Error:', error);
      showNotification('Error al generar PDF', 'error');
    } finally {
      setIsGeneratingPDF(false);
    }
  };

  const procesarContenido = (contenido) => {
    if (contenido.includes('<')) {
      return { __html: contenido };
    }
    
    let procesado = contenido
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.*?)\*/g, '<em>$1</em>')
      .replace(/\n\n/g, '</p><p>')
      .replace(/\n/g, '<br>');
    
    return { __html: `<p>${procesado}</p>` };
  };

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
            <p>Cargando artículo espiritual...</p>
          </div>
        </div>
        <FooterLegal />
      </div>
    );
  }

  if (error || !articulo) {
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
            <h2 className="empty-state-title">Artículo no encontrado</h2>
            <p className="empty-state-text">
              No pudimos encontrar el artículo que buscas.
            </p>
            <Link to="/blog" className="back-button" style={{ marginTop: '2rem' }}>
              <ArrowLeft size={20} />
              Volver al blog
            </Link>
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
      
      <div className="detail-container flex-1">
        <div className="article-detail-content">
          {/* Header del artículo */}
          <div className="article-detail-header">
            <div className="header-nav">
              <Link to="/blog" className="back-button-enhanced">
                <ArrowLeft size={18} />
                Volver al blog
              </Link>
              
              <div className="article-actions">
                <button onClick={handleFavorite} className={`action-btn ${isFavorite ? 'active' : ''}`}>
                  <Heart size={18} fill={isFavorite ? 'currentColor' : 'none'} />
                </button>
                <button onClick={() => setShowShareModal(true)} className="action-btn">
                  <Share2 size={18} />
                </button>
                <button 
                  onClick={handleDownloadPDF} 
                  className="action-btn download"
                  disabled={isGeneratingPDF}
                >
                  <Download size={18} />
                  {isGeneratingPDF ? 'Generando...' : 'PDF'}
                </button>
              </div>
            </div>

            {/* Información del artículo */}
            <div className="article-info">
              <div className="article-category">
                Artículo Espiritual
              </div>
              <h1 className="article-title-detail">{articulo.titulo}</h1>
              <p className="article-summary">{articulo.resumen}</p>
              
              <div className="article-meta-detail">
                <div className="meta-item">
                  <User size={18} />
                  {articulo.autor}
                </div>
                <div className="meta-item">
                  <Calendar size={18} />
                  {formatearFecha(articulo.fecha)}
                </div>
                <div className="meta-item">
                  <Clock size={18} />
                  {readingTime} min de lectura
                </div>
                <div className="meta-item">
                  <Eye size={18} />
                  1.8K lecturas
                </div>
              </div>
            </div>
          </div>

          {/* Imagen destacada */}
          {articulo.imagen && (
            <div className="article-featured-image">
              <img 
                src={articulo.imagen} 
                alt={articulo.titulo}
                className="featured-image"
              />
            </div>
          )}

          {/* Contenido del artículo */}
          <div id="article-content" className="article-content-section">
            <div 
              className="article-text" 
              dangerouslySetInnerHTML={procesarContenido(articulo.contenido)}
            />
          </div>

          {/* Tags y categorías */}
          <div className="article-tags">
            <h4>Temas relacionados:</h4>
            <div className="tags-list">
              <span className="tag">🔮 Espiritualidad</span>
              <span className="tag">✨ Crecimiento Personal</span>
              <span className="tag">🙏 Meditación</span>
              <span className="tag">💫 Ángeles</span>
              <span className="tag">🌟 Transformación</span>
            </div>
          </div>

          {/* Compartir rápido */}
          <div className="quick-share-section">
            <h4>¿Te gustó este artículo? ¡Compártelo!</h4>
            <div className="quick-share-buttons">
              <button onClick={() => handleShare('facebook')} className="quick-share-btn facebook">
                <span>📘</span>
              </button>
              <button onClick={() => handleShare('twitter')} className="quick-share-btn twitter">
                <span>🐦</span>
              </button>
              <button onClick={() => handleShare('whatsapp')} className="quick-share-btn whatsapp">
                <span>💬</span>
              </button>
              <button onClick={() => handleShare('linkedin')} className="quick-share-btn linkedin">
                <span>💼</span>
              </button>
            </div>
          </div>

          {/* Artículos relacionados simulados */}
          <div className="related-articles">
            <h3>Artículos Relacionados</h3>
            <div className="related-grid">
              <Link to="/blog" className="related-article-card">
                <div className="related-image-placeholder">
                  <BookOpen size={24} />
                </div>
                <div className="related-content">
                  <h4>La Sabiduría de los Arcángeles</h4>
                  <p>Descubre los mensajes celestiales...</p>
                </div>
              </Link>
              <Link to="/blog" className="related-article-card">
                <div className="related-image-placeholder">
                  <Sparkles size={24} />
                </div>
                <div className="related-content">
                  <h4>Meditación Angelical Profunda</h4>
                  <p>Técnicas avanzadas de conexión...</p>
                </div>
              </Link>
            </div>
          </div>

          {/* Sección de inspiración */}
          <div className="inspiration-section-article">
            <div className="inspiration-content">
              <h3 className="inspiration-title">
                <Sparkles size={28} />
                Reflexión Angelical
              </h3>
              <p className="inspiration-text">
                "Cada artículo es una semilla de luz plantada en tu conciencia. 
                Permite que estas palabras florezcan en tu corazón y te guíen 
                hacia nuevos niveles de comprensión espiritual. Tu alma reconoce la verdad 
                que resuena en estas líneas."
              </p>
              <div className="inspiration-signature">
                — Mensaje Canalizado del Arcángel Uriel
              </div>
            </div>
          </div>

          {/* Call to action de suscripción */}
          <div className="subscription-cta-article">
            <div className="cta-content">
              <h3>¿Te inspiró este artículo?</h3>
              <p>Suscríbete a nuestro blog y recibe contenido espiritual directamente en tu correo.</p>
              <button className="cta-button">
                <BookOpen size={18} />
                Suscribirse al Blog
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Modal de compartir */}
      {showShareModal && (
        <div className="share-modal-overlay" onClick={() => setShowShareModal(false)}>
          <div className="share-modal" onClick={(e) => e.stopPropagation()}>
            <h3>Compartir Artículo</h3>
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
      
      <FooterLegal />
    </div>
  );
};

export default BlogDetalle;