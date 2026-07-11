const mongoose = require('mongoose');

const MoodSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  mood: {
    type: Number,
    required: [true, 'Please add a mood value between 1 and 5'],
    min: 1,
    max: 5
  },
  stressLevel: {
    type: Number,
    required: true,
    min: 0,
    max: 10,
    default: 0
  },
  anxietyLevel: {
    type: Number,
    required: true,
    min: 0,
    max: 10,
    default: 0
  },
  sleepHours: {
    type: Number,
    required: true,
    min: 0,
    max: 24,
    default: 0
  },
  energyLevel: {
    type: Number,
    required: true,
    min: 1,
    max: 5,
    default: 3
  },
  journal: {
    type: String,
    trim: true,
    default: ''
  },
  date: {
    type: Date,
    default: Date.now
  }
});

// Create index on userId and date for faster retrieval of user history
MoodSchema.index({ userId: 1, date: -1 });

module.exports = mongoose.model('Mood', MoodSchema);
