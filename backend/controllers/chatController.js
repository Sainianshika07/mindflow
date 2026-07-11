const ChatHistory = require('../models/ChatHistory');
const { generateSupportiveResponse } = require('../services/geminiService');

// @desc    Send a message to the AI chatbot and receive a supportive response
// @route   POST /api/chat
// @access  Private
const sendChatMessage = async (req, res, next) => {
  try {
    const { message } = req.body;

    if (!message) {
      return res.status(400).json({ success: false, error: 'Please provide a message' });
    }

    // Fetch recent chat history for context (last 10 interactions)
    const history = await ChatHistory.find({ userId: req.user.id })
      .sort({ timestamp: -1 })
      .limit(10);
    
    // Reverse to chronological order for context passing
    const contextHistory = history.reverse();

    // Call Gemini AI
    const aiResponse = await generateSupportiveResponse(message, contextHistory);

    // Save history
    const chatLog = await ChatHistory.create({
      userId: req.user.id,
      userMessage: message,
      aiResponse,
      timestamp: new Date()
    });

    res.status(201).json({
      success: true,
      data: chatLog
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get complete chat history for the user
// @route   GET /api/chat
// @access  Private
const getChatHistory = async (req, res, next) => {
  try {
    const history = await ChatHistory.find({ userId: req.user.id }).sort({ timestamp: 1 });

    res.json({
      success: true,
      count: history.length,
      data: history
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  sendChatMessage,
  getChatHistory
};
