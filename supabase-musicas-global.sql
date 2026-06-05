-- Tornar repertório global (equipe_id opcional)
ALTER TABLE public.musicas ALTER COLUMN equipe_id DROP NOT NULL;

-- Permitir leitura global das músicas (sem filtro por equipe)
DROP POLICY IF EXISTS "Public read musicas" ON public.musicas;
CREATE POLICY "Public read musicas"
  ON public.musicas FOR SELECT
  USING (true);
