import { useEffect } from 'react';

/**
 * Custom hook que primero posiciona al inicio de la página y luego 
 * automáticamente hace scroll al contenido principal después de un delay
 * @param {string} targetSelector - CSS selector para el elemento destino
 * @param {number} delay - Delay en milisegundos antes de hacer scroll (default: 3000ms)
 */
const useAutoScrollToContent = (targetSelector = '.main-content', delay = 3000) => {
  useEffect(() => {
    // Primero posicionar al inicio de la página
    window.scrollTo(0, 0);
    
    // Después del delay, hacer scroll al contenido principal
    const timer = setTimeout(() => {
      const targetElement = document.querySelector(targetSelector);
      if (targetElement) {
        targetElement.scrollIntoView({ 
          behavior: 'smooth', 
          block: 'start',
          inline: 'nearest'
        });
      }
    }, delay);

    // Cleanup timer on component unmount
    return () => clearTimeout(timer);
  }, [targetSelector, delay]);
};

export default useAutoScrollToContent;