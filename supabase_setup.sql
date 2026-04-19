-- ==========================================
-- SUPABASE SETUP SCRIPT: Dynamic Photo Gallery
-- ==========================================

-- 1. Create the 'fotos' table to track image metadata
CREATE TABLE IF NOT EXISTS public.fotos (
  id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  created_at timestamptz DEFAULT now() NOT NULL,
  url text NOT NULL,
  album_id text NOT NULL
);

-- 2. Enable Row Level Security (RLS) on the table
ALTER TABLE public.fotos ENABLE ROW LEVEL SECURITY;

-- 3. Create policies for public/anonymous access to the table
CREATE POLICY "Permitir lectura pública" ON public.fotos
  FOR SELECT USING (true);

CREATE POLICY "Permitir inserción anónima" ON public.fotos
  FOR INSERT WITH CHECK (true);

-- 4. Enable Realtime for the 'fotos' table
-- Note: You might need to check 'Realtime' in the Supabase Dashboard UI 
-- under Database > Replication > supabase_realtime
-- Or run this:
ALTER PUBLICATION supabase_realtime ADD TABLE public.fotos;

-- ==========================================
-- STORAGE POLICIES (REQUIRED FOR UPLOADS)
-- Run these in the SQL Editor to allow guest uploads
-- ==========================================

-- Permitir que cualquiera suba fotos al bucket 'fotos-album'
-- (Asegúrate de haber creado el bucket 'fotos-album' y marcarlo como público)
CREATE POLICY "Permitir subidas anónimas" ON storage.objects
  FOR INSERT WITH CHECK (bucket_id = 'fotos-album');

-- Permitir que cualquiera vea las fotos del bucket
CREATE POLICY "Permitir visualización pública" ON storage.objects
  FOR SELECT USING (bucket_id = 'fotos-album');
