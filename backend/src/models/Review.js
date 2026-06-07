const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema(
  {
    client: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    barber: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    appointment: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Appointment',
      required: true,
      unique: true,
    },
    rating: {
      type: Number,
      required: [true, 'La calificación es requerida'],
      min: 1,
      max: 5,
    },
    comment: {
      type: String,
      maxlength: [500, 'Comentario máximo 500 caracteres'],
    },
    photos: [String],
    isVerified: {
      type: Boolean,
      default: true,
    },
    isVisible: {
      type: Boolean,
      default: true,
    },
    reply: {
      text: String,
      date: Date,
    },
  },
  {
    timestamps: true,
  }
);

// Actualizar rating del barbero al crear/modificar review
reviewSchema.post('save', async function () {
  const Barber = require('./Barber');
  const stats = await this.constructor.aggregate([
    { $match: { barber: this.barber } },
    {
      $group: {
        _id: '$barber',
        avgRating: { $avg: '$rating' },
        count: { $sum: 1 },
      },
    },
  ]);

  if (stats.length > 0) {
    await Barber.findOneAndUpdate(
      { user: this.barber },
      {
        'rating.average': Math.round(stats[0].avgRating * 10) / 10,
        'rating.count': stats[0].count,
      }
    );
  }
});

module.exports = mongoose.model('Review', reviewSchema);