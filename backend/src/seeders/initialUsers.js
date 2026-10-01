require('dotenv').config();
const connectDB = require('../config/database');
const User = require('../models/User');
const Barber = require('../models/Barber');

const seedUsers = async () => {
  try {
    await connectDB();

    // 1. Admin Triadix
    const adminEmail = process.env.ADMIN_EMAIL || 'admin@triadix.co';
    let admin = await User.findOne({ email: { $in: [adminEmail, 'admin@puntofino.com', 'admin@steelhouse.com'] } });
    if (!admin) {
      admin = await User.create({
        name: 'Admin Triadix',
        email: adminEmail,
        phone: '3001112233',
        password: 'admin123456',
        role: 'admin',
        isVerified: true,
      });
      console.log(`✅ Admin creado: ${adminEmail} / admin123456`);
    }

    // 2. Barbero 1 (Andrés Felipe Sarria)
    const barber1Email = 'andres@triadix.co';
    let barberUser1 = await User.findOne({ email: { $in: [barber1Email, 'juan.david@puntofino.com', 'juan@puntofino.com'] } });
    if (!barberUser1) {
      barberUser1 = await User.create({
        name: 'Andrés Felipe Sarria',
        email: barber1Email,
        phone: '3122398964',
        password: 'barbero123',
        role: 'barbero',
        isVerified: true,
      });
      await Barber.create({
        user: barberUser1._id,
        bio: 'Cofundador de Triadix. Especialista en diagnóstico morfológico, arquitectura craneofacial y cortes de alta precisión milimétrica.',
        specialties: ['Visagismo Craneal', 'Experiencia Signature', 'Degradados de Autor'],
        rating: { average: 4.9, count: 24 },
        isAvailable: true,
      });
      console.log('✅ Barbero Andrés Felipe Sarria creado: andres@triadix.co / barbero123');
    }

    // 3. Barbero 2 (Nicolás Chávez)
    const barber2Email = 'nicolas@triadix.co';
    let barberUser2 = await User.findOne({ email: { $in: [barber2Email, 'juan.diego@puntofino.com', 'carlos@puntofino.com'] } });
    if (!barberUser2) {
      barberUser2 = await User.create({
        name: 'Nicolás Chávez',
        email: barber2Email,
        phone: '3122398964',
        password: 'barbero123',
        role: 'barbero',
        isVerified: true,
      });
      await Barber.create({
        user: barberUser2._id,
        bio: 'Cofundador de Triadix. Maestro en rituales clásicos a navaja, diseño geométrico de barba y bienestar dérmico con toallas calientes.',
        specialties: ['Ritual de Barba', 'Navaja Libre', 'Vapor Ozono'],
        rating: { average: 5.0, count: 28 },
        isAvailable: true,
      });
      console.log('✅ Barbero Nicolás Chávez creado: nicolas@triadix.co / barbero123');
    }

    // 4. Barbero 3 (Luis De Ávila)
    const barber3Email = 'luis@triadix.co';
    let barberUser3 = await User.findOne({ email: { $in: [barber3Email, 'emanuel@puntofino.com'] } });
    if (!barberUser3) {
      barberUser3 = await User.create({
        name: 'Luis De Ávila',
        email: barber3Email,
        phone: '3122398964',
        password: 'barbero123',
        role: 'barbero',
        isVerified: true,
      });
      await Barber.create({
        user: barberUser3._id,
        bio: 'Cofundador de Triadix. Maestro de la textura y el degradado limpio, perfilado geométrico de cejas y vanguardia estética masculina.',
        specialties: ['Fade Milimétrico', 'Perfilado Geométrico', 'Texturizado'],
        rating: { average: 4.9, count: 19 },
        isAvailable: true,
      });
      console.log('✅ Barbero Luis De Ávila creado: luis@triadix.co / barbero123');
    }

    // 5. Cliente Triadix
    const clientEmail = 'cliente@triadix.co';
    let client = await User.findOne({ email: { $in: [clientEmail, 'cliente@puntofino.com', 'cliente@steelhouse.com'] } });
    if (!client) {
      client = await User.create({
        name: 'Cliente Triadix',
        email: clientEmail,
        phone: '3007654321',
        password: 'cliente123',
        role: 'cliente',
        isVerified: true,
        loyaltyPoints: 100,
      });
      console.log('✅ Cliente creado: cliente@triadix.co / cliente123');
    }

    console.log('🎉 Seed de usuarios de Triadix finalizado con éxito.');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error en seedUsers:', error.message);
    process.exit(1);
  }
};

seedUsers();
