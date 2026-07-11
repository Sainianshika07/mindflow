const express = require('express');
const { body } = require('express-validator');
const {
  registerUser,
  loginUser,
  logoutUser,
  getUserProfile,
  updateUserProfile,
  changePassword
} = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');
const { validate } = require('../middleware/validationMiddleware');

const router = express.Router();

// Input Validation Rules
const registerValidation = [
  body('name', 'Name is required').notEmpty().trim(),
  body('email', 'Please include a valid email').isEmail().normalizeEmail(),
  body('password', 'Please enter a password with 6 or more characters').isLength({ min: 6 })
];

const loginValidation = [
  body('email', 'Please include a valid email').isEmail().normalizeEmail(),
  body('password', 'Password is required').exists()
];

const profileValidation = [
  body('name', 'Name is required').optional().notEmpty().trim(),
  body('age', 'Age must be a positive number').optional().isInt({ min: 1 }),
  body('gender', 'Invalid gender choice').optional().isIn(['Male', 'Female', 'Non-Binary', 'Prefer Not to Say', 'Other'])
];

const passwordValidation = [
  body('currentPassword', 'Current password is required').notEmpty(),
  body('newPassword', 'New password must be at least 6 characters').isLength({ min: 6 })
];

// Routes
router.post('/register', registerValidation, validate, registerUser);
router.post('/login', loginValidation, validate, loginUser);
router.post('/logout', protect, logoutUser);
router.get('/profile', protect, getUserProfile);
router.put('/profile', protect, profileValidation, validate, updateUserProfile);
router.put('/change-password', protect, passwordValidation, validate, changePassword);

module.exports = router;
