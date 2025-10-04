const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
require('dotenv').config();

const app = express();

// --- SIMPLE CORS CONFIGURATION (ALLOW ALL) ---
app.use(cors());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Import routes
const authRouter = require('./routes/auth');
const songsRouter = require('./routes/songs');
const playlistsRouter = require('./routes/playlists');

// Use routes
app.use('/api/auth', authRouter);
// --- THIS LINE WAS INCOMPLETE ---
app.use('/api/songs', songsRouter); // FIXED
// ---------------------------------
app.use('/api/playlists', playlistsRouter);

// Basic route
app.get('/', (req, res) => {
  res.json({ message: 'Sonore Music Streaming API is running!' });
});

const PORT = process.env.PORT || 5000;

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI)
  .then(() => {
    console.log('✅ Connected to MongoDB successfully!');
    app.listen(PORT, () => {
      console.log(`🚀 Server is running on port ${PORT}`);
    });
  })
  .catch((error) => {
    console.error('❌ MongoDB connection error:', error);
    process.exit(1);
  });