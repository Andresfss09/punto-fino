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
  body { font-family: 'Arial', sans-serif; background: #0e1311; color: #ffffff; margin: 0; padding: 0; }
  .container { max-width: 600px; margin: 0 auto; background: #121815; border-radius: 6px; border: 1px solid #222a26; overflow: hidden; }
  .header { background: #161d19; padding: 32px; text-align: center; border-bottom: 2px solid #cfa53b; }
  .header h1 { color: #ffffff; margin: 0; font-size: 26px; letter-spacing: 2px; font-style: italic; }
  .header p { color: #cfa53b; margin: 8px 0 0; font-size: 11px; letter-spacing: 3px; text-transform: uppercase; font-weight: bold; }
  .body { padding: 32px; }
  .body h2 { color: #ffffff; font-size: 20px; font-style: italic; }
  .body p { color: #b3b3b3; line-height: 1.7; font-size: 14px; }
  .detail-box { background: #101513; border: 1px solid #2b3530; border-radius: 4px; padding: 20px; margin: 20px 0; }
  .detail-box p { margin: 7px 0; color: #b3b3b3; font-size: 13px; }
  .detail-box strong { color: #ffffff; }
  .btn { display: inline-block; background: #cfa53b; color: #0e1311; padding: 12px 28px; border-radius: 4px; text-decoration: none; font-weight: bold; margin: 16px 0; font-size: 12px; letter-spacing: 1px; text-transform: uppercase; }
  .footer { text-align: center; padding: 20px; border-top: 1px solid #1f2723; }
  .footer p { color: #666; font-size: 11px; }
`;

exports.sendWelcomeEmail = async (user) => {
  const html = `
    <html><head><style>${emailStyles}</style></head>
    <body><div class="container">
      <div class="header"><h1>PUNTO FINO</h1><p>Barbería de Autor · Cali</p></div>
      <div class="body">
        <h2>¡Bienvenido, ${user.name}!</h2>
        <p>Tu cuenta ha sido creada exitosamente. Ahora puedes reservar tus citas con nuestros maestros barberos en Cali.</p>
        <div class="detail-box">
          <p><strong>Email:</strong> ${user.email}</p>
          <p><strong>Rol:</strong> ${user.role === 'cliente' ? 'Cliente' : 'Maestro Barbero'}</p>
          <p><strong>Puntos de fidelidad:</strong> 0 pts</p>
        </div>
        <p>Reserva tu primera experiencia y empieza a acumular puntos exclusivos.</p>
        <a href="${process.env.CLIENT_URL}" class="btn">RESERVAR CITA</a>
      </div>
      <div class="footer"><p>© ${new Date().getFullYear()} Punto Fino Barbería · Cra. 16 #33F-31, Cali</p></div>
    </div></body></html>
  `;

  const transporter = createTransporter();
  await transporter.sendMail({
    from: process.env.EMAIL_FROM || '"Punto Fino Barbería" <noreply@puntofino.com>',
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

    const servicesList = services?.map(s => s.service?.name || 'Servicio').join(', ') || 'Corte de autor';

    const html = `
      <html><head><style>${emailStyles}</style></head>
      <body><div class="container">
        <div class="header"><h1>PUNTO FINO</h1><p>Confirmación de Cita</p></div>
        <div class="body">
          <h2>¡Tu cita ha sido confirmada con éxito!</h2>
          <p>Hola <strong>${displayName}</strong>, tu reserva en Punto Fino Barbería de Autor ha sido programada.</p>
          <div class="detail-box">
            <p><strong>Código de reserva:</strong> <span style="color:#cfa53b;font-weight:bold;">${confirmationCode}</span></p>
            <p><strong>Barbero asignado:</strong> ${barber?.name || 'Maestro Barbero Punto Fino'}</p>
            <p><strong>Fecha:</strong> ${new Date(date).toLocaleDateString('es-CO', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
            <p><strong>Horario:</strong> ${startTime} - ${endTime} (aprox. ${totalDuration} min)</p>
            <p><strong>Servicio(s):</strong> ${servicesList}</p>
            <p><strong>Método de pago:</strong> ${paymentMethod || 'Efectivo en Atelier'}</p>
            <p><strong>Total:</strong> $${totalPrice.toLocaleString('es-CO')} COP</p>
            ${displayAddress ? `<p><strong>Dirección cliente:</strong> ${displayAddress}</p>` : ''}
          </div>
          <p>📍 <strong>Ubicación del Atelier:</strong> Cra. 16 #33F-31, Cali, Colombia.</p>
          <p>Te recomendamos llegar 5 a 10 minutos antes de la hora para garantizar tu experiencia completa.</p>
        </div>
        <div class="footer"><p>© ${new Date().getFullYear()} Punto Fino Barbería · Cra. 16 #33F-31, Cali</p></div>
      </div></body></html>
    `;

    const transporter = createTransporter();
    await transporter.sendMail({
      from: process.env.EMAIL_FROM || '"Punto Fino Barbería" <noreply@puntofino.com>',
      to: emailTo,
      subject: `¡Cita confirmada en Punto Fino! - ${confirmationCode} ✂️`,
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

    const servicesList = services?.map(s => s.service?.name || 'Servicio').join(', ') || 'Corte de autor';

    const html = `
      <html><head><style>${emailStyles}</style></head>
      <body><div class="container">
        <div class="header"><h1>PUNTO FINO</h1><p>Nueva Cita Asignada</p></div>
        <div class="body">
          <h2>Tienes un nuevo cliente en tu agenda</h2>
          <p>Hola <strong>${barber.name}</strong>, se ha programado una nueva cita en tu calendario de Punto Fino:</p>
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
        <div class="footer"><p>© ${new Date().getFullYear()} Punto Fino Barbería · Cali</p></div>
      </div></body></html>
    `;

    const transporter = createTransporter();
    await transporter.sendMail({
      from: process.env.EMAIL_FROM || '"Punto Fino Barbería" <noreply@puntofino.com>',
      to: barber.email,
      subject: `¡Nueva cita agendada en Punto Fino! - ${displayName} (${startTime}) ✂️`,
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
      <div class="header"><h1>PUNTO FINO</h1><p>Recuperar Contraseña</p></div>
      <div class="body">
        <h2>Restablecer Contraseña</h2>
        <p>Haz clic en el botón para crear una nueva contraseña. Este enlace expira en 30 minutos.</p>
        <a href="${resetUrl}" class="btn">RESTABLECER CONTRASEÑA</a>
        <p>Si no solicitaste esto, puedes ignorar este correo de forma segura.</p>
      </div>
      <div class="footer"><p>© ${new Date().getFullYear()} Punto Fino Barbería · Cra. 16 #33F-31, Cali</p></div>
    </div></body></html>
  `;

  const transporter = createTransporter();
  await transporter.sendMail({
    from: process.env.EMAIL_FROM || '"Punto Fino Barbería" <noreply@puntofino.com>',
    to: user.email,
    subject: 'Recuperar contraseña - Punto Fino',
    html,
  });
};