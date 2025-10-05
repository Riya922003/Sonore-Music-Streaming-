const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { OAuth2Client } = require('google-auth-library');
const User = require('../models/User'); // Ensure this path is correct
const authMiddleware = require('../middleware/authMiddleware'); // Ensure this path is correct

// Initialize Google OAuth2 client
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

router.post('/register', async (req, res) => {
    try {
        const { name, email, password } = req.body;

        // Check if user already exists
        let user = await User.findOne({ email });
        if (user) {
            return res.status(400).json({ message: 'User already exists.' });
        }

        // Create new user instance (password will be hashed by the pre-save hook in the model)
        user = new User({
            name,
            email,
            password,
        });

        await user.save();

        // Create and sign the JWT token
        const payload = {
            id: user._id,
            name: user.name,
            email: user.email
        };

        jwt.sign(
            payload,
            process.env.JWT_SECRET,
            { expiresIn: '5h' },
            (err, token) => {
                if (err) throw err;
                res.status(201).json({ token });
            }
        );

    } catch (error) {
        console.error('Registration error:', error.message);
        res.status(500).send('Server error.');
    }
});





// POST /api/auth/login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Invalid credentials." });
    }

    // You need to ensure your User model has a method to compare passwords
    // For now, let's use bcrypt.compare directly
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials." });
    }

    const payload = {
        id: user._id,
        name: user.name,
        email: user.email
    };

    jwt.sign(
        payload,
        process.env.JWT_SECRET,
        { expiresIn: '5h' },
        (err, token) => {
            if (err) throw err;
            res.status(200).json({
                token,
                user: {
                    id: user._id,
                    name: user.name,
                    email: user.email
                }
            });
        }
    );

  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: "Server error occurred during login." });
  }
});

// POST /api/auth/google - Google OAuth authentication
router.post('/google', async (req, res) => {
  try {
    const { credential } = req.body;
    
    if (!credential) {
      return res.status(400).json({ message: 'No credential provided' });
    }

    // Verify the Google token
    const ticket = await client.verifyIdToken({
      idToken: credential,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();
    const { email, name, sub: googleId } = payload;

    if (!email || !name) {
      return res.status(400).json({ message: 'Invalid Google token - missing required fields' });
    }

    // Check if user already exists
    let user = await User.findOne({ email });
    
    if (!user) {
      // Create new user with Google authentication
      user = new User({
        name,
        email,
        password: '', // Empty password for Google auth users
        googleId, // Store Google ID for future reference
      });
      await user.save();
    }

    // Generate JWT token
    const jwtPayload = {
      id: user._id,
      name: user.name,
      email: user.email
    };

    jwt.sign(
      jwtPayload,
      process.env.JWT_SECRET,
      { expiresIn: '5h' },
      (err, token) => {
        if (err) {
          console.error('JWT signing error:', err);
          return res.status(500).json({ message: 'Token generation failed' });
        }
        
        res.status(200).json({
          token,
          user: {
            id: user._id,
            name: user.name,
            email: user.email
          }
        });
      }
    );

  } catch (error) {
    console.error('Google authentication error:', error);
    
    // Provide more specific error messages
    if (error.message && error.message.includes('Token used too late')) {
      return res.status(400).json({ message: 'Google token has expired' });
    } else if (error.message && error.message.includes('Invalid token')) {
      return res.status(400).json({ message: 'Invalid Google token' });
    }
    
    res.status(500).json({ message: 'Google authentication failed' });
  }
});

// GET /api/auth/me - Protected route
router.get('/me', authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }
    res.status(200).json({ user });
  } catch (error) {
    console.error('Get user error:', error);
    res.status(500).json({ message: "Server error occurred while fetching user data." });
  }
});

module.exports = router;