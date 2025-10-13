import React, { useState, useEffect } from 'react';
import { JitsiMeeting } from '@jitsi/react-sdk';
import { Video, VideoOff, Mic, MicOff, PhoneOff, Clock, User } from 'lucide-react';
import './VideoConsultaJitsi.css';

const VideoConsultaJitsi = ({ 
  consultaId, 
  roomName, 
  displayName, 
  angelologo,
  duracionMinutos = 60,
  onSalir 
}) => {
  const [enSalaEspera, setEnSalaEspera] = useState(true);
  const [tiempoRestante, setTiempoRestante] = useState(duracionMinutos * 60);
  const [jitsiApi, setJitsiApi] = useState(null);
  
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
    ]
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
    DEFAULT_REMOTE_DISPLAY_NAME: 'Angelólogo',
    DEFAULT_LOCAL_DISPLAY_NAME: 'Tú',
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
  };
  
  const salirConsulta = () => {
    if (jitsiApi) {
      jitsiApi.executeCommand('hangup');
    }
    onSalir();
  };
  
  // Sala de espera
  if (enSalaEspera) {
    return (
      <div className="sala-espera-overlay">
        <div className="sala-espera-container">
          <div className="sala-espera-header">
            <h2>🌟 Sala de Espera</h2>
            <p>Preparándote para tu consulta angelical</p>
          </div>
          
          <div className="sala-espera-content">
            <div className="angelologo-info">
              <div className="angelologo-avatar">
                {angelologo.foto ? (
                  <img src={angelologo.foto} alt={angelologo.nombre} />
                ) : (
                  <User className="w-16 h-16" />
                )}
              </div>
              <h3>{angelologo.nombre}</h3>
              <p className="angelologo-especialidad">{angelologo.especialidad}</p>
              <p className="angelologo-descripcion">{angelologo.descripcion}</p>
            </div>
            
            <div className="consulta-detalles">
              <div className="detalle-item">
                <Clock className="w-5 h-5" />
                <span>Duración: {duracionMinutos} minutos</span>
              </div>
              <div className="detalle-item">
                <Video className="w-5 h-5" />
                <span>Videollamada en vivo</span>
              </div>
            </div>
            
            <div className="preparacion-tips">
              <h4>✨ Preparación para tu consulta:</h4>
              <ul>
                <li>Encuentra un lugar tranquilo y privado</li>
                <li>Asegúrate de tener buena conexión a internet</li>
                <li>Prepara tus preguntas o temas a consultar</li>
                <li>Ten papel y lápiz para tomar notas</li>
                <li>Respira profundo y abre tu corazón</li>
              </ul>
            </div>
            
            <div className="sala-espera-acciones">
              <button 
                onClick={() => setEnSalaEspera(false)}
                className="btn-entrar-consulta"
              >
                <Video className="w-5 h-5" />
                Entrar a la Consulta
              </button>
              <button 
                onClick={onSalir}
                className="btn-cancelar-consulta"
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }
  
  // Sala de videollamada
  return (
    <div className="video-consulta-container">
      <div className="video-consulta-header">
        <div className="consulta-info">
          <span className="consulta-titulo">Consulta con {angelologo.nombre}</span>
          <span className="consulta-estado">🔴 En vivo</span>
        </div>
        <div className="consulta-timer">
          <Clock className="w-4 h-4" />
          <span className={tiempoRestante < 300 ? 'tiempo-advertencia' : ''}>
            {formatTiempo(tiempoRestante)}
          </span>
        </div>
        <button onClick={salirConsulta} className="btn-salir-consulta" title="Salir de la consulta">
          <PhoneOff className="w-5 h-5" />
        </button>
      </div>
      
      <div className="video-consulta-main">
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
      
      {tiempoRestante < 300 && tiempoRestante > 0 && (
        <div className="alerta-tiempo">
          ⚠️ Quedan menos de 5 minutos de consulta
        </div>
      )}
      
      {tiempoRestante === 0 && (
        <div className="alerta-tiempo-terminado">
          ⏰ El tiempo de consulta ha terminado
          <button onClick={salirConsulta} className="btn-finalizar">
            Finalizar Consulta
          </button>
        </div>
      )}
    </div>
  );
};

export default VideoConsultaJitsi;

