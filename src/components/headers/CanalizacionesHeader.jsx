/**
 * Header de Canalizaciones Angelicales
 * Usa el componente unificado con tema pink
 */

import React from 'react';
import UnifiedAngelicalHeader from './UnifiedAngelicalHeader';

const CanalizacionesHeader = (props) => {
  return (
    <UnifiedAngelicalHeader
      app="canalizaciones"
      {...props}
    />
  );
};

export default CanalizacionesHeader;
