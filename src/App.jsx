// 📁 src/App.jsx
import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { supabase } from './supabase';
import { LanguageProvider } from './contexts/LanguageContext';
import { AudioProvider } from './contexts/AudioContext';
import { ThemeProvider } from './contexts/ThemeContext';

// Componentes principales
import PantallaCarga from './components/PantallaCarga';
import PantallaInicio from './components/PantallaInicio';
import Login from './components/Login';
import LoginOptimized from './components/LoginOptimized';
import LoginEnhanced from './components/LoginEnhanced';
import DashboardRedirect from './components/DashboardRedirect';
import Registro from './components/Registro';
import RegistroMultiStep from './components/RegistroMultiStep';
import RegistroExitoso from './components/RegistroExitoso';
import ConfigurarPago from './components/ConfigurarPago';
import EmailVerified from './components/EmailVerified';
import ResetPassword from './components/ResetPassword';
import Dashboard from './components/Dashboard';
// import DashboardPremium from './components/DashboardPremium';
import DashboardAdmin from './components/DashboardAdmin';
import DashboardTecnico from './components/DashboardTecnico';
import Terminos from './components/Terminos';
import PoliticaPrivacidad from './components/PoliticaPrivacidad';
import Contacto from './components/Contacto';
import EnConstruccion from './components/EnConstruccion';
import MensajeDelDiaPage from './components/MensajeDelDiaPage';
import ScrollIndicator from './components/ScrollIndicator';
import MainLayout from './components/MainLayout';
import BookingSystem from './components/BookingSystem/BookingSystem';
import ConsultasOnlineVivo from './components/OnlineConsultation/ConsultasOnlineVivo';

// Importar componentes principales de aplicaciones
import TiradaAngelical from './components/TiradaAngelical';
import CanalizacionesSonoterapia from './components/CanalizacionesSonoterapia';
import TerapiasLimpiezas from './components/TerapiasLimpiezas';
import AcademiaAngelical from './components/AcademiaAngelical';
import EventosModernos from './components/EventosModernos';
import TiendaAngelical from './components/TiendaAngelical';

// Componentes PodcastYBlog
import PodcastYBlog from './components/PodcastYBlog/PodcastYBlog';
import PodcastYBlogDashboard from './components/PodcastYBlog/PodcastYBlogDashboard';
import Episodios from './components/PodcastYBlog/Episodios';
import EpisodioDetalle from './components/PodcastYBlog/EpisodioDetalle';
import Blog from './components/PodcastYBlog/Blog';
import BlogDetalle from './components/PodcastYBlog/BlogDetalle';

import './App.css';

// Analytics
import analytics from './utils/analytics';
import AnalyticsTracker from './components/AnalyticsTracker';

