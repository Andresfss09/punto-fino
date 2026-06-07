const User = require('../models/User');
const Barber = require('../models/Barber');
const { generateToken, generateRandomToken, sendSuccess, sendError } = require('../utils/helpers');
const { sendWelcomeEmail, sendPasswordResetEmail } = require('../services/emailService');

// @desc    Registrar usuario
// @route   POST /api/auth/register
// @access  Public
exports.register = async (req, res) => {
  try {
    const { name, email, phone, password, role } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return sendError(res, 400, 'Este email ya está registrado.');
    }

    const verificationToken = generateRandomToken();

    const user = await User.create({
      name,
      email,
      phone,
      password,
      role: role === 'barbero' ? 'barbero' : 'cliente',
      verificationToken,
    });

    // Si es barbero, crear perfil de barbero
    if (user.role === 'barbero') {
      await Barber.create({ user: user._id });
    }

    // Enviar email de bienvenida
    try {
      await sendWelcomeEmail(user);
    } catch (emailError) {
      console.error('Error enviando email:', emailError.message);
    }

    const token = generateToken(user._id);

    return sendSuccess(res, 201, 'Cuenta creada exitosamente.', {
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
        avatar: user.avatar,
        loyaltyPoints: user.loyaltyPoints,
      },
    });
  } catch (error) {
    console.error(error);
    return sendError(res, 500, 'Error al crear la cuenta.');
  }
};

// @desc    Login
// @route   POST /api/auth/login
// @access  Public
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return sendError(res, 400, 'Email y contraseña son requeridos.');
    }

    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      return sendError(res, 401, 'Credenciales inválidas.');
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return sendError(res, 401, 'Credenciales inválidas.');
    }

    if (!user.isActive) {
      return sendError(res, 401, 'Tu cuenta está desactivada.');
    }

    user.lastLogin = new Date();
    await user.save({ validateBeforeSave: false });

    const token = generateToken(user._id);

    return sendSuccess(res, 200, 'Sesión iniciada correctamente.', {
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
        avatar: user.avatar,
        loyaltyPoints: user.loyaltyPoints,
        isVerified: user.isVerified,
      },
    });
  } catch (error) {
    console.error(error);
    return sendError(res, 500, 'Error al iniciar sesión.');
  }
};

// @desc    Obtener usuario actual
// @route   GET /api/auth/me
// @access  Private
exports.getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).populate('preferredBarber', 'name avatar');

    return sendSuccess(res, 200, 'Usuario obtenido.', { user });
  } catch (error) {
    return sendError(res, 500, 'Error al obtener usuario.');
  }
};

// @desc    Actualizar perfil
// @route   PUT /api/auth/update-profile
// @access  Private
exports.updateProfile = async (req, res) => {
  try {
    const { name, phone, notifications, preferredBarber } = req.body;

    const user = await User.findByIdAndUpdate(
      req.user.id,
      { name, phone, notifications, preferredBarber },
      { new: true, runValidators: true }
    );

    return sendSuccess(res, 200, 'Perfil actualizado.', { user });
  } catch (error) {
    return sendError(res, 500, 'Error al actualizar perfil.');
  }
};

// @desc    Cambiar contraseña
// @route   PUT /api/auth/change-password
// @access  Private
exports.changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;

    const user = await User.findById(req.user.id).select('+password');
    const isMatch = await user.comparePassword(currentPassword);

    if (!isMatch) {
      return sendError(res, 400, 'La contraseña actual es incorrecta.');
    }

    user.password = newPassword;
    await user.save();

    const token = generateToken(user._id);
    return sendSuccess(res, 200, 'Contraseña actualizada.', { token });
  } catch (error) {
    return sendError(res, 500, 'Error al cambiar contraseña.');
  }
};

// @desc    Olvidé mi contraseña
// @route   POST /api/auth/forgot-password
// @access  Public
exports.forgotPassword = async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    if (!user) {
      return sendError(res, 404, 'No existe cuenta con ese email.');
    }

    const resetToken = generateRandomToken();
    user.resetPasswordToken = resetToken;
    user.resetPasswordExpire = Date.now() + 30 * 60 * 1000; // 30 min
    await user.save({ validateBeforeSave: false });

    try {
      await sendPasswordResetEmail(user, resetToken);
    } catch (emailError) {
      user.resetPasswordToken = undefined;
      user.resetPasswordExpire = undefined;
      await user.save({ validateBeforeSave: false });
      return sendError(res, 500, 'Error enviando email de recuperación.');
    }

    return sendSuccess(res, 200, 'Email de recuperación enviado.');
  } catch (error) {
    return sendError(res, 500, 'Error en recuperación de contraseña.');
  }
};

// @desc    Resetear contraseña
// @route   POST /api/auth/reset-password/:token
// @access  Public
exports.resetPassword = async (req, res) => {
  try {
    const user = await User.findOne({
      resetPasswordToken: req.params.token,
      resetPasswordExpire: { $gt: Date.now() },
    });

    if (!user) {
      return sendError(res, 400, 'Token inválido o expirado.');
    }

    user.password = req.body.password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    await user.save();

    const token = generateToken(user._id);
    return sendSuccess(res, 200, 'Contraseña restablecida.', { token });
  } catch (error) {
    return sendError(res, 500, 'Error al restablecer contraseña.');
  }
};