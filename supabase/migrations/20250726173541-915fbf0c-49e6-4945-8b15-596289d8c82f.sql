-- Crear tabla para episodios de podcast
CREATE TABLE public.episodios_podcast (
  id SERIAL PRIMARY KEY,
  numero INTEGER NOT NULL,
  titulo TEXT NOT NULL,
  descripcion TEXT NOT NULL,
  link_youtube TEXT NOT NULL,
  imagen TEXT,
  fecha_publicacion DATE NOT NULL DEFAULT CURRENT_DATE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Crear tabla para artículos del blog
CREATE TABLE public.articulos_blog (
  id SERIAL PRIMARY KEY,
  titulo TEXT NOT NULL,
  resumen TEXT NOT NULL,
  contenido TEXT NOT NULL,
  imagen TEXT,
  autor TEXT NOT NULL,
  fecha DATE NOT NULL DEFAULT CURRENT_DATE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Habilitar RLS en ambas tablas
ALTER TABLE public.episodios_podcast ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.articulos_blog ENABLE ROW LEVEL SECURITY;

-- Crear políticas para permitir lectura pública (contenido público)
CREATE POLICY "Los episodios son públicos" 
ON public.episodios_podcast 
FOR SELECT 
USING (true);

CREATE POLICY "Los artículos del blog son públicos" 
ON public.articulos_blog 
FOR SELECT 
USING (true);

-- Solo admins pueden insertar/actualizar/eliminar contenido
CREATE POLICY "Solo admins pueden gestionar episodios" 
ON public.episodios_podcast 
FOR ALL 
USING (get_user_role() = 'admin');

CREATE POLICY "Solo admins pueden gestionar artículos" 
ON public.articulos_blog 
FOR ALL 
USING (get_user_role() = 'admin');

-- Trigger para actualizar updated_at automáticamente
CREATE TRIGGER update_episodios_podcast_updated_at
  BEFORE UPDATE ON public.episodios_podcast
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_articulos_blog_updated_at
  BEFORE UPDATE ON public.articulos_blog
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Función para actualizar updated_at (si no existe ya)
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;