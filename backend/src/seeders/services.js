require('dotenv').config();
const connectDB = require('../config/database');
const Service = require('../models/Service');

const services = [
  { name: 'Corte clásico', description: 'Corte tradicional con tijera y máquina', price: 25000, duration: 30, category: 'corte', isPopular: true, isActive: true, order: 1 },
  { name: 'Degradado', description: 'Fade perfecto a tu estilo', price: 30000, duration: 40, category: 'corte', isPopular: true, isActive: true, order: 2 },
  { name: 'Corte + Barba', description: 'Combo completo corte y perfilado de barba', price: 45000, duration: 60, category: 'combo', isPopular: true, isActive: true, order: 3 },
  { name: 'Perfilado de barba', description: 'Definición y perfilado preciso', price: 20000, duration: 20, category: 'barba', isPopular: false, isActive: true, order: 4 },
  { name: 'Diseño', description: 'Diseños y líneas personalizadas', price: 35000, duration: 45, category: 'diseño', isPopular: false, isActive: true, order: 5 },
  { name: 'Mascarilla facial', description: 'Tratamiento facial hidratante', price: 20000, duration: 20, category: 'tratamiento', isPopular: false, isActive: true, order: 6 },
];

const seed = async () => {
  try {
    await connectDB();
    await Service.deleteMany({});
    await Service.insertMany(services);
    console.log('✅ Servicios creados correctamente');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
};

seed();