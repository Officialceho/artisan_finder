const Booking = require('../models/Booking');
const Artisan = require('../models/Artisan');

// @route POST /api/bookings
// @desc  Public: customer submits a booking for an artisan. No account needed.
const createBooking = async (req, res, next) => {
  try {
    const { artisanId } = req.params;

    const artisan = await Artisan.findOne({ _id: artisanId, isActive: true });
    if (!artisan) {
      return res.status(404).json({ success: false, message: 'Artisan not found' });
    }

    const booking = await Booking.create({
      artisan: artisan._id,
      customerName: req.body.customerName,
      customerPhone: req.body.customerPhone,
      customerEmail: req.body.customerEmail || '',
      serviceAddress: req.body.serviceAddress,
      preferredDate: req.body.preferredDate,
      preferredTime: req.body.preferredTime || '',
      details: req.body.details || '',
    });

    // Return enough artisan context for the success page without a second request
    res.status(201).json({
      success: true,
      booking: {
        ...booking.toObject(),
        artisan: {
          _id: artisan._id,
          fullName: artisan.fullName,
          craft: artisan.craft,
          phone: artisan.phone,
          profilePicture: artisan.profilePicture,
          town: artisan.town,
          state: artisan.state,
        },
      },
    });
  } catch (err) {
    next(err);
  }
};

// @route GET /api/bookings/:id
// @desc  Public: fetch a single booking (used by the success page)
const getBookingById = async (req, res, next) => {
  try {
    const booking = await Booking.findById(req.params.id).populate(
      'artisan',
      'fullName craft phone profilePicture town state'
    );
    if (!booking) {
      return res.status(404).json({ success: false, message: 'Booking not found' });
    }
    res.json({ success: true, booking });
  } catch (err) {
    next(err);
  }
};

// @route GET /api/bookings
// @desc  Private: artisan views their own bookings. Query: status
const getMyBookings = async (req, res, next) => {
  try {
    const filter = { artisan: req.artisan._id };
    if (req.query.status) filter.status = req.query.status;

    const bookings = await Booking.find(filter).sort({ createdAt: -1 });
    res.json({ success: true, count: bookings.length, bookings });
  } catch (err) {
    next(err);
  }
};

// @route PUT /api/bookings/:id/status
// @desc  Private: artisan updates a booking's status
const updateBookingStatus = async (req, res, next) => {
  try {
    const { status } = req.body;
    const allowed = ['pending', 'confirmed', 'completed', 'cancelled'];
    if (!allowed.includes(status)) {
      return res.status(400).json({ success: false, message: `Status must be one of: ${allowed.join(', ')}` });
    }

    const booking = await Booking.findOne({ _id: req.params.id, artisan: req.artisan._id });
    if (!booking) {
      return res.status(404).json({ success: false, message: 'Booking not found' });
    }

    booking.status = status;
    await booking.save();

    res.json({ success: true, booking });
  } catch (err) {
    next(err);
  }
};

module.exports = { createBooking, getBookingById, getMyBookings, updateBookingStatus };
