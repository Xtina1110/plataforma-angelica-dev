import React, { useState, useRef, useEffect, useContext, createContext } from 'react';
import './Sonoterapia.css';
import useAutoScrollToContent from '../hooks/useAutoScrollToContent';
import { 
  ArrowLeft, Play, Pause, Volume2, VolumeX, Download, Star, Lock, 
  ShoppingCart, AlertTriangle, Heart, Brain, Waves, Moon, Sparkles,
  Headphones, Music, Timer, RotateCcw, Settings, Share2, Bookmark,
  Search, Filter, Grid, List, Maximize2, X, Clock, Users, Check, ShoppingBag
} from 'lucide-react';
import { Link } from 'react-router-dom';

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
    comprados: [], // Audios comprados por el usuario
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

  const marcarComoComprado = (audioId) => {
    setSonoterapiaState(prev => ({
      ...prev,
      comprados: [...prev.comprados, audioId]
    }));
  };

  return (
    <SonoterapiaContext.Provider value={{
      sonoterapiaState,
      updateSonoterapiaState,
      agregarFavorito,
      quitarFavorito,
      marcarComoComprado
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
        imagen: "/images/sonoterapia/healing-frequencies.jpg",
        url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3",
        comprado: false
      },
      {
        id: 2,
        titulo: "528Hz - Reparación del ADN",
        descripcion: "Frecuencia milagrosa para transformación y sanación celular",
        duracion: "10:00:00",
        duracionMuestra: "3:00",
        premium: false,
        precio: null,
        beneficios: ["Repara ADN", "Aumenta energía vital", "Transforma consciencia", "Activa intuición"],
        categoria: "Transformación",
        popularidad: 98,
        rating: 5.0,
        reproducciones: 23100,
        imagen: "/images/sonoterapia/sound-healing.jpg",
        url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3",
        comprado: false
      },
      {
        id: 3,
        titulo: "741Hz - Despertar Intuitivo",
        descripcion: "Limpia toxinas y despierta la intuición y expresión creativa",
        duracion: "12:00:00",
        duracionMuestra: "3:00",
        premium: false,
        precio: null,
        beneficios: ["Limpia toxinas", "Despierta intuición", "Aumenta creatividad", "Claridad mental"],
        categoria: "Despertar",
        popularidad: 92,
        rating: 4.8,
        reproducciones: 18500,
        imagen: "/images/sonoterapia/sacred-geometry.jpg",
        url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3",
        comprado: false
      }
    ]
  },
  meditacion: {
    titulo: "Meditación Profunda",
    icono: "🧘‍♀️",
    color: "from-blue-500 to-cyan-500",
    descripcion: "Audios diseñados para estados meditativos profundos",
    audios: [
      {
        id: 4,
        titulo: "Meditación Trascendental",
        descripcion: "Alcanza estados profundos de consciencia y paz interior",
        duracion: "20:00:00",
        duracionMuestra: "5:00",
        premium: false,
        precio: null,
        beneficios: ["Paz profunda", "Consciencia expandida", "Reducción estrés", "Claridad mental"],
        categoria: "Meditación",
        popularidad: 88,
        rating: 4.7,
        reproducciones: 12300,
        imagen: "/images/sonoterapia/tibetan-bowls.jpg",
        url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3",
        comprado: false
      }
    ]
  },
  sueno: {
    titulo: "Sueño Reparador",
    icono: "🌙",
    color: "from-indigo-500 to-purple-500",
    descripcion: "Frecuencias para un descanso profundo y reparador",
    audios: [
      {
        id: 5,
        titulo: "Delta Waves - Sueño Profundo",
        descripcion: "Ondas delta para un sueño reparador y regenerador",
        duracion: "8:00:00",
        duracionMuestra: "3:00",
        premium: false,
        precio: null,
        beneficios: ["Sueño profundo", "Regeneración celular", "Reduce insomnio", "Descanso reparador"],
        categoria: "Sueño",
        popularidad: 94,
        rating: 4.9,
        reproducciones: 19800,
        imagen: "/images/sonoterapia/ocean-waves.jpg",
        url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-5.mp3",
        comprado: false
      }
    ]
  }
};

