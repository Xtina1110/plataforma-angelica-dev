import React from 'react';
import { Sparkles, Heart, Star, Target, Shield, Lightbulb, Settings, Headphones, Users, Award } from 'lucide-react';

const InstruccionesAngelicales = ({
  titulo,
  descripcion,
  colorPrimario = "purple",
  instrucciones = [],
  llamadaAccion = "Comienza tu viaje",
  onAccionClick,
  maxWidth = ""
}) => {
  // Configuración de colores según la aplicación
  const colores = {
    purple: {
      primary: '#9333ea',
      secondary: '#6366f1',
      light: '#eff6ff',
      iconBg: '#e0e7ff',
      border: '#e9d5ff',
      hover: 'linear-gradient(135deg, #9333ea 0%, #6366f1 100%)'
    },
    blue: {
      primary: '#3b82f6',
      secondary: '#0891b2',
      light: '#eff6ff',
      iconBg: '#dbeafe',
      border: '#bfdbfe',
      hover: 'linear-gradient(135deg, #3b82f6 0%, #0891b2 100%)'
    },
    green: {
      primary: '#10b981',
      secondary: '#14b8a6',
      light: '#f0fdf4',
      iconBg: '#d1fae5',
      border: '#bbf7d0',
      hover: 'linear-gradient(135deg, #10b981 0%, #14b8a6 100%)'
    },
    amber: {
      primary: '#fbbf24',
      secondary: '#f59e0b',
      light: '#fffbeb',
      iconBg: '#fef3c7',
      border: '#fde68a',
      hover: 'linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%)'
    },
    pink: {
      primary: '#ec4899',
      secondary: '#f43f5e',
      light: '#fdf2f8',
      iconBg: '#fce7f3',
      border: '#fbcfe8',
      hover: 'linear-gradient(135deg, #ec4899 0%, #f43f5e 100%)'
    },
    cyan: {
      primary: '#7c3aed',
      secondary: '#a855f7',
      light: '#faf5ff',
      iconBg: '#e9d5ff',
      border: '#e9d5ff',
      hover: 'linear-gradient(135deg, #7c3aed 0%, #a855f7 100%)'
    }
  };

  const configuracionColor = colores[colorPrimario] || colores.purple;

  // Iconos profesionales por defecto
  const iconosDefault = [Shield, Lightbulb, Settings, Heart];

  const instruccionesDefault = instrucciones.length > 0 ? instrucciones : [
    {
      icono: Shield,
      titulo: "Ambiente Sagrado", 
      descripcion: "Crea un espacio tranquilo y luminoso para conectar con la energía angelical."
    },
    {
      icono: Lightbulb,
      titulo: "Mente Abierta",
      descripcion: "Libera expectativas y permite que los mensajes fluyan naturalmente a tu corazón."
    },
    {
      icono: Settings,
      titulo: "Intención Pura",
      descripcion: "Enfócate en tu pregunta con amor y sinceridad. Los ángeles responden a la pureza."
    }
  ];

  return (
    <div className={maxWidth || ""}>
      {/* Título principal - estilo dashboard */}
      {titulo && (
        <div className="text-center mb-6">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
            {titulo}
          </h1>
          <p className="text-base md:text-lg text-gray-600 max-w-2xl mx-auto">
            {descripcion}
          </p>
        </div>
      )}

      {/* Recuadro de instrucciones */}
      <div
        className="bg-white/95 backdrop-blur-sm rounded-3xl p-8 md:p-12 shadow-xl overflow-visible"
        style={{
          border: '2px solid rgba(200, 200, 255, 0.2)',
          boxShadow: '0 10px 40px rgba(0, 0, 0, 0.08)'
        }}
      >
        <div className="text-center mb-8">
          <h2 className="text-xl md:text-2xl font-bold text-gray-900 mb-3">
            Preparación para tu Experiencia
          </h2>
          <p className="text-gray-600 text-xs md:text-sm max-w-3xl mx-auto">
            Sigue estas recomendaciones para conectar profundamente con tus guías
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-8 mb-8">
          {instruccionesDefault.map((instruccion, index) => {
            const IconoComponent = instruccion.icono || iconosDefault[index % iconosDefault.length];
            return (
              <CardInstruccion
                key={index}
                icono={IconoComponent}
                titulo={instruccion.titulo}
                descripcion={instruccion.descripcion}
                colorConfig={configuracionColor}
              />
            );
          })}
        </div>

        {/* Llamada a la acción */}
        <div className="text-center mt-10">
          <button
            className="text-white px-8 py-4 rounded-2xl font-bold text-base md:text-lg transition-all duration-300 flex items-center space-x-3 mx-auto hover:transform hover:scale-105 shadow-2xl hover:shadow-3xl"
            style={{
              background: configuracionColor.hover
            }}
            onClick={onAccionClick}
          >
            <Sparkles className="w-6 h-6" />
            <span>{llamadaAccion}</span>
          </button>
        </div>
      </div>
    </div>
  );
};

// Componente separado para cada tarjeta con manejo de hover
const CardInstruccion = ({ icono: IconoComponent, titulo, descripcion, colorConfig }) => {
  const [isHovered, setIsHovered] = React.useState(false);

  return (
    <div
      className="group p-8 rounded-3xl text-center flex flex-col items-center bg-white border-2 transition-all duration-300 hover:transform hover:scale-105 hover:shadow-2xl cursor-pointer"
      style={{
        borderColor: isHovered ? colorConfig.primary : '#e5e7eb',
        background: isHovered ? colorConfig.hover : 'white',
        minHeight: '280px'
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Icono con círculo de fondo */}
      <div 
        className="flex items-center justify-center mb-5 rounded-full transition-all duration-300"
        style={{
          width: '100px',
          height: '100px',
          backgroundColor: isHovered ? 'rgba(255, 255, 255, 0.2)' : colorConfig.iconBg
        }}
      >
        {typeof IconoComponent === 'function' ? (
          <div 
            className="transition-colors duration-300"
            style={{ color: isHovered ? 'white' : colorConfig.primary }}
          >
            <IconoComponent size={48} strokeWidth={2} />
          </div>
        ) : (
          <IconoComponent 
            className="transition-colors duration-300" 
            size={48}
            strokeWidth={2}
            style={{ color: isHovered ? 'white' : colorConfig.primary }}
          />
        )}
      </div>

      {/* Título */}
      <h3 
        className="font-bold text-base md:text-lg mb-3 transition-colors duration-300"
        style={{ color: isHovered ? 'white' : '#111827' }}
      >
        {titulo}
      </h3>

      {/* Descripción */}
      <p 
        className="text-xs md:text-sm leading-relaxed break-words transition-colors duration-300"
        style={{ color: isHovered ? 'rgba(255, 255, 255, 0.95)' : '#6b7280' }}
      >
        {descripcion}
      </p>
    </div>
  );
};

export default InstruccionesAngelicales;

