import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { BookOpen } from 'lucide-react';
import { supabase } from '../../integrations/supabase/client';
import BlogHeader from '../headers/BlogHeader';
import FooterLegal from '../FooterLegal';
import SkeletonCard from './components/SkeletonCard';
import ArticleCard from './components/ArticleCard';
import InspirationSection from './components/InspirationSection';
import EmptyState from './components/EmptyState';
import './PodcastYBlog.css';

const Blog = () => {
  const navigate = useNavigate();
  const [articulos, setArticulos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [user, setUser] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [showSubscribeModal, setShowSubscribeModal] = useState(false);

  // Obtener usuario actual
  useEffect(() => {
    const getUser = async () => {
      const { data } = await supabase.auth.getSession();
      setUser(data?.session?.user);
    };
    getUser();
  }, []);

  useEffect(() => {
    cargarArticulos();
  }, []);

  const cargarArticulos = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('articulos_blog')
        .select('*')
        .order('fecha', { ascending: false });

      if (error) throw error;
      setArticulos(data || []);
    } catch (error) {
      console.error('Error al cargar artículos:', error);
      setError('Error al cargar los artículos del blog');
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

  const handleNavigateHome = () => {
    navigate('/dashboard');
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <BlogHeader 
          user={user}
          onNavigateHome={handleNavigateHome}
          onLogout={handleLogout}
        />
        <div className="podcast-blog-container flex-1">
          <div className="section-header">
            <h1 className="section-title">
              <BookOpen className="inline-block mr-2" />
              Blog Espiritual
            </h1>
            <p className="section-subtitle">
              Artículos de crecimiento espiritual y sabiduría angelical
            </p>
          </div>
          
          <div className="cards-grid">
            {[...Array(6)].map((_, index) => (
              <SkeletonCard key={index} />
            ))}
          </div>
        </div>
        <FooterLegal />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex flex-col">
        <BlogHeader 
          user={user}
          onNavigateHome={handleNavigateHome}
          onLogout={handleLogout}
        />
        <div className="podcast-blog-container flex-1">
          <EmptyState 
            icon="⚠️"
            title="Error"
            message={error}
          />
        </div>
        <FooterLegal />
      </div>
    );
  }

  if (articulos.length === 0) {
    return (
      <div className="min-h-screen flex flex-col">
        <BlogHeader 
          user={user}
          onNavigateHome={handleNavigateHome}
          onLogout={handleLogout}
        />
        <div className="podcast-blog-container flex-1">
          <div className="section-header">
            <h1 className="section-title">
              <BookOpen className="inline-block mr-2" />
              Blog Espiritual
            </h1>
            <p className="section-subtitle">
              Artículos de crecimiento espiritual y sabiduría angelical
            </p>
          </div>
          
          <EmptyState 
            icon="📖"
            title="Próximamente"
            message="Los artículos del blog estarán disponibles muy pronto. Prepárate para recibir contenido inspirador y transformador."
          />
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
      <div className="podcast-blog-container flex-1">
        <div className="section-header">
          <h1 className="section-title">
            <BookOpen className="inline-block mr-2" />
            Blog Espiritual
          </h1>
          <p className="section-subtitle">
            Artículos de crecimiento espiritual y sabiduría angelical
          </p>
        </div>

        <div className="cards-grid">
          {articulos.map((articulo) => (
            <ArticleCard 
              key={articulo.id}
              articulo={articulo}
              formatearFecha={formatearFecha}
            />
          ))}
        </div>

        <InspirationSection />
      </div>
      <FooterLegal />
    </div>
  );
};

export default Blog;