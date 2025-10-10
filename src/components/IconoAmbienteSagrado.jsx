import React from 'react';
import iconoAmbienteSagrado from '../assets/IconoCorazonAmbienteSagrado.png';

const IconoAmbienteSagrado = ({ className = "w-12 h-12" }) => {
  return (
    <img
      src={iconoAmbienteSagrado}
      alt="Ambiente Sagrado"
      className={className}
      style={{ objectFit: 'contain' }}
    />
  );
};

export default IconoAmbienteSagrado;
