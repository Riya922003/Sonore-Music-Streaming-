const express = require('express');
const Playlist = require('../models/Playlist'); // Note: Playlist model needs to be created
const Song = require('../models/Song');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

// POST route to create a new playlist
router.post('/', authMiddleware, async (req, res) => {
  try {
    // Destructure name and description from request body
    const { name, description } = req.body;
    
    // Get owner's ID from request object
    const ownerId = req.user.id;
    
    // Create new Playlist instance
    const newPlaylist = new Playlist({
      name,
      description,
      owner: ownerId
    });
    
    // Save the new playlist to the database
    const savedPlaylist = await newPlaylist.save();
    
    // Return 201 status with the newly created playlist
    res.status(201).json(savedPlaylist);
    
  } catch (error) {
    console.error('Error creating playlist:', error);
    res.status(500).json({ message: 'Server error while creating playlist' });
  }
});

// POST route to add a song to a playlist
router.post('/:playlistId/songs', authMiddleware, async (req, res) => {
  try {
    // Get playlistId from route parameters
    const { playlistId } = req.params;
    
    // Get songId from request body
    const { songId } = req.body;
    
    // Find the playlist by its ID
    const playlist = await Playlist.findById(playlistId);
    if (!playlist) {
      return res.status(404).json({ message: 'Playlist not found' });
    }
    
    // Verify that the logged-in user is the owner of the playlist
    if (playlist.owner.toString() !== req.user.id) {
      return res.status(403).json({ message: 'You are not authorized to modify this playlist.' });
    }
    
    // Check if the song already exists in the playlist's songs array
    if (playlist.songs.includes(songId)) {
      return res.status(400).json({ message: 'Song is already in the playlist' });
    }
    
    // Add the songId to the playlist's songs array
    playlist.songs.push(songId);
    
    // Save the updated playlist
    const updatedPlaylist = await playlist.save();
    
    // Return 200 status with the updated playlist object
    res.status(200).json(updatedPlaylist);
    
  } catch (error) {
    console.error('Error adding song to playlist:', error);
    res.status(500).json({ message: 'Server error while adding song to playlist' });
  }
});

// GET route to retrieve user's playlists (MUST come BEFORE /:playlistId route)
router.get('/my-playlists', authMiddleware, async (req, res) => {
  try {
    // Get the user's ID from the request object
    const userId = req.user.id;
    
    // Find all playlists owned by the user
    const userPlaylists = await Playlist.find({ owner: userId })
      .populate('owner', 'name')
      .populate('songs')
      .sort({ createdAt: -1 }); // Sort by newest first
    
    // Return 200 status with the user's playlists
    res.status(200).json(userPlaylists);
    
  } catch (error) {
    console.error('Error retrieving user playlists:', error);
    res.status(500).json({ message: 'Server error while retrieving user playlists' });
  }
});

// GET route to retrieve a specific playlist by ID
router.get('/:playlistId', async (req, res) => {
  try {
    // Get playlistId from route parameters
    const { playlistId } = req.params;
    
    // Find the playlist by its ID and populate owner and songs
    const playlist = await Playlist.findById(playlistId)
      .populate('owner', 'name')
      .populate('songs');
    
    // If playlist is not found, return 404 error
    if (!playlist) {
      return res.status(404).json({ message: 'Playlist not found' });
    }
    
    // Return 200 status with the populated playlist object
    res.status(200).json(playlist);
    
  } catch (error) {
    console.error('Error retrieving playlist:', error);
    res.status(500).json({ message: 'Server error while retrieving playlist' });
  }
});

// DELETE route to remove a song from a playlist
router.delete('/:playlistId/songs/:songId', authMiddleware, async (req, res) => {
  try {
    // Get playlistId and songId from route parameters
    const { playlistId, songId } = req.params;
    
    // Find the playlist by its ID
    const playlist = await Playlist.findById(playlistId);
    if (!playlist) {
      return res.status(404).json({ message: 'Playlist not found' });
    }
    
    // Verify that the logged-in user is the owner of the playlist
    if (playlist.owner.toString() !== req.user.id) {
      return res.status(403).json({ message: 'You are not authorized to modify this playlist' });
    }
    
    // Remove the songId from the playlist's songs array
    playlist.songs = playlist.songs.filter(song => song.toString() !== songId);
    
    // Save the updated playlist
    await playlist.save();
    
    // Return 200 status with a success message
    res.status(200).json({ message: 'Song removed from playlist successfully' });
    
  } catch (error) {
    console.error('Error removing song from playlist:', error);
    res.status(500).json({ message: 'Server error while removing song from playlist' });
  }
});

// DELETE route to delete an entire playlist
router.delete('/:playlistId', authMiddleware, async (req, res) => {
  try {
    // Get playlistId from route parameters
    const { playlistId } = req.params;
    
    // Find the playlist by its ID
    const playlist = await Playlist.findById(playlistId);
    if (!playlist) {
      return res.status(404).json({ message: 'Playlist not found' });
    }
    
    // Verify that the logged-in user is the owner of the playlist
    if (playlist.owner.toString() !== req.user.id) {
      return res.status(403).json({ message: 'You are not authorized to delete this playlist' });
    }
    
    // Delete the playlist from the database
    await Playlist.findByIdAndDelete(playlistId);
    
    // Return 200 status with a success message
    res.status(200).json({ message: 'Playlist deleted successfully.' });
    
  } catch (error) {
    console.error('Error deleting playlist:', error);
    res.status(500).json({ message: 'Server error while deleting playlist' });
  }
});

module.exports = router;