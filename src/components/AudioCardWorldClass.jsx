import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, Heart, ShoppingCart, Download, Check } from 'lucide-react';
import './AudioCardWorldClass.css';

const AudioCardWorldClass = ({ 
  audio, esActual, reproduciendo, esFavorito, esComprado, onReproducir, onToggleFavorito, 
  onComprar, onDescargar, vista, cargando, error, progreso, tiempoActual, duracion, 
  volumen, onCambiarVolumen, formatearTiempo 
}) => {
  const [previewing, setPreviewing] = useState(false);
  const [previewAudio, setPreviewAudio] = useState(null);
  const previewTimeoutRef = useRef(null);

  const handleMouseEnter = () => {
    if (audio.url && !esActual && !audio.premium) {
      const preview = new Audio(audio.url);
      preview.volume = 0.5;
      preview.currentTime = 0;
      preview.play().catch(err => console.log('Preview play failed:', err));
      setPreviewAudio(preview);
      setPreviewing(true);
      
      // Auto-stop after 30 seconds
      previewTimeoutRef.current = setTimeout(() => {
        if (preview) {
          preview.pause();
          preview.currentTime = 0;
        }
        setPreviewing(false);
      }, 30000);
    }
  };

  const handleMouseLeave = () => {
    if (previewAudio) {
      previewAudio.pause();
      previewAudio.currentTime = 0;
      setPreviewAudio(null);
    }
    if (previewTimeoutRef.current) {
      clearTimeout(previewTimeoutRef.current);
    }
    setPreviewing(false);
  };

  useEffect(() => {
    return () => {
      if (previewAudio) {
        previewAudio.pause();
        previewAudio.currentTime = 0;
      }
      if (previewTimeoutRef.current) {
        clearTimeout(previewTimeoutRef.current);
      }
    };
  }, [previewAudio]);

  return (
    <div 
      className={`audio-card-world-class ${vista} ${esActual ? 'actual' : ''} ${previewing ? 'previewing' : ''}`}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {/* Image at top */}
      <div className="audio-card-image-container">
        <img 
          src={audio.imagen || 'https://via.placeholder.com/400x200/9333ea/ffffff?text=Nature+Placeholder'} 
          alt={audio.titulo}
          className="audio-card-image"
        />
        
        {/* Icono dorado circular superpuesto */}
        <div className="audio-icono-overlay">
          <div className="audio-icono-circle">
            <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M3 18v-6a9 9 0 0 1 18 0v6"></path>
              <path d="M21 19a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3zM3 19a2 2 0 0 0 2 2h1a2 2 0 0 0 2-2v-3a2 2 0 0 0-2-2H3z"></path>
            </svg>
          </div>
        </div>

        {/* Preview indicator */}
        {previewing && (
          <div className="preview-badge">
            <Play size={14} />
            <span>Preview 30s</span>
          </div>
        )}

        {/* Badge de comprado */}
        {esComprado && (
          <div className="badge-comprado-top">
            <Check size={16} />
            <span>Ya comprada</span>
          </div>
        )}

        {/* Botón favorito */}
        <button
          className={`btn-favorito-top ${esFavorito ? 'activo' : ''}`}
          onClick={() => onToggleFavorito(audio)}
        >
          <Heart size={20} fill={esFavorito ? 'currentColor' : 'none'} />
        </button>
      </div>

      {/* Contenido de la tarjeta */}
      <div className="audio-card-body">
        {/* Título */}
        <h3 className="audio-title-world-class">{audio.titulo}</h3>

        {/* Descripción */}
        <p className="audio-description-world-class">{audio.descripcion}</p>

        {/* Metadatos en tabla */}
        <div className="audio-metadata-table">
          <div className="metadata-row">
            <span className="metadata-label">Categoría:</span>
            <span className="metadata-value">{audio.categoria}</span>
          </div>
          <div className="metadata-row">
            <span className="metadata-label">Duración:</span>
            <span className="metadata-value">{audio.duracion}</span>
          </div>
          <div className="metadata-row">
            <span className="metadata-label">Precio:</span>
            <span className="metadata-value">{audio.premium ? `$${audio.precio} USD` : 'Gratis'}</span>
          </div>
          {audio.rating && (
            <div className="metadata-row">
              <span className="metadata-label">Rating:</span>
              <span className="metadata-value">⭐ {audio.rating}/5.0</span>
            </div>
          )}
          {audio.reproducciones && (
            <div className="metadata-row">
              <span className="metadata-label">Reproducciones:</span>
              <span className="metadata-value">🎧 {audio.reproducciones.toLocaleString()}</span>
            </div>
          )}
        </div>

        {/* Beneficios */}
        {audio.beneficios && audio.beneficios.length > 0 && (
          <div className="audio-beneficios">
            <h4 className="beneficios-title">Beneficios:</h4>
            <ul className="beneficios-list">
              {audio.beneficios.map((beneficio, index) => (
                <li key={index} className="beneficio-item">✨ {beneficio}</li>
              ))}
            </ul>
          </div>
        )}

        {/* Botones de acción */}
        <div className="audio-actions-world-class">
          {audio.premium && !esComprado ? (
            <button 
              className="btn-action btn-comprar-world"
              onClick={() => onComprar(audio)}
            >
              <ShoppingCart size={18} />
              <span>Comprar</span>
            </button>
          ) : (
            <button 
              className="btn-action btn-reproducir-world"
              onClick={() => onReproducir(audio)}
              disabled={cargando}
            >
              {cargando ? (
                <div className="spinner-world" />
              ) : esActual && reproduciendo ? (
                <>
                  <Pause size={18} />
                  <span>Pausar</span>
                </>
              ) : (
                <>
                  <Play size={18} />
                  <span>Reproducir</span>
                </>
              )}
            </button>
          )}
          
          <button 
            className="btn-action btn-descargar-world"
            onClick={() => onDescargar(audio)}
            disabled={audio.premium && !esComprado}
          >
            <Download size={18} />
            <span>Bajar</span>
          </button>
        </div>

        {/* Barra de progreso si está reproduciéndose */}
        {esActual && reproduciendo && (
          <div className="progreso-container-world">
            <div className="progreso-barra-world">
              <div 
                className="progreso-fill-world"
                style={{ width: `${progreso}%` }}
              />
            </div>
            <div className="tiempo-info-world">
              <span>{formatearTiempo(tiempoActual)}</span>
              <span>{formatearTiempo(duracion)}</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AudioCardWorldClass;

