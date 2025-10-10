import React from 'react';
import OptimizedImage from './OptimizedImage';

const AccessibleImage = ({ 
  src, 
  alt, 
  decorative = false,
  className = '',
  ...props 
}) => {
  // Si es decorativa, usar alt vacío
  const altText = decorative ? '' : alt;
  
  // Si no es decorativa pero no tiene alt, mostrar advertencia en desarrollo
  if (!decorative && !alt && process.env.NODE_ENV === 'development') {
    console.warn('AccessibleImage: Non-decorative image missing alt text');
  }

  return (
    <OptimizedImage
      src={src}
      alt={altText}
      className={className}
      role={decorative ? 'presentation' : undefined}
      aria-hidden={decorative ? 'true' : undefined}
      {...props}
    />
  );
};

export default AccessibleImage;