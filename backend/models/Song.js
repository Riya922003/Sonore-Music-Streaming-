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
  genre: {
    type: String
  },
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
    type: String
  },
  uploadedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
}, {
  timestamps: true
});

const Song = mongoose.model('Song', songSchema);

module.exports = Song;