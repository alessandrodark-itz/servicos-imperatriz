-- =====================================================
-- Script de Criação do Banco de Dados
-- Serviços Imperatriz - Supabase
-- =====================================================
-- COMO USAR:
-- 1. Acesse https://app.supabase.com
-- 2. Selecione seu projeto (nkcxjhzdxapgehueraq)
-- 3. Vá em "SQL Editor" no menu lateral
-- 4. Cole TODO este script e clique em "Run"
-- =====================================================

-- =====================================================
-- 1. TABELA: categories (Categorias de Serviço)
-- =====================================================
CREATE TABLE IF NOT EXISTS categories (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  slug VARCHAR(100) NOT NULL UNIQUE,
  description TEXT,
  icon VARCHAR(10),
  color VARCHAR(100),
  active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_categories_slug ON categories(slug);
CREATE INDEX IF NOT EXISTS idx_categories_active ON categories(active);

-- =====================================================
-- 2. TABELA: providers (Perfis de Prestadores)
-- =====================================================
CREATE TABLE IF NOT EXISTS providers (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name VARCHAR(200) NOT NULL,
  slug VARCHAR(200) NOT NULL UNIQUE,
  category_id UUID REFERENCES categories(id) ON DELETE SET NULL,
  description TEXT,
  image_url TEXT,
  phone VARCHAR(20),
  whatsapp VARCHAR(20),
  location VARCHAR(200),
  rating DECIMAL(3,2) DEFAULT 0.00 CHECK (rating >= 0 AND rating <= 5),
  reviews_count INTEGER DEFAULT 0,
  featured BOOLEAN DEFAULT false,
  active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_providers_user_id ON providers(user_id);
CREATE INDEX IF NOT EXISTS idx_providers_slug ON providers(slug);
CREATE INDEX IF NOT EXISTS idx_providers_category_id ON providers(category_id);
CREATE INDEX IF NOT EXISTS idx_providers_featured ON providers(featured);
CREATE INDEX IF NOT EXISTS idx_providers_active ON providers(active);
CREATE INDEX IF NOT EXISTS idx_providers_rating ON providers(rating DESC);

-- =====================================================
-- 3. TABELA: ads (Anúncios Patrocinados)
-- =====================================================
CREATE TABLE IF NOT EXISTS ads (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title VARCHAR(200) NOT NULL,
  description TEXT,
  image_url TEXT NOT NULL,
  link_url TEXT,
  button_text VARCHAR(50),
  is_active BOOLEAN DEFAULT true,
  position INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_ads_active ON ads(is_active);
CREATE INDEX IF NOT EXISTS idx_ads_position ON ads(position);

-- =====================================================
-- 4. TABELA: reviews (Avaliações)
-- =====================================================
CREATE TABLE IF NOT EXISTS reviews (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  provider_id UUID NOT NULL REFERENCES providers(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  comment TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(provider_id, user_id)
);

CREATE INDEX IF NOT EXISTS idx_reviews_provider_id ON reviews(provider_id);
CREATE INDEX IF NOT EXISTS idx_reviews_user_id ON reviews(user_id);
CREATE INDEX IF NOT EXISTS idx_reviews_rating ON reviews(rating);

-- =====================================================
-- 5. TRIGGER: Atualizar updated_at automaticamente
-- =====================================================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_categories_updated_at
  BEFORE UPDATE ON categories
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_providers_updated_at
  BEFORE UPDATE ON providers
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_ads_updated_at
  BEFORE UPDATE ON ads
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_reviews_updated_at
  BEFORE UPDATE ON reviews
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- =====================================================
-- 6. TRIGGER: Atualizar rating e reviews_count automaticamente
-- =====================================================
CREATE OR REPLACE FUNCTION update_provider_rating()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE providers
  SET 
    rating = (
      SELECT COALESCE(AVG(rating), 0)
      FROM reviews
      WHERE provider_id = NEW.provider_id
    ),
    reviews_count = (
      SELECT COUNT(*)
      FROM reviews
      WHERE provider_id = NEW.provider_id
    )
  WHERE id = NEW.provider_id;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER after_review_insert_or_update
  AFTER INSERT OR UPDATE ON reviews
  FOR EACH ROW
  EXECUTE FUNCTION update_provider_rating();

CREATE OR REPLACE FUNCTION delete_review_update_rating()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE providers
  SET 
    rating = (
      SELECT COALESCE(AVG(rating), 0)
      FROM reviews
      WHERE provider_id = OLD.provider_id
    ),
    reviews_count = (
      SELECT COUNT(*)
      FROM reviews
      WHERE provider_id = OLD.provider_id
    )
  WHERE id = OLD.provider_id;
  
  RETURN OLD;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER after_review_delete
  AFTER DELETE ON reviews
  FOR EACH ROW
  EXECUTE FUNCTION delete_review_update_rating();

-- =====================================================
-- 7. TRIGGER: Criar profile de usuário automaticamente
-- =====================================================
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.users (id, email, full_name, phone)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', ''),
    COALESCE(NEW.raw_user_meta_data->>'phone', '')
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION handle_new_user();

-- =====================================================
-- 8. POLÍTICAS DE SEGURANÇA (RLS - Row Level Security)
-- =====================================================

-- Habilitar RLS em todas as tabelas
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE providers ENABLE ROW LEVEL SECURITY;
ALTER TABLE ads ENABLE ROW LEVEL SECURITY;
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;

-- categories: leitura pública, escrita apenas para admin
CREATE POLICY "categories_public_read" ON categories
  FOR SELECT USING (active = true);

-- providers: leitura pública para ativos, escrita para o próprio usuário
CREATE POLICY "providers_public_read" ON providers
  FOR SELECT USING (active = true);

CREATE POLICY "providers_insert_own" ON providers
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "providers_update_own" ON providers
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "providers_delete_own" ON providers
  FOR DELETE USING (auth.uid() = user_id);

-- ads: leitura pública para ativos
CREATE POLICY "ads_public_read" ON ads
  FOR SELECT USING (is_active = true);

-- reviews: leitura pública, escrita para usuários autenticados
CREATE POLICY "reviews_public_read" ON reviews
  FOR SELECT USING (true);

CREATE POLICY "reviews_insert_own" ON reviews
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "reviews_update_own" ON reviews
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "reviews_delete_own" ON reviews
  FOR DELETE USING (auth.uid() = user_id);

-- =====================================================
-- 9. DADOS INICIAIS (Seed Data)
-- =====================================================

-- Categorias
INSERT INTO categories (name, slug, description, icon, color) VALUES
  ('Encanadores', 'encanadores', 'Serviços de encanamento, desentupimento e instalações hidráulicas', '🔧', 'from-blue-500 to-blue-700'),
  ('Eletricistas', 'eletricistas', 'Instalações elétricas, manutenção e reparos', '⚡', 'from-yellow-500 to-yellow-700'),
  ('Pintores', 'pintores', 'Pintura residencial, comercial e artística', '🎨', 'from-pink-500 to-pink-700'),
  ('Pedreiros', 'pedreiros', 'Construção, reforma e acabamento', '🧱', 'from-orange-500 to-orange-700'),
  ('Marceneiros', 'marceneiros', 'Móveis sob medida, portas e esquadrias', '🪚', 'from-amber-600 to-amber-800'),
  ('Jardineiros', 'jardineiros', 'Paisagismo, poda e manutenção de jardins', '🌿', 'from-green-500 to-green-700'),
  ('Chaveiros', 'chaveiros', 'Cópias de chaves, fechaduras e portas blindadas', '🔑', 'from-purple-500 to-purple-700'),
  ('Limpeza', 'limpeza', 'Limpeza residencial, comercial e pós-obra', '🧹', 'from-cyan-500 to-cyan-700'),
  ('Dedetização', 'dedetizacao', 'Controle de pragas e desinsetização', '🐛', 'from-emerald-500 to-emerald-700'),
  ('Ar Condicionado', 'ar-condicionado', 'Instalação, manutenção e limpeza', '❄️', 'from-sky-500 to-sky-700'),
  ('Serralheiros', 'serralheiros', 'Portões, grades e estruturas metálicas', '⚙️', 'from-slate-500 to-slate-700'),
  ('Vidraceiros', 'vidraceiros', 'Box, janelas, portas de vidro e espelhos', '🪟', 'from-indigo-500 to-indigo-700')
ON CONFLICT (slug) DO NOTHING;

-- Anúncios
INSERT INTO ads (title, description, image_url, link_url, button_text, position) VALUES
  ('Curso de Elétrica Gratuita', 'Aprenda eletricidade básica e profissional. Vagas limitadas!', 'https://images.unsplash.com/photo-1621905252507-b35492cc74b4?w=600&h=400&fit=crop', '#', 'Inscreva-se', 1),
  ('Ferramentas com 30% OFF', 'As melhores ferramentas para profissionais com desconto exclusivo.', 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=600&h=400&fit=crop', '#', 'Comprar Agora', 2),
  ('Seja um Prestador Premium', 'Destaque seu serviço e alcance mais clientes na plataforma.', '/prestador/cadastro', 'Saiba Mais', 3)
ON CONFLICT DO NOTHING;

-- =====================================================
-- 10. VIEW: Estatísticas rápidas
-- =====================================================
CREATE OR REPLACE VIEW provider_stats AS
SELECT 
  p.id,
  p.name,
  p.slug,
  p.rating,
  p.reviews_count,
  p.featured,
  c.name AS category_name,
  c.slug AS category_slug
FROM providers p
LEFT JOIN categories c ON p.category_id = c.id
WHERE p.active = true;

-- =====================================================
-- FIM DO SCRIPT
-- =====================================================
