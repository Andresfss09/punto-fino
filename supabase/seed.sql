-- ========================================================
-- TRIADIX BARBER STUDIO · DATOS SEMILLA (SEED DATA)
-- ========================================================

-- 1. Insertar Catálogo Oficial de Servicios
insert into public.services (name, description, price, duration, category, is_popular, is_active, order_num) values
(
  'EXPERIENCIA TRIADIX SIGNATURE (Gol de Oro)',
  'Corte de autor con visagismo facial, ritual de barba completo a navaja libre, toalla caliente aromatizada, vapor de ozono y mascarilla facial purificante.',
  55000,
  60,
  'Experiencias',
  true,
  true,
  1
),
(
  'EXPERIENCIA TRIADIX (Corte + Cejas)',
  'Corte personalizado con diagnóstico morfológico craneal, texturizado a tijera japonesa, lavado térmico y perfilación geométrica de cejas.',
  24000,
  35,
  'Experiencias',
  true,
  true,
  2
),
(
  'EXPERIENCIA TRIADIX + RITUAL DE BARBA',
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

-- 2. Insertar Barberos Oficiales (Equipo Fundador Triadix)
insert into public.barbers (id, name, email, phone, bio, specialties, rating_average, rating_count, total_clients, is_available) values
(
  'a1111111-1111-1111-1111-111111111111',
  'Andrés Felipe Sarria',
  'andres@triadix.co',
  '3122398964',
  'Cofundador de Triadix y Lead Stylist. Especialista en diagnóstico morfológico, arquitectura craneofacial y cortes de alta precisión milimétrica.',
  array['Visagismo Craneal', 'Experiencia Signature', 'Degradados de Autor'],
  4.93,
  58,
  310,
  true
),
(
  'b2222222-2222-2222-2222-222222222222',
  'Nicolás Chávez',
  'nicolas@triadix.co',
  '3122398964',
  'Cofundador de Triadix y Director Creativo. Maestro en rituales clásicos a navaja, diseño geométrico de barba y bienestar dérmico con toallas calientes.',
  array['Ritual de Barba', 'Navaja Libre', 'Vapor Ozono'],
  5.00,
  64,
  280,
  true
),
(
  'c3333333-3333-3333-3333-333333333333',
  'Luis De Ávila',
  'luis@triadix.co',
  '3122398964',
  'Cofundador de Triadix y Director Técnico. Maestro de la textura y el degradado limpio, perfilado geométrico de cejas y vanguardia estética masculina.',
  array['Fade Milimétrico', 'Perfilado Geométrico', 'Texturizado'],
  4.90,
  37,
  190,
  true
)
on conflict (id) do update set
  name = excluded.name,
  bio = excluded.bio,
  rating_average = excluded.rating_average;
