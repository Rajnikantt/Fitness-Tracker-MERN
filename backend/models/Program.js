const mongoose = require('mongoose');

const programSetSchema = new mongoose.Schema({
  setNo: {
    type: Number,
    required: true
  },

  targetReps: {
    type: Number,
    required: true
  },

  targetWeight: {
    type: Number,
    default: null
  },

  restSeconds: {
    type: Number,
    default: 60
  },

  intensityPercent: {
    type: Number,
    min: 0,
    max: 100,
    default: null
  },

  notes: {
    type: String,
    trim: true
  }
});

const programExerciseSchema = new mongoose.Schema({
  exercise: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Exercise',
    required: true
  },

  orderNo: {
    type: Number,
    required: true
  },

  trainingStyle: {
    type: String,
    enum: [ 
      'Straight Sets',
        'Pyramid',
        'Drop Set',
         'Superset',
          'Circuit',
           'AMRAP', 
           'Other'
          ],
    default: 'Straight Sets'
  },

  notes: {
    type: String,
    trim: true
  },
  sets: [programSetSchema]
});

const programDaySchema = new mongoose.Schema({
  dayNumber: {
    type: Number,
    required: true,
    min: 1,
    max: 7
  },

  title: {
    type: String,
    required: true,
    maxlength: 100
  },

  notes: {
    type: String,
    trim: true
  },
  exercises: [programExerciseSchema]
});

const programSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Program name is required'],
    trim: true,
    maxlength: 150
  },

  description: {
    type: String,
    trim: true
  },

  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  
  visibility: {
    type: String,
    enum: ['Public', 'Private'],
    default: 'Private'
  },

  days: [programDaySchema],
  createdDate: {
    type: Date,
    default: Date.now
  }
},

 {
  timestamps: true
});

// Indexes
programSchema.index({ createdBy: 1 });
programSchema.index({ visibility: 1 });
programSchema.index({ createdDate: -1 });

module.exports = mongoose.model('Program', programSchema);
