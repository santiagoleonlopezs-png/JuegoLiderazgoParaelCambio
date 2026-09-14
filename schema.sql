-- Change Leadership Lab v10
-- Ejecuta este script una sola vez en Supabase > SQL Editor.

create table if not exists public.change_leadership_scores (
  class_code text not null,
  team text not null,
  score integer not null default 0,
  round integer not null default 1,
  business numeric not null default 0,
  appropriation numeric not null default 0,
  updated_at timestamptz not null default now(),
  primary key (class_code, team)
);

alter table public.change_leadership_scores enable row level security;

drop policy if exists "classroom read scores" on public.change_leadership_scores;
drop policy if exists "classroom insert scores" on public.change_leadership_scores;
drop policy if exists "classroom update scores" on public.change_leadership_scores;

create policy "classroom read scores"
on public.change_leadership_scores for select
to anon, authenticated
using (true);

create policy "classroom insert scores"
on public.change_leadership_scores for insert
to anon, authenticated
with check (true);

create policy "classroom update scores"
on public.change_leadership_scores for update
to anon, authenticated
using (true)
with check (true);

grant select, insert, update on public.change_leadership_scores to anon, authenticated;
