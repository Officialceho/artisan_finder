const multer = require('multer');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const cloudinary = require('../config/cloudinary');

// Images are uploaded straight to Cloudinary (no local disk writes), which
// means they survive redeploys on hosts with ephemeral filesystems like Render.
const storage = new CloudinaryStorage({
  cloudinary,
  params: (req, file) => {
    const folder = file.fieldname === 'profilePicture' ? 'artisan-finder/profiles' : 'artisan-finder/portfolio';
    const artisanId = req.artisan ? req.artisan._id : 'artisan';
    const publicId = `${artisanId}-${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    return {
      folder,
      public_id: publicId,
      allowed_formats: ['jpg', 'jpeg', 'png', 'webp', 'gif'],
      // Cap dimensions and let Cloudinary pick an efficient quality/format —
      // keeps profile/portfolio photos from a phone camera from bloating storage.
      transformation: [{ width: 1600, height: 1600, crop: 'limit', quality: 'auto' }],
    };
  },
});

const fileFilter = (req, file, cb) => {
  const allowed = /image\/(jpeg|jpg|png|webp|gif)/;
  if (allowed.test(file.mimetype)) return cb(null, true);
  cb(new Error('Only image files (jpg, jpeg, png, webp, gif) are allowed'));
};

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: Number(process.env.MAX_UPLOAD_SIZE) || 10 * 1024 * 1024 },
});

// With multer-storage-cloudinary, after a successful upload each `req.file` /
// `req.files[i]` carries `.path` (the Cloudinary secure_url — save this on the
// model) and `.filename` (the Cloudinary public_id — save this too, so a later
// delete/replace can call cloudinary.uploader.destroy(publicId)).
module.exports = upload;
