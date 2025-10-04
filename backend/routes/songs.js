const express = require('express');
const Song = require('../models/Song');
const authMiddleware = require('../middleware/authMiddleware');
// 1. CORRECTED: Import 'upload' directly, without curly braces
const upload = require('../middleware/multer'); 
// It's good practice to import cloudinary v2 explicitly
const cloudinary = require('cloudinary').v2; 

const router = express.Router();

// This GET route is correct, no changes needed here.
router.get('/', async (req, res) => {
  try {
    const songs = await Song.find()
      .populate('uploadedBy', 'name email')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: songs.length,
      songs: songs
    });
  } catch (error) {
    console.error('Get songs error:', error);
    res.status(500).json({
      success: false,
      message: "Server error occurred while fetching songs."
    });
  }
});

// --- REPLACE YOUR EXISTING UPLOAD ROUTE WITH THIS CORRECTED VERSION ---
router.post(
  '/upload',
  authMiddleware,
  // 2. CORRECTED: Invoke the multer middleware and tell it which fields to expect
  upload.fields([
    { name: 'song', maxCount: 1 },
    { name: 'thumbnail', maxCount: 1 },
  ]),
  async (req, res) => {
    try {
      // Check if files exist on the req.files object
      if (!req.files || !req.files.song || !req.files.thumbnail) {
        return res.status(400).json({ success: false, message: 'Both song and thumbnail files are required.' });
      }

      const songFile = req.files.song[0];
      const thumbnailFile = req.files.thumbnail[0];

      // Create a promise to upload the song file
      const uploadSongPromise = new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
          { resource_type: 'video', folder: 'sonore/songs' },
          (error, result) => {
            if (error) return reject(error);
            resolve(result);
          }
        );
        uploadStream.end(songFile.buffer);
      });

      // Create a promise to upload the thumbnail file
      const uploadThumbnailPromise = new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
          { folder: 'sonore/thumbnails' },
          (error, result) => {
            if (error) return reject(error);
            resolve(result);
          }
        );
        uploadStream.end(thumbnailFile.buffer);
      });

      // Execute both uploads concurrently
      const [songResult, thumbnailResult] = await Promise.all([
        uploadSongPromise,
        uploadThumbnailPromise,
      ]);

      // Create and save the new song document to the database
      const newSong = new Song({
        title: req.body.title,
        artist: req.body.artist,
        album: req.body.album,
        genre: req.body.genre,
        duration: parseInt(req.body.duration),
        url: songResult.secure_url,
        thumbnail: thumbnailResult.secure_url,
        uploadedBy: req.user.id, // Correctly get user ID from auth middleware
      });

      const savedSong = await newSong.save();

      res.status(201).json({ success: true, message: 'Song uploaded successfully!', song: savedSong });

    } catch (error) {
      console.error('Upload route error:', error);
      res.status(500).json({ success: false, message: 'Server error during file upload.' });
    }
  }
);

module.exports = router;
