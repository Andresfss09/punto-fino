require('dotenv').config();
const connectDB = require('../config/database');
const Service = require('../models/Service');

const services = [
  {
    name: 'Experiencia Triadix Signature (Gol de Oro)',
    description: 'Una experiencia integral: orientación personalizada, corte de cabello, cejas, afeitado facial, exfoliación, vapor ozono frío/caliente, mascarilla para puntos negros, velo hidratante, lavado capilar y masaje relajante.',
    price: 55000,
    duration: 60,
    category: 'combo',
    image: 'https://images.unsplash.com/photo-1585747860715-2ba37e788b70?auto=format&fit=crop&w=1200&q=80',
    isPopular: true,
    isActive: true,
    order: 1,
  },
  {
    name: 'Experiencia Triadix + Ritual de Barba',
    description: 'Orientación personalizada, corte de cabello, lavado capilar y producto profesional. Además, Ritual de Barba con vapor ozono frío y caliente, exfoliación facial, afeitado suave a navaja y aceites hidratantes.',
    price: 34000,
    duration: 45,
    category: 'combo',
    image: 'https://images.unsplash.com/photo-1621605815971-fbc98d665033?auto=format&fit=crop&w=1200&q=80',
    isPopular: true,
    isActive: true,
    order: 2,
  },
  {
    name: 'Experiencia Triadix (Corte + Cejas)',
    description: 'Servicio insignia de Corte y Ceja. Incluye visagismo según morfología craneal, corte milimétrico de precisión, perfilado de cejas, lavado capilar y peinado con producto profesional.',
    price: 24000,
    duration: 35,
    category: 'corte',
    image: 'https://images.unsplash.com/photo-1622286342621-4bd786c2447c?auto=format&fit=crop&w=1200&q=80',
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
    image: 'https://images.unsplash.com/photo-1503951914875-452162b0f3f1?auto=format&fit=crop&w=1200&q=80',
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
    description: 'Acompaña tu sesión con una cerveza fría (Corona, Heineken, Club Colombia) o trago de autor on the rocks. Incluida en Experiencia Signature.',
    price: 8000,
    duration: 10,
    category: 'bar',
    image: 'https://images.unsplash.com/photo-1608270191854-5a2a0a2df3aa?auto=format&fit=crop&w=700&q=80',
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
    console.log('✅ Servicios de Triadix creados correctamente');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
};

seed();