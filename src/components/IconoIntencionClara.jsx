import React from 'react';
import iconoIntencionClara from '../assets/IconoIntencionClaraHD.png';

const IconoIntencionClara = ({ className = "w-24 h-24" }) => {
  return (
    <img
      src={iconoIntencionClara}
      alt="Intención Clara"
      className={className}
      style={{ objectFit: 'contain' }}
    />
  );
};

export default IconoIntencionClara;

