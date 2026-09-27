require('dotenv').config();
const connectDB = require('../config/database');
const Service = require('../models/Service');

const services = [
  {
    name: 'Experiencia Platinium / Gol de Oro',
    description: 'Una experiencia integral: orientación personalizada, corte de cabello, cejas, afeitado facial, exfoliación, vapor ozono frío/caliente, mascarilla para puntos negros, velo hidratante, lavado capilar y masaje relajante.',
    price: 55000,
    duration: 60,
    category: 'combo',
    image: 'https://s3.weibook.co/punto_fino/services/f7e3bb87-4e93-4eed-8340-1a01e6fa0ff3.webp',
    isPopular: true,
    isActive: true,
    order: 1,
  },
  {
    name: 'Experiencia Punto Fino + Ritual de Barba',
    description: 'Orientación personalizada, corte de cabello, lavado capilar y producto profesional. Además, Ritual de Barba con vapor ozono frío y caliente, exfoliación facial, afeitado suave a navaja y aceites hidratantes.',
    price: 34000,
    duration: 45,
    category: 'combo',
    image: 'https://s3.weibook.co/punto_fino/services/241a43d5-f365-4a78-a32d-9e4ffaffb801.webp',
    isPopular: true,
    isActive: true,
    order: 2,
  },
  {
    name: 'Experiencia Punto Fino (Corte + Cejas)',
    description: 'Servicio insignia de Corte y Ceja. Incluye visagismo según morfología craneal, corte milimétrico de precisión, perfilado de cejas, lavado capilar y peinado con producto profesional.',
    price: 24000,
    duration: 35,
    category: 'corte',
    image: 'https://s3.weibook.co/punto_fino/services/d9eb3738-2f6d-47bf-a98a-16135933c3f4.webp',
    isPopular: true,
    isActive: true,
    order: 3,
  },
  {
    name: 'Ritual de Barba',
    description: 'Cuidado integral de barba: diseño según tu tipo de rostro, exfoliación facial, vapor ozono frío y caliente para abrir poros y suavizar vello, afeitado preciso y aceites nutritivos.',
    price: 12000,
    duration: 20,
    category: 'barba',
    image: 'https://s3.weibook.co/punto_fino/services/0f55ddbc-1dd2-4eb0-8978-3a50b53fffbc.webp',
    isPopular: false,
    isActive: true,
    order: 4,
  },
  {
    name: 'Perfilado de Cejas',
    description: 'Limpieza y perfilado geométrico de cejas a navaja y tijera para realzar la mirada y armonizar la simetría natural del rostro.',
    price: 5000,
    duration: 10,
    category: 'barba',
    image: 'https://images.unsplash.com/photo-1599351431202-1e0f0137899a?auto=format&fit=crop&w=700&q=80',
    isPopular: false,
    isActive: true,
    order: 5,
  },
  {
    name: 'Servicio de Bar & Café de Especialidad',
    description: 'En cada cita tienes incluida una bebida de cortesía: café espresso recién molido o agua mineral purificada servida a la temperatura ideal.',
    price: 0,
    duration: 10,
    category: 'bar',
    image: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=700&q=80',
    isPopular: false,
    isActive: true,
    order: 6,
  },
  {
    name: 'Cerveza Premium Fría & Coctelería de Bar',
    description: 'Acompaña tu sesión con una cerveza fría (Corona, Heineken, Club Colombia) o trago de autor on the rocks. Incluida en Experiencia Platinium.',
    price: 8000,
    duration: 10,
    category: 'bar',
    image: '/cerveza-bar.webp',
    isPopular: false,
    isActive: true,
    order: 7,
  },
];

const seed = async () => {
  try {
    await connectDB();
    await Service.deleteMany({});
    await Service.insertMany(services);
    console.log('✅ Servicios de Punto Fino creados correctamente');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
};

seed();