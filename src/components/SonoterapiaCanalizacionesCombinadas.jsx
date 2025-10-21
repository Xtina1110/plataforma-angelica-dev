import React from 'react';
import Sonoterapia from './Sonoterapia';
import MarketplaceCanalizaciones from './MarketplaceCanalizaciones';
import './Dashboard.css';

/**
 * Componente que combina Sonoterapia y Canalizaciones en una sola vista
   * Muestra Sonoterapia (fondo morado) y MarketplaceCanalizaciones (fondo amarillo) una debajo de la otra
 */
const SonoterapiaCanalizacionesCombinadas = ({ onVolver, addToCart }) => {
  return (
    <div style={{
      width: '100%',
      minHeight: '100vh'
    }}>
      {/* Sección de Sonoterapia */}
      <div style={{
        marginBottom: '0px' // Sin espacio entre secciones para que se vean continuas
      }}>
        <Sonoterapia onVolver={onVolver} addToCart={addToCart} />
      </div>

      {/* Sección de Canalizaciones */}
      <div>
        <MarketplaceCanalizaciones onVolver={onVolver} addToCart={addToCart} />
      </div>
    </div>
  );
};

export default SonoterapiaCanalizacionesCombinadas;

