const { validationResult } = require('express-validator');
const Workout = require('../models/Workout');

// @desc    Get all workouts for current user
exports.getWorkouts = async (req, res)=> {
  try {
    const { startDate, endDate, limit } = req.query;
    
    let query = { user: req.user._id };
    
    if (startDate || endDate) {
      query.date = {};
      if (startDate) query.date.$gte = new Date(startDate);
      if (endDate) query.date.$lte = new Date(endDate);
    }
    
    const workouts = await Workout.find(query)
      .populate('exercises.exercise', 'name category equipment')
      .populate('userProgram')
      .sort({ date: -1 })
      .limit(limit ? parseInt(limit) : 0);
    
    res.json(workouts);
  }
   catch (error) {
    console.error('Get workouts error:', error);
    res.status(500).json({ message: 'Error fetching workouts', error: error.message });
  }
};

// @desc    Get single workout
exports.getWorkout = async (req, res)=> {
  try {
    const workout = await Workout.findById(req.params.id)
      .populate('exercises.exercise', 'name category equipment')
      .populate('userProgram');
    
    if (!workout) {
      return res.status(404).json({ message: 'Workout not found' });
    }

    // Check ownership
    if (workout.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to view this workout' });
    }
    
    res.json(workout);
  }
   catch (error) {
    console.error('Get workout error:', error);
    res.status(500).json({ message: 'Error fetching workout', error: error.message });
  }
};

// @desc    Create new workout
exports.createWorkout = async (req, res)=> {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { date, notes, exercises, programDay, userProgram } = req.body;

    const workout = await Workout.create({
      user: req.user._id,
      date,
      notes,
      exercises: exercises || [],
      programDay,
      userProgram
    });

    const populatedWorkout = await Workout.findById(workout._id)
      .populate('exercises.exercise', 'name category equipment')
      .populate('userProgram');

    res.status(201).json(populatedWorkout);
  } 
  catch (error) {
    console.error('Create workout error:', error);
    res.status(500).json({ message: 'Error creating workout', error: error.message });
  }
};

// @desc    Update workout
exports.updateWorkout = async (req, res)=> {
  try {
    const workout = await Workout.findById(req.params.id);
    
    if (!workout) {
      return res.status(404).json({ message: 'Workout not found' });
    }

    // Check ownership
    if (workout.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to update this workout' });
    }

    const { date, notes, exercises } = req.body;

    if (date) workout.date = date;
    if (notes !== undefined) workout.notes = notes;
    if (exercises) workout.exercises = exercises;

    await workout.save();

    const updatedWorkout = await Workout.findById(workout._id)
      .populate('exercises.exercise', 'name category equipment')
      .populate('userProgram');

    res.json(updatedWorkout);
  } 
  catch (error) {
    console.error('Update workout error:', error);
    res.status(500).json({ message: 'Error updating workout', error: error.message });
  }
};

// @desc    Delete workout
exports.deleteWorkout = async (req, res)=> {
  try {
    const workout = await Workout.findById(req.params.id);
    
    if (!workout) {
      return res.status(404).json({ message: 'Workout not found' });
    }

    // Check ownership
    if (workout.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to delete this workout' });
    }

    await Workout.findByIdAndDelete(req.params.id);

    res.json({ message: 'Workout deleted successfully' });
  } catch (error) {
    console.error('Delete workout error:', error);
    res.status(500).json({ message: 'Error deleting workout', error: error.message });
  }
};

// @desc    Get workout statistics
exports.getWorkoutStats = async (req, res)=> {
  try {
    const workouts = await Workout.find({ user: req.user._id })
      .populate('exercises.exercise', 'name');

    const stats = {
      totalWorkouts: workouts.length,
      totalExercises: 0,
      totalSets: 0,
      totalReps: 0,
      totalVolume: 0,
      recentWorkouts: workouts.slice(0, 5).map(w => ({
        date: w.date,
        exerciseCount: w.exercises.length
      }))
    };

    workouts.forEach(workout => {
      stats.totalExercises += workout.exercises.length;
      workout.exercises.forEach(exercise => {
        stats.totalSets += exercise.sets.length;
        exercise.sets.forEach(set => {
          stats.totalReps += set.reps;
          stats.totalVolume += (set.weight * set.reps);
        });
      });
    });

    res.json(stats);
  } 
  catch (error) {
    console.error('Get workout stats error:', error);
    res.status(500).json({ message: 'Error fetching workout statistics', error: error.message });
  }
};
