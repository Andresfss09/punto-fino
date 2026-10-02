require('dotenv').config();
const mongoose = require('mongoose');
const User = require('../models/User');
const Barber = require('../models/Barber');
const Service = require('../models/Service');
const Appointment = require('../models/Appointment');

async function seedDashboardData() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Conectado a MongoDB Atlas');

    // 1. Obtener Barberos
    const nicolasUser = await User.findOne({ email: 'barbero@triadix.co' });
    const andresUser = await User.findOne({ email: 'andres@triadix.co' });
    const luisUser = await User.findOne({ email: 'luis@triadix.co' });

    if (!nicolasUser || !andresUser || !luisUser) {
      console.error('❌ Uno o más barberos no existen en la base de datos.');
      process.exit(1);
    }

    // 2. Obtener Servicios
    const services = await Service.find();
    if (services.length === 0) {
      console.error('❌ No se encontraron servicios.');
      process.exit(1);
    }

    const expWhite = services.find(s => s.name.includes('White')) || services[0];
    const expBlack = services.find(s => s.name.includes('Black')) || services[1] || services[0];
    const expGold = services.find(s => s.name.includes('Gold')) || services[2] || services[0];
    const corteFade = services.find(s => s.name.includes('Corte') || s.name.includes('Fade')) || services[0];
    const barba = services.find(s => s.name.includes('Barba')) || services[0];

    // 3. Eliminar citas de prueba creadas hoy para no duplicar si se ejecuta varias veces
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 2);

    await Appointment.deleteMany({
      date: { $gte: today, $lt: tomorrow },
      confirmationCode: { $regex: /^TRIADIX-/ },
    });

    console.log('🧹 Citas de prueba previas limpiadas');

    // 4. Crear Citas de Prueba para HOY y MAÑANA
    const testAppointments = [
      // --- NICOLÁS CHÁVEZ (barbero@triadix.co) ---
      {
        confirmationCode: 'TRIADIX-01',
        barber: nicolasUser._id,
        clientName: 'Santiago Osorio',
        clientPhone: '315 890 1234',
        clientEmail: 'santiago.osorio@gmail.com',
        clientAddress: 'Cra. 12 #53-51, Villacolombia',
        isGuest: true,
        date: today,
        startTime: '09:00',
        endTime: '09:45',
        services: [{ service: expBlack._id, price: expBlack.price, duration: expBlack.duration }],
        totalPrice: expBlack.price,
        totalDuration: expBlack.duration,
        status: 'completada',
        paymentStatus: 'pagado',
        paymentMethod: 'efectivo',
        commissionPaid: false,
        notes: 'Cliente habitual, degradado medio navaja y toalla caliente.',
      },
      {
        confirmationCode: 'TRIADIX-02',
        barber: nicolasUser._id,
        clientName: 'Mateo Morales',
        clientPhone: '310 456 7890',
        clientEmail: 'mateo.morales@gmail.com',
        clientAddress: 'Calle 44 #12-30, Cali',
        isGuest: true,
        date: today,
        startTime: '10:30',
        endTime: '11:30',
        services: [{ service: expGold._id, price: expGold.price, duration: expGold.duration }],
        totalPrice: expGold.price,
        totalDuration: expGold.duration,
        status: 'completada',
        paymentStatus: 'pagado',
        paymentMethod: 'nequi',
        commissionPaid: false,
        notes: 'Experiencia VIP completa con mascarilla y vapor de ozono.',
      },
      {
        confirmationCode: 'TRIADIX-03',
        barber: nicolasUser._id,
        clientName: 'David Bermúdez',
        clientPhone: '318 765 4321',
        clientEmail: 'david.bermudez@gmail.com',
        clientAddress: 'Cra. 15 #50-20, Cali',
        isGuest: true,
        date: today,
        startTime: '14:30',
        endTime: '15:05',
        services: [{ service: corteFade._id, price: corteFade.price, duration: corteFade.duration }],
        totalPrice: corteFade.price,
        totalDuration: corteFade.duration,
        status: 'en_progreso',
        paymentStatus: 'pendiente',
        paymentMethod: 'transferencia',
        commissionPaid: false,
        notes: 'En silla en este momento, perfilado de cejas incluido.',
      },
      {
        confirmationCode: 'TRIADIX-04',
        barber: nicolasUser._id,
        clientName: 'Alejandro Gómez',
        clientPhone: '312 345 6789',
        clientEmail: 'alejandro.g@gmail.com',
        clientAddress: 'Calle 52 #10-15, Cali',
        isGuest: true,
        date: today,
        startTime: '16:00',
        endTime: '16:45',
        services: [{ service: expBlack._id, price: expBlack.price, duration: expBlack.duration }],
        totalPrice: expBlack.price,
        totalDuration: expBlack.duration,
        status: 'confirmada',
        paymentStatus: 'pendiente',
        paymentMethod: 'efectivo',
        commissionPaid: false,
        notes: 'Cita programada para la tarde, puntual.',
      },
      {
        confirmationCode: 'TRIADIX-05',
        barber: nicolasUser._id,
        clientName: 'Camilo Torres',
        clientPhone: '316 987 6543',
        clientEmail: 'camilo.torres@gmail.com',
        clientAddress: 'Cra. 8 #48-10, Cali',
        isGuest: true,
        date: new Date(today.getTime() + 86400000), // Mañana
        startTime: '11:00',
        endTime: '11:35',
        services: [{ service: expWhite._id, price: expWhite.price, duration: expWhite.duration }],
        totalPrice: expWhite.price,
        totalDuration: expWhite.duration,
        status: 'confirmada',
        paymentStatus: 'pendiente',
        paymentMethod: 'nequi',
        commissionPaid: false,
        notes: 'Corte clásico + lavado.',
      },

      // --- ANDRÉS FELIPE SARRIA (andres@triadix.co) ---
      {
        confirmationCode: 'TRIADIX-06',
        barber: andresUser._id,
        clientName: 'Sebastián Pérez',
        clientPhone: '314 234 5678',
        clientEmail: 'sebastian.p@gmail.com',
        clientAddress: 'Av. 6N #22-10, Cali',
        isGuest: true,
        date: today,
        startTime: '10:00',
        endTime: '10:45',
        services: [{ service: expBlack._id, price: expBlack.price, duration: expBlack.duration }],
        totalPrice: expBlack.price,
        totalDuration: expBlack.duration,
        status: 'completada',
        paymentStatus: 'pagado',
        paymentMethod: 'transferencia',
        commissionPaid: false,
        notes: 'Corte fade con arreglo de barba.',
      },
      {
        confirmationCode: 'TRIADIX-07',
        barber: andresUser._id,
        clientName: 'Felipe Caicedo',
        clientPhone: '317 345 6789',
        clientEmail: 'felipe.c@gmail.com',
        clientAddress: 'Calle 9 #44-12, Cali',
        isGuest: true,
        date: today,
        startTime: '14:00',
        endTime: '14:35',
        services: [{ service: corteFade._id, price: corteFade.price, duration: corteFade.duration }],
        totalPrice: corteFade.price,
        totalDuration: corteFade.duration,
        status: 'completada',
        paymentStatus: 'pagado',
        paymentMethod: 'efectivo',
        commissionPaid: false,
        notes: 'Degradado limpio a navaja.',
      },
      {
        confirmationCode: 'TRIADIX-08',
        barber: andresUser._id,
        clientName: 'Daniel Rivas',
        clientPhone: '311 456 7890',
        clientEmail: 'daniel.rivas@gmail.com',
        clientAddress: 'Cra. 1 #52-40, Cali',
        isGuest: true,
        date: today,
        startTime: '17:00',
        endTime: '17:25',
        services: [{ service: barba._id, price: barba.price, duration: barba.duration }],
        totalPrice: barba.price,
        totalDuration: barba.duration,
        status: 'confirmada',
        paymentStatus: 'pendiente',
        paymentMethod: 'daviplata',
        commissionPaid: false,
        notes: 'Perfilado de barba con toalla tibia.',
      },

      // --- LUIS DE ÁVILA (luis@triadix.co) ---
      {
        confirmationCode: 'TRIADIX-09',
        barber: luisUser._id,
        clientName: 'Javier Mina',
        clientPhone: '319 567 8901',
        clientEmail: 'javier.mina@gmail.com',
        clientAddress: 'Calle 50 #12-05, Cali',
        isGuest: true,
        date: today,
        startTime: '11:30',
        endTime: '12:30',
        services: [{ service: expGold._id, price: expGold.price, duration: expGold.duration }],
        totalPrice: expGold.price,
        totalDuration: expGold.duration,
        status: 'completada',
        paymentStatus: 'pagado',
        paymentMethod: 'nequi',
        commissionPaid: false,
        notes: 'Servicio Gold VIP completo.',
      },
      {
        confirmationCode: 'TRIADIX-10',
        barber: luisUser._id,
        clientName: 'Carlos Restrepo',
        clientPhone: '313 678 9012',
        clientEmail: 'carlos.r@gmail.com',
        clientAddress: 'Cra. 11 #51-30, Cali',
        isGuest: true,
        date: today,
        startTime: '15:30',
        endTime: '16:05',
        services: [{ service: corteFade._id, price: corteFade.price, duration: corteFade.duration }],
        totalPrice: corteFade.price,
        totalDuration: corteFade.duration,
        status: 'pendiente',
        paymentStatus: 'pendiente',
        paymentMethod: 'efectivo',
        commissionPaid: false,
        notes: 'Pendiente de confirmación por WhatsApp.',
      },
    ];

    const inserted = await Appointment.insertMany(testAppointments);
    console.log(`🎉 ${inserted.length} citas de prueba creadas exitosamente para testing de Dashboards.`);

    // 5. Actualizar Barber stats
    await Barber.updateOne({ user: nicolasUser._id }, { commissionRate: 50, isAvailable: true });
    await Barber.updateOne({ user: andresUser._id }, { commissionRate: 50, isAvailable: true });
    await Barber.updateOne({ user: luisUser._id }, { commissionRate: 50, isAvailable: true });
    console.log('✅ Barberos actualizados con tasa de comisión del 50%');

    process.exit(0);
  } catch (error) {
    console.error('❌ Error creando datos de prueba:', error);
    process.exit(1);
  }
}

seedDashboardData();
