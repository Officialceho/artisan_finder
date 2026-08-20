const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema(
  {
    artisan: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Artisan',
      required: true,
    },
    customerName: {
      type: String,
      required: [true, 'Your name is required'],
      trim: true,
    },
    customerPhone: {
      type: String,
      required: [true, 'Your phone number is required'],
      trim: true,
    },
    customerEmail: {
      type: String,
      trim: true,
      lowercase: true,
      default: '',
    },
    serviceAddress: {
      type: String,
      required: [true, 'Service address is required'],
      trim: true,
    },
    preferredDate: {
      type: Date,
      required: [true, 'Preferred date is required'],
    },
    preferredTime: {
      type: String, // free text e.g. "Morning", "2:00 PM"
      trim: true,
      default: '',
    },
    details: {
      type: String,
      trim: true,
      maxlength: 1000,
      default: '',
    },
    status: {
      type: String,
      enum: ['pending', 'confirmed', 'completed', 'cancelled'],
      default: 'pending',
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Booking', bookingSchema);
