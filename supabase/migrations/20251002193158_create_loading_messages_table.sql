/*
  # Tabla de Mensajes de Carga Angelicales

  1. Nueva Tabla
    - `loading_messages`
      - `id` (uuid, primary key)
      - `message` (text) - Mensaje angelical
      - `language` (text) - Idioma del mensaje (ES, EN, FR, IT)
      - `used_count` (integer) - Veces que se ha usado
      - `last_used_at` (timestamptz) - Última vez que se usó
      - `created_at` (timestamptz) - Fecha de creación
      - `is_active` (boolean) - Si el mensaje está activo

  2. Seguridad
    - Enable RLS
    - Políticas para lectura pública (los mensajes se muestran a todos)
*/

CREATE TABLE IF NOT EXISTS loading_messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  message text NOT NULL,
  language text NOT NULL DEFAULT 'ES',
  used_count integer DEFAULT 0,
  last_used_at timestamptz,
  created_at timestamptz DEFAULT now(),
  is_active boolean DEFAULT true
);

ALTER TABLE loading_messages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read loading messages"
  ON loading_messages
  FOR SELECT
  USING (is_active = true);

CREATE POLICY "Only authenticated users can update usage stats"
  ON loading_messages
  FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Crear índice para búsquedas eficientes
CREATE INDEX IF NOT EXISTS idx_loading_messages_language ON loading_messages(language);
CREATE INDEX IF NOT EXISTS idx_loading_messages_active ON loading_messages(is_active);