// Componente principal
const Sonoterapia = ({ onVolver, addToCart }) => {
  const { 
    sonoterapiaState, 
    updateSonoterapiaState, 
    agregarFavorito, 
    quitarFavorito,
    marcarComoComprado
  } = useSonoterapia();
  
  const [cargandoAudio, setCargandoAudio] = useState(false);
  const [audioError, setAudioError] = useState(null);
  const [timerInterval, setTimerInterval] = useState(null);
  const [mostrarConfiguracion, setMostrarConfiguracion] = useState(false);
  const audioRef = useRef(null);

  useAutoScrollToContent('.main-content', 2000);

  // Obtener audios de la categoría activa
  const audiosActuales = categorias[sonoterapiaState.categoriaActiva]?.audios || [];
  
  // Filtrar audios
  const audiosFiltrados = audiosActuales.filter(audio => {
    if (sonoterapiaState.filtroActivo === 'gratis' && audio.premium) return false;
    if (sonoterapiaState.filtroActivo === 'premium' && !audio.premium) return false;
    if (sonoterapiaState.filtroActivo === 'favoritos' && !sonoterapiaState.favoritos.some(f => f.id === audio.id)) return false;
    if (sonoterapiaState.filtroActivo === 'comprados' && !sonoterapiaState.comprados.includes(audio.id)) return false;
    if (sonoterapiaState.busqueda && !audio.titulo.toLowerCase().includes(sonoterapiaState.busqueda.toLowerCase())) return false;
    return true;
  });

  const isValidAudioUrl = (url) => {
    return url && url.startsWith('http');
  };

  const reproducirAudio = (audio) => {
    setAudioError(null);

    if (sonoterapiaState.audioActual?.id === audio.id && sonoterapiaState.reproduciendo) {
      pausarAudio();
      return;
    }

    if (audio.premium && !sonoterapiaState.comprados.includes(audio.id)) {
      // No permitir reproducción de premium no comprado
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

  const handleComprar = (audio) => {
    if (addToCart) {
      const cartItem = {
        id: `sonoterapia-${audio.id}`,
        type: 'sonoterapia',
        name: audio.titulo,
        price: audio.precio,
        image: audio.imagen,
        category: 'Sonoterapia',
        duration: audio.duracion
      };
      addToCart(cartItem);
      alert(`${audio.titulo} ha sido agregado al carrito por $${audio.precio} USD`);
    }
  };

  const handleDescargar = (audio) => {
    if (!sonoterapiaState.comprados.includes(audio.id) && audio.premium) {
      alert('Debes comprar este audio antes de descargarlo');
      return;
    }
    alert(`Descargando: ${audio.titulo}`);
    // Aquí iría la lógica real de descarga
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
      
      {/* HEADER ELIMINADO - Solo filtros */}

      {/* Contenido principal */}
      <div className="sonoterapia-contenido main-content">
        {/* Link a Mis Sonoterapias */}
        <div className="mis-sonoterapias-link-container">
          <Link to="/mis-sonoterapias" className="mis-sonoterapias-link">
            <ShoppingBag size={20} />
            <span>Mis Sonoterapias</span>
            <span className="badge-count">{sonoterapiaState.comprados.length}</span>
          </Link>
        </div>

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
              <option value="comprados">Comprados</option>
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
                esComprado={sonoterapiaState.comprados.includes(audio.id)}
                onReproducir={reproducirAudio}
                onToggleFavorito={toggleFavorito}
                onComprar={handleComprar}
                onDescargar={handleDescargar}
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

      {/* FOOTER ELIMINADO - Manejado por Dashboard */}
    </div>
  );
};

// Componente de tarjeta de audio REDISEÑADO
const AudioCard = ({ 
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
      className={`audio-card-nueva ${vista} ${esActual ? 'actual' : ''} ${previewing ? 'previewing' : ''}`}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {/* Background image */}
      <div 
        className="audio-card-background"
        style={{
          backgroundImage: `url(${audio.imagen})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat'
        }}
      />
      
      {/* Icono dorado circular */}
      <div className="audio-icono-dorado">
        <Headphones className="w-8 h-8" />
      </div>

      {/* Preview indicator */}
      {previewing && (
        <div className="preview-indicator">
          <Play size={14} />
          <span>Preview 30s</span>
        </div>
      )}

      {/* Contenido de la tarjeta */}
      <div className="audio-card-contenido">
        {/* Header con título y favorito */}
        <div className="audio-card-header">
          <h3 className="audio-card-titulo">{audio.titulo}</h3>
          <button
            className={`btn-favorito-nuevo ${esFavorito ? 'activo' : ''}`}
            onClick={() => onToggleFavorito(audio)}
          >
            <Heart size={20} fill={esFavorito ? 'currentColor' : 'none'} />
          </button>
        </div>

        {/* Descripción */}
        <p className="audio-card-descripcion">{audio.descripcion}</p>

        {/* Metadatos */}
        <div className="audio-card-meta">
          <div className="meta-item-nuevo">
            <span className="meta-label">Categoría:</span>
            <span className="meta-value">{audio.categoria}</span>
          </div>
          <div className="meta-item-nuevo">
            <span className="meta-label">Duración:</span>
            <span className="meta-value">{audio.duracion}</span>
          </div>
          <div className="meta-item-nuevo">
            <span className="meta-label">Precio:</span>
            <span className="meta-value">{audio.premium ? `$${audio.precio} USD` : 'Gratis'}</span>
          </div>
        </div>

        {/* Badge de comprado */}
        {esComprado && (
          <div className="badge-comprado">
            <Check size={16} />
            <span>Ya comprada</span>
          </div>
        )}

        {/* Botones de acción */}
        <div className="audio-card-acciones">
          {audio.premium && !esComprado ? (
            <button 
              className="btn-comprar-nuevo"
              onClick={() => onComprar(audio)}
            >
              <ShoppingCart size={18} />
              <span>Comprar</span>
            </button>
          ) : (
            <button 
              className="btn-reproducir-nuevo"
              onClick={() => onReproducir(audio)}
              disabled={cargando}
            >
              {cargando ? (
                <div className="spinner-nuevo" />
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
            className="btn-descargar-nuevo"
            onClick={() => onDescargar(audio)}
            disabled={audio.premium && !esComprado}
          >
            <Download size={18} />
            <span>Bajar</span>
          </button>
        </div>

        {/* Barra de progreso si está reproduciéndose */}
        {esActual && reproduciendo && (
          <div className="progreso-container-nuevo">
            <div className="progreso-barra-nuevo">
              <div 
                className="progreso-fill-nuevo"
                style={{ width: `${progreso}%` }}
              />
            </div>
            <div className="tiempo-info-nuevo">
              <span>{formatearTiempo(tiempoActual)}</span>
              <span>{formatearTiempo(duracion)}</span>
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

