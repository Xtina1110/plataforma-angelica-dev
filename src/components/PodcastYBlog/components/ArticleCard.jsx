import React from 'react';
import { Link } from 'react-router-dom';
import { Calendar, User, BookOpen } from 'lucide-react';

const ArticleCard = ({ articulo, formatearFecha }) => (
  <Link 
    to={`/blog/articulo/${articulo.id}`}
    className="article-card group"
    style={{ textDecoration: 'none' }}
  >
    <div className="relative overflow-hidden">
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
      <div className="absolute inset-0 bg-black bg-opacity-20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
    </div>

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
          <User size={16} />
          {articulo.autor}
        </div>
      </div>

      <button className="card-button">
        <BookOpen size={18} />
        Leer más
      </button>
    </div>
  </Link>
);

export default ArticleCard;