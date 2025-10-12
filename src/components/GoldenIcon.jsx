import React from 'react';

/**
 * GoldenIcon Component
 * Renders golden 3D icons consistently across the platform
 * 
 * @param {string} name - Icon name (e.g., 'checkmark', 'shield', 'email')
 * @param {string} size - Size class (default: 'w-12 h-12')
 * @param {string} className - Additional CSS classes
 */
const GoldenIcon = ({ name, size = 'w-12 h-12', className = '' }) => {
  const iconPath = `/iconos-legales/icono-${name}.png`;
  
  return (
    <img 
      src={iconPath} 
      alt={`${name} icon`}
      className={`${size} ${className} object-contain`}
      onError={(e) => {
        // Fallback to a default icon if the specific icon doesn't exist
        console.warn(`Icon not found: ${iconPath}`);
        e.target.style.display = 'none';
      }}
    />
  );
};

export default GoldenIcon;

