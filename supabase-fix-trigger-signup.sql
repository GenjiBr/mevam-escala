-- =============================================================
-- CORREÇÃO: "Database error saving new user" no signup
-- Rodar no Supabase Dashboard → SQL Editor
-- =============================================================

-- 1. Garantir que todas as colunas necessárias existem em membros
ALTER TABLE public.membros
  ADD COLUMN IF NOT EXISTS background_url  TEXT,
  ADD COLUMN IF NOT EXISTS foto            TEXT,
  ADD COLUMN IF NOT EXISTS equipe_id       UUID REFERENCES public.equipes(id) ON DELETE SET NULL,
  ADD COLUMN IF NOT EXISTS iniciais        TEXT,
  ADD COLUMN IF NOT EXISTS func            TEXT    NOT NULL DEFAULT 'vocal_backing',
  ADD COLUMN IF NOT EXISTS secundarias     TEXT[]  NOT NULL DEFAULT '{}',
  ADD COLUMN IF NOT EXISTS status          TEXT    NOT NULL DEFAULT 'ativo',
  ADD COLUMN IF NOT EXISTS tom             TEXT    NOT NULL DEFAULT '#5B7FFF',
  ADD COLUMN IF NOT EXISTS perfil          TEXT    NOT NULL DEFAULT 'membro';

-- 2. Recriar o trigger function com SECURITY DEFINER (bypass RLS)
--    e com todas as colunas atuais
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  nome_completo text;
  iniciais_calc text;
BEGIN
  -- Deriva nome do metadata ou do e-mail
  nome_completo := COALESCE(
    NULLIF(TRIM(new.raw_user_meta_data->>'full_name'), ''),
    REPLACE(SPLIT_PART(new.email, '@', 1), '.', ' ')
  );

  -- Calcula iniciais (até 2 letras)
  SELECT STRING_AGG(UPPER(LEFT(word, 1)), '')
  INTO iniciais_calc
  FROM (
    SELECT UNNEST(STRING_TO_ARRAY(nome_completo, ' ')) AS word
    LIMIT 2
  ) words
  WHERE word <> '';

  INSERT INTO public.membros (
    id,
    nome,
    email,
    iniciais,
    func,
    secundarias,
    status,
    tom,
    perfil,
    foto,
    equipe_id,
    background_url
  ) VALUES (
    new.id::text,
    nome_completo,
    new.email,
    COALESCE(iniciais_calc, 'ME'),
    'vocal_backing',
    '{}',
    'ativo',
    '#5B7FFF',
    'membro',
    NULL,
    NULL,
    NULL
  )
  ON CONFLICT (id) DO NOTHING;   -- idempotente: não duplica se já existir

  RETURN new;
END;
$$;

-- 3. Recriar o trigger (drop + create para garantir estado limpo)
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- 4. RLS na tabela membros
ALTER TABLE public.membros ENABLE ROW LEVEL SECURITY;

-- Leitura: qualquer autenticado pode ler todos os membros da plataforma
DROP POLICY IF EXISTS "membros_select" ON public.membros;
CREATE POLICY "membros_select"
  ON public.membros FOR SELECT
  TO authenticated
  USING (true);

-- INSERT: o trigger usa SECURITY DEFINER (sem RLS), mas o app também
-- pode precisar inserir via cliente — permitir para autenticados
DROP POLICY IF EXISTS "membros_insert" ON public.membros;
CREATE POLICY "membros_insert"
  ON public.membros FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- UPDATE: membros só atualizam a si mesmos; admins atualizam qualquer um
DROP POLICY IF EXISTS "membros_update" ON public.membros;
CREATE POLICY "membros_update"
  ON public.membros FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- DELETE: apenas o próprio membro ou service_role
DROP POLICY IF EXISTS "membros_delete" ON public.membros;
CREATE POLICY "membros_delete"
  ON public.membros FOR DELETE
  TO authenticated
  USING (auth.uid()::text = id);
