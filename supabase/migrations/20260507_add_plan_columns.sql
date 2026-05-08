-- Add subscription/plan columns to providers table
-- Run this in Supabase SQL Editor

ALTER TABLE providers
  ADD COLUMN IF NOT EXISTS plan              TEXT        NOT NULL DEFAULT 'free',
  ADD COLUMN IF NOT EXISTS plan_expires_at   TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS profile_views     INTEGER     NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS whatsapp_clicks   INTEGER     NOT NULL DEFAULT 0;

-- Index for fast premium-first ordering
CREATE INDEX IF NOT EXISTS idx_providers_plan ON providers (plan);

-- Helper: upgrade a provider to premium for N days
-- Usage: SELECT upgrade_to_premium('<user_id>', 30);
CREATE OR REPLACE FUNCTION upgrade_to_premium(p_user_id UUID, days INTEGER)
RETURNS VOID LANGUAGE plpgsql SECURITY DEFINER AS $$
BEGIN
  UPDATE providers
  SET plan            = 'premium',
      plan_expires_at = NOW() + (days || ' days')::INTERVAL
  WHERE user_id = p_user_id;
END;
$$;

-- Helper: increment profile view counter (call from API route or client)
CREATE OR REPLACE FUNCTION increment_profile_views(p_provider_id UUID)
RETURNS VOID LANGUAGE plpgsql SECURITY DEFINER AS $$
BEGIN
  UPDATE providers SET profile_views = profile_views + 1 WHERE id = p_provider_id;
END;
$$;

-- Helper: increment whatsapp click counter
CREATE OR REPLACE FUNCTION increment_whatsapp_clicks(p_provider_id UUID)
RETURNS VOID LANGUAGE plpgsql SECURITY DEFINER AS $$
BEGIN
  UPDATE providers SET whatsapp_clicks = whatsapp_clicks + 1 WHERE id = p_provider_id;
END;
$$;
