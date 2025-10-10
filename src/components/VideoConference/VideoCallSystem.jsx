import React, { useState, useEffect, useRef } from 'react';
// import { Button } from "@/components/ui/button";
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useWebRTC } from '@/hooks/useWebRTC';

const VideoCallSystem = () => {
  const [isCallActive, setIsCallActive] = useState(false);
  const [participants, setParticipants] = useState([]);
  const { 
    isConnected,
    localStream,
    remoteStream,
    startCall, 
    endCall, 
    toggleCamera, 
    toggleMic, 
    localVideoRef 
  } = useWebRTC();

  const handleStartCall = async () => {
    try {
      const stream = await startCall();
      setIsCallActive(true);
    } catch (error) {
      console.error('Error starting call:', error);
    }
  };

  // Conectar el stream local al video element cuando esté disponible
  useEffect(() => {
    if (localVideoRef.current && localStream) {
      localVideoRef.current.srcObject = localStream;
    }
  }, [localStream]);

  const handleEndCall = () => {
    endCall();
    setIsCallActive(false);
  };

  return (
    <Card className="w-full h-full">
      <CardHeader>
        <CardTitle>Consulta Angélica en Vivo</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="aspect-video bg-muted rounded-lg relative overflow-hidden">
            {localStream ? (
              <video
                ref={localVideoRef}
                autoPlay
                muted
                playsInline
                className="w-full h-full object-cover rounded-lg"
              />
            ) : (
              <div className="w-full h-full bg-gray-800 rounded-lg flex items-center justify-center">
                <div className="text-center">
                  <div className="w-16 h-16 mx-auto mb-2 bg-gray-600 rounded-full flex items-center justify-center">
                    <span className="text-2xl">📹</span>
                  </div>
                  <p className="text-white text-sm">Cámara desactivada</p>
                </div>
              </div>
            )}
            <div className="absolute bottom-2 left-2 bg-black/60 text-white px-2 py-1 rounded text-sm">
              Tú
            </div>
          </div>
          <div className="aspect-video bg-muted rounded-lg flex items-center justify-center">
            {remoteStream ? (
              <video
                autoPlay
                playsInline
                className="w-full h-full object-cover rounded-lg"
                ref={(video) => {
                  if (video && remoteStream) {
                    video.srcObject = remoteStream;
                  }
                }}
              />
            ) : (
              <span className="text-muted-foreground">Esperando conexión...</span>
            )}
          </div>
        </div>
        
        <div className="flex justify-center space-x-2">
          <Button 
            variant="outline" 
            onClick={toggleCamera}
            className={localStream ? "bg-green-100 border-green-300" : "bg-red-100 border-red-300"}
          >
            📹
          </Button>
          <Button 
            variant="outline" 
            onClick={toggleMic}
          >
            🎤
          </Button>
          {!isCallActive ? (
            <Button onClick={handleStartCall} className="bg-green-600 hover:bg-green-700">
              Iniciar Llamada
            </Button>
          ) : (
            <Button onClick={handleEndCall} variant="destructive">
              Finalizar
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default VideoCallSystem;