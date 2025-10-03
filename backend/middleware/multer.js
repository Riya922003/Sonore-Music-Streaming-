const multer = require('multer');

// Configure multer to use memory storage
const storage = multer.memoryStorage();

// Create multer instance with memory storage configuration
const upload = multer({
  storage: storage,
  limits: {
    fileSize: 10 * 1024 * 1024 // 10MB file size limit
  },
  fileFilter: (req, file, cb) => {
    // Accept audio files and images
    if (file.mimetype.startsWith('audio/') || file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only audio and image files are allowed!'), false);
    }
  }
});

// CORRECTED LINE: Export the middleware directly
module.exports = upload;