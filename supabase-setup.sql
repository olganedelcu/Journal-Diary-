-- Run this in your Supabase SQL Editor (Dashboard > SQL Editor > New Query)

-- 1. Create the journal_entries table
create table if not exists public.journal_entries (
  id uuid primary key,
  title text not null,
  content text default '',
  images jsonb default '[]'::jsonb,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- 2. Allow public read/write (no auth for now)
alter table public.journal_entries enable row level security;

create policy "Allow all access"
  on public.journal_entries
  for all
  using (true)
  with check (true);

-- 3. Create the storage bucket for diary images
insert into storage.buckets (id, name, public)
values ('diary-images', 'diary-images', true)
on conflict (id) do nothing;

-- 4. Allow public uploads/reads to the bucket
create policy "Public read diary images"
  on storage.objects for select
  using (bucket_id = 'diary-images');

create policy "Public upload diary images"
  on storage.objects for insert
  with check (bucket_id = 'diary-images');

create policy "Public delete diary images"
  on storage.objects for delete
  using (bucket_id = 'diary-images');
