import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  BookOpen, Search, Heart, Share2, Clock, 
  ArrowLeft, Sparkles, Tag, Calendar, User
} from 'lucide-react';
import { supabase } from '../../integrations/supabase/client';
import fondoAngelico from '../../assets/FondoAngelicoDashboard.png';
import './BlogPage.css';

const BlogPage = () => {
  const navigate = useNavigate();
  const [articulos, setArticulos] = useState([]);
  const [articulosFiltrados, setArticulosFiltrados] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoria, setCategoria] = useState('todos');
  const [favoritos, setFavoritos] = useState([]);

  const categorias = [
    { id: 'todos', nombre: 'Todos', icono: '✨', color: '#fbbf24' },
    { id: 'arcangeles', nombre: 'Arcángeles', icono: '👼', color: '#a855f7' },
    { id: 'meditacion', nombre: 'Meditación', icono: '🧘', color: '#06b6d4' },
    { id: 'oraciones', nombre: 'Oraciones', icono: '🙏', color: '#ec4899' },
    { id: 'guias', nombre: 'Guías', icono: '📖', color: '#10b981' },
    { id: 'testimonios', nombre: 'Testimonios', icono: '💫', color: '#f59e0b' }
  ];

  useEffect(() => {
    cargarArticulos();
    cargarFavoritos();
  }, []);

  useEffect(() => {
    filtrarArticulos();
  }, [articulos, categoria, searchTerm]);

  const cargarArticulos = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('articulos_blog')
        .select('*')
        .order('fecha', { ascending: false });

      if (error) throw error;
      setArticulos(data || []);
      setArticulosFiltrados(data || []);
    } catch (error) {
      console.error('Error al cargar artículos:', error);
      // Usar datos de ejemplo si hay error
      setArticulos(getDatosEjemplo());
      setArticulosFiltrados(getDatosEjemplo());
    } finally {
      setLoading(false);
    }
  };

  const filtrarArticulos = () => {
    let resultado = articulos;

    // Filtrar por categoría
    if (categoria !== 'todos') {
      resultado = resultado.filter(art => 
        art.categoria?.toLowerCase() === categoria.toLowerCase()
      );
    }

    // Buscar por término
    if (searchTerm) {
      const terminoLower = searchTerm.toLowerCase();
      resultado = resultado.filter(art =>
        art.titulo.toLowerCase().includes(terminoLower) ||
        art.descripcion?.toLowerCase().includes(terminoLower) ||
        art.contenido?.toLowerCase().includes(terminoLower)
      );
    }

    setArticulosFiltrados(resultado);
  };

  const cargarFavoritos = () => {
    const favoritosGuardados = localStorage.getItem('blog_favoritos');
    if (favoritosGuardados) {
      setFavoritos(JSON.parse(favoritosGuardados));
    }
  };

  const toggleFavorito = (articuloId) => {
    let nuevosFavoritos;
    if (favoritos.includes(articuloId)) {
      nuevosFavoritos = favoritos.filter(id => id !== articuloId);
    } else {
      nuevosFavoritos = [...favoritos, articuloId];
    }
    setFavoritos(nuevosFavoritos);
    localStorage.setItem('blog_favoritos', JSON.stringify(nuevosFavoritos));
  };

  const compartirArticulo = (articulo) => {
    if (navigator.share) {
      navigator.share({
        title: articulo.titulo,
        text: articulo.descripcion,
        url: window.location.origin + `/blog/articulo/${articulo.id}`
      });
    } else {
      navigator.clipboard.writeText(window.location.origin + `/blog/articulo/${articulo.id}`);
      alert('¡Link copiado al portapapeles!');
    }
  };

  const formatearFecha = (fecha) => {
    return new Date(fecha).toLocaleDateString('es-ES', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };

  const calcularTiempoLectura = (contenido) => {
    if (!contenido) return '5 min';
    const palabras = contenido.split(' ').length;
    const minutos = Math.ceil(palabras / 200);
    return `${minutos} min`;
  };

  const getDatosEjemplo = () => {
    return [
      {
        id: 1,
        titulo: 'Conectando con el Arcángel Miguel',
        descripcion: 'Descubre cómo establecer una conexión profunda con el Arcángel Miguel para protección y guía espiritual',
        categoria: 'arcangeles',
        fecha: '2024-10-10',
        imagen: null,
        autor: 'Juan Carlos Ávila',
        contenido: 'El Arcángel Miguel es conocido como el príncipe de los arcángeles...'
      },
      {
        id: 2,
        titulo: 'Meditación Angelical para la Paz Interior',
        descripcion: 'Una guía completa de meditación para conectar con los ángeles y encontrar paz en tu corazón',
        categoria: 'meditacion',
        fecha: '2024-10-08',
        imagen: null,
        autor: 'Juan Carlos Ávila',
        contenido: 'La meditación angelical es una práctica poderosa...'
      }
    ];
  };

  return (
    <div className="blog-page">
      {/* Fondo */}
      <div
        className="blog-background"
        style={{
          backgroundImage: `url(${fondoAngelico})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center'
        }}
      />
      <div className="blog-overlay" />

      {/* Header */}
      <div className="blog-header">
        <button className="blog-back-button" onClick={() => navigate('/blog-podcast/seleccion')}>
          <ArrowLeft size={20} />
          <span>Volver</span>
        </button>

        <div className="blog-header-content">
          <div className="blog-header-icon">
            <BookOpen size={40} />
          </div>
          <div className="blog-header-text">
            <h1 className="blog-header-title">Blog Angelical</h1>
            <p className="blog-header-subtitle">
              Artículos inspiradores sobre ángeles, arcángeles y espiritualidad
            </p>
          </div>
        </div>
      </div>

      {/* Controles */}
      <div className="blog-controls">
        {/* Búsqueda */}
        <div className="blog-search">
          <Search size={20} className="blog-search-icon" />
          <input
            type="text"
            placeholder="Buscar artículos..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="blog-search-input"
          />
        </div>

        {/* Filtros de categoría */}
        <div className="blog-categories">
          {categorias.map((cat) => (
            <button
              key={cat.id}
              className={`blog-category ${categoria === cat.id ? 'blog-category-active' : ''}`}
              onClick={() => setCategoria(cat.id)}
              style={{
                '--category-color': cat.color
              }}
            >
              <span>{cat.icono}</span>
              <span>{cat.nombre}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Contenido principal */}
      <div className="blog-main">
        {loading ? (
          <div className="blog-loading">
            <div className="blog-loader"></div>
            <p>Cargando artículos angelicales...</p>
          </div>
        ) : articulosFiltrados.length === 0 ? (
          <div className="blog-empty">
            <BookOpen size={48} />
            <p>No se encontraron artículos</p>
          </div>
        ) : (
          <div className="blog-articles-grid">
            {articulosFiltrados.map((articulo) => {
              const categoriaInfo = categorias.find(c => c.id === articulo.categoria?.toLowerCase()) || categorias[0];
              
              return (
                <article
                  key={articulo.id}
                  className="blog-article-card"
                  onClick={() => navigate(`/blog/articulo/${articulo.id}`)}
                >
                  {/* Imagen */}
                  {articulo.imagen && (
                    <div className="blog-article-image">
                      <img src={articulo.imagen} alt={articulo.titulo} />
                      <div className="blog-article-overlay" />
                    </div>
                  )}

                  {/* Contenido */}
                  <div className="blog-article-content">
                    {/* Categoría */}
                    <div
                      className="blog-article-category"
                      style={{ backgroundColor: categoriaInfo.color }}
                    >
                      <span>{categoriaInfo.icono}</span>
                      <span>{categoriaInfo.nombre}</span>
                    </div>

                    {/* Título */}
                    <h2 className="blog-article-title">{articulo.titulo}</h2>

                    {/* Descripción */}
                    <p className="blog-article-description">{articulo.descripcion}</p>

                    {/* Meta */}
                    <div className="blog-article-meta">
                      <span className="blog-article-meta-item">
                        <Calendar size={16} />
                        {formatearFecha(articulo.fecha)}
                      </span>
                      <span className="blog-article-meta-item">
                        <Clock size={16} />
                        {calcularTiempoLectura(articulo.contenido)}
                      </span>
                      {articulo.autor && (
                        <span className="blog-article-meta-item">
                          <User size={16} />
                          {articulo.autor}
                        </span>
                      )}
                    </div>

                    {/* Acciones */}
                    <div className="blog-article-actions">
                      <button
                        className={`blog-article-action ${favoritos.includes(articulo.id) ? 'blog-article-action-active' : ''}`}
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleFavorito(articulo.id);
                        }}
                      >
                        <Heart size={18} fill={favoritos.includes(articulo.id) ? 'currentColor' : 'none'} />
                      </button>

                      <button
                        className="blog-article-action"
                        onClick={(e) => {
                          e.stopPropagation();
                          compartirArticulo(articulo);
                        }}
                      >
                        <Share2 size={18} />
                      </button>
                    </div>
                  </div>

                  {/* Indicador de favorito */}
                  {favoritos.includes(articulo.id) && (
                    <div className="blog-article-favorite-badge">
                      <Heart size={20} fill="#fbbf24" />
                    </div>
                  )}
                </article>
              );
            })}
          </div>
        )}
      </div>

      {/* Mensaje angelical */}
      <div className="blog-message">
        <Sparkles size={20} className="blog-message-icon" />
        <p className="blog-message-text">
          Cada artículo está escrito con amor y guía angelical para iluminar tu camino
        </p>
        <Sparkles size={20} className="blog-message-icon blog-message-icon-delayed" />
      </div>
    </div>
  );
};

export default BlogPage;

