const mongoose = require('mongoose');
require('dotenv').config({ path: require('path').join(__dirname, '..', '.env') });

// Import the Song model
const Song = require('../models/Song');

const clearAllSongs = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    // Delete all songs
    const result = await Song.deleteMany({});
    console.log(`🗑️  Deleted ${result.deletedCount} songs from the database`);

    console.log('✅ Database cleared successfully!');
    console.log('💡 You can now run the seed-direct.js script to upload songs with working thumbnails');
  } catch (error) {
    console.error('❌ Error clearing database:', error);
  } finally {
    // Close the connection
    await mongoose.connection.close();
    console.log('📚 Database connection closed');
  }
};

clearAllSongs();