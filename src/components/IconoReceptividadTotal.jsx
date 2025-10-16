import React from 'react';
import iconoReceptividadTotal from '../assets/IconoReceptividadTotalHD.png';

const IconoReceptividadTotal = ({ className = "w-24 h-24" }) => {
  return (
    <img
      src={iconoReceptividadTotal}
      alt="Receptividad Total"
      className={className}
      style={{ objectFit: 'contain' }}
    />
  );
};

export default IconoReceptividadTotal;

