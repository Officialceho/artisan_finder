const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const artisanSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      required: [true, 'Full name is required'],
      trim: true,
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, 'Please provide a valid email address'],
    },
    phone: {
      type: String,
      required: [true, 'Phone number is required'],
      trim: true,
    },
    craft: {
      type: String,
      required: [true, 'Craft / category is required'],
      trim: true,
    },
    address: {
      type: String,
      required: [true, 'Address is required'],
      trim: true,
    },
    town: {
      type: String,
      required: [true, 'Town is required'],
      trim: true,
    },
    state: {
      type: String,
      required: [true, 'State is required'],
      trim: true,
    },
    country: {
      type: String,
      required: [true, 'Country is required'],
      trim: true,
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
      minlength: 8,
      select: false,
    },
    // Profile-completion fields (filled after signup, from the dashboard)
    bio: {
      type: String,
      trim: true,
      maxlength: 800,
      default: '',
    },
    profilePicture: {
      type: String, // Cloudinary secure_url
      default: '',
    },
    // Cloudinary public_id for the current profile picture — not exposed to the
    // public profile response, kept only so the server can delete the old image
    // from Cloudinary when it's replaced.
    profilePicturePublicId: {
      type: String,
      default: '',
      select: false,
    },
    portfolioImages: {
      type: [String], // array of Cloudinary secure_urls
      default: [],
    },
    // Index-aligned with portfolioImages — same reason as profilePicturePublicId.
    portfolioPublicIds: {
      type: [String],
      default: [],
      select: false,
    },
    isProfileComplete: {
      type: Boolean,
      default: false,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

// Hash password before saving, only if it was modified
artisanSchema.pre('save', async function hashPassword(next) {
  if (!this.isModified('password')) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

artisanSchema.methods.comparePassword = function comparePassword(candidate) {
  return bcrypt.compare(candidate, this.password);
};

// Never leak the password hash even if `select` is bypassed
artisanSchema.methods.toJSON = function toJSON() {
  const obj = this.toObject();
  delete obj.password;
  return obj;
};

module.exports = mongoose.model('Artisan', artisanSchema);
