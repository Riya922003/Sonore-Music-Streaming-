// Test runner for song filtering
require('dotenv').config();
const mongoose = require('mongoose');
const testFiltering = require('./test-filtering');

async function runTests() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB for testing');
    
    // Run the filtering tests
    await testFiltering();
    
    // Close the connection
    await mongoose.connection.close();
    console.log('\n✅ Tests completed');
    
  } catch (error) {
    console.error('❌ Test failed:', error);
    process.exit(1);
  }
}

runTests();