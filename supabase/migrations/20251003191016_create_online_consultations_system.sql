/*
  # Sistema de Consultas Online en Vivo

  ## Descripción
  Sistema completo para consultas angelicales en vivo con videoconferencia profesional,
  reservas, pagos, grabaciones y salas temáticas.

  ## Nuevas Tablas

  ### `readers` (Lectores Especializados)
  - `id` (uuid, PK) - ID único del lector
  - `user_id` (uuid, FK) - Referencia al usuario
  - `name` (text) - Nombre completo
  - `specialties` (text[]) - Especialidades (amor, trabajo, salud, etc.)
  - `bio` (text) - Biografía profesional
  - `hourly_rate` (numeric) - Tarifa base por hora ($200 USD)
  - `available_hours` (jsonb) - Horarios disponibles por día
  - `rating` (numeric) - Calificación promedio
  - `total_sessions` (integer) - Total de sesiones realizadas
  - `languages` (text[]) - Idiomas que habla
  - `avatar_url` (text) - URL de foto de perfil
  - `is_active` (boolean) - Si está aceptando reservas
  - `created_at` (timestamptz) - Fecha de creación
  - `updated_at` (timestamptz) - Última actualización

  ### `consultation_bookings` (Reservas de Consultas)
  - `id` (uuid, PK) - ID único de la reserva
  - `user_id` (uuid, FK) - Usuario que reserva
  - `reader_id` (uuid, FK) - Lector asignado
  - `scheduled_at` (timestamptz) - Fecha y hora programada
  - `duration_minutes` (integer) - Duración en minutos (60 base)
  - `theme` (text) - Tema especializado (amor, trabajo, etc.)
  - `card_spread_type` (text) - Tipo de apertura (3, 6, 9 cartas)
  - `status` (text) - Estado: pending, confirmed, in_progress, completed, cancelled
  - `total_amount` (numeric) - Monto total a pagar
  - `payment_status` (text) - Estado del pago: pending, paid, refunded
  - `payment_id` (text) - ID de transacción de pago
  - `timezone` (text) - Zona horaria del usuario
  - `notes` (text) - Notas adicionales del usuario
  - `created_at` (timestamptz) - Fecha de creación
  - `updated_at` (timestamptz) - Última actualización

  ### `consultation_sessions` (Sesiones en Vivo)
  - `id` (uuid, PK) - ID único de la sesión
  - `booking_id` (uuid, FK) - Referencia a la reserva
  - `room_id` (text) - ID único de la sala de video
  - `started_at` (timestamptz) - Hora de inicio real
  - `ended_at` (timestamptz) - Hora de fin real
  - `actual_duration_minutes` (integer) - Duración real
  - `recording_url` (text) - URL de la grabación
  - `recording_status` (text) - Estado: processing, ready, failed
  - `cards_drawn` (jsonb) - Cartas seleccionadas durante la sesión
  - `ai_interpretation` (jsonb) - Interpretación IA generada
  - `chat_transcript` (jsonb) - Transcripción del chat
  - `connection_quality` (jsonb) - Métricas de conexión
  - `created_at` (timestamptz) - Fecha de creación
  - `updated_at` (timestamptz) - Última actualización

  ### `session_extensions` (Extensiones de Sesión)
  - `id` (uuid, PK) - ID único de extensión
  - `session_id` (uuid, FK) - Sesión a extender
  - `extension_minutes` (integer) - Minutos adicionales (15 o 30)
  - `extension_amount` (numeric) - Costo adicional ($50 o $95)
  - `payment_status` (text) - Estado del pago
  - `payment_id` (text) - ID de transacción
  - `approved_at` (timestamptz) - Cuándo se aprobó
  - `created_at` (timestamptz) - Fecha de solicitud

  ### `session_ratings` (Calificaciones de Sesión)
  - `id` (uuid, PK) - ID único
  - `session_id` (uuid, FK) - Sesión calificada
  - `user_id` (uuid, FK) - Usuario que califica
  - `reader_id` (uuid, FK) - Lector calificado
  - `rating` (integer) - Calificación 1-5
  - `comment` (text) - Comentario opcional
  - `created_at` (timestamptz) - Fecha de calificación

  ### `themed_rooms` (Salas Temáticas)
  - `id` (uuid, PK) - ID único
  - `theme` (text) - Tema (general, amor, trabajo, etc.)
  - `name` (text) - Nombre de la sala
  - `background_video_url` (text) - Video de fondo
  - `background_image_url` (text) - Imagen de fondo
  - `ambient_music_url` (text) - Música ambiental
  - `color_scheme` (jsonb) - Esquema de colores
  - `is_active` (boolean) - Si está activa
  - `created_at` (timestamptz) - Fecha de creación

  ## Seguridad (RLS)
  - Los usuarios solo pueden ver sus propias reservas y sesiones
  - Los lectores pueden ver sus sesiones asignadas
  - Las extensiones requieren pago confirmado
  - Las grabaciones solo son accesibles para participantes de la sesión

  ## Notas Importantes
  1. Las sesiones base son de 60 minutos a $200 USD
  2. Extensiones: +$50 (15 min) o +$95 (30 min)
  3. Tema especializado: +$25 USD
  4. Grabación HD: +$30 USD
  5. Sistema de recordatorios multicanal integrado
  6. Zonas horarias automáticas por usuario
*/

