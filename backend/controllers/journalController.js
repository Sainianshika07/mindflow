const Journal = require('../models/Journal');

// @desc    Create a new journal entry
// @route   POST /api/journal
// @access  Private
const createJournal = async (req, res, next) => {
  try {
    const { title, content, mood } = req.body;

    const journal = await Journal.create({
      userId: req.user.id,
      title,
      content,
      mood: mood || 'neutral'
    });

    res.status(201).json({
      success: true,
      data: journal
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all journal entries for logged-in user
// @route   GET /api/journal
// @access  Private
const getJournals = async (req, res, next) => {
  try {
    const journals = await Journal.find({ userId: req.user.id }).sort({ createdAt: -1 });

    res.json({
      success: true,
      count: journals.length,
      data: journals
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update a journal entry
// @route   PUT /api/journal/:id
// @access  Private
const updateJournal = async (req, res, next) => {
  try {
    let journal = await Journal.findById(req.params.id);

    if (!journal) {
      return res.status(404).json({ success: false, error: 'Journal entry not found' });
    }

    // Verify ownership
    if (journal.userId.toString() !== req.user.id) {
      return res.status(401).json({ success: false, error: 'Not authorized to update this entry' });
    }

    const { title, content, mood } = req.body;

    journal = await Journal.findByIdAndUpdate(
      req.params.id,
      { title, content, mood },
      { new: true, runValidators: true }
    );

    res.json({
      success: true,
      data: journal
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete a journal entry
// @route   DELETE /api/journal/:id
// @access  Private
const deleteJournal = async (req, res, next) => {
  try {
    const journal = await Journal.findById(req.params.id);

    if (!journal) {
      return res.status(404).json({ success: false, error: 'Journal entry not found' });
    }

    // Verify ownership
    if (journal.userId.toString() !== req.user.id) {
      return res.status(401).json({ success: false, error: 'Not authorized to delete this entry' });
    }

    await journal.deleteOne();

    res.json({
      success: true,
      message: 'Journal entry deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createJournal,
  getJournals,
  updateJournal,
  deleteJournal
};
