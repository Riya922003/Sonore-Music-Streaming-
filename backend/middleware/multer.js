const multer = require('multer');

// Configure multer to use memory storage so we can upload to Cloudinary
const storage = multer.memoryStorage();

// Create the main multer instance with the storage configuration
const upload = multer({
  storage: storage,
  limits: {
    fileSize: 15 * 1024 * 1024 // 15MB file size limit
  }
});

// Export the configured multer instance directly
module.exports = upload;