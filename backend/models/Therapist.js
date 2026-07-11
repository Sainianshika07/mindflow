const mongoose = require('mongoose');

const TherapistSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please add a therapist name'],
    trim: true
  },
  specialization: {
    type: String,
    required: [true, 'Please specify a specialization'],
    trim: true
  },
  city: {
    type: String,
    required: [true, 'Please add city location'],
    trim: true
  },
  phone: {
    type: String,
    required: [true, 'Please add a phone contact']
  },
  email: {
    type: String,
    required: [true, 'Please add an email address'],
    match: [
      /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
      'Please add a valid email'
    ],
    lowercase: true,
    trim: true
  },
  availability: {
    type: [String], // Array of days, e.g., ['Mon', 'Tue', 'Wed', 'Thu', 'Fri']
    default: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri']
  },
  rating: {
    type: Number,
    min: 1,
    max: 5,
    default: 4.5
  }
});

// Indexes for searching and filtering therapists
TherapistSchema.index({ city: 1, specialization: 1 });

module.exports = mongoose.model('Therapist', TherapistSchema);
