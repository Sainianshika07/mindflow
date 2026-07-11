const express = require('express');
const { body } = require('express-validator');
const { sendChatMessage, getChatHistory } = require('../controllers/chatController');
const { protect } = require('../middleware/authMiddleware');
const { validate } = require('../middleware/validationMiddleware');

const router = express.Router();

const chatValidation = [
  body('message', 'Message content is required').notEmpty().trim()
];

router.use(protect);

router.post('/', chatValidation, validate, sendChatMessage);
router.get('/history', getChatHistory);

module.exports = router;
