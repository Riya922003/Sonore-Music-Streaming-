const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
  // 1. Get token from request header 'x-auth-token'
  const token = req.header('x-auth-token');

  // 2. Check if no token is provided
  if (!token) {
    return res.status(401).json({ message: "No token, authorization denied." });
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
    res.status(401).json({ message: "Token is not valid." });
  }
};