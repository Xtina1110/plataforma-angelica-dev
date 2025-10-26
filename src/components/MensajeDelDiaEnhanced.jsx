import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  MessageCircle, Sparkles, Heart, Star, Calendar,
  ArrowLeft, MessageSquare
} from 'lucide-react';
// MensajeHeader removed - now handled by Dashboard
import AngelicChatbot from './AngelicChatbot';
import './Dashboard.css';

const MensajeDelDiaEnhanced = ({ user, onLogout }) => {
  const navigate = useNavigate();
  const [showChatbot, setShowChatbot] = useState(false);
  const [activeTab, setActiveTab] = useState('mensaje'); // 'mensaje' o 'chat'

  // Sistema de mensajes diarios con rotación automática
  const mensajesAngelicales = [
    { 
      mensaje: "Tu luz interior brilla más fuerte cada día. Los ángeles amplifican tu radiancia espiritual.", 
      arcangel: "Arcángel Miguel", 
      energia: "Protección y Fuerza",
      icon: "⚔️",
      color: "blue"
    },
    { 
      mensaje: "Encuentra la belleza en cada momento. Los ángeles te invitan a celebrar la alegría que existe en tu vida.", 
      arcangel: "Arcángel Gabriel", 
      energia: "Comunicación Divina",
      icon: "📯",
      color: "orange"
    },
    { 
      mensaje: "La sanación fluye a través de ti como un río de luz dorada. Permite que tu corazón se abra a nuevas posibilidades.", 
      arcangel: "Arcángel Rafael", 
      energia: "Sanación y Renovación",
      icon: "💚",
      color: "green"
    },
    { 
      mensaje: "Tu sabiduría interior es un faro que guía a otros hacia la luz. Confía en tu intuición angelical.", 
      arcangel: "Arcángel Uriel", 
      energia: "Sabiduría y Claridad",
      icon: "💡",
      color: "yellow"
    },
    { 
      mensaje: "El amor incondicional fluye desde tu corazón hacia todo lo que te rodea. Eres un canal de amor divino.", 
      arcangel: "Arcángel Chamuel", 
      energia: "Amor Incondicional",
      icon: "💖",
      color: "pink"
    },
    { 
      mensaje: "La creatividad divina se manifiesta a través de tus acciones. Cada paso que das crea belleza en el mundo.", 
      arcangel: "Arcángel Jofiel", 
      energia: "Belleza y Creatividad",
      icon: "🎨",
      color: "purple"
    },
    { 
      mensaje: "La justicia divina trabaja a tu favor. Confía en que el universo conspira para tu mayor bien.", 
      arcangel: "Arcángel Raguel", 
      energia: "Justicia Divina",
      icon: "⚖️",
      color: "indigo"
    }
  ];

  const obtenerMensajeDelDia = () => {
    const hoy = new Date();
    const inicioAño = new Date(hoy.getFullYear(), 0, 1);
    const diaDelAño = Math.floor((hoy - inicioAño) / (24 * 60 * 60 * 1000));
    const indice = diaDelAño % mensajesAngelicales.length;
    return mensajesAngelicales[indice];
  };

  const mensajeHoy = obtenerMensajeDelDia();
  const fechaHoy = new Date().toLocaleDateString('es-ES', { 
    weekday: 'long', 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-pink-50">
      {/* MensajeHeader removed - now rendered by Dashboard */}

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Tabs */}
        <div className="flex gap-4 mb-8">
          <button
            onClick={() => setActiveTab('mensaje')}
            className={`flex items-center gap-2 px-6 py-3 rounded-xl font-semibold transition-all ${
              activeTab === 'mensaje'
                ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white shadow-lg'
                : 'bg-white text-gray-600 hover:bg-gray-50'
            }`}
          >
            <Sparkles size={20} />
            Mensaje del Día
          </button>
          <button
            onClick={() => setActiveTab('chat')}
            className={`flex items-center gap-2 px-6 py-3 rounded-xl font-semibold transition-all ${
              activeTab === 'chat'
                ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white shadow-lg'
                : 'bg-white text-gray-600 hover:bg-gray-50'
            }`}
          >
            <MessageCircle size={20} />
            Chat Angelical
            <span className="bg-green-400 text-white text-xs px-2 py-0.5 rounded-full">Nuevo</span>
          </button>
        </div>

        {/* Contenido */}
        {activeTab === 'mensaje' ? (
          <div className="space-y-6">
            {/* Mensaje del Día */}
            <div className="bg-white rounded-3xl shadow-2xl overflow-hidden">
              {/* Header del mensaje */}
              <div className={`bg-gradient-to-r from-${mensajeHoy.color}-500 to-${mensajeHoy.color}-600 p-8 text-white`}>
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center text-4xl">
                    {mensajeHoy.icon}
                  </div>
                  <div>
                    <h2 className="text-3xl font-bold">{mensajeHoy.arcangel}</h2>
                    <p className="text-white/90">{mensajeHoy.energia}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 text-white/80">
                  <Calendar size={16} />
                  <p className="text-sm capitalize">{fechaHoy}</p>
                </div>
              </div>

              {/* Mensaje */}
              <div className="p-8">
                <div className="relative">
                  <div className="absolute -left-4 -top-4 text-6xl text-purple-200">"</div>
                  <p className="text-2xl text-gray-700 leading-relaxed pl-8 pr-8 italic">
                    {mensajeHoy.mensaje}
                  </p>
                  <div className="absolute -right-4 -bottom-4 text-6xl text-purple-200">"</div>
                </div>

                {/* Acciones */}
                <div className="mt-8 flex flex-wrap gap-4">
                  <button
                    onClick={() => setActiveTab('chat')}
                    className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-xl font-semibold hover:shadow-lg transition-all"
                  >
                    <MessageCircle size={20} />
                    Hablar con {mensajeHoy.arcangel}
                  </button>
                  <button
                    onClick={() => navigate('/apertura-angelical')}
                    className="flex items-center gap-2 px-6 py-3 bg-white border-2 border-purple-300 text-purple-600 rounded-xl font-semibold hover:bg-purple-50 transition-all"
                  >
                    <Star size={20} />
                    Lectura de Cartas
                  </button>
                  <button
                    onClick={() => navigate('/reservas')}
                    className="flex items-center gap-2 px-6 py-3 bg-white border-2 border-blue-300 text-blue-600 rounded-xl font-semibold hover:bg-blue-50 transition-all"
                  >
                    <Calendar size={20} />
                    Agendar Consulta
                  </button>
                </div>
              </div>
            </div>

            {/* Todos los mensajes */}
            <div className="bg-white rounded-3xl shadow-lg p-8">
              <h3 className="text-2xl font-bold text-gray-800 mb-6">Mensajes de los Arcángeles</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {mensajesAngelicales.map((msg, idx) => (
                  <div
                    key={idx}
                    className={`p-6 rounded-2xl border-2 transition-all cursor-pointer hover:shadow-lg ${
                      msg.arcangel === mensajeHoy.arcangel
                        ? `border-${msg.color}-500 bg-${msg.color}-50`
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="flex items-center gap-3 mb-3">
                      <span className="text-3xl">{msg.icon}</span>
                      <div>
                        <h4 className="font-bold text-gray-800">{msg.arcangel}</h4>
                        <p className="text-sm text-gray-600">{msg.energia}</p>
                      </div>
                    </div>
                    <p className="text-gray-700 text-sm leading-relaxed">{msg.mensaje}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ) : (
          /* Chatbot Angelical */
          <div className="bg-white rounded-3xl shadow-2xl overflow-hidden" style={{ height: '700px' }}>
            <AngelicChatbot user={user} onClose={() => setActiveTab('mensaje')} />
          </div>
        )}
      </div>
    </div>
  );
};

export default MensajeDelDiaEnhanced;

