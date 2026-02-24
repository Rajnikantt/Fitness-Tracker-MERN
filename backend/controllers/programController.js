const { validationResult } = require('express-validator');
const Program = require('../models/Program');
const UserProgram = require('../models/UserProgram');

// @desc    Get all programs (public + user's own)
exports.getPrograms = async (req, res)=> {
  try {
    const programs = await Program.find({
      $or: [
        { visibility: 'Public' },
        { createdBy: req.user._id }
      ]
    })
    .populate('createdBy', 'name email')
    .populate('days.exercises.exercise', 'name category equipment')
    .sort({ createdDate: -1 });
    
    res.json(programs);
  } 
  catch (error) {
    console.error('Get programs error:', error);
    res.status(500).json({ message: 'Error fetching programs', error: error.message });
  }
};

// @desc    Get all public programs
exports.getPublicPrograms = async (req, res)=> {
  try {
    const programs = await Program.find({ visibility: 'Public' })
      .populate('createdBy', 'name email')
      .populate('days.exercises.exercise', 'name category equipment')
      .sort({ createdDate: -1 });
    
    res.json(programs);
  } 
  catch (error) {
    console.error('Get public programs error:', error);
    res.status(500).json({ message: 'Error fetching public programs', error: error.message });
  }
};

// @desc    Get current user's programs
exports.getMyPrograms = async (req, res)=> {
  try {
    const programs = await Program.find({ createdBy: req.user._id })
      .populate('days.exercises.exercise', 'name category equipment')
      .sort({ createdDate: -1 });
    
    res.json(programs);
  }
   catch (error) {
    console.error('Get my programs error:', error);
    res.status(500).json({ message: 'Error fetching your programs', error: error.message });
  }
};

// @desc    Get single program
exports.getProgram = async (req, res)=> {
  try {
    const program = await Program.findById(req.params.id)
      .populate('createdBy', 'name email')
      .populate('days.exercises.exercise', 'name category equipment');
    
    if (!program) {
      return res.status(404).json({ message: 'Program not found' });
    }

    // Check if user has access
    if (program.visibility === 'Private' && program.createdBy._id.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Access denied to this private program' });
    }
    
    res.json(program);
  } 
  catch (error) {
    console.error('Get program error:', error);
    res.status(500).json({ message: 'Error fetching program', error: error.message });
  }
};

// @desc    Create new program
exports.createProgram = async (req, res)=> {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { name, description, visibility, days } = req.body;

    const program = await Program.create({
      name,
      description,
      createdBy: req.user._id,
      visibility: visibility || 'Private',
      days: days || []
    });

    const populatedProgram = await Program.findById(program._id)
      .populate('createdBy', 'name email')
      .populate('days.exercises.exercise', 'name category equipment');

    res.status(201).json(populatedProgram);
  } 
  catch (error) {
    console.error('Create program error:', error);
    res.status(500).json({ message: 'Error creating program', error: error.message });
  }
};

// @desc    Update program
exports.updateProgram = async (req, res)=> {
  try {
    const program = await Program.findById(req.params.id);
    
    if (!program) {
      return res.status(404).json({ message: 'Program not found' });
    }

    // Check ownership
    if (program.createdBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to update this program' });
    }

    const { name, description, visibility, days } = req.body;

    if (name) program.name = name;
    if (description !== undefined) program.description = description;
    if (visibility) program.visibility = visibility;
    if (days) program.days = days;

    await program.save();

    const updatedProgram = await Program.findById(program._id)
      .populate('createdBy', 'name email')
      .populate('days.exercises.exercise', 'name category equipment');

    res.json(updatedProgram);
  } 
  catch (error) {
    console.error('Update program error:', error);
    res.status(500).json({ message: 'Error updating program', error: error.message });
  }
};

// @desc    Delete program
exports.deleteProgram = async (req, res)=> {
  try {
    const program = await Program.findById(req.params.id);
    
    if (!program) {
      return res.status(404).json({ message: 'Program not found' });
    }

    // Check ownership
    if (program.createdBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to delete this program' });
    }

    await Program.findByIdAndDelete(req.params.id);
    await UserProgram.deleteMany({ program: req.params.id });

    res.json({ message: 'Program deleted successfully' });
  } 
  catch (error) {
    console.error('Delete program error:', error);
    res.status(500).json({ message: 'Error deleting program', error: error.message });
  }
};

// @desc    Adopt a public program
exports.adoptProgram = async (req, res)=> {
  try {
    const program = await Program.findById(req.params.id);
    
    if (!program) {
      return res.status(404).json({ message: 'Program not found' });
    }

    if (program.visibility !== 'Public') {
      return res.status(403).json({ message: 'Cannot adopt a private program' });
    }

    // Check if already adopted
    const existingAdoption = await UserProgram.findOne({
      user: req.user._id,
      program: req.params.id
    });

    if (existingAdoption) {
      return res.status(400).json({ message: 'You have already adopted this program' });
    }

    const userProgram = await UserProgram.create({
      user: req.user._id,
      program: req.params.id
    });

    res.status(201).json({ message: 'Program adopted successfully', userProgram });
  } 
  catch (error) {
    console.error('Adopt program error:', error);
    res.status(500).json({ message: 'Error adopting program', error: error.message });
  }
};

// @desc    Get users who adopted this program
exports.getAdoptedUsers = async (req, res)=> {
  try {
    const adoptions = await UserProgram.find({ program: req.params.id })
      .populate('user', 'name email')
      .sort({ startDate: -1 });
    
    res.json(adoptions);
  } 
  catch (error) {
    console.error('Get adopted users error:', error);
    res.status(500).json({ message: 'Error fetching adopted users', error: error.message });
  }
};
