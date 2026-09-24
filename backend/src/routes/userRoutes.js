const express = require('express');
const router = express.Router();
const {
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,
  updateAvatar
} = require('../controllers/userController');
const { protect, authorize } = require('../middlewares/auth');
const { uploadAvatar } = require('../middlewares/upload');
const { validateObjectId } = require('../utils/validators');

// Rutas accesibles por cualquier usuario autenticado
router.put('/avatar', protect, uploadAvatar, updateAvatar);

// Rutas exclusivas para admin
router.use(protect, authorize('admin'));

router.route('/')
  .get(getAllUsers);

router.route('/:id')
  .get(validateObjectId('id'), getUserById)
  .put(validateObjectId('id'), updateUser)
  .delete(validateObjectId('id'), deleteUser);

module.exports = router;
