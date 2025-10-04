const express = require('express');
const Song = require('../models/Song');
const authMiddleware = require('../middleware/authMiddleware');
const { upload } = require('../middleware/multer');
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
router.post('/upload', authMiddleware, upload, async (req, res) => {
  try {
    // Check if both song and thumbnail files were uploaded
    if (!req.files || !req.files.song || !req.files.thumbnail) {
      return res.status(400).json({
        success: false,
        message: "Both song and thumbnail files are required."
      });
    }

    const songFile = req.files.song[0];
    const thumbnailFile = req.files.thumbnail[0];

    try {
      // Create promises for both Cloudinary uploads
      const songUploadPromise = new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
          {
            resource_type: 'video', // For audio files
            folder: 'sonore/songs'
          },
          (error, result) => {
            if (error) {
              reject(error);
            } else {
              resolve(result);
            }
          }
        );
        uploadStream.end(songFile.buffer);
      });

      const thumbnailUploadPromise = new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
          {
            folder: 'sonore/thumbnails'
          },
          (error, result) => {
            if (error) {
              reject(error);
            } else {
              resolve(result);
            }
          }
        );
        uploadStream.end(thumbnailFile.buffer);
      });

      // Execute both uploads concurrently
      const [songResult, thumbnailResult] = await Promise.all([
        songUploadPromise,
        thumbnailUploadPromise
      ]);

      // Destructure secure_url from each result
      const { secure_url: songUrl } = songResult;
      const { secure_url: thumbnailUrl } = thumbnailResult;

      try {
        // Create new Song instance with both URLs
        const newSong = new Song({
          title: req.body.title,
          artist: req.body.artist,
          album: req.body.album,
          genre: req.body.genre,
          duration: parseInt(req.body.duration),
          url: songUrl,
          thumbnail: thumbnailUrl,
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

    } catch (uploadError) {
      console.error('Cloudinary upload error:', uploadError);
      res.status(500).json({
        success: false,
        message: "Failed to upload files to cloud storage."
      });
    }

  } catch (error) {
    console.error('Upload route error:', error);
    res.status(500).json({
      success: false,
      message: "Server error occurred during upload."
    });
  }
});

module.exports = router;