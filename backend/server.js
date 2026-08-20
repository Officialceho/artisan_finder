// 1. ADD THESE TWO LINES AT THE VERY TOP
const dns = require('dns');
dns.setServers(['8.8.8.8', '8.8.4.4']); // Forces Node.js to use Google DNS

require('dotenv').config();
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const path = require('path');
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
const connectDB = require('./config/db');
const { errorHandler, notFound } = require('./middleware/errorHandler');
const { generalLimiter } = require('./middleware/rateLimiters');

const authRoutes = require('./routes/authRoutes');
const artisanRoutes = require('./routes/artisanRoutes');
const bookingRoutes = require('./routes/bookingRoutes');

const app = express();

connectDB();

// Security headers. crossOriginResourcePolicy is relaxed to "cross-origin" because
// the frontend (a different origin, e.g. Vercel) needs to load images served from
// this API's /uploads route — the default "same-origin" would block them.
app.use(
  helmet({
    crossOriginResourcePolicy: { policy: 'cross-origin' },
  })
);

// Strips out any request keys that start with "$" or contain ".", which is how
// NoSQL-injection payloads are smuggled into Mongoose queries via req.body/query/params.
app.use(mongoSanitize());

// Global rate-limit backstop; tighter limits are applied on top of this for
// /api/auth and the public booking-creation endpoint (see their route files).
app.use('/api', generalLimiter);

// Allow one or more comma-separated origins via CLIENT_URL
const allowedOrigins = (process.env.CLIENT_URL || 'http://localhost:5173')
  .split(',')
  .map((o) => o.trim());

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) return callback(null, true);
      callback(new Error('Not allowed by CORS'));
    },
    credentials: true,
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
if (process.env.NODE_ENV !== 'production') app.use(morgan('dev'));

// Serve uploaded images
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.get('/api/health', (req, res) => res.json({ success: true, message: 'Artisan Finder API is running' }));

app.use('/api/auth', authRoutes);
app.use('/api/artisans', artisanRoutes);
app.use('/api/bookings', bookingRoutes);

app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT} [${process.env.NODE_ENV || 'development'}]`));
