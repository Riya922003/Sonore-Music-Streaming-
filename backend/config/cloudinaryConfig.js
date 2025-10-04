const cloudinary = require('cloudinary').v2;
require('dotenv').config();

// --- ADD THIS DEBUGGING BLOCK ---
console.log('--- Verifying Cloudinary Environment Variables ---');
console.log('Cloudinary Cloud Name:', process.env.CLOUDINARY_CLOUD_NAME);
console.log('Cloudinary API Key:', process.env.CLOUDINARY_API_KEY);
console.log('Cloudinary API Secret is present:', !!process.env.CLOUDINARY_API_SECRET);
console.log('------------------------------------------------');
// --- END DEBUGGING BLOCK ---

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
});

module.exports = cloudinary;