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
      return res.status(400).json({ message: 'Song already liked' });
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
      return res.status(400).json({ message: 'Song not found in liked songs' });
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

    // Find the user and populate the likedSongs field with full song objects
    const user = await User.findById(userId).populate('likedSongs');
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json({ 
      likedSongs: user.likedSongs
    });
  } catch (error) {
    console.error('Error fetching liked songs:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;