import React, { useState, useEffect, useRef } from 'react';
import { Mic, MicOff, Download, Trash2, Languages } from 'lucide-react';
import { supabase } from '../../supabase';
import './TranscriptionPanel.css';

const TranscriptionPanel = ({ consultaId, userId, isRecording }) => {
  const [transcripts, setTranscripts] = useState([]);
  const [isTranscribing, setIsTranscribing] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState('es');
  const transcriptEndRef = useRef(null);

  useEffect(() => {
    loadTranscripts();
  }, [consultaId]);

  useEffect(() => {
    // Auto-scroll al final cuando hay nuevas transcripciones
    transcriptEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [transcripts]);

  const loadTranscripts = async () => {
    try {
      const { data, error } = await supabase
        .from('session_transcripts')
        .select('*')
        .eq('session_id', consultaId)
        .order('timestamp', { ascending: true });

      if (error) throw error;

      setTranscripts(data || []);
    } catch (error) {
      console.error('Error cargando transcripciones:', error);
    }
  };

  const toggleTranscription = () => {
    setIsTranscribing(!isTranscribing);
    
    if (!isTranscribing) {
      // Iniciar transcripción
      startTranscription();
    } else {
      // Detener transcripción
      stopTranscription();
    }
  };

  const startTranscription = () => {
    // Aquí se implementaría la integración con Web Speech API o servicio externo
    console.log('Iniciando transcripción...');
    
    // Ejemplo con Web Speech API (solo Chrome/Edge)
    if ('webkitSpeechRecognition' in window) {
      const recognition = new webkitSpeechRecognition();
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = selectedLanguage;

      recognition.onresult = (event) => {
        const transcript = Array.from(event.results)
          .map(result => result[0].transcript)
          .join('');

        // Guardar transcripción en tiempo real
        if (event.results[event.results.length - 1].isFinal) {
          saveTranscript(transcript);
        }
      };

      recognition.start();
    } else {
      alert('La transcripción en tiempo real no está disponible en este navegador. Usa Chrome o Edge.');
    }
  };

  const stopTranscription = () => {
    console.log('Deteniendo transcripción...');
  };

  const saveTranscript = async (text) => {
    try {
      const transcriptData = {
        session_id: consultaId,
        speaker: 'Usuario',
        text: text,
        timestamp: new Date().toISOString(),
        language: selectedLanguage
      };

      const { error } = await supabase
        .from('session_transcripts')
        .insert(transcriptData);

      if (error) throw error;

      // Recargar transcripciones
      loadTranscripts();
    } catch (error) {
      console.error('Error guardando transcripción:', error);
    }
  };

  const downloadTranscripts = () => {
    const text = transcripts
      .map(t => `[${new Date(t.timestamp).toLocaleTimeString('es-ES')}] ${t.speaker}: ${t.text}`)
      .join('\n\n');

    const blob = new Blob([text], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `transcripcion-consulta-${consultaId}-${new Date().toISOString().split('T')[0]}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const clearTranscripts = async () => {
    if (window.confirm('¿Estás seguro de que quieres borrar todas las transcripciones?')) {
      try {
        const { error } = await supabase
          .from('session_transcripts')
          .delete()
          .eq('session_id', consultaId);

        if (error) throw error;

        setTranscripts([]);
      } catch (error) {
        console.error('Error borrando transcripciones:', error);
      }
    }
  };

  return (
    <div className="transcription-panel">
      <div className="transcription-header">
        <div className="flex items-center space-x-2">
          <Mic className="w-5 h-5 text-purple-600" />
          <h3 className="text-lg font-bold text-gray-800">Transcripción en Vivo</h3>
        </div>
        {isTranscribing && (
          <span className="recording-indicator">
            <span className="recording-dot"></span>
            Transcribiendo...
          </span>
        )}
      </div>

      <div className="transcription-toolbar">
        <button
          onClick={toggleTranscription}
          className={`toolbar-btn ${isTranscribing ? 'toolbar-btn-danger' : 'toolbar-btn-primary'}`}
          title={isTranscribing ? 'Detener transcripción' : 'Iniciar transcripción'}
        >
          {isTranscribing ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
          <span>{isTranscribing ? 'Detener' : 'Iniciar'}</span>
        </button>

        <select
          value={selectedLanguage}
          onChange={(e) => setSelectedLanguage(e.target.value)}
          className="language-select"
          disabled={isTranscribing}
        >
          <option value="es-ES">Español</option>
          <option value="en-US">English</option>
          <option value="pt-BR">Português</option>
          <option value="fr-FR">Français</option>
        </select>

        <button
          onClick={downloadTranscripts}
          className="toolbar-btn"
          title="Descargar transcripción"
          disabled={transcripts.length === 0}
        >
          <Download className="w-4 h-4" />
        </button>

        <button
          onClick={clearTranscripts}
          className="toolbar-btn toolbar-btn-danger"
          title="Borrar transcripción"
          disabled={transcripts.length === 0}
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>

      <div className="transcription-content">
        {transcripts.length === 0 ? (
          <div className="empty-state">
            <Mic className="w-12 h-12 text-gray-300 mb-3" />
            <p className="text-gray-500">No hay transcripciones aún</p>
            <p className="text-sm text-gray-400">Haz clic en "Iniciar" para comenzar</p>
          </div>
        ) : (
          <div className="transcription-list">
            {transcripts.map((transcript, index) => (
              <div key={index} className="transcript-item">
                <div className="transcript-header-item">
                  <span className="transcript-speaker">{transcript.speaker}</span>
                  <span className="transcript-time">
                    {new Date(transcript.timestamp).toLocaleTimeString('es-ES', {
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </span>
                </div>
                <p className="transcript-text">{transcript.text}</p>
              </div>
            ))}
            <div ref={transcriptEndRef} />
          </div>
        )}
      </div>

      <div className="transcription-footer">
        <span className="text-xs text-gray-500">
          {transcripts.length} transcripciones
        </span>
        <span className="text-xs text-gray-400">
          Idioma: {selectedLanguage === 'es-ES' ? 'Español' : selectedLanguage}
        </span>
      </div>
    </div>
  );
};

export default TranscriptionPanel;

