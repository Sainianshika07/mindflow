const express = require('express');
const { body } = require('express-validator');
const {
  createMoodLog,
  getLatestMoodLog,
  getMoodHistory,
  deleteMoodLog
} = require('../controllers/moodController');
const { protect } = require('../middleware/authMiddleware');
const { validate } = require('../middleware/validationMiddleware');

const router = express.Router();

const moodValidation = [
  body('mood', 'Mood is required and must be between 1 and 5').isInt({ min: 1, max: 5 }),
  body('stressLevel', 'Stress level must be between 0 and 10').optional().isInt({ min: 0, max: 10 }),
  body('anxietyLevel', 'Anxiety level must be between 0 and 10').optional().isInt({ min: 0, max: 10 }),
  body('sleepHours', 'Sleep hours must be between 0 and 24').optional().isFloat({ min: 0, max: 24 }),
  body('energyLevel', 'Energy level must be between 1 and 5').optional().isInt({ min: 1, max: 5 }),
  body('journal', 'Journal entry must be a string').optional().isString().trim()
];

router.use(protect); // Protect all mood routes

router.post('/', moodValidation, validate, createMoodLog);
router.get('/', getLatestMoodLog);
router.get('/history', getMoodHistory);
router.delete('/:id', deleteMoodLog);

module.exports = router;
