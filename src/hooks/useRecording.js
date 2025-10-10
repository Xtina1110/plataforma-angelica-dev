import { useState, useRef, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';

export const useRecording = () => {
  const [recordingStatus, setRecordingStatus] = useState('idle'); // idle, recording, uploading, transcribing, completed
  const [recordingData, setRecordingData] = useState(null);
  const mediaRecorderRef = useRef(null);
  const chunksRef = useRef([]);
  const streamRef = useRef(null);

  const startRecording = useCallback(async (options = {}) => {
    try {
      const {
        quality = 'high',
        sessionId,
        format = 'webm',
        audioBitrate = 128000
      } = options;

      // Request microphone access
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          sampleRate: 44100,
          channelCount: 1,
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true
        }
      });

      streamRef.current = stream;
      chunksRef.current = [];

      // Configure MediaRecorder
      const mimeType = `audio/${format};codecs=opus`;
      const mediaRecorder = new MediaRecorder(stream, {
        mimeType,
        audioBitsPerSecond: audioBitrate
      });

      mediaRecorderRef.current = mediaRecorder;

      mediaRecorder.ondataavailable = (event) => {
        if (event.data && event.data.size > 0) {
          chunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: mimeType });
        setRecordingData({
          blob,
          mimeType,
          size: blob.size,
          quality,
          sessionId,
          duration: Date.now() - startTime
        });
      };

      const startTime = Date.now();
      mediaRecorder.start(1000); // Capture in 1-second intervals
      setRecordingStatus('recording');

      return { success: true };
    } catch (error) {
      console.error('Error starting recording:', error);
      setRecordingStatus('idle');
      throw error;
    }
  }, []);

  const stopRecording = useCallback(() => {
    return new Promise((resolve, reject) => {
      try {
        if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
          const mediaRecorder = mediaRecorderRef.current;
          
          mediaRecorder.onstop = () => {
            // Stop all tracks
            if (streamRef.current) {
              streamRef.current.getTracks().forEach(track => track.stop());
            }

            const blob = new Blob(chunksRef.current, { type: mediaRecorder.mimeType });
            setRecordingStatus('idle');
            resolve(blob);
          };

          mediaRecorder.stop();
        } else {
          resolve(null);
        }
      } catch (error) {
        console.error('Error stopping recording:', error);
        reject(error);
      }
    });
  }, []);

  const pauseRecording = useCallback(() => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
      mediaRecorderRef.current.pause();
      setRecordingStatus('paused');
    }
  }, []);

  const resumeRecording = useCallback(() => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'paused') {
      mediaRecorderRef.current.resume();
      setRecordingStatus('recording');
    }
  }, []);

  const uploadRecording = useCallback(async (blob, sessionId) => {
    try {
      setRecordingStatus('uploading');
      
      const timestamp = new Date().toISOString();
      const fileName = `session_${sessionId}_${timestamp}.webm`;
      
      // Upload to Supabase Storage
      const { data, error } = await supabase.storage
        .from('recordings')
        .upload(`sessions/${fileName}`, blob, {
          contentType: blob.type,
          upsert: false
        });

      if (error) throw error;

      // Save recording metadata to database
      const { data: recordingData, error: dbError } = await supabase
        .from('recordings')
        .insert({
          session_id: sessionId,
          file_path: data.path,
          file_size: blob.size,
          mime_type: blob.type,
          duration: recordingData?.duration || 0
        })
        .select()
        .single();

      if (dbError) throw dbError;

      return {
        path: data.path,
        url: `${supabase.storage.from('recordings').getPublicUrl(data.path).data.publicUrl}`,
        id: recordingData.id
      };
    } catch (error) {
      console.error('Error uploading recording:', error);
      setRecordingStatus('idle');
      throw error;
    }
  }, []);

  const getTranscription = useCallback(async (recordingPath) => {
    try {
      setRecordingStatus('transcribing');
      
      // Call Supabase Edge Function for transcription
      const { data, error } = await supabase.functions.invoke('transcribe-audio', {
        body: {
          recording_path: recordingPath,
          language: 'es',
          model: 'whisper-1'
        }
      });

      if (error) throw error;

      setRecordingStatus('completed');
      return data;
    } catch (error) {
      console.error('Error getting transcription:', error);
      setRecordingStatus('idle');
      throw error;
    }
  }, []);

  const deleteRecording = useCallback(async (recordingId, filePath) => {
    try {
      // Delete from storage
      const { error: storageError } = await supabase.storage
        .from('recordings')
        .remove([filePath]);

      if (storageError) throw storageError;

      // Delete from database
      const { error: dbError } = await supabase
        .from('recordings')
        .delete()
        .eq('id', recordingId);

      if (dbError) throw dbError;

      return { success: true };
    } catch (error) {
      console.error('Error deleting recording:', error);
      throw error;
    }
  }, []);

  const getRecordings = useCallback(async (sessionId = null) => {
    try {
      let query = supabase
        .from('recordings')
        .select('*')
        .order('created_at', { ascending: false });

      if (sessionId) {
        query = query.eq('session_id', sessionId);
      }

      const { data, error } = await query;
      if (error) throw error;

      return data || [];
    } catch (error) {
      console.error('Error fetching recordings:', error);
      throw error;
    }
  }, []);

  const isRecording = recordingStatus === 'recording';
  const isPaused = recordingStatus === 'paused';
  const isProcessing = ['uploading', 'transcribing'].includes(recordingStatus);

  return {
    recordingStatus,
    recordingData,
    isRecording,
    isPaused,
    isProcessing,
    startRecording,
    stopRecording,
    pauseRecording,
    resumeRecording,
    uploadRecording,
    getTranscription,
    deleteRecording,
    getRecordings
  };
};