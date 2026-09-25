const nodemailer = require('nodemailer').default || require('nodemailer');

const createTransporter = () => {
  return nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: parseInt(process.env.EMAIL_PORT) || 587,
    secure: false,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });
};

const emailStyles = `
  body { font-family: 'Arial', sans-serif; background: #0a0a0a; color: #ffffff; margin: 0; padding: 0; }
  .container { max-width: 600px; margin: 0 auto; background: #111111; border-radius: 12px; overflow: hidden; }
  .header { background: linear-gradient(135deg, #d4af37, #f0d060); padding: 32px; text-align: center; }
  .header h1 { color: #000000; margin: 0; font-size: 28px; letter-spacing: 3px; }
  .header p { color: #333333; margin: 8px 0 0; font-size: 12px; letter-spacing: 2px; text-transform: uppercase; }
  .body { padding: 32px; }
  .body h2 { color: #d4af37; font-size: 22px; }
  .body p { color: #cccccc; line-height: 1.7; }
  .detail-box { background: #1a1a1a; border: 1px solid #d4af37; border-radius: 8px; padding: 20px; margin: 20px 0; }
  .detail-box p { margin: 6px 0; color: #cccccc; font-size: 14px; }
  .detail-box strong { color: #d4af37; }
  .btn { display: inline-block; background: linear-gradient(135deg, #d4af37, #f0d060); color: #000000; padding: 14px 32px; border-radius: 8px; text-decoration: none; font-weight: bold; margin: 16px 0; }
  .footer { text-align: center; padding: 20px; border-top: 1px solid #222; }
  .footer p { color: #555; font-size: 12px; }
`;

exports.sendWelcomeEmail = async (user) => {
  const html = `
    <html><head><style>${emailStyles}</style></head>
    <body><div class="container">
      <div class="header"><h1>👑 STEEL HOUSE</h1><p>Barberia's · Cali</p></div>
      <div class="body">
        <h2>¡Bienvenido, ${user.name}! 🔥</h2>
        <p>Tu cuenta ha sido creada exitosamente. Ahora puedes reservar citas con los mejores barberos de Cali.</p>
        <div class="detail-box">
          <p><strong>Email:</strong> ${user.email}</p>
          <p><strong>Rol:</strong> ${user.role === 'cliente' ? 'Cliente' : 'Barbero'}</p>
          <p><strong>Puntos de fidelidad:</strong> 0 pts</p>
        </div>
        <p>Reserva tu primera cita y empieza a acumular puntos exclusivos.</p>
        <a href="${process.env.CLIENT_URL}" class="btn">RESERVAR AHORA</a>
      </div>
      <div class="footer"><p>© ${new Date().getFullYear()} Steel House Barberia's · Cra. 16 #33F-31, Cali</p></div>
    </div></body></html>
  `;

  const transporter = createTransporter();
  await transporter.sendMail({
    from: process.env.EMAIL_FROM,
    to: user.email,
    subject: '¡Bienvenido a Punto Fino! ✂️',
    html,
  });
};

exports.sendAppointmentConfirmationEmail = async (appointment) => {
  try {
    const { client, barber, services, date, startTime, endTime, totalDuration, totalPrice, confirmationCode, paymentMethod, clientName: cName, clientEmail: cEmail, clientAddress: cAddr } = appointment;

    const emailTo = cEmail || client?.email;
    const displayName = cName || client?.name || 'Cliente';
    const displayAddress = cAddr || client?.address;

    if (!emailTo) return;

    const servicesList = services?.map(s => s.service?.name || 'Servicio').join(', ') || 'Corte de cabello';

    const html = `
      <html><head><style>${emailStyles}</style></head>
      <body><div class="container">
        <div class="header"><h1>👑 STEEL HOUSE</h1><p>Confirmación de Cita</p></div>
        <div class="body">
          <h2>¡Tu cita ha sido confirmada! ✅</h2>
          <p>Hola <strong>${displayName}</strong>, tu reserva en Steel House Barberia's ha sido agendada con éxito.</p>
          <div class="detail-box">
            <p><strong>Código de reserva:</strong> ${confirmationCode}</p>
            <p><strong>Barbero asignado:</strong> ${barber?.name || 'Barbero Steel House'}</p>
            <p><strong>Fecha:</strong> ${new Date(date).toLocaleDateString('es-CO', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
            <p><strong>Horario:</strong> ${startTime} - ${endTime} (aprox. ${totalDuration} min)</p>
            <p><strong>Servicio(s):</strong> ${servicesList}</p>
            <p><strong>Método de pago:</strong> ${paymentMethod || 'Efectivo'}</p>
            <p><strong>Total a pagar:</strong> $${totalPrice.toLocaleString('es-CO')} COP</p>
            ${displayAddress ? `<p><strong>Dirección registrada:</strong> ${displayAddress}</p>` : ''}
          </div>
          <p>📍 <strong>Ubicación de la Barbería:</strong> Cra. 16 #33F-31, Cali, Colombia.</p>
          <p>Te recomendamos llegar 5 a 10 minutos antes de la hora acordada.</p>
        </div>
        <div class="footer"><p>© ${new Date().getFullYear()} Steel House Barberia's · Cra. 16 #33F-31, Cali</p></div>
      </div></body></html>
    `;

    const transporter = createTransporter();
    await transporter.sendMail({
      from: process.env.EMAIL_FROM || '"Steel House Barberia\'s" <noreply@steelhouse.com>',
      to: emailTo,
      subject: `¡Cita confirmada en Steel House! - ${confirmationCode} ✂️`,
      html,
    });
    console.log(`[Email] Confirmación enviada al cliente: ${emailTo}`);
  } catch (error) {
    console.error('[Email Error] Error enviando confirmación al cliente:', error.message);
  }
};

