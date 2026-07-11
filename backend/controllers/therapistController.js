const Therapist = require('../models/Therapist');

// @desc    Get all therapists with optional search/filter
// @route   GET /api/therapists
// @access  Private
const getTherapists = async (req, res, next) => {
  try {
    const { city, specialization, availability, minRating } = req.query;
    const query = {};

    // Filter by city (case-insensitive search)
    if (city) {
      query.city = { $regex: city, $options: 'i' };
    }

    // Filter by specialization (case-insensitive search)
    if (specialization) {
      query.specialization = { $regex: specialization, $options: 'i' };
    }

    // Filter by availability (e.g., checks if day is included in availability array)
    if (availability) {
      query.availability = { $in: [availability] };
    }

    // Filter by minimum rating
    if (minRating) {
      query.rating = { $gte: parseFloat(minRating) };
    }

    const therapists = await Therapist.find(query).sort({ rating: -1 });

    res.json({
      success: true,
      count: therapists.length,
      data: therapists
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getTherapists
};
