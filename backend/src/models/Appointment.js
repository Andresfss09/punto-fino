const mongoose = require('mongoose');

const appointmentSchema = new mongoose.Schema(
  {
    client: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: false,
    },
    clientName: {
      type: String,
      trim: true,
    },
    clientEmail: {
      type: String,
      trim: true,
      lowercase: true,
    },
    clientPhone: {
      type: String,
      trim: true,
    },
    clientAddress: {
      type: String,
      trim: true,
    },
    isGuest: {
      type: Boolean,
      default: false,
    },
    barber: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    services: [
      {
        service: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Service',
          required: true,
        },
        price: Number,
        duration: Number,
      },
    ],
    date: {
      type: Date,
      required: [true, 'La fecha es requerida'],
    },
    startTime: {
      type: String,
      required: [true, 'La hora de inicio es requerida'],
    },
    endTime: {
      type: String,
      required: true,
    },
    totalPrice: {
      type: Number,
      required: true,
    },
    totalDuration: {
      type: Number,
      required: true,
    },
    status: {
      type: String,
      enum: ['pendiente', 'confirmada', 'en_progreso', 'completada', 'cancelada', 'no_show'],
      default: 'pendiente',
    },
    paymentStatus: {
      type: String,
      enum: ['pendiente', 'pagado', 'reembolsado'],
      default: 'pendiente',
    },
    paymentMethod: {
      type: String,
      enum: ['efectivo', 'transferencia', 'nequi', 'daviplata', 'otro'],
      default: 'efectivo',
    },
    notes: {
      type: String,
      maxlength: [300, 'Notas máximo 300 caracteres'],
    },
    reminderSent: {
      type: Boolean,
      default: false,
    },
    confirmationCode: {
      type: String,
      unique: true,
    },
    cancelReason: String,
    cancelledBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    review: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Review',
    },
  },
  {
    timestamps: true,
  }
);

appointmentSchema.pre('save', function () {
  if (!this.confirmationCode) {
    this.confirmationCode =
      'PF-' +
      Date.now().toString(36).toUpperCase() +
      Math.random().toString(36).substr(2, 4).toUpperCase();
  }
});

appointmentSchema.index({ client: 1, date: -1 });
appointmentSchema.index({ barber: 1, date: 1 });
appointmentSchema.index({ status: 1 });
appointmentSchema.index({ date: 1, startTime: 1 });

module.exports = mongoose.model('Appointment', appointmentSchema);