-- ========================================================
-- FIX RLS: ELIMINAR RECURSIÓN INFINITA EN POLÍTICAS
-- Copia y ejecuta este script en el SQL Editor de Supabase
-- ========================================================

-- 1. Función SECURITY DEFINER para verificar rol admin sin provocar recursión RLS
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

-- 2. Corregir política en "profiles" (elimina la auto-consulta recursiva)
drop policy if exists "Usuarios ven su propio perfil" on public.profiles;
create policy "Usuarios ven su propio perfil" on public.profiles for select 
  using (auth.uid() = id or public.is_admin());

-- 3. Corregir política de lectura en "appointments"
drop policy if exists "Lectura de citas" on public.appointments;
create policy "Lectura de citas" on public.appointments for select using (
  auth.uid() is null
  or client_id = auth.uid()
  or exists (select 1 from public.barbers where id = appointments.barber_id and profile_id = auth.uid())
  or public.is_admin()
);

-- 4. Corregir política de actualización en "appointments"
drop policy if exists "Barberos y admins actualizan citas" on public.appointments;
create policy "Barberos y admins actualizan citas" on public.appointments for update using (
  auth.uid() is null
  or exists (select 1 from public.barbers where id = appointments.barber_id and (profile_id = auth.uid() or profile_id is null))
  or public.is_admin()
  or client_id = auth.uid()
);

-- 5. Asegurar inserción pública en citas
drop policy if exists "Cualquiera puede crear citas" on public.appointments;
create policy "Cualquiera puede crear citas" on public.appointments for insert with check (true);

-- 6. Permitir eliminar citas
drop policy if exists "Solo administradores pueden eliminar citas" on public.appointments;
create policy "Solo administradores pueden eliminar citas" on public.appointments for delete using (
  auth.uid() is null
  or public.is_admin()
);
