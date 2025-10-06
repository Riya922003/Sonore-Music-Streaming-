const axios = require('axios');

// --- CONFIGURATION ---
const API_BASE_URL = 'https://backend-deployment-u389.onrender.com/api';

// Test credentials - you should replace these with actual user credentials
const testUser = {
  email: 'riya1@gmail.com',
  password: 'password123' // Try common passwords
};

const getAuthToken = async () => {
  try {
    console.log('🔐 Attempting to get auth token...');
    
    // Try to login with test credentials
    const response = await axios.post(`${API_BASE_URL}/auth/login`, testUser);
    
    if (response.data.success && response.data.token) {
      console.log('✅ Successfully obtained auth token!');
      console.log('📋 Copy this token to your seed-direct.js file:');
      console.log('');
      console.log(`AUTH_TOKEN = '${response.data.token}';`);
      console.log('');
      return response.data.token;
    } else {
      console.log('❌ Login failed:', response.data.message);
    }
  } catch (error) {
    console.log('❌ Error getting token:');
    if (error.response) {
      console.log(`Status: ${error.response.status}`);
      console.log('Data:', error.response.data);
    } else {
      console.log('Error:', error.message);
    }
    
    console.log('\n📝 To fix this:');
    console.log('1. Make sure your backend server is running');
    console.log('2. Update the testUser credentials above with valid user credentials');
    console.log('3. Or manually login to your app and get the token from browser DevTools');
  }
};

// Alternative: Create a test user first, then login
const createTestUser = async () => {
  try {
    console.log('👤 Attempting to create test user...');
    
    const newUser = {
      name: 'Seed Script User',
      email: 'seeduser@example.com',
      password: 'seedpassword123'
    };
    
    const response = await axios.post(`${API_BASE_URL}/auth/register`, newUser);
    
    if (response.data.success) {
      console.log('✅ Test user created successfully!');
      return { email: newUser.email, password: newUser.password };
    }
  } catch (error) {
    console.log('⚠️  Test user might already exist or registration failed');
    return testUser; // Try with existing credentials
  }
};

const main = async () => {
  console.log('🎵 Sonore Music Streaming - Auth Token Generator\n');
  
  // First try to create a test user, then get token
  const credentials = await createTestUser();
  
  // Update testUser with new credentials if created
  if (credentials) {
    testUser.email = credentials.email;
    testUser.password = credentials.password;
  }
  
  // Get the auth token
  await getAuthToken();
};

main();