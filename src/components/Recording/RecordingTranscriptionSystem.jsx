import React, { useState, useRef, useEffect } from 'react';
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import { Button } from "@/components/ui/button";
// import { Badge } from "@/components/ui/badge";
import { useRecording } from '@/hooks/useRecording';
import { supabase } from '@/integrations/supabase/client';

const RecordingTranscriptionSystem = ({ sessionId, autoStart = false }) => {
  const [isRecording, setIsRecording] = useState(false);
  const [transcription, setTranscription] = useState('');
  const [recordingQuality, setRecordingQuality] = useState('high');
  const [recordingTime, setRecordingTime] = useState(0);
  const intervalRef = useRef(null);
  
  const { 
    startRecording, 
    stopRecording, 
    uploadRecording, 
    getTranscription,
    recordingStatus 
  } = useRecording();

  useEffect(() => {
    if (autoStart) {
      handleStartRecording();
    }
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [autoStart]);

  useEffect(() => {
    if (isRecording) {
      intervalRef.current = setInterval(() => {
        setRecordingTime(prev => prev + 1);
      }, 1000);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    }
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isRecording]);

  const handleStartRecording = async () => {
    try {
      await startRecording({
        quality: recordingQuality,
        sessionId,
        format: 'webm',
        audioBitrate: recordingQuality === 'high' ? 128000 : 64000
      });
      setIsRecording(true);
      setRecordingTime(0);
    } catch (error) {
      console.error('Error starting recording:', error);
    }
  };

  const handleStopRecording = async () => {
    try {
      const recordingBlob = await stopRecording();
      setIsRecording(false);
      
      // Upload to Supabase storage
      const uploadResult = await uploadRecording(recordingBlob, sessionId);
      
      // Generate transcription using Whisper AI
      const transcriptionResult = await getTranscription(uploadResult.path);
      setTranscription(transcriptionResult.text);
      
      // Save session data
      await supabase.from('session_recordings').insert({
        session_id: sessionId,
        recording_path: uploadResult.path,
        transcription: transcriptionResult.text,
        duration: recordingTime,
        quality: recordingQuality,
        size: recordingBlob.size
      });
      
    } catch (error) {
      console.error('Error stopping recording:', error);
    }
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const getQualityColor = (quality) => {
    switch (quality) {
      case 'high': return 'default';
      case 'medium': return 'secondary';
      case 'low': return 'outline';
      default: return 'secondary';
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Grabación y Transcripción Angelical</CardTitle>
          <Badge variant={isRecording ? "destructive" : "secondary"}>
            {isRecording ? `🔴 REC ${formatTime(recordingTime)}` : '⏹️ Detenido'}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Quality Settings */}
        <div className="space-y-3">
          <label className="text-sm font-medium">Calidad de Grabación</label>
          <div className="flex space-x-2">
            {['low', 'medium', 'high'].map((quality) => (
              <Button
                key={quality}
                variant={recordingQuality === quality ? "default" : "outline"}
                size="sm"
                onClick={() => setRecordingQuality(quality)}
                disabled={isRecording}
              >
                <Badge variant={getQualityColor(quality)} className="mr-1">
                  {quality === 'low' && '🔊'}
                  {quality === 'medium' && '🔉'}
                  {quality === 'high' && '🔈'}
                </Badge>
                {quality.charAt(0).toUpperCase() + quality.slice(1)}
              </Button>
            ))}
          </div>
        </div>

        {/* Recording Controls */}
        <div className="flex justify-center space-x-4">
          {!isRecording ? (
            <Button 
              onClick={handleStartRecording}
              className="bg-red-600 hover:bg-red-700 text-white"
              disabled={recordingStatus === 'uploading'}
            >
              🎙️ Iniciar Grabación
            </Button>
          ) : (
            <Button 
              onClick={handleStopRecording}
              variant="outline"
              className="border-red-500 text-red-500 hover:bg-red-50"
            >
              ⏹️ Finalizar Grabación
            </Button>
          )}
        </div>

        {/* Recording Status */}
        {recordingStatus && (
          <div className="text-center">
            <Badge variant="outline">
              Estado: {recordingStatus === 'uploading' && '📤 Subiendo...'}
              {recordingStatus === 'transcribing' && '🤖 Transcribiendo...'}
              {recordingStatus === 'completed' && '✅ Completado'}
            </Badge>
          </div>
        )}

        {/* Live Waveform Visualization */}
        {isRecording && (
          <div className="space-y-2">
            <label className="text-sm font-medium">Audio en Vivo</label>
            <div className="h-16 bg-muted rounded-lg flex items-center justify-center">
              <div className="flex space-x-1 items-end">
                {[...Array(20)].map((_, i) => (
                  <div
                    key={i}
                    className="bg-primary rounded-sm animate-pulse"
                    style={{
                      width: '3px',
                      height: `${Math.random() * 40 + 10}px`,
                      animationDelay: `${i * 0.1}s`
                    }}
                  />
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Transcription Display */}
        {transcription && (
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium">Transcripción Automática</label>
              <Button variant="outline" size="sm">
                📄 Exportar
              </Button>
            </div>
            <div className="p-4 bg-muted rounded-lg max-h-32 overflow-y-auto">
              <p className="text-sm leading-relaxed">{transcription}</p>
            </div>
          </div>
        )}

        {/* Session Info */}
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div className="space-y-1">
            <span className="text-muted-foreground">Sesión ID:</span>
            <p className="font-mono text-xs">{sessionId}</p>
          </div>
          <div className="space-y-1">
            <span className="text-muted-foreground">Duración:</span>
            <p className="font-semibold">{formatTime(recordingTime)}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default RecordingTranscriptionSystem;