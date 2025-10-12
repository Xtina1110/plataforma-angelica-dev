import React from 'react';
import { useNavigate } from 'react-router-dom';
import './PremiumSidebar.css';
import logo from '../assets/Logosinfondo.png';

const PremiumSidebar = ({ activeSection, onSectionChange, sidebarCollapsed, onToggleSidebar, user }) => {
  const navigate = useNavigate();

  const menuItems = [
    {
      id: 'home',
      name: 'Inicio',
      icon: '/iconos-apps/icono-3d-inicio.png',
      color: '#6E3CBC',
      colorDark: '#5A2FA3',
      route: '/inicio'
    },
    {
      id: 'tirada',
      name: 'Apertura Angélica',
      icon: '/iconos-apps/icono-3d-apertura.png',
      color: '#00BCD4',
      colorDark: '#0097A7',
      route: '/inicio?section=tirada'
    },
    {
      id: 'canalizaciones',
      name: 'Sonoterapia y Canalizaciones',
      icon: '/iconos-apps/icono-3d-sonoterapia.png',
      color: '#9C27B0',
      colorDark: '#7B1FA2',
      route: '/inicio?section=canalizaciones'
    },
    {
      id: 'terapias',
      name: 'Terapias y Limpiezas',
      icon: '/iconos-apps/icono-3d-terapias.png',
      color: '#E91E63',
      colorDark: '#C2185B',
      route: '/inicio?section=terapias'
    },
    {
      id: 'academia',
      name: 'Academia Angélica',
      icon: '/iconos-apps/icono-3d-academia.png',
      color: '#4CAF50',
      colorDark: '#388E3C',
      route: '/inicio?section=academia'
    },
    {
      id: 'mensaje',
      name: 'Mensaje Diario',
      icon: '/iconos-apps/icono-3d-mensaje.png',
      color: '#B388FF',
      colorDark: '#9575CD',
      route: '/inicio?section=mensaje'
    },
    {
      id: 'eventos',
      name: 'Eventos Angélicos',
      icon: '/iconos-apps/icono-3d-eventos.png',
      color: '#3F51B5',
      colorDark: '#303F9F',
      route: '/inicio?section=eventos'
    },
    {
      id: 'blog',
      name: 'Blog & Podcast',
      icon: '/iconos-apps/icono-3d-blog.png',
      color: '#FFC107',
      colorDark: '#FFA000',
      route: '/inicio?section=blog'
    },
    {
      id: 'tienda',
      name: 'Tienda Angélica',
      icon: '/iconos-apps/icono-3d-tienda.png',
      color: '#FF6F00',
      colorDark: '#E65100',
      route: '/inicio?section=tienda'
    }
  ];

  const handleItemClick = (item) => {
    onSectionChange(item.id);
    if (item.route) {
      navigate(item.route);
    }
  };

  return (
    <div className={`premium-sidebar ${sidebarCollapsed ? 'collapsed' : ''}`}>
      {/* Logo y título */}
      <div className="sidebar-header">
        <img src={logo} alt="Logo" className="sidebar-logo" />
        {!sidebarCollapsed && (
          <div className="sidebar-title">
            <h2>PLATAFORMA</h2>
            <h2>ANGÉLICA</h2>
          </div>
        )}
        <button 
          className="sidebar-toggle" 
          onClick={onToggleSidebar}
          aria-label={sidebarCollapsed ? 'Expandir sidebar' : 'Contraer sidebar'}
        >
          {sidebarCollapsed ? '→' : '←'}
        </button>
      </div>

      {/* Menú de navegación */}
      <nav className="sidebar-nav">
        {menuItems.map((item) => (
          <div
            key={item.id}
            className={`sidebar-item ${activeSection === item.id ? 'active' : ''}`}
            onClick={() => handleItemClick(item)}
            style={{
              '--app-color': item.color,
              '--app-color-dark': item.colorDark,
              '--app-color-rgb': hexToRgb(item.color)
            }}
          >
            <img 
              src={item.icon} 
              alt={item.name} 
              className="sidebar-icon-3d" 
            />
            {!sidebarCollapsed && (
              <span className="sidebar-text">{item.name}</span>
            )}
          </div>
        ))}
      </nav>

      {/* User info en el sidebar (opcional) */}
      {!sidebarCollapsed && user && (
        <div className="sidebar-footer">
          <div className="sidebar-user-info">
            <div className="user-avatar">
              {user.email?.[0]?.toUpperCase() || 'U'}
            </div>
            <div className="user-details">
              <p className="user-email">{user.email}</p>
              <p className="user-plan">PREMIUM</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// Helper function to convert hex to RGB
const hexToRgb = (hex) => {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result
    ? `${parseInt(result[1], 16)}, ${parseInt(result[2], 16)}, ${parseInt(result[3], 16)}`
    : '110, 60, 188';
};

export default PremiumSidebar;

