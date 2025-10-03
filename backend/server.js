const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
require('dotenv').config();

const app = express();

// --- START: UPDATED CORS CONFIGURATION ---
// This list defines which frontend URLs are allowed to make requests to your API.
const allowedOrigins = [
  'http://localhost:5173', // Your local frontend for development
  'https://your-sonore-frontend.vercel.app' // IMPORTANT: REPLACE WITH YOUR VERCEL URL
];

app.use(cors({
  origin: function(origin, callback){
    // Allow requests with no origin (like Postman or server-to-server requests)
    if(!origin) return callback(null, true);

    if(allowedOrigins.indexOf(origin) === -1){
      const msg = 'The CORS policy for this site does not allow access from the specified Origin.';
      return callback(new Error(msg), false);
    }
    return callback(null, true);
  }
}));
// --- END: UPDATED CORS CONFIGURATION ---

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