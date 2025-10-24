import React, { useState, useEffect, useRef } from 'react';
import { 
  MessageCircle, Send, Mic, Volume2, VolumeX, X, 
  Sparkles, Heart, Star, Loader2, User, Bot,
  Calendar, BookOpen, Video, Gift, ChevronDown
} from 'lucide-react';

const AngelicChatbot = ({ user, onClose, isFloating = false }) => {
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [selectedAngel, setSelectedAngel] = useState('angela');
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [showAngelSelector, setShowAngelSelector] = useState(false);
  const messagesEndRef = useRef(null);
  const chatContainerRef = useRef(null);

  // Personalidades angelicales
  const angels = [
    {
      id: 'angela',
      name: 'Ángela',
      role: 'Guía Espiritual General',
      color: 'purple',
      icon: '👼',
      description: 'Tu guía principal para todas las consultas espirituales',
      personality: 'Cálida, sabia y compasiva'
    },
    {
      id: 'miguel',
      name: 'Arcángel Miguel',
      role: 'Protección y Fortaleza',
      color: 'blue',
      icon: '⚔️',
      description: 'Especialista en protección, coraje y superación de miedos',
      personality: 'Fuerte, protector y motivador'
    },
    {
      id: 'rafael',
      name: 'Arcángel Rafael',
      role: 'Sanación y Bienestar',
      color: 'green',
      icon: '💚',
      description: 'Experto en sanación física, emocional y espiritual',
      personality: 'Sanador, gentil y reconfortante'
    },
    {
      id: 'gabriel',
      name: 'Arcángel Gabriel',
      role: 'Comunicación y Creatividad',
      color: 'orange',
      icon: '📯',
      description: 'Ayuda con comunicación, creatividad y nuevos comienzos',
      personality: 'Inspirador, claro y creativo'
    },
    {
      id: 'uriel',
      name: 'Arcángel Uriel',
      role: 'Sabiduría e Iluminación',
      color: 'yellow',
      icon: '💡',
      description: 'Guía en sabiduría, conocimiento y toma de decisiones',
      personality: 'Sabio, analítico y esclarecedor'
    }
  ];

  const currentAngel = angels.find(a => a.id === selectedAngel);

  // Mensaje de bienvenida
  useEffect(() => {
    if (messages.length === 0) {
      const welcomeMessage = {
        id: Date.now(),
        type: 'bot',
        content: `✨ ¡Bendiciones, ${user?.email?.split('@')[0] || 'alma hermosa'}! Soy ${currentAngel.name}, ${currentAngel.role}. 

Estoy aquí para guiarte en tu camino espiritual. Puedo ayudarte con:

🌟 Orientación espiritual personalizada
📚 Recomendaciones de cursos y terapias
📅 Agendar consultas y sesiones
🔮 Interpretación de cartas angelicales
🧘 Guiar meditaciones
💫 Mensajes angelicales específicos

¿En qué puedo iluminarte hoy?`,
        angel: currentAngel.id,
        timestamp: new Date()
      };
      setMessages([welcomeMessage]);
    }
  }, [selectedAngel]);

  // Auto-scroll al último mensaje
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Enviar mensaje
  const handleSendMessage = async () => {
    if (!inputMessage.trim() || isLoading) return;

    const userMessage = {
      id: Date.now(),
      type: 'user',
      content: inputMessage,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsLoading(true);

    try {
      // Llamar a la API de OpenAI
      const response = await fetch('/api/angelic-chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: inputMessage,
          angel: selectedAngel,
          history: messages.slice(-10), // Últimos 10 mensajes para contexto
          userId: user?.id
        })
      });

      const data = await response.json();

      const botMessage = {
        id: Date.now() + 1,
        type: 'bot',
        content: data.response,
        angel: selectedAngel,
        timestamp: new Date(),
        actions: data.actions // Acciones sugeridas (agendar, ver curso, etc.)
      };

      setMessages(prev => [...prev, botMessage]);

      // Si hay voz habilitada, reproducir respuesta
      if (isSpeaking && data.audio) {
        playAudio(data.audio);
      }

    } catch (error) {
      console.error('Error al enviar mensaje:', error);
      const errorMessage = {
        id: Date.now() + 1,
        type: 'bot',
        content: '🙏 Disculpa, estoy teniendo dificultades para conectar con la energía divina. Por favor, intenta nuevamente en un momento.',
        angel: selectedAngel,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  // Reconocimiento de voz
  const handleVoiceInput = () => {
    if (!('webkitSpeechRecognition' in window)) {
      alert('Tu navegador no soporta reconocimiento de voz');
      return;
    }

    const recognition = new webkitSpeechRecognition();
    recognition.lang = 'es-ES';
    recognition.continuous = false;

    recognition.onstart = () => setIsListening(true);
    recognition.onend = () => setIsListening(false);

    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      setInputMessage(transcript);
    };

    recognition.start();
  };

  // Reproducir audio
  const playAudio = (audioUrl) => {
    const audio = new Audio(audioUrl);
    audio.play();
  };

  // Sugerencias rápidas
  const quickSuggestions = [
    { icon: '🌟', text: '¿Qué mensaje tienen los ángeles para mí hoy?' },
    { icon: '📚', text: '¿Qué curso me recomiendas?' },
    { icon: '🔮', text: 'Interpreta una carta angelical' },
    { icon: '🧘', text: 'Guíame en una meditación' },
    { icon: '📅', text: 'Quiero agendar una consulta' }
  ];

  // Renderizar mensaje
  const renderMessage = (message) => {
    const isBot = message.type === 'bot';
    const angel = angels.find(a => a.id === message.angel);

    return (
      <div
        key={message.id}
        className={`flex gap-3 mb-4 ${isBot ? 'justify-start' : 'justify-end'}`}
      >
        {isBot && (
          <div className={`w-10 h-10 rounded-full bg-gradient-to-br from-${angel?.color}-400 to-${angel?.color}-600 flex items-center justify-center text-xl flex-shrink-0`}>
            {angel?.icon}
          </div>
        )}
        
        <div className={`max-w-[70%] ${isBot ? '' : 'order-first'}`}>
          <div
            className={`rounded-2xl p-4 ${
              isBot
                ? 'bg-gradient-to-br from-purple-50 to-blue-50 text-gray-800'
                : 'bg-gradient-to-br from-purple-600 to-blue-600 text-white'
            }`}
          >
            <p className="whitespace-pre-wrap leading-relaxed">{message.content}</p>
            
            {/* Acciones sugeridas */}
            {message.actions && message.actions.length > 0 && (
              <div className="mt-3 flex flex-wrap gap-2">
                {message.actions.map((action, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleAction(action)}
                    className="px-3 py-1.5 bg-white/20 hover:bg-white/30 rounded-lg text-sm transition-all"
                  >
                    {action.icon} {action.label}
                  </button>
                ))}
              </div>
            )}
          </div>
          <p className="text-xs text-gray-400 mt-1 px-2">
            {message.timestamp.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })}
          </p>
        </div>

        {!isBot && (
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-gray-400 to-gray-600 flex items-center justify-center text-white flex-shrink-0">
            <User size={20} />
          </div>
        )}
      </div>
    );
  };

  // Manejar acciones
  const handleAction = (action) => {
    switch (action.type) {
      case 'schedule':
        window.location.href = '/reservas';
        break;
      case 'course':
        window.location.href = `/academia/course/${action.courseId}`;
        break;
      case 'reading':
        window.location.href = '/apertura-angelical';
        break;
      default:
        console.log('Acción:', action);
    }
  };

  return (
    <div
      className={`${
        isFloating
          ? 'fixed bottom-20 right-6 w-96 h-[600px] rounded-2xl shadow-2xl z-50'
          : 'w-full h-full'
      } bg-white flex flex-col overflow-hidden`}
      style={{
        backgroundImage: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      }}
    >
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-600 via-blue-600 to-purple-600 p-4 text-white flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className={`w-12 h-12 rounded-full bg-gradient-to-br from-${currentAngel.color}-400 to-${currentAngel.color}-600 flex items-center justify-center text-2xl`}>
              {currentAngel.icon}
            </div>
            <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-400 rounded-full border-2 border-white"></div>
          </div>
          <div>
            <h3 className="font-bold">{currentAngel.name}</h3>
            <p className="text-xs text-white/80">{currentAngel.role}</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowAngelSelector(!showAngelSelector)}
            className="p-2 hover:bg-white/20 rounded-lg transition-all"
            title="Cambiar ángel"
          >
            <ChevronDown size={20} />
          </button>
          <button
            onClick={() => setIsSpeaking(!isSpeaking)}
            className="p-2 hover:bg-white/20 rounded-lg transition-all"
            title={isSpeaking ? 'Desactivar voz' : 'Activar voz'}
          >
            {isSpeaking ? <Volume2 size={20} /> : <VolumeX size={20} />}
          </button>
          {isFloating && (
            <button
              onClick={onClose}
              className="p-2 hover:bg-white/20 rounded-lg transition-all"
            >
              <X size={20} />
            </button>
          )}
        </div>
      </div>

      {/* Selector de ángeles */}
      {showAngelSelector && (
        <div className="bg-white border-b border-gray-200 p-4 max-h-48 overflow-y-auto">
          <p className="text-sm font-semibold text-gray-700 mb-3">Elige tu guía angelical:</p>
          <div className="grid grid-cols-1 gap-2">
            {angels.map(angel => (
              <button
                key={angel.id}
                onClick={() => {
                  setSelectedAngel(angel.id);
                  setShowAngelSelector(false);
                }}
                className={`flex items-center gap-3 p-3 rounded-xl transition-all ${
                  selectedAngel === angel.id
                    ? 'bg-purple-100 border-2 border-purple-500'
                    : 'bg-gray-50 hover:bg-gray-100 border-2 border-transparent'
                }`}
              >
                <span className="text-2xl">{angel.icon}</span>
                <div className="text-left flex-1">
                  <p className="font-semibold text-sm text-gray-800">{angel.name}</p>
                  <p className="text-xs text-gray-600">{angel.role}</p>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Mensajes */}
      <div
        ref={chatContainerRef}
        className="flex-1 overflow-y-auto p-4 bg-white"
        style={{
          backgroundImage: 'radial-gradient(circle at 20% 50%, rgba(147, 51, 234, 0.05) 0%, transparent 50%), radial-gradient(circle at 80% 80%, rgba(59, 130, 246, 0.05) 0%, transparent 50%)'
        }}
      >
        {messages.map(renderMessage)}
        
        {isLoading && (
          <div className="flex justify-start gap-3 mb-4">
            <div className={`w-10 h-10 rounded-full bg-gradient-to-br from-${currentAngel.color}-400 to-${currentAngel.color}-600 flex items-center justify-center text-xl`}>
              {currentAngel.icon}
            </div>
            <div className="bg-gradient-to-br from-purple-50 to-blue-50 rounded-2xl p-4">
              <div className="flex gap-2">
                <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
              </div>
            </div>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>

      {/* Sugerencias rápidas */}
      {messages.length === 1 && (
        <div className="px-4 py-2 bg-gradient-to-r from-purple-50 to-blue-50 border-t border-gray-200">
          <p className="text-xs font-semibold text-gray-600 mb-2">Sugerencias:</p>
          <div className="flex gap-2 overflow-x-auto pb-2">
            {quickSuggestions.map((suggestion, idx) => (
              <button
                key={idx}
                onClick={() => setInputMessage(suggestion.text)}
                className="flex-shrink-0 px-3 py-2 bg-white hover:bg-purple-50 rounded-xl text-xs text-gray-700 border border-gray-200 hover:border-purple-300 transition-all"
              >
                {suggestion.icon} {suggestion.text}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Input */}
      <div className="p-4 bg-white border-t border-gray-200">
        <div className="flex gap-2">
          <button
            onClick={handleVoiceInput}
            disabled={isListening}
            className={`p-3 rounded-xl transition-all ${
              isListening
                ? 'bg-red-500 text-white animate-pulse'
                : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
            }`}
            title="Usar voz"
          >
            <Mic size={20} />
          </button>
          
          <input
            type="text"
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
            placeholder="Escribe tu mensaje..."
            className="flex-1 px-4 py-3 rounded-xl border border-gray-300 focus:border-purple-500 focus:ring-2 focus:ring-purple-200 outline-none transition-all"
            disabled={isLoading}
          />
          
          <button
            onClick={handleSendMessage}
            disabled={!inputMessage.trim() || isLoading}
            className="px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white rounded-xl font-semibold transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            {isLoading ? <Loader2 size={20} className="animate-spin" /> : <Send size={20} />}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AngelicChatbot;

