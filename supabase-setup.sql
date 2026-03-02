-- Run this in your Supabase SQL Editor (Dashboard > SQL Editor > New Query)
-- If you already ran the old version, run the migration section at the bottom instead.

-- ============================================================
-- FRESH SETUP (run if table does NOT exist yet)
-- ============================================================

-- 1. Create the journal_entries table with user_id
create table if not exists public.journal_entries (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  title text not null,
  content text default '',
  images jsonb default '[]'::jsonb,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- 2. RLS: each user can only see/edit their own entries
alter table public.journal_entries enable row level security;

create policy "Users can read own entries"
  on public.journal_entries for select
  using (auth.uid() = user_id);

create policy "Users can insert own entries"
  on public.journal_entries for insert
  with check (auth.uid() = user_id);

create policy "Users can update own entries"
  on public.journal_entries for update
  using (auth.uid() = user_id);

create policy "Users can delete own entries"
  on public.journal_entries for delete
  using (auth.uid() = user_id);

-- 3. Create the storage bucket for diary images
insert into storage.buckets (id, name, public)
values ('diary-images', 'diary-images', true)
on conflict (id) do nothing;

-- 4. Storage policies: users can manage their own folder (user_id/*)
create policy "Users read own images"
  on storage.objects for select
  using (bucket_id = 'diary-images');

create policy "Users upload own images"
  on storage.objects for insert
  with check (bucket_id = 'diary-images' and (storage.foldername(name))[1] = auth.uid()::text);

create policy "Users delete own images"
  on storage.objects for delete
  using (bucket_id = 'diary-images' and (storage.foldername(name))[1] = auth.uid()::text);


-- ============================================================
-- MIGRATION (run ONLY if you already have the old table without user_id)
-- ============================================================
-- alter table public.journal_entries add column if not exists user_id uuid references auth.users(id) on delete cascade;
-- drop policy if exists "Allow all access" on public.journal_entries;
-- create policy "Users can read own entries" on public.journal_entries for select using (auth.uid() = user_id);
-- create policy "Users can insert own entries" on public.journal_entries for insert with check (auth.uid() = user_id);
-- create policy "Users can update own entries" on public.journal_entries for update using (auth.uid() = user_id);
-- create policy "Users can delete own entries" on public.journal_entries for delete using (auth.uid() = user_id);
