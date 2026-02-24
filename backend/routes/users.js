const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { protect, admin } = require('../middleware/auth');

// route   GET /api/users
// desc    Get all users (Admin only)
// access  Private/Admin
router.get('/', protect, admin, userController.getUsers);

// route   GET /api/users/:id
// desc    Get single user (Admin only)
// access  Private/Admin
router.get('/:id', protect, admin, userController.getUser);

// route   PUT /api/users/:id
// desc    Update user (Admin only)
// access  Private/Admin
router.put('/:id', protect, admin, userController.updateUser);

// route   DELETE /api/users/:id
// desc    Deactivate user (Admin only)
// access  Private/Admin
router.delete('/:id', protect, admin, userController.deactivateUser);

module.exports = router;
