const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
require('dotenv').config();

const app = express();

// --- START: DEBUG CORS CONFIGURATION ---
// Temporary configuration to debug and allow all origins
app.use(cors({
  origin: function(origin, callback){
    console.log(`🔍 CORS DEBUG - Request from origin: "${origin}"`);
    console.log(`🔍 CORS DEBUG - Origin type: ${typeof origin}`);
    console.log(`🔍 CORS DEBUG - Origin length: ${origin ? origin.length : 'null'}`);
    
    // For debugging: Log the exact origin and allow everything temporarily
    if(origin) {
      console.log(`🔍 CORS DEBUG - Origin bytes: ${JSON.stringify([...origin].map(c => c.charCodeAt(0)))}`);
    }
    
    // TEMPORARILY ALLOW ALL ORIGINS for debugging
    console.log(`✅ CORS DEBUG - Allowing all origins temporarily`);
    return callback(null, true);
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
}));

// Expected origins for reference:
console.log('📋 Expected origins:');
console.log('  - http://localhost:5173');
console.log('  - https://sonore-music-streaming-one.vercel.app');
// --- END: DEBUG CORS CONFIGURATION ---

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