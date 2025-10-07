// Direct test of API from frontend context
import apiClient from './src/api.js';

async function testSearch() {
  try {
    console.log('Testing search API...');
    const response = await apiClient.get('/api/songs/search?q=w');
    console.log('Response:', response.data);
    
    if (response.data.songs && response.data.songs.length > 0) {
      console.log('First few songs:');
      response.data.songs.slice(0, 3).forEach((song, index) => {
        console.log(`${index + 1}. ${song.title} by ${song.artist}`);
      });
    }
  } catch (error) {
    console.error('Error:', error.message);
    if (error.response) {
      console.error('Response status:', error.response.status);
      console.error('Response data:', error.response.data);
    }
  }
}

testSearch();