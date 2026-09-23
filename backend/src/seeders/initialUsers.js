require('dotenv').config();
const connectDB = require('../config/database');
const User = require('../models/User');
const Barber = require('../models/Barber');

const seedUsers = async () => {
  try {
    await connectDB();

    // 1. Admin
    const adminEmail = 'admin@puntofino.com';
    let admin = await User.findOne({ email: adminEmail });
    if (!admin) {
      admin = await User.create({
        name: 'Administrador Punto Fino',
        email: adminEmail,
        phone: '3001112233',
        password: 'admin123456',
        role: 'admin',
        isVerified: true,
      });
      console.log('✅ Admin creado: admin@puntofino.com / admin123456');
    } else {
      console.log('ℹ️ Admin ya existe');
    }

    // 2. Barbero 1 (Carlos)
    const barber1Email = 'carlos@puntofino.com';
    let barberUser1 = await User.findOne({ email: barber1Email });
    if (!barberUser1) {
      barberUser1 = await User.create({
        name: 'Carlos Mendoza',
        email: barber1Email,
        phone: '3109876543',
        password: 'barbero123',
        role: 'barbero',
        isVerified: true,
      });
      await Barber.create({
        user: barberUser1._id,
        bio: 'Master barber con más de 8 años de experiencia en fades y cortes clásicos.',
        specialties: ['degradado', 'corte clásico', 'barba'],
        rating: { average: 4.9, count: 28 },
        isAvailable: true,
      });
      console.log('✅ Barbero Carlos creado: carlos@puntofino.com / barbero123');
    } else {
      console.log('ℹ️ Barbero Carlos ya existe');
    }

    // 3. Barbero 2 (Mateo)
    const barber2Email = 'mateo@puntofino.com';
    let barberUser2 = await User.findOne({ email: barber2Email });
    if (!barberUser2) {
      barberUser2 = await User.create({
        name: 'Mateo Gómez',
        email: barber2Email,
        phone: '3205556677',
        password: 'barbero123',
        role: 'barbero',
        isVerified: true,
      });
      await Barber.create({
        user: barberUser2._id,
        bio: 'Especialista en perfilado de barba al detalle, diseños urbanos y tratamientos faciales.',
        specialties: ['barba', 'diseño', 'mascarilla'],
        rating: { average: 4.8, count: 19 },
        isAvailable: true,
      });
      console.log('✅ Barbero Mateo creado: mateo@puntofino.com / barbero123');
    } else {
      console.log('ℹ️ Barbero Mateo ya existe');
    }

    // 4. Cliente
    const clientEmail = 'cliente@puntofino.com';
    let client = await User.findOne({ email: clientEmail });
    if (!client) {
      client = await User.create({
        name: 'Nicolás Cliente',
        email: clientEmail,
        phone: '3007654321',
        password: 'cliente123',
        role: 'cliente',
        isVerified: true,
        loyaltyPoints: 50,
      });
      console.log('✅ Cliente creado: cliente@puntofino.com / cliente123');
    } else {
      console.log('ℹ️ Cliente ya existe');
    }

    console.log('🎉 Seed de usuarios finalizado con éxito.');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error en seedUsers:', error.message);
    process.exit(1);
  }
};

seedUsers();

