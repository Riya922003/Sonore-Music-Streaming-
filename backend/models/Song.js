const mongoose = require('mongoose');

const songSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  artist: {
    type: String,
    required: true
  },
  album: {
    type: String
  },
  featured: {
    type: Boolean,
    default: false
  },
  genre: {
    type: String,
    required: true // Let's make genre required too for better filtering
  },
  // --- NEW FIELD ---
  language: {
    type: String,
    required: true
  },
  // --- END NEW FIELD ---
  duration: {
    type: Number,
    required: true
  },
  url: {
    type: String,
    required: true,
    unique: true
  },
  thumbnail: {
    type: String,
    required: true
  },
  uploadedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
}, {
  timestamps: true
});

// Create text index for search functionality
songSchema.index({
  title: 'text',
  artist: 'text',
  genre: 'text',
  language: 'text'
});

const Song = mongoose.model('Song', songSchema);

module.exports = Song;