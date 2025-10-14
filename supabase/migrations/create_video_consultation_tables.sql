-- ============================================================
-- MIGRACIÓN: Sistema de Videoconsultas Avanzado
-- Fecha: 2025-10-14
-- Descripción: Tablas para sesiones de video, notas y transcripciones
-- ============================================================

-- Tabla: video_sessions
-- Almacena información de cada sesión de videollamada
CREATE TABLE IF NOT EXISTS video_sessions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  booking_id UUID REFERENCES bookings(id) ON DELETE CASCADE,
  room_name TEXT NOT NULL,
  started_at TIMESTAMPTZ,
  ended_at TIMESTAMPTZ,
  duration_minutes INTEGER,
  recording_url TEXT,
  recording_status TEXT DEFAULT 'pending', -- pending, recording, completed, failed
  transcript_url TEXT,
  status TEXT DEFAULT 'scheduled', -- scheduled, active, completed, cancelled
  participants JSONB DEFAULT '[]',
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Índices para video_sessions
CREATE INDEX IF NOT EXISTS idx_video_sessions_booking_id ON video_sessions(booking_id);
CREATE INDEX IF NOT EXISTS idx_video_sessions_status ON video_sessions(status);
CREATE INDEX IF NOT EXISTS idx_video_sessions_started_at ON video_sessions(started_at);

-- Tabla: session_notes
-- Almacena notas tomadas durante las sesiones
CREATE TABLE IF NOT EXISTS session_notes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  session_id UUID REFERENCES video_sessions(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  content TEXT,
  timestamp TIMESTAMPTZ DEFAULT NOW(),
  is_private BOOLEAN DEFAULT true,
  tags TEXT[] DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Índices para session_notes
CREATE INDEX IF NOT EXISTS idx_session_notes_session_id ON session_notes(session_id);
CREATE INDEX IF NOT EXISTS idx_session_notes_user_id ON session_notes(user_id);
CREATE INDEX IF NOT EXISTS idx_session_notes_timestamp ON session_notes(timestamp);

-- Tabla: session_transcripts
-- Almacena transcripciones de las sesiones
CREATE TABLE IF NOT EXISTS session_transcripts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  session_id UUID REFERENCES video_sessions(id) ON DELETE CASCADE,
  speaker TEXT NOT NULL,
  text TEXT NOT NULL,
  timestamp TIMESTAMPTZ NOT NULL,
  language TEXT DEFAULT 'es',
  confidence FLOAT,
  is_final BOOLEAN DEFAULT false,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Índices para session_transcripts
CREATE INDEX IF NOT EXISTS idx_session_transcripts_session_id ON session_transcripts(session_id);
CREATE INDEX IF NOT EXISTS idx_session_transcripts_timestamp ON session_transcripts(timestamp);
CREATE INDEX IF NOT EXISTS idx_session_transcripts_language ON session_transcripts(language);

-- Tabla: session_recordings
-- Almacena información detallada de grabaciones
CREATE TABLE IF NOT EXISTS session_recordings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  session_id UUID REFERENCES video_sessions(id) ON DELETE CASCADE,
  file_url TEXT NOT NULL,
  file_size BIGINT,
  duration_seconds INTEGER,
  format TEXT DEFAULT 'mp4',
  quality TEXT DEFAULT 'hd',
  storage_provider TEXT DEFAULT 'supabase',
  is_downloadable BOOLEAN DEFAULT true,
  download_count INTEGER DEFAULT 0,
  expires_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Índices para session_recordings
CREATE INDEX IF NOT EXISTS idx_session_recordings_session_id ON session_recordings(session_id);
CREATE INDEX IF NOT EXISTS idx_session_recordings_created_at ON session_recordings(created_at);

-- Tabla: session_analytics
-- Almacena métricas y analytics de las sesiones
CREATE TABLE IF NOT EXISTS session_analytics (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  session_id UUID REFERENCES video_sessions(id) ON DELETE CASCADE,
  metric_name TEXT NOT NULL,
  metric_value JSONB NOT NULL,
  recorded_at TIMESTAMPTZ DEFAULT NOW()
);

-- Índices para session_analytics
CREATE INDEX IF NOT EXISTS idx_session_analytics_session_id ON session_analytics(session_id);
CREATE INDEX IF NOT EXISTS idx_session_analytics_metric_name ON session_analytics(metric_name);

-- ============================================================
-- FUNCIONES Y TRIGGERS
-- ============================================================

-- Función para actualizar updated_at automáticamente
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger para video_sessions
DROP TRIGGER IF EXISTS update_video_sessions_updated_at ON video_sessions;
CREATE TRIGGER update_video_sessions_updated_at
  BEFORE UPDATE ON video_sessions
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Trigger para session_notes
DROP TRIGGER IF EXISTS update_session_notes_updated_at ON session_notes;
CREATE TRIGGER update_session_notes_updated_at
  BEFORE UPDATE ON session_notes
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Función para calcular duración de sesión
CREATE OR REPLACE FUNCTION calculate_session_duration()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.ended_at IS NOT NULL AND NEW.started_at IS NOT NULL THEN
    NEW.duration_minutes = EXTRACT(EPOCH FROM (NEW.ended_at - NEW.started_at)) / 60;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger para calcular duración automáticamente
DROP TRIGGER IF EXISTS calculate_video_session_duration ON video_sessions;
CREATE TRIGGER calculate_video_session_duration
  BEFORE INSERT OR UPDATE ON video_sessions
  FOR EACH ROW
  EXECUTE FUNCTION calculate_session_duration();

-- ============================================================
-- POLÍTICAS DE SEGURIDAD (RLS)
-- ============================================================

-- Habilitar RLS en todas las tablas
ALTER TABLE video_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE session_notes ENABLE ROW LEVEL SECURITY;
ALTER TABLE session_transcripts ENABLE ROW LEVEL SECURITY;
ALTER TABLE session_recordings ENABLE ROW LEVEL SECURITY;
ALTER TABLE session_analytics ENABLE ROW LEVEL SECURITY;

-- Políticas para video_sessions
DROP POLICY IF EXISTS "Users can view their own sessions" ON video_sessions;
CREATE POLICY "Users can view their own sessions" ON video_sessions
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM bookings
      WHERE bookings.id = video_sessions.booking_id
      AND bookings.user_id = auth.uid()
    )
  );

