-- ========================================================
-- TRIADIX BARBER STUDIO · ESQUEMA COMPLETO PARA SUPABASE
-- ========================================================

-- 1. Habilitar extensión UUID
create extension if not exists "uuid-ossp";

-- 2. Tipos Enum
do $$ begin
  create type public.user_role as enum ('cliente', 'barbero', 'admin');
exception
  when duplicate_object then null;
end $$;

do $$ begin
  create type public.appointment_status as enum ('pendiente', 'confirmada', 'en_progreso', 'completada', 'cancelada', 'no_show');
exception
  when duplicate_object then null;
end $$;

do $$ begin
  create type public.payment_status as enum ('pendiente', 'pagado', 'reembolsado');
exception
  when duplicate_object then null;
end $$;

do $$ begin
  create type public.payment_method as enum ('efectivo', 'transferencia', 'nequi', 'daviplata', 'otro');
exception
  when duplicate_object then null;
end $$;

-- 3. Tabla: profiles (vinculada a auth.users de Supabase)
create table if not exists public.profiles (
  id uuid primary key references auth.users on delete cascade,
  name text not null,
  email text not null unique,
  phone text default '',
  address text default 'Cali, Valle del Cauca',
  role public.user_role default 'cliente',
  avatar_url text default '',
  loyalty_points integer default 0,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- 4. Tabla: barbers (perfil profesional de los maestros barberos)
create table if not exists public.barbers (
  id uuid primary key default gen_random_uuid(),
  profile_id uuid references public.profiles(id) on delete cascade unique,
  name text not null,
  email text,
  phone text,
  bio text default '',
  specialties text[] default array['Corte de Autor', 'Visagismo', 'Barba'],
  schedule jsonb default '[]'::jsonb,
  rating_average numeric(3,2) default 5.0,
  rating_count integer default 0,
  total_clients integer default 0,
  commission_rate numeric(4,2) default 50.0,
  is_available boolean default true,
  avatar_url text default '',
  created_at timestamptz default now()
);

-- 5. Tabla: services (catálogo oficial de experiencias Triadix)
create table if not exists public.services (
  id uuid primary key default gen_random_uuid(),
  name text not null unique,
  description text default '',
  price integer not null check (price >= 0),
  duration integer not null check (duration >= 5),
  category text not null default 'Experiencias',
  image_url text default '',
  is_popular boolean default false,
  is_active boolean default true,
  order_num integer default 0,
  created_at timestamptz default now()
);

-- 6. Tabla: appointments (citas agendadas por clientes o invitados)
create table if not exists public.appointments (
  id uuid primary key default gen_random_uuid(),
  confirmation_code text not null unique,
  client_id uuid references public.profiles(id) on delete set null,
  client_name text not null,
  client_email text not null,
  client_phone text not null,
  client_address text default 'Cali',
  is_guest boolean default false,
  barber_id uuid references public.barbers(id) on delete set null,
  date date not null,
  start_time text not null,
  end_time text not null,
  total_price integer not null,
  total_duration integer not null,
  status public.appointment_status default 'pendiente',
  payment_status public.payment_status default 'pendiente',
  payment_method public.payment_method default 'efectivo',
  notes text default '',
  cancel_reason text default '',
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- 7. Tabla intermedia: appointment_services (servicios asociados a cada cita)
create table if not exists public.appointment_services (
  id uuid primary key default gen_random_uuid(),
  appointment_id uuid not null references public.appointments(id) on delete cascade,
  service_id uuid not null references public.services(id) on delete restrict,
  service_name text not null,
  price integer not null,
  duration integer not null
);

-- 8. Tabla: reviews (opiniones de clientes)
create table if not exists public.reviews (
  id uuid primary key default gen_random_uuid(),
  appointment_id uuid references public.appointments(id) on delete cascade unique,
  client_id uuid references public.profiles(id) on delete set null,
  client_name text not null,
  barber_id uuid references public.barbers(id) on delete cascade,
  rating integer not null check (rating between 1 and 5),
  comment text default '',
  is_verified boolean default true,
  is_visible boolean default true,
  created_at timestamptz default now()
);

-- 9. Trigger para crear automáticamente el perfil al registrarse en auth.users
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, name, email, phone, role)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'name', split_part(new.email, '@', 1)),
    new.email,
    coalesce(new.raw_user_meta_data->>'phone', ''),
    coalesce((new.raw_user_meta_data->>'role')::public.user_role, 'cliente')
  )
  on conflict (id) do update set
    name = excluded.name,
    phone = excluded.phone;
  return new;
end;
$$ language plpgsql security definer;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- 10. Función para actualizar timestamps en updated_at
create or replace function public.set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

drop trigger if exists appointments_updated_at on public.appointments;
create trigger appointments_updated_at
  before update on public.appointments
  for each row execute procedure public.set_updated_at();

-- 11. Habilitar Row Level Security (RLS)
alter table public.profiles enable row level security;
alter table public.barbers enable row level security;
alter table public.services enable row level security;
alter table public.appointments enable row level security;
alter table public.appointment_services enable row level security;
alter table public.reviews enable row level security;

-- Función SECURITY DEFINER para verificar rol admin sin provocar recursión RLS
create or replace function public.is_admin(user_id uuid default auth.uid())
returns boolean as $$
begin
  if user_id is null then
    return false;
  end if;
  return exists (
    select 1 from public.profiles
    where id = user_id and role = 'admin'
  );
end;
$$ language plpgsql security definer;

-- Políticas de RLS
-- Servicios y Barberos: Lectura pública
create policy "Servicios son públicos" on public.services for select using (true);
create policy "Barberos son públicos" on public.barbers for select using (true);
create policy "Reseñas visibles son públicas" on public.reviews for select using (is_visible = true);

-- Perfiles: Cada usuario lee su propio perfil; admins leen todos
create policy "Usuarios ven su propio perfil" on public.profiles for select 
  using (auth.uid() = id or public.is_admin());
create policy "Usuarios actualizan su propio perfil" on public.profiles for update 
  using (auth.uid() = id);

-- Citas: Inserción pública (permite agendar a invitados y clientes registrados)
create policy "Cualquiera puede crear citas" on public.appointments for insert with check (true);
create policy "Cualquiera puede insertar items de cita" on public.appointment_services for insert with check (true);

-- Citas: Lectura
create policy "Lectura de citas" on public.appointments for select using (
  auth.uid() is null -- o invitados consultando su código
  or client_id = auth.uid()
  or exists (select 1 from public.barbers where id = appointments.barber_id and profile_id = auth.uid())
  or public.is_admin()
);

-- Citas: Actualización por barberos o admins
create policy "Barberos y admins actualizan citas" on public.appointments for update using (
  exists (select 1 from public.barbers where id = appointments.barber_id and profile_id = auth.uid())
  or public.is_admin()
  or client_id = auth.uid()
);

-- 12. Habilitar Supabase Realtime en appointments
alter publication supabase_realtime add table public.appointments;
