-- Adicionar coluna background_url na tabela membros
ALTER TABLE public.membros
  ADD COLUMN IF NOT EXISTS background_url TEXT;
