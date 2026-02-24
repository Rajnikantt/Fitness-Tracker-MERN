const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const programController = require('../controllers/programController');
const { protect } = require('../middleware/auth');

// route   GET /api/programs
// desc    Get all programs (public + user's own)
// access  to Private
router.get('/', protect, programController.getPrograms);

// route   GET /api/programs/public
// desc    Get all public programs
// access  to Private
router.get('/public', protect, programController.getPublicPrograms);

// route   GET /api/programs/my
// desc    Get current user's programs
// access  to Private
router.get('/my', protect, programController.getMyPrograms);

// route   GET /api/programs/:id
// desc    Get single program
// access  to Private
router.get('/:id', protect, programController.getProgram);

// route   POST /api/programs
// desc    Create new program
// access  to Private
router.post('/', [protect, [
  body('name').trim().notEmpty().withMessage('Program name is required')
]], programController.createProgram);

// route   PUT /api/programs/:id
// desc    Update program
// access  to Private
router.put('/:id', protect, programController.updateProgram);

// route   DELETE /api/programs/:id
// desc    Delete program
// access  to Private
router.delete('/:id', protect, programController.deleteProgram);

// route   POST /api/programs/:id/adopt
// desc    Adopt a public program
// access  to Private
router.post('/:id/adopt', protect, programController.adoptProgram);

// route   GET /api/programs/:id/adopted
// desc    Get users who adopted this program
// access  to Private
router.get('/:id/adopted', protect, programController.getAdoptedUsers);

module.exports = router;
