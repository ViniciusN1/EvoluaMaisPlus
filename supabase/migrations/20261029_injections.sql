-- Registro de aplicações do tratamento (Evolua Mais)
create table if not exists public.injections (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  medication text not null,
  dose text not null,
  applied_at timestamptz not null default now(),
  site text,            -- local da aplicação (abdômen, coxa, braço...)
  notes text,
  created_at timestamptz not null default now()
);

create index if not exists injections_user_applied_idx
  on public.injections (user_id, applied_at desc);

alter table public.injections enable row level security;

create policy "injections_select_own" on public.injections
  for select using (auth.uid() = user_id);
create policy "injections_insert_own" on public.injections
  for insert with check (auth.uid() = user_id);
create policy "injections_update_own" on public.injections
  for update using (auth.uid() = user_id);
create policy "injections_delete_own" on public.injections
  for delete using (auth.uid() = user_id);
