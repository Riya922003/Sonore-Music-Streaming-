const mongoose = require('mongoose');
require('dotenv').config();

async function checkDatabase() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/sonore');
    console.log('Connected to MongoDB');
    
    // Import Song model
    const Song = require('./models/Song');
    
    // Count total songs
    const songCount = await Song.countDocuments();
    console.log('Total songs in database:', songCount);
    
    if (songCount > 0) {
      // Get first 5 songs to check data
      const songs = await Song.find().limit(5);
      console.log('\nSample songs:');
      songs.forEach(song => {
        console.log(`- ${song.title} by ${song.artist} (${song.language}, ${song.genre})`);
      });
      
      // Test search without text index
      console.log('\nTesting regex search for "w":');
      const searchResults = await Song.find({
        $or: [
          { title: { $regex: 'w', $options: 'i' } },
          { artist: { $regex: 'w', $options: 'i' } },
          { genre: { $regex: 'w', $options: 'i' } },
          { language: { $regex: 'w', $options: 'i' } }
        ]
      }).limit(5);
      
      console.log('Regex search results:', searchResults.length);
      searchResults.forEach(song => {
        console.log(`- ${song.title} by ${song.artist}`);
      });
    } else {
      console.log('No songs found in database. You may need to seed some data.');
    }
    
  } catch (err) {
    console.error('Database error:', err);
  } finally {
    mongoose.connection.close();
  }
}

checkDatabase();