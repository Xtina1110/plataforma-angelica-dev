import React from 'react';
import iconoIntencionClaraHD from '../assets/IconoIntencionClaraHD.png';

const IconoIntencionClara = ({ className = "w-24 h-24" }) => {
  return (
    <img
      src={iconoIntencionClaraHD}
      alt="Intención Clara"
      className={className}
      style={{ objectFit: 'contain' }}
    />
  );
};

export default IconoIntencionClara;

