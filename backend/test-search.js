const mongoose = require('mongoose');
require('dotenv').config();

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/sonore')
  .then(async () => {
    console.log('Connected to MongoDB');
    
    // Import Song model
    const Song = require('./models/Song');
    
    // Count total songs
    const songCount = await Song.countDocuments();
    console.log('Total songs in database:', songCount);
    
    // Get first 5 songs to check data
    const songs = await Song.find().limit(5);
    console.log('Sample songs:');
    songs.forEach(song => {
      console.log(`- ${song.title} by ${song.artist} (${song.language})`);
    });
    
    // Test text search
    console.log('\nTesting text search for "w":');
    const searchResults = await Song.find({
      $text: { $search: 'w' }
    }).limit(5);
    
    console.log('Search results:', searchResults.length);
    searchResults.forEach(song => {
      console.log(`- ${song.title} by ${song.artist}`);
    });
    
    mongoose.connection.close();
  })
  .catch(err => {
    console.error('Database connection error:', err);
    process.exit(1);
  });