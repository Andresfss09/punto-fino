const express = require('express');
const router = express.Router();
const {
  createAppointment,
  getAvailableSlots,
  getMyAppointments,
  cancelAppointment,
  updateAppointmentStatus,
  getBarberAppointments,
} = require('../controllers/appointmentController');
const { protect, protectOptional } = require('../middlewares/auth');
const { authorize } = require('../middlewares/roles');

router.get('/available-slots', getAvailableSlots);
router.post('/', protectOptional, createAppointment);

router.use(protect);
router.get('/my-appointments', authorize('cliente'), getMyAppointments);
router.get('/barber-appointments', authorize('barbero', 'admin'), getBarberAppointments);
router.put('/:id/cancel', cancelAppointment);
router.put('/:id/status', authorize('barbero', 'admin'), updateAppointmentStatus);

module.exports = router;