import React, { useState, useContext, createContext, useRef } from 'react';
import './CanalizacionesAngelicales.css';
import useAutoScrollToContent from '../hooks/useAutoScrollToContent';
import {
  ArrowLeft, Play, Pause, Download, Volume2, Heart, Shield, Star, Target,
  Sun, MessageCircle, Filter, Grid, List, Maximize2, X, Clock,
  Users, Share2, Bookmark, Settings, RotateCcw, Headphones, Music, Sparkles
} from 'lucide-react';
import AngelicalModal from './AngelicalModal';
import FooterLegal from './FooterLegal';
import { getCanalizaciones } from '../data/canalizacionesData';
import { generateCanalizacionPDF } from '../utils/canalizacionPDFGenerator';

// Context para las canalizaciones
const CanalizacionesContext = createContext();

// Provider del contexto
export const CanalizacionesProvider = ({ children }) => {
  const [canalizacionesState, setCanalizacionesState] = useState({
    canalizacionSeleccionada: null,
    mostrandoMensaje: false,
    audioReproduciendo: false,
    modalExpandido: false,
    vistaActual: 'grid',
    filtroActivo: 'todos',
    busqueda: '',
    favoritos: [],
    historialCanalizaciones: [],
    configuracion: {
      autoplay: false,
      velocidadLectura: 'normal',
      vozNarracion: 'femenina'
    }
  });

  const updateCanalizacionesState = (updates) => {
    setCanalizacionesState(prev => ({ ...prev, ...updates }));
  };

  const agregarFavorito = (canalizacion) => {
    setCanalizacionesState(prev => ({
      ...prev,
      favoritos: [...prev.favoritos.filter(f => f.id !== canalizacion.id), canalizacion]
    }));
  };

  const quitarFavorito = (canalizacionId) => {
    setCanalizacionesState(prev => ({
      ...prev,
      favoritos: prev.favoritos.filter(f => f.id !== canalizacionId)
    }));
  };

  const agregarHistorial = (canalizacion) => {
    setCanalizacionesState(prev => ({
      ...prev,
      historialCanalizaciones: [
        canalizacion,
        ...prev.historialCanalizaciones.filter(h => h.id !== canalizacion.id).slice(0, 9)
      ]
    }));
  };

  return (
    <CanalizacionesContext.Provider value={{
      canalizacionesState,
      updateCanalizacionesState,
      agregarFavorito,
      quitarFavorito,
      agregarHistorial
    }}>
      {children}
    </CanalizacionesContext.Provider>
  );
};

// Hook para usar el contexto
const useCanalizaciones = () => {
  const context = useContext(CanalizacionesContext);
  if (!context) {
    throw new Error('useCanalizaciones must be used within a CanalizacionesProvider');
  }
  return context;
};

// Componente de Tarjeta de Canalización
const CanalizacionCard = ({ canalizacion, esFavorito, onSeleccionar, onToggleFavorito, vista }) => {
  const getIconoArcangel = (nombre) => {
    const iconos = {
      'Miguel': <Shield className="w-8 h-8" />,
      'Gabriel': <MessageCircle className="w-8 h-8" />,
      'Rafael': <Heart className="w-8 h-8" />,
      'Uriel': <Sun className="w-8 h-8" />
    };
    return iconos[nombre] || <Star className="w-8 h-8" />;
  };

  if (vista === 'list') {
    return (
      <div className="canalizacion-card-list" onClick={() => onSeleccionar(canalizacion)}>
        <div className="card-list-icono">
          <div className={`icono-container bg-gradient-to-br ${canalizacion.color}`}>
            {getIconoArcangel(canalizacion.arcangel)}
          </div>
        </div>
        
        <div className="card-list-contenido">
          <div className="card-list-header">
            <h3>{canalizacion.titulo}</h3>
            <span className="categoria-badge">{canalizacion.categoria}</span>
          </div>
          <p className="card-list-descripcion">{canalizacion.descripcion}</p>
          <div className="card-list-meta">
            <span><Clock size={14} /> {canalizacion.duracion}</span>
            <span><Music size={14} /> {canalizacion.frecuenciaSonora}</span>
            <span>⭐ {canalizacion.rating}</span>
          </div>
        </div>
        
        <button 
          className={`btn-favorito ${esFavorito ? 'activo' : ''}`}
          onClick={(e) => {
            e.stopPropagation();
            onToggleFavorito(canalizacion);
          }}
        >
          <Heart size={20} fill={esFavorito ? 'currentColor' : 'none'} />
        </button>
      </div>
    );
  }

  // Vista Grid
  return (
    <div className="canalizacion-card" onClick={() => onSeleccionar(canalizacion)}>
      <div className="card-imagen-container">
        <img src={canalizacion.imagen} alt={canalizacion.titulo} className="card-imagen" />
        <div className={`card-overlay bg-gradient-to-br ${canalizacion.color}`}>
          <div className="card-icono">
            {getIconoArcangel(canalizacion.arcangel)}
          </div>
        </div>
        {canalizacion.premium && !canalizacion.comprado && (
          <div className="badge-premium">
            <Sparkles size={16} />
            Premium ${canalizacion.precio}
          </div>
        )}
      </div>
      
      <div className="card-contenido">
        <div className="card-header">
          <h3 className="card-titulo">{canalizacion.titulo}</h3>
          <button 
            className={`btn-favorito ${esFavorito ? 'activo' : ''}`}
            onClick={(e) => {
              e.stopPropagation();
              onToggleFavorito(canalizacion);
            }}
          >
            <Heart size={18} fill={esFavorito ? 'currentColor' : 'none'} />
          </button>
        </div>
        
        <p className="card-descripcion">{canalizacion.descripcion}</p>
        
        <div className="card-meta">
          <span className="meta-item">
            <Clock size={14} />
            {canalizacion.duracion}
          </span>
          <span className="meta-item">
            <Music size={14} />
            {canalizacion.frecuenciaSonora}
          </span>
          <span className="meta-item">
            <Star size={14} />
            {canalizacion.rating}
          </span>
        </div>
        
        <div className="card-tags">
          {canalizacion.tags.slice(0, 3).map((tag, index) => (
            <span key={index} className="tag">#{tag}</span>
          ))}
        </div>
      </div>
    </div>
  );
};

