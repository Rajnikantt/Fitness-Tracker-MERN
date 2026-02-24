const mongoose = require('mongoose');

const exerciseSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Exercise name is required'],
    trim: true,
    maxlength: 100
  },

  category: {
    type: String,
    required: [true, 'Category is required'],
    enum: ['Chest', 'Back', 'Legs', 'Shoulders', 'Arms', 'Core', 'Cardio', 'Other'],
    maxlength: 50
  },

  equipment: {
    type: String,
    required: [true, 'Equipment is required'],
    enum: ['Barbell', 'Dumbbell', 'Machine', 'Bodyweight', 'Cable', 'Kettlebell', 'Resistance Band', 'Other'],
    maxlength: 50
  },

  description: {
    type: String,
    trim: true
  },

  isActive: {
    type: Boolean,
    default: true
  }

},

 {
  timestamps: true
});

// Index for efficient searching
exerciseSchema.index({ name: 1, category: 1 });
exerciseSchema.index({ isActive: 1 });

module.exports = mongoose.model('Exercise', exerciseSchema);
