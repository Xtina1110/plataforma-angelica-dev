import React, { useState, useEffect } from 'react';
import { 
  ArrowLeft, Share2, Bookmark, Eye, Clock, Calendar, User, Tag,
  Facebook, Twitter, Linkedin, Link as LinkIcon, Heart, MessageCircle,
  Printer, Download, Sparkles
} from 'lucide-react';
import BlogSidebar from './BlogSidebar';
import RelatedArticles from './RelatedArticles';
import CommentsSection from './CommentsSection';
import './BlogArticleView.css';

const BlogArticleView = ({ articulo, todosArticulos, onVolver, onArticuloClick }) => {
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [showShareMenu, setShowShareMenu] = useState(false);
  const [readingProgress, setReadingProgress] = useState(0);

  // Scroll progress tracking
  useEffect(() => {
    const handleScroll = () => {
      const windowHeight = window.innerHeight;
      const documentHeight = document.documentElement.scrollHeight;
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
      const progress = (scrollTop / (documentHeight - windowHeight)) * 100;
      setReadingProgress(Math.min(progress, 100));
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Scroll to top on mount
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [articulo.id]);

  // Share functions
  const handleShare = (platform) => {
    const url = window.location.href;
    const text = articulo.titulo;
    
    const shareUrls = {
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
      twitter: `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`,
      linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`,
    };

    if (platform === 'copy') {
      navigator.clipboard.writeText(url);
      alert('¡Enlace copiado al portapapeles!');
    } else {
      window.open(shareUrls[platform], '_blank', 'width=600,height=400');
    }
    
    setShowShareMenu(false);
  };

  // Print article
  const handlePrint = () => {
    window.print();
  };

  // Get category color
  const getCategoryColor = (categoria) => {
    const colors = {
      'Guías Espirituales': '#9333ea',
      'Herramientas Espirituales': '#ec4899',
      'Arcángeles': '#d4af37',
      'Testimonios': '#10b981',
      'default': '#6366f1'
    };
    return colors[categoria] || colors.default;
  };

  const categoryColor = getCategoryColor(articulo.categoria);

  // Artículos para sidebar
  const articulosPopulares = todosArticulos
    ?.sort((a, b) => (b.vistas || 0) - (a.vistas || 0))
    .slice(0, 5) || [];
  
  const articulosRecientes = todosArticulos
    ?.sort((a, b) => new Date(b.fecha) - new Date(a.fecha))
    .slice(0, 5) || [];

  return (
    <div className="blog-article-view">
      {/* Reading Progress Bar */}
      <div className="reading-progress-bar" style={{ width: `${readingProgress}%` }} />

      {/* Header */}
      <header className="article-header">
        <div className="article-header-content">
          <button onClick={onVolver} className="btn-back">
            <ArrowLeft size={20} />
            Volver al Blog
          </button>

          <div className="article-actions">
            <button 
              className={`action-btn ${isBookmarked ? 'active' : ''}`}
              onClick={() => setIsBookmarked(!isBookmarked)}
              title="Guardar"
            >
              <Bookmark size={20} fill={isBookmarked ? 'currentColor' : 'none'} />
            </button>

            <div className="share-menu-container">
              <button 
                className="action-btn"
                onClick={() => setShowShareMenu(!showShareMenu)}
                title="Compartir"
              >
                <Share2 size={20} />
              </button>

              {showShareMenu && (
                <div className="share-menu">
                  <button onClick={() => handleShare('facebook')} className="share-option facebook">
                    <Facebook size={18} />
                    Facebook
                  </button>
                  <button onClick={() => handleShare('twitter')} className="share-option twitter">
                    <Twitter size={18} />
                    Twitter
                  </button>
                  <button onClick={() => handleShare('linkedin')} className="share-option linkedin">
                    <Linkedin size={18} />
                    LinkedIn
                  </button>
                  <button onClick={() => handleShare('copy')} className="share-option copy">
                    <LinkIcon size={18} />
                    Copiar enlace
                  </button>
                </div>
              )}
            </div>

            <button className="action-btn" onClick={handlePrint} title="Imprimir">
              <Printer size={20} />
            </button>
          </div>
        </div>
      </header>

      {/* Main Content with Sidebar */}
      <div className="article-layout">
        {/* Main Article */}
        <main className="article-main">
          {/* Hero Image */}
          <div className="article-hero-image">
            <img src={articulo.imagen} alt={articulo.titulo} />
            <div className="hero-overlay" />
            
            {/* Category Badge on Image */}
            <div 
              className="hero-category-badge"
              style={{ background: categoryColor }}
            >
              <Tag size={16} />
              {articulo.categoria}
            </div>
          </div>

          {/* Article Content */}
          <article className="article-content-container">
            {/* Title */}
            <h1 className="article-title">{articulo.titulo}</h1>

            {/* Meta Information */}
            <div className="article-meta">
              <div className="meta-left">
                <div className="meta-item">
                  <User size={18} />
                  <span>{articulo.autor}</span>
                </div>
                <div className="meta-item">
                  <Calendar size={18} />
                  <span>{new Date(articulo.fecha).toLocaleDateString('es-ES', { 
                    day: 'numeric', 
                    month: 'long', 
                    year: 'numeric' 
                  })}</span>
                </div>
                <div className="meta-item">
                  <Clock size={18} />
                  <span>{articulo.tiempoLectura}</span>
                </div>
              </div>

              <div className="meta-right">
                <div className="meta-stat">
                  <Eye size={18} />
                  <span>{articulo.vistas?.toLocaleString()}</span>
                </div>
                <div className="meta-stat">
                  <Heart size={18} />
                  <span>{articulo.likes?.toLocaleString()}</span>
                </div>
                <div className="meta-stat">
                  <MessageCircle size={18} />
                  <span>{articulo.comentarios || 0}</span>
                </div>
              </div>
            </div>

            {/* Tags */}
            {articulo.tags && articulo.tags.length > 0 && (
              <div className="article-tags">
                {articulo.tags.map((tag, index) => (
                  <span key={index} className="article-tag">
                    #{tag}
                  </span>
                ))}
              </div>
            )}

            {/* Summary/Excerpt */}
            <div className="article-summary">
              <Sparkles size={24} className="summary-icon" />
              <p>{articulo.resumen}</p>
            </div>

            {/* Main Content */}
            <div className="article-text">
              {/* Render content with proper formatting */}
              {articulo.contenido.split('\n\n').map((parrafo, index) => {
                // Check if it's a heading
                if (parrafo.startsWith('**') && parrafo.endsWith('**')) {
                  const heading = parrafo.replace(/\*\*/g, '');
                  return <h2 key={index} className="content-heading">{heading}</h2>;
                }
                
                // Check if it's an italic section
                if (parrafo.startsWith('*') && parrafo.endsWith('*')) {
                  const italic = parrafo.replace(/\*/g, '');
                  return <p key={index} className="content-italic">{italic}</p>;
                }
                
                // Regular paragraph
                return <p key={index} className="content-paragraph">{parrafo}</p>;
              })}
            </div>

            {/* Author Bio */}
            <div className="author-bio">
              <div className="author-avatar">
                {articulo.autor.split(' ').map(n => n[0]).join('').toUpperCase()}
              </div>
              <div className="author-info">
                <h3 className="author-name">Sobre {articulo.autor}</h3>
                <p className="author-description">
                  Medium angelical y guía espiritual con más de 15 años de experiencia ayudando a personas 
                  a conectar con sus ángeles guardianes y descubrir su propósito divino.
                </p>
                <div className="author-social">
                  <button className="author-social-btn">Seguir</button>
                  <button className="author-social-btn outline">Más artículos</button>
                </div>
              </div>
            </div>
          </article>

          {/* Related Articles */}
          <RelatedArticles
            articuloActual={articulo}
            todosArticulos={todosArticulos}
            onArticuloClick={onArticuloClick}
          />

          {/* Comments Section */}
          <CommentsSection
            articuloId={articulo.id}
            comentariosIniciales={[]}
          />
        </main>

        {/* Sidebar */}
        <aside className="article-sidebar">
          <BlogSidebar
            articulosPopulares={articulosPopulares}
            articulosRecientes={articulosRecientes}
            onArticuloClick={onArticuloClick}
          />
        </aside>
      </div>
    </div>
  );
};

export default BlogArticleView;