// Componente del Mensaje Canalizado
const MensajeCanalizado = ({ canalizacion, audioReproduciendo, onToggleAudio, onDescargarPDF, onCompartir, onVolver }) => {
  const [seccionActiva, setSeccionActiva] = useState('mensaje');

  const renderSeccion = () => {
    switch(seccionActiva) {
      case 'preparacion':
        return (
          <div className="seccion-contenido">
            <h3>{canalizacion.contenido.preparacionEnergetica.titulo}</h3>
            <p className="duracion-seccion">⏱️ {canalizacion.contenido.preparacionEnergetica.duracion}</p>
            {canalizacion.contenido.preparacionEnergetica.pasos.map((paso, index) => (
              <div key={index} className="paso-container">
                <h4>{paso.numero}. {paso.titulo}</h4>
                <p>{paso.descripcion}</p>
              </div>
            ))}
          </div>
        );
      
      case 'visualizacion':
        return (
          <div className="seccion-contenido">
            <h3>{canalizacion.contenido.visualizacionGuiada.titulo}</h3>
            <p className="duracion-seccion">⏱️ {canalizacion.contenido.visualizacionGuiada.duracion}</p>
            <div className="texto-visualizacion">
              {canalizacion.contenido.visualizacionGuiada.texto.split('\n').map((parrafo, index) => (
                <p key={index}>{parrafo}</p>
              ))}
            </div>
          </div>
        );
      
      case 'mensaje':
        return (
          <div className="seccion-contenido">
            <h3>{canalizacion.contenido.mensajeCanalizado.titulo}</h3>
            <p className="duracion-seccion">⏱️ {canalizacion.contenido.mensajeCanalizado.duracion}</p>
            <div className="mensaje-principal">
              {canalizacion.contenido.mensajeCanalizado.texto.split('\n').map((parrafo, index) => (
                <p key={index} className={parrafo.trim() === '' ? 'espacio' : ''}>{parrafo}</p>
              ))}
            </div>
          </div>
        );
      
      case 'integracion':
        return (
          <div className="seccion-contenido">
            <h3>{canalizacion.contenido.integracionPractica.titulo}</h3>
            <p className="duracion-seccion">⏱️ {canalizacion.contenido.integracionPractica.duracion}</p>
            {canalizacion.contenido.integracionPractica.pasos.map((paso, index) => (
              <div key={index} className="paso-container">
                <h4>{paso.numero}. {paso.titulo}</h4>
                <p>{paso.descripcion}</p>
              </div>
            ))}
          </div>
        );
      
      case 'cierre':
        return (
          <div className="seccion-contenido">
            <h3>{canalizacion.contenido.cierreEnergetico.titulo}</h3>
            <p className="duracion-seccion">⏱️ {canalizacion.contenido.cierreEnergetico.duracion}</p>
            <div className="texto-cierre">
              {canalizacion.contenido.cierreEnergetico.texto.split('\n').map((parrafo, index) => (
                <p key={index}>{parrafo}</p>
              ))}
            </div>
            
            <div className="decreto-afirmacion">
              <div className="decreto-box">
                <h4>🕊️ Decreto Final</h4>
                <p className="decreto-texto">{canalizacion.decretoFinal}</p>
              </div>
              
              <div className="afirmacion-box">
                <h4>💎 Afirmación Diaria</h4>
                <p className="afirmacion-texto">{canalizacion.afirmacionDiaria}</p>
              </div>
            </div>
          </div>
        );
      
      default:
        return null;
    }
  };

  return (
    <div className="mensaje-canalizado-container">
      <button className="btn-volver-mensaje" onClick={onVolver}>
        <ArrowLeft size={20} />
        Volver a Canalizaciones
      </button>

      <div className="mensaje-header">
        <div className={`mensaje-icono bg-gradient-to-br ${canalizacion.color}`}>
          <Shield className="w-12 h-12" />
        </div>
        <div className="mensaje-info">
          <h2>{canalizacion.titulo}</h2>
          <p className="mensaje-arcangel">Arcángel {canalizacion.arcangel}</p>
          <div className="mensaje-meta">
            <span>⏱️ {canalizacion.duracion}</span>
            <span>🎵 {canalizacion.frecuenciaSonora}</span>
            <span>💎 {canalizacion.cristalRecomendado}</span>
            <span>🎨 {canalizacion.colorVibracional}</span>
          </div>
        </div>
      </div>

      {/* Navegación de secciones */}
      <div className="secciones-nav">
        <button 
          className={`seccion-btn ${seccionActiva === 'preparacion' ? 'activa' : ''}`}
          onClick={() => setSeccionActiva('preparacion')}
        >
          🕯️ Preparación
        </button>
        <button 
          className={`seccion-btn ${seccionActiva === 'visualizacion' ? 'activa' : ''}`}
          onClick={() => setSeccionActiva('visualizacion')}
        >
          🌌 Visualización
        </button>
        <button 
          className={`seccion-btn ${seccionActiva === 'mensaje' ? 'activa' : ''}`}
          onClick={() => setSeccionActiva('mensaje')}
        >
          👼 Mensaje
        </button>
        <button 
          className={`seccion-btn ${seccionActiva === 'integracion' ? 'activa' : ''}`}
          onClick={() => setSeccionActiva('integracion')}
        >
          🌿 Integración
        </button>
        <button 
          className={`seccion-btn ${seccionActiva === 'cierre' ? 'activa' : ''}`}
          onClick={() => setSeccionActiva('cierre')}
        >
          🔔 Cierre
        </button>
      </div>

      {/* Contenido de la sección */}
      <div className="mensaje-contenido-principal">
        {renderSeccion()}
      </div>

      {/* Controles */}
      <div className="controles-mensaje">
        <button className="btn-control primario" onClick={onToggleAudio}>
          {audioReproduciendo ? <Pause size={20} /> : <Play size={20} />}
          {audioReproduciendo ? 'Pausar Audio' : 'Escuchar Canalización'}
        </button>
        
        <button className="btn-control secundario" onClick={onDescargarPDF}>
          <Download size={20} />
          Descargar PDF Completo
        </button>
        
        <button className="btn-control secundario" onClick={onCompartir}>
          <Share2 size={20} />
          Compartir
        </button>
      </div>

      {audioReproduciendo && (
        <div className="reproductor-audio">
          <div className="audio-info">
            <Headphones size={20} />
            <span>Reproduciendo canalización de {canalizacion.arcangel}...</span>
          </div>
          <div className="audio-progreso">
            <div className="progreso-barra">
              <div className="progreso-fill" style={{ width: '45%' }} />
            </div>
            <div className="tiempo-info">
              <span>6:30</span>
              <span>{canalizacion.duracion}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// Componente principal
const CanalizacionesAngelicales = ({ onVolver, addToCart }) => {
  useAutoScrollToContent();
  const {
    canalizacionesState,
    updateCanalizacionesState,
    agregarFavorito,
    quitarFavorito,
    agregarHistorial
  } = useCanalizaciones();

  const [mostrarConfiguracion, setMostrarConfiguracion] = useState(false);
  const audioRef = useRef(null);
  const [modalState, setModalState] = useState({
    isOpen: false,
    title: '',
    message: '',
    type: 'success'
  });

  // Obtener canalizaciones desde el archivo de datos
  const canalizaciones = getCanalizaciones();

  // Filtrar canalizaciones según búsqueda y filtros
  const canalizacionesFiltradas = canalizaciones.filter(canalizacion => {
    const coincideBusqueda = canalizacion.titulo.toLowerCase().includes(canalizacionesState.busqueda.toLowerCase()) ||
                            canalizacion.descripcion.toLowerCase().includes(canalizacionesState.busqueda.toLowerCase()) ||
                            canalizacion.tags.some(tag => tag.toLowerCase().includes(canalizacionesState.busqueda.toLowerCase()));
    
    const coincideFiltro = canalizacionesState.filtroActivo === 'todos' ||
                          (canalizacionesState.filtroActivo === 'favoritos' && canalizacionesState.favoritos.some(f => f.id === canalizacion.id)) ||
                          (canalizacionesState.filtroActivo === 'recientes' && canalizacionesState.historialCanalizaciones.some(h => h.id === canalizacion.id)) ||
                          canalizacion.categoria.toLowerCase() === canalizacionesState.filtroActivo.toLowerCase();
    
    return coincideBusqueda && coincideFiltro;
  });

  const seleccionarCanalizacion = (canalizacion) => {
    // Si es premium y no está comprado, agregar al carrito
    if (canalizacion.premium && !canalizacion.comprado) {
      if (addToCart) {
        const cartItem = {
          id: `canalizacion-${canalizacion.id}`,
          type: 'canalizacion',
          name: canalizacion.titulo,
          price: canalizacion.precio,
          image: canalizacion.imagen,
          category: 'Canalizaciones',
          data: canalizacion
        };
        addToCart(cartItem);
        setModalState({
          isOpen: true,
          title: '🛒 Agregado al Carrito',
          message: `"${canalizacion.titulo}" ha sido agregado al carrito por $${canalizacion.precio}`,
          type: 'success'
        });
      } else {
        setModalState({
          isOpen: true,
          title: '💎 Contenido Premium',
          message: `Esta canalización cuesta $${canalizacion.precio}. Por favor, completa tu compra en el carrito.`,
          type: 'info'
        });
      }
      return;
    }

    updateCanalizacionesState({
      canalizacionSeleccionada: canalizacion,
      mostrandoMensaje: true,
      audioReproduciendo: false
    });
    agregarHistorial(canalizacion);
  };

  const toggleAudio = () => {
    const nuevoEstado = !canalizacionesState.audioReproduciendo;
    updateCanalizacionesState({ audioReproduciendo: nuevoEstado });
    
    if (audioRef.current) {
      if (nuevoEstado) {
        audioRef.current.play();
      } else {
        audioRef.current.pause();
      }
    }
  };

  const toggleFavorito = (canalizacion) => {
    const esFavorito = canalizacionesState.favoritos.some(f => f.id === canalizacion.id);
    if (esFavorito) {
      quitarFavorito(canalizacion.id);
    } else {
      agregarFavorito(canalizacion);
    }
  };

  const descargarPDF = async () => {
    try {
      const canalizacion = canalizacionesState.canalizacionSeleccionada;
      await generateCanalizacionPDF(canalizacion);
      
      setModalState({
        isOpen: true,
        title: '✨ PDF Descargado ✨',
        message: `Tu canalización "${canalizacion.titulo}" ha sido guardada exitosamente`,
        type: 'success'
      });
    } catch (error) {
      console.error('Error al generar PDF:', error);
      setModalState({
        isOpen: true,
        title: '❌ Error',
        message: 'No se pudo generar el PDF. Por favor, intenta de nuevo.',
        type: 'error'
      });
    }
  };

  const compartirMensaje = () => {
    const canalizacion = canalizacionesState.canalizacionSeleccionada;
    if (navigator.share) {
      navigator.share({
        title: `Canalización: ${canalizacion.titulo}`,
        text: canalizacion.afirmacionDiaria,
        url: window.location.href
      });
    } else {
      navigator.clipboard.writeText(canalizacion.afirmacionDiaria);
      setModalState({
        isOpen: true,
        title: '📋 Copiado',
        message: 'Afirmación copiada al portapapeles',
        type: 'success'
      });
    }
  };

  const volverASeleccion = () => {
    updateCanalizacionesState({
      canalizacionSeleccionada: null,
      mostrandoMensaje: false,
      audioReproduciendo: false
    });
  };

  return (
    <div className="canalizaciones-angelicales">
      <audio ref={audioRef} src={canalizacionesState.canalizacionSeleccionada?.audioUrl} />
      
      {/* Header */}
      <div className="canalizaciones-header">
        <div className="header-content">
          <button 
            onClick={canalizacionesState.mostrandoMensaje ? volverASeleccion : onVolver} 
            className="btn-volver"
          >
            <ArrowLeft size={20} />
            {canalizacionesState.mostrandoMensaje ? 'Volver a Canalizaciones' : 'Volver al Dashboard'}
          </button>
          
          <div className="header-title">
            <h1>👼 Canalizaciones Angelicales</h1>
            <p>Mensajes personalizados de tus ángeles guardianes</p>
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
      <div className="canalizaciones-contenido main-content">
        {!canalizacionesState.mostrandoMensaje ? (
          // Pantalla de selección de canalizaciones
          <div className="seleccion-canalizaciones">
            {/* Controles */}
            <div className="controles-principales">              
              <div className="filtros-container">
                <select
                  value={canalizacionesState.filtroActivo}
                  onChange={(e) => updateCanalizacionesState({ filtroActivo: e.target.value })}
                  className="filtro-select"
                >
                  <option value="todos">Todas las Canalizaciones</option>
                  <option value="favoritos">Favoritos</option>
                  <option value="recientes">Recientes</option>
                  <option value="protección">Protección</option>
                  <option value="sanación">Sanación</option>
                  <option value="propósito">Propósito</option>
                  <option value="amor">Amor</option>
                </select>
                
                <div className="vista-controles">
                  <button
                    className={`btn-vista ${canalizacionesState.vistaActual === 'grid' ? 'activo' : ''}`}
                    onClick={() => updateCanalizacionesState({ vistaActual: 'grid' })}
                  >
                    <Grid size={20} />
                  </button>
                  <button
                    className={`btn-vista ${canalizacionesState.vistaActual === 'list' ? 'activo' : ''}`}
                    onClick={() => updateCanalizacionesState({ vistaActual: 'list' })}
                  >
                    <List size={20} />
                  </button>
                </div>
              </div>
            </div>

            {/* Grid de canalizaciones */}
            <div className={`canalizaciones-container vista-${canalizacionesState.vistaActual}`}>
              {canalizacionesFiltradas.length === 0 ? (
                <div className="sin-resultados">
                  <MessageCircle size={64} className="sin-resultados-icono" />
                  <h3>No se encontraron canalizaciones</h3>
                  <p>Intenta ajustar tus filtros de búsqueda</p>
                </div>
              ) : (
                canalizacionesFiltradas.map((canalizacion) => (
                  <CanalizacionCard
                    key={canalizacion.id}
                    canalizacion={canalizacion}
                    esFavorito={canalizacionesState.favoritos.some(f => f.id === canalizacion.id)}
                    onSeleccionar={seleccionarCanalizacion}
                    onToggleFavorito={toggleFavorito}
                    vista={canalizacionesState.vistaActual}
                  />
                ))
              )}
            </div>

            {/* Información adicional */}
            <div className="info-adicional">
              <div className="info-card">
                <h4>¿Cómo funcionan las Canalizaciones?</h4>
                <p>
                  Cada mensaje ha sido canalizado directamente desde los reinos angelicales. 
                  Selecciona la canalización que más resuene con tu corazón en este momento y permite 
                  que los ángeles te guíen con su sabiduría divina.
                </p>
              </div>
            </div>
          </div>
        ) : (
          // Pantalla del mensaje canalizado
          <MensajeCanalizado
            canalizacion={canalizacionesState.canalizacionSeleccionada}
            audioReproduciendo={canalizacionesState.audioReproduciendo}
            onToggleAudio={toggleAudio}
            onDescargarPDF={descargarPDF}
            onCompartir={compartirMensaje}
            onVolver={volverASeleccion}
          />
        )}
      </div>

      {/* Modal de notificaciones */}
      {modalState.isOpen && (
        <AngelicalModal
          isOpen={modalState.isOpen}
          onClose={() => setModalState({ ...modalState, isOpen: false })}
          title={modalState.title}
          message={modalState.message}
          type={modalState.type}
        />
      )}

      <FooterLegal />
    </div>
  );
};

// Componente principal con Provider
const CanalizacionesAngelicalesConProvider = ({ onVolver, addToCart }) => {
  return (
    <CanalizacionesProvider>
      <CanalizacionesAngelicales onVolver={onVolver} addToCart={addToCart} />
    </CanalizacionesProvider>
  );
};

export default CanalizacionesAngelicalesConProvider;

