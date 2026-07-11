const mongoose = require('mongoose');

const ChatHistorySchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  userMessage: {
    type: String,
    required: true,
    trim: true
  },
  aiResponse: {
    type: String,
    required: true,
    trim: true
  },
  timestamp: {
    type: Date,
    default: Date.now
  }
});

// Create index on userId and timestamp for conversational retrieval
ChatHistorySchema.index({ userId: 1, timestamp: 1 });

module.exports = mongoose.model('ChatHistory', ChatHistorySchema);
