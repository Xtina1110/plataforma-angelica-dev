import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { BookOpen, Headphones, Sparkles } from 'lucide-react';
import { supabase } from '../../integrations/supabase/client';
import ThematicHeader from '../ThematicHeader';
import FooterLegal from '../FooterLegal';
import InstruccionesAngelicales from '../InstruccionesAngelicales';

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
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50">
      {/* Header Temático */}
      <ThematicHeader
        appType="blog"
        user={user}
        onNavigateHome={() => navigate('/dashboard')}
        onCartClick={() => navigate('/carrito')}
        onProfileClick={() => navigate('/perfil')}
        onLogout={handleLogout}
      />

      {/* Contenido Principal - Ajustado para respetar el sidebar */}
      <div className="px-4 md:px-8 py-8 max-w-7xl mx-auto">
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
      <div className="mt-16">
        <FooterLegal />
      </div>
    </div>
  );
};

export default InstruccionesBlogPodcast;

