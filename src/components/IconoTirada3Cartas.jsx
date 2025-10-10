import React from 'react';
import iconoTirada3Cartas from '../assets/IconoTirada3CartasNuevo.png';

const IconoTirada3Cartas = ({ className = "w-12 h-12" }) => {
  return (
    <img
      src={iconoTirada3Cartas}
      alt="Tirada de 3 Cartas"
      className={className}
      style={{ objectFit: 'contain' }}
    />
  );
};

export default IconoTirada3Cartas;
