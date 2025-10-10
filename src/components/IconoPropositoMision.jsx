import React from 'react';
import iconoPropositoMision from '../assets/IconoPropositoMision.png';

const IconoPropositoMision = ({ className = "w-12 h-12" }) => {
  return (
    <img
      src={iconoPropositoMision}
      alt="Propósito y Misión"
      className={className}
      style={{ objectFit: 'contain' }}
    />
  );
};

export default IconoPropositoMision;
