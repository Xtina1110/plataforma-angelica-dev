import React from 'react';
import iconoTirada9Cartas from '../assets/IconoTirada9Cartas.png';

const IconoTirada9Cartas = ({ className = "w-12 h-12" }) => {
  return (
    <img
      src={iconoTirada9Cartas}
      alt="Tirada de 9 Cartas"
      className={className}
      style={{ objectFit: 'contain' }}
    />
  );
};

export default IconoTirada9Cartas;
