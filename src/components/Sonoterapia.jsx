import React, { useState, useRef, useEffect, useContext, createContext } from 'react';
import './Sonoterapia.css';
import useAutoScrollToContent from '../hooks/useAutoScrollToContent';
import { 
  ArrowLeft, Play, Pause, Volume2, VolumeX, Download, Star, Lock, 
  ShoppingCart, AlertTriangle, Heart, Brain, Waves, Moon, Sparkles,
  Headphones, Music, Timer, RotateCcw, Settings, Share2, Bookmark,
  Search, Filter, Grid, List, Maximize2, X, Clock, Users
} from 'lucide-react';
import InstruccionesAngelicales from './InstruccionesAngelicales';
import FooterLegal from './FooterLegal';

// Context para el estado de la sonoterapia
const SonoterapiaContext = createContext();

// Provider del contexto
export const SonoterapiaProvider = ({ children }) => {
  const [sonoterapiaState, setSonoterapiaState] = useState({
    categoriaActiva: 'frecuencias',
    audioActual: null,
    reproduciendo: false,
    volumen: 0.7,
    progreso: 0,
    duracion: 0,
    tiempoActual: 0,
    modalExpandido: false,
    vistaActual: 'grid',
    filtroActivo: 'todos',
    busqueda: '',
    favoritos: [],
    historialReproduccion: [],
    configuracion: {
      autoplay: false,
      repetir: false,
      calidad: 'alta'
    }
  });

  const updateSonoterapiaState = (updates) => {
    setSonoterapiaState(prev => ({ ...prev, ...updates }));
  };

  const agregarFavorito = (audio) => {
    setSonoterapiaState(prev => ({
      ...prev,
      favoritos: [...prev.favoritos.filter(f => f.id !== audio.id), audio]
    }));
  };

  const quitarFavorito = (audioId) => {
    setSonoterapiaState(prev => ({
      ...prev,
      favoritos: prev.favoritos.filter(f => f.id !== audioId)
    }));
  };

  return (
    <SonoterapiaContext.Provider value={{
      sonoterapiaState,
      updateSonoterapiaState,
      agregarFavorito,
      quitarFavorito
    }}>
      {children}
    </SonoterapiaContext.Provider>
  );
};

// Hook para usar el contexto
const useSonoterapia = () => {
  const context = useContext(SonoterapiaContext);
  if (!context) {
    throw new Error('useSonoterapia must be used within a SonoterapiaProvider');
  }
  return context;
};

