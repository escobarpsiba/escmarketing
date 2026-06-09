-- Create blog_posts table
CREATE TABLE IF NOT EXISTS blog_posts (
  id text PRIMARY KEY,
  title text NOT NULL,
  description text,
  content text,
  category text NOT NULL DEFAULT 'portfolio',
  service_slug text,
  image text,
  cta_text text,
  cta_url text,
  status text DEFAULT 'published',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz
);

-- Add CTA columns if table already exists
ALTER TABLE blog_posts ADD COLUMN IF NOT EXISTS cta_text text;
ALTER TABLE blog_posts ADD COLUMN IF NOT EXISTS cta_url text;

-- Enable RLS
ALTER TABLE blog_posts ENABLE ROW LEVEL SECURITY;

-- Public policies for CRUD (demo purposes)
CREATE POLICY public_select ON blog_posts FOR SELECT USING (true);
CREATE POLICY public_insert ON blog_posts FOR INSERT WITH CHECK (true);
CREATE POLICY public_update ON blog_posts FOR UPDATE USING (true);
CREATE POLICY public_delete ON blog_posts FOR DELETE USING (true);

-- Seed sample data (upsert to allow re-running)
INSERT INTO blog_posts (id, title, description, content, category, service_slug, image, cta_text, cta_url, status) VALUES
('seed-port-1', 'Loja Virtual Premium', 'Plataforma de e-commerce com +300% de conversão', '<p>Desenvolvemos uma loja virtual completa do zero, com checkout otimizado, integração com ERP e design responsivo. O resultado foi um aumento de 300% na taxa de conversão em apenas 3 meses.</p><p>Utilizamos Next.js para o front-end e Shopify Plus como plataforma base, garantindo performance excepcional e escalabilidade.</p>', 'portfolio', null, 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=600&h=400&fit=crop', 'Acessar Loja', 'https://exemplo.com/loja-premium', 'published'),
('seed-port-2', 'Aplicativo de Delivery', 'App nativo com 50k+ downloads em 3 meses', '<p>Criamos um aplicativo de delivery completo com React Native, incluindo rastreamento em tempo real, pagamento integrado e dashboard administrativo.</p><p>O app alcançou 50 mil downloads nos primeiros 3 meses e uma avaliação média de 4.8 estrelas nas lojas.</p>', 'portfolio', null, 'https://images.unsplash.com/photo-1551650975-87deedd944c3?w=600&h=400&fit=crop', 'Ver App', 'https://exemplo.com/app-delivery', 'published'),
('seed-port-3', 'Dashboard Analytics', 'Sistema de BI com processamento em tempo real', '<p>Dashboard interativo para análise de métricas de negócio em tempo real. Utilizamos React + D3.js para visualizações dinâmicas e WebSockets para dados ao vivo.</p>', 'portfolio', null, 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=600&h=400&fit=crop', 'Acessar Dashboard', 'https://exemplo.com/dashboard', 'published'),
('seed-port-4', 'Campanha Digital', 'ROI de 450% em campanha de performance', '<p>Estratégia de marketing digital completa com SEO, Google Ads e redes sociais. Alcançamos um ROI de 450% com um investimento otimizado em mídia paga.</p>', 'portfolio', null, 'https://images.unsplash.com/photo-1432888498266-38ffec3eaf0a?w=600&h=400&fit=crop', 'Ver Case', 'https://exemplo.com/case-campanha', 'published'),
('seed-port-5', 'Plataforma Financeira', 'Sistema bancário digital com segurança enterprise', '<p>Plataforma financeira completa com autenticação biométrica, criptografia de ponta a ponta e dashboard de investimentos. Construída com React e Node.js.</p>', 'portfolio', null, 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=600&h=400&fit=crop', 'Acessar Plataforma', 'https://exemplo.com/financeiro', 'published'),
('seed-port-6', 'Site Institucional', 'Presença digital de marca Fortune 500', '<p>Site institucional de alto padrão para uma marca global. Design sofisticado com animações imersivas, SEO avançado e integração com CRM.</p>', 'portfolio', null, 'https://images.unsplash.com/photo-1542744173-8e7e53415bb0?w=600&h=400&fit=crop', 'Visitar Site', 'https://exemplo.com/site-institucional', 'published'),
('seed-svc-1', 'Guia Completo de Desenvolvimento Web', 'Tudo que você precisa saber para criar um site profissional', '<p>O desenvolvimento web vai muito além de escrever código. Envolve planejamento estratégico, design centrado no usuário, performance, acessibilidade e SEO.</p><p>Neste guia, abordamos as melhores práticas para criar um site que não apenas parece bom, mas também entrega resultados reais para o seu negócio.</p><h3>Por que investir em um site profissional?</h3><p>Um site bem desenvolvido é a base da presença digital de qualquer negócio. É o primeiro ponto de contato com potenciais clientes e precisa causar uma boa impressão.</p><h3>Tecnologias que utilizamos</h3><p>Trabalhamos com as tecnologias mais modernas do mercado: React, Next.js, Node.js, entre outras, garantindo performance, escalabilidade e facilidade de manutenção.</p>', 'servicos', 'desenvolvimento-web', 'https://images.unsplash.com/photo-1627398242454-45a1465c2479?w=600&h=400&fit=crop', null, null, 'published'),
('seed-svc-2', 'Estratégias de Marketing Digital para 2026', 'As tendências que vão dominar o marketing digital este ano', '<p>O marketing digital está em constante evolução. Para 2026, algumas tendências se destacam e podem fazer a diferença nos resultados da sua empresa.</p><h3>1. Inteligência Artificial no Marketing</h3><p>A IA está transformando a forma como criamos e otimizamos campanhas, desde a segmentação de público até a personalização de conteúdo em escala.</p><h3>2. SEO com Foco em Experiência</h3><p>O Google prioriza cada vez mais sites que oferecem excelente experiência ao usuário. Velocidade, mobile-first e conteúdo relevante são essenciais.</p><h3>3. Marketing de Conteúdo Estratégico</h3><p>Conteúdo de qualidade ainda é rei. Mas agora, mais do que nunca, precisa ser estratégico, data-driven e focado em resolver problemas do seu público.</p>', 'servicos', 'marketing-digital', 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=600&h=400&fit=crop', null, null, 'published'),
('seed-svc-3', 'A Importância do Design na Experiência do Usuário', 'Como um bom design pode transformar seu negócio', '<p>O design não é apenas sobre estética — é sobre como as pessoas interagem com sua marca. Um bom design de experiência do usuário (UX) pode ser o diferencial competitivo que seu negócio precisa.</p><h3>UX Design: Mais que Aparência</h3><p>UX design envolve pesquisa, prototipação, testes e iteração constante para criar produtos que sejam intuitivos, acessíveis e agradáveis de usar.</p><h3>Branding que Comunica</h3><p>Sua identidade visual conta a história da sua marca. Cores, tipografia e elementos visuais precisam estar alinhados com seus valores e seu público-alvo.</p><h3>UI Design: A Camada Visual</h3><p>O design de interface cuida da parte visual do produto: layouts, botões, ícones, cores e tipografia. Uma UI bem projetada guia o usuário naturalmente pelas funcionalidades.</p>', 'servicos', 'design-branding', 'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=600&h=400&fit=crop', null, null, 'published')
ON CONFLICT (id) DO UPDATE SET
  title = EXCLUDED.title,
  description = EXCLUDED.description,
  content = EXCLUDED.content,
  category = EXCLUDED.category,
  service_slug = EXCLUDED.service_slug,
  image = EXCLUDED.image,
  cta_text = EXCLUDED.cta_text,
  cta_url = EXCLUDED.cta_url,
  status = EXCLUDED.status,
  updated_at = now();
