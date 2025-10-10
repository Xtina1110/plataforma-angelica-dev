import { useState, useEffect, useRef } from 'react';
import {
  Video, VideoOff, Mic, MicOff, Phone, MessageSquare,
  Clock, DollarSign, FileText, Download, Share2, Maximize2
} from 'lucide-react';
import { Card, CardContent } from '../ui/card';
import supabase from '../../services/supabaseClient';
import './OnlineConsultation.css';

const LiveSessionRoom = ({ booking, session, onEndSession }) => {
  const [localStream, setLocalStream] = useState(null);
  const [remoteStream, setRemoteStream] = useState(null);
  const [cameraOn, setCameraOn] = useState(true);
  const [micOn, setMicOn] = useState(true);
  const [chatMessages, setChatMessages] = useState([]);
  const [chatInput, setChatInput] = useState('');
  const [showChat, setShowChat] = useState(false);
  const [sessionTime, setSessionTime] = useState(0);
  const [canExtend, setCanExtend] = useState(true);
  const [themeConfig, setThemeConfig] = useState(null);

  const localVideoRef = useRef(null);
  const remoteVideoRef = useRef(null);
  const peerConnection = useRef(null);
  const timerInterval = useRef(null);

  useEffect(() => {
    initializeSession();
    loadThemeConfig();
    startTimer();

    return () => {
      cleanup();
    };
  }, []);

  const loadThemeConfig = async () => {
    try {
      const { data } = await supabase
        .from('themed_rooms')
        .select('*')
        .eq('theme', booking.theme)
        .single();

      if (data) {
        setThemeConfig(data);
        applyThemeStyles(data);
      }
    } catch (error) {
      console.error('Error loading theme:', error);
    }
  };

  const applyThemeStyles = (theme) => {
    const colors = theme.color_scheme || {};
    document.documentElement.style.setProperty('--session-primary', colors.primary || '#d4af37');
    document.documentElement.style.setProperty('--session-secondary', colors.secondary || '#ffffff');
    document.documentElement.style.setProperty('--session-accent', colors.accent || '#f59e0b');

    if (theme.ambient_music_url) {
      playAmbientMusic(theme.ambient_music_url);
    }
  };

  const playAmbientMusic = (url) => {
    const audio = new Audio(url);
    audio.volume = 0.3;
    audio.loop = true;
    audio.play().catch(console.error);
  };

  const startTimer = () => {
    timerInterval.current = setInterval(() => {
      setSessionTime(prev => {
        const newTime = prev + 1;

        if (newTime >= booking.duration_minutes * 60 - 300 && canExtend) {
          showExtensionOffer();
        }

        return newTime;
      });
    }, 1000);
  };

  const showExtensionOffer = () => {
    const extend = window.confirm(
      'Tu sesión está por terminar en 5 minutos.\n\n' +
      '¿Deseas extender?\n' +
      '• 15 minutos adicionales: $50 USD\n' +
      '• 30 minutos adicionales: $95 USD'
    );

    if (extend) {
      const minutes = window.prompt('¿Cuántos minutos? (15 o 30)');
      if (minutes === '15' || minutes === '30') {
        requestExtension(parseInt(minutes));
      }
    }
    setCanExtend(false);
  };

  const requestExtension = async (minutes) => {
    try {
      const amount = minutes === 15 ? 50 : 95;

      const { error } = await supabase
        .from('session_extensions')
        .insert({
          session_id: session.id,
          extension_minutes: minutes,
          extension_amount: amount,
          payment_status: 'pending'
        });

      if (error) throw error;

      alert(`Extensión de ${minutes} minutos solicitada. Por favor completa el pago para continuar.`);
    } catch (error) {
      console.error('Error requesting extension:', error);
      alert('Error al solicitar extensión');
    }
  };

  const initializeSession = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { width: 1280, height: 720 },
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true
        }
      });

      setLocalStream(stream);
      if (localVideoRef.current) {
        localVideoRef.current.srcObject = stream;
      }

      await updateSessionStatus('started_at', new Date().toISOString());
    } catch (error) {
      console.error('Error accessing media devices:', error);
      alert('Error al acceder a cámara/micrófono. Por favor verifica los permisos.');
    }
  };

  const updateSessionStatus = async (field, value) => {
    try {
      await supabase
        .from('consultation_sessions')
        .update({ [field]: value })
        .eq('id', session.id);
    } catch (error) {
      console.error('Error updating session:', error);
    }
  };

  const toggleCamera = () => {
    if (localStream) {
      const videoTrack = localStream.getVideoTracks()[0];
      videoTrack.enabled = !videoTrack.enabled;
      setCameraOn(videoTrack.enabled);
    }
  };

  const toggleMic = () => {
    if (localStream) {
      const audioTrack = localStream.getAudioTracks()[0];
      audioTrack.enabled = !audioTrack.enabled;
      setMicOn(audioTrack.enabled);
    }
  };

  const sendChatMessage = async () => {
    if (!chatInput.trim()) return;

    const message = {
      text: chatInput,
      timestamp: new Date().toISOString(),
      sender: 'user'
    };

    setChatMessages(prev => [...prev, message]);
    setChatInput('');

    const currentTranscript = session.chat_transcript || [];
    await updateSessionStatus('chat_transcript', [...currentTranscript, message]);
  };

  const endSession = async () => {
    const confirm = window.confirm('¿Estás seguro de terminar la sesión?');
    if (!confirm) return;

    const actualDuration = Math.floor(sessionTime / 60);

    await updateSessionStatus('ended_at', new Date().toISOString());
    await updateSessionStatus('actual_duration_minutes', actualDuration);

    cleanup();
    onEndSession();
  };

  const cleanup = () => {
    if (localStream) {
      localStream.getTracks().forEach(track => track.stop());
    }
    if (peerConnection.current) {
      peerConnection.current.close();
    }
    if (timerInterval.current) {
      clearInterval(timerInterval.current);
    }
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="session-room" style={{
      background: themeConfig?.background_image_url
        ? `linear-gradient(rgba(0,0,0,0.3), rgba(0,0,0,0.3)), url(${themeConfig.background_image_url})`
        : undefined,
      backgroundSize: 'cover',
      backgroundPosition: 'center'
    }}>
      <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: showChat ? '1fr 350px' : '1fr',
          gap: '1rem',
          height: 'calc(100vh - 2rem)'
        }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <Card style={{
              background: 'rgba(255, 255, 255, 0.95)',
              backdropFilter: 'blur(10px)',
              border: '2px solid #d4af37'
            }}>
              <CardContent style={{ padding: '1rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <h2 style={{ fontSize: '1.5rem', fontWeight: '700', marginBottom: '0.25rem' }}>
                      {themeConfig?.name || 'Sesión Angelical en Vivo'}
                    </h2>
                    <p style={{ color: '#6b7280', fontSize: '0.875rem' }}>
                      Con {booking.reader_name || 'Angelólogo'}
                    </p>
                  </div>
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '1rem',
                    fontSize: '1.25rem',
                    fontWeight: '700'
                  }}>
                    <Clock className="w-5 h-5" />
                    <span>{formatTime(sessionTime)}</span>
                    <span style={{ color: '#6b7280', fontSize: '0.875rem' }}>
                      / {booking.duration_minutes} min
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <div style={{
              flex: 1,
              display: 'grid',
              gridTemplateColumns: remoteStream ? 'repeat(2, 1fr)' : '1fr',
              gap: '1rem'
            }}>
              <div style={{ position: 'relative', borderRadius: '16px', overflow: 'hidden' }}>
                <video
                  ref={localVideoRef}
                  autoPlay
                  muted
                  playsInline
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    background: '#1f2937',
                    transform: 'scaleX(-1)'
                  }}
                />
                <div style={{
                  position: 'absolute',
                  bottom: '1rem',
                  left: '1rem',
                  background: 'rgba(0, 0, 0, 0.7)',
                  color: 'white',
                  padding: '0.5rem 1rem',
                  borderRadius: '8px',
                  fontWeight: '600'
                }}>
                  Tú
                </div>
              </div>

              {remoteStream && (
                <div style={{ position: 'relative', borderRadius: '16px', overflow: 'hidden' }}>
                  <video
                    ref={remoteVideoRef}
                    autoPlay
                    playsInline
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover',
                      background: '#1f2937'
                    }}
                  />
                  <div style={{
                    position: 'absolute',
                    bottom: '1rem',
                    left: '1rem',
                    background: 'rgba(0, 0, 0, 0.7)',
                    color: 'white',
                    padding: '0.5rem 1rem',
                    borderRadius: '8px',
                    fontWeight: '600'
                  }}>
                    Angelólogo
                  </div>
                </div>
              )}
            </div>

            <Card style={{
              background: 'rgba(255, 255, 255, 0.95)',
              backdropFilter: 'blur(10px)',
              border: '2px solid #d4af37'
            }}>
              <CardContent style={{ padding: '1rem' }}>
                <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', flexWrap: 'wrap' }}>
                  <button
                    onClick={toggleCamera}
                    className={`session-control-button ${!cameraOn ? 'danger' : ''}`}
                  >
                    {cameraOn ? <Video className="w-6 h-6" /> : <VideoOff className="w-6 h-6" />}
                  </button>

                  <button
                    onClick={toggleMic}
                    className={`session-control-button ${!micOn ? 'danger' : ''}`}
                  >
                    {micOn ? <Mic className="w-6 h-6" /> : <MicOff className="w-6 h-6" />}
                  </button>

                  <button
                    onClick={() => setShowChat(!showChat)}
                    className={`session-control-button ${showChat ? 'active' : ''}`}
                  >
                    <MessageSquare className="w-6 h-6" />
                  </button>

                  <button
                    onClick={endSession}
                    className="session-control-button danger"
                    style={{
                      borderRadius: '12px',
                      padding: '1rem 2rem',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.5rem',
                      fontWeight: '700'
                    }}
                  >
                    <Phone className="w-5 h-5" />
                    Finalizar Sesión
                  </button>
                </div>
              </CardContent>
            </Card>
          </div>

          {showChat && (
            <Card style={{
              background: 'rgba(255, 255, 255, 0.95)',
              backdropFilter: 'blur(10px)',
              border: '2px solid #d4af37',
              display: 'flex',
              flexDirection: 'column'
            }}>
              <div style={{
                padding: '1rem',
                borderBottom: '2px solid #d4af37',
                fontWeight: '700',
                fontSize: '1.125rem'
              }}>
                Chat y Notas
              </div>
              <div style={{
                flex: 1,
                overflowY: 'auto',
                padding: '1rem',
                display: 'flex',
                flexDirection: 'column',
                gap: '0.5rem'
              }}>
                {chatMessages.map((msg, idx) => (
                  <div
                    key={idx}
                    style={{
                      padding: '0.75rem',
                      background: msg.sender === 'user' ? '#f59e0b' : '#e5e7eb',
                      color: msg.sender === 'user' ? 'white' : '#374151',
                      borderRadius: '8px',
                      alignSelf: msg.sender === 'user' ? 'flex-end' : 'flex-start',
                      maxWidth: '80%'
                    }}
                  >
                    {msg.text}
                  </div>
                ))}
              </div>
              <div style={{ padding: '1rem', borderTop: '2px solid #d4af37' }}>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <input
                    type="text"
                    value={chatInput}
                    onChange={(e) => setChatInput(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && sendChatMessage()}
                    placeholder="Escribe una nota..."
                    style={{
                      flex: 1,
                      padding: '0.75rem',
                      border: '2px solid #d4af37',
                      borderRadius: '8px'
                    }}
                  />
                  <button
                    onClick={sendChatMessage}
                    style={{
                      padding: '0.75rem 1.5rem',
                      background: 'linear-gradient(to right, #f59e0b, #d97706)',
                      color: 'white',
                      border: 'none',
                      borderRadius: '8px',
                      fontWeight: '700',
                      cursor: 'pointer'
                    }}
                  >
                    Enviar
                  </button>
                </div>
              </div>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default LiveSessionRoom;
