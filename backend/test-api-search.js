const http = require('http');

function testAPI(query) {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: '127.0.0.1',
      port: 5000,
      path: `/api/songs/search?q=${encodeURIComponent(query)}`,
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    };

    const req = http.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => {
        data += chunk;
      });
      res.on('end', () => {
        console.log(`\n=== Testing search for "${query}" ===`);
        console.log('Status:', res.statusCode);
        try {
          const result = JSON.parse(data);
          console.log('Success:', result.success);
          console.log('Count:', result.count);
          if (result.songs && result.songs.length > 0) {
            console.log('First few results:');
            result.songs.slice(0, 3).forEach((song, index) => {
              console.log(`  ${index + 1}. ${song.title} by ${song.artist} (${song.genre})`);
            });
          } else {
            console.log('No songs found');
          }
        } catch (e) {
          console.log('Raw response:', data);
        }
        resolve();
      });
    });

    req.on('error', (e) => {
      console.error('Request error:', e.message);
      reject(e);
    });

    req.end();
  });
}

async function runTests() {
  try {
    await testAPI('w');
    await testAPI('wavy');
    await testAPI('english');
    await testAPI('pop');
    console.log('\n✅ All tests completed!');
  } catch (error) {
    console.error('Test failed:', error);
  }
}

runTests();