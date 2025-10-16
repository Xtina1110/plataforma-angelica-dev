import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Star, Heart, Sparkles, Download, RotateCcw, ArrowRight, ArrowLeft, Clock, Users, Layers, Zap, Video, Briefcase, Lightbulb, Calendar, BookmarkPlus, History } from 'lucide-react';
import useAutoScrollToContent from '../hooks/useAutoScrollToContent';
import { useAperturaAngelical } from '../contexts/AperturaAngelicalContext';
import HistorialTiradas from './HistorialTiradas';
import FavoritosTiradas from './FavoritosTiradas';
import './TiradaAngelical.css';
import './TiradaAngelicalAnimations.css';
import './Dashboard.css';
import IconoAmbienteSagrado from './IconoAmbienteSagrado';
import IconoTirada3Cartas from './IconoTirada3Cartas';
import IconoTirada6Cartas from './IconoTirada6Cartas';
import IconoTirada9Cartas from './IconoTirada9Cartas';
import IconoConsultaEnVivo from './IconoConsultaEnVivo';
import IconoCrecimientoEspiritual from './IconoCrecimientoEspiritual';
import IconoPropositoMision from './IconoPropositoMision';
import IconoSaludBienestar from './IconoSaludBienestar';
import IconoTrabajoAbundancia from './IconoTrabajoAbundancia';
import IconoAmorRelaciones from './IconoAmorRelaciones';
import IconoTiradaGeneral from './IconoTiradaGeneral';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { cartasAngelicas, temasConsulta, tiposDeCartas } from '../data/cartasAngelicas';
import { generateSimplePDF } from '../utils/simplePDFGenerator';
import angelicInterpretationService from '../services/angelicInterpretationService';
import PageWatermark from './PageWatermark';
import WatermarkedImage from './WatermarkedImage';
import AngelicalModal from './AngelicalModal';
import FooterLegal from './FooterLegal';
import logo from '../assets/Logosinfondo.png';

