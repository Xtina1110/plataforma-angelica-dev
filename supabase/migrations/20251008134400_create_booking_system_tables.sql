/*
  # Sistema de Reservas - Tablas Completas

  1. Nueva Tablas
    - `services` - Servicios disponibles para reservar
      - `id` (uuid, primary key)
      - `name` (text) - Nombre del servicio
      - `description` (text) - Descripción del servicio
      - `category` (text) - Categoría (apertura_angelical, terapias, etc)
      - `duration` (integer) - Duración en minutos
      - `price` (decimal) - Precio del servicio
      - `is_active` (boolean) - Si está activo
      - `created_at` (timestamp)

    - `therapists` - Terapeutas/profesionales disponibles
      - `id` (uuid, primary key)
      - `name` (text) - Nombre del terapeuta
      - `email` (text) - Email
      - `phone` (text) - Teléfono
      - `bio` (text) - Biografía
      - `specialties` (text[]) - Especialidades
      - `avatar_url` (text) - URL de imagen
      - `is_active` (boolean)
      - `created_at` (timestamp)

    - `availability_schedules` - Horarios de disponibilidad
      - `id` (uuid, primary key)
      - `therapist_id` (uuid, foreign key)
      - `day_of_week` (integer) - 0-6 (domingo-sábado)
      - `start_time` (time) - Hora de inicio
      - `end_time` (time) - Hora de fin
      - `is_available` (boolean)
      - `created_at` (timestamp)

    - `bookings` - Reservas de los usuarios
      - `id` (uuid, primary key)
      - `user_id` (uuid, foreign key)
      - `service_id` (uuid, foreign key)
      - `therapist_id` (uuid, foreign key)
      - `booking_date` (date) - Fecha de la reserva
      - `start_time` (time) - Hora de inicio
      - `end_time` (time) - Hora de fin
      - `duration` (integer) - Duración en minutos
      - `total_price` (decimal) - Precio total
      - `status` (text) - pending, confirmed, cancelled, completed
      - `notes` (text) - Notas adicionales
      - `reminder_preferences` (jsonb) - Preferencias de recordatorios
      - `created_at` (timestamp)

  2. Seguridad
    - Habilitar RLS en todas las tablas
    - Políticas para lectura pública de servicios y terapeutas
    - Políticas para que usuarios gestionen sus propias reservas
    - Políticas para que terapeutas vean sus horarios y reservas
*/

-- Crear tabla de servicios
CREATE TABLE IF NOT EXISTS services (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text,
  category text NOT NULL DEFAULT 'general',
  duration integer NOT NULL DEFAULT 60,
  price decimal(10,2) NOT NULL DEFAULT 0,
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now()
);

-- Crear tabla de terapeutas
CREATE TABLE IF NOT EXISTS therapists (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  email text,
  phone text,
  bio text,
  specialties text[],
  avatar_url text,
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now()
);

-- Crear tabla de horarios de disponibilidad
CREATE TABLE IF NOT EXISTS availability_schedules (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  therapist_id uuid REFERENCES therapists(id) ON DELETE CASCADE,
  day_of_week integer NOT NULL CHECK (day_of_week >= 0 AND day_of_week <= 6),
  start_time time NOT NULL,
  end_time time NOT NULL,
  is_available boolean DEFAULT true,
  created_at timestamptz DEFAULT now()
);

-- Crear tabla de reservas
CREATE TABLE IF NOT EXISTS bookings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  service_id uuid REFERENCES services(id) ON DELETE RESTRICT,
  therapist_id uuid REFERENCES therapists(id) ON DELETE RESTRICT,
  booking_date date NOT NULL,
  start_time time NOT NULL,
  end_time time NOT NULL,
  duration integer NOT NULL DEFAULT 60,
  total_price decimal(10,2) NOT NULL,
  status text DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'cancelled', 'completed')),
  notes text,
  reminder_preferences jsonb DEFAULT '{"email": true, "sms": false, "whatsapp": false}'::jsonb,
  created_at timestamptz DEFAULT now()
);

