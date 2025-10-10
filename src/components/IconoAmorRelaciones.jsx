import React from 'react';
import iconoAmorRelaciones from '../assets/IconoAmorRelacionesNuevo.png';

const IconoAmorRelaciones = ({ className = "w-12 h-12" }) => {
  return (
    <img
      src={iconoAmorRelaciones}
      alt="Amor y Relaciones"
      className={className}
      style={{ objectFit: 'contain' }}
    />
  );
};

export default IconoAmorRelaciones;
