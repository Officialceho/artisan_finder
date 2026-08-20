const jwt = require('jsonwebtoken');
const Artisan = require('../models/Artisan');

// Protects artisan-only routes. Expects: Authorization: Bearer <token>
const protect = async (req, res, next) => {
  try {
    const header = req.headers.authorization || '';
    const token = header.startsWith('Bearer ') ? header.split(' ')[1] : null;

    if (!token) {
      return res.status(401).json({ success: false, message: 'Not authorized, no token provided' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    // Pull in the Cloudinary public_id fields too (select: false by default) —
    // the dashboard controllers need them to clean up replaced/deleted images.
    const artisan = await Artisan.findById(decoded.id).select('+profilePicturePublicId +portfolioPublicIds');

    if (!artisan) {
      return res.status(401).json({ success: false, message: 'Artisan account no longer exists' });
    }
    if (!artisan.isActive) {
      return res.status(403).json({ success: false, message: 'Account has been deactivated' });
    }

    req.artisan = artisan;
    next();
  } catch (err) {
    return res.status(401).json({ success: false, message: 'Not authorized, token invalid or expired' });
  }
};

module.exports = { protect };
