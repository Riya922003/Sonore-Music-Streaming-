const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
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

    // Add song to liked songs array (ensure ObjectId format)
    const songObjectId = mongoose.Types.ObjectId.isValid(songId) 
      ? new mongoose.Types.ObjectId(songId) 
      : songId;
    user.likedSongs.push(songObjectId);
    await user.save();

    console.log('Song added to likes:', { 
      songId, 
      type: typeof songId,
      userId,
      updatedLikedSongs: user.likedSongs,
      likedSongsCount: user.likedSongs.length
    });

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

    console.log('DELETE /likes/:songId - Request received:', { songId, userId });

    // First, get the user to see current liked songs
    const userBefore = await User.findById(userId);
    if (!userBefore) {
      return res.status(404).json({ message: 'User not found' });
    }

    console.log('User before deletion:', { 
      userId: userBefore._id,
      likedSongs: userBefore.likedSongs,
      likedSongsCount: userBefore.likedSongs.length 
    });

    // Check if song exists in liked songs before deletion
    const songExists = userBefore.likedSongs.some(id => id.toString() === songId);
    console.log('Song exists in liked songs:', songExists);

    // Get the user and manually remove the song (more reliable than $pull)
    const user = await User.findById(userId);
    
    console.log('Removing song using manual filtering approach...');
    
    // Filter out the song from likedSongs array
    const originalCount = user.likedSongs.length;
    user.likedSongs = user.likedSongs.filter(id => id.toString() !== songId);
    
    // Save the updated user
    await user.save();
    
    const removedCount = originalCount - user.likedSongs.length;
    console.log('Removal result:', { 
      originalCount,
      newCount: user.likedSongs.length,
      removedCount,
      success: removedCount > 0
    });

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