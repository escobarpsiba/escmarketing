-- Run this in Supabase SQL Editor (https://supabase.com/dashboard/project/gqfdwmcrdzccdfvmidod/sql/new)
-- Creates the 'images' bucket and policies

-- 1. Create the bucket
insert into storage.buckets (id, name, public, avif_autodetection)
values ('images', 'images', true, false)
on conflict (id) do nothing;

-- 2. Allow anon to upload to images bucket (if not exists)
do $$ begin
  if not exists (select 1 from pg_policies where schemaname = 'storage' and tablename = 'objects' and policyname = 'anon upload images') then
    create policy "anon upload images" on storage.objects for insert to anon with check (bucket_id = 'images');
  end if;
end $$;

-- 3. Allow anon to read from images bucket (if not exists)
do $$ begin
  if not exists (select 1 from pg_policies where schemaname = 'storage' and tablename = 'objects' and policyname = 'anon read images') then
    create policy "anon read images" on storage.objects for select to anon using (bucket_id = 'images');
  end if;
end $$;

-- 4. Allow anon to delete own uploads (if not exists)
do $$ begin
  if not exists (select 1 from pg_policies where schemaname = 'storage' and tablename = 'objects' and policyname = 'anon delete images') then
    create policy "anon delete images" on storage.objects for delete to anon using (bucket_id = 'images');
  end if;
end $$;

-- 5. Create RPC function to ensure bucket exists + policies (callable from frontend)
create or replace function public.ensure_image_bucket()
returns void
language plpgsql
security definer
as $$
begin
  -- Create bucket if not exists
  insert into storage.buckets (id, name, public, avif_autodetection)
  values ('images', 'images', true, false)
  on conflict (id) do nothing;

  -- Create RLS policies for anon access (if they don't exist yet)
  if not exists (
    select 1 from pg_policies
    where schemaname = 'storage' and tablename = 'objects' and policyname = 'anon upload images'
  ) then
    execute 'create policy "anon upload images" on storage.objects for insert to anon with check (bucket_id = ''images'')';
  end if;

  if not exists (
    select 1 from pg_policies
    where schemaname = 'storage' and tablename = 'objects' and policyname = 'anon read images'
  ) then
    execute 'create policy "anon read images" on storage.objects for select to anon using (bucket_id = ''images'')';
  end if;

  if not exists (
    select 1 from pg_policies
    where schemaname = 'storage' and tablename = 'objects' and policyname = 'anon delete images'
  ) then
    execute 'create policy "anon delete images" on storage.objects for delete to anon using (bucket_id = ''images'')';
  end if;
end;
$$;

grant execute on function public.ensure_image_bucket to anon;
