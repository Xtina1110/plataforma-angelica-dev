-- ============================================
-- PLATAFORMA ANGÉLICA - DASHBOARD PREMIUM
-- Migración Completa de Tablas
-- ============================================

-- 1. DAILY MESSAGES (Mensajes Angélicos con IA)
-- ============================================
CREATE TABLE IF NOT EXISTS daily_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  archangel_name VARCHAR(50) NOT NULL,
  archangel_attribute VARCHAR(100) NOT NULL,
  message_text TEXT NOT NULL,
  generated_date DATE NOT NULL DEFAULT CURRENT_DATE,
  day_of_week INTEGER NOT NULL, -- 0=Domingo, 6=Sábado
  is_ai_generated BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  
  -- Constraint: Un mensaje por usuario por día
  UNIQUE(user_id, generated_date)
);

CREATE INDEX idx_daily_messages_user_date ON daily_messages(user_id, generated_date DESC);
CREATE INDEX idx_daily_messages_user_created ON daily_messages(user_id, created_at DESC);

-- RLS Policies
ALTER TABLE daily_messages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own messages"
  ON daily_messages FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own messages"
  ON daily_messages FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- ============================================
-- 2. USER ACTIVITY (Actividad y Racha)
-- ============================================
CREATE TABLE IF NOT EXISTS user_activity (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL UNIQUE,
  last_login TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
  consecutive_days INTEGER DEFAULT 1,
  total_logins INTEGER DEFAULT 1,
  longest_streak INTEGER DEFAULT 1,
  current_streak_start DATE DEFAULT CURRENT_DATE,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
  
  UNIQUE(user_id)
);

CREATE INDEX idx_user_activity_user ON user_activity(user_id);

-- RLS Policies
ALTER TABLE user_activity ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own activity"
  ON user_activity FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own activity"
  ON user_activity FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own activity"
  ON user_activity FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- ============================================
-- 3. USER SESSIONS (Sesiones Completadas)
-- ============================================
CREATE TABLE IF NOT EXISTS user_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  session_type VARCHAR(50) NOT NULL, -- 'tirada', 'canalizacion', 'terapia', etc.
  session_name VARCHAR(200),
  duration_minutes INTEGER,
  completed_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
  light_points_earned INTEGER DEFAULT 0,
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

CREATE INDEX idx_user_sessions_user ON user_sessions(user_id, completed_at DESC);
CREATE INDEX idx_user_sessions_type ON user_sessions(session_type);

-- RLS Policies
ALTER TABLE user_sessions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own sessions"
  ON user_sessions FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own sessions"
  ON user_sessions FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- ============================================
-- 4. CART ITEMS (Carrito de Compra)
-- ============================================
CREATE TABLE IF NOT EXISTS cart_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  item_type VARCHAR(50) NOT NULL, -- 'event', 'course', 'product'
  item_id UUID NOT NULL,
  item_name VARCHAR(200) NOT NULL,
  item_price DECIMAL(10, 2) NOT NULL,
  quantity INTEGER DEFAULT 1,
  added_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
  
  UNIQUE(user_id, item_type, item_id)
);

CREATE INDEX idx_cart_items_user ON cart_items(user_id);

-- RLS Policies
ALTER TABLE cart_items ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage their own cart"
  ON cart_items FOR ALL
  USING (auth.uid() = user_id);

-- ============================================
-- 5. NOTIFICATIONS (Notificaciones)
-- ============================================
CREATE TABLE IF NOT EXISTS notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  title VARCHAR(200) NOT NULL,
  message TEXT NOT NULL,
  notification_type VARCHAR(50) NOT NULL, -- 'event', 'achievement', 'message', 'reminder'
  link_url VARCHAR(500),
  is_read BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
  read_at TIMESTAMP WITH TIME ZONE
);

CREATE INDEX idx_notifications_user_unread ON notifications(user_id, is_read, created_at DESC);

-- RLS Policies
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own notifications"
  ON notifications FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own notifications"
  ON notifications FOR UPDATE
  USING (auth.uid() = user_id);

-- ============================================
-- 6. ACHIEVEMENTS (Logros Disponibles)
-- ============================================
CREATE TABLE IF NOT EXISTS achievements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(100) NOT NULL UNIQUE,
  description TEXT NOT NULL,
  icon_name VARCHAR(50),
  category VARCHAR(50), -- 'progress', 'social', 'learning', 'dedication'
  points_reward INTEGER DEFAULT 0,
  requirement_type VARCHAR(50), -- 'sessions_count', 'consecutive_days', 'points_total', etc.
  requirement_value INTEGER,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- Insertar logros predefinidos
INSERT INTO achievements (name, description, icon_name, category, points_reward, requirement_type, requirement_value) VALUES
('Primera Sesión', 'Completaste tu primera sesión angelical', 'star', 'progress', 10, 'sessions_count', 1),
('Racha de 7 Días', 'Mantuviste una racha de 7 días consecutivos', 'calendar', 'dedication', 50, 'consecutive_days', 7),
('100 Puntos de Luz', 'Alcanzaste 100 puntos de luz', 'light', 'progress', 25, 'points_total', 100),
('Primer Curso', 'Completaste tu primer curso angelical', 'graduation', 'learning', 30, 'courses_completed', 1),
('10 Sesiones', 'Completaste 10 sesiones angelicales', 'heart', 'progress', 40, 'sessions_count', 10),
('Racha de 30 Días', 'Mantuviste una racha de 30 días consecutivos', 'fire', 'dedication', 100, 'consecutive_days', 30),
('500 Puntos de Luz', 'Alcanzaste 500 puntos de luz', 'star-full', 'progress', 75, 'points_total', 500),
('Maestro Angelical', 'Completaste 5 cursos angelicales', 'crown', 'learning', 150, 'courses_completed', 5)
ON CONFLICT (name) DO NOTHING;

