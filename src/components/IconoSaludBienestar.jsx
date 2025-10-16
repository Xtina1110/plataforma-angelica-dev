import React from 'react';
import iconoSaludBienestar from '../assets/IconoSaludBienestarV5.png';

const IconoSaludBienestar = ({ className = "w-12 h-12" }) => {
  return (
    <img
      src={iconoSaludBienestar}
      alt="Salud y Bienestar"
      className={className}
      style={{ objectFit: 'contain' }}
    />
  );
};

export default IconoSaludBienestar;