function App() {
  const [user, setUser] = useState(null);
  const [rol, setRol] = useState('');

  useEffect(() => {
    const getUserSession = async () => {
      const { data } = await supabase.auth.getSession();
      const currentUser = data?.session?.user;
      console.log('App.jsx - Current user from session:', currentUser);
      console.log('App.jsx - User email:', currentUser?.email);
      console.log('App.jsx - User metadata:', currentUser?.user_metadata);
      setUser(currentUser);

      if (currentUser) {
        const { data: perfil, error } = await supabase
          .from('usuarios')
          .select('rol')
          .eq('id', currentUser.id)
          .single();

        console.log('App.jsx - User perfil:', perfil);
        if (!error && perfil?.rol) setRol(perfil.rol);
      }
    };

    getUserSession();

    // Listener para cambios en la autenticación
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      console.log('App.jsx - Auth state changed, event:', _event);
      const currentUser = session?.user;
      console.log('App.jsx - New user from auth change:', currentUser);
      setUser(currentUser);

      if (currentUser) {
        supabase
          .from('usuarios')
          .select('rol')
          .eq('id', currentUser.id)
          .single()
          .then(({ data: perfil, error }) => {
            if (!error && perfil?.rol) setRol(perfil.rol);
          });
      } else {
        setRol('');
      }
    });

    return () => {
      subscription?.unsubscribe();
    };
  }, []);

  const handleLogin = (userData) => {
    setUser(userData);
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setRol('');
  };

  const RedireccionDashboard = () => {
    if (rol === 'admin') return <Navigate to="/dashboard-admin" replace />;
    if (rol === 'tecnico') return <Navigate to="/dashboard-tecnico" replace />;
    return <Navigate to="/dashboard" replace />;
  };

  return (
    <ThemeProvider>
      <LanguageProvider>
        <AudioProvider>
          <Router>
            <AnalyticsTracker />
            <div className="App">
              <ScrollIndicator />
              <Routes>
              {/* Rutas públicas sin sidebar */}
              <Route path="/" element={<PantallaCarga />} />
              <Route path="/inicio" element={<PantallaInicio />} />
              <Route path="/login" element={<LoginEnhanced onLogin={handleLogin} />} />
              <Route path="/registro" element={<RegistroMultiStep />} />
              <Route path="/registro-exitoso" element={<RegistroExitoso />} />
              <Route path="/configurar-pago" element={<ConfigurarPago />} />
              <Route path="/email-verified" element={<EmailVerified />} />
              <Route path="/reset-password" element={<ResetPassword />} />

            {/* Rutas con sidebar */}
            <Route path="/dashboard-redirect" element={<DashboardRedirect />} />
            <Route path="/dashboard" element={<Dashboard user={user} onLogout={handleLogout} />} />
            <Route path="/dashboard-admin" element={<MainLayout><DashboardAdmin /></MainLayout>} />
            <Route path="/dashboard-tecnico" element={<MainLayout><DashboardTecnico /></MainLayout>} />
            <Route path="/mensaje-del-dia" element={<MainLayout><Dashboard initialSection="mensaje" /></MainLayout>} />
            <Route path="/reservas" element={<MainLayout><BookingSystem onBack={() => window.history.back()} user={user} onLogout={handleLogout} mode="general" /></MainLayout>} />
            <Route path="/consulta-online" element={<MainLayout><ConsultasOnlineVivo user={user} onLogout={handleLogout} /></MainLayout>} />
            
            {/* Rutas principales de aplicaciones */}
            <Route path="/apertura-angelica" element={<MainLayout><TiradaAngelical onVolver={() => window.history.back()} /></MainLayout>} />
            <Route path="/sonoterapia" element={<MainLayout><CanalizacionesSonoterapia onVolver={() => window.history.back()} /></MainLayout>} />
            <Route path="/terapias" element={<MainLayout><TerapiasLimpiezas onVolver={() => window.history.back()} /></MainLayout>} />
            <Route path="/academia" element={<MainLayout><AcademiaAngelical /></MainLayout>} />
            <Route path="/eventos" element={<MainLayout><Dashboard initialSection="eventos" /></MainLayout>} />
            <Route path="/tienda" element={<MainLayout><TiendaAngelical /></MainLayout>} />

            {/* Rutas legales públicas (sin MainLayout para acceso desde páginas públicas) */}
            <Route path="/terminos" element={<Terminos />} />
            <Route path="/politica" element={<PoliticaPrivacidad />} />
            <Route path="/contacto" element={<Contacto />} />
            <Route path="/en-construccion" element={<MainLayout><EnConstruccion /></MainLayout>} />

            {/* Rutas PodcastYBlog */}
            <Route path="/podcast-blog" element={<Navigate to="/dashboard?section=blog" replace />} />
            <Route path="/podcast-blog-dashboard" element={<MainLayout><PodcastYBlogDashboard /></MainLayout>} />
            <Route path="/podcast" element={<MainLayout><Episodios /></MainLayout>} />
            <Route path="/podcast/episodio/:id" element={<MainLayout><EpisodioDetalle /></MainLayout>} />
            <Route path="/blog" element={<MainLayout><Blog /></MainLayout>} />
            <Route path="/blog/articulo/:id" element={<MainLayout><BlogDetalle /></MainLayout>} />

            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </div>
      </Router>
        </AudioProvider>
      </LanguageProvider>
    </ThemeProvider>
  );
}

export default App;
