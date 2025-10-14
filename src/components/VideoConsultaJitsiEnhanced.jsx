import React, { useState, useEffect } from 'react';
import { JitsiMeeting } from '@jitsi/react-sdk';
import { 
  Video, 
  VideoOff, 
  Mic, 
  MicOff, 
  PhoneOff, 
  Clock, 
  User,
  Settings,
  MessageSquare,
  FileText,
  Mic as MicIcon,
  Monitor,
  Users,
  MoreVertical,
  X,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import NotesPanel from './VideoConsulta/NotesPanel';
import TranscriptionPanel from './VideoConsulta/TranscriptionPanel';
import './VideoConsultaJitsiEnhanced.css';

const VideoConsultaJitsiEnhanced = ({ 
  consultaId, 
  roomName, 
  displayName, 
  angelologo,
  duracionMinutos = 60,
  onSalir,
  user,
  reserva
}) => {
  const [enSalaEspera, setEnSalaEspera] = useState(true);
  const [tiempoRestante, setTiempoRestante] = useState(duracionMinutos * 60);
  const [jitsiApi, setJitsiApi] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activeTab, setActiveTab] = useState('notes'); // 'notes', 'transcription', 'chat', 'settings'
  const [isRecording, setIsRecording] = useState(false);
  const [audioEnabled, setAudioEnabled] = useState(true);
  const [videoEnabled, setVideoEnabled] = useState(true);
  
  // Countdown timer
  useEffect(() => {
    if (!enSalaEspera && tiempoRestante > 0) {
      const interval = setInterval(() => {
        setTiempoRestante(prev => {
          if (prev <= 1) {
            clearInterval(interval);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      
      return () => clearInterval(interval);
    }
  }, [enSalaEspera, tiempoRestante]);
  
  // Formatear tiempo restante
  const formatTiempo = (segundos) => {
    const mins = Math.floor(segundos / 60);
    const secs = segundos % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };
  
  // Configuración de Jitsi
  const jitsiConfig = {
    startWithAudioMuted: false,
    startWithVideoMuted: false,
    disableModeratorIndicator: false,
    enableWelcomePage: false,
    prejoinPageEnabled: false,
    disableInviteFunctions: true,
    disableDeepLinking: true,
    enableClosePage: false,
    toolbarButtons: [
      'microphone',
      'camera',
      'desktop',
      'chat',
      'raisehand',
      'tileview',
      'videoquality',
      'settings',
      'hangup'
    ],
    // Personalización de marca
    defaultLanguage: 'es',
    enableNoisyMicDetection: true,
    enableNoAudioDetection: true,
    enableNoiseCancellation: true
  };
  
  const interfaceConfig = {
    SHOW_JITSI_WATERMARK: false,
    SHOW_WATERMARK_FOR_GUESTS: false,
    SHOW_BRAND_WATERMARK: false,
    BRAND_WATERMARK_LINK: '',
    SHOW_POWERED_BY: false,
    DISABLE_JOIN_LEAVE_NOTIFICATIONS: true,
    MOBILE_APP_PROMO: false,
    APP_NAME: 'Consulta Angelical',
    NATIVE_APP_NAME: 'Consulta Angelical',
    PROVIDER_NAME: 'Plataforma Angélica',
    DEFAULT_BACKGROUND: '#667eea',
    DEFAULT_REMOTE_DISPLAY_NAME: angelologo.nombre,
    DEFAULT_LOCAL_DISPLAY_NAME: displayName,
    FILM_STRIP_MAX_HEIGHT: 120,
    TOOLBAR_ALWAYS_VISIBLE: false,
    TOOLBAR_TIMEOUT: 4000
  };
  
  const handleJitsiIFrameRef = (iframeRef) => {
    iframeRef.style.height = '100%';
    iframeRef.style.width = '100%';
  };
  
  const handleApiReady = (api) => {
    setJitsiApi(api);
    
    // Eventos de Jitsi
    api.on('videoConferenceJoined', () => {
      console.log('Usuario se unió a la conferencia');
    });
    
    api.on('videoConferenceLeft', () => {
      console.log('Usuario salió de la conferencia');
      onSalir();
    });
    
    api.on('participantJoined', (participant) => {
      console.log('Participante se unió:', participant);
    });
    
    api.on('participantLeft', (participant) => {
      console.log('Participante salió:', participant);
    });

    api.on('audioMuteStatusChanged', ({ muted }) => {
      setAudioEnabled(!muted);
    });

    api.on('videoMuteStatusChanged', ({ muted }) => {
      setVideoEnabled(!muted);
    });
  };
  
  const salirConsulta = () => {
    if (window.confirm('¿Estás seguro de que quieres salir de la consulta?')) {
      if (jitsiApi) {
        jitsiApi.executeCommand('hangup');
      }
      onSalir();
    }
  };

  const toggleRecording = () => {
    if (jitsiApi) {
      if (isRecording) {
        jitsiApi.executeCommand('stopRecording', 'file');
        setIsRecording(false);
      } else {
        jitsiApi.executeCommand('startRecording', {
          mode: 'file',
          appData: JSON.stringify({
            consultaId: consultaId,
            timestamp: new Date().toISOString()
          })
        });
        setIsRecording(true);
      }
    }
  };
  
  // Sala de espera mejorada
  if (enSalaEspera) {
    return (
      <div className="waiting-room-enhanced">
        <div className="waiting-room-container">
          <div className="waiting-room-header">
            <div className="logo-section">
              <div className="angelica-logo">✨</div>
              <h1 className="brand-name">Plataforma Angélica</h1>
            </div>
            <button onClick={onSalir} className="btn-close-waiting">
              <X className="w-6 h-6" />
            </button>
          </div>
          
          <div className="waiting-room-content">
            <div className="session-info-card">
              <h2 className="session-title">Consulta Angelical</h2>
              <div className="session-details">
                <div className="detail-row">
                  <User className="w-5 h-5 text-purple-600" />
                  <div>
                    <p className="detail-label">Angelólogo</p>
                    <p className="detail-value">{angelologo.nombre}</p>
                  </div>
                </div>
                <div className="detail-row">
                  <Clock className="w-5 h-5 text-purple-600" />
                  <div>
                    <p className="detail-label">Duración</p>
                    <p className="detail-value">{duracionMinutos} minutos</p>
                  </div>
                </div>
                <div className="detail-row">
                  <Video className="w-5 h-5 text-purple-600" />
                  <div>
                    <p className="detail-label">Tipo</p>
                    <p className="detail-value">Videollamada en vivo</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="preparation-card">
              <h3 className="preparation-title">✨ Preparación para tu consulta</h3>
              <div className="preparation-checklist">
                <label className="checklist-item">
                  <input type="checkbox" />
                  <span>Encuentra un lugar tranquilo y privado</span>
                </label>
                <label className="checklist-item">
                  <input type="checkbox" />
                  <span>Verifica tu conexión a internet</span>
                </label>
                <label className="checklist-item">
                  <input type="checkbox" />
                  <span>Prueba tu cámara y micrófono</span>
                </label>
                <label className="checklist-item">
                  <input type="checkbox" />
                  <span>Prepara tus preguntas o temas</span>
                </label>
                <label className="checklist-item">
                  <input type="checkbox" />
                  <span>Ten papel y lápiz para notas</span>
                </label>
              </div>
            </div>

            <div className="waiting-room-actions">
              <button 
                onClick={() => setEnSalaEspera(false)}
                className="btn-join-session"
              >
                <Video className="w-6 h-6" />
                <span>Entrar a la Consulta</span>
              </button>
              <button 
                onClick={onSalir}
                className="btn-cancel-session"
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }
  
  // Interfaz principal de videollamada
  return (
    <div className="video-consultation-enhanced">
      {/* Header profesional */}
      <div className="consultation-header-enhanced">
        <div className="header-left">
          <div className="angelica-logo-small">✨</div>
          <div className="session-info">
            <h3 className="session-name">{angelologo.nombre}</h3>
            <div className="session-status">
              <span className="status-dot"></span>
              <span>En vivo</span>
            </div>
          </div>
        </div>

        <div className="header-center">
          <div className="timer-display">
            <Clock className="w-5 h-5" />
            <span className={tiempoRestante < 300 ? 'timer-warning' : ''}>
              {formatTiempo(tiempoRestante)}
            </span>
          </div>
        </div>

        <div className="header-right">
          {isRecording && (
            <div className="recording-badge">
              <span className="rec-dot"></span>
              <span>REC</span>
            </div>
          )}
          <button onClick={salirConsulta} className="btn-end-call" title="Finalizar llamada">
            <PhoneOff className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Contenido principal */}
      <div className="consultation-main">
        {/* Video principal */}
        <div className={`video-main-container ${sidebarOpen ? 'with-sidebar' : 'full-width'}`}>
          <JitsiMeeting
            domain="meet.jit.si"
            roomName={roomName}
            configOverwrite={jitsiConfig}
            interfaceConfigOverwrite={interfaceConfig}
            userInfo={{
              displayName: displayName,
              email: ''
            }}
            onApiReady={handleApiReady}
            getIFrameRef={handleJitsiIFrameRef}
            lang="es"
          />
        </div>

        {/* Sidebar con tabs */}
        {sidebarOpen && (
          <div className="consultation-sidebar">
            <div className="sidebar-tabs">
              <button
                onClick={() => setActiveTab('notes')}
                className={`tab-btn ${activeTab === 'notes' ? 'active' : ''}`}
                title="Notas"
              >
                <FileText className="w-5 h-5" />
                <span>Notas</span>
              </button>
              <button
                onClick={() => setActiveTab('transcription')}
                className={`tab-btn ${activeTab === 'transcription' ? 'active' : ''}`}
                title="Transcripción"
              >
                <MicIcon className="w-5 h-5" />
                <span>Transcripción</span>
              </button>
              <button
                onClick={() => setActiveTab('chat')}
                className={`tab-btn ${activeTab === 'chat' ? 'active' : ''}`}
                title="Chat"
              >
                <MessageSquare className="w-5 h-5" />
                <span>Chat</span>
              </button>
              <button
                onClick={() => setActiveTab('settings')}
                className={`tab-btn ${activeTab === 'settings' ? 'active' : ''}`}
                title="Configuración"
              >
                <Settings className="w-5 h-5" />
                <span>Config</span>
              </button>
            </div>

            <div className="sidebar-content">
              {activeTab === 'notes' && (
                <NotesPanel consultaId={consultaId} userId={user?.id} />
              )}
              {activeTab === 'transcription' && (
                <TranscriptionPanel 
                  consultaId={consultaId} 
                  userId={user?.id}
                  isRecording={isRecording}
                />
              )}
              {activeTab === 'chat' && (
                <div className="tab-content-placeholder">
                  <MessageSquare className="w-12 h-12 text-gray-300 mb-3" />
                  <p className="text-gray-500">Chat integrado con Jitsi</p>
                  <p className="text-sm text-gray-400">Usa el botón de chat en la barra de herramientas</p>
                </div>
              )}
              {activeTab === 'settings' && (
                <div className="settings-panel">
                  <h3 className="settings-title">Configuración de Sesión</h3>
                  <div className="settings-options">
                    <div className="setting-item">
                      <label className="setting-label">
                        <input type="checkbox" checked={audioEnabled} readOnly />
                        <span>Micrófono activado</span>
                      </label>
                    </div>
                    <div className="setting-item">
                      <label className="setting-label">
                        <input type="checkbox" checked={videoEnabled} readOnly />
                        <span>Cámara activada</span>
                      </label>
                    </div>
                    <div className="setting-item">
                      <button 
                        onClick={toggleRecording}
                        className={`btn-toggle-recording ${isRecording ? 'recording' : ''}`}
                      >
                        {isRecording ? 'Detener Grabación' : 'Iniciar Grabación'}
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Toggle sidebar button */}
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="btn-toggle-sidebar"
          title={sidebarOpen ? 'Ocultar panel' : 'Mostrar panel'}
        >
          {sidebarOpen ? <ChevronRight className="w-5 h-5" /> : <ChevronLeft className="w-5 h-5" />}
        </button>
      </div>

      {/* Alertas de tiempo */}
      {tiempoRestante < 300 && tiempoRestante > 0 && (
        <div className="time-alert warning">
          ⚠️ Quedan menos de 5 minutos de consulta
        </div>
      )}
      
      {tiempoRestante === 0 && (
        <div className="time-alert danger">
          <span>⏰ El tiempo de consulta ha terminado</span>
          <button onClick={salirConsulta} className="btn-finish-now">
            Finalizar Ahora
          </button>
        </div>
      )}
    </div>
  );
};

export default VideoConsultaJitsiEnhanced;

