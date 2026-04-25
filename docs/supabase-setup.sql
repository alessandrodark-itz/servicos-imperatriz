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

-- ── FIM ──────────────────────────────────────────────
-- Verifique em: Table Editor > profiles
-- Os perfis serão criados automaticamente quando um
-- usuário se cadastrar via supabase.auth.signUp()
