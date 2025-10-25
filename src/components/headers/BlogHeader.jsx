/**
 * Header de Blog & Podcast
 * Usa el componente unificado con tema indigo
 */

import React from 'react';
import UnifiedAngelicalHeader from './UnifiedAngelicalHeader';

const BlogHeader = (props) => {
  return (
    <UnifiedAngelicalHeader
      app="blog"
      {...props}
    />
  );
};

export default BlogHeader;
