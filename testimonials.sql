-- Create testimonials table
create table if not exists testimonials (
  id text primary key,
  name text not null,
  company text,
  text text not null,
  rating integer default 5,
  avatar_initials text,
  created_at timestamp default now()
);

-- Enable row-level security
alter table testimonials enable row level security;

-- Allow anon to read testimonials
create policy "anon read testimonials"
on testimonials for select
to anon
using (true);

-- Allow anon to insert testimonials
create policy "anon insert testimonials"
on testimonials for insert
to anon
with check (true);

-- Allow anon to update testimonials
create policy "anon update testimonials"
on testimonials for update
to anon
using (true);

-- Allow anon to delete testimonials
create policy "anon delete testimonials"
on testimonials for delete
to anon
using (true);
