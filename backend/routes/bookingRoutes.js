const express = require('express');
const router = express.Router();
const {
  createBooking,
  getBookingById,
  getMyBookings,
  updateBookingStatus,
} = require('../controllers/bookingController');
const { protect } = require('../middleware/auth');
const { bookingValidation } = require('../middleware/validators');
const { bookingLimiter } = require('../middleware/rateLimiters');

// Private (artisan dashboard) — declared before "/:id" so it isn't shadowed
router.get('/', protect, getMyBookings);

// Public — customer books an artisan, no account required
router.post('/artisan/:artisanId', bookingLimiter, bookingValidation, createBooking);
router.get('/:id', getBookingById);

// Private (artisan dashboard)
router.put('/:id/status', protect, updateBookingStatus);

module.exports = router;
