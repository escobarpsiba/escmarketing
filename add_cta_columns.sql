-- Add CTA columns (safe to re-run)
ALTER TABLE blog_posts ADD COLUMN IF NOT EXISTS cta_text text;
ALTER TABLE blog_posts ADD COLUMN IF NOT EXISTS cta_url text;

-- Update existing portfolio posts with CTA data
UPDATE blog_posts SET cta_text = 'Acessar Loja', cta_url = 'https://exemplo.com/loja-premium' WHERE id = 'seed-port-1';
UPDATE blog_posts SET cta_text = 'Ver App', cta_url = 'https://exemplo.com/app-delivery' WHERE id = 'seed-port-2';
UPDATE blog_posts SET cta_text = 'Acessar Dashboard', cta_url = 'https://exemplo.com/dashboard' WHERE id = 'seed-port-3';
UPDATE blog_posts SET cta_text = 'Ver Case', cta_url = 'https://exemplo.com/case-campanha' WHERE id = 'seed-port-4';
UPDATE blog_posts SET cta_text = 'Acessar Plataforma', cta_url = 'https://exemplo.com/financeiro' WHERE id = 'seed-port-5';
UPDATE blog_posts SET cta_text = 'Visitar Site', cta_url = 'https://exemplo.com/site-institucional' WHERE id = 'seed-port-6';
