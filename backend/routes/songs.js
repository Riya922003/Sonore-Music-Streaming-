const express = require('express');
const Song = require('../models/Song');
const authMiddleware = require('../middleware/authMiddleware');
const upload = require('../middleware/multer');
const cloudinary = require('../config/cloudinaryConfig');

const router = express.Router();

// GET / route - Get all songs
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

// POST /upload route - Upload a new song (Protected route)
router.post('/upload', authMiddleware, upload.single('song'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "No file uploaded. Please select an audio file."
      });
    }

    const uploadStream = cloudinary.uploader.upload_stream(
      {
        resource_type: 'video', // Correct for audio
        folder: 'sonore/songs'
      },
      async (error, result) => {
        if (error) {
          console.error('Cloudinary upload error:', error);
          return res.status(500).json({
            success: false,
            message: "Failed to upload file to cloud storage."
          });
        }

        try {
          const newSong = new Song({
            title: req.body.title,
            artist: req.body.artist,
            album: req.body.album,
            genre: req.body.genre,
            duration: parseInt(req.body.duration),
            url: result.secure_url,
            thumbnail: '', // Leave empty or handle image upload separately
            // 2. CORRECTED: Get user ID from req.user.id
            uploadedBy: req.user.id 
          });

          const savedSong = await newSong.save();

          res.status(201).json({
            success: true,
            message: "Song uploaded successfully!",
            song: savedSong
          });

        } catch (dbError) {
          console.error('Database save error:', dbError);
          res.status(500).json({
            success: false,
            message: "Failed to save song to database."
          });
        }
      }
    );

    uploadStream.end(req.file.buffer);

  } catch (error) {
    console.error('Upload route error:', error);
    res.status(500).json({
      success: false,
      message: "Server error occurred during upload."
    });
  }
});

module.exports = router;