DROP POLICY IF EXISTS "Users can create sessions for their bookings" ON video_sessions;
CREATE POLICY "Users can create sessions for their bookings" ON video_sessions
  FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM bookings
      WHERE bookings.id = booking_id
      AND bookings.user_id = auth.uid()
    )
  );

DROP POLICY IF EXISTS "Users can update their own sessions" ON video_sessions;
CREATE POLICY "Users can update their own sessions" ON video_sessions
  FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM bookings
      WHERE bookings.id = video_sessions.booking_id
      AND bookings.user_id = auth.uid()
    )
  );

-- Políticas para session_notes
DROP POLICY IF EXISTS "Users can view their own notes" ON session_notes;
CREATE POLICY "Users can view their own notes" ON session_notes
  FOR SELECT
  USING (user_id = auth.uid());

DROP POLICY IF EXISTS "Users can create their own notes" ON session_notes;
CREATE POLICY "Users can create their own notes" ON session_notes
  FOR INSERT
  WITH CHECK (user_id = auth.uid());

DROP POLICY IF EXISTS "Users can update their own notes" ON session_notes;
CREATE POLICY "Users can update their own notes" ON session_notes
  FOR UPDATE
  USING (user_id = auth.uid());

DROP POLICY IF EXISTS "Users can delete their own notes" ON session_notes;
CREATE POLICY "Users can delete their own notes" ON session_notes
  FOR DELETE
  USING (user_id = auth.uid());

-- Políticas para session_transcripts
DROP POLICY IF EXISTS "Users can view transcripts of their sessions" ON session_transcripts;
CREATE POLICY "Users can view transcripts of their sessions" ON session_transcripts
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM video_sessions
      JOIN bookings ON bookings.id = video_sessions.booking_id
      WHERE video_sessions.id = session_transcripts.session_id
      AND bookings.user_id = auth.uid()
    )
  );

DROP POLICY IF EXISTS "System can create transcripts" ON session_transcripts;
CREATE POLICY "System can create transcripts" ON session_transcripts
  FOR INSERT
  WITH CHECK (true);

-- Políticas para session_recordings
DROP POLICY IF EXISTS "Users can view recordings of their sessions" ON session_recordings;
CREATE POLICY "Users can view recordings of their sessions" ON session_recordings
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM video_sessions
      JOIN bookings ON bookings.id = video_sessions.booking_id
      WHERE video_sessions.id = session_recordings.session_id
      AND bookings.user_id = auth.uid()
    )
  );

-- Políticas para session_analytics
DROP POLICY IF EXISTS "Users can view analytics of their sessions" ON session_analytics;
CREATE POLICY "Users can view analytics of their sessions" ON session_analytics
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM video_sessions
      JOIN bookings ON bookings.id = video_sessions.booking_id
      WHERE video_sessions.id = session_analytics.session_id
      AND bookings.user_id = auth.uid()
    )
  );

-- ============================================================
-- COMENTARIOS
-- ============================================================

COMMENT ON TABLE video_sessions IS 'Almacena información de sesiones de videollamada';
COMMENT ON TABLE session_notes IS 'Notas tomadas durante las sesiones por los usuarios';
COMMENT ON TABLE session_transcripts IS 'Transcripciones en tiempo real de las sesiones';
COMMENT ON TABLE session_recordings IS 'Información de grabaciones de sesiones';
COMMENT ON TABLE session_analytics IS 'Métricas y analytics de las sesiones';

-- ============================================================
-- DATOS DE PRUEBA (OPCIONAL - COMENTAR EN PRODUCCIÓN)
-- ============================================================

-- Insertar sesión de prueba si existe una reserva
-- INSERT INTO video_sessions (booking_id, room_name, status)
-- SELECT id, CONCAT('consulta-', id, '-test'), 'scheduled'
-- FROM bookings
-- WHERE status = 'confirmed'
-- LIMIT 1;

-- ============================================================
-- FIN DE MIGRACIÓN
-- ============================================================

