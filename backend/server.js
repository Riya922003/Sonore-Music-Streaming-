const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
require('dotenv').config();

const app = express();

// --- START: SECURE CORS CONFIGURATION ---
const allowedOrigins = [
  'http://localhost:5173', // Local development (Vite)
  'http://localhost:3000', // Local development (alternative)
  'https://sonore-music-streaming-one.vercel.app', // Your Vercel frontend
];

app.use(cors({
  origin: function(origin, callback){
    console.log(`🔍 CORS request from origin: ${origin}`);
    
    // Allow requests with no origin (mobile apps, Postman, server-to-server)
    if(!origin) {
      console.log(`✅ CORS allowed: No origin specified`);
      return callback(null, true);
    }
    
    // Check if origin is in allowed list
    if(allowedOrigins.includes(origin)){
      console.log(`✅ CORS allowed: ${origin}`);
      return callback(null, true);
    }
    
    // Block unauthorized origins
    console.log(`❌ CORS blocked: ${origin}`);
    console.log(`✅ Allowed origins:`, allowedOrigins);
    const msg = `CORS policy does not allow access from origin: ${origin}`;
    return callback(new Error(msg), false);
  },
  credentials: true, // Allow cookies and authorization headers
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'], // Allowed HTTP methods
  allowedHeaders: ['Content-Type', 'Authorization'] // Allowed headers
}));
// --- END: SECURE CORS CONFIGURATION ---

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