-- Tabla de lectores especializados
CREATE TABLE IF NOT EXISTS readers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  name text NOT NULL,
  specialties text[] DEFAULT '{}',
  bio text,
  hourly_rate numeric DEFAULT 200.00,
  available_hours jsonb DEFAULT '{}',
  rating numeric DEFAULT 0,
  total_sessions integer DEFAULT 0,
  languages text[] DEFAULT '{"es"}',
  avatar_url text,
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Tabla de reservas de consultas
CREATE TABLE IF NOT EXISTS consultation_bookings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  reader_id uuid REFERENCES readers(id) ON DELETE SET NULL,
  scheduled_at timestamptz NOT NULL,
  duration_minutes integer DEFAULT 60,
  theme text NOT NULL,
  card_spread_type text DEFAULT '3',
  status text DEFAULT 'pending',
  total_amount numeric DEFAULT 200.00,
  payment_status text DEFAULT 'pending',
  payment_id text,
  timezone text DEFAULT 'UTC',
  notes text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  CONSTRAINT valid_status CHECK (status IN ('pending', 'confirmed', 'in_progress', 'completed', 'cancelled')),
  CONSTRAINT valid_payment_status CHECK (payment_status IN ('pending', 'paid', 'refunded')),
  CONSTRAINT valid_card_spread CHECK (card_spread_type IN ('3', '6', '9'))
);

-- Tabla de sesiones en vivo
CREATE TABLE IF NOT EXISTS consultation_sessions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  booking_id uuid REFERENCES consultation_bookings(id) ON DELETE CASCADE NOT NULL,
  room_id text UNIQUE NOT NULL,
  started_at timestamptz,
  ended_at timestamptz,
  actual_duration_minutes integer,
  recording_url text,
  recording_status text DEFAULT 'pending',
  cards_drawn jsonb DEFAULT '[]',
  ai_interpretation jsonb DEFAULT '[]',
  chat_transcript jsonb DEFAULT '[]',
  connection_quality jsonb DEFAULT '{}',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  CONSTRAINT valid_recording_status CHECK (recording_status IN ('pending', 'processing', 'ready', 'failed'))
);

-- Tabla de extensiones de sesión
CREATE TABLE IF NOT EXISTS session_extensions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id uuid REFERENCES consultation_sessions(id) ON DELETE CASCADE NOT NULL,
  extension_minutes integer NOT NULL,
  extension_amount numeric NOT NULL,
  payment_status text DEFAULT 'pending',
  payment_id text,
  approved_at timestamptz,
  created_at timestamptz DEFAULT now(),
  CONSTRAINT valid_extension CHECK (extension_minutes IN (15, 30)),
  CONSTRAINT valid_extension_payment CHECK (payment_status IN ('pending', 'paid', 'failed'))
);

-- Tabla de calificaciones
CREATE TABLE IF NOT EXISTS session_ratings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id uuid REFERENCES consultation_sessions(id) ON DELETE CASCADE NOT NULL,
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  reader_id uuid REFERENCES readers(id) ON DELETE CASCADE NOT NULL,
  rating integer NOT NULL,
  comment text,
  created_at timestamptz DEFAULT now(),
  CONSTRAINT valid_rating CHECK (rating >= 1 AND rating <= 5),
  CONSTRAINT unique_session_rating UNIQUE (session_id, user_id)
);

-- Tabla de salas temáticas
CREATE TABLE IF NOT EXISTS themed_rooms (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  theme text UNIQUE NOT NULL,
  name text NOT NULL,
  background_video_url text,
  background_image_url text,
  ambient_music_url text,
  color_scheme jsonb DEFAULT '{}',
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now()
);

-- Índices para optimizar consultas
CREATE INDEX IF NOT EXISTS idx_bookings_user_id ON consultation_bookings(user_id);
CREATE INDEX IF NOT EXISTS idx_bookings_reader_id ON consultation_bookings(reader_id);
CREATE INDEX IF NOT EXISTS idx_bookings_scheduled_at ON consultation_bookings(scheduled_at);
CREATE INDEX IF NOT EXISTS idx_bookings_status ON consultation_bookings(status);
CREATE INDEX IF NOT EXISTS idx_sessions_booking_id ON consultation_sessions(booking_id);
CREATE INDEX IF NOT EXISTS idx_sessions_room_id ON consultation_sessions(room_id);
CREATE INDEX IF NOT EXISTS idx_readers_active ON readers(is_active);
CREATE INDEX IF NOT EXISTS idx_readers_specialties ON readers USING gin(specialties);

-- Habilitar RLS en todas las tablas
ALTER TABLE readers ENABLE ROW LEVEL SECURITY;
ALTER TABLE consultation_bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE consultation_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE session_extensions ENABLE ROW LEVEL SECURITY;
ALTER TABLE session_ratings ENABLE ROW LEVEL SECURITY;
ALTER TABLE themed_rooms ENABLE ROW LEVEL SECURITY;

