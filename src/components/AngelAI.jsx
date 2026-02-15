import React, { useState, useRef, useEffect } from 'react';
import { X, Send } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

const AngelAI = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);
  const { selectedLanguage } = useLanguage();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const translations = {
    Español: {
      title: 'Angel AI',
      subtitle: 'Tu guía espiritual angelical',
      placeholder: 'Escribe tu pregunta...',
      send: 'Enviar',
      welcome: '¡Hola! Soy Angel AI, tu guía espiritual. ¿En qué puedo ayudarte hoy?'
    },
    English: {
      title: 'Angel AI',
      subtitle: 'Your angelic spiritual guide',
      placeholder: 'Type your question...',
      send: 'Send',
      welcome: 'Hello! I am Angel AI, your spiritual guide. How can I help you today?'
    },
    Français: {
      title: 'Angel AI',
      subtitle: 'Votre guide spirituel angélique',
      placeholder: 'Écrivez votre question...',
      send: 'Envoyer',
      welcome: 'Bonjour! Je suis Angel AI, votre guide spirituel. Comment puis-je vous aider aujourd\'hui?'
    },
    Italiano: {
      title: 'Angel AI',
      subtitle: 'La tua guida spirituale angelica',
      placeholder: 'Scrivi la tua domanda...',
      send: 'Invia',
      welcome: 'Ciao! Sono Angel AI, la tua guida spirituale. Come posso aiutarti oggi?'
    },
    Deutsch: {
      title: 'Angel AI',
      subtitle: 'Dein engelischer spiritueller Führer',
      placeholder: 'Schreibe deine Frage...',
      send: 'Senden',
      welcome: 'Hallo! Ich bin Angel AI, dein spiritueller Führer. Wie kann ich dir heute helfen?'
    }
  };

  const t = translations[selectedLanguage] || translations.Español;

  const handleSendMessage = async () => {
    if (!inputMessage.trim() || isLoading) return;

    const userMessage = {
      id: Date.now(),
      text: inputMessage,
      sender: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsLoading(true);

    try {
      // Simular respuesta de IA (aquí se conectaría con tu backend)
      setTimeout(() => {
        const aiMessage = {
          id: Date.now() + 1,
          text: 'Gracias por tu pregunta. Los ángeles están aquí para guiarte. ¿Podrías compartir más detalles sobre lo que necesitas?',
          sender: 'ai',
          timestamp: new Date()
        };
        setMessages(prev => [...prev, aiMessage]);
        setIsLoading(false);
      }, 1500);
    } catch (error) {
      console.error('Error sending message:', error);
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  useEffect(() => {
    if (isOpen && messages.length === 0) {
      setMessages([{
        id: Date.now(),
        text: t.welcome,
        sender: 'ai',
        timestamp: new Date()
      }]);
    }
  }, [isOpen]);

  return (
    <>
      {/* Botón flotante */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-28 sm:bottom-32 right-4 sm:right-6 z-[9999] transition-all duration-300 hover:scale-110 group"
        aria-label="Abrir Angel AI Chat"
      >
        <div className="relative">
          {/* Glow effect */}
          <div className="absolute inset-0 bg-purple-500/30 rounded-full blur-xl animate-pulse"></div>
          
          {/* Botón principal */}
          <div className="relative w-16 h-16 sm:w-20 sm:h-20 rounded-full overflow-hidden shadow-2xl border-4 border-purple-300 group-hover:border-yellow-300 transition-all duration-300">
            <img
              src="https://files.manuscdn.com/user_upload_by_module/session_file/310419663030799991/IImtXCcgXrVDibYU.png"
              alt="Angel AI"
              className="w-full h-full object-cover"
            />
          </div>
          
          {/* Badge de notificación (opcional) */}
          <div className="absolute -top-1 -right-1 w-5 h-5 bg-gradient-to-r from-yellow-400 to-yellow-500 rounded-full border-2 border-white flex items-center justify-center">
            <span className="text-white text-xs font-bold">✨</span>
          </div>
        </div>
      </button>

      {/* Ventana de chat */}
      {isOpen && (
        <div className="fixed bottom-48 sm:bottom-56 right-4 sm:right-6 w-[calc(100vw-2rem)] sm:w-96 h-[500px] bg-white rounded-2xl shadow-2xl z-[9999] flex flex-col overflow-hidden border-2 border-purple-300">
          {/* Header */}
          <div className="bg-gradient-to-r from-purple-600 via-purple-700 to-purple-800 text-white p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-white/50">
                <img
                  src="https://files.manuscdn.com/user_upload_by_module/session_file/310419663030799991/IImtXCcgXrVDibYU.png"
                  alt="Angel AI"
                  className="w-full h-full object-cover"
                />
              </div>
              <div>
                <h3 className="font-bold text-lg">{t.title}</h3>
                <p className="text-xs text-purple-200">{t.subtitle}</p>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="text-white hover:text-purple-200 transition-colors p-1 hover:bg-white/10 rounded-full"
            >
              <X size={24} />
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gradient-to-b from-purple-50 to-white">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[80%] rounded-2xl px-4 py-2 ${
                    msg.sender === 'user'
                      ? 'bg-gradient-to-r from-purple-600 to-purple-700 text-white'
                      : 'bg-white text-gray-800 border border-purple-200 shadow-sm'
                  }`}
                >
                  <p className="text-sm whitespace-pre-wrap">{msg.text}</p>
                  <span className={`text-xs mt-1 block ${
                    msg.sender === 'user' ? 'text-purple-200' : 'text-gray-400'
                  }`}>
                    {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-white border border-purple-200 rounded-2xl px-4 py-2 shadow-sm">
                  <div className="flex space-x-2">
                    <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                    <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="p-4 bg-white border-t border-purple-200">
            <div className="flex gap-2">
              <input
                type="text"
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder={t.placeholder}
                className="flex-1 px-4 py-2 border border-purple-300 rounded-full focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                disabled={isLoading}
              />
              <button
                onClick={handleSendMessage}
                disabled={!inputMessage.trim() || isLoading}
                className="bg-gradient-to-r from-purple-600 to-purple-700 text-white p-2 rounded-full hover:from-purple-700 hover:to-purple-800 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed hover:scale-105 shadow-lg"
              >
                <Send size={20} />
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default AngelAI;
