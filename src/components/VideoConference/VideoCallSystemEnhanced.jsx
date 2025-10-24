import React, { useState, useEffect, useRef } from 'react';
import { 
  Video, VideoOff, Mic, MicOff, PhoneOff, MessageSquare, 
  Globe, Send, Download, Users, Clock, DollarSign
} from 'lucide-react';
import { useWebRTC } from '../../hooks/useWebRTC';

const VideoCallSystemEnhanced = ({ sessionId, consultantName, clientName }) => {
  // Estados de la llamada
  const [isCallActive, setIsCallActive] = useState(false);
  const [isCameraOn, setIsCameraOn] = useState(true);
  const [isMicOn, setIsMicOn] = useState(true);
  const [duration, setDuration] = useState(0);
  
  // Estados de traducción
  const [translationEnabled, setTranslationEnabled] = useState(false);
  const [sourceLanguage, setSourceLanguage] = useState('es');
  const [targetLanguage, setTargetLanguage] = useState('en');
  const [subtitles, setSubtitles] = useState('');
  
  // Estados de chat
  const [showChat, setShowChat] = useState(false);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  
  // Estados de transcripción
  const [transcript, setTranscript] = useState([]);
  const [isRecording, setIsRecording] = useState(false);
  
  // WebRTC
  const { 
    isConnected,
    localStream,
    remoteStream,
    startCall, 
    endCall, 
    toggleCamera, 
    toggleMic, 
    localVideoRef,
    remoteVideoRef
  } = useWebRTC();

  // Timer de duración
  useEffect(() => {
    let interval;
    if (isCallActive) {
      interval = setInterval(() => {
        setDuration(prev => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isCallActive]);

  // Formatear duración
  const formatDuration = (seconds) => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hrs.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Iniciar llamada
  const handleStartCall = async () => {
    try {
      await startCall();
      setIsCallActive(true);
      setIsRecording(true);
    } catch (error) {
      console.error('Error starting call:', error);
      alert('Error al iniciar la llamada. Verifica los permisos de cámara y micrófono.');
    }
  };

  // Finalizar llamada
  const handleEndCall = async () => {
    endCall();
    setIsCallActive(false);
    setIsRecording(false);
    
    // Generar PDF con transcripción
    if (transcript.length > 0) {
      await generateSessionPDF();
    }
  };

  // Toggle cámara
  const handleToggleCamera = () => {
    toggleCamera();
    setIsCameraOn(!isCameraOn);
  };

  // Toggle micrófono
  const handleToggleMic = () => {
    toggleMic();
    setIsMicOn(!isMicOn);
  };

  // Enviar mensaje de chat
  const handleSendMessage = async () => {
    if (!newMessage.trim()) return;

    const message = {
      id: Date.now(),
      sender: 'client', // o 'consultant'
      text: newMessage,
      timestamp: new Date().toISOString(),
      translated: null
    };

    // Si la traducción está habilitada, traducir el mensaje
    if (translationEnabled) {
      try {
        const response = await fetch('/api/translate-spiritual', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            text: newMessage,
            sourceLang: sourceLanguage,
            targetLang: targetLanguage,
            context: 'angelical'
          })
        });
        
        const data = await response.json();
        message.translated = data.translatedText;
      } catch (error) {
        console.error('Translation error:', error);
      }
    }

    setMessages([...messages, message]);
    setNewMessage('');
  };

  // Generar PDF de la sesión
  const generateSessionPDF = async () => {
    try {
      const response = await fetch('/api/generate-session-pdf', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sessionId,
          consultantName,
          clientName,
          duration: formatDuration(duration),
          transcript,
          messages,
          date: new Date().toISOString()
        })
      });

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `Sesion-Angelical-${sessionId}.pdf`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error('Error generating PDF:', error);
    }
  };

  // Idiomas disponibles
  const languages = [
    { code: 'es', name: 'Español', flag: '🇪🇸' },
    { code: 'en', name: 'English', flag: '🇺🇸' },
    { code: 'fr', name: 'Français', flag: '🇫🇷' },
    { code: 'it', name: 'Italiano', flag: '🇮🇹' },
    { code: 'pt', name: 'Português', flag: '🇧🇷' },
    { code: 'de', name: 'Deutsch', flag: '🇩🇪' },
    { code: 'zh', name: '中文', flag: '🇨🇳' },
    { code: 'ja', name: '日本語', flag: '🇯🇵' },
    { code: 'ko', name: '한국어', flag: '🇰🇷' },
    { code: 'ar', name: 'العربية', flag: '🇸🇦' }
  ];

  return (
    <div className="w-full h-screen bg-gradient-to-br from-purple-50 to-blue-50 flex flex-col">
      {/* Header */}
      <div className="bg-white shadow-md px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <Users className="text-purple-600" size={24} />
            <div>
              <h2 className="font-bold text-gray-900">Consulta Angélica en Vivo</h2>
              <p className="text-sm text-gray-600">{consultantName} • {clientName}</p>
            </div>
          </div>
        </div>
        
        <div className="flex items-center gap-6">
          {/* Timer */}
          {isCallActive && (
            <div className="flex items-center gap-2 bg-red-50 px-4 py-2 rounded-full">
              <Clock className="text-red-600" size={20} />
              <span className="font-mono text-red-600 font-bold">{formatDuration(duration)}</span>
            </div>
          )}
          
          {/* Translation Toggle */}
          <button
            onClick={() => setTranslationEnabled(!translationEnabled)}
            className={`flex items-center gap-2 px-4 py-2 rounded-full transition-all ${
              translationEnabled 
                ? 'bg-green-100 text-green-700 border-2 border-green-300' 
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            <Globe size={20} />
            <span className="text-sm font-medium">
              {translationEnabled ? 'Traducción ON' : 'Traducción OFF'}
            </span>
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex gap-4 p-4">
        {/* Video Area */}
        <div className="flex-1 flex flex-col gap-4">
          {/* Remote Video (Consultant) */}
          <div className="flex-1 bg-gray-900 rounded-2xl overflow-hidden relative shadow-2xl">
            {remoteStream ? (
              <video
                ref={remoteVideoRef}
                autoPlay
                playsInline
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <div className="text-center text-white">
                  <div className="w-24 h-24 mx-auto mb-4 bg-purple-600 rounded-full flex items-center justify-center">
                    <Users size={48} />
                  </div>
                  <p className="text-lg">Esperando al consultor...</p>
                </div>
              </div>
            )}
            
            {/* Subtitles */}
            {translationEnabled && subtitles && (
              <div className="absolute bottom-4 left-4 right-4 bg-black/80 text-white px-6 py-3 rounded-xl">
                <p className="text-center text-lg">{subtitles}</p>
              </div>
            )}
            
            <div className="absolute top-4 left-4 bg-black/60 text-white px-3 py-1 rounded-full text-sm">
              {consultantName}
            </div>
          </div>

          {/* Local Video (You) */}
          <div className="h-48 bg-gray-800 rounded-2xl overflow-hidden relative shadow-xl">
            {localStream && isCameraOn ? (
              <video
                ref={localVideoRef}
                autoPlay
                muted
                playsInline
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <div className="text-center text-white">
                  <VideoOff size={32} className="mx-auto mb-2" />
                  <p className="text-sm">Cámara desactivada</p>
                </div>
              </div>
            )}
            <div className="absolute bottom-2 left-2 bg-black/60 text-white px-2 py-1 rounded-full text-xs">
              Tú
            </div>
          </div>
        </div>

        {/* Chat Sidebar */}
        {showChat && (
          <div className="w-96 bg-white rounded-2xl shadow-xl flex flex-col">
            {/* Chat Header */}
            <div className="px-4 py-3 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-gray-900">Chat</h3>
                <button
                  onClick={() => setShowChat(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  ✕
                </button>
              </div>
              
              {/* Language Selector */}
              {translationEnabled && (
                <div className="mt-3 grid grid-cols-2 gap-2">
                  <select
                    value={sourceLanguage}
                    onChange={(e) => setSourceLanguage(e.target.value)}
                    className="px-3 py-2 border border-gray-300 rounded-lg text-sm"
                  >
                    {languages.map(lang => (
                      <option key={lang.code} value={lang.code}>
                        {lang.flag} {lang.name}
                      </option>
                    ))}
                  </select>
                  <select
                    value={targetLanguage}
                    onChange={(e) => setTargetLanguage(e.target.value)}
                    className="px-3 py-2 border border-gray-300 rounded-lg text-sm"
                  >
                    {languages.map(lang => (
                      <option key={lang.code} value={lang.code}>
                        {lang.flag} {lang.name}
                      </option>
                    ))}
                  </select>
                </div>
              )}
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {messages.map(msg => (
                <div
                  key={msg.id}
                  className={`flex ${msg.sender === 'client' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[80%] rounded-2xl px-4 py-2 ${
                      msg.sender === 'client'
                        ? 'bg-purple-600 text-white'
                        : 'bg-gray-100 text-gray-900'
                    }`}
                  >
                    <p className="text-sm">{msg.text}</p>
                    {msg.translated && (
                      <p className="text-xs mt-1 opacity-80 italic">
                        {msg.translated}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Input */}
            <div className="p-4 border-t border-gray-200">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                  placeholder="Escribe un mensaje..."
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-full focus:outline-none focus:border-purple-500"
                />
                <button
                  onClick={handleSendMessage}
                  className="bg-purple-600 text-white p-2 rounded-full hover:bg-purple-700 transition-colors"
                >
                  <Send size={20} />
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Controls */}
      <div className="bg-white shadow-lg px-6 py-4">
        <div className="flex items-center justify-center gap-4">
          {/* Camera */}
          <button
            onClick={handleToggleCamera}
            className={`p-4 rounded-full transition-all ${
              isCameraOn
                ? 'bg-gray-200 hover:bg-gray-300 text-gray-700'
                : 'bg-red-500 hover:bg-red-600 text-white'
            }`}
          >
            {isCameraOn ? <Video size={24} /> : <VideoOff size={24} />}
          </button>

          {/* Microphone */}
          <button
            onClick={handleToggleMic}
            className={`p-4 rounded-full transition-all ${
              isMicOn
                ? 'bg-gray-200 hover:bg-gray-300 text-gray-700'
                : 'bg-red-500 hover:bg-red-600 text-white'
            }`}
          >
            {isMicOn ? <Mic size={24} /> : <MicOff size={24} />}
          </button>

          {/* Chat */}
          <button
            onClick={() => setShowChat(!showChat)}
            className="p-4 rounded-full bg-gray-200 hover:bg-gray-300 text-gray-700 transition-all relative"
          >
            <MessageSquare size={24} />
            {messages.length > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">
                {messages.length}
              </span>
            )}
          </button>

          {/* End Call / Start Call */}
          {!isCallActive ? (
            <button
              onClick={handleStartCall}
              className="px-8 py-4 bg-green-600 hover:bg-green-700 text-white rounded-full font-semibold transition-all shadow-lg"
            >
              Iniciar Llamada
            </button>
          ) : (
            <button
              onClick={handleEndCall}
              className="px-8 py-4 bg-red-600 hover:bg-red-700 text-white rounded-full font-semibold transition-all shadow-lg flex items-center gap-2"
            >
              <PhoneOff size={20} />
              Finalizar
            </button>
          )}

          {/* Download PDF */}
          {transcript.length > 0 && (
            <button
              onClick={generateSessionPDF}
              className="p-4 rounded-full bg-purple-600 hover:bg-purple-700 text-white transition-all"
              title="Descargar PDF de la sesión"
            >
              <Download size={24} />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default VideoCallSystemEnhanced;

