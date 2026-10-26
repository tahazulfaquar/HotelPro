const mongoose = require('mongoose');

const hotelSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please provide the hotel name'],
      trim: true,
    },
    tagline: {
      type: String,
      default: 'Luxury & Comfort Reimagined',
    },
    description: {
      type: String,
      required: [true, 'Please provide hotel description'],
    },
    address: {
      type: String,
      required: [true, 'Please provide street address'],
    },
    city: {
      type: String,
      required: [true, 'Please provide city'],
      index: true,
      trim: true,
    },
    state: {
      type: String,
      default: '',
    },
    country: {
      type: String,
      required: [true, 'Please provide country'],
      default: 'United States',
    },
    zipCode: {
      type: String,
      default: '',
    },
    starRating: {
      type: Number,
      min: 1,
      max: 5,
      default: 4,
    },
    featured: {
      type: Boolean,
      default: false,
    },
    manager: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    images: {
      type: [String],
      default: [],
    },
    thumbnail: {
      type: String,
      required: true,
    },
    amenities: {
      type: [String],
      default: ['Free High-Speed WiFi', 'Swimming Pool', 'Air Conditioning', 'Free Parking', 'Restaurant & Bar'],
    },
    checkInTime: {
      type: String,
      default: '14:00',
    },
    checkOutTime: {
      type: String,
      default: '11:00',
    },
    policies: {
      type: String,
      default: 'Free cancellation up to 48 hours before check-in. Pets allowed with prior notification. Non-smoking rooms.',
    },
    averageRating: {
      type: Number,
      default: 4.8,
      min: 0,
      max: 5,
    },
    numReviews: {
      type: Number,
      default: 0,
    },
    contactEmail: {
      type: String,
      default: 'contact@hotelpro.com',
    },
    contactPhone: {
      type: String,
      default: '+1 (555) 019-2834',
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Hotel', hotelSchema);
