-- Set default thumbnail for all podcast episodes
ALTER TABLE public.episodios_podcast 
  ALTER COLUMN imagen SET DEFAULT '/lovable-uploads/98934a72-0f35-4b53-a92a-670283d12900.png';

-- Ensure existing rows use the provided universal podcast image
UPDATE public.episodios_podcast 
SET imagen = '/lovable-uploads/98934a72-0f35-4b53-a92a-670283d12900.png';

-- Update the first episode with the details you provided
UPDATE public.episodios_podcast
SET 
  titulo = 'La Esperitualidad',
  link_youtube = 'https://youtu.be/4l9vB8SmSz4?si=oG_RjxEaBVgoQX0D',
  fecha_publicacion = '2025-04-26'
WHERE id = 1;