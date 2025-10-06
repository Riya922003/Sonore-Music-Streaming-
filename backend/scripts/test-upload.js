const axios = require('axios');
const FormData = require('form-data');
const fs = require('fs');
const path = require('path');

const API_URL = 'http://localhost:5000/api/songs/upload';
const AUTH_TOKEN = 'PASTE_A_FRESH_JWT_TOKEN_HERE';

// Test FormData construction
const testFormData = () => {
  console.log('🧪 Testing FormData construction...\n');
  
  const form = new FormData();
  
  // Add test data
  form.append('title', 'Test Song');
  form.append('artist', 'Test Artist');
  form.append('duration', '180');
  form.append('language', 'english');
  form.append('genre', 'Pop');
  form.append('featured', 'false');
  
  console.log('FormData entries:');
  for (const [key, value] of form.entries()) {
    console.log(`  ${key}: "${value}"`);
  }
  
  console.log('\nFormData headers:');
  console.log(form.getHeaders());
  
  return form;
};

const testUpload = async () => {
  try {
    const form = testFormData();
    
    // Add dummy files (using a small text file instead of actual audio)
    const dummyContent = 'dummy content';
    form.append('song', Buffer.from(dummyContent), 'test.mp3');
    form.append('thumbnail', Buffer.from(dummyContent), 'test.jpg');
    
    console.log('\n🚀 Attempting upload...');
    
    const response = await axios.post(API_URL, form, {
      headers: {
        ...form.getHeaders(),
        'x-auth-token': AUTH_TOKEN,
        'Accept': 'application/json'
      },
      timeout: 30000
    });
    
    console.log('✅ Upload successful!');
    console.log('Response:', response.data);
    
  } catch (error) {
    console.error('❌ Upload failed:');
    if (error.response) {
      console.error('Status:', error.response.status);
      console.error('Data:', error.response.data);
    } else {
      console.error('Error:', error.message);
    }
  }
};

// Run the test
testUpload();