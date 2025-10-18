import React from 'react';
import { Clock, Eye, ArrowRight, Sparkles } from 'lucide-react';
import './RelatedArticles.css';

const RelatedArticles = ({ articuloActual, todosArticulos, onArticuloClick }) => {
  
  // Algoritmo para seleccionar artículos relacionados
  const getRelatedArticles = () => {
    if (!articuloActual || !todosArticulos) return [];
    
    // Filtrar artículos excluyendo el actual
    const otrosArticulos = todosArticulos.filter(a => a.id !== articuloActual.id);
    
    // Puntuación de relevancia
    const articulosConPuntuacion = otrosArticulos.map(articulo => {
      let puntuacion = 0;
      
      // Misma categoría: +10 puntos
      if (articulo.categoria === articuloActual.categoria) {
        puntuacion += 10;
      }
      
      // Tags compartidos: +5 puntos por tag
      const tagsCompartidos = articulo.tags?.filter(tag => 
        articuloActual.tags?.includes(tag)
      ).length || 0;
      puntuacion += tagsCompartidos * 5;
      
      // Mismo autor: +3 puntos
      if (articulo.autor === articuloActual.autor) {
        puntuacion += 3;
      }
      
      // Artículos destacados: +2 puntos
      if (articulo.destacado) {
        puntuacion += 2;
      }
      
      return { ...articulo, puntuacion };
    });
    
    // Ordenar por puntuación y tomar los primeros 3
    return articulosConPuntuacion
      .sort((a, b) => b.puntuacion - a.puntuacion)
      .slice(0, 3);
  };

  const articulosRelacionados = getRelatedArticles();

  if (articulosRelacionados.length === 0) {
    return null;
  }

  return (
    <section className="related-articles-section">
      <div className="related-articles-header">
        <div className="header-content">
          <Sparkles size={28} className="header-icon" />
          <div>
            <h2 className="related-title">También te puede interesar</h2>
            <p className="related-subtitle">
              Artículos relacionados seleccionados especialmente para ti
            </p>
          </div>
        </div>
        <div className="header-decoration" />
      </div>

      <div className="related-articles-grid">
        {articulosRelacionados.map((articulo, index) => (
          <article 
            key={articulo.id} 
            className="related-article-card"
            onClick={() => onArticuloClick && onArticuloClick(articulo)}
            style={{ animationDelay: `${index * 0.1}s` }}
          >
            {/* Image */}
            <div className="related-article-image-container">
              <img 
                src={articulo.imagen} 
                alt={articulo.titulo}
                className="related-article-image"
              />
              <div className="related-article-overlay" />
              
              {/* Category Badge */}
              <div className="related-category-badge">
                {articulo.categoria}
              </div>
            </div>

            {/* Content */}
            <div className="related-article-content">
              {/* Title */}
              <h3 className="related-article-title">
                {articulo.titulo}
              </h3>

              {/* Summary */}
              <p className="related-article-summary">
                {articulo.resumen}
              </p>

              {/* Meta */}
              <div className="related-article-meta">
                <div className="meta-items">
                  <span className="meta-item">
                    <Clock size={14} />
                    {articulo.tiempoLectura}
                  </span>
                  <span className="meta-item">
                    <Eye size={14} />
                    {articulo.vistas?.toLocaleString()}
                  </span>
                </div>
                
                <button className="related-read-more">
                  Leer más
                  <ArrowRight size={16} />
                </button>
              </div>
            </div>

            {/* Hover Border Effect */}
            <div className="related-card-border" />
          </article>
        ))}
      </div>
    </section>
  );
};

export default RelatedArticles;

