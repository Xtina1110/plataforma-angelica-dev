/**
 * Header de Tienda Angelical
 * Usa el componente unificado con tema violet
 */

import React from 'react';
import UnifiedAngelicalHeader from './UnifiedAngelicalHeader';

const TiendaHeader = (props) => {
  return (
    <UnifiedAngelicalHeader
      app="tienda"
      {...props}
    />
  );
};

export default TiendaHeader;
