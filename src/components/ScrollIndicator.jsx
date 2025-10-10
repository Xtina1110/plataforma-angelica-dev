import React, { useState, useEffect } from 'react';
import { ChevronUp, ChevronDown } from 'lucide-react';

const ScrollIndicator = () => {
  const [scrollPosition, setScrollPosition] = useState(0);
  const [isAtBottom, setIsAtBottom] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.pageYOffset;
      const windowHeight = window.innerHeight;
      const documentHeight = document.documentElement.scrollHeight;
      
      // Calcular posición del scroll como porcentaje
      const scrollPercent = (scrollTop / (documentHeight - windowHeight)) * 100;
      setScrollPosition(scrollPercent);
      
      // Verificar si está al final de la página
      const atBottom = scrollTop + windowHeight >= documentHeight - 10;
      setIsAtBottom(atBottom);
      
      // Mostrar el indicador solo si hay contenido desplazable
      setIsVisible(documentHeight > windowHeight);
    };

    // Listener inicial
    handleScroll();
    
    // Agregar listener de scroll
    window.addEventListener('scroll', handleScroll);
    
    // Cleanup
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleClick = () => {
    if (isAtBottom) {
      // Ir al inicio
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      // Ir al final
      window.scrollTo({ top: document.documentElement.scrollHeight, behavior: 'smooth' });
    }
  };

  if (!isVisible) return null;

  return (
    <div 
      className="fixed right-4 top-1/2 transform -translate-y-1/2 z-50 cursor-pointer"
      onClick={handleClick}
    >
      {/* Círculo exterior giratorio */}
      <div className="relative w-16 h-16">
        {/* Círculo exterior con líneas punteadas */}
        <div 
          className="absolute inset-0 border-2 border-dashed border-gray-400 rounded-full animate-spin"
          style={{ 
            animationDuration: '3s',
            borderSpacing: '4px'
          }}
        />
        
        {/* Círculo interior lila */}
        <div className="absolute inset-2 bg-purple-300 rounded-full flex items-center justify-center shadow-lg">
          {/* Icono de flecha centrado */}
          {isAtBottom ? (
            <ChevronUp size={20} className="text-white animate-pulse" />
          ) : (
            <ChevronDown size={20} className="text-white animate-pulse" />
          )}
        </div>
        
        {/* Indicador de progreso */}
        <div 
          className="absolute inset-1 rounded-full border-2 border-purple-200"
          style={{
            background: `conic-gradient(from 0deg, #C8A2C8 ${scrollPosition * 3.6}deg, transparent ${scrollPosition * 3.6}deg)`
          }}
        />
      </div>
      
      {/* Tooltip opcional */}
      <div className="absolute right-full mr-2 top-1/2 transform -translate-y-1/2 bg-black text-white text-xs px-2 py-1 rounded opacity-0 hover:opacity-100 transition-opacity whitespace-nowrap">
        {isAtBottom ? 'Ir al inicio' : 'Ir al final'}
      </div>
    </div>
  );
};

export default ScrollIndicator;