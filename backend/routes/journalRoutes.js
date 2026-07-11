const express = require('express');
const { body } = require('express-validator');
const {
  createJournal,
  getJournals,
  updateJournal,
  deleteJournal
} = require('../controllers/journalController');
const { protect } = require('../middleware/authMiddleware');
const { validate } = require('../middleware/validationMiddleware');

const router = express.Router();

const journalValidation = [
  body('title', 'Title is required and must not exceed 100 characters').notEmpty().trim().isLength({ max: 100 }),
  body('content', 'Content is required').notEmpty().trim(),
  body('mood', 'Invalid mood value').optional().isIn(['very bad', 'bad', 'neutral', 'good', 'very good', 'positive', 'negative', 'anxious', 'calm'])
];

router.use(protect); // Protect all journal routes

router.post('/', journalValidation, validate, createJournal);
router.get('/', getJournals);
router.put('/:id', journalValidation, validate, updateJournal);
router.delete('/:id', deleteJournal);

module.exports = router;
