import React from 'react';
import { Search, TrendingUp, Clock, Eye, BookOpen, Sparkles, Award, Users } from 'lucide-react';
import './BlogSidebar.css';

const BlogSidebar = ({ articulosPopulares = [], articulosRecientes = [], onArticuloClick }) => {
  
  // Cursos destacados de la Academia Angélica
  const cursosDestacados = [
    {
      id: 'medium-angelical',
      titulo: 'Medium Angelical Certificado',
      imagen: 'https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=300&h=200&fit=crop',
      precio: '$297',
      estudiantes: 1250,
      rating: 4.9,
      badge: 'Bestseller'
    },
    {
      id: 'tarot-angelical',
      titulo: 'Tarot Angelical Profesional',
      imagen: 'https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=300&h=200&fit=crop',
      precio: '$197',
      estudiantes: 890,
      rating: 4.8,
      badge: 'Popular'
    },
    {
      id: 'canalizacion-avanzada',
      titulo: 'Canalización Avanzada',
      imagen: 'https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=300&h=200&fit=crop',
      precio: '$347',
      estudiantes: 650,
      rating: 5.0,
      badge: 'Nuevo'
    }
  ];

  // Categorías principales
  const categorias = [
    { nombre: 'Guías Espirituales', count: 24, color: '#9333ea' },
    { nombre: 'Arcángeles', count: 18, color: '#d4af37' },
    { nombre: 'Herramientas', count: 15, color: '#ec4899' },
    { nombre: 'Testimonios', count: 12, color: '#10b981' }
  ];

  return (
    <aside className="blog-sidebar">
      {/* Search Box */}
      <div className="sidebar-section search-section">
        <div className="search-box">
          <Search size={20} className="search-icon" />
          <input 
            type="text" 
            placeholder="Buscar artículos..." 
            className="search-input"
          />
        </div>
      </div>

      {/* Categories */}
      <div className="sidebar-section">
        <h3 className="sidebar-title">
          <BookOpen size={20} />
          Categorías
        </h3>
        <div className="categories-list">
          {categorias.map((categoria, index) => (
            <button 
              key={index} 
              className="category-item"
              style={{ '--category-color': categoria.color }}
            >
              <span className="category-name">{categoria.nombre}</span>
              <span className="category-count">{categoria.count}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Cursos Destacados */}
      <div className="sidebar-section courses-section">
        <h3 className="sidebar-title">
          <Award size={20} />
          Cursos Destacados
        </h3>
        <div className="courses-list">
          {cursosDestacados.map((curso) => (
            <div key={curso.id} className="course-card">
              <div className="course-image-container">
                <img 
                  src={curso.imagen} 
                  alt={curso.titulo}
                  className="course-image"
                />
                <div className="course-badge">{curso.badge}</div>
              </div>
              <div className="course-info">
                <h4 className="course-title">{curso.titulo}</h4>
                <div className="course-meta">
                  <div className="course-rating">
                    <Sparkles size={14} fill="currentColor" />
                    <span>{curso.rating}</span>
                  </div>
                  <div className="course-students">
                    <Users size={14} />
                    <span>{curso.estudiantes}</span>
                  </div>
                </div>
                <div className="course-footer">
                  <span className="course-price">{curso.precio}</span>
                  <button className="course-btn">Ver Curso</button>
                </div>
              </div>
            </div>
          ))}
        </div>
        <button className="sidebar-cta-btn">
          <Award size={18} />
          Ver Todos los Cursos
        </button>
      </div>

      {/* Artículos Populares */}
      <div className="sidebar-section">
        <h3 className="sidebar-title">
          <TrendingUp size={20} />
          Más Populares
        </h3>
        <div className="popular-articles-list">
          {articulosPopulares.slice(0, 5).map((articulo, index) => (
            <div 
              key={articulo.id} 
              className="popular-article-item"
              onClick={() => onArticuloClick && onArticuloClick(articulo)}
            >
              <div className="popular-number">{index + 1}</div>
              <div className="popular-image">
                <img src={articulo.imagen} alt={articulo.titulo} />
              </div>
              <div className="popular-info">
                <h4 className="popular-title">{articulo.titulo}</h4>
                <div className="popular-meta">
                  <span className="meta-item">
                    <Eye size={12} />
                    {articulo.vistas?.toLocaleString()}
                  </span>
                  <span className="meta-item">
                    <Clock size={12} />
                    {articulo.tiempoLectura}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Artículos Recientes */}
      <div className="sidebar-section">
        <h3 className="sidebar-title">
          <Clock size={20} />
          Recientes
        </h3>
        <div className="recent-articles-list">
          {articulosRecientes.slice(0, 5).map((articulo) => (
            <div 
              key={articulo.id} 
              className="recent-article-item"
              onClick={() => onArticuloClick && onArticuloClick(articulo)}
            >
              <div className="recent-image">
                <img src={articulo.imagen} alt={articulo.titulo} />
              </div>
              <div className="recent-info">
                <h4 className="recent-title">{articulo.titulo}</h4>
                <div className="recent-meta">
                  <span>{new Date(articulo.fecha).toLocaleDateString('es-ES', { 
                    day: 'numeric', 
                    month: 'short' 
                  })}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Newsletter Signup */}
      <div className="sidebar-section newsletter-section">
        <div className="newsletter-card">
          <Sparkles size={32} className="newsletter-icon" />
          <h3 className="newsletter-title">Boletín Angelical</h3>
          <p className="newsletter-description">
            Recibe sabiduría angelical directamente en tu correo cada semana
          </p>
          <form className="newsletter-form">
            <input 
              type="email" 
              placeholder="Tu email" 
              className="newsletter-input"
              required
            />
            <button type="submit" className="newsletter-btn">
              Suscribirme
            </button>
          </form>
          <p className="newsletter-privacy">
            🔒 Tu información está segura. Sin spam.
          </p>
        </div>
      </div>
    </aside>
  );
};

export default BlogSidebar;