const TiradaAngelical = ({ onVolver, user, onLogout }) => {
  const navigate = useNavigate();
  
  // Auto-scroll to main content after 2 seconds
  useAutoScrollToContent('.main-content', 2000);
  
  // Usar Context de Apertura Angelical
  const {
    aperturaState,
    updateAperturaState,
    guardarTirada,
    agregarFavorito,
    cargarHistorial
  } = useAperturaAngelical();
  
  // Estados locales (mantener para UI temporal)
  const [cartasBarajeadas, setCartasBarajeadas] = useState([]);
  const [cartaActual, setCartaActual] = useState(0);
  const [cargandoInterpretacion, setCargandoInterpretacion] = useState(false);
  
  // Usar estado del contexto para datos persistentes
  const paso = aperturaState.paso;
  const tipoSeleccionado = aperturaState.tipoSeleccionado;
  const temaSeleccionado = aperturaState.temaSeleccionado;
  const cartasSeleccionadas = aperturaState.cartasSeleccionadas;
  const interpretaciones = aperturaState.interpretaciones;
  
  // Funciones para actualizar el contexto
  const setPaso = (nuevoPaso) => updateAperturaState({ paso: nuevoPaso });
  const setTipoSeleccionado = (tipo) => updateAperturaState({ tipoSeleccionado: tipo });
  const setTemaSeleccionado = (tema) => updateAperturaState({ temaSeleccionado: tema });
  const setCartasSeleccionadas = (cartas) => updateAperturaState({ cartasSeleccionadas: cartas });
  const setInterpretaciones = (interps) => updateAperturaState({ interpretaciones: interps });

  const [modalState, setModalState] = useState({
    isOpen: false,
    title: '',
    message: '',
    type: 'success'
  });
  
  const [mostrarHistorial, setMostrarHistorial] = useState(false);
  const [mostrarFavoritos, setMostrarFavoritos] = useState(false);
  
  // Auto-scroll to instructions section after 2 seconds when on instructions step
  useEffect(() => {
    if (paso === 'instrucciones') {
      const timer = setTimeout(() => {
        const instruccionesSection = document.querySelector('.instrucciones-container');
        if (instruccionesSection) {
          instruccionesSection.scrollIntoView({ 
            behavior: 'smooth', 
            block: 'center'
          });
        }
      }, 2000);
      
      return () => clearTimeout(timer);
    }
  }, [paso]);
  
  // Auto-scroll to tipo de tirada section after 2 seconds when on seleccion step
  useEffect(() => {
    if (paso === 'seleccion') {
      const timer = setTimeout(() => {
        const tipoSection = document.querySelector('.tipos-grid');
        if (tipoSection) {
          tipoSection.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
          });
        }
      }, 2000);

      return () => clearTimeout(timer);
    }
  }, [paso]);

  // Auto-scroll to carta revelada after 1 second when carta changes
  useEffect(() => {
    if (paso === 'revelando') {
      const timer = setTimeout(() => {
        const cartaRevelacion = document.querySelector('.carta-revelacion');
        if (cartaRevelacion) {
          cartaRevelacion.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
          });
        }
      }, 1000);

      return () => clearTimeout(timer);
    }
  }, [paso, cartaActual]);

  // Función para renderizar iconos
  const renderIcon = (iconName, className = "w-12 h-12") => {
    const iconMap = {
      'Star': <Star className={className} />,
      'Heart': <Heart className={className} />,
      'Briefcase': <Briefcase className={className} />,
      'Lightbulb': <Lightbulb className={className} />,
      'Sparkles': <Sparkles className={className} />,
      'Zap': <Zap className={className} />,
      'Video': <Video className={className} />,
      'Users': <Users className={className} />,
      'Clock': <Clock className={className} />,
      'Layers': <Layers className={className} />,
      'CrecimientoEspiritual': <IconoCrecimientoEspiritual className={className} />,
      'PropositoMision': <IconoPropositoMision className={className} />,
      'SaludBienestar': <IconoSaludBienestar className={className} />,
      'TrabajoAbundancia': <IconoTrabajoAbundancia className={className} />,
      'AmorRelaciones': <IconoAmorRelaciones className={className} />,
      'TiradaGeneral': <IconoTiradaGeneral className={className} />
    };
    return iconMap[iconName] || <Star className={className} />;
  };

  // Configuración de tipos de tirada
  const tiposDeTirada = [
    {
      id: 3,
      nombre: 'Tirada de 3 Cartas',
      icono: <IconoTirada3Cartas className="w-32 h-32 object-contain" />,
      descripcion: 'Pasado, Presente y Futuro',
      numCartas: 3
    },
    {
      id: 6,
      nombre: 'Tirada de 6 Cartas',
      icono: <IconoTirada6Cartas className="w-32 h-32 object-contain" />,
      descripcion: 'Análisis Completo de Vida',
      numCartas: 6
    },
    {
      id: 9,
      nombre: 'Tirada de 9 Cartas',
      icono: <IconoTirada9Cartas className="w-32 h-32 object-contain" />,
      descripcion: 'Lectura Profunda del Alma',
      numCartas: 9
    },
    {
      id: 'envivo',
      nombre: 'Consulta en Vivo',
      icono: <IconoConsultaEnVivo className="w-32 h-32 object-contain" />,
      descripcion: 'Sesión personalizada con un experto',
      esEnVivo: true
    }
  ];

  // Función para barajar cartas (algoritmo Fisher-Yates)
  const barajarCartas = () => {
    const cartas = [...cartasAngelicas];
    for (let i = cartas.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [cartas[i], cartas[j]] = [cartas[j], cartas[i]];
    }
    return cartas;
  };

  // Manejar selección de tipo
  const handleTipoSeleccionado = (tipo) => {
    setTipoSeleccionado(tipo);
    // Scroll suave hacia la sección de temas
    setTimeout(() => {
      const temasSection = document.querySelector('.temas-grid');
      if (temasSection) {
        temasSection.scrollIntoView({ 
          behavior: 'smooth', 
          block: 'start',
          inline: 'nearest'
        });
      }
    }, 100);
  };

  // Manejar selección de tema
  const handleTemaSeleccionado = (tema) => {
    setTemaSeleccionado(tema);
    // Scroll suave hacia la sección de resumen cuando se selecciona el tema
    setTimeout(() => {
      const resumenSection = document.getElementById('resumen-seleccion-final');
      if (resumenSection) {
        resumenSection.scrollIntoView({ 
          behavior: 'smooth', 
          block: 'start',
          inline: 'nearest'
        });
      }
    }, 300);
  };

  // Continuar a resumen
  const handleContinuar = () => {
    if (tipoSeleccionado && temaSeleccionado) {
      setPaso('resumen');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  // Comenzar tirada
  const handleComenzarTirada = () => {
    // Si es consulta en vivo, redirigir al sistema de reservas
    if (tipoSeleccionado.esEnVivo) {
      navigate('/reservas-apertura');
      return;
    }
    
    setPaso('barajando');
    
    // Scroll al contenedor de barajando después de 0.5 segundos para dar tiempo a renderizar
    setTimeout(() => {
      const barajandoContainer = document.querySelector('.barajando-container');
      if (barajandoContainer) {
        barajandoContainer.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }, 500);
    
    // Simular barajado por 3 segundos
    setTimeout(() => {
      const cartasBarajeadasArray = barajarCartas();
      setCartasBarajeadas(cartasBarajeadasArray);
      setPaso('seleccionCartas');

      // Scroll a la zona de cartas después de 0.5 segundos
      setTimeout(() => {
        const cartasGrid = document.querySelector('.cartas-grid');
        if (cartasGrid) {
          cartasGrid.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      }, 500);
    }, 3000);
  };

  // Seleccionar carta
  const handleSeleccionarCarta = (indiceCarta) => {
    const carta = cartasBarajeadas[indiceCarta];

    // Verificar si la carta ya está seleccionada
    const yaSeleccionada = cartasSeleccionadas.some(c => c.id === carta.id);

    if (yaSeleccionada) {
      // Deseleccionar la carta
      const nuevasCartasSeleccionadas = cartasSeleccionadas.filter(c => c.id !== carta.id);
      setCartasSeleccionadas(nuevasCartasSeleccionadas);
    } else if (cartasSeleccionadas.length < tipoSeleccionado.numCartas) {
      // Seleccionar la carta
      const cartaSeleccionada = {
        ...carta,
        posicion: tiposDeCartas[tipoSeleccionado.id].posiciones[cartasSeleccionadas.length]
      };

      const nuevasCartasSeleccionadas = [...cartasSeleccionadas, cartaSeleccionada];
      setCartasSeleccionadas(nuevasCartasSeleccionadas);

      // Si ya seleccionamos todas las cartas, generar interpretaciones y pasar a revelación
      if (nuevasCartasSeleccionadas.length === tipoSeleccionado.numCartas) {
        generarInterpretaciones(nuevasCartasSeleccionadas);
        setTimeout(() => {
          setPaso('revelando');
          setCartaActual(0);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }, 1000);
      }
    }
  };

  // Siguiente carta en revelación
  const handleSiguienteCarta = () => {
    if (cartaActual < cartasSeleccionadas.length - 1) {
      const nextIndex = cartaActual + 1;
      console.log('Siguiente carta:', nextIndex, 'Total cartas:', cartasSeleccionadas.length);
      console.log('Carta:', cartasSeleccionadas[nextIndex]);
      console.log('Interpretación disponible:', interpretaciones[nextIndex]);
      setCartaActual(nextIndex);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      setPaso('resumenFinal');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  // Carta anterior en revelación
  const handleCartaAnterior = () => {
    if (cartaActual > 0) {
      setCartaActual(cartaActual - 1);
    }
  };

  // Generar interpretaciones con IA
  const generarInterpretaciones = async (cartas) => {
    setCargandoInterpretacion(true);
    try {
      const interpretacionesGeneradas = await angelicInterpretationService.generateBatchInterpretations({
        cartas,
        tipoTirada: tipoSeleccionado,
        temaConsulta: temaSeleccionado
      });
      setInterpretaciones(interpretacionesGeneradas);
      
      // Guardar automáticamente en el historial
      await guardarTirada({
        tipo_tirada: tipoSeleccionado,
        tema: temaSeleccionado,
        cartas: cartas,
        interpretaciones: interpretacionesGeneradas,
        ambiente: aperturaState.configuracion.ambiente || 'Ninguno'
      });
    } catch (error) {
      console.error('Error generando interpretaciones:', error);
      const defaultInterpretaciones = cartas.map(carta =>
        angelicInterpretationService.getDefaultInterpretation(carta)
      );
      setInterpretaciones(defaultInterpretaciones);
      
      // Guardar con interpretaciones por defecto
      await guardarTirada({
        tipo_tirada: tipoSeleccionado,
        tema: temaSeleccionado,
        cartas: cartas,
        interpretaciones: defaultInterpretaciones,
        ambiente: aperturaState.configuracion.ambiente || 'Ninguno'
      });
    } finally {
      setCargandoInterpretacion(false);
    }
  };

  // Nueva tirada
  const handleNuevaTirada = () => {
    setPaso('instrucciones');
    setTipoSeleccionado(null);
    setTemaSeleccionado(null);
    setCartasBarajeadas([]);
    setCartasSeleccionadas([]);
    setCartaActual(0);
    setInterpretaciones([]);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Generar PDF
  const handleGenerarPDF = async () => {
    console.log('🚀 Iniciando generación de PDF...');

    try {
      // Combinar cartas con sus interpretaciones de IA
      const cartasConInterpretacion = cartasSeleccionadas.map((carta, index) => {
        const interpretacion = interpretaciones[index];
        return {
          ...carta,
          significado: interpretacion?.significado || carta.significado,
          mensaje: interpretacion?.mensajeAngelical || carta.mensaje,
          afirmacion: interpretacion?.afirmacionDivina || carta.afirmacion,
          guiaPractica: interpretacion?.guiaPractica || carta.guiaPractica
        };
      });

      const fileName = await generateSimplePDF({
        tipoTirada: tipoSeleccionado,
        tema: temaSeleccionado,
        cartas: cartasConInterpretacion,
        fecha: new Date()
      });
      
      console.log('✅ PDF descargado:', fileName);
      setModalState({
        isOpen: true,
        title: '✨ PDF Descargado ✨',
        message: 'Tu lectura angelical ha sido guardada exitosamente',
        type: 'success'
      });

    } catch (error) {
      console.error('❌ Error al generar PDF:', error);
      setModalState({
        isOpen: true,
        title: 'Error al Generar PDF',
        message: `No se pudo generar el PDF. Por favor, inténtalo de nuevo. ${error.message}`,
        type: 'error'
      });
    }
  };

  return (
    <div className="tirada-angelical" style={{ position: 'relative' }}>
      {/* Paso 1: Instrucciones - REESCRITO DESDE CERO */}
      {paso === 'instrucciones' && (
        <div className="w-full rounded-2xl overflow-hidden mx-4 my-4" style={{ 
          background: 'linear-gradient(rgba(255, 255, 255, 0.4), rgba(255, 255, 255, 0.5)), url(/lovable-uploads/774c9267-ae3b-41ab-9ae7-8e71c2f9ecba.png)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          padding: '2rem 0'
        }}>
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 md:p-8 shadow-lg" style={{ border: '1px solid rgba(200, 200, 255, 0.3)' }}>
              <div className="text-center mb-6">
                <h2 className="text-lg md:text-xl font-bold text-gray-900 mb-2">
                  Preparación para tu Experiencia
                </h2>
                <p className="text-sm text-gray-600">
                  Sigue estas recomendaciones para conectar profundamente con tus guías
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8" style={{ gridAutoRows: '1fr' }}>
                <div className="instruction-card">
                  <div className="instruction-icon-wrapper w-16 h-16 rounded-full bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center shadow-md flex-shrink-0">
                    <IconoAmbienteSagrado className="w-10 h-10 text-blue-600" />
                  </div>
                  <h3 className="font-semibold text-gray-900 text-base">Ambiente Sagrado</h3>
                  <p className="text-sm text-gray-600 leading-relaxed flex-grow">
                    Crea un espacio tranquilo y luminoso. Enciende una vela o incienso para elevar la vibración.
                  </p>
                </div>

                <div className="instruction-card">
                  <div className="instruction-icon-wrapper w-16 h-16 rounded-full bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center shadow-md flex-shrink-0">
                    <img src="/lovable-uploads/9719b790-82ed-40af-a6f4-432b64d7785e.png" alt="Mente Abierta" className="w-10 h-10 object-contain" />
                  </div>
                  <h3 className="font-semibold text-gray-900 text-base">Mente Abierta</h3>
                  <p className="text-sm text-gray-600 leading-relaxed flex-grow">
                    Libera expectativas y permite que los mensajes angelicales fluyan naturalmente a tu corazón.
                  </p>
                </div>

                <div className="instruction-card">
                  <div className="instruction-icon-wrapper w-16 h-16 rounded-full bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center shadow-md flex-shrink-0">
                    <img src="/lovable-uploads/f91a46d2-e9aa-4206-8e01-a593fc026480.png" alt="Intención Pura" className="w-10 h-10 object-contain" />
                  </div>
                  <h3 className="font-semibold text-gray-900 text-base">Intención Pura</h3>
                  <p className="text-sm text-gray-600 leading-relaxed flex-grow">
                    Enfócate en tu pregunta con amor y sinceridad. Los ángeles responden a la pureza del corazón.
                  </p>
                </div>
              </div>

              <div className="text-center">
                <button
                  onClick={() => {
                    setPaso('seleccion');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-8 py-3 rounded-full font-semibold text-base hover:from-blue-700 hover:to-indigo-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 inline-flex items-center gap-2"
                >
                  <Sparkles className="w-5 h-5" />
                  <span>Comienza tu apertura</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Paso 2: Selección (Tipo y Tema) */}
      {paso === 'seleccion' && (
        <div className="tirada-step">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="seleccion-container">
            <div className="seleccion-grid">
              {/* Columna izquierda - Tipos de tirada */}
              <Card className="border-2 border-amber-400/60 shadow-lg shadow-amber-200/20">
                <CardHeader>
                  <CardTitle>Tipo de Tirada</CardTitle>
                  <CardDescription>
                    Selecciona el número de cartas según la profundidad de guía que buscas
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="tipos-grid">
                    {tiposDeTirada.map((tipo) => (
                      <div
                        key={tipo.id}
                        onClick={() => handleTipoSeleccionado(tipo)}
                        className={`tipo-card ${tipoSeleccionado?.id === tipo.id ? 'selected' : ''}`}
                      >
                        <div className="tipo-icon">{tipo.icono}</div>
                        <div className="tipo-content">
                          <h3>{tipo.nombre}</h3>
                          <p>{tipo.descripcion}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Columna derecha - Temas angelicales */}
              <Card className="border-2 border-amber-400/60 shadow-lg shadow-amber-200/20">
                <CardHeader>
                  <CardTitle>Tema de Consulta</CardTitle>
                  <CardDescription>
                    Selecciona el área de tu vida sobre la que deseas recibir guía angelical
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="temas-grid">
                    {temasConsulta.map((tema) => (
                      <div
                        key={tema.id}
                        onClick={() => handleTemaSeleccionado(tema)}
                        className={`tema-card ${temaSeleccionado?.id === tema.id ? 'selected' : ''}`}
                      >
                        <div className="tema-icon">{renderIcon(tema.icono)}</div>
                        <div className="tema-content">
                          <h3>{tema.nombre}</h3>
                          <p>{tema.descripcion}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Resumen de selección y botón continuar - aparece al final cuando ambos estén seleccionados */}
            {tipoSeleccionado && temaSeleccionado && (
              <div id="resumen-seleccion-final" className="resumen-seleccion-final">
                <Card className="border-2 border-amber-400/60 shadow-lg shadow-amber-200/20">
                  <CardHeader>
                    <CardTitle>Resumen de tu Selección</CardTitle>
                    <CardDescription>
                      Confirma los detalles antes de comenzar tu tirada angelical
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="resumen-items">
                      <div className="resumen-item">
                        <div className="resumen-icon">{tipoSeleccionado.icono}</div>
                        <div className="relative z-10">
                          <h3>{tipoSeleccionado.nombre}</h3>
                          <p>{tipoSeleccionado.descripcion}</p>
                        </div>
                      </div>
                      <div className="resumen-item">
                        <div className="resumen-icon">{renderIcon(temaSeleccionado.icono)}</div>
                        <div>
                          <h3>{temaSeleccionado.nombre}</h3>
                          <p>{temaSeleccionado.descripcion}</p>
                        </div>
                      </div>
                    </div>
                    <div className="resumen-action">
                      <button 
                        onClick={handleComenzarTirada}
                        className="btn-comenzar"
                      >
                        <Sparkles />
                        Comenzar Tirada
                      </button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}
            </div>
          </div>
        </div>
      )}

      {/* Paso 3: Barajando */}
      {paso === 'barajando' && (
        <div className="tirada-step">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="barajando-container">
            {/* Ángel en el lateral izquierdo */}
            <div className="angel-lateral-izquierdo">
              <img
                src="/lovable-uploads/dbd24812-a6f2-4ba0-aa75-7d20336a21aa.png"
                alt="San Gabriel - Ángel Guardián"
                className="angel-image"
              />
            </div>

            <div className="barajando-content">
              <div className="barajando-icon">
                <div className="sparkles-rotating">
                  <Sparkles className="sparkles-animated" />
                </div>
              </div>
              <h2>Los ángeles están barajando las cartas...</h2>
              <p>
                Los ángeles están preparando tu mensaje divino. Mantén tu intención clara en tu corazón.
              </p>
              <div className="progress-bar">
                <div className="progress-fill"></div>
              </div>
              <p className="progress-text">
                Conectando con la energía angelical...
              </p>
            </div>
          </div>
          </div>
        </div>
      )}

      {/* Paso 4: Selección de cartas */}
      {paso === 'seleccionCartas' && (
        <div className="tirada-step">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="seleccion-cartas-container">
            <div className="seleccion-cartas-header">
              <h2>Selecciona tus cartas angelicales</h2>
              <p>
                Confía en tu intuición y elige {tipoSeleccionado.numCartas} cartas que más te llamen la atención
              </p>
              <div className="cartas-counter">
                {cartasSeleccionadas.length} de {tipoSeleccionado.numCartas} cartas seleccionadas
              </div>
            </div>

            <div className="cartas-grid">
              {cartasBarajeadas.slice(0, 27).map((carta, index) => (
                <div
                  key={index}
                  onClick={() => handleSeleccionarCarta(index)}
                  className={`carta-dorso ${cartasSeleccionadas.some(c => c.id === carta.id) ? 'selected' : ''}`}
                  style={{ position: 'relative' }}
                >
                  <div className="dorso-content">
                    <img 
                      src="/lovable-uploads/c07c66ee-8289-4a51-b936-5ff7c3b78fde.png" 
                      alt="Dorso de carta angelical"
                      className="dorso-imagen"
                    />
                    {/* Logo overlay */}
                    <div 
                      style={{
                        position: 'absolute',
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                        width: '60px',
                        height: '60px',
                        opacity: 0.6,
                        pointerEvents: 'none',
                        zIndex: 10
                      }}
                    >
                      <img 
                        src={logo} 
                        alt="el angelólogo logo"
                        style={{ width: '100%', height: '100%', objectFit: 'contain' }}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {cartasSeleccionadas.length === tipoSeleccionado.numCartas && (
              <div className="cartas-completadas">
                <Sparkles />
                <p>¡Perfecto! Has seleccionado todas tus cartas. Preparándose para la revelación...</p>
              </div>
            )}
            </div>
          </div>
        </div>
      )}

      {/* Paso 5: Revelación de cartas */}
      {paso === 'revelando' && cartasSeleccionadas.length > 0 && cartasSeleccionadas[cartaActual] && (
        <div className="tirada-step" key={`carta-${cartaActual}`}>
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="revelacion-container">
            <Card className="carta-revelacion">
              <CardHeader>
                <CardTitle>{cartasSeleccionadas[cartaActual]?.nombre || 'Carta Angelical'}</CardTitle>
                <CardDescription>
                  {cartasSeleccionadas[cartaActual]?.posicion?.nombre || 'Mensaje Angelical'}
                </CardDescription>
                <div className="carta-progress">
                  Carta {cartaActual + 1} de {cartasSeleccionadas.length}
                </div>
                {/* Barra de progreso mejorada */}
                <div className="progress-bar-container">
                  <div 
                    className="progress-bar-fill" 
                    style={{ width: `${((cartaActual + 1) / cartasSeleccionadas.length) * 100}%` }}
                  ></div>
                </div>
                {/* Indicadores de paso */}
                <div className="step-indicators">
                  {cartasSeleccionadas.map((_, index) => (
                    <div 
                      key={index}
                      className={`step-indicator ${index === cartaActual ? 'active' : ''} ${index < cartaActual ? 'completed' : ''}`}
                      onClick={() => setCartaActual(index)}
                      title={`Ir a carta ${index + 1}`}
                    />
                  ))}
                </div>
              </CardHeader>
              <CardContent>
                <div className={`carta-revelacion-content tirada-${cartasSeleccionadas.length}-cartas`}>
                  <div 
                    className="carta-imagen-container" 
                    style={{ 
                      position: 'relative', 
                      display: 'inline-block',
                      width: 'fit-content'
                    }}
                  >
                    {cartasSeleccionadas[cartaActual]?.imagen && (
                      <img
                        src={cartasSeleccionadas[cartaActual].imagen}
                        alt={cartasSeleccionadas[cartaActual].nombre}
                        className="carta-imagen"
                        style={{
                          display: 'block',
                          userSelect: 'none',
                          position: 'relative',
                          zIndex: 1
                        }}
                        draggable={false}
                        onContextMenu={(e) => e.preventDefault()}
                        onError={(e) => console.error('Error loading image:', e)}
                      />
                    )}
                    {/* Logo overlay - positioned directly over the card image */}
                    <div 
                      style={{
                        position: 'absolute',
                        top: '25%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                        width: '80px',
                        height: '80px',
                        opacity: 0.6,
                        pointerEvents: 'none',
                        zIndex: 2,
                        background: 'rgba(255,255,255,0.1)',
                        borderRadius: '50%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}
                    >
                      <img 
                        src={logo} 
                        alt="el angelólogo logo"
                        style={{ 
                          width: '100%', 
                          height: '100%', 
                          objectFit: 'contain',
                          filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.5))'
                        }}
                      />
                    </div>
                    {cartasSeleccionadas[cartaActual] && (
                      <div className="carta-detalles">
                        <div className="detalle-item">
                          <strong>Elemento:</strong> {cartasSeleccionadas[cartaActual].elemento}
                        </div>
                        <div className="detalle-item">
                          <strong>Color:</strong> {cartasSeleccionadas[cartaActual].color}
                        </div>
                        <div className="detalle-item">
                          <strong>Cristal:</strong> {cartasSeleccionadas[cartaActual].cristal}
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="carta-mensajes">
                    {cargandoInterpretacion && cartaActual === 0 ? (
                      <div className="loading-interpretation">
                        <Sparkles className="animate-spin" />
                        <p>Los ángeles están canalizando tu mensaje personalizado...</p>
                      </div>
                    ) : interpretaciones[cartaActual] ? (
                      <>
                        <div className="mensaje-significado">
                          <h3>Significado</h3>
                          <p>{interpretaciones[cartaActual].significado}</p>
                        </div>

                        <div className="mensaje-angelical">
                          <h3>Mensaje Angelical</h3>
                          <p>"{interpretaciones[cartaActual].mensajeAngelical}"</p>
                        </div>

                        <div className="afirmacion-divina">
                          <h4>Afirmación Divina</h4>
                          <p>✨ "{interpretaciones[cartaActual].afirmacionDivina}" ✨</p>
                        </div>

                        {interpretaciones[cartaActual].guiaPractica && (
                          <div className="guia-practica">
                            <h3>🌟 Guía Práctica</h3>

                            {interpretaciones[cartaActual].guiaPractica.ritual && (
                              <div className="practica-section">
                                <h4>🕯️ Ritual</h4>
                                {typeof interpretaciones[cartaActual].guiaPractica.ritual === 'object' ? (
                                  <>
                                    <p><strong>{interpretaciones[cartaActual].guiaPractica.ritual.nombre}</strong></p>
                                    <p>{interpretaciones[cartaActual].guiaPractica.ritual.instrucciones}</p>
                                  </>
                                ) : (
                                  <p>{interpretaciones[cartaActual].guiaPractica.ritual}</p>
                                )}
                              </div>
                            )}

                            {interpretaciones[cartaActual].guiaPractica.invocacion && (
                              <div className="practica-section">
                                <h4>🙏 Invocación</h4>
                                <p>"{interpretaciones[cartaActual].guiaPractica.invocacion}"</p>
                              </div>
                            )}

                            {interpretaciones[cartaActual].guiaPractica.accionConsciente && (
                              <div className="practica-section">
                                <h4>🌱 Acción Consciente</h4>
                                <p>{interpretaciones[cartaActual].guiaPractica.accionConsciente}</p>
                              </div>
                            )}
                          </div>
                        )}
                      </>
                    ) : (
                      <>
                        <div className="mensaje-significado">
                          <h3>Significado</h3>
                          <p>{cartasSeleccionadas[cartaActual].significado}</p>
                        </div>

                        <div className="mensaje-angelical">
                          <h3>Mensaje Angelical</h3>
                          <p>"{cartasSeleccionadas[cartaActual].mensaje}"</p>
                        </div>

                        <div className="afirmacion-divina">
                          <h4>Afirmación Divina</h4>
                          <p>✨ "{cartasSeleccionadas[cartaActual].afirmacion}" ✨</p>
                        </div>

                        {cartasSeleccionadas[cartaActual].guiaPractica && (
                          <div className="guia-practica">
                            <h3>🌟 Guía Práctica</h3>

                            {(cartasSeleccionadas[cartaActual].guiaPractica.ritual ||
                              cartasSeleccionadas[cartaActual].guiaPractica.ritualEspejo) && (
                              <div className="practica-section">
                                <h4>🕯️ Ritual</h4>
                                {typeof cartasSeleccionadas[cartaActual].guiaPractica.ritual === 'object' ? (
                                  <>
                                    <p><strong>{cartasSeleccionadas[cartaActual].guiaPractica.ritual.nombre}</strong></p>
                                    <p>{cartasSeleccionadas[cartaActual].guiaPractica.ritual.instrucciones}</p>
                                  </>
                                ) : (
                                  <p>{cartasSeleccionadas[cartaActual].guiaPractica.ritual ||
                                      cartasSeleccionadas[cartaActual].guiaPractica.ritualEspejo}</p>
                                )}
                              </div>
                            )}

                            {cartasSeleccionadas[cartaActual].guiaPractica.invocacion && (
                              <div className="practica-section">
                                <h4>🙏 Invocación</h4>
                                <p>"{cartasSeleccionadas[cartaActual].guiaPractica.invocacion}"</p>
                              </div>
                            )}

                            {(cartasSeleccionadas[cartaActual].guiaPractica.accionConsciente ||
                              cartasSeleccionadas[cartaActual].guiaPractica.accionConfianza ||
                              cartasSeleccionadas[cartaActual].guiaPractica.accionMerecimiento) && (
                              <div className="practica-section">
                                <h4>🌱 Acción Consciente</h4>
                                <p>{cartasSeleccionadas[cartaActual].guiaPractica.accionConsciente ||
                                    cartasSeleccionadas[cartaActual].guiaPractica.accionConfianza ||
                                    cartasSeleccionadas[cartaActual].guiaPractica.accionMerecimiento}</p>
                              </div>
                            )}
                          </div>
                        )}
                      </>
                    )}
                  </div>
                </div>

                <div className="revelacion-action">
                  <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', alignItems: 'center' }}>
                    {/* Botón carta anterior - solo aparece desde la segunda carta */}
                    {cartaActual > 0 && (
                      <button 
                        onClick={handleCartaAnterior}
                        className="btn-anterior"
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.5rem',
                          padding: '12px 24px',
                          backgroundColor: '#6b7280',
                          color: 'white',
                          border: 'none',
                          borderRadius: '25px',
                          fontSize: '16px',
                          fontWeight: '600',
                          cursor: 'pointer',
                          transition: 'all 0.3s ease',
                          boxShadow: '0 4px 15px rgba(107, 114, 128, 0.3)'
                        }}
                        onMouseOver={(e) => {
                          e.target.style.backgroundColor = '#4b5563';
                          e.target.style.transform = 'translateY(-2px)';
                        }}
                        onMouseOut={(e) => {
                          e.target.style.backgroundColor = '#6b7280';
                          e.target.style.transform = 'translateY(0)';
                        }}
                      >
                        <ArrowLeft />
                        Carta Anterior
                      </button>
                    )}
                    
                    {/* Botón siguiente carta */}
                    <button 
                      onClick={handleSiguienteCarta}
                      className="btn-siguiente"
                    >
                      {cartaActual < cartasSeleccionadas.length - 1 ? 'Siguiente Carta' : 'Ver Resumen'}
                      <ArrowRight />
                    </button>
                  </div>
                </div>
              </CardContent>
            </Card>
            </div>
          </div>
        </div>
      )}

      {/* Paso 6: Resumen final */}
      {paso === 'resumenFinal' && (
        <div className="tirada-step">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="resumen-final-container">
            <div className="resumen-final-header">
              <h2>Tu Lectura Angelical Completa</h2>
              <div className="resumen-final-info">
                <div><strong>Tipo:</strong> {tipoSeleccionado.nombre}</div>
                <div><strong>Tema:</strong> {temaSeleccionado.nombre}</div>
                <div><strong>Fecha:</strong> {new Date().toLocaleDateString()}</div>
              </div>
            </div>

            <div className="cartas-resumen">
              {cartasSeleccionadas.map((carta, index) => (
                <Card key={index} className="carta-resumen">
                  <CardHeader>
                    <CardTitle>{carta.nombre}</CardTitle>
                    <CardDescription>
                      {carta.posicion?.nombre || `Carta ${index + 1}`}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="carta-resumen-content">
                      <div style={{ position: 'relative' }}>
                        <img 
                          src={carta.imagen} 
                          alt={carta.nombre}
                          className="carta-resumen-imagen"
                          style={{ 
                            userSelect: 'none',
                            width: '100%',
                            height: '100%',
                            objectFit: 'cover'
                          }}
                          draggable={false}
                          onContextMenu={(e) => e.preventDefault()}
                        />
                        {/* Logo overlay */}
                        <div 
                          style={{
                            position: 'absolute',
                            top: '50%',
                            left: '50%',
                            transform: 'translate(-50%, -50%)',
                            width: '50px',
                            height: '50px',
                            opacity: 0.6,
                            pointerEvents: 'none',
                            zIndex: 10
                          }}
                        >
                          <img 
                            src={logo} 
                            alt="el angelólogo logo"
                            style={{ width: '100%', height: '100%', objectFit: 'contain' }}
                          />
                        </div>
                      </div>
                      <div className="carta-resumen-texto">
                        {interpretaciones[index] ? (
                          <>
                            <p><strong>Mensaje:</strong> {interpretaciones[index].mensajeAngelical}</p>
                            <p><strong>Afirmación:</strong> "{interpretaciones[index].afirmacionDivina}"</p>
                          </>
                        ) : (
                          <>
                            <p><strong>Mensaje:</strong> {carta.mensaje}</p>
                            <p><strong>Afirmación:</strong> "{carta.afirmacion}"</p>
                          </>
                        )}
                        <div className="carta-resumen-detalles">
                          <span>🔮 {carta.cristal}</span>
                          <span>🎨 {carta.color}</span>
                          <span>🌟 {carta.elemento}</span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            <div className="resumen-final-actions">
              <button 
                onClick={handleGenerarPDF}
                className="btn-pdf"
              >
                <Download />
                Descargar PDF
              </button>
              <button 
                onClick={handleNuevaTirada}
                className="btn-nueva-tirada"
              >
                <RotateCcw />
                Nueva Tirada
              </button>
            </div>
            </div>
          </div>
        </div>
      )}

      <AngelicalModal
        isOpen={modalState.isOpen}
        onClose={() => setModalState({ ...modalState, isOpen: false })}
        title={modalState.title}
        message={modalState.message}
        type={modalState.type}
      />
      
      {/* Modales de Historial y Favoritos */}
      {mostrarHistorial && (
        <HistorialTiradas 
          onClose={() => setMostrarHistorial(false)}
          onVerTirada={(tirada) => {
            // Cargar tirada desde historial
            setTipoSeleccionado(tirada.tipo_tirada);
            setTemaSeleccionado(tirada.tema);
            setCartasSeleccionadas(tirada.cartas);
            setInterpretaciones(tirada.interpretaciones);
            setPaso('resumen');
            setMostrarHistorial(false);
          }}
        />
      )}
      
      {mostrarFavoritos && (
        <FavoritosTiradas 
          onClose={() => setMostrarFavoritos(false)}
          onVerTirada={(tirada) => {
            // Cargar tirada desde favoritos
            setTipoSeleccionado(tirada.tipo_tirada);
            setTemaSeleccionado(tirada.tema);
            setCartasSeleccionadas(tirada.cartas);
            setInterpretaciones(tirada.interpretaciones);
            setPaso('resumen');
            setMostrarFavoritos(false);
          }}
        />
      )}
      
      {/* Footer Legal */}
      <FooterLegal />
    </div>
  );
};
export default TiradaAngelical;;