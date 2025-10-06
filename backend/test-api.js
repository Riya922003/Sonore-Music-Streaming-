// Test API endpoints
const http = require('http');

function testAPI(path) {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: '127.0.0.1',
      port: 5000,
      path: path,
      method: 'GET'
    };

    const req = http.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => {
        data += chunk;
      });
      res.on('end', () => {
        try {
          const response = JSON.parse(data);
          resolve(response);
        } catch (error) {
          resolve(data);
        }
      });
    });

    req.on('error', (error) => {
      reject(error);
    });

    req.end();
  });
}

async function runTests() {
  try {
    console.log('🧪 Testing API endpoints...\n');

    // Test basic server response first
    console.log('0. Testing basic server response:');
    const testResponse = await testAPI('/api/songs/test-config');
    console.log(`   Test response:`, testResponse);

    // Test 1: All songs
    console.log('\n1. Testing /api/songs (all songs):');
    const allSongs = await testAPI('/api/songs');
    console.log(`   Response type:`, typeof allSongs);
    console.log(`   Is array:`, Array.isArray(allSongs));
    
    if (allSongs && allSongs.songs) {
      console.log(`   Found ${allSongs.songs.length} songs`);
      if (allSongs.songs.length > 0) {
        console.log(`   Sample: "${allSongs.songs[0].title}" by ${allSongs.songs[0].artist}`);
      }
    } else if (Array.isArray(allSongs)) {
      console.log(`   Found ${allSongs.length} songs (direct array)`);
    } else {
      console.log(`   Response:`, allSongs);
    }

    // Test 2: Filter by language
    console.log('\n2. Testing /api/songs?language=English:');
    const englishSongs = await testAPI('/api/songs?language=English');
    console.log(`   Found ${Array.isArray(englishSongs) ? englishSongs.length : 'non-array'} English songs`);

    // Test 3: Filter by genre
    console.log('\n3. Testing /api/songs?genre=Pop:');
    const popSongs = await testAPI('/api/songs?genre=Pop');
    console.log(`   Found ${Array.isArray(popSongs) ? popSongs.length : 'non-array'} Pop songs`);

    // Test 4: Combined filters
    console.log('\n4. Testing /api/songs?language=English&genre=Pop:');
    const englishPopSongs = await testAPI('/api/songs?language=English&genre=Pop');
    console.log(`   Found ${Array.isArray(englishPopSongs) ? englishPopSongs.length : 'non-array'} English Pop songs`);

    console.log('\n✅ API tests completed!');

  } catch (error) {
    console.error('❌ Test error:', error.message);
  }
}

runTests();