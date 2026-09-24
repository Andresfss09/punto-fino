const express = require('express');
const router = express.Router();
const {
  getAllBarbers,
  getBarber,
  updateBarberProfile,
  getBarberStats,
} = require('../controllers/barberController');
const { protect } = require('../middlewares/auth');
const { authorize } = require('../middlewares/roles');

router.get('/', getAllBarbers);

// Protected routes
router.use(protect);
router.get('/stats/me', authorize('barbero', 'admin'), getBarberStats);
router.get('/stats/:userId', authorize('barbero', 'admin'), getBarberStats);
router.put('/profile', authorize('barbero'), updateBarberProfile);
router.put('/:barberId/availability', authorize('admin'), async (req, res) => {
  try {
    const Barber = require('../models/Barber');
    const barber = await Barber.findByIdAndUpdate(
      req.params.barberId,
      { isAvailable: req.body.isAvailable },
      { new: true }
    );
    if (!barber) return res.status(404).json({ success: false, message: 'Barbero no encontrado' });
    res.json({ success: true, message: 'Estado actualizado', barber });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error al actualizar' });
  }
});

// Barber profile by user ID
router.get('/:userId', getBarber);

module.exports = router;