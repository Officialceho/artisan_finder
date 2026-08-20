const express = require('express');
const router = express.Router();
const {
  getArtisans,
  getCrafts,
  getArtisanById,
  updateProfile,
  updateProfilePicture,
  addPortfolioImages,
  deletePortfolioImage,
} = require('../controllers/artisanController');
const { protect } = require('../middleware/auth');
const upload = require('../middleware/upload');

// Public
router.get('/', getArtisans);
router.get('/crafts', getCrafts);
router.get('/:id', getArtisanById);

// Private (artisan dashboard)
router.put('/profile', protect, updateProfile);
router.put('/profile/picture', protect, upload.single('profilePicture'), updateProfilePicture);
router.post('/portfolio', protect, upload.array('portfolioImages', 10), addPortfolioImages);
router.delete('/portfolio', protect, deletePortfolioImage);

module.exports = router;
