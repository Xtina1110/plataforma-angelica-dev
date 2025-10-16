import React from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../integrations/supabase/client';
import DashboardSidebar from './DashboardSidebar';
import GlobalAudioControl from './GlobalAudioControl';
import { useCart } from '../contexts/CartContext';
import FooterLegal from './FooterLegal';

export default function MainLayout({ children }) {
  const navigate = useNavigate();
  const { cartCount } = useCart();
  const [user, setUser] = React.useState(null);

  React.useEffect(() => {
    const loadUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
    };
    loadUser();
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/login');
  };

  const handleNavigate = (sectionId) => {
    // Mapeo de secciones a rutas
    const routes = {
      home: '/dashboard',
      tirada: '/apertura-angelica',
      canalizaciones: '/sonoterapia',
      terapias: '/terapias',
      academia: '/academia',
      mensaje: '/mensaje-del-dia',
      eventos: '/eventos',
      blog: '/dashboard?section=blog',
      tienda: '/tienda'
    };
    
    if (routes[sectionId]) {
      navigate(routes[sectionId]);
    }
  };

  return (
    <div className="flex min-h-screen w-full">
      <DashboardSidebar
        user={user}
        onLogout={handleLogout}
        onNavigate={handleNavigate}
        cartCount={cartCount}
        onCartClick={() => navigate('/carrito')}
        onNotificationsClick={() => console.log('Notificaciones')}
        onSearchClick={() => console.log('Buscar')}
        onProfileClick={() => navigate('/perfil')}
      />
      <div className="flex-1 flex flex-col">
        <div className="flex-1">
          {children}
        </div>
        <FooterLegal />
        <GlobalAudioControl />
      </div>
    </div>
  );
}

