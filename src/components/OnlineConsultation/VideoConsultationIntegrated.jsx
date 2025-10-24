import React, { useState, useEffect, useRef } from 'react';
import { 
  Video, VideoOff, Mic, MicOff, PhoneOff, Share2, 
  MessageSquare, Clock, Languages, Download, Star,
  Settings, Volume2, VolumeX, Sparkles, Eye, Zap
} from 'lucide-react';
import { supabase } from '../../integrations/supabase/client';
import { useToast } from '../../hooks/use-toast';

const VideoConsultationIntegrated = ({ 
  sessionId, 
  bookingData,
  userRole = 'client', // 'client' o 'reader'
  onEndSession 
}) => {
  const { toast } = useToast();
  const [sessionStatus, setSessionStatus] = useState('connecting');
  const [remainingTime, setRemainingTime] = useState(bookingData?.duration * 60 || 3600);
  const [isVideoEnabled, setIsVideoEnabled] = useState(true);
  const [isAudioEnabled, setIsAudioEnabled] = useState(true);
  const [isRecording, setIsRecording] = useState(false);
  const [showChat, setShowChat] = useState(false);
  const [showTranslation, setShowTranslation] = useState(false);
  const [showCards, setShowCards] = useState(false);
  
  // Translation states
  const [isTranslationActive, setIsTranslationActive] = useState(false);
  const [sourceLanguage, setSourceLanguage] = useState('es');
  const [targetLanguage, setTargetLanguage] = useState('en');
  const [currentTranscript, setCurrentTranscript] = useState('');
  const [translatedText, setTranslatedText] = useState('');
  const [conversationHistory, setConversationHistory] = useState([]);
  const [isListening, setIsListening] = useState(false);
  
  // Chat states
  const [chatMessages, setChatMessages] = useState([]);
  const [chatInput, setChatInput] = useState('');
  
  // Cards states
  const [sharedCards, setSharedCards] = useState([]);
  
  const localVideoRef = useRef(null);
  const remoteVideoRef = useRef(null);
  const recognitionRef = useRef(null);
  const peerConnectionRef = useRef(null);
  const chatRef = useRef(null);

  const supportedLanguages = [
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

  // Initialize video session
  useEffect(() => {
    initializeSession();
    return () => {
      cleanup();
    };
  }, []);

  // Session timer
  useEffect(() => {
    if (sessionStatus === 'active' && remainingTime > 0) {
      const timer = setInterval(() => {
        setRemainingTime(prev => {
          if (prev <= 300 && prev > 295) {
            showTimeWarning(5);
          }
          if (prev <= 60 && prev > 55) {
            showTimeWarning(1);
          }
          if (prev <= 0) {
            handleSessionEnd();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      
      return () => clearInterval(timer);
    }
  }, [sessionStatus, remainingTime]);

  // Initialize speech recognition for translation
  useEffect(() => {
    if (isTranslationActive && ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window)) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      
      recognitionRef.current.continuous = true;
      recognitionRef.current.interimResults = true;
      recognitionRef.current.lang = sourceLanguage;

      recognitionRef.current.onresult = (event) => {
        let interimTranscript = '';
        let finalTranscript = '';

        for (let i = event.resultIndex; i < event.results.length; i++) {
          const transcript = event.results[i][0].transcript;
          
          if (event.results[i].isFinal) {
            finalTranscript += transcript;
          } else {
            interimTranscript += transcript;
          }
        }

        const fullText = finalTranscript || interimTranscript;
        setCurrentTranscript(fullText);

        if (finalTranscript) {
          translateText(finalTranscript);
        }
      };

      recognitionRef.current.onerror = (event) => {
        console.error('Speech recognition error:', event.error);
      };

      if (isListening) {
        recognitionRef.current.start();
      }

      return () => {
        if (recognitionRef.current) {
          recognitionRef.current.stop();
        }
      };
    }
  }, [isTranslationActive, isListening, sourceLanguage]);

  const initializeSession = async () => {
    try {
      // Get user media
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: true, 
        audio: true 
      });
      
      if (localVideoRef.current) {
        localVideoRef.current.srcObject = stream;
      }

      // Initialize WebRTC peer connection
      initializePeerConnection(stream);
      
      setSessionStatus('active');
      setIsRecording(true);
      
      // Save session start to database
      await saveSessionStart();
      
      toast({
        title: "Sesión iniciada",
        description: "La consulta angelical ha comenzado",
      });
    } catch (error) {
      console.error('Error initializing session:', error);
      toast({
        title: "Error",
        description: "No se pudo acceder a la cámara y micrófono",
        variant: "destructive"
      });
    }
  };

  const initializePeerConnection = (stream) => {
    // WebRTC configuration
    const configuration = {
      iceServers: [
        { urls: 'stun:stun.l.google.com:19302' },
        { urls: 'stun:stun1.l.google.com:19302' }
      ]
    };

    peerConnectionRef.current = new RTCPeerConnection(configuration);

    // Add local stream tracks to peer connection
    stream.getTracks().forEach(track => {
      peerConnectionRef.current.addTrack(track, stream);
    });

    // Handle remote stream
    peerConnectionRef.current.ontrack = (event) => {
      if (remoteVideoRef.current) {
        remoteVideoRef.current.srcObject = event.streams[0];
      }
    };

    // Handle ICE candidates
    peerConnectionRef.current.onicecandidate = (event) => {
      if (event.candidate) {
        // Send ICE candidate to remote peer via signaling server
        sendSignalingMessage({
          type: 'ice-candidate',
          candidate: event.candidate,
          sessionId
        });
      }
    };
  };

  const saveSessionStart = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      await supabase.from('consultation_sessions').insert({
        session_id: sessionId,
        user_id: user?.id,
        booking_id: bookingData?.id,
        start_time: new Date().toISOString(),
        status: 'active',
        duration: bookingData?.duration,
        type: bookingData?.type
      });
    } catch (error) {
      console.error('Error saving session start:', error);
    }
  };

  const translateText = async (text) => {
    if (!text.trim()) return;

    try {
      // Call OpenAI API for spiritual translation
      const response = await fetch('/api/translate-spiritual', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          text,
          sourceLang: sourceLanguage,
          targetLang: targetLanguage,
          context: 'angelical',
          preserveSpiritual: true
        })
      });

      const data = await response.json();
      
      if (data.translation) {
        setTranslatedText(data.translation);
        
        // Add to conversation history
        const entry = {
          id: Date.now(),
          original: text,
          translated: data.translation,
          sourceLang: sourceLanguage,
          targetLang: targetLanguage,
          timestamp: new Date().toISOString(),
          confidence: data.confidence || 95
        };
        
        setConversationHistory(prev => [...prev, entry]);
        
        // Speak translation if enabled
        speakText(data.translation, targetLanguage);
      }
    } catch (error) {
      console.error('Translation error:', error);
    }
  };

  const speakText = (text, language) => {
    if ('speechSynthesis' in window && text) {
      window.speechSynthesis.cancel();
      
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = getLanguageCode(language);
      utterance.rate = 0.85;
      utterance.pitch = 1.1;
      
      window.speechSynthesis.speak(utterance);
    }
  };

  const getLanguageCode = (langCode) => {
    const codes = {
      'es': 'es-ES',
      'en': 'en-US',
      'fr': 'fr-FR',
      'it': 'it-IT',
      'pt': 'pt-BR',
      'de': 'de-DE',
      'zh': 'zh-CN',
      'ja': 'ja-JP',
      'ko': 'ko-KR',
      'ar': 'ar-SA'
    };
    return codes[langCode] || 'en-US';
  };

  const sendSignalingMessage = async (message) => {
    // Send signaling message via Supabase realtime or your signaling server
    try {
      await supabase.from('signaling_messages').insert({
        session_id: sessionId,
        message: JSON.stringify(message),
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      console.error('Error sending signaling message:', error);
    }
  };

  const toggleVideo = () => {
    if (localVideoRef.current && localVideoRef.current.srcObject) {
      const videoTrack = localVideoRef.current.srcObject.getVideoTracks()[0];
      if (videoTrack) {
        videoTrack.enabled = !videoTrack.enabled;
        setIsVideoEnabled(videoTrack.enabled);
      }
    }
  };

  const toggleAudio = () => {
    if (localVideoRef.current && localVideoRef.current.srcObject) {
      const audioTrack = localVideoRef.current.srcObject.getAudioTracks()[0];
      if (audioTrack) {
        audioTrack.enabled = !audioTrack.enabled;
        setIsAudioEnabled(audioTrack.enabled);
      }
    }
  };

  const toggleTranslation = () => {
    setIsTranslationActive(!isTranslationActive);
    setIsListening(!isListening);
  };

  const sendChatMessage = async () => {
    if (!chatInput.trim()) return;

    const message = {
      id: Date.now(),
      text: chatInput,
      sender: userRole,
      timestamp: new Date().toISOString(),
      translated: isTranslationActive ? translatedText : null
    };

    setChatMessages(prev => [...prev, message]);
    
    // Save to database
    try {
      await supabase.from('chat_messages').insert({
        session_id: sessionId,
        message: chatInput,
        sender: userRole,
        translated: message.translated
      });
    } catch (error) {
      console.error('Error saving chat message:', error);
    }

    setChatInput('');
    
    // Scroll to bottom
    setTimeout(() => {
      if (chatRef.current) {
        chatRef.current.scrollTop = chatRef.current.scrollHeight;
      }
    }, 100);
  };

  const shareCard = (card) => {
    setSharedCards(prev => [...prev, card]);
    
    // Send card to other participant
    sendSignalingMessage({
      type: 'card-shared',
      card,
      sessionId
    });
  };

  const showTimeWarning = (minutes) => {
    toast({
      title: `Quedan ${minutes} minuto${minutes > 1 ? 's' : ''}`,
      description: "¿Deseas extender la sesión?",
      action: {
        label: "Extender",
        onClick: () => handleExtendSession()
      }
    });
  };

  const handleExtendSession = () => {
    // Open payment modal for extension
    toast({
      title: "Extensión de sesión",
      description: "Redirigiendo al pago...",
    });
  };

  const handleSessionEnd = async () => {
    setSessionStatus('ended');
    
    // Stop recording
    setIsRecording(false);
    
    // Stop all tracks
    if (localVideoRef.current && localVideoRef.current.srcObject) {
      localVideoRef.current.srcObject.getTracks().forEach(track => track.stop());
    }
    
    // Close peer connection
    if (peerConnectionRef.current) {
      peerConnectionRef.current.close();
    }
    
    // Save session end
    await saveSessionEnd();
    
    // Generate PDF report
    await generateSessionPDF();
    
    if (onEndSession) {
      onEndSession();
    }
  };

  const saveSessionEnd = async () => {
    try {
      await supabase
        .from('consultation_sessions')
        .update({
          end_time: new Date().toISOString(),
          status: 'completed',
          conversation_history: conversationHistory,
          chat_messages: chatMessages,
          shared_cards: sharedCards
        })
        .eq('session_id', sessionId);
    } catch (error) {
      console.error('Error saving session end:', error);
    }
  };

  const generateSessionPDF = async () => {
    try {
      const response = await fetch('/api/generate-session-pdf', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          sessionId,
          bookingData,
          conversationHistory,
          chatMessages,
          sharedCards,
          duration: bookingData?.duration - Math.floor(remainingTime / 60)
        })
      });

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `consulta-angelical-${sessionId}.pdf`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
      
      toast({
        title: "PDF generado",
        description: "Tu reporte de sesión ha sido descargado",
      });
    } catch (error) {
      console.error('Error generating PDF:', error);
    }
  };

  const cleanup = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
    }
    if (peerConnectionRef.current) {
      peerConnectionRef.current.close();
    }
    if (localVideoRef.current && localVideoRef.current.srcObject) {
      localVideoRef.current.srcObject.getTracks().forEach(track => track.stop());
    }
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-indigo-900 to-purple-800 relative overflow-hidden">
      {/* Animated background */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-10 left-10 w-32 h-32 bg-yellow-300 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-20 w-40 h-40 bg-pink-300 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-60 h-60 bg-white rounded-full blur-3xl animate-pulse" style={{ animationDelay: '0.5s' }}></div>
      </div>

      {/* Header */}
      <div className="relative z-10 bg-black/30 backdrop-blur-sm border-b border-white/20 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-3">
              <Sparkles className="w-6 h-6 text-yellow-400" />
              <h1 className="text-xl font-bold text-white">Consulta Angelical Online</h1>
            </div>
            
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <div className={`w-2 h-2 rounded-full animate-pulse ${sessionStatus === 'active' ? 'bg-green-400' : 'bg-yellow-400'}`}></div>
                <span className="text-white/80 text-sm">
                  {sessionStatus === 'active' ? 'Activa' : 'Conectando...'}
                </span>
              </div>
              
              <div className="flex items-center gap-2 bg-black/40 rounded-lg px-3 py-1">
                <Clock className="w-4 h-4 text-white/80" />
                <span className={`font-mono text-sm ${remainingTime <= 300 ? 'text-red-400 animate-pulse' : 'text-white'}`}>
                  {formatTime(remainingTime)}
                </span>
              </div>
              
              {isRecording && (
                <div className="flex items-center gap-2 bg-red-500/20 rounded-lg px-3 py-1">
                  <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                  <span className="text-red-400 text-sm">Grabando</span>
                </div>
              )}
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowTranslation(!showTranslation)}
              className={`p-2 rounded-lg transition-all ${showTranslation ? 'bg-blue-500' : 'bg-white/10 hover:bg-white/20'}`}
              title="Traducción en tiempo real"
            >
              <Languages className="w-5 h-5 text-white" />
            </button>
            
            <button
              onClick={() => setShowChat(!showChat)}
              className={`p-2 rounded-lg transition-all ${showChat ? 'bg-blue-500' : 'bg-white/10 hover:bg-white/20'}`}
              title="Chat"
            >
              <MessageSquare className="w-5 h-5 text-white" />
            </button>
            
            {userRole === 'reader' && (
              <button
                onClick={() => setShowCards(!showCards)}
                className={`p-2 rounded-lg transition-all ${showCards ? 'bg-yellow-500' : 'bg-white/10 hover:bg-white/20'}`}
                title="Compartir cartas"
              >
                <Star className="w-5 h-5 text-white" />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="relative z-10 p-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[calc(100vh-200px)]">
          {/* Video area - 2 columns */}
          <div className="lg:col-span-2 space-y-4">
            {/* Remote video */}
            <div className="relative bg-black/40 backdrop-blur-sm rounded-2xl overflow-hidden border border-white/20 shadow-2xl h-3/4">
              <video
                ref={remoteVideoRef}
                autoPlay
                playsInline
                className="w-full h-full object-cover"
              />
              
              <div className="absolute bottom-4 left-4 bg-black/60 backdrop-blur-sm rounded-lg px-3 py-2">
                <span className="text-white text-sm font-medium">
                  {userRole === 'reader' ? '✨ Cliente' : '🔮 Lector Angelical'}
                </span>
              </div>
              
              {/* Translation overlay */}
              {isTranslationActive && translatedText && (
                <div className="absolute bottom-16 left-4 right-4 bg-black/80 backdrop-blur-sm rounded-lg px-4 py-3 border border-blue-400/50">
                  <div className="flex items-start gap-2">
                    <Languages className="w-4 h-4 text-blue-400 mt-1 flex-shrink-0" />
                    <div className="flex-1">
                      <p className="text-white text-sm">{translatedText}</p>
                      <p className="text-blue-300 text-xs mt-1">
                        {supportedLanguages.find(l => l.code === sourceLanguage)?.flag} → {supportedLanguages.find(l => l.code === targetLanguage)?.flag}
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Local video */}
            <div className="relative bg-black/40 backdrop-blur-sm rounded-2xl overflow-hidden border border-white/20 shadow-2xl h-1/4">
              <video
                ref={localVideoRef}
                autoPlay
                muted
                playsInline
                className="w-full h-full object-cover"
              />
              
              <div className="absolute bottom-2 left-2 bg-black/60 backdrop-blur-sm rounded-lg px-2 py-1">
                <span className="text-white text-xs font-medium">
                  {userRole === 'reader' ? '🔮 Tú (Lector)' : '✨ Tú'}
                </span>
              </div>
              
              {!isVideoEnabled && (
                <div className="absolute inset-0 bg-gradient-to-br from-purple-600 to-indigo-600 flex items-center justify-center">
                  <VideoOff size={32} className="text-white opacity-60" />
                </div>
              )}
            </div>
          </div>

          {/* Sidebar - 1 column */}
          <div className="space-y-4">
            {/* Translation panel */}
            {showTranslation && (
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl border border-white/20 p-4">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-white font-semibold flex items-center gap-2">
                    <Languages className="w-5 h-5" />
                    Traducción
                  </h3>
                  <button
                    onClick={toggleTranslation}
                    className={`px-3 py-1 rounded-lg text-sm font-medium transition-all ${
                      isTranslationActive
                        ? 'bg-red-500 text-white'
                        : 'bg-green-500 text-white'
                    }`}
                  >
                    {isTranslationActive ? 'Detener' : 'Iniciar'}
                  </button>
                </div>
                
                <div className="space-y-3">
                  <div>
                    <label className="block text-white/80 text-xs mb-1">Desde</label>
                    <select
                      value={sourceLanguage}
                      onChange={(e) => setSourceLanguage(e.target.value)}
                      className="w-full bg-white/20 text-white border border-white/30 rounded-lg px-2 py-1 text-sm"
                    >
                      {supportedLanguages.map(lang => (
                        <option key={lang.code} value={lang.code} className="bg-gray-800">
                          {lang.flag} {lang.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-white/80 text-xs mb-1">Hacia</label>
                    <select
                      value={targetLanguage}
                      onChange={(e) => setTargetLanguage(e.target.value)}
                      className="w-full bg-white/20 text-white border border-white/30 rounded-lg px-2 py-1 text-sm"
                    >
                      {supportedLanguages.map(lang => (
                        <option key={lang.code} value={lang.code} className="bg-gray-800">
                          {lang.flag} {lang.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  
                  {isTranslationActive && (
                    <div className="bg-blue-500/20 border border-blue-400/50 rounded-lg p-2">
                      <p className="text-blue-200 text-xs">
                        {isListening ? '🎤 Escuchando...' : '⏸️ Pausado'}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Chat panel */}
            {showChat && (
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl border border-white/20 p-4 flex flex-col h-96">
                <h3 className="text-white font-semibold flex items-center gap-2 mb-3">
                  <MessageSquare className="w-5 h-5" />
                  Chat
                </h3>
                
                <div 
                  ref={chatRef}
                  className="flex-1 overflow-y-auto space-y-2 mb-3"
                >
                  {chatMessages.map((message) => (
                    <div
                      key={message.id}
                      className={`flex ${message.sender === userRole ? 'justify-end' : 'justify-start'}`}
                    >
                      <div
                        className={`max-w-xs px-3 py-2 rounded-lg ${
                          message.sender === userRole
                            ? 'bg-purple-500 text-white'
                            : 'bg-white/20 text-white'
                        }`}
                      >
                        <p className="text-sm">{message.text}</p>
                        {message.translated && (
                          <p className="text-xs opacity-70 mt-1 italic">{message.translated}</p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
                
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={chatInput}
                    onChange={(e) => setChatInput(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && sendChatMessage()}
                    placeholder="Escribe un mensaje..."
                    className="flex-1 bg-white/20 text-white placeholder-white/50 border border-white/30 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                  <button
                    onClick={sendChatMessage}
                    className="px-4 py-2 bg-purple-500 hover:bg-purple-600 text-white rounded-lg transition-colors text-sm font-medium"
                  >
                    Enviar
                  </button>
                </div>
              </div>
            )}

            {/* Shared cards */}
            {sharedCards.length > 0 && (
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl border border-white/20 p-4">
                <h3 className="text-white font-semibold flex items-center gap-2 mb-3">
                  <Star className="w-5 h-5 text-yellow-400" />
                  Cartas Compartidas
                </h3>
                <div className="grid grid-cols-3 gap-2">
                  {sharedCards.map((card, index) => (
                    <div key={index} className="bg-white/20 rounded-lg p-2 text-center">
                      <div className="text-2xl mb-1">{card.icon}</div>
                      <p className="text-white text-xs">{card.name}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 z-50">
        <div className="bg-black/80 backdrop-blur-xl rounded-2xl border border-white/30 px-8 py-4 shadow-2xl">
          <div className="flex items-center gap-4">
            <button
              onClick={toggleVideo}
              className={`p-3 rounded-xl transition-all duration-300 ${
                isVideoEnabled
                  ? 'bg-white/20 hover:bg-white/30 text-white'
                  : 'bg-red-500 hover:bg-red-600 text-white'
              }`}
              title={isVideoEnabled ? 'Desactivar cámara' : 'Activar cámara'}
            >
              {isVideoEnabled ? <Video size={24} /> : <VideoOff size={24} />}
            </button>

            <button
              onClick={toggleAudio}
              className={`p-3 rounded-xl transition-all duration-300 ${
                isAudioEnabled
                  ? 'bg-white/20 hover:bg-white/30 text-white'
                  : 'bg-red-500 hover:bg-red-600 text-white'
              }`}
              title={isAudioEnabled ? 'Silenciar' : 'Activar audio'}
            >
              {isAudioEnabled ? <Mic size={24} /> : <MicOff size={24} />}
            </button>

            <div className="w-px h-8 bg-white/30"></div>

            <button
              onClick={handleSessionEnd}
              className="p-3 rounded-xl bg-red-500 hover:bg-red-600 text-white transition-all duration-300"
              title="Finalizar consulta"
            >
              <PhoneOff size={24} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VideoConsultationIntegrated;

