-- Crear tabla de servicios
CREATE TABLE public.services (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  category TEXT NOT NULL, -- 'apertura_angelical', 'terapia', 'limpieza', 'ritual'
  duration INTEGER NOT NULL, -- duración en minutos
  price DECIMAL(10,2) NOT NULL,
  benefits TEXT[], -- array de beneficios
  image_url TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Crear tabla de terapeutas/lectores
CREATE TABLE public.therapists (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  specialties TEXT[], -- especialidades: 'apertura_angelical', 'terapia', 'limpieza', etc.
  bio TEXT,
  experience_years INTEGER,
  rating DECIMAL(3,2) DEFAULT 5.0,
  languages TEXT[] DEFAULT ARRAY['Español'],
  image_url TEXT,
  hourly_rate DECIMAL(10,2),
  is_active BOOLEAN DEFAULT true,
  timezone TEXT DEFAULT 'America/Mexico_City',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Crear tabla de horarios de disponibilidad
CREATE TABLE public.availability_schedules (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  therapist_id UUID REFERENCES public.therapists(id) ON DELETE CASCADE,
  day_of_week INTEGER NOT NULL, -- 0=Domingo, 1=Lunes, ..., 6=Sábado
  start_time TIME NOT NULL,
  end_time TIME NOT NULL,
  is_available BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Crear tabla de reservas
CREATE TABLE public.bookings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  service_id UUID REFERENCES public.services(id),
  therapist_id UUID REFERENCES public.therapists(id),
  booking_date DATE NOT NULL,
  start_time TIME NOT NULL,
  end_time TIME NOT NULL,
  duration INTEGER NOT NULL, -- duración en minutos
  total_price DECIMAL(10,2) NOT NULL,
  status TEXT DEFAULT 'pending', -- 'pending', 'confirmed', 'completed', 'cancelled', 'no_show'
  payment_status TEXT DEFAULT 'pending', -- 'pending', 'paid', 'refunded'
  payment_id TEXT, -- ID de Stripe
  notes TEXT, -- notas del cliente
  therapist_notes TEXT, -- notas del terapeuta
  reminder_preferences JSONB DEFAULT '{"email": true, "sms": false, "whatsapp": false}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Crear tabla de recordatorios
CREATE TABLE public.booking_reminders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  booking_id UUID REFERENCES public.bookings(id) ON DELETE CASCADE,
  reminder_type TEXT NOT NULL, -- 'email', 'sms', 'whatsapp', 'push'
  scheduled_time TIMESTAMPTZ NOT NULL,
  message TEXT NOT NULL,
  status TEXT DEFAULT 'scheduled', -- 'scheduled', 'sent', 'failed'
  sent_at TIMESTAMPTZ,
  error_message TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Habilitar RLS en todas las tablas
ALTER TABLE public.services ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.therapists ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.availability_schedules ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.booking_reminders ENABLE ROW LEVEL SECURITY;

-- Políticas para servicios (públicos para lectura)
CREATE POLICY "Services are publicly readable" ON public.services
FOR SELECT USING (true);

CREATE POLICY "Only admins can manage services" ON public.services
FOR ALL USING (get_user_role() = 'admin');

-- Políticas para terapeutas (públicos para lectura)
CREATE POLICY "Therapists are publicly readable" ON public.therapists
FOR SELECT USING (is_active = true);

CREATE POLICY "Only admins can manage therapists" ON public.therapists
FOR ALL USING (get_user_role() = 'admin');

-- Políticas para horarios (públicos para lectura)
CREATE POLICY "Schedules are publicly readable" ON public.availability_schedules
FOR SELECT USING (is_available = true);

CREATE POLICY "Only admins can manage schedules" ON public.availability_schedules
FOR ALL USING (get_user_role() = 'admin');

-- Políticas para reservas
CREATE POLICY "Users can view their own bookings" ON public.bookings
FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "Users can create their own bookings" ON public.bookings
FOR INSERT WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update their own bookings" ON public.bookings
FOR UPDATE USING (user_id = auth.uid());

CREATE POLICY "Admins can manage all bookings" ON public.bookings
FOR ALL USING (get_user_role() = 'admin');

-- Políticas para recordatorios
CREATE POLICY "Users can view their booking reminders" ON public.booking_reminders
FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM public.bookings 
    WHERE bookings.id = booking_reminders.booking_id 
    AND bookings.user_id = auth.uid()
  )
);

CREATE POLICY "System can manage reminders" ON public.booking_reminders
FOR ALL USING (true);

-- Crear índices para mejorar rendimiento
CREATE INDEX idx_bookings_user_id ON public.bookings(user_id);
CREATE INDEX idx_bookings_date ON public.bookings(booking_date);
CREATE INDEX idx_bookings_therapist_date ON public.bookings(therapist_id, booking_date);
CREATE INDEX idx_availability_therapist_day ON public.availability_schedules(therapist_id, day_of_week);
CREATE INDEX idx_reminders_scheduled_time ON public.booking_reminders(scheduled_time);
CREATE INDEX idx_services_category ON public.services(category);

-- Triggers para updated_at
CREATE TRIGGER update_services_updated_at
  BEFORE UPDATE ON public.services
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_therapists_updated_at
  BEFORE UPDATE ON public.therapists
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_bookings_updated_at
  BEFORE UPDATE ON public.bookings
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Insertar datos de ejemplo
INSERT INTO public.therapists (name, specialties, bio, experience_years, rating, languages, hourly_rate) VALUES
('Luna Celestial', ARRAY['apertura_angelical', 'terapia'], 'Maestra en canalizaciones angelicales con 15 años de experiencia conectando con la energía divina.', 15, 4.9, ARRAY['Español', 'Inglés'], 120.00),
('Gabriel Sanador', ARRAY['terapia', 'limpieza'], 'Terapeuta holístico especializado en sanación energética y limpiezas profundas del aura.', 12, 4.8, ARRAY['Español'], 100.00),
('Miguel Protector', ARRAY['limpieza', 'ritual'], 'Experto en rituales de protección y limpieza de espacios con técnicas ancestrales y angelicales.', 20, 5.0, ARRAY['Español', 'Portugués'], 150.00),
('Uriel Cristal', ARRAY['terapia', 'apertura_angelical'], 'Especialista en terapia con cristales y aperturas de chakras guiadas por ángeles.', 8, 4.7, ARRAY['Español', 'Inglés', 'Francés'], 90.00);

INSERT INTO public.services (name, description, category, duration, price, benefits) VALUES
('Apertura Angelical Personal', 'Sesión de apertura y conexión con tu ángel guardián para recibir mensajes y guía divina.', 'apertura_angelical', 60, 89.99, ARRAY['Conexión angelical directa', 'Mensajes personalizados', 'Activación de dones espirituales', 'Protección energética']),
('Terapia de Sanación Angelical', 'Terapia energética guiada por ángeles para sanar cuerpo, mente y espíritu.', 'terapia', 75, 109.99, ARRAY['Sanación integral', 'Equilibrio energético', 'Liberación de bloqueos', 'Elevación vibratoria']),
('Limpieza Energética Personal', 'Ritual de limpieza profunda del aura y eliminación de energías negativas.', 'limpieza', 45, 69.99, ARRAY['Purificación del aura', 'Eliminación de energías densas', 'Protección energética', 'Restauración del equilibrio']),
('Limpieza de Hogar', 'Limpieza energética completa de espacios para armonizar y proteger tu hogar.', 'limpieza', 120, 149.99, ARRAY['Purificación del espacio', 'Armonización energética', 'Protección permanente', 'Activación de prosperidad']),
('Ritual de Abundancia', 'Ritual angelical para abrir canales de prosperidad y manifestar abundancia.', 'ritual', 90, 129.99, ARRAY['Activación de abundancia', 'Eliminación de bloqueos financieros', 'Programación de metas', 'Conexión con ángeles de prosperidad']),
('Terapia con Cristales Angelicales', 'Combinación de cristales y energía angelical para sanación específica.', 'terapia', 60, 99.99, ARRAY['Sanación con cristales', 'Guía angelical', 'Activación de chakras', 'Programación energética']);

-- Horarios de disponibilidad para los terapeutas (Lunes a Viernes, 9 AM a 6 PM)
INSERT INTO public.availability_schedules (therapist_id, day_of_week, start_time, end_time) 
SELECT t.id, d.day, '09:00'::TIME, '18:00'::TIME
FROM public.therapists t
CROSS JOIN (VALUES (1), (2), (3), (4), (5)) AS d(day)
WHERE t.name IN ('Luna Celestial', 'Gabriel Sanador', 'Miguel Protector', 'Uriel Cristal');

-- También agregar algunos horarios de fin de semana para algunos terapeutas
INSERT INTO public.availability_schedules (therapist_id, day_of_week, start_time, end_time) 
SELECT t.id, d.day, '10:00'::TIME, '16:00'::TIME
FROM public.therapists t
CROSS JOIN (VALUES (0), (6)) AS d(day)
WHERE t.name IN ('Luna Celestial', 'Miguel Protector');