import React, { useState } from 'react';
import { Video, Calendar, ArrowLeft } from 'lucide-react';
import AppSidebar from '../AppSidebar';
import { AperturaAngelicaHeader } from '../headers';
import SistemaReservasCompleto from '../BookingSystem/SistemaReservasCompleto';
import VideoCallSystemEnhanced from '../VideoConference/VideoCallSystemEnhanced';
import '../Dashboard.css';

const ConsultasOnlineVivoEnhanced = ({ user, onLogout }) => {
  const [activeView, setActiveView] = useState('booking'); // 'booking' | 'call'
  const [activeSession, setActiveSession] = useState(null);

  const handleStartSession = (sessionData) => {
    setActiveSession(sessionData);
    setActiveView('call');
  };

  const handleEndSession = () => {
    setActiveView('booking');
    setActiveSession(null);
  };

  return (
    <div className="dashboard-container">
      <AppSidebar />

      <main className="main-content"
        style={{
          backgroundImage: activeView === 'call' ? 'none' : 'url(/FondoMarmoleado02.png)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundAttachment: 'fixed',
          minHeight: '100vh',
          overflowY: 'auto'
        }}>

        {activeView === 'booking' ? (
          <>
            <AperturaAngelicaHeader
              user={user}
              onLogout={onLogout}
              onNavigateHome={() => window.history.back()}
            />

            <div className="p-6">
              {/* Info Banner */}
              <div className="bg-gradient-to-r from-purple-600 to-blue-600 rounded-2xl p-6 mb-6 text-white shadow-xl">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center">
                    <Video size={32} />
                  </div>
                  <div className="flex-1">
                    <h2 className="text-2xl font-bold mb-2">Consultas Angélicas en Vivo</h2>
                    <p className="text-white/90">
                      Conéctate con tu consultor angelical en tiempo real con traducción simultánea en 10 idiomas
                    </p>
                  </div>
                </div>

                {/* Features */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
                  <div className="bg-white/10 rounded-xl p-4 backdrop-blur-sm">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                        🌍
                      </div>
                      <div>
                        <h3 className="font-semibold">Traducción en Tiempo Real</h3>
                        <p className="text-sm text-white/80">10 idiomas disponibles</p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white/10 rounded-xl p-4 backdrop-blur-sm">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                        💬
                      </div>
                      <div>
                        <h3 className="font-semibold">Chat Integrado</h3>
                        <p className="text-sm text-white/80">Con traducción automática</p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white/10 rounded-xl p-4 backdrop-blur-sm">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                        📄
                      </div>
                      <div>
                        <h3 className="font-semibold">PDF Completo</h3>
                        <p className="text-sm text-white/80">Transcripción y cartas</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Booking System */}
              <SistemaReservasCompleto onStartSession={handleStartSession} />
            </div>
          </>
        ) : (
          <>
            {/* Video Call View */}
            <VideoCallSystemEnhanced
              sessionId={activeSession?.id || 'session-' + Date.now()}
              consultantName={activeSession?.consultantName || 'Consultor Angelical'}
              clientName={user?.email || 'Cliente'}
              onEndSession={handleEndSession}
            />
          </>
        )}
      </main>
    </div>
  );
};

export default ConsultasOnlineVivoEnhanced;

