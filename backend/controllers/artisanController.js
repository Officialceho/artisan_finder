const Artisan = require('../models/Artisan');
const cloudinary = require('../config/cloudinary');

// Best-effort delete from Cloudinary — never blocks the response on failure,
// since a stray orphaned image there is harmless compared to failing the request.
const destroyCloudinaryAsset = (publicId) => {
  if (!publicId) return;
  cloudinary.uploader.destroy(publicId).catch((err) => {
    console.error('Cloudinary cleanup failed for', publicId, err.message);
  });
};

const PUBLIC_FIELDS =
  'fullName craft phone email address town state country bio profilePicture portfolioImages createdAt';

// @route GET /api/artisans
// @desc  Public: browse + search + filter artisans
//        Query params: q (name/craft/town search), craft, town, state
const getArtisans = async (req, res, next) => {
  try {
    const { q, craft, town, state, page = 1, limit = 12 } = req.query;
    const filter = { isActive: true };

    if (craft) filter.craft = new RegExp(`^${craft}$`, 'i');
    if (town) filter.town = new RegExp(`^${town}$`, 'i');
    if (state) filter.state = new RegExp(`^${state}$`, 'i');

    if (q) {
      const regex = new RegExp(q, 'i');
      filter.$or = [{ fullName: regex }, { craft: regex }, { town: regex }, { bio: regex }];
    }

    const pageNum = Math.max(1, Number(page));
    const limitNum = Math.min(50, Math.max(1, Number(limit)));

    const [artisans, total] = await Promise.all([
      Artisan.find(filter)
        .select(PUBLIC_FIELDS)
        .sort({ createdAt: -1 })
        .skip((pageNum - 1) * limitNum)
        .limit(limitNum),
      Artisan.countDocuments(filter),
    ]);

    res.json({
      success: true,
      count: artisans.length,
      total,
      page: pageNum,
      pages: Math.ceil(total / limitNum),
      artisans,
    });
  } catch (err) {
    next(err);
  }
};

// @route GET /api/artisans/crafts
// @desc  Public: distinct list of crafts/categories, for filter dropdowns
const getCrafts = async (req, res, next) => {
  try {
    const crafts = await Artisan.distinct('craft', { isActive: true });
    res.json({ success: true, crafts: crafts.sort() });
  } catch (err) {
    next(err);
  }
};

// @route GET /api/artisans/:id
// @desc  Public: single artisan profile
const getArtisanById = async (req, res, next) => {
  try {
    const artisan = await Artisan.findOne({ _id: req.params.id, isActive: true }).select(PUBLIC_FIELDS);
    if (!artisan) {
      return res.status(404).json({ success: false, message: 'Artisan not found' });
    }
    res.json({ success: true, artisan });
  } catch (err) {
    next(err);
  }
};

// @route PUT /api/artisans/profile
// @desc  Private: artisan updates their own profile details
const updateProfile = async (req, res, next) => {
  try {
    const editable = ['fullName', 'phone', 'craft', 'address', 'town', 'state', 'country', 'bio'];
    editable.forEach((field) => {
      if (req.body[field] !== undefined) req.artisan[field] = req.body[field];
    });

    req.artisan.isProfileComplete = Boolean(
      req.artisan.bio && req.artisan.profilePicture && req.artisan.craft && req.artisan.address
    );

    await req.artisan.save();
    res.json({ success: true, artisan: req.artisan });
  } catch (err) {
    next(err);
  }
};

// @route PUT /api/artisans/profile/picture
// @desc  Private: upload/replace profile picture (field name: profilePicture)
const updateProfilePicture = async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'No image file was uploaded' });
    }

    // Replace the old profile picture on Cloudinary, if one exists
    destroyCloudinaryAsset(req.artisan.profilePicturePublicId);

    req.artisan.profilePicture = req.file.path; // Cloudinary secure_url
    req.artisan.profilePicturePublicId = req.file.filename; // Cloudinary public_id
    req.artisan.isProfileComplete = Boolean(
      req.artisan.bio && req.artisan.profilePicture && req.artisan.craft && req.artisan.address
    );
    await req.artisan.save();

    res.json({ success: true, artisan: req.artisan });
  } catch (err) {
    next(err);
  }
};

// @route POST /api/artisans/portfolio
// @desc  Private: add one or more portfolio images (field name: portfolioImages)
const addPortfolioImages = async (req, res, next) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ success: false, message: 'No image files were uploaded' });
    }

    // Keep portfolioImages and portfolioPublicIds index-aligned so a delete
    // later can look up the right Cloudinary asset for a given image URL.
    req.artisan.portfolioImages.push(...req.files.map((f) => f.path));
    req.artisan.portfolioPublicIds.push(...req.files.map((f) => f.filename));
    await req.artisan.save();

    res.status(201).json({ success: true, artisan: req.artisan });
  } catch (err) {
    next(err);
  }
};

// @route DELETE /api/artisans/portfolio
// @desc  Private: delete a single portfolio image. Body: { imageUrl }
const deletePortfolioImage = async (req, res, next) => {
  try {
    const { imageUrl } = req.body;
    if (!imageUrl) {
      return res.status(400).json({ success: false, message: 'imageUrl is required' });
    }

    const index = req.artisan.portfolioImages.indexOf(imageUrl);
    if (index === -1) {
      return res.status(404).json({ success: false, message: 'Image not found on this profile' });
    }

    destroyCloudinaryAsset(req.artisan.portfolioPublicIds[index]);

    req.artisan.portfolioImages.splice(index, 1);
    req.artisan.portfolioPublicIds.splice(index, 1);
    await req.artisan.save();

    res.json({ success: true, artisan: req.artisan });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getArtisans,
  getCrafts,
  getArtisanById,
  updateProfile,
  updateProfilePicture,
  addPortfolioImages,
  deletePortfolioImage,
};
