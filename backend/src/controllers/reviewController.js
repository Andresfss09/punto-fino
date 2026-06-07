const Review = require('../models/Review');
const Appointment = require('../models/Appointment');
const { sendSuccess, sendError } = require('../utils/helpers');

exports.createReview = async (req, res) => {
  try {
    const { appointmentId, rating, comment } = req.body;

    const appointment = await Appointment.findById(appointmentId);
    if (!appointment) return sendError(res, 404, 'Cita no encontrada.');

    if (appointment.client.toString() !== req.user.id) {
      return sendError(res, 403, 'Solo puedes reseñar tus propias citas.');
    }

    if (appointment.status !== 'completada') {
      return sendError(res, 400, 'Solo puedes reseñar citas completadas.');
    }

    const existingReview = await Review.findOne({ appointment: appointmentId });
    if (existingReview) {
      return sendError(res, 400, 'Ya reseñaste esta cita.');
    }

    const review = await Review.create({
      client: req.user.id,
      barber: appointment.barber,
      appointment: appointmentId,
      rating,
      comment,
    });

    await Appointment.findByIdAndUpdate(appointmentId, { review: review._id });

    return sendSuccess(res, 201, 'Reseña creada.', { review });
  } catch (error) {
    return sendError(res, 500, 'Error al crear reseña.');
  }
};

exports.getBarberReviews = async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;

    const reviews = await Review.find({
      barber: req.params.barberId,
      isVisible: true,
    })
      .populate('client', 'name avatar')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Review.countDocuments({ barber: req.params.barberId, isVisible: true });

    return sendSuccess(res, 200, 'Reseñas obtenidas.', {
      reviews,
      pagination: { total, page: parseInt(page), pages: Math.ceil(total / limit) },
    });
  } catch (error) {
    return sendError(res, 500, 'Error al obtener reseñas.');
  }
};