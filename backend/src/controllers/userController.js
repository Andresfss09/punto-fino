const User = require('../models/User');
const { sendSuccess, sendError } = require('../utils/helpers');
const { uploadToCloudinary } = require('../middlewares/upload');

// @desc    Obtener todos los usuarios
// @route   GET /api/users
// @access  Private/Admin
exports.getAllUsers = async (req, res) => {
  try {
    const { role, isActive, search, page = 1, limit = 10 } = req.query;
    const query = {};

    if (role) query.role = role;
    if (isActive !== undefined) query.isActive = isActive === 'true';
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
      ];
    }

    const users = await User.find(query)
      .select('-password')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await User.countDocuments(query);

    return sendSuccess(res, 200, 'Usuarios obtenidos.', {
      users,
      pagination: { total, page: parseInt(page), pages: Math.ceil(total / limit) },
    });
  } catch (error) {
    return sendError(res, 500, 'Error al obtener usuarios.');
  }
};

// @desc    Obtener usuario por ID
// @route   GET /api/users/:id
// @access  Private/Admin
exports.getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password');
    if (!user) return sendError(res, 404, 'Usuario no encontrado.');
    return sendSuccess(res, 200, 'Usuario obtenido.', { user });
  } catch (error) {
    return sendError(res, 500, 'Error al obtener usuario.');
  }
};

// @desc    Actualizar usuario (Admin)
// @route   PUT /api/users/:id
// @access  Private/Admin
exports.updateUser = async (req, res) => {
  try {
    const { role, isActive } = req.body;
    
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { role, isActive },
      { new: true, runValidators: true }
    ).select('-password');

    if (!user) return sendError(res, 404, 'Usuario no encontrado.');
    return sendSuccess(res, 200, 'Usuario actualizado.', { user });
  } catch (error) {
    return sendError(res, 500, 'Error al actualizar usuario.');
  }
};

// @desc    Eliminar/desactivar usuario (Admin)
// @route   DELETE /api/users/:id
// @access  Private/Admin
exports.deleteUser = async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { isActive: false },
      { new: true }
    ).select('-password');

    if (!user) return sendError(res, 404, 'Usuario no encontrado.');
    return sendSuccess(res, 200, 'Usuario desactivado exitosamente.', { user });
  } catch (error) {
    return sendError(res, 500, 'Error al desactivar usuario.');
  }
};

// @desc    Actualizar avatar
// @route   PUT /api/users/avatar
// @access  Private
exports.updateAvatar = async (req, res) => {
  try {
    if (!req.file) return sendError(res, 400, 'Por favor, sube una imagen.');

    const avatarUrl = await uploadToCloudinary(req.file.buffer, 'punto-fino/avatars');

    const user = await User.findByIdAndUpdate(
      req.user.id,
      { avatar: avatarUrl },
      { new: true }
    ).select('-password');

    return sendSuccess(res, 200, 'Avatar actualizado exitosamente.', { user });
  } catch (error) {
    console.error(error);
    return sendError(res, 500, 'Error al actualizar avatar.');
  }
};
