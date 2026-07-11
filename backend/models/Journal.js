const mongoose = require('mongoose');

const JournalSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  title: {
    type: String,
    required: [true, 'Please add a title for your journal entry'],
    trim: true,
    maxlength: [100, 'Title cannot be more than 100 characters']
  },
  content: {
    type: String,
    required: [true, 'Please add content to your journal entry'],
    trim: true
  },
  mood: {
    type: String,
    enum: ['very bad', 'bad', 'neutral', 'good', 'very good', 'positive', 'negative', 'anxious', 'calm'],
    default: 'neutral'
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Create index on userId and createdAt for query performance
JournalSchema.index({ userId: 1, createdAt: -1 });

module.exports = mongoose.model('Journal', JournalSchema);
