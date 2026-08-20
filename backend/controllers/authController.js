const jwt = require('jsonwebtoken');
const Artisan = require('../models/Artisan');

const signToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '7d',
  });

// @route POST /api/auth/signup
// @desc  Register a new artisan. confirmPassword is validated upstream and
//        is intentionally never persisted — only `password` (hashed) is saved.
const signup = async (req, res, next) => {
  try {
    const { fullName, email, phone, craft, address, town, state, country, password } = req.body;

    const existing = await Artisan.findOne({ email });
    if (existing) {
      return res.status(409).json({ success: false, message: 'An account with that email already exists' });
    }

    const artisan = await Artisan.create({
      fullName,
      email,
      phone,
      craft,
      address,
      town,
      state,
      country,
      password, // hashed by the pre-save hook on the model
    });

    const token = signToken(artisan._id);
    res.status(201).json({ success: true, token, artisan });
  } catch (err) {
    next(err);
  }
};

// @route POST /api/auth/login
const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const artisan = await Artisan.findOne({ email }).select('+password');
    if (!artisan) {
      return res.status(401).json({ success: false, message: 'Invalid email or password' });
    }

    const match = await artisan.comparePassword(password);
    if (!match) {
      return res.status(401).json({ success: false, message: 'Invalid email or password' });
    }

    const token = signToken(artisan._id);
    res.json({ success: true, token, artisan });
  } catch (err) {
    next(err);
  }
};

// @route GET /api/auth/me
const getMe = async (req, res) => {
  res.json({ success: true, artisan: req.artisan });
};

module.exports = { signup, login, getMe };
