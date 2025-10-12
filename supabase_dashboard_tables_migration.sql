-- ============================================================================
-- MIGRACIÓN: Tablas para Dashboard Premium
-- Descripción: Crea todas las tablas necesarias para las funcionalidades premium
-- ============================================================================

-- Tabla: user_progress (Progreso del usuario)
CREATE TABLE IF NOT EXISTS user_progress (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  spiritual_level VARCHAR(50) DEFAULT 'Iluminado',
  light_points INTEGER DEFAULT 1500,
  consecutive_days INTEGER DEFAULT 7,
  total_sessions INTEGER DEFAULT 12,
  total_channeling INTEGER DEFAULT 25,
  completed_courses INTEGER DEFAULT 3,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id)
);

-- Tabla: user_progress_history (Historial de progreso)
CREATE TABLE IF NOT EXISTS user_progress_history (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  light_points INTEGER NOT NULL,
  spiritual_level VARCHAR(50),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabla: user_sessions (Sesiones por app)
CREATE TABLE IF NOT EXISTS user_sessions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  app_name VARCHAR(100) NOT NULL,
  duration INTEGER NOT NULL, -- en minutos
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabla: daily_messages (Mensajes diarios con IA)
CREATE TABLE IF NOT EXISTS daily_messages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  date DATE NOT NULL UNIQUE,
  angel_name VARCHAR(50) NOT NULL,
  theme VARCHAR(100) NOT NULL,
  message TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabla: notifications (Notificaciones en tiempo real)
CREATE TABLE IF NOT EXISTS notifications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  type VARCHAR(50) NOT NULL, -- evento, logro, mensaje, recomendacion, progreso
  title VARCHAR(200) NOT NULL,
  message TEXT NOT NULL,
  read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabla: eventos (Eventos y talleres)
CREATE TABLE IF NOT EXISTS eventos (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  titulo VARCHAR(200) NOT NULL,
  descripcion TEXT,
  fecha TIMESTAMP WITH TIME ZONE NOT NULL,
  hora VARCHAR(20),
  duracion VARCHAR(50),
  ubicacion VARCHAR(200),
  instructor VARCHAR(100),
  precio DECIMAL(10, 2) DEFAULT 0,
  imagen TEXT,
  capacidad INTEGER,
  inscritos INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabla: cursos (Cursos de la Academia)
CREATE TABLE IF NOT EXISTS cursos (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  nombre VARCHAR(200) NOT NULL,
  descripcion TEXT,
  nivel VARCHAR(50), -- principiante, intermedio, avanzado
  duracion VARCHAR(50),
  precio DECIMAL(10, 2) DEFAULT 0,
  imagen TEXT,
  instructor VARCHAR(100),
  modulos INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================================================
-- ÍNDICES para optimizar consultas
-- ============================================================================

CREATE INDEX IF NOT EXISTS idx_user_progress_user_id ON user_progress(user_id);
CREATE INDEX IF NOT EXISTS idx_user_progress_history_user_id ON user_progress_history(user_id);
CREATE INDEX IF NOT EXISTS idx_user_progress_history_created_at ON user_progress_history(created_at);
CREATE INDEX IF NOT EXISTS idx_user_sessions_user_id ON user_sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_user_sessions_created_at ON user_sessions(created_at);
CREATE INDEX IF NOT EXISTS idx_daily_messages_date ON daily_messages(date);
CREATE INDEX IF NOT EXISTS idx_notifications_user_id ON notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_notifications_read ON notifications(read);
CREATE INDEX IF NOT EXISTS idx_notifications_created_at ON notifications(created_at);
CREATE INDEX IF NOT EXISTS idx_eventos_fecha ON eventos(fecha);
CREATE INDEX IF NOT EXISTS idx_cursos_nivel ON cursos(nivel);

-- ============================================================================
-- TRIGGERS para updated_at
-- ============================================================================

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_user_progress_updated_at
  BEFORE UPDATE ON user_progress
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_eventos_updated_at
  BEFORE UPDATE ON eventos
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_cursos_updated_at
  BEFORE UPDATE ON cursos
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- ============================================================================
-- ROW LEVEL SECURITY (RLS)
-- ============================================================================

-- Habilitar RLS
ALTER TABLE user_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_progress_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE daily_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE eventos ENABLE ROW LEVEL SECURITY;
ALTER TABLE cursos ENABLE ROW LEVEL SECURITY;

-- Políticas para user_progress
CREATE POLICY "Users can view their own progress"
  ON user_progress FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own progress"
  ON user_progress FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own progress"
  ON user_progress FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Políticas para user_progress_history
CREATE POLICY "Users can view their own progress history"
  ON user_progress_history FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own progress history"
  ON user_progress_history FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Políticas para user_sessions
CREATE POLICY "Users can view their own sessions"
  ON user_sessions FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own sessions"
  ON user_sessions FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Políticas para daily_messages
CREATE POLICY "Anyone can view daily messages"
  ON daily_messages FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Service role can insert daily messages"
  ON daily_messages FOR INSERT
  TO service_role
  WITH CHECK (true);

-- Políticas para notifications
CREATE POLICY "Users can view their own notifications"
  ON notifications FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own notifications"
  ON notifications FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own notifications"
  ON notifications FOR DELETE
  USING (auth.uid() = user_id);

CREATE POLICY "Service role can insert notifications"
  ON notifications FOR INSERT
  TO service_role
  WITH CHECK (true);

-- Políticas para eventos
CREATE POLICY "Anyone can view eventos"
  ON eventos FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Admins can manage eventos"
  ON eventos FOR ALL
  TO service_role
  USING (true);

-- Políticas para cursos
CREATE POLICY "Anyone can view cursos"
  ON cursos FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Admins can manage cursos"
  ON cursos FOR ALL
  TO service_role
  USING (true);

-- ============================================================================
-- DATOS DE EJEMPLO (opcional, para testing)
-- ============================================================================

-- Insertar eventos de ejemplo
INSERT INTO eventos (titulo, descripcion, fecha, hora, duracion, ubicacion, instructor, precio, imagen) VALUES
('Taller de Cartas Angelicales', 'Sesión de meditación guiada para conectar con la energía de los arcángeles', '2025-01-17 19:00:00+00', '19:00', '90 min', 'Centro Angelical Madrid', 'Juan Carlos Ávila', 25.00, '/eventos/cartas-angelicales.jpg'),
('Meditación con Arcángel Miguel', 'Sesión especial de protección y fuerza con el Arcángel Miguel', '2025-01-20 18:30:00+00', '18:30', '60 min', 'Centro Angelical Madrid', 'Juan Carlos Ávila', 15.00, '/eventos/arcangel-miguel.jpg'),
('Ceremonia de Luna Llena', 'Ceremonia especial para liberar y manifestar bajo la luna llena', '2025-01-25 20:00:00+00', '20:00', '120 min', 'Centro Angelical Madrid', 'Juan Carlos Ávila', 30.00, '/eventos/luna-llena.jpg')
ON CONFLICT DO NOTHING;

-- Insertar cursos de ejemplo
INSERT INTO cursos (nombre, descripcion, nivel, duracion, precio, instructor, modulos) VALUES
('Fundamentos de Angelología', 'Curso completo sobre los arcángeles y su energía', 'principiante', '4 semanas', 99.00, 'Juan Carlos Ávila', 8),
('Canalizacion Angelical Avanzada', 'Aprende a canalizar mensajes de los arcángeles', 'avanzado', '6 semanas', 149.00, 'Juan Carlos Ávila', 12),
('Terapia con Frecuencias Sagradas', 'Domina el uso de frecuencias para sanación', 'intermedio', '5 semanas', 129.00, 'Juan Carlos Ávila', 10)
ON CONFLICT DO NOTHING;

-- ============================================================================
-- FIN DE LA MIGRACIÓN
-- ============================================================================

COMMENT ON TABLE user_progress IS 'Almacena el progreso actual de cada usuario';
COMMENT ON TABLE user_progress_history IS 'Historial de evolución del progreso del usuario';
COMMENT ON TABLE user_sessions IS 'Registro de sesiones del usuario en cada aplicación';
COMMENT ON TABLE daily_messages IS 'Mensajes diarios generados con IA por arcángel';
COMMENT ON TABLE notifications IS 'Notificaciones en tiempo real para los usuarios';
COMMENT ON TABLE eventos IS 'Eventos, talleres y ceremonias';
COMMENT ON TABLE cursos IS 'Cursos de la Academia Angélica';

