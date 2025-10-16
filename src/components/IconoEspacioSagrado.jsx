import React from 'react';
import iconoEspacioSagrado from '../assets/IconoEspacioSagrado.png';

const IconoEspacioSagrado = ({ className = "w-24 h-24" }) => {
  return (
    <img
      src={iconoEspacioSagrado}
      alt="Espacio Sagrado"
      className={className}
      style={{ objectFit: 'contain' }}
    />
  );
};

export default IconoEspacioSagrado;

