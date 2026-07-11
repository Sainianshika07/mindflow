const express = require('express');
const { getTherapists } = require('../controllers/therapistController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

// Get therapists with filters
router.get('/', protect, getTherapists);

module.exports = router;
