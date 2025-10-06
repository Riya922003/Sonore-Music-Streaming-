const axios = require('axios');

const baseURL = 'http://localhost:5000';

const getAuthToken = async () => {
  try {
    console.log('🔐 Getting fresh auth token...\n');
    
    // First, try to register a new user
    const registerData = {
      name: 'Test User',
      email: 'testuser@example.com',
      password: 'password123'
    };
    
    console.log('📝 Trying to register user...');
    try {
      const registerResponse = await axios.post(`${baseURL}/api/auth/register`, registerData);
      console.log('✅ User registered successfully!');
    } catch (registerError) {
      if (registerError.response && registerError.response.data && registerError.response.data.message.includes('User already exists')) {
        console.log('⚠️  User already exists, proceeding to login...');
      } else {
        console.error('❌ Registration failed:', registerError.response?.data || registerError.message);
      }
    }
    
    // Now try to login
    const loginData = {
      email: 'testuser@example.com',
      password: 'password123'
    };
    
    console.log('🔑 Attempting login...');
    const loginResponse = await axios.post(`${baseURL}/api/auth/login`, loginData);
    
    if (loginResponse.data && loginResponse.data.token) {
      console.log('✅ Login successful!');
      console.log('🎫 Your JWT Token:');
      console.log(loginResponse.data.token);
      console.log('\n📋 Copy this token and paste it into your seed-direct.js file as AUTH_TOKEN');
      return loginResponse.data.token;
    } else {
      console.error('❌ No token received in login response');
    }
    
  } catch (error) {
    console.error('❌ Error getting auth token:');
    if (error.response) {
      console.error('Status:', error.response.status);
      console.error('Data:', error.response.data);
    } else {
      console.error('Error:', error.message);
    }
  }
};

getAuthToken();