-- ═══════════════════════════════════════════════════
-- SISTEMA DE EMBLEMAS — Serviços Imperatriz
-- Execute no Supabase SQL Editor
-- ═══════════════════════════════════════════════════

CREATE TABLE emblemas (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  slug TEXT UNIQUE NOT NULL,
  titulo TEXT NOT NULL,
  descricao TEXT,
  icone TEXT NOT NULL,
  cor TEXT NOT NULL,
  cor_fundo TEXT NOT NULL,
  ativo BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE prestador_emblemas (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  prestador_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  emblema_id UUID NOT NULL REFERENCES emblemas(id) ON DELETE CASCADE,
  ordem INT DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(prestador_id, emblema_id),
  CONSTRAINT max_4_emblemas CHECK (ordem BETWEEN 0 AND 3)
);

ALTER TABLE emblemas ENABLE ROW LEVEL SECURITY;
CREATE POLICY "emblemas_public_read" ON emblemas FOR SELECT USING (true);

ALTER TABLE prestador_emblemas ENABLE ROW LEVEL SECURITY;
CREATE POLICY "prestador_emblemas_read"   ON prestador_emblemas FOR SELECT USING (true);
CREATE POLICY "prestador_emblemas_insert" ON prestador_emblemas FOR INSERT WITH CHECK (auth.uid() = prestador_id);
CREATE POLICY "prestador_emblemas_delete" ON prestador_emblemas FOR DELETE USING (auth.uid() = prestador_id);

INSERT INTO emblemas (slug, titulo, descricao, icone, cor, cor_fundo) VALUES
  ('amo-animais', 'Amo os Animais',   'Cuida com carinho',           '🐾', '#a855f7', '#1a0d2e'),
  ('guerreiro',   'Guerreiro/a',      'Determinado/a e forte',       '⚔️', '#ec4899', '#2a0d1e'),
  ('prestativo',  'Prestativo/a',     'Sempre pronto/a',             '🤝', '#22c55e', '#0d2a18'),
  ('verificado',  'Verificado/a',     'Identidade confirmada',       '🏅', '#fbbf24', '#2a1e0d'),
  ('pontual',     'Pontual',          'Sempre no horário',           '⏰', '#38bdf8', '#0d1a2a'),
  ('top-semana',  'Top da Semana',    'Mais avaliado/a',             '🏆', '#f59e0b', '#2a1a0d'),
  ('experiencia', 'Experiente',       '5+ anos de atuação',          '💼', '#6366f1', '#0d0f2a'),
  ('atencioso',   'Atencioso/a',      'Atendimento especial',        '💜', '#c084fc', '#1a0d2a');
