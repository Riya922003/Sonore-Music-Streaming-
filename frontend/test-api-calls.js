// Test API calls
import apiClient from './src/api.js';

async function testAPICalls() {
  try {
    console.log('Testing API calls...');
    
    // Test 1: Featured songs
    console.log('1. Testing featured songs...');
    const featuredResponse = await apiClient.get('/api/songs/featured');
    console.log('Featured songs:', featuredResponse.data.success, featuredResponse.data.count);
    
    // Test 2: All songs
    console.log('2. Testing all songs...');
    const allSongsResponse = await apiClient.get('/api/songs');
    console.log('All songs:', allSongsResponse.data.success, allSongsResponse.data.count);
    
    // Test 3: English songs
    console.log('3. Testing English songs...');
    const englishSongsResponse = await apiClient.get('/api/songs?language=english');
    console.log('English songs:', englishSongsResponse.data.success, englishSongsResponse.data.count);
    
    // Test 4: Punjabi songs
    console.log('4. Testing Punjabi songs...');
    const punjabiSongsResponse = await apiClient.get('/api/songs?language=punjabi');
    console.log('Punjabi songs:', punjabiSongsResponse.data.success, punjabiSongsResponse.data.count);
    
    console.log('All tests completed successfully!');
  } catch (error) {
    console.error('Test failed:', error.message);
    console.error('Error details:', error);
  }
}

testAPICalls();