-- RLS Policies
ALTER TABLE achievements ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Everyone can view achievements"
  ON achievements FOR SELECT
  TO authenticated
  USING (true);

-- ============================================
-- 7. USER ACHIEVEMENTS (Logros Desbloqueados)
-- ============================================
CREATE TABLE IF NOT EXISTS user_achievements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  achievement_id UUID REFERENCES achievements(id) ON DELETE CASCADE NOT NULL,
  unlocked_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
  
  UNIQUE(user_id, achievement_id)
);

CREATE INDEX idx_user_achievements_user ON user_achievements(user_id, unlocked_at DESC);

-- RLS Policies
ALTER TABLE user_achievements ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own achievements"
  ON user_achievements FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can unlock achievements"
  ON user_achievements FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- ============================================
-- 8. ACTUALIZAR profiles SI NO EXISTEN CAMPOS (tabla estándar de Supabase)
-- ============================================
DO $$ 
BEGIN
  -- Añadir spiritual_level si no existe
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'profiles' AND column_name = 'spiritual_level'
  ) THEN
    ALTER TABLE profiles ADD COLUMN spiritual_level VARCHAR(50) DEFAULT 'Iniciado';
  END IF;

  -- Añadir light_points si no existe
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'profiles' AND column_name = 'light_points'
  ) THEN
    ALTER TABLE profiles ADD COLUMN light_points INTEGER DEFAULT 0;
  END IF;

  -- Añadir total_sessions si no existe
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'profiles' AND column_name = 'total_sessions'
  ) THEN
    ALTER TABLE profiles ADD COLUMN total_sessions INTEGER DEFAULT 0;
  END IF;

  -- Añadir total_channeling_sessions si no existe
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'profiles' AND column_name = 'total_channeling_sessions'
  ) THEN
    ALTER TABLE profiles ADD COLUMN total_channeling_sessions INTEGER DEFAULT 0;
  END IF;

  -- Añadir courses_completed si no existe
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'profiles' AND column_name = 'courses_completed'
  ) THEN
    ALTER TABLE profiles ADD COLUMN courses_completed INTEGER DEFAULT 0;
  END IF;
END $$;

-- ============================================
-- 9. FUNCIONES AUXILIARES
-- ============================================

-- Función para actualizar racha de días
CREATE OR REPLACE FUNCTION update_user_streak()
RETURNS TRIGGER AS $$
DECLARE
  last_login_date DATE;
  days_diff INTEGER;
BEGIN
  -- Obtener la fecha del último login
  last_login_date := DATE(OLD.last_login);
  
  -- Calcular diferencia de días
  days_diff := DATE(NEW.last_login) - last_login_date;
  
  IF days_diff = 1 THEN
    -- Racha continúa
    NEW.consecutive_days := OLD.consecutive_days + 1;
    IF NEW.consecutive_days > OLD.longest_streak THEN
      NEW.longest_streak := NEW.consecutive_days;
    END IF;
  ELSIF days_diff > 1 THEN
    -- Racha se rompió
    NEW.consecutive_days := 1;
    NEW.current_streak_start := CURRENT_DATE;
  END IF;
  
  NEW.total_logins := OLD.total_logins + 1;
  NEW.updated_at := timezone('utc'::text, now());
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger para actualizar racha
DROP TRIGGER IF EXISTS trigger_update_streak ON user_activity;
CREATE TRIGGER trigger_update_streak
  BEFORE UPDATE ON user_activity
  FOR EACH ROW
  WHEN (OLD.last_login IS DISTINCT FROM NEW.last_login)
  EXECUTE FUNCTION update_user_streak();

-- ============================================
-- 10. DATOS DE EJEMPLO (OPCIONAL - COMENTADO)
-- ============================================

-- Descomentar para insertar datos de prueba
/*
-- Ejemplo de mensaje diario
INSERT INTO daily_messages (user_id, archangel_name, archangel_attribute, message_text, day_of_week)
SELECT 
  auth.uid(),
  'Chamuel',
  'Amor Incondicional',
  'El amor incondicional fluye desde tu corazón hacia todo lo que te rodea. Eres un canal de amor divino.',
  2
WHERE auth.uid() IS NOT NULL;

-- Ejemplo de actividad de usuario
INSERT INTO user_activity (user_id, consecutive_days, total_logins)
SELECT auth.uid(), 7, 15
WHERE auth.uid() IS NOT NULL
ON CONFLICT (user_id) DO NOTHING;

-- Ejemplo de sesiones
INSERT INTO user_sessions (user_id, session_type, session_name, duration_minutes, light_points_earned)
SELECT 
  auth.uid(),
  'tirada',
  'Lectura Angelical Matutina',
  30,
  25
WHERE auth.uid() IS NOT NULL;
*/

-- ============================================
-- FIN DE LA MIGRACIÓN
-- ============================================

-- Verificar que todas las tablas se crearon correctamente
SELECT 
  table_name,
  (SELECT COUNT(*) FROM information_schema.columns WHERE table_name = t.table_name) as column_count
FROM information_schema.tables t
WHERE table_schema = 'public'
  AND table_name IN (
    'daily_messages',
    'user_activity',
    'user_sessions',
    'cart_items',
    'notifications',
    'achievements',
    'user_achievements'
  )
ORDER BY table_name;

