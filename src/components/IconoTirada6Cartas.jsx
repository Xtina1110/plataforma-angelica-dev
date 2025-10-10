import React from 'react';
import iconoTirada6Cartas from '../assets/IconoTirada6Cartas.png';

const IconoTirada6Cartas = ({ className = "w-12 h-12" }) => {
  return (
    <img
      src={iconoTirada6Cartas}
      alt="Tirada de 6 Cartas"
      className={className}
      style={{ objectFit: 'contain' }}
    />
  );
};

export default IconoTirada6Cartas;
