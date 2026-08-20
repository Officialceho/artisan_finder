const { body, validationResult } = require('express-validator');

const handleValidation = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: errors.array()[0].msg,
      errors: errors.array(),
    });
  }
  next();
};

// Special-character requirement shared by signup + password reset
const SPECIAL_CHAR_REGEX = /[!@#$%^&*(),.?":{}|<>_\-+=[\]/\\;'~`]/;

const signupValidation = [
  body('fullName').trim().notEmpty().withMessage('Full name is required'),
  body('email').trim().isEmail().withMessage('A valid email is required').normalizeEmail(),
  body('phone').trim().notEmpty().withMessage('Phone number is required'),
  body('craft').trim().notEmpty().withMessage('Craft / category is required'),
  body('address').trim().notEmpty().withMessage('Address is required'),
  body('town').trim().notEmpty().withMessage('Town is required'),
  body('state').trim().notEmpty().withMessage('State is required'),
  body('country').trim().notEmpty().withMessage('Country is required'),
  body('password')
    .isLength({ min: 8 })
    .withMessage('Password must be at least 8 characters long')
    .matches(SPECIAL_CHAR_REGEX)
    .withMessage('Password must contain at least one special character'),
  body('confirmPassword').custom((value, { req }) => {
    if (value !== req.body.password) {
      throw new Error('Password and confirm password do not match');
    }
    return true;
  }),
  handleValidation,
];

const loginValidation = [
  body('email').trim().isEmail().withMessage('A valid email is required').normalizeEmail(),
  body('password').notEmpty().withMessage('Password is required'),
  handleValidation,
];

const bookingValidation = [
  body('customerName').trim().notEmpty().withMessage('Your name is required'),
  body('customerPhone').trim().notEmpty().withMessage('Your phone number is required'),
  body('customerEmail').optional({ checkFalsy: true }).isEmail().withMessage('Please provide a valid email'),
  body('serviceAddress').trim().notEmpty().withMessage('Service address is required'),
  body('preferredDate').notEmpty().withMessage('Preferred date is required').isISO8601().withMessage('Preferred date must be a valid date'),
  handleValidation,
];

module.exports = { signupValidation, loginValidation, bookingValidation, handleValidation };
