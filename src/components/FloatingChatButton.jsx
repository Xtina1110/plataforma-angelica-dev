import React, { useState } from 'react';
import { MessageCircle, X } from 'lucide-react';
import AngelicChatbot from './AngelicChatbot';

const FloatingChatButton = ({ user }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* Botón flotante */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 right-6 w-16 h-16 bg-gradient-to-br from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white rounded-full shadow-2xl flex items-center justify-center transition-all duration-300 hover:scale-110 z-50 group"
          title="Chat Angelical"
        >
          <MessageCircle size={28} className="group-hover:scale-110 transition-transform" />
          
          {/* Pulso animado */}
          <span className="absolute inset-0 rounded-full bg-purple-400 animate-ping opacity-75"></span>
          
          {/* Badge de "nuevo" */}
          <span className="absolute -top-2 -right-2 bg-green-400 text-white text-xs font-bold px-2 py-1 rounded-full shadow-lg">
            IA
          </span>
        </button>
      )}

      {/* Chatbot */}
      {isOpen && (
        <div className="fixed bottom-6 right-6 z-50">
          <AngelicChatbot 
            user={user} 
            onClose={() => setIsOpen(false)}
            isFloating={true}
          />
        </div>
      )}
    </>
  );
};

export default FloatingChatButton;

