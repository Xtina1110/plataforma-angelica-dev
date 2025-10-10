import React from 'react';
import iconoConsultaEnVivo from '../assets/IconoConsultaEnVivo.png';

const IconoConsultaEnVivo = ({ className = "w-12 h-12" }) => {
  return (
    <img
      src={iconoConsultaEnVivo}
      alt="Consulta en Vivo"
      className={className}
      style={{ objectFit: 'contain' }}
    />
  );
};

export default IconoConsultaEnVivo;
