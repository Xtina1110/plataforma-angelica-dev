-- Schema para Sistema de Estadísticas y Gamificación de Usuario
-- Ejecutar en Supabase SQL Editor

-- Tabla principal de estadísticas de usuario
CREATE TABLE IF NOT EXISTS user_stats (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  total_points INTEGER DEFAULT 0,
  readings_count INTEGER DEFAULT 0,
  sessions_count INTEGER DEFAULT 0,
  courses_completed INTEGER DEFAULT 0,
  achievements TEXT[] DEFAULT '{}',
  daily_streak INTEGER DEFAULT 0,
  last_login TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id)
);

-- Tabla de historial de puntos
CREATE TABLE IF NOT EXISTS points_history (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  action TEXT NOT NULL,
  points INTEGER NOT NULL,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Índices para optimizar consultas
CREATE INDEX IF NOT EXISTS idx_user_stats_user_id ON user_stats(user_id);
CREATE INDEX IF NOT EXISTS idx_user_stats_total_points ON user_stats(total_points DESC);
CREATE INDEX IF NOT EXISTS idx_points_history_user_id ON points_history(user_id);
CREATE INDEX IF NOT EXISTS idx_points_history_created_at ON points_history(created_at DESC);

-- Función para actualizar updated_at automáticamente
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger para updated_at
DROP TRIGGER IF EXISTS update_user_stats_updated_at ON user_stats;
CREATE TRIGGER update_user_stats_updated_at
  BEFORE UPDATE ON user_stats
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Políticas de seguridad (Row Level Security)
ALTER TABLE user_stats ENABLE ROW LEVEL SECURITY;
ALTER TABLE points_history ENABLE ROW LEVEL SECURITY;

-- Política: Los usuarios solo pueden ver sus propias estadísticas
CREATE POLICY "Users can view own stats" ON user_stats
  FOR SELECT
  USING (auth.uid() = user_id);

-- Política: Los usuarios pueden actualizar sus propias estadísticas
CREATE POLICY "Users can update own stats" ON user_stats
  FOR UPDATE
  USING (auth.uid() = user_id);

-- Política: Los usuarios pueden insertar sus propias estadísticas
CREATE POLICY "Users can insert own stats" ON user_stats
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Política: Los usuarios pueden ver su propio historial
CREATE POLICY "Users can view own history" ON points_history
  FOR SELECT
  USING (auth.uid() = user_id);

-- Política: Los usuarios pueden insertar en su propio historial
CREATE POLICY "Users can insert own history" ON points_history
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Vista para leaderboard (top 100 usuarios)
CREATE OR REPLACE VIEW leaderboard AS
SELECT 
  u.id,
  u.email,
  us.total_points,
  us.readings_count,
  us.sessions_count,
  us.courses_completed,
  us.daily_streak,
  CASE 
    WHEN us.total_points >= 50000 THEN 'Avatar'
    WHEN us.total_points >= 25000 THEN 'Ascendido'
    WHEN us.total_points >= 15000 THEN 'Maestro'
    WHEN us.total_points >= 10000 THEN 'Iluminado'
    WHEN us.total_points >= 7500 THEN 'Guía'
    WHEN us.total_points >= 5000 THEN 'Sanador'
    WHEN us.total_points >= 3000 THEN 'Practicante'
    WHEN us.total_points >= 1500 THEN 'Aprendiz'
    WHEN us.total_points >= 500 THEN 'Buscador'
    ELSE 'Despertar'
  END as level_name,
  ROW_NUMBER() OVER (ORDER BY us.total_points DESC) as rank
FROM auth.users u
INNER JOIN user_stats us ON u.id = us.user_id
ORDER BY us.total_points DESC
LIMIT 100;

-- Función para obtener estadísticas resumidas
CREATE OR REPLACE FUNCTION get_user_summary(p_user_id UUID)
RETURNS TABLE (
  total_points INTEGER,
  level_name TEXT,
  progress_percent INTEGER,
  achievements_count INTEGER,
  daily_streak INTEGER,
  rank INTEGER
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    us.total_points,
    CASE 
      WHEN us.total_points >= 50000 THEN 'Avatar'
      WHEN us.total_points >= 25000 THEN 'Ascendido'
      WHEN us.total_points >= 15000 THEN 'Maestro'
      WHEN us.total_points >= 10000 THEN 'Iluminado'
      WHEN us.total_points >= 7500 THEN 'Guía'
      WHEN us.total_points >= 5000 THEN 'Sanador'
      WHEN us.total_points >= 3000 THEN 'Practicante'
      WHEN us.total_points >= 1500 THEN 'Aprendiz'
      WHEN us.total_points >= 500 THEN 'Buscador'
      ELSE 'Despertar'
    END as level_name,
    CASE 
      WHEN us.total_points >= 50000 THEN 100
      WHEN us.total_points >= 25000 THEN ((us.total_points - 25000)::FLOAT / 25000 * 100)::INTEGER
      WHEN us.total_points >= 15000 THEN ((us.total_points - 15000)::FLOAT / 10000 * 100)::INTEGER
      WHEN us.total_points >= 10000 THEN ((us.total_points - 10000)::FLOAT / 5000 * 100)::INTEGER
      WHEN us.total_points >= 7500 THEN ((us.total_points - 7500)::FLOAT / 2500 * 100)::INTEGER
      WHEN us.total_points >= 5000 THEN ((us.total_points - 5000)::FLOAT / 2500 * 100)::INTEGER
      WHEN us.total_points >= 3000 THEN ((us.total_points - 3000)::FLOAT / 2000 * 100)::INTEGER
      WHEN us.total_points >= 1500 THEN ((us.total_points - 1500)::FLOAT / 1500 * 100)::INTEGER
      WHEN us.total_points >= 500 THEN ((us.total_points - 500)::FLOAT / 1000 * 100)::INTEGER
      ELSE (us.total_points::FLOAT / 500 * 100)::INTEGER
    END as progress_percent,
    COALESCE(array_length(us.achievements, 1), 0)::INTEGER as achievements_count,
    us.daily_streak,
    (SELECT COUNT(*) + 1 FROM user_stats WHERE total_points > us.total_points)::INTEGER as rank
  FROM user_stats us
  WHERE us.user_id = p_user_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Datos de ejemplo (opcional - comentar en producción)
-- INSERT INTO user_stats (user_id, total_points, readings_count, sessions_count, courses_completed, achievements, daily_streak)
-- VALUES 
--   ('user-uuid-1', 1500, 30, 15, 2, ARRAY['first_reading', 'daily_devotion'], 7),
--   ('user-uuid-2', 5200, 100, 50, 5, ARRAY['first_reading', 'reading_master', 'certified'], 30);

COMMENT ON TABLE user_stats IS 'Estadísticas y progreso de gamificación de usuarios';
COMMENT ON TABLE points_history IS 'Historial detallado de puntos ganados por acción';
COMMENT ON VIEW leaderboard IS 'Top 100 usuarios por puntos totales';
COMMENT ON FUNCTION get_user_summary IS 'Obtiene resumen completo de estadísticas de un usuario';

