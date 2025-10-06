require('dotenv').config();
const mongoose = require('mongoose');
const Song = require('../models/Song');

const cleanupOldSongs = async () => {
  try {
    // Connect to the database using your .env file
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ MongoDB connected for cleanup.');

    // Define a filter to find all songs with "pixabay.com" in their URL
    const filter = { url: /pixabay.com/ };

    // Find how many documents match before deleting
    const count = await Song.countDocuments(filter);

    if (count === 0) {
      console.log('👍 No songs with old Pixabay links were found. Your database is clean!');
    } else {
      console.log(`🔎 Found ${count} songs with old Pixabay links. Deleting now...`);
      
      // Delete all documents that match the filter
      const deleteResult = await Song.deleteMany(filter);
      
      console.log(`🗑️ Successfully deleted ${deleteResult.deletedCount} songs.`);
    }

  } catch (error) {
    console.error('❌ An error occurred during the cleanup process:', error);
  } finally {
    // Always disconnect from the database
    await mongoose.disconnect();
    console.log('🔌 MongoDB disconnected.');
  }
};

// Run the cleanup function
cleanupOldSongs();