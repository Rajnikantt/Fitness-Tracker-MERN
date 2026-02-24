const mongoose = require('mongoose');

const workoutSetSchema = new mongoose.Schema({
  setNo: {
    type: Number,
    required: true
  },

  reps: {
    type: Number,
    required: true
  },

  weight: {
    type: Number,
    required: true
  },

  restSeconds: {
    type: Number,
    default: 60
  },

  rpe: {
    type: Number,
    min: 1,
    max: 10,
    default: null
  },

  notes: {
    type: String,
    trim: true
  }
});

const workoutExerciseSchema = new mongoose.Schema({
  exercise: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Exercise',
    required: true
  },

  orderNo: {
    type: Number,
    required: true
  },

  notes: {
    type: String,
    trim: true
  },

  sets: [workoutSetSchema]
});

const workoutSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },

  programDay: {
    type: String, // We'll store the day ID as a string reference
    default: null
  },

  userProgram: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'UserProgram',
    default: null
  },

  date: {
    type: Date,
    required: true,
    default: Date.now
  },

  notes: {
    type: String,
    trim: true
  },

  exercises: [workoutExerciseSchema]
},

 {
  timestamps: true
});

// Indexes
workoutSchema.index({ user: 1, date: -1 });
workoutSchema.index({ userProgram: 1 });

module.exports = mongoose.model('Workout', workoutSchema);
