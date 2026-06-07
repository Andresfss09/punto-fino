const mongoose = require('mongoose');

const serviceSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'El nombre del servicio es requerido'],
      trim: true,
      unique: true,
    },
    description: {
      type: String,
      maxlength: [500, 'Descripción máximo 500 caracteres'],
    },
    price: {
      type: Number,
      required: [true, 'El precio es requerido'],
      min: [0, 'El precio no puede ser negativo'],
    },
    duration: {
      type: Number, // minutos
      required: [true, 'La duración es requerida'],
      min: [5, 'Duración mínima 5 minutos'],
    },
    category: {
      type: String,
      enum: ['corte', 'barba', 'combo', 'tratamiento', 'diseño'],
      required: true,
    },
    image: {
      type: String,
      default: '',
    },
    imagePublicId: {
      type: String,
      default: '',
    },
    isPopular: {
      type: Boolean,
      default: false,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    order: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Service', serviceSchema);