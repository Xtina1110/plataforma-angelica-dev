/**
 * Header de Terapias y Limpiezas
 * Usa el componente unificado con tema emerald
 */

import React from 'react';
import UnifiedAngelicalHeader from './UnifiedAngelicalHeader';

const TerapiasHeader = (props) => {
  return (
    <UnifiedAngelicalHeader
      app="terapias"
      {...props}
    />
  );
};

export default TerapiasHeader;
