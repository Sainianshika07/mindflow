const Mood = require('../models/Mood');
const { analyzeMoodLog } = require('../services/geminiService');

// @desc    Log a new mood
// @route   POST /api/mood
// @access  Private
const createMoodLog = async (req, res, next) => {
  try {
    const { mood, stressLevel, anxietyLevel, sleepHours, energyLevel, journal, date } = req.body;

    const moodLog = await Mood.create({
      userId: req.user.id,
      mood,
      stressLevel,
      anxietyLevel,
      sleepHours,
      energyLevel,
      journal,
      date: date || new Date()
    });

    // Run AI analysis
    const aiAnalysis = await analyzeMoodLog({
      mood,
      stressLevel,
      anxietyLevel,
      sleepHours,
      energyLevel,
      journal
    });

    res.status(201).json({
      success: true,
      data: moodLog,
      analysis: aiAnalysis
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get the latest mood log
// @route   GET /api/mood
// @access  Private
const getLatestMoodLog = async (req, res, next) => {
  try {
    const latestMood = await Mood.findOne({ userId: req.user.id }).sort({ date: -1 });
    
    if (!latestMood) {
      return res.status(200).json({
        success: true,
        data: null,
        message: 'No mood logs recorded yet'
      });
    }

    res.json({
      success: true,
      data: latestMood
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all mood logs for a user (history)
// @route   GET /api/mood/history
// @access  Private
const getMoodHistory = async (req, res, next) => {
  try {
    const history = await Mood.find({ userId: req.user.id }).sort({ date: -1 });

    res.json({
      success: true,
      count: history.length,
      data: history
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete a mood log
// @route   DELETE /api/mood/:id
// @access  Private
const deleteMoodLog = async (req, res, next) => {
  try {
    const moodLog = await Mood.findById(req.params.id);

    if (!moodLog) {
      return res.status(404).json({ success: false, error: 'Mood log not found' });
    }

    // Verify ownership
    if (moodLog.userId.toString() !== req.user.id) {
      return res.status(401).json({ success: false, error: 'Not authorized to delete this log' });
    }

    await moodLog.deleteOne();

    res.json({
      success: true,
      message: 'Mood log deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createMoodLog,
  getLatestMoodLog,
  getMoodHistory,
  deleteMoodLog
};
