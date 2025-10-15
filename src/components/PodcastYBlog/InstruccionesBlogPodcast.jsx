import React from 'react';
import { useNavigate } from 'react-router-dom';
import { BookOpen, Headphones, Sparkles } from 'lucide-react';
import InstruccionesAngelicales from '../InstruccionesAngelicales';

const InstruccionesBlogPodcast = () => {
  const navigate = useNavigate();

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

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50 p-8">
      <InstruccionesAngelicales
        titulo="Blog & Podcast Angelical"
        descripcion="Contenido espiritual para iluminar tu camino"
        colorPrimario="amber"
        instrucciones={instrucciones}
        llamadaAccion="Explorar Contenido"
        onAccionClick={handleContinuar}
      />
    </div>
  );
};

export default InstruccionesBlogPodcast;

