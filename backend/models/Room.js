const mongoose = require('mongoose');

const roomSchema = new mongoose.Schema(
  {
    hotel: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Hotel',
      required: true,
      index: true,
    },
    roomNumber: {
      type: String,
      required: [true, 'Please provide room number or name'],
      trim: true,
    },
    type: {
      type: String,
      required: [true, 'Please specify room type'],
      enum: ['Standard Single', 'Standard Double', 'Deluxe King', 'Executive Suite', 'Presidential Suite', 'Family Villa'],
      default: 'Deluxe King',
    },
    title: {
      type: String,
      required: [true, 'Please provide room title'],
    },
    description: {
      type: String,
      default: 'Spacious and elegant room equipped with top-tier comforts, premium bedding, and panoramic views.',
    },
    basePrice: {
      type: Number,
      required: [true, 'Please provide room price per night'],
      min: [1, 'Price must be greater than 0'],
    },
    capacity: {
      adults: { type: Number, default: 2, min: 1 },
      children: { type: Number, default: 1, min: 0 },
    },
    bedType: {
      type: String,
      default: '1 King Size Bed',
    },
    sizeSqFt: {
      type: Number,
      default: 420,
    },
    amenities: {
      type: [String],
      default: ['Air Conditioning', 'Smart 55" 4K TV', 'Private Balcony', 'Mini Bar', 'Luxury Robes', 'Espresso Machine'],
    },
    images: {
      type: [String],
      default: [],
    },
    status: {
      type: String,
      enum: ['available', 'occupied', 'cleaning', 'maintenance'],
      default: 'available',
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

// Compound index to guarantee uniqueness of roomNumber per hotel
roomSchema.index({ hotel: 1, roomNumber: 1 }, { unique: true });

module.exports = mongoose.model('Room', roomSchema);
