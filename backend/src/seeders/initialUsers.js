require('dotenv').config();
const connectDB = require('../config/database');
const User = require('../models/User');
const Barber = require('../models/Barber');

const seedUsers = async () => {
  try {
    await connectDB();

    // 1. Admin Steel House
    const adminEmail = 'admin@steelhouse.com';
    let admin = await User.findOne({ email: adminEmail });
    if (!admin) {
      admin = await User.create({
        name: 'Admin Steel House',
        email: adminEmail,
        phone: '3001112233',
        password: 'admin123456',
        role: 'admin',
        isVerified: true,
      });
      console.log('✅ Admin creado: admin@steelhouse.com / admin123456');
    }

    // 2. Barbero 1 (Juan Muñeton)
    const barber1Email = 'juan@steelhouse.com';
    let barberUser1 = await User.findOne({ email: barber1Email });
    if (!barberUser1) {
      barberUser1 = await User.create({
        name: 'Juan Muñeton',
        email: barber1Email,
        phone: '3158965266',
        password: 'barbero123',
        role: 'barbero',
        isVerified: true,
      });
      await Barber.create({
        user: barberUser1._id,
        bio: 'Fundador y Master Barber. Especialista en la Experiencia Gold, visagismo y cortes de alta precisión.',
        specialties: ['degradado', 'corte clásico', 'barba', 'diseño'],
        rating: { average: 5.0, count: 42 },
        isAvailable: true,
      });
      console.log('✅ Barbero Juan Muñeton creado: juan@steelhouse.com / barbero123');
    }

    // 3. Barbero 2 (Carlos Mendoza)
    const barber2Email = 'carlos@steelhouse.com';
    let barberUser2 = await User.findOne({ email: barber2Email });
    if (!barberUser2) {
      barberUser2 = await User.create({
        name: 'Carlos Mendoza',
        email: barber2Email,
        phone: '3109876543',
        password: 'barbero123',
        role: 'barbero',
        isVerified: true,
      });
      await Barber.create({
        user: barberUser2._id,
        bio: 'Especialista en degradados limpios, perfilado de barba al detalle y cuidado capilar.',
        specialties: ['degradado', 'corte clásico', 'barba'],
        rating: { average: 4.9, count: 28 },
        isAvailable: true,
      });
      console.log('✅ Barbero Carlos creado: carlos@steelhouse.com / barbero123');
    }

    // 4. Cliente Steel House
    const clientEmail = 'cliente@steelhouse.com';
    let client = await User.findOne({ email: clientEmail });
    if (!client) {
      client = await User.create({
        name: 'Nicolás Cliente',
        email: clientEmail,
        phone: '3007654321',
        password: 'cliente123',
        role: 'cliente',
        isVerified: true,
        loyaltyPoints: 100,
      });
      console.log('✅ Cliente creado: cliente@steelhouse.com / cliente123');
    }

    console.log('🎉 Seed de usuarios de Steel House finalizado con éxito.');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error en seedUsers:', error.message);
    process.exit(1);
  }
};

seedUsers();
