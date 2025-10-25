/**
 * Header de Academia Angélica
 * Usa el componente unificado con tema amber
 */

import React from 'react';
import UnifiedAngelicalHeader from './UnifiedAngelicalHeader';

const AcademiaHeader = (props) => {
  return (
    <UnifiedAngelicalHeader
      app="academia"
      {...props}
    />
  );
};

export default AcademiaHeader;
