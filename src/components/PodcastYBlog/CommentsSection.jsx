import React, { useState } from 'react';
import { MessageCircle, ThumbsUp, Reply, Flag, User, Calendar, MoreVertical, Send } from 'lucide-react';
import './CommentsSection.css';

const CommentsSection = ({ articuloId, comentariosIniciales = [] }) => {
  const [comentarios, setComentarios] = useState(comentariosIniciales);
  const [ordenamiento, setOrdenamiento] = useState('newest'); // 'newest', 'oldest', 'most_liked'
  const [nuevoComentario, setNuevoComentario] = useState({
    nombre: '',
    email: '',
    website: '',
    texto: ''
  });
  const [respondiendo, setRespondiendo] = useState(null);
  const [errors, setErrors] = useState({});

  // Validar formulario
  const validateForm = () => {
    const newErrors = {};
    
    if (!nuevoComentario.nombre.trim()) {
      newErrors.nombre = 'El nombre es requerido';
    }
    
    if (!nuevoComentario.email.trim()) {
      newErrors.email = 'El email es requerido';
    } else if (!/\S+@\S+\.\S+/.test(nuevoComentario.email)) {
      newErrors.email = 'Email inválido';
    }
    
    if (!nuevoComentario.texto.trim()) {
      newErrors.texto = 'El comentario es requerido';
    } else if (nuevoComentario.texto.trim().length < 10) {
      newErrors.texto = 'El comentario debe tener al menos 10 caracteres';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Enviar comentario
  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    const comentario = {
      id: Date.now().toString(),
      ...nuevoComentario,
      fecha: new Date().toISOString(),
      likes: 0,
      respuestas: [],
      parentId: respondiendo
    };

    if (respondiendo) {
      // Es una respuesta
      setComentarios(prev => prev.map(c => 
        c.id === respondiendo 
          ? { ...c, respuestas: [...(c.respuestas || []), comentario] }
          : c
      ));
    } else {
      // Es un comentario nuevo
      setComentarios(prev => [comentario, ...prev]);
    }

    // Resetear formulario
    setNuevoComentario({ nombre: '', email: '', website: '', texto: '' });
    setRespondiendo(null);
    setErrors({});
  };

  // Dar like a un comentario
  const handleLike = (comentarioId, isRespuesta = false, parentId = null) => {
    if (isRespuesta && parentId) {
      setComentarios(prev => prev.map(c => 
        c.id === parentId
          ? {
              ...c,
              respuestas: c.respuestas.map(r =>
                r.id === comentarioId ? { ...r, likes: r.likes + 1 } : r
              )
            }
          : c
      ));
    } else {
      setComentarios(prev => prev.map(c =>
        c.id === comentarioId ? { ...c, likes: c.likes + 1 } : c
      ));
    }
  };

  // Ordenar comentarios
  const getComentariosOrdenados = () => {
    const sorted = [...comentarios];
    
    switch (ordenamiento) {
      case 'newest':
        return sorted.sort((a, b) => new Date(b.fecha) - new Date(a.fecha));
      case 'oldest':
        return sorted.sort((a, b) => new Date(a.fecha) - new Date(b.fecha));
      case 'most_liked':
        return sorted.sort((a, b) => b.likes - a.likes);
      default:
        return sorted;
    }
  };

  // Obtener avatar inicial
  const getInitials = (nombre) => {
    return nombre
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  // Formatear fecha
  const formatDate = (fecha) => {
    const date = new Date(fecha);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Justo ahora';
    if (diffMins < 60) return `Hace ${diffMins} min`;
    if (diffHours < 24) return `Hace ${diffHours}h`;
    if (diffDays < 7) return `Hace ${diffDays}d`;
    
    return date.toLocaleDateString('es-ES', { 
      day: 'numeric', 
      month: 'short', 
      year: 'numeric' 
    });
  };

  const comentariosOrdenados = getComentariosOrdenados();

  return (
    <section className="comments-section">
      {/* Header */}
      <div className="comments-header">
        <div className="comments-title-container">
          <MessageCircle size={28} className="comments-icon" />
          <h2 className="comments-title">
            Comentarios ({comentarios.length})
          </h2>
        </div>
        
        <select 
          value={ordenamiento}
          onChange={(e) => setOrdenamiento(e.target.value)}
          className="comments-sort-select"
        >
          <option value="newest">Más recientes</option>
          <option value="oldest">Más antiguos</option>
          <option value="most_liked">Más populares</option>
        </select>
      </div>

      {/* Formulario de comentario */}
      <div className="comment-form-container">
        <h3 className="form-title">
          {respondiendo ? 'Responder comentario' : 'Deja tu comentario'}
        </h3>
        
        {respondiendo && (
          <div className="replying-to-banner">
            <Reply size={16} />
            <span>Respondiendo a un comentario</span>
            <button 
              onClick={() => setRespondiendo(null)}
              className="cancel-reply-btn"
            >
              Cancelar
            </button>
          </div>
        )}

        <form onSubmit={handleSubmit} className="comment-form">
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="nombre">Nombre *</label>
              <input
                id="nombre"
                type="text"
                value={nuevoComentario.nombre}
                onChange={(e) => setNuevoComentario(prev => ({ ...prev, nombre: e.target.value }))}
                className={`form-input ${errors.nombre ? 'error' : ''}`}
                placeholder="Tu nombre"
              />
              {errors.nombre && <span className="error-message">{errors.nombre}</span>}
            </div>

            <div className="form-group">
              <label htmlFor="email">Email *</label>
              <input
                id="email"
                type="email"
                value={nuevoComentario.email}
                onChange={(e) => setNuevoComentario(prev => ({ ...prev, email: e.target.value }))}
                className={`form-input ${errors.email ? 'error' : ''}`}
                placeholder="tu@email.com"
              />
              {errors.email && <span className="error-message">{errors.email}</span>}
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="website">Sitio web (opcional)</label>
            <input
              id="website"
              type="url"
              value={nuevoComentario.website}
              onChange={(e) => setNuevoComentario(prev => ({ ...prev, website: e.target.value }))}
              className="form-input"
              placeholder="https://tusitio.com"
            />
          </div>

          <div className="form-group">
            <label htmlFor="texto">Comentario *</label>
            <textarea
              id="texto"
              value={nuevoComentario.texto}
              onChange={(e) => setNuevoComentario(prev => ({ ...prev, texto: e.target.value }))}
              className={`form-textarea ${errors.texto ? 'error' : ''}`}
              placeholder="Comparte tus pensamientos..."
              rows="5"
            />
            {errors.texto && <span className="error-message">{errors.texto}</span>}
            <div className="character-count">
              {nuevoComentario.texto.length} / 1000 caracteres
            </div>
          </div>

          <button type="submit" className="submit-comment-btn">
            <Send size={18} />
            Publicar Comentario
          </button>
        </form>
      </div>

      {/* Lista de comentarios */}
      <div className="comments-list">
        {comentariosOrdenados.length === 0 ? (
          <div className="no-comments">
            <MessageCircle size={48} className="no-comments-icon" />
            <h3>Sé el primero en comentar</h3>
            <p>Comparte tus pensamientos sobre este artículo</p>
          </div>
        ) : (
          comentariosOrdenados.map(comentario => (
            <CommentItem
              key={comentario.id}
              comentario={comentario}
              onLike={handleLike}
              onReply={setRespondiendo}
              getInitials={getInitials}
              formatDate={formatDate}
            />
          ))
        )}
      </div>
    </section>
  );
};

// Componente individual de comentario
const CommentItem = ({ comentario, onLike, onReply, getInitials, formatDate, isReply = false }) => {
  const [showReplies, setShowReplies] = useState(true);

  return (
    <div className={`comment-item ${isReply ? 'reply' : ''}`}>
      <div className="comment-avatar">
        {getInitials(comentario.nombre)}
      </div>

      <div className="comment-content">
        <div className="comment-header">
          <div className="comment-author-info">
            <h4 className="comment-author">{comentario.nombre}</h4>
            <span className="comment-date">
              <Calendar size={12} />
              {formatDate(comentario.fecha)}
            </span>
          </div>
          
          <button className="comment-menu-btn">
            <MoreVertical size={18} />
          </button>
        </div>

        <p className="comment-text">{comentario.texto}</p>

        <div className="comment-actions">
          <button 
            className="comment-action-btn like-btn"
            onClick={() => onLike(comentario.id, isReply, comentario.parentId)}
          >
            <ThumbsUp size={16} />
            <span>{comentario.likes > 0 ? comentario.likes : 'Me gusta'}</span>
          </button>

          {!isReply && (
            <button 
              className="comment-action-btn reply-btn"
              onClick={() => onReply(comentario.id)}
            >
              <Reply size={16} />
              <span>Responder</span>
            </button>
          )}

          <button className="comment-action-btn report-btn">
            <Flag size={16} />
            <span>Reportar</span>
          </button>
        </div>

        {/* Respuestas */}
        {comentario.respuestas && comentario.respuestas.length > 0 && (
          <div className="comment-replies">
            <button 
              className="toggle-replies-btn"
              onClick={() => setShowReplies(!showReplies)}
            >
              {showReplies ? '−' : '+'} {comentario.respuestas.length} {comentario.respuestas.length === 1 ? 'respuesta' : 'respuestas'}
            </button>

            {showReplies && (
              <div className="replies-list">
                {comentario.respuestas.map(respuesta => (
                  <CommentItem
                    key={respuesta.id}
                    comentario={respuesta}
                    onLike={onLike}
                    onReply={onReply}
                    getInitials={getInitials}
                    formatDate={formatDate}
                    isReply={true}
                  />
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default CommentsSection;

