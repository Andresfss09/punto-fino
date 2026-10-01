-- ========================================================
-- TRIADIX BARBER STUDIO · DATOS SEMILLA (SEED DATA)
-- ========================================================

-- 1. Insertar Catálogo Oficial de Servicios
insert into public.services (name, description, price, duration, category, is_popular, is_active, order_num) values
(
  'Combo Completo Triadix (Corte + Barba + Facial)',
  'El servicio más completo: corte a tu gusto, arreglo y perfilado de barba a navaja, toalla caliente, exfoliación facial suave y mascarilla refrescante.',
  55000,
  60,
  'Combos',
  true,
  true,
  1
),
(
  'Corte de Cabello + Arreglo de Barba',
  'La combinación perfecta: corte de cabello con degradado fade o clásico, lavado capilar, toalla tibia y perfilado de barba a navaja con aceites hidratantes.',
  34000,
  45,
  'Combos',
  true,
  true,
  2
),
(
  'Corte de Cabello + Cejas',
  'Corte moderno o clásico según tu estilo, perfilado limpio de cejas a navaja, lavado capilar y peinado con producto profesional.',
  24000,
  35,
  'Cortes',
  true,
  true,
  3
),
(
  'Arreglo y Perfilado de Barba',
  'Delineado y arreglo de barba con navaja tradicional, toalla caliente para abrir los poros y aceites nutritivos para un afeitado suave.',
  12000,
  20,
  'Barba & Cejas',
  false,
  true,
  4
),
(
  'Perfilado de Cejas',
  'Limpieza y perfilado limpio de cejas con navaja y tijera para un rostro pulido y natural.',
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
  'Cofundador de Triadix. Especialista en cortes modernos, degradados limpios a navaja y asesoría de estilo.',
  array['Degradados Fade', 'Cortes Clásicos', 'Asesoría de Estilo'],
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
