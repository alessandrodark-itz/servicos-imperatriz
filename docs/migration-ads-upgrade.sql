-- =================================================================
-- MIGRAÇÃO: Upgrade da tabela ads + bucket de imagens
-- Execute no Supabase SQL Editor
-- =================================================================

-- 1. Novos campos gerais para ads
ALTER TABLE ads ADD COLUMN IF NOT EXISTS phone          TEXT;
ALTER TABLE ads ADD COLUMN IF NOT EXISTS link_type      TEXT NOT NULL DEFAULT 'whatsapp';
ALTER TABLE ads ADD COLUMN IF NOT EXISTS slogan         TEXT;
ALTER TABLE ads ADD COLUMN IF NOT EXISTS brand_category TEXT;
ALTER TABLE ads ADD COLUMN IF NOT EXISTS badge_type     TEXT DEFAULT 'patrocinado';
ALTER TABLE ads ADD COLUMN IF NOT EXISTS plan_type      TEXT NOT NULL DEFAULT 'bronze';
ALTER TABLE ads ADD COLUMN IF NOT EXISTS is_lifetime    BOOLEAN DEFAULT false;
ALTER TABLE ads ADD COLUMN IF NOT EXISTS starts_at      TIMESTAMP WITH TIME ZONE;
ALTER TABLE ads ADD COLUMN IF NOT EXISTS expires_at     TIMESTAMP WITH TIME ZONE;
ALTER TABLE ads ADD COLUMN IF NOT EXISTS views_count    INTEGER DEFAULT 0;
ALTER TABLE ads ADD COLUMN IF NOT EXISTS clicks_count   INTEGER DEFAULT 0;

-- 2. Campos de CTA independentes por plataforma
ALTER TABLE ads ADD COLUMN IF NOT EXISTS cta_type_active      TEXT DEFAULT 'whatsapp';
ALTER TABLE ads ADD COLUMN IF NOT EXISTS cta_whatsapp_number  TEXT;
ALTER TABLE ads ADD COLUMN IF NOT EXISTS cta_whatsapp_message TEXT;
ALTER TABLE ads ADD COLUMN IF NOT EXISTS cta_external_url     TEXT;
ALTER TABLE ads ADD COLUMN IF NOT EXISTS cta_instagram_url    TEXT;
ALTER TABLE ads ADD COLUMN IF NOT EXISTS cta_phone_number     TEXT;
ALTER TABLE ads ADD COLUMN IF NOT EXISTS cta_location_url     TEXT;
ALTER TABLE ads ADD COLUMN IF NOT EXISTS cta_coupon_code      TEXT;
ALTER TABLE ads ADD COLUMN IF NOT EXISTS cta_coupon_url       TEXT;

-- 3. Bucket de imagens para anúncios (storage)
INSERT INTO storage.buckets (id, name, public)
VALUES ('ads-images', 'ads-images', true)
ON CONFLICT (id) DO NOTHING;

-- Permitir acesso público de leitura ao bucket
CREATE POLICY IF NOT EXISTS "Public read ads-images"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'ads-images');

-- Permitir que service role faça upload (já tem acesso total, mas policy explícita ajuda)
CREATE POLICY IF NOT EXISTS "Service role upload ads-images"
  ON storage.objects FOR INSERT
  WITH CHECK (bucket_id = 'ads-images');

CREATE POLICY IF NOT EXISTS "Service role update ads-images"
  ON storage.objects FOR UPDATE
  USING (bucket_id = 'ads-images');

CREATE POLICY IF NOT EXISTS "Service role delete ads-images"
  ON storage.objects FOR DELETE
  USING (bucket_id = 'ads-images');
