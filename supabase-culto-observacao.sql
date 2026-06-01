alter table public.cultos
  add column if not exists observacao text default '';