-- Habilitar RLS
ALTER TABLE services ENABLE ROW LEVEL SECURITY;
ALTER TABLE therapists ENABLE ROW LEVEL SECURITY;
ALTER TABLE availability_schedules ENABLE ROW LEVEL SECURITY;
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;

-- Políticas para services (lectura pública)
CREATE POLICY "Servicios visibles para todos"
  ON services FOR SELECT
  TO authenticated
  USING (is_active = true);

-- Políticas para therapists (lectura pública)
CREATE POLICY "Terapeutas visibles para todos"
  ON therapists FOR SELECT
  TO authenticated
  USING (is_active = true);

-- Políticas para availability_schedules (lectura pública)
CREATE POLICY "Horarios visibles para todos"
  ON availability_schedules FOR SELECT
  TO authenticated
  USING (is_available = true);

-- Políticas para bookings
CREATE POLICY "Usuarios pueden ver sus propias reservas"
  ON bookings FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Usuarios pueden crear reservas"
  ON bookings FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Usuarios pueden actualizar sus propias reservas"
  ON bookings FOR UPDATE
  TO authenticated
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

-- Índices para mejorar el rendimiento
CREATE INDEX IF NOT EXISTS idx_bookings_user_id ON bookings(user_id);
CREATE INDEX IF NOT EXISTS idx_bookings_therapist_id ON bookings(therapist_id);
CREATE INDEX IF NOT EXISTS idx_bookings_date ON bookings(booking_date);
CREATE INDEX IF NOT EXISTS idx_bookings_status ON bookings(status);
CREATE INDEX IF NOT EXISTS idx_availability_therapist ON availability_schedules(therapist_id);

-- Insertar datos de ejemplo para servicios
INSERT INTO services (name, description, category, duration, price, is_active) VALUES
  ('Tirada de 3 Cartas', 'Lectura rápida de pasado, presente y futuro', 'apertura_angelical', 30, 25.00, true),
  ('Tirada de 6 Cartas', 'Análisis completo de vida', 'apertura_angelical', 45, 40.00, true),
  ('Tirada de 9 Cartas', 'Lectura profunda del alma', 'apertura_angelical', 60, 55.00, true),
  ('Limpieza Energética', 'Limpieza profunda de energías negativas', 'terapias', 60, 50.00, true),
  ('Sanación con Cristales', 'Terapia de equilibrio con cristales', 'terapias', 45, 45.00, true),
  ('Sesión de Sonoterapia', 'Terapia con cuencos tibetanos', 'sonoterapia', 60, 60.00, true)
ON CONFLICT DO NOTHING;

-- Insertar datos de ejemplo para terapeutas
INSERT INTO therapists (name, email, phone, bio, specialties, is_active) VALUES
  ('María González', 'maria@example.com', '+1234567890', 'Especialista en lecturas angelicales con 10 años de experiencia', ARRAY['Cartas Angelicales', 'Tarot', 'Numerología'], true),
  ('Juan Pérez', 'juan@example.com', '+1234567891', 'Terapeuta holístico certificado', ARRAY['Reiki', 'Cristales', 'Limpieza Energética'], true),
  ('Ana Martínez', 'ana@example.com', '+1234567892', 'Maestra de sonoterapia y meditación', ARRAY['Cuencos Tibetanos', 'Meditación Guiada', 'Terapia de Sonido'], true)
ON CONFLICT DO NOTHING;

-- Insertar horarios de disponibilidad (ejemplo: Lunes a Viernes, 9am-6pm)
DO $$
DECLARE
  therapist_record RECORD;
  day_num integer;
BEGIN
  FOR therapist_record IN SELECT id FROM therapists LOOP
    FOR day_num IN 1..5 LOOP  -- Lunes a Viernes
      INSERT INTO availability_schedules (therapist_id, day_of_week, start_time, end_time, is_available)
      VALUES 
        (therapist_record.id, day_num, '09:00', '13:00', true),
        (therapist_record.id, day_num, '14:00', '18:00', true)
      ON CONFLICT DO NOTHING;
    END LOOP;
  END LOOP;
END $$;
