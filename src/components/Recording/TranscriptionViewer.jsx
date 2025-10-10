import React, { useState, useRef, useEffect } from 'react';
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { Badge } from "@/components/ui/badge";

const TranscriptionViewer = ({ 
  transcription, 
  timestamps = [], 
  onEdit, 
  isEditable = true,
  sessionId 
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [editMode, setEditMode] = useState(false);
  const [editedText, setEditedText] = useState(transcription);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const textareaRef = useRef(null);

  useEffect(() => {
    setEditedText(transcription);
  }, [transcription]);

  const searchResults = transcription
    ? transcription.toLowerCase().split(searchTerm.toLowerCase()).length - 1
    : 0;

  const highlightText = (text, searchTerm) => {
    if (!searchTerm.trim()) return text;
    
    const regex = new RegExp(`(${searchTerm})`, 'gi');
    const parts = text.split(regex);
    
    return parts.map((part, index) => 
      regex.test(part) ? (
        <mark key={index} className="bg-yellow-200 px-1 rounded">
          {part}
        </mark>
      ) : part
    );
  };

  const handleSave = () => {
    onEdit(editedText);
    setEditMode(false);
  };

  const handleExport = (format) => {
    const content = editedText || transcription;
    const timestamp = new Date().toISOString().split('T')[0];
    
    let exportContent;
    let filename;
    let mimeType;

    switch (format) {
      case 'txt':
        exportContent = content;
        filename = `transcripcion_${sessionId}_${timestamp}.txt`;
        mimeType = 'text/plain';
        break;
      case 'srt':
        exportContent = generateSRT(content, timestamps);
        filename = `subtitulos_${sessionId}_${timestamp}.srt`;
        mimeType = 'application/x-subrip';
        break;
      case 'json':
        exportContent = JSON.stringify({
          sessionId,
          transcription: content,
          timestamps,
          exportDate: new Date().toISOString()
        }, null, 2);
        filename = `sesion_${sessionId}_${timestamp}.json`;
        mimeType = 'application/json';
        break;
      default:
        return;
    }

    const blob = new Blob([exportContent], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const generateSRT = (text, timestamps) => {
    if (!timestamps.length) return text;
    
    return timestamps.map((timestamp, index) => {
      const startTime = formatSRTTime(timestamp.start);
      const endTime = formatSRTTime(timestamp.end);
      return `${index + 1}\n${startTime} --> ${endTime}\n${timestamp.text}\n`;
    }).join('\n');
  };

  const formatSRTTime = (seconds) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = Math.floor(seconds % 60);
    const milliseconds = Math.floor((seconds % 1) * 1000);
    
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')},${milliseconds.toString().padStart(3, '0')}`;
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(editedText || transcription);
      // Could add a toast notification here
    } catch (error) {
      console.error('Error copying to clipboard:', error);
    }
  };

  const getWordCount = (text) => {
    return text ? text.split(/\s+/).filter(word => word.length > 0).length : 0;
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Transcripción de Sesión Angélica</CardTitle>
          <div className="flex space-x-2">
            <Badge variant="outline">
              {getWordCount(transcription)} palabras
            </Badge>
            {timestamps.length > 0 && (
              <Badge variant="outline">
                {timestamps.length} segmentos
              </Badge>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Search Bar */}
        <div className="flex space-x-2">
          <Input
            placeholder="Buscar en la transcripción..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="flex-1"
          />
          {searchTerm && (
            <Badge variant="secondary">
              {searchResults} coincidencias
            </Badge>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap gap-2">
          {isEditable && (
            <Button
              variant={editMode ? "default" : "outline"}
              size="sm"
              onClick={() => setEditMode(!editMode)}
            >
              ✏️ {editMode ? 'Vista' : 'Editar'}
            </Button>
          )}
          
          <Button variant="outline" size="sm" onClick={copyToClipboard}>
            📋 Copiar
          </Button>
          
          <div className="flex space-x-1">
            <Button variant="outline" size="sm" onClick={() => handleExport('txt')}>
              📄 TXT
            </Button>
            <Button variant="outline" size="sm" onClick={() => handleExport('srt')}>
              🎬 SRT
            </Button>
            <Button variant="outline" size="sm" onClick={() => handleExport('json')}>
              🗂️ JSON
            </Button>
          </div>
        </div>

        {/* Transcription Content */}
        <div className="space-y-2">
          {editMode ? (
            <div className="space-y-2">
              <textarea
                ref={textareaRef}
                value={editedText}
                onChange={(e) => setEditedText(e.target.value)}
                className="w-full h-64 p-4 border rounded-lg resize-none font-mono text-sm leading-relaxed"
                placeholder="Edita la transcripción aquí..."
              />
              <div className="flex justify-end space-x-2">
                <Button variant="outline" onClick={() => setEditMode(false)}>
                  Cancelar
                </Button>
                <Button onClick={handleSave}>
                  💾 Guardar Cambios
                </Button>
              </div>
            </div>
          ) : (
            <div className="bg-muted rounded-lg p-4 h-64 overflow-y-auto">
              {transcription ? (
                <div className="font-mono text-sm leading-relaxed whitespace-pre-wrap">
                  {highlightText(transcription, searchTerm)}
                </div>
              ) : (
                <div className="flex items-center justify-center h-full text-muted-foreground">
                  <div className="text-center space-y-2">
                    <div className="text-4xl">🎙️</div>
                    <p>No hay transcripción disponible</p>
                    <p className="text-xs">La transcripción aparecerá aquí automáticamente</p>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Timestamps Display */}
        {timestamps.length > 0 && (
          <div className="space-y-2">
            <label className="text-sm font-medium">Marcas de Tiempo</label>
            <div className="max-h-32 overflow-y-auto space-y-1">
              {timestamps.map((timestamp, index) => (
                <div 
                  key={index}
                  className="flex items-start space-x-2 p-2 bg-muted rounded text-sm hover:bg-accent cursor-pointer"
                  onClick={() => setHighlightedIndex(index)}
                >
                  <Badge variant="outline" className="text-xs">
                    {formatSRTTime(timestamp.start)}
                  </Badge>
                  <span className="flex-1 text-xs leading-relaxed">
                    {timestamp.text}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Session Info */}
        <div className="pt-2 border-t text-xs text-muted-foreground">
          <div className="flex justify-between">
            <span>Sesión: {sessionId}</span>
            <span>Última actualización: {new Date().toLocaleString('es-ES')}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default TranscriptionViewer;