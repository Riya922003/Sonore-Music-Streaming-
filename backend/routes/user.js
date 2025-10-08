const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Song = require('../models/Song');
const authMiddleware = require('../middleware/authMiddleware');

// POST /likes/:songId - Add song to user's liked songs
router.post('/likes/:songId', authMiddleware, async (req, res) => {
  try {
    const { songId } = req.params;
    const userId = req.user.id;

    // Find the user
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Check if song is already liked
    if (user.likedSongs.includes(songId)) {
      return res.status(200).json({ 
        message: 'Song already in liked songs',
        likedSongs: user.likedSongs
      });
    }

    // Add song to liked songs array
    user.likedSongs.push(songId);
    await user.save();

    res.status(200).json({ 
      message: 'Song added to liked songs successfully',
      likedSongs: user.likedSongs
    });
  } catch (error) {
    console.error('Error adding song to likes:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// DELETE /likes/:songId - Remove song from user's liked songs
router.delete('/likes/:songId', authMiddleware, async (req, res) => {
  try {
    const { songId } = req.params;
    const userId = req.user.id;

    // Find the user
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Check if song is in liked songs
    if (!user.likedSongs.includes(songId)) {
      return res.status(200).json({ 
        message: 'Song not in liked songs',
        likedSongs: user.likedSongs
      });
    }

    // Remove song from liked songs array
    user.likedSongs = user.likedSongs.filter(id => id !== songId);
    await user.save();

    res.status(200).json({ 
      message: 'Song removed from liked songs successfully',
      likedSongs: user.likedSongs
    });
  } catch (error) {
    console.error('Error removing song from likes:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// GET /likes - Get user's liked songs with full song objects
router.get('/likes', authMiddleware, async (req, res) => {
  try {
    const userId = req.user.id;

    // Find the user
    const user = await User.findById(userId);
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Get the liked songs by manually querying Song collection
    // This handles both string IDs and ObjectId references
    const songs = await Song.find({ 
      _id: { $in: user.likedSongs } 
    });

    // Map the songs to match frontend expectations
    const likedSongs = songs.map(song => ({
      _id: song._id,
      title: song.title,
      artist: song.artist,
      album: song.album,
      albumArt: song.thumbnail, // Map thumbnail to albumArt
      audioUrl: song.url,       // Map url to audioUrl
      duration: song.duration,
      genre: song.genre,
      language: song.language,
      uploadedBy: song.uploadedBy,
      createdAt: song.createdAt,
      updatedAt: song.updatedAt
    }));

    res.status(200).json({ 
      likedSongs: likedSongs
    });
  } catch (error) {
    console.error('Error fetching liked songs:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;