// Datos de categorías y audios
const categorias = {
  frecuencias: {
    titulo: "Frecuencias Sagradas",
    icono: "🎵",
    color: "from-purple-500 to-pink-500",
    descripcion: "Frecuencias específicas para armonizar cuerpo, mente y alma",
    audios: [
      {
        id: 1,
        titulo: "432Hz - Frecuencia del Amor",
        descripcion: "Armoniza el corazón y equilibra las emociones profundamente",
        duracion: "8:00:00",
        duracionMuestra: "3:00",
        premium: false,
        precio: null,
        beneficios: ["Reduce estrés", "Equilibra emociones", "Armoniza chakras", "Mejora concentración"],
        categoria: "Sanación",
        popularidad: 95,
        rating: 4.9,
        reproducciones: 15420,
        imagen: "https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=400&h=300&fit=crop",
        url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3",
        tags: ["432hz", "amor", "corazón", "equilibrio"],
        fechaCreacion: "2024-01-15"
      },
      {
        id: 2,
        titulo: "528Hz - Frecuencia de la Sanación",
        descripcion: "Repara el ADN y sana a nivel celular, conocida como la frecuencia del amor",
        duracion: "8:00:00",
        duracionMuestra: "3:00",
        premium: true,
        precio: 5.99,
        beneficios: ["Sanación celular", "Reparación ADN", "Transformación", "Regeneración"],
        categoria: "Sanación",
        popularidad: 88,
        rating: 4.8,
        reproducciones: 12350,
        imagen: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=300&fit=crop",
        url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3",
        tags: ["528hz", "sanación", "ADN", "transformación"],
        fechaCreacion: "2024-01-20"
      },
      {
        id: 3,
        titulo: "741Hz - Frecuencia de la Limpieza",
        descripcion: "Limpia toxinas energéticas y purifica el aura completamente",
        duracion: "8:00:00",
        duracionMuestra: "3:00",
        premium: true,
        precio: 5.99,
        beneficios: ["Limpieza energética", "Purificación", "Claridad mental", "Desintoxicación"],
        categoria: "Limpieza",
        popularidad: 82,
        rating: 4.7,
        reproducciones: 9870,
        imagen: "https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=400&h=300&fit=crop",
        url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3",
        tags: ["741hz", "limpieza", "purificación", "claridad"],
        fechaCreacion: "2024-01-25"
      }
    ]
  },
  concentracion: {
    titulo: "Concentración y Estudio",
    icono: "🧠",
    color: "from-blue-500 to-cyan-500",
    descripcion: "Ondas binaurales para máximo enfoque y productividad",
    audios: [
      {
        id: 4,
        titulo: "Focus Deep - Concentración Profunda",
        descripcion: "Ondas binaurales optimizadas para máximo enfoque mental",
        duracion: "8:00:00",
        duracionMuestra: "3:00",
        premium: true,
        precio: 5.99,
        beneficios: ["Concentración extrema", "Productividad", "Claridad mental", "Enfoque sostenido"],
        categoria: "Productividad",
        popularidad: 91,
        rating: 4.8,
        reproducciones: 11200,
        imagen: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop",
        url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3",
        tags: ["concentración", "estudio", "productividad", "enfoque"],
        fechaCreacion: "2024-02-01"
      }
    ]
  },
  relajacion: {
    titulo: "Relajación Profunda",
    icono: "🌊",
    color: "from-green-500 to-teal-500",
    descripcion: "Sonidos naturales y frecuencias para relajación total",
    audios: [
      {
        id: 5,
        titulo: "Ocean Dreams - Sueños del Océano",
        descripcion: "Sonidos del mar combinados con frecuencias relajantes",
        duracion: "8:00:00",
        duracionMuestra: "3:00",
        premium: true,
        precio: 5.99,
        beneficios: ["Relajación profunda", "Reducción ansiedad", "Paz interior", "Calma mental"],
        categoria: "Relajación",
        popularidad: 87,
        rating: 4.9,
        reproducciones: 13450,
        imagen: "https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=400&h=300&fit=crop",
        url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-5.mp3",
        tags: ["océano", "relajación", "naturaleza", "calma"],
        fechaCreacion: "2024-02-05"
      }
    ]
  },
  meditacion: {
    titulo: "Meditación Guiada",
    icono: "🧘",
    color: "from-indigo-500 to-purple-500",
    descripcion: "Sesiones guiadas para diferentes tipos de meditación",
    audios: [
      {
        id: 6,
        titulo: "Chakra Alignment - Alineación de Chakras",
        descripcion: "Meditación guiada para equilibrar y alinear todos los chakras",
        duracion: "8:00:00",
        duracionMuestra: "3:00",
        premium: true,
        precio: 5.99,
        beneficios: ["Equilibrio energético", "Alineación chakras", "Armonía", "Conexión espiritual"],
        categoria: "Espiritual",
        popularidad: 89,
        rating: 4.8,
        reproducciones: 10890,
        imagen: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=300&fit=crop",
        url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-6.mp3",
        tags: ["chakras", "meditación", "equilibrio", "energía"],
        fechaCreacion: "2024-02-10"
      }
    ]
  },
  sueno: {
    titulo: "Sueño Reparador",
    icono: "😴",
    color: "from-blue-800 to-indigo-900",
    descripcion: "Ondas delta para un sueño profundo y reparador",
    audios: [
      {
        id: 7,
        titulo: "Deep Sleep - Sueño Profundo",
        descripcion: "Ondas delta especialmente diseñadas para un sueño reparador",
        duracion: "8:00:00",
        duracionMuestra: "3:00",
        premium: true,
        precio: 5.99,
        beneficios: ["Sueño profundo", "Descanso total", "Regeneración", "Recuperación"],
        categoria: "Sueño",
        popularidad: 93,
        rating: 4.9,
        reproducciones: 16780,
        imagen: "https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=400&h=300&fit=crop",
        url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-7.mp3",
        tags: ["sueño", "descanso", "delta", "reparador"],
        fechaCreacion: "2024-02-15"
      }
    ]
  }
};

