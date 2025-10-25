/**
 * Header de Eventos Angelicales
 * Usa el componente unificado con tema red
 */

import React from 'react';
import UnifiedAngelicalHeader from './UnifiedAngelicalHeader';

const EventosHeader = (props) => {
  return (
    <UnifiedAngelicalHeader
      app="eventos"
      {...props}
    />
  );
};

export default EventosHeader;
