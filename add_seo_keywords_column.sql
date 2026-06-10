-- Add keywords column to seo table (safe to re-run)
ALTER TABLE seo ADD COLUMN IF NOT EXISTS keywords text;

-- Update existing SEO row with default keywords
UPDATE seo SET keywords = 'marketing digital, agência digital, SEO, desenvolvimento web, criação de sites' WHERE id = 1;
