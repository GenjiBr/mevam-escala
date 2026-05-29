create table if not exists public.admin_logs (
  id uuid primary key default gen_random_uuid(),
  equipe_id uuid not null references public.equipes(id) on delete cascade,
  admin_id text,
  admin_nome text,
  acao text not null,
  alvo_id text,
  alvo_nome text,
  detalhes jsonb not null default '{}'::jsonb,
  criado_em timestamptz not null default now()
);

create index if not exists admin_logs_equipe_criado_idx
  on public.admin_logs (equipe_id, criado_em desc);

alter table public.admin_logs enable row level security;

create policy "admin_logs_select_authenticated"
  on public.admin_logs
  for select
  to authenticated
  using (true);

create policy "admin_logs_insert_authenticated"
  on public.admin_logs
  for insert
  to authenticated
  with check (true);
