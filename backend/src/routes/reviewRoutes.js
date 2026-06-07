const express = require('express');
const router = express.Router();
const { createReview, getBarberReviews } = require('../controllers/reviewController');
const { protect } = require('../middlewares/auth');
const { authorize } = require('../middlewares/roles');

router.get('/barber/:barberId', getBarberReviews);
router.post('/', protect, authorize('cliente'), createReview);

module.exports = router;