# Keepalive Supabase — Anti-Sleep

## Problema

O plano gratuito do Supabase pausa o banco de dados após **7 dias de inatividade**. Para evitar a perda de acesso, é necessário executar pelo menos uma operação de escrita no banco dentro desse período.

## Solução

Criamos uma **função RPC pública** no Supabase que insere um registro na tabela `keepalive_log`, e um **endpoint Vercel** em `/api/keepalive` que chama essa RPC. Um serviço externo (cron-job.org) acessa o endpoint a cada **5 dias**, garantindo atividade antes do limite de 7 dias.

## Arquivos

### `keepalive.sql`

Cria a tabela `keepalive_log` e a função RPC `keepalive_ping()` com `security definer`, permitindo que a anon key insira registros sem acesso direto à tabela:

```sql
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
```

**Execute no SQL Editor do Supabase:** https://supabase.com/dashboard/project/gqfdwmcrdzccdfvmidod/sql/new

### `api/keepalive.js`

Endpoint Vercel (`GET /api/keepalive` e `POST /api/keepalive`):

- Chama a RPC `keepalive_ping()` usando a anon key
- Retorna `{ status: "ok", timestamp }` em caso de sucesso
- Retorna `{ status: "error", error }` com HTTP 500 em caso de falha

## Mecanismo

```
cron-job.org ──GET──▶ api/keepalive.js ──POST──▶ Supabase RPC ──INSERT──▶ keepalive_log
(5 em 5 dias)          (Vercel Serverless)        keepalive_ping()
```

## Configuração no cron-job.org

1. Crie uma conta em https://cron-job.org
2. Adicione um novo cron job:
   - **URL**: `https://escmarketing.vercel.app/api/keepalive`
   - **Método**: `GET`
   - **Intervalo**: A cada 5 dias
   - **Título**: `ESC Marketing - Keepalive Supabase`
3. Salve

## Teste manual

```bash
curl https://escmarketing.vercel.app/api/keepalive
# Resposta: { "status": "ok", "timestamp": "2026-06-09T..." }
```

## Segurança

- RLS ativado na tabela `keepalive_log` sem políticas públicas
- Acesso exclusivo via RPC `keepalive_ping()` com `security definer`
- A anon key só consegue inserir via a função RPC, não tem acesso direto à tabela
