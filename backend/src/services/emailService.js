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
      <div class="header"><h1>✂️ PUNTO FINO</h1><p>Barbería Premium · Cali</p></div>
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
      <div class="footer"><p>© 2025 Punto Fino · cra 12 #53-51 Villacolombia, Cali</p></div>
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
  const { client, barber, date, startTime, totalPrice, confirmationCode } = appointment;

  const html = `
    <html><head><style>${emailStyles}</style></head>
    <body><div class="container">
      <div class="header"><h1>✂️ PUNTO FINO</h1><p>Confirmación de Cita</p></div>
      <div class="body">
        <h2>Cita Confirmada ✅</h2>
        <p>Tu cita ha sido reservada exitosamente.</p>
        <div class="detail-box">
          <p><strong>Código:</strong> ${confirmationCode}</p>
          <p><strong>Barbero:</strong> ${barber.name}</p>
          <p><strong>Fecha:</strong> ${new Date(date).toLocaleDateString('es-CO', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
          <p><strong>Hora:</strong> ${startTime}</p>
          <p><strong>Total:</strong> $${totalPrice.toLocaleString('es-CO')}</p>
        </div>
        <p>Recuerda llegar 5 minutos antes de tu cita.</p>
      </div>
      <div class="footer"><p>© 2025 Punto Fino · cra 12 #53-51 Villacolombia, Cali</p></div>
    </div></body></html>
  `;

  const transporter = createTransporter();
  await transporter.sendMail({
    from: process.env.EMAIL_FROM,
    to: client.email,
    subject: `Cita confirmada - ${confirmationCode} ✂️`,
    html,
  });
};

exports.sendPasswordResetEmail = async (user, token) => {
  const resetUrl = `${process.env.CLIENT_URL}/reset-password/${token}`;

  const html = `
    <html><head><style>${emailStyles}</style></head>
    <body><div class="container">
      <div class="header"><h1>✂️ PUNTO FINO</h1><p>Recuperar Contraseña</p></div>
      <div class="body">
        <h2>Restablecer Contraseña</h2>
        <p>Haz clic en el botón para crear una nueva contraseña. Este enlace expira en 30 minutos.</p>
        <a href="${resetUrl}" class="btn">RESTABLECER CONTRASEÑA</a>
        <p>Si no solicitaste esto, ignora este email.</p>
      </div>
      <div class="footer"><p>© 2025 Punto Fino · cra 12 #53-51 Villacolombia, Cali</p></div>
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