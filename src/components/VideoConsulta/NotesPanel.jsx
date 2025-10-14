import React, { useState, useEffect } from 'react';
import { FileText, Save, Download, Trash2, Clock } from 'lucide-react';
import { supabase } from '../../supabase';
import './NotesPanel.css';

const NotesPanel = ({ consultaId, userId }) => {
  const [notes, setNotes] = useState('');
  const [savedNotes, setSavedNotes] = useState([]);
  const [autoSaving, setAutoSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState(null);

  useEffect(() => {
    loadNotes();
  }, [consultaId]);

  // Auto-save cada 30 segundos
  useEffect(() => {
    const interval = setInterval(() => {
      if (notes.trim()) {
        saveNotes(true);
      }
    }, 30000);

    return () => clearInterval(interval);
  }, [notes]);

  const loadNotes = async () => {
    try {
      const { data, error } = await supabase
        .from('session_notes')
        .select('*')
        .eq('session_id', consultaId)
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (error) throw error;

      if (data && data.length > 0) {
        setSavedNotes(data);
        setNotes(data[0].content || '');
      }
    } catch (error) {
      console.error('Error cargando notas:', error);
    }
  };

  const saveNotes = async (isAutoSave = false) => {
    if (!notes.trim()) return;

    try {
      setAutoSaving(true);

      const noteData = {
        session_id: consultaId,
        user_id: userId,
        content: notes,
        timestamp: new Date().toISOString()
      };

      const { error } = await supabase
        .from('session_notes')
        .upsert(noteData);

      if (error) throw error;

      setLastSaved(new Date());
      
      if (!isAutoSave) {
        // Mostrar notificación de guardado manual
        alert('Notas guardadas exitosamente');
      }
    } catch (error) {
      console.error('Error guardando notas:', error);
      if (!isAutoSave) {
        alert('Error al guardar notas');
      }
    } finally {
      setAutoSaving(false);
    }
  };

  const downloadNotes = () => {
    const blob = new Blob([notes], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `notas-consulta-${consultaId}-${new Date().toISOString().split('T')[0]}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const clearNotes = () => {
    if (window.confirm('¿Estás seguro de que quieres borrar todas las notas?')) {
      setNotes('');
    }
  };

  const insertTimestamp = () => {
    const timestamp = new Date().toLocaleTimeString('es-ES', { 
      hour: '2-digit', 
      minute: '2-digit',
      second: '2-digit'
    });
    const newText = `${notes}\n[${timestamp}] `;
    setNotes(newText);
  };

  return (
    <div className="notes-panel">
      <div className="notes-header">
        <div className="flex items-center space-x-2">
          <FileText className="w-5 h-5 text-purple-600" />
          <h3 className="text-lg font-bold text-gray-800">Notas de Sesión</h3>
        </div>
        {lastSaved && (
          <span className="text-xs text-gray-500">
            Guardado: {lastSaved.toLocaleTimeString('es-ES')}
          </span>
        )}
      </div>

      <div className="notes-toolbar">
        <button
          onClick={() => saveNotes(false)}
          className="toolbar-btn toolbar-btn-primary"
          title="Guardar notas"
          disabled={autoSaving}
        >
          <Save className="w-4 h-4" />
          <span>{autoSaving ? 'Guardando...' : 'Guardar'}</span>
        </button>
        
        <button
          onClick={insertTimestamp}
          className="toolbar-btn"
          title="Insertar marca de tiempo"
        >
          <Clock className="w-4 h-4" />
        </button>

        <button
          onClick={downloadNotes}
          className="toolbar-btn"
          title="Descargar notas"
          disabled={!notes.trim()}
        >
          <Download className="w-4 h-4" />
        </button>

        <button
          onClick={clearNotes}
          className="toolbar-btn toolbar-btn-danger"
          title="Borrar notas"
          disabled={!notes.trim()}
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>

      <textarea
        value={notes}
        onChange={(e) => setNotes(e.target.value)}
        placeholder="Escribe tus notas aquí... Se guardarán automáticamente cada 30 segundos.

Consejos:
• Usa el botón de reloj para insertar marcas de tiempo
• Las notas se guardan automáticamente
• Puedes descargarlas al finalizar la sesión"
        className="notes-textarea"
      />

      <div className="notes-footer">
        <span className="text-xs text-gray-500">
          {notes.length} caracteres
        </span>
        {autoSaving && (
          <span className="text-xs text-blue-600 flex items-center space-x-1">
            <div className="w-2 h-2 bg-blue-600 rounded-full animate-pulse"></div>
            <span>Guardando automáticamente...</span>
          </span>
        )}
      </div>
    </div>
  );
};

export default NotesPanel;