-- Políticas RLS para readers
CREATE POLICY "Lectores pueden ver su propio perfil"
  ON readers FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Lectores pueden actualizar su perfil"
  ON readers FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Todos pueden ver lectores activos"
  ON readers FOR SELECT
  TO authenticated
  USING (is_active = true);

-- Políticas RLS para consultation_bookings
CREATE POLICY "Usuarios pueden ver sus propias reservas"
  ON consultation_bookings FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Usuarios pueden crear reservas"
  ON consultation_bookings FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Usuarios pueden actualizar sus reservas"
  ON consultation_bookings FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Lectores pueden ver sus reservas asignadas"
  ON consultation_bookings FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM readers
      WHERE readers.id = consultation_bookings.reader_id
      AND readers.user_id = auth.uid()
    )
  );

-- Políticas RLS para consultation_sessions
CREATE POLICY "Usuarios pueden ver sus sesiones"
  ON consultation_sessions FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM consultation_bookings
      WHERE consultation_bookings.id = consultation_sessions.booking_id
      AND consultation_bookings.user_id = auth.uid()
    )
  );

CREATE POLICY "Lectores pueden ver sus sesiones"
  ON consultation_sessions FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM consultation_bookings cb
      JOIN readers r ON r.id = cb.reader_id
      WHERE cb.id = consultation_sessions.booking_id
      AND r.user_id = auth.uid()
    )
  );

CREATE POLICY "Lectores pueden actualizar sesiones"
  ON consultation_sessions FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM consultation_bookings cb
      JOIN readers r ON r.id = cb.reader_id
      WHERE cb.id = consultation_sessions.booking_id
      AND r.user_id = auth.uid()
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM consultation_bookings cb
      JOIN readers r ON r.id = cb.reader_id
      WHERE cb.id = consultation_sessions.booking_id
      AND r.user_id = auth.uid()
    )
  );

-- Políticas RLS para session_extensions
CREATE POLICY "Usuarios pueden ver extensiones de sus sesiones"
  ON session_extensions FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM consultation_sessions cs
      JOIN consultation_bookings cb ON cb.id = cs.booking_id
      WHERE cs.id = session_extensions.session_id
      AND cb.user_id = auth.uid()
    )
  );

CREATE POLICY "Usuarios pueden solicitar extensiones"
  ON session_extensions FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM consultation_sessions cs
      JOIN consultation_bookings cb ON cb.id = cs.booking_id
      WHERE cs.id = session_extensions.session_id
      AND cb.user_id = auth.uid()
    )
  );

-- Políticas RLS para session_ratings
CREATE POLICY "Usuarios pueden ver sus calificaciones"
  ON session_ratings FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Usuarios pueden crear calificaciones"
  ON session_ratings FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Lectores pueden ver sus calificaciones"
  ON session_ratings FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM readers
      WHERE readers.id = session_ratings.reader_id
      AND readers.user_id = auth.uid()
    )
  );

-- Políticas RLS para themed_rooms
CREATE POLICY "Todos pueden ver salas activas"
  ON themed_rooms FOR SELECT
  TO authenticated
  USING (is_active = true);

-- Función para actualizar updated_at automáticamente
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers para actualizar updated_at
DROP TRIGGER IF EXISTS update_readers_updated_at ON readers;
CREATE TRIGGER update_readers_updated_at
  BEFORE UPDATE ON readers
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_bookings_updated_at ON consultation_bookings;
CREATE TRIGGER update_bookings_updated_at
  BEFORE UPDATE ON consultation_bookings
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_sessions_updated_at ON consultation_sessions;
CREATE TRIGGER update_sessions_updated_at
  BEFORE UPDATE ON consultation_sessions
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Insertar salas temáticas por defecto
INSERT INTO themed_rooms (theme, name, color_scheme, is_active) VALUES
  ('general', 'Sala Celestial - Visión Integral', '{"primary": "#d4af37", "secondary": "#ffffff", "accent": "#f59e0b"}', true),
  ('amor', 'Sala del Corazón - Amor y Relaciones', '{"primary": "#ec4899", "secondary": "#fda4af", "accent": "#f472b6"}', true),
  ('trabajo', 'Sala de Abundancia - Trabajo y Prosperidad', '{"primary": "#10b981", "secondary": "#d4af37", "accent": "#34d399"}', true),
  ('salud', 'Sala Sanadora - Salud y Bienestar', '{"primary": "#3b82f6", "secondary": "#10b981", "accent": "#60a5fa"}', true),
  ('proposito', 'Sala del Destino - Propósito y Misión', '{"primary": "#8b5cf6", "secondary": "#c0c0c0", "accent": "#a78bfa"}', true),
  ('crecimiento', 'Sala del Alma - Crecimiento Espiritual', '{"primary": "#7c3aed", "secondary": "#ffffff", "accent": "#a78bfa"}', true)
ON CONFLICT (theme) DO NOTHING;
