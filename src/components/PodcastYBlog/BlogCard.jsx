import React, { useState } from 'react';
import { Heart, Clock, Eye, User, Tag, Calendar, TrendingUp } from 'lucide-react';
import './BlogCard.css';

const BlogCard = ({ articulo, esFavorito, onSeleccionar, onToggleFavorito, vista = 'grid' }) => {
  const [isHovered, setIsHovered] = useState(false);

  const getCategoryColor = (categoria) => {
    const colors = {
      'Guías Espirituales': { bg: '#9333ea', light: '#f3e8ff' },
      'Herramientas Espirituales': { bg: '#ec4899', light: '#fce7f3' },
      'Arcángeles': { bg: '#d4af37', light: '#fef3c7' },
      'Testimonios': { bg: '#10b981', light: '#d1fae5' },
      'default': { bg: '#6366f1', light: '#e0e7ff' }
    };
    return colors[categoria] || colors.default;
  };

  const categoryColor = getCategoryColor(articulo.categoria);

  return (
    <div 
      className={`blog-card-enhanced ${vista}`}
      onClick={() => onSeleccionar(articulo)}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Image Container with Overlay */}
      <div className="blog-card-image-container">
        <img 
          src={articulo.imagen} 
          alt={articulo.titulo}
          className="blog-card-image"
        />
        
        {/* Gradient Overlay */}
        <div className="blog-card-overlay" />
        
        {/* Category Badge */}
        <div 
          className="blog-card-category-badge"
          style={{ 
            background: categoryColor.bg,
            boxShadow: `0 4px 15px ${categoryColor.bg}40`
          }}
        >
          <Tag size={14} />
          {articulo.categoria}
        </div>
        
        {/* Favorite Button */}
        <button
          className={`blog-card-favorite-btn ${esFavorito ? 'active' : ''}`}
          onClick={(e) => {
            e.stopPropagation();
            onToggleFavorito(articulo);
          }}
        >
          <Heart 
            size={20} 
            fill={esFavorito ? 'currentColor' : 'none'}
            className="heart-icon"
          />
        </button>

        {/* Trending Indicator */}
        {articulo.destacado && (
          <div className="blog-card-trending">
            <TrendingUp size={16} />
            <span>Trending</span>
          </div>
        )}
      </div>

      {/* Content Container */}
      <div className="blog-card-content">
        {/* Meta Information */}
        <div className="blog-card-meta">
          <div className="meta-item">
            <User size={14} />
            <span>{articulo.autor}</span>
          </div>
          <div className="meta-item">
            <Calendar size={14} />
            <span>{new Date(articulo.fecha).toLocaleDateString('es-ES', { 
              day: 'numeric', 
              month: 'short', 
              year: 'numeric' 
            })}</span>
          </div>
        </div>

        {/* Title */}
        <h3 className="blog-card-title">
          {articulo.titulo}
        </h3>

        {/* Summary */}
        <p className="blog-card-summary">
          {articulo.resumen}
        </p>

        {/* Tags */}
        {articulo.tags && articulo.tags.length > 0 && (
          <div className="blog-card-tags">
            {articulo.tags.slice(0, 3).map((tag, index) => (
              <span 
                key={index} 
                className="blog-card-tag"
                style={{ background: categoryColor.light }}
              >
                #{tag}
              </span>
            ))}
          </div>
        )}

        {/* Footer Stats */}
        <div className="blog-card-footer">
          <div className="footer-stats">
            <div className="stat-item">
              <Clock size={14} />
              <span>{articulo.tiempoLectura}</span>
            </div>
            <div className="stat-item">
              <Eye size={14} />
              <span>{articulo.vistas?.toLocaleString() || 0}</span>
            </div>
            <div className="stat-item">
              <Heart size={14} />
              <span>{articulo.likes?.toLocaleString() || 0}</span>
            </div>
          </div>

          {/* Read More Button */}
          <button className="blog-card-read-more">
            Leer más →
          </button>
        </div>
      </div>

      {/* Hover Effect Border */}
      <div className="blog-card-border-glow" />
    </div>
  );
};

export default BlogCard;

