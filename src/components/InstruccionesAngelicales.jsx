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
      gradient: "from-purple-500 to-indigo-600",
      bg: "bg-purple-50",
      text: "text-purple-700",
      border: "border-purple-200",
      button: "from-purple-600 to-purple-700",
      hover: "hover:bg-gradient-to-r hover:from-purple-500 hover:to-indigo-600 hover:text-white"
    },
    blue: {
      gradient: "from-blue-500 to-cyan-600", 
      bg: "bg-blue-50",
      text: "text-blue-700",
      border: "border-blue-200",
      button: "from-blue-600 to-blue-700",
      hover: "hover:bg-gradient-to-r hover:from-blue-500 hover:to-cyan-600 hover:text-white"
    },
    green: {
      gradient: "from-green-500 to-teal-600",
      bg: "bg-green-50", 
      text: "text-green-700",
      border: "border-green-200",
      button: "from-green-600 to-green-700",
      hover: "hover:bg-gradient-to-r hover:from-green-500 hover:to-teal-600 hover:text-white"
    },
    amber: {
      gradient: "from-amber-500 to-orange-600",
      bg: "bg-amber-50",
      text: "text-amber-700", 
      border: "border-amber-200",
      button: "from-amber-600 to-amber-700",
      hover: "hover:bg-gradient-to-r hover:from-amber-500 hover:to-orange-600 hover:text-white"
    },
    pink: {
      gradient: "from-pink-500 to-rose-600",
      bg: "bg-pink-50",
      text: "text-pink-700",
      border: "border-pink-200", 
      button: "from-pink-600 to-pink-700",
      hover: "hover:bg-gradient-to-r hover:from-pink-500 hover:to-rose-600 hover:text-white"
    },
    cyan: {
      gradient: "from-cyan-500 to-teal-600",
      bg: "bg-cyan-50",
      text: "text-cyan-700",
      border: "border-cyan-200",
      button: "from-cyan-600 to-teal-700",
      hover: "hover:bg-gradient-to-r hover:from-cyan-500 hover:to-teal-600 hover:text-white"
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
              <div
                key={index}
                className={`group p-6 rounded-2xl text-center min-h-[220px] flex flex-col justify-start bg-white border-2 border-gray-200 transition-all duration-300 hover:border-${colorPrimario}-500 hover:bg-gradient-to-br hover:${configuracionColor.gradient} hover:transform hover:scale-105 hover:shadow-2xl cursor-pointer`}
              >
                <div className="flex items-center justify-center mx-auto mb-3 transition-all duration-300">
                  {typeof IconoComponent === 'function' ? (
                    <div className={`text-${colorPrimario}-600 group-hover:text-white transition-colors duration-300`}>
                      <IconoComponent />
                    </div>
                  ) : (
                    <IconoComponent className={`w-12 h-12 text-${colorPrimario}-600 group-hover:text-white transition-colors duration-300`} />
                  )}
                </div>
                <h3 className="font-bold text-base text-gray-900 group-hover:text-white mb-2 transition-colors duration-300">
                  {instruccion.titulo}
                </h3>
                <p className="text-sm leading-relaxed break-words text-gray-600 group-hover:text-white/95 transition-colors duration-300">
                  {instruccion.descripcion}
                </p>
              </div>
            );
          })}
        </div>

        {/* Llamada a la acción */}
        <div className="text-center mt-6">
          <button
            className={`bg-gradient-to-r ${configuracionColor.button} text-white px-6 py-3 rounded-xl font-semibold text-sm md:text-base transition-all duration-300 flex items-center space-x-2 mx-auto hover:transform hover:scale-105 shadow-lg`}
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

export default InstruccionesAngelicales;