exports.sendAppointmentNotificationToBarber = async (appointment) => {
  try {
    const { client, barber, services, date, startTime, endTime, totalDuration, totalPrice, confirmationCode, notes, paymentMethod, clientName: cName, clientPhone: cPhone, clientEmail: cEmail, clientAddress: cAddr } = appointment;

    if (!barber || !barber.email) return;

    const displayName = cName || client?.name || 'Cliente';
    const displayPhone = cPhone || client?.phone || 'No registrado';
    const displayEmail = cEmail || client?.email || 'No registrado';
    const displayAddress = cAddr || client?.address;

    const servicesList = services?.map(s => s.service?.name || 'Servicio').join(', ') || 'Corte de cabello';

    const html = `
      <html><head><style>${emailStyles}</style></head>
      <body><div class="container">
        <div class="header"><h1>👑 STEEL HOUSE</h1><p>Nueva Cita Asignada</p></div>
        <div class="body">
          <h2>¡Tienes un nuevo cliente agendado! 💈</h2>
          <p>Hola <strong>${barber.name}</strong>, se ha programado una nueva cita en tu agenda:</p>
          <div class="detail-box">
            <p><strong>Código de cita:</strong> ${confirmationCode}</p>
            <p><strong>Cliente:</strong> ${displayName}</p>
            <p><strong>Teléfono cliente:</strong> ${displayPhone}</p>
            <p><strong>Email cliente:</strong> ${displayEmail}</p>
            ${displayAddress ? `<p><strong>Dirección cliente:</strong> ${displayAddress}</p>` : ''}
            <p><strong>Fecha:</strong> ${new Date(date).toLocaleDateString('es-CO', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
            <p><strong>Horario:</strong> ${startTime} - ${endTime} (${totalDuration} min)</p>
            <p><strong>Servicio(s):</strong> ${servicesList}</p>
            <p><strong>Valor estimado:</strong> $${totalPrice.toLocaleString('es-CO')} COP (${paymentMethod || 'Efectivo'})</p>
            ${notes ? `<p><strong>Nota del cliente:</strong> <em>"${notes}"</em></p>` : ''}
          </div>
          <p>Puedes gestionar el estado de esta cita desde tu panel de barbero.</p>
        </div>
        <div class="footer"><p>© ${new Date().getFullYear()} Steel House Barberia's · Cali</p></div>
      </div></body></html>
    `;

    const transporter = createTransporter();
    await transporter.sendMail({
      from: process.env.EMAIL_FROM || '"Steel House Barberia\'s" <noreply@steelhouse.com>',
      to: barber.email,
      subject: `¡Nueva cita agendada! - ${client.name} (${startTime}) ✂️`,
      html,
    });
    console.log(`[Email] Notificación enviada al barbero: ${barber.email}`);
  } catch (error) {
    console.error('[Email Error] Error enviando notificación al barbero:', error.message);
  }
};

exports.sendPasswordResetEmail = async (user, token) => {
  const resetUrl = `${process.env.CLIENT_URL}/reset-password/${token}`;

  const html = `
    <html><head><style>${emailStyles}</style></head>
    <body><div class="container">
      <div class="header"><h1>👑 STEEL HOUSE</h1><p>Recuperar Contraseña</p></div>
      <div class="body">
        <h2>Restablecer Contraseña</h2>
        <p>Haz clic en el botón para crear una nueva contraseña. Este enlace expira en 30 minutos.</p>
        <a href="${resetUrl}" class="btn">RESTABLECER CONTRASEÑA</a>
        <p>Si no solicitaste esto, ignora este email.</p>
      </div>
      <div class="footer"><p>© ${new Date().getFullYear()} Steel House Barberia's · Cra. 16 #33F-31, Cali</p></div>
    </div></body></html>
  `;

  const transporter = createTransporter();
  await transporter.sendMail({
    from: process.env.EMAIL_FROM,
    to: user.email,
    subject: 'Recuperar contraseña - Punto Fino',
    html,
  });
};