const mongoose = require('mongoose');
require('dotenv').config();

const User = require('../models/User');
const Service = require('../models/Service');
const Appointment = require('../models/Appointment');

const seedAppointments = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('MongoDB conectado para sembrar citas de prueba...');

    // Get barbers
    const juan = await User.findOne({ email: { $in: ['juan.david@puntofino.com', 'juan@puntofino.com', 'juan@steelhouse.com'] } });
    const diego = await User.findOne({ email: { $in: ['juan.diego@puntofino.com', 'carlos@puntofino.com', 'carlos@steelhouse.com'] } });
    const emanuel = await User.findOne({ email: { $in: ['emanuel@puntofino.com', 'mateo@puntofino.com'] } });

    const targetBarbers = [juan, diego, emanuel].filter(Boolean);

    if (targetBarbers.length === 0) {
      console.log('No se encontraron barberos de Punto Fino.');
      process.exit(1);
    }

    // Get services
    const expPlatinium = await Service.findOne({ name: 'Experiencia Platinium / Gol de Oro' }) || await Service.findOne({});
    const expRitual = await Service.findOne({ name: 'Experiencia Punto Fino + Ritual de Barba' }) || expPlatinium;
    const expCorte = await Service.findOne({ name: 'Experiencia Punto Fino (Corte + Cejas)' }) || expPlatinium;
    const ritualBarba = await Service.findOne({ name: 'Ritual de Barba' }) || expPlatinium;

    // Ensure clients exist
    const clientData = [
      { name: 'Andrés Silva', email: 'andres.silva@gmail.com', phone: '3158901234', password: 'Password123!', role: 'cliente', isVerified: true },
      { name: 'Santiago Osorio', email: 'santiago.osorio@gmail.com', phone: '3124567890', password: 'Password123!', role: 'cliente', isVerified: true },
      { name: 'Mateo Morales', email: 'mateo.morales@gmail.com', phone: '3201234567', password: 'Password123!', role: 'cliente', isVerified: true },
      { name: 'David Bermúdez', email: 'david.bermudez@gmail.com', phone: '3109876543', password: 'Password123!', role: 'cliente', isVerified: true },
    ];

    const clients = [];
    for (const c of clientData) {
      let clientUser = await User.findOne({ email: c.email });
      if (!clientUser) {
        clientUser = await User.create(c);
      }
      clients.push(clientUser);
    }

    // Clean existing appointments to avoid cluttering or duplicates
    await Appointment.deleteMany({});
    console.log('Citas anteriores limpiadas.');

    const now = new Date();

    for (const barber of targetBarbers) {
      // 1. Cita completada HOY
      const todayCut = new Date(now);
      await Appointment.create({
        client: clients[0]._id,
        barber: barber._id,
        services: [{ service: expCorte._id, price: expCorte.price, duration: expCorte.duration }],
        date: todayCut,
        startTime: '09:00',
        endTime: '09:35',
        totalPrice: expCorte.price,
        totalDuration: expCorte.duration,
        status: 'completada',
        paymentStatus: 'pagado',
        paymentMethod: 'efectivo',
        confirmationCode: `PF-${Math.random().toString(36).substring(2, 8).toUpperCase()}`,
        notes: 'Corte de autor con diseño de cejas',
      });

      // 2. Cita en progreso o pendiente HOY
      const todayPending = new Date(now);
      await Appointment.create({
        client: clients[1]._id,
        barber: barber._id,
        services: [
          { service: expRitual._id, price: expRitual.price, duration: expRitual.duration },
        ],
        date: todayPending,
        startTime: '11:00',
        endTime: '11:45',
        totalPrice: expRitual.price,
        totalDuration: 45,
        status: 'en_progreso',
        paymentStatus: 'pendiente',
        paymentMethod: 'nequi',
        confirmationCode: `PF-${Math.random().toString(36).substring(2, 8).toUpperCase()}`,
        notes: 'Cliente frecuente, ritual de barba con toalla caliente',
      });

      // 3. Cita agendada para la tarde HOY
      const todayAfternoon = new Date(now);
      await Appointment.create({
        client: clients[2]._id,
        barber: barber._id,
        services: [{ service: expPlatinium._id, price: expPlatinium.price, duration: expPlatinium.duration }],
        date: todayAfternoon,
        startTime: '15:30',
        endTime: '16:30',
        totalPrice: expPlatinium.price,
        totalDuration: 60,
        status: 'confirmada',
        paymentStatus: 'pagado',
        paymentMethod: 'daviplata',
        confirmationCode: `PF-${Math.random().toString(36).substring(2, 8).toUpperCase()}`,
        notes: 'Servicio Platinium VIP completo',
      });

      // 4. Cita completada hace 2 días (esta semana)
      const twoDaysAgo = new Date(now);
      twoDaysAgo.setDate(now.getDate() - 2);
      await Appointment.create({
        client: clients[3]._id,
        barber: barber._id,
        services: [{ service: ritualBarba._id, price: ritualBarba.price, duration: ritualBarba.duration }],
        date: twoDaysAgo,
        startTime: '14:00',
        endTime: '14:20',
        totalPrice: ritualBarba.price,
        totalDuration: 20,
        status: 'completada',
        paymentStatus: 'pagado',
        paymentMethod: 'nequi',
        confirmationCode: `PF-${Math.random().toString(36).substring(2, 8).toUpperCase()}`,
      });

      // 5. Cita completada la semana anterior (este mes)
      const sixDaysAgo = new Date(now);
      sixDaysAgo.setDate(now.getDate() - 6);
      await Appointment.create({
        client: clients[0]._id,
        barber: barber._id,
        services: [{ service: expPlatinium._id, price: expPlatinium.price, duration: expPlatinium.duration }],
        date: sixDaysAgo,
        startTime: '16:00',
        endTime: '17:00',
        totalPrice: expPlatinium.price,
        totalDuration: 60,
        status: 'completada',
        paymentStatus: 'pagado',
        paymentMethod: 'transferencia',
        confirmationCode: `PF-${Math.random().toString(36).substring(2, 8).toUpperCase()}`,
      });
    }

    console.log('¡Citas de prueba sembradas exitosamente para los barberos!');
    process.exit(0);
  } catch (error) {
    console.error('Error al sembrar citas:', error);
    process.exit(1);
  }
};

seedAppointments();

