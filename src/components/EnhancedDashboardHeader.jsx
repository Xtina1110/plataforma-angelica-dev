import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../integrations/supabase/client';
import { ShoppingCart, LogOut, User, Sun, Moon } from 'lucide-react';
import LanguageSelector from './LanguageSelector';
import AudioButton from './AudioButton';
import './EnhancedDashboardHeader.css';

const EnhancedDashboardHeader = ({ user, onLogout, cartCount = 0, onOpenCart, theme, onToggleTheme }) => {
  const navigate = useNavigate();
  const [userData, setUserData] = useState({
    nivelEspiritual: 'Iluminado',
    puntosLuz: 1500,
    diasConsecutivos: 7,
    sesiones: 12,
    canalizaciones: 25,
    cursos: 3
  });
  const [loading, setLoading] = useState(true);
  const [greeting, setGreeting] = useState('');

  // Obtener datos reales del usuario desde Supabase
  useEffect(() => {
    const fetchUserData = async () => {
      if (!user?.id) return;

      try {
        const { data, error } = await supabase
          .from('user_progress')
          .select('*')
          .eq('user_id', user.id)
          .single();

        if (data) {
          setUserData({
            nivelEspiritual: data.spiritual_level || 'Iluminado',
            puntosLuz: data.light_points || 1500,
            diasConsecutivos: data.consecutive_days || 7,
            sesiones: data.total_sessions || 12,
            canalizaciones: data.total_channeling || 25,
            cursos: data.completed_courses || 3
          });
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [user]);

  // Determinar saludo según hora del día
  useEffect(() => {
    const hour = new Date().getHours();
    let greetingText = '';
    
    if (hour >= 5 && hour < 12) {
      greetingText = '¡Buenos días';
    } else if (hour >= 12 && hour < 20) {
      greetingText = '¡Buenas tardes';
    } else {
      greetingText = '¡Buenas noches';
    }

    const firstName = user?.user_metadata?.full_name?.split(' ')[0] || 
                     user?.email?.split('@')[0] || 
                     'Cristina';
    
    setGreeting(`${greetingText}, ${firstName}!`);
  }, [user]);

  const handleProfileClick = () => {
    navigate('/perfil');
  };

  return (
    <div className="enhanced-dashboard-header">
      {/* Fondo con nubes púrpuras */}
      <div className="header-background"></div>

      <div className="header-content">
        {/* Sección izquierda: Saludo y mensaje */}
        <div className="header-left">
          <h1 className="header-greeting">{greeting}</h1>
          <p className="header-message">
            Tu camino espiritual continúa evolucionando ✨
          </p>
        </div>

        {/* Sección derecha: Stats y controles */}
        <div className="header-right">
          {/* Stats cards */}
          <div className="stats-cards">
            <div className="stat-card nivel">
              <div className="stat-label">Nivel Espiritual</div>
              <div className="stat-value">{userData.nivelEspiritual}</div>
            </div>
            <div className="stat-card puntos">
              <div className="stat-label">Puntos de Luz</div>
              <div className="stat-value">{userData.puntosLuz}</div>
            </div>
          </div>

          {/* Controles */}
          <div className="header-controls">
            {/* Selector de idioma */}
            <div className="control-button">
              <LanguageSelector />
            </div>

            {/* Carrito de compra */}
            <button 
              className="control-button cart-button" 
              onClick={onOpenCart}
              aria-label="Carrito de compra"
            >
              <ShoppingCart size={20} />
              {cartCount > 0 && (
                <span className="cart-badge">{cartCount}</span>
              )}
            </button>

            {/* Perfil de usuario */}
            <button 
              className="control-button user-button" 
              onClick={handleProfileClick}
              aria-label="Perfil de usuario"
            >
              <User size={20} />
              <span className="user-name">
                {user?.user_metadata?.full_name?.split(' ')[0] || 
                 user?.email?.split('@')[0] || 
                 'Usuario'}
              </span>
            </button>

            {/* Cerrar sesión */}
            <button 
              className="control-button logout-button" 
              onClick={onLogout}
              aria-label="Cerrar sesión"
            >
              <LogOut size={20} />
            </button>

            {/* Botón de audio */}
            <div className="control-button">
              <AudioButton />
            </div>

            {/* Toggle tema (si está habilitado) */}
            {onToggleTheme && (
              <button 
                className="control-button theme-button" 
                onClick={onToggleTheme}
                aria-label="Cambiar tema"
              >
                {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default EnhancedDashboardHeader;

