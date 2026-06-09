-- Run this in Supabase SQL Editor (https://supabase.com/dashboard/project/gqfdwmcrdzccdfvmidod/sql/new)
-- Creates the 'images' bucket and policies

-- 1. Create the bucket
insert into storage.buckets (id, name, public, avif_autodetection)
values ('images', 'images', true, false)
on conflict (id) do nothing;

-- 2. Allow anon to upload to images bucket
create policy "anon upload images"
on storage.objects for insert
to anon
with check (bucket_id = 'images');

-- 3. Allow anon to read from images bucket
create policy "anon read images"
on storage.objects for select
to anon
using (bucket_id = 'images');

-- 4. Allow anon to delete own uploads
create policy "anon delete images"
on storage.objects for delete
to anon
using (bucket_id = 'images');

-- 5. Create RPC function to ensure bucket exists (callable from frontend)
create or replace function public.ensure_image_bucket()
returns void
language plpgsql
security definer
as $$
begin
  insert into storage.buckets (id, name, public, avif_autodetection)
  values ('images', 'images', true, false)
  on conflict (id) do nothing;
end;
$$;

grant execute on function public.ensure_image_bucket to anon;
