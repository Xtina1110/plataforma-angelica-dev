import React, { useState, useEffect, useRef } from 'react';
import { Search, X, Clock, TrendingUp, Book, Calendar, MessageSquare } from 'lucide-react';
import { supabase } from '../integrations/supabase/client';
import './GlobalSearch.css';

const GlobalSearch = ({ onNavigate }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [recentSearches, setRecentSearches] = useState([]);
  const [loading, setLoading] = useState(false);
  const searchRef = useRef(null);
  const inputRef = useRef(null);

  // Cerrar al hacer clic fuera
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Atajos de teclado (Ctrl+K o Cmd+K)
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        setIsOpen(true);
        setTimeout(() => inputRef.current?.focus(), 100);
      }

      if (e.key === 'Escape') {
        setIsOpen(false);
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Cargar búsquedas recientes
  useEffect(() => {
    const saved = localStorage.getItem('recentSearches');
    if (saved) {
      setRecentSearches(JSON.parse(saved));
    }
  }, []);

  // Buscar en tiempo real
  useEffect(() => {
    if (query.length < 2) {
      setResults([]);
      return;
    }

    const searchTimeout = setTimeout(async () => {
      await performSearch(query);
    }, 300);

    return () => clearTimeout(searchTimeout);
  }, [query]);

  const performSearch = async (searchQuery) => {
    setLoading(true);
    try {
      const searchResults = [];

      // Buscar en eventos
      const { data: eventos } = await supabase
        .from('eventos')
        .select('*')
        .ilike('titulo', `%${searchQuery}%`)
        .limit(5);

      if (eventos) {
        searchResults.push(...eventos.map(e => ({
          id: e.id,
          type: 'evento',
          title: e.titulo,
          subtitle: e.descripcion?.substring(0, 100),
          icon: Calendar,
          action: () => handleResultClick('eventos', e)
        })));
      }

      // Buscar en cursos
      const { data: cursos } = await supabase
        .from('cursos')
        .select('*')
        .ilike('nombre', `%${searchQuery}%`)
        .limit(5);

      if (cursos) {
        searchResults.push(...cursos.map(c => ({
          id: c.id,
          type: 'curso',
          title: c.nombre,
          subtitle: c.descripcion?.substring(0, 100),
          icon: Book,
          action: () => handleResultClick('academia', c)
        })));
      }

      // Buscar en mensajes
      const { data: mensajes } = await supabase
        .from('daily_messages')
        .select('*')
        .ilike('message', `%${searchQuery}%`)
        .limit(3);

      if (mensajes) {
        searchResults.push(...mensajes.map(m => ({
          id: m.id,
          type: 'mensaje',
          title: `Mensaje de ${m.angel_name}`,
          subtitle: m.message?.substring(0, 100),
          icon: MessageSquare,
          action: () => handleResultClick('mensaje', m)
        })));
      }

      // Resultados de navegación rápida
      const quickNav = [
        { id: 'apertura', title: 'Apertura Angélica', subtitle: 'Conecta con la sabiduría angelical', icon: TrendingUp, section: 'tirada' },
        { id: 'sonoterapia', title: 'Sonoterapia', subtitle: 'Frecuencias sagradas de sanación', icon: TrendingUp, section: 'canalizaciones' },
        { id: 'academia', title: 'Academia Angélica', subtitle: 'Formación espiritual completa', icon: Book, section: 'academia' }
      ].filter(item => 
        item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.subtitle.toLowerCase().includes(searchQuery.toLowerCase())
      );

      searchResults.push(...quickNav.map(nav => ({
        ...nav,
        type: 'navegacion',
        action: () => handleResultClick(nav.section)
      })));

      setResults(searchResults);
    } catch (error) {
      console.error('Error searching:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleResultClick = (section, data = null) => {
    // Guardar en búsquedas recientes
    const newRecent = [
      query,
      ...recentSearches.filter(s => s !== query)
    ].slice(0, 5);
    
    setRecentSearches(newRecent);
    localStorage.setItem('recentSearches', JSON.stringify(newRecent));

    // Navegar
    if (onNavigate) {
      onNavigate(section, data);
    }

    // Cerrar búsqueda
    setIsOpen(false);
    setQuery('');
  };

  const clearRecentSearches = () => {
    setRecentSearches([]);
    localStorage.removeItem('recentSearches');
  };

  return (
    <>
      {/* Botón de búsqueda */}
      <button className="global-search-trigger" onClick={() => setIsOpen(true)}>
        <Search size={20} />
        <span>Buscar...</span>
        <kbd>Ctrl+K</kbd>
      </button>

      {/* Modal de búsqueda */}
      {isOpen && (
        <div className="global-search-overlay">
          <div className="global-search-modal" ref={searchRef}>
            {/* Input de búsqueda */}
            <div className="search-input-container">
              <Search className="search-icon" size={20} />
              <input
                ref={inputRef}
                type="text"
                placeholder="Buscar eventos, cursos, mensajes..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="search-input"
                autoFocus
              />
              {query && (
                <button className="clear-search" onClick={() => setQuery('')}>
                  <X size={18} />
                </button>
              )}
            </div>

            {/* Resultados */}
            <div className="search-results">
              {loading ? (
                <div className="search-loading">
                  <div className="loading-spinner"></div>
                  <p>Buscando...</p>
                </div>
              ) : query.length < 2 ? (
                <div className="search-empty">
                  {recentSearches.length > 0 && (
                    <div className="recent-searches">
                      <div className="recent-header">
                        <h4>
                          <Clock size={16} />
                          Búsquedas recientes
                        </h4>
                        <button onClick={clearRecentSearches}>Limpiar</button>
                      </div>
                      <div className="recent-list">
                        {recentSearches.map((search, index) => (
                          <button
                            key={index}
                            className="recent-item"
                            onClick={() => setQuery(search)}
                          >
                            <Clock size={14} />
                            {search}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                  <div className="search-tips">
                    <h4>Sugerencias</h4>
                    <p>Busca eventos, cursos, mensajes angelicales y más...</p>
                    <p className="keyboard-tip">
                      Usa <kbd>↑</kbd> <kbd>↓</kbd> para navegar y <kbd>Enter</kbd> para seleccionar
                    </p>
                  </div>
                </div>
              ) : results.length === 0 ? (
                <div className="no-results">
                  <Search size={48} />
                  <h4>No se encontraron resultados</h4>
                  <p>Intenta con otros términos de búsqueda</p>
                </div>
              ) : (
                <div className="results-list">
                  {results.map((result, index) => (
                    <button
                      key={`${result.type}-${result.id}-${index}`}
                      className="result-item"
                      onClick={result.action}
                    >
                      <div className="result-icon">
                        <result.icon size={20} />
                      </div>
                      <div className="result-content">
                        <h5>{result.title}</h5>
                        {result.subtitle && <p>{result.subtitle}</p>}
                      </div>
                      <span className="result-type">{result.type}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="search-footer">
              <div className="search-shortcuts">
                <span><kbd>↑</kbd><kbd>↓</kbd> Navegar</span>
                <span><kbd>Enter</kbd> Seleccionar</span>
                <span><kbd>Esc</kbd> Cerrar</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default GlobalSearch;

