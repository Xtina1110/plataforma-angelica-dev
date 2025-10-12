-- Crear tabla para mensajes de contacto
CREATE TABLE IF NOT EXISTS contact_messages (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  nombre TEXT NOT NULL,
  email TEXT NOT NULL,
  asunto TEXT,
  mensaje TEXT NOT NULL,
  fecha TIMESTAMPTZ DEFAULT NOW(),
  estado TEXT DEFAULT 'pendiente' CHECK (estado IN ('pendiente', 'en_proceso', 'resuelto', 'cerrado')),
  respuesta TEXT,
  respondido_por UUID REFERENCES auth.users(id),
  fecha_respuesta TIMESTAMPTZ,
  notas_internas TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Índices para mejorar rendimiento
CREATE INDEX IF NOT EXISTS idx_contact_messages_email ON contact_messages(email);
CREATE INDEX IF NOT EXISTS idx_contact_messages_estado ON contact_messages(estado);
CREATE INDEX IF NOT EXISTS idx_contact_messages_fecha ON contact_messages(fecha DESC);

-- Habilitar RLS (Row Level Security)
ALTER TABLE contact_messages ENABLE ROW LEVEL SECURITY;

-- Política: Cualquiera puede insertar (enviar mensajes)
CREATE POLICY "Cualquiera puede enviar mensajes de contacto"
  ON contact_messages
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

-- Política: Solo admins pueden ver todos los mensajes
CREATE POLICY "Solo admins pueden ver mensajes de contacto"
  ON contact_messages
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM usuarios
      WHERE usuarios.id = auth.uid()
      AND usuarios.rol = 'admin'
    )
  );

-- Política: Solo admins pueden actualizar mensajes
CREATE POLICY "Solo admins pueden actualizar mensajes de contacto"
  ON contact_messages
  FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM usuarios
      WHERE usuarios.id = auth.uid()
      AND usuarios.rol = 'admin'
    )
  );

-- Función para actualizar updated_at automáticamente
CREATE OR REPLACE FUNCTION update_contact_messages_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger para actualizar updated_at
DROP TRIGGER IF EXISTS update_contact_messages_updated_at_trigger ON contact_messages;
CREATE TRIGGER update_contact_messages_updated_at_trigger
  BEFORE UPDATE ON contact_messages
  FOR EACH ROW
  EXECUTE FUNCTION update_contact_messages_updated_at();

-- Comentarios para documentación
COMMENT ON TABLE contact_messages IS 'Almacena los mensajes de contacto enviados desde el formulario público';
COMMENT ON COLUMN contact_messages.estado IS 'Estado del mensaje: pendiente, en_proceso, resuelto, cerrado';
COMMENT ON COLUMN contact_messages.respuesta IS 'Respuesta enviada al usuario';
COMMENT ON COLUMN contact_messages.notas_internas IS 'Notas internas para el equipo de soporte';

