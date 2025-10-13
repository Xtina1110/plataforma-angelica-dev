-- Tabla para historial de tiradas
CREATE TABLE IF NOT EXISTS historial_tiradas (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  usuario_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  tipo_tirada TEXT NOT NULL CHECK (tipo_tirada IN ('3 Cartas', '6 Cartas', '9 Cartas')),
  tema TEXT NOT NULL,
  cartas JSONB NOT NULL,
  interpretaciones JSONB NOT NULL,
  fecha TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
  ambiente TEXT DEFAULT 'cielo',
  visualizacion TEXT DEFAULT '2D',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Índices para historial_tiradas
CREATE INDEX IF NOT EXISTS idx_historial_usuario ON historial_tiradas(usuario_id);
CREATE INDEX IF NOT EXISTS idx_historial_fecha ON historial_tiradas(fecha DESC);
CREATE INDEX IF NOT EXISTS idx_historial_tipo ON historial_tiradas(tipo_tirada);
CREATE INDEX IF NOT EXISTS idx_historial_tema ON historial_tiradas(tema);

-- Tabla para tiradas favoritas
CREATE TABLE IF NOT EXISTS tiradas_favoritas (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  usuario_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  tirada_id UUID REFERENCES historial_tiradas(id) ON DELETE CASCADE,
  tipo_tirada TEXT NOT NULL,
  tema TEXT NOT NULL,
  cartas JSONB NOT NULL,
  interpretaciones JSONB NOT NULL,
  notas TEXT DEFAULT '',
  fecha_agregado TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Índices para tiradas_favoritas
CREATE INDEX IF NOT EXISTS idx_favoritas_usuario ON tiradas_favoritas(usuario_id);
CREATE INDEX IF NOT EXISTS idx_favoritas_fecha ON tiradas_favoritas(fecha_agregado DESC);

-- Tabla para estadísticas del usuario
CREATE TABLE IF NOT EXISTS estadisticas_usuario (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  usuario_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL UNIQUE,
  total_tiradas INTEGER DEFAULT 0,
  tiradas_3_cartas INTEGER DEFAULT 0,
  tiradas_6_cartas INTEGER DEFAULT 0,
  tiradas_9_cartas INTEGER DEFAULT 0,
  temas_frecuentes JSONB DEFAULT '{}',
  cartas_frecuentes JSONB DEFAULT '{}',
  racha INTEGER DEFAULT 0,
  ultima_tirada TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Índice para estadísticas_usuario
CREATE INDEX IF NOT EXISTS idx_estadisticas_usuario ON estadisticas_usuario(usuario_id);

-- Tabla para configuración del usuario
CREATE TABLE IF NOT EXISTS configuracion_apertura (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  usuario_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL UNIQUE,
  visualizacion JSONB DEFAULT '{"tipoCartas": "2D", "animaciones": "completas", "velocidad": "normal"}',
  audio JSONB DEFAULT '{"musica": true, "volumenMusica": 0.3, "narracion": true, "volumenNarracion": 0.7, "vozNarracion": "femenina"}',
  ambiente JSONB DEFAULT '{"tipo": "cielo", "particulas": true, "efectosVisuales": true}',
  privacidad JSONB DEFAULT '{"guardarHistorial": true, "compartirEstadisticas": false, "permitirGrabacion": true}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Índice para configuracion_apertura
CREATE INDEX IF NOT EXISTS idx_configuracion_usuario ON configuracion_apertura(usuario_id);

-- Función para actualizar updated_at automáticamente
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers para actualizar updated_at
CREATE TRIGGER update_historial_tiradas_updated_at
  BEFORE UPDATE ON historial_tiradas
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_tiradas_favoritas_updated_at
  BEFORE UPDATE ON tiradas_favoritas
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_estadisticas_usuario_updated_at
  BEFORE UPDATE ON estadisticas_usuario
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_configuracion_apertura_updated_at
  BEFORE UPDATE ON configuracion_apertura
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Políticas RLS (Row Level Security)
ALTER TABLE historial_tiradas ENABLE ROW LEVEL SECURITY;
ALTER TABLE tiradas_favoritas ENABLE ROW LEVEL SECURITY;
ALTER TABLE estadisticas_usuario ENABLE ROW LEVEL SECURITY;
ALTER TABLE configuracion_apertura ENABLE ROW LEVEL SECURITY;

-- Políticas para historial_tiradas
CREATE POLICY "Usuarios pueden ver su propio historial"
  ON historial_tiradas FOR SELECT
  USING (auth.uid() = usuario_id);

CREATE POLICY "Usuarios pueden insertar en su historial"
  ON historial_tiradas FOR INSERT
  WITH CHECK (auth.uid() = usuario_id);

CREATE POLICY "Usuarios pueden actualizar su historial"
  ON historial_tiradas FOR UPDATE
  USING (auth.uid() = usuario_id);

CREATE POLICY "Usuarios pueden eliminar su historial"
  ON historial_tiradas FOR DELETE
  USING (auth.uid() = usuario_id);

-- Políticas para tiradas_favoritas
CREATE POLICY "Usuarios pueden ver sus favoritos"
  ON tiradas_favoritas FOR SELECT
  USING (auth.uid() = usuario_id);

CREATE POLICY "Usuarios pueden insertar favoritos"
  ON tiradas_favoritas FOR INSERT
  WITH CHECK (auth.uid() = usuario_id);

CREATE POLICY "Usuarios pueden actualizar sus favoritos"
  ON tiradas_favoritas FOR UPDATE
  USING (auth.uid() = usuario_id);

CREATE POLICY "Usuarios pueden eliminar sus favoritos"
  ON tiradas_favoritas FOR DELETE
  USING (auth.uid() = usuario_id);

-- Políticas para estadisticas_usuario
CREATE POLICY "Usuarios pueden ver sus estadísticas"
  ON estadisticas_usuario FOR SELECT
  USING (auth.uid() = usuario_id);

CREATE POLICY "Usuarios pueden insertar sus estadísticas"
  ON estadisticas_usuario FOR INSERT
  WITH CHECK (auth.uid() = usuario_id);

CREATE POLICY "Usuarios pueden actualizar sus estadísticas"
  ON estadisticas_usuario FOR UPDATE
  USING (auth.uid() = usuario_id);

-- Políticas para configuracion_apertura
CREATE POLICY "Usuarios pueden ver su configuración"
  ON configuracion_apertura FOR SELECT
  USING (auth.uid() = usuario_id);

CREATE POLICY "Usuarios pueden insertar su configuración"
  ON configuracion_apertura FOR INSERT
  WITH CHECK (auth.uid() = usuario_id);

CREATE POLICY "Usuarios pueden actualizar su configuración"
  ON configuracion_apertura FOR UPDATE
  USING (auth.uid() = usuario_id);

-- Comentarios para documentación
COMMENT ON TABLE historial_tiradas IS 'Almacena el historial completo de tiradas angelicales de cada usuario';
COMMENT ON TABLE tiradas_favoritas IS 'Almacena las tiradas marcadas como favoritas por los usuarios';
COMMENT ON TABLE estadisticas_usuario IS 'Almacena estadísticas agregadas de uso de Apertura Angelical por usuario';
COMMENT ON TABLE configuracion_apertura IS 'Almacena las preferencias de configuración de cada usuario para Apertura Angelical';

