const express = require('express');
const router = express.Router();
const {
  getAllServices,
  getService,
  createService,
  updateService,
  deleteService,
} = require('../controllers/serviceController');
const { protect } = require('../middlewares/auth');
const { authorize } = require('../middlewares/roles');

router.get('/', getAllServices);
router.get('/:id', getService);
router.use(protect);
router.post('/', authorize('admin'), createService);
router.put('/:id', authorize('admin'), updateService);
router.delete('/:id', authorize('admin'), deleteService);

module.exports = router;