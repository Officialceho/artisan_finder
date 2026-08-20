const rateLimit = require('express-rate-limit');

// Applies to POST /api/auth/login and /api/auth/signup — slows down brute-force
// and mass account-creation attempts without affecting normal browsing traffic.
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10, // 10 attempts per IP per window
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, message: 'Too many attempts. Please try again in a few minutes.' },
});

// Applies to POST /api/bookings/artisan/:id — the one public write endpoint
// a bot could hammer to spam artisans with fake bookings.
const bookingLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 20, // 20 bookings per IP per hour
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, message: 'Too many booking requests from this device. Please try again later.' },
});

// A gentler, global backstop across the whole API so no single client can
// hammer any route unboundedly.
const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 300,
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, message: 'Too many requests. Please slow down.' },
});

module.exports = { authLimiter, bookingLimiter, generalLimiter };
