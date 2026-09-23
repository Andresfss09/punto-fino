require('dotenv').config();
const connectDB = require('../config/database');
const Service = require('../models/Service');

const services = [
  {
    name: 'Experiencia White',
    description: 'Corte de cabello profesional, perfilación de cejas, orientación de corte según fisionomía y productos de acabado.',
    price: 22000,
    duration: 35,
    category: 'combo',
    isPopular: true,
    isActive: true,
    order: 1,
  },
  {
    name: 'Experiencia Black',
    description: 'Corte de cabello profesional, mascarilla facial purificante, exfoliación, aceite hidratante, perfilado de cejas y barba.',
    price: 40000,
    duration: 45,
    category: 'combo',
    isPopular: true,
    isActive: true,
    order: 2,
  },
  {
    name: 'Experiencia Gold VIP 👑',
    description: 'Servicio de lujo total: Corte + barba + cejas, asesoría personalizada de imagen, hidratación facial profunda y vaporozono frío/caliente.',
    price: 75000,
    duration: 60,
    category: 'combo',
    isPopular: true,
    isActive: true,
    order: 3,
  },
  {
    name: 'Perfilado de Barba',
    description: 'Diseño de barba a navaja libre, toalla caliente relajante, exfoliación y aplicación de aceites esenciales.',
    price: 16000,
    duration: 25,
    category: 'barba',
    isPopular: false,
    isActive: true,
    order: 4,
  },
  {
    name: 'Corte Clásico / Fade',
    description: 'Degradado limpio a navaja o corte clásico a tijera con pulido milimétrico.',
    price: 20000,
    duration: 35,
    category: 'corte',
    isPopular: false,
    isActive: true,
    order: 5,
  },
  {
    name: 'Mascarilla Facial Hidratante',
    description: 'Tratamiento facial limpiador, exfoliación de poros e hidratación profunda con aceites revitalizantes.',
    price: 25000,
    duration: 30,
    category: 'tratamiento',
    isPopular: false,
    isActive: true,
    order: 6,
  },
];

const seed = async () => {
  try {
    await connectDB();
    await Service.deleteMany({});
    await Service.insertMany(services);
    console.log('✅ Servicios de Steel House creados correctamente');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
};

seed();