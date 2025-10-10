import React from 'react';
import iconoCrecimientoEspiritual from '../assets/IconoCrecimientoEspiritual.png';

const IconoCrecimientoEspiritual = ({ className = "w-12 h-12" }) => {
  return (
    <img
      src={iconoCrecimientoEspiritual}
      alt="Crecimiento Espiritual"
      className={className}
      style={{ objectFit: 'contain' }}
    />
  );
};

export default IconoCrecimientoEspiritual;
