-- ========================================================
-- PUNTO FINO BARBERÍA · DATOS SEMILLA (SEED DATA)
-- ========================================================

-- 1. Insertar Catálogo Oficial de Servicios
insert into public.services (name, description, price, duration, category, is_popular, is_active, order_num) values
(
  'EXPERIENCIA PLATINIUM / GOL DE ORO',
  'Corte de autor con visagismo facial, ritual de barba completo a navaja libre, toalla caliente aromatizada, vapor de ozono y mascarilla facial purificante.',
  55000,
  60,
  'Experiencias',
  true,
  true,
  1
),
(
  'EXPERIENCIA PUNTO FINO (Corte + Cejas)',
  'Corte personalizado con diagnóstico morfológico craneal, texturizado a tijera japonesa, lavado térmico y perfilación geométrica de cejas.',
  24000,
  35,
  'Experiencias',
  true,
  true,
  2
),
(
  'EXPERIENCIA PUNTO FINO + RITUAL DE BARBA',
  'Combinación magistral de corte de autor y ritual tradicional de barba con toalla tibia, aceites esenciales botánicos y navaja al ras.',
  34000,
  45,
  'Experiencias',
  true,
  true,
  3
),
(
  'RITUAL DE BARBA',
  'Alineación y diseño geométrico a navaja libre, preparación dérmica con aceites botánicos y aplicación de toalla caliente relajante.',
  12000,
  20,
  'Barba & Cejas',
  false,
  true,
  4
),
(
  'PERFILADO DE CEJAS',
  'Diseño y definición limpia de cejas con navaja milimétrica para armonizar la proporción y expresión del rostro masculino.',
  5000,
  10,
  'Barba & Cejas',
  false,
  true,
  5
)
on conflict (name) do update set
  description = excluded.description,
  price = excluded.price,
  duration = excluded.duration,
  category = excluded.category;

-- 2. Insertar Barberos Oficiales (disponibles para agendamiento inmediato)
insert into public.barbers (id, name, email, phone, bio, specialties, rating_average, rating_count, total_clients, is_available) values
(
  'a1111111-1111-1111-1111-111111111111',
  'Juan David',
  'juandavid@puntofino.co',
  '3122398964',
  'Master Barber con más de 7 años de experiencia. Especialista en la Experiencia Platinium, visagismo facial y cortes de alta precisión.',
  array['Visagismo', 'Corte de Autor', 'Experiencia Platinium', 'Degradados'],
  4.93,
  58,
  310,
  true
),
(
  'b2222222-2222-2222-2222-222222222222',
  'Juan Diego',
  'juandiego@puntofino.co',
  '3122398964',
  'Master Barber y técnico capilar. Especialista en rituales de barba con vapor ozono, toalla caliente y perfilados clásicos al detalle.',
  array['Ritual de Barba', 'Navaja Libre', 'Vapor Ozono', 'Corte Clásico'],
  5.00,
  64,
  280,
  true
),
(
  'c3333333-3333-3333-3333-333333333333',
  'Emanuel Torres',
  'emanuel@puntofino.co',
  '3122398964',
  'Barbero Profesional especialista en visagismo facial, degradados limpios, fade milimétrico y perfilado de cejas.',
  array['Fade Milimétrico', 'Perfilado Cejas', 'Corte Urbano', 'Texturizado'],
  4.90,
  37,
  190,
  true
)
on conflict (id) do update set
  name = excluded.name,
  bio = excluded.bio,
  rating_average = excluded.rating_average;
