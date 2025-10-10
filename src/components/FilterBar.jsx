import React from 'react';
import { Filter, Calendar, MapPin, User, Star, Tag, Clock, BookOpen, Music, Play, Heart, Zap } from 'lucide-react';
import './FilterBar.css';

const FilterBar = ({ type, filters, onFilterChange, searchValue, onSearchChange, onActionClick, actionLabel }) => {
  const getFilterConfig = () => {
    switch (type) {
      case 'eventos':
        return {
          placeholder: "Buscar eventos...",
          filters: [
            {
              key: 'categoria',
              label: 'Categoría',
              icon: <Tag size={16} />,
              options: [
                { value: 'todos', label: 'Todas las categorías' },
                { value: 'meditacion', label: 'Meditación' },
                { value: 'formacion', label: 'Formación' },
                { value: 'sanacion', label: 'Sanación' },
                { value: 'canalizacion', label: 'Canalización' }
              ]
            },
            {
              key: 'ubicacion',
              label: 'Ubicación',
              icon: <MapPin size={16} />,
              options: [
                { value: 'todas', label: 'Todas las ubicaciones' },
                { value: 'online', label: 'Online' },
                { value: 'presencial', label: 'Presencial' },
                { value: 'madrid', label: 'Madrid' },
                { value: 'barcelona', label: 'Barcelona' }
              ]
            },
            {
              key: 'instructor',
              label: 'Instructor',
              icon: <User size={16} />,
              options: [
                { value: 'todos', label: 'Todos los instructores' },
                { value: 'juan-carlos', label: 'Juan Carlos Ávila' }
              ]
            },
            {
              key: 'estado',
              label: 'Estado',
              icon: <Star size={16} />,
              options: [
                { value: 'todos', label: 'Todos los estados' },
                { value: 'disponible', label: 'Disponible' },
                { value: 'inscrito', label: 'Inscrito' },
                { value: 'completo', label: 'Completo' }
              ]
            }
          ],
          hasDatePicker: true,
          actionLabel: actionLabel || 'Registrarse Ahora'
        };

      case 'tirada':
        return {
          placeholder: "Buscar lecturas...",
          filters: [
            {
              key: 'tipo',
              label: 'Tipo de Lectura',
              icon: <Heart size={16} />,
              options: [
                { value: 'todos', label: 'Todos los tipos' },
                { value: 'amor', label: 'Amor y Relaciones' },
                { value: 'trabajo', label: 'Trabajo y Carrera' },
                { value: 'salud', label: 'Salud y Bienestar' },
                { value: 'espiritual', label: 'Crecimiento Espiritual' }
              ]
            },
            {
              key: 'cartas',
              label: 'Cantidad',
              icon: <Star size={16} />,
              options: [
                { value: 'todas', label: 'Cantidad' },
                { value: '3', label: '3 cartas' },
                { value: '6', label: '6 cartas' },
                { value: '9', label: '9 cartas' },
                { value: 'vivo', label: 'en vivo' }
              ]
            },
            {
              key: 'nivel',
              label: 'Nivel',
              icon: <Star size={16} />,
              options: [
                { value: 'todos', label: 'Todos los niveles' },
                { value: 'principiante', label: 'Principiante' },
                { value: 'intermedio', label: 'Intermedio' },
                { value: 'avanzado', label: 'Avanzado' }
              ]
            }
          ],
          actionLabel: actionLabel || 'Nueva Lectura'
        };

      case 'canalizaciones':
        return {
          placeholder: "Buscar sonoterapia & canalizaciones...",
          filters: [
            {
              key: 'tipo',
              label: 'Tipo de Contenido',
              icon: <Music size={16} />,
              options: [
                { value: 'todos', label: 'Sonoterapia y Canalizaciones' },
                { value: 'sonoterapia', label: 'Solo Sonoterapia' },
                { value: 'canalizaciones', label: 'Solo Canalizaciones' }
              ]
            },
            {
              key: 'tema',
              label: 'Tema',
              icon: <Music size={16} />,
              options: [
                { value: 'todos', label: 'Todos los temas' },
                { value: 'proteccion', label: 'Protección' },
                { value: 'sanacion', label: 'Sanación' },
                { value: 'abundancia', label: 'Abundancia' },
                { value: 'amor', label: 'Amor' },
                { value: 'paz', label: 'Paz Interior' }
              ]
            },
            {
              key: 'arcangel',
              label: 'Arcángel',
              icon: <Star size={16} />,
              options: [
                { value: 'todos', label: 'Todos los arcángeles' },
                { value: 'miguel', label: 'Arcángel Miguel' },
                { value: 'rafael', label: 'Arcángel Rafael' },
                { value: 'gabriel', label: 'Arcángel Gabriel' },
                { value: 'uriel', label: 'Arcángel Uriel' }
              ]
            },
            {
              key: 'duracion',
              label: 'Duración',
              icon: <Clock size={16} />,
              options: [
                { value: 'todas', label: 'Cualquier duración' },
                { value: 'corta', label: '5-15 min' },
                { value: 'media', label: '15-30 min' },
                { value: 'larga', label: '30+ min' }
              ]
            }
          ],
          actionLabel: actionLabel || 'Reproducir Todo'
        };

      case 'terapias':
        return {
          placeholder: "Buscar terapias & limpiezas...",
          filters: [
            {
              key: 'tipo',
              label: 'Tipo de Contenido',
              icon: <Zap size={16} />,
              options: [
                { value: 'todos', label: 'Terapias y Limpiezas' },
                { value: 'terapias', label: 'Solo Terapias' },
                { value: 'limpiezas', label: 'Solo Limpiezas' }
              ]
            },
            {
              key: 'metodo',
              label: 'Método',
              icon: <Zap size={16} />,
              options: [
                { value: 'todos', label: 'Todos los métodos' },
                { value: 'limpieza', label: 'Limpieza Energética' },
                { value: 'sanacion', label: 'Sanación Angelical' },
                { value: 'proteccion', label: 'Protección' },
                { value: 'activacion', label: 'Activación de Dones' }
              ]
            },
            {
              key: 'nivel',
              label: 'Nivel de Intensidad',
              icon: <Star size={16} />,
              options: [
                { value: 'todos', label: 'Todos los niveles' },
                { value: 'suave', label: 'Suave' },
                { value: 'medio', label: 'Medio' },
                { value: 'intenso', label: 'Intenso' }
              ]
            },
            {
              key: 'duracion',
              label: 'Duración',
              icon: <Clock size={16} />,
              options: [
                { value: 'todas', label: 'Cualquier duración' },
                { value: 'corta', label: '15-30 min' },
                { value: 'media', label: '30-60 min' },
                { value: 'larga', label: '60+ min' }
              ]
            }
          ],
          actionLabel: actionLabel || 'Iniciar Terapia'
        };

      case 'academia':
        return {
          placeholder: "Buscar cursos...",
          filters: [
            {
              key: 'nivel',
              label: 'Nivel',
              icon: <BookOpen size={16} />,
              options: [
                { value: 'todos', label: 'Todos los niveles' },
                { value: 'principiante', label: 'Principiante' },
                { value: 'intermedio', label: 'Intermedio' },
                { value: 'avanzado', label: 'Avanzado' },
                { value: 'maestria', label: 'Maestría' }
              ]
            },
            {
              key: 'categoria',
              label: 'Categoría',
              icon: <Tag size={16} />,
              options: [
                { value: 'todas', label: 'Todas las categorías' },
                { value: 'angeles', label: 'Ángeles y Arcángeles' },
                { value: 'cartas', label: 'Cartas Angelicales' },
                { value: 'canalizacion', label: 'Canalización' },
                { value: 'sanacion', label: 'Sanación Energética' }
              ]
            },
            {
              key: 'modalidad',
              label: 'Modalidad',
              icon: <MapPin size={16} />,
              options: [
                { value: 'todas', label: 'Todas las modalidades' },
                { value: 'online', label: 'Online' },
                { value: 'presencial', label: 'Presencial' },
                { value: 'hibrido', label: 'Híbrido' }
              ]
            }
          ],
          actionLabel: actionLabel || 'Ver Cursos'
        };

      case 'blog':
        return {
          placeholder: "Buscar blog & podcasts...",
          filters: [
            {
              key: 'tipo',
              label: 'Tipo de Contenido',
              icon: <BookOpen size={16} />,
              options: [
                { value: 'todos', label: 'Blog y Podcasts' },
                { value: 'blog', label: 'Solo Blog' },
                { value: 'podcast', label: 'Solo Podcasts' },
                { value: 'videos', label: 'Videos' }
              ]
            },
            {
              key: 'categoria',
              label: 'Categoría',
              icon: <Tag size={16} />,
              options: [
                { value: 'todas', label: 'Todas las categorías' },
                { value: 'espiritualidad', label: 'Espiritualidad' },
                { value: 'angeles', label: 'Ángeles' },
                { value: 'meditacion', label: 'Meditación' },
                { value: 'autoayuda', label: 'Autoayuda' }
              ]
            },
            {
              key: 'estado',
              label: 'Estado',
              icon: <Star size={16} />,
              options: [
                { value: 'todos', label: 'Todos' },
                { value: 'favoritos', label: 'Favoritos' },
                { value: 'destacados', label: 'Destacados' },
                { value: 'recientes', label: 'Recientes' }
              ]
            }
          ],
          actionLabel: actionLabel || 'Publicar Contenido'
        };

      case 'tienda':
        return {
          placeholder: "Buscar productos...",
          filters: [
            {
              key: 'categoria',
              label: 'Categoría',
              icon: <Tag size={16} />,
              options: [
                { value: 'todas', label: 'Todas las categorías' },
                { value: 'cartas', label: 'Cartas Angelicales' },
                { value: 'libros', label: 'Libros' },
                { value: 'cristales', label: 'Cristales' },
                { value: 'velas', label: 'Velas Energéticas' },
                { value: 'aceites', label: 'Aceites Esenciales' }
              ]
            },
            {
              key: 'precio',
              label: 'Rango de Precio',
              icon: <Star size={16} />,
              options: [
                { value: 'todos', label: 'Todos los precios' },
                { value: '0-25', label: '0€ - 25€' },
                { value: '25-50', label: '25€ - 50€' },
                { value: '50-100', label: '50€ - 100€' },
                { value: '100+', label: '100€+' }
              ]
            },
            {
              key: 'disponibilidad',
              label: 'Disponibilidad',
              icon: <Star size={16} />,
              options: [
                { value: 'todos', label: 'Todos los productos' },
                { value: 'disponible', label: 'En stock' },
                { value: 'agotado', label: 'Agotado' },
                { value: 'preventa', label: 'Pre-venta' }
              ]
            }
          ],
          actionLabel: actionLabel || 'Ver Carrito'
        };

      default:
        return {
          placeholder: "Buscar...",
          filters: [],
          actionLabel: 'Acción'
        };
    }
  };

  const config = getFilterConfig();

  const getThemeClass = () => {
    switch (type) {
      case 'tirada': return 'tirada-theme';
      case 'canalizaciones': return 'canalizaciones-theme';
      case 'terapias': return 'terapias-theme';
      case 'academia': return 'academia-theme';
      case 'blog': return 'blog-theme';
      case 'tienda': return 'tienda-theme';
      default: return '';
    }
  };

  return (
    <div className={`filter-bar ${getThemeClass()} mx-4`}>
      <div className="filter-bar-container">
        {/* Solo mostrar filtros y botón de acción, la búsqueda ha sido temporalmente removida */}
        
        {/* Filtros dropdown */}
        {config.filters.map((filter) => (
          <div key={filter.key} className="filter-dropdown">
            <select
              value={filters?.[filter.key] || filter.options[0]?.value || ''}
              onChange={(e) => onFilterChange && onFilterChange(filter.key, e.target.value)}
            >
              {filter.options.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            <div className="filter-icon">
              {filter.icon}
            </div>
          </div>
        ))}

        {/* Selector de fecha (solo para eventos) */}
        {config.hasDatePicker && (
          <div className="filter-date">
            <input
              type="date"
              value={filters?.fecha || ''}
              onChange={(e) => onFilterChange && onFilterChange('fecha', e.target.value)}
              placeholder="mm/dd/yyyy"
            />
            <Calendar size={18} className="date-icon" />
          </div>
        )}

        {/* Botón de acción */}
        <button 
          className="filter-action-btn"
          onClick={onActionClick}
        >
          {config.actionLabel}
        </button>
      </div>
    </div>
  );
};

export default FilterBar;