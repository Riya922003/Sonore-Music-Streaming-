const express = require('express');
const Song = require('../models/Song');
const User = require('../models/User');
const authMiddleware = require('../middleware/authMiddleware');
const upload = require('../middleware/multer.js'); // Import the instance directly
const cloudinary = require('../config/cloudinaryConfig');

const router = express.Router();

// GET all songs with optional filtering by language and genre
router.get('/', async (req, res) => {
  try {
    // Extract query parameters
    const { language, genre } = req.query;
    
    // Build filter object
    const filter = {};
    
    // Add language filter if provided
    if (language) {
      filter.language = language;
    }
    
    // Add genre filter if provided
    if (genre) {
      filter.genre = genre;
    }
    
    // Fetch songs with the filter (empty filter returns all songs)
    const songs = await Song.find(filter).populate('uploadedBy', 'name email').sort({ createdAt: -1 });
    
    res.status(200).json({ 
      success: true, 
      count: songs.length, 
      songs: songs,
      filters: { language, genre } // Optional: include applied filters in response
    });
  } catch (error) {
    console.error('Get songs error:', error);
    res.status(500).json({ success: false, message: "Server error occurred while fetching songs." });
  }
});

// Test route to check Cloudinary configuration
router.get('/test-config', (req, res) => {
  try {
    const config = cloudinary.config();
    res.json({
      success: true,
      message: 'Cloudinary configuration test',
      hasCloudName: !!config.cloud_name,
      hasApiKey: !!config.api_key,
      hasApiSecret: !!config.api_secret,
      cloudName: config.cloud_name // Safe to show cloud name
    });
  } catch (error) {
    console.error('Config test error:', error);
    res.status(500).json({
      success: false,
      message: 'Cloudinary configuration error',
      error: error.message
    });
  }
});

// GET featured songs
router.get('/featured', async (req, res) => {
  try {
    const featuredSongs = await Song.find({ featured: true })
      .limit(10)
      .populate('uploadedBy', 'name')
      .sort({ createdAt: -1 });
      
    res.status(200).json({
      success: true,
      count: featuredSongs.length,
      songs: featuredSongs
    });
  } catch (error) {
    console.error('Get featured songs error:', error);
    res.status(500).json({
      success: false,
      message: "Server error occurred while fetching featured songs."
    });
  }
});

// POST a new song with a thumbnail
router.post(
  '/upload',
  authMiddleware,
  // Use the imported multer instance and specify the fields for this route
  upload.fields([
    { name: 'song', maxCount: 1 },
    { name: 'thumbnail', maxCount: 1 },
  ]),
  async (req, res) => {
    try {
      if (!req.files || !req.files.song || !req.files.thumbnail) {
        return res.status(400).json({ success: false, message: 'Both song and thumbnail files are required.' });
      }

      const songFile = req.files.song[0];
      const thumbnailFile = req.files.thumbnail[0];

      const uploadSongPromise = new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream({ resource_type: 'video', folder: 'sonore/songs' }, (error, result) => {
          if (error) return reject(error);
          resolve(result);
        });
        stream.end(songFile.buffer);
      });

      const uploadThumbnailPromise = new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream({ folder: 'sonore/thumbnails' }, (error, result) => {
          if (error) return reject(error);
          resolve(result);
        });
        stream.end(thumbnailFile.buffer);
      });

      const [songResult, thumbnailResult] = await Promise.all([uploadSongPromise, uploadThumbnailPromise]);

      // Debug: Log received form data
      console.log('Upload route - received req.body:', req.body);
      console.log('Upload route - req.body.genre:', req.body.genre);
      console.log('Upload route - req.body.language:', req.body.language);

      const newSong = new Song({
        title: req.body.title,
        artist: req.body.artist,
        album: req.body.album || 'Unknown Album',
        duration: parseInt(req.body.duration),
        genre: req.body.genre || 'Unknown',
        language: req.body.language || 'Unknown',
        featured: req.body.featured === 'true' || req.body.featured === true,
        url: songResult.secure_url,
        thumbnail: thumbnailResult.secure_url,
        uploadedBy: req.user.id,
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