const express = require('express');
const Song = require('../models/Song');
const authMiddleware = require('../middleware/authMiddleware');
const upload = require('../middleware/multer.js');
const { GoogleGenerativeAI } = require('@google/generative-ai');
const { google } = require('googleapis');

const router = express.Router();

// GET all songs with optional filtering
router.get('/', async (req, res) => {
  try {
    const { language, genre } = req.query;
    const filter = {};
    if (language) filter.language = new RegExp(language, 'i');
    if (genre) filter.genre = new RegExp(genre, 'i');

    const songs = await Song.find(filter).populate('uploadedBy', 'name').sort({ createdAt: -1 });
    res.status(200).json({ success: true, count: songs.length, songs });
  } catch (error) {
    console.error('Get songs error:', error);
    res.status(500).json({ success: false, message: "Server error occurred while fetching songs." });
  }
});

// GET featured songs
router.get('/featured', async (req, res) => {
  try {
    const featuredSongs = await Song.find({ featured: true }).limit(10).populate('uploadedBy', 'name');
    res.status(200).json({ success: true, songs: featuredSongs });
  } catch (error) {
    console.error('Get featured songs error:', error);
    res.status(500).json({ success: false, message: "Error fetching featured songs." });
  }
});

// GET search for songs
router.get('/search', async (req, res) => {
  try {
    const { q } = req.query;
    if (!q) return res.json([]);
    
    const songs = await Song.find({ $text: { $search: q } }).limit(10);
    res.json(songs);
  } catch (error) {
    console.error('Search error:', error);
    res.status(500).json({ message: 'Error during search' });
  }
});

// GET generate a focus queue
router.get('/queue/generate', async (req, res) => {
    try {
        const { duration } = req.query;
        if (!duration || isNaN(parseInt(duration))) {
            return res.status(400).json({ message: "A valid 'duration' in minutes is required." });
        }
        const durationInSeconds = parseInt(duration) * 60;
        
        const randomSongs = await Song.aggregate([{ $sample: { size: 50 } }]);

        let currentDuration = 0;
        const queue = [];
        for (const song of randomSongs) {
            if (currentDuration < durationInSeconds) {
                queue.push(song);
                currentDuration += song.duration;
            } else {
                break;
            }
        }
        res.json(queue);
    } catch (error) {
        console.error('Queue generation error:', error);
        res.status(500).json({ message: "Error generating queue." });
    }
});


// POST a new song with a thumbnail
router.post(
  '/upload',
  authMiddleware,
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

      const newSong = new Song({
        title: req.body.title,
        artist: req.body.artist,
        duration: parseInt(req.body.duration),
        genre: req.body.genre,
        language: req.body.language,
        featured: req.body.featured === 'true',
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


// GET video ID for a song
router.get('/:id/video', authMiddleware, async (req, res) => {
  try {
    const song = await Song.findById(req.params.id);
    if (!song) {
      return res.status(404).json({ message: 'Song not found' });
    }

    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    // Use the correct model name for the current API
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

    const prompt = `Generate the best possible YouTube search query to find the official music video for the song "${song.title}" by the artist "${song.artist}". Return only the search query text, nothing else.`;
    
    let searchQuery;
    try {
      // Use the simple generateContent method without API version specification
      const result = await model.generateContent(prompt);
      const response = await result.response;
      searchQuery = response.text().trim();

    } catch(e) {
        console.error("Gemini API failed, using fallback search query.", e);
        searchQuery = `${song.title} ${song.artist} official video`;
    }

    const youtube = google.youtube({
      version: 'v3',
      auth: process.env.YOUTUBE_API_KEY,
    });

    const searchResponse = await youtube.search.list({
      part: 'snippet',
      q: searchQuery,
      maxResults: 1,
      type: 'video',
    });

    if (!searchResponse.data.items || searchResponse.data.items.length === 0) {
      return res.status(404).json({ message: 'No video found on YouTube.' });
    }

    const videoId = searchResponse.data.items[0].id.videoId;
    res.json({ videoId });

  } catch (error) {
    console.error('Error in /video route:', error);
    res.status(500).json({ message: 'Server error while finding video.' });
  }
});


module.exports = router;

