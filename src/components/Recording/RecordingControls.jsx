import React, { useState } from 'react';
// import { Button } from "@/components/ui/button";
// import { Badge } from "@/components/ui/badge";
// import { Card, CardContent } from "@/components/ui/card";

const RecordingControls = ({ 
  isRecording, 
  onStartRecording, 
  onStopRecording, 
  onPauseRecording,
  isPaused,
  recordingTime,
  storageUsed = 0,
  maxStorage = 1024 // MB
}) => {
  const [recordingQuality, setRecordingQuality] = useState('high');

  const formatTime = (seconds) => {
    const hours = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    
    if (hours > 0) {
      return `${hours}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const getStoragePercentage = () => {
    return (storageUsed / maxStorage) * 100;
  };

  const getStorageColor = () => {
    const percentage = getStoragePercentage();
    if (percentage > 90) return 'destructive';
    if (percentage > 70) return 'secondary';
    return 'default';
  };

  const qualitySettings = {
    low: { bitrate: '64kbps', size: 'Pequeño', icon: '🔊' },
    medium: { bitrate: '128kbps', size: 'Medio', icon: '🔉' },
    high: { bitrate: '256kbps', size: 'Grande', icon: '🔈' }
  };

  return (
    <Card className="fixed bottom-6 left-1/2 transform -translate-x-1/2 z-50 bg-background/95 backdrop-blur">
      <CardContent className="p-4">
        <div className="flex items-center space-x-4">
          {/* Recording Status Indicator */}
          <div className="flex items-center space-x-2">
            {isRecording && (
              <div className="flex items-center space-x-2">
                {isPaused ? (
                  <Badge variant="secondary" className="animate-pulse">
                    ⏸️ Pausado
                  </Badge>
                ) : (
                  <Badge variant="destructive" className="animate-pulse">
                    🔴 REC
                  </Badge>
                )}
                <span className="font-mono text-lg font-semibold">
                  {formatTime(recordingTime)}
                </span>
              </div>
            )}
          </div>

          {/* Quality Selector */}
          {!isRecording && (
            <div className="flex items-center space-x-2">
              <span className="text-sm text-muted-foreground">Calidad:</span>
              <select
                value={recordingQuality}
                onChange={(e) => setRecordingQuality(e.target.value)}
                className="text-sm border rounded px-2 py-1"
              >
                {Object.entries(qualitySettings).map(([key, settings]) => (
                  <option key={key} value={key}>
                    {settings.icon} {key.charAt(0).toUpperCase() + key.slice(1)} ({settings.bitrate})
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Recording Controls */}
          <div className="flex space-x-2">
            {!isRecording ? (
              <Button 
                onClick={() => onStartRecording({ quality: recordingQuality })}
                className="bg-red-600 hover:bg-red-700 text-white"
                disabled={getStoragePercentage() > 95}
              >
                🎙️ Grabar
              </Button>
            ) : (
              <div className="flex space-x-2">
                <Button
                  variant="outline"
                  onClick={onPauseRecording}
                  size="sm"
                >
                  {isPaused ? '▶️' : '⏸️'}
                </Button>
                <Button
                  onClick={onStopRecording}
                  variant="outline"
                  className="border-red-500 text-red-500 hover:bg-red-50"
                >
                  ⏹️ Finalizar
                </Button>
              </div>
            )}
          </div>

          {/* Storage Indicator */}
          <div className="flex items-center space-x-2 text-sm">
            <Badge variant={getStorageColor()}>
              💾 {storageUsed.toFixed(0)}/{maxStorage}MB
            </Badge>
            <div className="w-20 h-2 bg-muted rounded-full overflow-hidden">
              <div 
                className={`h-full transition-all duration-300 ${
                  getStoragePercentage() > 90 ? 'bg-red-500' : 
                  getStoragePercentage() > 70 ? 'bg-yellow-500' : 'bg-green-500'
                }`}
                style={{ width: `${Math.min(getStoragePercentage(), 100)}%` }}
              />
            </div>
          </div>

          {/* Additional Options */}
          <div className="flex space-x-1">
            <Button variant="ghost" size="sm" title="Configuración">
              ⚙️
            </Button>
            <Button variant="ghost" size="sm" title="Historial">
              📂
            </Button>
          </div>
        </div>

        {/* Quality Info */}
        {isRecording && (
          <div className="mt-2 pt-2 border-t text-xs text-muted-foreground text-center">
            Grabando en calidad {recordingQuality} • {qualitySettings[recordingQuality].bitrate}
          </div>
        )}

        {/* Storage Warning */}
        {getStoragePercentage() > 85 && (
          <div className="mt-2 pt-2 border-t">
            <Badge variant="destructive" className="text-xs">
              ⚠️ Almacenamiento casi lleno. Limpia grabaciones antiguas.
            </Badge>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default RecordingControls;