import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { BookOpen, Headphones, Sparkles } from 'lucide-react';
import { supabase } from '../../integrations/supabase/client';
import ThematicHeader from '../ThematicHeader';
import FooterLegal from '../FooterLegal';
import InstruccionesAngelicales from '../InstruccionesAngelicales';
import fondoAngelico from '../../assets/FondoAngelicoDashboard.png';

const InstruccionesBlogPodcast = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  useEffect(() => {
    cargarUsuario();
  }, []);

  const cargarUsuario = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    setUser(user);
  };

  const instrucciones = [
    {
      icono: BookOpen,
      titulo: "Contenido Inspirador",
      descripcion: "Artículos y episodios que iluminan tu camino espiritual con sabiduría angelical"
    },
    {
      icono: Headphones,
      titulo: "Conexión Profunda",
      descripcion: "Escucha y lee con el corazón abierto para recibir los mensajes de los ángeles"
    },
    {
      icono: Sparkles,
      titulo: "Transformación Interior",
      descripcion: "Cada palabra y sonido está diseñado para elevar tu vibración y consciencia"
    }
  ];

  const handleContinuar = () => {
    navigate('/blog-podcast/seleccion');
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/login');
  };

  return (
    <div className="min-h-screen relative">
      {/* Fondo */}
      <div
        className="fixed inset-0 z-0"
        style={{
          backgroundImage: `url(${fondoAngelico})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center'
        }}
      />
      <div 
        className="fixed inset-0 z-0" 
        style={{
          background: 'linear-gradient(135deg, rgba(251, 191, 36, 0.3) 0%, rgba(245, 158, 11, 0.25) 50%, rgba(217, 119, 6, 0.2) 100%)'
        }}
      />

      {/* Header Temático */}
      <div className="relative z-10">
        <ThematicHeader
          appType="blog"
          user={user}
          onNavigateHome={() => navigate('/dashboard')}
          onCartClick={() => navigate('/carrito')}
          onProfileClick={() => navigate('/perfil')}
          onLogout={handleLogout}
        />
      </div>

      {/* Contenido Principal */}
      <div className="relative z-10 px-4 md:px-8 py-8 max-w-7xl mx-auto">
        <InstruccionesAngelicales
          titulo="Blog & Podcast Angelical"
          descripcion="Contenido espiritual para iluminar tu camino"
          colorPrimario="amber"
          instrucciones={instrucciones}
          llamadaAccion="Explorar Contenido"
          onAccionClick={handleContinuar}
        />
      </div>

      {/* Footer */}
      <div className="relative z-10 mt-16">
        <FooterLegal />
      </div>
    </div>
  );
};

export default InstruccionesBlogPodcast;

