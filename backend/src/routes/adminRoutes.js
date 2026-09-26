const express = require('express');
const router = express.Router();
const {
  getPayrollAndStats,
  payoutBarberAppointments,
  updateBarberCommissionRate,
} = require('../controllers/adminController');
const { protect } = require('../middlewares/auth');
const { authorize } = require('../middlewares/roles');

// Todas las rutas de administración están protegidas para rol 'admin'
router.use(protect, authorize('admin'));

router.get('/payroll-stats', getPayrollAndStats);
router.put('/payout', payoutBarberAppointments);
router.put('/barbers/:barberId/commission', updateBarberCommissionRate);

module.exports = router;
