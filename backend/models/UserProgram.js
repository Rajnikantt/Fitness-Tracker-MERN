const mongoose = require('mongoose');

const userProgramSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },

  program: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Program',
    required: true
  },

  startDate: {
    type: Date,
    default: Date.now
  },

  isActive: {
    type: Boolean,
    default: true
  }
},
 
{
  timestamps: true
});

// Compound index to prevent duplicate adoptions
userProgramSchema.index({ user: 1, program: 1 }, { unique: true });
userProgramSchema.index({ user: 1, isActive: 1 });

module.exports = mongoose.model('UserProgram', userProgramSchema);
