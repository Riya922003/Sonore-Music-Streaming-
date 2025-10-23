const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
  // 1. Get token from request header 'x-auth-token'
  const token = req.header('x-auth-token');

  // 2. Check if no token is provided
  if (!token) {
    // Return a mindful, user-facing message instead of a technical token error.
    // This keeps the UI friendly when users try to access features that require login
    // (for example, generating AI insights).
    return res.status(401).json({ message: "Log in to see crazy insights." });
  }

  try {
    // 3. Verify token using JWT_SECRET
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // 4. Attach the user object to the request object
    req.user = decoded; 
    
    // 5. Call next() to proceed
    next();
  } catch (error) {
    // 6. Handle invalid token
    console.error("Token verification error:", error.message);
    // For invalid tokens, respond with the same friendly message so the UI can
    // present a consistent, non-technical prompt to users.
    res.status(401).json({ message: "Log in to see crazy insights." });
  }
};