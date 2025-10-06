const express = require('express');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

// Simple test endpoint
app.get('/test', (req, res) => {
  res.json({ message: 'Backend is working!', timestamp: new Date().toISOString() });
});

// Test songs endpoint
app.get('/api/songs/test', (req, res) => {
  res.json({ 
    success: true, 
    message: 'Songs endpoint is working!',
    sampleSong: {
      title: 'Test Song',
      artist: 'Test Artist',
      thumbnail: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=800&h=600&fit=crop'
    }
  });
});

const PORT = 5000;
app.listen(PORT, () => {
  console.log(`🚀 Test server running on port ${PORT}`);
  console.log(`Test URL: http://localhost:${PORT}/test`);
  console.log(`Songs test URL: http://localhost:${PORT}/api/songs/test`);
});