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

// GET search songs by text
router.get('/search', async (req, res) => {
  try {
    // Get search term from query parameters
    const { q } = req.query;
    
    // If no search term provided, return empty array
    if (!q || q.trim() === '') {
      return res.status(200).json({
        success: true,
        count: 0,
        songs: []
      });
    }
    
    // Try text search first, fallback to regex search if text index doesn't exist
    let songs;
    try {
      // Perform text search using the text index
      songs = await Song.find({
        $text: { $search: q }
      })
      .limit(10)
      .populate('uploadedBy', 'name email')
      .sort({ score: { $meta: 'textScore' } }); // Sort by relevance score
    } catch (textSearchError) {
      console.log('Text search failed, using regex fallback:', textSearchError.message);
      // Fallback to regex search if text index doesn't exist
      songs = await Song.find({
        $or: [
          { title: { $regex: q, $options: 'i' } },
          { artist: { $regex: q, $options: 'i' } },
          { genre: { $regex: q, $options: 'i' } },
          { language: { $regex: q, $options: 'i' } }
        ]
      })
      .limit(10)
      .populate('uploadedBy', 'name email')
      .sort({ createdAt: -1 });
    }
    
    res.status(200).json({
      success: true,
      count: songs.length,
      songs: songs,
      searchTerm: q
    });
  } catch (error) {
    console.error('Search songs error:', error);
    res.status(500).json({
      success: false,
      message: "Server error occurred while searching songs."
    });
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

// GET generate queue with specified duration
router.get('/queue/generate', async (req, res) => {
  try {
    // Get duration from query parameters
    const { duration } = req.query;
    
    // Validate duration parameter
    if (!duration) {
      return res.status(400).json({
        success: false,
        message: "Duration parameter is required."
      });
    }
    
    const durationMinutes = parseFloat(duration);
    
    // Check if duration is a valid number
    if (isNaN(durationMinutes) || durationMinutes <= 0) {
      return res.status(400).json({
        success: false,
        message: "Duration must be a valid positive number in minutes."
      });
    }
    
    // Convert duration from minutes to seconds
    const requestedDurationSeconds = durationMinutes * 60;
    
    // Use MongoDB aggregation pipeline to get a random sample of songs
    const sampledSongs = await Song.aggregate([
      { $sample: { size: 50 } }
    ]);
    
    // Build the queue by adding songs until we reach the requested duration
    const queue = [];
    let totalDuration = 0;
    
    for (const song of sampledSongs) {
      // Add song to queue
      queue.push(song);
      totalDuration += song.duration;
      
      // Stop if we've reached or exceeded the requested duration
      if (totalDuration >= requestedDurationSeconds) {
        break;
      }
    }
    
    res.status(200).json({
      success: true,
      requestedDurationMinutes: durationMinutes,
      requestedDurationSeconds: requestedDurationSeconds,
      actualDurationSeconds: totalDuration,
      actualDurationMinutes: Math.round((totalDuration / 60) * 100) / 100,
      count: queue.length,
      queue: queue
    });
    
  } catch (error) {
    console.error('Generate queue error:', error);
    res.status(500).json({
      success: false,
      message: "Server error occurred while generating queue."
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