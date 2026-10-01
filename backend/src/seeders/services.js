require('dotenv').config();
const connectDB = require('../config/database');
const Service = require('../models/Service');

const services = [
  {
    name: 'Combo Completo Triadix (Corte + Barba + Facial)',
    description: 'El servicio más completo: corte a tu gusto, arreglo y perfilado de barba a navaja, toalla caliente, exfoliación facial suave y mascarilla refrescante.',
    price: 55000,
    duration: 60,
    category: 'combo',
    image: 'https://images.unsplash.com/photo-1585747860715-2ba37e788b70?auto=format&fit=crop&w=1200&q=80',
    isPopular: true,
    isActive: true,
    order: 1,
  },
  {
    name: 'Corte de Cabello + Arreglo de Barba',
    description: 'La combinación perfecta: corte de cabello con degradado fade o clásico, lavado capilar, toalla tibia y perfilado de barba a navaja con aceites hidratantes.',
    price: 34000,
    duration: 45,
    category: 'combo',
    image: 'https://images.unsplash.com/photo-1621605815971-fbc98d665033?auto=format&fit=crop&w=1200&q=80',
    isPopular: true,
    isActive: true,
    order: 2,
  },
  {
    name: 'Corte de Cabello + Cejas',
    description: 'Corte moderno o clásico según tu estilo, perfilado limpio de cejas a navaja, lavado capilar y peinado con producto profesional.',
    price: 24000,
    duration: 35,
    category: 'corte',
    image: 'https://images.unsplash.com/photo-1622286342621-4bd786c2447c?auto=format&fit=crop&w=1200&q=80',
    isPopular: true,
    isActive: true,
    order: 3,
  },
  {
    name: 'Arreglo y Perfilado de Barba',
    description: 'Delineado y arreglo de barba con navaja tradicional, toalla caliente para abrir los poros y aceites nutritivos para un afeitado suave.',
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
    description: 'Limpieza y perfilado limpio de cejas con navaja y tijera para un rostro pulido y natural.',
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