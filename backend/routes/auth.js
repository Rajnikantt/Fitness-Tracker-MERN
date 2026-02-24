const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const authController = require('../controllers/authController');
const { protect } = require('../middleware/auth');


// route POST /api/auth/register
// desc Register a new user
// access to Public
router.post('/register', [
  body('name').trim().notEmpty().withMessage('Name is required'),
  body('email').isEmail().withMessage('Please provide a valid email'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters')
], authController.register);


// route POST /api/auth/login
// desc Login user
// accessto Public
router.post('/login', [
  body('email').isEmail().withMessage('Please provide a valid email'),
  body('password').notEmpty().withMessage('Password is required')
], authController.login);


// route GET /api/auth/me
// desc Get current user
// access only Private
router.get('/me', protect, authController.getMe);

module.exports = router;
