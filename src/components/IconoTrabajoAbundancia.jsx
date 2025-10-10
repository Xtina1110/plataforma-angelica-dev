import React from 'react';
import iconoTrabajoAbundancia from '../assets/IconoTrabajoAbundancia.png';

const IconoTrabajoAbundancia = ({ className = "w-12 h-12" }) => {
  return (
    <img
      src={iconoTrabajoAbundancia}
      alt="Trabajo y Abundancia"
      className={className}
      style={{ objectFit: 'contain' }}
    />
  );
};

export default IconoTrabajoAbundancia;
