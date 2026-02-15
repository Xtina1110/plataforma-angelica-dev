import React from 'react';
import logo from '../assets/Logosinfondo.png';

const LogoAngelico = () => {
  return (
    <div className="z-50">
      <img 
        src={logo} 
        alt="Logo Juan Carlos Ávila - Elangeólogo" 
        className="h-16 sm:h-20 w-auto"
        onError={(e) => {
          console.log('Error loading logo:', e);
          e.target.style.display = 'none';
        }}
        onLoad={() => {
          console.log('Logo loaded successfully');
        }}
      />
    </div>
  );
};

export default LogoAngelico;
