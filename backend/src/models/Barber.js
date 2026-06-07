const mongoose = require('mongoose');

const scheduleSchema = new mongoose.Schema({
  day: {
    type: Number, // 0=Domingo, 1=Lunes... 6=Sábado
    required: true,
  },
  isWorking: {
    type: Boolean,
    default: true,
  },
  startTime: {
    type: String,
    default: '09:00',
  },
  endTime: {
    type: String,
    default: '20:00',
  },
  breakStart: {
    type: String,
    default: '13:00',
  },
  breakEnd: {
    type: String,
    default: '14:00',
  },
});

const barberSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true,
    },
    bio: {
      type: String,
      maxlength: [300, 'Bio máximo 300 caracteres'],
      default: '',
    },
    specialties: [
      {
        type: String,
        enum: [
          'corte clásico',
          'degradado',
          'diseño',
          'barba',
          'cejas',
          'mascarilla',
          'coloración',
        ],
      },
    ],
    schedule: [scheduleSchema],
    rating: {
      average: { type: Number, default: 0, min: 0, max: 5 },
      count: { type: Number, default: 0 },
    },
    totalClients: {
      type: Number,
      default: 0,
    },
    isAvailable: {
      type: Boolean,
      default: true,
    },
    vacationDates: [
      {
        from: Date,
        to: Date,
        reason: String,
      },
    ],
    blockedSlots: [
      {
        date: Date,
        time: String,
        reason: String,
      },
    ],
    portfolio: [
      {
        imageUrl: String,
        publicId: String,
        caption: String,
        createdAt: { type: Date, default: Date.now },
      },
    ],
    commissionRate: {
      type: Number,
      default: 0,
      min: 0,
      max: 100,
    },
    earnings: {
      total: { type: Number, default: 0 },
      thisMonth: { type: Number, default: 0 },
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

barberSchema.pre('save', function () {
  if (this.schedule.length === 0) {
    const defaultSchedule = [];
    for (let i = 0; i <= 6; i++) {
      defaultSchedule.push({
        day: i,
        isWorking: i !== 0,
        startTime: '09:00',
        endTime: '20:30',
        breakStart: '13:00',
        breakEnd: '14:00',
      });
    }
    this.schedule = defaultSchedule;
  }
});

module.exports = mongoose.model('Barber', barberSchema);