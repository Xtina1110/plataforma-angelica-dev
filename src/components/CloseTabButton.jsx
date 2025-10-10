import React from 'react';
import { X } from 'lucide-react';

const CloseTabButton = ({ onClick, className = "" }) => {
  const handleCloseTab = () => {
    if (onClick) {
      onClick();
    } else {
      // Cerrar la pestaña actual del navegador
      window.close();
    }
  };

  return (
    <button
      type="button"
      onClick={handleCloseTab}
      className={`
        inline-flex items-center justify-center
        w-10 h-10 rounded-full
        bg-gradient-to-r from-red-500 to-red-600
        hover:from-red-600 hover:to-red-700
        text-white shadow-lg hover:shadow-xl
        transition-all duration-300 ease-in-out
        hover:scale-110 active:scale-95
        focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50
        group
        ${className}
      `}
      aria-label="Cerrar pestaña"
      title="Cerrar pestaña"
    >
      <X 
        size={18} 
        className="transition-transform duration-200 group-hover:rotate-90" 
      />
    </button>
  );
};

export default CloseTabButton;