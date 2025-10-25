/**
 * Header de Sonoterapia Angelical
 * Usa el componente unificado con tema cyan
 */

import React from 'react';
import UnifiedAngelicalHeader from './UnifiedAngelicalHeader';

const SonoterapiaHeader = (props) => {
  return (
    <UnifiedAngelicalHeader
      app="sonoterapia"
      {...props}
    />
  );
};

export default SonoterapiaHeader;

