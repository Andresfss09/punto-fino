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
    const juan = await User.findOne({ email: 'juan@steelhouse.com' });
    const carlos = await User.findOne({ email: 'carlos@steelhouse.com' });

    if (!juan && !carlos) {
      console.log('No se encontraron barberos de Steel House.');
      process.exit(1);
    }

    // Get services
    const expWhite = await Service.findOne({ name: 'Experiencia White' });
    const expBlack = await Service.findOne({ name: 'Experiencia Black' });
    const expGold = await Service.findOne({ name: 'Experiencia Gold VIP 👑' });
    const barba = await Service.findOne({ name: 'Perfilado de Barba' });

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

    const targetBarbers = [juan, carlos].filter(Boolean);

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
        services: [{ service: expWhite._id, price: expWhite.price, duration: expWhite.duration }],
        date: todayCut,
        startTime: '09:00',
        endTime: '09:45',
        totalPrice: expWhite.price,
        totalDuration: expWhite.duration,
        status: 'completada',
        paymentStatus: 'pagado',
        paymentMethod: 'efectivo',
        confirmationCode: `ST-${Math.random().toString(36).substring(2, 8).toUpperCase()}`,
        notes: 'Corte fade bajo con raya lateral',
      });

      // 2. Cita en progreso o pendiente HOY
      const todayPending = new Date(now);
      await Appointment.create({
        client: clients[1]._id,
        barber: barber._id,
        services: [
          { service: expBlack._id, price: expBlack.price, duration: expBlack.duration },
          { service: barba._id, price: barba.price, duration: barba.duration },
        ],
        date: todayPending,
        startTime: '11:00',
        endTime: '12:00',
        totalPrice: expBlack.price + barba.price,
        totalDuration: 60,
        status: 'en_progreso',
        paymentStatus: 'pendiente',
        paymentMethod: 'nequi',
        confirmationCode: `ST-${Math.random().toString(36).substring(2, 8).toUpperCase()}`,
        notes: 'Cliente frecuente, perfilado de barba marcado',
      });

      // 3. Cita agendada para la tarde HOY
      const todayAfternoon = new Date(now);
      await Appointment.create({
        client: clients[2]._id,
        barber: barber._id,
        services: [{ service: expGold._id, price: expGold.price, duration: expGold.duration }],
        date: todayAfternoon,
        startTime: '15:30',
        endTime: '16:30',
        totalPrice: expGold.price,
        totalDuration: 60,
        status: 'confirmada',
        paymentStatus: 'pagado',
        paymentMethod: 'daviplata',
        confirmationCode: `ST-${Math.random().toString(36).substring(2, 8).toUpperCase()}`,
        notes: 'Servicio VIP completo con bebida',
      });

      // 4. Cita completada hace 2 días (esta semana)
      const twoDaysAgo = new Date(now);
      twoDaysAgo.setDate(now.getDate() - 2);
      await Appointment.create({
        client: clients[3]._id,
        barber: barber._id,
        services: [{ service: expBlack._id, price: expBlack.price, duration: expBlack.duration }],
        date: twoDaysAgo,
        startTime: '14:00',
        endTime: '14:45',
        totalPrice: expBlack.price,
        totalDuration: 45,
        status: 'completada',
        paymentStatus: 'pagado',
        paymentMethod: 'nequi',
        confirmationCode: `ST-${Math.random().toString(36).substring(2, 8).toUpperCase()}`,
      });

      // 5. Cita completada la semana anterior (este mes)
      const sixDaysAgo = new Date(now);
      sixDaysAgo.setDate(now.getDate() - 6);
      await Appointment.create({
        client: clients[0]._id,
        barber: barber._id,
        services: [{ service: expGold._id, price: expGold.price, duration: expGold.duration }],
        date: sixDaysAgo,
        startTime: '16:00',
        endTime: '17:00',
        totalPrice: expGold.price,
        totalDuration: 60,
        status: 'completada',
        paymentStatus: 'pagado',
        paymentMethod: 'transferencia',
        confirmationCode: `ST-${Math.random().toString(36).substring(2, 8).toUpperCase()}`,
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
