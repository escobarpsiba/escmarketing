-- Keepalive Supabase — Anti-Sleep
-- Cria a tabela de log + função RPC pública para ping via cron externo

create table if not exists keepalive_log (
  id uuid primary key default gen_random_uuid(),
  pinged_at timestamptz not null default now(),
  source text not null default 'cron'
);

alter table keepalive_log enable row level security;

create or replace function public.keepalive_ping()
returns timestamptz
language plpgsql
security definer
as $$
declare
  ts timestamptz;
begin
  insert into keepalive_log (source) values ('api') returning pinged_at into ts;
  return ts;
end;
$$;

grant execute on function public.keepalive_ping to anon;
