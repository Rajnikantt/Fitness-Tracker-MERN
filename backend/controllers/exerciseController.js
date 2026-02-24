const { validationResult } = require('express-validator');
const Exercise = require('../models/Exercise');

// @desc    Get all active exercises
exports.getExercises = async (req, res)=> {
  try {
    const { category, equipment, search } = req.query;
    
    let query = { isActive: true };
    
    if (category) {
      query.category = category;
    }
    
    if (equipment) {
      query.equipment = equipment;
    }
    
    if (search) {
      query.name = { $regex: search, $options: 'i' };
    }
    
    const exercises = await Exercise.find(query).sort({ name: 1 });
    
    res.json(exercises);
  } 
  catch (error) {
    console.error('Get exercises error:', error);
    res.status(500).json({ message: 'Error fetching exercises', error: error.message });
  }
};

// @desc    Get single exercise
exports.getExercise = async (req, res)=> {
  try {
    const exercise = await Exercise.findById(req.params.id);
    
    if (!exercise) {
      return res.status(404).json({ message: 'No exercise found' });
    }
    
    res.json(exercise);
  } catch (error) {
    console.error('Get exercise error:', error);
    res.status(500).json({ message: 'Error fetching exercise', error: error.message });
  }
};

// @desc    Create new exercise
exports.createExercise = async (req, res)=> {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { name, category, equipment, description } = req.body;

    const exercise = await Exercise.create({
      name,
      category,
      equipment,
      description
    });

    res.status(201).json(exercise);
  } 
  catch (error) {
    console.error('Create exercise error:', error);
    res.status(500).json({ message: 'Error creating exercise', error: error.message });
  }
};

// @desc    Update exercise
exports.updateExercise = async (req, res)=> {
  try {
    const exercise = await Exercise.findById(req.params.id);
    
    if (!exercise) {
      return res.status(404).json({ message: 'Exercise not found' });
    }

    const { name, category, equipment, description, isActive } = req.body;

    if (name) exercise.name = name;
    if (category) exercise.category = category;
    if (equipment) exercise.equipment = equipment;
    if (description !== undefined) exercise.description = description;
    if (isActive !== undefined) exercise.isActive = isActive;

    await exercise.save();

    res.json(exercise);
  } 
  catch (error) {
    console.error('Update exercise error:', error);
    res.status(500).json({ message: 'Error updating exercise', error: error.message });
  }
};

// @desc    Deactivate exercise
exports.deleteExercise = async (req, res)=> {
  try {
    const exercise = await Exercise.findById(req.params.id);
    
    if (!exercise) {
      return res.status(404).json({ message: 'Exercise not found' });
    }

    exercise.isActive = false;
    await exercise.save();

    res.json({ message: 'Exercise deactivated successfully' });
  } 
  catch (error) {
    console.error('Delete exercise error:', error);
    res.status(500).json({ message: 'Error deleting exercise', error: error.message });
  }
};
