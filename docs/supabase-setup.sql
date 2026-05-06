-- =====================================================
-- Serviços Imperatriz — Setup de Autenticação
-- Supabase SQL Editor > New Query > colar e executar
-- =====================================================

-- ── 1. Tabela de perfis ──────────────────────────────
create table if not exists public.profiles (
  id         uuid references auth.users(id) on delete cascade primary key,
  full_name  text,
  phone      text,
  user_type  text check (user_type in ('cliente', 'prestador')),
  avatar_url text,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

-- ── 2. Row Level Security ────────────────────────────
alter table public.profiles enable row level security;

-- Usuário vê apenas o próprio perfil
create policy "Usuário pode ver próprio perfil"
  on public.profiles for select
  using (auth.uid() = id);

-- Usuário edita apenas o próprio perfil
create policy "Usuário pode atualizar próprio perfil"
  on public.profiles for update
  using (auth.uid() = id);

-- Inserção apenas via trigger (service role)
create policy "Apenas service role insere perfil"
  on public.profiles for insert
  with check (auth.uid() = id);

-- ── 3. Função: criação automática de perfil ──────────
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, full_name, phone, user_type)
  values (
    new.id,
    new.raw_user_meta_data->>'full_name',
    new.raw_user_meta_data->>'phone',
    new.raw_user_meta_data->>'user_type'
  );
  return new;
end;
$$ language plpgsql security definer;

-- ── 4. Trigger: dispara após novo cadastro ───────────
drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- ── 5. Função: atualiza updated_at automaticamente ──
create or replace function public.set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

drop trigger if exists set_profiles_updated_at on public.profiles;
create trigger set_profiles_updated_at
  before update on public.profiles
  for each row execute procedure public.set_updated_at();

-- ── 6. Novas colunas de perfil ───────────────────────
alter table public.profiles
  add column if not exists age      integer,
  add column if not exists whatsapp text;

-- ── 7. Storage: bucket de avatars ────────────────────
-- Acesse Storage > New bucket > nome: avatars > Public: ON
-- Depois execute as policies abaixo:

insert into storage.buckets (id, name, public)
values ('avatars', 'avatars', true)
on conflict (id) do nothing;

create policy "Avatar público para leitura"
  on storage.objects for select
  using (bucket_id = 'avatars');

create policy "Usuário faz upload do próprio avatar"
  on storage.objects for insert
  with check (bucket_id = 'avatars' and auth.uid()::text = (storage.foldername(name))[1]);

create policy "Usuário atualiza o próprio avatar"
  on storage.objects for update
  using (bucket_id = 'avatars' and auth.uid()::text = (storage.foldername(name))[1]);

-- ── 8. Tabela de prestadores (providers) ─────────────
create table if not exists public.providers (
  id          uuid default gen_random_uuid() primary key,
  user_id     uuid references auth.users(id) on delete cascade unique not null,
  name        text,
  slug        text unique,
  category_id text,
  description text,
  phone       text,
  whatsapp    text,
  location    text,
  cover_url   text,
  services    text[] default '{}',
  is_active   boolean default true,
  created_at  timestamp with time zone default now(),
  updated_at  timestamp with time zone default now()
);

-- RLS
alter table public.providers enable row level security;

create policy "Prestadores ativos são públicos"
  on public.providers for select
  using (is_active = true);

create policy "Prestador vê próprio registro"
  on public.providers for select
  using (auth.uid() = user_id);

create policy "Prestador insere próprio registro"
  on public.providers for insert
  with check (auth.uid() = user_id);

create policy "Prestador atualiza próprio registro"
  on public.providers for update
  using (auth.uid() = user_id);

-- Trigger updated_at
drop trigger if exists set_providers_updated_at on public.providers;
create trigger set_providers_updated_at
  before update on public.providers
  for each row execute procedure public.set_updated_at();

-- Adicionar colunas se a tabela já existia sem elas
alter table public.providers
  add column if not exists cover_url  text,
  add column if not exists services   text[] default '{}',
  add column if not exists is_active  boolean default true;

-- ── 9. Storage: bucket de capas (covers) ─────────────
insert into storage.buckets (id, name, public)
values ('covers', 'covers', true)
on conflict (id) do nothing;

create policy "Capa pública para leitura"
  on storage.objects for select
  using (bucket_id = 'covers');

create policy "Prestador faz upload da própria capa"
  on storage.objects for insert
  with check (bucket_id = 'covers' and auth.uid()::text = (storage.foldername(name))[1]);

create policy "Prestador atualiza a própria capa"
  on storage.objects for update
  using (bucket_id = 'covers' and auth.uid()::text = (storage.foldername(name))[1]);

-- ── 10. Coluna categories[] em providers ─────────────
alter table public.providers
  add column if not exists categories text[] default '{}';

-- Migra category_id existente para o array (roda uma vez)
update public.providers
set categories = array[category_id]
where category_id is not null
  and (categories is null or categories = '{}');

-- ── 11. Tabela de categorias (gerenciada pelo admin) ──
create table if not exists public.categories (
  id          uuid default gen_random_uuid() primary key,
  name        text not null,
  slug        text unique not null,
  icon        text default '🔧',
  description text,
  color       text,
  active      boolean default true,
  created_at  timestamp with time zone default now()
);

alter table public.categories enable row level security;

-- qualquer um pode ler categorias ativas
create policy "Categorias ativas são públicas"
  on public.categories for select
  using (active = true);

-- ── 12. Tabela de avaliações (reviews) ───────────────
create table if not exists public.reviews (
  id            uuid default gen_random_uuid() primary key,
  provider_id   uuid references public.providers(id) on delete cascade,
  user_id       uuid references auth.users(id),
  reviewer_name text,
  rating        integer check (rating between 1 and 5),
  comment       text,
  flagged       boolean default false,
  created_at    timestamp with time zone default now()
);

alter table public.reviews enable row level security;

create policy "Reviews são públicas"
  on public.reviews for select
  using (true);

create policy "Usuário insere própria review"
  on public.reviews for insert
  with check (auth.uid() = user_id);

-- Adiciona coluna flagged se a tabela já existia
alter table public.reviews
  add column if not exists flagged boolean default false;

-- ── 13. Tabela de strikes ─────────────────────────────
create table if not exists public.strikes (
  id          uuid default gen_random_uuid() primary key,
  user_id     uuid references auth.users(id),
  review_id   uuid references public.reviews(id) on delete set null,
  reason      text,
  observation text,
  created_at  timestamp with time zone default now()
);

alter table public.strikes enable row level security;

-- usuário vê os próprios strikes
create policy "Usuário vê próprios strikes"
  on public.strikes for select
  using (auth.uid() = user_id);

-- ── 14. Tabela de mensagens do admin ─────────────────
create table if not exists public.admin_messages (
  id             uuid default gen_random_uuid() primary key,
  title          text not null,
  body           text not null,
  type           text default 'info',  -- info | warning | strike | success
  target_user_id uuid references auth.users(id) on delete cascade,
  created_at     timestamp with time zone default now()
);

alter table public.admin_messages enable row level security;

-- usuário vê mensagens para ele ou broadcast (target_user_id is null)
create policy "Usuário vê próprias mensagens e broadcast"
  on public.admin_messages for select
  using (target_user_id is null or auth.uid() = target_user_id);

-- ── FIM ──────────────────────────────────────────────
