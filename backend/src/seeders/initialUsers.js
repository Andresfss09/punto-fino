require('dotenv').config();
const connectDB = require('../config/database');
const User = require('../models/User');
const Barber = require('../models/Barber');

const seedUsers = async () => {
  try {
    await connectDB();

    // 1. Admin Punto Fino
    const adminEmail = process.env.ADMIN_EMAIL || 'admin@puntofino.com';
    let admin = await User.findOne({ email: { $in: [adminEmail, 'admin@steelhouse.com'] } });
    if (!admin) {
      admin = await User.create({
        name: 'Admin Punto Fino',
        email: adminEmail,
        phone: '3001112233',
        password: 'admin123456',
        role: 'admin',
        isVerified: true,
      });
      console.log(`✅ Admin creado: ${adminEmail} / admin123456`);
    }

    // 2. Barbero 1 (Juan David)
    const barber1Email = 'juan.david@puntofino.com';
    let barberUser1 = await User.findOne({ email: { $in: [barber1Email, 'juan@puntofino.com', 'juan@steelhouse.com'] } });
    if (!barberUser1) {
      barberUser1 = await User.create({
        name: 'Juan David',
        email: barber1Email,
        phone: '3122398964',
        password: 'barbero123',
        role: 'barbero',
        isVerified: true,
      });
      await Barber.create({
        user: barberUser1._id,
        bio: 'Master Barber y Asesor de Imagen. Especialista en la Experiencia Platinium, visagismo facial y cortes de alta precisión.',
        specialties: ['Experiencia Platinium', 'visagismo', 'degradado'],
        rating: { average: 4.9, count: 16 },
        isAvailable: true,
      });
      console.log('✅ Barbero Juan David creado: juan.david@puntofino.com / barbero123');
    }

    // 3. Barbero 2 (Juan Diego)
    const barber2Email = 'juan.diego@puntofino.com';
    let barberUser2 = await User.findOne({ email: { $in: [barber2Email, 'carlos@puntofino.com', 'carlos@steelhouse.com'] } });
    if (!barberUser2) {
      barberUser2 = await User.create({
        name: 'Juan Diego',
        email: barber2Email,
        phone: '3122398964',
        password: 'barbero123',
        role: 'barbero',
        isVerified: true,
      });
      await Barber.create({
        user: barberUser2._id,
        bio: 'Especialista en Ritual de Barba & Corte. Maestro en afeitado tradicional a navaja, vapor ozono y diseño de barba.',
        specialties: ['Ritual de Barba', 'navaja libre', 'vapor ozono'],
        rating: { average: 5.0, count: 16 },
        isAvailable: true,
      });
      console.log('✅ Barbero Juan Diego creado: juan.diego@puntofino.com / barbero123');
    }

    // 4. Barbero 3 (Emanuel Torres)
    const barber3Email = 'emanuel@puntofino.com';
    let barberUser3 = await User.findOne({ email: { $in: [barber3Email, 'mateo@puntofino.com'] } });
    if (!barberUser3) {
      barberUser3 = await User.create({
        name: 'Emanuel Torres',
        email: barber3Email,
        phone: '3122398964',
        password: 'barbero123',
        role: 'barbero',
        isVerified: true,
      });
      await Barber.create({
        user: barberUser3._id,
        bio: 'Especialista en Tendencia & Textura. Experto en perfilado de cejas, cortes clásicos y texturizados en tendencia.',
        specialties: ['corte clásico', 'cejas', 'tendencias'],
        rating: { average: 4.9, count: 16 },
        isAvailable: true,
      });
      console.log('✅ Barbero Emanuel Torres creado: emanuel@puntofino.com / barbero123');
    }

    // 4. Cliente Punto Fino
    const clientEmail = 'cliente@puntofino.com';
    let client = await User.findOne({ email: { $in: [clientEmail, 'cliente@steelhouse.com'] } });
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
      console.log('✅ Cliente creado: cliente@puntofino.com / cliente123');
    }

    console.log('🎉 Seed de usuarios de Punto Fino finalizado con éxito.');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error en seedUsers:', error.message);
    process.exit(1);
  }
};

seedUsers();
