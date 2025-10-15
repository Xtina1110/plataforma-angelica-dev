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
      light: '#f3e8ff',
      border: '#e9d5ff',
      hover: 'linear-gradient(135deg, #9333ea 0%, #6366f1 100%)'
    },
    blue: {
      primary: '#3b82f6',
      secondary: '#0891b2',
      light: '#eff6ff',
      border: '#bfdbfe',
      hover: 'linear-gradient(135deg, #3b82f6 0%, #0891b2 100%)'
    },
    green: {
      primary: '#10b981',
      secondary: '#14b8a6',
      light: '#f0fdf4',
      border: '#bbf7d0',
      hover: 'linear-gradient(135deg, #10b981 0%, #14b8a6 100%)'
    },
    amber: {
      primary: '#f59e0b',
      secondary: '#ea580c',
      light: '#fffbeb',
      border: '#fde68a',
      hover: 'linear-gradient(135deg, #f59e0b 0%, #ea580c 100%)'
    },
    pink: {
      primary: '#ec4899',
      secondary: '#f43f5e',
      light: '#fdf2f8',
      border: '#fbcfe8',
      hover: 'linear-gradient(135deg, #ec4899 0%, #f43f5e 100%)'
    },
    cyan: {
      primary: '#06b6d4',
      secondary: '#0d9488',
      light: '#ecfeff',
      border: '#a5f3fc',
      hover: 'linear-gradient(135deg, #06b6d4 0%, #0d9488 100%)'
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
        <div className="text-center mb-4">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-1">
            {titulo}
          </h1>
          <p className="text-sm md:text-base text-gray-600 max-w-2xl mx-auto">
            {descripcion}
          </p>
        </div>
      )}

      {/* Recuadro de instrucciones */}
      <div
        className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 md:p-8 shadow-lg overflow-visible"
        style={{
          border: '1px solid rgba(200, 200, 255, 0.3)',
          boxShadow: '0 2px 8px rgba(0, 0, 0, 0.05)'
        }}
      >
        <div className="text-center mb-6">
          <h2 className="text-lg md:text-xl font-bold text-gray-900 mb-2">
            Preparación para tu Experiencia
          </h2>
          <p className="text-gray-600 text-xs md:text-sm">
            Sigue estos pasos para maximizar tu conexión con la energía angelical
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6 mb-6">
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
        <div className="text-center mt-6">
          <button
            className="text-white px-6 py-3 rounded-xl font-semibold text-sm md:text-base transition-all duration-300 flex items-center space-x-2 mx-auto hover:transform hover:scale-105 shadow-lg"
            style={{
              background: configuracionColor.hover
            }}
            onClick={onAccionClick}
          >
            <Sparkles className="w-5 h-5" />
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
      className="group p-6 rounded-2xl text-center min-h-[220px] flex flex-col justify-start bg-white border-2 transition-all duration-300 hover:transform hover:scale-105 hover:shadow-2xl cursor-pointer"
      style={{
        borderColor: isHovered ? colorConfig.primary : '#e5e7eb',
        background: isHovered ? colorConfig.hover : 'white'
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="flex items-center justify-center mx-auto mb-3 transition-all duration-300">
        {typeof IconoComponent === 'function' ? (
          <div 
            className="transition-colors duration-300"
            style={{ color: isHovered ? 'white' : colorConfig.primary }}
          >
            <IconoComponent />
          </div>
        ) : (
          <IconoComponent 
            className="w-12 h-12 transition-colors duration-300" 
            style={{ color: isHovered ? 'white' : colorConfig.primary }}
          />
        )}
      </div>
      <h3 
        className="font-bold text-base mb-2 transition-colors duration-300"
        style={{ color: isHovered ? 'white' : '#111827' }}
      >
        {titulo}
      </h3>
      <p 
        className="text-sm leading-relaxed break-words transition-colors duration-300"
        style={{ color: isHovered ? 'rgba(255, 255, 255, 0.95)' : '#4b5563' }}
      >
        {descripcion}
      </p>
    </div>
  );
};

export default InstruccionesAngelicales;

