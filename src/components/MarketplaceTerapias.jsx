import React, { useState } from 'react';
import { getTerapias, getCategoriasTerapias, getArcangelesTerapias } from '../data/terapiasData';
import { Heart, Clock, DollarSign, MapPin, Sparkles, X, ShoppingCart, Play } from 'lucide-react';
import './MarketplaceCanalizaciones.css';

const MarketplaceTerapias = ({ onVolver, addToCart }) => {
  const [terapias] = useState(getTerapias());
  const [filtro, setFiltro] = useState('todas'); // todas, gratuitas, premium
  const [categoriaFiltro, setCategoriaFiltro] = useState('Todas');
  const [arcangelFiltro, setArcangelFiltro] = useState('Todos');
  const [modalidadFiltro, setModalidadFiltro] = useState('Todas');
  const [terapiaSeleccionada, setTerapiaSeleccionada] = useState(null);

  // Filtrar terapias
  const terapiasFiltradas = terapias.filter(t => {
    // Filtro por precio
    let cumplePrecio = true;
    if (filtro === 'gratuitas') cumplePrecio = !t.premium || t.precio === 0;
    if (filtro === 'premium') cumplePrecio = t.premium && t.precio > 0;
    
    // Filtro por categoría
    let cumpleCategoria = true;
    if (categoriaFiltro !== 'Todas') cumpleCategoria = t.categoria === categoriaFiltro;
    
    // Filtro por arcángel
    let cumpleArcangel = true;
    if (arcangelFiltro !== 'Todos') cumpleArcangel = t.arcangel === arcangelFiltro;
    
    // Filtro por modalidad
    let cumpleModalidad = true;
    if (modalidadFiltro !== 'Todas') cumpleModalidad = t.modalidad.includes(modalidadFiltro);
    
    return cumplePrecio && cumpleCategoria && cumpleArcangel && cumpleModalidad;
  });

  // Función para abrir modal con detalle
  const handleCardClick = (terapia) => {
    setTerapiaSeleccionada(terapia);
  };

  // Función para cerrar modal
  const handleCloseModal = () => {
    setTerapiaSeleccionada(null);
  };

  // Función para manejar compra
  const handleCompra = (terapiaId) => {
    const terapia = terapias.find(t => t.id === terapiaId);
    if (!terapia) return;

    if (addToCart) {
      const cartItem = {
        id: `terapia-${terapia.id}`,
        type: 'terapia',
        name: terapia.titulo,
        price: terapia.precio,
        image: terapia.imagen,
        category: 'Terapia Angelical',
        data: terapia
      };
      addToCart(cartItem);
      alert(`✅ "${terapia.titulo}" agregado al carrito por $${terapia.precio}`);
      handleCloseModal();
    } else {
      alert('Sistema de carrito no disponible.');
    }
  };

  // Verificar si el usuario tiene acceso
  const tieneAcceso = (terapia) => {
    return !terapia.premium || terapia.precio === 0 || terapia.comprado;
  };

  // Obtener categorías y arcángeles
  const categorias = getCategoriasTerapias();
  const arcangeles = getArcangelesTerapias();

  return (
    <div className="marketplace-container">
      {/* Header */}
      <div className="marketplace-header" style={{
        background: 'linear-gradient(135deg, #ec4899 0%, #f43f5e 100%)',
        padding: '40px 30px',
        borderRadius: '20px',
        marginBottom: '30px',
        color: 'white'
      }}>
        <div className="header-content">
          <button 
            onClick={onVolver}
            style={{
              background: 'rgba(255,255,255,0.2)',
              border: 'none',
              color: 'white',
              padding: '10px 20px',
              borderRadius: '25px',
              cursor: 'pointer',
              marginBottom: '20px',
              fontWeight: '600'
            }}
          >
            ← Volver
          </button>
          <h1 style={{ fontSize: '2.5rem', fontWeight: 'bold', marginBottom: '10px' }}>
            <Heart className="inline-block mr-3" size={40} />
            Terapias Angelicales
          </h1>
          <p className="subtitle" style={{ fontSize: '1.1rem', opacity: 0.95 }}>
            Sanación energética profunda guiada por arcángeles
          </p>
        </div>

        {/* Filtros */}
        <div className="marketplace-controls" style={{ marginTop: '20px' }}>
          <div className="filtros" style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
            <button
              className={`filtro-btn ${filtro === 'todas' ? 'active' : ''}`}
              onClick={() => setFiltro('todas')}
              style={{
                padding: '10px 20px',
                borderRadius: '25px',
                border: 'none',
                background: filtro === 'todas' ? 'white' : 'rgba(255,255,255,0.2)',
                color: filtro === 'todas' ? '#ec4899' : 'white',
                fontWeight: '600',
                cursor: 'pointer'
              }}
            >
              Todas ({terapias.length})
            </button>
            <button
              className={`filtro-btn ${filtro === 'gratuitas' ? 'active' : ''}`}
              onClick={() => setFiltro('gratuitas')}
              style={{
                padding: '10px 20px',
                borderRadius: '25px',
                border: 'none',
                background: filtro === 'gratuitas' ? 'white' : 'rgba(255,255,255,0.2)',
                color: filtro === 'gratuitas' ? '#ec4899' : 'white',
                fontWeight: '600',
                cursor: 'pointer'
              }}
            >
              Gratuitas ({terapias.filter(t => !t.premium || t.precio === 0).length})
            </button>
            <button
              className={`filtro-btn ${filtro === 'premium' ? 'active' : ''}`}
              onClick={() => setFiltro('premium')}
              style={{
                padding: '10px 20px',
                borderRadius: '25px',
                border: 'none',
                background: filtro === 'premium' ? 'white' : 'rgba(255,255,255,0.2)',
                color: filtro === 'premium' ? '#ec4899' : 'white',
                fontWeight: '600',
                cursor: 'pointer'
              }}
            >
              Premium ({terapias.filter(t => t.premium && t.precio > 0).length})
            </button>
          </div>

          {/* Filtros adicionales */}
          <div style={{ display: 'flex', gap: '10px', marginTop: '15px', flexWrap: 'wrap' }}>
            <select 
              value={categoriaFiltro}
              onChange={(e) => setCategoriaFiltro(e.target.value)}
              style={{
                padding: '10px 15px',
                borderRadius: '25px',
                border: 'none',
                background: 'rgba(255,255,255,0.9)',
                color: '#ec4899',
                fontWeight: '600',
                cursor: 'pointer'
              }}
            >
              {categorias.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>

            <select 
              value={arcangelFiltro}
              onChange={(e) => setArcangelFiltro(e.target.value)}
              style={{
                padding: '10px 15px',
                borderRadius: '25px',
                border: 'none',
                background: 'rgba(255,255,255,0.9)',
                color: '#ec4899',
                fontWeight: '600',
                cursor: 'pointer'
              }}
            >
              {arcangeles.map(arc => (
                <option key={arc} value={arc}>{arc === 'Todos' ? 'Todos los arcángeles' : `Arcángel ${arc}`}</option>
              ))}
            </select>

            <select 
              value={modalidadFiltro}
              onChange={(e) => setModalidadFiltro(e.target.value)}
              style={{
                padding: '10px 15px',
                borderRadius: '25px',
                border: 'none',
                background: 'rgba(255,255,255,0.9)',
                color: '#ec4899',
                fontWeight: '600',
                cursor: 'pointer'
              }}
            >
              <option value="Todas">Todas las modalidades</option>
              <option value="Presencial">Presencial</option>
              <option value="Online">Online</option>
            </select>
          </div>
        </div>
      </div>

      {/* Grid de terapias */}
      <div className="marketplace-grid" style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
        gap: '25px',
        padding: '20px'
      }}>
        {terapiasFiltradas.map(terapia => (
          <div 
            key={terapia.id}
            className="terapia-card"
            onClick={() => handleCardClick(terapia)}
            style={{
              background: 'white',
              borderRadius: '20px',
              overflow: 'hidden',
              boxShadow: '0 4px 15px rgba(0,0,0,0.1)',
              cursor: 'pointer',
              transition: 'transform 0.3s, box-shadow 0.3s',
              position: 'relative'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-5px)';
              e.currentTarget.style.boxShadow = '0 8px 25px rgba(0,0,0,0.15)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 4px 15px rgba(0,0,0,0.1)';
            }}
          >
            {/* Imagen */}
            <div style={{ position: 'relative', height: '200px', overflow: 'hidden' }}>
              <img 
                src={terapia.imagen} 
                alt={terapia.titulo}
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
              {/* Badge de precio */}
              <div style={{
                position: 'absolute',
                top: '15px',
                right: '15px',
                background: terapia.precio === 0 ? '#10b981' : '#ec4899',
                color: 'white',
                padding: '8px 15px',
                borderRadius: '25px',
                fontWeight: 'bold',
                fontSize: '0.9rem'
              }}>
                {terapia.precio === 0 ? 'GRATIS' : `$${terapia.precio}`}
              </div>
            </div>

            {/* Contenido */}
            <div style={{ padding: '20px' }}>
              <h3 style={{ 
                fontSize: '1.3rem', 
                fontWeight: 'bold', 
                marginBottom: '10px',
                color: '#1f2937'
              }}>
                {terapia.titulo}
              </h3>
              
              <p style={{ 
                color: '#6b7280', 
                fontSize: '0.95rem',
                marginBottom: '15px',
                lineHeight: '1.5'
              }}>
                {terapia.descripcion.substring(0, 100)}...
              </p>

              {/* Info adicional */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '0.9rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', color: '#6b7280' }}>
                  <Sparkles size={16} className="mr-2" style={{ color: '#ec4899' }} />
                  <span>Arcángel {terapia.arcangel}</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', color: '#6b7280' }}>
                  <Clock size={16} className="mr-2" style={{ color: '#ec4899' }} />
                  <span>{terapia.duracionMinutos} minutos</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', color: '#6b7280' }}>
                  <MapPin size={16} className="mr-2" style={{ color: '#ec4899' }} />
                  <span>{terapia.modalidad}</span>
                </div>
              </div>

              {/* Badge de categoría */}
              <div style={{
                marginTop: '15px',
                padding: '6px 12px',
                background: '#fce7f3',
                color: '#ec4899',
                borderRadius: '15px',
                fontSize: '0.85rem',
                fontWeight: '600',
                display: 'inline-block'
              }}>
                {terapia.categoria}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Modal de detalle */}
      {terapiaSeleccionada && (
        <div 
          className="modal-overlay"
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(0,0,0,0.7)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000,
            padding: '20px'
          }}
          onClick={handleCloseModal}
        >
          <div 
            className="modal-content"
            style={{
              background: 'white',
              borderRadius: '25px',
              maxWidth: '700px',
              width: '100%',
              maxHeight: '90vh',
              overflow: 'auto',
              position: 'relative'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Botón cerrar */}
            <button
              onClick={handleCloseModal}
              style={{
                position: 'absolute',
                top: '20px',
                right: '20px',
                background: 'rgba(0,0,0,0.1)',
                border: 'none',
                borderRadius: '50%',
                width: '40px',
                height: '40px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                zIndex: 10
              }}
            >
              <X size={24} />
            </button>

            {/* Imagen */}
            <div style={{ height: '300px', overflow: 'hidden', borderRadius: '25px 25px 0 0' }}>
              <img 
                src={terapiaSeleccionada.imagen} 
                alt={terapiaSeleccionada.titulo}
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
            </div>

            {/* Contenido */}
            <div style={{ padding: '30px' }}>
              <h2 style={{ fontSize: '2rem', fontWeight: 'bold', marginBottom: '15px', color: '#1f2937' }}>
                {terapiaSeleccionada.titulo}
              </h2>

              <div style={{ display: 'flex', gap: '15px', marginBottom: '20px', flexWrap: 'wrap' }}>
                <span style={{
                  padding: '8px 16px',
                  background: '#fce7f3',
                  color: '#ec4899',
                  borderRadius: '20px',
                  fontSize: '0.9rem',
                  fontWeight: '600'
                }}>
                  {terapiaSeleccionada.categoria}
                </span>
                <span style={{
                  padding: '8px 16px',
                  background: '#dbeafe',
                  color: '#3b82f6',
                  borderRadius: '20px',
                  fontSize: '0.9rem',
                  fontWeight: '600'
                }}>
                  Arcángel {terapiaSeleccionada.arcangel}
                </span>
              </div>

              <p style={{ color: '#4b5563', fontSize: '1.05rem', lineHeight: '1.7', marginBottom: '25px' }}>
                {terapiaSeleccionada.descripcion}
              </p>

              {/* Beneficios */}
              <div style={{ marginBottom: '25px' }}>
                <h3 style={{ fontSize: '1.3rem', fontWeight: 'bold', marginBottom: '12px', color: '#1f2937' }}>
                  Beneficios
                </h3>
                <ul style={{ listStyle: 'none', padding: 0 }}>
                  {terapiaSeleccionada.beneficios.map((beneficio, idx) => (
                    <li key={idx} style={{ 
                      padding: '8px 0',
                      color: '#4b5563',
                      display: 'flex',
                      alignItems: 'center'
                    }}>
                      <Sparkles size={16} style={{ color: '#ec4899', marginRight: '10px', flexShrink: 0 }} />
                      {beneficio}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Incluye */}
              <div style={{ marginBottom: '25px' }}>
                <h3 style={{ fontSize: '1.3rem', fontWeight: 'bold', marginBottom: '12px', color: '#1f2937' }}>
                  Incluye
                </h3>
                <ul style={{ listStyle: 'none', padding: 0 }}>
                  {terapiaSeleccionada.incluye.map((item, idx) => (
                    <li key={idx} style={{ 
                      padding: '8px 0',
                      color: '#4b5563',
                      display: 'flex',
                      alignItems: 'center'
                    }}>
                      <Heart size={16} style={{ color: '#ec4899', marginRight: '10px', flexShrink: 0 }} />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Info adicional */}
              <div style={{ 
                background: '#f9fafb',
                padding: '20px',
                borderRadius: '15px',
                marginBottom: '25px'
              }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
                  <div>
                    <div style={{ color: '#6b7280', fontSize: '0.9rem', marginBottom: '5px' }}>Duración</div>
                    <div style={{ fontWeight: 'bold', color: '#1f2937' }}>{terapiaSeleccionada.duracionMinutos} minutos</div>
                  </div>
                  <div>
                    <div style={{ color: '#6b7280', fontSize: '0.9rem', marginBottom: '5px' }}>Modalidad</div>
                    <div style={{ fontWeight: 'bold', color: '#1f2937' }}>{terapiaSeleccionada.modalidad}</div>
                  </div>
                </div>
              </div>

              {/* Precio y botón */}
              <div style={{ 
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                borderTop: '2px solid #f3f4f6',
                paddingTop: '20px'
              }}>
                <div>
                  <div style={{ color: '#6b7280', fontSize: '0.9rem' }}>Precio</div>
                  <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#ec4899' }}>
                    {terapiaSeleccionada.precio === 0 ? 'GRATIS' : `$${terapiaSeleccionada.precio}`}
                  </div>
                </div>
                <button
                  onClick={() => handleCompra(terapiaSeleccionada.id)}
                  style={{
                    background: 'linear-gradient(135deg, #ec4899 0%, #f43f5e 100%)',
                    color: 'white',
                    border: 'none',
                    padding: '15px 35px',
                    borderRadius: '25px',
                    fontSize: '1.1rem',
                    fontWeight: 'bold',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px'
                  }}
                >
                  <ShoppingCart size={20} />
                  {terapiaSeleccionada.precio === 0 ? 'Acceder Gratis' : 'Agregar al Carrito'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Mensaje si no hay resultados */}
      {terapiasFiltradas.length === 0 && (
        <div style={{
          textAlign: 'center',
          padding: '60px 20px',
          color: '#6b7280'
        }}>
          <Heart size={64} style={{ margin: '0 auto 20px', opacity: 0.3 }} />
          <h3 style={{ fontSize: '1.5rem', marginBottom: '10px' }}>No se encontraron terapias</h3>
          <p>Intenta ajustar los filtros para ver más opciones</p>
        </div>
      )}
    </div>
  );
};

export default MarketplaceTerapias;