// Función para validar URL de audio
const isValidAudioUrl = (url) => {
  if (!url || typeof url !== 'string') return false;
  try {
    const parsedUrl = new URL(url);
    return parsedUrl.protocol === 'http:' || parsedUrl.protocol === 'https:';
  } catch (e) {
    return false;
  }
};

// Componente principal
const Sonoterapia = ({ onVolver, addToCart }) => {
  // Auto-scroll to main content after 5 seconds
  useAutoScrollToContent('.main-content', 5000);
  
  const { 
    sonoterapiaState, 
    updateSonoterapiaState, 
    agregarFavorito, 
    quitarFavorito 
  } = useSonoterapia();
  
  const [audioError, setAudioError] = useState(null);
  const [cargandoAudio, setCargandoAudio] = useState(false);
  const [timerInterval, setTimerInterval] = useState(null);
  const [mostrarConfiguracion, setMostrarConfiguracion] = useState(false);
  const audioRef = useRef(null);

  // Obtener todos los audios de todas las categorías
  const todosLosAudios = Object.values(categorias).flatMap(cat => cat.audios);

  // Filtrar audios según búsqueda y filtros
  const audiosFiltrados = todosLosAudios.filter(audio => {
    const coincideBusqueda = audio.titulo.toLowerCase().includes(sonoterapiaState.busqueda.toLowerCase()) ||
                            audio.descripcion.toLowerCase().includes(sonoterapiaState.busqueda.toLowerCase()) ||
                            audio.tags.some(tag => tag.toLowerCase().includes(sonoterapiaState.busqueda.toLowerCase()));
    
    const coincideFiltro = sonoterapiaState.filtroActivo === 'todos' ||
                          (sonoterapiaState.filtroActivo === 'gratis' && !audio.premium) ||
                          (sonoterapiaState.filtroActivo === 'premium' && audio.premium) ||
                          (sonoterapiaState.filtroActivo === 'favoritos' && sonoterapiaState.favoritos.some(f => f.id === audio.id));
    
    return coincideBusqueda && coincideFiltro;
  });

  // Funciones de reproducción
  const reproducirAudio = (audio) => {
    setAudioError(null);
    
    if (sonoterapiaState.audioActual?.id === audio.id && sonoterapiaState.reproduciendo) {
      pausarAudio();
      return;
    }

    if (audio.premium && !audio.comprado) {
      // Agregar al carrito en lugar de solo mostrar alerta
      if (addToCart) {
        const cartItem = {
          id: audio.id,
          type: 'audio',
          name: audio.titulo,
          price: audio.precio,
          image: audio.imagen,
          category: 'Sonoterapia'
        };
        addToCart(cartItem);
        alert(`${audio.titulo} ha sido agregado al carrito por $${audio.precio} USD`);
      } else {
        alert(`Este audio premium cuesta $${audio.precio}. En producción, aquí se abriría el modal de compra.`);
      }
      return;
    }

    if (!isValidAudioUrl(audio.url)) {
      setAudioError("Audio no disponible temporalmente.");
      return;
    }

    if (timerInterval) clearInterval(timerInterval);

    updateSonoterapiaState({
      audioActual: audio,
      reproduciendo: false,
      tiempoActual: 0,
      progreso: 0,
      duracion: 0
    });

    setCargandoAudio(true);

    if (audioRef.current) {
      audioRef.current.src = audio.url;
      audioRef.current.volume = sonoterapiaState.volumen;
      audioRef.current.load();

      audioRef.current.play()
        .then(() => {
          // Reproducción iniciada exitosamente
        })
        .catch(error => {
          console.error("Error al reproducir audio:", error);
          setCargandoAudio(false);
          setAudioError("No se pudo reproducir el audio.");
        });
    }
  };

  const pausarAudio = () => {
    updateSonoterapiaState({ reproduciendo: false });
    if (audioRef.current) {
      audioRef.current.pause();
    }
    if (timerInterval) clearInterval(timerInterval);
  };

  const cambiarVolumen = (nuevoVolumen) => {
    updateSonoterapiaState({ volumen: nuevoVolumen });
    if (audioRef.current) {
      audioRef.current.volume = nuevoVolumen;
    }
  };

  const formatearTiempo = (segundos) => {
    if (isNaN(segundos) || !isFinite(segundos) || segundos < 0) {
      return "0:00";
    }
    const mins = Math.floor(segundos / 60);
    const secs = Math.floor(segundos % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const toggleFavorito = (audio) => {
    const esFavorito = sonoterapiaState.favoritos.some(f => f.id === audio.id);
    if (esFavorito) {
      quitarFavorito(audio.id);
    } else {
      agregarFavorito(audio);
    }
  };

  // Efectos
  useEffect(() => {
    const audioEl = audioRef.current;
    if (!audioEl) return;

    const handleLoadedMetadata = () => {
      const newDuracion = audioEl.duration;
      if (!isNaN(newDuracion) && isFinite(newDuracion)) {
        updateSonoterapiaState({ duracion: newDuracion, reproduciendo: true });
        setCargandoAudio(false);
        
        const interval = setInterval(() => {
          if (audioEl.paused || audioEl.ended) {
            clearInterval(interval);
            updateSonoterapiaState({ reproduciendo: false });
            if (audioEl.ended) updateSonoterapiaState({ progreso: 100 });
            return;
          }
          updateSonoterapiaState({
            tiempoActual: audioEl.currentTime,
            progreso: (audioEl.currentTime / audioEl.duration) * 100
          });
        }, 1000);
        setTimerInterval(interval);
      }
    };

    const handleError = () => {
      setCargandoAudio(false);
      setAudioError("Error al cargar el audio.");
      updateSonoterapiaState({ reproduciendo: false });
    };

    audioEl.addEventListener('loadedmetadata', handleLoadedMetadata);
    audioEl.addEventListener('error', handleError);

    return () => {
      audioEl.removeEventListener('loadedmetadata', handleLoadedMetadata);
      audioEl.removeEventListener('error', handleError);
      if (timerInterval) clearInterval(timerInterval);
    };
  }, [sonoterapiaState.audioActual]);

  return (
    <div className="sonoterapia-moderna">
      <audio ref={audioRef} />
      
      {/* Header */}
      <div className="sonoterapia-header">
        <div className="header-content">
          <button onClick={onVolver} className="btn-volver">
            <ArrowLeft size={20} />
            Volver al Dashboard
          </button>
          
          <div className="header-title">
            <h1>🎵 Sonoterapia Angelical</h1>
            <p>Frecuencias sagradas para tu bienestar integral</p>
          </div>
          
          <div className="header-actions">
            <button className="btn-header" onClick={() => setMostrarConfiguracion(true)}>
              <Settings size={20} />
              Config
            </button>
          </div>
        </div>
      </div>

      {/* Contenido principal */}
      <div className="sonoterapia-contenido main-content">
        {/* Filtros */}
        <div className="controles-principales">          
          <div className="filtros-container">
            <select
              value={sonoterapiaState.filtroActivo}
              onChange={(e) => updateSonoterapiaState({ filtroActivo: e.target.value })}
              className="filtro-select"
            >
              <option value="todos">Todos</option>
              <option value="gratis">Gratuitos</option>
              <option value="premium">Premium</option>
              <option value="favoritos">Favoritos</option>
            </select>
            
            <div className="vista-controles">
              <button
                className={`btn-vista ${sonoterapiaState.vistaActual === 'grid' ? 'activo' : ''}`}
                onClick={() => updateSonoterapiaState({ vistaActual: 'grid' })}
              >
                <Grid size={20} />
              </button>
              <button
                className={`btn-vista ${sonoterapiaState.vistaActual === 'list' ? 'activo' : ''}`}
                onClick={() => updateSonoterapiaState({ vistaActual: 'list' })}
              >
                <List size={20} />
              </button>
            </div>
          </div>
        </div>

        {/* Categorías */}
        <div className="categorias-filtros">
          {Object.entries(categorias).map(([key, categoria]) => (
            <button
              key={key}
              onClick={() => updateSonoterapiaState({ categoriaActiva: key })}
              className={`categoria-btn ${sonoterapiaState.categoriaActiva === key ? 'activa' : ''}`}
              style={{
                background: sonoterapiaState.categoriaActiva === key 
                  ? `linear-gradient(135deg, ${categoria.color.split(' ')[1]}, ${categoria.color.split(' ')[3]})` 
                  : 'white'
              }}
            >
              <span className="categoria-icono">{categoria.icono}</span>
              <span className="categoria-titulo">{categoria.titulo}</span>
            </button>
          ))}
        </div>

        {/* Lista de audios */}
        <div className={`audios-container vista-${sonoterapiaState.vistaActual}`}>
          {audiosFiltrados.length === 0 ? (
            <div className="sin-resultados">
              <Music size={64} className="sin-resultados-icono" />
              <h3>No se encontraron audios</h3>
              <p>Intenta ajustar tus filtros de búsqueda</p>
            </div>
          ) : (
            audiosFiltrados.map((audio) => (
              <AudioCard
                key={audio.id}
                audio={audio}
                esActual={sonoterapiaState.audioActual?.id === audio.id}
                reproduciendo={sonoterapiaState.reproduciendo}
                esFavorito={sonoterapiaState.favoritos.some(f => f.id === audio.id)}
                onReproducir={reproducirAudio}
                onToggleFavorito={toggleFavorito}
                vista={sonoterapiaState.vistaActual}
                cargando={cargandoAudio && sonoterapiaState.audioActual?.id === audio.id}
                error={audioError && sonoterapiaState.audioActual?.id === audio.id ? audioError : null}
                progreso={sonoterapiaState.progreso}
                tiempoActual={sonoterapiaState.tiempoActual}
                duracion={sonoterapiaState.duracion}
                volumen={sonoterapiaState.volumen}
                onCambiarVolumen={cambiarVolumen}
                formatearTiempo={formatearTiempo}
              />
            ))
          )}
        </div>
      </div>

      {/* Modal de configuración */}
      {mostrarConfiguracion && (
        <ModalConfiguracion onCerrar={() => setMostrarConfiguracion(false)} />
      )}

      {/* Footer Legal */}
      <FooterLegal />
    </div>
  );
};

// Componente de tarjeta de audio
const AudioCard = ({ 
  audio, esActual, reproduciendo, esFavorito, onReproducir, onToggleFavorito, 
  vista, cargando, error, progreso, tiempoActual, duracion, volumen, 
  onCambiarVolumen, formatearTiempo 
}) => {
  return (
    <div className={`audio-card ${vista} ${esActual ? 'actual' : ''}`}>
      <div className="audio-imagen">
        <img src={audio.imagen} alt={audio.titulo} />
        <div className="audio-overlay">
          <button
            className="btn-reproducir"
            onClick={() => onReproducir(audio)}
            disabled={cargando}
          >
            {cargando ? (
              <div className="spinner" />
            ) : esActual && reproduciendo ? (
              <Pause size={24} />
            ) : (
              <Play size={24} />
            )}
          </button>
        </div>
        {audio.premium && (
          <div className="premium-badge">
            <Star size={16} />
            Premium
          </div>
        )}
      </div>
      
      <div className="audio-info">
        <div className="audio-header">
          <h3 className="audio-titulo">{audio.titulo}</h3>
          <button
            className={`btn-favorito ${esFavorito ? 'activo' : ''}`}
            onClick={() => onToggleFavorito(audio)}
          >
            <Heart size={20} fill={esFavorito ? 'currentColor' : 'none'} />
          </button>
        </div>
        
        <p className="audio-descripcion">{audio.descripcion}</p>
        
        <div className="audio-beneficios">
          {audio.beneficios.slice(0, 3).map((beneficio, index) => (
            <span key={index} className="beneficio-tag">
              {beneficio}
            </span>
          ))}
        </div>
        
        <div className="audio-meta">
          <div className="meta-item">
            <Clock size={16} />
            <span>{audio.duracion}</span>
          </div>
          <div className="meta-item">
            <Users size={16} />
            <span>{audio.reproducciones.toLocaleString()}</span>
          </div>
          <div className="meta-item rating">
            <Star size={16} fill="currentColor" />
            <span>{audio.rating}</span>
          </div>
        </div>
        
        {audio.premium && !audio.comprado && (
          <div className="precio-container">
            <span className="precio">${audio.precio} USD</span>
            <button 
              className="btn-comprar"
              onClick={() => onReproducir(audio)}
            >
              <ShoppingCart size={16} />
              Comprar
            </button>
          </div>
        )}
        
        {error && (
          <div className="error-mensaje">
            <AlertTriangle size={16} />
            <span>{error}</span>
          </div>
        )}
        
        {esActual && (
          <div className="reproductor-mini">
            <div className="progreso-container">
              <div className="progreso-barra">
                <div 
                  className="progreso-fill"
                  style={{ width: `${progreso}%` }}
                />
              </div>
              <div className="tiempo-info">
                <span>{formatearTiempo(tiempoActual)}</span>
                <span>{formatearTiempo(duracion)}</span>
              </div>
            </div>
            
            <div className="controles-volumen">
              <Volume2 size={16} />
              <input
                type="range"
                min="0"
                max="1"
                step="0.01"
                value={volumen}
                onChange={(e) => onCambiarVolumen(parseFloat(e.target.value))}
                className="volumen-slider"
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

// Modal de configuración
const ModalConfiguracion = ({ onCerrar }) => {
  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div className="modal-header">
          <h3>Configuración de Sonoterapia</h3>
          <button onClick={onCerrar} className="btn-cerrar">
            <X size={24} />
          </button>
        </div>
        
        <div className="modal-body">
          <div className="config-section">
            <h4>Reproducción</h4>
            <label className="config-item">
              <input type="checkbox" />
              <span>Reproducción automática</span>
            </label>
            <label className="config-item">
              <input type="checkbox" />
              <span>Repetir audio</span>
            </label>
          </div>
          
          <div className="config-section">
            <h4>Calidad de Audio</h4>
            <select className="config-select">
              <option value="alta">Alta (320kbps)</option>
              <option value="media">Media (192kbps)</option>
              <option value="baja">Baja (128kbps)</option>
            </select>
          </div>
        </div>
        
        <div className="modal-footer">
          <button onClick={onCerrar} className="btn-guardar">
            Guardar Configuración
          </button>
        </div>
      </div>
    </div>
  );
};

// Componente principal con Provider
const SonoterapiaConProvider = ({ onVolver, addToCart }) => {
  return (
    <SonoterapiaProvider>
      <Sonoterapia onVolver={onVolver} addToCart={addToCart} />
    </SonoterapiaProvider>
  );
};

export default SonoterapiaConProvider;

