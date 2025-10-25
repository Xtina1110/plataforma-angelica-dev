/**
 * Tarjeta de Servicio Angelical
 * Diseño unificado para todas las páginas de selección de servicios
 * 
 * Características:
 * - Iconos en círculos dorados con fondo transparente
 * - Hover con color de la aplicación correspondiente
 * - Tamaños consistentes
 * - Animaciones suaves
 */

import React from 'react';
import { Check } from 'lucide-react';

const AngelicalServiceCard = ({
  icon: Icon,
  title,
  description,
  price,
  duration,
  color = '#9333ea', // Purple por defecto
  isSelected = false,
  onClick,
  badge,
  disabled = false,
  size = 'medium' // small, medium, large
}) => {
  const sizeClasses = {
    small: {
      card: 'p-4',
      iconContainer: 'w-16 h-16',
      icon: 'w-8 h-8',
      title: 'text-lg',
      description: 'text-xs',
      price: 'text-xl'
    },
    medium: {
      card: 'p-6',
      iconContainer: 'w-20 h-20',
      icon: 'w-10 h-10',
      title: 'text-xl',
      description: 'text-sm',
      price: 'text-2xl'
    },
    large: {
      card: 'p-8',
      iconContainer: 'w-24 h-24',
      icon: 'w-12 h-12',
      title: 'text-2xl',
      description: 'text-base',
      price: 'text-3xl'
    }
  };

  const sizes = sizeClasses[size];

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`
        ${sizes.card}
        relative
        rounded-2xl border-2
        transition-all duration-300 transform
        ${disabled 
          ? 'opacity-50 cursor-not-allowed' 
          : 'hover:scale-105 hover:shadow-2xl cursor-pointer'
        }
        ${isSelected
          ? 'border-[#D4AF37] bg-gradient-to-br from-yellow-50/50 to-white shadow-xl'
          : 'border-gray-200 bg-white/80 backdrop-blur-sm hover:border-[#D4AF37]/50'
        }
        group
      `}
      style={{
        ...(isSelected && {
          boxShadow: `0 0 30px ${color}20`
        })
      }}
    >
      {/* Badge (opcional) */}
      {badge && (
        <div 
          className="absolute -top-3 -right-3 px-3 py-1 rounded-full text-xs font-bold text-white shadow-lg"
          style={{ backgroundColor: color }}
        >
          {badge}
        </div>
      )}

      {/* Icono en círculo dorado */}
      <div className="flex justify-center mb-4">
        <div
          className={`
            ${sizes.iconContainer}
            rounded-full
            border-2 border-[#D4AF37]
            bg-gradient-to-br from-[#D4AF37]/10 to-transparent
            flex items-center justify-center
            transition-all duration-300
            group-hover:border-[#D4AF37]
            group-hover:shadow-lg
            ${isSelected ? 'border-[#D4AF37] shadow-lg' : ''}
          `}
          style={{
            ...(isSelected && {
              boxShadow: `0 0 20px ${color}30`
            }),
            ...(!isSelected && {
              '--hover-color': color
            })
          }}
        >
          {Icon && (
            <Icon 
              className={`
                ${sizes.icon}
                transition-all duration-300
                ${isSelected ? '' : 'text-[#D4AF37]'}
              `}
              style={{
                ...(isSelected && { color })
              }}
            />
          )}
        </div>
      </div>

      {/* Título */}
      <h3 
        className={`
          ${sizes.title}
          font-bold mb-2 text-center
          transition-colors duration-300
        `}
        style={{
          color: isSelected ? color : '#1f2937'
        }}
      >
        {title}
      </h3>

      {/* Descripción */}
      {description && (
        <p className={`${sizes.description} text-gray-600 text-center mb-3 leading-relaxed`}>
          {description}
        </p>
      )}

      {/* Duración (opcional) */}
      {duration && (
        <div className="text-center mb-2">
          <span className="text-sm text-gray-500 font-medium">
            {duration}
          </span>
        </div>
      )}

      {/* Precio (opcional) */}
      {price && (
        <div className="text-center">
          <span 
            className={`${sizes.price} font-bold`}
            style={{ color }}
          >
            {price}
          </span>
          {typeof price === 'string' && price.includes('$') && (
            <span className="text-sm text-gray-500 ml-1">USD</span>
          )}
        </div>
      )}

      {/* Indicador de selección */}
      {isSelected && (
        <div 
          className="mt-4 flex items-center justify-center gap-2 font-semibold"
          style={{ color }}
        >
          <Check className="w-5 h-5" />
          <span>Seleccionado</span>
        </div>
      )}

      {/* Efecto de brillo en hover */}
      <div 
        className={`
          absolute inset-0 rounded-2xl
          opacity-0 group-hover:opacity-100
          transition-opacity duration-300
          pointer-events-none
        `}
        style={{
          background: `radial-gradient(circle at center, ${color}10, transparent 70%)`
        }}
      />
    </button>
  );
};

// Variante para grid de servicios
export const ServiceCardGrid = ({ children, columns = 3 }) => {
  const gridCols = {
    2: 'md:grid-cols-2',
    3: 'md:grid-cols-3',
    4: 'md:grid-cols-4',
    5: 'md:grid-cols-5'
  };

  return (
    <div className={`grid grid-cols-1 ${gridCols[columns]} gap-6`}>
      {children}
    </div>
  );
};

// Preset de colores por aplicación
export const AppColors = {
  apertura: '#9333ea', // Purple
  canalizaciones: '#ec4899', // Pink
  sonoterapia: '#06b6d4', // Cyan
  terapias: '#10b981', // Emerald
  academia: '#f59e0b', // Amber
  tienda: '#8b5cf6', // Violet
  eventos: '#ef4444', // Red
  blog: '#6366f1' // Indigo
};

export default AngelicalServiceCard;

