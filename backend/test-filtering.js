// Test script to verify the filtering functionality
const express = require('express');
const Song = require('./models/Song');

async function testSongFiltering() {
  console.log('Testing song filtering functionality...');
  
  try {
    // Test 1: No filters (should return all songs)
    console.log('\n1. Testing with no filters:');
    const allSongs = await Song.find({}).sort({ createdAt: -1 });
    console.log(`Found ${allSongs.length} songs total`);
    
    // Test 2: Filter by language
    console.log('\n2. Testing language filter:');
    const englishSongs = await Song.find({ language: 'English' }).sort({ createdAt: -1 });
    console.log(`Found ${englishSongs.length} English songs`);
    
    // Test 3: Filter by genre
    console.log('\n3. Testing genre filter:');
    const popSongs = await Song.find({ genre: 'Pop' }).sort({ createdAt: -1 });
    console.log(`Found ${popSongs.length} Pop songs`);
    
    // Test 4: Combined filters
    console.log('\n4. Testing combined filters:');
    const englishPopSongs = await Song.find({ language: 'English', genre: 'Pop' }).sort({ createdAt: -1 });
    console.log(`Found ${englishPopSongs.length} English Pop songs`);
    
    // Show available languages and genres for reference
    const languages = await Song.distinct('language');
    const genres = await Song.distinct('genre');
    console.log('\nAvailable languages:', languages);
    console.log('Available genres:', genres);
    
    // Show some sample songs with details
    if (allSongs.length > 0) {
      console.log('\nSample songs:');
      allSongs.slice(0, 5).forEach((song, index) => {
        console.log(`${index + 1}. "${song.title}" by ${song.artist} (${song.language}, ${song.genre})`);
      });
    }
    
  } catch (error) {
    console.error('Test error:', error);
  }
}

module.exports = testSongFiltering;