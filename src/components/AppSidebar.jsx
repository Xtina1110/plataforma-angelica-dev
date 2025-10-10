import React, { useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import { Home, LayoutDashboard, BookOpen, Mic, Star, MessageSquare, Menu, X, 
         Calendar, ShoppingCart, Zap, GraduationCap, User, Headphones, Heart } from 'lucide-react';
import { supabase } from '../integrations/supabase/client';
import logo from '../assets/Logosinfondo.png';
import AudioButton from './AudioButton';
import './Dashboard.css';

const navItems = [
  { to: '/inicio', icon: Home, label: 'Inicio', color: '#6E3CBC' },
  { to: '/apertura-angelica', icon: Zap, label: 'Apertura Angelica', color: '#1DBF73' },
  { to: '/sonoterapia', icon: Headphones, label: 'Sonoterapia y Canalizaciones', color: '#9C27B0' },
  { to: '/terapias', icon: Heart, label: 'Terapias y Limpiezas', color: '#E91E63' },
  { to: '/academia', icon: GraduationCap, label: 'Academia Angelica', color: '#4CAF50' },
  { to: '/mensaje-del-dia', icon: MessageSquare, label: 'Mensaje Diario', color: '#B388FF' },
  { to: '/eventos', icon: Calendar, label: 'Eventos Angelicales', color: '#3F51B5' },
  { to: '/dashboard?section=blog', icon: Star, label: 'Blog & Podcast', color: '#FFC107' },
  { to: '/tienda', icon: ShoppingCart, label: 'Tienda Angelica', color: '#FF9800' },
];

export default function AppSidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const [user, setUser] = useState(null);
  const [userProfile, setUserProfile] = useState(null);


  useEffect(() => {
    const getUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        setUser(session.user);
        
        // Fetch user profile from usuarios table
        const { data: profile } = await supabase
          .from('usuarios')
          .select('nombre, email')
          .eq('id', session.user.id)
          .maybeSingle();
        
        setUserProfile(profile);
      }
    };
    
    getUser();
  }, []);

  const getUserName = () => {
    if (userProfile?.nombre) return userProfile.nombre;
    if (user?.user_metadata?.nombre || user?.user_metadata?.name || user?.user_metadata?.full_name) return user.user_metadata.nombre || user.user_metadata.name || user.user_metadata.full_name;
    if (user?.email) {
      const emailName = user.email.split('@')[0];
      return emailName.charAt(0).toUpperCase() + emailName.slice(1).replace(/[^a-zA-Z]/g, '');
    }
    return 'Usuario';
  };

  return (
    <aside className={`sidebar ${collapsed ? 'collapsed' : ''}`}>
      <div className="sidebar-header">
        <img src={logo} alt="Logo" className="sidebar-logo" />
        {!collapsed && <h3 className="sidebar-title">PLATAFORMA ANGÉLICA</h3>}
        <button className="sidebar-toggle" onClick={() => setCollapsed(!collapsed)}>
          {collapsed ? <Menu size={20} /> : <X size={20} />}
        </button>
      </div>

      <ul className="sidebar-nav">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <li key={item.to}>
              <NavLink 
                to={item.to} 
                end 
                className={({ isActive }) => isActive ? 'active' : ''}
                style={{ 
                  '--item-color': item.color,
                  '--hover-color': item.color,
                  '--active-color': item.color 
                }}
              >
                <Icon size={20} />
                {!collapsed && <span>{item.label}</span>}
              </NavLink>
            </li>
          );
        })}
      </ul>

      <div className="sidebar-footer">
        <div className="user-info">
          <div className="user-avatar">
            <User size={20} />
          </div>
          {!collapsed && (
            <div className="user-details">
              <span className="user-email">{user?.email || 'usuario@email.com'}</span>
              <span className="user-status">PREMIUM</span>
            </div>
          )}
        </div>

        <div className="audio-button-container">
          <AudioButton
            variant="sidebar"
            showText={!collapsed}
            className="w-full"
          />
        </div>

        <div className="cart-button-container">
          <button className="cart-button">
            <ShoppingCart size={16} />
            {!collapsed && <span>Carrito de Compra</span>}
          </button>
        </div>

        {!collapsed && (
          <button className="logout-button" onClick={() => {
            supabase.auth.signOut();
          }}>
            <User size={16} />
            Cerrar Sesión
          </button>
        )}
      </div>
    </aside>
  );
}
