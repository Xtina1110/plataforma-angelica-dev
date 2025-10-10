import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
// Icons removed (now provided within headers)
import { supabase } from '../../integrations/supabase/client';
import FooterLegal from '../FooterLegal';
import { ArticleCard, SkeletonCard, EmptyState } from './components';
import BlogHeader from '../headers/BlogHeader';
import AppSidebar from '../AppSidebar';

import heroBg from '../../assets/angel-music-background.jpg';
import './PodcastYBlog.css';

const PodcastYBlog = ({ onVolver }) => {
  const navigate = useNavigate();
  const [filtro, setFiltro] = useState('todos');
  const [articulos, setArticulos] = useState([]);
  const [episodios, setEpisodios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const cargarDatos = async () => {
      setLoading(true);
      const { data: session } = await supabase.auth.getSession();
      setUser(session?.session?.user || null);

      const { data: articulosData } = await supabase
        .from('articulos_blog')
        .select('*')
        .order('fecha', { ascending: false });
      const { data: episodiosData } = await supabase
        .from('episodios_podcast')
        .select('*')
        .order('fecha_publicacion', { ascending: false });
      setArticulos(articulosData || []);
      setEpisodios(episodiosData || []);
      setLoading(false);
    };
    cargarDatos();

    // SEO básico
    document.title = 'Blog & Podcast en Dorado — Plataforma Angélica';
    let meta = document.querySelector('meta[name="description"]');
    if (!meta) {
      meta = document.createElement('meta');
      meta.name = 'description';
      document.head.appendChild(meta);
    }
    meta.content = 'Artículos y episodios angelicales con imágenes y enlaces reales. Explora el Blog & Podcast en tema dorado.';

    let canonical = document.querySelector('link[rel="canonical"]');
    if (!canonical) {
      canonical = document.createElement('link');
      canonical.rel = 'canonical';
      document.head.appendChild(canonical);
    }
    canonical.href = window.location.href.split('?')[0];
  }, []);

  const formatearFecha = (fecha) => new Date(fecha).toLocaleDateString('es-ES', {
    day: 'numeric', month: 'short', year: 'numeric'
  });

  const handleNavigateHome = () => onVolver ? onVolver() : navigate('/dashboard');
  const handleLogout = async () => { await supabase.auth.signOut(); navigate('/'); };

  const renderContenido = () => {
    if (loading) return [...Array(6)].map((_, i) => <SkeletonCard key={i} />);

    const contenidosBase = [
      ...(filtro !== 'podcast' ? articulos.map(a => ({ tipo: 'blog', ...a })) : []),
      ...(filtro !== 'blog' ? episodios.map(e => ({ tipo: 'podcast', ...e })) : [])
    ].sort((a, b) => new Date(b.fecha || b.fecha_publicacion) - new Date(a.fecha || a.fecha_publicacion));

    const contenidos = contenidosBase.filter((c) => {
      const texto = `${c.titulo} ${c.descripcion || ''} ${c.resumen || ''}`.toLowerCase();
      return texto.includes(searchTerm.toLowerCase());
    });

    if (!contenidos.length) return <EmptyState icon="🕊️" title="Sin contenido" message="No hay publicaciones angelicales aún." />;

    return contenidos.map((item) => (
      <Link
        key={`${item.tipo}-${item.id}`}
        to={`/${item.tipo === 'blog' ? 'blog/articulo' : 'podcast/episodio'}/${item.id}`}
        className={`angel-card ${item.tipo}`}
      >
        <div className="angel-card-image">
          <img src={item.imagen || heroBg} alt={item.titulo} />
        </div>
        <div className="angel-card-content">
          <h3 className="angel-card-title">{item.titulo}</h3>
          <p className="angel-card-text">
            {item.descripcion || item.resumen?.substring(0, 100) + '...'}
          </p>
          <div className="angel-card-meta">
            <span>{formatearFecha(item.fecha || item.fecha_publicacion)}</span>
            <span className="badge">{item.tipo === 'blog' ? 'Artículo' : 'Podcast'}</span>
          </div>
          <button className="angel-button">{item.tipo === 'blog' ? 'Leer más' : 'Escuchar'}</button>
        </div>
      </Link>
    ));
  };

  return (
    <div className="dashboard-container">
      <AppSidebar />
      
      <main className="main-content">
        <BlogHeader
          user={user}
          onSearchClick={(q) => setSearchTerm(q)}
          onNavigateHome={handleNavigateHome}
          onLogout={handleLogout}
          onCartClick={() => navigate('/tienda')}
        />

        <div className="podcast-blog-container">
          <div className="filter-buttons">
            <button className={filtro === 'todos' ? 'active' : ''} onClick={() => setFiltro('todos')}>Todos</button>
            <button className={filtro === 'blog' ? 'active' : ''} onClick={() => setFiltro('blog')}>Artículos</button>
            <button className={filtro === 'podcast' ? 'active' : ''} onClick={() => setFiltro('podcast')}>Podcast</button>
          </div>

          <div className="angel-grid">
            {renderContenido()}
          </div>
        </div>

        <FooterLegal />
      </main>
    </div>
  );
};

export default PodcastYBlog;