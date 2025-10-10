import React from 'react';
import iconoTiradaGeneral from '../assets/IconoTiradaGeneral.png';

const IconoTiradaGeneral = ({ className = "w-12 h-12" }) => {
  return (
    <img
      src={iconoTiradaGeneral}
      alt="Tirada General"
      className={className}
      style={{ objectFit: 'contain' }}
    />
  );
};

export default IconoTiradaGeneral;
