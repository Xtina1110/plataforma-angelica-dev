import React, { useState, useEffect, useRef } from 'react';
import { Search, X, Calendar, BookOpen, MessageSquare, Sparkles, ChevronRight } from 'lucide-react';
import './GlobalSearchModal.css';

const GlobalSearchModal = ({ isOpen, onClose, onNavigate }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [results, setResults] = useState([]);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef(null);

  // Mock data - En producción vendría de Supabase
  const searchableContent = [
    // Eventos
    { type: 'event', title: 'Meditación Grupal con Arcángeles', category: 'Eventos', date: '15 ENE', icon: Calendar },
    { type: 'event', title: 'Taller de Cartas Angelicales', category: 'Eventos', date: '18 ENE', icon: Calendar },
    { type: 'event', title: 'Sanación con Frecuencias Angelicales', category: 'Eventos', date: '22 ENE', icon: Calendar },
    
    // Cursos
    { type: 'course', title: 'Comunicación con Ángeles - Nivel 1', category: 'Academia', icon: BookOpen },
    { type: 'course', title: 'Lectura de Cartas Angelicales', category: 'Academia', icon: BookOpen },
    { type: 'course', title: 'Sanación Angelical Avanzada', category: 'Academia', icon: BookOpen },
    
    // Mensajes
    { type: 'message', title: 'Mensaje de Arcángel Miguel', category: 'Mensajes', date: 'Hoy', icon: MessageSquare },
    { type: 'message', title: 'Mensaje de Arcángel Rafael', category: 'Mensajes', date: 'Ayer', icon: MessageSquare },
    
    // Apps
    { type: 'app', title: 'Apertura Angelica', category: 'Aplicaciones', icon: Sparkles },
    { type: 'app', title: 'Sonoterapia y Canalizaciones', category: 'Aplicaciones', icon: Sparkles },
    { type: 'app', title: 'Terapias y Limpiezas', category: 'Aplicaciones', icon: Sparkles },
    { type: 'app', title: 'Academia Angelica', category: 'Aplicaciones', icon: Sparkles },
  ];

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  useEffect(() => {
    if (searchQuery.trim()) {
      const filtered = searchableContent.filter(item =>
        item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.category.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setResults(filtered);
      setSelectedIndex(0);
    } else {
      setResults([]);
    }
  }, [searchQuery]);

  const handleKeyDown = (e) => {
    if (e.key === 'Escape') {
      onClose();
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex(prev => (prev + 1) % results.length);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex(prev => (prev - 1 + results.length) % results.length);
    } else if (e.key === 'Enter' && results.length > 0) {
      handleSelectResult(results[selectedIndex]);
    }
  };

  const handleSelectResult = (result) => {
    // Navegar según el tipo
    if (result.type === 'event') {
      onNavigate('eventos');
    } else if (result.type === 'course') {
      onNavigate('academia');
    } else if (result.type === 'message') {
      onNavigate('mensaje');
    } else if (result.type === 'app') {
      const appMap = {
        'Apertura Angelica': 'tirada',
        'Sonoterapia y Canalizaciones': 'canalizaciones',
        'Terapias y Limpiezas': 'terapias',
        'Academia Angelica': 'academia'
      };
      onNavigate(appMap[result.title] || 'home');
    }
    onClose();
    setSearchQuery('');
  };

  if (!isOpen) return null;

  const groupedResults = results.reduce((acc, result) => {
    if (!acc[result.category]) {
      acc[result.category] = [];
    }
    acc[result.category].push(result);
    return acc;
  }, {});

  return (
    <div className="search-modal-overlay" onClick={onClose}>
      <div className="search-modal-container" onClick={e => e.stopPropagation()}>
        <div className="search-modal-header">
          <Search className="search-icon" size={20} />
          <input
            ref={inputRef}
            type="text"
            placeholder="Buscar eventos, cursos, mensajes..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            className="search-input"
          />
          <button onClick={onClose} className="search-close-btn">
            <X size={20} />
          </button>
        </div>

        <div className="search-results">
          {searchQuery.trim() === '' ? (
            <div className="search-empty">
              <Search size={48} className="search-empty-icon" />
              <p>Escribe para buscar en toda la plataforma</p>
              <div className="search-shortcuts">
                <span className="shortcut-key">↑↓</span> Navegar
                <span className="shortcut-key">Enter</span> Seleccionar
                <span className="shortcut-key">Esc</span> Cerrar
              </div>
            </div>
          ) : results.length === 0 ? (
            <div className="search-empty">
              <p>No se encontraron resultados para "{searchQuery}"</p>
            </div>
          ) : (
            Object.entries(groupedResults).map(([category, items]) => (
              <div key={category} className="search-category">
                <div className="search-category-title">{category}</div>
                {items.map((result, index) => {
                  const globalIndex = results.indexOf(result);
                  const Icon = result.icon;
                  return (
                    <div
                      key={index}
                      className={`search-result-item ${globalIndex === selectedIndex ? 'selected' : ''}`}
                      onClick={() => handleSelectResult(result)}
                      onMouseEnter={() => setSelectedIndex(globalIndex)}
                    >
                      <div className="search-result-icon">
                        <Icon size={18} />
                      </div>
                      <div className="search-result-content">
                        <div className="search-result-title">
                          {result.title}
                        </div>
                        {result.date && (
                          <div className="search-result-meta">{result.date}</div>
                        )}
                      </div>
                      <ChevronRight size={16} className="search-result-arrow" />
                    </div>
                  );
                })}
              </div>
            ))
          )}
        </div>

        <div className="search-footer">
          <span className="search-footer-text">
            Presiona <kbd>Ctrl</kbd> + <kbd>K</kbd> para abrir en cualquier momento
          </span>
        </div>
      </div>
    </div>
  );
};

export default GlobalSearchModal;

